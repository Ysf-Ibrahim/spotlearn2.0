import { Megaphone, RefreshCw } from "lucide-react";
import { announcement } from "../data/courseData";

export default function Announcement() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-5">
      <div className="flex items-start gap-3 mb-3">
        <Megaphone size={18} className="text-orange-500 mt-0.5 shrink-0" />
        <h3 className="text-sm font-semibold text-orange-600">{announcement.title}</h3>
      </div>
      <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line pl-7">
        {announcement.body}
      </div>
      <div className="mt-4 pl-7">
        <a href="#" className="inline-flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-700 transition-colors">
          <RefreshCw size={14} />
          Course Evaluation
        </a>
      </div>
    </div>
  );
}
