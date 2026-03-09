"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";
import { User, Utang } from "../types";

interface UserWithDebts extends User {
  debts: Utang[];
  totalDebt: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [usersWithDebts, setUsersWithDebts] = useState<UserWithDebts[]>([]);
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      router.push("/");
      return;
    }

    async function fetchData() {
      const { data: users } = await supabase
        .from("user")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: utangs } = await supabase
        .from("utang")
        .select("*")
        .order("date", { ascending: false });

      if (users && utangs) {
        const combined: UserWithDebts[] = (users as User[]).map((user) => {
          const userDebts = (utangs as Utang[]).filter(
            (u) => u.user_id === user.id
          );
          const totalDebt = userDebts.reduce((sum, d) => sum + d.amount, 0);
          return { ...user, debts: userDebts, totalDebt };
        });
        setUsersWithDebts(combined);
      }

      setLoading(false);
    }

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-accent-lavender border-t-transparent" />
          <p className="text-sm text-muted">Loading…</p>
        </div>
      </div>
    );
  }

  const totalUsers = usersWithDebts.length;
  const totalOutstanding = usersWithDebts.reduce(
    (sum, u) => sum + u.totalDebt,
    0
  );
  const avgScore =
    totalUsers > 0
      ? Math.round(
          usersWithDebts.reduce((sum, u) => sum + u.payment_score, 0) /
            totalUsers
        )
      : 0;

  const scoreColor = (score: number) =>
    score >= 80
      ? "bg-accent-mint text-emerald-700"
      : score >= 50
      ? "bg-accent-amber text-amber-700"
      : "bg-accent-peach text-red-700";

  const scoreBarColor = (score: number) =>
    score >= 80
      ? "from-emerald-400 to-emerald-300"
      : score >= 50
      ? "from-amber-400 to-amber-300"
      : "from-red-400 to-red-300";

  const handleEmail = (user: UserWithDebts) => {
    const subject = encodeURIComponent(
      `Debt Reminder — UtangTracker`
    );
    const body = encodeURIComponent(
      `Hi ${user.name},\n\nThis is a reminder about your outstanding debt of ₱${user.totalDebt.toLocaleString("en-PH", { minimumFractionDigits: 2 })}.\n\nYou currently have ${user.debts.length} debt record(s) on file. Please settle at your earliest convenience.\n\nThank you,\nUtangTracker Admin`
    );
    window.open(`mailto:${user.email}?subject=${subject}&body=${body}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Header */}
        <div className="animate-fade-in mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="mt-1 text-sm text-muted">
            Overview of all users and their outstanding debts.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-5 sm:grid-cols-3">
          {/* Total Users */}
          <div
            className="card animate-slide-up p-5"
            style={{ animationDelay: "0.05s" }}
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-lavender-light">
              <svg
                className="h-5 w-5 text-[#7c3aed]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <p className="text-xs font-medium text-muted">Total Users</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {totalUsers}
            </p>
          </div>

          {/* Total Outstanding */}
          <div
            className="card animate-slide-up p-5"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-peach-light">
              <svg
                className="h-5 w-5 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <p className="text-xs font-medium text-muted">Total Outstanding</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              ₱
              {totalOutstanding.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

          {/* Avg Payment Score */}
          <div
            className="card animate-slide-up p-5"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-mint-light">
              <svg
                className="h-5 w-5 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-xs font-medium text-muted">
              Avg. Payment Score
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {avgScore}/100
            </p>
          </div>
        </div>

        {/* Users List */}
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          All Users
        </h2>

        {usersWithDebts.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-muted">No users found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {usersWithDebts.map((user, index) => {
              const isExpanded = expandedUserId === user.id;
              return (
                <div
                  key={user.id}
                  className="card animate-slide-up overflow-hidden"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* User Row */}
                  <div className="flex w-full items-center justify-between p-5">
                    <button
                      onClick={() =>
                        setExpandedUserId(isExpanded ? null : user.id)
                      }
                      className="flex flex-1 items-center gap-4 text-left"
                    >
                      {/* Avatar */}
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent-lavender to-accent-sky text-sm font-bold text-white">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted">
                          {user.email} · {user.debts.length} debt
                          record{user.debts.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </button>

                    <div className="flex items-center gap-3">
                      {/* Total Debt */}
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-muted">Total Debt</p>
                        <p className="text-sm font-bold text-foreground">
                          ₱
                          {user.totalDebt.toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>

                      {/* Score Badge */}
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${scoreColor(
                          user.payment_score
                        )}`}
                      >
                        {user.payment_score}
                      </span>

                      {/* Email Button */}
                      <button
                        onClick={() => handleEmail(user)}
                        title={`Email ${user.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-card-border text-muted transition-all hover:border-accent-sky hover:bg-accent-sky-light hover:text-blue-500"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </button>

                      {/* Chevron */}
                      <button
                        onClick={() =>
                          setExpandedUserId(isExpanded ? null : user.id)
                        }
                      >
                        <svg
                          className={`h-4 w-4 text-muted transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Debts */}
                  {isExpanded && (
                    <div className="animate-fade-in border-t border-card-border bg-muted-bg/30 px-5 py-4">
                      {/* Score Bar */}
                      <div className="mb-4 flex items-center gap-3">
                        <p className="text-xs font-medium text-muted">
                          Payment Score
                        </p>
                        <div className="h-2 flex-1 max-w-xs overflow-hidden rounded-full bg-muted-bg">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${scoreBarColor(
                              user.payment_score
                            )} transition-all duration-700`}
                            style={{ width: `${user.payment_score}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-muted">
                          {user.payment_score}/100
                        </span>
                      </div>

                      {/* Debt entries table */}
                      {user.debts.length === 0 ? (
                        <p className="text-sm text-muted">No debt records.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm">
                            <thead>
                              <tr className="text-xs font-medium text-muted">
                                <th className="pb-2 pr-4">Amount</th>
                                <th className="pb-2 pr-4">Due Date</th>
                                <th className="pb-2 pr-4">Created</th>
                                <th className="pb-2">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-card-border">
                              {user.debts.map((debt) => {
                                const dueDate = new Date(debt.date);
                                const isOverdue = dueDate < new Date();
                                return (
                                  <tr key={debt.id}>
                                    <td className="py-2.5 pr-4 font-semibold text-foreground">
                                      ₱
                                      {debt.amount.toLocaleString("en-PH", {
                                        minimumFractionDigits: 2,
                                      })}
                                    </td>
                                    <td className="py-2.5 pr-4 text-muted">
                                      {dueDate.toLocaleDateString("en-PH", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </td>
                                    <td className="py-2.5 pr-4 text-muted">
                                      {new Date(
                                        debt.created_at
                                      ).toLocaleDateString("en-PH", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </td>
                                    <td className="py-2.5">
                                      <span
                                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                          isOverdue
                                            ? "bg-accent-peach text-red-700"
                                            : "bg-accent-mint text-emerald-700"
                                        }`}
                                      >
                                        {isOverdue ? "Overdue" : "Active"}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
