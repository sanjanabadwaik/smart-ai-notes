import React, { useEffect, useState, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "../components/SectionTitle";
import { getCommunityNotes } from "../services/community.service";
import { communityNotes as dummyNotes } from "../data/mockData";

const CommunityNotes = () => {
  const [notes, setNotes] = useState([]);
  const [subject, setSubject] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [usingSample, setUsingSample] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getCommunityNotes(subject);

        if (data?.length) {
          setNotes(data);
          setUsingSample(false);
        } else if (!mounted.current) {
          setNotes(dummyNotes);
          setUsingSample(true);
        }
      } catch {
        setNotes(dummyNotes);
        setUsingSample(true);
      } finally {
        mounted.current = true;
        setLoading(false);
      }
    };

    load();
  }, [subject]);

  return (
    <div className="space-y-10">
      <SectionTitle
        eyebrow="Community"
        title="Explore public study vaults"
        description="Browse curated notes, remix them, and share your insights."
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All subjects</option>
          {[...new Set(notes.map((n) => n.subject).filter(Boolean))].map(
            (s) => (
              <option key={s}>{s}</option>
            )
          )}
        </select>

        <button className="rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:border-indigo-400">
          Trending
        </button>
        <button className="rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:border-indigo-400">
          Most liked
        </button>
      </div>

      {/* Content */}
      <AnimatePresence>
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 md:grid-cols-2"
          >
            {notes.map((note, i) => (
              <motion.article
                key={note._id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative rounded-[2rem] bg-white border border-gray-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
              >
                {usingSample && (
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-amber-300 px-3 py-1 text-xs font-semibold text-amber-900">
                    <Sparkles size={12} /> Sample
                  </span>
                )}

                <p className="text-xs uppercase tracking-widest text-gray-400">
                  {note.subject}
                </p>

                <h3 className="mt-2 text-xl font-semibold text-gray-900">
                  {note.title}
                </h3>

                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {note.overview || note.content}
                </p>

                <p className="mt-3 text-sm text-gray-500">
                  By {note.user?.name || "Anonymous"}
                </p>

                <div className="mt-5 flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1 hover:text-rose-500 cursor-pointer">
                    <Heart size={16} /> {note.likes?.length || 120}
                  </span>
                  <span className="flex items-center gap-1 hover:text-emerald-600 cursor-pointer">
                    <MessageCircle size={16} /> {note.comments?.length || 40}
                  </span>
                  <span className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer">
                    <Share2 size={16} /> {note.shares?.length || 540}
                  </span>

                  <button
                    onClick={() => setSelected(note)}
                    className="ml-auto rounded-full bg-indigo-600 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-indigo-500"
                  >
                    View note
                  </button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  {selected.subject}
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-gray-900">
                  {selected.title}
                </h2>
                <p className="text-sm text-gray-600">
                  By {selected.user?.name || "Anonymous"}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-full border border-gray-300 p-2 text-gray-500 hover:border-rose-400 hover:text-rose-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 text-sm text-gray-700 leading-relaxed max-h-[60vh] overflow-y-auto">
              {selected.content || selected.overview}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityNotes;
