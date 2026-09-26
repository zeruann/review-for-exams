import { useState } from "react";
import { subjects } from "./data/subjects";
import type { Subject } from "./types/quiz";
import { useProgress } from "./hooks/useProgress";
import SubjectList from "./components/SubjectList";
import Quiz from "./components/Quiz";
import Results from "./components/Results";

type ViewState =
  | { screen: "list" }
  | { screen: "quiz"; subject: Subject }
  | {
      screen: "results";
      subject: Subject;
      correctCount: number;
      totalCount: number;
    };

export default function App() {
  const [view, setView] = useState<ViewState>({ screen: "list" });
  const { progress, recordAttempt } = useProgress();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-4 py-8">
      {view.screen === "list" && (
        <SubjectList
          subjects={subjects}
          progress={progress}
          onSelect={(subject) => setView({ screen: "quiz", subject })}
        />
      )}

      {view.screen === "quiz" && (
        <Quiz
          subject={view.subject}
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
