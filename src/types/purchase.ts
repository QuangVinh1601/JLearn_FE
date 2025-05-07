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
  level?: string; // Add level for courses (e.g., "N5", "N4")
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  userId: string; // Add userId
  collectionId: string; // Add collectionId
}

export interface PurchaseResponse {
  success: boolean;
  message: string;
  orderId?: string;
}

export type PaymentMethod = "bank" | "office" | "zalopay";
