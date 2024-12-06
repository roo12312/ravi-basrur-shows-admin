"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Select from "react-select";
import * as z from "zod";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import useMutationData from "@/hooks/supabase/useMutationData";
import useFetchData from "@/hooks/supabase/useFetchData";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Textarea } from "../ui/textarea";
import { AsyncSelect } from "@/components/ui/react-select";

const applicableCategories = [
  { value: "movies", label: "Movies" },
  { value: "documentaries", label: "Documentaries" },
  { value: "shows", label: "Shows" },
  { value: "all", label: "All" },
];

// Zod schema for validation
const formSchema = z.object({
  coupon: z.string().min(1, "Coupon code is required"),
  description: z.string(),
  coupon_amount: z.number().optional(),
  coupon_percentage: z.number().optional(),
  coupon_max_discount: z.number().optional(),
  valid_until: z.date({ required_error: "Expiration date is required" }),
  max_uses: z.number().positive("Must be at least 1"),
  applicable_for: z.object({
    categories: z.array(z.string()).default(["all"]),
    include: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .optional(),
    exclude: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .optional(),
  }),
  is_draft: z.boolean().optional(),
});

type CouponType = z.infer<typeof formSchema>;

export function CreateEditCoupons({
  open = false,
  editCouponId,
}: {
  open: boolean;
  editCouponId?: string | null | undefined;
}) {
  const defaultValues = {
    coupon: undefined,
    description: undefined,
    coupon_amount: undefined,
    coupon_percentage: undefined,
    coupon_max_discount: undefined,
    valid_until: undefined,
    is_draft: true,
    max_uses: undefined,
    applicable_for: {
      categories: ["all"],
      include: [],
      exclude: [],
    },
  };

  const form = useForm<CouponType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const [isIncludeFilled, setIsIncludeFilled] = useState(false);
  const [isExcludeFilled, setIsExcludeFilled] = useState(false);

  // Watch applicable_for.include and applicable_for.exclude
  const applicableForInclude = form.watch("applicable_for.include");
  const applicableForExclude = form.watch("applicable_for.exclude");

  console.log({ applicableForExclude });

  // Use effect to monitor changes in applicable_for.include or exclude
  useEffect(() => {
    // Check if applicable_for.include has been filled
    if (
      applicableForInclude &&
      applicableForInclude.length > 0 &&
      !isIncludeFilled
    ) {
      setIsIncludeFilled(true);
      form.setValue("applicable_for.exclude", []); // Clear exclude if include is filled
    } else if (!applicableForInclude?.length && isIncludeFilled) {
      setIsIncludeFilled(false);
    }

    // Check if applicable_for.exclude has been filled
    if (
      applicableForExclude &&
      applicableForExclude.length > 0 &&
      !isExcludeFilled
    ) {
      setIsExcludeFilled(true);
      form.setValue("applicable_for.include", []); // Clear include if exclude is filled
    } else if (!applicableForExclude?.length && isExcludeFilled) {
      setIsExcludeFilled(false);
    }
  }, [
    applicableForInclude,
    applicableForExclude,
    form,
    isIncludeFilled,
    isExcludeFilled,
  ]);

  const edit = !!editCouponId;
  const router = useRouter();
  const mutate = useMutationData();

  const generateRandomCoupon = () => {
    const randomCode = Math.random()
      .toString(36)
      .substring(2, 16)
      .toUpperCase();
    form.setValue("coupon", randomCode);
  };

  const onClose = () => {
    form.reset(defaultValues);
    router.back();
  };

  const onSubmit = async (data: CouponType) => {
    try {
      const rsp = await mutate.mutateAsync({
        query: supabase
          .from("coupons")
          .insert({
            coupon: data.coupon,
            description: data.description,
            coupon_amount: data.coupon_amount || null,
            coupon_percentage: data.coupon_percentage || null,
            coupon_max_discount: data.coupon_max_discount || null,
            valid_until: data.valid_until,
            max_uses: data.max_uses,
            is_draft: data.is_draft,
            applicable_for: {
              ...data.applicable_for, // Spread the existing applicable_for data
              include:
                data.applicable_for.include?.map((item) => item.value) || [], // Map to extract ids, fallback to empty array
              exclude:
                data.applicable_for.exclude?.map((item) => item.value) || [], // Map to extract ids, fallback to empty array
            },
          })
          .select(),
      });

      console.log(rsp);

      if (rsp.data) {
        toast("Coupon has been created.");
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding Coupon.");
    }
  };

  const coupon = useFetchData({
    query: supabase
      .from("coupons")
      .select()
      .match({ id: editCouponId })
      .single(),
    options: {
      enabled: edit,
    },
  });

  const { data: includedMovies, error: includedError } = useFetchData({
    query: supabase
      .from("movies")
      .select("id, title")
      .in("id", coupon?.data?.applicable_for?.include ?? []), // Fetch titles for the given IDs
    options: {
      enabled:
        !!coupon?.data && coupon?.data?.applicable_for?.include?.length > 0,
    },
  });

  // Fetch movie titles for the excluded movie IDs
  const { data: excludedMovies, error: excludedError } = useFetchData({
    query: supabase
      .from("movies")
      .select("id, title")
      .in("id", coupon?.data?.applicable_for?.exclude ?? []), // Fetch titles for the given IDs
    options: {
      enabled:
        !!coupon?.data && coupon?.data?.applicable_for?.exclude?.length > 0,
    },
  });

  console.log({ includedMovies, excludedMovies });
  useEffect(() => {
    if (coupon.data) {
      form.reset({
        coupon: coupon.data.coupon,
        description: coupon.data.description,
        coupon_amount: coupon.data.coupon_amount ?? undefined,
        coupon_max_discount: coupon.data.coupon_max_discount ?? undefined,
        coupon_percentage: coupon.data.coupon_percentage ?? undefined,
        valid_until: coupon.data.valid_until
          ? new Date(coupon.data.valid_until)
          : "",
        is_draft: coupon.data.is_draft,
        max_uses: coupon.data.max_uses,
        applicable_for: {
          include:
            includedMovies?.map((movie) => ({
              value: movie.id,
              label: movie.title,
            })) ?? [],
          exclude:
            excludedMovies?.map((movie) => ({
              value: movie.id,
              label: movie.title,
            })) ?? [],
        },
      });
    } else {
      form.reset(defaultValues); // Reset to default values if no coupon data
    }
  }, [coupon.data, includedMovies, excludedMovies, form]);

  const onSubmitEdit = async (data: CouponType) => {
    try {
      if (!coupon.data) return;

      const rsp = await mutate.mutateAsync({
        query: supabase
          .from("coupons")
          .update({
            coupon: data.coupon,
            description: data.description,
            coupon_amount: data.coupon_amount || null,
            coupon_percentage: data.coupon_percentage || null,
            coupon_max_discount: data.coupon_max_discount || null,
            valid_until: data.valid_until,
            max_uses: data.max_uses,
            is_draft: data.is_draft,
            applicable_for: {
              ...data.applicable_for,
              include: data.applicable_for.include?.map((item) => item.value), // Extract only the `value` (id) from the include list
              exclude: data.applicable_for.exclude?.map((item) => item.value), // Extract only the `value` (id) from the exclude list
            },
          })
          .match({ id: coupon.data.id })
          .select(),
      });

      console.log(rsp);

      if (rsp.data) {
        toast("Coupon has been updated.");
        onClose();
      }
    } catch (err) {
      console.log("err coupon", err);
      toast.error("Error updating coupon");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle>
            {editCouponId ? "Edit Coupon" : "Create Coupon"}
          </DialogTitle>
          <DialogDescription>
            Fill in the coupon details below
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          {edit && coupon.isLoading && <Skeleton className="w-full h-20" />}
          {!coupon.isLoading && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(edit ? onSubmitEdit : onSubmit)}
                className="space-y-4 w-full"
              >
                {/* Coupon Code */}
                <FormField
                  control={form.control}
                  name="coupon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coupon Code</FormLabel>
                      <div className="flex space-x-2 items-center">
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter or generate code"
                            {...field}
                          />
                        </FormControl>
                        <Button type="button" onClick={generateRandomCoupon}>
                          Generate
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type Here"
                          className="resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coupon_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coupon Amount (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter coupon amount"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name="coupon_percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coupon Percentage</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter percentage (optional)"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="coupon_max_discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Discount (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter max discount (optional)"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={form.control}
                  name="valid_until"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valid Until</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={
                            field.value
                              ? `${new Date(
                                  field.value
                                ).getFullYear()}-${String(
                                  new Date(field.value).getMonth() + 1
                                ).padStart(2, "0")}-${String(
                                  new Date(field.value).getDate()
                                ).padStart(2, "0")}T${String(
                                  new Date(field.value).getHours()
                                ).padStart(2, "0")}:${String(
                                  new Date(field.value).getMinutes()
                                ).padStart(2, "0")}`
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(new Date(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Max Uses */}
                <FormField
                  control={form.control}
                  name="max_uses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Uses</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter max uses"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Applicable Categories */}
                <FormField
                  control={form.control}
                  name="applicable_for.categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Applicable For Categories</FormLabel>
                      <FormControl>
                        <Select
                          isMulti
                          options={applicableCategories}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          value={applicableCategories.filter((option) =>
                            field.value?.includes(option.value)
                          )}
                          onChange={(selected) =>
                            field.onChange(
                              selected.map((option) => option.value)
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="applicable_for.include"
                  render={({ field }) => {
                    // Fetch movies asynchronously
                    const { data: movies, isFetching } = useFetchData({
                      query: supabase.from("movies").select("id, title"),
                    });

                    const initialOptions = useMemo(() => {
                      if (!movies) {
                        return [];
                      }

                      return movies.map((movie) => ({
                        value: movie.id,
                        label: movie.title,
                      }));
                    }, [movies]);

                    const loadOptions = (inputValue: string) =>
                      new Promise<{ value: string; label: string }[]>(
                        async (resolve) => {
                          if (!inputValue) resolve([]);

                          const { data, error } = await supabase
                            .from("movies")
                            .select("id, title")
                            .ilike("title", `%${inputValue}%`);

                          if (error || !data) {
                            resolve([]);
                            return;
                          }

                          resolve(
                            data.map((movie) => ({
                              value: movie.id,
                              label: movie.title,
                            }))
                          );
                        }
                      );

                    return (
                      <FormItem>
                        <FormLabel>Include Movies</FormLabel>
                        <FormControl>
                          <AsyncSelect
                            loadOptions={loadOptions}
                            isDisabled={isExcludeFilled}
                            defaultOptions={initialOptions}
                            isMulti
                            cacheOptions
                            {...field}
                            isLoading={isFetching}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="applicable_for.exclude"
                  render={({ field }) => {
                    // Fetch movies asynchronously
                    const { data: movies, isFetching } = useFetchData({
                      query: supabase.from("movies").select("id, title"),
                    });

                    const initialOptions = useMemo(() => {
                      if (!movies) {
                        return [];
                      }

                      return movies.map((movie) => ({
                        value: movie.id,
                        label: movie.title,
                      }));
                    }, [movies]);

                    const loadOptions = (inputValue: string) =>
                      new Promise<{ value: string; label: string }[]>(
                        async (resolve) => {
                          if (!inputValue) resolve([]);

                          const { data, error } = await supabase
                            .from("movies")
                            .select("id, title")
                            .ilike("title", `%${inputValue}%`);

                          if (error || !data) {
                            resolve([]);
                            return;
                          }

                          resolve(
                            data.map((movie) => ({
                              value: movie.id,
                              label: movie.title,
                            }))
                          );
                        }
                      );

                    return (
                      <FormItem>
                        <FormLabel>Exclude Movies</FormLabel>
                        <FormControl>
                          <AsyncSelect
                            loadOptions={loadOptions}
                            defaultOptions={initialOptions}
                            isDisabled={isIncludeFilled}
                            isMulti
                            cacheOptions
                            {...field}
                            isLoading={isFetching}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="is_draft"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormLabel>Is Draft</FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(value) => field.onChange(value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {editCouponId ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
