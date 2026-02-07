import { useEffect, useState } from 'react';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { toast } from '@/components/ui/use-toast';

import { useCreateAccountMutation, useGetPublicPlayerByUsernameQuery } from '@/redux/api/wordrama';
import { redirect } from 'next/navigation';
import { Loading } from './loading';

export default function FirstLogin() {
  const [createAccount] = useCreateAccountMutation();
  const [createAccResp, setCreateAccResp] = useState({});
  const [formReady, setFormReady] = useState(false);
  const [userReady, setUserReady] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const { isSuccess: usernameTaken } = useGetPublicPlayerByUsernameQuery(username);

  useEffect(() => {
    if (referralCode.length > 0 && referralCode.length !== 8) return setFormReady(false);
    else if (username.length > 1 && username.length <= 25) return setFormReady(true);
    return setFormReady(false);
  }, [username])

  function convertBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result);
      }
      fileReader.onerror = (error) => {
        reject(error);
      }
    });
  };

  async function handleFileChange(event) {
    try {
      const file = event.target.files[0];
      if (file.size > 5 * 1000 * 1000) {
        toast({
          title: 'Image too big',
          description: 'Please use a file under 5MB',
        })
        return;
      }
      const base64 = await convertBase64(file);
      setProfileImage(base64);
    } catch(err) {
      console.log(err)
      toast({
        title: 'Something went wrong',
        description: '',
      })
    }
  };

  async function handleSubmit() {
    if (usernameTaken) return toast({
      title: 'Username Taken',
      description: 'This username is already taken, please try another one',
    });

    const usernamePattern = /^[a-zA-Z0-9._\-\s]+$/;
    if (!usernamePattern.test(username)) {
      toast({
        title: 'Invalid username',
        description: 'Username can contain letters, numbers, spaces, hyphens (-), underscores (_), and periods (.)',
      });
      return;
    }

    setUserLoading(true);
    const { data, error } = await createAccount({
      firstName,
      lastName,
      username,
      profileImage,
    });
    setUserLoading(false);

    if (error) return toast({
      title: 'Something went wrong',
      description: 'Please contact the team in Discord',
    });

    setCreateAccResp(data);
  }

  if (createAccResp && createAccResp?.status === 200) return redirect('/login')
  return (
    <div>
      <header className="dark:bg-darkBg inset-0 flex min-h-[20dvh] w-full flex-col items-center justify-center bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
        <div className="mx-auto w-container max-w-full px-5 text-center">
          <h2 className="px-5 text-center text-2xl font-heading md:text-3xl lg:mb-15 lg:text-4xl">
            {
              !userReady && userLoading ? 'Getting your profile ready, please wait... 🚀' : 'Welcome to Wordrama'
            }
          </h2>
          <p className="px-5 text-center text-base font-base md:text-lg lg:text-xl">
            {
              !userReady && userLoading ? 'We are setting up your profile, this will only take a few seconds.' : 'Please fill in the form below to complete your registration.'
            }
          </p>
        </div>
      </header>
      <section className="dark:bg-darkBg bg-bg font-base bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
        <div className="mx-auto grid sm:max-w-sm md:max-w-md lg:max-w-lg  max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          { !userReady && userLoading && (
            <Card
              x-chunk="dashboard-04-chunk-1"
              className="bg-bg dark:bg-darkBg border-border dark:darkBorder shadow-light dark:shadow-dark rounded-base border-2 lg:col-span-2 md:col-span-2 col-span-1"
            >
              <CardContent className='items-center justify-center grid gap-4 mt-4'>
                <Loading />
              </CardContent>
            </Card>
          )}
          { !userReady && !userLoading && (
            <Card
              x-chunk="dashboard-04-chunk-1"
              className="bg-bg dark:bg-darkBg border-border dark:darkBorder shadow-light dark:shadow-dark rounded-base border-2 lg:col-span-2 md:col-span-2 col-span-1"
            >
              <CardContent>
                <form className='flex items-center justify-center grid gap-4 mt-4'>
                  <div className="grid-gap-2">
                    <Label htmlFor="username" >Username</Label>
                    <Input
                      type="text"
                      id="username"
                      placeholder="Username"
                      value={username}
                      min={1}
                      max={25}
                      pattern="^[a-zA-Z0-9._\-\s]+$"
                      title="Username can contain letters, numbers, spaces, hyphens (-), underscores (_), and periods (.)"
                      required={true}
                      onChange={(e) => setUsername(e.target.value)}
                      className='mt-2 sm:max-w-sm md:max-w-md lg:max-w-lg'
                    />
                  </div>
                  <div className="grid w-full sm:max-w-sm md:max-w-md lg:max-w-lg gap-1.5 mt-1">
                    <Label htmlFor="avatar">Profile Picture (Optional)</Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/jpeg, image/png"
                      onChange={handleFileChange}
                      className="mt-2"
                    />
                    <Label htmlFor="avatar" className="mt-2" >JPG or PNG. 5MB max.</Label>
                  </div>
                  <div className="grid-gap-2 mt-10">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input type="text"
                      id="first-name"
                      placeholder="First Name (Optional)"
                      required={false}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="sm:max-w-sm md:max-w-md lg:max-w-lg mt-2"
                    />
                  </div>
                  <div className="grid-gap-2 mt-1">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      type="text"
                      id="last-name"
                      placeholder="Last Name (Optional)"
                      required={false}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="sm:max-w-sm md:max-w-md lg:max-w-lg mt-2"
                    />
                  </div>
                  <div className="grid-gap-2 mt-1">
                    <Label htmlFor="referral-code">Referral Code</Label>
                    <Input
                      type="text"
                      id="referral-code"
                      placeholder="Referral Code (Optional)"
                      required={false}
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      className="sm:max-w-sm md:max-w-md lg:max-w-lg mt-2"
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col justify-center items-center">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                  disabled={!formReady}
                >
                  Save
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </section>
      <header className="dark:bg-darkBg inset-0 flex min-h-[10dvh] w-full flex-col items-center justify-center bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
        <div className="mx-auto w-container max-w-full px-5 text-center" />
      </header>
    </div>
  )
}
