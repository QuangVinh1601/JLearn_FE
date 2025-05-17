import React, { useEffect } from "react";
import ProductList from "../components/Purchase/ProductList"; // Import ProductList
import {
  savePurchasedProductIds,
  getPurchasedProductIds,
} from "./CourseList"; // Corrected import path

const Purchase: React.FC = () => {
  // useEffect(() => {
  //   // This useEffect seems to be for testing or a different purchase flow.
  //   // The main purchase flow is handled via the modal in CourseList.tsx.
  //   // If you need to simulate a purchase here for testing:
  //   const currentPurchasedIds = getPurchasedProductIds();
  //   // Example: Add a specific product ID for testing (e.g., N5 course ID)
  //   const testProductId = "d5f6e7a8-1234-5678-9abc-def012345678"; // N5 Course ID
  //   if (!currentPurchasedIds.includes(testProductId)) {
  //     const updatedPurchasedIds = [...currentPurchasedIds, testProductId];
  //     savePurchasedProductIds(updatedPurchasedIds);
  //     window.dispatchEvent(new Event("storage")); // Notify other components
  //     console.log("Test product ID added via Purchase.tsx useEffect");
  //   }
  // }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-red-700">
        Mua nội dung học tập
      </h1>
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-red-700">Danh sách khóa học</h2>
        <ProductList /> {/* Render the product list */}
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Danh sách Flashcards</h2>
        <ProductList /> {/* Render the flashcard list */}
      </div>
    </div>
  );
};

export default Purchase;
