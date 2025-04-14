import React, { useState } from "react";
import { Product, CustomerInfo, PaymentMethod } from "../../types/purchase";
import SuccessModal from "./SuccessModal";

interface PaymentMethodModalProps {
  product: Product;
  customerInfo: CustomerInfo;
  onClose: () => void;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  product,
  customerInfo,
  onClose,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [isSuccessOpen, setIsSuccessOpen] = useState<boolean>(false);

  const handleMethodChange = (method: PaymentMethod) => {
    setSelectedMethod(method);
  };

  const handleConfirm = () => {
    if (!selectedMethod) {
      alert("Vui lòng chọn phương thức thanh toán.");
      return;
    }
    setIsSuccessOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Chọn hình thức thanh toán
          </h2>

          {/* Phương thức thanh toán */}
          <div className="mb-4">
            <label className="flex items-center mb-2">
              <input
                type="radio"
                name="paymentMethod"
                value="office"
                onChange={() => handleMethodChange("office")}
                className="mr-2"
              />
              <span className="text-gray-700">
                Nộp tại văn phòng của Dũng Mori
              </span>
            </label>
            <p className="text-red-500 text-sm ml-6 mb-2">
              Các bạn chỉ việc ra ngân hàng báo nhân viên rằng “Tới muốn chuyển
              khoản vào tài khoản ngân hàng này”. Nhân viên ngân hàng sẽ chỉ bảo
              tận tình các bạn.
            </p>
            <label className="flex items-center mb-2">
              <input
                type="radio"
                name="paymentMethod"
                value="bank_vn"
                onChange={() => handleMethodChange("bank")}
                className="mr-2"
              />
              <span className="text-gray-700">Chuyển khoản ngân hàng</span>
            </label>
            <p className="text-red-500 text-sm ml-6">
              Hoặc bạn có thể chuyển khoản qua internet banking.
            </p>
          </div>

          {/* Thông tin tài khoản ngân hàng */}
          <div className="mb-4">
            <p className="text-gray-700 font-semibold">
              Thông tin tài khoản ngân hàng:
            </p>
            <p className="text-gray-700">
              MB BANK
              <br />
              ABC
              <br />
              123456789
            </p>
          </div>

          {/* Nội dung chuyển khoản */}
          <div className="mb-4">
            <p className="text-gray-700 font-semibold">
              Nội dung chuyển khoản ghi rõ:
            </p>
            <p className="text-gray-700">
              Số điện thoại - Họ và Tên - Sản phẩm mà bạn muốn mua.
              <br />
              Ví dụ: 0909090909 - Nguyen Van A - {product.title}
            </p>
            <p className="text-red-500 ">
              Lưu ý: Bộ Kỹ thuật biết @ trong địa chỉ mail vì 1 số ngân hàng
              không giao dịch được
            </p>
          </div>

          {/* Lưu ý */}
          <div className="mb-4">
            <ul className="list-disc list-inside text-gray-700">
              <li>
                Khi bạn nộp chuột vào xác nhận đơn hàng, bạn đã đồng ý với Điều
                khoản sử dụng và Chính sách bảo mật của website dungmori.com
              </li>
              <li>
                Sau khi chuyển khoản thành công bạn vui lòng liên hệ lại theo số
                hotline của trung tâm: 0969-86-84-85 hoặc inbox trực tiếp
                fanpage Facebook Dũng Mori của trung tâm.
              </li>
            </ul>
          </div>

          {/* Nút điều khiển */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="py-2 px-4 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirm}
              className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Xác Nhận
            </button>
          </div>
        </div>
      </div>
      {isSuccessOpen && (
        <SuccessModal
          product={product}
          customerInfo={customerInfo}
          onClose={() => {
            setIsSuccessOpen(false);
            onClose();
          }}
        />
      )}
    </>
  );
};

export default PaymentMethodModal;
