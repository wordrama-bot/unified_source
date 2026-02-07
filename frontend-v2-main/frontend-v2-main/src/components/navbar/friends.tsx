import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useGetMyFriendRequestsQuery, useGetMyFriendsQuery } from "@/redux/api/friends";

export function FriendsNav() {
  const { isLoading, data: friendRequests, isError: frrIsError } = useGetMyFriendRequestsQuery('received');
  const { isLoading: sentFriendRequestsLoading, data: sentFriendRequests, isError: frsIsError } = useGetMyFriendRequestsQuery('sent');
  const { isLoading: friendsIsLoading, data: friends, isError } = useGetMyFriendsQuery();
  const { role } = useAuth();
  const path = usePathname();

  if (isLoading || friendsIsLoading) return <div>Loading...</div>;
  return (
    <nav
      className="grid gap-4 text-sm text-text dark:text-darkText text-muted-foreground" x-chunk="dashboard-04-chunk-0"
    >
      <Link
        href="/friends"
        className={path === '/friends' ? 'text-primary font-semibold' : ''}
      >
        Friends { !isError && friends?.count && friends.count > 0 && `(${friends.count})` }
      </Link>
      <Link
        href="/friends/add"
        className={path === '/friends/add' ? 'text-primary font-semibold' : ''}
      >
        Add Friend
      </Link>
      <Link
        href="/friends/requests"
        className={path === '/friends/requests' ? 'text-primary font-semibold' : ''}
      >
        Friend Requests { !frrIsError && friendRequests?.count && friendRequests.count > 0 && `(${friendRequests.count})` }
      </Link>
      <Link
        href="/friends/sent-requests"
        className={path === '/friends/sent-requests' ? 'text-primary font-semibold' : ''}
      >
        Sent Requests { !frsIsError && sentFriendRequests?.count && sentFriendRequests.count > 0 && `(${sentFriendRequests.count})` }
      </Link>
    </nav>
  );
}
