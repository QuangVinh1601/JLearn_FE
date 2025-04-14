export enum ProductType {
  Course = "course",
  FlashcardCollection = "flashcard_collection",
}

export interface Product {
  id: string;
  type: ProductType;
  title: string;
  description: string;
  price: number;
  duration?: string; // Chỉ áp dụng cho Course
  code: string;
  discountCode?: string;
  imageUrl?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

export interface PurchaseResponse {
  success: boolean;
  message: string;
  orderId?: string;
}

export type PaymentMethod = "bank" | "office";
