"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

import { useOpenAccount } from "@/features/accounts/hooks/useOpenAccount";
import { useDeleteAccount } from "@/features/accounts/api/useDeleteAccount";
import { useConfirm } from "@/hooks/useConfirm";

type Props = { id: string };

export const Actions = ({ id }: Props) => {
  const { onOpen } = useOpenAccount();

  const deleteAccountMutation = useDeleteAccount(id);

  const [ConfirmationDialog, confirm] = useConfirm(
    "Delete Account",
    "Are you sure you want to delete the selected account?"
  );

  const handleDelete = useCallback(async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteAccountMutation.mutate();
  }, [confirm, deleteAccountMutation]);

  return (
    <>
      <ConfirmationDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={deleteAccountMutation.isPending}
            onClick={() => {
              onOpen(id);
            }}
          >
            <Edit className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={deleteAccountMutation.isPending}
            onClick={handleDelete}
          >
            <Trash className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
