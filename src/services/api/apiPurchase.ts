import axios from "axios";
import {
  Product,
  ProductType,
  CustomerInfo,
  PurchaseResponse,
} from "../../types/purchase";
import ImgCourse from "../../assets/images/khoahoc.jpeg";
import ImgFlahcard from "../../assets/images/flashcard.png";

export const fetchProducts = async (): Promise<Product[]> => {
  return [
    // Courses
    {
      id: "course-1",
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
      id: "course-2",
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
      id: "course-3",
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
      id: "course-4",
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
      id: "flashcard-1",
      type: ProductType.FlashcardCollection,
      title: "Bộ Flashcard N5",
      description: "500 từ vựng cơ bản",
      price: 250000,
      code: "FC05",
      imageUrl: ImgFlahcard,
    },
    {
      id: "flashcard-2",
      type: ProductType.FlashcardCollection,
      title: "Bộ Flashcard N4",
      description: "700 từ vựng cơ bản",
      price: 300000,
      code: "FC04",
      imageUrl: ImgFlahcard,
    },
    {
      id: "flashcard-3", // Changed from flashcard-4
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

// Define your backend base URL. Replace with your actual backend server address.
// It's often better to use environment variables for this in a real application.
const BACKEND_URL = "http://localhost:5000"; // <-- CHANGE THIS TO YOUR BACKEND URL

interface ZaloPayOrderRequest {
  amount: number;
  description: string;
}

interface ZaloPayOrderResponse {
  order: {
    appid: string;
    apptransid: string; // Important: Used for status check
    appuser: string;
    apptime: number;
    embeddata: string;
    item: string;
    amount: number;
    description: string;
    bankcode: string;
    mac: string;
  };
  result: {
    returncode: number;
    returnmessage: string;
    orderurl?: string; // URL for QR code
    zptranstoken?: string;
  };
}

interface ZaloPayStatusResponse {
  returncode: number; // 1 = success, 2 = processing, 3 = failed
  returnmessage: string;
  isprocessing: boolean;
  amount: number;
  discountamount: number;
  zptransid: number;
}

export const createZaloPayOrder = async (
  amount: number,
  description: string,
): Promise<ZaloPayOrderResponse> => {
  // Use the full URL
  const response = await axios.post<ZaloPayOrderResponse>(`${BACKEND_URL}/create_order`, {
    amount,
    description,
  });
  return response.data;
};

export const getZaloPayOrderStatus = async (
  apptransid: string,
): Promise<ZaloPayStatusResponse> => {
  // Use the full URL
  const response = await axios.get<ZaloPayStatusResponse>(`${BACKEND_URL}/order_status`, {
    params: { apptransid },
  });
  return response.data;
};

// --- End ZaloPay Integration ---
