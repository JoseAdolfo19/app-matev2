/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = "estudiante" | "docente";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  section?: string; // e.g. "3° A", "4° B", "5° A"
  avatar?: string;
  createdAt?: string;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  description: string;
  level: string; // e.g., "1° de Secundaria", "2° de Secundaria"
  resourceType: "video" | "pdf" | "link";
  resourceValue: string; // Fictitious file URL/link
  createdAt: string;
}

export interface Exercise {
  id: string;
  lessonId: string;
  question: string;
  type: "numeric" | "multiple_choice";
  options?: string[]; // If multiple choice
  correctAnswer: string;
  solutionExplanation: string;
}

export type QuestionType = "multiple_choice" | "true_false" | "numeric";

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[]; // Needed for multiple_choice
  correctAnswer: string; // "A", "B", "C", "D" or "true" / "false" or number as string
  points: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  durationMinutes: number; // For countdown
  questions: Question[];
  level: string;
  createdAt: string;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  section: string;
  answers: { [questionId: string]: string };
  score: number; // scale 0 - 20 (standard in Peru/many LatAm countries) or 0-100
  passed: boolean;
  timeSpentSeconds: number;
  completedAt: string;
}

// Student record for Docente tracker
export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  section: string;
  averageGrade: number; // 0-20
  completedLessonsCount: number;
  completedExamsCount: number;
  status: "excelente" | "regular" | "riesgo";
  lastActive: string;
}

// Mock API responses helper for Simulated Laravel backend
export interface LaravelMockResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  laravel_endpoint: string; // To demonstrate client-server architectural decoupling
  timestamp: string;
}
