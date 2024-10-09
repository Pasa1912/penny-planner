"use client";
import { useState, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UploadButton } from "@/components/UploadButton";
import { ImportCard } from "./ImportCard";

import { useNewTransaction } from "@/features/transactions/hooks/useNewTransaction";
import { useGetTransactions } from "@/features/transactions/api/useGetTransactions";
import { useDeleteTransactions } from "@/features/transactions/api/useDeleteTransactions";
import { useSelectAccount } from "@/hooks/useSelectAccount";
import { useCreateTransactions } from "@/features/transactions/api/useCreateTransactions";

import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "./data-table";

import { transactions } from "@/db/schema";
import { toast } from "sonner";

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};

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

const TransactionsPage = () => {
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);
  const [AccountDialog, confirm] = useSelectAccount();

  const { onOpen } = useNewTransaction();
  const { data, isLoading } = useGetTransactions();
  const deleteTransactionsMutation = useDeleteTransactions();
  const createTransactionsMutation = useCreateTransactions();

  const handleUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setVariant(VARIANTS.IMPORT);
    setImportResults(results);
  };

  const handleCancelImport = () => {
    setVariant(VARIANTS.LIST);
    setImportResults(INITIAL_IMPORT_RESULTS);
  };

  const handleSubmit = async (values: (typeof transactions.$inferInsert)[]) => {
    const accountId = await confirm();

    if (!accountId) {
      return toast.error("Please select an account to continue.");
    }

    const data = values.map((value) => ({
      ...value,
      accountId: accountId as string,
    }));

    createTransactionsMutation.mutate(data, {
      onSuccess: () => {
        handleCancelImport();
        toast.success("Transactions recorded!");
      },
      onError: () => {
        toast.error("Failed to record transactions");
      },
    });
  };

  const handleDelete = useCallback(
    (rows: any) => {
      const ids = rows.map((r: any) => r.original.id);
      deleteTransactionsMutation.mutate({ ids });
    },
    [deleteTransactionsMutation]
  );

  if (isLoading) {
    return <Tombstone />;
  }

  if (variant === VARIANTS.IMPORT) {
    return (
      <div>
        <AccountDialog />
        <ImportCard
          data={importResults.data}
          onCancel={handleCancelImport}
          onSubmit={handleSubmit}
        />
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transaction History
          </CardTitle>
          <div className="flex flex-col lg:flex-row gap-2 items-center">
            <Button onClick={onOpen} size="sm" className="w-full lg:w-auto">
              <Plus className="size-4 mr-2" />
              Add New
            </Button>
            <UploadButton onUpload={handleUpload} />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data ?? []}
            filterKey="payee"
            onDelete={handleDelete}
            disabled={isLoading || deleteTransactionsMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
