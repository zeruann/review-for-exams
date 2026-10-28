import { useState } from "react";
import type { QuizResultItem } from "../types/quiz";

interface ResultsProps {
  subjectName: string;
  correctCount: number;
  totalCount: number;
  results: QuizResultItem[];
  onRetry: () => void;
  onBackToSubjects: () => void;
}

function scoreMeta(percent: number) {
  if (percent >= 80) {
    return {
      color: "var(--good)",
      soft: "var(--good-soft)",
      message: "Outstanding work! You've got strong command of these concepts.",
      emoji: "🎉",
      badge: "Mastery Level",
    };
  }
  if (percent >= 50) {
    return {
      color: "var(--okay)",
      soft: "var(--okay-soft)",
      message: "Great progress! A quick review on missed items will lock this in.",
      emoji: "⚡",
      badge: "Solid Effort",
    };
  }
  return {
    color: "var(--low)",
    soft: "var(--low-soft)",
    message: "Don't sweat it! Repetition builds muscle memory. Give it another pass.",
    emoji: "🌱",
    badge: "Learning Opportunity",
  };
}

type FilterTab = "all" | "correct" | "wrong" | "skipped";

export default function Results({
  subjectName,
  correctCount,
  totalCount,
  results,
  onRetry,
  onBackToSubjects,
}: ResultsProps) {
  const percent = Math.round((correctCount / totalCount) * 100);
  const meta = scoreMeta(percent);
  const skippedCount = results.filter((r) => r.status === "skipped").length;
  const wrongCount = results.filter((r) => r.status === "wrong").length;

  const [filter, setFilter] = useState<FilterTab>("all");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const filtered = results.filter((r) => filter === "all" || r.status === filter);

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: results.length },
    { key: "correct", label: "✓ Correct", count: correctCount },
    { key: "wrong", label: "✗ Wrong", count: wrongCount },
    { key: "skipped", label: "⏭ Skipped", count: skippedCount },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* ── Score Card ── */}
      <div
        className="rounded-3xl p-6 md:p-10 border shadow-lg relative overflow-hidden text-center"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        {/* Top Tag */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-4 border"
          style={{ backgroundColor: meta.soft, color: meta.color, borderColor: meta.color }}
        >
          <span>{meta.emoji}</span>
          <span>{meta.badge}</span>
        </div>

        <h1 className="text-xl md:text-2xl font-extrabold text-[var(--ink)] tracking-tight mb-2">
          {subjectName}
        </h1>

        {/* Big Score Ring */}
        <div
          className="w-32 h-32 mx-auto my-10 rounded-3xl flex flex-col items-center justify-center border-2 transition-transform hover:scale-105"
          style={{ backgroundColor: meta.soft, borderColor: meta.color }}
        >
          <span className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: meta.color }}>
            {percent}%
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider opacity-80" style={{ color: meta.color }}>
            Accuracy
          </span>
        </div>

        {/* Stat Pills */}
        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-6">
          <div className="p-3 rounded-2xl border" style={{ backgroundColor: "var(--surface-hover)", borderColor: "var(--border)" }}>
            <div className="text-xs text-[var(--ink-muted)] mb-0.5">Correct</div>
            <div className="text-lg font-bold text-[var(--good)]">✓ {correctCount}</div>
          </div>
          <div className="p-3 rounded-2xl border" style={{ backgroundColor: "var(--surface-hover)", borderColor: "var(--border)" }}>
            <div className="text-xs text-[var(--ink-muted)] mb-0.5">Wrong</div>
            <div className="text-lg font-bold" style={{ color: wrongCount > 0 ? "var(--low)" : "var(--good)" }}>
              {wrongCount > 0 ? `✗ ${wrongCount}` : "None! 🎉"}
            </div>
          </div>
          <div className="p-3 rounded-2xl border" style={{ backgroundColor: "var(--surface-hover)", borderColor: "var(--border)" }}>
            <div className="text-xs text-[var(--ink-muted)] mb-0.5">Skipped</div>
            <div className="text-lg font-bold" style={{ color: skippedCount > 0 ? "var(--okay)" : "var(--ink-muted)" }}>
              {skippedCount > 0 ? `⏭ ${skippedCount}` : "—"}
            </div>
          </div>
        </div>

        <p className="text-sm md:text-base mb-8 max-w-sm mx-auto leading-relaxed" style={{ color: "var(--ink-muted)" }}>
          {meta.message}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRetry}
            className="flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm md:text-base transition-all active-press shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] flex items-center justify-center gap-2"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
          >
            <span>🔄 Practice Again</span>
          </button>
          <button
            onClick={onBackToSubjects}
            className="flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm md:text-base border transition-all active-press focus:outline-none focus:ring-2 focus:ring-[var(--accent)] flex items-center justify-center gap-2"
            style={{
              backgroundColor: "var(--surface-hover)",
              borderColor: "var(--border)",
              color: "var(--ink)",
            }}
          >
            <span>← Back to Subjects</span>
          </button>
        </div>
      </div>

      {/* ── Question Review ── */}
      <div
        className="rounded-3xl border shadow-md overflow-hidden"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        {/* Header */}
        <div
          className="px-5 py-4 border-b flex items-center gap-2"
          style={{ borderColor: "var(--border)" }}
        >
          <span className="text-base font-extrabold tracking-tight" style={{ color: "var(--ink)" }}>
            📋 Question Review
          </span>
          <span className="ml-auto text-xs text-[var(--ink-faint)]">
            {results.length} questions
          </span>
        </div>

        {/* Filter Tabs */}
        <div
          className="flex gap-1 px-4 py-3 border-b overflow-x-auto"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setFilter(tab.key); setExpandedIdx(null); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              style={{
                backgroundColor: filter === tab.key ? "var(--accent)" : "var(--surface)",
                color: filter === tab.key ? "var(--accent-ink)" : "var(--ink-muted)",
                border: `1px solid ${filter === tab.key ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              {tab.label}
              <span
                className="px-1.5 py-0.5 rounded-full text-[10px] font-black"
                style={{
                  backgroundColor: filter === tab.key ? "rgba(255,255,255,0.2)" : "var(--surface-hover)",
                  color: filter === tab.key ? "var(--accent-ink)" : "var(--ink-faint)",
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Question List */}
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {filtered.length === 0 && (
            <div className="px-5 py-8 text-center text-sm" style={{ color: "var(--ink-faint)" }}>
              No questions in this category.
            </div>
          )}
          {filtered.map((item, _idx) => {
            const globalIdx = results.indexOf(item);
            const isExpanded = expandedIdx === globalIdx;
            const isCorrect = item.status === "correct";
            const isSkipped = item.status === "skipped";

            const statusColor = isCorrect
              ? "var(--good)"
              : isSkipped
              ? "var(--okay)"
              : "var(--low)";
            const statusSoft = isCorrect
              ? "var(--good-soft)"
              : isSkipped
              ? "var(--okay-soft)"
              : "var(--low-soft)";
            const statusIcon = isCorrect ? "✓" : isSkipped ? "⏭" : "✗";
            const statusLabel = isCorrect ? "Correct" : isSkipped ? "Skipped" : "Wrong";

            return (
              <button
                key={globalIdx}
                onClick={() => setExpandedIdx(isExpanded ? null : globalIdx)}
                className="w-full text-left px-5 py-4 flex items-start gap-3 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--accent)] hover:bg-[var(--surface-hover)]"
                aria-expanded={isExpanded}
              >
                {/* Status Badge */}
                <span
                  className="shrink-0 w-7 h-7 mt-0.5 rounded-full flex items-center justify-center text-xs font-black"
                  style={{ backgroundColor: statusSoft, color: statusColor }}
                >
                  {statusIcon}
                </span>

                <div className="flex-1 min-w-0">
                  {/* Question number + label */}
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--ink-faint)" }}>
                      Q{globalIdx + 1}
                    </span>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: statusSoft, color: statusColor }}
                    >
                      {statusLabel}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--surface-hover)", color: "var(--ink-faint)" }}>
                      {item.questionType === "matching" ? "Matching" : item.questionType === "sorting" ? "Sorting" : item.questionType === "multi" ? "Multi-select" : "Single"}
                    </span>
                  </div>

                  {/* Question text */}
                  <p className="text-sm font-semibold leading-snug" style={{ color: "var(--ink)" }}>
                    {item.questionText}
                  </p>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="mt-3 space-y-2">
                      {/* Correct answer */}
                      <div
                        className="rounded-xl p-3 text-xs leading-relaxed"
                        style={{ backgroundColor: "var(--good-soft)", color: "var(--good)" }}
                      >
                        <span className="font-black uppercase tracking-wide">✓ Correct: </span>
                        <span className="font-medium">{item.correctAnswer || "—"}</span>
                      </div>

                      {/* User answer (only shown if not correct) */}
                      {!isCorrect && (
                        <div
                          className="rounded-xl p-3 text-xs leading-relaxed"
                          style={{
                            backgroundColor: isSkipped ? "var(--okay-soft)" : "var(--low-soft)",
                            color: isSkipped ? "var(--okay)" : "var(--low)",
                          }}
                        >
                          <span className="font-black uppercase tracking-wide">
                            {isSkipped ? "⏭ You skipped this question" : "✗ Your answer: "}
                          </span>
                          {!isSkipped && (
                            <span className="font-medium">{item.userAnswer || "(no answer selected)"}</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Expand chevron */}
                <span
                  className="shrink-0 text-xs transition-transform duration-200 mt-1"
                  style={{
                    color: "var(--ink-faint)",
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    display: "inline-block",
                  }}
                >
                  ▾
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom action strip */}
      <div className="flex flex-col sm:flex-row gap-3 pb-6">
        <button
          onClick={onRetry}
          className="flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm transition-all active-press shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] flex items-center justify-center gap-2"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
        >
          <span>🔄 Practice Again</span>
        </button>
        <button
          onClick={onBackToSubjects}
          className="flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm border transition-all active-press focus:outline-none focus:ring-2 focus:ring-[var(--accent)] flex items-center justify-center gap-2"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--ink)",
          }}
        >
          <span>← Back to Subjects</span>
        </button>
      </div>
    </div>
  );
}