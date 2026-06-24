import { useGetCurrentSubscriptionQuery } from "@/redux/api/wordrama";

export function useMarketplaceAccess() {
  const { data: subscriptionResponse } = useGetCurrentSubscriptionQuery();

  const subscriptionKey =
    subscriptionResponse?.data?.subscription?.subscriptionKey || "FREE";

  const isPlus = subscriptionKey === "PLUS";
  const isCreator = subscriptionKey === "CREATOR";

  return {
    subscriptionKey,
    isPlus,
    isCreator,
    canUpgradeToCreator: subscriptionKey !== "CREATOR",
  };
}
