import { z } from "zod";
import { useCallback } from "react";
import { insertCategorySchema } from "@/db/schema";
import { useNewCategory } from "../hooks/useNewCategory";
import { CategoryForm } from "@/features/categories/components/CategoryForm";
import { useCreateCategory } from "@/features/categories/api/useCreateCategory";

import {
  Sheet,
  SheetDescription,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type FormValues = z.input<typeof formSchema>;
const formSchema = insertCategorySchema.pick({ name: true });

export const NewCategorySheet = () => {
  const { isOpen, onClose } = useNewCategory();
  const createCategoryMutation = useCreateCategory();

  const handleSubmit = useCallback(
    (values: FormValues) =>
      createCategoryMutation.mutate(values, { onSuccess: onClose }),
    [createCategoryMutation, onClose]
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>
            Create a new category to track your transaction
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
          onSubmit={handleSubmit}
          disabled={createCategoryMutation.isPending}
        />
      </SheetContent>
    </Sheet>
  );
};
