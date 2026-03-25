"use client"
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/sections/header';
import Footer from '@/sections/footer';
import Loading from '@/sections/loading';
import { Button } from '@/components/ui/button';
import {
  useGetPublicPlayerSummaryQuery,
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
import { wordleWordPackConfig } from '@/lib/config';
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
  const normalizedPlayerId = Array.isArray(playerId) ? playerId[0] : playerId;

  const { data: summaryResp, error, isLoading } = useGetPublicPlayerSummaryQuery(normalizedPlayerId, {
    skip: !normalizedPlayerId,
  });

  const [timeFrame, setTimeframe] = useState('alltime');
  const [wordLength, setWordLength] = useState('ALL');
  
  const summary = summaryResp?.data ?? null;
  const data = summary;
  const levels = summary?.levels ?? null;
  const stats = summary?.stats ?? null;
  const streak = summary?.streak ?? null;
  const positions = summary?.leaderboardPositions ?? null;
  const distribution = summary?.guessDistribution ?? null;
  const { toast } = useToast();
  const { data: friends, isError } = useGetMyFriendsQuery(undefined, {
    skip: !user?.id,
  });
  const { data: sentRequests, isError: sentRequestsIsError } = useGetSentFriendRequestsQuery(undefined, {
    skip: !user?.id,
  });
  const friendList = !isError && friends ? friends?.data?.map(friend => friend.players.id): [];
  const [inviteFriend] = useInviteFriendMutation();
  const profileWordPackTabs = Object.entries(wordleWordPackConfig.friendlyNameByName).map(
    ([value, label]) => ({
      value,
      label,
    })
  );

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

  const getWordPackPrefix = (pack: string) =>
    pack.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

  type ChartDataItem = {
    wonIn: string;
    wins: number;
    fill: string;
  };

  let chartData: ChartDataItem[] = [];
  let gamesPlayed = 0;
  let gamesWon = 0;
  let currentStreakValue = 0;
  let bestStreakValue = 0;

  let tfData: Record<string, any> | null = null;

  // Map timeframe → correct dataset
  switch (timeFrame) {
    case 'alltime':
      tfData = positions?.allTime ?? null;
      break;
    case 'daily':
      tfData = positions?.daily ?? null;
      break;
    case 'weekly':
      tfData = positions?.weekly ?? null;
      break;
    case 'monthly':
      tfData = positions?.monthly ?? null;
      break;
    case 'yearly':
      tfData = positions?.yearly ?? null;
      break;
    default:
      tfData = null;
  }

  // Guard: ensure object actually has data
  const hasTfData = tfData && Object.keys(tfData).length > 0;

  if (hasTfData) {
    if (wordLength === 'ALL') {
      // --- GLOBAL STATS ---
      gamesWon = Number(tfData.gamesWon ?? 0);
      gamesPlayed = Number(tfData.gamesPlayed ?? 0);

      currentStreakValue = Number(summary?.streak?.currentStreak ?? 0);
      bestStreakValue = Number(summary?.streak?.bestStreak ?? 0);

      chartData = [1, 2, 3, 4, 5, 6].map(num => ({
        wonIn: String(num),
        wins: Number(tfData[`gamesWonIn_${num}`] ?? 0),
        fill: chartConfig[String(num) as keyof typeof chartConfig].color,
      }));
    } else {
      // --- WORD LENGTH SPECIFIC ---
      const prefix = getWordPackPrefix(wordLength);

      const wonKey = `${prefix}GamesWon`;
      const lostKey = `${prefix}GamesLost`;
      const currentStreakKey = `${prefix}CurrentStreak`;
      const bestStreakKey = `${prefix}BestStreak`;

      gamesWon = Number(tfData[wonKey] ?? 0);
      gamesPlayed =
        Number(tfData[wonKey] ?? 0) +
        Number(tfData[lostKey] ?? 0);

      currentStreakValue = Number(tfData[currentStreakKey] ?? 0);
      bestStreakValue = Number(tfData[bestStreakKey] ?? 0);

      chartData = [1, 2, 3, 4, 5, 6].map(num => ({
        wonIn: String(num),
        wins: Number(tfData[`${prefix}GamesWonIn_${num}`] ?? 0),
        fill: chartConfig[String(num) as keyof typeof chartConfig].color,
      }));
    }
  }

  console.log('PROFILE DEBUG', {
    normalizedPlayerId,
    summaryResp,
    summary,
    positions,
    allTime: positions?.allTime,
    timeFrame,
    wordLength,
    tfData,
    gamesPlayed,
    gamesWon,
  });

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
        className="dark:bg-darkBg inset-0 pb-12 pt-4 flex w-full flex-col items-center justify-start bg-bg bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]"
        onContextMenu={(e) => e.preventDefault()}
      >
        {
          //${avatarBorder}
        }
        <Avatar
	  className={`relative overflow-visible w-64 h-64`}
	>
	  {positions?.allTime?.alltimeRank === 1 && (
	    <div className="absolute top-[-145px] md:top-[-125px] left-1/2 -translate-x-1/2 flex h-64 w-64 items-center justify-center z-10">
	      <CrownIcon className="h-24 w-24 fill-yellow-500" />
	    </div>
	  )}
	  <AvatarImage
	    className='overflow-hidden rounded-full'
	    src={data?.profileImage}
	    alt={data?.displayName || data?.username || 'Player'}
	    width={250}
	    height={250}
	  />
	  <AvatarFallback>
	    {data?.displayName || data?.username || 'Player'}
	  </AvatarFallback>
	</Avatar>
        <div className="mx-auto w-container max-w-full px-5 text-center">
          <p className="mb-1 mt-4 text-lg font-normal leading-relaxed md:text-4xl lg:text-5xl lg:leading-relaxed">
            { data?.displayName }
          </p>
          { (levels?.prestige ?? 0) > 0 && (
  <Link href={`/progression?playerId=${playerId}`}>
    <Badge className='mb-12 mr-3'>
      Prestige { levels?.prestige ?? 0 }
    </Badge>
  </Link>
)}
<Link href={`/progression?playerId=${playerId}`}>
  <Badge className='mb-12'>
    Level { (levels?.level ?? 0) % 100 }
  </Badge>
</Link>
<Link href={`/progression?playerId=${playerId}`}>
  <div className='flex items-center justify-center'>
    <Badge className="mr-5">
      { levels?.xp ?? 0 }xp
    </Badge>
    <Progress
      value={
        (levels?.xpToNextLevel ?? 0) - (levels?.xp ?? 0) < 0
          ? 100
          : Math.floor(((levels?.xp ?? 0) / (levels?.xpToNextLevel ?? 1)) * 100)
      }
      className="md:w-1/2 lg:w-1/3 h-4 bg-gray-200 rounded-full"
    />
    <Badge className='ml-5'>
      { (levels?.xpToNextLevel ?? 0) - (levels?.xp ?? 0) < 0
        ? 0
        : (levels?.xpToNextLevel ?? 0) - (levels?.xp ?? 0) }xp to go
    </Badge>
  </div>
</Link>
        </div>
        {
           friendList &&
           !friendList.includes(playerId) && user?.id !== playerId &&
           !sentRequests?.data.find(req => req.players.id === playerId) &&  (
            <div className="flex items-center justify-center mt-4">
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
        className="dark:bg-darkBg inset-0 pb-12 pt-4 flex w-full flex-col items-center justify-start bg-bg bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]"
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
                <dl className={`grid ${wordLength === 'ALL' ? 'sm:grid-cols-3 xl:grid-cols-3 grid-cols-2' : 'sm:grid-cols-3 xl:grid-cols-5 grid-cols-2'} p-4 mx-auto text-gray-900 gap-4 max-w-screen-xl dark:text-white sm:p-8`}>
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold">{ gamesPlayed }</dt>
                    <dd className="text-gray-500 dark:text-gray-400">🕹️ Games Played</dd>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold">{ gamesWon }</dt>
                    <dd className="text-gray-500 dark:text-gray-400">🏆 Games Won</dd>
                  </div>
                  {
                    wordLength !== 'ALL' && timeFrame === 'alltime' && (
                      <div className="flex flex-col items-center justify-center">
                        <dt className="mb-2 text-3xl font-extrabold">{ currentStreakValue }</dt>
                        <dd className="text-gray-500 dark:text-gray-400">🔥 Current Streak</dd>
                      </div>
                    )
                  }
                  {
                    wordLength !== 'ALL' && timeFrame === 'alltime' && (
                      <div className="flex flex-col items-center justify-center">
                        <dt className="mb-2 text-3xl font-extrabold">{ bestStreakValue }</dt>
                        <dd className="text-gray-500 dark:text-gray-400">💎 Best Streak</dd>
                      </div>
                    )
                  }
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold">{ gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0 }%</dt>
                    <dd className="text-gray-500 dark:text-gray-400">📈 % of Wins</dd>
                  </div>
                </dl>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="daily">
            <div id="fullWidthTabContent" className='p-4 border-gray-200 dark:border-gray-600'>
              <div className="p-4 bg-bg rounded-lg md:p-8 dark:bg-gray-800" id="stats" role="tabpanel" aria-labelledby="stats-tab">
                <dl className={`grid ${wordLength === 'ALL' ? 'sm:grid-cols-3 xl:grid-cols-3 grid-cols-2' : 'sm:grid-cols-3 xl:grid-cols-5 grid-cols-2'} p-4 mx-auto text-gray-900 gap-4 max-w-screen-xl dark:text-white sm:p-8`}>
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold">{ gamesPlayed }</dt>
                    <dd className="text-gray-500 dark:text-gray-400">🕹️ Games Played</dd>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold">{ gamesWon }</dt>
                    <dd className="text-gray-500 dark:text-gray-400">🏆 Games Won</dd>
                  </div>
                  {
                    wordLength !== 'ALL' && timeFrame === 'alltime' && (
                      <div className="flex flex-col items-center justify-center">
                        <dt className="mb-2 text-3xl font-extrabold">{ currentStreakValue }</dt>
                        <dd className="text-gray-500 dark:text-gray-400">🔥 Current Streak</dd>
                      </div>
                    )
                  }
                  {
                    wordLength !== 'ALL' && timeFrame === 'alltime' && (
                      <div className="flex flex-col items-center justify-center">
                        <dt className="mb-2 text-3xl font-extrabold">{ bestStreakValue }</dt>
                        <dd className="text-gray-500 dark:text-gray-400">💎 Best Streak</dd>
                      </div>
                    )
                  }
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold">{ gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0 }%</dt>
                    <dd className="text-gray-500 dark:text-gray-400">📈 % of Wins</dd>
                  </div>
                </dl>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="weekly">
            <div id="fullWidthTabContent" className='p-4 border-gray-200 dark:border-gray-600'>
              <div className="p-4 bg-bg rounded-lg md:p-8 dark:bg-gray-800" id="stats" role="tabpanel" aria-labelledby="stats-tab">
                <dl className={`grid ${wordLength === 'ALL' ? 'sm:grid-cols-3 xl:grid-cols-3 grid-cols-2' : 'sm:grid-cols-3 xl:grid-cols-5 grid-cols-2'} p-4 mx-auto text-gray-900 gap-4 max-w-screen-xl dark:text-white sm:p-8`}>
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold">{ gamesPlayed }</dt>
                    <dd className="text-gray-500 dark:text-gray-400">🕹️ Games Played</dd>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold">{ gamesWon }</dt>
                    <dd className="text-gray-500 dark:text-gray-400">🏆 Games Won</dd>
                  </div>
                  {
                    wordLength !== 'ALL' && timeFrame === 'alltime' && (
                      <div className="flex flex-col items-center justify-center">
                        <dt className="mb-2 text-3xl font-extrabold">{ currentStreakValue }</dt>
                        <dd className="text-gray-500 dark:text-gray-400">🔥 Current Streak</dd>
                      </div>
                    )
                  }
                  {
                    wordLength !== 'ALL' && timeFrame === 'alltime' && (
                      <div className="flex flex-col items-center justify-center">
                        <dt className="mb-2 text-3xl font-extrabold">{ bestStreakValue }</dt>
                        <dd className="text-gray-500 dark:text-gray-400">💎 Best Streak</dd>
                      </div>
                    )
                  }
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold">{ gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0 }%</dt>
                    <dd className="text-gray-500 dark:text-gray-400">📈 % of Wins</dd>
                  </div>
                </dl>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="monthly">
            <div id="fullWidthTabContent" className='p-4 border-gray-200 dark:border-gray-600'>
              <div className="p-4 bg-bg rounded-lg md:p-8 dark:bg-gray-800" id="stats" role="tabpanel" aria-labelledby="stats-tab">
                <dl className={`grid ${wordLength === 'ALL' ? 'sm:grid-cols-3 xl:grid-cols-3 grid-cols-2' : 'sm:grid-cols-3 xl:grid-cols-5 grid-cols-2'} p-4 mx-auto text-gray-900 gap-4 max-w-screen-xl dark:text-white sm:p-8`}>
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold">{ gamesPlayed }</dt>
                    <dd className="text-gray-500 dark:text-gray-400">🕹️ Games Played</dd>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold">{ gamesWon }</dt>
                    <dd className="text-gray-500 dark:text-gray-400">🏆 Games Won</dd>
                  </div>
                  {
                    wordLength !== 'ALL' && timeFrame === 'alltime' && (
                      <div className="flex flex-col items-center justify-center">
                        <dt className="mb-2 text-3xl font-extrabold">{ currentStreakValue }</dt>
                        <dd className="text-gray-500 dark:text-gray-400">🔥 Current Streak</dd>
                      </div>
                    )
                  }
                  {
                    wordLength !== 'ALL' && timeFrame === 'alltime' && (
                      <div className="flex flex-col items-center justify-center">
                        <dt className="mb-2 text-3xl font-extrabold">{ bestStreakValue }</dt>
                        <dd className="text-gray-500 dark:text-gray-400">💎 Best Streak</dd>
                      </div>
                    )
                  }
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold">{ gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0 }%</dt>
                    <dd className="text-gray-500 dark:text-gray-400">📈 % of Wins</dd>
                  </div>
                </dl>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="yearly">
            <div id="fullWidthTabContent" className='p-4 border-gray-200 dark:border-gray-600'>
              <div className="p-4 bg-bg rounded-lg md:p-8 dark:bg-gray-800" id="stats" role="tabpanel" aria-labelledby="stats-tab">
                <dl className={`grid ${wordLength === 'ALL' ? 'sm:grid-cols-3 xl:grid-cols-3 grid-cols-2' : 'sm:grid-cols-3 xl:grid-cols-5 grid-cols-2'} p-4 mx-auto text-gray-900 gap-4 max-w-screen-xl dark:text-white sm:p-8`}>
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold">{ gamesPlayed }</dt>
                    <dd className="text-gray-500 dark:text-gray-400">🕹️ Games Played</dd>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold">{ gamesWon }</dt>
                    <dd className="text-gray-500 dark:text-gray-400">🏆 Games Won</dd>
                  </div>
                  {
                    wordLength !== 'ALL' && timeFrame === 'alltime' && (
                      <div className="flex flex-col items-center justify-center">
                        <dt className="mb-2 text-3xl font-extrabold">{ currentStreakValue }</dt>
                        <dd className="text-gray-500 dark:text-gray-400">🔥 Current Streak</dd>
                      </div>
                    )
                  }
                  {
                    wordLength !== 'ALL' && timeFrame === 'alltime' && (
                      <div className="flex flex-col items-center justify-center">
                        <dt className="mb-2 text-3xl font-extrabold">{ bestStreakValue }</dt>
                        <dd className="text-gray-500 dark:text-gray-400">💎 Best Streak</dd>
                      </div>
                    )
                  }
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-extrabold">{ gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0 }%</dt>
                    <dd className="text-gray-500 dark:text-gray-400">📈 % of Wins</dd>
                  </div>
                </dl>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <div className="w-full overflow-hidden">
        <Tabs defaultValue="ALL" value={wordLength} onValueChange={value => setWordLength(value)}>
          <div className="w-full overflow-x-auto pb-2">
            <TabsList className="flex w-max min-w-max gap-2 px-2 whitespace-nowrap">
              <TabsTrigger value="ALL">All</TabsTrigger>

              {profileWordPackTabs.map(tab => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

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

          {profileWordPackTabs.map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
              <Card>
                <CardHeader>
                  <CardTitle>{tab.label}</CardTitle>
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
          ))}
        </Tabs>  
      </div>

      <Footer />
      <HoverHome />
      <ThemeSwitcher />
    </div>
  )
}
