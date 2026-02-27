"use client"

import Wrapped from '@/components/wrapped'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart } from 'lucide-react'
import { TrendingUp } from "lucide-react";
import { orderBy } from "lodash";
import {
  Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis,
  Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart,
 } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";
import { useGetMyAccountQuery, useGetMyDailyWordleStatsQuery } from '@/redux/api/wordrama';
import { useGetMyFriendsQuery } from '@/redux/api/friends';

export function FriendLeaderboard() {
  const { data: myData, isLoading: isLoadingMe } = useGetMyAccountQuery();
  const { data: friendsData, isLoading: isLoadingFriends } = useGetMyFriendsQuery();
  const friends = friendsData?.data?.map(friend => {
    return {
      playerDisplayName: friend.players.displayName,
      level: friend.players.levels.level,
    }
  }) ?? [];
  const chartData = orderBy([...friends, {
    playerDisplayName: "You",
    level: myData?.data?.levels?.level ?? 0,
  }], ['level'], ['desc']).slice(0, 3);
;

  const chartConfig = {
    level: {
      label: "Level",
      color: "hsl(173 58% 39%)",
    },
    label: {
      color: "hsl(0 0% 100% / 0.5)",
    },
  } satisfies ChartConfig

  if (!friendsData?.data || friendsData?.data.length === 0) return (
    <Card className="bg-bg border-black">
      <CardHeader>
        <CardTitle>Friends</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-32 text-gray-500">
          Add friends to see their levels
        </div>
      </CardContent>
    </Card>
  )
  return (
    <Card className="bg-bg border-black">
      <CardHeader>
        <CardTitle>Friends</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="playerDisplayName"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis dataKey="level" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="level"
              layout="vertical"
              fill="#3b82f6"
              radius={4}
            >
              <LabelList
                dataKey="playerDisplayName"
                position="insideLeft"
                offset={35}
                className="fill-gray-800"
                fontSize={12}
              />
              <LabelList
                dataKey="level"
                position="insideLeft"
                offset={10}
                className="fill-black"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {
            chartData[0].playerDisplayName === "You"
              ? <>Don't let your friends overtake you 🥇</>
              : <>Overtake your friends <TrendingUp className="h-4 w-4" /></>
           }
        </div>
      </CardFooter>
    </Card>
  )
}

// export function () {
//   const chartData = [{ label: "Games Won", won: 98, lost: 2 }];
//   const totalGames = chartData[0].lost + chartData[0].won;

//   const chartConfig = {
//     level: {
//       label: "Level",
//       color: "hsl(173 58% 39%)",
//     },
//     label: {
//       color: "hsl(0 0% 100% / 0.5)",
//     },
//   } satisfies ChartConfig

//   return (
//     <Card className="flex flex-col">
//       <CardHeader className="items-center pb-0">
//         <CardTitle>Today</CardTitle>
//         <CardDescription></CardDescription>
//       </CardHeader>
//       <CardContent className="flex-1 pb-0">

//       </CardContent>
//       <CardFooter className="flex-col gap-2 text-sm">

//       </CardFooter>
//     </Card>
//   )
// }

export function TodayLeaderboard() {
  const { data: dailyStats } = useGetMyDailyWordleStatsQuery();
  const totalGames = dailyStats?.data?.gamesPlayed || 0;

  const chartData = [{ won: dailyStats?.data?.gamesWon || 0, lost: dailyStats?.data?.gamesLost || 0  }]
  const chartConfig = {
    won: {
      label: "Games Won",
      color: "hsl(220 70% 50%)",
    },
    lost: {
      label: "Games Lost",
      color: "hsl(340 75% 55%)",
    },
  } satisfies ChartConfig

  if (!dailyStats?.data || dailyStats?.data?.gamesPlayed === 0) return (
    <Card className="bg-bg border-black">
      <CardHeader>
        <CardTitle>Played Today</CardTitle>
        <CardDescription>Wordle</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-32 text-gray-500">
          Play a game to see your stats
        </div>
      </CardContent>
    </Card>
  )
  return (
    <Card className="flex flex-col bg-bg border-black">
      <CardHeader>
        <CardTitle>Played Today</CardTitle>
        <CardDescription>Wordle</CardDescription>
      </CardHeader>
        <CardContent className="flex flex-1 items-center pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[250px]"
          >
            <RadialBarChart
              data={chartData}
              endAngle={180}
              innerRadius={80}
              outerRadius={130}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  color="hsl(0 0% 100% / 0.5)"
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 16}
                            className="fill-white text-2xl font-bold"
                          >
                            {totalGames.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 4}
                            className="fill-white"
                          >
                            Games Played
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar
                dataKey="lost"
                stackId="a"
                cornerRadius={5}
                fill="#E2366F"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="won"
                fill="#2761D8"
                stackId="a"
                cornerRadius={5}
                className="stroke-transparent stroke-2"
              />
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
    </Card>
  )
}


export function GamesWonTodayLeaderboard() {
  const { data: dailyStats } = useGetMyDailyWordleStatsQuery();

  const chartData = [];
  if (dailyStats?.data.fiveLetterGamesWon > 0) {
    chartData.push({ game: "5 Letter", gamesWon: dailyStats?.data.fiveLetterGamesWon || 0 })
  }

  if (dailyStats?.data.sixLetterGamesWon > 0) {
    chartData.push({ game: "6 Letter", gamesWon: dailyStats?.data.sixLetterGamesWon || 0 })
  }

  if (dailyStats?.data.sevenLetterGamesWon > 0) {
    chartData.push({ game: "7 Letter", gamesWon: dailyStats?.data.sevenLetterGamesWon || 0 })
  }

  if (dailyStats?.data.eightLetterGamesWon > 0) {
    chartData.push({ game: "8 Letter", gamesWon: dailyStats?.data.eightLetterGamesWon || 0 })
  }

  if (dailyStats?.data.nineLetterGamesWon > 0) {
    chartData.push({ game: "9 Letter", gamesWon: dailyStats?.data.nineLetterGamesWon || 0 })
  }

  if (dailyStats?.data.tenLetterGamesWon > 0) {
    chartData.push({ game: "10 Letter", gamesWon: dailyStats?.data.tenLetterGamesWon || 0 })
  }

  if (dailyStats?.data.elevenLetterGamesWon > 0) {
    chartData.push({ game: "11 Letter", gamesWon: dailyStats?.data.elevenLetterGamesWon || 0 })
  }

  const chartConfig = {
    gamesWon: {
      label: "Games Won",
      color: "hsl(173 58% 39%)",
    },
    label: {
      color: "hsl(0 0% 100% / 0.5)",
    },
  } satisfies ChartConfig

  if (!dailyStats?.data || dailyStats?.data?.gamesPlayed === 0) return (
    <Card className="bg-bg border-black">
      <CardHeader>
        <CardTitle>Games Won Today</CardTitle>
        <CardDescription>Wordle</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-32 text-gray-500">
          Play a game to see your stats
        </div>
      </CardContent>
    </Card>
  )
  return (
    <Card className="bg-bg border-black">
      <CardHeader>
        <CardTitle>Games Won Today</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData.sort((a, b) => b.gamesWon - a.gamesWon)}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="game"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis dataKey="gamesWon" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="gamesWon"
              layout="vertical"
              fill="#3b82f6"
              radius={4}
            >
              <LabelList
                dataKey="game"
                position="insideLeft"
                offset={8}
                className="fill-gray-800"
                fontSize={12}
              />
              <LabelList
                dataKey="gamesWon"
                position="right"
                offset={8}
                className="fill-gray-400"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          { chartData[0]?.game } <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}

export function Support() {
  return (
    <Card className="w-[380px] overflow-hidden bg-bg border-black">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Support the Game</CardTitle>
          <Badge variant="secondary">Optional</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-muted-foreground">
          Your support helps us continue developing and improving the game. Please consider making a donation.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center mt-28 bg-gradient-to-r from-pink-500 to-purple-500 p-6">
        <div className="flex items-center space-x-2 text-white">
          <Heart className="h-6 w-6 fill-current" />
          <span className="text-lg font-semibold">Show your support</span>
        </div>
        <a href="https://www.paypal.com/donate/?hosted_button_id=8HD7JB6ZSW47A">
          <Button className="bg-white text-purple-600 hover:bg-gray-100">
            Support Now
          </Button>
        </a>
      </CardFooter>
    </Card>
  )
}

export default function HomeLeaderboards() {
  return (
    <section
      className='py-20 font-base lg:py-[50px] min-h-[20dvh] dark:bg-darkBg inset-0 flex w-full flex-col items-center justify-center bg-bg bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]'
    >
      <div className="mx-auto grid w-container max-w-full grid-cols-1 gap-5 px-5 sm:grid-cols-2 lg:grid-cols-3">
        <FriendLeaderboard />
        <TodayLeaderboard />
        {/* <Wrapped /> */}
        <Support />
      </div>
    </section>
  )
}
