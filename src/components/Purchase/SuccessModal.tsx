import React, { useEffect, useState } from "react";
import { Product, CustomerInfo, PurchaseResponse } from "../../types/purchase";
import { createOrder } from "../../services/api/apiPurchase";

interface SuccessModalProps {
  product: Product;
  customerInfo: CustomerInfo;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  product,
  customerInfo,
  onClose,
}) => {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const placeOrder = async () => {
      try {
        const response: PurchaseResponse = await createOrder(
          product.id,
          customerInfo,
        );
        setMessage(response.message);
      } catch (error) {
        setMessage("Tạo đơn hàng thất bại. Vui lòng thử lại.");
      }
    };
    placeOrder();
  }, [product.id, customerInfo]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Thông báo</h2>
        <p className="text-gray-600">{message}</p>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
