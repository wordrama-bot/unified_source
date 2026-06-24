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
import {
  useCreateBillingPortalSessionMutation,
  useGetCurrentSubscriptionQuery,
} from "@/redux/api/wordrama";

export default function BillingPage() {
  const [createBillingPortalSession, { isLoading }] =
    useCreateBillingPortalSessionMutation();

  const { data: subscriptionResponse } =
    useGetCurrentSubscriptionQuery();

  const subscription =
    subscriptionResponse?.data?.subscription;

  const latestSubscription =
    subscriptionResponse?.data?.latestSubscription;

  const displaySubscription = subscription || latestSubscription;

  const displayStatus = displaySubscription?.cancelledAt
    ? "CANCELLED"
    : displaySubscription?.cancelAtPeriodEnd
      ? "CANCELLING"
      : displaySubscription?.status;

  const dateLabel = displaySubscription?.cancelledAt || displaySubscription?.cancelAtPeriodEnd
    ? "Ended:"
    : "Renews:";

  const handleManageSubscription = async () => {
    const result = await createBillingPortalSession().unwrap();

    if (result?.data?.portalUrl) {
      window.location.href = result.data.portalUrl;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl text-text dark:text-darkText font-semibold">Billing</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <SettingsNav />
          <div className="grid grid-cols-2 gap-6">
            <Card x-chunk="dashboard-04-chunk-1" className="bg-bg dark:bg-darkBg border-border dark:darkBorder col-span-2 shadow-light dark:shadow-dark rounded-base border-2">
              <CardHeader>
                <CardTitle>Manage Subscription</CardTitle>
                <CardDescription>
                  
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <span className="font-semibold">Current Plan:</span>{" "}
                  {displaySubscription?.subscriptionKey || "No active subscription"}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {displayStatus || "None"}
                </p>
                {displaySubscription?.currentPeriodEnd && (
                  <p>
                    <span className="font-semibold">{dateLabel}</span>{" "}
                    {new Date(displaySubscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button
                  onClick={handleManageSubscription}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Manage Subscription"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
