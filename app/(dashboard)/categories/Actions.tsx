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

import { useOpenCategory } from "@/features/categories/hooks/useOpenCategory";
import { useDeleteCategory } from "@/features/categories/api/useDeleteCategory";
import { useConfirm } from "@/hooks/useConfirm";

type Props = { id: string };

export const Actions = ({ id }: Props) => {
  const { onOpen } = useOpenCategory();

  const deleteCategoryMutation = useDeleteCategory(id);

  const [ConfirmationDialog, confirm] = useConfirm(
    "Delete Category",
    "Are you sure you want to delete the selected category?"
  );

  const handleDelete = useCallback(async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteCategoryMutation.mutate();
  }, [confirm, deleteCategoryMutation]);

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
            disabled={deleteCategoryMutation.isPending}
            onClick={() => {
              onOpen(id);
            }}
          >
            <Edit className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={deleteCategoryMutation.isPending}
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
