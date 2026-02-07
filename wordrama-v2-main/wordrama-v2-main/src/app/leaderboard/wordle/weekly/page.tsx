"use client"
//import { useState } from "react";
//import { getAppInsights } from "@/utils/appInsights";
import { LeaderboardNav } from "@/components/navbar/wordle-leaderboard";
import { useRouter } from "next/navigation"
import Loading from '@/sections/loading';
import {
  useGetWeeklyWordleLeaderboardQuery
} from "@/redux/api/wordrama";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp, Medal, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from 'next/link';//
import { useSearchParams } from "next/navigation";
import { getWordleLeaderboardUiState } from '@/redux/ui/helpers';

export default function WordleWeeklyLeaderboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // getAppInsights().trackPageView({ name: 'Wordle Weekly Leaderboard' });
  //type SortKey = "games_won" | "games_lost" | "games_played" | "losses" | "bestStreak" | "level" | "gamesWon1" | "gamesWon2" | "gamesWon3" | "gamesWon4" | "gamesWon5" | "gamesWon6"

  const [timePeriod, setTimePeriod] = useState('weekly')
  const [wordPack, setWordPack] = useState((searchParams.get('wordPack') || "all").toLowerCase())
  const [sortBy, setSortBy] = useState((searchParams.get('sortBy') || "rank").toLowerCase())//useState<SortKey>("score")

  const getWordPackPrefix = (pack: string) => {
    if (pack === "all") return "";
    const number = parseInt(pack.split(" ")[0]);
    return ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", 'eleven'][number] + "Letter";
  }
  const getWordPackNumberPrefix = (pack: string) => {
    if (pack === "all") return "";
    const number = parseInt(pack.split(" ")[0]);
    return ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", '11'][number] + "Letter";
  }
  const prefix = getWordPackPrefix(wordPack);
  const numberPrefix = getWordPackNumberPrefix(wordPack);
  const getSortBy = (sortBy: string, pack: string) => {
    const number = parseInt(pack.split(" ")[0]);
    if (sortBy === "rank") {
      if (pack === "all") return 'weekly_rank';
      return "weekly_rank_" + number + "_letter";
    } else if (sortBy === 'games_won') {
      if (pack === "all") return 'games_won';
      return ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", 'eleven'][number] + "_letter_games_won";
    } else if (sortBy === 'games_lost') {
      if (pack === "all") return 'games_lost';
      return ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", 'eleven'][number] + "_letter_games_lost";
    } else if (sortBy === 'games_won_in_1') {
      if (pack === "all") return 'games_won_in_1';
      return ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", 'eleven'][number] + "_letter_games_won_in_1";
    } else if (sortBy === 'games_won_in_2') {
      if (pack === "all") return 'games_won_in_2';
      return ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", 'eleven'][number] + "_letter_games_won_in_2";
    } else if (sortBy === 'games_won_in_3') {
      if (pack === "all") return 'games_won_in_3';
      return ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", 'eleven'][number] + "_letter_games_won_in_3";
    } else if (sortBy === 'games_won_in_4') {
      if (pack === "all") return 'games_won_in_4';
      return ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", 'eleven'][number] + "_letter_games_won_in_4";
    } else if (sortBy === 'games_won_in_5') {
      if (pack === "all") return 'games_won_in_5';
      return ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", 'eleven'][number] + "_letter_games_won_in_5";
    } else if (sortBy === 'games_won_in_6') {
      if (pack === "all") return 'games_won_in_6';
      return ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", 'eleven'][number] + "_letter_games_won_in_6";
    } else if (sortBy === 'best_streak') {
      if (pack === "all") return 'overall_best_streak_rank';
      return ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", 'eleven'][number] + "_letter_best_streak_rank";
    }
  }
  const sortByKey = getSortBy(sortBy, wordPack);

  const [leaderboardData, setLeaderboardData] = useState({ data: [] });

  const { data: weeklyData, isLoading: isLoadingWeekly, error: weeklyError } = useGetWeeklyWordleLeaderboardQuery({ page: Number(searchParams.get('page') || 1), orderBy: sortByKey });
  const { data: weeklyTop3Data, isLoading: isLoadingTop3Weekly, error: weeklyTop3Error } = useGetWeeklyWordleLeaderboardQuery({ page: 1, orderBy: sortByKey });

  useEffect(() => {
    if (!weeklyError) {

      setLeaderboardData(weeklyData);
    } else {
      setLeaderboardData([]);
    }
  }, [weeklyData]);

  function handleTimePeriodChange(value: string) {
    if (value === '/') router.push('/leaderboard/wordle/');
    return router.push(`/leaderboard/wordle/${value}`)
  }

  function LeaderboardPagination() {
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className="text-text dark:text-darkText"
              href={`${window.location.pathname}?page=${weeklyData?.metadata?.previousPage}`}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink className="text-text dark:text-darkText" href={`${window.location.pathname}?page=${weeklyData?.metadata?.currentPage}`}>{ weeklyData?.metadata?.currentPage }</PaginationLink>
          </PaginationItem>
          <PaginationItem className="text-white">
            <PaginationEllipsis className="text-text dark:text-darkText" />
          </PaginationItem>
          { weeklyData?.metadata?.currentPage < weeklyData?.metadata?.totalPages && (
            <>
              <PaginationItem>
                <PaginationLink className="text-text dark:text-darkText" href={`${window.location.pathname}?page=${weeklyData?.metadata?.totalPages}`}>{ weeklyData?.metadata?.totalPages }</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  className="text-text dark:text-darkText"
                  href={`${window.location.pathname}?page=${weeklyData?.metadata?.nextPage}`}
                />
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </Pagination>
    )
  }

  if (
    isLoadingWeekly ||
    isLoadingTop3Weekly
  ) return <Loading />;
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl text-text dark:text-darkText font-semibold">Wordle | Weekly Leaderboard</h1>
        </div>
        <Card className="w-full max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              { weeklyTop3Data?.data?.slice(0, 3).map((player, index) => (
                <Card key={player?.player}>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Medal className={`h-6 w-6 ${index === 0 ? "text-yellow-400" : index === 1 ? "text-gray-400" : "text-amber-600"}`} />
                            <span className="font-semibold hover:underline"><Link href={`/player/${player?.player}`}>{ player.displayName }</Link></span>
                          </div>
                          <span className="text-2xl font-bold"></span>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          <p>Wins: { prefix ? player[`${prefix}GamesWon`] : player.gamesWon  } | Losses: { prefix ? player[`${prefix}GamesLost`] : player.gamesLost  }</p>
                          <p>Best Streak: {prefix ? player[`bestStreak${prefix}`] : player.weeklyBestStreak}</p>
                        </div>
                      </CardContent>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="flex justify-between space-x-4">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={player?.profileImage} className="h-24 w-24"/>
                          <AvatarFallback className="h-24 w-24">{ player?.displayName }</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="text-lg font-semibold">{ player.displayName }</div>
                          <h4 className="text-sm font-semibold">Level { player.players.levels.level }</h4>
                          <p className="text-sm">
                            <span className="font-semibold">Coins:</span> { player.players.ledger.coinBalance }
                          </p>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </Card>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
              <Select onValueChange={handleTimePeriodChange} value={timePeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="/">All Time</SelectItem>
                  <SelectItem value="daily">Today</SelectItem>
                  <SelectItem value="weekly">This Week</SelectItem>
                  <SelectItem value="monthly">This Month</SelectItem>
                  <SelectItem value="yearly">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Select value={wordPack} onValueChange={(value) => {
                setWordPack(value);
              }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select word pack" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Word Packs</SelectItem>
                  {Array.from({ length: 7 }, (_, i) => i + 5).map((length) => (
                    <SelectItem key={length} value={`${length} letter`}>
                      {length} letter
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default">
                    Sort by: {sortBy.includes("games_won") && sortBy !== 'games_won' ? `Games Won in ${sortBy.slice(-1)}` : sortBy.charAt(0).toUpperCase() + sortBy.replace('_', ' ').slice(1)}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => { setSortBy('rank'); }}>
                    Rank
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem onClick={() => { setSortBy('games_won'); }}>
                    Games Won
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSortBy('games_lost'); }}>
                    Games Lost
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSortBy('games_played'); }}>
                    Games Played
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSortBy('best_streak'); }}>
                    Best Streak
                  </DropdownMenuItem>
                  {[1, 2, 3, 4, 5, 6].map((guesses) => (
                    <DropdownMenuItem key={guesses} onClick={() => { setSortBy(`games_won_in_${guesses}`); }}>
                      Games Won in {guesses}
                    </DropdownMenuItem>
                  ))} */}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Rank</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Games Played</TableHead>
                    <TableHead className="text-right">Won</TableHead>
                    <TableHead className="text-right">Lost</TableHead>
                    { sortBy.includes('games_won_in') && (
                      <TableHead className="text-right">Games won in {sortBy.substr(-1)}</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  { leaderboardData?.data?.map((entry, index) => (
                    <TableRow key={entry?.id}>
                      <TableCell className="font-medium">
                        { sortBy === 'rank' ?
                          (numberPrefix ? entry[`weeklyRank_${numberPrefix}`] : entry.weeklyRank) :
                          entry.position
                        }
                      </TableCell>
                      <TableCell>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Link className="hover:underline" href={`/player/${entry?.player}`}>{ entry?.displayName }</Link>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="flex justify-between space-x-4">
                              <Avatar className="h-24 w-24">
                                <AvatarImage src={entry?.profileImage} className="h-24 w-24"/>
                                <AvatarFallback className="h-24 w-24">{ entry?.displayName }</AvatarFallback>
                              </Avatar>
                              <div className="space-y-1">
                                <div className="text-lg font-semibold">{ entry?.displayName }</div>
                                <h4 className="text-sm font-semibold">Level { entry?.players?.levels?.level }</h4>
                                <p className="text-sm">
                                  <span className="font-semibold">Coins:</span> { entry?.players?.ledger?.coinBalance }
                                </p>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </TableCell>
                      <TableCell className="text-right">{ prefix ? entry[`${prefix}GamesWon`] + entry[`${prefix}GamesLost`] : entry.gamesPlayed  }</TableCell>
                      <TableCell className="text-right">{ prefix ? entry[`${prefix}GamesWon`] : entry.gamesWon  }</TableCell>
                      <TableCell className="text-right">{ prefix ? entry[`${prefix}GamesLost`] : entry.gamesLost  }</TableCell>
                      { sortBy.includes('games_won_in') && (
                        <TableCell className="text-right">
                          {
                            prefix ? entry[`${prefix}GamesWonIn_${sortBy.substr(-1)}`] : entry[`gamesWonIn_${sortBy.substr(-1)}`]
                          }
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter>
            <LeaderboardPagination />
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
