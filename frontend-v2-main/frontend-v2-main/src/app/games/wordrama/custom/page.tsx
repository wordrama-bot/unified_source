"use client"
import { useState } from 'react';
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
import { useCreateCustomWorldeMutation } from '@/redux/api/wordrama';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

export default function CreateWordlePage() {
  const { toast } = useToast();
  const [customWord, setCustomWord] = useState('');
  const [hint, setHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [createCustom] = useCreateCustomWorldeMutation();
  const [shareCode, setShareCode] = useState();

  async function handleCreateCustom() {
    if (hint.toLowerCase().includes(customWord.toLowerCase())) return toast({ title: 'Hint should not contain the word' });
    const { data: custom } = await createCustom({ customWord, hint });
    if (custom?.data) {
      setShareCode(custom?.data.shareCode);
      setLoading(false);
    }
  }

  if (!loading && shareCode && shareCode.length === 6) return (
    <div className="flex items-center justify-center pt-12">
      <Card className="w-[330px]">
        <CardHeader>
          <CardTitle>Custom created</CardTitle>
          <CardDescription>Share the join code with your friends</CardDescription>
        </CardHeader>
        <CardContent>
          <InputOTP
            maxLength={6}
            readOnly={true}
            value={shareCode}
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
        <CardFooter className='justify-between'>
          <Button className="mt-5 mr-2" onClick={() => {
            navigator.clipboard.writeText(`https://wordrama.io/games/wordrama/join/${shareCode}`);
            toast({ title: 'Copied to clipboard' });
            return;
          }}>
            Copy
          </Button>
          <Button className="mt-5" onClick={() => { setShareCode(null); setHint(''); setCustomWord(''); }}>Create another</Button>
        </CardFooter>
      </Card>
      <div className="flex items-center justify-center pt-5 pb-12">
        <Link href="/games/wordrama/custom">
          <Button>Create a custom</Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center pt-12">
      <Card className="w-[330px]">
        <CardHeader>
          <CardTitle>Create a custom wordle</CardTitle>
          <CardDescription>Enter a word</CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="word">Custom Word</Label>
          <Input
            placeholder='Custom Word'
            className='mb-5'
            value={customWord}
            onChange={(e) => {
              setCustomWord(e.target.value.toUpperCase());
            }}
          />

          <Label htmlFor="hint">Give a hint (Optional)</Label>
          <Input
            placeholder='Hint'
            value={hint}
            onChange={(e) => { setHint(e.target.value) }}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/games/wordrama/join">
            <Button>
              Join a game
            </Button>
          </Link>
          <Button
            disabled={customWord.length < 4 || customWord.length > 23}
            onClick={() => {
              setLoading(true);
              handleCreateCustom();
            }}
          >
            Create
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
