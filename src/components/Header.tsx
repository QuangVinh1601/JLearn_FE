import React, { useState, useContext, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import logo from "../assets/logo/logo.png";
import profile from "../assets/images/profile-icon.png";
import { useAuth } from "./AuthContext";
import { UserContext } from "../contexts/UserContext";
import { logoutUser } from "../api/apiClient"; 
const Header: React.FC = () => {
  const navigate = useNavigate();

  const { isLoggedIn, logout, role } = useAuth(); // Thêm role từ useAuth
  const [isMenuOpen, setIsMenuOpen] = useState(false);

// In Header.tsx
const handleLogout = async () => {
  try {
    // Call API to invalidate tokens and clear cookies on the server
    await logoutUser();
  } catch (err) {
    console.error("Error during logout:", err);
  } finally {
    // Always perform local logout, even if API call fails
    logout();
    navigate("/home");
    setIsMenuOpen(false);
  }
};

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  const linkClassName = ({ isActive }: { isActive: boolean }) =>
    `hover:text-red-500 text-lg ${isActive ? "text-red-500 font-semibold" : "text-gray-700"}`;

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-2 bg-[#F8F7F0] border-b border-gray-200 h-16 shadow-sm relative">
      <div className="flex-shrink-0">
        <img
          src={logo}
          alt="JLearn Logo"
          className="h-10 sm:h-12 w-auto cursor-pointer"
          onClick={() => {
            navigate("/");
            handleNavClick();
          }}
        />
      </div>
      <div className="sm:hidden flex-shrink-0">
        <button
          className="text-2xl text-gray-700 hover:text-red-500"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          ☰
        </button>
      </div>
      <nav
        className={`${
          isMenuOpen ? "block" : "hidden"
        } sm:flex sm:flex-grow sm:justify-center absolute sm:static top-full left-0 right-0 bg-[#F5E6CA] sm:bg-transparent p-4 sm:p-0 z-40 shadow-md sm:shadow-none border-b sm:border-none border-gray-200`}
      >
        <ul className="font-poppins flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 md:space-x-8">
          <li>
            <NavLink
              to="/home"
              className={linkClassName}
              onClick={handleNavClick}
            >
              Trang chủ
            </NavLink>
          </li>
          {role === "admin" ? (
            // Menu cho Admin
            <li>
              <NavLink
                to="/admin/dashboard"
                className={linkClassName}
                onClick={handleNavClick}
              >
                Quản trị
              </NavLink>
            </li>
          ) : (
            // Menu cho User hoặc chưa đăng nhập
            <>
              <li>
                <NavLink
                  to="/course"
                  className={linkClassName}
                  onClick={handleNavClick}
                >
                  {" "}
                  {/* Changed from /courses */}
                  Khóa học
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/skills"
                  className={linkClassName}
                  onClick={handleNavClick}
                >
                  Kỹ năng
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/translate"
                  className={linkClassName}
                  onClick={handleNavClick}
                >
                  Tra cứu
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/collection"
                  className={linkClassName}
                  onClick={handleNavClick}
                >
                  Thẻ ghi nhớ
                </NavLink>
              </li>
            </>
          )}
          {isLoggedIn && (
            <li className="hidden sm:flex items-center ml-4">
              <img
                src={profile}
                alt="Profile Icon"
                className="h-10 w-10 rounded-full hover:cursor-pointer border border-gray-300"
                onClick={() => {
                  navigate("/profile");
                  handleNavClick();
                }}
              />
            </li>
          )}
          {isLoggedIn && (
            <li className="sm:hidden border-t border-gray-200 pt-4 mt-4">
              <NavLink
                to="/profile"
                className={linkClassName}
                onClick={handleNavClick}
              >
                Hồ sơ
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      <div className="hidden sm:flex items-center flex-shrink-0 ml-4">
        {isLoggedIn ? (
          <button
            className="bg-red-500 text-white h-9 px-5 rounded-md hover:bg-red-600 text-sm font-medium transition duration-150 ease-in-out shadow-sm whitespace-nowrap"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        ) : (
          <button
            className="bg-red-500 text-white h-9 px-5 rounded-md hover:bg-red-600 text-sm font-medium transition duration-150 ease-in-out shadow-sm whitespace-nowrap"
            onClick={() => {
              navigate("/login");
              handleNavClick();
            }}
          >
            Đăng nhập
          </button>
        )}
      </div>
      {isMenuOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-[#F5E6CA] p-4 z-40 shadow-md border-b border-gray-200">
          {isLoggedIn ? (
            <button
              className="w-full bg-red-500 text-white h-9 px-5 rounded-md hover:bg-red-600 text-sm font-medium transition duration-150 ease-in-out shadow-sm whitespace-nowrap"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          ) : (
            <button
              className="w-full bg-red-500 text-white h-9 px-5 rounded-md hover:bg-red-600 text-sm font-medium transition duration-150 ease-in-out shadow-sm whitespace-nowrap"
              onClick={() => {
                navigate("/login");
                handleNavClick();
              }}
            >
              Đăng nhập
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
