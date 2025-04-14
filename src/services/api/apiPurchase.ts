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
    },
    {
      id: "course-2",
      type: ProductType.Course,
      title: "Khóa Sơ cấp N4",
      description: "Thời hạn 8 tháng",
      price: 1890000,
      duration: "8 tháng",
      code: "99",
      imageUrl: ImgCourse,
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
      id: "flashcard-3",
      type: ProductType.FlashcardCollection,
      title: "Bộ Flashcard N3",
      description: "1000 từ vựng trung cấp",
      price: 350000,
      code: "FC03",
      imageUrl: ImgFlahcard,
    },
    {
      id: "flashcard-4",
      type: ProductType.FlashcardCollection,
      title: "Bộ Flashcard N4",
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
