import { useState } from "react";
import { ChevronDown, ChevronRight, FileText, Video, ClipboardList, Presentation } from "lucide-react";
import SpotLearnButton from "./SpotLearnButton";

const iconMap = {
  "file-text": FileText,
  video: Video,
  clipboard: ClipboardList,
  presentation: Presentation,
};

const typeColors = {
  pdf: "text-red-500",
  ppt: "text-orange-500",
  link: "text-blue-500",
  quiz: "text-green-600",
};

const typeBadge = {
  pdf: { label: "PDF", bg: "bg-red-50 text-red-600" },
  ppt: { label: "PPT", bg: "bg-orange-50 text-orange-600" },
};

export default function TopicSection({ topic, onOpenModal }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
      {/* Topic Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        {open ? (
          <ChevronDown size={18} className="text-blue-500 shrink-0" />
        ) : (
          <ChevronRight size={18} className="text-blue-500 shrink-0" />
        )}
        <h2 className="text-base font-bold text-gray-800">{topic.title}</h2>
      </button>

      {/* Items */}
      {open && (
        <div className="border-t border-gray-50">
          {topic.items.map((item, idx) => {
            const Icon = iconMap[item.icon] || FileText;
            const colorClass = typeColors[item.type] || "text-gray-500";
            const badge = typeBadge[item.type];
            const isLecture = item.type === "pdf" || item.type === "ppt";

            return (
              <div
                key={idx}
                className="flex items-center justify-between px-5 py-3 hover:bg-blue-50/40 transition-colors group border-b border-gray-50 last:border-b-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon size={18} className={`${colorClass} shrink-0`} />
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate">
                    {item.label}
                  </a>
                  {badge && (
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${badge.bg}`}>
                      {badge.label}
                    </span>
                  )}
                </div>
                {isLecture && item.preview && (
                  <div className="ml-3 opacity-80 group-hover:opacity-100 transition-opacity">
                    <SpotLearnButton
                      label={item.label}
                      onClick={() => onOpenModal(item)}
                    />
         