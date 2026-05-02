export const courseInfo = {
  code: "COE349",
  name: "Embedded Systems",
  semester: "Spring 2025/2026",
  instructor: "Dr. Ahmad Al-Mansoori",
};

export const announcement = {
  title: "Embedded Systems midterm exam Selection",
  body: `Dear Embedded Systems Class Students,

Good day.

I have received a request from one of your classmates indicating that all the class prefers to take the Embedded Systems midterm exam on Saturday, April 11, 2026, instead of the originally scheduled date on Tuesday, April 7, 2026.

I would like to inform you that I have no objection to postponing the exam to Saturday, April 11, 2026. However, I need to confirm your agreement officially through this poll on Moodle.

Please submit your vote before midnight today. If all students agree, the exam date will be changed accordingly. Otherwise, the original schedule will remain unchanged. I will inform you about the result of the Poll.

Best regards.`,
};

export const topics = [
  {
    id: "online",
    title: "ONLINE CLASS",
    items: [
      { type: "link", icon: "video", label: "Online Class (Zoom)" },
      { type: "quiz", icon: "clipboard", label: "Midterm" },
    ],
  },
  {
    id: "topic2",
    title: "Topic 2",
    items: [
      {
        type: "pdf",
        icon: "file-text",
        label: "Lecture 00 Introduction",
        pdfPath: "/pdfs/lecture-00.pdf",
        preview: {
          summary: "Course kick-off covering the scope of embedded systems, the tools you will use all semester, and how your grade is broken down across labs, assignments, and exams.",
          estimatedTime: "40 min",
          cards: [
            { title: "Key Concepts", desc: "What embedded systems are, how they differ from general-purpose computers, and why they operate under strict resource constraints." },
            { title: "Learning Outcomes", desc: "Describe the role of an embedded system, identify the course tools, and understand what is expected throughout the semester." },
            { title: "Main Topics", desc: "Definition of embedded systems, MPLAB X IDE overview, XC8 compiler introduction, course structure and grading breakdown." },
          ],
        },
      },
    ],
  },
  {
    id: "topic3",
    title: "Topic 3",
    items: [
      {
        type: "pdf",
        icon: "file-text",
        label: "Lecture 01 Embedded System",
        pdfPath: "/pdfs/lecture-01.pdf",
        preview: {
          summary: "A deep look at the anatomy of an embedded system — processor, memory, peripherals — and the design trade-offs that make embedded engineering unique.",
          estimatedTime: "50 min",
          cards: [
            { title: "Key Concepts", desc: "The core building blocks of an embedded system: processor, memory types, and I/O peripherals tightly integrated on a single platform." },
            { title: "Learning Outcomes", desc: "Identify key components in an embedded architecture, explain design constraints, and recognize embedded systems in real-world applications." },
            { title: "Main Topics", desc: "Embedded system components, Harvard vs von Neumann architectures, real-world application examples, design constraints: cost, power, and size." },
          ],
        },
      },
    ],
  },
  {
    id: "topic4",
    title: "Topic 4",
    items: [
      {
        type: "pdf",
        icon: "file-text",
        label: "Lecture 02 PIC microcontrollers",
        pdfPath: "/pdfs/lecture-02.pdf",
        preview: {
          summary: "Detailed tour of the PIC16F family: Harvard architecture, register banks, pin configuration, and the memory map you will reference every lab session.",
          estimatedTime: "55 min",
          cards: [
            { title: "Key Concepts", desc: "PIC16F uses a Harvard architecture with separate program and data memory buses, enabling faster and more predictable instruction execution." },
            { title: "Learning Outcomes", desc: "Read and interpret a PIC datasheet, configure I/O ports using TRIS registers, and navigate the Special Function Register map." },
            { title: "Main Topics", desc: "PIC16F block diagram, PORTA/PORTB/PORTC pin functions, TRIS and LAT registers, flash, SRAM, EEPROM, and SFR bank layout." },
          ],
        },
      },
      {
        type: "ppt",
        icon: "presentation",
        label: "Lecture 02 PIC microcontrollers",
        pdfPath: "/pdfs/lecture-02.pdf",
        preview: {
          summary: "Slide deck companion to the PDF — visual diagrams of PIC block diagrams, pin-out charts, and annotated register maps for quick lab reference.",
          estimatedTime: "55 min",
          cards: [
            { title: "Key Concepts", desc: "Visual block diagrams showing how the Harvard architecture separates program and data buses for improved instruction throughput." },
            { title: "Learning Outcomes", desc: "Use the slide diagrams during lab setup, reference the pinout charts while wiring, and recall register layouts from memory." },
            { title: "Main Topics", desc: "PIC16F block diagram slides, annotated pinout reference charts, color-coded SFR register maps, TRIS and PORT configuration examples." },
          ],
        },
      },
    ],
  },
  {
    id: "topic5",
    title: "Topic 5",
    items: [
      {
        type: "pdf",
        icon: "file-text",
        label: "Lecture 03 Clock oscillator",
        pdfPath: "/pdfs/lecture-03.pdf",
        preview: {
          summary: "Everything about clocking a PIC: oscillator types, CONFIG word settings, instruction cycle timing, and how to calculate precise software delays.",
          estimatedTime: "45 min",
          cards: [
            { title: "Key Concepts", desc: "The oscillator sets the fundamental timing of all PIC operations. Choosing the wrong type affects accuracy, power draw, and maximum operating speed." },
            { title: "Learning Outcomes", desc: "Select and configure an oscillator type via the CONFIG word, calculate instruction cycle time, and design accurate software delay routines." },
            { title: "Main Topics", desc: "Crystal, RC, and internal oscillators, CONFIG word oscillator bits, instruction cycle formula Tcy = 4/Fosc, delay loop design and calculations." },
          ],
        },
      },
    ],
  },
  {
    id: "topic6",
    title: "Topic 6",
    items: [
      {
        type: "pdf",
        icon: "file-text",
        label: "Lecture 04 Programming PIC Assembly",
        pdfPath: "/pdfs/lecture-04.pdf",
        preview: {
          summary: "Hands-on PIC assembly programming: file structure, the most-used instruction set, STATUS flags, and how to build counted loops and subroutines.",
          estimatedTime: "60 min",
          cards: [
            { title: "Key Concepts", desc: "PIC assembly programs are built from directives, labels, and instructions that operate directly on the W register and file registers." },
            { title: "Learning Outcomes", desc: "Write a valid PIC assembly program, use common instructions correctly, and implement counted delay loops and reusable subroutines." },
            { title: "Main Topics", desc: "Assembly file structure, MOVLW/MOVWF/ADDWF/SUBWF/BSF/BCF instructions, STATUS flags, DECFSZ and GOTO loops, CALL and RETURN." },
          ],
        },
      },
    ],
  },
  {
    id: "topic7",
    title: "Topic 7",
    items: [
      {
        type: "pdf",
        icon: "file-text",
        label: "Lecture 05 Programming microcontroller C",
        pdfPath: "/pdfs/lecture-05.pdf",
        preview: {
          summary: "Transition from assembly to embedded C with XC8: direct register access, bit manipulation, delay functions, and writing clean portable I/O drivers.",
          estimatedTime: "55 min",
          cards: [
            { title: "Key Concepts", desc: "Embedded C with XC8 gives direct access to hardware registers using C syntax, removing the need for hand-written assembly in most situations." },
            { title: "Learning Outcomes", desc: "Write and compile an XC8 C program, configure digital I/O registers in C, and use built-in delay functions with the correct clock settings." },
            { title: "Main Topics", desc: "volatile keyword and SFR access, TRISX/PORTX configuration, #pragma config bits, __delay_ms() and __delay_us() macros, _XTAL_FREQ definition." },
          ],
        },
      },
    ],
  },
];
