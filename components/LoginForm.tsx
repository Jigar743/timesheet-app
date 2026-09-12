"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setIsLoading(true);

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Invalid email or password.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>

        <Input
          id="email"
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>

        <Input
          id="password"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      {/* Remember me */}
      <div className="flex items-center gap-2">
        <input id="remember-me" type="checkbox" className="h-3.5 w-3.5" />

        <Label
          htmlFor="remember-me"
          className="text-xs font-normal text-gray-500"
        >
          Remember me
        </Label>
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#3159dd] hover:bg-[#284dcc] cursor-pointer py-5"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
