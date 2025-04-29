import React, { useState, useContext, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import logo from "../assets/logo/logo.png";
import profile from "../assets/images/profile-icon.png";
import { useAuth } from "./AuthContext";
import { UserContext } from "../contexts/UserContext";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const { resetUserData } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // State for user balance synced with localStorage (kept for potential future use or other components)
  const [userBalance, setUserBalance] = useState<number>(() => {
    const balance = localStorage.getItem('userBalance');
    return balance ? parseInt(balance, 10) : 10000000;
  });

  // Listen for changes in localStorage (e.g. after deposit/reset)
  useEffect(() => {
    const syncBalance = () => {
      const balance = localStorage.getItem('userBalance');
      setUserBalance(balance ? parseInt(balance, 10) : 10000000);
    };
    window.addEventListener('storage', syncBalance);
    const interval = setInterval(syncBalance, 500); // Keep interval for reset sync
    return () => {
      window.removeEventListener('storage', syncBalance);
      clearInterval(interval);
    };
  }, []);

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
    <header className="flex items-center justify-between px-4 sm:px-6 py-2 bg-[#F5E6CA] border-b border-gray-200 h-16 shadow-sm relative">
      {/* Left section: Logo */}
      <div className="flex-shrink-0">
        <img
          src={logo}
          alt="JLearn Logo"
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
          aria-expanded={isMenuOpen}
        >
          ☰
        </button>
      </div>

      {/* Center: Navigation Menu (Desktop and Mobile Dropdown) */}
      <nav
        className={`${isMenuOpen ? "block" : "hidden"
          } sm:flex sm:flex-grow sm:justify-center absolute sm:static top-full left-0 right-0 bg-[#F5E6CA] sm:bg-transparent p-4 sm:p-0 z-40 shadow-md sm:shadow-none border-b sm:border-none border-gray-200`}
      >
        <ul className="font-poppins flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 md:space-x-8">
          <li>
            <NavLink to="/home" className={linkClassName} onClick={handleNavClick}>
              Trang chủ
            </NavLink>
          </li>
          <li>
            <NavLink to="/course" className={linkClassName} onClick={handleNavClick}>
              Khóa học
            </NavLink>
          </li>
          <li>
            <NavLink to="/skills" className={linkClassName} onClick={handleNavClick}>
              Kỹ năng
            </NavLink>
          </li>
          <li>
            <NavLink to="/translate" className={linkClassName} onClick={handleNavClick}>
              Tra cứu
            </NavLink>
          </li>
          <li>
            <NavLink to="/flashcards" className={linkClassName} onClick={handleNavClick}>
              Thẻ ghi nhớ
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Right: User Info and Buttons */}
      <div className="hidden sm:flex items-center flex-shrink-0 ml-4 space-x-4">
        {isLoggedIn && (
          <>
            {/* Reset button */}
            <button
              className="bg-gray-400 text-white h-9 px-5 rounded-md hover:bg-gray-500 text-sm font-medium transition duration-150 ease-in-out shadow-sm whitespace-nowrap"
              onClick={() => {
                resetUserData();
                localStorage.setItem('userBalance', '10000000'); // Reset balance to 10,000,000
                setUserBalance(10000000);
                window.dispatchEvent(new Event('storage'));
              }}
            >
              Reset dữ liệu
            </button>
          </>
        )}
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
          {isLoggedIn && (
            <>
              {/* Reset button for mobile */}
              <button
                className="w-full bg-gray-400 text-white h-9 px-5 rounded-md hover:bg-gray-500 text-sm font-medium transition duration-150 ease-in-out shadow-sm whitespace-nowrap mb-4"
                onClick={() => {
                  resetUserData();
                  localStorage.setItem('userBalance', '10000000');
                  setUserBalance(10000000);
                  window.dispatchEvent(new Event('storage'));
                  handleNavClick(); // Close menu after action
                }}
              >
                Reset dữ liệu
              </button>
            </>
          )}
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