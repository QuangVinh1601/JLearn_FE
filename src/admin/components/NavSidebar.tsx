import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import logo from "../../assets/logo/logo.png";
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

  return (
    <>
      {/* Hamburger Menu for Mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-gray-700"
        onClick={toggleSidebar}
      >
        <FontAwesomeIcon icon={faBars} size="lg" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-[#e5e7eb] shadow-xl transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        <nav className="flex flex-col h-full">
          <img
            src={logo}
            alt="JLearn Logo"
            className="w-28 h-28 mx-auto mt-4"
          />
          <div className="flex-1">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `block py-2 px-4 text-gray-700 hover:bg-gray-100 ${
                  isActive ? "bg-gray-300" : ""
                }`
              }
              onClick={() => setIsOpen(false)} // Close sidebar on link click
            >
              <FontAwesomeIcon icon={faDashboard} className="mr-2" /> Dashboard
            </NavLink>
            <NavLink
              to="/admin/account"
              className={({ isActive }) =>
                `block py-2 px-4 text-gray-700 hover:bg-gray-100 ${
                  isActive ? "bg-gray-300" : ""
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" /> Quản lý tài
              khoản
            </NavLink>
            <NavLink
              to="/admin/flashcard"
              className={({ isActive }) =>
                `block py-2 px-4 text-gray-700 hover:bg-gray-100 ${
                  isActive ? "bg-gray-300" : ""
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={faClone} className="mr-2" /> Quản lý
              flashcard
            </NavLink>
            <NavLink
              to="/admin/ads"
              className={({ isActive }) =>
                `block py-2 px-4 text-gray-700 hover:bg-gray-100 ${
                  isActive ? "bg-gray-300" : ""
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={faAd} className="mr-2" /> Quản lý quảng cáo
            </NavLink>
            <NavLink
              to="/admin/video"
              className={({ isActive }) =>
                `block py-2 px-4 text-gray-700 hover:bg-gray-100 ${
                  isActive ? "bg-gray-300" : ""
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={faVideo} className="mr-2" /> Quản lý video
            </NavLink>
            <NavLink
              to="/admin/messages"
              className={({ isActive }) =>
                `block py-2 px-4 text-gray-700 hover:bg-gray-100 ${
                  isActive ? "bg-gray-300" : ""
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" /> Tin nhắn
            </NavLink>
            <NavLink
              to="/admin/notifications"
              className={({ isActive }) =>
                `block py-2 px-4 text-gray-700 hover:bg-gray-100 ${
                  isActive ? "bg-gray-300" : ""
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={faBell} className="mr-2" /> Thông báo
            </NavLink>
            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                `block py-2 px-4 text-gray-700 hover:bg-gray-100 ${
                  isActive ? "bg-gray-300" : ""
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={faGear} className="mr-2" /> Cài đặt
            </NavLink>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/home");
              setIsOpen(false);
            }}
            className="block w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faSignOut} className="mr-2" /> Đăng xuất
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
