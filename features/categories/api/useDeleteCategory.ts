import { useCallback } from "react";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.categories)[":id"]["$delete"]
>;

export const useDeleteCategory = (id?: string) => {
  const queryClient = useQueryClient();

  const mutationFn = useCallback(async () => {
    const response = await client.api.categories[":id"].$delete({
      param: { id },
    });

    return await response.json();
  }, [id]);

  const onSuccess = useCallback(() => {
    toast.success("Category Deleted");
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
    queryClient.invalidateQueries({ queryKey: ["summary"] });
  }, [queryClient]);

  const onError = useCallback(() => {
    toast.error("Failed to delete category!");
  }, []);

  const mutation = useMutation<ResponseType, Error>({
    mutationFn,
    onSuccess,
    onError,
  });

  return mutation;
};
