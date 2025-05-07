import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

interface User {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  roleUser: string;
}

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const MAX_LENGTH = 255;
  const [details, setDetails] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    userName: "",
    fullName: "",
    email: "",
    roleUser: "",
  });

  useEffect(() => {
    const userData = (location.state as { user: User })?.user;
    if (userData && userData.id === id) {
      setDetails(userData);
      setLoading(false);
    } else if (!id) {
      setDetails({
        id: `${Date.now()}`,
        userName: "",
        email: "",
        fullName: "",
        roleUser: "User",
      });
      setLoading(false);
    } else {
      setError("Không tìm thấy thông tin người dùng");
      setLoading(false);
    }
  }, [id, location.state]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (details) {
      const { name, value } = e.target;
      setDetails({
        ...details,
        [name]: value,
      });
    }
  };

  const validateForm = (): boolean => {
    const errors = {
      userName: "",
      fullName: "",
      email: "",
      roleUser: "",
    };

    if (!details?.userName.trim()) {
      errors.userName = "Yêu cầu nhập username";
    } else if (details.userName.length > MAX_LENGTH) {
      errors.userName = `Username không được vượt quá ${MAX_LENGTH} ký tự`;
    }

    if (!details?.fullName.trim()) {
      errors.fullName = "Yêu cầu nhập họ tên";
    } else if (details.fullName.length > MAX_LENGTH) {
      errors.fullName = `Họ tên không được vượt quá ${MAX_LENGTH} ký tự`;
    }

    if (!details?.email.trim()) {
      errors.email = "Yêu cầu nhập email";
    } else if (details.email.length > MAX_LENGTH) {
      errors.email = `Email không được vượt quá ${MAX_LENGTH} ký tự`;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
      errors.email = "Email không hợp lệ";
    }

    if (!details?.roleUser) {
      errors.roleUser = "Yêu cầu chọn vai trò";
    }

    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details) return;

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setTimeout(() => {
      alert(
        id ? "Cập nhật thông tin thành công!" : "Thêm người dùng thành công!",
      );
      setSaving(false);
      navigate("/admin/account", { state: { updatedUser: details } });
    }, 1000);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto border-2 border-gray-400 rounded-lg shadow-md bg-white p-4 sm:p-6">
        {loading && <p className="text-center">Đang tải dữ liệu...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {!loading && !error && details && (
          <form onSubmit={handleSave}>
            <h1 className="text-xl sm:text-2xl font-bold mb-6">
              {id ? "Chỉnh sửa thông tin người dùng" : "Thêm người dùng mới"}
            </h1>

            <div className="mb-4">
              <label className="block mb-2 text-sm sm:text-base font-semibold">
                Username
              </label>
              <input
                type="text"
                name="userName"
                value={details.userName}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded text-sm sm:text-base ${
                  validationErrors.userName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {validationErrors.userName && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {validationErrors.userName}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm sm:text-base font-semibold">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={details.email}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded text-sm sm:text-base ${
                  validationErrors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.email && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm sm:text-base font-semibold">
                Họ và tên
              </label>
              <input
                type="text"
                name="fullName"
                value={details.fullName}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded text-sm sm:text-base ${
                  validationErrors.fullName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {validationErrors.fullName && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {validationErrors.fullName}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm sm:text-base font-semibold">
                Vai trò
              </label>
              <select
                name="roleUser"
                value={details.roleUser}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded text-sm sm:text-base ${
                  validationErrors.roleUser
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                <option value="Moderator">Moderator</option>
              </select>
              {validationErrors.roleUser && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {validationErrors.roleUser}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <button
                type="submit"
                disabled={saving}
                className={`w-full sm:w-auto px-4 py-2 rounded text-sm sm:text-base ${
                  saving
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {saving ? "Đang lưu..." : "Lưu Thay Đổi"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/account")}
                className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm sm:text-base"
              >
                Quay lại
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditUser;
