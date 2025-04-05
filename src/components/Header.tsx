import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import logo from "../assets/logo/logo.png";
import profile from "../assets/images/profile-icon.png";
import { useAuth } from "./AuthContext"; // Import useAuth

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth(); // Lấy trạng thái đăng nhập và hàm logout

  return (
    <header className="flex items-center justify-between px-4 bg-[#F5E6CA] border-b border-gray-200">
      <img
        src={logo}
        alt="JLearn Logo"
        className="h-16 w-24 ml-10 cursor-pointer"
        onClick={() => navigate("/")}
      />
      <div className="flex items-center">
        <nav className="ml-20">
          <ul className="flex space-x-8">
            <li className="flex items-center">
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `hover:text-red-500 text-lg ${isActive ? "text-red-500" : ""}`
                }
              >
                Trang chủ
              </NavLink>
            </li>
            <li className="flex items-center">
              <NavLink
                to="/courses"
                className={({ isActive }) =>
                  `hover:text-red-500 text-lg ${isActive ? "text-red-500" : ""}`
                }
              >
                Khóa học
              </NavLink>
            </li>
            <li className="flex items-center">
              <NavLink
                to="/skills"
                className={({ isActive }) =>
                  `hover:text-red-500 text-lg ${isActive ? "text-red-500" : ""}`
                }
              >
                Kỹ năng
              </NavLink>
            </li>
            <li className="flex items-center">
              <NavLink
                to="/translate"
                className={({ isActive }) =>
                  `hover:text-red-500 text-lg ${isActive ? "text-red-500" : ""}`
                }
              >
                Tra cứu
              </NavLink>
            </li>
            <li className="flex items-center">
              <NavLink
                to="/flashcards"
                className={({ isActive }) =>
                  `hover:text-red-500 text-lg ${isActive ? "text-red-500" : ""}`
                }
              >
                Thẻ ghi nhớ
              </NavLink>
            </li>
            <li className="flex items-center">
              <NavLink
                to="/reviews"
                className={({ isActive }) =>
                  `hover:text-red-500 text-lg ${isActive ? "text-red-500" : ""}`
                }
              >
                Đánh giá
              </NavLink>
            </li>
            {isLoggedIn && ( // Chỉ hiển thị hình ảnh hồ sơ nếu đã đăng nhập
              <li className="flex items-center ">
                <img
                  src={profile}
                  alt="Profile Icon"
                  className="h-12 w-12 rounded-full hover:cursor-pointer "
                  onClick={() => navigate("/profileProfile")}
                />
              </li>
            )}
          </ul>
        </nav>
      </div>
      {isLoggedIn ? (
        <button
          className="bg-red-500 text-white h-8 w-28 px-4 py-1 rounded-3xl hover:bg-red-600"
          onClick={() => {
            logout(); // Gọi hàm logout khi nhấn nút
            navigate("/home"); // Điều hướng về trang đăng nhập
          }}
        >
          Đăng xuất
        </button>
      ) : (
        <button
          className="bg-red-500 text-white h-8 w-28 px-4 py-1 rounded-3xl hover:bg-red-600"
          onClick={() => navigate("/login")}
        >
          Đăng nhập
        </button>
      )}
    </header>
  );
};

export default Header;
