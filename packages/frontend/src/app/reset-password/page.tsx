"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const ResetPasswordPage = () => {

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      validateToken(token);
    }
  }, [token]);

  const validateToken = async (token: string) => {
    try {
      const response = await axios.post('http://localhost:3000/validate-reset-token', {
        token,
      });
      if (response.data.isValid) {
        setIsValid(true);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

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
          <p className="w-full">The token you provided is invalid. Please request a new password reset link.</p>
        </div>
      </div>
    );
  }
  

  return (
    <div className="bg-zinc-200 w-screen h-screen p-4 flex flex-col justify-center items-center">
      <form className="flex flex-col min-w-80 gap-6">
        <h1 className="text-2xl w-full">Reset your password</h1>
        <div className="w-full flex flex-col gap-2">
          <Input type="password" placeholder="New password" />
          <Input type="password" placeholder="Confirm new password" />
        </div>
        <Button className="w-full font" variant="default">
          Reset Password
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
