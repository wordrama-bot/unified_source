"use client"
//import { getAppInsights } from "@/utils/appInsights";
import { LeaderboardNav } from "@/components/navbar/wordle-leaderboard";
import { useRouter } from "next/navigation"
import Loading from '@/sections/loading';
import {
  useGetMonthlyWordleLeaderboardQuery
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

export default function WordleMonthlyLeaderboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  //getAppInsights().trackPageView({ name: 'Wordle Monthly Leaderboard' });
  //type SortKey = "games_won" | "games_lost" | "games_played" | "losses" | "bestStreak" | "level" | "gamesWon1" | "gamesWon2" | "gamesWon3" | "gamesWon4" | "gamesWon5" | "gamesWon6"

  const [timePeriod, setTimePeriod] = useState('monthly')
  const [wordPack, setWordPack] = useState((searchParams.get('wordPack') || "all").toLowerCase())
  const [sortBy, setSortBy] = useState((searchParams.get('sortBy') || "rank").toLowerCase())//useState<SortKey>("score")

  const WORD_PACKS: Record<string, {
    label: string;
    prefix: string;
    columnPrefix: string;
    rankColumn: string;
  }> = {
    all: {
      label: "All Word Packs",
      prefix: "",
      columnPrefix: "",
      rankColumn: "monthly_rank",
    },
    "4 letter": {
      label: "4 Letter",
      prefix: "fourLetter",
      columnPrefix: "four_letter",
      rankColumn: "monthly_rank_4_letter",
    },
    "5 letter": {
      label: "5 Letter",
      prefix: "fiveLetter",
      columnPrefix: "five_letter",
      rankColumn: "monthly_rank_5_letter",
    },
    "5 letter crazy": {
      label: "5 Letter Crazy",
      prefix: "fiveLetterCrazy",
      columnPrefix: "five_letter_crazy",
      rankColumn: "monthly_rank_five_letter_crazy",
    },
    "6 letter": {
      label: "6 Letter",
      prefix: "sixLetter",
      columnPrefix: "six_letter",
      rankColumn: "monthly_rank_6_letter",
    },
    "7 letter": {
      label: "7 Letter",
      prefix: "sevenLetter",
      columnPrefix: "seven_letter",
      rankColumn: "monthly_rank_7_letter",
    },
    "8 letter": {
      label: "8 Letter",
      prefix: "eightLetter",
      columnPrefix: "eight_letter",
      rankColumn: "monthly_rank_8_letter",
    },
    "9 letter": {
      label: "9 Letter",
      prefix: "nineLetter",
      columnPrefix: "nine_letter",
      rankColumn: "monthly_rank_9_letter",
    },
    "10 letter": {
      label: "10 Letter",
      prefix: "tenLetter",
      columnPrefix: "ten_letter",
      rankColumn: "monthly_rank_10_letter",
    },
    "11 letter": {
      label: "11 Letter",
      prefix: "elevenLetter",
      columnPrefix: "eleven_letter",
      rankColumn: "monthly_rank_11_letter",
    },
    "11 letter extended": {
      label: "11 Letter Extended",
      prefix: "elevenLetterExtended",
      columnPrefix: "eleven_letter_extended",
      rankColumn: "monthly_rank_11_letter_extended",
    },
    "12 letter": {
      label: "12 Letter",
      prefix: "twelveLetter",
      columnPrefix: "twelve_letter",
      rankColumn: "monthly_rank_12_letter",
    },
    "13 letter": {
      label: "13 Letter",
      prefix: "thirteenLetter",
      columnPrefix: "thirteen_letter",
      rankColumn: "monthly_rank_13_letter",
    },
    "14 letter": {
      label: "14 Letter",
      prefix: "fourteenLetter",
      columnPrefix: "fourteen_letter",
      rankColumn: "monthly_rank_14_letter",
    },
    "15 letter": {
      label: "15 Letter",
      prefix: "fifteenLetter",
      columnPrefix: "fifteen_letter",
      rankColumn: "monthly_rank_15_letter",
    },
    "16 letter": {
      label: "16 Letter",
      prefix: "sixteenLetter",
      columnPrefix: "sixteen_letter",
      rankColumn: "monthly_rank_16_letter",
    },
    "17 letter": {
      label: "17 Letter",
      prefix: "seventeenLetter",
      columnPrefix: "seventeen_letter",
      rankColumn: "monthly_rank_17_letter",
    },
    "18 letter": {
      label: "18 Letter",
      prefix: "eighteenLetter",
      columnPrefix: "eighteen_letter",
      rankColumn: "monthly_rank_18_letter",
    },
    "19 letter": {
      label: "19 Letter",
      prefix: "nineteenLetter",
      columnPrefix: "nineteen_letter",
      rankColumn: "monthly_rank_19_letter",
    },
    "20 letter": {
      label: "20 Letter",
      prefix: "twentyLetter",
      columnPrefix: "twenty_letter",
      rankColumn: "monthly_rank_20_letter",
    },
    "21 letter": {
      label: "21 Letter",
      prefix: "twentyoneLetter",
      columnPrefix: "twentyone_letter",
      rankColumn: "monthly_rank_21_letter",
    },
    "22 letter": {
      label: "22 Letter",
      prefix: "twentytwoLetter",
      columnPrefix: "twentytwo_letter",
      rankColumn: "monthly_rank_22_letter",
    },
    "23 letter": {
      label: "23 Letter",
      prefix: "twentythreeLetter",
      columnPrefix: "twentythree_letter",
      rankColumn: "monthly_rank_23_letter",
    },
  };

  const selectedWordPack = WORD_PACKS[wordPack] ?? WORD_PACKS.all;

  const prefix = selectedWordPack.prefix;
  const numberPrefix = selectedWordPack.prefix;

  const getSortBy = (sortBy: string, pack: string) => {
    const selectedPack = WORD_PACKS[pack] ?? WORD_PACKS.all;

    if (sortBy === "rank") return selectedPack.rankColumn;
    if (sortBy === "games_won") {
      return selectedPack.columnPrefix
        ? `${selectedPack.columnPrefix}_games_won`
        : "games_won";
    }
    if (sortBy === "games_lost") {
      return selectedPack.columnPrefix
        ? `${selectedPack.columnPrefix}_games_lost`
        : "games_lost";
    }
    if (sortBy.startsWith("games_won_in_")) {
      return selectedPack.columnPrefix
        ? `${selectedPack.columnPrefix}_${sortBy}`
        : sortBy;
    }
    if (sortBy === "best_streak") {
      return selectedPack.columnPrefix
        ? `${selectedPack.columnPrefix}_best_streak_rank`
        : "overall_best_streak_rank";
    }

    return selectedPack.rankColumn;
  };

  const sortByKey = getSortBy(sortBy, wordPack);

  const [leaderboardData, setLeaderboardData] = useState({ data: [] });

  const { data: monthlyData, isLoading: isLoadingMonthly, error: monthlyError } = useGetMonthlyWordleLeaderboardQuery({ page: Number(searchParams.get('page') || 1), orderBy: sortByKey });
  const { data: monthlyTop3Data, isLoading: isLoadingTop3Monthly, error: monthlyTop3Error } = useGetMonthlyWordleLeaderboardQuery({ page: 1, orderBy: sortByKey });

  useEffect(() => {
    if (monthlyError) {
      setLeaderboardData({ data: [] });
      return;
    }

    if (monthlyData?.data) {
      setLeaderboardData(monthlyData);
      return;
    }

    setLeaderboardData({ data: [] });
  }, [monthlyData, monthlyError, sortByKey]);

  function LeaderboardPagination() {
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className="text-text dark:text-darkText"
              href={`${window.location.pathname}?page=${monthlyData?.metadata?.previousPage}`}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink className="text-text dark:text-darkText" href={`${window.location.pathname}?page=${monthlyData?.metadata?.currentPage}`}>{ monthlyData?.metadata?.currentPage }</PaginationLink>
          </PaginationItem>
          <PaginationItem className="text-white">
            <PaginationEllipsis className="text-text dark:text-darkText" />
          </PaginationItem>
          { monthlyData?.metadata?.currentPage < monthlyData?.metadata?.totalPages && (
            <>
              <PaginationItem>
                <PaginationLink className="text-text dark:text-darkText" href={`${window.location.pathname}?page=${monthlyData?.metadata?.totalPages}`}>{ monthlyData?.metadata?.totalPages }</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  className="text-text dark:text-darkText"
                  href={`${window.location.pathname}?page=${monthlyData?.metadata?.nextPage}`}
                />
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </Pagination>
    )
  }

  function handleTimePeriodChange(value: string) {
    if (value === '/') {
      return router.push('/leaderboard/wordle/');
    }

    return router.push(`/leaderboard/wordle/${value}`);
  }

  if (
    isLoadingMonthly ||
    isLoadingTop3Monthly
  ) return <Loading />;
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl text-text dark:text-darkText font-semibold">Wordle | Monthly Leaderboard</h1>
        </div>
        <Card className="w-full max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              { monthlyTop3Data?.data?.slice(0, 3).map((player, index) => (
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
                          <p>Best Streak: {prefix ? player[`bestStreak${prefix}`] : player.monthlyBestStreak}</p>
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

                  <SelectItem value="4 letter">4 Letter</SelectItem>
                  <SelectItem value="5 letter">5 Letter</SelectItem>
                  <SelectItem value="5 letter crazy">5 Letter Crazy</SelectItem>
                  <SelectItem value="6 letter">6 Letter</SelectItem>
                  <SelectItem value="7 letter">7 Letter</SelectItem>
                  <SelectItem value="8 letter">8 Letter</SelectItem>
                  <SelectItem value="9 letter">9 Letter</SelectItem>
                  <SelectItem value="10 letter">10 Letter</SelectItem>
                  <SelectItem value="11 letter">11 Letter</SelectItem>
                  <SelectItem value="11 letter extended">11 Letter Extended</SelectItem>
                  <SelectItem value="12 letter">12 Letter</SelectItem>
                  <SelectItem value="13 letter">13 Letter</SelectItem>
                  <SelectItem value="14 letter">14 Letter</SelectItem>
                  <SelectItem value="15 letter">15 Letter</SelectItem>
                  <SelectItem value="16 letter">16 Letter</SelectItem>
                  <SelectItem value="17 letter">17 Letter</SelectItem>
                  <SelectItem value="18 letter">18 Letter</SelectItem>
                  <SelectItem value="19 letter">19 Letter</SelectItem>
                  <SelectItem value="20 letter">20 Letter</SelectItem>
                  <SelectItem value="21 letter">21 Letter</SelectItem>
                  <SelectItem value="22 letter">22 Letter</SelectItem>
                  <SelectItem value="23 letter">23 Letter</SelectItem>
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
                  {leaderboardData?.data?.length ? (
                    leaderboardData.data.map((entry, index) => (
                      <TableRow key={entry?.id}>
                        <TableCell className="font-medium">
                          { sortBy === 'rank' ?
                            (numberPrefix ? entry[`monthlyRank_${numberPrefix}`] : entry.monthlyRank) :
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
                        <TableCell className="text-right">{ prefix ? entry[`${prefix}GamesWon`] + entry[`${prefix}GamesLost`] : entry.gamesPlayed }</TableCell>
                        <TableCell className="text-right">{ prefix ? entry[`${prefix}GamesWon`] : entry.gamesWon }</TableCell>
                        <TableCell className="text-right">{ prefix ? entry[`${prefix}GamesLost`] : entry.gamesLost }</TableCell>
                        { sortBy.includes('games_won_in') && (
                          <TableCell className="text-right">
                            {prefix ? entry[`${prefix}GamesWonIn_${sortBy.substr(-1)}`] : entry[`gamesWonIn_${sortBy.substr(-1)}`]}
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={sortBy.includes('games_won_in') ? 6 : 5} className="text-center py-8 text-muted-foreground">
                        No leaderboard data is available for this word pack and timeframe.
                      </TableCell>
                    </TableRow>
                  )}
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
