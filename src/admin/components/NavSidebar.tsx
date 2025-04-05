import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";

const NavSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // import từ AuthContext

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md h-screen fixed">
        <nav className="mt-10">
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              `block py-2 px-4 text-gray-700 hover:bg-gray-100 ${isActive ? "bg-gray-200" : ""}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin-account"
            className={({ isActive }) =>
              `block py-2 px-4 text-gray-700 hover:bg-gray-100 ${isActive ? "bg-gray-200" : ""}`
            }
          >
            Quản lý tài khoản
          </NavLink>
          <NavLink
            to="/admin-lessons"
            className={({ isActive }) =>
              `block py-2 px-4 text-gray-700 hover:bg-gray-100 ${isActive ? "bg-gray-200" : ""}`
            }
          >
            Quản lý bài học
          </NavLink>
          <NavLink
            to="/admin-messages"
            className={({ isActive }) =>
              `block py-2 px-4 text-gray-700 hover:bg-gray-100 ${isActive ? "bg-gray-200" : ""}`
            }
          >
            Tin nhắn
          </NavLink>
          <NavLink
            to="/admin-notifications"
            className={({ isActive }) =>
              `block py-2 px-4 text-gray-700 hover:bg-gray-100 ${isActive ? "bg-gray-200" : ""}`
            }
          >
            Thông báo
          </NavLink>
          <NavLink
            to="/admin-settings"
            className={({ isActive }) =>
              `block py-2 px-4 text-gray-700 hover:bg-gray-100 ${isActive ? "bg-gray-200" : ""}`
            }
          >
            Cài đặt
          </NavLink>
          <button
            onClick={() => {
              logout();
              navigate("/home");
            }}
            className="block w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-100"
          >
            Đăng xuất
          </button>
        </nav>
      </aside>

      {/* Nội dung */}
      <main className="ml-64 flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default NavSidebar;
