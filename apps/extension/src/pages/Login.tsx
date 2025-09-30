"use client";

import React from "react";
import { useTransition } from "react";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
// shadcn/ui
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

// Your better-auth client (adjust import path if needed)
import { authClient } from "@/lib/auth-client";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        await authClient.signIn.email({
          email: values.email,
          password: values.password,
        });
        toast("Welcome back!");
        navigate("/dashboard");
      } catch (err: any) {
        toast.error(err?.message ?? "Login failed");
      }
    });
  };

  return (
    <div className="min-h-[100dvh] grid place-items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 p-4">
      {/* Subtle glowing background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="w-full max-w-md"
      >
        <Card className="backdrop-blur-xl border-slate-700/40 bg-slate-900/60 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription className="text-slate-300">
              Sign in to your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                          <Input
                            placeholder="you@example.com"
                            type="email"
                            className="pl-9"
                            {...field}
                          />
                        </div>
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
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <a
                          href="/forgot"
                          className="text-xs text-slate-300 hover:underline"
                        >
                          Forgot?
                        </a>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                          <Input
                            placeholder="••••••••"
                            type="password"
                            className="pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? "Signing in…" : "Sign In"}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="text-center block text-xs text-slate-400">
            By signing in you agree to our{" "}
            <a className="underline hover:text-slate-200" href="/terms">
              Terms
            </a>{" "}
            &{" "}
            <a className="underline hover:text-slate-200" href="/privacy">
              Privacy Policy
            </a>
            .
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
