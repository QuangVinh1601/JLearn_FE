import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import logo from "../assets/logo/logo.png";
import profile from "../assets/images/profile-icon.png";
import { useAuth } from "./AuthContext";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-4 bg-[#F5E6CA] border-b border-gray-200">
      {/* Logo và nút Hamburger (nhóm lại gần nhau trên mobile) */}
      <div className="flex items-center space-x-3 sm:space-x-0">
        <img
          src={logo}
          alt="JLearn Logo"
          className="h-12 w-20 sm:h-16 sm:w-24 cursor-pointer"
          onClick={() => navigate("/")}
        />
        {/* Nút Hamburger cho mobile */}
        <button
          className="sm:hidden text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Menu điều hướng */}
      <nav
        className={`${
          isMenuOpen ? "block" : "hidden"
        } sm:block absolute sm:static top-16 left-0 right-0 bg-[#F5E6CA] sm:bg-transparent p-4 sm:p-0 z-50`}
      >
        <ul className="flex flex-col sm:flex-row sm:space-x-8 space-y-4 sm:space-y-0">
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
          {isLoggedIn && (
            <li className="flex items-center">
              <img
                src={profile}
                alt="Profile Icon"
                className="h-10 w-10 rounded-full hover:cursor-pointer"
                onClick={() => navigate("/profileProfile")}
              />
            </li>
          )}
        </ul>
      </nav>

      {/* Nút đăng nhập/đăng xuất */}
      <div>
        {isLoggedIn ? (
          <button
            className="bg-red-500 text-white h-8 w-[90px] sm:w-28 px-3 sm:px-4 py-1 rounded-3xl text-sm sm:text-base hover:bg-red-600 whitespace-nowrap"
            onClick={() => {
              logout();
              navigate("/home");
            }}
          >
            Đăng xuất
          </button>
        ) : (
          <button
            className="bg-red-500 text-white h-8 w-[90px] sm:w-28 px-3 sm:px-4 py-1 rounded-3xl text-sm sm:text-base hover:bg-red-600 whitespace-nowrap"
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
