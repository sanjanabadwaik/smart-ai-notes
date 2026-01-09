import React, { useEffect, useRef, useState, useContext } from "react";
import { useAuth } from "../context/AuthContext";
import {
  CheckCircle2,
  Link2,
  Loader2,
  RadioTower,
  UploadCloud,
  X,
} from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import IconBadge from "../components/IconBadge";
import { languages, summaryTypes, uploadOptions } from "../data/mockData";
import { toast } from "react-hot-toast";
import api from "../lib/api";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import ProcessingPipeline from "../components/ProcessingPipeline";

const SUMMARY_LABELS = {
  short: "Short",
  detailed: "Detailed",
  bullet: "Bullet points",
};

const UploadLecture = () => {
  const location = useLocation();
  const [activeOption, setActiveOption] = useState(uploadOptions[0].id);
  const [summaryType, setSummaryType] = useState(summaryTypes[0]);
  const [language, setLanguage] = useState(languages[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [textInput, setTextInput] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [generatedNote, setGeneratedNote] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  const ACCEPTED_FILE_TYPES = {
    document: ".pdf,.docx",
    video: ".mp4,.mov,.m4v",
  };

  const MAX_TEXT_LENGTH = 4000;

  const resetFileInput = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOptionChange = (optionId) => {
    setActiveOption(optionId);
    setErrors({});
    if (!["document", "video"].includes(optionId)) {
      resetFileInput();
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sourceFromQuery = params.get("source");
    const sourceFromState = location.state?.sourceType;
    const nextSource = sourceFromQuery || sourceFromState;

    if (
      nextSource &&
      nextSource !== activeOption &&
      uploadOptions.some((option) => option.id === nextSource)
    ) {
      handleOptionChange(nextSource);
    }
  }, [location.search, location.state, activeOption]);

  const hydrateFileState = (nextFile) => {
    if (!nextFile) return;

    const isDocument = activeOption === "document";
    const isVideo = activeOption === "video";

    if (
      isDocument &&
      ![
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(nextFile.type)
    ) {
      setErrors((prev) => ({
        ...prev,
        file: "Please upload a PDF or Word file.",
      }));
      return;
    }

    if (isVideo && !nextFile.type.startsWith("video/")) {
      setErrors((prev) => ({ ...prev, file: "Please choose a video file." }));
      return;
    }

    setErrors((prev) => ({ ...prev, file: undefined }));
    setFile(nextFile);
  };

  const handleFileChange = (event) => {
    const [nextFile] = event.target.files || [];
    hydrateFileState(nextFile);
  };

  const { user } = useAuth();

  const handleSaveNotes = async () => {
    if (!generatedNote) return;
    if (!user) {
      toast.error("You must be logged in to save notes");
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        title: generatedNote.title,
        content: generatedNote.content,
        keyPoints: generatedNote.keyPoints || [],
        highlights: generatedNote.highlights || [],
        sourceType: generatedNote.sourceType,
        summaryType: generatedNote.summaryType,
        language: generatedNote.language,
        user: user._id, // Ensure user ID is included
      };

      console.log("Saving note with payload:", payload); // Debug log

      const response = await api.post("/notes", payload);
      console.log("Note saved successfully:", response.data); // Debug log

      toast.success("Notes saved successfully! 📝");
    } catch (error) {
      console.error("Error saving notes:", error);
      toast.error(error?.response?.data?.message || "Failed to save notes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const [droppedFile] = event.dataTransfer.files || [];
    hydrateFileState(droppedFile);
  };

  const validateForm = () => {
    const nextErrors = {};

    if (["document", "video"].includes(activeOption) && !file) {
       nextErrors.file = "Upload a PDF or Word file to continue.";
    }

    if (activeOption === "text" && !textInput.trim()) {
      nextErrors.text = "Paste lecture content or transcript.";
    }

    if (activeOption === "youtube") {
      if (!youtubeUrl.trim()) {
        nextErrors.youtubeUrl = "Provide a YouTube link.";
      } else if (!/(youtube\.com|youtu\.be)/i.test(youtubeUrl.trim())) {
        nextErrors.youtubeUrl = "Add a valid YouTube URL.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = () => {
    const formData = new FormData();

    formData.append("sourceType", activeOption);
    formData.append("summaryType", summaryType);
    formData.append("language", language);

    if (title.trim()) {
      formData.append("title", title.trim());
    }

    if (["document", "video"].includes(activeOption) && file) {
      formData.append("file", file);
    }

    if (activeOption === "text") {
      formData.append("text", textInput.trim());
    }

    if (activeOption === "youtube") {
      formData.append("youtubeUrl", youtubeUrl.trim());
    }

    return formData;
  };

  const handleGenerate = async (event) => {
    event.preventDefault();
    setGeneratedNote(null);

    if (!validateForm()) return;

    try {
      setIsGenerating(true);
      const payload = buildPayload();

      const { data } = await api.post("/notes/generate", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Notes generated successfully ✨");
      setGeneratedNote({
        content: data.content || "",
        keyPoints: data.keyPoints || [],
        highlights: data.highlights || [],
        title: title.trim() || `Notes ${new Date().toLocaleDateString()}`,
        sourceType: activeOption,
        summaryType,
        language,
      });

      if (activeOption === "text") setTextInput("");
      if (activeOption === "youtube") setYoutubeUrl("");
      if (["document", "video"].includes(activeOption)) resetFileInput();
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to generate notes";
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };  

  return (
    <div className="space-y-8 text-gray-800">
      <SectionTitle
        eyebrow="Upload lecture"
        title="Send your lecture files to the AI lab"
        description="Choose from document, video, text, or links. The AI auto-detects chapters and speaker context."
      />

      <form onSubmit={handleGenerate} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
            Upload options
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {uploadOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionChange(option.id)}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  activeOption === option.id
                    ? "border-indigo-500 bg-indigo-100 text-indigo-900"
                    : "border-gray-300 bg-gray-50 hover:border-indigo-300 hover:shadow-sm"
                }`}
              >
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-700">
                  {option.label}
                </p>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {option.description}
                </p>
                <p className="text-sm text-gray-600">{option.sampleName}</p>
              </button>
            ))}
          </div>

          <div className="space-y-5 rounded-xl border border-gray-300 bg-gray-50 p-6 shadow-sm">
            <label
              className="block text-xs font-medium uppercase tracking-[0.2em] text-gray-700"
            >
              Lecture title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g. Week 4 – Quantum Mechanics"
              maxLength={120}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />

            {["document", "video"].includes(activeOption) && (
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`rounded-3xl border-2 border-dashed p-6 text-center transition ${
                  isDragging
                    ? "border-indigo-400 bg-indigo-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <UploadCloud className="mx-auto text-indigo-400" size={36} />
                <p className="mt-3 text-lg font-semibold">
                  {file
                    ? "File ready to upload"
                    : "Drop your lecture file here"}
                </p>
                <p className="text-sm text-white/60">
                  {activeOption === "document"
                    ? "Supports PDF and Word documents"
                    : "Supports MP4, MOV, M4V up to 3GB"}
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Browse files
                  </button>
                  {file && (
                    <button
                      type="button"
                      onClick={resetFileInput}
                      className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                    >
                      <X size={14} />
                      Remove
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_FILE_TYPES[activeOption]}
                  className="hidden"
                  onChange={handleFileChange}
                />

                {file && (
                  <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm">
                    <p className="font-semibold">{file.name}</p>
                    <p className="text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                )}
                {errors.file && (
                  <p className="mt-3 text-sm text-red-600">{errors.file}</p>
                )}
              </div>
            )}

            {activeOption === "text" && (
              <div>
                <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
                  <span>Paste transcript</span>
                  <span className="text-white/40">
                    {textInput.length}/{MAX_TEXT_LENGTH}
                  </span>
                </div>
                <textarea
                  value={textInput}
                  onChange={(e) =>
                    setTextInput(e.target.value.slice(0, MAX_TEXT_LENGTH))
                  }
                  rows={6}
                  placeholder="Drop your transcript, bullet outline, or raw lecture notes here..."
                  className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
                {errors.text && (
                  <p className="mt-2 text-sm text-red-600">{errors.text}</p>
                )}
              </div>
            )}

            {activeOption === "youtube" && (
              <div>
                <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
                  <Link2 size={14} />
                  YouTube link
                </label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtu.be/abcdef12345"
                  className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Supports public or unlisted videos.
                </p>
                {errors.youtubeUrl && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.youtubeUrl}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              Language
            </p>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              {languages.map((lang) => (
                <option
                  key={lang}
                  value={lang}
                  className="bg-slate-900 text-white"
                >
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              Summary type
            </p>
            <div className="mt-3 grid gap-3">
              {summaryTypes.map((type) => (
                <label
                  key={type}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                    summaryType === type
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm"
                  }`}
                >
                  <input
                    type="radio"
                    name="summaryType"
                    checked={summaryType === type}
                    onChange={() => setSummaryType(type)}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  {SUMMARY_LABELS[type] || type}
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-xs uppercase tracking-[0.4em] text-blue-900 font-bold">
              Status
            </p>
            <p className="mt-2 text-lg font-semibold text-gray-900">
              {isGenerating ? "Processing…" : "Queue ready"}
            </p>
            <p className="text-sm text-gray-600">
              {isGenerating
                ? "Extracting content and generating notes"
                : "Average completion: 2 mins"}
            </p>
            <div className="mt-4 grid gap-3 text-sm">
              {[
                "Speaker diarization enabled",
                "Slide recognition active",
                "Terminology matching on",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-emerald-600"
                >
                  <RadioTower size={14} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Processing...
              </span>
            ) : (
              "Generate notes"
            )}
          </button>
        </div>
      </form>
      <div className="mt-6">
        {generatedNote && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 size={18} />
                <span>Notes generated successfully</span>
              </div>
              <button
                onClick={handleSaveNotes}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Saving...
                  </>
                ) : (
                  "Save Notes"
                )}
              </button>
            </div>

            {/* ✅ wrapper gets className */}
            <div className="space-y-6">
              {generatedNote.content && (
                <div className="prose max-w-none">
                  <h3 className="mb-4 text-xl font-bold text-gray-900">Notes</h3>
                  <ReactMarkdown>{generatedNote.content}</ReactMarkdown>
                </div>
              )}

              {generatedNote.keyPoints &&
                generatedNote.keyPoints.length > 0 && (
                  <div className="mt-6">
                    <h3 className="mb-4 text-xl font-bold text-gray-900">Key Points</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      {generatedNote.keyPoints.map((point, index) => (
                        <li key={index} className="text-gray-700">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {generatedNote.highlights &&
                generatedNote.highlights.length > 0 && (
                  <div className="mt-6">
                    <h3 className="mb-4 text-xl font-bold text-gray-900">Highlights</h3>
                    <div className="grid gap-3">
                      {generatedNote.highlights.map((highlight, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded-r"
                        >
                          <p className="text-gray-700">{highlight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>

      <ProcessingPipeline />
    </div>
  );
};

export default UploadLecture;
