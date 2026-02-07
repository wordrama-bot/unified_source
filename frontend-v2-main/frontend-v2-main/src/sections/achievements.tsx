import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { SpellBee, Wordle, More } from '@/components/assets';
import { useAuth } from '@/providers/auth-provider';
import { Progress } from '@/components/ui/progress';
import { useGetMyChallengesQuery } from '@/redux/api/wordrama';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { FilterIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import Loading from '@/sections/loading';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function Achievements() {
  const [ statusFilter, setStatusFilter ] = useState('ALL');
  const { data: challenges, error, isLoading } = useGetMyChallengesQuery(statusFilter);

  //const { role } = useAuth();
  if (isLoading) return <Loading />;
  return (
    <section className="border-t-border dark:border-t-darkBorder dark:bg-darkBg border-t-2 bg-bg py-20 font-base lg:py-[50px]">
      <div className="mx-auto grid w-container max-w-full grid-cols-1 gap-5 px-5 sm:grid-cols-2 lg:grid-cols-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button className='fixed top-20 right-5' variant='default'><FilterIcon className='w-6 h-6'/></Button>
          </SheetTrigger>
          <SheetContent className='bg-bg'>
            <SheetHeader>
              <SheetTitle>Filter</SheetTitle>
              <SheetDescription>

              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Separator />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Status
                </Label>
                <RadioGroup defaultValue="ALL" value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ALL" id="ALL" />
                    <Label htmlFor="ALL">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="LOCKED" id="LOCKED" />
                    <Label htmlFor="LOCKED">Locked</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="IN_PROGRESS" id="IN_PROGRESS" />
                    <Label htmlFor="IN_PROGRESS">In Progress</Label>
                  </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="COMPLETE" id="COMPLETE" />
                      <Label htmlFor="COMPLETE">Complete</Label>
                    </div>
                </RadioGroup>
              </div>
              <Separator />
            </div>
            {
            // <SheetFooter>
            //   <SheetClose asChild>
            //     <Button type="submit">Save changes</Button>
            //   </SheetClose>
            // </SheetFooter>
            }
          </SheetContent>
        </Sheet>
        { challenges?.data.map((challenge, challengeIdx) => {
          const { name, description, coinReward, xpReward, progress, status } = challenge;
          let reward = '';
          if (coinReward > 0 && xpReward > 0){
            reward = `${coinReward} coins and ${xpReward} XP`;
          } else if (coinReward > 0) {
            reward = `${coinReward} coins`;
          } else if (xpReward > 0) {
            reward = `${xpReward} XP`;
          }

          return (
            <Link href={'/'} key={challengeIdx}>
              {
                //${link && 'hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none dark:bg-darkBg shadow-light dark:shadow-dark flex flex-col gap-3 rounded-base bg-white p-5'}
              }
              <div
                className={`${!progress ? 'grayscale' : '' } border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark dark:bg-darkBg flex flex-col gap-3 rounded-base bg-bg p-5`}>
                {// <Icon />
                }
                  <div className="flex items-center justify-between">
                    <h4 className="mt-2 text-xl font-heading">
                      {name}
                    </h4>
                    { status && status === 'COMPLETE' && (
                      <span className="border-border text-text dark:border-darkBorder rounded-base border-2 bg-main px-2 py-0.5 text-sm">
                        Complete
                      </span>
                    )}
                    { status && status === 'IN_PROGRESS' && (
                      <span className="border-border text-text dark:border-darkBorder rounded-base border-2 bg-main px-2 py-0.5 text-sm">
                        In Progress
                      </span>
                    )}
                    { status && status === 'UNLOOKED' && (
                      <span className="border-border text-text dark:border-darkBorder rounded-base border-2 bg-main px-2 py-0.5 text-sm">
                        Unlocked
                      </span>
                    )}
                      { !progress || status === 'LOCKED' && (
                        <span className="border-border text-text dark:border-darkBorder rounded-base border-2 bg-main px-2 py-0.5 text-sm">
                          Locked
                        </span>
                      )}
                  </div>
                <p>{description} to earn { reward }</p>
                  { status === 'IN_PROGRESS' && progress < 100 ? (
                    <>
                    <Separator className='mt-4 mb-4'/>
                      <Progress value={progress || 0} className="w-[100%]" />
                    </>
                  ) : status === 'COMPLETE' ? (
                    <p className='text-center text-6xl'>🏆</p>
                  ) : null }
              </div>
            </Link>
          )
        }) }
      </div>
    </section>
  )
}
