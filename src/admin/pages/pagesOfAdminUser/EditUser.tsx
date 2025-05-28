import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaSave, FaTimesCircle, FaArrowLeft } from "react-icons/fa";

interface User {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  roleUser: string;
}

const MAX_LENGTH = 255;

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // id là undefined khi thêm mới
  const navigate = useNavigate();
  const location = useLocation();

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

  const isEditMode = Boolean(id);

  useEffect(() => {
    setLoading(true);
    const userDataFromState = (location.state as { user: User })?.user;

    if (isEditMode) {
      if (userDataFromState && userDataFromState.id === id) {
        setDetails(userDataFromState);
      } else {
        // Trong thực tế, bạn sẽ fetch user by id ở đây nếu không có trong state
        // Ví dụ: fetchUserById(id).then(data => setDetails(data)).catch(err => setError("..."))
        setError("Không tìm thấy thông tin người dùng để chỉnh sửa.");
      }
    } else {
      // Chế độ thêm mới
      setDetails({
        id: `new_${Date.now()}`, // ID tạm thời cho user mới
        userName: "",
        email: "",
        fullName: "",
        roleUser: "User", // Giá trị mặc định
      });
    }
    setLoading(false);
  }, [id, location.state, isEditMode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (details) {
      const { name, value } = e.target;
      setDetails({ ...details, [name]: value });
      // Xóa lỗi validation khi người dùng bắt đầu nhập
      if (validationErrors[name as keyof typeof validationErrors]) {
        setValidationErrors({ ...validationErrors, [name]: "" });
      }
    }
  };

  const validateForm = (): boolean => {
    if (!details) return false;
    const errors = { userName: "", fullName: "", email: "", roleUser: "" };
    let isValid = true;

    if (!details.userName.trim()) {
      errors.userName = "Tên người dùng không được để trống.";
      isValid = false;
    } else if (details.userName.length > MAX_LENGTH) {
      errors.userName = `Tên người dùng không quá ${MAX_LENGTH} ký tự.`;
      isValid = false;
    }

    if (!details.fullName.trim()) {
      errors.fullName = "Họ và tên không được để trống.";
      isValid = false;
    } else if (details.fullName.length > MAX_LENGTH) {
      errors.fullName = `Họ và tên không quá ${MAX_LENGTH} ký tự.`;
      isValid = false;
    }

    if (!details.email.trim()) {
      errors.email = "Email không được để trống.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
      errors.email = "Địa chỉ email không hợp lệ.";
      isValid = false;
    } else if (details.email.length > MAX_LENGTH) {
      errors.email = `Email không quá ${MAX_LENGTH} ký tự.`;
      isValid = false;
    }

    if (!details.roleUser) {
      errors.roleUser = "Vui lòng chọn vai trò cho người dùng.";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details || !validateForm()) {
      return;
    }

    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      // alert(isEditMode ? "Cập nhật thông tin thành công!" : "Thêm người dùng thành công!");
      setSaving(false);
      navigate("/admin/account", { state: { updatedUser: details } });
    }, 1000);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-700 bg-[#F8F7F0] min-h-screen">
        Đang tải...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-700 bg-red-50 rounded-lg shadow-md max-w-md mx-auto mt-10">
        {FaTimesCircle({ className: "mx-auto text-3xl mb-3" })}
        {error}
        <button
          onClick={() => navigate("/admin/account")}
          className="mt-4 flex items-center justify-center w-full px-4 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          {FaArrowLeft({ className: "mr-2" })} Quay lại danh sách
        </button>
      </div>
    );
  }

  if (!details) {
    // Trường hợp details là null sau khi loading xong (ít khi xảy ra nếu logic đúng)
    return (
      <div className="p-8 text-center text-gray-700 bg-[#F8F7F0] min-h-screen">
        Không có dữ liệu để hiển thị.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F0] p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-6 sm:p-10 border border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-red-700 mb-8 text-center">
          {isEditMode
            ? "Chỉnh sửa thông tin người dùng"
            : "Thêm người dùng mới"}
        </h1>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label
              htmlFor="userName"
              className="block mb-1.5 text-sm font-semibold text-gray-700"
            >
              Tên người dùng
            </label>
            <input
              id="userName"
              type="text"
              name="userName"
              value={details.userName}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg text-sm transition-colors
                ${
                  validationErrors.userName
                    ? "border-red-500 text-red-700 focus:border-red-600 focus:ring-red-600"
                    : "border-gray-300 focus:border-red-500 focus:ring-red-500"
                }`}
            />
            {validationErrors.userName && (
              <p className="text-red-500 text-xs mt-1.5">
                {validationErrors.userName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-1.5 text-sm font-semibold text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={details.email}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg text-sm transition-colors
                ${
                  validationErrors.email
                    ? "border-red-500 text-red-700 focus:border-red-600 focus:ring-red-600"
                    : "border-gray-300 focus:border-red-500 focus:ring-red-500"
                }`}
            />
            {validationErrors.email && (
              <p className="text-red-500 text-xs mt-1.5">
                {validationErrors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="fullName"
              className="block mb-1.5 text-sm font-semibold text-gray-700"
            >
              Họ và tên
            </label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={details.fullName}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg text-sm transition-colors
                ${
                  validationErrors.fullName
                    ? "border-red-500 text-red-700 focus:border-red-600 focus:ring-red-600"
                    : "border-gray-300 focus:border-red-500 focus:ring-red-500"
                }`}
            />
            {validationErrors.fullName && (
              <p className="text-red-500 text-xs mt-1.5">
                {validationErrors.fullName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="roleUser"
              className="block mb-1.5 text-sm font-semibold text-gray-700"
            >
              Vai trò
            </label>
            <select
              id="roleUser"
              name="roleUser"
              value={details.roleUser}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg text-sm transition-colors bg-white
                ${
                  validationErrors.roleUser
                    ? "border-red-500 text-red-700 focus:border-red-600 focus:ring-red-600"
                    : "border-gray-300 focus:border-red-500 focus:ring-red-500"
                }`}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="Moderator">Moderator</option>
            </select>
            {validationErrors.roleUser && (
              <p className="text-red-500 text-xs mt-1.5">
                {validationErrors.roleUser}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row-reverse gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {FaSave({ className: "mr-2" })}
              {saving
                ? isEditMode
                  ? "Đang cập nhật..."
                  : "Đang thêm..."
                : isEditMode
                  ? "Lưu thay đổi"
                  : "Thêm người dùng"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/account")}
              className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              {FaArrowLeft({ className: "mr-2" })} Quay lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
