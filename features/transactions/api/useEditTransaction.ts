import { useCallback } from "react";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.transactions)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.transactions)[":id"]["$patch"]
>["json"];

export const useEditTransaction = (id?: string) => {
  const queryClient = useQueryClient();

  const mutationFn = useCallback(
    async (json: RequestType) => {
      const response = await client.api.transactions[":id"].$patch({
        json,
        param: { id },
      });

      return await response.json();
    },
    [id]
  );

  const onSuccess = useCallback(() => {
    toast.success("Transaction Updated");
    queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
  }, [queryClient, id]);

  const onError = useCallback(() => {
    toast.error("Failed to edit transaction!");
  }, []);

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn,
    onSuccess,
    onError,
  });

  return mutation;
};
