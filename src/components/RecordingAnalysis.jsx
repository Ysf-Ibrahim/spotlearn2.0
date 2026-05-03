import { useState, useRef } from "react";
import {
  ArrowLeft, X, BookMarked, Flag, Layers, Mic,
  ChevronDown, ChevronUp, ArrowRight, CheckCircle,
  BookOpen, Zap, Eye,
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

// ── Static data ───────────────────────────────────────────────────────────────
const SLIDE_COVERAGE = [
  { slide: 4, color: "blue",    title: "Embedded System Characteristics",  points: ["Single-functioned", "Reactive and real-time", "Tightly constrained", "Safety-critical", "Interacts with sensors and actuators"] },
  { slide: 5, color: "indigo",  title: "Design Challenges",                points: ["Low cost", "Low power", "Reliability", "Security", "Real-time processing"] },
  { slide: 6, color: "violet",  title: "Microcontroller Basics",           points: ["Computer-on-a-chip", "CPU + memory + I/O", "Timers and counters", "Interrupt control", "ADC support"] },
  { slide: 7, color: "purple",  title: "Microcontroller vs. Microprocessor",points: ["MCU = integrated control system", "MPU = CPU-focused processing system", "MCU has memory and I/O built in", "MPU needs more external components"] },
  { slide: 8, color: "fuchsia", title: "Design Example",                   points: ["MPU-based system has many external blocks", "MCU-based system integrates many internal blocks", "MCU design is more compact", "Better for embedded control"] },
];
const COL = {
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
const TRANSCRIPT = [
  { ts: "00:00", text: "Now we are looking at the main characteristics of embedded systems." },
  { ts: "00:12", text: "The first characteristic is single-functioned." },
  { ts: "00:28", text: "The second idea is complex functionality." },
  { ts: "00:45", text: "Embedded systems are also tightly constrained." },
  { ts: "01:03", text: "Another important characteristic is reactive and real-time behavior." },
  { ts: "01:22", text: "Some embedded systems are safety-critical." },
  { ts: "01:42", text: "Now this slide summarizes the main design challenges." },
  { ts: "01:57", text: "The system may need to be low cost and low power." },
  { ts: "02:14", text: "Reliability is also very important." },
  { ts: "02:31", text: "Real-time processing is another challenge." },
  { ts: "02:48", text: "Security is also becoming more important." },
  { ts: "03:07", text: "Now we move to the microcontroller — a computer on a chip." },
  { ts: "03:22", text: "Inside a microcontroller: processor core, memory, I/O ports, timers." },
  { ts: "03:40", text: "This integration is why microcontrollers are useful in embedded systems." },
  { ts: "03:56", text: "A microcontroller usually performs a simple or dedicated task." },
  { ts: "04:12", text: "A microcontroller: processing, memory, and I/O on one chip." },
  { ts: "04:30", text: "Let us focus on this comparison between microcontroller and microprocessor." },
  { ts: "04:42", text: "A microprocessor is general-purpose, designed for processing different tasks." },
  { ts: "04:57", text: "The microprocessor has many instruction types and modes." },
  { ts: "05:14", text: "Key point: the hardware of a microprocessor mainly includes the CPU only." },
  { ts: "05:32", text: "Building a microprocessor system needs external memory and I/O." },
  { ts: "05:50", text: "The microcontroller is usually single-purpose, mainly used for control." },
  { ts: "06:05", text: "Most important: integration — CPU, RAM, ROM, I/O, timer on one chip." },
  { ts: "06:20", text: "Microcontroller-based system is smaller, cheaper, simpler." },
  { ts: "06:36", text: "Microcontrollers often do not need a full operating system." },
  { ts: "06:52", text: "Microprocessor = CPU for processing. Microcontroller = control computer on one chip." },
  { ts: "07:09", text: "Key pairs: general vs. single, processing vs. control, external vs. integrated." },
  { ts: "07:28", text: "Next slide shows the same idea using a time and temperature system example." },
  { ts: "07:42", text: "Design example: MPU-based vs MCU-based time and temperature system." },
  { ts: "07:56", text: "MPU system: microprocessor is one block, other components placed separately." },
  { ts: "08:12", text: "Temperature sensor, ADC, timer, flash, RAM — all separate external components." },
  { ts: "08:28", text: "Output devices: fan, heater, LCD — also separate." },
  { ts: "08:43", text: "This is why a microprocessor system can become more complex." },
  { ts: "09:00", text: "MCU system: microcontroller already contains several important blocks inside it." },
  { ts: "09:15", text: "Inside the MCU: CPU, flash, RAM, timer, ADC — integrated inside the chip." },
  { ts: "09:32", text: "External devices: mainly real-world peripherals like sensor, heater, fan, LCD." },
  { ts: "09:47", text: "MCU-based system is more compact with reduced external wiring." },
  { ts: "10:02", text: "Visual difference: MPU has blocks outside the CPU, MCU has them inside." },
  { ts: "10:20", text: "Microcontrollers are preferred for embedded control applications." },
  { ts: "10:54", text: "Final takeaway: microprocessor gives flexibility, microcontroller is better for compact control." },
];

// ── Shared sub-component ──────────────────────────────────────────────────────
function SectionHeading({ icon: Icon, title, sub }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={14} className="text-[#2F3D56] shrink-0" />
      <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
      {sub && <span className="text-[10px] text-gray-400 font-medium">{sub}</span>}
    </div>
  );
}

// ── SLIDE 7 VISUAL EXPLANATION ────────────────────────────────────────────────
function Slide7Explanation() {
  return (
    <div className="space-y-4 pt-1">

      {/* Learning style badge */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-100">
        <span className="text-base shrink-0">👁️</span>
        <p className="text-[10px] text-indigo-700 font-semibold leading-snug">
          Recommended for your learning style: <span className="font-bold">Visual explanation mode</span>
        </p>
      </div>

      {/* Main idea strip */}
      <div className="rounded-xl bg-[#2F3D56] px-4 py-3">
        <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1">Main Idea</p>
        <p className="text-xs text-white font-semibold leading-relaxed">
          A microprocessor is mainly the CPU only, while a microcontroller is a small complete control system on one chip.
        </p>
      </div>

      {/* ── 1. Quick Visual Comparison ───── */}
      <div>
        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">1 — Quick Visual Comparison</p>
        <div className="grid grid-cols-2 gap-3">
          {/* MPU card */}
          <div className="rounded-2xl border-2 border-orange-200 bg-gradient-to-b from-orange-50 to-white p-3.5">
            <div className="rounded-lg bg-orange-500 text-white text-[10px] font-bold px-2 py-1.5 text-center mb-3 shadow-sm">
              Microprocessor
            </div>
            <ul className="space-y-1.5">
              {[
                { t: "General-purpose",      hi: false },
                { t: "Mainly for processing",hi: false },
                { t: "CPU only",             hi: true  },
                { t: "RAM — external",        hi: false },
                { t: "ROM — external",        hi: false },
                { t: "I/O — external",        hi: false },
                { t: "Timer — external",      hi: false },
                { t: "More flexible",         hi: false },
                { t: "More hardware needed",  hi: false },
              ].map(({ t, hi }, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className={`text-[8px] shrink-0 mt-0.5 ${hi ? "text-orange-500 font-bold" : "text-orange-300"}`}>◆</span>
                  <span className={`text-[9px] leading-snug ${hi ? "font-bold text-orange-700" : "text-gray-600"}`}>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* MCU card */}
          <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-b from-blue-50 to-white p-3.5">
            <div className="rounded-lg bg-[#2F3D56] text-white text-[10px] font-bold px-2 py-1.5 text-center mb-3 shadow-sm">
              Microcontroller
            </div>
            <ul className="space-y-1.5">
              {[
                { t: "Single-purpose",       hi: false },
                { t: "Mainly for control",   hi: false },
                { t: "CPU + peripherals",    hi: true  },
                { t: "RAM — built in",        hi: true  },
                { t: "ROM — built in",        hi: true  },
                { t: "I/O — built in",        hi: true  },
                { t: "Timer — built in",      hi: true  },
                { t: "More compact",          hi: false },
                { t: "Better for embedded",   hi: false },
              ].map(({ t, hi }, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className={`text-[8px] shrink-0 mt-0.5 ${hi ? "text-blue-500 font-bold" : "text-blue-300"}`}>◆</span>
                  <span className={`text-[9px] leading-snug ${hi ? "font-bold text-blue-700" : "text-gray-600"}`}>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Key difference chip */}
        <div className="flex justify-center mt-2.5">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm">
            <span className="text-[10px] font-bold text-orange-500">External components</span>
            <ArrowRight size={11} className="text-gray-400 shrink-0" />
            <span className="text-[10px] font-bold text-blue-600">Integrated components</span>
          </div>
        </div>
      </div>

      {/* ── 2. Why This Matters ───── */}
      <div>
        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">2 — Why This Matters</p>
        <div className="space-y-2">
          {[
            { emoji: "🧠", title: "Microprocessor = Processing Brain",
              body: "A microprocessor is powerful, but it needs support chips around it to become a full working system.",
              cls: "border-orange-100 bg-orange-50/60" },
            { emoji: "🎛️", title: "Microcontroller = Complete Control Unit",
              body: "A microcontroller already includes many essential parts, so it can directly control embedded applications.",
              cls: "border-blue-100 bg-blue-50/60" },
            { emoji: "✅", title: "Best Use Case",
              body: "Use microcontrollers for compact embedded systems. Use microprocessors for general-purpose and expandable systems.",
              cls: "border-gray-100 bg-gray-50" },
          ].map((c, i) => (
            <div key={i} className={`flex items-start gap-3 rounded-xl border p-3 ${c.cls}`}>
              <span className="text-xl shrink-0">{c.emoji}</span>
              <div>
                <p className="text-[10px] font-bold text-gray-800 mb-0.5">{c.title}</p>
                <p className="text-[10px] text-gray-600 leading-relaxed">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. Visual Memory Aid ───── */}
      <div>
        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">3 — Easy Way to Remember</p>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/30 p-3.5 text-center">
            <div className="text-3xl mb-1.5">🧠</div>
            <p className="text-[10px] font-bold text-orange-700 mb-1">Microprocessor</p>
            <p className="text-[10px] text-gray-600 italic mb-2">"Just the brain"</p>
            <div className="rounded-lg bg-orange-100 border border-orange-200 px-2 py-2">
              <p className="text-[9px] font-bold text-orange-700">CPU alone</p>
              <p className="text-[9px] text-orange-600 mt-0.5">Needs external support</p>
            </div>
          </div>
          <div className="rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/30 p-3.5 text-center">
            <div className="text-3xl mb-1.5">🤖</div>
            <p className="text-[10px] font-bold text-blue-700 mb-1">Microcontroller</p>
            <p className="text-[10px] text-gray-600 italic mb-2">"Brain + memory + tools in one"</p>
            <div className="rounded-lg bg-blue-100 border border-blue-200 px-2 py-2">
              <div className="flex flex-wrap gap-1 justify-center">
                {["CPU", "RAM", "ROM", "I/O", "Timer"].map((b) => (
                  <span key={b} className="text-[8px] font-bold bg-[#2F3D56] text-white px-1.5 py-0.5 rounded-md">{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Step-by-Step Flow ───── */}
      <div>
        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">4 — Step-by-Step Understanding</p>
        <div className="relative space-y-0">
          {[
            { n: 1, text: "Microprocessor starts as CPU only.",              accent: "bg-orange-400" },
            { n: 2, text: "To build a complete system, you must add RAM, ROM, I/O, timers, and more — externally.", accent: "bg-orange-400" },
            { n: 3, text: "This increases wiring, board size, design complexity, and cost.",    accent: "bg-red-400"    },
            { n: 4, text: "Microcontroller already includes many of these blocks inside one chip.", accent: "bg-blue-500"   },
            { n: 5, text: "Result: smaller, cheaper, and easier to build for embedded control.", accent: "bg-emerald-500" },
          ].map((step, idx, arr) => (
            <div key={step.n} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold text-white ${step.accent}`}>
                  {step.n}
                </div>
                {idx < arr.length - 1 && <div className="w-0.5 h-4 bg-gray-200 my-0.5" />}
              </div>
              <p className="text-[10px] text-gray-700 leading-relaxed pt-0.5 pb-2">{step.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. Key Takeaway ───── */}
      <div className="rounded-xl border-2 border-[#2F3D56] bg-[#2F3D56]/5 p-4">
        <p className="text-[9px] font-bold uppercase tracking-widest text-[#2F3D56] mb-2.5">⚡ Key Takeaway</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-orange-50 border border-orange-200 px-3 py-2.5">
            <p className="text-[10px] font-bold text-orange-700 mb-1">Microprocessor</p>
            <p className="text-[9px] text-orange-600 leading-relaxed">More external hardware, more flexibility</p>
          </div>
          <div className="rounded-xl bg-blue-50 border border-blue-200 px-3 py-2.5">
            <p className="text-[10px] font-bold text-blue-700 mb-1">Microcontroller</p>
            <p className="text-[9px] text-blue-600 leading-relaxed">More integration, better for embedded control</p>
          </div>
        </div>
      </div>

      {/* ── 6. Exam-Ready Comparison ───── */}
      <div>
        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">6 — Exam-Ready Comparison</p>
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-3">
            {/* Header */}
            <div className="bg-gray-50 border-b border-r border-gray-200 px-2.5 py-2 text-[9px] font-bold text-gray-500">Feature</div>
            <div className="bg-orange-50 border-b border-r border-gray-200 px-2.5 py-2 text-[9px] font-bold text-orange-700 text-center">Microprocessor</div>
            <div className="bg-blue-50 border-b border-gray-200 px-2.5 py-2 text-[9px] font-bold text-blue-700 text-center">Microcontroller</div>
            {/* Rows */}
            {[
              ["Purpose",          "General-purpose",           "Single-purpose"         ],
              ["Focus",            "Mainly processing",         "Mainly control"          ],
              ["Structure",        "CPU only",                  "CPU + peripherals"       ],
              ["Memory",           "External",                  "Built-in"                ],
              ["I/O",              "External",                  "Built-in"                ],
              ["Complexity",       "Higher",                    "Lower"                   ],
              ["Embedded fit",     "Less suitable",             "Highly suitable"         ],
            ].flatMap(([feat, mpu, mcu], i) => [
              <div key={`f${i}`} className={`border-b border-r border-gray-100 px-2.5 py-2 text-[9px] font-semibold text-gray-700 ${i%2===0?"bg-white":"bg-gray-50/50"}`}>{feat}</div>,
              <div key={`m${i}`} className={`border-b border-r border-gray-100 px-2.5 py-2 text-[9px] text-orange-600 text-center ${i%2===0?"bg-white":"bg-orange-50/30"}`}>{mpu}</div>,
              <div key={`c${i}`} className={`border-b border-gray-100 px-2.5 py-2 text-[9px] text-blue-600 text-center ${i%2===0?"bg-white":"bg-blue-50/30"}`}>{mcu}</div>,
            ])}
          </div>
        </div>
      </div>

    </div>
  );
}

// ── SLIDE 8 VISUAL EXPLANATION ────────────────────────────────────────────────
function Slide8Explanation() {
  return (
    <div className="space-y-4 pt-1">

      {/* Learning style badge */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-100">
        <span className="text-base shrink-0">👁️</span>
        <p className="text-[10px] text-indigo-700 font-semibold leading-snug">
          Recommended for your learning style: <span className="font-bold">Visual explanation mode</span>
        </p>
      </div>

      {/* Main idea strip */}
      <div className="rounded-xl bg-[#2F3D56] px-4 py-3">
        <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1">Main Idea</p>
        <p className="text-xs text-white font-semibold leading-relaxed">
          The MPU-based design needs many separate external blocks, while the MCU-based design integrates many functions inside the controller.
        </p>
      </div>

      {/* ── 1. Hero System Diagram ───── */}
      <div>
        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">1 — System Diagram Comparison</p>
        <div className="grid grid-cols-2 gap-3">

          {/* MPU side */}
          <div className="rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50/30 p-3">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[10px] font-bold text-orange-700">MPU-Based System</p>
              <span className="text-[8px] bg-orange-100 text-orange-600 font-bold px-1.5 py-0.5 rounded-full shrink-0">Many external</span>
            </div>
            {/* External support blocks */}
            <div className="grid grid-cols-3 gap-1 mb-1.5">
              {["Flash Mem", "RW Mem", "Timer"].map((b) => (
                <div key={b} className="rounded-lg bg-white border border-orange-200 py-1 text-center">
                  <p className="text-[7px] font-semibold text-orange-600">{b}</p>
                </div>
              ))}
            </div>
            {/* Arrows pointing to CPU */}
            <div className="flex justify-center mb-1">
              <div className="flex gap-4 text-orange-300 text-[10px]">↓ ↓ ↓</div>
            </div>
            {/* CPU block */}
            <div className="rounded-xl bg-orange-500 text-white px-2 py-2.5 text-center mb-1">
              <p className="text-[10px] font-bold">Microprocessor Unit</p>
              <p className="text-[8px] opacity-70">CPU only</p>
            </div>
            {/* Arrows */}
            <div className="flex justify-center mb-1">
              <div className="flex gap-4 text-orange-300 text-[10px]">↓ ↓ ↓</div>
            </div>
            {/* More external blocks */}
            <div className="grid grid-cols-3 gap-1 mb-2">
              {["ADC", "I/O Ports", "Temp Sensor"].map((b) => (
                <div key={b} className="rounded-lg bg-white border border-orange-200 py-1 text-center">
                  <p className="text-[7px] font-semibold text-orange-600">{b}</p>
                </div>
              ))}
            </div>
            {/* Peripherals */}
            <div className="border-t border-dashed border-orange-200 pt-2">
              <p className="text-[8px] text-orange-500 font-bold text-center mb-1">Output devices</p>
              <div className="grid grid-cols-3 gap-1">
                {["LCD", "Fan", "Heater"].map((b) => (
                  <div key={b} className="rounded-lg bg-orange-50 border border-orange-200 py-1 text-center">
                    <p className="text-[7px] text-orange-700">{b}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MCU side */}
          <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/20 p-3">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[10px] font-bold text-emerald-700">MCU-Based System</p>
              <span className="text-[8px] bg-emerald-100 text-emerald-600 font-bold px-1.5 py-0.5 rounded-full shrink-0">Integrated</span>
            </div>
            {/* MCU chip */}
            <div className="rounded-xl border-2 border-emerald-400 bg-white p-2.5 mb-2">
              <p className="text-[9px] font-bold text-emerald-700 text-center mb-2 uppercase tracking-wide">
                Microcontroller
              </p>
              <div className="grid grid-cols-3 gap-1">
                {["CPU", "Flash", "RW Mem", "Timer", "ADC", "I/O"].map((b) => (
                  <div key={b} className="rounded-md bg-emerald-50 border border-emerald-200 py-1 text-center">
                    <p className="text-[7px] font-bold text-emerald-700">{b}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Arrow */}
            <div className="flex justify-center mb-1.5">
              <div className="flex gap-3 text-emerald-400 text-[10px]">↓ ↓ ↓ ↓</div>
            </div>
            {/* Real-world peripherals only */}
            <div className="border-t border-dashed border-emerald-200 pt-2">
              <p className="text-[8px] text-emerald-600 font-bold text-center mb-1">Real-world peripherals only</p>
              <div className="grid grid-cols-2 gap-1">
                {["Temp Sensor", "Fan", "Heater", "LCD"].map((b) => (
                  <div key={b} className="rounded-lg bg-emerald-50 border border-emerald-200 py-1 text-center">
                    <p className="text-[7px] text-emerald-700">{b}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── 2. Visual Explanation Cards ───── */}
      <div>
        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">2 — What This Means</p>
        <div className="space-y-2">
          {[
            { emoji: "🟠", title: "MPU Design",
              body: "The processor alone is not enough. Many support blocks must be connected outside the chip, increasing complexity.",
              cls: "border-orange-100 bg-orange-50/60" },
            { emoji: "🟢", title: "MCU Design",
              body: "The controller already includes major functional blocks, so the final system has fewer external parts.",
              cls: "border-emerald-100 bg-emerald-50/60" },
            { emoji: "⚡", title: "Engineering Impact",
              body: "More integration means less wiring, lower cost, faster development, and easier embedded design.",
              cls: "border-blue-100 bg-blue-50/60" },
          ].map((c, i) => (
            <div key={i} className={`flex items-start gap-3 rounded-xl border p-3 ${c.cls}`}>
              <span className="text-xl shrink-0">{c.emoji}</span>
              <div>
                <p className="text-[10px] font-bold text-gray-800 mb-0.5">{c.title}</p>
                <p className="text-[10px] text-gray-600 leading-relaxed">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. Simplified Flow ───── */}
      <div>
        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">3 — Simplified Flow</p>
        <div className="space-y-2.5">
          {/* MPU flow */}
          <div className="rounded-xl bg-orange-50 border border-orange-100 px-3 py-2.5">
            <p className="text-[9px] font-bold text-orange-700 mb-2">MPU path (longer):</p>
            <div className="flex items-center gap-1 flex-wrap">
              {[
                { t: "CPU", chip: true },
                { t: "→ add RAM" },
                { t: "→ add ROM" },
                { t: "→ add Timer" },
                { t: "→ add ADC" },
                { t: "→ add I/O" },
                { t: "→ connect peripherals" },
                { t: "→ done", chip: true, end: true },
              ].map((s, i) => (
                <span key={i} className={`text-[8px] font-semibold ${
                  s.chip && !s.end ? "bg-orange-500 text-white px-1.5 py-0.5 rounded-md"
                  : s.end ? "bg-orange-700 text-white px-1.5 py-0.5 rounded-md"
                  : "text-orange-500"
                }`}>{s.t}</span>
              ))}
            </div>
          </div>
          {/* MCU flow */}
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2.5">
            <p className="text-[9px] font-bold text-emerald-700 mb-2">MCU path (shorter):</p>
            <div className="flex items-center gap-1 flex-wrap">
              {[
                { t: "MCU (built-in blocks)", chip: true },
                { t: "→ connect peripherals" },
                { t: "→ done", chip: true, end: true },
              ].map((s, i) => (
                <span key={i} className={`text-[8px] font-semibold ${
                  s.chip && !s.end ? "bg-emerald-500 text-white px-1.5 py-0.5 rounded-md"
                  : s.end ? "bg-emerald-700 text-white px-1.5 py-0.5 rounded-md"
                  : "text-emerald-500"
                }`}>{s.t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Insight box ───── */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-3">
        <p className="text-[9px] font-bold uppercase tracking-widest text-blue-600 mb-1.5">💡 Why This Slide Is Important</p>
        <p className="text-[10px] text-blue-800 leading-relaxed">
          This slide turns theory into a real system diagram. It shows visually why microcontrollers are more practical for compact embedded control applications — by comparing the two approaches side by side.
        </p>
      </div>

      {/* ── 5. Memory Aid ───── */}
      <div>
        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">5 — Easy Way to Remember</p>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/30 p-3.5 text-center">
            <div className="text-3xl mb-1.5">📦📦📦</div>
            <p className="text-[9px] font-bold text-orange-700 mb-0.5">MPU System</p>
            <p className="text-[9px] text-gray-600 leading-relaxed">Many boxes around the processor</p>
          </div>
          <div className="rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/30 p-3.5 text-center">
            <div className="text-3xl mb-1.5">📦</div>
            <p className="text-[9px] font-bold text-emerald-700 mb-0.5">MCU System</p>
            <p className="text-[9px] text-gray-600 leading-relaxed">Many boxes inside the controller</p>
          </div>
        </div>
      </div>

      {/* ── 6. Final Takeaway ───── */}
      <div className="rounded-xl border-2 border-[#2F3D56] bg-[#2F3D56]/5 p-4 text-center">
        <p className="text-[9px] font-bold uppercase tracking-widest text-[#2F3D56] mb-2">⚡ Final Takeaway</p>
        <p className="text-xs text-gray-800 font-semibold leading-relaxed">
          If many essential blocks are already inside the chip, the design becomes more compact, cheaper, and easier to build.
        </p>
      </div>

    </div>
  );
}

// ── FLAGGED FOCUS REVIEW SECTION ──────────────────────────────────────────────
function FlaggedFocusReview({ moments, expandedSlide, setExpandedSlide }) {
  const CARDS = [
    {
      num: 7,
      title: "Microcontroller vs. Microprocessor",
      accent: { card: "border-purple-200 bg-purple-50/30", badge: "bg-purple-100 text-purple-700", btn: "bg-purple-600 hover:bg-purple-700", icon: "text-purple-500" },
      Component: Slide7Explanation,
    },
    {
      num: 8,
      title: "MPU-Based vs MCU-Based Design",
      accent: { card: "border-fuchsia-200 bg-fuchsia-50/30", badge: "bg-fuchsia-100 text-fuchsia-700", btn: "bg-fuchsia-600 hover:bg-fuchsia-700", icon: "text-fuchsia-500" },
      Component: Slide8Explanation,
    },
  ];

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-2 mb-2">
        <Eye size={14} className="text-[#2F3D56] shrink-0" />
        <h3 className="font-bold text-gray-900 text-sm">Flagged Focus Review</h3>
        <span className="text-[9px] bg-[#2F3D56] text-white px-2 py-0.5 rounded-full font-bold">
          {moments.length > 0 ? `${moments.length} captured` : "Recommended"}
        </span>
      </div>

      {/* Intro message */}
      <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 px-4 py-3 mb-4">
        <div className="flex items-start gap-2.5">
          <span className="text-lg shrink-0">🎯</span>
          <p className="text-[10px] text-indigo-800 leading-relaxed">
            You flagged these concepts during the lecture. Since your learning style is{" "}
            <span className="font-bold text-indigo-900">visual</span>, SpotLearn reorganized them into visual explanations,
            comparisons, and simplified structures to make them easier to understand.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {CARDS.map(({ num, title, accent, Component }) => {
          const userFlagged  = moments.some((m) => m.slideNumber === num);
          const isOpen       = expandedSlide === num;

          return (
            <div key={num} className={`rounded-2xl border-2 overflow-hidden shadow-sm ${accent.card}`}>
              {/* Card header */}
              <div className="px-4 pt-4 pb-3">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${accent.badge}`}>
                        Slide {num}
                      </span>
                      {userFlagged ? (
                        <span className="text-[8px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded-full">
                          🚩 Flagged during recording
                        </span>
                      ) : (
                        <span className="text-[8px] bg-blue-50 text-blue-600 font-semibold px-1.5 py-0.5 rounded-full">
                          ✦ Recommended focus area
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-gray-900 leading-tight">{title}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Flagged from your recording</p>
                  </div>
                  <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-200`}>
                    ✦ Visual Review Ready
                  </span>
                </div>

                {/* Open/Hide button */}
                <button
                  onClick={() => setExpandedSlide(isOpen ? null : num)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm hover:shadow-md ${accent.btn}`}
                >
                  {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  {isOpen ? "Close Visual Explanation" : "Open Visual Explanation"}
                </button>
              </div>

              {/* Expanded visual explanation */}
              {isOpen && (
                <div className="border-t-2 border-white/60 bg-white/70 px-4 pb-4">
                  <div className="pt-1">
                    <div className="flex items-center justify-between mb-3 pt-3">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{title}</h4>
                        <p className="text-[10px] text-gray-500">Visual explanation generated from your flagged slide</p>
                      </div>
                    </div>
                    <Component />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function RecordingAnalysis({ rec, onBack, onClose, onBackToOverview }) {
  const [expandedSlide,  setExpandedSlide]  = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const flaggedRef = useRef(null);

  const moments       = rec.flaggedMoments ?? [];
  const snapshots     = moments.filter((m) => m.type === "snapshot").length;
  const audioCaptures = moments.filter((m) => m.type !== "snapshot").length;
  const flaggedNums   = [...new Set(moments.map((m) => m.slideNumber).filter(Boolean))];
  const topSlide      = flaggedNums[0] ?? null;

  function scrollToFlagged() {
    flaggedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="flex flex-col h-full min-h-0">

      {/* ── Top bar ─────────────────────────────────────────────────── */}
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

      {/* ── Scrollable body ──────────────────────────────────────────── */}
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
            <p>The most important part of the recording was the comparison between microcontrollers and microprocessors. A microprocessor is mainly a CPU designed for general-purpose processing and usually requires external RAM, ROM, I/O ports, and timers. A microcontroller integrates many of these components into one chip, making it smaller, cheaper, and more practical for embedded control systems.</p>
          </div>
        </div>

        {/* ── What We Covered ───────────────────────────────────────── */}
        <div>
          <SectionHeading icon={Layers} title="What We Covered" sub="Slides 4 – 8" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {SLIDE_COVERAGE.map((s) => {
              const col = COL[s.color];
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

            {/* Visual 1: System Flow */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-3">Embedded System Flow</p>
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
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-3">Microcontroller Internal Structure</p>
              <div className="rounded-xl border-2 border-[#2F3D56] bg-[#2F3D56]/5 p-3 mb-3">
                <p className="text-[10px] font-bold text-[#2F3D56] text-center mb-2.5 tracking-wide uppercase">Microcontroller Chip</p>
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

            {/* Visual 3: MPU vs MCU */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-3">MPU vs MCU Architecture</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="rounded-xl border border-red-100 bg-red-50/30 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold text-red-700">MPU-Based</p>
                    <span className="text-[8px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full font-bold">More external</span>
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
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold text-emerald-700">MCU-Based</p>
                    <span className="text-[8px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full font-bold">Integrated</span>
                  </div>
                  <div className="rounded-xl border-2 border-emerald-300 bg-white p-2">
                    <p className="text-[8px] font-bold text-emerald-700 text-center mb-1.5 uppercase tracking-wide">One Chip</p>
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
                The MPU approach is flexible but requires more external hardware. The MCU approach is compact and better for embedded control.
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

        {/* ── Flagged Focus Review ──────────────────────────────────── */}
        <div ref={flaggedRef}>
          <FlaggedFocusReview
            moments={moments}
            expandedSlide={expandedSlide}
            setExpandedSlide={setExpandedSlide}
          />
        </div>

        {/* ── What You Did During Recording ─────────────────────────── */}
        <div>
          <SectionHeading icon={Zap} title="What You Did During Recording" />
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-3">
              {[
                { label: "Duration",        value: formatDuration(rec.duration), sub: "Total session time"  },
                { label: "Slides Covered",  value: `${rec.firstSlide} → ${rec.lastSlide}`, sub: "5 slides total" },
                { label: "Flagged Moments", value: rec.flaggedCount, sub: "Captured for review"  },
                { label: "Snapshots",       value: snapshots,        sub: "Slide snapshots saved" },
                { label: "Audio Captures",  value: audioCaptures,    sub: "Last 30s / Last 1m"   },
                {
                  label: "Saved At",
                  value: rec.savedAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
                  sub:   rec.savedAt.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                },
              ].map((stat, i) => (
                <div key={i} className="rounded-xl bg-[#f8f9fb] border border-gray-100 px-3 py-2.5">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-sm font-bold text-gray-800 font-mono">{stat.value}</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">{stat.sub}</p>
                </div>
              ))}
            </div>
            {topSlide && (
              <div className="rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 flex items-center gap-2">
                <Flag size={11} className="text-amber-500 shrink-0" />
                <p className="text-[10px] text-amber-700">
                  <span className="font-bold">Most flagged area:</span> Slide {topSlide} — marked for review during the session.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Transcript toggle ─────────────────────────────────────── */}
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
