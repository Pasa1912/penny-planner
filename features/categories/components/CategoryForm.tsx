import { useCallback } from "react";
import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertCategorySchema } from "@/db/schema";
import {
  Form,
  FormMessage,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
} from "@/components/ui/form";

type FormValues = z.input<typeof formSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

const formSchema = insertCategorySchema.pick({ name: true });

export const CategoryForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = useCallback(
    (values: FormValues) => onSubmit(values),
    [onSubmit]
  );

  const handleDelete = useCallback(() => onDelete?.(), [onDelete]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="e.g. Food, Travel, etc."
                  {...field}
                ></Input>
              </FormControl>
            </FormItem>
          )}
        ></FormField>
        <Button className="w-full" disabled={disabled}>
          {id ? "Save Changes" : "Create Category"}
        </Button>
        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full"
            variant="outline"
          >
            <div className="flex gap-2 w-full justify-center items-center">
              <Trash className="size-4" />
              <div>Delete Category</div>
            </div>
          </Button>
        )}
      </form>
    </Form>
  );
};
