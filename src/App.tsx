import { useState } from "react";
import { subjects } from "./data/subjects";
import type { Subject } from "./types/quiz";
import { useProgress } from "./hooks/useProgress";
import { useProfiles } from "./hooks/useProfiles";
import { usePersistedBoolean } from "./hooks/usePersistedBoolean";
import { usePersistedString } from "./hooks/usePersistedString";
import SubjectList from "./components/SubjectList";
import Quiz from "./components/Quiz";
import Results from "./components/Results";
import ProfileGate from "./components/ProfileGate";
import ProfileSwitcher from "./components/ProfileSwitcher";

type ViewState =
  | { screen: "list" }
  | { screen: "quiz"; subject: Subject }
  | {
      screen: "results";
      subject: Subject;
      correctCount: number;
      totalCount: number;
    };

type Theme = "dark" | "light";

const THEME_VARS: Record<Theme, React.CSSProperties> = {
  dark: {
    ["--bg" as string]: "#171B24",
    ["--surface" as string]: "#20242F",
    ["--surface-hover" as string]: "#282D3B",
    ["--border" as string]: "#333846",
    ["--ink" as string]: "#E7E5E0",
    ["--ink-muted" as string]: "#9B9B96",
    ["--ink-faint" as string]: "#6E6E68",
    ["--accent" as string]: "#5FA8A0",
    ["--accent-ink" as string]: "#0F1613",
    ["--good" as string]: "#7FAE8C",
    ["--good-soft" as string]: "rgba(127, 174, 140, 0.14)",
    ["--okay" as string]: "#C9A15A",
    ["--okay-soft" as string]: "rgba(201, 161, 90, 0.14)",
    ["--low" as string]: "#C77B6C",
    ["--low-soft" as string]: "rgba(199, 123, 108, 0.14)",
  },
  light: {
    ["--bg" as string]: "#F3F1EB",
    ["--surface" as string]: "#FFFFFF",
    ["--surface-hover" as string]: "#EAE7DE",
    ["--border" as string]: "#DEDAD0",
    ["--ink" as string]: "#2A2A26",
    ["--ink-muted" as string]: "#6B6A62",
    ["--ink-faint" as string]: "#9B9A90",
    ["--accent" as string]: "#3E8F86",
    ["--accent-ink" as string]: "#FFFFFF",
    ["--good" as string]: "#3F7A54",
    ["--good-soft" as string]: "rgba(63, 122, 84, 0.10)",
    ["--okay" as string]: "#9C7126",
    ["--okay-soft" as string]: "rgba(156, 113, 38, 0.10)",
    ["--low" as string]: "#A6503F",
    ["--low-soft" as string]: "rgba(166, 80, 63, 0.10)",
  },
};

export default function App() {
  const [view, setView] = useState<ViewState>({ screen: "list" });
  const { profiles, activeProfile, selectProfile, switchToGate, deleteProfile } = useProfiles();



  
  const { progress, recordAttempt } = useProgress(activeProfile);
  const [shuffleQuestions, setShuffleQuestions] = usePersistedBoolean(
    "exam-review-shuffle",
    true
  );
  const [questionLimit, setQuestionLimit] = usePersistedString(
    "exam-review-question-limit",
    "all"
  );
  const [timerEnabled, setTimerEnabled] = usePersistedBoolean(
    "exam-review-timer",
    false
  );
  const [theme, setTheme] = usePersistedString("exam-review-theme", "dark");
  const activeTheme: Theme = theme === "light" ? "light" : "dark";
  const questionLimitNumber =
    questionLimit === "all" ? null : Number(questionLimit);

  if (!activeProfile) {
    return (
      <div style={THEME_VARS[activeTheme]}>
        <ProfileGate
          profiles={profiles}
          onSelect={selectProfile}
          onDelete={deleteProfile}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-8"
      style={{
        ...THEME_VARS[activeTheme],
        backgroundColor: "var(--bg)",
        color: "var(--ink)",
        fontFamily: "'Atkinson Hyperlegible', system-ui, sans-serif",
      }}
    >
      <div className="max-w-xl mx-auto mb-4 flex justify-between items-center gap-3">
        <ProfileSwitcher activeProfile={activeProfile} onSwitch={switchToGate} />

        <div
          role="radiogroup"
          aria-label="Color theme"
          className="inline-flex rounded-lg border p-1 gap-1"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface)",
          }}
        >
          {(["light", "dark"] as Theme[]).map((t) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={activeTheme === t}
              onClick={() => setTheme(t)}
              className="px-3 py-1.5 rounded-md text-sm font-semibold capitalize focus:outline-none focus:ring-2"
              style={{
                backgroundColor:
                  activeTheme === t ? "var(--accent)" : "transparent",
                color:
                  activeTheme === t ? "var(--accent-ink)" : "var(--ink-muted)",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {view.screen === "list" && (
        <SubjectList
          subjects={subjects}
          progress={progress}
          shuffleQuestions={shuffleQuestions}
          onToggleShuffle={setShuffleQuestions}
          questionLimit={questionLimit}
          onChangeQuestionLimit={setQuestionLimit}
          timerEnabled={timerEnabled}
          onToggleTimer={setTimerEnabled}
          onSelect={(subject) => setView({ screen: "quiz", subject })}
        />
      )}

      {view.screen === "quiz" && (
        <Quiz
          subject={view.subject}
          shuffleQuestions={shuffleQuestions}
          questionLimit={questionLimitNumber}
          timerEnabled={timerEnabled}
          onExit={() => setView({ screen: "list" })}
          onFinish={(correctCount, totalCount) => {
            recordAttempt(view.subject.id, correctCount, totalCount);
            setView({
              screen: "results",
              subject: view.subject,
              correctCount,
              totalCount,
            });
          }}
        />
      )}

      {view.screen === "results" && (
        <Results
          subjectName={view.subject.name}
          correctCount={view.correctCount}
          totalCount={view.totalCount}
          onRetry={() => setView({ screen: "quiz", subject: view.subject })}
          onBackToSubjects={() => setView({ screen: "list" })}
        />
      )}
    </div>
  );
}