import { useRouter } from "next/navigation";
import { Mail, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Quotation } from "@/types/quotation";
import { QuotationStatusBadge } from "./QuotationStatusBadge"; // Extract this too if you want
import { formatDate, formatCurrency } from "@/lib/utils"; // Assume you moved helpers here

export function QuotationCard({ quotation }: { quotation: Quotation }) {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/quotation/${quotation._id}`)}
            className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-[var(--input)] rounded-xl shadow-sm border border-[var(--border)] hover:border-[var(--primary)]/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
            <div className="flex-1 flex flex-wrap justify-between gap-4 w-full">
                <InfoBlock label="Quote ID" value={quotation.quotationId} />
                <InfoBlock label="Customer" value={quotation.customer.name} />
                <InfoBlock label="Created" value={formatDate(quotation.createdAt)} />
                <InfoBlock label="Valid Until" value={formatDate(quotation.validUntil)} />

                <div className="flex flex-col gap-1 text-right sm:text-left">
                    <p className="text-sm text-[var(--muted-foreground)]">Grand Total</p>
                    <p className="font-bold text-lg text-[var(--foreground)]">
                        {formatCurrency(quotation.grandTotal)}
                    </p>
                </div>

                <div className="flex items-center gap-1">
                    {quotation.emailInfo && <Mail size={20} className="text-blue-500" />}
                </div>

                <div className="flex col-span-2 sm:col-span-1 sm:justify-start justify-end items-center">
                    <QuotationStatusBadge status={quotation.status} />
                </div>
            </div>

            <Button variant="ghost" size="icon" className="ml-auto md:ml-0" onClick={(e) => e.stopPropagation()}>
                <MoreVertical className="w-5 h-5" />
            </Button>
        </div>
    );
}

const InfoBlock = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col gap-1">
        <p className="text-sm text-[var(--muted-foreground)]">{label}</p>
        <p className="font-medium text-[var(--foreground)]">{value}</p>
    </div>
);