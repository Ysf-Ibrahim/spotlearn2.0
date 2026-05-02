import { useState } from "react";

const tabs = ["Course", "Grades", "Competencies"];

export default function CourseTabs() {
  const [active, setActive] = useState("Course");
  return (
    <div className="bg-[#3b82f6] px-4">
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors rounded-t-md ${
              active === tab
                ? "bg-white text-blue-600"
                : "text-white hover:bg-blue-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
