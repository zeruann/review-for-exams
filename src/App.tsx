import { useState } from "react";
import { midtermSubjects, finalsSubjects, quizzesSubjects } from "./data/subjects";
import type { Subject, ExamPeriod } from "./types/quiz";
import { useProgress } from "./hooks/useProgress";
import { useProfiles } from "./hooks/useProfiles";
import { usePersistedBoolean } from "./hooks/usePersistedBoolean";
import { usePersistedString } from "./hooks/usePersistedString";
import PeriodSelection from "./components/PeriodSelection";
import SubjectList from "./components/SubjectList";
import QuizSetup, { usesQuizOptions } from "./components/QuizSetup";

import TopicList, {
  filterSubjectByTopic,
  getTopics,
} from "./components/TopicList";
import SubQuizList from "./components/SubQuizList";
import Quiz from "./components/Quiz";
import Results from "./components/Results";
import ProfileGate from "./components/ProfileGate";
import ProfileSwitcher from "./components/ProfileSwitcher";

type ViewState =
  | { screen: "period" }
  | { screen: "list" }
  | { screen: "subquizzes"; subject: Subject }
  | { screen: "topics"; subject: Subject; parentSubject?: Subject }
  | { screen: "quiz"; subject: Subject; parentSubject?: Subject }
  | { screen: "setup"; subject: Subject; parentSubject?: Subject }
  | {
      screen: "results";
      subject: Subject;
      parentSubject?: Subject;
      correctCount: number;
      totalCount: number;
    };

type Theme = "dark" | "light";

const THEME_VARS: Record<Theme, React.CSSProperties> = {
  dark: {
    ["--bg" as string]: "#0F1319",
    ["--surface" as string]: "#181E29",
    ["--surface-hover" as string]: "#212A38",
    ["--border" as string]: "#2A3446",
    ["--border-subtle" as string]: "#1E2636",
    ["--ink" as string]: "#F3F5F7",
    ["--ink-muted" as string]: "#A1ADC0",
    ["--ink-faint" as string]: "#69778D",
    ["--accent" as string]: "#0D9488",
    ["--accent-hover" as string]: "#14B8A6",
    ["--accent-soft" as string]: "rgba(20, 184, 166, 0.16)",
    ["--accent-ink" as string]: "#FFFFFF",
    ["--good" as string]: "#10B981",
    ["--good-soft" as string]: "rgba(16, 185, 129, 0.16)",
    ["--okay" as string]: "#F59E0B",
    ["--okay-soft" as string]: "rgba(245, 158, 11, 0.16)",
    ["--low" as string]: "#F43F5E",
    ["--low-soft" as string]: "rgba(244, 63, 94, 0.16)",
  },
  light: {
    ["--bg" as string]: "#F7F6F2",
    ["--surface" as string]: "#FFFFFF",
    ["--surface-hover" as string]: "#F0EFE9",
    ["--border" as string]: "#E2DFD5",
    ["--border-subtle" as string]: "#ECEAE2",
    ["--ink" as string]: "#1C1F26",
    ["--ink-muted" as string]: "#5C6473",
    ["--ink-faint" as string]: "#8C95A6",
    ["--accent" as string]: "#0D9488",
    ["--accent-hover" as string]: "#0F766E",
    ["--accent-soft" as string]: "rgba(13, 148, 136, 0.12)",
    ["--accent-ink" as string]: "#FFFFFF",
    ["--good" as string]: "#059669",
    ["--good-soft" as string]: "rgba(5, 150, 105, 0.12)",
    ["--okay" as string]: "#D97706",
    ["--okay-soft" as string]: "rgba(217, 119, 6, 0.12)",
    ["--low" as string]: "#E11D48",
    ["--low-soft" as string]: "rgba(225, 29, 72, 0.12)",
  },
};

const PROFILES_ENABLED: boolean = false;
const GUEST_PROFILE = "__guest__";

export default function App() {
  const [view, setView] = useState<ViewState>({ screen: "period" });
  const [selectedPeriod, setSelectedPeriod] = usePersistedString(
    "exam-review-period",
    "midterm"
  ) as [ExamPeriod, (p: ExamPeriod) => void];

  const { profiles, activeProfile, selectProfile, switchToGate, deleteProfile } =
    useProfiles();

  const profile = PROFILES_ENABLED ? activeProfile : GUEST_PROFILE;

  const effectivePeriod: ExamPeriod =
    selectedPeriod === "finals" ? "midterm" : selectedPeriod;

  // Track progress separately for midterm, finals, and quizzes
  const { progress, recordAttempt } = useProgress(profile, effectivePeriod);
  const { progress: midtermProgress } = useProgress(profile, "midterm");
  const { progress: finalsProgress } = useProgress(profile, "finals");
  const { progress: quizzesProgress } = useProgress(profile, "quizzes");

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

  const activeSubjects =
    effectivePeriod === "quizzes" ? quizzesSubjects : midtermSubjects;

  if (!profile) {
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

  // Subjects with sub-quizzes open sub-quiz selection first.
  // Subjects with only one topic skip the picker and go straight to the quiz.
  const handleSelectSubject = (subject: Subject) => {
    if (subject.subQuizzes && subject.subQuizzes.length > 0) {
      setView({ screen: "subquizzes", subject });
    } else if (usesQuizOptions(subject) && subject.questions.length > 5) {
      setView({ screen: "setup", subject });
    } else if (getTopics(subject).length > 1) {
      setView({ screen: "topics", subject });
    } else {
      setView({ screen: "quiz", subject });
    }
  };

  const handleSelectSubQuiz = (subQuiz: Subject, parentSubject: Subject) => {
    if (usesQuizOptions(subQuiz) && subQuiz.questions.length > 5) {
      setView({ screen: "setup", subject: subQuiz, parentSubject });
    } else if (getTopics(subQuiz).length > 1) {
      setView({ screen: "topics", subject: subQuiz, parentSubject });
    } else {
      setView({ screen: "quiz", subject: subQuiz, parentSubject });
    }
  };

  return (
    <div
      className="min-h-screen px-4 py-6 md:py-10 transition-colors duration-200"
      style={{
        ...THEME_VARS[activeTheme],
        backgroundColor: "var(--bg)",
        color: "var(--ink)",
      }}
    >
      <header className="max-w-2xl mx-auto mb-6 flex justify-between items-center gap-3">
        {PROFILES_ENABLED ? (
          <ProfileSwitcher activeProfile={profile} onSwitch={switchToGate} />
        ) : (
          <div
            className="px-3.5 py-1.5 rounded-full border text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 select-none"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--ink-muted)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span>Made with</span>
            <span className="text-[var(--low)] font-bold">{"<3"}</span>
            <span>by</span>
            <span className="font-bold text-[var(--ink)]">Hazel</span>
          </div>
        )}

        <div
          role="radiogroup"
          aria-label="Color theme"
          className="inline-flex rounded-full border p-1 gap-1 ml-auto shadow-sm"
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
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all focus:outline-none focus:ring-2 active-press flex items-center gap-1.5"
              style={{
                backgroundColor:
                  activeTheme === t ? "var(--accent)" : "transparent",
                color:
                  activeTheme === t ? "var(--accent-ink)" : "var(--ink-muted)",
                boxShadow: activeTheme === t ? "0 2px 8px rgba(13, 148, 136, 0.25)" : "none",
              }}
            >
              <span>{t === "dark" ? "🌙" : "☀️"}</span>
              <span>{t}</span>
            </button>
          ))}
        </div>
      </header>

      {view.screen === "period" && (
        <PeriodSelection
          midtermSubjects={midtermSubjects}
          finalsSubjects={finalsSubjects}
          quizzesSubjects={quizzesSubjects}
          midtermProgress={midtermProgress}
          finalsProgress={finalsProgress}
          quizzesProgress={quizzesProgress}
          onSelectPeriod={(period) => {
            if (period === "finals") return;
            setSelectedPeriod(period);
            setView({ screen: "list" });
          }}
        />
      )}

      {view.screen === "list" && (
        <SubjectList
          subjects={activeSubjects}
          progress={progress}
          period={effectivePeriod}
          onSelect={handleSelectSubject}
          onBackToPeriod={() => setView({ screen: "period" })}
          onChangePeriod={(p) => {
            if (p === "finals") return;
            setSelectedPeriod(p);
          }}
        />
      )}

      {view.screen === "subquizzes" && (
        <SubQuizList
          parentSubject={view.subject}
          progress={progress}
          onSelect={(subQuiz) => handleSelectSubQuiz(subQuiz, view.subject)}
          onBack={() => setView({ screen: "list" })}
        />
      )}

      {view.screen === "topics" && (
        <TopicList
          subject={view.subject}
          onBack={() =>
            view.parentSubject
              ? setView({ screen: "subquizzes", subject: view.parentSubject })
              : setView({ screen: "list" })
          }
          onSelect={(topic) =>
            setView({
              screen: "quiz",
              subject: filterSubjectByTopic(view.subject, topic),
              parentSubject: view.parentSubject,
            })
          }
        />
      )}

      {view.screen === "quiz" && (
        <Quiz
          subject={view.subject}
          shuffleQuestions={
            usesQuizOptions(view.subject) && view.subject.questions.length > 5
              ? shuffleQuestions
              : true
          }
          questionLimit={
            usesQuizOptions(view.subject) && view.subject.questions.length > 5
              ? questionLimitNumber
              : null
          }
          timerEnabled={
            usesQuizOptions(view.subject) && view.subject.questions.length > 5
              ? timerEnabled
              : false
          }
          onExit={() =>
            view.parentSubject
              ? setView({ screen: "subquizzes", subject: view.parentSubject })
              : setView({ screen: "list" })
          }
          onFinish={(correctCount, totalCount) => {
            recordAttempt(view.subject.id, correctCount, totalCount);
            if (view.parentSubject) {
              recordAttempt(view.parentSubject.id, correctCount, totalCount);
            }
            setView({
              screen: "results",
              subject: view.subject,
              parentSubject: view.parentSubject,
              correctCount,
              totalCount,
            });
          }}
        />
      )}

      {view.screen === "setup" && (
        <QuizSetup
          subject={view.subject}
          shuffleQuestions={shuffleQuestions}
          onToggleShuffle={setShuffleQuestions}
          questionLimit={questionLimit}
          onChangeQuestionLimit={setQuestionLimit}
          timerEnabled={timerEnabled}
          onToggleTimer={setTimerEnabled}
          onBack={() =>
            view.parentSubject
              ? setView({ screen: "subquizzes", subject: view.parentSubject })
              : setView({ screen: "list" })
          }
          onStart={() =>
            setView({
              screen: "quiz",
              subject: view.subject,
              parentSubject: view.parentSubject,
            })
          }
        />
      )}

      {view.screen === "results" && (
        <Results
          subjectName={view.subject.name}
          correctCount={view.correctCount}
          totalCount={view.totalCount}
          onRetry={() =>
            setView({
              screen: "quiz",
              subject: view.subject,
              parentSubject: view.parentSubject,
            })
          }
          onBackToSubjects={() =>
            view.parentSubject
              ? setView({ screen: "subquizzes", subject: view.parentSubject })
              : setView({ screen: "list" })
          }
        />
      )}
    </div>
  );
}