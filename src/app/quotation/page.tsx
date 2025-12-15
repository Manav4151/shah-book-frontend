"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, ArrowDown, ArrowUp, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RoleGate } from "@/lib/use-role";
import { ROLE_GROUPS } from "@/lib/role";
import { BookSelectionDialog } from "@/components/books/BookSelectionDialog";

// Custom Hooks & Components
import { useQuotations } from "@/hooks/use-quotations";
import { QuotationCard } from "@/components/quotations/QuotationCard";
import { QuotationStats } from "@/components/quotations/QuotationStats";

export default function QuotationPage() {
  const router = useRouter();
  const [bookDialogOpen, setBookDialogOpen] = useState(false);

  // 1. All Logic handled here
  const {
    quotations, loading, error, stats,
    searchQuery, setSearchQuery, sortOrder, setSortOrder,
    totalCount, dbTotal
  } = useQuotations();

  // Handlers
  const handleBooksSelected = (ids: string[]) => {
    const params = new URLSearchParams();
    ids.forEach(id => params.append("id", id));
    router.push(`/quotation/preview?${params.toString()}`);
  };

  // 2. Simple Returns for Loading/Error
  if (loading) return <div className="p-8 text-center text-xl">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">

      {/* HEADER */}
      <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Quotations</h1>
          <p className="text-[var(--muted-foreground)]">Manage and track all your quotations.</p>
        </div>
        <RoleGate allow={ROLE_GROUPS.QUOTATION_MANAGERS}>
          <Button className="bg-[var(--primary)] text-white" onClick={() => setBookDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Create New Quotation
          </Button>
        </RoleGate>
      </header>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-[var(--input)] rounded-xl shadow-sm mb-6 border border-[var(--border)]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] w-4 h-4" />
          <Input
            placeholder="Search by quotation ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-[var(--background)]"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
        >
          {sortOrder === "newest" ? <ArrowDown className="mr-2 w-4 h-4" /> : <ArrowUp className="mr-2 w-4 h-4" />}
          Sort by Date
        </Button>
      </div>

      {/* STATS */}
      <QuotationStats stats={stats} />

      {/* LIST */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">
          {searchQuery ? `Search Results (${totalCount})` : `All Quotations (${dbTotal})`}
        </h2>

        {quotations.length > 0 ? (
          <div className="flex flex-col gap-4">
            {quotations.map((q) => <QuotationCard key={q._id} quotation={q} />)}
          </div>
        ) : (
          <EmptyState onCreate={() => setBookDialogOpen(true)} />
        )}
      </div>

      {/* DIALOG */}
      <BookSelectionDialog
        open={bookDialogOpen}
        onOpenChange={setBookDialogOpen}
        onBooksSelected={handleBooksSelected}
        mode="create"
        buttonText="Generate Quotation"
      />
    </div>
  );
}

// Sub-component for Empty State (keeps main file clean)
function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <FileText className="w-12 h-12 text-[var(--primary)]" />
      </div>
      <h3 className="text-xl font-semibold mb-3">No Quotations Found</h3>
      <RoleGate allow={ROLE_GROUPS.QUOTATION_MANAGERS}>
        <Button className="bg-[var(--primary)] text-white" onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" /> Create New Quotation
        </Button>
      </RoleGate>
    </div>
  );
}