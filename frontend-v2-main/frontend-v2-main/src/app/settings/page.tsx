"use client"
import { useState } from "react";
import { redirect } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SettingsNav } from "@/components/navbar/settings";
import {
  wordramaApiV3,
  useGetMyAccountQuery,
  useUpdateAccountMutation,
  useDeleteAccountMutation
} from "@/redux/api/wordrama";
import { useDispatch } from "react-redux";
import { useAuth } from '@/providers/auth-provider';
//import { getAppInsights } from "@/utils/appInsights";
import { useToast } from "@/components/ui/use-toast";

export default function AccountPage() {
  //getAppInsights().trackPageView({ name: 'My Account' });
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: account, isLoading } = useGetMyAccountQuery();
  const [updateAccount] = useUpdateAccountMutation();
  const [deleteAccount] = useDeleteAccountMutation();
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [email, setEmail] = useState(account?.data?.email);
  const [firstName, setFirstName] = useState(account?.data?.firstName);
  const [lastName, setLastName] = useState(account?.data?.lastName);

  async function handleDeleteAccount() {
    const { data: deletedAccount, error } = await deleteAccount();

    if (!error && deletedAccount?.status === 200) {
      toast({
        title: 'Sorry to see you go',
        description: 'Your account has been deleted successfully.',
      });
      return window.location.href = '/leaving-survey';
    }

    toast({
      title: 'Error',
      description: 'Please get in touch with support@wordrama.io for help, or try again later.',
    });
  }

  async function handleUpdateAccount() {
    if (firstName === account?.data?.firstName && lastName === account?.data?.lastName) return;
    const { data: updatedAccount, error } = await updateAccount({
      firstName,
      lastName,
    });


    if (!error && updatedAccount?.data) {
      toast({
        title: 'Account Updated',
        description: 'Your account has been updated successfully.',
      });
      return;
    }

    toast({
      title: 'Error',
      description: 'An error occurred while updating your account. Please try again later.',
    });
  }

  async function handleUpdateEmail() {
    if (user.app_metadata.provider === 'discord') {
      toast({
        title: 'Error',
        description: 'Your email is managed by Discord, contact support@wordrama.io for help.'
      });
      return;
    }

    if (email === account?.data?.email) {
      toast({
        title: 'Error',
        description: 'You cannot set the same email address.'
      });
      return;
    }

    const { data: updatedAccount, error } = await updateAccount({
      email
    });


    if (!error && updatedAccount?.data) {
      toast({
        title: 'Email Updated',
        description: 'Your email has been updated successfully.',
      });
      return;
    }

    toast({
      title: 'Error',
      description: 'An error occurred while updating your email. Please try again later.',
    });
  }

  function DeleteConfirmation() {
    return (
      <AlertDialog open={isDeleteConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-between">
            <AlertDialogCancel
              className="bg-white hover:bg-gray-300"
              onClick={() => setIsDeleteConfirmationOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={e => {
                e.preventDefault();
                handleDeleteAccount();
              }}>
                Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DeleteConfirmation />
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl text-text dark:text-darkText font-semibold">Account Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <SettingsNav />
          <div className="grid grid-cols-2 gap-6">
            <Card x-chunk="dashboard-04-chunk-1" className="bg-bg dark:bg-darkBg border-border dark:darkBorder col-span-2 shadow-light dark:shadow-dark rounded-base border-2">
              <CardHeader>
                <CardTitle>Email</CardTitle>
                <CardDescription>

                </CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <Input type="email" disabled={user.app_metadata.provider === 'discord'} placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                </form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button
                  disabled={user.app_metadata.provider === 'discord'}
                  onClick={(e) => {
                    e.preventDefault();
                    handleUpdateEmail();
                  }}
                >
                  Save
                </Button>
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-04-chunk-1" className="bg-bg dark:bg-darkBg border-border dark:darkBorder shadow-light dark:shadow-dark rounded-base border-2">
              <CardHeader>
                <CardTitle>Name</CardTitle>
              </CardHeader>
              <CardContent>
                <form>
                  <Input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  <Input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-2" />
                </form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button
                  disabled={
                    firstName === account?.data?.firstName &&
                    lastName === account?.data?.lastName
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    handleUpdateAccount();
                  }}
                >
                  Save
                </Button>
              </CardFooter>
            </Card>
            { user.app_metadata.provider !== 'discord' && (
              <Card x-chunk="dashboard-04-chunk-1" className="bg-bg dark:bg-darkBg border-border dark:darkBorder shadow-light dark:shadow-dark rounded-base border-2">
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <form>
                    <Input placeholder="Update Password" className="mt-2" />
                    <Input placeholder="Confirm Password" className="mt-2" />
                  </form>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button>Update</Button>
                </CardFooter>
              </Card>
            )}
            <Card x-chunk="dashboard-04-chunk-1" className="bg-bg dark:bg-darkBg border-border dark:darkBorder col-span-2 shadow-light dark:shadow-dark rounded-base border-2">
              <CardHeader>
                <CardTitle>Delete Account</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Warning: This action cannot be undone, all progress, stats, achievement, items, in-game currency will be lost.</p>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button
                  className="bg-red-500 hover:bg-red-600"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsDeleteConfirmationOpen(true);
                  }}
                >
                  Delete Account
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
