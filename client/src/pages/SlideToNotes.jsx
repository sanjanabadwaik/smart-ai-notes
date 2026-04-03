import React, { useState, useRef, useEffect } from "react";
import {
  Eye,
  Loader2,
  Presentation,
  Upload,
  FileText,
  Check,
} from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import api from "../lib/api";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import { languages } from "../data/mockData";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const SlideToNotes = () => {
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  const [slides, setSlides] = useState([]);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [summaryType, setSummaryType] = useState("bullet");
  const [language, setLanguage] = useState("English");
  const [converted, setConverted] = useState(null);

  const [conversionModes, setConversionModes] = useState([
    {
      id: "outline",
      title: "Outline mode",
      description: "Capture slide headings into a structured outline.",
      active: true,
    },
    {
      id: "narrative",
      title: "Narrative mode",
      description: "Expand slides into readable paragraphs.",
      active: false,
    },
    {
      id: "flashcard",
      title: "Flashcard mode",
      description: "Generate question–answer flashcards.",
      active: false,
    },
  ]);

  const [outputFormats, setOutputFormats] = useState([
    { id: "pdf", name: "PDF document", selected: true },
    { id: "notion", name: "Notion doc", selected: false },
    { id: "markdown", name: "Markdown export", selected: false },
  ]);

  /* ---------------- Upload ---------------- */
  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    const validTypes = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    const invalid = Array.from(files).filter(
      (file) => !validTypes.includes(file.type)
    );

    if (invalid.length) {
      setError("Only PDF or PowerPoint files are allowed.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const processed = Array.from(files).map((file, index) => ({
        id: `${Date.now()}-${index}`,
        title: file.name.replace(/\.[^/.]+$/, ""),
        status: "Processed",
        file,
        preview: URL.createObjectURL(file),
        keyPoints: [
          `Key point 1 from ${file.name}`,
          `Key point 2 from ${file.name}`,
          `Key point 3 from ${file.name}`,
        ],
      }));

      setSlides((prev) => [...prev, ...processed]);
      if (!selectedSlide) setSelectedSlide(processed[0]);
      toast.success("Slides uploaded successfully");
    } catch {
      setError("Failed to process files. Try again.");
      toast.error("Failed to process files. Try again.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  /* ---------------- Convert ---------------- */
  const handleConvert = async () => {
    if (!selectedSlide?.file) {
      setError("Select a slide deck to convert.");
      return;
    }

    setIsConverting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedSlide.file);
      formData.append("summaryType", summaryType);
      formData.append("language", language);
      formData.append(
        "title",
        selectedSlide.title || "Slides Conversion"
      );

      const { data } = await api.post("/slides/convert", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const payload = data?.data;
      if (!payload?.note && !payload?.structuredNotes) {
        throw new Error("Invalid response from server");
      }

      setConverted({
        note: payload.note,
        structuredNotes: payload.structuredNotes,
      });
      toast.success("Slides converted successfully ✨");
      // Scroll to results section
      setTimeout(() => {
        document.getElementById("slides-results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Conversion failed"
      );
      toast.error(
        err?.response?.data?.message || err?.message || "Conversion failed"
      );
    } finally {
      setIsConverting(false);
    }
  };

  /* ---------------- Toggles ---------------- */
  const toggleConversionMode = (id) => {
    setConversionModes((prev) => prev.map((m) => ({ ...m, active: m.id === id })));

    if (id === "outline") setSummaryType("bullet");
    if (id === "narrative") setSummaryType("detailed");
    if (id === "flashcard") setSummaryType("short");
  };

  const toggleOutputFormat = (id) => {
    setOutputFormats((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, selected: !f.selected } : f
      )
    );
  };

  const handleDownloadPdf = () => {
    if (!converted?.note) return;
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text(converted.note.title || "Slides Conversion", 10, 20);

    const content = (converted.note.content || "").replace(/```json|```/g, "");
    const lines = pdf.splitTextToSize(content, 180);
    pdf.setFontSize(12);
    pdf.text(lines, 10, 35);
    pdf.save(`${converted.note.title || "slides"}.pdf`);
  };

  const handleSaveNotes = async () => {
    if (!converted?.note) return;
    if (!user) {
      toast.error("You must be logged in to save notes");
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        title: converted.note.title,
        content: converted.note.content,
        keyPoints: Array.isArray(converted.structuredNotes?.takeaways)
          ? converted.structuredNotes.takeaways
          : [],
        highlights: Array.isArray(converted.structuredNotes?.sections)
          ? converted.structuredNotes.sections.flatMap((section) =>
              Array.isArray(section?.bullets) ? section.bullets.slice(0, 1) : []
            )
          : [],
        sourceType: "slides",
        summaryType,
        language,
        user: user._id,
      };

      await api.post("/notes", payload);
      toast.success("Notes saved successfully! 📝");
    } catch (error) {
      console.error("Error saving notes:", error);
      toast.error(error?.response?.data?.message || "Failed to save notes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadMarkdown = () => {
    if (!converted?.note) return;
    const blob = new Blob([converted.note.content || ""], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${converted.note.title || "slides"}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  /* ---------------- Cleanup ---------------- */
  useEffect(() => {
    return () => {
      slides.forEach((s) => s.preview && URL.revokeObjectURL(s.preview));
    };
  }, [slides]);
  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-8 bg-white text-slate-800">
      <SectionTitle
        eyebrow="Slides to Notes"
        title="Transform slides into structured notes"
        description="Upload PPT or PDF files and convert them into clean study notes."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Slide previews
            </p>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.ppt,.pptx"
              multiple
              onChange={handleFileUpload}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:border-indigo-400"
            >
              {isUploading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Upload size={16} />
              )}
              Upload PPT / PDF
            </button>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </div>
          )}

          {/* SLIDE LIST */}
          <div className="grid gap-4 md:grid-cols-3">
            {slides.length ? (
              slides.map((slide) => (
                <button
                  key={slide.id}
                  onClick={() => setSelectedSlide(slide)}
                  className={`rounded-2xl border p-4 text-left ${
                    selectedSlide?.id === slide.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  <p className="text-xs uppercase tracking-widest text-slate-500">
                    {slide.status}
                  </p>
                  <p className="mt-2 font-semibold line-clamp-2">
                    {slide.title}
                  </p>
                </button>
              ))
            ) : (
              <div className="col-span-3 flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 p-12 text-slate-500">
                <FileText size={40} />
                <p>No slides uploaded yet</p>
              </div>
            )}
          </div>

          {/* SELECTED SLIDE */}
          {selectedSlide && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
                  {selectedSlide.preview ? (
                    <img
                      src={selectedSlide.preview}
                      alt={selectedSlide.title}
                      className="mx-auto max-h-48 rounded"
                    />
                  ) : (
                    <Presentation size={64} className="mx-auto text-slate-400" />
                  )}
                  <p className="mt-4 font-semibold">
                    {selectedSlide.title}
                  </p>
                  <button
                    onClick={() =>
                      selectedSlide.preview &&
                      window.open(selectedSlide.preview, "_blank")
                    }
                    className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm"
                  >
                    <Eye size={16} /> View preview
                  </button>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <p className="text-xs uppercase tracking-widest text-slate-500">
                    Extracted content
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    {selectedSlide.keyPoints.map((p, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-1 size-1.5 rounded-full bg-indigo-500" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
          )}
        </div>

        {/* RIGHT */}
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Conversion options
          </p>

          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Language
            </p>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-3 w-full rounded-2xl border border-slate-300 px-4 py-2 text-sm"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {conversionModes.map((mode) => (
            <label
              key={mode.id}
              className={`flex gap-3 rounded-2xl border p-4 cursor-pointer ${
                mode.active
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-slate-200"
              }`}
            >
              <input
                type="radio"
                name="conversionMode"
                checked={mode.active}
                onChange={() => toggleConversionMode(mode.id)}
                className="accent-indigo-600"
              />
              <div>
                <p className="font-semibold">{mode.title}</p>
                <p className="text-sm text-slate-600">
                  {mode.description}
                </p>
              </div>
            </label>
          ))}

          <button
            onClick={handleConvert}
            disabled={isConverting || !slides.length}
            className="w-full rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {isConverting ? "Converting..." : "Convert to notes"}
          </button>

          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Output format
            </p>
            <div className="mt-3 space-y-2">
              {outputFormats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => toggleOutputFormat(format.id)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-2 ${
                    format.selected
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200"
                  }`}
                >
                  {format.name}
                  {format.selected && (
                    <Check className="text-indigo-600" size={18} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {converted?.note && (
            <div className="space-y-3 rounded-2xl border border-slate-200 p-5">
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Export
              </p>
              <div className="grid gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={!outputFormats.find((f) => f.id === "pdf")?.selected}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-50"
                >
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={handleDownloadMarkdown}
                  disabled={!outputFormats.find((f) => f.id === "markdown")?.selected}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-50"
                >
                  Download Markdown
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {converted?.note && (
        <section id="slides-results" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionTitle
            eyebrow="Results"
            title={converted.note.title || "Generated notes"}
            description="AI-generated notes from your slide deck."
          />

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="prose max-w-none">
                <ReactMarkdown>{converted.note.content || ""}</ReactMarkdown>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Structured output
              </p>

              <div className="mt-4 space-y-4 text-sm text-slate-700">
                {converted.structuredNotes?.overview && (
                  <div>
                    <p className="font-semibold">Overview</p>
                    <p className="mt-1 text-slate-600">
                      {converted.structuredNotes.overview}
                    </p>
                  </div>
                )}

                {Array.isArray(converted.structuredNotes?.takeaways) &&
                  converted.structuredNotes.takeaways.length > 0 && (
                    <div>
                      <p className="font-semibold">Takeaways</p>
                      <ul className="mt-2 space-y-1 text-slate-600">
                        {converted.structuredNotes.takeaways.map((t, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="mt-1 size-1.5 rounded-full bg-indigo-500" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>

              <div className="mt-6">
                <button
                  onClick={handleSaveNotes}
                  disabled={isSaving}
                  className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default SlideToNotes;
