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

const SlideToNotes = () => {
  const fileInputRef = useRef(null);

  const [slides, setSlides] = useState([]);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

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
    } catch {
      setError("Failed to process files. Try again.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  /* ---------------- Convert ---------------- */
  const handleConvert = async () => {
    if (!slides.length) {
      setError("Upload slides first.");
      return;
    }

    setIsConverting(true);
    setError("");

    setTimeout(() => {
      setIsConverting(false);
      console.log("Conversion complete");
    }, 2000);
  };

  /* ---------------- Toggles ---------------- */
  const toggleConversionMode = (id) => {
    setConversionModes((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, active: !m.active } : m
      )
    );
  };

  const toggleOutputFormat = (id) => {
    setOutputFormats((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, selected: !f.selected } : f
      )
    );
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
                type="checkbox"
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
        </div>
      </div>
    </div>
  );
};

export default SlideToNotes;
