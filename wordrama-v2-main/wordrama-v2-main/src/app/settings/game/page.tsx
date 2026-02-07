"use client"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SettingsNav } from "@/components/navbar/settings";

export default function GameSettingsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl text-text dark:text-darkText font-semibold">Game Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <SettingsNav />
          <div className="grid grid-cols-2 gap-6">
            <Card x-chunk="dashboard-04-chunk-1" className="bg-bg dark:bg-darkBg border-border dark:darkBorder col-span-1 shadow-light dark:shadow-dark rounded-base border-2">
              <CardHeader>
                <CardTitle>Game Preferences</CardTitle>
                <CardDescription>
                  
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="flex items-center space-x-2 mt-2">
                    <Switch id="colour-blind" />
                    <Label htmlFor="colour-blind">Colour Blind Mode</Label>
                  </div>
                  <div className="flex items-center space-x-2 mt-6">
                    <Switch id="hard-mode" />
                    <Label htmlFor="hard-mode">Hard Mode</Label>
                  </div>
                  <div className="flex items-center space-x-2 mt-6">
                    <Switch id="confetti-enabled" />
                    <Label htmlFor="confetti-enabled">Confetti Enabled</Label>
                  </div>
                  <div className="flex items-center space-x-2 mt-6 mb-2">
                    <Switch id="dark-mode" />
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>Save</Button>
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-04-chunk-1" className="bg-bg dark:bg-darkBg border-border dark:darkBorder col-span-1 shadow-light dark:shadow-dark rounded-base border-2">
              <CardHeader>
                <CardTitle>Wordle Preferences</CardTitle>
                <CardDescription>
                  
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a word length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select a word length</SelectLabel>
                        <SelectItem value="5">5 Letter</SelectItem>
                        <SelectItem value="6">6 Letter</SelectItem>
                        <SelectItem value="7">7 Letter</SelectItem>
                        <SelectItem value="8">8 Letter</SelectItem>
                        <SelectItem value="9">9 Letter</SelectItem>
                        <SelectItem value="10">10 Letter</SelectItem>
                        <SelectItem value="11">11 Letter</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>Save</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
