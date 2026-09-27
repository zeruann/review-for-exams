export interface MatchPair {
  id: string;
  left: string;
  right: string;
}

export interface Question {
  id: string;
  question: string;
  explanation?: string;
  exhibit?: string; // monospace text block (CLI output, config, etc.)
  image?: string; // path to an image/diagram in /public, e.g. "/exhibits/q7-topology.svg"

  // Standard multiple-choice fields — omit these for matching questions
  choices?: string[];
  answer?: string; // must exactly match one of the choices (ignored if `answers` is set)
  answers?: string[]; // set this instead of `answer` for "choose two/more" questions

  // Matching-question fields — set these instead of choices/answer/answers
  type?: "matching";
  pairs?: MatchPair[];
}

export interface Subject {
  id: string;
  name: string;
  questions: Question[];
}