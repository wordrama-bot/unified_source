"use client"
//import { useState } from "react";
//import { getAppInsights } from "@/utils/appInsights";
import { LeaderboardNav } from "@/components/navbar/wordle-leaderboard";
import SubscriptionBadge from '../SubscriptionBadge';
import { useRouter } from "next/navigation"
import Loading from '@/sections/loading';
import {
  useGetMyYearlyWordleLeaderboardPostitionQuery,
  useGetYearlyWordleLeaderboardQuery
} from "@/redux/api/wordrama";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import PlayerAvatar from '@/components/avatar/PlayerAvatar';
import { useAuth } from '@/providers/auth-provider';
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

export default function WordleYearlyLeaderboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  //getAppInsights().trackPageView({ name: 'Wordle Yearly Leaderboard' });
  //type SortKey = "games_won" | "games_lost" | "games_played" | "losses" | "bestStreak" | "level" | "gamesWon1" | "gamesWon2" | "gamesWon3" | "gamesWon4" | "gamesWon5" | "gamesWon6"

  const [timePeriod, setTimePeriod] = useState('yearly')
  const [wordPack, setWordPack] = useState((searchParams.get('wordPack') || "all").toLowerCase())
  const [sortBy, setSortBy] = useState((searchParams.get('sortBy') || "rank").toLowerCase())//useState<SortKey>("score")

  // Keep controls synchronized with browser Back/Forward navigation.
  useEffect(() => {
    setWordPack((searchParams.get('wordPack') || 'all').toLowerCase());
    setSortBy((searchParams.get('sortBy') || 'rank').toLowerCase());
  }, [searchParams]);


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
      rankColumn: "yearly_rank",
    },
    "3 letter": {
      label: "3 Letter",
      prefix: "threeLetter",
      columnPrefix: "three_letter",
      rankColumn: "yearly_rank_three_letter",
    },
    "3 letter crazy": {
      label: "3 Letter Crazy",
      prefix: "threeLetterCrazy",
      columnPrefix: "three_letter_crazy",
      rankColumn: "yearly_rank_three_letter_crazy",
    },
    "5 letter unhinged": {
      label: "5 Letter Unhinged (18+)",
      prefix: "fiveLetterUnhinged",
      columnPrefix: "five_letter_unhinged",
      rankColumn: "yearly_rank_five_letter_unhinged",
    },
    "4 letter": {
      label: "4 Letter",
      prefix: "fourLetter",
      columnPrefix: "four_letter",
      rankColumn: "yearly_rank_4_letter",
    },
    "5 letter": {
      label: "5 Letter",
      prefix: "fiveLetter",
      columnPrefix: "five_letter",
      rankColumn: "yearly_rank_5_letter",
    },
    "5 letter crazy": {
      label: "5 Letter Crazy",
      prefix: "fiveLetterCrazy",
      columnPrefix: "five_letter_crazy",
      rankColumn: "yearly_rank_five_letter_crazy",
    },
    "6 letter": {
      label: "6 Letter",
      prefix: "sixLetter",
      columnPrefix: "six_letter",
      rankColumn: "yearly_rank_6_letter",
    },
    "7 letter": {
      label: "7 Letter",
      prefix: "sevenLetter",
      columnPrefix: "seven_letter",
      rankColumn: "yearly_rank_7_letter",
    },
    "8 letter": {
      label: "8 Letter",
      prefix: "eightLetter",
      columnPrefix: "eight_letter",
      rankColumn: "yearly_rank_8_letter",
    },
    "9 letter": {
      label: "9 Letter",
      prefix: "nineLetter",
      columnPrefix: "nine_letter",
      rankColumn: "yearly_rank_9_letter",
    },
    "10 letter": {
      label: "10 Letter",
      prefix: "tenLetter",
      columnPrefix: "ten_letter",
      rankColumn: "yearly_rank_10_letter",
    },
    "11 letter": {
      label: "11 Letter",
      prefix: "elevenLetter",
      columnPrefix: "eleven_letter",
      rankColumn: "yearly_rank_11_letter",
    },
    "12 letter": {
      label: "12 Letter",
      prefix: "twelveLetter",
      columnPrefix: "twelve_letter",
      rankColumn: "yearly_rank_12_letter",
    },
    "13 letter": {
      label: "13 Letter",
      prefix: "thirteenLetter",
      columnPrefix: "thirteen_letter",
      rankColumn: "yearly_rank_13_letter",
    },
    "14 letter": {
      label: "14 Letter",
      prefix: "fourteenLetter",
      columnPrefix: "fourteen_letter",
      rankColumn: "yearly_rank_14_letter",
    },
    "15 letter": {
      label: "15 Letter",
      prefix: "fifteenLetter",
      columnPrefix: "fifteen_letter",
      rankColumn: "yearly_rank_15_letter",
    },
    "16 letter": {
      label: "16 Letter",
      prefix: "sixteenLetter",
      columnPrefix: "sixteen_letter",
      rankColumn: "yearly_rank_16_letter",
    },
    "17 letter": {
      label: "17 Letter",
      prefix: "seventeenLetter",
      columnPrefix: "seventeen_letter",
      rankColumn: "yearly_rank_17_letter",
    },
    "18 letter": {
      label: "18 Letter",
      prefix: "eighteenLetter",
      columnPrefix: "eighteen_letter",
      rankColumn: "yearly_rank_18_letter",
    },
    "19 letter": {
      label: "19 Letter",
      prefix: "nineteenLetter",
      columnPrefix: "nineteen_letter",
      rankColumn: "yearly_rank_19_letter",
    },
    "20 letter": {
      label: "20 Letter",
      prefix: "twentyLetter",
      columnPrefix: "twenty_letter",
      rankColumn: "yearly_rank_20_letter",
    },
    "21 letter": {
      label: "21 Letter",
      prefix: "twentyoneLetter",
      columnPrefix: "twentyone_letter",
      rankColumn: "yearly_rank_21_letter",
    },
    "22 letter": {
      label: "22 Letter",
      prefix: "twentytwoLetter",
      columnPrefix: "twentytwo_letter",
      rankColumn: "yearly_rank_22_letter",
    },
    "23 letter": {
      label: "23 Letter",
      prefix: "twentythreeLetter",
      columnPrefix: "twentythree_letter",
      rankColumn: "yearly_rank_23_letter",
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

  const sortRankColumn = selectedWordPack.rankColumn;
  const sortStatistic = sortBy === 'games_won'
    ? (selectedWordPack.columnPrefix ? `${selectedWordPack.columnPrefix}_games_won` : 'games_won')
    : sortBy === 'games_lost'
      ? (selectedWordPack.columnPrefix ? `${selectedWordPack.columnPrefix}_games_lost` : 'games_lost')
      : sortBy === 'games_played'
        ? (selectedWordPack.columnPrefix ? `${selectedWordPack.columnPrefix}_games_played` : 'games_played')
        : sortBy === 'best_streak'
          ? (selectedWordPack.columnPrefix ? `${selectedWordPack.columnPrefix}_best_streak` : 'overall_best_streak')
          : sortBy === 'current_streak' && wordPack !== 'all'
            ? `${selectedWordPack.columnPrefix}_current_streak`
            : null;
  const sortByKey = sortStatistic ? `${sortRankColumn}__sort__${sortStatistic}` : sortRankColumn;

  const leaderboardUrl = (page: number, nextSort = sortBy, nextPack = wordPack) => {
    const params = new URLSearchParams();
    params.set('page', String(Math.max(1, page || 1)));
    if (nextPack !== 'all') params.set('wordPack', nextPack);
    if (nextSort !== 'rank') params.set('sortBy', nextSort);
    return `${window.location.pathname}?${params.toString()}`;
  };
  const changeSort = (nextSort: string) => {
    setSortBy(nextSort);
    router.push(leaderboardUrl(1, nextSort));
  };

  const [leaderboardData, setLeaderboardData] = useState({ data: [] });
  const { user } = useAuth();
  const { data: myPositionResponse, isError: myPositionError, isFetching: myPositionLoading } = useGetMyYearlyWordleLeaderboardPostitionQuery(undefined, { skip: !user?.id });
  const myPosition = myPositionResponse?.data;
  const rankField = selectedWordPack.rankColumn.replace(/_([a-z])/g, (_: string, char: string) => char.toUpperCase());
  const myWins = Number(prefix ? myPosition?.[`${prefix}GamesWon`] : myPosition?.gamesWon) || 0;
  const myLosses = Number(prefix ? myPosition?.[`${prefix}GamesLost`] : myPosition?.gamesLost) || 0;
  const myRank = myWins + myLosses > 0 ? Number(myPosition?.[rankField]) : 0;
  const myRankIsValid = Number.isFinite(myRank) && myRank > 0;
  const myPlayerIsOnPage = Boolean(user?.id && leaderboardData.data.some((entry: any) => entry?.player === user.id));


  const { data: yearlyData, isLoading: isLoadingYearly, error: yearlyError } = useGetYearlyWordleLeaderboardQuery({ page: Number(searchParams.get('page') || 1), orderBy: sortByKey });
  const { data: yearlyTop3Data, isLoading: isLoadingTop3Yearly, error: yearlyTop3Error } = useGetYearlyWordleLeaderboardQuery({ page: 1, orderBy: sortRankColumn });

  useEffect(() => {
    if (yearlyError) {
      setLeaderboardData({ data: [] });
      return;
    }

    if (yearlyData?.data) {
      setLeaderboardData(yearlyData);
      return;
    }

    setLeaderboardData({ data: [] });
  }, [yearlyData, yearlyError, sortByKey]);

  function handleTimePeriodChange(value: string) {
    if (value === '/') {
      return router.push('/leaderboard/wordle/');
    }

    return router.push(`/leaderboard/wordle/${value}`);
  }

  function LeaderboardPagination() {
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className="text-text dark:text-darkText"
              href={leaderboardUrl(yearlyData?.metadata?.previousPage)}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink className="text-text dark:text-darkText" href={leaderboardUrl(yearlyData?.metadata?.currentPage)}>{ yearlyData?.metadata?.currentPage }</PaginationLink>
          </PaginationItem>
          <PaginationItem className="text-white">
            <PaginationEllipsis className="text-text dark:text-darkText" />
          </PaginationItem>
          { yearlyData?.metadata?.currentPage < yearlyData?.metadata?.totalPages && (
            <>
              <PaginationItem>
                <PaginationLink className="text-text dark:text-darkText" href={leaderboardUrl(yearlyData?.metadata?.totalPages)}>{ yearlyData?.metadata?.totalPages }</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  className="text-text dark:text-darkText"
                  href={leaderboardUrl(yearlyData?.metadata?.nextPage)}
                />
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </Pagination>
    )
  }

  if (
    isLoadingYearly ||
    isLoadingTop3Yearly
  ) return <Loading />;
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl text-text dark:text-darkText font-semibold">Wordle | { new Date().getFullYear() } Leaderboard</h1>
        </div>
        <Card className="w-full max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Leaderboard</CardTitle>
            <p className="text-sm text-muted-foreground">Please note that leaderboards update at regular intervals to allow for faster loading times and manageable data costs. Daily leaderboards refresh every 10 minutes, weekly every 15 minutes, monthly every 30 minutes, yearly every hour, and all-time every 2 hours.</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              { yearlyTop3Data?.data?.slice(0, 3).map((player, index) => (
                <Card key={player?.player}>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Medal className={`h-6 w-6 ${index === 0 ? "text-yellow-400" : index === 1 ? "text-gray-400" : "text-amber-600"}`} />
                            <Link href={`/player/${player?.player}`} className="flex min-w-0 items-center gap-2 font-semibold hover:underline">
                               <PlayerAvatar profileImage={player?.profileImage} displayName={player?.displayName || 'Player'} avatarStyleKey={player?.avatarStyleKey} avatarFrameKey={player?.avatarFrameKey} size={36} />
                               <span className="truncate">{player?.displayName}</span>
                             </Link>
                             <SubscriptionBadge subscriptionKey={player?.subscriptionKey} />
                          </div>
                          <span className="text-2xl font-bold"></span>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          <p>Wins: { prefix ? player[`${prefix}GamesWon`] : player.gamesWon  } | Losses: { prefix ? player[`${prefix}GamesLost`] : player.gamesLost  }</p>
                          <p>Best Streak: {prefix ? player[`${prefix}BestStreak`] : player.yearlyBestStreak}</p>
                        </div>
                      </CardContent>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="flex justify-between space-x-4">
                        <PlayerAvatar
                          profileImage={player?.profileImage}
                          displayName={player?.displayName || 'Player'}
                          avatarStyleKey={player?.avatarStyleKey}
                          avatarFrameKey={player?.avatarFrameKey}
                          size={96}
                        />
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
            {user?.id && !myPositionLoading && (
              <div className="mb-6 rounded-md border border-primary/40 bg-primary/5 p-4" aria-label="Your leaderboard position">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your Rank · {selectedWordPack.label}</div>
                {myPositionError ? (
                  <p className="text-sm text-muted-foreground">Your position is temporarily unavailable.</p>
                ) : myRankIsValid ? (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                         <PlayerAvatar profileImage={myPosition?.profileImage} displayName={myPosition?.displayName || 'You'} avatarStyleKey={myPosition?.avatarStyleKey} avatarFrameKey={myPosition?.avatarFrameKey} size={36} />
                          <SubscriptionBadge subscriptionKey={myPosition?.subscriptionKey} />
                         <div className="text-lg font-semibold">#{myRank} · {myPosition?.displayName || 'You'}</div>
                       </div>

                    </div>
                    <div className="text-sm">{myWins} wins · {myLosses} losses</div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">You are not ranked for this word pack and timeframe.</p>
                )}
              </div>
            )}
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
                setSortBy('rank');
                router.push(leaderboardUrl(1, 'rank', value));
              }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select word pack" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Word Packs</SelectItem>
                  <SelectItem value="3 letter">3 Letter</SelectItem>
                  <SelectItem value="3 letter crazy">3 Letter Crazy</SelectItem>
                  <SelectItem value="5 letter unhinged">5 Letter Unhinged (18+)</SelectItem>

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
                    Sort by: {{ rank: 'Rank', games_played: 'Games Played', games_won: 'Games Won', games_lost: 'Games Lost', current_streak: 'Current Streak', best_streak: 'Best Streak' }[sortBy] || 'Rank'}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => changeSort('rank')}>Rank</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeSort('games_played')}>Games Played</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeSort('games_won')}>Games Won</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeSort('games_lost')}>Games Lost</DropdownMenuItem>
                  {wordPack !== 'all' && <DropdownMenuItem onClick={() => changeSort('current_streak')}>Current Streak</DropdownMenuItem>}
                  <DropdownMenuItem onClick={() => changeSort('best_streak')}>Best Streak</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {sortBy !== 'rank' && (
              <p className="mb-3 text-sm text-muted-foreground">Rows are sorted by the selected statistic. Rank reflects official leaderboard standing.</p>
            )}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><button type="button" className="inline-flex items-center gap-1 hover:underline" onClick={() => changeSort('rank')}>Rank {sortBy === 'rank' ? ('rank' === 'rank' ? '↑' : '↓') : ''}</button></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right"><button type="button" className="inline-flex items-center gap-1 hover:underline" onClick={() => changeSort('games_played')}>Games Played {sortBy === 'games_played' ? ('games_played' === 'rank' ? '↑' : '↓') : ''}</button></TableHead>
                    <TableHead className="text-right"><button type="button" className="inline-flex items-center gap-1 hover:underline" onClick={() => changeSort('games_won')}>Won {sortBy === 'games_won' ? ('games_won' === 'rank' ? '↑' : '↓') : ''}</button></TableHead>
                    <TableHead className="text-right"><button type="button" className="inline-flex items-center gap-1 hover:underline" onClick={() => changeSort('games_lost')}>Lost {sortBy === 'games_lost' ? ('games_lost' === 'rank' ? '↑' : '↓') : ''}</button></TableHead>
                    {wordPack !== 'all' && <TableHead className="text-right"><button type="button" className="hover:underline" onClick={() => changeSort('current_streak')}>Current Streak {sortBy === 'current_streak' ? '↓' : ''}</button></TableHead>}
                    <TableHead className="text-right"><button type="button" className="hover:underline" onClick={() => changeSort('best_streak')}>Best Streak {sortBy === 'best_streak' ? '↓' : ''}</button></TableHead>
                    { sortBy.includes('games_won_in') && (
                      <TableHead className="text-right">Games won in {sortBy.substr(-1)}</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboardData?.data?.length ? (
                    leaderboardData.data.map((entry, index) => (
                      <TableRow key={entry?.id} className={user?.id && entry?.player === user.id ? "bg-primary/10 ring-1 ring-inset ring-primary/30" : undefined}>
                        <TableCell className="font-medium">
                          {entry[selectedWordPack.rankColumn.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase())]}
                        </TableCell>
                        <TableCell>
                          <div className="inline-flex min-w-0 items-center gap-2">
<HoverCard>
                            <HoverCardTrigger asChild>
                              <Link className="inline-flex min-w-0 items-center gap-2 hover:underline" href={`/player/${entry?.player}`}>
                                 <PlayerAvatar profileImage={entry?.profileImage} displayName={entry?.displayName || 'Player'} avatarStyleKey={entry?.avatarStyleKey} avatarFrameKey={entry?.avatarFrameKey} size={32} />
                                 <span className="truncate">{entry?.displayName}</span>
                               </Link>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <div className="flex justify-between space-x-4">
                                <PlayerAvatar
                                  profileImage={entry?.profileImage}
                                  displayName={entry?.displayName || 'Player'}
                                  avatarStyleKey={entry?.avatarStyleKey}
                                  avatarFrameKey={entry?.avatarFrameKey}
                                  size={96}
                                />
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
                            <SubscriptionBadge subscriptionKey={entry?.subscriptionKey} />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{ prefix ? entry[`${prefix}GamesWon`] + entry[`${prefix}GamesLost`] : entry.gamesPlayed }</TableCell>
                        <TableCell className="text-right">{ prefix ? entry[`${prefix}GamesWon`] : entry.gamesWon }</TableCell>
                        <TableCell className="text-right">{ prefix ? entry[`${prefix}GamesLost`] : entry.gamesLost }</TableCell>
                        { sortBy.includes('games_won_in') && (
                          <TableCell className="text-right">
                            {prefix ? entry[`${prefix}GamesWonIn_${sortBy.substr(-1)}`] : entry[`gamesWonIn_${sortBy.substr(-1)}`]}
                          </TableCell>
                        )}
                        {wordPack !== 'all' && <TableCell className="text-right">{entry[`${prefix}CurrentStreak`] ?? 0}</TableCell>}
                        <TableCell className="text-right">{prefix ? (entry[`${prefix}BestStreak`] ?? 0) : (entry.overallBestStreak ?? 0)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={wordPack !== 'all' ? 7 : 6} className="text-center py-8 text-muted-foreground">
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
