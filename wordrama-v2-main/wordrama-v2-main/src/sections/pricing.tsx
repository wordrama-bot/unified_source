import PricingPlan from '@/components/pricing-plan';
import {
  useCreateCheckoutSessionMutation,
  useChangeSubscriptionPlanMutation,
  useCreateBillingPortalSessionMutation,
  useGetCurrentSubscriptionQuery,
} from '@/redux/api/wordrama';


export const plans = {
  FREE: {
    planName: "Free",
    description: "Jump into Wordrama, challenge yourself, and compete with other players. No subscription required.",
    price: "0.00",
    perks: [
      "Custom username",
      "Standard 5-11 letter word packs",
      "Daily and Infinite gameplay",
      "Achievements and leaderboards",
      "Earn coins and XP through gameplay",
    ],
  },

  PLUS: {
    planName: "Plus",
    description: "Take your Wordrama experience further with more word packs, more customization, and more ways to play.",
    price: "2.99",
    perks: [
      "Everything in Free",
      "Eligible 3-23 letter word packs",
      "Eligible premium appearance themes",
      "A PLUS badge next to your name on the global leaderboard",
      "The ability to join multiple teams",
    ],
  },

  CREATOR: {
    planName: "Creator",
    description: "The ultimate Wordrama membership for streamers, community builders, and players who want even more.",
    price: "4.99",
    perks: [
      "Everything in Plus",
      "The ability to create and manage your own team",
      "Your PLUS badge is upgraded to CREATOR on the leaderboard",
      "Access to future Creator-specific features as released",
    ],
  },
};

export function PricingSection() {
  const [createCheckoutSession, { isLoading }] =
    useCreateCheckoutSessionMutation();

  const [changeSubscriptionPlan, { isLoading: isChangingPlan }] =
    useChangeSubscriptionPlanMutation();

  const [createBillingPortalSession, {
    isLoading: isPortalLoading,
  }] = useCreateBillingPortalSessionMutation();
  const { data: subscriptionResponse } = useGetCurrentSubscriptionQuery();

  const currentSubscription =
    subscriptionResponse?.data?.subscription;

  const currentPlanName =
    currentSubscription?.subscriptionKey === "CREATOR"
      ? "Creator"
      : currentSubscription?.subscriptionKey === "PLUS"
        ? "Plus"
        : "Free";
  const handleSubscribe = async (subscriptionKey: "PLUS" | "CREATOR") => {
    const result = await createCheckoutSession({ subscriptionKey }).unwrap();

    if (result?.data?.checkoutUrl) {
      window.location.href = result.data.checkoutUrl;
    }
  };

  const handleUpgrade = async (
    subscriptionKey: "PLUS" | "CREATOR",
  ) => {
    const result = await changeSubscriptionPlan({
      subscriptionKey,
    }).unwrap();

    if (result?.data?.subscription) {
      window.location.reload();
    }
  };

  const handleManageSubscription = async () => {
    const result = await createBillingPortalSession().unwrap();

    if (result?.data?.portalUrl) {
      window.location.href = result.data.portalUrl;
    }
    };

  return (
    <section className="border-b-border dark:border-b-darkBorder dark:bg-darkBg inset-0 flex w-full flex-col items-center justify-center border-b-2 bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] font-base">
      <div className="mx-auto w-container max-w-full px-5 py-20 lg:py-[100px]">
        <div className="grid grid-cols-3 gap-8 w900:mx-auto w900:w-2/3 w900:grid-cols-1 w500:w-full">
          {Object.values(plans).map(plan => (
            <PricingPlan
              key={plan.planName}
              planName={plan.planName}
              description={plan.description}
              price={plan.price}
              perks={plan.perks}
              mostPopular={plan.planName === 'Plus'}
              isCurrentPlan={plan.planName === currentPlanName}
              buttonText={
                plan.planName === currentPlanName
                  ? plan.planName === "Free"
                    ? "Current Plan"
                    : "Manage Subscription"
                  : currentPlanName === "Plus" && plan.planName === "Creator"
                    ? "Upgrade"
                    : currentPlanName !== "Free"
                      ? "Included"
                      : plan.planName === "Free"
                        ? "Current Plan"
                        : "Subscribe"
              }
              onSubscribe={
                plan.planName === currentPlanName && plan.planName !== "Free"
                  ? handleManageSubscription
                  : currentPlanName === "Plus" && plan.planName === "Creator"
                    ? () => handleUpgrade("CREATOR")
                    : plan.planName === "Plus"
                      ? () => handleSubscribe("PLUS")
                      : plan.planName === "Creator"
                        ? () => handleSubscribe("CREATOR")
                        : undefined
              }
              isLoading={
                (plan.planName === "Plus" || plan.planName === "Creator") &&
                (isLoading || isPortalLoading || isChangingPlan)
              }
            />
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-text/75 dark:text-darkText/75">
          Subscription benefits apply to eligible content only.
          Certain specialty word packs and themes may be sold separately.
          Individual Marketplace purchases may also be available without a subscription.
        </p>
      </div>
    </section>
  )
}

export default function Pricing() {
  return (
    <section className="border-b-border dark:border-b-darkBorder dark:bg-darkBg inset-0 flex w-full flex-col items-center justify-center border-b-2 bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] font-base">
      <div className="mx-auto w-container max-w-full px-5 py-20 lg:py-[100px]">
        <h2 className="mb-14 text-center text-2xl font-heading md:text-3xl lg:mb-20 lg:text-4xl">
          Pricing
        </h2>
        <div className="grid grid-cols-3 gap-8 w900:mx-auto w900:w-2/3 w900:grid-cols-1 w500:w-full">
          {Object.values(plans).map(plan => (
            <PricingPlan
              key={plan.planName}
              planName={plan.planName}
              description={plan.description}
              price={plan.price}
              perks={plan.perks}
              mostPopular={plan.planName === 'Plus'}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
