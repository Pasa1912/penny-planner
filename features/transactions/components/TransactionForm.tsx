import { useCallback } from "react";
import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CurrencyInput } from "@/components/CurrencyInput";

import { Select, type Option } from "@/components/Select";
import { DatePicker } from "@/components/DatePicker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { insertTransactionSchema } from "@/db/schema";

import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
} from "@/components/ui/form";
import { convertAmountToMilliUnits } from "@/lib/utils";

const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  payee: z.string(),
  amount: z.string(),
  notes: z.string().nullable().optional(),
});

const payloadSchema = insertTransactionSchema.omit({ id: true });

type FormValues = z.input<typeof formSchema>;
type PayloadValues = z.input<typeof payloadSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: PayloadValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  accountOptions: Array<Option>;
  onCreateAccount: (name: string) => void;
  categoryOptions: Array<Option>;
  onCreateCategory: (name: string) => void;
};

export const TransactionForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  accountOptions,
  onCreateAccount,
  categoryOptions,
  onCreateCategory,
}: Props) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = useCallback(
    (values: FormValues) => {
      const amount = convertAmountToMilliUnits(values.amount);
      onSubmit({ ...values, amount });
    },
    [onSubmit]
  );

  const handleDelete = useCallback(() => onDelete?.(), [onDelete]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                  required
                />
              </FormControl>
            </FormItem>
          )}
        ></FormField>
        <FormField
          name="accountId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select an account"
                  options={accountOptions}
                  onCreate={onCreateAccount}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                  required
                />
              </FormControl>
            </FormItem>
          )}
        ></FormField>
        <FormField
          name="categoryId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select a category"
                  options={categoryOptions}
                  onCreate={onCreateCategory}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        ></FormField>
        <FormField
          name="payee"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payee</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Add a payee"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        ></FormField>
        <FormField
          name="amount"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <CurrencyInput
                  {...field}
                  value={field.value ?? ""}
                  disabled={disabled}
                  placeholder="0.00"
                />
              </FormControl>
            </FormItem>
          )}
        ></FormField>
        <FormField
          name="notes"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  disabled={disabled}
                  placeholder="Add a note"
                />
              </FormControl>
            </FormItem>
          )}
        ></FormField>
        <Button className="w-full" disabled={disabled}>
          {id ? "Save Changes" : "Create Transaction"}
        </Button>
        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full"
            variant="outline"
          >
            <div className="flex gap-2 w-full justify-center items-center">
              <Trash className="size-4" />
              <div>Delete Transaction</div>
            </div>
          </Button>
        )}
      </form>
    </Form>
  );
};
