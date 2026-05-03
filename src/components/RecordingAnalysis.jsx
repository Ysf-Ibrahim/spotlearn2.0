import { useState, useRef } from "react";
import {
  ArrowLeft, X, BookMarked, Flag, Layers, Mic,
  ChevronDown, ChevronUp, ArrowRight, CheckCircle,
  BookOpen, Zap, Cpu,
} from "lucide-react";

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

// ── Static analysis data ──────────────────────────────────────────────────────
const SLIDE_COVERAGE = [
  {
    slide: 4, color: "blue",
    title: "Embedded System Characteristics",
    points: ["Single-functioned", "Reactive and real-time", "Tightly constrained", "Safety-critical", "Interacts with sensors and actuators"],
  },
  {
    slide: 5, color: "indigo",
    title: "Design Challenges",
    points: ["Low cost", "Low power", "Reliability", "Security", "Real-time processing"],
  },
  {
    slide: 6, color: "violet",
    title: "Microcontroller Basics",
    points: ["Computer-on-a-chip", "CPU + memory + I/O", "Timers and counters", "Interrupt control", "ADC support"],
  },
  {
    slide: 7, color: "purple",
    title: "Microcontroller vs. Microprocessor",
    points: ["MCU = integrated control system", "MPU = CPU-focused processing system", "MCU has memory and I/O built in", "MPU needs more external components"],
  },
  {
    slide: 8, color: "fuchsia",
    title: "Design Example",
    points: ["MPU-based system has many external blocks", "MCU-based system integrates many internal blocks", "MCU design is more compact", "Better for embedded control"],
  },
];

const C = {
  blue:    { bg: "bg-blue-50",    border: "border-blue-200",    badge: "bg-blue-100 text-blue-700",      dot: "bg-blue-400"    },
  indigo:  { bg: "bg-indigo-50",  border: "border-indigo-200",  badge: "bg-indigo-100 text-indigo-700",  dot: "bg-indigo-400"  },
  violet:  { bg: "bg-violet-50",  border: "border-violet-200",  badge: "bg-violet-100 text-violet-700",  dot: "bg-violet-400"  },
  purple:  { bg: "bg-purple-50",  border: "border-purple-200",  badge: "bg-purple-100 text-purple-700",  dot: "bg-purple-400"  },
  fuchsia: { bg: "bg-fuchsia-50", border: "border-fuchsia-200", badge: "bg-fuchsia-100 text-fuchsia-700",dot: "bg-fuchsia-400" },
};

const TAKEAWAYS = [
  "Embedded systems are dedicated systems designed for specific real-world tasks.",
  "Real-time response is critical because many embedded systems must react immediately.",
  "Microcontrollers are ideal for embedded systems because they integrate CPU, memory, I/O, timers, and control features.",
  "Microprocessors are more general-purpose but usually require more external components.",
  "The MCU-based design is usually smaller, cheaper, and more suitable for compact control applications.",
];

const SLIDE_DETAIL = {
  7: {
    title: "Slide 7 — Detailed Explanation",
    sections: [
      { heading: null,
        body: "This slide compares the two main computing units discussed in embedded systems: the microprocessor and the microcontroller." },
      { heading: "Microprocessor",
        body: "A microprocessor is mainly a CPU. It is designed for general-purpose processing and usually needs external memory, external I/O ports, external timers, and other support circuits. This gives flexibility, but increases hardware size, wiring complexity, and cost." },
      { heading: "Microcontroller",
        body: "A microcontroller is more integrated. It contains the CPU, RAM, ROM/flash, I/O ports, timers, and control features on a single chip. Because of this integration it is more suitable for embedded systems where the goal is to control hardware directly using a compact and efficient design." },
      { heading: "Simple Memory Trick", isTip: true,
        body: "Microprocessor = processor only, needs support chips. Microcontroller = controller chip, many parts built in." },
    ],
    table: {
      headers: ["Feature", "Microprocessor", "Microcontroller"],
      rows: [
        ["Purpose",      "General-purpose",  "Single-purpose"],
        ["Focus",        "Mainly processing","Mainly control"],
        ["Memory & I/O", "External",         "Built-in"],
        ["Flexibility",  "More flexible",    "Less flexible"],
        ["System cost",  "Higher",           "Lower"],
      ],
    },
  },
  8: {
    title: "Slide 8 — Detailed Explanation",
    sections: [
      { heading: null,
        body: "This slide shows the difference visually using a time and temperature system." },
      { heading: "MPU-Based System",
        body: "The microprocessor is only one part of the design. Flash memory, RAM, timer, ADC, and I/O devices are all shown as separate external blocks. The designer must connect many external components to create a complete system." },
      { heading: "MCU-Based System",
        body: "Many of those blocks are already inside the microcontroller. The CPU, memory, timer, and ADC are integrated on one chip. External parts are mainly real-world devices such as the temperature sensor, fan, heater, and LCD." },
      { heading: "Simple Visual Meaning", isTip: true,
        body: "MPU system = many external blocks around the CPU. MCU system = many internal blocks inside one controller." },
    ],
    table: {
      headers: ["Component", "MPU System", "MCU System"],
      rows: [
        ["CPU",       "External chip",    "Inside MCU"],
        ["RAM",       "External module",  "Inside MCU"],
        ["Flash/ROM", "External module",  "Inside MCU"],
        ["Timer",     "External module",  "Inside MCU"],
        ["ADC",       "External module",  "Inside MCU"],
        ["I/O Ports", "External module",  "Inside MCU"],
      ],
    },
  },
};

const TRANSCRIPT = [
  { ts: "00:00", slide: 4, text: "Now we are looking at the main characteristics of embedded systems." },
  { ts: "00:12", slide: 4, text: "The first characteristic is single-functioned." },
  { ts: "00:28", slide: 4, text: "The second idea is complex functionality." },
  { ts: "00:45", slide: 4, text: "Embedded systems are also tightly constrained." },
  { ts: "01:03", slide: 4, text: "Another important characteristic is reactive and real-time behavior." },
  { ts: "01:22", slide: 4, text: "Some embedded systems are safety-critical." },
  { ts: "01:42", slide: 5, text: "Now this slide summarizes the main design challenges." },
  { ts: "01:57", slide: 5, text: "The system may need to be low cost and low power." },
  { ts: "02:14", slide: 5, text: "Reliability is also very important." },
  { ts: "02:31", slide: 5, text: "Real-time processing is another challenge." },
  { ts: "02:48", slide: 5, text: "Security is also becoming more important." },
  { ts: "03:07", slide: 6, text: "Now we move to the microcontroller — a computer on a chip." },
  { ts: "03:22", slide: 6, text: "Inside a microcontroller: processor core, memory, I/O ports, timers." },
  { ts: "03:40", slide: 6, text: "This integration is why microcontrollers are useful in embedded systems." },
  { ts: "03:56", slide: 6, text: "A microcontroller usually performs a simple or dedicated task." },
  { ts: "04:12", slide: 6, text: "A microcontroller is a compact control device — processing, memory, and I/O on one chip." },
  { ts: "04:30", slide: 7, text: "Let us focus on this comparison between microcontroller and microprocessor." },
  { ts: "04:42", slide: 7, text: "A microprocessor is general-purpose, designed for processing different tasks." },
  { ts: "04:57", slide: 7, text: "The microprocessor has many instruction types and modes." },
  { ts: "05:14", slide: 7, text: "Key point: the hardware of a microprocessor mainly includes the CPU only." },
  { ts: "05:32", slide: 7, text: "Building a microprocessor system needs external memory and I/O." },
  { ts: "05:50", slide: 7, text: "The microcontroller is usually single-purpose, mainly used for control." },
  { ts: "06:05", slide: 7, text: "Most important: integration — CPU, RAM, ROM, I/O, timer on one chip." },
  { ts: "06:20", slide: 7, text: "Microcontroller-based system is smaller, cheaper, simpler." },
  { ts: "06:36", slide: 7, text: "Microcontrollers often do not need a full operating system." },
  { ts: "06:52", slide: 7, text: "Microprocessor = CPU for general processing. Microcontroller = control computer on one chip." },
  { ts: "07:09", slide: 7, text: "Key pairs: general vs. single, processing vs. control, external vs. integrated." },
  { ts: "07:28", slide: 7, text: "Next slide shows the same idea using a time and temperature system example." },
  { ts: "07:42", slide: 8, text: "Design example: MPU-based vs MCU-based time and temperature system." },
  { ts: "07:56", slide: 8, text: "MPU system: microprocessor is one block, other components are placed separately." },
  { ts: "08:12", slide: 8, text: "Temperature sensor, ADC, timer, flash, RAM — all separate external components." },
  { ts: "08:28", slide: 8, text: "Output devices: fan, heater, LCD — also separate." },
  { ts: "08:43", slide: 8, text: "This is why a microprocessor system can become more complex." },
  { ts: "09:00", slide: 8, text: "MCU system: microcontroller already contains several important blocks inside it." },
  { ts: "09:15", slide: 8, text: "Inside the MCU: CPU, flash, RAM, timer, ADC — integrated inside the chip." },
  { ts: "09:32", slide: 8, text: "External devices: mainly real-world peripherals like sensor, heater, fan, LCD." },
  { ts: "09:47", slide: 8, text: "MCU-based system is more compact with reduced external wiring." },
  { ts: "10:02", slide: 8, text: "Visual difference: MPU has important blocks outside the CPU, MCU has them inside." },
  { ts: "10:20", slide: 8, text: "Microcontrollers are preferred for embedded control applications." },
  { ts: "10:37", slide: 8, text: "MPU-based design needs many external blocks, MCU-based integrates them." },
  { ts: "10:54", slide: 8, text: "Final takeaway: microprocessor gives flexibility, microcontroller is better for compact control." },
];

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({ icon: Icon, title, sub }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={14} className="text-[#2F3D56] shrink-0" />
      <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
      {sub && <span className="text-[10px] text-gray-400 font-medium">{sub}</span>}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function RecordingAnalysis({ rec, onBack, onClose, onBackToOverview }) {
  const [expandedSlide, setExpandedSlide] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const flaggedRef = useRef(null);

  const moments      = rec.flaggedMoments ?? [];
  const snapshots    = moments.filter((m) => m.type === "snapshot").length;
  const audioCaptures = moments.filter((m) => m.type !== "snapshot").length;
  const flaggedSlideNums = [...new Set(moments.map((m) => m.slideNumber).filter(Boolean))];
  const topFlaggedSlide  = flaggedSlideNums[0] ?? null;

  function scrollToFlagged() {
    flaggedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="flex flex-col h-full min-h-0">

      {/* ── Top bar ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={onBack}
            className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
            <ArrowLeft size={14} className="text-gray-500" />
          </button>
          <img src="/spotix-logo.jpg" alt="Spotix" className="w-6 h-6 rounded-full object-cover" />
          <span className="font-bold text-gray-800 text-sm tracking-tight">SpotLearn Analysis</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
            ✦ Analysis Ready
          </span>
          <button onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X size={14} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* ── Scrollable body ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 min-h-0">

        {/* ── Recording metadata banner ─────────────────────────────── */}
        <div className="rounded-2xl bg-gradient-to-br from-[#2F3D56] to-[#3d5080] p-5 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <BookMarked size={17} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-sm leading-tight">{rec.lectureLabel}</h2>
              <p className="text-white/55 text-[10px] mt-0.5">Saved {formatSavedDate(rec.savedAt)}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-white/10 px-3 py-2.5">
              <p className="text-white/50 text-[9px] font-bold uppercase tracking-wider mb-1">Coverage</p>
              <p className="text-white font-semibold text-xs">Slides {rec.firstSlide} → {rec.lastSlide}</p>
            </div>
            <div className="rounded-xl bg-white/10 px-3 py-2.5">
              <p className="text-white/50 text-[9px] font-bold uppercase tracking-wider mb-1">Duration</p>
              <p className="text-white font-semibold text-xs font-mono tabular-nums">{formatDuration(rec.duration)}</p>
            </div>
            <div className="rounded-xl bg-white/10 px-3 py-2.5">
              <p className="text-white/50 text-[9px] font-bold uppercase tracking-wider mb-1">Flagged</p>
              <p className="text-white font-semibold text-xs">
                {rec.flaggedCount} {rec.flaggedCount === 1 ? "moment" : "moments"}
              </p>
            </div>
          </div>
        </div>

        {/* ── Smart Lecture Summary ─────────────────────────────────── */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-[#2F3D56] flex items-center justify-center shrink-0">
              <span className="text-white text-[10px] font-bold">✦</span>
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Smart Lecture Summary</h3>
          </div>
          <p className="text-[10px] text-blue-500 font-semibold mb-3">
            Generated from your recording, transcript, and flagged moments.
          </p>
          <div className="space-y-2.5 text-[11px] text-gray-700 leading-relaxed">
            <p>In this recording, the lecture covered the key foundation of embedded system design from Slides 4 to 8. The session started by explaining the main characteristics of embedded systems, including single-function behavior, real-time response, tight constraints, and safety-critical operation. It then moved into the major design challenges engineers must balance, such as low cost, low power, reliability, portability, security, and fast response time.</p>
            <p>The lecture then introduced the microcontroller as a compact computer-on-a-chip. A microcontroller combines a processor core, memory, input/output ports, timers, counters, interrupt control, and sometimes analog-to-digital conversion inside one integrated circuit. This makes it highly suitable for embedded applications where the system must control hardware efficiently.</p>
            <p>The most important part of the recording was the comparison between microcontrollers and microprocessors. A microprocessor is mainly a CPU designed for general-purpose processing and usually requires external RAM, ROM, I/O ports, and timers. A microcontroller integrates many of these components into one chip, making it smaller, cheaper, and more practical for embedded control systems. The design example showed this visually by comparing an MPU-based system with many separate external blocks against an MCU-based system where many functions are already integrated inside the chip.</p>
          </div>
        </div>

        {/* ── What We Covered ───────────────────────────────────────── */}
        <div>
          <SectionHeading icon={Layers} title="What We Covered" sub="Slides 4 – 8" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {SLIDE_COVERAGE.map((s) => {
              const col = C[s.color];
              return (
                <div key={s.slide} className={`rounded-xl border ${col.border} ${col.bg} p-3.5`}>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${col.badge} inline-block mb-2`}>
                    Slide {s.slide}
                  </span>
                  <p className="text-xs font-semibold text-gray-800 mb-2 leading-tight">{s.title}</p>
                  <ul className="space-y-1">
                    {s.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[10px] text-gray-600">
                        <span className={`w-1.5 h-1.5 rounded-full ${col.dot} shrink-0 mt-1`} />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Visual Understanding ──────────────────────────────────── */}
        <div>
          <SectionHeading icon={BookOpen} title="Visual Understanding" />
          <div className="space-y-4">

            {/* Visual 1: Embedded System Flow */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                Embedded System Flow
              </p>
              <div className="flex items-center gap-1.5 justify-center flex-wrap mb-3">
                {[
                  { label: "Real-world Input", sub: "e.g. Temperature",   cls: "bg-sky-50   border-sky-200   text-sky-800"    },
                  null,
                  { label: "Sensor",           sub: "Reads signal",       cls: "bg-teal-50  border-teal-200  text-teal-800"   },
                  null,
                  { label: "MCU Decision",     sub: "Process & decide",   cls: "bg-[#2F3D56] border-[#2F3D56] text-white", dark: true },
                  null,
                  { label: "Output Device",    sub: "Fan / Heater / LCD", cls: "bg-orange-50 border-orange-200 text-orange-800" },
                ].map((item, i) =>
                  item === null ? (
                    <ArrowRight key={i} size={14} className="text-gray-400 shrink-0" />
                  ) : (
                    <div key={i} className={`rounded-xl border px-3 py-2 text-center min-w-[80px] ${item.cls}`}>
                      <p className="text-[10px] font-bold leading-tight">{item.label}</p>
                      <p className={`text-[9px] mt-0.5 ${item.dark ? "text-white/60" : "opacity-70"}`}>{item.sub}</p>
                    </div>
                  )
                )}
              </div>
              <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                An embedded system reads real-world inputs, processes them using a controller, and produces an action through output devices.
              </p>
            </div>

            {/* Visual 2: MCU Internal Structure */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                Microcontroller Internal Structure
              </p>
              <div className="rounded-xl border-2 border-[#2F3D56] bg-[#2F3D56]/5 p-3 mb-3">
                <p className="text-[10px] font-bold text-[#2F3D56] text-center mb-2.5 tracking-wide uppercase">
                  Microcontroller Chip
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {["CPU", "RAM", "ROM / Flash", "I/O Ports", "Timers", "Interrupts", "ADC", "Bus Control"].map((b) => (
                    <div key={b} className="rounded-lg bg-white border border-[#2F3D56]/20 px-1.5 py-2 text-center">
                      <p className="text-[9px] font-bold text-[#2F3D56] leading-tight">{b}</p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                The microcontroller is useful because many essential computer and control components are integrated into one chip.
              </p>
            </div>

            {/* Visual 3: MPU vs MCU Architecture */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                MPU vs MCU Architecture
              </p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {/* MPU column */}
                <div className="rounded-xl border border-red-100 bg-red-50/30 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold text-red-700">MPU-Based System</p>
                    <span className="text-[8px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full font-bold">
                      More external
                    </span>
                  </div>
                  <div className="rounded-lg bg-red-100 border border-red-200 px-2 py-2 text-center mb-2">
                    <p className="text-[9px] font-bold text-red-700">CPU only</p>
                  </div>
                  <div className="space-y-1">
                    {["External RAM", "External ROM", "External ADC", "External Timer", "External I/O"].map((item) => (
                      <div key={item} className="flex items-center gap-1.5 rounded bg-white border border-red-100 px-2 py-1">
                        <span className="w-1 h-1 rounded-full bg-red-300 shrink-0" />
                        <span className="text-[9px] text-red-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* MCU column */}
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold text-emerald-700">MCU-Based System</p>
                    <span className="text-[8px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full font-bold">
                      Integrated
                    </span>
                  </div>
                  <div className="rounded-xl border-2 border-emerald-300 bg-white p-2">
                    <p className="text-[8px] font-bold text-emerald-700 text-center mb-1.5 uppercase tracking-wide">
                      One Chip
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {["CPU", "RAM", "ROM / Flash", "ADC", "Timer", "I/O"].map((item) => (
                        <div key={item} className="rounded bg-emerald-50 border border-emerald-200 px-1.5 py-1 text-center">
                          <span className="text-[8px] font-semibold text-emerald-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                The MPU approach is flexible but requires more external hardware. The MCU approach is compact and better for embedded control applications.
              </p>
            </div>

          </div>
        </div>

        {/* ── Key Takeaways ─────────────────────────────────────────── */}
        <div>
          <SectionHeading icon={CheckCircle} title="Key Takeaways" />
          <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
            {TAKEAWAYS.map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#2F3D56] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-[9px] font-bold">{i + 1}</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Flagged Focus Areas ────────────────────────────────────── */}
        <div ref={flaggedRef}>
          <div className="flex items-center gap-2 mb-3">
            <Flag size={14} className="text-[#2F3D56] shrink-0" />
            <h3 className="font-bold text-gray-900 text-sm">Flagged Focus Areas</h3>
            {moments.length > 0 && (
              <span className="text-[9px] bg-[#2F3D56] text-white px-2 py-0.5 rounded-full font-bold">
                {moments.length} captured
              </span>
            )}
          </div>
          <div className="space-y-3">
            {[7, 8].map((num) => {
              const detail    = SLIDE_DETAIL[num];
              const isOpen    = expandedSlide === num;
              const userFlagged = moments.some((m) => m.slideNumber === num);
              const accent    = num === 7 ? { badge: "bg-purple-100 text-purple-700", icon: "bg-purple-50", iconClr: "text-purple-500" }
                                          : { badge: "bg-fuchsia-100 text-fuchsia-700", icon: "bg-fuchsia-50", iconClr: "text-fuchsia-500" };
              return (
                <div key={num} className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-2.5">
                      <div className={`w-9 h-9 rounded-xl ${accent.icon} flex items-center justify-center shrink-0`}>
                        <Cpu size={15} className={accent.iconClr} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${accent.badge}`}>
                            Slide {num}
                          </span>
                          {userFlagged && (
                            <span className="text-[8px] bg-amber-100 text-amber-600 font-bold px-1.5 py-0.5 rounded-full">
                              🚩 You flagged this
                            </span>
                          )}
                          {!userFlagged && (
                            <span className="text-[8px] bg-blue-50 text-blue-500 font-semibold px-1.5 py-0.5 rounded-full">
                              Recommended review
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-gray-800 leading-tight">
                          {num === 7 ? "Microcontroller vs. Microprocessor" : "MPU-Based vs MCU-Based Design"}
                        </p>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed mb-3">
                      {num === 7
                        ? "Important comparison concept. Review this to understand the difference between CPU-only processing and integrated control systems."
                        : "Important visual example. Review this to understand why microcontrollers reduce external hardware and make embedded systems more compact."}
                    </p>
                    <button
                      onClick={() => setExpandedSlide(isOpen ? null : num)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        isOpen
                          ? "bg-[#2F3D56] text-white border-[#2F3D56]"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-300"
                      }`}>
                      {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      {isOpen ? "Hide Explanation" : "View Detailed Explanation"}
                    </button>
                  </div>

                  {/* Expanded panel */}
                  {isOpen && (
                    <div className="border-t border-gray-100 bg-gray-50/60 px-4 py-4">
                      <h4 className="text-xs font-bold text-gray-800 mb-3">{detail.title}</h4>
                      <div className="space-y-3 mb-4">
                        {detail.sections.map((sec, i) => (
                          <div key={i} className={sec.isTip ? "rounded-xl bg-amber-50 border border-amber-100 px-3 py-2.5" : ""}>
                            {sec.heading && (
                              <p className={`text-[10px] font-bold mb-1 ${sec.isTip ? "text-amber-700" : "text-[#2F3D56]"}`}>
                                {sec.isTip ? "💡 " : ""}{sec.heading}
                              </p>
                            )}
                            <p className={`text-[10px] leading-relaxed ${sec.isTip ? "text-amber-700" : "text-gray-600"}`}>
                              {sec.body}
                            </p>
                          </div>
                        ))}
                      </div>
                      {/* Comparison table */}
                      <div className="rounded-xl border border-gray-200 overflow-hidden">
                        <div className="bg-[#2F3D56] px-3 py-1.5">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-white/80">
                            Exam-Style Comparison
                          </p>
                        </div>
                        <table className="w-full text-[10px]">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                              {detail.table.headers.map((h, i) => (
                                <th key={i} className="px-2.5 py-1.5 text-left font-bold text-gray-600 text-[9px]">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {detail.table.rows.map((row, i) => (
                              <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                                {row.map((cell, j) => (
                                  <td key={j} className={`px-2.5 py-1.5 ${j === 0 ? "font-semibold text-gray-700" : "text-gray-600"}`}>
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── What You Did During Recording ─────────────────────────── */}
        <div>
          <SectionHeading icon={Zap} title="What You Did During Recording" />
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-3">
              {[
                { label: "Duration",        value: formatDuration(rec.duration), sub: "Total session time" },
                { label: "Slides Covered",  value: `${rec.firstSlide} → ${rec.lastSlide}`, sub: "5 slides total" },
                { label: "Flagged Moments", value: rec.flaggedCount, sub: "Captured for review" },
                { label: "Snapshots",       value: snapshots,       sub: "Slide snapshots saved" },
                { label: "Audio Captures",  value: audioCaptures,   sub: "Last 30s / Last 1m" },
                { label: "Saved At",
                  value: rec.savedAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
                  sub:   rec.savedAt.toLocaleDateString("en-US", { month: "short", day: "numeric" }) },
              ].map((stat, i) => (
                <div key={i} className="rounded-xl bg-[#f8f9fb] border border-gray-100 px-3 py-2.5">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-sm font-bold text-gray-800 font-mono">{stat.value}</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">{stat.sub}</p>
                </div>
              ))}
            </div>
            {topFlaggedSlide && (
              <div className="rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 flex items-center gap-2">
                <Flag size={11} className="text-amber-500 shrink-0" />
                <p className="text-[10px] text-amber-700">
                  <span className="font-bold">Most flagged area:</span>{" "}
                  Slide {topFlaggedSlide} — marked for review during the session.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Transcript (collapsible) ───────────────────────────────── */}
        {showTranscript && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Mic size={14} className="text-[#2F3D56]" />
                <h3 className="font-bold text-gray-900 text-sm">Full Transcript</h3>
                <span className="text-[10px] text-gray-400">Slides 4 – 8</span>
              </div>
              <button onClick={() => setShowTranscript(false)}
                className="text-[10px] text-gray-400 hover:text-gray-600 font-semibold transition-colors">
                Hide ↑
              </button>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-3 max-h-60 overflow-y-auto space-y-0.5">
              {TRANSCRIPT.map((line, i) => (
                <div key={i} className="flex gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50">
                  <span className="font-mono text-[9px] text-gray-400 shrink-0 mt-0.5 tabular-nums">[{line.ts}]</span>
                  <span className="text-[10px] text-gray-600 leading-relaxed">{line.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Bottom action row ─────────────────────────────────────── */}
        <div className="rounded-xl border border-gray-100 bg-[#f8f9fb] p-4">
          <div className="grid grid-cols-2 gap-2">
            <button onClick={onBack}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors">
              <ArrowLeft size={12} /> Back to Recordings
            </button>
            <button onClick={() => setShowTranscript((v) => !v)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors">
              <Mic size={12} /> {showTranscript ? "Hide Transcript" : "Review Transcript"}
            </button>
            <button onClick={scrollToFlagged}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-purple-200 bg-purple-50 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition-colors">
              <Flag size={12} /> View Flagged Slides
            </button>
            <button onClick={onBackToOverview}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#2F3D56] hover:bg-[#263347] text-white text-xs font-semibold transition-colors shadow-sm">
              <ArrowLeft size={12} /> Return to Lecture List
            </button>
          </div>
        </div>

        <div className="h-2" />
      </div>
    </div>
  );
}
