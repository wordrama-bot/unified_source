"use client"
import { useEffect, useState } from 'react';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { redirect, useParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Loading from '@/sections/loading';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { useGetCustomWorldeQuery, useUpdateWordleSavedStateMutation } from '@/redux/api/wordrama';
import { setupCustomGame, resetCustomGame } from '@/redux/wordle/actions';
import { getWordleState } from '@/redux/wordle/helpers';
import { useToast } from '@/components/ui/use-toast';

export default function FindWordlePage() {
  const { toast } = useToast();
  const params = useParams();
  const dispatch = useDispatch();
  const wordleState = getWordleState();
  const [joinCode, setJoinCode] = useState(params.joinCode as string || '');
  const [loading, setLoading] = useState(false);
  const { data: customGame, isError, isLoading } =  useGetCustomWorldeQuery(joinCode);
  const [updateRemoteState] = useUpdateWordleSavedStateMutation();
  useEffect(() => {
    dispatch(resetCustomGame());
  }, []);

  if (joinCode && joinCode.length === 6 && !isError && wordleState?.custom?.solution && wordleState?.custom?.joinCode) {
    setLoading(true);
    updateRemoteState(wordleState);
    redirect('/games/wordrama');
  }

  if (loading) return <Loading />;
  return (
    <>
      <div className="flex items-center justify-center pt-12">
        <Card className="w-[330px]">
          <CardHeader>
            <CardTitle>You've been challenged</CardTitle>
            <CardDescription>Enter your join code</CardDescription>
          </CardHeader>
          <CardContent>
            <InputOTP
              maxLength={6}
              disabled={params.joinCode}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              value={joinCode}
              onChange={(newValue) => { setJoinCode(newValue.toUpperCase()) }}
              inputMode='text'
          >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </CardContent>
          <CardFooter className="flex justify-between">
            { !params.joinCode && (
              <Link href="/games/wordrama/custom">
                <Button>Create a custom</Button>
              </Link>
            )}
            <Button
              disabled={joinCode.length !== 6 && !customGame?.data?.customWord}
              onClick={() => {
                if (isError) {
                  setLoading(false);
                  return toast({ title: 'Invalid join code' });
                }
                setLoading(true);
                dispatch(setupCustomGame(joinCode, customGame?.data?.customWord, customGame?.data?.hint || ''));
              }}
            >
              Play Now
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
