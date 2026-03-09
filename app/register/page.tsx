"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { hashPassword } from "../lib/hash";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      // Check if username already exists
      const { data: existing } = await supabase
        .from("user")
        .select("id")
        .eq("name", username)
        .single();

      if (existing) {
        setError("Username is already taken.");
        setIsLoading(false);
        return;
      }

      const hashed = await hashPassword(password);

      const { error: insertError } = await supabase.from("user").insert({
        name: username,
        email: email,
        password_hash: hashed,
        payment_score: 100,
      });

      if (insertError) {
        setError(insertError.message);
        setIsLoading(false);
        return;
      }

      router.push("/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent-mint/30 blur-3xl" />
        <div className="absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-accent-lavender/25 blur-3xl" />
        <div className="absolute -bottom-24 right-1/3 h-72 w-72 rounded-full bg-accent-sky/25 blur-3xl" />
      </div>

      <div className="animate-fade-in relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] text-2xl font-bold text-white shadow-lg">
            U
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create <span className="gradient-text">Account</span>
          </h1>
          <p className="mt-2 text-sm text-muted">
            Sign up to start tracking your debts
          </p>
        </div>

        {/* Register Card */}
        <div className="card-elevated p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Error message */}
            {error && (
              <div className="animate-fade-in rounded-xl bg-accent-peach-light border border-accent-peach px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                className="w-full rounded-xl border border-card-border bg-muted-bg/50 px-4 py-3 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted focus:border-accent-lavender focus:bg-white focus:ring-2 focus:ring-accent-lavender/30"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-xl border border-card-border bg-muted-bg/50 px-4 py-3 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted focus:border-accent-lavender focus:bg-white focus:ring-2 focus:ring-accent-lavender/30"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-card-border bg-muted-bg/50 px-4 py-3 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted focus:border-accent-lavender focus:bg-white focus:ring-2 focus:ring-accent-lavender/30"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full rounded-xl border border-card-border bg-muted-bg/50 px-4 py-3 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted focus:border-accent-lavender focus:bg-white focus:ring-2 focus:ring-accent-lavender/30"
                required
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-gradient w-full rounded-xl py-3 text-sm font-semibold tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="opacity-25"
                    />
                    <path
                      d="M4 12a8 8 0 018-8"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="opacity-75"
                    />
                  </svg>
                  Creating account…
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link
              href="/"
              className="font-medium text-[#7c3aed] transition-colors hover:text-[#6d28d9]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
