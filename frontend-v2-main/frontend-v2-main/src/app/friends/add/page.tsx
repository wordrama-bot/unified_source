"use client"
//import { getAppInsights } from "@/utils/appInsights";
import { useState, useRef } from "react";
import { supabase } from "@/utils/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
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
import { FriendsNav } from "@/components/navbar/friends";
import { useGetPublicPlayerByUsernameQuery, useGetMyAccountQuery } from "@/redux/api/wordrama";
import { useGetMyFriendsQuery, useInviteFriendMutation } from "@/redux/api/friends";
import { useSearchParams } from "next/navigation";

export default function AddFriendPage() {
  //getAppInsights().trackPageView({ name: 'Add friend' });
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const { data: me } = useGetMyAccountQuery();
  const { data: friends, isError } = useGetMyFriendsQuery();
  const friendList = !isError && friends ? friends?.data?.map(friend => friend.players.id): [];
  const { data: player, refetch } = useGetPublicPlayerByUsernameQuery(username);
  const [inviteFriend] = useInviteFriendMutation();

  async function sendFriendRequest() {
    if (me && me?.data?.id && me?.data?.displayName &&username.toLowerCase() === me?.data?.displayName.toLowerCase()) {
      return toast({
        title: 'Whoops',
        description: 'You cannot add yourself as a friend',
      });
    }

    refetch();
    if (!player || !player?.data || !player?.data?.id) {
      return toast({
        title: 'Whoops',
        description: 'User not found',
      });
    }

    if (friendList.includes(player?.data?.id)) {
      toast({
        title: 'Whoops',
        description: 'This player is already your friend',
      });
      setUsername('');
      return;
    }

    const resp = await inviteFriend(player?.data?.id);
    if (resp?.data) {
      toast({
        title: 'Success',
        description: 'Friend request sent',
      });
      setUsername('');
    } else {
      toast({
        title: 'Whoops',
        description: 'Something went wrong',
      });
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl text-text dark:text-darkText font-semibold">Add Friend</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <FriendsNav />
          <Card className="bg-bg dark:bg-darkBg border-border dark:darkBorder shadow-light dark:shadow-dark rounded-base border-2">
            <CardHeader>
              <CardTitle>Invite your friends</CardTitle>
              <CardDescription>
                Enter the username of the person you want to add as a friend.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <Input placeholder="Username" value={username} onChange={(e) => {
                  setUsername(e.target.value);
                }} />
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button
                disabled={username.length < 3}
                onClick={e => {
                  e.preventDefault();
                  sendFriendRequest();
                }}
              >
                Send
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
