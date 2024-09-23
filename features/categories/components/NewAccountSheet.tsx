import { z } from "zod";
import { useCallback } from "react";
import { insertAccountSchema } from "@/db/schema";
import { useNewAccount } from "../hooks/useNewAccount";
import { AccountForm } from "@/features/accounts/components/AccountForm";
import { useCreateAccount } from "@/features/accounts/api/useCreateAccount";

import {
  Sheet,
  SheetDescription,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type FormValues = z.input<typeof formSchema>;
const formSchema = insertAccountSchema.pick({ name: true });

export const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount();
  const createAccountMutation = useCreateAccount();

  const handleSubmit = useCallback(
    (values: FormValues) =>
      createAccountMutation.mutate(values, { onSuccess: onClose }),
    [createAccountMutation, onClose]
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to track your transaction
          </SheetDescription>
        </SheetHeader>
        <AccountForm
          onSubmit={handleSubmit}
          disabled={createAccountMutation.isPending}
        />
      </SheetContent>
    </Sheet>
  );
};
