"use client";

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiFunctions, ApiError } from '@/services/api.service';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  Plus, 
  Minus, 
  ArrowLeft, 
  ChevronDown, 
  Mail, 
  Loader2, 
  Search, 
  Check, 
  CalendarIcon,
  Percent,
  User
} from 'lucide-react';

// --- Types ---

type Customer = {
    _id: string;
    name: string;
    phone?: string;
    email?: string;
};

type Quantities = { [bookId: string]: number };
type BookDiscounts = { [bookId: string]: number };
type CustomPrices = { [bookId: string]: number };

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
    emailInfo?: {
        messageId: string;
        sender: string;
        subject: string;
        receivedAt: string;
        snippet?: string;
    };
};

function QuotationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // --- State ---
    const [books, setBooks] = useState<QuotationPreviewBook[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [customerId, setCustomerId] = useState("");
    
    // Customer Dropdown State
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Form State
    const [quantities, setQuantities] = useState<Quantities>({});
    const [bookDiscounts, setBookDiscounts] = useState<BookDiscounts>({});
    const [customPrices, setCustomPrices] = useState<CustomPrices>({});
    const [generalDiscount, setGeneralDiscount] = useState<string>("");
    const [validUntil, setValidUntil] = useState("");

    // Loading states
    const [loadingBooks, setLoadingBooks] = useState(true);
    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize validUntil to 30 days from now
    useEffect(() => {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        setValidUntil(date.toISOString().split('T')[0]);
    }, []);

    // 1. Fetch Customers
    useEffect(() => {
        const fetchCustomers = async () => {
            setLoadingCustomers(true);
            try {
                const response = await apiFunctions.getCustomers(); 
                setCustomers(response.customers || []);
            } catch (err) {
                console.error("Failed to fetch customers:", err);
                toast.error("Could not load customer list.");
            } finally {
                setLoadingCustomers(false);
            }
        };
        fetchCustomers();
    }, []);

    // 2. Fetch book data
    useEffect(() => {
        const fetchQuotationPreview = async () => {
            try {
                const bookIds = searchParams.getAll('id');
                if (bookIds.length === 0) {
                    toast.error("No books selected.");
                    router.push('/books');
                    return;
                }

                setLoadingBooks(true);
                const data = await apiFunctions.getQuotationPreview(bookIds);
                const response = data.data;
                setBooks(response);

                // Initialize values
                const initialQuantities: Quantities = {};
                const initialCustomPrices: CustomPrices = {};
                
                response.forEach((book: QuotationPreviewBook) => {
                    initialQuantities[book.bookId] = 1;
                    initialCustomPrices[book.bookId] = book.lowestPrice || 0;
                });

                setQuantities(initialQuantities);
                setCustomPrices(initialCustomPrices);
                setBookDiscounts({});

            } catch (err) {
                console.error("Quotation preview error:", err);
                setError(err instanceof ApiError ? err.message : "Failed to load book details");
            } finally {
                setLoadingBooks(false);
            }
        };
        fetchQuotationPreview();
    }, [searchParams, router]);

    // --- Handlers ---
    const handleQuantityChange = (bookId: string, value: string) => {
        const quantity = parseInt(value, 10);
        setQuantities(prev => ({
            ...prev,
            [bookId]: isNaN(quantity) || quantity < 1 ? 1 : quantity
        }));
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

    // --- Derived Data ---
    const selectedCustomerObj = useMemo(() => customers.find(c => c._id === customerId), [customers, customerId]);

    const filteredCustomers = useMemo(() => {
        if (!searchTerm) return customers;
        const lowerTerm = searchTerm.toLowerCase();
        return customers.filter(c => 
            c.name.toLowerCase().includes(lowerTerm) || 
            c.email?.toLowerCase().includes(lowerTerm)
        );
    }, [customers, searchTerm]);

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

        return { subtotal, discountAmount, generalDiscountPercent, subtotalAfterGeneralDiscount, tax, total };
    }, [books, quantities, bookDiscounts, generalDiscount, customPrices]);

    const handleGeneratePdf = async () => {
        if (!customerId) {
            toast.error("Please select a customer first.");
            return;
        }

        const calculatedItems: QuotationPayloadItem[] = books.map(book => {
            const unitPrice = customPrices[book.bookId] !== undefined ? customPrices[book.bookId] : (book.lowestPrice || 0);
            const quantity = quantities[book.bookId] || 1;
            const discountPercent = bookDiscounts[book.bookId] || 0;
            const lineItemGrossTotal = unitPrice * quantity;
            const lineItemDiscountAmount = lineItemGrossTotal * (discountPercent / 100);
            
            return {
                book: book.bookId,
                quantity,
                unitPrice,
                discount: discountPercent,
                totalPrice: lineItemGrossTotal - lineItemDiscountAmount
            };
        });

        // Calculate totals for payload (simplified for brevity, mirrors summary logic)
        const { subtotal, total, discountAmount, subtotalAfterGeneralDiscount } = quotationSummary;
        const totalItemDiscountAmount = books.reduce((acc, book) => {
            const p = customPrices[book.bookId] || 0;
            const q = quantities[book.bookId] || 1;
            const d = bookDiscounts[book.bookId] || 0;
            return acc + ((p * q) * d / 100);
        }, 0);
        
        const totalDiscount = totalItemDiscountAmount + discountAmount;

        const emailInfoParams = {
            id: searchParams.get('emailMessageId'),
            sender: searchParams.get('emailSender'),
            subject: searchParams.get('emailSubject'),
            received: searchParams.get('emailReceivedAt'),
            snippet: searchParams.get('emailSnippet')
        };

        const payload: QuotationPayload = {
            customer: customerId,
            items: calculatedItems,
            subTotal: subtotal,
            totalDiscount: totalDiscount,
            grandTotal: total,
            status: "Draft",
            validUntil: new Date(validUntil).toISOString(),
            ...(emailInfoParams.id && {
                emailInfo: {
                    messageId: emailInfoParams.id,
                    sender: emailInfoParams.sender!,
                    subject: emailInfoParams.subject!,
                    receivedAt: emailInfoParams.received!,
                    snippet: emailInfoParams.snippet || undefined
                }
            })
        };

        try {
            setIsGenerating(true);
            const response = await apiFunctions.createQuotation(payload);
            if (!response.success) throw new Error(response.message);
            toast.success(response.message || "Quotation created successfully!");
            router.push("/quotation");
        } catch (err) {
            console.error("Quotation error:", err);
            toast.error(err instanceof Error ? err.message : "Could not generate quotation.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (loadingBooks) return <div className="min-h-screen flex items-center justify-center text-muted-foreground"><Loader2 className="animate-spin mr-2"/> Loading book details...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-destructive">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/quotation")}
                            className="pl-0 hover:bg-transparent hover:text-primary mb-1"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Quotations
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight">New Quotation</h1>
                        <p className="text-muted-foreground mt-1">Configure pricing and details for your customer.</p>
                    </div>
                </div>

                {/* --- CONTROL PANEL (Customer, Date, Discount) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* CUSTOMER SELECTOR */}
                    <div className="lg:col-span-6 flex flex-col gap-2">
                        <Label className="text-sm font-medium">Customer</Label>
                        <div className="relative">
                            {isDropdownOpen && <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />}
                            
                            <div 
                                onClick={() => !loadingCustomers && setIsDropdownOpen(!isDropdownOpen)}
                                className={`
                                    relative w-full h-14 px-4 bg-card border rounded-lg flex items-center justify-between cursor-pointer transition-all duration-200 shadow-sm
                                    ${isDropdownOpen ? 'border-primary ring-2 ring-primary/10' : 'border-input hover:border-primary/50 hover:bg-accent/50'}
                                    ${loadingCustomers ? 'opacity-70 cursor-wait' : ''}
                                `}
                            >
                                {selectedCustomerObj ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                            {selectedCustomerObj.name.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm leading-tight">{selectedCustomerObj.name}</span>
                                            {selectedCustomerObj.email && <span className="text-xs text-muted-foreground">{selectedCustomerObj.email}</span>}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><User className="w-4 h-4" /></div>
                                        <span className="text-sm">Select a customer...</span>
                                    </div>
                                )}
                                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>

                            {/* DROPDOWN MENU */}
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-popover text-popover-foreground border border-border rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top bg-background">
                                    <div className="p-2 border-b border-border bg-muted/30">
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
                                            <input 
                                                autoFocus
                                                type="text" 
                                                placeholder="Search customers..." 
                                                className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="max-h-[280px] overflow-y-auto p-1">
                                        {filteredCustomers.length === 0 ? (
                                            <div className="p-6 text-center text-muted-foreground text-sm">No customers found.</div>
                                        ) : (
                                            filteredCustomers.map(cust => (
                                                <div 
                                                    key={cust._id}
                                                    onClick={() => {
                                                        setCustomerId(cust._id);
                                                        setIsDropdownOpen(false);
                                                        setSearchTerm("");
                                                    }}
                                                    className={`
                                                        flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors text-sm
                                                        ${cust._id === customerId ? 'bg-primary/10 text-primary' : 'hover:bg-accent hover:text-accent-foreground'}
                                                    `}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs ${cust._id === customerId ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                                            {cust.name.charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{cust.name}</span>
                                                            <span className="text-xs opacity-70">{cust.email}</span>
                                                        </div>
                                                    </div>
                                                    {cust._id === customerId && <Check className="w-4 h-4" />}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SETTINGS (Valid Until + Discount) */}
                    <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Valid Until</Label>
                            <div className="relative">
                                <Input
                                    type="date"
                                    value={validUntil}
                                    onChange={(e) => setValidUntil(e.target.value)}
                                    className="h-14 bg-card border-input hover:border-primary/50 focus:border-primary transition-colors"
                                />
                                <CalendarIcon className="absolute right-3 top-4 w-5 h-5 text-muted-foreground pointer-events-none opacity-50" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">General Discount</Label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="0"
                                    value={generalDiscount}
                                    onChange={(e) => setGeneralDiscount(e.target.value)}
                                    className="h-14 bg-card border-input hover:border-primary/50 focus:border-primary transition-colors pl-4 pr-10"
                                />
                                <Percent className="absolute right-3 top-4 w-5 h-5 text-muted-foreground pointer-events-none opacity-50" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- TABLE CARD --- */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
                        <h2 className="font-semibold text-card-foreground">Items ({books.length})</h2>
                        <span className="text-xs text-muted-foreground">Adjust quantities and prices below</span>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b border-border">
                                <tr>
                                    <th className="px-4 py-3 font-medium w-[30%]">Book Details</th>
                                    <th className="px-4 py-3 font-medium w-[15%]">Original Price</th>
                                    <th className="px-4 py-3 font-medium w-[15%]">Unit Price</th>
                                    <th className="px-4 py-3 font-medium w-[12%]">Disc %</th>
                                    <th className="px-4 py-3 font-medium w-[15%]">Quantity</th>
                                    <th className="px-4 py-3 font-medium w-[13%] text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {books.map((book) => {
                                    const customPrice = customPrices[book.bookId] !== undefined ? customPrices[book.bookId] : book.lowestPrice;
                                    const quantity = quantities[book.bookId] || 1;
                                    const discountPercent = bookDiscounts[book.bookId] || 0;
                                    const discountedPrice = customPrice * (1 - discountPercent / 100);
                                    const lineTotal = discountedPrice * quantity;

                                    return (
                                        <tr key={book.bookId} className="bg-card hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-4">
                                                <div className="font-medium text-foreground">{book.title}</div>
                                                <div className="text-xs text-muted-foreground mt-0.5">{book.publisher_name} • ISBN: {book.isbn}</div>
                                            </td>
                                            <td className="px-4 py-4 text-muted-foreground">
                                                {book.currency} {book.lowestPrice.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="relative max-w-[100px]">
                                                    <span className="absolute left-2 top-1.5 text-muted-foreground text-xs">$</span>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={customPrices[book.bookId] !== undefined ? customPrices[book.bookId].toFixed(2) : book.lowestPrice.toFixed(2)}
                                                        onChange={(e) => handleCustomPriceChange(book.bookId, e.target.value)}
                                                        className="h-8 pl-5 pr-2 bg-background border-input focus:ring-1 focus:ring-primary text-xs"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={bookDiscounts[book.bookId] || ''}
                                                    onChange={(e) => handleBookDiscountChange(book.bookId, e.target.value)}
                                                    className="h-8 w-16 bg-background border-input text-xs text-center"
                                                    placeholder="0"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center space-x-1">
                                                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleQuantityDecrement(book.bookId)} disabled={quantity <= 1}>
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                                                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleQuantityIncrement(book.bookId)}>
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-right font-semibold text-foreground">
                                                ${lineTotal.toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- SUMMARY & ACTIONS --- */}
                <div className="flex flex-col md:flex-row justify-end items-start gap-8">
                    <div className="w-full md:w-1/3 bg-card border border-border rounded-xl p-6 shadow-sm space-y-3">
                         <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-medium">${quotationSummary.subtotal.toFixed(2)}</span>
                        </div>
                        {quotationSummary.generalDiscountPercent > 0 && (
                            <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                                <span>Discount ({quotationSummary.generalDiscountPercent}%)</span>
                                <span>-${quotationSummary.discountAmount.toFixed(2)}</span>
                            </div>
                        )}
                         <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tax (5%)</span>
                            <span>${quotationSummary.tax.toFixed(2)}</span>
                        </div>
                        <div className="pt-3 border-t border-border flex justify-between items-center">
                            <span className="font-bold text-lg">Total</span>
                            <span className="font-bold text-xl text-primary">${quotationSummary.total.toFixed(2)}</span>
                        </div>

                        <div className="pt-4 grid grid-cols-2 gap-3">
                            <Button variant="outline" onClick={() => router.push("/quotation")} className="w-full">
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleGeneratePdf} 
                                disabled={isGenerating || books.length === 0 || !customerId} 
                                className="w-full"
                            >
                                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {isGenerating ? "Creating..." : "Save Draft"}
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default function QuotationPageWrapper() {
    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center text-muted-foreground"><Loader2 className="animate-spin w-8 h-8"/></div>}>
            <QuotationPage />
        </Suspense>
    );
}