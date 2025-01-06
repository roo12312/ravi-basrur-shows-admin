"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

import { redirect, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "@/hooks/useRouter";

const formSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string(),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const defaultValues = {
    email: "",
    password: "",
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const loading = form.formState.isSubmitting;
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: UserFormValue) => {
    setError(null); // Reset error state
    try {
      console.log(data);
      const rsp = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      console.log("rsp ", rsp);
      if (!rsp.error) {
        router.replace("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during sign-in");
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="******"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button disabled={loading} className="ml-auto w-full" type="submit">
            Login
          </Button>
        </form>
      </Form>
    </>
  );
}
