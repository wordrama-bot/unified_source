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
import { useGetMyAccountQuery, useUpdateAccountMutation } from "@/redux/api/wordrama";

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

export default function ProfilePage() {
  const { toast } = useToast();
  const hiddenFileInput = useRef(null);
  const { data: user } = useGetMyAccountQuery();
  const [updatePlayer] = useUpdateAccountMutation();
  const [profileImage, setProfileImage] = useState(user?.data?.profileImage);
  const [displayName, setDisplayName] = useState(user?.data?.displayName);
  const [isUploading, setIsUploading] = useState(false);

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
          const scale = Math.min(
            1,
            MAX_PROFILE_IMAGE_DIMENSION / image.width,
            MAX_PROFILE_IMAGE_DIMENSION / image.height,
          );

          const width = Math.max(1, Math.round(image.width * scale));
          const height = Math.max(1, Math.round(image.height * scale));

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const context = canvas.getContext('2d');

          if (!context) {
            reject(new Error('Could not create image canvas'));
            return;
          }

          context.drawImage(image, 0, 0, width, height);

          const dataUri = canvas.toDataURL('image/webp', 0.82);

          if (dataUri.length > MAX_PROFILE_IMAGE_DATA_URI_LENGTH) {
            reject(new Error('Processed image is still too large'));
            return;
          }

          resolve(dataUri);
        };

        image.onerror = () => reject(new Error('Could not decode image'));
        image.src = reader.result as string;
      };

      reader.onerror = () => reject(new Error('Could not read image'));
      reader.readAsDataURL(file);
    });
  }

  async function handleFileChange(event) {
    try {
      const file = event.target.files?.[0];

      if (!file) return;

      if (file.size > MAX_FILE_SIZE_MB * 1000 * 1000) {
        toast({
          title: 'Image too big',
          description: `Please use a file under ${MAX_FILE_SIZE_MB}MB`,
        });
        return;
      }

      const resizedImage = await resizeProfileImage(file);
      setProfileImage(resizedImage);
    } catch (err) {
      console.error('[Profile] file upload failed:', err);

      toast({
        title: 'Could not process image',
        description: 'Please choose a valid JPG or PNG file and try again.',
      });
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl text-text dark:text-darkText font-semibold">Profile Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <SettingsNav />
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-bg dark:bg-darkBg border-border dark:darkBorder shadow-light dark:shadow-dark rounded-base border-2">
              <CardHeader>
                <CardTitle>Username</CardTitle>
                <CardDescription>

                </CardDescription>
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
                  }} />
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
            <Card className="bg-bg dark:bg-darkBg border-border dark:darkBorder col-span-1 shadow-light dark:shadow-dark rounded-base border-2">
              <CardHeader>
                <CardTitle>Profile Image</CardTitle>
                <CardDescription>

                </CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  { isUploading && (
                    <div className="flex justify-center items-center space-x-2">
                      <Image
                        className='flex justify-center items-center'
                        src="/loading.svg"
                        alt="Loading..."
                        width={50}
                        height={50}
                      />
                    </div>
                  )}
                  { !isUploading && (
                    <div className="flex justify-center items-center space-x-2">
                      <Avatar
                        className="w-48 h-48"
                        onClick={ e => {
                          e.preventDefault();
                          if (isUploading) return;
                          handleFileClick(e);
                        }}
                      >
                        <AvatarImage src={profileImage} />
                        <AvatarFallback>{user?.data?.displayName}</AvatarFallback>
                      </Avatar>
                      <div className="grid w-full max-w-sm justify-center items-center gap-1.5">
                        <Input
                          id="avatar"
                          type="file"
                          accept="image/jpeg, image/png"
                          onChange={handleFileChange}
                          disabled={isUploading}
                          ref={hiddenFileInput}
                          style={profileImage ? { display: 'none' } : { display: 'block' }}
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
                { profileImage && (
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
                  disabled={profileImage === undefined || profileImage === user?.data?.profileImage || isUploading}
                  onClick={(e) => {
                    e.preventDefault();
                    handleUpdateProfileImage();
                  }}
                >
                  Save
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
