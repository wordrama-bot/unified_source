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
import { useAuth } from '@/providers/auth-provider';
import { useDispatch } from "react-redux";
import { wordramaApiV3 } from '@/redux/api/wordrama';
import { freePlayApi } from '@/redux/api/freePlay';
import { friendsApi } from '@/redux/api/friends';
import { systemApi } from '@/redux/api/system';
import { teamApi } from '@/redux/api/teams';

export default function UserMenu({
  username,
  themeClassName,
  menuBackgroundColor,
}: {
  username: string;
  themeClassName?: string;
  menuBackgroundColor?: string;
}) {
  const { user, logout } = useAuth();
  const dispatch = useDispatch();
  const themedMenuClassName = themeClassName
    ? [
        themeClassName,
        "[&_[role=menuitem]]:!text-inherit",
        "[&_[role=menuitem][data-highlighted]]:!bg-transparent",
        "[&_[role=menuitem][data-highlighted]]:underline",
        "[&_[role=menuitem][data-state=open]]:!bg-transparent",
        "[&_[role=menuitem][data-state=open]]:underline",
      ].join(" ")
    : undefined;

  return (
    <DropdownMenuContent
      align="end"
      className={themedMenuClassName ?? "bg-bg"}
      style={{ backgroundColor: menuBackgroundColor }}
      useDefaultForeground={!themeClassName}
    >
      <DropdownMenuLabel>
        {username}
      </DropdownMenuLabel>

      <DropdownMenuSeparator />

      <Link href={`/player/${user?.id}`}>
        <DropdownMenuItem>
          Profile
        </DropdownMenuItem>
      </Link>

      <Link href="/friends">
        <DropdownMenuItem>
          Friends
        </DropdownMenuItem>
      </Link>

      <Link href="/settings">
        <DropdownMenuItem>
          Settings
        </DropdownMenuItem>
      </Link>

      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          More...
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent
            className={themedMenuClassName}
            style={{ backgroundColor: menuBackgroundColor }}
            useDefaultForeground={!themeClassName}
          >
            <Link href="/about">
              <DropdownMenuItem>
                About
              </DropdownMenuItem>
            </Link>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                Guides
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent
                  className={themedMenuClassName}
                  style={{ backgroundColor: menuBackgroundColor }}
                  useDefaultForeground={!themeClassName}
                >
                  <Link href="/how-to-play">
                    <DropdownMenuItem>
                      How to Play
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/wordle-strategy">
                    <DropdownMenuItem>
                      Wordle Strategy
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/best-starting-words">
                    <DropdownMenuItem>
                      Best Starting Words
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/wordle-tips">
                    <DropdownMenuItem>
                      Wordle Tips
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <a href="/contact">
		<DropdownMenuItem>
			Contact Us
  		</DropdownMenuItem>
	    </a>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                Socials
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent
                  className={themedMenuClassName}
                  style={{ backgroundColor: menuBackgroundColor }}
                  useDefaultForeground={!themeClassName}
                >
                  <a href="https://instagram.com/wordrama.io" target="_blank" rel="noopener noreferrer">
                    <DropdownMenuItem>
                      Instagram
                    </DropdownMenuItem>
                  </a>
                  <a href="https://tiktok.com/@wordrama.io" target="_blank" rel="noopener noreferrer">
                    <DropdownMenuItem>
                      TikTok
                    </DropdownMenuItem>
                  </a>
                  <a href="https://discord.gg/cRunwK229g" target="_blank" rel="noopener noreferrer">
                    <DropdownMenuItem>
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
                <DropdownMenuSubContent
                  className={themedMenuClassName}
                  style={{ backgroundColor: menuBackgroundColor }}
                  useDefaultForeground={!themeClassName}
                >
                  <Link href="/acceptable-use">
                    <DropdownMenuItem>
                      Acceptable Use
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/cookies">
                    <DropdownMenuItem>
                      Cookies
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/privacy-policy">
                    <DropdownMenuItem>
                      Privacy
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/returns-policy">
                    <DropdownMenuItem>
                      Returns
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/shipping-policy">
                    <DropdownMenuItem>
                      Shipping
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/terms-of-use">
                    <DropdownMenuItem>
                      Terms of Service
                    </DropdownMenuItem>
                  </Link>
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