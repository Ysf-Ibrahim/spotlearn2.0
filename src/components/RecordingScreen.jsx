import { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft, ChevronRight, X, ArrowLeft, Loader2,
  Mic, Volume2, Camera, Flag,
} from "lucide-react";

// ── pdf.js via CDN ───────────────────────────────────────────────────────────
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
    s.onerror = () => reject(new Error("Failed to load pdf.js from CDN"));
    document.head.appendChild(s);
  });
}

// ── Time helpers ─────────────────────────────────────────────────────────────
function formatTime(total) {
  const h = Math.floor(total / 3600).toString().padStart(2, "0");
  const m = Math.floor((total % 3600) / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function formatTs(total) {
  const m = Math.floor(total / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ── Transcript lines for Lecture 05 ─────────────────────────────────────────
const TRANSCRIPT_LINES = [
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
];
const TRANSCRIPT_INTERVAL_MS = 5000;

// ── Flagged moment card meta ──────────────────────────────────────────────────
const MOMENT_META = {
  last30s:  { title: "Audio Segment Saved",  label: "Last 30 seconds", icon: Volume2, color: "blue"   },
  last1m:   { title: "Audio Segment Saved",  label: "Last 1 minute",   icon: Volume2, color: "blue"   },
  snapshot: { title: "Slide Snapshot Saved", label: "Snapshot",        icon: Camera,  color: "indigo" },
};

function FlaggedCard({ moment }) {
  const meta = MOMENT_META[moment.type];
  const Icon = meta.icon;
  const isAudio = moment.type !== "snapshot";

  return (
    <div className="rounded-xl border border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/20 transition-all p-3 mb-2 last:mb-0">
      <div className="flex items-start gap-2.5">
        {/* icon */}
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
          isAudio ? "bg-blue-50" : "bg-indigo-50"
        }`}>
          <Icon size={13} className={isAudio ? "text-blue-500" : "text-indigo-500"} />
        </div>

        {/* content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <p className="text-xs font-semibold text-gray-800 truncate">{meta.title}</p>
            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0 ${
              isAudio ? "bg-blue-50 text-blue-500" : "bg-indigo-50 text-indigo-500"
            }`}>
              {meta.label}
            </span>
          </div>

          <p className="text-[10px] text-gray-500 mb-1">
            Slide {moment.slideNumber}{moment.totalSlides ? ` / ${moment.totalSlides}` : ""}
          </p>

          {isAudio ? (
            <div className="flex items-center gap-1 text-[10px] font-mono text-blue-600 bg-blue-50 rounded-md px-2 py-0.5 w-fit">
              <span>{moment.fromTs}</span>
              <span className="text-blue-300">→</span>
              <span>{moment.toTs}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 mt-0.5">
              {/* slide thumbnail placeholder */}
              <div className="w-10 h-7 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-[8px] text-gray-400 font-bold shrink-0">
                S{moment.slideNumber}
              </div>
              <span className="text-[10px] text-gray-400 leading-snug">
                Snapshot saved from current slide
              </span>
            </div>
          )}

          <p className="text-[9px] text-gray-400 mt-1.5">@ {moment.toTs} · Student marked for review</p>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function RecordingScreen({ lecture, onClose, onBack }) {
  const canvasRef        = useRef(null);
  const containerRef     = useRef(null);
  const renderTaskRef    = useRef(null);
  const transcriptEndRef = useRef(null);
  const toastTimerRef    = useRef(null);

  const [pdfDoc,        setPdfDoc]        = useState(null);
  const [numPages,      setNumPages]      = useState(null);
  const [pageNumber,    setPageNumber]    = useState(1);
  const [status,        setStatus]        = useState("loading");
  const [seconds,       setSeconds]       = useState(0);
  const [visibleLines,  setVisibleLines]  = useState([]);
  const [flaggedMoments,setFlaggedMoments]= useState([]);
  const [toast,         setToast]         = useState(null);

  const isLecture05 = lecture.label.includes("Lecture 05");

  // ── Toast helper ──────────────────────────────────────────────
  function showToast(msg) {
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 2500);
  }
  useEffect(() => () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); }, []);

  // ── Capture handler ───────────────────────────────────────────
  function handleCapture(type) {
    const toTs   = formatTs(seconds);
    const fromTs = type === "last30s"
      ? formatTs(Math.max(0, seconds - 30))
      : type === "last1m"
      ? formatTs(Math.max(0, seconds - 60))
      : null;

    setFlaggedMoments((prev) => [
      { id: Date.now(), type, toTs, fromTs, slideNumber: pageNumber, totalSlides: numPages },
      ...prev,
    ]);
    showToast("Saved to flagged moments");
  }

  // ── Live timer ────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // ── Transcript simulation ─────────────────────────────────────
  useEffect(() => {
    if (!isLecture05) return;
    let index = 0;
    setVisibleLines([TRANSCRIPT_LINES[0]]);
    index = 1;
    const id = setInterval(() => {
      if (index >= TRANSCRIPT_LINES.length) { clearInterval(id); return; }
      setVisibleLines((prev) => [...prev, TRANSCRIPT_LINES[index]]);
      index += 1;
    }, TRANSCRIPT_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isLecture05]);

  // ── Auto-scroll transcript ────────────────────────────────────
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [visibleLines]);

  // ── Load PDF ──────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setPdfDoc(null);
    setNumPages(null);
    setPageNumber(1);

    loadPdfJs()
      .then((lib) => lib.getDocument(lecture.pdfPath).promise)
      .then((doc) => {
        if (cancelled) return;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setStatus("ready");
      })
      .catch(() => { if (!cancelled) setStatus("error"); });

    return () => { cancelled = true; };
  }, [lecture.pdfPath]);

  // ── Render PDF page ───────────────────────────────────────────
  const renderPage = useCallback(async (doc, pageNum, canvas, container) => {
    if (!doc || !canvas) return;
    if (renderTaskRef.current) renderTaskRef.current.cancel();
    try {
      const page    = await doc.getPage(pageNum);
      const natural = page.getViewport({ scale: 1 });
      const maxW    = (container?.clientWidth ?? 580) - 40;
      const scale   = Math.min(maxW / natural.width, 2.2);
      const vp      = page.getViewport({ scale });
      canvas.width  = vp.width;
      canvas.height = vp.height;
      const task    = page.render({ canvasContext: canvas.getContext("2d"), viewport: vp });
      renderTaskRef.current = task;
      await task.promise;
    } catch { /* cancelled renders throw — ignore */ }
  }, []);

  useEffect(() => {
    if (status === "ready" && pdfDoc) {
      renderPage(pdfDoc, pageNumber, canvasRef.current, containerRef.current);
    }
  }, [status, pdfDoc, pageNumber, renderPage]);

  const goPrev = () => setPageNumber((p) => Math.max(1, p - 1));
  const goNext = () => setPageNumber((p) => Math.min(numPages ?? p, p + 1));

  const transcriptDone = visibleLines.length >= TRANSCRIPT_LINES.length;

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#2F3D56] rounded-t-2xl shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onBack} title="Back to overview"
            className="text-white/60 hover:text-white transition-colors shrink-0">
            <ArrowLeft size={16} />
          </button>
          <span className="text-white font-semibold text-sm truncate max-w-[220px]">
            {lecture.label}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <span className="text-white/90 text-xs font-medium tracking-wide">Recording</span>
          <span className="font-mono text-white/70 text-xs bg-white/10 px-2 py-0.5 rounded-md ml-1 tabular-nums">
            {formatTime(seconds)}
          </span>
        </div>

        <button onClick={onClose} title="End session"
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white shrink-0">
          <X size={14} />
        </button>
      </div>

      {/* ── Main content row ─────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* ── PDF viewer ── */}
        <div
          ref={containerRef}
          className="flex-1 overflow-auto bg-gray-100 flex flex-col items-center justify-start py-6 px-4 min-h-0"
        >
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center h-72 gap-3 text-gray-400">
              <Loader2 size={28} className="animate-spin" />
              <span className="text-sm">Loading slides…</span>
            </div>
          )}
          {status === "error" && (
            <div className="flex flex-col items-center justify-center h-72 gap-2 text-gray-400 text-sm">
              <span className="text-3xl">📄</span>
              <span>Could not load the PDF.</span>
              <span className="text-xs">Check your internet connection and try again.</span>
            </div>
          )}
          {status === "ready" && (
            <canvas ref={canvasRef} className="shadow-xl rounded-sm max-w-full" />
          )}
        </div>

        {/* ── Right panel: Transcript + Flagged Moments (Lecture 05) ── */}
        {isLecture05 && (
          <div className="w-[300px] bg-white border-l border-gray-200 flex flex-col min-h-0 shrink-0">

            {/* Transcript section */}
            <div className="flex-[3] flex flex-col min-h-0 border-b border-gray-200">
              {/* transcript header */}
              <div className="px-4 py-2.5 shrink-0 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Mic size={12} className="text-[#2F3D56]" />
                    <span className="text-[10px] font-bold text-gray-700 tracking-widest uppercase">Live Transcript</span>
                  </div>
                  {transcriptDone ? (
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                      Completed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block" />
                      Listening…
                    </span>
                  )}
                </div>
              </div>
              {/* transcript lines */}
              <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5 min-h-0">
                {visibleLines.map((line, i) => {
                  const isNewest = !transcriptDone && i === visibleLines.length - 1;
                  return (
                    <div key={i} className={`flex gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${
                      isNewest ? "bg-blue-50 border border-blue-100" : "hover:bg-gray-50"
                    }`}>
                      <span className="font-mono text-[9px] text-gray-400 shrink-0 mt-0.5 tabular-nums">[{line.ts}]</span>
                      <span className={`leading-relaxed ${isNewest ? "text-blue-800 font-medium" : "text-gray-600"}`}>
                        {line.text}
                      </span>
                    </div>
                  );
                })}
                {transcriptDone && (
                  <div className="flex items-center gap-2 px-2 py-2 mt-1 rounded-lg bg-gray-50 text-[10px] text-gray-400 border border-dashed border-gray-200">
                    <span>✓</span>
                    <span>Transcript simulation completed.</span>
                  </div>
                )}
                <div ref={transcriptEndRef} />
              </div>
            </div>

            {/* Flagged moments section */}
            <div className="flex-[2] flex flex-col min-h-0">
              {/* flagged header */}
              <div className="px-4 py-2.5 shrink-0 bg-white border-b border-gray-100">
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
              {/* flagged cards */}
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
        )}
      </div>

      {/* ── Capture action bar (Lecture 05 only) ────────────────── */}
      {isLecture05 && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#f8f9fb] border-t border-gray-200 shrink-0">
          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mr-0.5 shrink-0">
            Capture
          </span>

          <button
            onClick={() => handleCapture("last30s")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 hover:border-blue-300 transition-all active:scale-95"
          >
            <Volume2 size={12} />
            Last 30s
          </button>

          <button
            onClick={() => handleCapture("last1m")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 hover:border-blue-300 transition-all active:scale-95"
          >
            <Volume2 size={12} />
            Last 1m
          </button>

          <button
            onClick={() => handleCapture("snapshot")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 hover:border-indigo-300 transition-all active:scale-95"
          >
            <Camera size={12} />
            Snapshot
          </button>

          <div className="flex-1" />

          <span className="text-[9px] text-gray-400 font-mono tabular-nums hidden sm:block">
            Slide {pageNumber}{numPages ? ` / ${numPages}` : ""}
          </span>
        </div>
      )}

      {/* ── Slide navigation bar ─────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-100 rounded-b-2xl shrink-0">
        <button
          onClick={goPrev}
          disabled={pageNumber <= 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
          Previous Slide
        </button>

        <span className="text-sm font-mono text-gray-500 tabular-nums select-none">
          Slide {pageNumber} / {numPages ?? "—"}
        </span>

        <button
          onClick={goNext}
          disabled={numPages !== null && pageNumber >= numPages}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[#2F3D56] hover:bg-[#263347] text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next Slide
          <ChevronRight size={16} />
        </button>
      </div>

      {/* ── Toast notification ────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 bg-[#2F3D56] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl pointer-events-none">
          <span className="text-green-400 text-sm">✓</span>
          {toast}
        </div>
      )}
    </>
  );
}
