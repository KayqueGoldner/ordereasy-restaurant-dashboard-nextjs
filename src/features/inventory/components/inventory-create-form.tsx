"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";

import { trpc } from "@/trpc/client";
import { productInsertSchema } from "@/db/schema/products";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export const InventoryCreateForm = () => {
  const trpcUtils = trpc.useUtils();
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const createProduct = trpc.products.createProduct.useMutation({
    onSuccess: () => {
      form.reset();
      toast.success("Product created");
      trpcUtils.products.getMany.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm({
    resolver: zodResolver(productInsertSchema),
    defaultValues: {
      imageUrl: "",
      name: "",
      description: "",
      price: "",
      categoryId: "",
      isAvailable: true,
    },
  });

  const onSubmit = async (data: typeof productInsertSchema._type) => {
    createProduct.mutateAsync(data);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="mb-4 text-2xl font-semibold">Create Product</h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/inventory">
            <MdArrowBack className="size-4" />
            Back to inventory
          </Link>
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Image URL" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Name" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="Price" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Description" rows={5} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isAvailable"
            render={({ field }) => (
              <FormItem className="flex items-center gap-x-2">
                <FormLabel>Available</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button disabled={createProduct.isPending}>Create Product</Button>
        </form>
      </Form>
    </div>
  );
};
