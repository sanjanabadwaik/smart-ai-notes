import React, { useEffect, useState } from "react";
import { Download, Eye, Share2, Trash2 } from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import api from "../lib/api";
import jsPDF from "jspdf";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const MyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [viewNote, setViewNote] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await api.get("/notes");
        setNotes(data.notes || []);
      } catch (err) {
        console.error("Failed to load notes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const filteredNotes =
    filter === "All" ? notes : notes.filter((n) => n.status === filter);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success("Note deleted successfully");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const handleDownload = (note) => {
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text(note.title, 10, 20);

    const content = note.content.replace(/```json|```/g, "");
    const lines = pdf.splitTextToSize(content, 180);
    pdf.setFontSize(12);
    pdf.text(lines, 10, 35);

    pdf.save(`${note.title || "note"}.pdf`);
  };

  const handleShare = async (note) => {
    const pdf = new jsPDF();
    pdf.text(note.title, 10, 20);
    pdf.text(note.content, 10, 35);

    const blob = pdf.output("blob");
    const file = new File([blob], `${note.title}.pdf`, {
      type: "application/pdf",
    });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({ title: note.title, files: [file] });
    } else {
      toast.error("File sharing not supported");
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading notes…</p>;
  }

  return (
    <div className="space-y-8 text-gray-900">
      <SectionTitle
        eyebrow="My notes"
        title="Your personal knowledge base"
        description="Edit, export, or share notes with a single click."
      />

      {/* Filter */}
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-40 rounded-xl border border-gray-300 bg-white px-4 py-2
                   text-sm focus:border-indigo-500 focus:outline-none"
      >
        {["All", "Draft", "Ready", "Shared"].map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {notes.length === 0 ? (
        <p className="text-gray-500">No notes saved yet.</p>
      ) : (
        <motion.div 
        className="grid gap-6 md:grid-cols-2"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
          {filteredNotes.map((note, index) => (
            <motion.article
              key={note._id}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 10
                  }
                }
              }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                    {note.sourceType || "NOTE"}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">{note.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span className="inline-flex items-center text-xs font-medium text-gray-500">
                  #{note._id.slice(-6)}
                </span>
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => setViewNote(note)}
                  className="btn-outline"
                >
                  <Eye size={16} /> View
                </button>

                <button
                  onClick={() => handleDownload(note)}
                  className="btn-outline"
                >
                  <Download size={16} /> PDF
                </button>

                <button
                  onClick={() => handleShare(note)}
                  className="btn-outline"
                >
                  <Share2 size={16} /> Share
                </button>

                <button
                  onClick={() => handleDelete(note._id)}
                  className="btn-danger"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {viewNote && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ 
                type: "spring",
                damping: 25,
                stiffness: 300
              }}
            >
            <div className="mb-4 flex justify-between">
              <h2 className="text-2xl font-semibold">{viewNote.title}</h2>
              <button
                onClick={() => setViewNote(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto rounded-xl bg-gray-50 p-4 text-sm">
              <pre className="whitespace-pre-wrap font-sans">
                {viewNote.content.replace(/```json|```/g, "")}
              </pre>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => handleDownload(viewNote)}
                className="btn-outline"
              >
                <Download size={16} /> PDF
              </button>

              <button
                onClick={() => handleShare(viewNote)}
                className="btn-outline"
              >
                <Share2 size={16} /> Share
              </button>

              <button
                onClick={() => setViewNote(null)}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
              >
                Close
              </button>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyNotes;
