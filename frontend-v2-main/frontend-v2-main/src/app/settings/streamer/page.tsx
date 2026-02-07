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
import { Input } from "@/components/ui/input";
import { SettingsNav } from "@/components/navbar/settings";

export default function StreamerSettingsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl text-text dark:text-darkText font-semibold">Streamer Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <SettingsNav />
          <div className="grid grid-cols-2 gap-6">
            <Card x-chunk="dashboard-04-chunk-1" className="bg-bg dark:bg-darkBg border-border dark:darkBorder shadow-light dark:shadow-dark rounded-base border-2">
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>
                  
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <Input placeholder="TikTok Username" />
                  <Input placeholder="Twitch Username" className="mt-2" />
                  <Input placeholder="YouTube Username" className="mt-2" />
                </form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>Save</Button>
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-04-chunk-1" className="bg-bg dark:bg-darkBg border-border dark:darkBorder shadow-light dark:shadow-dark rounded-base border-2">
              <CardHeader>
                <CardTitle>App</CardTitle>
                <CardDescription>
                  
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="flex items-center space-x-2 mt-2">
                    <Switch id="hide-display-name" />
                    <Label htmlFor="hide-display-name">Hide Display Name</Label>
                  </div>
                  <div className="flex items-center space-x-2 mt-6">
                    <Switch id="hide-account-settings" />
                    <Label htmlFor="hide-account-settings">Hide Account Settings</Label>
                  </div>
                  <div className="flex items-center space-x-2 mt-6 mb-2">
                    <Switch id="hide-from-leaderboard" />
                    <Label htmlFor="hide-from-leaderboard">Hide From Leaderboard</Label>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>Save</Button>
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-04-chunk-1" className="bg-bg dark:bg-darkBg border-border dark:darkBorder shadow-light dark:shadow-dark rounded-base border-2">
              <CardHeader>
                <CardTitle>Referrals</CardTitle>
                <CardDescription>
                  You have referred 0 players
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <Input placeholder="Custom Referral Code" min={8} max={8} />
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
