import React from "react";
import { CheckCircle, Clock, Send, XCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// 1. Define valid statuses (Optional, but good for TypeScript safety)
export type QuotationStatus = "Draft" | "Sent" | "Accepted" | "Rejected" | string;

interface QuotationStatusBadgeProps {
  status: QuotationStatus;
}

// 2. Configuration Maps
const STATUS_STYLES: Record<string, string> = {
  Draft: "bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]",
  Sent: "bg-[var(--primary)]/20 text-[var(--primary)] border-[var(--primary)]/30",
  Accepted: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  Rejected: "bg-[var(--destructive)]/20 text-[var(--destructive)] border-[var(--destructive)]/30",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  Draft: <Clock className="w-3.5 h-3.5" />,
  Sent: <Send className="w-3.5 h-3.5" />,
  Accepted: <CheckCircle className="w-3.5 h-3.5" />,
  Rejected: <XCircle className="w-3.5 h-3.5" />,
};

export function QuotationStatusBadge({ status }: QuotationStatusBadgeProps) {
  // Fallback for unknown statuses
  const styles = STATUS_STYLES[status] || "bg-gray-100 text-gray-600";
  const icon = STATUS_ICONS[status] || <AlertCircle className="w-3.5 h-3.5" />;

  return (
    <Badge
      className={`capitalize text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-x-1.5 w-fit border shadow-sm ${styles}`}
    >
      {icon}
      <span>{status}</span>
    </Badge>
  );
}