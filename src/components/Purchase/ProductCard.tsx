import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../../types/purchase";
import InfoModal from "./InfoModal";
import { useAuth } from "../AuthContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [isPurchaseWindowOpen, setIsPurchaseWindowOpen] =
    useState<boolean>(false);

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để mua sản phẩm.");
      navigate("/login");
      return;
    }
    setIsPurchaseWindowOpen(true);
  };

  const handlePurchaseFlowComplete = (success: boolean) => {
    setIsPurchaseWindowOpen(false);
    if (success) {
      alert(
        `Đã mua thành công ${product.title}! Chi tiết sẽ được gửi qua email.`,
      );
    } else {
      console.log(`Purchase flow cancelled or failed for ${product.title}`);
    }
  };

  const handleCancelPurchase = () => {
    setIsPurchaseWindowOpen(false);
    console.log(`Purchase cancelled for ${product.title}`);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative">
          <img
            src={product.imageUrl || "/images/placeholder.jpg"}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            NEW
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {product.title}
          </h3>
          <p className="text-gray-600 text-sm mt-1">{product.description}</p>
          <p className="text-gray-600 text-sm mt-1">
            Mã số <span className="font-bold">{product.code}</span>
          </p>
          <p className="text-red-500 font-bold mt-2">
            {product.price.toLocaleString("vi-VN")} VNĐ
          </p>
          {product.type === "course" && (
            <p className="text-red-500 text-sm mt-1">
              Giá Nhật cần liên hệ trung tâm để nhận tư vấn
            </p>
          )}
          <button
            onClick={handleBuyNow}
            className="mt-4 w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Mua ngay
          </button>
          <button className="mt-2 w-full py-2 px-4 underline text-sm">
            Xem chi tiết
          </button>
        </div>
      </div>
      {isPurchaseWindowOpen && (
        <InfoModal
          product={product}
          onProceed={handlePurchaseFlowComplete}
          onCancel={handleCancelPurchase}
        />
      )}
    </>
  );
};

export default ProductCard;
