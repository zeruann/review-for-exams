export interface Question {
  id: string;
  question: string;
  choices: string[];
  answer: string; // must exactly match one of the choices (ignored if `answers` is set)
  answers?: string[]; // set this instead of `answer` for "choose two/more" questions
  explanation?: string;
  exhibit?: string; // monospace text block (CLI output, config, etc.)
  image?: string; // path to an image/diagram in /public, e.g. "/exhibits/q7-topology.svg"
}

export interface Subject {
  id: string;
  name: string;
  questions: Question[];
}
