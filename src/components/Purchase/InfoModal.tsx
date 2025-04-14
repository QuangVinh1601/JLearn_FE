import React, { useState } from "react";
import { Product, CustomerInfo } from "../../types/purchase";
import PaymentMethodModal from "./PaymentMethodModal";

interface PurchaseModalProps {
  product: Product;
  togglePurchase: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  product,
  togglePurchase,
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

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50  flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-4xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Thông tin khách hàng (bên trái) */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Thông tin khách hàng
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tên khách hàng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
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

            {/* Thông tin đơn hàng (bên phải) */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Thông tin đơn hàng
              </h2>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Học phí:{" "}
                  <span className="text-red-500">
                    {product.price.toLocaleString("vi-VN")} đ
                  </span>
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  Thời hạn: {product.duration}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  Mã số: <span className="font-bold">{product.code}</span>
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Mã giảm giá
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    placeholder="Nhập mã giảm giá"
                  />
                  <button className="mt-1 py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600">
                    Áp dụng
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Tổng tiền:{" "}
                <span className="text-red-500">
                  {product.price.toLocaleString("vi-VN")} đ
                </span>
              </p>
            </div>
          </div>

          {/* Nút điều khiển */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={togglePurchase}
              className="py-2 px-4 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Thanh Toán
            </button>
          </div>
        </div>
      </div>
      {isPaymentMethodOpen && (
        <PaymentMethodModal
          product={product}
          customerInfo={customerInfo}
          onClose={() => {
            setIsPaymentMethodOpen(false);
            togglePurchase();
          }}
        />
      )}
    </>
  );
};

export default PurchaseModal;
