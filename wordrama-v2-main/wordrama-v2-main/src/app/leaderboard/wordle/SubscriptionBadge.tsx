import Link from 'next/link';

type Props = { subscriptionKey?: string | null };

export default function SubscriptionBadge({ subscriptionKey }: Props) {
  if (subscriptionKey !== 'PLUS' && subscriptionKey !== 'CREATOR') return null;
  const creator = subscriptionKey === 'CREATOR';
  return (
    <Link
      href="/subscribe"
      title={`Explore ${subscriptionKey} membership benefits`}
      aria-label={`Explore ${subscriptionKey} membership benefits`}
      className={`inline-flex shrink-0 items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold tracking-wide hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
        creator
          ? 'border-amber-500/80 text-amber-600 dark:text-amber-400'
          : 'border-slate-400/80 text-slate-600 dark:text-slate-300'
      }`}
    >
      {subscriptionKey}
    </Link>
  );
}
