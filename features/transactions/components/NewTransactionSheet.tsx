import { z } from "zod";
import { useMemo, useCallback } from "react";
import { insertTransactionSchema } from "@/db/schema";
import { useNewTransaction } from "../hooks/useNewTransaction";
import { TransactionForm } from "@/features/transactions/components/TransactionForm";
import { useCreateTransaction } from "@/features/transactions/api/useCreateTransaction";

import { useGetCategories } from "@/features/categories/api/useGetCategories";
import { useCreateCategory } from "@/features/categories/api/useCreateCategory";

import { useGetAccounts } from "@/features/accounts/api/useGetAccounts";
import { useCreateAccount } from "@/features/accounts/api/useCreateAccount";

import {
  Sheet,
  SheetDescription,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";

const payloadSchema = insertTransactionSchema.omit({ id: true });
type PayloadValues = z.input<typeof payloadSchema>;

export const NewTransactionSheet = () => {
  const { isOpen, onClose } = useNewTransaction();
  const createTransactionMutation = useCreateTransaction();

  const accounts = useGetAccounts();
  const accountMutation = useCreateAccount();

  const onCreateAccount = useCallback(
    (name: string) => accountMutation.mutate({ name }),
    [accountMutation]
  );

  const accountOptions = useMemo(
    () =>
      (accounts.data ?? []).map((account) => ({
        label: account.name,
        value: account.id,
      })),
    [accounts.data]
  );

  const categories = useGetCategories();
  const categoryMutation = useCreateCategory();

  const onCreateCategory = useCallback(
    (name: string) => categoryMutation.mutate({ name }),
    [categoryMutation]
  );

  const categoryOptions = useMemo(
    () =>
      (categories.data ?? []).map((category) => ({
        label: category.name,
        value: category.id,
      })),
    [categories.data]
  );

  const isLoading = accounts.isLoading || categories.isLoading;

  const isPending =
    createTransactionMutation.isPending ||
    accountMutation.isPending ||
    categoryMutation.isPending;

  const handleSubmit = useCallback(
    (values: PayloadValues) =>
      createTransactionMutation.mutate(values, { onSuccess: onClose }),
    [createTransactionMutation, onClose]
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Add a new transaction</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex justify-center items-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={handleSubmit}
            disabled={isPending}
            accountOptions={accountOptions}
            onCreateAccount={onCreateAccount}
            categoryOptions={categoryOptions}
            onCreateCategory={onCreateCategory}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
