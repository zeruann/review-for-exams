import { useEffect, useMemo, useRef, useState } from "react";
import type { Subject, MatchPair, SortItem } from "../types/quiz";

interface QuizProps {
  subject: Subject;
  shuffleQuestions: boolean;
  questionLimit: number | null;
  timerEnabled: boolean;
  onFinish: (correctCount: number, totalCount: number) => void;
  onExit: () => void;
}

interface AnswerState {
  selected: string[];
  revealed: boolean;
  skipped: boolean;
  matches?: Record<string, string | null>;
  assignments?: Record<string, string | null>;
}

const TIMER_DURATION_SECONDS = 60 * 60;
const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const EMPTY_STATE: AnswerState = { selected: [], revealed: false, skipped: false };

function isMatchingQuestion(q: any): boolean {
  return q?.type === "matching" && Array.isArray(q.pairs) && q.pairs.length > 0;
}

function isSortingQuestion(q: any): boolean {
  return (
    q?.type === "sorting" &&
    Array.isArray(q.items) &&
    q.items.length > 0 &&
    Array.isArray(q.categories) &&
    q.categories.length > 0
  );
}

function isMatchCorrect(pairs: MatchPair[], matches: Record<string, string | null>): boolean {
  return pairs.every((p) => matches[p.id] === p.id);
}

// Treats `undefined` (never assigned) and `null` (distractor's correct home)
// as the same "unplaced" state, so comparisons work whichever item type it is.
function isPlacementCorrect(item: SortItem, assignments: Record<string, string | null>): boolean {
  const assigned = assignments[item.id] ?? null;
  const correct = item.category ?? null;
  return assigned === correct;
}

function isSortCorrect(items: SortItem[], assignments: Record<string, string | null>): boolean {
  return items.every((it) => isPlacementCorrect(it, assignments));
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 shrink-0">
      <circle cx="10" cy="10" r="9" fill="var(--good-soft)" stroke="var(--good)" strokeWidth="1.5" />
      <path d="M6 10.5l2.5 2.5L14 7.5" stroke="var(--good)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 shrink-0">
      <circle cx="10" cy="10" r="9" fill="var(--low-soft)" stroke="var(--low)" strokeWidth="1.5" />
      <path d="M7 7l6 6M13 7l-6 6" stroke="var(--low)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// --- Matching UI ---------------------------------------------------------

interface MatchingBoardProps {
  pairs: MatchPair[];
  shuffledRight: MatchPair[];
  matches: Record<string, string | null>;
  revealed: boolean;
  selectedLeftId: string | null;
  onLeftClick: (pairId: string) => void;
  onRightClick: (rightId: string) => void;
}

function MatchingBoard({
  pairs,
  shuffledRight,
  matches,
  revealed,
  selectedLeftId,
  onLeftClick,
  onRightClick,
}: MatchingBoardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="space-y-2">
        <p className="text-xs" style={{ color: "var(--ink-faint)" }}>
          Terms
        </p>
        {pairs.map((p, i) => {
          const assignedRid = matches[p.id] ?? null;
          const isCorrect = assignedRid === p.id;
          const isSelected = selectedLeftId === p.id;

          let style: React.CSSProperties = {
            borderColor: "var(--border)",
            color: "var(--ink)",
          };
          if (revealed) {
            style = isCorrect
              ? { borderColor: "var(--good)", backgroundColor: "var(--good-soft)", color: "var(--good)" }
              : assignedRid
              ? { borderColor: "var(--low)", backgroundColor: "var(--low-soft)", color: "var(--low)" }
              : { borderColor: "var(--border)", color: "var(--ink-faint)", opacity: 0.6 };
          } else if (isSelected) {
            style = { borderColor: "var(--accent)", backgroundColor: "var(--good-soft)", color: "var(--ink)" };
          } else if (assignedRid) {
            style = { borderColor: "var(--accent)", color: "var(--ink)" };
          }

          return (
            <button
              key={p.id}
              onClick={() => onLeftClick(p.id)}
              disabled={revealed}
              aria-pressed={isSelected}
              aria-label={`${p.left}${assignedRid ? ", matched" : ", not yet matched"}`}
              className="w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              style={style}
            >
              <span
                className="w-6 h-6 shrink-0 rounded-full border flex items-center justify-center text-xs font-semibold"
                style={{ borderColor: "currentColor" }}
              >
                {LETTERS[i]}
              </span>
              <span className="flex-1 text-sm">{p.left}</span>
              {revealed && isCorrect && <CheckIcon />}
              {revealed && assignedRid && !isCorrect && <CrossIcon />}
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        <p className="text-xs" style={{ color: "var(--ink-faint)" }}>
          Descriptions
        </p>
        {shuffledRight.map((r) => {
          const assignedByLeftId =
            Object.keys(matches).find((k) => matches[k] === r.id) ?? null;
          const isCorrectAssignment = assignedByLeftId === r.id;
          const leftIndex = pairs.findIndex((p) => p.id === assignedByLeftId);
          const ownerAssignedElsewhere = matches[r.id] !== undefined && matches[r.id] !== r.id;

          let style: React.CSSProperties = {
            borderColor: "var(--border)",
            color: "var(--ink)",
          };
          if (revealed) {
            if (isCorrectAssignment) {
              style = { borderColor: "var(--good)", backgroundColor: "var(--good-soft)", color: "var(--good)" };
            } else if (assignedByLeftId) {
              style = { borderColor: "var(--low)", backgroundColor: "var(--low-soft)", color: "var(--low)" };
            } else if (ownerAssignedElsewhere) {
              style = { borderColor: "var(--good)", backgroundColor: "var(--good-soft)", color: "var(--good)" };
            } else {
              style = { borderColor: "var(--border)", color: "var(--ink-faint)", opacity: 0.6 };
            }
          } else if (assignedByLeftId) {
            style = { borderColor: "var(--accent)", color: "var(--ink)" };
          }

          return (
            <button
              key={r.id}
              onClick={() => onRightClick(r.id)}
              disabled={revealed}
              aria-label={r.right}
              className="w-full flex items-start gap-3 text-left px-3 py-2.5 rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              style={style}
            >
              <span
                className="w-6 h-6 shrink-0 rounded-full border flex items-center justify-center text-xs font-semibold"
                style={{ borderColor: "currentColor" }}
              >
                {assignedByLeftId ? LETTERS[leftIndex] : ""}
              </span>
              <span className="flex-1 text-sm">{r.right}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- Sorting UI (two columns: types | descriptions, drag-and-drop) --------

interface SortingBoardProps {
  categories: string[];
  items: SortItem[];
  assignments: Record<string, string | null>;
  revealed: boolean;
  onAssign: (itemId: string, category: string | null) => void;
}

function SortingBoard({
  categories,
  items,
  assignments,
  revealed,
  onAssign,
}: SortingBoardProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [dragOverZone, setDragOverZone] = useState<string | null>(null);

  const pool = items.filter((it) => !assignments[it.id]);
  const byCategory = (cat: string) => items.filter((it) => assignments[it.id] === cat);

  function handleDragStart(e: React.DragEvent, itemId: string) {
    if (revealed) return;
    e.dataTransfer.setData("text/plain", itemId);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDrop(e: React.DragEvent, target: string | null) {
    e.preventDefault();
    setDragOverZone(null);
    if (revealed) return;
    const itemId = e.dataTransfer.getData("text/plain");
    if (itemId) onAssign(itemId, target);
  }

  function handleItemTap(itemId: string) {
    if (revealed) return;
    setSelectedItemId((prev) => (prev === itemId ? null : itemId));
  }

  function handleZoneTap(target: string | null) {
    if (revealed || !selectedItemId) return;
    onAssign(selectedItemId, target);
    setSelectedItemId(null);
  }

function itemBoxStyle(item: SortItem, containerCategory: string | null): React.CSSProperties {
  const isSelected = selectedItemId === item.id;
  if (revealed) {
    const isCorrect = isPlacementCorrect(item, assignments);
    if (isCorrect) {
      return { borderColor: "var(--good)", backgroundColor: "var(--good-soft)", color: "var(--good)" };
    }
    if (containerCategory) {
      // sitting in a category — either the wrong one, or a distractor that shouldn't be here at all
      return { borderColor: "var(--low)", backgroundColor: "var(--low-soft)", color: "var(--low)" };
    }
    // sitting unplaced in the pool, but it needed a category — also wrong
    return { borderColor: "var(--low)", backgroundColor: "var(--low-soft)", color: "var(--low)", opacity: 0.85 };
  }
  if (isSelected) {
    return { borderColor: "var(--accent)", backgroundColor: "var(--good-soft)", color: "var(--ink)" };
  }
  return { borderColor: "var(--border)", color: "var(--ink)", backgroundColor: "var(--surface)" };
}

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-2">
        <p className="text-xs" style={{ color: "var(--ink-faint)" }}>
          Types
        </p>
        {categories.map((cat) => {
          const catItems = byCategory(cat);
          const isDragOver = dragOverZone === cat;
          return (
            <div
              key={cat}
              onDragOver={(e) => {
                e.preventDefault();
                if (!revealed) setDragOverZone(cat);
              }}
              onDragLeave={() => setDragOverZone((z) => (z === cat ? null : z))}
              onDrop={(e) => handleDrop(e, cat)}
              onClick={() => handleZoneTap(cat)}
              className="rounded-xl border-2 border-dashed p-2.5 min-h-[64px] transition"
              style={{
                borderColor: isDragOver ? "var(--accent)" : "var(--border)",
                backgroundColor: isDragOver ? "var(--good-soft)" : "transparent",
              }}
            >
              <p className="text-sm font-semibold mb-2" style={{ color: "var(--ink)" }}>
                {cat}
              </p>
              <div className="space-y-2">
                {catItems.length === 0 && (
                  <p className="text-xs italic" style={{ color: "var(--ink-faint)" }}>
                    Drop here
                  </p>
                )}
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    draggable={!revealed}
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemTap(item.id);
                    }}
                    className="flex items-center gap-2 text-left px-2.5 py-2 rounded-lg border text-sm transition cursor-grab active:cursor-grabbing"
                    style={itemBoxStyle(item, cat)}
                  >
                    <span className="flex-1">{item.text}</span>
                    {revealed &&
                    (isPlacementCorrect(item, assignments) ? <CheckIcon /> : <CrossIcon />)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-2">
        <p className="text-xs" style={{ color: "var(--ink-faint)" }}>
          Descriptions
        </p>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!revealed) setDragOverZone("pool");
          }}
          onDragLeave={() => setDragOverZone((z) => (z === "pool" ? null : z))}
          onDrop={(e) => handleDrop(e, null)}
          onClick={() => handleZoneTap(null)}
          className="rounded-xl border-2 border-dashed p-2.5 min-h-[64px] space-y-2 transition"
          style={{
            borderColor: dragOverZone === "pool" ? "var(--accent)" : "var(--border)",
            backgroundColor: dragOverZone === "pool" ? "var(--good-soft)" : "transparent",
          }}
        >
          {pool.length === 0 && (
            <p className="text-xs italic" style={{ color: "var(--ink-faint)" }}>
              All sorted
            </p>
          )}
          {pool.map((item) => (
            <div
              key={item.id}
              draggable={!revealed}
              onDragStart={(e) => handleDragStart(e, item.id)}
              onClick={(e) => {
                e.stopPropagation();
                handleItemTap(item.id);
              }}
              className="flex items-center gap-2 text-left px-2.5 py-2 rounded-lg border text-sm transition cursor-grab active:cursor-grabbing"
              style={itemBoxStyle(item, null)}
            >
              <span className="flex-1">{item.text}</span>
              {revealed &&
                (isPlacementCorrect(item, assignments) ? <CheckIcon /> : <CrossIcon />)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Main component -------------------------------------------------------

export default function Quiz({
  subject,
  shuffleQuestions,
  questionLimit,
  timerEnabled,
  onFinish,
  onExit,
}: QuizProps) {
  const questions = useMemo(() => {
    const base = shuffleQuestions ? shuffle(subject.questions) : subject.questions;
    if (questionLimit && questionLimit < base.length) {
      const pool = shuffleQuestions ? base : shuffle(subject.questions);
      return pool.slice(0, questionLimit);
    }
    return base;
  }, [subject, shuffleQuestions, questionLimit]);

  const [index, setIndex] = useState(0);
  const [answersByIndex, setAnswersByIndex] = useState<Record<number, AnswerState>>({});
  const [secondsLeft, setSecondsLeft] = useState(TIMER_DURATION_SECONDS);
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const finishedRef = useRef(false);

  const current = questions[index] as any;
  const isLast = index === questions.length - 1;
  const isFirst = index === 0;
  const matching = isMatchingQuestion(current);
  const sorting = isSortingQuestion(current);
  const isMulti = !matching && !sorting && Boolean(current?.answers && current.answers.length > 0);
  const correctSet = !matching && !sorting && current
    ? new Set(isMulti ? current.answers : [current.answer])
    : new Set<string>();

  const currentState = answersByIndex[index] ?? EMPTY_STATE;
  const { selected, revealed } = currentState;
  const currentMatches = currentState.matches ?? {};
  const currentAssignments = currentState.assignments ?? {};

  // Choices are shuffled once per question (keyed on `index`, which only
  // changes on navigation) so the correct answer isn't always in the same
  // position, but the order stays stable while the user is answering.
  const shuffledChoices = useMemo(() => {
    if (matching || sorting || !current?.choices) return [];
    return shuffle(current.choices as string[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const shuffledRight = useMemo(() => {
    if (!matching) return [];
    return shuffle(current.pairs as MatchPair[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, matching]);

  // Same idea for sorting items — otherwise the pool order (which usually
  // groups items by category in the source JSON) gives the answer away.
  const shuffledItems = useMemo(() => {
    if (!sorting) return [];
    return shuffle(current.items as SortItem[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, sorting]);

  useEffect(() => {
    setSelectedLeftId(null);
  }, [index]);

  function correctSetFor(i: number): Set<string> {
    const q = questions[i] as any;
    if (isMatchingQuestion(q) || isSortingQuestion(q)) return new Set();
    const multi = Boolean(q.answers && q.answers.length > 0);
    return new Set(multi ? q.answers : [q.answer]);
  }

  function isSelectionCorrect(i: number, sel: string[]): boolean {
    const cs = correctSetFor(i);
    if (sel.length !== cs.size) return false;
    return sel.every((c) => cs.has(c));
  }

  function isAnswerCorrect(i: number, state: AnswerState): boolean {
    const q = questions[i] as any;
    if (isMatchingQuestion(q)) return isMatchCorrect(q.pairs, state.matches ?? {});
    if (isSortingQuestion(q)) return isSortCorrect(q.items, state.assignments ?? {});
    return isSelectionCorrect(i, state.selected);
  }

  function computeFinalScore() {
    let correctCount = 0;
    questions.forEach((_, i) => {
      const st = answersByIndex[i];
      if (st?.revealed && !st.skipped && isAnswerCorrect(i, st)) {
        correctCount++;
      }
    });
    return correctCount;
  }

  const answeredEntries = Object.entries(answersByIndex).filter(
    ([, s]) => s.revealed && !s.skipped
  );
  const runningCorrect = answeredEntries.filter(([i, s]) =>
    isAnswerCorrect(Number(i), s)
  ).length;
  const runningAnswered = answeredEntries.length;

  useEffect(() => {
    if (!timerEnabled) return;
    setSecondsLeft(TIMER_DURATION_SECONDS);
    finishedRef.current = false;
  }, [timerEnabled, subject]);

  useEffect(() => {
    if (!timerEnabled) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1 && !finishedRef.current) {
          finishedRef.current = true;
          clearInterval(interval);
          onFinish(computeFinalScore(), questions.length);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerEnabled]);

  if (!current) {
    return (
      <div className="text-center" style={{ color: "var(--ink-muted)" }}>
        This subject has no questions yet.
        <button
          onClick={onExit}
          className="block mx-auto mt-4 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          style={{ backgroundColor: "var(--surface)", color: "var(--ink)" }}
        >
          Back
        </button>
      </div>
    );
  }

  function updateCurrent(patch: Partial<AnswerState>) {
    setAnswersByIndex((prev) => ({
      ...prev,
      [index]: { ...(prev[index] ?? EMPTY_STATE), ...patch },
    }));
  }

  function toggleChoice(choice: string) {
    if (revealed) return;
    if (!isMulti) {
      updateCurrent({ selected: [choice] });
      return;
    }
    const next = selected.includes(choice)
      ? selected.filter((c) => c !== choice)
      : [...selected, choice];
    updateCurrent({ selected: next });
  }

  function handleLeftClick(pairId: string) {
    if (revealed) return;
    setSelectedLeftId((prev) => (prev === pairId ? null : pairId));
  }

  function handleRightClick(rightId: string) {
    if (revealed) return;
    const matches = { ...currentMatches };
    const usedByLeft = Object.keys(matches).find((k) => matches[k] === rightId);

    if (selectedLeftId) {
      if (matches[selectedLeftId] === rightId) {
        matches[selectedLeftId] = null;
        updateCurrent({ matches });
        setSelectedLeftId(null);
        return;
      }
      if (usedByLeft) matches[usedByLeft] = null;
      matches[selectedLeftId] = rightId;
      updateCurrent({ matches });
      setSelectedLeftId(null);
    } else if (usedByLeft) {
      setSelectedLeftId(usedByLeft);
    }
  }

  function handleSortAssign(itemId: string, category: string | null) {
    if (revealed) return;
    const assignments = { ...currentAssignments, [itemId]: category };
    updateCurrent({ assignments });
  }

  const matchedCount = matching
    ? Object.values(currentMatches).filter(Boolean).length
    : 0;
  // const assignedCount = sorting
  //   ? Object.values(currentAssignments).filter(Boolean).length
  //   : 0;

    const requiredSortItems = sorting
  ? (current.items as SortItem[]).filter((it) => it.category !== null)
  : [];
const assignedRequiredCount = sorting
  ? requiredSortItems.filter((it) => currentAssignments[it.id]).length
  : 0;

const canCheck = matching
  ? matchedCount === (current.pairs as MatchPair[]).length
  : sorting
  ? assignedRequiredCount === requiredSortItems.length
  : selected.length > 0;

  function handleCheck() {
    if (!canCheck) return;
    updateCurrent({ revealed: true, skipped: false });
  }

  function handleSkip() {
    updateCurrent({
      revealed: true,
      skipped: true,
      selected: [],
      matches: matching ? {} : undefined,
      assignments: sorting ? {} : undefined,
    });
    setSelectedLeftId(null);
  }

  function handlePrevious() {
    if (!isFirst) setIndex((i) => i - 1);
  }

  function handleNext() {
    if (isLast) {
      finishedRef.current = true;
      onFinish(computeFinalScore(), questions.length);
      return;
    }
    setIndex((i) => i + 1);
  }

  const progressPercent = Math.round(((index + 1) / questions.length) * 100);
  const timerLow = secondsLeft <= 300;
  const timerCritical = secondsLeft <= 60;

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onExit}
          className="text-sm px-2 py-1 -ml-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          style={{ color: "var(--ink-muted)" }}
        >
          ← Exit
        </button>
        {timerEnabled && (
          <div
            className={`text-sm font-semibold px-3 py-1 rounded-full tabular-nums ${
              timerCritical ? "animate-pulse" : ""
            }`}
            style={{
              backgroundColor: timerCritical
                ? "var(--low-soft)"
                : timerLow
                ? "var(--okay-soft)"
                : "var(--surface)",
              color: timerCritical
                ? "var(--low)"
                : timerLow
                ? "var(--okay)"
                : "var(--ink-muted)",
            }}
          >
            ⏱ {formatTime(secondsLeft)}
          </div>
        )}
      </div>

      <div
        className="flex items-center justify-between mb-2 text-sm"
        style={{ color: "var(--ink-muted)" }}
      >
        <span>
          Question {index + 1} of {questions.length}
        </span>
        <span className="font-medium" style={{ color: "var(--accent)" }}>
          Score: {runningCorrect}/{runningAnswered}
        </span>
      </div>

      <div
        className="w-full h-2 rounded-full overflow-hidden mb-5"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${progressPercent}%`, backgroundColor: "var(--accent)" }}
        />
      </div>

      <div
        className="rounded-2xl p-6 border"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <h2
          className="text-lg font-semibold mb-3 leading-snug"
          style={{ color: "var(--ink)" }}
        >
          {current.question}
        </h2>

        {isMulti && (
          <p className="text-sm mb-3" style={{ color: "var(--accent)" }}>
            Select {current.answers!.length} answers.
          </p>
        )}
        {matching && !revealed && (
          <p className="text-sm mb-3" style={{ color: "var(--accent)" }}>
            Tap a term, then tap its matching description.
          </p>
        )}
        {sorting && !revealed && (
          <p className="text-sm mb-3" style={{ color: "var(--accent)" }}>
            {assignedRequiredCount}/{requiredSortItems.length} sorted — drag a
            description onto its type, or tap one then tap a type.
          </p>
        )}

        {current.image && (
          <img
            src={current.image}
            alt="Exhibit"
            className="w-full rounded-lg mb-4"
            style={{ backgroundColor: "var(--bg)" }}
          />
        )}

        {current.exhibit && (
          <pre
            className="whitespace-pre-wrap break-words text-xs rounded-lg p-3 mb-4 overflow-x-auto border"
            style={{
              color: "var(--ink-muted)",
              backgroundColor: "var(--bg)",
              borderColor: "var(--border)",
            }}
          >
            {current.exhibit}
          </pre>
        )}

        {matching ? (
          <MatchingBoard
            pairs={current.pairs as MatchPair[]}
            shuffledRight={shuffledRight}
            matches={currentMatches}
            revealed={revealed}
            selectedLeftId={selectedLeftId}
            onLeftClick={handleLeftClick}
            onRightClick={handleRightClick}
          />
        ) : sorting ? (
          <SortingBoard
            categories={current.categories as string[]}
            items={shuffledItems}
            assignments={currentAssignments}
            revealed={revealed}
            onAssign={handleSortAssign}
          />
        ) : (
          <div className="space-y-3">
            {shuffledChoices.map((choice: string) => {
              const isSelected = selected.includes(choice);
              const isCorrectChoice = correctSet.has(choice);

              let boxStyle: React.CSSProperties = {
                borderColor: "var(--border)",
                color: "var(--ink)",
              };
              if (revealed) {
                if (isCorrectChoice) {
                  boxStyle = {
                    borderColor: "var(--good)",
                    backgroundColor: "var(--good-soft)",
                    color: "var(--good)",
                  };
                } else if (isSelected && !isCorrectChoice) {
                  boxStyle = {
                    borderColor: "var(--low)",
                    backgroundColor: "var(--low-soft)",
                    color: "var(--low)",
                  };
                } else {
                  boxStyle = {
                    borderColor: "var(--border)",
                    color: "var(--ink-faint)",
                    opacity: 0.6,
                  };
                }
              } else if (isSelected) {
                boxStyle = {
                  borderColor: "var(--accent)",
                  backgroundColor: "var(--good-soft)",
                  color: "var(--ink)",
                };
              }

              return (
                <button
                  key={choice}
                  onClick={() => toggleChoice(choice)}
                  disabled={revealed}
                  className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl border transition whitespace-pre-line focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  style={boxStyle}
                >
                  {revealed && isCorrectChoice && <CheckIcon />}
                  {revealed && isSelected && !isCorrectChoice && <CrossIcon />}
                  <span className="flex-1">{choice}</span>
                </button>
              );
            })}
          </div>
        )}

        {revealed && currentState.skipped && (
          <p className="mt-4 text-sm" style={{ color: "var(--okay)" }}>
            Skipped — correct {matching || sorting ? "groupings" : "answer"} shown above.
          </p>
        )}

        {current.explanation && revealed && (
          <p
            className="mt-4 text-sm rounded-lg p-3"
            style={{ color: "var(--ink-muted)", backgroundColor: "var(--bg)" }}
          >
            {current.explanation}
          </p>
        )}

        <div className="mt-5 flex gap-3">
          <button
            onClick={handlePrevious}
            disabled={isFirst}
            className="flex-1 py-3 rounded-xl font-medium disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            style={{ backgroundColor: "var(--surface-hover)", color: "var(--ink)" }}
          >
            ← Previous
          </button>

          {!revealed ? (
            <>
              <button
                onClick={handleSkip}
                className="flex-1 py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ backgroundColor: "var(--surface-hover)", color: "var(--ink)" }}
              >
                Skip
              </button>
              <button
                onClick={handleCheck}
                disabled={!canCheck}
                className="flex-1 py-3 rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
              >
                Check
              </button>
            </>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
            >
              {isLast ? "Finish" : "Next"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}