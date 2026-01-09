import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { navItems } from "../data/mockData";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar items={navItems} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
