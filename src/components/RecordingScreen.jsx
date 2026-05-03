import { Component, useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  ChevronLeft, ChevronRight, X, ArrowLeft, Loader2,
  Mic, Volume2, Camera, Flag, StopCircle, AlertTriangle,
} from "lucide-react";

// ── pdf.js via CDN ────────────────────────────────────────────────────────────
const PDFJS_CDN  = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const WORKER_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

function loadPdfJs() {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) return resolve(window.pdfjsLib);
    const s = document.createElement("script");
    s.src = PDFJS_CDN;
    s.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_CDN;
      resolve(window.pdfjsLib);
    };
    s.onerror = () => reject(new Error("pdf.js CDN load failed"));
    document.head.appendChild(s);
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(totalSec) {
  const h = Math.floor(totalSec / 3600).toString().padStart(2, "0");
  const m = Math.floor((totalSec % 3600) / 60).toString().padStart(2, "0");
  const s = (totalSec % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}
function formatTs(totalSec) {
  const m = Math.floor(totalSec / 60).toString().padStart(2, "0");
  const s = (totalSec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
// "MM:SS" or "HH:MM:SS" → total seconds
function tsToSec(ts = "00:00") {
  const parts = ts.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

// ── Per-lecture simulated speed (internal only, never shown in UI) ─────────────
// speedMult: every 1 real second → speedMult simulated seconds
const LECTURE_SPEED = {
  "Lecture 01 Embedded System": 2,  // x2 internal speed
};
function getSpeed(label) { return LECTURE_SPEED[label] ?? 1; }

// ── Transcript config per lecture ─────────────────────────────────────────────
// Fields per line:
//   ts    – timestamp string shown in UI (e.g. "00:12")
//   text  – spoken text shown in UI
//   slide – (optional) page to auto-sync the PDF viewer to (internal, not rendered)
//
// startSlide – (optional) page to open when this lecture's recording begins
const TRANSCRIPTS = {
  "Lecture 01 Embedded System": {
    startSlide: 7,
    statusLabel: "Generating transcript live…",
    lines: [
      { ts: "00:00", slide: 7, text: "Now let us focus on this comparison between a microcontroller and a microprocessor. This slide is very important because it explains why embedded systems usually use microcontrollers instead of only microprocessors." },
      { ts: "00:12", slide: 7, text: "On the left side, we have the microprocessor. A microprocessor is general-purpose. That means it is designed mainly for processing different kinds of tasks, not only for controlling one specific device." },
      { ts: "00:27", slide: 7, text: "The slide also says that a microprocessor has many instruction types and modes. This makes it powerful and flexible for general computing, but the complete system usually needs extra external hardware." },
      { ts: "00:44", slide: 7, text: "A key point here is that the hardware of a microprocessor mainly includes the CPU only. So the CPU is stand-alone, and components such as RAM, ROM, input-output ports, and timers are separate." },
      { ts: "01:02", slide: 7, text: "This means if we build a microprocessor-based system, we usually need to connect memory and input-output components externally. This gives flexibility, but it increases size, wiring, cost, and design complexity." },
      { ts: "01:20", slide: 7, text: "Now look at the right side of the slide. The microcontroller is usually single-purpose. It is mainly used for control, which makes it very suitable for embedded systems." },
      { ts: "01:35", slide: 7, text: "The most important idea is integration. In a microcontroller, the CPU, RAM, ROM, input-output ports, and timer are all placed on a single chip." },
      { ts: "01:50", slide: 7, text: "Because these components are already inside the chip, a microcontroller-based system is usually smaller, cheaper, simpler, and easier to use for direct hardware control." },
      { ts: "02:06", slide: 7, text: "Another important point is that microcontrollers often do not need a full operating system. In many embedded systems, the microcontroller executes one dedicated program again and again." },
      { ts: "02:22", slide: 7, text: "So the simple comparison is this: a microprocessor is mainly a CPU for general processing, while a microcontroller is a small complete computer on one chip designed mainly for control." },
      { ts: "02:39", slide: 7, text: "For exam or presentation purposes, remember these pairs: general-purpose versus single-purpose, processing versus control, external components versus integrated components, and larger system versus compact system." },
      { ts: "02:58", slide: 7, text: "Now the next slide shows the same idea visually using a time and temperature system example. This will make the difference much easier to understand." },
      { ts: "03:12", slide: 8, text: "Now we are looking at the design example slide. This slide compares an MPU-based time and temperature system with an MCU-based time and temperature system." },
      { ts: "03:26", slide: 8, text: "On the left side, MPU means microprocessor unit. Notice that the microprocessor unit is only one block, and many other system components are placed separately around it." },
      { ts: "03:42", slide: 8, text: "For example, the temperature sensor is separate. The analog-to-digital converter is separate. The timer is separate. The flash memory and read-write memory are also separate." },
      { ts: "03:58", slide: 8, text: "The output devices, such as the fan, heater, and LCD, are also separate blocks. These parts communicate through the system bus." },
      { ts: "04:13", slide: 8, text: "This left-side diagram shows why a microprocessor system can become more complex. The designer must connect several separate modules to build a full working system." },
      { ts: "04:30", slide: 8, text: "Now compare this with the right side. MCU means microcontroller unit. Here, the microcontroller already contains several important blocks inside it." },
      { ts: "04:45", slide: 8, text: "Inside the microcontroller block, we can see the microprocessor unit, flash memory, read-write memory, timer, and analog-to-digital converter. These are integrated inside the chip." },
      { ts: "05:02", slide: 8, text: "The external devices are mainly the peripherals that interact with the real world, such as the temperature sensor, heater, fan, and LCD." },
      { ts: "05:17", slide: 8, text: "This makes the microcontroller-based system more compact. It also reduces external wiring because many functions are already built into the microcontroller." },
      { ts: "05:32", slide: 8, text: "The visual difference is simple. In the microprocessor system, many important blocks are outside the CPU. In the microcontroller system, many of those blocks are already inside the chip." },
      { ts: "05:50", slide: 8, text: "This is why microcontrollers are usually preferred for embedded control applications. They are easier to connect to sensors and actuators, and they reduce the hardware needed to build the system." },
      { ts: "06:07", slide: 8, text: "So if you want to explain this slide in one sentence: the MPU-based design needs many external blocks, while the MCU-based design integrates many of those blocks into one chip." },
      { ts: "06:24", slide: 8, text: "The final takeaway is that the microprocessor gives more flexibility for general processing, but the microcontroller is better for compact, low-cost, control-based embedded systems." },
    ],
  },

  "Lecture 05 Programming microcontroller C": {
    statusLabel: "Listening…",
    lines: [
      { ts: "00:00", text: "Alright everyone, today we're going to look at programming the PIC microcontroller using embedded C." },
      { ts: "00:05", text: "Instead of writing assembly, we can now use a high-level language with direct register access." },
      { ts: "00:11", text: "We'll be using the XC8 compiler from Microchip, which is specifically designed for PIC devices." },
      { ts: "00:17", text: "The first thing you need to do in any XC8 program is include the xc.h header file." },
      { ts: "00:23", text: "This header file automatically maps all the Special Function Registers to readable names." },
      { ts: "00:29", text: "You also need to define _XTAL_FREQ so the delay macros know what oscillator speed you're using." },
      { ts: "00:36", text: "For example, #define _XTAL_FREQ 8000000 tells the compiler you're using an 8 MHz crystal." },
      { ts: "00:43", text: "Next, the #pragma config lines — these set the configuration bits, just like we did in assembly." },
      { ts: "00:50", text: "You must configure FOSC, WDTE, and PWRTE at minimum to ensure stable operation." },
      { ts: "00:57", text: "Inside main, the first thing we do is configure the TRIS register to set pin direction." },
      { ts: "01:04", text: "Writing a 0 to a TRIS bit makes that pin an output; writing a 1 makes it an input." },
      { ts: "01:11", text: "For example, TRISA = 0x00 configures all PORTA pins as outputs." },
      { ts: "01:18", text: "Then you write to the PORT or LAT register to control the actual output level." },
      { ts: "01:25", text: "Using LAT is preferred over PORT for output — it reads back the latch, not the physical pin." },
      { ts: "01:32", text: "Now, the volatile keyword is critical when accessing hardware registers in C." },
      { ts: "01:38", text: "Without volatile, the compiler might optimize away repeated reads, assuming the value hasn't changed." },
      { ts: "01:44", text: "The XC8 header already declares all SFRs as volatile, so you're covered automatically." },
      { ts: "01:50", text: "For delays, we use __delay_ms() or __delay_us() — these are built-in macros in XC8." },
      { ts: "01:56", text: "They calculate the correct number of instruction cycles based on your _XTAL_FREQ definition." },
      { ts: "02:03", text: "Let's look at a simple LED blink example to tie it all together." },
      { ts: "02:10", text: "We set TRISB to 0, then in a while loop we toggle LATB0 with a 500 ms delay each time." },
      { ts: "02:17", text: "That's the full program — about 10 lines of C versus 30 lines of assembly for the same task." },
      { ts: "02:24", text: "Remember: always configure TRIS before writing to PORT, and always define _XTAL_FREQ." },
      { ts: "02:30", text: "Next session we'll read inputs using the PORT register and implement push-button debouncing." },
    ],
  },
};

// ── Flagged moment card ───────────────────────────────────────────────────────
const MOMENT_META = {
  last30s:  { title: "Audio Segment Saved",  label: "Last 30 seconds", icon: Volume2, isAudio: true  },
  last1m:   { title: "Audio Segment Saved",  label: "Last 1 minute",   icon: Volume2, isAudio: true  },
  snapshot: { title: "Slide Snapshot Saved", label: "Snapshot",        icon: Camera,  isAudio: false },
};

function FlaggedCard({ moment }) {
  const meta = MOMENT_META[moment.type] ?? MOMENT_META.snapshot;
  const Icon = meta.icon;
  return (
    <div className="rounded-xl border border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/20 transition-all p-3 mb-2 last:mb-0">
      <div className="flex items-start gap-2.5">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${meta.isAudio ? "bg-blue-50" : "bg-indigo-50"}`}>
          <Icon size={13} className={meta.isAudio ? "text-blue-500" : "text-indigo-500"} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <p className="text-xs font-semibold text-gray-800 truncate">{meta.title}</p>
            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0 ${meta.isAudio ? "bg-blue-50 text-blue-500" : "bg-indigo-50 text-indigo-500"}`}>
              {meta.label}
            </span>
          </div>
          <p className="text-[10px] text-gray-500 mb-1">
            Slide {moment.slideNumber ?? "—"}{moment.totalSlides ? ` / ${moment.totalSlides}` : ""}
          </p>
          {meta.isAudio ? (
            <div className="flex items-center gap-1 text-[10px] font-mono text-blue-600 bg-blue-50 rounded-md px-2 py-0.5 w-fit">
              <span>{moment.fromTs ?? "00:00"}</span>
              <span className="text-blue-300">→</span>
              <span>{moment.toTs ?? "00:00"}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-10 h-7 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-[8px] text-gray-400 font-bold shrink-0">
                S{moment.slideNumber ?? "?"}
              </div>
              <span className="text-[10px] text-gray-400 leading-snug">Snapshot saved from current slide</span>
            </div>
          )}
          <p className="text-[9px] text-gray-400 mt-1.5">@ {moment.toTs ?? "00:00"} · Student marked for review</p>
        </div>
      </div>
    </div>
  );
}

// ── Error boundary ────────────────────────────────────────────────────────────
class RecordingErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err) { console.error("[SpotLearn] RecordingScreen crashed:", err); }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4 p-8 text-center bg-white">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
          <AlertTriangle size={24} className="text-amber-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800 mb-1">Something went wrong in the recording view.</p>
          <p className="text-xs text-gray-500">Please restart the recording.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={this.props.onBack}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Back to Lecture
          </button>
          <button onClick={this.props.onClose}
            className="px-4 py-2 rounded-xl bg-[#2F3D56] text-white text-sm font-semibold hover:bg-[#263347] transition-colors">
            Close
          </button>
        </div>
      </div>
    );
  }
}

// ── Inner recording component ─────────────────────────────────────────────────
function RecordingScreenInner({ lecture, onClose, onBack, onSave }) {
  const canvasRef        = useRef(null);
  const containerRef     = useRef(null);
  const renderTaskRef    = useRef(null);
  const transcriptEndRef = useRef(null);
  const toastTimerRef    = useRef(null);
  const mountedRef       = useRef(true);
  const prevLineCountRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const speedMult     = getSpeed(lecture?.label ?? "");
  const transcriptCfg = TRANSCRIPTS[lecture?.label ?? ""] ?? null;
  const hasTranscript = !!transcriptCfg;
  const startSlide    = transcriptCfg?.startSlide ?? 1;

  const [pdfDoc,         setPdfDoc]         = useState(null);
  const [numPages,       setNumPages]        = useState(null);
  const [pageNumber,     setPageNumber]      = useState(startSlide);
  const [pdfStatus,      setPdfStatus]       = useState("loading");
  const [simSeconds,     setSimSeconds]      = useState(0);
  const [flaggedMoments, setFlaggedMoments]  = useState([]);
  const [toast,          setToast]           = useState(null);
  const [isStopped,      setIsStopped]       = useState(false);
  const [showEndModal,   setShowEndModal]    = useState(false);

  // firstSlide for the saved recording coverage (start of session)
  const firstSlideRef = useRef(startSlide);

  const isStoppedRef = useRef(false);
  useEffect(() => { isStoppedRef.current = isStopped; }, [isStopped]);

  // ── Single simulated clock ─────────────────────────────────────
  // One interval. Drives timer display, transcript visibility, and capture timestamps.
  // No second interval for transcript — visibility is pure derived state.
  useEffect(() => {
    const id = setInterval(() => {
      if (!isStoppedRef.current && mountedRef.current) {
        setSimSeconds((s) => s + speedMult);
      }
    }, 1000);
    return () => clearInterval(id);
    // speedMult is constant for a given lecture — safe to omit from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Derive visible transcript lines from simulated time ─────────
  const visibleLines = useMemo(() => {
    if (!hasTranscript || !transcriptCfg?.lines?.length) return [];
    return transcriptCfg.lines.filter((line) => tsToSec(line.ts) <= simSeconds);
  }, [simSeconds, hasTranscript, transcriptCfg]);

  const transcriptDone = hasTranscript &&
    visibleLines.length >= (transcriptCfg?.lines?.length ?? 0);

  // ── Auto-sync PDF viewer to transcript's current slide ─────────
  // Uses the `slide` field on transcript lines (internal, never rendered).
  // Fires only when the slide in the transcript changes (e.g. lines cross from slide 7 → 8).
  const currentTranscriptSlide = useMemo(() => {
    if (!hasTranscript || visibleLines.length === 0) return startSlide;
    const lastLine = visibleLines[visibleLines.length - 1];
    return lastLine?.slide ?? startSlide;
  }, [visibleLines, hasTranscript, startSlide]);

  useEffect(() => {
    // Only auto-sync for lectures that define a startSlide (i.e. Lecture 01)
    if (hasTranscript && transcriptCfg?.startSlide != null && !isStopped) {
      setPageNumber(currentTranscriptSlide);
    }
  }, [currentTranscriptSlide, hasTranscript, transcriptCfg?.startSlide, isStopped]);

  // ── Auto-scroll: only when a new line appears ───────────────────
  useEffect(() => {
    if (visibleLines.length > prevLineCountRef.current) {
      prevLineCountRef.current = visibleLines.length;
      transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [visibleLines.length]);

  // ── Toast helper ────────────────────────────────────────────────
  function showToast(msg) {
    if (!mountedRef.current) return;
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      if (mountedRef.current) setToast(null);
    }, 2500);
  }
  useEffect(() => () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); }, []);

  // ── Capture handler ─────────────────────────────────────────────
  function handleCapture(type) {
    const toTs   = formatTs(simSeconds);
    const fromTs = type === "last30s" ? formatTs(Math.max(0, simSeconds - 30))
                 : type === "last1m"  ? formatTs(Math.max(0, simSeconds - 60))
                 : null;
    setFlaggedMoments((prev) => [
      { id: Date.now(), type, toTs, fromTs, slideNumber: pageNumber, totalSlides: numPages },
      ...prev,
    ]);
    showToast(type === "snapshot" ? "Snapshot saved to flagged moments" : "Saved to flagged moments");
  }

  // ── End / Save flow ─────────────────────────────────────────────
  function handleEndClick()  { setShowEndModal(true); }
  function handleCancelEnd() { setShowEndModal(false); }
  function handleSaveRecording() {
    setShowEndModal(false);
    setIsStopped(true);
    onSave?.({
      id:           Date.now(),
      lectureLabel: lecture?.label ?? "Unknown lecture",
      savedAt:      new Date(),
      firstSlide:   firstSlideRef.current,
      lastSlide:    pageNumber,
      duration:     simSeconds,
      flaggedCount: flaggedMoments.length,
    });
  }

  // ── Load PDF ────────────────────────────────────────────────────
  useEffect(() => {
    if (!lecture?.pdfPath) { setPdfStatus("error"); return; }
    let cancelled = false;
    setPdfStatus("loading");
    setPdfDoc(null);
    setNumPages(null);
    setPageNumber(startSlide);
    firstSlideRef.current = startSlide;

    loadPdfJs()
      .then((lib) => lib.getDocument(lecture.pdfPath).promise)
      .then((doc) => {
        if (cancelled || !mountedRef.current) return;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setPdfStatus("ready");
      })
      .catch(() => { if (!cancelled && mountedRef.current) setPdfStatus("error"); });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lecture?.pdfPath]);

  // ── Render PDF page ─────────────────────────────────────────────
  const renderPage = useCallback(async (doc, pageNum, canvas, container) => {
    if (!doc || !canvas || !container) return;
    if (renderTaskRef.current) {
      try { renderTaskRef.current.cancel(); } catch { /* ignore */ }
    }
    try {
      const page    = await doc.getPage(pageNum);
      const natural = page.getViewport({ scale: 1 });
      const maxW    = Math.max((container.clientWidth ?? 400) - 40, 100);
      const scale   = Math.min(maxW / natural.width, 2.2);
      const vp      = page.getViewport({ scale });
      canvas.width  = vp.width;
      canvas.height = vp.height;
      const task    = page.render({ canvasContext: canvas.getContext("2d"), viewport: vp });
      renderTaskRef.current = task;
      await task.promise;
    } catch { /* render cancelled — ignore */ }
  }, []);

  useEffect(() => {
    if (pdfStatus === "ready" && pdfDoc && canvasRef.current && containerRef.current) {
      renderPage(pdfDoc, pageNumber, canvasRef.current, containerRef.current);
    }
  }, [pdfStatus, pdfDoc, pageNumber, renderPage]);

  const goPrev = () => setPageNumber((p) => Math.max(1, p - 1));
  const goNext = () => setPageNumber((p) => Math.min(numPages ?? p, p + 1));

  return (
    <>
      {/* ── Top bar ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#2F3D56] rounded-t-2xl shrink-0">

        {/* Left: back + lecture title */}
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onBack} title="Back to overview"
            className="text-white/60 hover:text-white transition-colors shrink-0">
            <ArrowLeft size={16} />
          </button>
          <span className="text-white font-semibold text-sm truncate max-w-[240px]">
            {lecture?.label ?? "Recording"}
          </span>
        </div>

        {/* Center: recording status + timer */}
        <div className="flex items-center gap-2 shrink-0">
          {!isStopped ? (
            <>
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span className="text-white/90 text-xs font-medium tracking-wide">Recording</span>
            </>
          ) : (
            <span className="text-white/50 text-xs font-medium">Stopped</span>
          )}
          <span className="font-mono text-white/70 text-xs bg-white/10 px-2 py-0.5 rounded-md ml-1 tabular-nums">
            {formatTime(simSeconds)}
          </span>
        </div>

        {/* Right: End Recording + Close */}
        <div className="flex items-center gap-2 shrink-0">
          {!isStopped && (
            <button onClick={handleEndClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/30 hover:border-rose-400/60 text-rose-300 hover:text-rose-200 text-xs font-semibold transition-all">
              <StopCircle size={13} /> End
            </button>
          )}
          <button onClick={onClose} title="Close"
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* ── Main content row ──────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* PDF viewer */}
        <div ref={containerRef}
          className="flex-1 overflow-auto bg-gray-100 flex flex-col items-center justify-start py-6 px-4 min-h-0">
          {pdfStatus === "loading" && (
            <div className="flex flex-col items-center justify-center h-72 gap-3 text-gray-400">
              <Loader2 size={28} className="animate-spin" />
              <span className="text-sm">Loading slides…</span>
            </div>
          )}
          {pdfStatus === "error" && (
            <div className="flex flex-col items-center justify-center h-72 gap-2 text-gray-400 text-sm text-center">
              <span className="text-3xl">📄</span>
              <span>Could not load the PDF.</span>
              <span className="text-xs">Check your internet connection.</span>
            </div>
          )}
          {pdfStatus === "ready" && (
            <canvas ref={canvasRef} className="shadow-xl rounded-sm max-w-full" />
          )}
        </div>

        {/* Right panel: Live Transcript + Flagged Moments */}
        <div className="w-[300px] bg-white border-l border-gray-200 flex flex-col min-h-0 shrink-0">

          {/* ── Transcript section ── */}
          <div className="flex-[3] flex flex-col min-h-0 border-b border-gray-200">
            <div className="px-4 py-2.5 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Mic size={12} className="text-[#2F3D56]" />
                  <span className="text-[10px] font-bold text-gray-700 tracking-widest uppercase">
                    Live Transcript
                  </span>
                </div>
                {/* Status badge — only text, no speed info */}
                {hasTranscript && (
                  isStopped ? (
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                      Stopped
                    </span>
                  ) : transcriptDone ? (
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                      Completed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block" />
                      {transcriptCfg?.statusLabel ?? "Listening…"}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-2 min-h-0">
              {!hasTranscript ? (
                /* No transcript available for this lecture */
                <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Mic size={16} className="text-gray-400" />
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    Live transcript simulation is not available for this lecture yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {visibleLines.map((line, i) => {
                    const isNewest = !transcriptDone && !isStopped && i === visibleLines.length - 1;
                    return (
                      <div key={i} className={`flex gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${
                        isNewest ? "bg-blue-50 border border-blue-100" : "hover:bg-gray-50"
                      }`}>
                        {/* Only render timestamp + text — slide/title are internal only */}
                        <span className="font-mono text-[9px] text-gray-400 shrink-0 mt-0.5 tabular-nums">
                          [{line.ts}]
                        </span>
                        <span className={`leading-relaxed ${isNewest ? "text-blue-800 font-medium" : "text-gray-600"}`}>
                          {line.text}
                        </span>
                      </div>
                    );
                  })}
                  {(transcriptDone || (isStopped && visibleLines.length > 0)) && (
                    <div className="flex items-center gap-2 px-2 py-2 mt-1 rounded-lg bg-gray-50 text-[10px] text-gray-400 border border-dashed border-gray-200">
                      <span>✓</span>
                      <span>{isStopped ? "Transcript stopped." : "Transcript simulation completed."}</span>
                    </div>
                  )}
                  <div ref={transcriptEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* ── Flagged Moments section ── */}
          <div className="flex-[2] flex flex-col min-h-0">
            <div className="px-4 py-2.5 shrink-0 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Flag size={12} className="text-[#2F3D56]" />
                  <span className="text-[10px] font-bold text-gray-700 tracking-widest uppercase">
                    Flagged Moments
                  </span>
                </div>
                {flaggedMoments.length > 0 && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#2F3D56] text-white">
                    {flaggedMoments.length}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-2.5 min-h-0">
              {flaggedMoments.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Flag size={14} className="text-gray-400" />
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    No flagged moments yet. Use capture tools when you get lost.
                  </p>
                </div>
              ) : (
                flaggedMoments.map((m) => <FlaggedCard key={m.id} moment={m} />)
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Capture bar ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#f8f9fb] border-t border-gray-200 shrink-0">
        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mr-0.5 shrink-0">
          Capture
        </span>
        <button onClick={() => handleCapture("last30s")} disabled={isStopped}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 hover:border-blue-300 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
          <Volume2 size={12} /> Last 30s
        </button>
        <button onClick={() => handleCapture("last1m")} disabled={isStopped}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 hover:border-blue-300 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
          <Volume2 size={12} /> Last 1m
        </button>
        <button onClick={() => handleCapture("snapshot")} disabled={isStopped}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 hover:border-indigo-300 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
          <Camera size={12} /> Snapshot
        </button>
        <div className="flex-1" />
        <span className="text-[9px] text-gray-400 font-mono tabular-nums hidden sm:block">
          Slide {pageNumber}{numPages ? ` / ${numPages}` : ""}
        </span>
      </div>

      {/* ── Slide nav ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-100 rounded-b-2xl shrink-0">
        <button onClick={goPrev} disabled={pageNumber <= 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronLeft size={16} /> Previous Slide
        </button>
        <span className="text-sm font-mono text-gray-500 tabular-nums select-none">
          Slide {pageNumber} / {numPages ?? "—"}
        </span>
        <button onClick={goNext} disabled={numPages !== null && pageNumber >= numPages}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[#2F3D56] hover:bg-[#263347] text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          Next Slide <ChevronRight size={16} />
        </button>
      </div>

      {/* ── End Recording confirmation modal ─────────────────────── */}
      {showEndModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4">
              <StopCircle size={22} className="text-rose-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">End recording?</h3>
            <p className="text-sm text-gray-500 text-center leading-relaxed mb-4">
              This will save the recording and store it under{" "}
              <span className="font-semibold text-gray-700">Previous Recordings</span>.
            </p>
            <div className="rounded-xl bg-[#f8f9fb] border border-gray-200 px-4 py-3 mb-6 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Duration</span>
                <span className="font-mono font-semibold text-gray-800">{formatTime(simSeconds)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Coverage</span>
                <span className="font-semibold text-gray-800">
                  Slide {firstSlideRef.current} → {pageNumber}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Flagged Moments</span>
                <span className="font-semibold text-gray-800">{flaggedMoments.length}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleCancelEnd}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleSaveRecording}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#2F3D56] hover:bg-[#263347] text-white text-sm font-semibold transition-colors shadow-sm">
                Save Recording
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ────────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 bg-[#2F3D56] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl pointer-events-none">
          <span className="text-green-400 text-sm">✓</span>
          {toast}
        </div>
      )}
    </>
  );
}

// ── Public export: inner component wrapped in error boundary ──────────────────
export default function RecordingScreen(props) {
  return (
    <RecordingErrorBoundary onClose={props.onClose} onBack={props.onBack}>
      <RecordingScreenInner {...props} />
    </RecordingErrorBoundary>
  );
}
