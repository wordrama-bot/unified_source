'use client'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useAuth } from '@/providers/auth-provider';
import { useDispatch } from "react-redux";
import { wordramaApiV3 } from '@/redux/api/wordrama';
import { freePlayApi } from '@/redux/api/freePlay';
import { friendsApi } from '@/redux/api/friends';
import { systemApi } from '@/redux/api/system';
import { teamApi } from '@/redux/api/teams';

export default function UserMenu({ username }: {
  username: string
}) {
  const { user, logout } = useAuth();
  const dispatch = useDispatch();

  return (
    <DropdownMenuContent align="end" className="bg-bg">
      <DropdownMenuLabel>
        { username }
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <Link href={`/player/${user?.id}`}>
        <DropdownMenuItem>
          Profile
        </DropdownMenuItem>
      </Link>
      <Link href="/friends">
        <DropdownMenuItem >
          Friends
        </DropdownMenuItem>
      </Link>
      <Link href="/settings">
        <DropdownMenuItem >
          Settings
        </DropdownMenuItem>
      </Link>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          More...
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <Link href="/about">
              <DropdownMenuItem >
                About
              </DropdownMenuItem>
            </Link>
            <a href="https://forms.office.com/e/WCW3FcsDgW">
              <DropdownMenuItem >
                Contact Us
              </DropdownMenuItem>
            </a>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                Socials
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <a href="https://instagram.com/wordrama.io">
                    <DropdownMenuItem >
                      Instagram
                    </DropdownMenuItem>
                  </a>
                  <a href="https://tiktik.com/@wordrama.io">
                    <DropdownMenuItem >
                      TikTok
                    </DropdownMenuItem>
                  </a>
                  <a href="https://discord.gg/cRunwK229g">
                    <DropdownMenuItem >
                      Discord
                    </DropdownMenuItem>
                  </a>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                Policies
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <Link href="/acceptable-use">
                    <DropdownMenuItem >
                      Acceptable Use
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/cookies">
                    <DropdownMenuItem >
                      Cookies
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/privacy-policy">
                    <DropdownMenuItem >
                      Privacy
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/returns-policy">
                    <DropdownMenuItem >
                      Returns
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/shipping-policy">
                    <DropdownMenuItem >
                      Shipping
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/terms-of-use">
                    <DropdownMenuItem >
                      Terms of Service
                    </DropdownMenuItem>
                  </Link>
                  {/* <a href="https://app.termly.io/notify/ec3dcd0a-99a4-4f51-b066-8cb9313f37b6">
                    <DropdownMenuItem >
                      DSAR
                    </DropdownMenuItem>
                  </a> */}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={e => {
          e.preventDefault();
          logout();
          dispatch(wordramaApiV3.util.resetApiState());
          dispatch(freePlayApi.util.resetApiState());
          dispatch(friendsApi.util.resetApiState());
          dispatch(systemApi.util.resetApiState());
          dispatch(teamApi.util.resetApiState());
        }}
      >
        Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
