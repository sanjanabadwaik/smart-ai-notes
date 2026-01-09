import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import React from "react";

const MobileNav = ({ items = [] }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
        Menu
      </button>

      {open && (
        <div className="mt-4 grid gap-2 rounded-3xl border border-white/10 bg-slate-900/80 p-4">
          {items.map((item) => (
            <NavLink
              key={item.id}
              to={item.id === "dashboard" ? "/dashboard" : `/${item.id}`}
              className={({ isActive }) =>
                [
                  "rounded-2xl px-4 py-3 text-sm font-semibold",
                  isActive ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/5",
                ].join(" ")
              }
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileNav;
