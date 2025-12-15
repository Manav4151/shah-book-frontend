"use client";

import Link from "next/link";
import { 
  BookOpen, 
  Mail, 
  FileText, 
  ArrowRight,
  BarChart3,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function UserDashboardView() {
  const tools = [
    {
      title: "Book Inventory",
      description: "Manage stock, update pricing, and track ISBNs.",
      icon: BookOpen,
      href: "/books",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/20",
      action: "Manage Books"
    },
    {
      title: "Email System",
      description: "Send notifications and manage communications.",
      icon: Mail,
      href: "/emails",
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/20",
      action: "Check Inbox"
    },
    {
      title: "Quotations",
      description: "Generate and track sales quotations.",
      icon: FileText,
      href: "/quotation",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900/20",
      action: "Create Quote"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--background)] p-6 md:p-12">
      <div className="mx-auto max-w-6xl">
        {/* Header with Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Dashboard</h1>
            <p className="mt-2 text-[var(--muted-foreground)]">
              Welcome back. Here is an overview of your workspace.
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
            <Input
              type="search"
              placeholder="Search books or quotes..."
              className="pl-9 bg-[var(--card)] border-[var(--border)] focus-visible:ring-[var(--primary)]"
            />
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--muted-foreground)]">Total Books</p>
                <h3 className="text-2xl font-bold text-[var(--foreground)]">1,234</h3>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/20">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--muted-foreground)]">Pending Quotes</p>
                <h3 className="text-2xl font-bold text-[var(--foreground)]">12</h3>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--muted-foreground)]">Sales Today</p>
                <h3 className="text-2xl font-bold text-[var(--foreground)]">$3,450</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link key={index} href={tool.href} className="group h-full">
                <div className="h-full flex flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all hover:border-[var(--primary)] hover:shadow-lg">
                  <div>
                    <div className={`inline-flex rounded-lg p-3 ${tool.bg} ${tool.color} mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-[var(--muted-foreground)] mb-6">
                      {tool.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center text-sm font-medium text-[var(--primary)] group-hover:translate-x-1 transition-transform">
                    {tool.action} <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}