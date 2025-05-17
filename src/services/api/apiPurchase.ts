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

export const fetchProducts = async (): Promise<Product[]> => {
  return [
    // Courses
    {
      id: "D5F6E7A8-1234-5678-9ABC-DEF012345678",
      type: ProductType.Course,
      title: "Khóa Sơ cấp N5",
      description: "Thời hạn 8 tháng",
      price: 1290000,
      duration: "8 tháng",
      code: "99",
      imageUrl: ImgCourse,
      level: "N5", // Add level
    },
    {
      id: "E7A8B9C0-2345-6789-ABCD-EF1234567890",
      type: ProductType.Course,
      title: "Khóa Sơ cấp N4",
      description: "Thời hạn 8 tháng",
      price: 1890000,
      duration: "8 tháng",
      code: "99", // Consider unique codes if needed later
      imageUrl: ImgCourse,
      level: "N4", // Add level
    },
    {
      id: "F9C0D1E2-3456-7890-BCDE-F23456789012",
      type: ProductType.Course,
      title: "Khóa N3",
      description: "Thời hạn 8 tháng",
      price: 2650000,
      duration: "8 tháng",
      code: "03",
      imageUrl: ImgCourse,
      level: "N3", // Add level
    },
    {
      id: "C3D4E5F6-7890-AB12-CD34-EF5678901234",
      type: ProductType.Course,
      title: "Khóa N2",
      description: "Thời hạn 8 tháng",
      price: 2940000,
      duration: "8 tháng",
      code: "07",
      imageUrl: ImgCourse,
      level: "N2", // Add level
    },
    // Flashcard Collections
    {
      id: "EED28469-EAA1-4AE8-933C-B8786A8E5C1D",
      type: ProductType.FlashcardCollection,
      title: "Bộ Flashcard N5",
      description: "500 từ vựng cơ bản",
      price: 250000,
      code: "FC05",
      imageUrl: ImgFlahcard,
    },
    {
      id: "B2A1C3D4-E5F6-7890-AB12-CD34EF567890",
      type: ProductType.FlashcardCollection,
      title: "Bộ Flashcard N4",
      description: "700 từ vựng cơ bản",
      price: 300000,
      code: "FC04",
      imageUrl: ImgFlahcard,
    },
    {
      id: "C3D4E5F6-7890-AB12-CD34-EF5678901234", // Changed from flashcard-4
      type: ProductType.FlashcardCollection,
      title: "Bộ Flashcard N3", // Changed from N4
      description: "1000 từ vựng trung cấp",
      price: 350000,
      code: "FC03",
      imageUrl: ImgFlahcard,
    },
  ];
};

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
