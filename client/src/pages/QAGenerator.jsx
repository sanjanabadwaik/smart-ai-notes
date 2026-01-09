import React, { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import SectionTitle from "../components/SectionTitle";
import { difficultyLevels, questionTypes, qaPreview } from "../data/mockData";
import api from "../lib/api";

const MIN_NOTES_LENGTH = 20;

const QAGenerator = () => {
  const [selectedType, setSelectedType] = useState(questionTypes[0]);
  const [difficulty, setDifficulty] = useState(difficultyLevels[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notesInput, setNotesInput] = useState("");
  const [notesError, setNotesError] = useState("");
  const [qaResults, setQaResults] = useState([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  /* -------------------- Helpers -------------------- */
  const normalizeOption = (option, index) => {
    if (typeof option === "string") {
      return { label: String.fromCharCode(65 + index), text: option };
    }

    if (typeof option === "object" && option !== null) {
      return {
        label:
          option.label ??
          option.key ??
          option.letter ??
          String.fromCharCode(65 + index),
        text:
          option.text ??
          option.value ??
          option.content ??
          option.option ??
          "",
      };
    }

    return {
      label: String.fromCharCode(65 + index),
      text: String(option ?? ""),
    };
  };

  /* -------------------- Actions -------------------- */
  const handleGenerate = async () => {
    if (notesInput.trim().length < MIN_NOTES_LENGTH) {
      setNotesError(`Enter at least ${MIN_NOTES_LENGTH} characters.`);
      return;
    }

    setNotesError("");
    setIsGenerating(true);
    setHasGenerated(true);

    try {
      const { data } = await api.post("/qa/generate", {
        notes: notesInput.trim(),
        questionType: selectedType,
        difficulty,
      });

      const items = data?.data?.qa || [];
      setQaResults(items);

      items.length
        ? toast.success("Questions generated ✨")
        : toast("No questions generated. Add more detail.");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to generate questions"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptionSelect = (questionKey, optionLabel, isCorrect) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionKey]: {
        selected: optionLabel,
        isCorrect,
      },
    }));
  };

  const results = qaResults.length ? qaResults : qaPreview;
  const showingSample = qaResults.length === 0;
  const noResultsAfterGenerate = hasGenerated && qaResults.length === 0;

  /* -------------------- UI -------------------- */
  return (
    <div className="space-y-10 bg-white text-slate-800">
      <SectionTitle
        eyebrow="Auto Q&A"
        title="Generate exam-ready questions"
        description="Convert notes into MCQs, short & long answers."
      />

      {/* INPUT */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Input Notes
          </p>

          <textarea
            rows={8}
            value={notesInput}
            onChange={(e) => {
              setNotesInput(e.target.value);
              setNotesError("");
            }}
            placeholder="Paste your notes here..."
            className="w-full rounded-2xl border border-slate-300 p-4 text-sm focus:border-indigo-500 focus:outline-none"
          />

          <div className="flex justify-between text-xs text-slate-500">
            <span>Minimum {MIN_NOTES_LENGTH} characters</span>
            <span>{notesInput.length} chars</span>
          </div>

          {notesError && (
            <p className="text-sm text-rose-600">{notesError}</p>
          )}

          {/* OPTIONS */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Type */}
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Question Type
              </p>
              <div className="mt-3 space-y-2">
                {questionTypes.map((type) => (
                  <label
                    key={type}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2 text-sm ${
                      selectedType === type
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    <input
                      type="radio"
                      checked={selectedType === type}
                      onChange={() => setSelectedType(type)}
                      className="accent-indigo-600"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Difficulty
              </p>
              <div className="mt-3 space-y-2">
                {difficultyLevels.map((level) => (
                  <label
                    key={level}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2 text-sm ${
                      difficulty === level
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    <input
                      type="radio"
                      checked={difficulty === level}
                      onChange={() => setDifficulty(level)}
                      className="accent-indigo-600"
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {isGenerating ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Sparkles size={18} />
            )}
            {isGenerating ? "Generating..." : "Generate Questions"}
          </button>
        </div>

        {/* LIBRARY */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionTitle
            eyebrow="Library"
            title="Saved Notes"
            description="Choose an existing note set."
          />
          <div className="mt-4 space-y-3">
            {["Neural Networks", "Behavioral Economics", "Modern Poetry"].map(
              (item) => (
                <button
                  key={item}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-left hover:border-indigo-400"
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* RESULTS */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex justify-between items-center">
          <SectionTitle
            eyebrow="Results"
            title="Generated Questions"
            description="Select an answer to see feedback."
          />
          <span className="text-xs uppercase tracking-widest text-slate-500">
            {showingSample ? "Sample Data" : "AI Generated"}
          </span>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {results.map((qa, index) => {
            const questionKey = qa.id || `qa-${index}`;
            const options = qa.options?.map(normalizeOption) || [];
            const correct = qa.correctOption?.toLowerCase();
            const selected = selectedAnswers[questionKey];

            return (
              <article
                key={questionKey}
                className="space-y-3 rounded-2xl border border-slate-200 p-5 shadow-sm"
              >
                <div className="flex justify-between text-xs uppercase tracking-widest text-slate-500">
                  <span>{qa.type}</span>
                  <span>{qa.difficulty}</span>
                </div>

                <h3 className="font-semibold">{qa.question}</h3>

                <ul className="space-y-2">
                  {options.map((opt) => {
                    const isCorrect =
                      opt.label.toLowerCase() === correct;
                    const isSelected = selected?.selected === opt.label;
                    const revealCorrect =
                      selected && !isSelected && isCorrect;

                    return (
                      <li key={opt.label}>
                        <button
                          onClick={() =>
                            handleOptionSelect(
                              questionKey,
                              opt.label,
                              isCorrect
                            )
                          }
                          className={`flex w-full gap-2 rounded-xl border px-3 py-2 text-left ${
                            isSelected && isCorrect
                              ? "border-emerald-400 bg-emerald-50"
                              : isSelected
                              ? "border-rose-400 bg-rose-50"
                              : revealCorrect
                              ? "border-emerald-300 bg-emerald-50"
                              : "border-slate-200 hover:border-indigo-300"
                          }`}
                        >
                          <span className="font-semibold">
                            {opt.label}.
                          </span>
                          <span>{opt.text}</span>

                          {(isSelected || revealCorrect) && (
                            <span
                              className={`ml-auto text-xs font-semibold uppercase tracking-widest ${
                                isCorrect
                                  ? "text-emerald-600"
                                  : "text-rose-600"
                              }`}
                            >
                              {isSelected
                                ? isCorrect
                                  ? "Correct"
                                  : "Wrong"
                                : "Correct Answer"}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <p className="text-sm text-slate-600">{qa.answer}</p>
              </article>
            );
          })}
        </div>

        {noResultsAfterGenerate && (
          <p className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-700">
            Could not generate questions. Add more detailed notes.
          </p>
        )}
      </section>
    </div>
  );
};

export default QAGenerator;
