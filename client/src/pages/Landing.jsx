import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  ArrowRight,
  CheckCircle2,
  CloudUpload,
  PenSquare,
  Shield, 
  TimerReset,
  Users,
  FileText,
  FileStack,
  BrainCircuit,
  MessageSquareText,
  Lightbulb,
  BookOpenText,
  GraduationCap,
  BarChart2,
  Layers,
  BookMarked,
  Upload,
  Edit3,
  Share2,
  User,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  RefreshCw,
} from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import IconBadge from "../components/IconBadge";
import { featureCards } from "../data/mockData";

const Landing = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides every 2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 4); // 4 types of content
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleUploadClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate("/login", { state: { from: "/upload" } });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="group flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white transition-transform duration-300 group-hover:rotate-12">
              <GraduationCap className="text-white" size={24} />
              </span>
              <div className="text-left">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Smart Notes
                </p>
                <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent">
                  AI Lecture Lab
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-1 text-sm font-medium text-gray-600 md:flex">
              {[
                { name: 'Features', icon: <Lightbulb size={16} className="mr-2" /> },
                { name: 'Workflow', icon: <Layers size={16} className="mr-2" /> },
                { name: 'Community', icon: <Users size={16} className="mr-2" /> },
              ].map((item) => (
                <a
                  key={item.name}
                  href={`#${item.name.toLowerCase()}`}
                  className="flex items-center rounded-lg px-4 py-2.5 transition-all hover:bg-gray-50 hover:text-blue-600"
                >
                  {item.icon}
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="group relative">
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200">
                  <User size={20} />
                </button>
                <div className="invisible absolute right-0 mt-2 w-48 origin-top-right scale-95 rounded-xl bg-white p-2 opacity-0 shadow-lg ring-1 ring-black/5 transition-all duration-200 group-hover:visible group-hover:scale-100 group-hover:opacity-100">
                  <Link
                    to="/dashboard"
                    className="flex w-full items-center rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <LayoutDashboard size={16} className="mr-2" />
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="flex w-full items-center rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User size={16} className="mr-2" />
                    Profile
                  </Link>
                  <div className="my-1 border-t border-gray-100"></div>
                  <Link
                    to="/logout"
                    className="flex w-full items-center rounded-lg px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign out
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="flex items-center rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-blue-300 hover:shadow-md"
                >
                  <LogIn size={16} className="mr-2" />
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="hidden items-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg hover:shadow-blue-100 sm:flex"
                >
                  <UserPlus size={16} className="mr-2" />
                  Create account
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden">
              <Menu size={24} />
            </button>
          </div>

          {/* Mobile menu */}
          <div className="mt-2 hidden rounded-xl bg-white p-4 shadow-lg md:hidden">
            <nav className="flex flex-col space-y-2">
              {[
                { name: 'Features', icon: <Lightbulb size={16} className="mr-2" /> },
                { name: 'Workflow', icon: <Layers size={16} className="mr-2" /> },
                { name: 'Community', icon: <Users size={16} className="mr-2" /> },
              ].map((item) => (
                <a
                  key={item.name}
                  href={`#${item.name.toLowerCase()}`}
                  className="flex items-center rounded-lg px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                >
                  {item.icon}
                  {item.name}
                </a>
              ))}
            </nav>
            <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
              <Link
                to="/login"
                className="flex w-full items-center justify-center rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-blue-300"
              >
                <LogIn size={16} className="mr-2" />
                Sign in
              </Link>
              <Link
                to="/register"
                className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-md hover:shadow-lg hover:shadow-blue-100"
              >
                <UserPlus size={16} className="mr-2" />
                Create account
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-16">
        <section className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8 text-center lg:text-left">

            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Turn Lectures into{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Smart Notes
              </span>{" "}
              using AI
            </h1>

            <p className="mx-auto max-w-2xl text-lg leading-8 text-gray-600 lg:mx-0">
              Transform your learning experience with AI-powered summarization,
              slide conversion, and automated Q&A generation. Join a community
              of focused learners today.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-3.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition"
              >
                Get Started
                <ArrowRight
                  className="animate-bounce-x transition group-hover:translate-x-1"
                  size={18}
                />
              </Link>
              <style jsx global>{`
                @keyframes bounce-x {
                  0%, 100% { transform: translateX(0); }
                  50% { transform: translateX(4px); }
                }
                @keyframes scaleUpDown {
                  0%, 100% { 
                    transform: scale(1);
                    opacity: 0.8;
                  }
                  50% { 
                    transform: scale(1.08); 
                    opacity: 1;
                  }
                }
                .animate-bounce-x {
                  animation: bounce-x 2s ease-in-out infinite;
                }
                @keyframes statPulse1 {
                  0%, 100% { transform: scale(1); opacity: 0.8; }
                  16.66%, 33.33% { transform: scale(1.08); opacity: 1; }
                  33.34%, 100% { transform: scale(1); opacity: 0.8; }
                }
                @keyframes statPulse2 {
                  0%, 33.33% { transform: scale(1); opacity: 0.8; }
                  50%, 66.66% { transform: scale(1.08); opacity: 1; }
                  66.67%, 100% { transform: scale(1); opacity: 0.8; }
                }
                @keyframes statPulse3 {
                  0%, 66.66% { transform: scale(1); opacity: 0.8; }
                  83.33%, 100% { transform: scale(1.08); opacity: 1; }
                }
                .stat-animation-1 {
                  animation: statPulse1 6s ease-in-out infinite;
                }
                .stat-animation-2 {
                  animation: statPulse2 6s ease-in-out infinite;
                }
                .stat-animation-3 {
                  animation: statPulse3 6s ease-in-out infinite;
                }
              `}</style>
              <Link
                to={isAuthenticated ? "/upload" : "#"}
                onClick={handleUploadClick}
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:border-blue-400 hover:shadow-md transition"
              >
                Upload Lecture
                <CloudUpload size={18} />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Lectures Summarized", value: "42K+", index: 1 },
                { label: "Questions Generated", value: "1.2M+", index: 2 },
                { label: "Community Notes", value: "8.7K", index: 3 },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`rounded-2xl bg-gradient-to-r from-blue-50 to-green-50 p-4 text-center shadow-md hover:shadow-lg transition-all duration-300 stat-animation-${stat.index}`}
                  style={{
                    transformOrigin: 'center bottom'
                  }}
                >
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-700">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL - Lecture Slideshow */}
          <div className="relative">
            <div className="rounded-2xl bg-gray-50 p-6 shadow-md overflow-hidden">
               

              {/* Slideshow Container */}
              <div className="relative h-70 rounded-xl overflow-hidden bg-black/5">
                {[
                  {
                    id: 'youtube',
                    type: 'YouTube Video',
                    title: "Neural Networks Explained",
                    description: "Watch the full lecture on neural networks and deep learning concepts.",
                    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                    icon: '▶️',
                    url: "https://youtube.com/embed/example1"
                  },
                  {
                    id: 'pdf',
                    type: 'Lecture Notes',
                    title: "Deep Learning Fundamentals",
                    description: "Download the complete lecture notes in PDF format.",
                    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
                    icon: '📄',
                    url: "#"
                  },
                  {
                    id: 'audio',
                    type: 'Audio Lecture',
                    title: "AI Lecture Series",
                    description: "Listen to the complete audio lecture on your device.",
                    image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
                    icon: '🔊',
                    url: "#"
                  },
                  {
                    id: 'code',
                    type: 'Code Examples',
                    title: "Neural Network Implementation",
                    description: "Access Jupyter notebooks with practical examples.",
                    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                    icon: '💻',
                    url: "#"
                  }
                ].map((content, index) => (
                  <div 
                    key={content.id}
                    className={`absolute inset-0 transition-all duration-500 ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                      ...(content.id === 'code' ? {
                        backgroundColor: '#0f172a',
                        backgroundImage: `url(${content.image})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        padding: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      } : {
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${content.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      })
                    }}
                  >
                    <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                          {content.type}
                        </span>
                      </div>
                      
                      <div className="text-center">
                        <h4 className="text-2xl font-bold">{content.title}</h4>
                        <p className="mt-2 text-gray-200">{content.description}</p>
                        <a 
                          href={content.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
                        >
                          {content.icon} Open {content.type.split(' ')[0]}
                        </a>
                      </div>
                      
                      <div className="flex justify-center space-x-2">
                        {[0, 1, 2, 3].map((dot) => (
                          <button 
                            key={dot}
                            onClick={() => setCurrentSlide(dot)}
                            className={`h-2 w-2 rounded-full transition-all ${currentSlide === dot ? 'w-6 bg-white' : 'bg-white/30'}`}
                            aria-label={`Go to slide ${dot + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Bar with Time Indicator */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Processing...</span>
                  <span>3s</span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(currentSlide + 1) * 25}%`,
                      transition: 'width 2s linear'
                    }}
                  ></div>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-gray-800">
                {[
                  { id: 1, text: "Parsing lecture audio...", completed: true },
                  { id: 2, text: "Detecting slide transitions...", completed: true },
                  { id: 3, text: "Extracting core arguments...", completed: true },
                  { id: 4, text: "Generating quiz-ready prompts...", completed: false },
                ].map((step) => (
                  <div key={step.id} className="flex items-center gap-3">
                    {step.completed ? (
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 flex-shrink-0 rounded-full border-2 border-gray-300"></div>
                    )}
                    <span className={step.completed ? 'text-gray-500' : 'font-medium'}>{step.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mt-32">
          <div className="mx-auto max-w-4xl text-center">
            <SectionTitle
              eyebrow="Key Features"
              title="Everything you need to conquer lecture overload"
              description="Mix and match AI workflows tailored for lecture, slide, and study note formats."
              align="center"
            />
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Lecture Summarizer",
                description:
                  "Upload full-length lectures and receive concise, structured study notes in seconds.",
                icon: <FileText className="h-6 w-6" />,
                color: "from-blue-500 to-blue-600",
              },
              {
                title: "Slide to Notes",
                description:
                  "Transform bulky slide decks into streamlined, human-friendly notes with citations.",
                icon: <FileStack className="h-6 w-6" />,
                color: "from-emerald-500 to-emerald-600",
              },
              {
                title: "Q&A Generator",
                description:
                  "Create MCQs, short answers, and long-form questions based on any set of notes.",
                icon: <MessageSquareText className="h-6 w-6" />,
                color: "from-violet-500 to-violet-600",
              },
              {
                title: "Smart Insights",
                description:
                  "Get key insights and connections from your study materials automatically.",
                icon: <Lightbulb className="h-6 w-6" />,
                color: "from-amber-500 to-amber-600",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-3 text-gray-600">{feature.description}</p>
                <div className="mt-4 flex items-center text-sm font-medium text-blue-600">
                  Learn more
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
                <div
                  className={`absolute -right-10 -bottom-10 h-20 w-20 rounded-full bg-gradient-to-br ${feature.color} opacity-0 transition-all duration-300 group-hover:opacity-10`}
                />
              </div>
            ))}
          </div>
        </section>

        <section
          id="workflow"
          className="relative mt-15 overflow-hidden bg-white py-15"
        >
          {/* Background pattern */}
          <div className="absolute left-1/2 top-0 -z-10 h-full w-full -translate-x-1/2 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>

          <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <SectionTitle
                eyebrow="How It Works"
                title="Streamline your study process"
                description="From lecture to notes in minutes with our AI-powered workflow"
                align="center"
              />
            </div>

            <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-start">
              {/* Left column: Workflow steps */}
              <div className="space-y-8">
                {[
                  {
                    title: "Upload & Detect",
                    description:
                      "Upload any format - audio, video, slides, or transcripts. Our AI will automatically detect and process the content.",
                    icon: <Upload className="h-4 w-4" />,
                    color: "from-blue-500 to-blue-600",
                  },
                  {
                    title: "AI Processing",
                    description:
                      "Our system extracts key concepts, generates summaries, and identifies important information using advanced NLP.",
                    icon: <BrainCircuit className="h-4 w-4" />,
                    color: "from-purple-500 to-purple-600",
                  },
                  {
                    title: "Review & Refine",
                    description:
                      "Easily edit and organize your notes. Add your own insights and highlight important sections.",
                    icon: <Edit3 className="h-4 w-4" />,
                    color: "from-emerald-500 to-emerald-600",
                  },
                  {
                    title: "Export & Share",
                    description:
                      "Export to your preferred format or share directly with classmates. Your notes, your way.",
                    icon: <Share2 className="h-4 w-4" />,
                    color: "from-amber-500 to-amber-600",
                  },
                ].map((step, index) => (
                  <div
                    key={step.title}
                    className="group relative flex gap-6 rounded-2xl bg-white/50 p-6 backdrop-blur-sm transition-all hover:bg-white hover:shadow-md"
                  >
                    <div
                      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${step.color} text-white shadow-md`}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">
                          Step {index + 1}
                        </span>
                        <div className="h-px w-4 bg-gray-200"></div>
                      </div>
                      <h4 className="mt-1 text-lg font-semibold text-gray-900">
                        {step.title}
                      </h4>
                      <p className="mt-2 text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right column: Feature showcase */}
              <div className="space-y-8">
                {/* Seamless Integrations */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900">Seamless Integrations</h3>
                  <p className="mt-2 text-gray-600">Connect with your favorite tools and streamline your workflow.</p>
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    {[
                      {
                        name: "Google Drive",
                        icon: (
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg"
                            alt="Google Drive"
                            className="h-6 w-6"
                          />
                        ),
                      },
                      {
                        name: "Dropbox",
                        icon: (
                          <img
                            src="https://www.dropbox.com/static/30168/images/favicon.ico"
                            alt="Dropbox"
                            className="h-6 w-6"
                          />
                        ),
                      },
                      {
                        name: "OneDrive",
                        icon: (
                          <img
                            src="https://img.icons8.com/color/96/000000/microsoft-onedrive-2019--v2.png"
                            alt="OneDrive"
                            className="h-6 w-6"
                          />
                        ),
                      },
                      {
                        name: "Notion",
                        icon: (
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png"
                            alt="Notion"
                            className="h-6 w-6"
                          />
                        ),
                      },
                      {
                        name: "Evernote",
                        icon: (
                          <img
                            src="https://www.evernote.com/favicon.ico"
                            alt="Evernote"
                            className="h-6 w-6"
                          />
                        ),
                      },
                      {
                        name: "Canvas",
                        icon: (
                          <img
                            src="https://www.instructure.com/favicon.ico"
                            alt="Canvas"
                            className="h-6 w-6"
                          />
                        ),
                      },
                    ].map((app) => (
                      <div
                        key={app.name}
                        className="flex flex-col items-center gap-2"
                      >
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-50">
                          {app.icon}
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          {app.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="community" className="from-gray-50 to-blue-50 py-15">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <SectionTitle
                eyebrow="Community"
                title="Join the learning revolution"
                description="Connect with students worldwide, share insights, and discover new ways to learn together."
                align="center"
              />
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Subject Hubs",
                  description:
                    "Join specialized communities for your field of study. Share notes, ask questions, and learn from peers.",
                  icon: <BookOpenText className="h-6 w-6" />,
                  stats: "12+ disciplines",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  title: "Study Groups",
                  description:
                    "Form or join study groups, schedule sessions, and collaborate in real-time with integrated video calls.",
                  icon: <Users className="h-6 w-6" />,
                  stats: "5K+ active groups",
                  color: "from-emerald-500 to-emerald-600",
                },
                {
                  title: "Knowledge Exchange",
                  description:
                    "Earn points for helpful contributions and exchange them for premium features or tutoring sessions.",
                  icon: <GraduationCap className="h-6 w-6" />,
                  stats: "50K+ exchanges",
                  color: "from-violet-500 to-violet-600",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:ring-1 hover:ring-opacity-10 hover:ring-blue-200"
                >
                  <div
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-md`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-6 flex items-center text-sm font-medium text-blue-600">
                    <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium">
                      {feature.stats}
                    </span>
                    <span className="ml-auto flex items-center text-sm font-medium">
                      Explore
                      <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                  <div
                    className={`absolute -right-10 -bottom-10 h-24 w-24 rounded-full bg-gradient-to-br ${feature.color} opacity-0 transition-all duration-300 group-hover:opacity-10`}
                  />
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="mt-20 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-xl">
              <div className="mx-auto max-w-3xl text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <blockquote className="mt-6 text-lg font-medium leading-relaxed">
                  "This platform transformed how I study. The collaborative
                  features helped me connect with study partners from around the
                  world."
                </blockquote>
                <div className="mt-6">
                  <div className="font-semibold">Sarah Johnson</div>
                  <div className="text-sm text-blue-100">
                    Computer Science, Stanford
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-20 rounded-2xl bg-white p-8 shadow-sm sm:p-10">
              <div className="md:flex md:items-center md:justify-between">
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Ready to boost your learning?
                  </h3>
                  <p className="mt-2 max-w-2xl text-gray-600">
                    Join thousands of students who are already studying smarter
                    with our AI-powered platform.
                  </p>
                </div>
                <div className="mt-6 flex gap-4 md:mt-0">
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md"
                  >
                    Get Started for Free
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Smart Notes Generator
      </footer>
    </div>
  );
};

export default Landing;
