// src/pages/CourseList.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import InfoModal from "../components/Purchase/InfoModal";
import { Product, ProductType, CustomerInfo } from "../types/purchase";
import { fetchProducts } from "../services/api/apiPurchase";

// Retrieves an array of purchased PRODUCT IDs from localStorage
export const getPurchasedProductIds = (): string[] => {
  const purchased = localStorage.getItem("purchasedCourses");
  return purchased ? JSON.parse(purchased) : [];
};

// Saves an array of purchased PRODUCT IDs to localStorage
export const savePurchasedProductIds = (productIds: string[]) => {
  localStorage.setItem("purchasedCourses", JSON.stringify(productIds));
};

const CourseList: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  // This state will store the IDs of purchased products, synced with localStorage
  const [purchasedProductIds, setPurchasedProductIds] = useState<string[]>(
    getPurchasedProductIds(),
  );
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedProductForPurchase, setSelectedProductForPurchase] =
    useState<Product | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  console.log("Current purchasedProductIds state:", purchasedProductIds);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setAllProducts(data);
        // purchasedProductIds is already initialized from localStorage via useState.
        // The storage event listener will handle updates from other tabs/sources.
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []); // Empty dependency array, runs once on mount

  const handlePurchaseOrEnter = (product: Product) => {
    if (product.type === ProductType.Course && product.level) {
      const isPurchased = purchasedProductIds.includes(product.id);
      const isFree = product.price === 0;

      if (isFree || isPurchased) {
        // navigate(`/course/${courseLevel.toLowerCase()}/lessons`);
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
      // Flashcard purchases are tracked by their IDs
      if (purchasedProductIds.includes(product.id)) {
        alert(`Bạn đã sở hữu bộ flashcard: ${product.title}`);
        // Example: navigate(`/flashcards/view/${product.id}`);
        return;
      }

      if (!isLoggedIn) {
        alert("Vui lòng đăng nhập để mua flashcard.");
        navigate("/login");
        return;
      }
      setSelectedProductForPurchase(product);
      setIsInfoModalOpen(true);
    } else {
      console.warn(
        "Unhandled product type or missing level for course:",
        product,
      );
    }
  };

  const handlePurchaseFlowComplete = (
    success: boolean,
    customerInfo?: CustomerInfo,
  ) => {
    setIsInfoModalOpen(false);
    if (success && selectedProductForPurchase) {
      const newProductId = selectedProductForPurchase.id;
      if (!purchasedProductIds.includes(newProductId)) {
        const updatedIds = [...purchasedProductIds, newProductId];
        savePurchasedProductIds(updatedIds); // Save to localStorage
        setPurchasedProductIds(updatedIds); // Update local state
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
    } else if (!success && selectedProductForPurchase) {
      console.log(
        "Purchase flow cancelled or failed for:",
        selectedProductForPurchase.title,
      );
    }
    setSelectedProductForPurchase(null);
  };

  // Listen for changes in localStorage (e.g., from other tabs)
  useEffect(() => {
    const syncPurchases = () => {
      const idsFromStorage = getPurchasedProductIds();
      setPurchasedProductIds(idsFromStorage);
      console.log(
        "Synced purchasedProductIds from storage event:",
        idsFromStorage,
      );
    };
    window.addEventListener("storage", syncPurchases);
    return () => window.removeEventListener("storage", syncPurchases);
  }, []); // Empty dependency array, sets up listener once

  const courseProducts = allProducts.filter(
    (p) => p.type === ProductType.Course,
  );
  const flashcardProducts = allProducts.filter(
    (p) => p.type === ProductType.FlashcardCollection,
  );

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

      {courseProducts.filter((course) =>
        purchasedProductIds.includes(course.id),
      ).length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-green-700">
            Khóa học đã mua
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courseProducts
              .filter((course) => purchasedProductIds.includes(course.id))
              .map((course) => (
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
              ))}
          </div>
        </div>
      )}

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-red-700">
          Khóa học Luyện Thi
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courseProducts
            .filter((course) => !purchasedProductIds.includes(course.id))
            .map((course) => {
              const isFree = course.price === 0;
              const canAccess = isFree;

              return (
                <div
                  key={course.id}
                  className={`rounded-lg p-4 border shadow-md bg-white flex flex-col justify-between transition-all duration-300 hover:shadow-lg h-full`}
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
                  <div className="text-center mt-auto">
                    <div className="text-lg font-bold mb-3 text-red-600">
                      {`${course.price.toLocaleString()} đ`}
                    </div>
                    <button
                      onClick={() => handlePurchaseOrEnter(course)}
                      className="w-full py-2 px-4 rounded-md font-semibold transition duration-200 ease-in-out bg-red-500 hover:bg-red-600 text-white"
                    >
                      {canAccess ? "Vào học" : "Mua ngay"}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
        {courseProducts.filter(
          (course) => !purchasedProductIds.includes(course.id),
        ).length === 0 &&
          !loading && (
            <p className="text-gray-600">
              Bạn đã mua tất cả các khóa học hiện có.
            </p>
          )}
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          Bộ Sưu Tập Flashcard
        </h2>
        {flashcardProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {flashcardProducts.map((product) => {
              const isFlashcardPurchased = purchasedProductIds.includes(
                product.id,
              ); // Use the state variable
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
            <p className="text-gray-600">Không có bộ sưu tập flashcard nào.</p>
          )
        )}
      </div>

      {isInfoModalOpen && selectedProductForPurchase && (
        <InfoModal
          product={selectedProductForPurchase}
          onCancel={() => setIsInfoModalOpen(false)}
          onProceed={(success: boolean, customerInfo?: CustomerInfo) =>
            handlePurchaseFlowComplete(success, customerInfo)
          }
        />
      )}
    </div>
  );
};

export default CourseList;
