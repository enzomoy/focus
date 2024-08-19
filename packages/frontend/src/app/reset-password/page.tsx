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
import { resetPwdSchema } from "@common/validations/resetpwd-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof resetPwdSchema>>({
    resolver: zodResolver(resetPwdSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (token) {
      validateToken(token);
    }
  }, [token]);

  const validateToken = async (token: string) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/validate-reset-token",
        {
          token,
        },
      );
      if (response.data.isValid) {
        setIsValid(true);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (data: z.infer<typeof resetPwdSchema>) => {
    // Check if passwords match
    if (data.password !== data.confirmPassword) {
      form.setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/reset-password",
        {
          token,
          password: data.password,
        },
      );
      if (response.data.success) {
        window.location.href = "/login";
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="bg-zinc-200 w-screen h-screen p-4 flex flex-col justify-center items-center">
        <div className="flex flex-col min-w-80 gap-6">
          <h1 className="text-2xl w-full">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="bg-zinc-200 w-screen h-screen p-4 flex flex-col justify-center items-center">
        <div className="flex flex-col min-w-80 gap-6">
          <h1 className="text-2xl w-full">Invalid token</h1>
          <p className="w-full">
            The token you provided is invalid. Please request a new password
            reset link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-200 w-screen h-screen p-4 flex flex-col justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col min-w-80 gap-6"
        >
          <h1 className="text-2xl w-full">Reset your password</h1>
          <div className="w-full flex flex-col gap-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="New password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="w-full" variant="default">
            Reset Password
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordPage;
