import { useCallback } from "react";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.transactions)[":id"]["$delete"]
>;

export const useDeleteTransaction = (id?: string) => {
  const queryClient = useQueryClient();

  const mutationFn = useCallback(async () => {
    const response = await client.api.transactions[":id"].$delete({
      param: { id },
    });

    return await response.json();
  }, [id]);

  const onSuccess = useCallback(() => {
    toast.success("Transaction Deleted");
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
  }, [queryClient]);

  const onError = useCallback(() => {
    toast.error("Failed to delete transaction!");
  }, []);

  const mutation = useMutation<ResponseType, Error>({
    mutationFn,
    onSuccess,
    onError,
  });

  return mutation;
};
