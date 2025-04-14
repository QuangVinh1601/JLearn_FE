import React from "react";
import { Outlet } from "react-router-dom";
import NavSidebar from "./NavSidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <NavSidebar />
      <div className="flex-grow md:ml-64 p-4 w-full bg-cover bg-center bg-no-repeat bg-[#f9f9f9]" >
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
