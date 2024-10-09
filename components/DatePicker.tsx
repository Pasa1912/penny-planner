import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type { SelectSingleEventHandler } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

type Props = {
  value?: Date;
  onChange?: SelectSingleEventHandler;
  disabled?: boolean;
  required?: boolean;
};

export const DatePicker = ({
  value,
  onChange,
  disabled,
  required,
}: Props): JSX.Element => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        disabled={disabled}
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          !value && "text-muted-foreground"
        )}
      >
        <CalendarIcon className="size-4 mr-2" />
        {value ? format(value, "PPP") : <span>Pick a date</span>}
      </Button>
    </PopoverTrigger>
    <PopoverContent>
      <Calendar
        mode="single"
        selected={value}
        onSelect={onChange}
        disabled={disabled}
        required={required}
        initialFocus
      />
    </PopoverContent>
  </Popover>
);
