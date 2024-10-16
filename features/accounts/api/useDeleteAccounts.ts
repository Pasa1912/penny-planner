import { useCallback } from "react";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.accounts)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.accounts)["bulk-delete"]["$post"]
>["json"];

export const useDeleteAccounts = () => {
  const queryClient = useQueryClient();
  const mutationFn = useCallback(async (json: RequestType) => {
    const response = await client.api.accounts["bulk-delete"]["$post"]({
      json,
    });

    return await response.json();
  }, []);

  const onSuccess = useCallback(() => {
    toast.success("Account(s) Deleted");
    queryClient.invalidateQueries({ queryKey: ["accounts"] });
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
  }, [queryClient]);

  const onError = useCallback(() => {
    toast.error("Failed to delete account(s)!");
  }, []);

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn,
    onSuccess,
    onError,
  });

  return mutation;
};
