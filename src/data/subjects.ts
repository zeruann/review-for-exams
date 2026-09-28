import type { Subject, Question } from "../types/quiz";
import networking2 from "./networking2.json";
import advancedDatabaseSystems from "./advanced-database-systems.json";
import purposiveCommunication from "./purposive-communication.json";
import informationAssuranceSecurity from "./information-assurance-security.json";
import integrativeProgramming2 from "./integrative-programming-2.json";
import systemsIntegrationArchitecture from "./systems-integration-architecture.json";
import scienceTechnologySociety from "./science-technology-society.json";

// To add or update questions: just edit the matching .json file in this folder.
// Each file is a plain array of Question objects (see types/quiz.ts).
export const subjects: Subject[] = [
  { id: "networking2", name: "Networking 2", questions: networking2 as Question[] },
  {
    id: "advanced-database-systems",
    name: "Advanced Database Systems",
    questions: advancedDatabaseSystems as Question[],
  },
  {
    id: "purposive-communication",
    name: "Purposive Communication",
    questions: purposiveCommunication as Question[],
  },
  {
    id: "information-assurance-security",
    name: "Information Assurance and Security",
    questions: informationAssuranceSecurity as Question[],
  },
  {
    id: "integrative-programming-2",
    name: "Integrative Programming and Technologies 2",
    questions: integrativeProgramming2 as Question[],
  },
  {
    id: "systems-integration-architecture",
    name: "Systems Integration Architecture",
    questions: systemsIntegrationArchitecture as Question[],
  },
  {
    id: "science-technology-society",
    name: "Science, Technology, and Society",
    questions: scienceTechnologySociety as Question[],
  },
];