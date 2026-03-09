"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";
import { User, Utang } from "../types";

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [debts, setDebts] = useState<Utang[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAmount, setNewAmount] = useState("");
  const [newDate, setNewDate] = useState("");
  const [addingDebt, setAddingDebt] = useState(false);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      router.push("/");
      return;
    }

    async function fetchData() {
      const { data: user } = await supabase
        .from("user")
        .select("*")
        .eq("id", Number(userId))
        .single();

      if (!user) {
        router.push("/");
        return;
      }

      setCurrentUser(user as User);

      const { data: utangs } = await supabase
        .from("utang")
        .select("*")
        .eq("user_id", Number(userId))
        .order("date", { ascending: false });

      setDebts((utangs as Utang[]) || []);
      setLoading(false);
    }

    fetchData();
  }, [router]);

  const totalDebt = debts.reduce((sum, d) => sum + d.amount, 0);

  const handleAddDebt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmount || !newDate || !currentUser) return;

    setAddingDebt(true);

    const { data, error } = await supabase
      .from("utang")
      .insert({
        amount: parseFloat(newAmount),
        date: newDate,
        user_id: currentUser.id,
      })
      .select()
      .single();

    if (!error && data) {
      setDebts((prev) => [data as Utang, ...prev]);
    }

    setNewAmount("");
    setNewDate("");
    setShowAddForm(false);
    setAddingDebt(false);
  };

  if (loading || !currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-accent-lavender border-t-transparent" />
          <p className="text-sm text-muted">Loading…</p>
        </div>
      </div>
    );
  }

  const scoreColor =
    currentUser.payment_score >= 80
      ? "bg-accent-mint text-emerald-700"
      : currentUser.payment_score >= 50
      ? "bg-accent-amber text-amber-700"
      : "bg-accent-peach text-red-700";

  const scoreBarColor =
    currentUser.payment_score >= 80
      ? "from-emerald-400 to-emerald-300"
      : currentUser.payment_score >= 50
      ? "from-amber-400 to-amber-300"
      : "from-red-400 to-red-300";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Welcome Header */}
        <div className="animate-fade-in mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, <span className="gradient-text">{currentUser.name}</span>
          </h1>
          <p className="mt-1 text-sm text-muted">
            Here&apos;s a summary of your outstanding debts.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-5 sm:grid-cols-3">
          {/* Total Debt */}
          <div className="card animate-slide-up p-5" style={{ animationDelay: "0.05s" }}>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-lavender-light">
              <svg className="h-5 w-5 text-[#7c3aed]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <p className="text-xs font-medium text-muted">Total Debt</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              ₱{totalDebt.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Number of Records */}
          <div className="card animate-slide-up p-5" style={{ animationDelay: "0.1s" }}>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-sky-light">
              <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-xs font-medium text-muted">Debt Records</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{debts.length}</p>
          </div>

          {/* Payment Score */}
          <div className="card animate-slide-up p-5" style={{ animationDelay: "0.15s" }}>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-mint-light">
                <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${scoreColor}`}>
                {currentUser.payment_score}/100
              </span>
            </div>
            <p className="text-xs font-medium text-muted">Payment Score</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted-bg">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${scoreBarColor} transition-all duration-700`}
                style={{ width: `${currentUser.payment_score}%` }}
              />
            </div>
          </div>
        </div>

        {/* Debts Section */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-foreground">Your Debts</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-gradient rounded-xl px-4 py-2 text-sm font-medium"
          >
            {showAddForm ? "Cancel" : "+ Add Debt"}
          </button>
        </div>

        {/* Add Debt Form */}
        {showAddForm && (
          <div className="card animate-fade-in mb-5 p-5">
            <form onSubmit={handleAddDebt} className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[180px]">
                <label htmlFor="amount" className="mb-1 block text-xs font-medium text-muted">
                  Amount (₱)
                </label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-card-border bg-muted-bg/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-accent-lavender focus:bg-white focus:ring-2 focus:ring-accent-lavender/30"
                  required
                />
              </div>
              <div className="flex-1 min-w-[180px]">
                <label htmlFor="date" className="mb-1 block text-xs font-medium text-muted">
                  Due Date
                </label>
                <input
                  id="date"
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full rounded-xl border border-card-border bg-muted-bg/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-accent-lavender focus:bg-white focus:ring-2 focus:ring-accent-lavender/30"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={addingDebt}
                className="btn-gradient rounded-xl px-6 py-2.5 text-sm font-medium disabled:opacity-60"
              >
                {addingDebt ? "Saving…" : "Save"}
              </button>
            </form>
          </div>
        )}

        {/* Debt Cards */}
        <div className="space-y-3">
          {debts.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-muted">No debts recorded yet. 🎉</p>
            </div>
          ) : (
            debts.map((debt, index) => {
              const dueDate = new Date(debt.date);
              const isOverdue = dueDate < new Date();
              return (
                <div
                  key={debt.id}
                  className="card animate-slide-up flex items-center justify-between p-5"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold ${
                        isOverdue
                          ? "bg-accent-peach-light text-red-500"
                          : "bg-accent-lavender-light text-[#7c3aed]"
                      }`}
                    >
                      ₱
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground">
                        ₱{debt.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-muted">
                        Created {new Date(debt.created_at).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        isOverdue
                          ? "bg-accent-peach text-red-700"
                          : "bg-accent-mint text-emerald-700"
                      }`}
                    >
                      {isOverdue ? "Overdue" : "Due"}{" "}
                      {dueDate.toLocaleDateString("en-PH", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
