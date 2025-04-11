import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import logo from "../assets/logo/logo.png"; // Đảm bảo đường dẫn đúng
import profile from "../assets/images/profile-icon.png"; // Đảm bảo đường dẫn đúng
import { useAuth } from "./AuthContext"; // Đảm bảo AuthContext được import đúng

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  // --- ĐÃ CẬP NHẬT ---
  // Kiểu cho NavLink: cỡ chữ lớn hơn (text-lg), dày hơn (font-semibold)
  // Font Poppins sẽ được áp dụng nếu cấu hình Tailwind đúng
  const linkClassName = ({ isActive }: { isActive: boolean }) =>
    `text-lg font-semibold transition-colors duration-150 ease-in-out ${ // Cập nhật: text-lg font-semibold
    isActive
      ? "text-red-500 font-bold" // Active vẫn có thể là font-bold để nổi bật hơn nữa
      : "text-gray-700 hover:text-red-500" // Trạng thái thường và hover
    }`;
  // --- KẾT THÚC CẬP NHẬT ---

  return (
    // Phần header giữ nguyên các class từ lần chỉnh sửa trước
    <header className="flex items-center justify-between px-4 sm:px-6 py-2 bg-[#F5E6CA] border-b border-gray-200 h-16 shadow-sm">

      {/* Left: Logo */}
      <div className="flex-shrink-0">
        <img
          src={logo}
          alt="JLearn Logo"
          // Kích thước logo giữ nguyên từ lần chỉnh sửa trước (h-12)
          className="h-20 w-auto cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>

      {/* Center: Navigation */}
      <nav className="flex-grow">
        {/* Sử dụng linkClassName đã cập nhật */}
        <ul className="font-poppins flex justify-center items-center space-x-6 md:space-x-8">
          <li><NavLink to="/home" className={linkClassName}>Trang chủ</NavLink></li>
          <li><NavLink to="/courses" className={linkClassName}>Khóa học</NavLink></li>
          <li><NavLink to="/skills" className={linkClassName}>Kỹ năng</NavLink></li>
          <li><NavLink to="/translate" className={linkClassName}>Tra cứu</NavLink></li>
          <li><NavLink to="/flashcards" className={linkClassName}>Thẻ ghi nhớ</NavLink></li>
          <li><NavLink to="/reviews" className={linkClassName}>Đánh giá</NavLink></li>
          <li><NavLink to="/contact" className={linkClassName}>Liên hệ</NavLink></li>
        </ul>
      </nav>

      {/* Right: Profile/Login/Logout Button */}
      <div className="flex items-center space-x-4 flex-shrink-0">
        {isLoggedIn ? (
          <>
            {/* Kích thước icon giữ nguyên */}
            <img
              src={profile}
              alt="Profile Icon"
              className="h-10 w-10 rounded-full hover:cursor-pointer border border-gray-300"
              onClick={() => navigate("/profileProfile")} // Đảm bảo route này tồn tại
            />
            {/* Kích thước nút giữ nguyên */}
            <button
              className="bg-red-500 text-white h-9 px-5 rounded-md hover:bg-red-600 text-sm font-medium transition duration-150 ease-in-out shadow-sm"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </>
        ) : (
          // Kích thước nút giữ nguyên
          <button
            className="bg-red-500 text-white h-9 px-5 rounded-md hover:bg-red-600 text-sm font-medium transition duration-150 ease-in-out shadow-sm"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;