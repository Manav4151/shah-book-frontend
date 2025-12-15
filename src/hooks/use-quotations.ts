"use client";

import { useState, useEffect, useMemo } from "react";
import { apiFunctions } from "@/services/api.service";
import { Quotation, Pagination } from "@/types/quotation";

export function useQuotations() {
  const [data, setData] = useState<Quotation[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // Fetch Data
  useEffect(() => {
    async function fetchQuotations() {
      try {
        setLoading(true);
        const response = await apiFunctions.getQuotation();
        if (!response.success) throw new Error("Failed to fetch quotations");
        
        setData(response.quotations);
        setPagination(response.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchQuotations();
  }, []);

  // Filter & Sort Logic
  const filteredQuotations = useMemo(() => {
    let filtered = [...data];

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((q) =>
        q.quotationId.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [data, searchQuery, sortOrder]);

  // Stats Logic
  const stats = useMemo(() => ({
    total: pagination?.totalItems || 0,
    totalValue: data.reduce((acc, q) => acc + q.grandTotal, 0),
    draft: data.filter((q) => q.status === "Draft").length,
    sent: data.filter((q) => q.status === "Sent").length,
    accepted: data.filter((q) => q.status === "Accepted").length,
    rejected: data.filter((q) => q.status === "Rejected").length,
  }), [data, pagination]);

  return {
    quotations: filteredQuotations,
    loading,
    error,
    stats,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    totalCount: filteredQuotations.length,
    dbTotal: pagination?.totalItems || 0,
  };
}