import PricingPlan from '@/components/pricing-plan';
import { useAuth } from '@/providers/auth-provider';

export const plans: {
  [key: string]: {
    planName: string,
    description: string,
    price: string,
    perks: string[]
  }

} = {
  PLAYER: {
    planName: "Free",
    description: "Best for getting started",
    price: "0.00",
    perks: [
      'Custom username',
      'Custom Avatar',
      'Access to Wordle & SpellBee'
    ]
  },
  CASUAL: {
    planName: "Casual",
    description: "Best for casual players",
    price: "3.99",
    perks: [
      'Custom username',
      'Custom Avatar',
      'Access to all games',
      'No ads'
    ]
  },
  STREAMER: {
    planName: "Pro/Streamer",
    description: "Best for pro players & streamers",
    price: "9.99",
    perks: [
      'Custom username',
      'Custom Avatar',
      'Custom Referral Code',
      'Access to all games',
      'No ads',
      'Access to word packs',
      'Access to beta features and releases',
      'Access to streamer mode'
    ]
  }
}

export function PricingSection() {
  const { role } = useAuth();
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
              mostPopular={role === 'PLAYER' ? plan.planName === 'Casual' : false}
              isCurrentPlan={plan.planName === plans[role].planName || false}
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
              mostPopular={plan.planName === 'Casual'}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
