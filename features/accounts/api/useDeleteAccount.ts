import { useCallback } from "react";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.accounts)[":id"]["$delete"]
>;

export const useDeleteAccount = (id?: string) => {
  const queryClient = useQueryClient();

  const mutationFn = useCallback(async () => {
    const response = await client.api.accounts[":id"].$delete({
      param: { id },
    });

    return await response.json();
  }, [id]);

  const onSuccess = useCallback(() => {
    toast.success("Account Deleted");
    queryClient.invalidateQueries({ queryKey: ["accounts"] });
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
  }, [queryClient]);

  const onError = useCallback(() => {
    toast.error("Failed to delete account!");
  }, []);

  const mutation = useMutation<ResponseType, Error>({
    mutationFn,
    onSuccess,
    onError,
  });

  return mutation;
};
