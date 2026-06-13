import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Teams | Wordrama",
  description: "Are you a streamer or a content creator? Create a team of your own and invite your followers to join you on Wordrama!",
  keywords: ['teams', 'streamers', 'content creators', 'wordrama', 'wordle tiktok', 'wordle tok', 'games for streamers', 'word games for streamers', 'twitch streamer', 'tiktok live', 'tiktok live streamer', 'tiktok live stream', 'tiktok live stream games', 'tiktok live stream word games', 'tiktok live stream wordle'],
  openGraph: {
    title: "Teams | Wordrama",
    description: "Are you a streamer or a content creator? Create a team of your own and invite your followers to join you on Wordrama!",
  }
};

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
