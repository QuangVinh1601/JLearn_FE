import React from "react";
import { NavLink } from "react-router-dom";
import { FaUser, FaGraduationCap, FaLayerGroup, FaPlay, FaCog, FaChartLine } from "react-icons/fa";

const ProfileSidebar: React.FC = () => {
  const menuItems = [
    {
      path: "/profile",
      label: "Tổng quan",
      icon: <FaUser className="text-lg" />,
      end: true
    },
    {
      path: "/profile/courses",
      label: "Khóa học của tôi",
      icon: <FaGraduationCap className="text-lg" />,
      end: false
    },
    {
      path: "/profile/flashcards",
      label: "Bộ flashcard",
      icon: <FaLayerGroup className="text-lg" />,
      end: false
    },
    {
      path: "/profile/videos",
      label: "Video học tập",
      icon: <FaPlay className="text-lg" />,
      end: false
    },
    {
      path: "/profile/progress",
      label: "Tiến độ học tập",
      icon: <FaChartLine className="text-lg" />,
      end: false
    },
    {
      path: "/profile/settings",
      label: "Cài đặt",
      icon: <FaCog className="text-lg" />,
      end: false
    }
  ];

  return (
    <div className="rounded-2xl shadow-lg p-6 sticky top-6" style={{ backgroundColor: 'White' }}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Hồ sơ của tôi</h2>
        <div className="w-12 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md transform scale-105"
                : "text-gray-700 hover:bg-red-50 hover:text-red-700"
              }`
            }
          >
            <span className={`transition-transform duration-200`}>
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 p-4 rounded-xl border" style={{ background: 'linear-gradient(135deg, White 0%, white 100%)', borderColor: '#D4B896' }}>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">💡 Mẹo học tập</h3>
        <p className="text-xs text-gray-600">
          Học đều đặn mỗi ngày 30 phút sẽ giúp bạn tiến bộ nhanh hơn!
        </p>
      </div>
    </div>
  );
};

export default ProfileSidebar;
