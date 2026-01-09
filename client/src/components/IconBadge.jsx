import iconMap from "../lib/iconMap";
import { Sparkles } from "lucide-react";
import React from "react";

const IconBadge = ({ icon = "spark", size = 20, className = "" }) => {
  const IconComponent = iconMap[icon] || Sparkles;

  return (
    <span
      className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-200 ${
        className || ""
      }`}
    >
      <IconComponent size={size} className="text-indigo-600" />
    </span>
  );
};

export default IconBadge;
