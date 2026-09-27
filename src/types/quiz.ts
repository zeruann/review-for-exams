export interface MatchPair {
  id: string;
  left: string;
  right: string;
}

export interface SortItem {
  id: string;
  text: string;
  category: string; // must exactly match one entry in the question's `categories`
}

export interface Question {
  id: string;
  question: string;
  explanation?: string;
  exhibit?: string;
  image?: string;

  choices?: string[];
  answer?: string;
  answers?: string[];

  type?: "matching" | "sorting";

  // matching fields
  pairs?: MatchPair[];

  // sorting fields
  categories?: string[];
  items?: SortItem[];
}

export interface Subject {
  id: string;
  name: string;
  questions: Question[];
}