import { Outlet } from "react-router-dom";
import ProfileSidebar from "./ProfileSidebar";

const MainLayout: React.FC = () => {
  return (
    <div className="flex h-full">
      <ProfileSidebar />
      <div className="flex-1 p-4 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
