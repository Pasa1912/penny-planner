"use client";

import { useState, useCallback } from "react";
import qs from "query-string";
import { format, subDays } from "date-fns";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";

import { useGetAccounts } from "@/features/accounts/api/useGetAccounts";
import { useGetSummary } from "@/features/summary/api/useGetSummary";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn, formatDateRange } from "@/lib/utils";

const AccountFilter = () => {
  const router = useRouter();
  const pathName = usePathname();

  const params = useSearchParams();
  const accountId = params.get("accountId") || "all";
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const { data: accounts, isLoading: isAccountLoading } = useGetAccounts();
  const { isLoading: _isLoading } = useGetSummary();

  const handleChange = useCallback(
    (newValue: string) => {
      const query = {
        accountId: newValue,
        from,
        to,
      };

      if (newValue === "all") {
        query.accountId = "";
      }

      const url = qs.stringifyUrl(
        { url: pathName, query },
        { skipNull: true, skipEmptyString: true }
      );

      router.push(url);
    },
    [pathName, from, to, router]
  );

  return (
    <Select
      value={accountId}
      onValueChange={handleChange}
      disabled={isAccountLoading}
    >
      <SelectTrigger className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition">
        <SelectValue placeholder="Select account" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Accounts</SelectItem>
        {accounts?.map((account) => (
          <SelectItem key={account.id} value={account.id}>
            {account.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const defaultTo = new Date();

const DateFilter = () => {
  const router = useRouter();
  const pathName = usePathname();

  const { isLoading: _isLoading } = useGetSummary();

  const params = useSearchParams();
  const accountId = params.get("accountId");
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const defaultFrom = subDays(defaultTo, 30);

  const paramState = {
    to: to ? new Date(to) : defaultTo,
    from: from ? new Date(from) : defaultFrom,
  };

  const [date, setDate] = useState<DateRange | undefined>(paramState);

  const pushToUrl = useCallback(
    (dateRange: DateRange | undefined) => {
      const query = {
        from: format(dateRange?.from || defaultFrom, "yyyy-MM-dd"),
        to: format(dateRange?.to || defaultTo, "yyyy-MM-dd"),
        accountId,
      };

      const url = qs.stringifyUrl(
        { url: pathName, query },
        { skipNull: true, skipEmptyString: true }
      );

      router.push(url);
    },
    [defaultFrom, router, pathName, accountId]
  );

  const handleReset = useCallback(() => {
    setDate(undefined);
    pushToUrl(undefined);
  }, [pushToUrl]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={false}
          size="sm"
          variant="outline"
          className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition"
        >
          <span>{formatDateRange(paramState)}</span>
          <ChevronDown className="ml-2 size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="lg:w-auto w-full p-0" align="start">
        <Calendar
          disabled={false}
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />
        <div className="p-4 w-full flex items-center gap-x-2">
          <PopoverClose asChild>
            <Button
              onClick={handleReset}
              disabled={!date?.from || !date.to}
              className="w-full"
              variant="outline"
            >
              Reset
            </Button>
          </PopoverClose>
          <PopoverClose asChild>
            <Button
              onClick={() => pushToUrl(date)}
              disabled={!date?.from || !date.to}
              className="w-full"
              variant="outline"
            >
              Apply
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const Filters = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-y-2 lg:gap-y-0 lg:gap-x-2">
      <AccountFilter />
      <DateFilter />
    </div>
  );
};
