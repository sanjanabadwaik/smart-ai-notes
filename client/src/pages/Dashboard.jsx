import { Link, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Clock,
  Upload,
  Workflow,
  Book,
  FileText,
  Edit2,
  Users,
} from "lucide-react";
import {
  featureCards,
  progressStats,
  recentSummaries,
  uploadOptions,
} from "../data/mockData";
import SectionTitle from "../components/SectionTitle";
import IconBadge from "../components/IconBadge";
import React, { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

const ProgressCarousel = ({ stats }) => {
  const controls = useAnimation();
  const containerRef = useRef(null);
  const [items] = React.useState([...stats, ...stats]);
  const itemWidth = 288; // w-64 (256px) + gap-8 (32px) = 288px per item

  useEffect(() => {
    const totalDuration = 30; // seconds for one complete loop
    const totalWidth = itemWidth * (items.length / 2); // Width of one complete set of items
    
    const sequence = async () => {
      await controls.start({
        x: -totalWidth,
        transition: {
          duration: totalDuration,
          ease: "linear",
        }
      });
      
      // Reset position and restart animation
      controls.set({ x: 0 });
      sequence();
    };

    const timeout = setTimeout(sequence, 100);
    return () => clearTimeout(timeout);
  }, [controls, items.length]);

  return (
    <div className="relative overflow-hidden py-4">
      {/* Left gradient fade */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      
      {/* Carousel container */}
      <div className="overflow-x-hidden" ref={containerRef}>
        <motion.div 
          className="flex gap-8 w-max"
          animate={controls}
        >
          {items.map((stat, index) => (
            <div key={`${stat.id}-${index}`} className="w-64 flex-shrink-0">
              <article className="rounded-2xl p-5 text-white shadow-lg bg-indigo-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <p className="text-xs uppercase tracking-[0.4em] text-white/80">
                  {stat.label}
                </p>
                <p className="mt-4 text-3xl font-bold">{stat.value}</p>
                <p className={`mt-1 text-sm font-medium ${
                  stat.change.startsWith("+") ? "text-green-300" : "text-red-300"
                }`}>
                  {stat.change}
                </p>
              </article>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right gradient fade */}
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
    </div>
  );
};

const ProgressStatCard = ({ stat, index }) => {
  return (
    <div className="w-64 flex-shrink-0">
      <article className="rounded-2xl p-5 text-white shadow-lg bg-indigo-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <p className="text-xs uppercase tracking-[0.4em] text-white/80">{stat.label}</p>
        <p className="mt-4 text-3xl font-bold">{stat.value}</p>
        <p className={`mt-1 text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-300' : 'text-red-300'}`}>
          {stat.change}
        </p>
      </article>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();

  const handleUploadOptionClick = (optionId) => {
    navigate(`/upload?source=${optionId}`, { state: { sourceType: optionId } });
  };

  // Map feature names to icon names
  const featureIcons = {
    "Lecture Summarizer": "book",
    "Slide to Notes": "slides",
    "Auto Q&A Generator": "qa",
    "Community Notes Sharing": "community"
  };

  return (
    <div className="space-y-8">
      {/* Welcome Panel */}
      <section className="rounded-2xl bg-white/40 p-4 shadow-sm">
        <div className="flex flex-wrap gap-4">
          {/* LEFT PANEL */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-4">
              <IconBadge icon="grid" size={20} className="bg-indigo-100 text-indigo-600" />
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-600 font-medium">
                Unified AI pipeline
              </p>
            </div>

            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Welcome back! Your lecture lab is warmed up.
            </h1>

            <p className="text-gray-700">
              Resume unfinished summaries, upload new lectures, or jump straight
              into Q&A mode.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition"
              >
                Upload lecture
                <Upload size={16} />
              </Link>
              <Link
                to="/qa"
                className="inline-flex items-center gap-2 rounded-full border border-indigo-600 px-5 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition"
              >
                Generate Q&A
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow">
            <p className="text-xs uppercase tracking-[0.4em] text-gray-500 font-medium">
              Pipeline status
            </p>

            <div className="mt-4 space-y-3">
              {[
                { label: "Summaries rendering", value: "3 in queue" },
                { label: "Slides processing", value: "2 decks" },
                { label: "Community uploads", value: "18 today" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="text-gray-900 font-medium">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-100 p-4 text-sm">
              <p className="flex items-center gap-2 text-gray-700 font-medium">
                <Clock size={16} className="text-indigo-500" />
                Average turnaround
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                2m 40s / lecture
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Stats */}
      <section>
        <SectionTitle
          eyebrow="Progress"
          title="Your weekly pulse"
          description="Track generated notes, lecture uploads, and question packs."
        />
        <div className="mt-6">
          <div className="hidden md:block">
            <ProgressCarousel stats={progressStats} />
          </div>
          <div className="md:hidden grid gap-4 grid-cols-1">
            {progressStats.map((stat, idx) => (
              <ProgressStatCard key={stat.id} stat={stat} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Summaries & Quick Upload */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <SectionTitle
              eyebrow="Recent"
              title="Summaries timeline"
              description="Keep tabs on the latest lecture digests."
            />
            <Link to="/my-notes" className="text-indigo-600 hover:text-indigo-800 transition">
              View all
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {recentSummaries.map((summary) => (
              <div
                key={summary.id}
                className="flex flex-wrap justify-between gap-4 rounded-2xl border border-gray-200 p-5 hover:bg-gray-50 transition"
              >
                <div className="flex-1">
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
                    {summary.course}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {summary.snippet}
                  </p>
                </div>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>{summary.timeAgo}</p>
                  <p className="font-medium">{summary.status}</p>
                  <p>{summary.tone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <SectionTitle
            eyebrow="Quick upload"
            title="Drop a lecture"
            description="Pick the format that fits your source."
          />
          <div className="mt-6 space-y-4">
            {uploadOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className="w-full rounded-2xl border border-gray-200 p-4 text-left hover:bg-gray-50 transition"
                onClick={() => handleUploadOptionClick(option.id)}
              >
                <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
                  {option.label}
                </p>
                <p className="mt-2 text-base font-semibold text-gray-900">
                  {option.description}
                </p>
                <p className="text-sm text-gray-400">{option.sampleName}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Workflows */}
      <section>
        <SectionTitle
          eyebrow="Workflows"
          title="Choose the right AI path"
          description="Single-click flows tuned for each study milestone."
          align="center"
        />

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {featureCards.map((card, idx) => {
            const Icon = featureIcons[card.title] || Book;
            return (
              <div
                key={card.title}
                className="flex items-start gap-4 rounded-2xl p-5 shadow hover:shadow-lg hover:-translate-y-1 transition bg-gray-50"
              >
                <IconBadge icon={Icon} />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{card.title}</h3>
                  <p className="mt-2 text-sm text-gray-700">{card.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
