import PricingPlan from '@/components/pricing-plan';
import {
  useCreateCheckoutSessionMutation,
  useCreateBillingPortalSessionMutation,
  useGetCurrentSubscriptionQuery,
} from '@/redux/api/wordrama';

export const plans = {
  FREE: {
    planName: "Free",
    description: "Available to everyone with a registered account",
    price: "0.00",
    perks: [
      "Custom username",
      "5-11 letter word packs"
    ]
  },

  PLUS: {
    planName: "Plus",
    description: "Perfect for wordle lovers of all ages and skill levels",
    price: "2.99",
    perks: [
      "Custom username",
      "All word packs (4-23)",
      "Premium themes",
      "More coming soon"
    ]
  },
  
  CREATOR: {
    planName: "Creator",
    description: "Best for streamers, educators, community leaders, and hardcore wordle fans",
    price: "4.99",
    perks: [
      "Custom username",
      "All word packs (4-23)",
      "Premium themes",
      "Avatars",
      "Create a team",
      "Join multiple teams",
      "Future creator features"
    ]
  }
}

export function PricingSection() {
  const [createCheckoutSession, { isLoading }] =
    useCreateCheckoutSessionMutation();
  const [createBillingPortalSession, { isLoading: isPortalLoading }] =
    useCreateBillingPortalSessionMutation();
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
                  ? plan.planName === "Creator"
                    ? "Manage Subscription"
                    : "Current Plan"
                  : plan.planName === "Plus"
                    ? "Coming Soon"
                    : currentPlanName !== "Free"
                      ? "Included"
                      : "Subscribe"
              }
              onSubscribe={
                plan.planName === "Creator" && plan.planName === currentPlanName
                  ? handleManageSubscription
                  : plan.planName === "Creator"
                    ? () => handleSubscribe("CREATOR")
                    : undefined
              }
              isLoading={
                plan.planName === "Creator" &&
                (isLoading || isPortalLoading)
              }
            />
          ))}
        </div>
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
