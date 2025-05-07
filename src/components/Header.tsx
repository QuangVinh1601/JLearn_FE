import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import logo from "../assets/logo/logo.png";
import profile from "../assets/images/profile-icon.png";
import { useAuth } from "./AuthContext";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for hamburger menu

  // Function to handle logout and navigation
  const handleLogout = () => {
    logout();
    navigate("/home");
    setIsMenuOpen(false); // Close menu on logout
  };

  // Function to handle navigation link clicks and close menu
  const handleNavClick = () => {
    setIsMenuOpen(false); // Close menu when a link is clicked
  };

  // Define NavLink class based on active state
  const linkClassName = ({ isActive }: { isActive: boolean }) =>
    `hover:text-red-500 text-lg ${isActive ? "text-red-500 font-semibold" : "text-gray-700"}`; // Added font-semibold for active link

  return (
    // Use py-2 for vertical padding, h-16 for fixed height
    <header className="flex items-center justify-between px-4 sm:px-6 py-2 bg-[#F5E6CA] border-b border-gray-200 h-16 shadow-sm relative">
      {" "}
      {/* Added relative positioning */}
      {/* Left section: Logo */}
      <div className="flex-shrink-0">
        <img
          src={logo}
          alt="JLearn Logo"
          // Adjusted logo size for consistency, slightly larger on sm+
          className="h-12 sm:h-14 w-auto cursor-pointer"
          onClick={() => {
            navigate("/");
            handleNavClick(); // Close menu on logo click
          }}
        />
      </div>
      {/* Center: Hamburger Button (Mobile) */}
      <div className="sm:hidden flex-shrink-0">
        <button
          className="text-2xl text-gray-700 hover:text-red-500"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen} // Added accessibility attribute
        >
          ☰
        </button>
      </div>
      {/* Center: Navigation Menu (Desktop and Mobile Dropdown) */}
      <nav
        className={`${
          isMenuOpen ? "block" : "hidden"
        } sm:flex sm:flex-grow sm:justify-center absolute sm:static top-full left-0 right-0 bg-[#F5E6CA] sm:bg-transparent p-4 sm:p-0 z-40 shadow-md sm:shadow-none border-b sm:border-none border-gray-200`} // Adjusted positioning and styling for dropdown
      >
        {/* Use Poppins font, adjust spacing */}
        <ul className="font-poppins flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 md:space-x-8">
          {/* List items with NavLinks */}
          <li>
            <NavLink
              to="/home"
              className={linkClassName}
              onClick={handleNavClick}
            >
              Trang chủ
            </NavLink>
          </li>
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
              to="/flashcards"
              className={linkClassName}
              onClick={handleNavClick}
            >
              Thẻ ghi nhớ
            </NavLink>
          </li>
          {/* Removed /reviews and /contact as they weren't in the merged App.tsx */}
          {/* Profile Icon integrated into Nav for logged-in users on larger screens */}
          {isLoggedIn && (
            <li className="hidden sm:flex items-center ml-4">
              {" "}
              {/* Hide on mobile, show on sm+, add margin */}
              <img
                src={profile}
                alt="Profile Icon"
                // Consistent size, added border
                className="h-10 w-10 rounded-full hover:cursor-pointer border border-gray-300"
                onClick={() => {
                  navigate("/profileProfile");
                  handleNavClick(); // Close menu
                }}
              />
            </li>
          )}
          {/* Profile link for mobile dropdown */}
          {isLoggedIn && (
            <li className="sm:hidden border-t border-gray-200 pt-4 mt-4">
              {" "}
              {/* Show only on mobile, add separator */}
              <NavLink
                to="/profileProfile"
                className={linkClassName}
                onClick={handleNavClick}
              >
                Hồ sơ
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      {/* Right: Login/Logout Button (Desktop) - Adjusted for spacing */}
      <div className="hidden sm:flex items-center flex-shrink-0 ml-4">
        {" "}
        {/* Hide on mobile, show on sm+ */}
        {isLoggedIn ? (
          <button
            // Reverted to less rounded corners, adjusted padding/height slightly
            className="bg-red-500 text-white h-9 px-5 rounded-md hover:bg-red-600 text-sm font-medium transition duration-150 ease-in-out shadow-sm whitespace-nowrap"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        ) : (
          <button
            // Reverted to less rounded corners, adjusted padding/height slightly
            className="bg-red-500 text-white h-9 px-5 rounded-md hover:bg-red-600 text-sm font-medium transition duration-150 ease-in-out shadow-sm whitespace-nowrap"
            onClick={() => {
              navigate("/login");
              handleNavClick(); // Close menu
            }}
          >
            Đăng nhập
          </button>
        )}
      </div>
      {/* Login/Logout Button for mobile dropdown */}
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
                handleNavClick(); // Close menu
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
