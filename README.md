# SpotLearn

A clean web prototype for **SpotLearn**, a student learning assistant integrated with a Moodle-style course page.

## About

SpotLearn is a UI-only prototype that simulates a modern LMS (Learning Management System) experience for the **Embedded Systems (COE349)** course. Each lecture has a SpotLearn button that would (in a full version) launch an AI-powered study assistant.

> **Note:** This is a frontend prototype only. There is no backend, no database, no real AI, and no real recording. All data is static/mock.

## Tech Stack

- **React** (with JSX)
- **Vite** (build tool)
- **Tailwind CSS** (utility-first styling via `@tailwindcss/vite`)
- **Lucide React** (icons)
- **JavaScript**

## How to Run Locally

```bash
# Clone the repo
git clone https://github.com/Ysf-Ibrahim/spotlearn2.0.git
cd spotlearn2.0

# Install dependencies
npm install

# Start development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
  App.jsx              # Main app layout
  main.jsx             # Entry point
  index.css            # Tailwind imports + base styles
  components/
    Header.jsx         # Top navigation bar
    CourseTabs.jsx     # Course/Grades/Competencies tabs
    Announcement.jsx   # Course announcement card
    TopicSection.jsx   # Collapsible topic with lecture items
    SpotLearnButton.jsx # SpotLearn action button
  data/
    courseData.js       # Mock course data
```

## License

MIT
