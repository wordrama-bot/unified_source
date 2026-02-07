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

    if (error) {
      toast({
        title: 'Username change failed',
        description: 'The username might be taken',
      });
      return;
    }
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

    if (error) {
      setIsUploading(false)
      toast({
        title: 'Profile image updated failed',
        description: 'Please try again later',
      });
      return;
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
  }

  function convertBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result);
      }
      fileReader.onerror = (error) => {
        reject(error);
      }
    });
  };

  async function handleFileChange(event) {
    try {
      const file = event.target.files[0];
      if (file.size > 5 * 1000 * 1000) {
        toast({
          title: 'Image too big',
          description: 'Please use a file under 5MB',
        })
        return;
      }
      const base64 = await convertBase64(file);
      setProfileImage(base64);
    } catch(err) {
      toast({
        title: 'Something went wrong',
        description: '',
      })
    }
  };

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
                        <Label htmlFor="avatar">JPG or PNG. 5MB max.</Label>
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
