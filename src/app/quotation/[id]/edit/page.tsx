"use client";

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFunctions } from '@/services/api.service';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
    Plus, Minus, ArrowLeft, Trash2, Save, 
    Calendar, User, FileText, Percent 
} from 'lucide-react';
import { BookSelectionDialog } from '@/components/books/BookSelectionDialog';

// --- Type definitions ---
type Quantities = { [bookId: string]: number };
type BookDiscounts = { [bookId: string]: number };
type CustomPrices = { [bookId: string]: number };

type Book = {
    _id: string;
    title: string;
    isbn: string;
    author?: string;
    publisher?: Publisher;
    edition?: string;
};
type Publisher = { _id: string; name: string };
type QuotationItem = {
    _id: string;
    book: Book | string;
    quantity: number;
    unitPrice: number;
    discount: number;
    totalPrice: number;
};

// Customer Type
type Customer = {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: any;
};

type Quotation = {
    _id: string;
    quotationId: string;
    customer: Customer; // We assume this is always populated based on your API response
    items: QuotationItem[];
    subTotal: number;
    totalDiscount: number;
    grandTotal: number;
    status: string;
    validUntil: string;
    createdAt: string;
    updatedAt: string;
};

type QuotationPreviewBook = {
    bookId: string;
    title: string;
    isbn: string;
    publisher_name: string;
    lowestPrice: number;
    currency: string;
};

type QuotationPayloadItem = {
    book: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    totalPrice: number;
};

type QuotationPayload = {
    customer: string;
    items: QuotationPayloadItem[];
    subTotal: number;
    totalDiscount: number;
    grandTotal: number;
    status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
    validUntil: string;
};

export default function EditQuotationPage() {
    const router = useRouter();
    const params = useParams();
    const quotationId = params.id as string;

    const [quotation, setQuotation] = useState<Quotation | null>(null);
    const [books, setBooks] = useState<QuotationPreviewBook[]>([]);
    
    // Form State
    const [quantities, setQuantities] = useState<Quantities>({});
    const [bookDiscounts, setBookDiscounts] = useState<BookDiscounts>({});
    const [generalDiscount, setGeneralDiscount] = useState<string>("");
    const [customPrices, setCustomPrices] = useState<CustomPrices>({});
    const [status, setStatus] = useState<'Draft' | 'Sent' | 'Accepted' | 'Rejected'>('Draft');
    const [validUntil, setValidUntil] = useState("");
    
    // We only need customerId for the Save Payload. 
    // The Display name comes directly from the quotation object now.
    const [customerId, setCustomerId] = useState("");

    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [bookDialogOpen, setBookDialogOpen] = useState(false);

    // Initial Data Loading
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                
                // Fetch ONLY the quotation. We don't need the customer list.
                const response = await apiFunctions.getQuotationById(quotationId);

                if (!response.success || !response.quotation) {
                    throw new Error(response.message || "Failed to fetch quotation");
                }

                const quotationData = response.quotation as Quotation;
                setQuotation(quotationData);

                // Extract Customer ID for the update payload
                // The API response ensures quotationData.customer is an object
                if (quotationData.customer && typeof quotationData.customer === 'object') {
                    setCustomerId(quotationData.customer._id);
                }

                // Set Metadata
                setStatus(quotationData.status as any);
                const validUntilDate = new Date(quotationData.validUntil);
                setValidUntil(validUntilDate.toISOString().split('T')[0]);

                // Set Items/Books
                const previewBooks: QuotationPreviewBook[] = quotationData.items.map((item) => {
                    const book = typeof item.book === "object" ? item.book : null;
                    return {
                        bookId: typeof item.book === "object" ? item.book._id : item.book,
                        title: book?.title || "Unknown Book",
                        isbn: book?.isbn || "",
                        publisher_name: book?.publisher?.name || "Unknown Publisher",
                        lowestPrice: item.unitPrice,
                        currency: "USD",
                    };
                });

                setBooks(previewBooks);

                // Initialize tracking maps
                const initialQuantities: Quantities = {};
                const initialCustomPrices: CustomPrices = {};
                const initialBookDiscounts: BookDiscounts = {};

                quotationData.items.forEach((item) => {
                    const bookId = typeof item.book === "object" ? item.book._id : item.book;
                    initialQuantities[bookId] = item.quantity;
                    initialCustomPrices[bookId] = item.unitPrice;
                    initialBookDiscounts[bookId] = item.discount;
                });

                setQuantities(initialQuantities);
                setCustomPrices(initialCustomPrices);
                setBookDiscounts(initialBookDiscounts);

                // Calculate General Discount
                const calculatedGeneralDiscount = quotationData.totalDiscount > 0
                    ? ((quotationData.totalDiscount / quotationData.subTotal) * 100).toFixed(2)
                    : ""; 
                setGeneralDiscount(calculatedGeneralDiscount === "0.00" ? "" : calculatedGeneralDiscount);

            } catch (err) {
                console.error("Error loading data:", err);
                setError(err instanceof Error ? err.message : "Failed to load data");
                toast.error("Failed to load quotation data");
            } finally {
                setLoading(false);
            }
        };

        if (quotationId) {
            loadData();
        }
    }, [quotationId]);

    // --- Handlers ---
    const handleQuantityChange = (bookId: string, value: string) => {
        const quantity = parseInt(value, 10);
        setQuantities(prev => ({ ...prev, [bookId]: isNaN(quantity) || quantity < 1 ? 1 : quantity }));
    };

    const handleQuantityIncrement = (bookId: string) => {
        setQuantities(prev => ({ ...prev, [bookId]: (prev[bookId] || 1) + 1 }));
    };

    const handleQuantityDecrement = (bookId: string) => {
        setQuantities(prev => {
            const current = prev[bookId] || 1;
            return { ...prev, [bookId]: current > 1 ? current - 1 : 1 };
        });
    };

    const handleCustomPriceChange = (bookId: string, value: string) => {
        const price = parseFloat(value);
        setCustomPrices(prev => ({ ...prev, [bookId]: isNaN(price) || price < 0 ? 0 : price }));
    };

    const handleBookDiscountChange = (bookId: string, value: string) => {
        const discount = parseFloat(value);
        setBookDiscounts(prev => ({ ...prev, [bookId]: isNaN(discount) || discount < 0 ? 0 : discount }));
    };

    const quotationSummary = useMemo(() => {
        const subtotal = books.reduce((acc, book) => {
            const price = customPrices[book.bookId] !== undefined ? customPrices[book.bookId] : (book.lowestPrice || 0);
            const quantity = quantities[book.bookId] || 1;
            const discountPercent = bookDiscounts[book.bookId] || 0;
            const discountedPrice = price * (1 - discountPercent / 100);
            return acc + discountedPrice * quantity;
        }, 0);

        const generalDiscountPercent = parseFloat(generalDiscount) || 0;
        const discountAmount = subtotal * (generalDiscountPercent / 100);
        const subtotalAfterGeneralDiscount = subtotal - discountAmount;
        const tax = subtotalAfterGeneralDiscount * 0.05;
        const total = subtotalAfterGeneralDiscount + tax;

        return {
            subtotal,
            discountAmount,
            generalDiscountPercent,
            subtotalAfterGeneralDiscount,
            tax,
            total,
        };
    }, [books, quantities, bookDiscounts, generalDiscount, customPrices]);

    const buildQuotationPayload = (): QuotationPayload => {
        const calculatedItems: QuotationPayloadItem[] = books.map(book => {
            const unitPrice = customPrices[book.bookId] !== undefined ? customPrices[book.bookId] : (book.lowestPrice || 0);
            const quantity = quantities[book.bookId] || 1;
            const discountPercent = bookDiscounts[book.bookId] || 0;
            const lineItemGrossTotal = unitPrice * quantity;
            const lineItemDiscountAmount = lineItemGrossTotal * (discountPercent / 100);
            const lineItemFinalTotal = lineItemGrossTotal - lineItemDiscountAmount;

            return {
                book: book.bookId,
                quantity,
                unitPrice,
                discount: discountPercent,
                totalPrice: lineItemFinalTotal
            };
        });

        const totalItemDiscountAmount = books.reduce((acc, book) => {
            const unitPrice = customPrices[book.bookId] !== undefined ? customPrices[book.bookId] : (book.lowestPrice || 0);
            const quantity = quantities[book.bookId] || 1;
            const discountPercent = bookDiscounts[book.bookId] || 0;
            return acc + ((unitPrice * quantity) * discountPercent / 100);
        }, 0);

        const generalDiscountAmount = quotationSummary.discountAmount;
        const totalDiscountAmount = totalItemDiscountAmount + generalDiscountAmount;

        return {
            customer: customerId,
            items: calculatedItems,
            subTotal: quotationSummary.subtotal,
            totalDiscount: totalDiscountAmount,
            grandTotal: quotationSummary.total,
            status: status,
            validUntil: validUntil ? new Date(validUntil).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
    };

    const handleBooksSelected = async (selectedBookIds: string[]) => {
        try {
            const currentBookIds = books.map(b => b.bookId);
            const newBookIds = selectedBookIds.filter(id => !currentBookIds.includes(id));
            const removedBookIds = currentBookIds.filter(id => !selectedBookIds.includes(id));

            if (removedBookIds.length > 0) {
                setBooks(prev => prev.filter(book => !removedBookIds.includes(book.bookId)));
                setQuantities(prev => { const u = { ...prev }; removedBookIds.forEach(id => delete u[id]); return u; });
                setCustomPrices(prev => { const u = { ...prev }; removedBookIds.forEach(id => delete u[id]); return u; });
                setBookDiscounts(prev => { const u = { ...prev }; removedBookIds.forEach(id => delete u[id]); return u; });
            }

            if (newBookIds.length > 0) {
                const previewResponse = await apiFunctions.getQuotationPreview(newBookIds);
                if (previewResponse.success && previewResponse.data) {
                    const newBooks: QuotationPreviewBook[] = previewResponse.data.map((book: any) => ({
                        bookId: book.bookId,
                        title: book.title,
                        isbn: book.isbn,
                        publisher_name: book.publisher_name,
                        lowestPrice: book.lowestPrice || 0,
                        currency: book.currency || "USD",
                    }));
                    setBooks(prev => [...prev, ...newBooks]);
                    newBooks.forEach(book => {
                        setQuantities(prev => ({ ...prev, [book.bookId]: 1 }));
                        setCustomPrices(prev => ({ ...prev, [book.bookId]: book.lowestPrice }));
                        setBookDiscounts(prev => ({ ...prev, [book.bookId]: 0 }));
                    });
                }
            }
            toast.success("Books list updated");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update books");
        }
    };

    const handleRemoveBook = (bookId: string) => {
        setBooks(prev => prev.filter(book => book.bookId !== bookId));
        setQuantities(prev => { const u = { ...prev }; delete u[bookId]; return u; });
        setCustomPrices(prev => { const u = { ...prev }; delete u[bookId]; return u; });
        setBookDiscounts(prev => { const u = { ...prev }; delete u[bookId]; return u; });
    };

    const handleSave = async () => {
        if (!customerId) return toast.error("Error: Customer ID missing");
        if (books.length === 0) return toast.error("At least one item is required");

        try {
            setIsSaving(true);
            const payload = buildQuotationPayload();
            const response = await apiFunctions.updateQuotation(quotationId, payload);
            if (!response.success) throw new Error(response.message);
            toast.success("Quotation updated successfully!");
            router.push(`/quotation/${quotationId}`);
        } catch (err) {
            console.error("Update error:", err);
            toast.error(err instanceof Error ? err.message : "Failed to update");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4 animate-pulse">
                    <div className="h-8 w-8 bg-muted rounded-full"></div>
                    <p className="text-muted-foreground">Loading quotation details...</p>
                </div>
            </div>
        );
    }

    if (error || !quotation) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="bg-card shadow-lg rounded-xl p-8 max-w-md border border-border text-center">
                    <p className="text-destructive mb-4">Error: {error || "Quotation not found"}</p>
                    <Button onClick={() => router.push("/quotation")} variant="outline">
                        Return to List
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground mb-2"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Details
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Quotation</h1>
                        <p className="text-muted-foreground mt-1">
                            Editing ID: <span className="font-mono text-foreground">{quotation.quotationId}</span>
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => router.push(`/quotation/${quotationId}`)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving || books.length === 0} className="bg-primary text-primary-foreground hover:bg-primary/90">
                            {isSaving ? <span className="animate-pulse">Saving...</span> : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Control Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    
                    {/* Customer Display (Read Only - Directly from Quotation Object) */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                            <User className="w-4 h-4" /> Customer
                        </Label>
                        <div className="h-10 px-3 bg-muted/50 border border-border rounded-md flex items-center justify-between">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                                    {quotation.customer?.name ? quotation.customer.name.charAt(0) : "?"}
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="font-medium text-sm leading-tight truncate text-foreground">
                                        {quotation.customer?.name || "Unknown Customer"}
                                    </span>
                                </div>
                            </div>
                            {quotation.customer?.email && (
                                <span className="text-xs text-muted-foreground hidden sm:block truncate ml-2">
                                    {quotation.customer.email}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Status Select */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                            <FileText className="w-4 h-4" /> Status
                        </Label>
                        <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                            <SelectTrigger className="h-10 bg-card border-border">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Draft">Draft</SelectItem>
                                <SelectItem value="Sent">Sent</SelectItem>
                                <SelectItem value="Accepted">Accepted</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date Picker */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" /> Valid Until
                        </Label>
                        <Input
                            type="date"
                            value={validUntil}
                            onChange={(e) => setValidUntil(e.target.value)}
                            className="h-10 bg-card border-border"
                        />
                    </div>

                    {/* General Discount */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                            <Percent className="w-4 h-4" /> General Discount (%)
                        </Label>
                        <Input
                            type="number"
                            placeholder="0"
                            min="0"
                            max="100"
                            value={generalDiscount}
                            onChange={(e) => setGeneralDiscount(e.target.value)}
                            className="h-10 bg-card border-border"
                        />
                    </div>
                </div>

                {/* Books Table Card */}
                <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border flex flex-row items-center justify-between bg-muted/30">
                        <div>
                            <h3 className="font-semibold text-lg text-foreground">Line Items</h3>
                            <p className="text-sm text-muted-foreground">Manage books and pricing</p>
                        </div>
                        <Button 
                            onClick={() => setBookDialogOpen(true)}
                            variant="outline"
                            className="bg-background hover:bg-accent"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Books
                        </Button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                                <tr>
                                    <th className="px-6 py-3 w-[30%]">Book Details</th>
                                    <th className="px-6 py-3 w-[15%]">Publisher</th>
                                    <th className="px-6 py-3 w-[12%]">Base Price</th>
                                    <th className="px-6 py-3 w-[12%]">Custom Price</th>
                                    <th className="px-6 py-3 w-[10%]">Disc. %</th>
                                    <th className="px-6 py-3 w-[10%]">Qty</th>
                                    <th className="px-6 py-3 w-[10%] text-right">Total</th>
                                    <th className="px-6 py-3 w-[5%] text-center"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {books.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                                            No books selected. Click Add Books to start.
                                        </td>
                                    </tr>
                                ) : (
                                    books.map((book) => {
                                        const customPrice = customPrices[book.bookId] !== undefined ? customPrices[book.bookId] : book.lowestPrice;
                                        const quantity = quantities[book.bookId] || 1;
                                        const discountPercent = bookDiscounts[book.bookId] || 0;
                                        const discountedPrice = customPrice * (1 - discountPercent / 100);
                                        const lineTotal = discountedPrice * quantity;

                                        return (
                                            <tr key={book.bookId} className="group hover:bg-muted/30 transition-colors">
                                                <td className="px-6 py-4 align-top">
                                                    <div className="font-medium text-foreground">{book.title}</div>
                                                    <div className="text-xs text-muted-foreground mt-1 font-mono">{book.isbn}</div>
                                                </td>
                                                <td className="px-6 py-4 align-top text-muted-foreground">
                                                    {book.publisher_name}
                                                </td>
                                                <td className="px-6 py-4 align-top text-muted-foreground">
                                                    ${book.lowestPrice.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 align-top">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={customPrices[book.bookId] !== undefined ? customPrices[book.bookId] : ""}
                                                        placeholder={book.lowestPrice.toFixed(2)}
                                                        onChange={(e) => handleCustomPriceChange(book.bookId, e.target.value)}
                                                        className="h-8 w-24 bg-background"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 align-top">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        value={bookDiscounts[book.bookId] || ""}
                                                        placeholder="0"
                                                        onChange={(e) => handleBookDiscountChange(book.bookId, e.target.value)}
                                                        className="h-8 w-16 bg-background"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 align-top">
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => handleQuantityDecrement(book.bookId)}
                                                            disabled={quantity <= 1}
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <div className="w-10 text-center font-medium text-foreground">{quantity}</div>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => handleQuantityIncrement(book.bookId)}
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 align-top text-right font-medium text-foreground">
                                                    ${lineTotal.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 align-top text-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRemoveBook(book.bookId)}
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Totals */}
                <div className="flex justify-end pt-4">
                    <div className="bg-card rounded-xl border border-border p-6 w-full max-w-md shadow-sm space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="text-foreground">${quotationSummary.subtotal.toFixed(2)}</span>
                        </div>
                        
                        {quotationSummary.generalDiscountPercent > 0 && (
                            <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                                <span>Discount ({quotationSummary.generalDiscountPercent}%)</span>
                                <span>-${quotationSummary.discountAmount.toFixed(2)}</span>
                            </div>
                        )}

                        <div className="border-t border-border my-2"></div>

                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tax (5%)</span>
                            <span className="text-foreground">${quotationSummary.tax.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between items-end pt-2">
                            <span className="text-base font-semibold text-foreground">Grand Total</span>
                            <span className="text-2xl font-bold text-primary">${quotationSummary.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Hidden Dialog */}
                <BookSelectionDialog
                    open={bookDialogOpen}
                    onOpenChange={setBookDialogOpen}
                    onBooksSelected={handleBooksSelected}
                    initialSelectedBooks={books.map(b => b.bookId)}
                    mode="edit"
                    buttonText="Update Selection"
                />
            </div>
        </div>
    );
}