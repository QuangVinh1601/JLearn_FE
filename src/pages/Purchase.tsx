import React, { useEffect } from "react";
import ProductList from "../components/Purchase/ProductList"; // Import ProductList
import { savePurchasedCourses, getPurchasedCourses } from "./CourseList"; // Corrected import path

const Purchase: React.FC = () => {
  useEffect(() => {
    const purchasedCourses = getPurchasedCourses();
    // Example: Add a purchased course (replace with actual logic)
    const newPurchasedCourse = "N5"; // Replace with dynamic course level
    if (!purchasedCourses.includes(newPurchasedCourse)) {
      const updatedPurchased = [...purchasedCourses, newPurchasedCourse];
      savePurchasedCourses(updatedPurchased);
      window.dispatchEvent(new Event("storage")); // Notify other components
    }
  }, []);

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
