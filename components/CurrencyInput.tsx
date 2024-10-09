import { useCallback } from "react";
import Input from "react-currency-input-field";
import { Info, MinusCircle, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
};

export const CurrencyInput = ({
  value: valueString,
  onChange,
  placeholder,
  disabled,
}: Props) => {
  const value = parseFloat(valueString);
  const isIncome = value > 0;
  const isExpense = value < 0;

  const onToggleValue = useCallback(() => {
    if (!value) return;
    onChange((value * -1).toString());
  }, [value, onChange]);

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onToggleValue}
              className={cn(
                "bg-slate-400 absolute top-1.5 left-1.5 rounded-md p-2 flex items-center justify-center transition",
                isIncome && "bg-emerald-500",
                isExpense && "bg-rose-500"
              )}
            >
              {!value && <Info className="size-3 text-white" />}
              {isIncome && <PlusCircle className="size-3 text-white" />}
              {isExpense && <MinusCircle className="size-3 text-white" />}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            Use [+] for income and [-] for expense
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Input
        prefix=" ₹ "
        className="pl-10 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder={placeholder}
        value={valueString}
        decimalsLimit={2}
        decimalScale={2}
        onValueChange={onChange}
        disabled={disabled}
      />
      <p className="text-xs text-muted-foreground mt-2">
        {isIncome
          ? "This will count as an Income"
          : "This will count as an Expense"}
      </p>
    </div>
  );
};
