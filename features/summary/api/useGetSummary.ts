import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { client } from "@/lib/hono";
import { convertMilliUnitsToAmount } from "@/lib/utils";

export const useGetSummary = () => {
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const accountId = params.get("accountId") || "";

  const query = useQuery({
    queryKey: ["summary", { from, to, accountId }],
    queryFn: async () => {
      const response = await client.api.summary.$get({
        query: { from, to, accountId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch summary.");
      }

      const { summary } = await response.json();
      return {
        ...summary,
        incomeAmount: convertMilliUnitsToAmount(summary.incomeAmount),
        expensesAmount: convertMilliUnitsToAmount(summary.expensesAmount),
        remainingAmount: convertMilliUnitsToAmount(summary.remainingAmount),
        categories: summary.categories.map((category) => ({
          ...category,
          value: convertMilliUnitsToAmount(category.value),
        })),
        days: summary.days.map((day) => ({
          ...day,
          income: convertMilliUnitsToAmount(day.income),
          expenses: convertMilliUnitsToAmount(day.expenses),
        })),
      };
    },
  });

  return query;
};
