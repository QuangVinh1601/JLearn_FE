import axios from "axios";
import {
  Product,
  ProductType,
  CustomerInfo,
  PurchaseResponse,
} from "../../types/purchase";
import ImgCourse from "../../assets/images/khoahoc.jpeg";
import ImgFlahcard from "../../assets/images/flashcard.png";
import {
  createZaloPayOrder as apiCreateZaloPayOrder,
  getZaloPayOrderStatus as apiGetZaloPayOrderStatus,
} from "../../api/apiClient";

export const createOrder = async (
  productId: string,
  customerInfo: CustomerInfo,
): Promise<PurchaseResponse> => {
  console.log("Creating order (non-ZaloPay) for:", productId, customerInfo);
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        success: true,
        message: "Đơn hàng đã được tạo thành công!",
        orderId: `ORDER-${productId}-${Date.now()}`,
      });
    }, 1000),
  );
};

// --- ZaloPay Integration ---

export const createZaloPayOrder = async (
  amount: number,
  description: string,
  userId: string,
  collectionId: string,
) => {
  return await apiCreateZaloPayOrder(amount, description, userId, collectionId);
};

export const getZaloPayOrderStatus = async (apptransid: string) => {
  return await apiGetZaloPayOrderStatus(apptransid);
};

// --- End ZaloPay Integration ---
