import { z } from "zod";
import { useCallback } from "react";
import { insertCategorySchema } from "@/db/schema";
import { useOpenCategory } from "../hooks/useOpenCategory";
import { CategoryForm } from "@/features/categories/components/CategoryForm";
import { useGetCategory } from "@/features/categories/api/useGetCategory";
import { useEditCategory } from "@/features/categories/api/useEditCategory";
import { useDeleteCategory } from "@/features/categories/api/useDeleteCategory";
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
const formSchema = insertCategorySchema.pick({ name: true });

export const EditCategorySheet = () => {
  const { isOpen, onClose, id } = useOpenCategory();
  const { data: category, isLoading } = useGetCategory(id);
  const editCategoryMutation = useEditCategory(id);
  const deleteCategoryMutation = useDeleteCategory(id);

  const [ConfirmationDialog, confirm] = useConfirm(
    "Delete Category",
    "Are you sure you want to delete the selected category?"
  );

  const defaultValues = {
    name: category ? category.name : "",
  };

  const isPending =
    editCategoryMutation.isPending || deleteCategoryMutation.isPending;

  const handleSubmit = useCallback(
    (values: FormValues) =>
      editCategoryMutation.mutate(values, { onSuccess: onClose }),
    [editCategoryMutation, onClose]
  );

  const handleDelete = useCallback(async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteCategoryMutation.mutate(undefined, { onSuccess: onClose });
  }, [confirm, deleteCategoryMutation, onClose]);

  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>Edit an existing category</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <CategoryForm
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
