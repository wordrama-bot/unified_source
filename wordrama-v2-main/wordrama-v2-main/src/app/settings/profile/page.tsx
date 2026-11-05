"use client"
import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar, AvatarFallback, AvatarImage
} from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SettingsNav } from "@/components/navbar/settings";
import {
  useGetMyAccountQuery,
  useGetMyEntitlementsQuery,
  useGetMyAvatarQuery,
  useUpdateMyAvatarMutation,
  useUpdateAccountMutation,
} from "@/redux/api/wordrama";
import PlayerAvatar from '@/components/avatar/PlayerAvatar';
import { AVATAR_STYLES } from '@/config/avatarStyles';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MAX_FILE_SIZE_MB } from '@/lib/config';

function getProfileErrorMessage(error: any, fallback: string) {
  const backendMessage =
    error?.data?.message ||
    error?.data?.error ||
    error?.message ||
    '';

  if (typeof backendMessage === 'string' && backendMessage.trim().length > 0) {
    return backendMessage.replace(/Bad Request - /g, '');
  }

  if (error?.status === 400) return 'Please check your profile details and try again.';
  if (error?.status === 401 || error?.status === 403) return 'Your login session expired. Please sign in again.';
  if (error?.status === 409) return 'That username is already taken. Please try another one.';
  if (error?.status >= 500) return 'We had trouble updating your profile. Please try again in a few minutes.';

  return fallback;
}

type ProfileImageErrorCode =
  | 'read'
  | 'decode'
  | 'process'
  | 'size';

class ProfileImageError extends Error {
  constructor(
    readonly code: ProfileImageErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'ProfileImageError';
  }
}

const PROFILE_IMAGE_ERRORS = {
  read: {
    title: 'Could not open this photo',
    description: 'Save the photo to your device, then select it again. On iPhone, you can also save it to Files and choose it from there.',
  },
  decode: {
    title: 'Could not read this image',
    description: 'Your browser could not open this photo. Try exporting it as a JPG or PNG, or choose another photo.',
  },
  process: {
    title: 'Could not prepare this photo',
    description: 'Your browser could not resize this photo. Try again, or save a smaller JPG or PNG and select it.',
  },
  size: {
    title: 'Photo needs more compression',
    description: 'This photo is still too large after resizing. Try saving it as a JPG or choosing a simpler image.',
  },
};

export default function ProfilePage() {
  const { toast } = useToast();
  const hiddenFileInput = useRef(null);
  const { data: user } = useGetMyAccountQuery();
  const [updatePlayer] = useUpdateAccountMutation();
  const [profileImage, setProfileImage] = useState(user?.data?.profileImage);
  const [displayName, setDisplayName] = useState(user?.data?.displayName);
  const [isUploading, setIsUploading] = useState(false);
  const { data: entitlementResponse } = useGetMyEntitlementsQuery();
  const { data: avatarResponse } = useGetMyAvatarQuery();
  const [updateMyAvatar, { isLoading: isUpdatingAvatar }] =
    useUpdateMyAvatarMutation();

  const equippedAvatarStyleKey =
    avatarResponse?.data?.equipped_avatar_style_key ?? null;

  const equippedAvatarFrameKey =
    avatarResponse?.data?.equipped_avatar_frame_key ?? null;

  const entitlements = entitlementResponse?.data ?? [];

  const ownedEntitlementKeys = new Set(
    entitlements.map((entitlement: any) => entitlement.entitlement_key),
  );

  const ownedAvatarStyles = Object.values(AVATAR_STYLES).filter(
    (style) =>
      style.placement === 'accessory' &&
      ownedEntitlementKeys.has(style.key),
  );

  const ownedAvatarFrames = Object.values(AVATAR_STYLES).filter(
    (style) =>
      style.placement === 'overlay' &&
      ownedEntitlementKeys.has(style.key),
  );

  async function handleUpdateUsername() {
    const usernamePattern = /^[a-zA-Z0-9._\-\s]+$/;
    if (!usernamePattern.test(displayName)) {
      toast({
        title: 'Invalid username',
        description: 'Username can contain letters, numbers, spaces, hyphens (-), underscores (_), and periods (.)',
      });
      return;
    }
    const { data, error } = await updatePlayer({
      username: displayName,
    });

    if (data) {
      toast({
        title: 'Username changed',
        description: 'Your username has been updated',
      });
      return;
    }

    console.error('[Profile] updateUsername failed:', error);

    toast({
      title: 'Username change failed',
      description: getProfileErrorMessage(
        error,
        'The username might be taken. Please try another one.',
      ),
    });
  }

  async function handleUpdateProfileImage() {
    setIsUploading(true)
    const { data, error } = await updatePlayer({
      profileImage,
    });

    if (data) {
      setIsUploading(false)
      toast({
        title: 'Profile image updated',
        description: 'Your profile image has been updated',
      });
      return;
    }

    setIsUploading(false);

    console.error('[Profile] updateProfileImage failed:', error);

    toast({
      title: 'Profile image update failed',
      description: getProfileErrorMessage(
        error,
        'We could not update your profile image. Please try again later.',
      ),
    });
    return;
  }

  async function handleAvatarStyleChange(value: string) {
    const avatarStyleKey = value === 'none' ? null : value;

    try {
      await updateMyAvatar({
        avatarStyleKey,
      }).unwrap();

      toast({
        title: 'Avatar style updated',
        description: avatarStyleKey
          ? 'Your avatar style has been equipped.'
          : 'Your avatar style has been removed.',
      });
    } catch (error) {
      console.error('[Profile] updateAvatarStyle failed:', error);

      toast({
        title: 'Avatar style update failed',
        description: 'We could not update your avatar style.',
      });
    }
  }

  async function handleAvatarFrameChange(value: string) {
    const avatarFrameKey = value === 'none' ? null : value;

    try {
      await updateMyAvatar({
        avatarFrameKey,
      }).unwrap();

      toast({
        title: 'Avatar frame updated',
        description: avatarFrameKey
          ? 'Your avatar frame has been equipped.'
          : 'Your avatar frame has been removed.',
      });
    } catch (error) {
      console.error('[Profile] updateAvatarFrame failed:', error);

      toast({
        title: 'Avatar frame update failed',
        description: 'We could not update your avatar frame.',
      });
    }
  }

  function handleFileClick(event) {
    event.preventDefault();
    hiddenFileInput.current.click();
  };

  async function handleDelete() {
    const { data, error } = await updatePlayer({ profileImage: '' });
    if (error) {
      toast({
        title: 'Profile image delete failed',
        description: 'Something went wrong',
      });
      return;
    }

    if (data) {
      setProfileImage('');

      toast({
        title: 'Profile image deleted',
        description: 'Your profile image has been deleted',
      });

      return;
    }
    
    console.error('[Profile] deleteProfileImage failed:', error);

    toast({
      title: 'Profile image delete failed',
      description: getProfileErrorMessage(
        error,
        'We could not delete your profile image. Please try again later.',
      ),
    });
  }

  const MAX_PROFILE_IMAGE_DIMENSION = 512;
  const MAX_PROFILE_IMAGE_DATA_URI_LENGTH = 450_000;

  function resizeProfileImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const image = new window.Image();

        image.onload = () => {
          try {
            if (!image.naturalWidth || !image.naturalHeight) {
              reject(new ProfileImageError('decode', 'Invalid image dimensions'));
              return;
            }
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            if (!context) {
              reject(new ProfileImageError('process', 'Could not create image canvas'));
              return;
            }

            let encodedAnImage = false;

            const encodeWithinLimit = (type: string, quality: number) => {
              try {
                const dataUri = canvas.toDataURL(type, quality);
                // Some browsers return PNG when the requested encoder is unavailable.
                if (!/^data:image\/(webp|png|jpeg);base64,/.test(dataUri)) return null;
                encodedAnImage = true;
                return dataUri.length <= MAX_PROFILE_IMAGE_DATA_URI_LENGTH
                  ? dataUri
                  : null;
              } catch {
                // Another format or a smaller canvas may still succeed.
                return null;
              }
            };

            for (const maxDimension of [MAX_PROFILE_IMAGE_DIMENSION, 384, 256, 192, 128]) {
              const scale = Math.min(
                1,
                maxDimension / image.naturalWidth,
                maxDimension / image.naturalHeight,
              );
              const width = Math.max(1, Math.round(image.naturalWidth * scale));
              const height = Math.max(1, Math.round(image.naturalHeight * scale));
              canvas.width = width;
              canvas.height = height;
              context.drawImage(image, 0, 0, width, height);

              // Prefer the existing WebP format, including transparency when supported.
              const webp = encodeWithinLimit('image/webp', 0.82);
              if (webp) {
                resolve(webp);
                return;
              }

              // JPEG provides a compact fallback on browsers without WebP encoding.
              // Flatten transparency onto white to avoid a black background.
              context.fillStyle = '#ffffff';
              context.fillRect(0, 0, width, height);
              context.drawImage(image, 0, 0, width, height);
              for (const quality of [0.82, 0.65, 0.45]) {
                const jpeg = encodeWithinLimit('image/jpeg', quality);
                if (jpeg) {
                  resolve(jpeg);
                  return;
                }
              }
            }

            reject(new ProfileImageError(
              encodedAnImage ? 'size' : 'process',
              encodedAnImage
                ? 'Processed image is still too large'
                : 'Could not encode image',
            ));
          } catch {
            reject(new ProfileImageError('process', 'Image processing failed'));
          }
        };

        image.onerror = () =>
          reject(new ProfileImageError('decode', 'Could not decode image'));
        image.src = reader.result as string;
      };

      reader.onerror = () =>
        reject(new ProfileImageError('read', 'Could not read image'));
      reader.onabort = () =>
        reject(new ProfileImageError('read', 'Image reading was interrupted'));
      reader.readAsDataURL(file);
    });
  }

  async function handleFileChange(event) {
    const input = event.target;
    const file = input.files?.[0];

    if (!file) return;

    try {
      if (file.size > MAX_FILE_SIZE_MB * 1000 * 1000) {
        toast({
          title: 'Image too big',
          description: `This file is over ${MAX_FILE_SIZE_MB}MB. Choose a smaller photo or export a smaller copy before uploading.`,
        });
        return;
      }

      const resizedImage = await resizeProfileImage(file);
      setProfileImage(resizedImage);
    } catch (err) {
      const code = err instanceof ProfileImageError ? err.code : 'process';

      // Log only the processing stage and file properties, never image contents.
      console.error('[Profile] image processing failed:', {
        stage: code,
        type: file.type,
        size: file.size,
      });

      toast(PROFILE_IMAGE_ERRORS[code]);
    } finally {
      // Allow another attempt with the same photo after a processing failure.
      input.value = '';
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold text-text dark:text-darkText">
            Profile Settings
          </h1>
        </div>

        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <SettingsNav />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="rounded-base border-2 border-border bg-bg shadow-light dark:darkBorder dark:bg-darkBg dark:shadow-dark">
              <CardHeader>
                <CardTitle>Username</CardTitle>
                <CardDescription />
              </CardHeader>

              <CardContent>
                <form>
                  <Input
                    placeholder="Username"
                    value={displayName}
                    pattern="^[a-zA-Z0-9._\-\s]+$"
                    title="Username can contain letters, numbers, spaces, hyphens (-), underscores (_), and periods (.)"
                    min={1}
                    max={25}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                    }}
                  />
                </form>
              </CardContent>

              <CardFooter className="border-t px-6 py-4">
                <Button
                  onClick={handleUpdateUsername}
                  disabled={displayName === user?.data?.displayName}
                >
                  Save
                </Button>
              </CardFooter>
            </Card>

            <Card className="col-span-1 rounded-base border-2 border-border bg-bg shadow-light dark:darkBorder dark:bg-darkBg dark:shadow-dark">
              <CardHeader>
                <CardTitle>Profile Image</CardTitle>
                <CardDescription />
              </CardHeader>

              <CardContent>
                <form>
                  {isUploading && (
                    <div className="flex items-center justify-center space-x-2">
                      <Image
                        className="flex items-center justify-center"
                        src="/loading.svg"
                        alt="Loading..."
                        width={50}
                        height={50}
                      />
                    </div>
                  )}

                  {!isUploading && (
                    <div className="flex items-center justify-center space-x-2">
                      <Avatar
                        className="h-48 w-48"
                        onClick={(e) => {
                          e.preventDefault();

                          if (isUploading) return;

                          handleFileClick(e);
                        }}
                      >
                        <AvatarImage src={profileImage} />
                        <AvatarFallback>
                          {user?.data?.displayName}
                        </AvatarFallback>
                      </Avatar>

                      <div className="grid w-full max-w-sm items-center justify-center gap-1.5">
                        <Input
                          id="avatar"
                          type="file"
                          accept="image/jpeg, image/png"
                          onChange={handleFileChange}
                          disabled={isUploading}
                          ref={hiddenFileInput}
                          style={
                            profileImage
                              ? { display: 'none' }
                              : { display: 'block' }
                          }
                        />

                        <Label htmlFor="avatar">
                          JPG or PNG. {MAX_FILE_SIZE_MB}MB max.
                        </Label>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>

              <CardFooter className="border-t px-6 py-4">
                {profileImage && (
                  <Button
                    disabled={isUploading && profileImage !== undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete();
                    }}
                  >
                    Remove
                  </Button>
                )}

                <Button
                  className="ml-4"
                  disabled={
                    profileImage === undefined ||
                    profileImage === user?.data?.profileImage ||
                    isUploading
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    handleUpdateProfileImage();
                  }}
                >
                  Save
                </Button>
              </CardFooter>
            </Card>

            <Card className="rounded-base border-2 border-border bg-bg shadow-light md:col-span-2 dark:darkBorder dark:bg-darkBg dark:shadow-dark">
              <CardHeader>
                <CardTitle>Avatar Customization</CardTitle>
                <CardDescription>
                  Equip your unlocked crown and avatar frame.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid gap-8 md:grid-cols-[220px_1fr]">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <PlayerAvatar
                      profileImage={
                        profileImage || user?.data?.profileImage
                      }
                      displayName={
                        displayName ||
                        user?.data?.displayName ||
                        'Player'
                      }
                      avatarStyleKey={equippedAvatarStyleKey}
                      avatarFrameKey={equippedAvatarFrameKey}
                      size={160}
                    />

                    <p className="text-sm text-muted-foreground">
                      Avatar Preview
                    </p>
                  </div>

                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label>Crown / Style</Label>

                      <Select
                        value={equippedAvatarStyleKey ?? 'none'}
                        onValueChange={handleAvatarStyleChange}
                        disabled={isUpdatingAvatar}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an avatar style" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>

                          {ownedAvatarStyles.map((style) => (
                            <SelectItem
                              key={style.key}
                              value={style.key}
                            >
                              {style.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label>Avatar Frame</Label>

                      <Select
                        value={equippedAvatarFrameKey ?? 'none'}
                        onValueChange={handleAvatarFrameChange}
                        disabled={isUpdatingAvatar}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an avatar frame" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>

                          {ownedAvatarFrames.map((frame) => (
                            <SelectItem
                              key={frame.key}
                              value={frame.key}
                            >
                              {frame.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
