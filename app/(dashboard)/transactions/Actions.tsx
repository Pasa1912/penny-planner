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

import { useOpenTransaction } from "@/features/transactions/hooks/useOpenTransaction";
import { useDeleteTransaction } from "@/features/transactions/api/useDeleteTransaction";
import { useConfirm } from "@/hooks/useConfirm";

type Props = { id: string };

export const Actions = ({ id }: Props) => {
  const { onOpen } = useOpenTransaction();

  const deleteTransactionMutation = useDeleteTransaction(id);

  const [ConfirmationDialog, confirm] = useConfirm(
    "Delete Transaction",
    "Are you sure you want to delete the selected transaction?"
  );

  const handleDelete = useCallback(async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteTransactionMutation.mutate();
  }, [confirm, deleteTransactionMutation]);

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
            disabled={deleteTransactionMutation.isPending}
            onClick={() => {
              onOpen(id);
            }}
          >
            <Edit className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={deleteTransactionMutation.isPending}
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
