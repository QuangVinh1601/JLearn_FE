import React, { useState } from "react";
import { Product, CustomerInfo } from "../../types/purchase";
import PaymentMethodModal from "./PaymentMethodModal";

interface PurchaseModalProps {
  product: Product;
  onProceed: (success: boolean) => void;
  onCancel: () => void;
}

const InfoModal: React.FC<PurchaseModalProps> = ({
  product,
  onProceed,
  onCancel,
}) => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
    email: "",
  });
  const [isPaymentMethodOpen, setIsPaymentMethodOpen] =
    useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.email) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    setIsPaymentMethodOpen(true);
  };

  const handlePaymentModalClose = (paymentSuccessful?: boolean) => {
    setIsPaymentMethodOpen(false);
    onProceed(paymentSuccessful || false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Thông tin khách hàng
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Ví dụ: Nguyễn Văn A"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Ví dụ: +84353230012"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Ví dụ: emailvidu@gmail.com"
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Thông tin đơn hàng
              </h2>
              <div className="mb-4 p-4 border rounded bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {product.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Học phí:{" "}
                  <span className="text-red-500 font-semibold">
                    {product.price.toLocaleString("vi-VN")} đ
                  </span>
                </p>
                {product.duration && (
                  <p className="text-gray-600 text-sm mt-1">
                    Thời hạn: {product.duration}
                  </p>
                )}
                <p className="text-gray-600 text-sm mt-1">
                  Mã số: <span className="font-medium">{product.code}</span>
                </p>
              </div>
              <p className="text-gray-700 text-lg font-semibold mb-4 text-right">
                Tổng tiền:{" "}
                <span className="text-red-600">
                  {product.price.toLocaleString("vi-VN")} đ
                </span>
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="py-2 px-4 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-150"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-150"
            >
              Tiếp tục Thanh Toán
            </button>
          </div>
        </div>
      </div>
      {isPaymentMethodOpen && (
        <PaymentMethodModal
          product={product}
          customerInfo={customerInfo}
          onClose={handlePaymentModalClose}
        />
      )}
    </>
  );
};

export default InfoModal;
