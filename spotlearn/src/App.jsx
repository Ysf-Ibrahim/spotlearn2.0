import { useState } from "react";
import Header from "./components/Header";
import CourseTabs from "./components/CourseTabs";
import Announcement from "./components/Announcement";
import TopicSection from "./components/TopicSection";
import SpotLearnModal from "./components/SpotLearnModal";
import { courseInfo, topics } from "./data/courseData";
import { GraduationCap } from "lucide-react";

export default function App() {
  const [selectedLecture, setSelectedLecture] = useState(null);

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Header />
      <CourseTabs />

      {/* Course Title Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap size={22} className="text-blue-600" />
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                {courseInfo.code} - {courseInfo.name}
              </h1>
              <p className="text-xs text-gray-500">{courseInfo.semester} | {courseInfo.instructor}</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-emerald-600 text-xs font-semibold">
            <img src="/spotix-icon.svg" alt="Spotix" className="w-4 h-4" />
            SpotLearn by Spotix
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Announcement />
        {topics.map((topic) => (
          <TopicSection
            key={topic.id}
            topic={topic}
            onOpenModal={setSelectedLecture}
          />
        ))}
      </main>

      {/* Footer */}
      <footer className="bg-[#2d3748] text-gray-400 py-5 text-xs mt-8">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <img src="/spotix-logo.jpg" alt="Spotix" className="w-6 h-6 rounded-full object-cover opacity-80" />
            <span className="text-white font-semibold text-sm">Spotix</span>
          </div>
          <span>SpotLearn Prototype | UI Only | No Backend</span>
        </div>
      </footer>

      {/* SpotLearn Modal */}
      {selectedLecture && (
        <SpotLearnModal
          lecture={selectedLecture}
          onClose={() => setSelectedLecture(null)}
        />
      )}
    </div>
  );
}
