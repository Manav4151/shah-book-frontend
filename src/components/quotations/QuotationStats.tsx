import { FileText, DollarSign, Clock, CheckCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function QuotationStats({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard icon={FileText} label="Total Quotes" value={stats.total} color="primary" />
      <StatCard icon={DollarSign} label="Total Value" value={formatCurrency(stats.totalValue)} color="success" />
      <StatCard icon={Clock} label="Draft" value={stats.draft} color="warning" />
      <StatCard icon={CheckCircle} label="Accepted" value={stats.accepted} color="primary" />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  // Map simple color names to your Tailwind variables if needed
  const colors: any = {
    primary: "text-[var(--primary)] border-[var(--primary)]/20 bg-[var(--primary)]/10",
    success: "text-[var(--success)] border-[var(--success)]/20 bg-[var(--success)]/10",
    warning: "text-[var(--warning)] border-[var(--warning)]/20 bg-[var(--warning)]/10",
  };
  
  return (
    <div className={`${colors[color]} rounded-xl p-4 text-center border`}>
      <Icon className="w-8 h-8 mx-auto mb-2" />
      <div className="text-2xl font-bold text-[var(--foreground)]">{value}</div>
      <div className="text-sm opacity-80">{label}</div>
    </div>
  );
}