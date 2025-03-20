"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import Image from "next/image";
import { XIcon } from "lucide-react";

import { trpc } from "@/trpc/client";
import { productInsertSchema } from "@/db/schema/products";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { UploadDropzone } from "@/components/uploadthing";

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
      allergens: "",
      calories: 0,
      ingredients: "",
      preparationTime: 0,
      serves: 0,
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                  <div>
                    {field.value ? (
                      <div className="relative w-fit">
                        <Image
                          src={field.value}
                          alt="product image"
                          width={360}
                          height={360}
                          className="rounded-lg"
                          unoptimized
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -right-2 -top-2 rounded-full"
                          onClick={() => {
                            field.onChange("");
                          }}
                        >
                          <XIcon className="size-4" />
                        </Button>
                      </div>
                    ) : (
                      <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          toast.success("Image uploaded");
                          field.onChange(res[0].url);
                        }}
                        onUploadError={(error: Error) => {
                          console.log(error);
                          toast.error("Failed to upload image");
                        }}
                        appearance={{
                          button: {
                            backgroundColor: "hsla(24.6 95% 53.1%)",
                          },
                        }}
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Name" />
                  </FormControl>
                  <FormMessage />
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
                  <FormMessage />
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
                    <FormMessage />
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredients</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      placeholder="Ingredients"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serves"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serves</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      value={field.value || 0}
                      onChange={(event) => {
                        const value = event.target.value;
                        field.onChange(Number(value));
                      }}
                      placeholder="Serves"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="calories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calories</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      value={field.value || 0}
                      onChange={(event) => {
                        const value = event.target.value;
                        field.onChange(Number(value));
                      }}
                      placeholder="Calories"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="allergens"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allergens</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      placeholder="Allergens"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preparationTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preparation Time (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      value={field.value || 0}
                      onChange={(event) => {
                        const value = event.target.value;
                        field.onChange(Number(value));
                      }}
                      placeholder="Preparation Time (minutes)"
                    />
                  </FormControl>
                  <FormMessage />
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
                <FormMessage />
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
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={createProduct.isPending}>Create Product</Button>
        </form>
      </Form>
    </div>
  );
};
