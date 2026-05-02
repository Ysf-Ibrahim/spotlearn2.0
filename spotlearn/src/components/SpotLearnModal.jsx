import { useState } from "react";
import { X, Clock, Lightbulb, Target, BookOpen } from "lucide-react";
import { courseInfo } from "../data/courseData";
import RecordingScreen from "./RecordingScreen";

const CARD_ICONS = [Lightbulb, Target, BookOpen];

export default function SpotLearnModal({ lecture, onClose }) {
  const [action, setAction] = useState(null); // null | "record" | "previous"

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }
  function handleKeyDown(e) {
    if (e.key === "Escape") onClose();
  }

  const isRecording = action === "record";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={!isRecording ? handleBackdropClick : undefined}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
    >
      {/* Modal panel — wider + fixed-height in recording mode */}
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full flex flex-col transition-all duration-300
          ${isRecording
            ? "max-w-4xl h-[90vh]"
            : "max-w-2xl max-h-[90vh] overflow-y-auto"
          }`}
      >

        {/* ── Recording screen ── */}
        {isRecording ? (
          <RecordingScreen
            lecture={lecture}
            onClose={onClose}
            onBack={() => setAction(null)}
          />
        ) : (

          /* ── Overview screen ── */
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <img src="/spotix-logo.jpg" alt="Spotix" className="w-7 h-7 rounded-full object-cover" />
                <span className="font-bold text-gray-800 text-sm tracking-tight">SpotLearn</span>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X size={14} className="text-gray-600" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 pt-5 pb-6">

              {/* Course badge */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full">
                  {courseInfo.code} · {courseInfo.name}
                </span>
                <span className="text-xs text-gray-400">{courseInfo.semester}</span>
              </div>

              {/* Lecture title + time */}
              <div className="flex items-start justify-between gap-4 mb-1">
                <h2 className="text-xl font-bold text-gray-900 leading-tight">{lecture.label}</h2>
                <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0 mt-1">
                  <Clock size={12} />
                  <span>{lecture.preview.estimatedTime}</span>
                </div>
              </div>

              {/* Summary */}
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                {lecture.preview.summary}
              </p>

              {/* Overview cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {lecture.preview.cards.map((card, i) => {
                  const Icon = CARD_ICONS[i % CARD_ICONS.length];
                  return (
                    <div
                      key={i}
                      className="rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
                          <Icon size={13} className="text-gray-500" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          {card.title}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{card.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Previous recording placeholder */}
              {action === "previous" && (
                <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#eef1f6] border border-[#c8d0dd] text-sm text-[#2F3D56]">
                  <span className="text-lg">📂</span>
                  <span>Previous recording review will be added next.</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setAction("record")}
                  className="group flex flex-col items-center gap-1.5 px-4 py-5 rounded-xl bg-[#2F3D56] hover:bg-[#263347] text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🎙️</span>
                  <span className="font-bold text-sm">Start Recording</span>
                  <span className="text-xs opacity-80">Begin a new session</span>
                </button>

                <button
                  onClick={() => setAction("previous")}
                  className="group flex flex-col items-center gap-1.5 px-4 py-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">📂</span>
                  <span className="font-bold text-sm">Previous Recording</span>
                  <span className="text-xs text-gray-500">Review past sessions</span>
                </button>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}
