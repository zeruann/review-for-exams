import type { Subject, Question, ExamPeriod } from "../types/quiz";
// Midterm question banks
import networking2 from "./networking2.json";
import advancedDatabaseSystems from "./advanced-database-systems.json";
import purposiveCommunication from "./purposive-communication.json";
import informationAssuranceSecurity from "./information-assurance-security.json";
import integrativeProgramming2 from "./integrative-programming-2.json";
import systemsIntegrationArchitecture from "./systems-integration-architecture.json";
import scienceTechnologySociety from "./science-technology-society.json";

// Finals question banks (starts with 2 questions per subject)
import finalsNetworking2 from "./finals/networking2.json";
import finalsAdvancedDatabaseSystems from "./finals/advanced-database-systems.json";
import finalsPurposiveCommunication from "./finals/purposive-communication.json";
import finalsInformationAssuranceSecurity from "./finals/information-assurance-security.json";
import finalsIntegrativeProgramming2 from "./finals/integrative-programming-2.json";
import finalsSystemsIntegrationArchitecture from "./finals/systems-integration-architecture.json";
import finalsScienceTechnologySociety from "./finals/science-technology-society.json";

// Quizzes question banks
import quizNetworking2 from "./quizzes/networking2.json";
import quizAdvancedDatabaseSystems from "./quizzes/advanced-database-systems.json";
import quizPurposiveCommunication from "./quizzes/purposive-communication.json";
import quizInformationAssuranceSecurity from "./quizzes/information-assurance-security.json";
import quizIntegrativeProgramming2 from "./quizzes/integrative-programming-2.json";
import quizSystemsIntegrationArchitecture from "./quizzes/systems-integration-architecture.json";
import quizScienceTechnologySociety from "./quizzes/science-technology-society.json";

export const midtermSubjects: Subject[] = [
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

export const finalsSubjects: Subject[] = [
  {
    id: "networking2",
    name: "Networking 2",
    questions: finalsNetworking2 as Question[],
  },
  {
    id: "advanced-database-systems",
    name: "Advanced Database Systems",
    questions: finalsAdvancedDatabaseSystems as Question[],
  },
  {
    id: "purposive-communication",
    name: "Purposive Communication",
    questions: finalsPurposiveCommunication as Question[],
  },
  {
    id: "information-assurance-security",
    name: "Information Assurance and Security",
    questions: finalsInformationAssuranceSecurity as Question[],
  },
  {
    id: "integrative-programming-2",
    name: "Integrative Programming and Technologies 2",
    questions: finalsIntegrativeProgramming2 as Question[],
  },
  {
    id: "systems-integration-architecture",
    name: "Systems Integration Architecture",
    questions: finalsSystemsIntegrationArchitecture as Question[],
  },
  {
    id: "science-technology-society",
    name: "Science, Technology, and Society",
    questions: finalsScienceTechnologySociety as Question[],
  },
];

export const quizzesSubjects: Subject[] = [
  {
    id: "networking2",
    name: "Networking 2",
    questions: quizNetworking2 as Question[],
  },
  {
    id: "advanced-database-systems",
    name: "Advanced Database Systems",
    questions: quizAdvancedDatabaseSystems as Question[],
  },
  {
    id: "purposive-communication",
    name: "Purposive Communication",
    questions: quizPurposiveCommunication as Question[],
  },
  {
    id: "information-assurance-security",
    name: "Information Assurance and Security",
    questions: quizInformationAssuranceSecurity as Question[],
  },
  {
    id: "integrative-programming-2",
    name: "Integrative Programming and Technologies 2",
    questions: quizIntegrativeProgramming2 as Question[],
  },
  {
    id: "systems-integration-architecture",
    name: "Systems Integration Architecture",
    questions: quizSystemsIntegrationArchitecture as Question[],
  },
  {
    id: "science-technology-society",
    name: "Science, Technology, and Society",
    questions: quizScienceTechnologySociety as Question[],
  },
];

export const subjectsByPeriod: Record<ExamPeriod, Subject[]> = {
  midterm: midtermSubjects,
  finals: finalsSubjects,
  quizzes: quizzesSubjects,
};

// Default export for backwards compatibility
export const subjects = midtermSubjects;