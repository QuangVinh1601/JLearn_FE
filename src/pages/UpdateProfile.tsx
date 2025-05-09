import React, { useState } from "react";

const UpdateProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "Trang",
    nickName: "",
    gender: "",
    country: "",
    language: "",
    timezone: "",
    email: "TrangNTQ.com",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Cập nhật thông tin:", formData);
    setIsEditing(false);
  };

  return (
    <div className="flex justify-center py-10 bg-gray-50">
      <div className="w-full max-w-5xl bg-white border border-gray-200 rounded-lg shadow-md p-6 space-y-6">
        {/* Avatar + Info */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src="https://i.pravatar.cc/100"
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold">{formData.fullName}</h2>
              <p className="text-gray-500">{formData.email}</p>
            </div>
          </div>
          <button
            onClick={() =>
              isEditing ? setIsEditing(false) : setIsEditing(true)
            }
            className={`px-5 py-2 text-white rounded-md font-medium ${
              isEditing
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isEditing ? "Lưu" : "Chỉnh sửa"}
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Họ và tên
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
              placeholder="Họ và tên"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Biệt danh
            </label>
            <input
              type="text"
              name="nickName"
              value={formData.nickName}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
              placeholder="Biệt danh"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Giới tính
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quốc gia
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
              placeholder="Quốc gia"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngôn ngữ
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
            >
              <option value="">Chọn ngôn ngữ</option>
              <option value="vi">Tiếng Việt</option>
              <option value="en">Tiếng Anh</option>
              <option value="jp">Tiếng Nhật</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Múi giờ
            </label>
            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
            >
              <option value="">Chọn múi giờ</option>
              <option value="GMT+7">GMT+7 (Việt Nam)</option>
              <option value="GMT+1">GMT+1</option>
              <option value="GMT-5">GMT-5</option>
            </select>
          </div>
        </form>

        {/* Email list */}
        <div className="pt-6 border-t">
          <h3 className="text-md font-semibold text-gray-700 mb-2">
            Email của tôi
          </h3>
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 text-blue-600 rounded-full p-2">📧</div>
            <div>
              <p className="text-sm">{formData.email}</p>
              <p className="text-xs text-gray-500">1 tháng trước</p>
            </div>
          </div>
          <button
            type="button"
            className="mt-4 px-4 py-2 text-sm rounded-md bg-blue-50 text-blue-600 hover:bg-red-600"
          >
            + Thêm địa chỉ email
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
