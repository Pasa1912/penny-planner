import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertAmountToMilliUnits = (amount: string): number =>
  Math.round(parseFloat(amount) * 1000);

export const convertMilliUnitsToAmount = (units: number): number =>
  units / 1000;

export const formatCurrency = (amount: number): string =>
  Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
