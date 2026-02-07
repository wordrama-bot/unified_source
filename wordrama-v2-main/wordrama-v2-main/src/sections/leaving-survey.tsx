import { useEffect, useState } from 'react';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string().optional(),
  emailAddress: z.string(),
  reasonForLeaving: z.array(z.string()).nonempty()
});

import { useCreateAccountMutation } from '@/redux/api/wordrama';
import { redirect } from 'next/navigation';
import { Loading } from './loading';

export default function FirstLogin() {
  //const [submitFeedback] = useSubmitFeedbackMutation();
  const [formReady, setFormReady] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');

  async function handleSubmit() {
    const { data, error } = await submitFeedback({
      firstName,
      lastName,
      username,
      email,
    });

    if (error) return toast('Something went wrong');
  }

  const form = useForm < z.infer < typeof formSchema >> ({
    resolver: zodResolver(formSchema),
    defaultValues: {
    },
  })

  return (
    <div>
      <header className="dark:bg-darkBg inset-0 flex min-h-[20dvh] w-full flex-col items-center justify-center bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
        <div className="mx-auto w-container max-w-full px-5 text-center">
          <h2 className="px-5 text-center text-2xl font-heading md:text-3xl lg:mb-15 lg:text-4xl">
            We are sorry to see you go.
          </h2>
          <p className="px-5 text-center text-base font-base md:text-lg lg:text-xl">
            Please let us know why you are leaving so we can improve our service.
          </p>
        </div>
      </header>
      <section className="dark:bg-darkBg bg-bg font-base bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
        <div className="mx-auto grid sm:max-w-sm md:max-w-md lg:max-w-lg  max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <Card
            x-chunk="dashboard-04-chunk-1"
            className="bg-bg dark:bg-darkBg border-border dark:darkBorder shadow-light dark:shadow-dark rounded-base border-2 lg:col-span-2 md:col-span-2 col-span-1"
          >
            <CardContent>
              <Form {...form}>
                <form className="space-y-8 max-w-3xl mx-auto py-10">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                          placeholder=""

                          type="text"
                          {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                    </div>

                    <div className="col-span-6">

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                          placeholder=""

                          type="text"
                          {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                    </div>

                  </div>

                  <FormField
                    control={form.control}
                    name="emailAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                          placeholder="email@example.com"

                          type="email"
                          {...field} />
                        </FormControl>
                        <FormDescription>This may be used by our support reach out for further details</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-12 gap-4">

                    <div className="col-span-4">


                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col justify-center items-center">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                disabled={!formReady}
              >
                Submit
              </Button>
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
