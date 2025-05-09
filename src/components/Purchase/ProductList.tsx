import React, { useEffect, useState } from "react";
import { Product, ProductType } from "../../types/purchase";
import { fetchProducts } from "../../services/api/apiPurchase";
import ProductCard from "./ProductCard";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  if (loading) return <p className="text-gray-600">Đang tải sản phẩm...</p>;

  const courses = products.filter(
    (product) => product.type === ProductType.Course,
  );
  const flashcardCollections = products.filter(
    (product) => product.type === ProductType.FlashcardCollection,
  );

  return (
    <div className="space-y-12">
      {/* Phần Courses */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-red-800">Khóa Luyện Thi</h2>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Không có khóa học nào.</p>
        )}
      </div>

      {/* Phần Flashcard Collections */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-red-800">
          Bộ Sưu Tập Flashcard
        </h2>
        {flashcardCollections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {flashcardCollections.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Không có bộ sưu tập flashcard nào.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
