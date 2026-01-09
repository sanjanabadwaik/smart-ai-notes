import { Moon, Sun } from "lucide-react";
import React from "react";

const DarkModeToggle = ({ enabled, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="group inline-flex items-center gap-2 rounded-full border border-indigo-300/30 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:border-indigo-400 hover:bg-white/10 hover:text-white"
    aria-pressed={enabled}
  >
    {enabled ? (
      <>
        <Sun size={18} className="text-amber-300 transition group-hover:rotate-6" />
        <span className="text-indigo-100">Light</span>
      </>
    ) : (
      <>
        <Moon size={18} className="text-indigo-300 transition group-hover:-rotate-6" />
        <span className="text-indigo-100">Dark</span>
      </>
    )}
  </button>
);

export default DarkModeToggle;
