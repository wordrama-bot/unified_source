"use client"
import Header from '@/sections/header';
import NavBar from "@/components/navbar/public-nav";
import Footer from '@/sections/footer';
import { useAuth } from '@/providers/auth-provider';
import { useGetLiveCreatorsQuery } from '@/redux/api/live';

import { Instagram, Twitch, MessageCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"

// const creators = [
//   {
//     id: 1,
//     name: 'Alex Johnson',
//     username: '@alexj',
//     avatar: '/placeholder.svg?height=100&width=100',
//     isLive: true,
//     social: {
//       discord: 'https://discord.gg/alexj',
//       instagram: 'https://instagram.com/alexj',
//       tiktok: 'https://tiktok.com/@alexj',
//       twitch: 'https://twitch.tv/alexj',
//       x: 'https://x.com/alexj',
//     },
//   },
//   {
//     id: 2,
//     name: 'Sam Smith',
//     username: '@samsmith',
//     avatar: '/placeholder.svg?height=100&width=100',
//     isLive: false,
//     social: {
//       discord: 'https://discord.gg/samsmith',
//       instagram: 'https://instagram.com/samsmith',
//       tiktok: 'https://tiktok.com/@samsmith',
//       x: 'https://x.com/samsmith',
//     },
//   },
//   {
//     id: 3,
//     name: 'Emma Watson',
//     username: '@emmaw',
//     avatar: '/placeholder.svg?height=100&width=100',
//     isLive: true,
//     social: {
//       instagram: 'https://instagram.com/emmaw',
//       tiktok: 'https://tiktok.com/@emmaw',
//       twitch: 'https://twitch.tv/emmaw',
//       x: 'https://x.com/emmaw',
//     },
//   },
// ]

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
  </svg>
)

const TiktokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

const SocialIcon = ({ platform, url }: { platform: string; url: string }) => {
  const getIcon = () => {
    switch (platform) {
      case 'discord':
        return <DiscordIcon />
      case 'instagram':
        return <Instagram className="h-6 w-6" />
      case 'tiktok':
        return <TiktokIcon />
      case 'twitch':
        return <Twitch className="h-6 w-6" />
      case 'x':
        return <MessageCircle className="h-6 w-6" />
      default:
        return null
    }
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
      <span className="sr-only">{platform}</span>
      {getIcon()}
    </a>
  )
}

const CreatorCard = ({ creator }) => (
  <div className="bg-white shadow rounded-lg p-6 relative">
    <div className="flex items-center space-x-4">
      <div className="relative">
        <img
          src={creator?.ttData?.owner?.avatar_large?.url_list[0] || 'https://via.placeholder.com/150'}
          alt={creator?.ttData?.owner?.nickname}
          className="h-16 w-16 rounded-full object-cover"
        />
      </div>
      <div>
        <h2 className="text-xl text-text font-semibold">@{creator?.ttData?.owner?.nickname || creator?.ttData?.owner?.display_id || ''}</h2>
        <p className="text-text"></p>
      </div>
    </div>
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <SocialIcon key="tiktok" platform="tiktok" url={`https://tiktok.com/@${creator?.ttData?.owner?.display_id || 'wordrama.io'}`} />
      {/* {Object.entries(creator.social).map(([platform, url]) => (
        <SocialIcon key={platform} platform={platform} url={url} />
      ))}
      <Button variant="default" size="sm" className="ml-auto">
        Join My Team
      </Button>
      */}
    </div>
    {creator.isLive && (
      <a href={creator?.ttData?.shareUrl}>
        <span className="absolute top-2 right-2 px-2 py-1 bg-red-500 hover:bg-red-400 text-white text-xs font-semibold rounded-full">
          LIVE
        </span>
      </a>
    )}
  </div>
)

export default function CreatorsPage() {
  const { user } = useAuth();
  const { data: creators, error, isLoading } = useGetLiveCreatorsQuery();
  console.log(creators, error, isLoading);

  if (isLoading) return <div>Loading...</div>
  return (
    <div className="flex min-h-screen w-full flex-col border:border dark:border-darkBorder bg-bg dark:bg-darkBg text-text dark:text-darkText">
      <NavBar
        links={user ? [
          { href: "/games", text: "Games" },
          { href: "/leaderboard", text: "Leaderboard" },
          { href: "/marketplace", text: "Marketplace" },
          { href: "/achievements", text: "Achievements" },
          //{ href: "/teams", text: "Teams" },
        ] : [
            { href: "/about", text: "About" },
            { href: "/free-play", text: "Wordle" },
            { href: "/signup", text: "SignUp" },
          ]
        }
      />
      <div className="max-w-7xl mt-10 mx-auto">
        <h1 className="text-3xl font-extrabold text-text dark:text-darkText mb-8">Our Creators</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          { Object.values(creators?.data).filter(creator => {
            if (creator?.ttData?.owner?.nickname) return true;
            return false;
          }).map((creator) => (
            <CreatorCard key={creator?.ttData?.owner?.nickname} creator={creator} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
