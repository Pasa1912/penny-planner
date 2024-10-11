import { type ClassValue, clsx } from "clsx";
import { eachDayOfInterval, format, subDays } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertAmountToMilliUnits = (amount: string | number): number => {
  if (typeof amount === "number") {
    return Math.round(parseFloat(amount.toString()) * 1000);
  }

  return Math.round(parseFloat(amount) * 1000);
};

export const convertMilliUnitsToAmount = (units: number): number =>
  units / 1000;

export const formatCurrency = (amount: number): string =>
  Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);

export const calculatePercentageChange = (
  current: number,
  previous: number
): number => {
  if (previous === 0) {
    return previous === current ? 0 : 100;
  }

  return ((current - previous) / previous) * 100;
};

export const fillMissingDays = (
  activeDays: Array<{
    date: Date;
    income: number;
    expenses: number;
  }>,
  startDate: Date,
  endDate: Date
) => {
  if (activeDays.length === 0) return [];

  const activeDaysMap = activeDays.reduce(
    (acc, currentDay) => {
      acc[currentDay.date.toDateString()] = currentDay;
      return acc;
    },
    {} as Record<
      string,
      {
        date: Date;
        income: number;
        expenses: number;
      }
    >
  );

  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  const transactionsByDay = allDays.map(
    (day: Date) =>
      activeDaysMap[day.toDateString()] ?? { date: day, income: 0, expenses: 0 }
  );

  return transactionsByDay;
};

type Period = {
  from: string | Date | undefined;
  to: string | Date | undefined;
};

export const formatDateRange = (period?: Period) => {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  if (!period?.from) {
    return `${format(defaultFrom, "LLL dd")} - ${format(
      defaultTo,
      "LLL dd, y"
    )}`;
  }

  if (period.to) {
    return `${format(period.from, "LLL dd")} - ${format(
      period.to,
      "LLL dd, y"
    )}`;
  }

  return `${format(period.from, "LLL dd, y")}`;
};

export function formatPercentage(
  value: number,
  options: { addPrefix?: boolean } = { addPrefix: false }
) {
  const result = new Intl.NumberFormat("en-US", {
    style: "percent",
  }).format(value / 100);

  if (options.addPrefix && value > 0) {
    return `+${result}`;
  }

  return result;
}
