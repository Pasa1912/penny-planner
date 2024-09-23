import { z } from "zod";
import { useCallback } from "react";
import { insertAccountSchema } from "@/db/schema";
import { useOpenAccount } from "../hooks/useOpenAccount";
import { AccountForm } from "@/features/accounts/components/AccountForm";
import { useGetAccount } from "@/features/accounts/api/useGetAccount";
import { useEditAccount } from "@/features/accounts/api/useEditAccount";
import { useDeleteAccount } from "@/features/accounts/api/useDeleteAccount";
import { useConfirm } from "@/hooks/useConfirm";

import {
  Sheet,
  SheetDescription,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";

type FormValues = z.input<typeof formSchema>;
const formSchema = insertAccountSchema.pick({ name: true });

export const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount();
  const { data: account, isLoading } = useGetAccount(id);
  const editAccountMutation = useEditAccount(id);
  const deleteAccountMutation = useDeleteAccount(id);

  const [ConfirmationDialog, confirm] = useConfirm(
    "Delete Account",
    "Are you sure you want to delete the selected account?"
  );

  const defaultValues = {
    name: account ? account.name : "",
  };

  const isPending =
    editAccountMutation.isPending || deleteAccountMutation.isPending;

  const handleSubmit = useCallback(
    (values: FormValues) =>
      editAccountMutation.mutate(values, { onSuccess: onClose }),
    [editAccountMutation, onClose]
  );

  const handleDelete = useCallback(async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteAccountMutation.mutate(undefined, { onSuccess: onClose });
  }, [confirm, deleteAccountMutation, onClose]);

  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>Edit an existing account</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <AccountForm
              id={id}
              onSubmit={handleSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={handleDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
