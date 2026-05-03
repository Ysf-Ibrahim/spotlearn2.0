import { useState } from "react";
import { X, Clock, Lightbulb, Target, BookOpen, ArrowLeft, BookMarked, Flag, Layers, Sparkles } from "lucide-react";
import { courseInfo } from "../data/courseData";
import RecordingScreen from "./RecordingScreen";
import RecordingAnalysis from "./RecordingAnalysis";

const CARD_ICONS = [Lightbulb, Target, BookOpen];

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDuration(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return h > 0 ? `${h}:${m}:${sec}` : `${m}:${sec}`;
}
function formatSavedDate(d) {
  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  return `${date} at ${time}`;
}

// ── Saved recording card ──────────────────────────────────────────────────────
function RecordingCard({ rec, onOpenAnalysis }) {
  const isLec01 = rec.lectureLabel?.includes("Lecture 01");

  return (
    <div className="rounded-xl border border-gray-200 bg-white hover:border-blue-200 hover:shadow-sm transition-all overflow-hidden">
      {/* Accent bar */}
      <div className={`h-1 bg-gradient-to-r ${isLec01 ? "from-[#2F3D56] via-blue-400 to-purple-400" : "from-[#2F3D56] to-blue-400"}`} />

      <div className="p-4">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#2F3D56]/10 flex items-center justify-center shrink-0">
              <BookMarked size={14} className="text-[#2F3D56]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-800 truncate">{rec.lectureLabel}</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Saved {formatSavedDate(rec.savedAt)}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
              ✓ Saved
            </span>
            {isLec01 && (
              <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-500 border border-blue-100">
                ✦ Analysis Ready
              </span>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="rounded-lg bg-[#f8f9fb] border border-gray-100 px-3 py-2">
            <div className="flex items-center gap-1 mb-1">
              <Layers size={9} className="text-gray-400" />
              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Coverage</p>
            </div>
            <p className="text-xs font-semibold text-gray-700">
              Slide {rec.firstSlide} → {rec.lastSlide}
            </p>
          </div>
          <div className="rounded-lg bg-[#f8f9fb] border border-gray-100 px-3 py-2">
            <div className="flex items-center gap-1 mb-1">
              <Clock size={9} className="text-gray-400" />
              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Duration</p>
            </div>
            <p className="text-xs font-semibold text-gray-700 font-mono tabular-nums">
              {formatDuration(rec.duration)}
            </p>
          </div>
          <div className="rounded-lg bg-[#f8f9fb] border border-gray-100 px-3 py-2">
            <div className="flex items-center gap-1 mb-1">
              <Flag size={9} className="text-gray-400" />
              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Flagged</p>
            </div>
            <p className="text-xs font-semibold text-gray-700">
              {rec.flaggedCount} {rec.flaggedCount === 1 ? "moment" : "moments"}
            </p>
          </div>
        </div>

        {/* Open Analysis button — Lecture 01 only */}
        {isLec01 && (
          <button
            onClick={onOpenAnalysis}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2F3D56] hover:bg-[#263347] text-white text-xs font-semibold transition-all shadow-sm hover:shadow-md group"
          >
            <Sparkles size={12} className="group-hover:scale-110 transition-transform" />
            Open Analysis
          </button>
        )}
      </div>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export default function SpotLearnModal({ lecture, onClose }) {
  const [action,      setAction]      = useState(null); // null | "record" | "previous" | "analysis"
  const [recordings,  setRecordings]  = useState([]);
  const [selectedRec, setSelectedRec] = useState(null);

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }
  function handleKeyDown(e) {
    if (e.key === "Escape") onClose();
  }
  function handleSaveRecording(data) {
    setRecordings((prev) => [data, ...prev]);
    setAction("previous");
  }
  function openAnalysis(rec) {
    setSelectedRec(rec);
    setAction("analysis");
  }

  const isRecording = action === "record";
  const isAnalysis  = action === "analysis";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={!isRecording && !isAnalysis ? handleBackdropClick : undefined}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full flex flex-col transition-all duration-300 ${
          isRecording ? "max-w-4xl h-[90vh]"
          : isAnalysis ? "max-w-3xl h-[90vh]"
          : "max-w-2xl max-h-[90vh] overflow-y-auto"
        }`}
      >

        {/* ── Recording screen ──────────────────────────────────────── */}
        {isRecording ? (
          <RecordingScreen
            lecture={lecture}
            onClose={onClose}
            onBack={() => setAction(null)}
            onSave={handleSaveRecording}
          />

        ) : isAnalysis && selectedRec ? (
          /* ── Analysis screen ──────────────────────────────────────── */
          <RecordingAnalysis
            rec={selectedRec}
            onBack={() => setAction("previous")}
            onClose={onClose}
            onBackToOverview={() => setAction(null)}
          />

        ) : action === "previous" ? (
          /* ── Previous Recordings view ─────────────────────────────── */
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAction(null)}
                  className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                  aria-label="Back to overview"
                >
                  <ArrowLeft size={14} className="text-gray-500" />
                </button>
                <img src="/spotix-icon-mark.png" alt="Spotix" className="w-7 h-7 object-contain" />
                <span className="font-bold text-gray-800 text-sm tracking-tight">Previous Recordings</span>
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
            <div className="px-6 py-5">
              {/* Lecture context badge */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full">
                  {courseInfo.code} · {courseInfo.name}
                </span>
                <span className="text-xs font-semibold text-gray-600 truncate">{lecture.label}</span>
              </div>

              {recordings.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <BookMarked size={24} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500">No previous recordings yet.</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Start a new recording session to save your progress here.
                    </p>
                  </div>
                  <button
                    onClick={() => setAction("record")}
                    className="mt-2 px-5 py-2.5 rounded-xl bg-[#2F3D56] hover:bg-[#263347] text-white text-sm font-semibold transition-colors shadow-sm"
                  >
                    Start Recording
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-gray-500">
                      {recordings.length} recording{recordings.length > 1 ? "s" : ""} saved
                    </p>
                    <button
                      onClick={() => setAction("record")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2F3D56] hover:bg-[#263347] text-white text-xs font-semibold transition-colors"
                    >
                      + New Recording
                    </button>
                  </div>
                  <div className="space-y-3">
                    {recordings.map((rec) => (
                      <RecordingCard
                        key={rec.id}
                        rec={rec}
                        onOpenAnalysis={() => openAnalysis(rec)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </>

        ) : (
          /* ── Overview screen ──────────────────────────────────────── */
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <img src="/spotix-logo.png" alt="Spotix" className="h-9 object-contain" />
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
                    <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 hover:shadow-sm transition-all">
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
                  className="group flex flex-col items-center gap-1.5 px-4 py-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 relative"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">📂</span>
                  <span className="font-bold text-sm">Previous Recordings</span>
                  <span className="text-xs text-gray-500">Review past sessions</span>
                  {recordings.length > 0 && (
                    <span className="absolute top-3 right-3 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#2F3D56] text-white">
                      {recordings.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
                     