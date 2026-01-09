const textAlignMap = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};
import React from "react";

const SectionTitle = ({ eyebrow, title, description, align = "left" }) => (
  <div className={`space-y-3 ${textAlignMap[align] || "text-left"}`}>
    {eyebrow && (
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
        {eyebrow}
      </p>
    )}
    <h2 className="text-3xl font-semibold text-black">{title}</h2>
    {description && <p className="text-base text-gray-600">{description}</p>}
  </div>
);

export default SectionTitle;
