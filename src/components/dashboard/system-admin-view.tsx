"use client";

import Link from "next/link";
import { ShieldCheck, Users, ArrowRight } from "lucide-react";

export function SystemAdminView() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--background)] p-6 md:p-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Admin Console</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">Manage your organizations agents and users.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/agents" className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 transition-all hover:border-[var(--primary)] hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="inline-flex rounded-lg bg-orange-100 p-3 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--foreground)]">Agent Management</h3>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                    Create new agents, assign territories, and monitor performance metrics.
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-[var(--muted-foreground)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--primary)]" />
            </div>
          </Link>

          <Link href="/admin/users" className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 transition-all hover:border-[var(--primary)] hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="inline-flex rounded-lg bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--foreground)]">User Management</h3>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                    View all registered users, manage access levels, and handle account requests.
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-[var(--muted-foreground)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--primary)]" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}