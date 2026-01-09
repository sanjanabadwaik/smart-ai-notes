import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, User, LogOut, Settings } from "lucide-react";
import MobileNav from "./MobileNav";
import { navItems } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { logout } = useAuth();

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error(err.message || "Logout failed");
    }
  };

  return (
    <header
      className="sticky top-0 z-50 mx-3 mt-3 flex items-center justify-between
                 rounded-2xl bg-white px-5 py-3 shadow-sm"
    >
      {/* Left */}
      <div className="flex items-center gap-2 text-sm text-gray-600"> 
        <span className="hidden sm:block">
          AI status: All systems stable
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <label className="relative hidden lg:block">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            placeholder="Search notes..."
            className="w-56 rounded-full border border-gray-200 bg-gray-50 px-10 py-2 text-sm
                       text-black placeholder:text-gray-400
                       focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </label>

        {/* Profile menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            className="rounded-full bg-gray-100 p-2 hover:bg-gray-200"
          >
            <User size={18} className="text-gray-700" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white p-2 shadow-lg">
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm
                           text-gray-800 hover:bg-gray-100"
              >
                <User size={16} /> Profile
              </Link>

              <Link
                to="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm
                           text-gray-800 hover:bg-gray-100"
              >
                <Settings size={16} /> Settings
              </Link>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm
                           text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>

        {/* CTA */}
        <Link
          to="/upload"
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold
                     text-white hover:bg-indigo-500"
        >
          New Upload
        </Link>

        {/* Mobile menu */}
        <MobileNav items={navItems} />
      </div>
    </header>
  );
};

export default Navbar;
