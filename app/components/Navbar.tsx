"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/dashboard", label: "My Debts" },
    { href: "/admin", label: "Admin" },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userName");
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-card-border bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] text-white text-sm font-bold shadow-sm">
            U
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Utang<span className="gradient-text">Tracker</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-accent-lavender-light text-[#7c3aed]"
                    : "text-muted hover:bg-muted-bg hover:text-foreground"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 translate-y-3 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6]" />
                )}
              </Link>
            );
          })}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="ml-4 rounded-lg border border-card-border px-4 py-2 text-sm font-medium text-muted transition-all duration-200 hover:border-accent-peach hover:bg-accent-peach-light hover:text-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
