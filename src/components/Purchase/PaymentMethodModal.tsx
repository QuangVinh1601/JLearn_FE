import React, { useState, useEffect } from "react";
import { Product, CustomerInfo, PaymentMethod } from "../../types/purchase";
import SuccessModal from "./SuccessModal";
// Import ZaloPay API functions
import {
  createZaloPayOrder,
  getZaloPayOrderStatus,
} from "../../services/api/apiPurchase";
// Import QRCodeCanvas
import { QRCodeCanvas } from "qrcode.react";
// Import ZaloPay logo
import ZaloPayLogo from "../../assets/images/ZaloPay.png";

interface PaymentMethodModalProps {
  product: Product;
  customerInfo: CustomerInfo;
  // Updated prop type to accept optional boolean status
  onClose: (paymentSuccessful?: boolean) => void;
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
  // ZaloPay specific state
  const [zaloPayLoading, setZaloPayLoading] = useState<boolean>(false);
  const [zaloPayError, setZaloPayError] = useState<string | null>(null);
  const [zaloPayOrderUrl, setZaloPayOrderUrl] = useState<string | null>(null);
  const [zaloPayAppTransId, setZaloPayAppTransId] = useState<string | null>(
    null,
  );
  const [zaloPayStatus, setZaloPayStatus] = useState<any>(null);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(false);
  // Add new state variable for qrcode
  const [zaloPayQRCode, setZaloPayQRCode] = useState<string | null>(null);
  // State for the countdown timer (in seconds)
  const [countdown, setCountdown] = useState<number>(300); // 5 minutes = 300 seconds

  const handleMethodChange = (method: PaymentMethod) => {
    setSelectedMethod(method);
    // Reset ZaloPay state if switching away
    if (method !== "zalopay") {
      setZaloPayOrderUrl(null);
      setZaloPayAppTransId(null);
      setZaloPayStatus(null);
      setZaloPayError(null);
      setZaloPayQRCode(null); // Also reset qrcode
      setCountdown(300); // Reset countdown
    }
  };

  const handleConfirm = async () => {
    if (!selectedMethod) {
      alert("Vui lòng chọn phương thức thanh toán.");
      return;
    }

    if (selectedMethod === "zalopay") {
      setZaloPayLoading(true);
      setZaloPayError(null);
      setZaloPayOrderUrl(null);
      setZaloPayAppTransId(null);
      setZaloPayStatus(null);
      setZaloPayQRCode(null); // Reset qrcode
      setCountdown(300); // Start countdown on successful order creation

      try {
        const response = await createZaloPayOrder(
          product.price,
          `Thanh toán cho ${product.title}`,
          customerInfo.userId, // Pass the userId
          customerInfo.collectionId, // Pass the collectionId
        );

        if (
          response.zalopay_response.returncode === 1 &&
          response.zalopay_response.orderurl
        ) {
          setZaloPayOrderUrl(response.zalopay_response.orderurl);
          setZaloPayAppTransId(response.order_payload.apptransid);
          setZaloPayQRCode((response.zalopay_response as any).qrcode); // Set qrcode state
          setCountdown(300); // Start countdown
        } else {
          setZaloPayError(
            `Lỗi tạo đơn hàng ZaloPay: ${response.zalopay_response.returnmessage} (Code: ${response.zalopay_response.returncode})`,
          );
        }
      } catch (err: any) {
        console.error("Error creating ZaloPay order:", err);
        setZaloPayError("Đã xảy ra lỗi khi tạo đơn hàng ZaloPay.");
      } finally {
        setZaloPayLoading(false);
      }
    } else {
      // Handle bank or office payment -> Show SuccessModal
      setIsSuccessOpen(true);
    }
  };

  const handleCheckZaloPayStatus = async () => {
    if (!zaloPayAppTransId) return;
    setCheckingStatus(true);
    setZaloPayStatus(null); // Clear previous status
    setZaloPayError(null); // Clear previous error
    try {
      const statusResult = await getZaloPayOrderStatus(zaloPayAppTransId);
      setZaloPayStatus(statusResult);
      if (statusResult.returncode === 1) {
        // Payment successful - call onClose with true
        onClose(true);
      } else if (statusResult.returncode === 3) {
        // Payment failed definitively
        console.log("ZaloPay payment failed.");
      }
    } catch (err: any) {
      setZaloPayError(
        "Lỗi kiểm tra trạng thái ZaloPay: " +
        (err.response?.data?.error || err.message),
      );
    } finally {
      setCheckingStatus(false);
    }
  };

  // Effect for automatic status checking (polling)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (zaloPayAppTransId) {
      interval = setInterval(async () => {
        try {
          const statusResult = await getZaloPayOrderStatus(zaloPayAppTransId);
          setZaloPayStatus(statusResult);

          if (statusResult.returncode === 1) {
            // Payment successful, stop polling and close modal
            clearInterval(interval!);
            alert("Thanh toán thành công!");
            onClose(true);
          } else if (statusResult.returncode === 3) {
            // Payment failed, stop polling
            clearInterval(interval!);
            alert("Thanh toán thất bại.");
          }
        } catch (err: any) {
          console.error("Error checking ZaloPay status:", err);
          setZaloPayError(
            "Lỗi kiểm tra trạng thái ZaloPay: " +
            (err.response?.data?.error || err.message),
          );
        }
      }, 5000); // Check every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [zaloPayAppTransId, onClose]);

  // Effect for the countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (zaloPayOrderUrl && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (zaloPayOrderUrl && countdown === 0) {
      console.log("ZaloPay QR code expired.");
      onClose(false);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [zaloPayOrderUrl, countdown, onClose]);

  // Format the countdown time
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Chọn hình thức thanh toán cho: {product.title} (
            {product.price.toLocaleString("vi-VN")} VNĐ)
          </h2>

          {/* Phương thức thanh toán */}
          <div className="mb-4">


            {/* ZaloPay */}
            <label className="flex items-center mb-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="zalopay"
                checked={selectedMethod === "zalopay"}
                onChange={() => handleMethodChange("zalopay")}
                className="mr-2"
                disabled={!!zaloPayOrderUrl} // Disable if ZaloPay QR is shown
              />
              <span className="text-gray-700">Thanh toán qua ZaloPay</span>
            </label>
            {selectedMethod === "zalopay" && !zaloPayOrderUrl && (
              <p className="text-sm text-gray-600 ml-6 mb-2">
                Thanh toán nhanh chóng và tiện lợi bằng mã QR ZaloPay.
              </p>
            )}
          </div>

          {/* ZaloPay QR and Instructions Display (Modified) */}
          {zaloPayOrderUrl && (
            <div className="my-4 p-4 border border-blue-300 rounded bg-blue-50 text-center">
              <h3 className="text-lg font-semibold mb-3 text-black-800">
                Thanh toán với
                <img
                  src={ZaloPayLogo}
                  alt="ZaloPay Logo"
                  style={{
                    width: "60px",
                    height: "20px",
                    display: "inline-block",
                    marginLeft: "5px",
                    marginTop: "-5px",
                    marginRight: "5px",
                  }}
                />
                bằng mã QR
              </h3>
              {/* Use qrcode state variable with QRCodeCanvas */}
              {zaloPayQRCode && (
                <div
                  style={{ margin: "0 auto", width: "250px", height: "250px" }}
                >
                  {" "}
                  {/* Slightly smaller QR area */}
                  <QRCodeCanvas
                    value={zaloPayQRCode}
                    size={250}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"L"} // Error correction level
                    includeMargin={false}
                  />
                </div>
              )}
              {/* Countdown Timer */}
              <p className="text-black-600 font-bold mt-3">
                Thời gian quét mã QR để thanh toán còn:{" "}
                <span className="text-blue-600">{formatTime(countdown)}</span>
              </p>

              {/* Payment Instructions */}
              <div className="mt-4 text-left">
                <p className="font-semibold mb-2">
                  Hướng dẫn thanh toán:
                  <img
                    src={ZaloPayLogo}
                    alt="ZaloPay Logo"
                    style={{
                      width: "60px",
                      height: "20px",
                      display: "inline-block",
                      marginLeft: "5px",
                      marginTop: "-5px",
                    }}
                  />
                </p>
                <ol className="list-decimal list-inside text-gray-700">
                  <li>Bước 1: Mở ứng dụng ZaloPay</li>
                  <li>Bước 2: Chọn "Thanh Toán" và quét mã QR</li>
                  <li>Bước 3: Xác nhận thanh toán ở ứng dụng</li>
                </ol>
              </div>

              <p className="text-sm text-gray-600 mt-4">
                Mã giao dịch: {zaloPayAppTransId}
              </p>
              {/* Optional: Keep or remove the manual check button based on preference */}
              {/* <button
                onClick={handleCheckZaloPayStatus}
                disabled={checkingStatus}
                className="mt-3 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {checkingStatus
                  ? "Đang kiểm tra..."
                  : "Kiểm tra trạng thái thanh toán"}
              </button> */}
            </div>
          )}

          {/* ZaloPay Error Display */}
          {zaloPayError && (
            <div className="my-4 p-3 border border-red-400 rounded bg-red-50 text-red-700">
              <p>
                <b>Lỗi ZaloPay:</b> {zaloPayError}
              </p>
            </div>
          )}

          {/* Lưu ý */}
          {!zaloPayOrderUrl && ( // Hide notes when showing QR
            <div className="mb-4">
              <ul className="list-disc list-inside text-gray-700">
                <li>
                  Khi bạn nhấn nút xác nhận đơn hàng, bạn đã đồng ý với Điều
                  khoản sử dụng và Chính sách bảo mật của japstudy.id.vn
                </li>
                <li>
                  Sau khi chuyển khoản thành công bạn vui lòng đợi từ 5 đến 10 giây để đợi kết quả thanh toán.
                </li>
              </ul>
            </div>
          )}

          {/* Nút điều khiển */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => onClose(false)}
              className="py-2 px-4 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              {zaloPayOrderUrl ? "Đóng" : "Hủy"}
            </button>
            {/* Hide confirm button if ZaloPay QR is shown */}
            {!zaloPayOrderUrl && (
              <button
                onClick={handleConfirm}
                disabled={!selectedMethod || zaloPayLoading}
                className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
              >
                {zaloPayLoading
                  ? "Đang xử lý..."
                  : selectedMethod === "zalopay"
                    ? "Lấy mã QR ZaloPay"
                    : "Xác Nhận"}
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Keep SuccessModal for bank/office payments */}
      {isSuccessOpen && selectedMethod !== "zalopay" && (
        <SuccessModal
          product={product}
          customerInfo={customerInfo}
          onClose={() => {
            setIsSuccessOpen(false);
            onClose(false); // Close the payment method modal as well
          }}
        />
      )}
    </>
  );
};

export default PaymentMethodModal;
