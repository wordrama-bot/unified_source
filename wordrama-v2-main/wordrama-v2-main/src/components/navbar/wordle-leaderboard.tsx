import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { getLeaderboardUiState } from '@/redux/ui/helpers';
import { setWordleLeaderboardUiState } from '@/redux/ui/actions';

export function LeaderboardNav({
  game = 'WORDLE'
}) {
  const dispatch = useDispatch();
  const path = usePathname();
  const uiState = getLeaderboardUiState();

  return (
    <nav
      className="grid gap-4 text-sm text-text dark:text-darkText text-muted-foreground justify-start"
    >
      <Link
        href="/leaderboard/wordle"
        className={path === '/leaderboard/wordle' ? 'text-primary font-semibold' : 'hover:underline'}
      >
        All Time
      </Link>
      <Link
        href="/leaderboard/wordle/daily"
        className={path === '/leaderboard/wordle/daily' ? 'text-primary font-semibold' : 'hover:underline'}
      >
        Daily
      </Link>
      <Link
        href="/leaderboard/wordle/weekly"
        className={path === '/leaderboard/wordle/weekly' ? 'text-primary font-semibold' : 'hover:underline'}
      >
        Weekly
      </Link>
      <Link
        href="/leaderboard/wordle/monthly"
        className={path === '/leaderboard/wordle/monthly' ? 'text-primary font-semibold' : 'hover:underline'}
      >
        Monthly
      </Link>
      <Link
        href="/leaderboard/wordle/yearly"
        className={path === '/leaderboard/wordle/yearly' ? 'text-primary font-semibold' : 'hover:underline'}
      >
        Yearly
      </Link>
      { game === 'WORDLE' && uiState && (
        <Sheet>
          <SheetTrigger>
            <Button>Settings</Button>
          </SheetTrigger>
          <SheetContent className="bg-bg">
            <SheetHeader>
              <SheetTitle>Leaderboard Settings</SheetTitle>
              <SheetDescription>
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Separator />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="all" className="text-right">
                  Show All Modes
                </Label>
                <Switch
                  checked={uiState?.WORDLE?.showAll || false}
                  onCheckedChange={
                    (checked) => dispatch(setWordleLeaderboardUiState({
                      showAllModes: checked
                    }))
                  }
                />
                <Label htmlFor="name" className="text-right">
                  By Word Pack
                </Label>
                <Switch
                  checked={uiState[game].showByWordLength}
                  onCheckedChange={
                    (checked) => dispatch(setWordleLeaderboardUiState({
                      showByWordLength: checked
                    }))
                  }
                />
              </div>
              <Separator />
                <div className="grid grid-cols-4 items-center gap-4">
                  <Select>
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Select a Word Pack" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FOUR_LETTER">4 Letter</SelectItem>
                      <SelectItem value="FIVE_LETTER">5 Letter</SelectItem>
                      <SelectItem value="SIX_LETTER">6 Letter</SelectItem>
                      <SelectItem value="SEVEN_LETTER">7 Letter</SelectItem>
                      <SelectItem value="EIGHT_LETTER">8 Letter</SelectItem>
                      <SelectItem value="NINE_LETTER">9 Letter</SelectItem>
                      <SelectItem value="TEN_LETTER">10 Letter</SelectItem>
                      <SelectItem value="ELEVEN_LETTER">11 Letter</SelectItem>
                      <SelectItem value="TWELVE_LETTER">12 Letter</SelectItem>
                      <SelectItem value="THIRTEEN_LETTER">13 Letter</SelectItem>
                      <SelectItem value="FOURTEEN_LETTER">14 Letter</SelectItem>
                      <SelectItem value="FIFTEEN_LETTER">15 Letter</SelectItem>
                      <SelectItem value="SIXTEEN_LETTER">16 Letter</SelectItem>
                      <SelectItem value="SEVENTEEN_LETTER">17 Letter</SelectItem>
                      <SelectItem value="EIGHTEEN_LETTER">18 Letter</SelectItem>
                      <SelectItem value="NINETEEN_LETTER">19 Letter</SelectItem>
                      <SelectItem value="TWENTY_LETTER">20 Letter</SelectItem>
                      <SelectItem value="TWENTYONE_LETTER">21 Letter</SelectItem>
                      <SelectItem value="TWENTYTWO_LETTER">22 Letter</SelectItem>
                      <SelectItem value="TWENTYTHREE_LETTER">23 Letter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </nav>
  );
}
