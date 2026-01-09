import React from "react";
import { 
  GraduationCap,
  LayoutGrid as Grid,
  Upload as UploadIcon,
  Presentation as Slides,
  MessageSquare as Qa,
  Users as Community,
  Folder as FolderIcon,
  Settings as SettingsIcon
} from "lucide-react";
import { NavLink } from "react-router-dom";

const iconComponents = {
  grid: Grid,
  upload: UploadIcon,
  slides: Slides,
  qa: Qa,
  community: Community,
  folder: FolderIcon,
  settings: SettingsIcon,
};

const resolvePath = (id) => {
  if (id === "dashboard") return "/dashboard";
  if (id === "my-notes") return "/my-notes";
  return `/${id}`;
};

const Sidebar = ({ items = [] }) => {
  return (
    <aside
      className="hidden h-full w-72 flex-col
                bg-white p-6 shadow-lg lg:flex"
    >
      {/* Brand */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-100">
          <GraduationCap className="text-indigo-600" size={22} />
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">
            Smart Genius
          </p>
          <h2 className="text-lg font-semibold text-gray-900">
            Lecture Lab
          </h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={resolvePath(item.id)}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-2xl px-4 py-3
               text-sm font-medium transition
               ${
                 isActive
                   ? "bg-indigo-50 text-indigo-700"
                   : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
               }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-indigo-600" />
                )}

                {/* Icon */}
                <span
                  className={`flex size-10 items-center justify-center rounded-xl transition
                    ${
                      isActive
                        ? "text-indigo-600"
                        : "text-gray-500 group-hover:text-gray-900"
                    }`}
                >
                  {React.createElement(iconComponents[item.icon] || Grid, { size: 18 })}
                </span>

                {/* Label */}
                <span className="truncate">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
