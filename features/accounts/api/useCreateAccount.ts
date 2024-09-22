import { useCallback } from "react";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.accounts.$post>;
type RequestType = InferRequestType<typeof client.api.accounts.$post>["json"];

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  const mutationFn = useCallback(async (json: RequestType) => {
    const response = await client.api.accounts.$post({ json });

    return await response.json();
  }, []);

  const onSuccess = useCallback(() => {
    toast.success("Account Created");
    queryClient.invalidateQueries({ queryKey: ["accounts"] });
  }, [queryClient]);

  const onError = useCallback(() => {
    toast.error("Failed to create account!");
  }, []);

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn,
    onSuccess,
    onError,
  });

  return mutation;
};
