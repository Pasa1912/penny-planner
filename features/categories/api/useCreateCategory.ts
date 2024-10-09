import { useCallback } from "react";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.categories.$post>;
type RequestType = InferRequestType<typeof client.api.categories.$post>["json"];

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const mutationFn = useCallback(async (json: RequestType) => {
    const response = await client.api.categories.$post({ json });

    return await response.json();
  }, []);

  const onSuccess = useCallback(() => {
    toast.success("Category Created");
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
  }, [queryClient]);

  const onError = useCallback(() => {
    toast.error("Failed to create category!");
  }, []);

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn,
    onSuccess,
    onError,
  });

  return mutation;
};
