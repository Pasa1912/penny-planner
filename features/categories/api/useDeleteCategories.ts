import { useCallback } from "react";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.categories)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.categories)["bulk-delete"]["$post"]
>["json"];

export const useDeleteCategories = () => {
  const queryClient = useQueryClient();
  const mutationFn = useCallback(async (json: RequestType) => {
    const response = await client.api.categories["bulk-delete"]["$post"]({
      json,
    });

    return await response.json();
  }, []);

  const onSuccess = useCallback(() => {
    toast.success("Category(s) Deleted");
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  }, [queryClient]);

  const onError = useCallback(() => {
    toast.error("Failed to delete category(s)!");
  }, []);

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn,
    onSuccess,
    onError,
  });

  return mutation;
};
