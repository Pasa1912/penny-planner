import { z } from "zod";
import { useMemo, useCallback } from "react";
import { insertTransactionSchema } from "@/db/schema";
import { useOpenTransaction } from "../hooks/useOpenTransaction";
import { TransactionForm } from "@/features/transactions/components/TransactionForm";
import { useGetTransaction } from "@/features/transactions/api/useGetTransaction";
import { useEditTransaction } from "@/features/transactions/api/useEditTransaction";
import { useDeleteTransaction } from "@/features/transactions/api/useDeleteTransaction";
import { useGetAccounts } from "@/features/accounts/api/useGetAccounts";
import { useGetCategories } from "@/features/categories/api/useGetCategories";
import { useCreateAccount } from "@/features/accounts/api/useCreateAccount";
import { useCreateCategory } from "@/features/categories/api/useCreateCategory";
import { useConfirm } from "@/hooks/useConfirm";

import {
  Sheet,
  SheetDescription,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";

import { convertMilliUnitsToAmount } from "@/lib/utils";

const payloadSchema = insertTransactionSchema.omit({ id: true });
type PayloadValues = z.input<typeof payloadSchema>;

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction();
  const { data: transaction, isLoading: transactionLoading } =
    useGetTransaction(id);
  const editTransactionMutation = useEditTransaction(id);
  const deleteTransactionMutation = useDeleteTransaction(id);

  const { data: accounts, isLoading: accountsLoading } = useGetAccounts();
  const { data: categories, isLoading: categoriesLoading } = useGetCategories();

  const createAccountMutation = useCreateAccount();
  const createCategoryMutation = useCreateCategory();

  const isLoading = transactionLoading || accountsLoading || categoriesLoading;

  const isPending =
    editTransactionMutation.isPending ||
    deleteTransactionMutation.isPending ||
    createAccountMutation.isPending ||
    createCategoryMutation.isPending;

  const onCreateAccount = useCallback(
    (name: string) => createAccountMutation.mutate({ name }),
    [createAccountMutation]
  );

  const accountOptions = useMemo(
    () =>
      (accounts ?? []).map((account) => ({
        label: account.name,
        value: account.id,
      })),
    [accounts]
  );

  const onCreateCategory = useCallback(
    (name: string) => createCategoryMutation.mutate({ name }),
    [createCategoryMutation]
  );

  const categoryOptions = useMemo(
    () =>
      (categories ?? []).map((category) => ({
        label: category.name,
        value: category.id,
      })),
    [categories]
  );

  const [ConfirmationDialog, confirm] = useConfirm(
    "Delete Transaction",
    "Are you sure you want to delete the selected transaction?"
  );

  const defaultValues = transaction
    ? {
        accountId: transaction.accountId,
        categoryId: transaction.categoryId,
        payee: transaction.payee,
        notes: transaction.notes,
        amount: convertMilliUnitsToAmount(transaction.amount).toString(),
        date: new Date(transaction.date),
      }
    : undefined;

  const handleSubmit = useCallback(
    (values: PayloadValues) =>
      editTransactionMutation.mutate(values, { onSuccess: onClose }),
    [editTransactionMutation, onClose]
  );

  const handleDelete = useCallback(async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteTransactionMutation.mutate(undefined, { onSuccess: onClose });
  }, [confirm, deleteTransactionMutation, onClose]);

  return (
    <div>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>Edit an existing transaction</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              onSubmit={handleSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={handleDelete}
              accountOptions={accountOptions}
              onCreateAccount={onCreateAccount}
              categoryOptions={categoryOptions}
              onCreateCategory={onCreateCategory}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};
