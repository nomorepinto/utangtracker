"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "./lib/supabase";
import { hashPassword } from "./lib/hash";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Hardcoded admin credentials
  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "admin123";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Check for admin credentials first
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        sessionStorage.setItem("isAdmin", "true");
        router.push("/admin");
        return;
      }

      const hashed = await hashPassword(password);

      const { data: user, error: dbError } = await supabase
        .from("user")
        .select("*")
        .eq("name", username)
        .eq("password_hash", hashed)
        .single();

      if (dbError || !user) {
        setError("Invalid username or password.");
        setIsLoading(false);
        return;
      }

      sessionStorage.setItem("userId", String(user.id));
      sessionStorage.setItem("userName", user.name);
      router.push("/dashboard");
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
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-accent-lavender/30 blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-accent-sky/25 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-accent-mint/25 blur-3xl" />
      </div>

      <div className="animate-fade-in relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] text-2xl font-bold text-white shadow-lg">
            U
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Utang<span className="gradient-text">Tracker</span>
          </h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to manage your debts
          </p>
        </div>

        {/* Login Card */}
        <div className="card-elevated p-8">
          <form onSubmit={handleLogin} className="space-y-5">
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
                placeholder="Enter your name"
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
                placeholder="Enter your password"
                className="w-full rounded-xl border border-card-border bg-muted-bg/50 px-4 py-3 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted focus:border-accent-lavender focus:bg-white focus:ring-2 focus:ring-accent-lavender/30"
                required
              />
            </div>

            {/* Login Button */}
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
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-[#7c3aed] transition-colors hover:text-[#6d28d9]"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
