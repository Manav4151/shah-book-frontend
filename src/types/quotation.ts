// src/types/quotation.ts
export type Customer = {
  _id: string;
  name: string;
};

export type Quotation = {
  _id: string;
  customer: Customer;
  subTotal: number;
  totalDiscount: number;
  grandTotal: number;
  status: "Draft" | "Sent" | "Accepted" | "Rejected";
  validUntil: string;
  quotationId: string;
  createdAt: string;
  emailInfo?: {
    messageId: string;
    sender: string;
    subject: string;
    receivedAt: string;
    snippet?: string;
  };
};

export type Pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
};