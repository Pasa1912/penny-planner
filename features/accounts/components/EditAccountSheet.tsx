import { z } from "zod";
import { useCallback } from "react";
import { insertAccountSchema } from "@/db/schema";
import { useOpenAccount } from "../hooks/useOpenAccount";
import { AccountForm } from "@/features/accounts/components/AccountForm";
import { useGetAccount } from "@/features/accounts/api/useGetAccount";
import { useEditAccount } from "@/features/accounts/api/useEditAccount";

import {
  Sheet,
  SheetDescription,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type FormValues = z.input<typeof formSchema>;
const formSchema = insertAccountSchema.pick({ name: true });

export const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount();
  const { data: account, isLoading } = useGetAccount(id);
  const editAccountMutation = useEditAccount(id);

  const defaultValues = {
    name: account ? account.name : "",
  };

  const handleSubmit = useCallback(
    (values: FormValues) =>
      editAccountMutation.mutate(values, { onSuccess: onClose }),
    [editAccountMutation, onClose]
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Edit Account</SheetTitle>
          <SheetDescription>
            Edit account to track your transaction
          </SheetDescription>
        </SheetHeader>
        <AccountForm
          onSubmit={handleSubmit}
          disabled={editAccountMutation.isPending}
          defaultValues={defaultValues}
        />
      </SheetContent>
    </Sheet>
  );
};
