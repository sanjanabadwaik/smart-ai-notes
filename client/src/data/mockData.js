export const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "grid" },
  { id: "upload", label: "Upload Lecture", icon: "upload" },
  { id: "slides", label: "Slide to Notes", icon: "slides" },
  { id: "qa", label: "Q&A Generator", icon: "qa" },
  { id: "community", label: "Community Notes", icon: "community" },
  { id: "my-notes", label: "My Notes", icon: "folder" },
  { id: "settings", label: "Settings", icon: "settings" },
];

export const featureCards = [
  {
    title: "Lecture Summarizer",
    description:
      "Upload full-length lectures and receive concise, structured study notes in seconds.",
    icon: "spark",
  },
  {
    title: "Slide to Notes",
    description:
      "Transform bulky slide decks into streamlined, human-friendly notes with citations.",
    icon: "slides",
  },
  {
    title: "Auto Q&A Generator",
    description:
      "Create MCQs, short answers, and long-form questions based on any set of notes.",
    icon: "qa",
  },
  {
    title: "Community Notes Sharing",
    description:
      "Publish your best summaries, collaborate with peers, and crowdsource clarity.",
    icon: "community",
  },
];

export const recentSummaries = [
  {
    id: 1,
    course: "Neural Networks 101",
    timeAgo: "12m ago",
    status: "Ready",
    tone: "Detailed",
    snippet: "Backpropagation pipeline with gradient tracking visuals.",
  },
  {
    id: 2,
    course: "Cognitive Psychology",
    timeAgo: "1h ago",
    status: "In Review",
    tone: "Bullet points",
    snippet: "Memory models vs. learning strategies cheat sheet.",
  },
  {
    id: 3,
    course: "Quantum Mechanics",
    timeAgo: "3h ago",
    status: "Shared",
    tone: "Short",
    snippet: "Wave-particle duality recap with diagrams.",
  },
];

export const progressStats = [
  {
    id: "notes",
    label: "Notes Generated",
    value: "128",
    change: "+18% this week",
  },
  {
    id: "lectures",
    label: "Lectures Notes",
    value: "42",
    change: "+6 new uploads",
  },
  {
    id: "questions",
    label: "Questions Created",
    value: "310",
    change: "+42 auto Q&A",
  },
  {
    id: "flashcards",
    label: "Flashcards Created",
    value: "245",
    change: "+35 this week",
  },
  {
    id: "activeUsers",
    label: "Active Users",
    value: "87",
    change: "+12 new learners",
  },
  {
    id: "communityNotes",
    label: "Community Notes",
    value: "58",
    change: "+8 shared",
  },
];


export const uploadOptions = [
  {
    id: "document",
    label: "PDF / Word",
    description: "Upload lecture notes or documents",
    sampleName: "lecture-notes.pdf / notes.docx",
  },
  {
    id: "video",
    label: "Video File",
    description: "MP4 or MOV lecture captures",
    sampleName: "cs431-guest.mov",
  },
  {
    id: "text",
    label: "Raw Text",
    description: "Paste transcripts or outlines",
    sampleName: "Paste transcript...",
  },
  {
    id: "youtube",
    label: "YouTube Link",
    description: "Add public or unlisted talks",
    sampleName: "https://youtu.be/...",
  },
];

export const slidePreviews = [
  { id: 1, title: "Slide 1 – Introduction", status: "Processed" },
  { id: 2, title: "Slide 2 – Key Concepts", status: "Analyzing" },
  { id: 3, title: "Slide 3 – Case Study", status: "Queued" },
];

export const qaPreview = [
  {
    id: 1,
    type: "MCQ",
    question: "Which layer captures contextual memory in LSTMs?",
    answer: "The cell state coupled with gated updates.",
    difficulty: "Medium",
  },
  {
    id: 2,
    type: "Short Answer",
    question: "Define cognitive load theory.",
    answer:
      "It explains how working memory capacity impacts learning efficiency.",
    difficulty: "Easy",
  },
  {
    id: 3,
    type: "Long Answer",
    question: "Contrast supervised and unsupervised learning outcomes.",
    answer:
      "Supervised learning relies on labeled datasets to map inputs to outputs, whereas unsupervised learning uncovers hidden patterns or groupings without explicit labels.",
    difficulty: "Hard",
  },
];

export const communityNotes = [
  {
    id: 1,
    title: "Modern Physics Crash Kit",
    subject: "Physics",
    likes: 312,
    comments: 28,
    bookmarks: 120,
    overview: "20-page digest covering relativity, quantum states, and labs.",
    author: "Aditi Verma",
  },
  {
    id: 2,
    title: "Cognitive Bias Playbook",
    subject: "Psychology",
    likes: 221,
    comments: 43,
    bookmarks: 98,
    overview:
      "Interactive summaries of 15+ biases with scenarios and reflection prompts.",
    author: "Leo Turner",
  },
  {
    id: 3,
    title: "Distributed Systems Field Notes",
    subject: "Computer Science",
    likes: 442,
    comments: 64,
    bookmarks: 205,
    overview:
      "Failures, consensus, and tracing cheatsheet compiled from weekly seminars.",
    author: "Mia Chen",
  },
];

export const myNotes = [
  {
    id: 1,
    title: "Econometrics Midterm Pack",
    updated: "Updated 2 days ago",
    status: "Draft",
  },
  {
    id: 2,
    title: "Human Anatomy Lab Prep",
    updated: "Shared yesterday",
    status: "Shared",
  },
  {
    id: 3,
    title: "Deep Learning Cheatsheet",
    updated: "Updated 4 hours ago",
    status: "Ready",
  },
];

export const subjects = ["Physics", "Psychology", "Computer Science", "Math"];

export const summaryTypes = ["short", "detailed", "bullet"];

export const questionTypes = ["MCQ", "Short Answer", "Long Answer"];

export const difficultyLevels = ["Easy", "Medium", "Hard"];

export const languages = ["English", "Spanish", "French", "German", "Hindi"];
