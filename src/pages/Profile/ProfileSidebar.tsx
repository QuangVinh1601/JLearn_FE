import React from "react";
import { NavLink } from "react-router-dom";

const ProfileSidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-100 text-gray-800 h-screen p-4">
      <ul className="space-y-2">
        <li>
          <NavLink
            to="/profileProfile"
            className={({ isActive }) =>
              `block p-2 rounded text-gray-800 ${isActive ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`
            }
          >
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/profileCourses"
            className={({ isActive }) =>
              `block p-2 rounded text-gray-800 ${isActive ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`
            }
          >
            Khoá học
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/profileVideos"
            className={({ isActive }) =>
              `block p-2 rounded text-gray-800 ${isActive ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`
            }
          >
            Xem video học
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default ProfileSidebar;
