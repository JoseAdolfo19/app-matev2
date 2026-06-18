/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Unit, Lesson, Exercise, Exam, StudentRecord, LaravelMockResponse, Question, Role, ExamAttempt } from "./types";

// Base URL for simulated Laravel Backend
export const LARAVEL_API_BASE = "https://mi-api-laravel.test/api/v1";

// 1. Mock Units
export const MOCK_UNITS: Unit[] = [
  {
    id: "unit-1",
    title: "Unidad 1: Álgebra Básica",
    description: "Ecuaciones lineales, sistemas de ecuaciones y modelado de problemas cotidianos."
  },
  {
    id: "unit-2",
    title: "Unidad 2: Geometría y Funciones",
    description: "Teorema de Pitágoras, perímetros, áreas y representación gráfica de funciones."
  },
  {
    id: "unit-3",
    title: "Unidad 3: Estadística y Probabilidad",
    description: "Medidas de tendencia central, rango, varianza y análisis de probabilidad simple."
  }
];

// 2. Mock Lessons
export const MOCK_LESSONS: Lesson[] = [
  {
    id: "lesson-1",
    unitId: "unit-1",
    title: "Introducción a Ecuaciones de Primer Grado",
    description: "Aprende el concepto de igualdad matemática y cómo despejar la incógnita 'x' usando operaciones inversas de manera balanceada.",
    level: "1° de Secundaria",
    resourceType: "video",
    resourceValue: "https://www.youtube.com/embed/hM0sAg1pUZY?si=yPHJy0_PnnGxbCC0",
    createdAt: "2026-06-10"
  },
  {
    id: "lesson-2",
    unitId: "unit-1",
    title: "Sistemas de Ecuaciones Lineales 2x2",
    description: "Estudio de métodos de resolución de sistemas: reducción, sustitución e igualación.",
    level: "2° de Secundaria",
    resourceType: "pdf",
    resourceValue: "Sistemas_de_Ecuaciones_Lineales_2x2_Guia.pdf",
    createdAt: "2026-06-12"
  },
  {
    id: "lesson-3",
    unitId: "unit-2",
    title: "El Teorema de Pitágoras y sus Aplicaciones",
    description: "Descubre la relación geométrica entre los catetos y la hipotenusa de un triángulo rectángulo, y cómo calcular distancias inaccesibles.",
    level: "1° de Secundaria",
    resourceType: "link",
    resourceValue: "https://es.khanacademy.org/math/geometry/hs-geo-trig/hs-geo-pythagorean-theorem",
    createdAt: "2026-06-14"
  },
  {
    id: "lesson-4",
    unitId: "unit-3",
    title: "Medidas de Tendencia Central",
    description: "Cómo calcular e interpretar la Media Aritmética, la Mediana y la Moda en conjuntos de datos reales de encuestas estudiantiles.",
    level: "2° de Secundaria",
    resourceType: "pdf",
    resourceValue: "Estadistica_Descriptiva_Basica.pdf",
    createdAt: "2026-06-16"
  }
];

// 3. Mock Exercises
export const MOCK_EXERCISES: Exercise[] = [
  {
    id: "ex-1",
    lessonId: "lesson-1",
    question: "Resuelve la ecuación lineal: 3x + 8 = 23. ¿Cuál es el valor de x?",
    type: "numeric",
    correctAnswer: "5",
    solutionExplanation: "Despejamos: restamos 8 a ambos lados para obtener 3x = 15. Luego dividimos por 3, resultando x = 5."
  },
  {
    id: "ex-2",
    lessonId: "lesson-1",
    question: "Encuentra el valor de x en: 5x - 7 = 2x + 11.",
    type: "numeric",
    correctAnswer: "6",
    solutionExplanation: "Restamos 2x a ambos lados: 3x - 7 = 11. Sumamos 7 a ambos lados: 3x = 18. Dividimos entre 3: x = 6."
  },
  {
    id: "ex-3",
    lessonId: "lesson-2",
    question: "Resuelve el sistema:\nx + y = 10\nx - y = 4\n¿Cuál es el valor del producto (x · y)?",
    type: "numeric",
    correctAnswer: "21",
    solutionExplanation: "Sumando ambas ecuaciones se obtiene 2x = 14, por lo que x = 7. Reemplazando se halla y = 3. El producto x · y = 7 · 3 = 21."
  },
  {
    id: "ex-4",
    lessonId: "lesson-3",
    question: "En un triángulo rectángulo, los catetos miden 6 cm y 8 cm. ¿Cuánto mide su hipotenusa en centímetros?",
    type: "numeric",
    correctAnswer: "10",
    solutionExplanation: "Por el Teorema de Pitágoras: h² = 6² + 8² = 36 + 64 = 100. Por lo tanto, h = √100 = 10 cm."
  },
  {
    id: "ex-5",
    lessonId: "lesson-4",
    question: "Encuentra la mediana del siguiente conjunto de calificaciones: [11, 15, 12, 19, 14].",
    type: "numeric",
    correctAnswer: "14",
    solutionExplanation: "Primero ordenamos el conjunto de menor a mayor: [11, 12, 14, 15, 19]. El valor central es 14."
  }
];

// 4. Mock Exams
export const MOCK_EXAMS: Exam[] = [
  {
    id: "exam-1",
    title: "Evaluación Mensual - Razonamiento Algebraico",
    description: "Evaluación sobre ecuaciones de primer grado, reducción de términos semejantes y operaciones básicas.",
    durationMinutes: 15,
    level: "1° de Secundaria",
    createdAt: "2026-06-15",
    questions: [
      {
        id: "q-11",
        text: "¿Cuál de las siguientes expresiones representa 'el triple de un número aumentado en su doble'?",
        type: "multiple_choice",
        options: [
          "A) 3(x + 2x)",
          "B) 3x + 2x",
          "C) 3x + x/2",
          "D) x³ + 2x"
        ],
        correctAnswer: "B",
        points: 5
      },
      {
        id: "q-12",
        text: "Ecuaciones lineales: Toda ecuación de primer grado con una incógnita tiene siempre un número infinito de soluciones reales.",
        type: "true_false",
        correctAnswer: "false",
        points: 5
      },
      {
        id: "q-13",
        text: "Resuelve y determina el valor numérico de x en la ecuación: 4(x - 3) = 2x + 10.",
        type: "numeric",
        correctAnswer: "11",
        points: 10
      }
    ]
  },
  {
    id: "exam-2",
    title: "Examen de Unidad: Geometría Métrica y Pitágoras",
    description: "Examina tu comprensión sobre el teorema de Pitágoras, cálculo de áreas de polígonos y perímetros compuestos.",
    durationMinutes: 20,
    level: "2° de Secundaria",
    createdAt: "2026-06-17",
    questions: [
      {
        id: "q-21",
        text: "Si la hipotenusa de un triángulo rectángulo mide 13 cm y uno de sus catetos mide 5 cm, ¿cuánto mide el otro cateto en cm?",
        type: "numeric",
        correctAnswer: "12",
        points: 6
      },
      {
        id: "q-22",
        text: "La suma de las medidas de los ángulos interiores de cualquier triángulo es igual a 180°.",
        type: "true_false",
        correctAnswer: "true",
        points: 4
      },
      {
        id: "q-23",
        text: "¿Cuál es el área de un triángulo cuya base mide 10 cm y su altura asociada mide 7 cm?",
        type: "multiple_choice",
        options: [
          "A) 70 cm²",
          "B) 35 cm²",
          "C) 17.5 cm²",
          "D) 100 cm²"
        ],
        correctAnswer: "B",
        points: 10
      }
    ]
  }
];

// 5. Mock Student Records for Academic Tracking
export const MOCK_STUDENTS: StudentRecord[] = [
  {
    id: "st-1",
    name: "Juan Diego Pérez",
    email: "juan.perez@lasalleurubamba.edu.pe",
    section: "1° de Secundaria",
    averageGrade: 18.5,
    completedLessonsCount: 3,
    completedExamsCount: 2,
    status: "excelente",
    lastActive: "Hoy, Hace 15 min"
  },
  {
    id: "st-2",
    name: "María Fernanda Rodríguez",
    email: "maria.rodriguez@lasalleurubamba.edu.pe",
    section: "1° de Secundaria",
    averageGrade: 14.8,
    completedLessonsCount: 2,
    completedExamsCount: 2,
    status: "regular",
    lastActive: "Ayer, 18:30"
  },
  {
    id: "st-3",
    name: "Carlos Daniel Mendoza",
    email: "carlos.mendoza@lasalleurubamba.edu.pe",
    section: "2° de Secundaria",
    averageGrade: 9.5,
    completedLessonsCount: 1,
    completedExamsCount: 1,
    status: "riesgo",
    lastActive: "Hace 4 días"
  },
  {
    id: "st-4",
    name: "Ana Gabriela Gómez",
    email: "ana.gomez@lasalleurubamba.edu.pe",
    section: "1° de Secundaria",
    averageGrade: 12.2,
    completedLessonsCount: 2,
    completedExamsCount: 1,
    status: "regular",
    lastActive: "Hoy, Hace 2 horas"
  },
  {
    id: "st-5",
    name: "Luis Fernando Torres",
    email: "luis.torres@lasalleurubamba.edu.pe",
    section: "2° de Secundaria",
    averageGrade: 8.0,
    completedLessonsCount: 0,
    completedExamsCount: 1,
    status: "riesgo",
    lastActive: "Hace una semana"
  },
  {
    id: "st-6",
    name: "Sofía Castro Valer",
    email: "sofia.castro@lasalleurubamba.edu.pe",
    section: "2° de Secundaria",
    averageGrade: 19.2,
    completedLessonsCount: 4,
    completedExamsCount: 2,
    status: "excelente",
    lastActive: "Hoy, Activa ahora"
  },
  {
    id: "st-7",
    name: "Adriana Belén Salas",
    email: "adriana.salas@lasalleurubamba.edu.pe",
    section: "1° de Secundaria",
    averageGrade: 15.5,
    completedLessonsCount: 3,
    completedExamsCount: 1,
    status: "excelente",
    lastActive: "Hace 2 días"
  },
  {
    id: "st-8",
    name: "Mateo Ignacio Quispe",
    email: "mateo.quispe@lasalleurubamba.edu.pe",
    section: "2° de Secundaria",
    averageGrade: 10.5,
    completedLessonsCount: 1,
    completedExamsCount: 2,
    status: "riesgo",
    lastActive: "Hace 3 días"
  }
];

// Helper to bundle api log tracking
export interface ApiLog {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  payload?: string;
  response: string;
  status: number;
  timestamp: string;
}

// Global logger store state simulation helper
let globalApiLogs: ApiLog[] = [];
let onLogAddedCallback: ((log: ApiLog) => void) | null = null;

export function registerLogCallback(callback: (log: ApiLog) => void) {
  onLogAddedCallback = callback;
}

export function addApiLog(method: "GET" | "POST" | "PUT" | "DELETE", endpoint: string, payload: any, response: any, status: number = 200) {
  const newLog: ApiLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    method,
    endpoint: `${LARAVEL_API_BASE}${endpoint}`,
    payload: payload ? JSON.stringify(payload, null, 2) : undefined,
    response: JSON.stringify(response, null, 2),
    status,
    timestamp: new Date().toLocaleTimeString()
  };
  globalApiLogs = [newLog, ...globalApiLogs].slice(0, 50); // Keep last 50
  if (onLogAddedCallback) {
    onLogAddedCallback(newLog);
  }
  return newLog;
}

export function getApiLogs(): ApiLog[] {
  return globalApiLogs;
}

// 6. Async Mock Simulators representing Laravel REST client calls
export const apiSimulate = {
  // Authentication
  login: async (email: string, role: Role): Promise<LaravelMockResponse<{ user: any; token: string }>> => {
    await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate network latency
    const matchedStudent = MOCK_STUDENTS.find(s => s.email.toLowerCase() === email.toLowerCase());
    
    let defaultName = role === "docente" ? "Prof. Alejandro Valdivia" : "Estudiante Invitado";
    let defaultSection = role === "docente" ? undefined : "1° de Secundaria";

    if (matchedStudent && role === "estudiante") {
      defaultName = matchedStudent.name;
      defaultSection = matchedStudent.section;
    }

    const resData = {
      user: {
        id: matchedStudent?.id || (role === "docente" ? "prof-101" : "stud-999"),
        name: defaultName,
        email: email,
        role: role,
        section: defaultSection,
        avatar: role === "docente" 
          ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
          : "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120"
      },
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.laravel_token_signature_example"
    };

    addApiLog("POST", "/auth/login", { email, role }, resData, 200);
    return {
      success: true,
      data: resData,
      message: "Logueado exitosamente mediante Laravel Passport/Sanctum.",
      laravel_endpoint: "/auth/login",
      timestamp: new Date().toISOString()
    };
  },

  // Lessons and Units
  getLessons: async (): Promise<LaravelMockResponse<Lesson[]>> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    addApiLog("GET", "/lessons", null, MOCK_LESSONS, 200);
    return {
      success: true,
      data: MOCK_LESSONS,
      laravel_endpoint: "/lessons",
      timestamp: new Date().toISOString()
    };
  },

  createLesson: async (lessonData: Omit<Lesson, "id" | "createdAt">): Promise<LaravelMockResponse<Lesson>> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newLesson: Lesson = {
      ...lessonData,
      id: `lesson-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0]
    };
    
    // Add dynamically to local mock storage in real usage scenarios
    addApiLog("POST", "/lessons", lessonData, newLesson, 201);
    return {
      success: true,
      data: newLesson,
      message: "Lección de matemática creada de forma duradera en la base de datos MySQL (Laravel Eloquent).",
      laravel_endpoint: "/lessons",
      timestamp: new Date().toISOString()
    };
  },

  // Exercises
  getExercises: async (lessonId: string): Promise<LaravelMockResponse<Exercise[]>> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = MOCK_EXERCISES.filter(ex => ex.lessonId === lessonId);
    addApiLog("GET", `/lessons/${lessonId}/exercises`, null, list, 200);
    return {
      success: true,
      data: list,
      laravel_endpoint: `/lessons/${lessonId}/exercises`,
      timestamp: new Date().toISOString()
    };
  },

  // Exams
  getExams: async (): Promise<LaravelMockResponse<Exam[]>> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    addApiLog("GET", "/exams", null, MOCK_EXAMS, 200);
    return {
      success: true,
      data: MOCK_EXAMS,
      laravel_endpoint: "/exams",
      timestamp: new Date().toISOString()
    };
  },

  createExam: async (examData: Omit<Exam, "id" | "createdAt">): Promise<LaravelMockResponse<Exam>> => {
    await new Promise((resolve) => setTimeout(resolve, 900));
    const newExam: Exam = {
      ...examData,
      id: `exam-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0]
    };
    addApiLog("POST", "/exams", examData, newExam, 201);
    return {
      success: true,
      data: newExam,
      message: "Examen y preguntas registradas mediante transacción transaccional en el Backend de Laravel.",
      laravel_endpoint: "/exams",
      timestamp: new Date().toISOString()
    };
  },

  // Submit Exam Performance Form / Submit Exam Attempt
  submitExamAttempt: async (attempt: Omit<ExamAttempt, "id" | "completedAt">): Promise<LaravelMockResponse<ExamAttempt>> => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    const completedAttempt: ExamAttempt = {
      ...attempt,
      id: `attempt-${Date.now()}`,
      completedAt: new Date().toISOString()
    };
    addApiLog("POST", "/exams/attempts", attempt, completedAttempt, 200);
    return {
      success: true,
      data: completedAttempt,
      message: "Intento de examen procesado y guardado. Logro reportado al profesor.",
      laravel_endpoint: "/exams/attempts",
      timestamp: new Date().toISOString()
    };
  },

  // Students logs
  getStudents: async (filters?: { search?: string; section?: string }): Promise<LaravelMockResponse<StudentRecord[]>> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    let result = [...MOCK_STUDENTS];
    if (filters?.section) {
      result = result.filter(st => st.section === filters.section);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(st => st.name.toLowerCase().includes(q) || st.email.toLowerCase().includes(q));
    }
    addApiLog("GET", `/students?search=${filters?.search || ""}&section=${filters?.section || ""}`, null, result, 200);
    return {
      success: true,
      data: result,
      laravel_endpoint: "/students",
      timestamp: new Date().toISOString()
    };
  }
};
