import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext"; // Giả sử đường dẫn này đúng
import logo from "../../assets/logo/logo.png"; // Giả sử đường dẫn này đúng
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDashboard,
  faUser,
  faClone,
  faVideo,
  faEnvelope,
  faBell,
  faAd,
  faGear,
  faSignOut,
  faBars,
} from "@fortawesome/free-solid-svg-icons";

const NavSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // State for sidebar toggle

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `block py-2.5 px-4 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md mx-2 my-1 transition-colors duration-150 ${
      isActive ? "bg-red-100 text-red-700 font-semibold" : "font-medium"
    }`;

  return (
    <>
      {/* Hamburger Menu for Mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-red-600 p-2 rounded-md hover:bg-red-100 transition-colors"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <FontAwesomeIcon icon={faBars} size="lg" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform ${
          // Nền sidebar đổi thành trắng để nổi bật hơn
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-40 border-r border-gray-200`}
      >
        <nav className="flex flex-col h-full p-2">
          <div className="flex justify-center items-center my-6">
            <img
              src={logo}
              alt="JLearn Logo"
              className="w-24 h-24 object-contain" // Kích thước có thể điều chỉnh
            />
          </div>
          <div className="flex-1 space-y-1">
            <NavLink
              to="/admin/dashboard"
              className={navLinkClasses}
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={faDashboard} className="mr-3 w-5" />{" "}
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/account"
              className={navLinkClasses}
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={faUser} className="mr-3 w-5" /> Quản lý tài
              khoản
            </NavLink>
            <NavLink
              to="/admin/flashcard"
              className={navLinkClasses}
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={faClone} className="mr-3 w-5" /> Quản lý
              flashcard
            </NavLink>
            <NavLink
              to="/admin/ads"
              className={navLinkClasses}
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={faAd} className="mr-3 w-5" /> Quản lý quảng
              cáo
            </NavLink>
            <NavLink
              to="/admin/video"
              className={navLinkClasses}
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={faVideo} className="mr-3 w-5" /> Quản lý
              video
            </NavLink>
            <NavLink
              to="/admin/messages"
              className={navLinkClasses}
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={faEnvelope} className="mr-3 w-5" /> Tin
              nhắn
            </NavLink>
            <NavLink
              to="/admin/notifications"
              className={navLinkClasses}
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={faBell} className="mr-3 w-5" /> Thông báo
            </NavLink>
            <NavLink
              to="/admin/settings"
              className={navLinkClasses}
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={faGear} className="mr-3 w-5" /> Cài đặt
            </NavLink>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/home");
              setIsOpen(false);
            }}
            className="block w-full text-left py-2.5 px-4 text-gray-700 hover:bg-red-100 hover:text-red-700 rounded-md mx-2 my-1 font-medium transition-colors duration-150"
          >
            <FontAwesomeIcon icon={faSignOut} className="mr-3 w-5" /> Đăng xuất
          </button>
        </nav>
      </aside>

      {/* Overlay for Mobile when Sidebar is Open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default NavSidebar;
