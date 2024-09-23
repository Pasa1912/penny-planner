"use client";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useNewAccount } from "@/features/accounts/hooks/useNewAccount";
import { useGetAccounts } from "@/features/accounts/api/useGetAccounts";
import { useDeleteAccounts } from "@/features/accounts/api/useDeleteAccounts";

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

const AccountsPage = () => {
  const { onOpen } = useNewAccount();
  const { data, isLoading } = useGetAccounts();
  const deleteAccountsMutation = useDeleteAccounts();

  const handleDelete = useCallback(
    (rows: Row<{ id: string; name: string }>[]) => {
      const ids = rows.map((r) => r.original.id);
      deleteAccountsMutation.mutate({ ids });
    },
    [deleteAccountsMutation]
  );

  if (isLoading) {
    return <Tombstone />;
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Accounts Page</CardTitle>
          <Button onClick={onOpen} size="sm">
            <Plus className="size-4 mr-2" />
            Add New
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data ?? []}
            filterKey="email"
            onDelete={handleDelete}
            disabled={isLoading || deleteAccountsMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsPage;
