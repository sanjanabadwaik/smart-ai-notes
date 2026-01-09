import React from "react";
import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import IconBadge from "./IconBadge";

const ProcessingPipeline = () => {
  const phases = [
    {
      title: "Ingest",
      description:
        "Remove noise, detect segments, and align slides to timestamps.",
      icon: "upload",
    },
    {
      title: "Understand",
      description:
        "Topic clustering, glossary detection, and key frame extraction.",
      icon: "spark",
    },
    {
      title: "Summarize",
      description:
        "Short, detailed, and bullet modes created at once.",
      icon: "book",
    },
    {
      title: "Distribute",
      description:
        "Notes ready for community sharing, PDF export, or LMS sync.",
      icon: "community",
    },
  ];

  return (
    <section className="space-y-10">
      <SectionTitle
        eyebrow="Processing pipeline"
        title="What happens after upload?"
        description="The orchestrator runs audio extraction, transcription, slide parsing, and summary generation."
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 md:grid-cols-4"
      >
        {phases.map((phase, i) => (
          <motion.article
            key={phase.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -6 }}
            className="group rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-xl"
          >
            {/* Header row */}
            <div className="flex items-center gap-3">
              <IconBadge
                icon={phase.icon}
                className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600"
              />

              <h3 className="text-lg font-semibold text-gray-900">
                {phase.title}
              </h3>
            </div>

            {/* Description */}
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              {phase.description}
            </p>

            {/* Hover accent */}
            <div className="mt-5 h-1 w-10 rounded-full bg-indigo-500 opacity-0 transition group-hover:opacity-100" />
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
};

export default ProcessingPipeline;
