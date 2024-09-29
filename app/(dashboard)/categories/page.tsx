"use client";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useNewCategory } from "@/features/categories/hooks/useNewCategory";
import { useGetCategories } from "@/features/categories/api/useGetCategories";
import { useDeleteCategories } from "@/features/categories/api/useDeleteCategories";

import type { Row } from "@tanstack/react-table";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const Tombstone = () => (
  <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
    <Card className="border-none drop-shadow-sm">
      <CardHeader>
        <Skeleton className="h-8 w-48" />
      </CardHeader>
      <CardContent>
        <div className="h-[500px] w-full items-center flex justify-center">
          <Loader2 className="size-6 text-slate-300 animate-spin" />
        </div>
      </CardContent>
    </Card>
  </div>
);

const CategoriesPage = () => {
  const { onOpen } = useNewCategory();
  const { data, isLoading } = useGetCategories();
  const deleteCategoriesMutation = useDeleteCategories();

  const handleDelete = useCallback(
    (rows: Row<{ id: string; name: string }>[]) => {
      const ids = rows.map((r) => r.original.id);
      deleteCategoriesMutation.mutate({ ids });
    },
    [deleteCategoriesMutation]
  );

  if (isLoading) {
    return <Tombstone />;
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Categories Page
          </CardTitle>
          <Button onClick={onOpen} size="sm">
            <Plus className="size-4 mr-2" />
            Add New
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data ?? []}
            filterKey="name"
            onDelete={handleDelete}
            disabled={isLoading || deleteCategoriesMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesPage;
