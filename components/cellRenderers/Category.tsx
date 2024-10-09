import { useCallback } from "react";

import { useOpenCategory } from "@/features/categories/hooks/useOpenCategory";
import { useOpenTransaction } from "@/features/transactions/hooks/useOpenTransaction";
import { TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  id: string;
  category: string | null;
  categoryId: string | null;
};

export const Category = ({ id, category, categoryId }: Props): JSX.Element => {
  const { onOpen: onOpenCategory } = useOpenCategory();
  const { onOpen: onOpenTransaction } = useOpenTransaction();

  const handleClick = useCallback(() => {
    if (categoryId) {
      onOpenCategory(categoryId);
    } else {
      onOpenTransaction(id);
    }
  }, [onOpenCategory, categoryId, onOpenTransaction, id]);

  return (
    <span
      onClick={handleClick}
      className={cn(
        "flex justify-center items-center cursor-pointer hover:underline",
        !category ? "text-rose-500" : ""
      )}
    >
      {!category && <TriangleAlert className="mr-2 size-4 shrink-0" />}
      {category || "Uncategorized"}
    </span>
  );
};
