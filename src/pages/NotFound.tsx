import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-900">
          404 - Trang không tìm thấy
        </h1>
        <p className="mt-4 text-gray-600">
          Xin lỗi, trang bạn tìm kiếm không tồn tại.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
