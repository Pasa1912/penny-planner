import { useCallback } from "react";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>["json"];

export const useCreateTransactions = () => {
  const queryClient = useQueryClient();
  const mutationFn = useCallback(async (json: RequestType) => {
    const response = await client.api.transactions["bulk-create"]["$post"]({
      json,
    });

    return await response.json();
  }, []);

  const onSuccess = useCallback(() => {
    toast.success("Transaction(s) Created");
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
  }, [queryClient]);

  const onError = useCallback(() => {
    toast.error("Failed to create transaction(s)!");
  }, []);

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn,
    onSuccess,
    onError,
  });

  return mutation;
};
