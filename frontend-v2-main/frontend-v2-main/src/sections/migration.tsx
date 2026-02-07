import { useState } from 'react';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { toast } from '@/components/ui/use-toast';

import { useMigrationMutation } from '@/redux/api/wordrama';
import { redirect } from 'next/navigation';

export default function Migration() {
  const [uesMigrate] = useMigrationMutation();
  const [migrated, setMigrated] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    const { data } = await uesMigrate();
    if (data) {
      setMigrated(true);
      setLoading(false);
    }
    setLoading(false);
  }

  if (migrated) return redirect('/')
  return (
    <div>
      <header className="dark:bg-darkBg inset-0 flex min-h-[20dvh] w-full flex-col items-center justify-center bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
        <div className="mx-auto w-container max-w-full px-5 text-center">
          {!loading && (
            <>
            <h2 className="px-5 text-center text-2xl font-heading md:text-3xl lg:mb-15 lg:text-4xl">
              Looks like you've played Wordrama before.
            </h2>
            <h2 className="px-5 mt-5 text-center text-2xl font-heading md:text-2xl lg:mb-15 lg:text-2xl">
              Let's migrate your account.
            </h2>
            </>
          )}
          {loading && (
            <h2 className="px-5 text-center text-2xl font-heading md:text-3xl lg:mb-15 lg:text-4xl">
              Migrating your account...<br/><br/>Please do not navigate away or refresh the page.<br/><br/>You will be redirected once the migration is complete.
            </h2>
          )}
        </div>
      </header>
        <section className="dark:bg-darkBg bg-bg font-base bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
          <div className="mx-auto grid sm:max-w-sm md:max-w-md lg:max-w-lg  max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
            <Card
              x-chunk="dashboard-04-chunk-1"
              className="bg-bg dark:bg-darkBg border-border dark:darkBorder shadow-light dark:shadow-dark rounded-base border-2 lg:col-span-2 md:col-span-2 col-span-1"
            >
              <CardFooter className="flex flex-col justify-center items-center">
                {!loading ? (
                  <Button
                    className='mt-5 font-medium text-sm px-5 py-2.5 text-center me-2 inline-flex items-center'
                    onClick={(e) => {
                      e.preventDefault();
                      setLoading(true);
                      handleSubmit();
                    }}
                    disabled={loading}
                  >
                    Migrate Now
                  </Button>
                ) : (
                  <Button
                    className='mt-5 font-medium text-sm px-5 py-2.5 text-center me-2 inline-flex items-center'
                    onClick={(e) => {
                      e.preventDefault();
                      setLoading(true);
                      handleSubmit();
                    }}
                    disabled={loading}
                  >
                    <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                    </svg>
                    Migrating...
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </section>
      <header className="dark:bg-darkBg inset-0 flex min-h-[10dvh] w-full flex-col items-center justify-center bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
        <div className="mx-auto w-container max-w-full px-5 text-center" />
      </header>
    </div>
  )
}
