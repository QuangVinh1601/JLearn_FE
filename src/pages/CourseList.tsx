import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import InfoModal from "../components/Purchase/InfoModal";
import { Product, ProductType, CustomerInfo } from "../types/purchase";
import ImgCourse from "../assets/images/khoahoc.jpeg";
import ImgFlahcard from "../assets/images/flashcard.png";

const CourseList: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [purchasedProductIds, setPurchasedProductIds] = useState<string[]>(
    getPurchasedProductIds(),
  );
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProductForPurchase, setSelectedProductForPurchase] =
    useState<Product | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadProducts = async () => {
      console.log("purchasedProductIds:", purchasedProductIds);
      setLoading(true);
      try {
        const data = await fetchProducts();
        setAllProducts(data);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handlePurchaseOrEnter = (product: Product) => {
    if (product.type === ProductType.Course && product.level) {
      const isPurchased = purchasedProductIds.includes(product.id);
      const isFree = product.price === 0;
      if (isFree || isPurchased) {
        navigate(`/course/${product.level.toLowerCase()}/lessons`);
      } else {
        if (!isLoggedIn) {
          alert("Vui lòng đăng nhập để mua khóa học.");
          navigate("/login");
          return;
        }
        setSelectedProductForPurchase(product);
        setIsInfoModalOpen(true);
      }
    } else if (product.type === ProductType.FlashcardCollection) {
      if (purchasedProductIds.includes(product.id)) {
        alert(`Bạn đã sở hữu bộ flashcard: ${product.title}`);
        return;
      }
      if (!isLoggedIn) {
        alert("Vui lòng đăng nhập để mua flashcard.");
        navigate("/login");
        return;
      }
      setSelectedProductForPurchase(product);
      setIsInfoModalOpen(true);
    }
  };

  const handlePurchaseFlowComplete = (success: boolean) => {
    setIsInfoModalOpen(false);
    if (success && selectedProductForPurchase) {
      const newProductId = selectedProductForPurchase.id;
      if (!purchasedProductIds.includes(newProductId)) {
        const updatedIds = [...purchasedProductIds, newProductId];
        savePurchasedProductIds(updatedIds);
        setPurchasedProductIds(updatedIds);
      }
      if (
        selectedProductForPurchase.type === ProductType.Course &&
        selectedProductForPurchase.level
      ) {
        alert(
          `Đã mua thành công khóa học ${selectedProductForPurchase.level}! Bạn có thể vào học ngay.`,
        );
      } else if (
        selectedProductForPurchase.type === ProductType.FlashcardCollection
      ) {
        alert(`Đã mua thành công ${selectedProductForPurchase.title}!`);
      }
      window.dispatchEvent(new Event("storage"));
    }
    setSelectedProductForPurchase(null);
  };

  useEffect(() => {
    const syncPurchases = () => {
      setPurchasedProductIds(getPurchasedProductIds());
    };
    window.addEventListener("storage", syncPurchases);
    return () => window.removeEventListener("storage", syncPurchases);
  }, []);

  const courseProducts = allProducts.filter(
    (p) => p.type === ProductType.Course,
  );
  const flashcardProducts = allProducts.filter(
    (p) => p.type === ProductType.FlashcardCollection,
  );
  const purchasedCourses = courseProducts.filter((course) =>
    purchasedProductIds.includes(course.id),
  );
  const notPurchasedCourses = courseProducts.filter(
    (course) => !purchasedProductIds.includes(course.id),
  );
  const purchasedFlashcards = flashcardProducts.filter((fc) =>
    purchasedProductIds.includes(fc.id),
  );
  const notPurchasedFlashcards = flashcardProducts.filter(
    (fc) => !purchasedProductIds.includes(fc.id),
  );

  // Thêm dữ liệu ví dụ cho nội dung khóa học
  const courseContentExample: Record<
    string,
    { reading: number; listening: number; exercise: number; lessons: string[] }
  > = {
    N5: {
      reading: 10,
      listening: 8,
      exercise: 20,
      lessons: [
        "Giới thiệu bản thân",
        "Gia đình",
        "Thời gian",
        "Địa điểm",
        "Mua sắm",
      ],
    },
    N4: {
      reading: 12,
      listening: 10,
      exercise: 25,
      lessons: [
        "Công việc",
        "Du lịch",
        "Sở thích",
        "Sức khỏe",
        "Giao tiếp cơ bản",
      ],
    },
    N3: {
      reading: 15,
      listening: 12,
      exercise: 30,
      lessons: ["Tin tức", "Thư tín", "Thảo luận", "Phỏng vấn", "Báo cáo"],
    },
    N2: {
      reading: 18,
      listening: 15,
      exercise: 35,
      lessons: [
        "Bài báo chuyên sâu",
        "Hội nghị",
        "Phân tích",
        "Tranh luận",
        "Tổng hợp",
      ],
    },
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        Đang tải danh sách sản phẩm...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-10 text-red-700">
        Nội dung học tập
      </h1>

      {purchasedCourses.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-green-700">
            Khóa học đã mua
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {purchasedCourses.map((course) => {
              const content = course.level
                ? courseContentExample[course.level]
                : undefined;
              return (
                <div
                  key={course.id}
                  className="rounded-lg p-4 border shadow-md bg-white flex flex-col justify-between transition-all duration-300 hover:shadow-lg h-full"
                >
                  {course.imageUrl && (
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-40 object-contain mb-3 rounded"
                    />
                  )}
                  <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 flex-grow">
                    {course.description}
                  </p>
                  {content && (
                    <>
                      <ul className="text-xs text-gray-700 mb-2 list-disc list-inside">
                        <li>Bài đọc: {content.reading}</li>
                        <li>Bài nghe: {content.listening}</li>
                        <li>Bài tập: {content.exercise}</li>
                      </ul>
                      <div className="mb-3">
                        <span className="font-semibold text-xs text-gray-800">
                          Nội dung bài học:
                        </span>
                        <ul className="text-xs text-gray-700 list-disc list-inside ml-3">
                          {content.lessons.map((lesson, idx) => (
                            <li key={idx}>{lesson}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                  <div className="text-center mt-auto">
                    <div className="text-lg font-bold mb-3 text-red-600">
                      {`${course.price.toLocaleString()} đ`}
                    </div>
                    <button
                      onClick={() => handlePurchaseOrEnter(course)}
                      className="w-full py-2 px-4 rounded-md font-semibold transition duration-200 ease-in-out bg-green-500 hover:bg-green-600 text-white"
                    >
                      Vào học
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {purchasedFlashcards.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-green-700">
            Bộ Flashcard đã mua
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {purchasedFlashcards.map((fc) => (
              <div
                key={fc.id}
                className="rounded-lg p-4 border shadow-md bg-white flex flex-col justify-between transition-all duration-300 hover:shadow-lg h-full"
              >
                {fc.imageUrl && (
                  <img
                    src={fc.imageUrl}
                    alt={fc.title}
                    className="w-full h-40 object-contain mb-3 rounded"
                  />
                )}
                <h3 className="font-semibold text-lg mb-1">{fc.title}</h3>
                <p className="text-sm text-gray-600 mb-3 flex-grow">
                  {fc.description}
                </p>
                <div className="text-center mt-auto">
                  <div className="text-lg font-bold mb-3 text-red-600">
                    {`${fc.price.toLocaleString()} đ`}
                  </div>
                  <button
                    className="w-full py-2 px-4 rounded-md font-semibold transition duration-200 ease-in-out bg-green-500 hover:bg-green-600 text-white"
                    disabled
                  >
                    Đã sở hữu
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-red-700">
          Khóa học Luyện Thi
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {notPurchasedCourses.map((course) => {
            const isFree = course.price === 0;
            const content = course.level
              ? courseContentExample[course.level]
              : undefined;
            return (
              <div
                key={course.id}
                className="rounded-lg p-4 border shadow-md bg-white flex flex-col justify-between transition-all duration-300 hover:shadow-lg h-full"
              >
                {course.imageUrl && (
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-40 object-contain mb-3 rounded"
                  />
                )}
                <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-3 flex-grow">
                  {course.description}
                </p>
                {content && (
                  <>
                    <ul className="text-xs text-gray-700 mb-2 list-disc list-inside">
                      <li>Bài đọc: {content.reading}</li>
                      <li>Bài nghe: {content.listening}</li>
                      <li>Bài tập: {content.exercise}</li>
                    </ul>
                    <div className="mb-3">
                      <span className="font-semibold text-xs text-gray-800">
                        Nội dung bài học:
                      </span>
                      <ul className="text-xs text-gray-700 list-disc list-inside ml-3">
                        {content.lessons.map((lesson, idx) => (
                          <li key={idx}>{lesson}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
                <div className="text-center mt-auto">
                  <div className="text-lg font-bold mb-3 text-red-600">
                    {`${course.price.toLocaleString()} đ`}
                  </div>
                  <button
                    onClick={() => handlePurchaseOrEnter(course)}
                    className="w-full py-2 px-4 rounded-md font-semibold transition duration-200 ease-in-out bg-red-500 hover:bg-red-600 text-white"
                  >
                    {isFree ? "Vào học" : "Mua ngay"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {notPurchasedCourses.length === 0 && !loading && (
          <p className="text-gray-600">
            Bạn đã mua tất cả các khóa học hiện có.
          </p>
        )}
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          Bộ Sưu Tập Flashcard
        </h2>
        {notPurchasedFlashcards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {notPurchasedFlashcards.map((product) => {
              const isFlashcardPurchased = purchasedProductIds.includes(
                product.id,
              );
              return (
                <div
                  key={product.id}
                  className="rounded-lg p-4 border shadow-md bg-white flex flex-col justify-between transition-all duration-300 hover:shadow-lg h-full"
                >
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-40 object-contain mb-3 rounded"
                    />
                  )}
                  <h3 className="font-semibold text-lg mb-1">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 flex-grow">
                    {product.description}
                  </p>
                  <div className="text-center mt-auto">
                    <div className="text-lg font-bold mb-3 text-red-600">
                      {`${product.price.toLocaleString()} đ`}
                    </div>
                    <button
                      onClick={() => handlePurchaseOrEnter(product)}
                      className={`w-full py-2 px-4 rounded-md font-semibold transition duration-200 ease-in-out text-white ${
                        isFlashcardPurchased
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                      disabled={isFlashcardPurchased}
                    >
                      {isFlashcardPurchased ? "Đã sở hữu" : "Mua ngay"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          !loading && (
            <p className="text-gray-600">
              Bạn đã mua tất cả các bộ flashcard hiện có.
            </p>
          )
        )}
      </div>

      {isInfoModalOpen && selectedProductForPurchase && (
        <InfoModal
          product={selectedProductForPurchase}
          onCancel={() => setIsInfoModalOpen(false)}
          onProceed={handlePurchaseFlowComplete}
        />
      )}
    </div>
  );
};

// --- Tiện ích ---
export const getPurchasedProductIds = (): string[] => {
  const purchased = localStorage.getItem("purchasedCourses");
  return purchased ? JSON.parse(purchased) : [];
};

export const savePurchasedProductIds = (productIds: string[]) => {
  localStorage.setItem("purchasedCourses", JSON.stringify(productIds));
};

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

export default CourseList;
