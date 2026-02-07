"use client"
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/sections/header';
import Footer from '@/sections/footer';
import Loading from '@/sections/loading';
import { Button } from '@/components/ui/button';
import {
  useGetPublicPlayerQuery,
  useGetAllTimeWordleLeaderboardPostitionByUserIdQuery,
  useGetDailyWordleLeaderboardPostitionByUserIdQuery,
  useGetWeeklyWordleLeaderboardPostitionByUserIdQuery,
  useGetMonthlyWordleLeaderboardPostitionByUserIdQuery,
  useGetYearlyWordleLeaderboardPostitionByUserIdQuery,
  useGetWordleStreakByUserIdQuery,
} from '@/redux/api/wordrama';
import {
  useGetMyFriendsQuery,
  useGetSentFriendRequestsQuery,
  useInviteFriendMutation
} from '@/redux/api/friends';
import { useAuth } from '@/providers/auth-provider';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { HoverHome } from '@/components/hover-home';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useToast } from '@/components/ui/use-toast';
import { Badge } from "@/components/ui/badge"
//import { getAppInsights } from '@/utils/appInsights';

function CrownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
      <path d="M5 21h14" />
    </svg>
  )
}

// function getRarityBorder(rarity: string) {
//   switch (rarity) {
//     case 'COMMON':
//       return 'border-8 border-gray-500 dark:border-gray-500';
//     case 'UNCOMMON':
//       return 'border-8 border-green-300 dark:border-green-400';
//     case 'RARE':
//       return 'border-8 border-blue-300 dark:border-blue-400';
//     case 'EPIC':
//       return 'border-8 border-purple-300 dark:border-purple-400';
//     case 'LEGENDARY':
//       return 'border-4 border-yellow-300 dark:border-yellow-400';
//     default:
//       return '';
//   }
// }

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function ProfilePage() {
  //getAppInsights().trackPageView({ name: 'Player Profile' });
  const { user } = useAuth();
  const { playerId } = useParams();
  const [timeFrame, setTimeframe] = useState('alltime');
  const [wordLength, setWordLength] = useState('ALL');
  const { data, error, isLoading } = useGetPublicPlayerQuery(playerId);
  const { data: streakData, isError: streakIsError } = useGetWordleStreakByUserIdQuery({ wordPack: wordLength, gameMode: 'INFINITE', playerId });
  const { data: allTime } = useGetAllTimeWordleLeaderboardPostitionByUserIdQuery(playerId);
  const { data: daily } = useGetDailyWordleLeaderboardPostitionByUserIdQuery(playerId);
  const { data: weekly } = useGetWeeklyWordleLeaderboardPostitionByUserIdQuery(playerId);
  const { data: monthly } = useGetMonthlyWordleLeaderboardPostitionByUserIdQuery(playerId);
  const { data: yearly } = useGetYearlyWordleLeaderboardPostitionByUserIdQuery(playerId);
  const { toast } = useToast();
  const { data: friends, isError } = useGetMyFriendsQuery();
  const { data: sentRequests, isError: sentRequestsIsError } = useGetSentFriendRequestsQuery();
  const friendList = !isError && friends ? friends?.data?.map(friend => friend.players.id): [];
  const [inviteFriend] = useInviteFriendMutation();

  async function sendFriendRequest() {
    const resp = await inviteFriend(playerId);
    if (resp?.data) {
      toast({
        title: 'Success',
        description: 'Friend request sent',
      });
    } else {
      toast({
        title: 'Whoops',
        description: resp?.error?.data?.message.replace(/Bad Request - /g,'') || 'Something went wrong',
      });
    }
  }

  const chartConfig = {
    'wins': {
      label: "Wins",
    },
    '1': {
      label: "Won in 1",
      color: "#2563EB",
    },
    '2': {
      label: "Won in 2",
      color: "#3B86F7",
    },
    '3': {
      label: "Won in 3",
      color: "#61A8FA",
    },
    '4': {
      label: "Won in 4",
      color: "#90C7FE",
    },
    '5': {
      label: "Won in 5",
      color: "#BDDCFE",
    },
    '6': {
      label: "Won in 6",
      color: "#90C7FE",
    },
  }
  let chartData = [];
  let gamesPlayed = 0;
  let gamesWon = 0;
  let tfData = {};
  if (timeFrame === 'alltime') {
    tfData = allTime?.data;
  } else if (timeFrame === 'daily') {
    tfData = daily?.data;
  } else if (timeFrame === 'weekly') {
    tfData = weekly?.data;
  } else if (timeFrame === 'monthly') {
    tfData = monthly?.data;
  } else if (timeFrame === 'yearly') {
    tfData = yearly?.data;
  }

  if (tfData) {
    switch (wordLength) {
      case 'ALL':
        gamesWon = tfData.gamesWon || 0;
        gamesPlayed = tfData.gamesPlayed || 0;
        chartData = [{
          wonIn: '1',
          wins: tfData.gamesWonIn_1 || 0,
          fill: chartConfig['1'].color
        }, {
          wonIn: '2',
          wins: tfData.gamesWonIn_2 || 0,
          fill: chartConfig['2'].color
        }, {
          wonIn: '3',
          wins: tfData.gamesWonIn_3 || 0,
          fill: chartConfig['3'].color
        }, {
          wonIn: '4',
          wins: tfData.gamesWonIn_4 || 0,
          fill: chartConfig['4'].color
        }, {
          wonIn: '5',
          wins: tfData.gamesWonIn_5 || 0,
          fill: chartConfig['5'].color
        }, {
          wonIn: '6',
          wins: tfData.gamesWonIn_6 || 0,
          fill: chartConfig['6'].color
        }]
        break;
      case 'FIVE_LETTER':
        gamesWon = tfData.fiveLetterGamesWon || 0;
        gamesPlayed = tfData.fiveLetterGamesWon + tfData.fiveLetterGamesLost || 0;
        chartData = [{
          wonIn: '1',
          wins: tfData.fiveLetterGamesWonIn_1 || 0,
          fill: chartConfig['1'].color
        },{
          wonIn: '2',
          wins: tfData.fiveLetterGamesWonIn_2 || 0,
          fill: chartConfig['2'].color
        },{
          wonIn: '3',
          wins: tfData.fiveLetterGamesWonIn_3 || 0,
          fill: chartConfig['3'].color
        },{
          wonIn: '4',
          wins: tfData.fiveLetterGamesWonIn_4 || 0,
          fill: chartConfig['4'].color
        },{
          wonIn: '5',
          wins: tfData.fiveLetterGamesWonIn_5 || 0,
          fill: chartConfig['5'].color
        },{
          wonIn: '6',
          wins: tfData.fiveLetterGamesWonIn_6 || 0,
          fill: chartConfig['6'].color
        }]
        break;
      case 'SIX_LETTER':
        gamesWon = tfData.sixLetterGamesWon || 0;
        gamesPlayed = tfData.sixLetterGamesWon + tfData.sixLetterGamesLost;
        chartData = [{
          wonIn: '1',
          wins: tfData.sixLetterGamesWonIn_1 || 0,
          fill: chartConfig['1'].color
        },{
          wonIn: '2',
          wins: tfData.sixLetterGamesWonIn_2 || 0,
          fill: chartConfig['2'].color
        },{
          wonIn: '3',
          wins: tfData.sixLetterGamesWonIn_3 || 0,
          fill: chartConfig['3'].color
        },{
          wonIn: '4',
          wins: tfData.sixLetterGamesWonIn_4 || 0,
          fill: chartConfig['4'].color
        },{
          wonIn: '5',
          wins: tfData.sixLetterGamesWonIn_5 || 0,
          fill: chartConfig['5'].color
        },{
          wonIn: '6',
          wins: tfData.sixLetterGamesWonIn_6 || 0,
          fill: chartConfig['6'].color
        }]
        break;
      case 'SEVEN_LETTER':
        gamesWon = tfData.sevenLetterGamesWon || 0;
        gamesPlayed = tfData.sevenLetterGamesWon + tfData.sevenLetterGamesLost;
        chartData = [{
          wonIn: '1',
          wins: tfData.sevenLetterGamesWonIn_1 || 0,
          fill: chartConfig['1'].color
        },{
          wonIn: '2',
          wins: tfData.sevenLetterGamesWonIn_2 || 0,
          fill: chartConfig['2'].color
        },{
          wonIn: '3',
          wins: tfData.sevenLetterGamesWonIn_3 || 0,
          fill: chartConfig['3'].color
        },{
          wonIn: '4',
          wins: tfData.sevenLetterGamesWonIn_4 || 0,
          fill: chartConfig['4'].color
        },{
          wonIn: '5',
          wins: tfData.sevenLetterGamesWonIn_5 || 0,
          fill: chartConfig['5'].color
        },{
          wonIn: '6',
          wins: tfData.sevenLetterGamesWonIn_6 || 0,
          fill: chartConfig['6'].color
        }]
        break;
      case 'EIGHT_LETTER':
        gamesWon = tfData.eightLetterGamesWon || 0;
        gamesPlayed = tfData.eightLetterGamesWon + tfData.eightLetterGamesLost;
        chartData = [{
          wonIn: '1',
          wins: tfData.eightLetterGamesWonIn_1 || 0,
          fill: chartConfig['1'].color
        },{
          wonIn: '2',
          wins: tfData.eightLetterGamesWonIn_2 || 0,
          fill: chartConfig['2'].color
        },{
          wonIn: '3',
          wins: tfData.eightLetterGamesWonIn_3 || 0,
          fill: chartConfig['3'].color
        },{
          wonIn: '4',
          wins: tfData.eightLetterGamesWonIn_4 || 0,
          fill: chartConfig['4'].color
        },{
          wonIn: '5',
          wins: tfData.eightLetterGamesWonIn_5 || 0,
          fill: chartConfig['5'].color
        },{
          wonIn: '6',
          wins: tfData.eightLetterGamesWonIn_6 || 0,
          fill: chartConfig['6'].color
        }]
        break;
      case 'NINE_LETTER':
        gamesWon = tfData.nineLetterGamesWon || 0;
        gamesPlayed = tfData.nineLetterGamesPlayed + tfData.nineLetterGamesLost;
        chartData = [{
          wonIn: '1',
          wins: tfData.nineLetterGamesWonIn_1 || 0,
          fill: chartConfig['1'].color
        },{
          wonIn: '2',
          wins: tfData.nineLetterGamesWonIn_2 || 0,
          fill: chartConfig['2'].color
        },{
          wonIn: '3',
          wins: tfData.nineLetterGamesWonIn_3 || 0,
          fill: chartConfig['3'].color
        },{
          wonIn: '4',
          wins: tfData.nineLetterGamesWonIn_4 || 0,
          fill: chartConfig['4'].color
        },{
          wonIn: '5',
          wins: tfData.nineLetterGamesWonIn_5 || 0,
          fill: chartConfig['5'].color
        },{
          wonIn: '6',
          wins: tfData.nineLetterGamesWonIn_6 || 0,
          fill: chartConfig['6'].color
        }]
        break;
      case 'TEN_LETTER':
        gamesWon = tfData.tenLetterGamesWon || 0;
        gamesPlayed = tfData.tenLetterGamesPlayed + tfData.tenLetterGamesLost;
        chartData = [{
          wonIn: '1',
          wins: tfData.tenLetterGamesWonIn_1 || 0,
          fill: chartConfig['1'].color
        },{
          wonIn: '2',
          wins: tfData.tenLetterGamesWonIn_2 || 0,
          fill: chartConfig['2'].color
        },{
          wonIn: '3',
          wins: tfData.tenLetterGamesWonIn_3 || 0,
          fill: chartConfig['3'].color
        },{
          wonIn: '4',
          wins: tfData.tenLetterGamesWonIn_4 || 0,
          fill: chartConfig['4'].color
        },{
          wonIn: '5',
          wins: tfData.tenLetterGamesWonIn_5 || 0,
          fill: chartConfig['5'].color
        },{
          wonIn: '6',
          wins: tfData.tenLetterGamesWonIn_6 || 0,
          fill: chartConfig['6'].color
        }]
        break;
      case 'ELEVEN_LETTER':
        gamesWon = tfData.elevenLetterGamesWon || 0;
        gamesPlayed = tfData.elevenLetterGamesPlayed + tfData.elevenLetterGamesLost;
        chartData = [{
          wonIn: '1',
          wins: tfData.elevenLetterGamesWonIn_1 || 0,
          fill: chartConfig['1'].color
        },{
          wonIn: '2',
          wins: tfData.elevenLetterGamesWonIn_2 || 0,
          fill: chartConfig['2'].color
        },{
          wonIn: '3',
          wins: tfData.elevenLetterGamesWonIn_3 || 0,
          fill: chartConfig['3'].color
        },{
          wonIn: '4',
          wins: tfData.elevenLetterGamesWonIn_4 || 0,
          fill: chartConfig['4'].color
        },{
          wonIn: '5',
          wins: tfData.elevenLetterGamesWonIn_5 || 0,
          fill: chartConfig['5'].color
        },{
          wonIn: '6',
          wins: tfData.elevenLetterGamesWonIn_6 || 0,
          fill: chartConfig['6'].color
        }]
        break;
      default:
        gamesWon = 0;
        gamesPlayed = 0;
        chartData = [{
          wonIn: '1',
          wins: 0,
          fill: chartConfig['1'].color
        },{
          wonIn: '2',
          wins: 0,
          fill: chartConfig['2'].color
        },{
          wonIn: '3',
          wins: 0,
          fill: chartConfig['3'].color
        },{
          wonIn: '4',
          wins: 0,
          fill: chartConfig['4'].color
        },{
          wonIn: '5',
          wins:  0,
          fill: chartConfig['5'].color
        },{
          wonIn: '6',
          wins: 0,
          fill: chartConfig['6'].color
        }]
        break;
    }
  }


  //@ts-ignore
  //const [ equiptData ] = data?.data?.equiptItems.filter(({ items }) => items.type === 'AVATAR') || [{}];
  //const avatar = getItem(equiptData?.items?.id)
  //const avatarBorder = getRarityBorder(equiptData?.items?.rarity);
  if (isLoading) return (
    <>
      <Loading />
      <Footer />
    </>
  );
  return (
    <div className="flex min-h-screen w-full flex-col border:border dark:border-darkBorder bg-bg dark:bg-darkBg text-text dark:text-darkText">
      <header
        className="dark:bg-darkBg inset-0 flex min-h-[75dvh] w-full flex-col items-center justify-center bg-bg bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]"
        onContextMenu={(e) => e.preventDefault()}
      >
        {
          //${avatarBorder}
        }
        <Avatar
          className={`relative overflow-visible w-64 h-64`}
        >
          { allTime?.data?.alltimeRank === 1 && (
            <div className="absolute top-[-145px] md:top-[-125px] left-1/2 -translate-x-1/2 flex h-64 w-64 items-center justify-center z-10">
              <CrownIcon className="h-24 w-24 fill-yellow-500" />
            </div>
          )}
          {
            //avatar ||
          }
          <AvatarImage
            className='overflow-hidden rounded-full'
            src={data?.data?.profileImage}
            alt={data?.data?.displayName}
            width={250}
            height={250}
          />
          <AvatarFallback>{data?.data?.displayName}</AvatarFallback>
        </Avatar>
        <div className="mx-auto w-container max-w-full px-5 text-center">
          <p className="mb-1 mt-8 text-lg font-normal leading-relaxed md:text-4xl lg:text-5xl lg:leading-relaxed">
            { data?.data?.displayName }
          </p>
          { data?.data?.levels?.prestige > 0 && (
            <Link href={`/achievements/${playerId}`}>
              <Badge className='mb-12 mr-3'>
                Prestige { data?.data?.levels?.prestige }
              </Badge>
            </Link>
          )}
          <Link href={`/achievements/${playerId}`}>
            <Badge className='mb-12'>
              Level { data?.data?.levels?.level % 100 }
            </Badge>
          </Link>
          { friendList && friendList.includes(playerId) && user?.id !== playerId && (
            <Link href='/friends'>
              <Badge className='ml-5'>Friend</Badge>
            </Link>
          )}
          { sentRequests && sentRequests?.data.find(req => req.players.id === playerId) && (
            <Link href='/friends/sent-requests'>
              <Badge className='ml-5'>Friend request pending</Badge>
            </Link>
          )}
          { data?.data?.teamMember?.teams?.id && (
            <Link href={`/teams/${data?.data?.teamMember?.teams?.id}`}>
              <Badge className='ml-5'>Team: {data?.data?.teamMember?.teams?.name}</Badge>
            </Link>
          )}
          <Link href={`/achievements/${playerId}`}>
            <div className='flex items-center justify-center'>
              <Badge className="mr-5">
                {data?.data?.levels?.xp}xp
              </Badge>
              <Progress
                value={
                  data?.data?.levels?.xpToNextLevel - data?.data?.levels?.xp < 0 ? 100 :
                    Math.floor((data?.data?.levels?.xp / data?.data?.levels?.xpToNextLevel) * 100)
                  }
                className="md:w-1/2 lg:w-1/3 h-4 bg-gray-200 rounded-full"
              />
              <Badge className='ml-5'>
              { data?.data?.levels?.xpToNextLevel - data?.data?.levels?.xp < 0 ? 0 : data?.data?.levels?.xpToNextLevel - data?.data?.levels?.xp }xp to go
              </Badge>
            </div>
          </Link>
        </div>
        {
           friendList &&
           !friendList.includes(playerId) && user?.id !== playerId &&
           !sentRequests?.data.find(req => req.players.id === playerId) &&  (
            <div className="flex items-center justify-center mt-10">
              <Button
                onClick={() => sendFriendRequest()}
              >
                Send a friend request
              </Button>
            </div>
          )
        }
      </header>
      <div
        className="dark:bg-darkBg inset-0 pb-12 flex min-h-[60dvh] w-full flex-col items-center justify-center bg-bg bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]"
      >
        <Tabs defaultValue="alltime" value={timeFrame} onValueChange={value => setTimeframe(value)}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="alltime">All Time</TabsTrigger>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
          <TabsContent value="alltime">
            <div id="fullWidthTabContent" className='p-4 border-gray-200 dark:border-gray-600'>
              <div className="p-4 bg-bg rounded-lg md:p-8 dark:bg-gray-800" id="stats" role="tabpanel" aria-labelledby="stats-tab">
                <dl className={`grid ${wordLength === 'ALL' ? 'sm:grid-cols-3 xl:grid-cols-3 grid-cols-2' : 'sm:grid-cols-3 xl:grid-cols-5 grid-cols-2'} p-4 mx-auto text-gray-900 gap-8 max-w-screen-xl dark:text-white sm:p-8`}>
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold">{ gamesPlayed }</dt>
                    <dd className="text-gray-500 dark:text-gray-400">🕹️ Games Played</dd>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                      <dt className="mb-2 text-3xl font-extrabold">{ gamesWon }</dt>
                      <dd className="text-gray-500 dark:text-gray-400">🏆 Games Won</dd>
                  </div>
                  {
                    wordLength !== 'ALL' && (
                      <div className="flex flex-col items-center justify-center">
                        <dt className="mb-2 text-3xl font-extrabold">{ !streakIsError && streakData?.data?.currentStreak || 0}</dt>
                        <dd className="text-gray-500 dark:text-gray-400">🔥 Current Streak</dd>
                      </div>
                    )
                  }
                  {
                    wordLength !== 'ALL' && (
                      <div className="flex flex-col items-center justify-center">
                        <dt className="mb-2 text-3xl font-extrabold">{ !streakIsError && streakData?.data?.bestStreak || 0}</dt>
                        <dd className="text-gray-500 dark:text-gray-400">💎 Best Streak</dd>
                      </div>
                    )
                  }
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold">{ Math.floor((gamesWon / gamesPlayed) * 100) || 0}%</dt>
                    <dd className="text-gray-500 dark:text-gray-400">📈 % of Wins</dd>
                  </div>
                </dl>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="daily">
            <div id="fullWidthTabContent" className='p-4 border-gray-200 dark:border-gray-600'>
              <div className="p-4 bg-bg rounded-lg md:p-8 dark:bg-gray-800" id="stats" role="tabpanel" aria-labelledby="stats-tab">
                <dl className={`grid ${wordLength === 'ALL' ? 'sm:grid-cols-3 xl:grid-cols-3 grid-cols-2' : 'sm:grid-cols-3 xl:grid-cols-5 grid-cols-2'} p-4 mx-auto text-gray-900 gap-8 max-w-screen-xl dark:text-white sm:p-8`}>
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold">{ daily?.data?.gamesPlayed || 0}</dt>
                    <dd className="text-gray-500 dark:text-gray-400">🕹️ Games Played</dd>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                      <dt className="mb-2 text-3xl font-extrabold">{ daily?.data?.gamesWon || 0}</dt>
                      <dd className="text-gray-500 dark:text-gray-400">🏆 Games Won</dd>
                  </div>
                  {
                    wordLength !== 'ALL' && (
                      <div className="flex flex-col items-center justify-center">
                        <dt className="mb-2 text-3xl font-extrabold">{ !streakIsError && streakData?.data?.currentStreak || 0}</dt>
                        <dd className="text-gray-500 dark:text-gray-400">🔥 Current Streak</dd>
                      </div>
                    )
                  }
                  {
                    wordLength !== 'ALL' && (
                      <div className="flex flex-col items-center justify-center">
                        <dt className="mb-2 text-3xl font-extrabold">{ !streakIsError && streakData?.data?.bestStreak || 0}</dt>
                        <dd className="text-gray-500 dark:text-gray-400">💎 Best Streak</dd>
                      </div>
                    )
                  }
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold">{ Math.floor((daily?.data?.gamesWon / daily?.data?.gamesPlayed) * 100) || 0}%</dt>
                    <dd className="text-gray-500 dark:text-gray-400">📈 % of Wins</dd>
                  </div>
                </dl>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="weekly">
            <div id="fullWidthTabContent" className='p-4 border-gray-200 dark:border-gray-600'>
              <div className="p-4 bg-bg rounded-lg md:p-8 dark:bg-gray-800" id="stats" role="tabpanel" aria-labelledby="stats-tab">
                <dl className={`grid ${wordLength === 'ALL' ? 'sm:grid-cols-3 xl:grid-cols-3 grid-cols-2' : 'sm:grid-cols-3 xl:grid-cols-5 grid-cols-2'} p-4 mx-auto text-gray-900 gap-8 max-w-screen-xl dark:text-white sm:p-8`}>
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold">{ weekly?.data?.gamesPlayed || 0}</dt>
                    <dd className="text-gray-500 dark:text-gray-400">🕹️ Games Played</dd>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                      <dt className="mb-2 text-3xl font-extrabold">{ weekly?.data?.gamesWon || 0}</dt>
                      <dd className="text-gray-500 dark:text-gray-400">🏆 Games Won</dd>
                  </div>
                  {
                    wordLength !== 'ALL' && (
                      <div className="flex flex-col items-center justify-center">
                        <dt className="mb-2 text-3xl font-extrabold">{ !streakIsError && streakData?.data?.currentStreak || 0}</dt>
                        <dd className="text-gray-500 dark:text-gray-400">🔥 Current Streak</dd>
                      </div>
                    )
                  }
                  {
                    wordLength !== 'ALL' && (
                      <div className="flex flex-col items-center justify-center">
                        <dt className="mb-2 text-3xl font-extrabold">{ !streakIsError && streakData?.data?.bestStreak || 0}</dt>
                        <dd className="text-gray-500 dark:text-gray-400">💎 Best Streak</dd>
                      </div>
                    )
                  }
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold">{ Math.floor((weekly?.data?.gamesWon / weekly?.data?.gamesPlayed) * 100) || 0}%</dt>
                    <dd className="text-gray-500 dark:text-gray-400">📈 % of Wins</dd>
                  </div>
                </dl>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="monthly">
            <div id="fullWidthTabContent" className='p-4 border-gray-200 dark:border-gray-600'>
              <div className="p-4 bg-bg rounded-lg md:p-8 dark:bg-gray-800" id="stats" role="tabpanel" aria-labelledby="stats-tab">
                <dl className={`grid ${wordLength === 'ALL' ? 'sm:grid-cols-3 xl:grid-cols-3 grid-cols-2' : 'sm:grid-cols-3 xl:grid-cols-5 grid-cols-2'} p-4 mx-auto text-gray-900 gap-8 max-w-screen-xl dark:text-white sm:p-8`}>
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold">{ monthly?.data?.gamesPlayed || 0}</dt>
                    <dd className="text-gray-500 dark:text-gray-400">🕹️ Games Played</dd>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                      <dt className="mb-2 text-3xl font-extrabold">{ monthly?.data?.gamesWon || 0}</dt>
                      <dd className="text-gray-500 dark:text-gray-400">🏆 Games Won</dd>
                  </div>
                  {
                    wordLength !== 'ALL' && (
                      <div className="flex flex-col items-center justify-center">
                        <dt className="mb-2 text-3xl font-extrabold">{ !streakIsError && streakData?.data?.currentStreak || 0}</dt>
                        <dd className="text-gray-500 dark:text-gray-400">🔥 Current Streak</dd>
                      </div>
                    )
                  }
                  {
                    wordLength !== 'ALL' && (
                      <div className="flex flex-col items-center justify-center">
                        <dt className="mb-2 text-3xl font-extrabold">{ !streakIsError && streakData?.data?.bestStreak || 0}</dt>
                        <dd className="text-gray-500 dark:text-gray-400">💎 Best Streak</dd>
                      </div>
                    )
                  }
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold">{ Math.floor((monthly?.data?.gamesWon / monthly?.data?.gamesPlayed) * 100) || 0}%</dt>
                    <dd className="text-gray-500 dark:text-gray-400">📈 % of Wins</dd>
                  </div>
                </dl>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="yearly">
            <div id="fullWidthTabContent" className='p-4 border-gray-200 dark:border-gray-600'>
              <div className="p-4 bg-bg rounded-lg md:p-8 dark:bg-gray-800" id="stats" role="tabpanel" aria-labelledby="stats-tab">
                <dl className={`grid ${wordLength === 'ALL' ? 'sm:grid-cols-3 xl:grid-cols-3 grid-cols-2' : 'sm:grid-cols-3 xl:grid-cols-5 grid-cols-2'} p-4 mx-auto text-gray-900 gap-8 max-w-screen-xl dark:text-white sm:p-8`}>
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold">{ yearly?.data?.gamesPlayed || 0}</dt>
                    <dd className="text-gray-500 dark:text-gray-400">🕹️ Games Played</dd>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                      <dt className="mb-2 text-3xl font-extrabold">{ yearly?.data?.gamesWon || 0}</dt>
                      <dd className="text-gray-500 dark:text-gray-400">🏆 Games Won</dd>
                  </div>
                  {
                    wordLength !== 'ALL' && (
                      <div className="flex flex-col items-center justify-center">
                        <dt className="mb-2 text-3xl font-extrabold">{ !streakIsError && streakData?.data?.currentStreak || 0}</dt>
                        <dd className="text-gray-500 dark:text-gray-400">🔥 Current Streak</dd>
                      </div>
                    )
                  }
                  {
                    wordLength !== 'ALL' && (
                      <div className="flex flex-col items-center justify-center">
                        <dt className="mb-2 text-3xl font-extrabold">{ !streakIsError && streakData?.data?.bestStreak || 0}</dt>
                        <dd className="text-gray-500 dark:text-gray-400">💎 Best Streak</dd>
                      </div>
                    )
                  }
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold">{ Math.floor((yearly?.data?.gamesWon / yearly?.data?.gamesPlayed) * 100) || 0}%</dt>
                    <dd className="text-gray-500 dark:text-gray-400">📈 % of Wins</dd>
                  </div>
                </dl>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Tabs defaultValue="ALL" value={wordLength} onValueChange={value => setWordLength(value)}>
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="ALL">All</TabsTrigger>
            <TabsTrigger value="FIVE_LETTER">5 Letter</TabsTrigger>
            <TabsTrigger value="SIX_LETTER">6 Letter</TabsTrigger>
            <TabsTrigger value="SEVEN_LETTER">7 Letter</TabsTrigger>
            <TabsTrigger value="EIGHT_LETTER">8 Letter</TabsTrigger>
            <TabsTrigger value="NINE_LETTER">9 Letter</TabsTrigger>
            <TabsTrigger value="TEN_LETTER">10 Letter</TabsTrigger>
            <TabsTrigger value="ELEVEN_LETTER">11 Letter</TabsTrigger>
          </TabsList>
          <TabsContent value="ALL">
            <Card>
              <CardHeader>
                <CardTitle>All Word Lengths</CardTitle>
                <CardDescription>Game Win Distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={chartData}
                    layout="vertical"
                    margin={{
                      left: 0,
                    }}
                  >
                    <YAxis
                      dataKey="wonIn"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
                    />
                    <XAxis dataKey="wins" type="number" hide />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="wins" layout="vertical" radius={5} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="FIVE_LETTER">
            <Card>
              <CardHeader>
                <CardTitle>5 Letter</CardTitle>
                <CardDescription>Game Win Distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={chartData}
                    layout="vertical"
                    margin={{
                      left: 0,
                    }}
                  >
                    <YAxis
                      dataKey="wonIn"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
                    />
                    <XAxis dataKey="wins" type="number" hide />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="wins" layout="vertical" radius={5} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="SIX_LETTER">
            <Card>
              <CardHeader>
                <CardTitle>6 Letter</CardTitle>
                <CardDescription>Game Win Distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={chartData}
                    layout="vertical"
                    margin={{
                      left: 0,
                    }}
                  >
                    <YAxis
                      dataKey="wonIn"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
                    />
                    <XAxis dataKey="wins" type="number" hide />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="wins" layout="vertical" radius={5} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="SEVEN_LETTER">
            <Card>
              <CardHeader>
                <CardTitle>7 Letter</CardTitle>
                <CardDescription>Game Win Distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={chartData}
                    layout="vertical"
                    margin={{
                      left: 0,
                    }}
                  >
                    <YAxis
                      dataKey="wonIn"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
                    />
                    <XAxis dataKey="wins" type="number" hide />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="wins" layout="vertical" radius={5} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="EIGHT_LETTER">
            <Card>
              <CardHeader>
                <CardTitle>8 Letter</CardTitle>
                <CardDescription>Game Win Distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={chartData}
                    layout="vertical"
                    margin={{
                      left: 0,
                    }}
                  >
                    <YAxis
                      dataKey="wonIn"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
                    />
                    <XAxis dataKey="wins" type="number" hide />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="wins" layout="vertical" radius={5} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="NINE_LETTER">
            <Card>
              <CardHeader>
                <CardTitle>9 Letter</CardTitle>
                <CardDescription>Game Win Distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={chartData}
                    layout="vertical"
                    margin={{
                      left: 0,
                    }}
                  >
                    <YAxis
                      dataKey="wonIn"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
                    />
                    <XAxis dataKey="wins" type="number" hide />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="wins" layout="vertical" radius={5} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="TEN_LETTER">
            <Card>
              <CardHeader>
                <CardTitle>10 Letter</CardTitle>
                <CardDescription>Game Win Distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={chartData}
                    layout="vertical"
                    margin={{
                      left: 0,
                    }}
                  >
                    <YAxis
                      dataKey="wonIn"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
                    />
                    <XAxis dataKey="wins" type="number" hide />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="wins" layout="vertical" radius={5} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ELEVEN_LETTER">
            <Card>
              <CardHeader>
                <CardTitle>11 Letter</CardTitle>
                <CardDescription>Game Win Distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={chartData}
                    layout="vertical"
                    margin={{
                      left: 0,
                    }}
                  >
                    <YAxis
                      dataKey="wonIn"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
                    />
                    <XAxis dataKey="wins" type="number" hide />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="wins" layout="vertical" radius={5} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
      <HoverHome />
      <ThemeSwitcher />
    </div>
  )
}
