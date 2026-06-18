/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { User, Exam, Question, QuestionType, ExamAttempt } from "../types";
import { MOCK_EXAMS, apiSimulate } from "../mockData";
import { 
  FileSpreadsheet, Timer, Award, AlertCircle, CheckCircle2, ChevronRight, Play,
  Plus, Trash2, ArrowLeft, ClipboardList, HelpCircle, RefreshCw, Sparkles, Check, X
} from "lucide-react";

interface EvaluationsManagerProps {
  user: User;
}

export default function EvaluationsManager({ user }: EvaluationsManagerProps) {
  const isDocente = user.role === "docente";

  // State
  const [exams, setExams] = useState<Exam[]>(MOCK_EXAMS);
  
  // Quiz running state
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState<{ [questionId: string]: string }>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<ExamAttempt | null>(null);
  
  // Timer interval ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const secondsSpentRef = useRef(0);

  // Exam Builder state (Docente)
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newLevel, setNewLevel] = useState("1° de Secundaria");
  const [newDuration, setNewDuration] = useState(15);
  
  // Temp questions collection in designer
  const [builderQuestions, setBuilderQuestions] = useState<Question[]>([
    {
      id: "q-temp-1",
      text: "La suma de los ángulos interiores de un cuadrilátero es de 360 grados.",
      type: "true_false",
      correctAnswer: "true",
      points: 5
    }
  ]);
  const [tempQuestionText, setTempQuestionText] = useState("");
  const [tempType, setTempType] = useState<QuestionType>("multiple_choice");
  const [tempOptA, setTempOptA] = useState("");
  const [tempOptB, setTempOptB] = useState("");
  const [tempOptC, setTempOptC] = useState("");
  const [tempOptD, setTempOptD] = useState("");
  const [tempCorrect, setTempCorrect] = useState("A");
  const [tempPoints, setTempPoints] = useState(5);

  const [builderSuccess, setBuilderSuccess] = useState<string | null>(null);

  // Countdown timer logic
  useEffect(() => {
    if (activeExam && !isQuizCompleted) {
      timerRef.current = setInterval(() => {
        secondsSpentRef.current += 1;
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            // Time Out - Auto submit
            clearInterval(timerRef.current!);
            handleFinishExam(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeExam, isQuizCompleted]);

  // Start exam
  const handleStartExam = (exam: Exam) => {
    setActiveExam(exam);
    setCurrentQuestionIndex(0);
    setStudentAnswers({});
    setTimeLeftSeconds(exam.durationMinutes * 60);
    setIsQuizCompleted(false);
    setQuizResult(null);
    secondsSpentRef.current = 0;
  };

  // Process exam submit score
  const handleFinishExam = async (isTimeOut: boolean = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!activeExam) return;

    if (isTimeOut) {
      alert("⏱️ ¡Tiempo agotado! Tu examen ha sido enviado automáticamente con las respuestas guardadas.");
    }

    // Calculate score
    let totalPointsAwarded = 0;
    let totalPossiblePoints = 0;
    
    activeExam.questions.forEach((q) => {
      totalPossiblePoints += q.points;
      const ans = studentAnswers[q.id];
      if (ans && ans.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
        totalPointsAwarded += q.points;
      }
    });

    // Scale to classic 0-20 Peruvian/LatAm grade
    // If exam doesn't have questions protect division by zero
    const resolvedPointsPossible = totalPossiblePoints || 1;
    const computedScore = parseFloat(((totalPointsAwarded / resolvedPointsPossible) * 20).toFixed(1));
    const isPassing = computedScore >= 11; // 11 is passing standard

    const attemptPayload = {
      examId: activeExam.id,
      examTitle: activeExam.title,
      studentId: user.id,
      studentName: user.name,
      section: user.section || "Estudiante",
      answers: studentAnswers,
      score: computedScore,
      passed: isPassing,
      timeSpentSeconds: secondsSpentRef.current
    };

    try {
      const res = await apiSimulate.submitExamAttempt(attemptPayload);
      if (res.success) {
        setQuizResult(res.data);
        setIsQuizCompleted(true);
      }
    } catch (err) {
      console.error(err);
      alert("Error al simular envío del intento.");
    }
  };

  // Add question to temporary builder stack
  const handleAddQuestionToBuilder = () => {
    if (!tempQuestionText) {
      alert("Ingresa el texto de la pregunta.");
      return;
    }

    const newQ: Question = {
      id: `q-builder-${Date.now()}`,
      text: tempQuestionText,
      type: tempType,
      points: tempPoints,
      correctAnswer: tempCorrect,
      ...(tempType === "multiple_choice" ? {
        options: [
          `A) ${tempOptA || "Opción A"}`,
          `B) ${tempOptB || "Opción B"}`,
          `C) ${tempOptC || "Opción C"}`,
          `D) ${tempOptD || "Opción D"}`
        ]
      } : {})
    };

    setBuilderQuestions(prev => [...prev, newQ]);
    // Reset temp inputs
    setTempQuestionText("");
    setTempOptA("");
    setTempOptB("");
    setTempOptC("");
    setTempOptD("");
    setTempCorrect("A");
  };

  // Remove question from template
  const handleRemoveQuestionFromBuilder = (id: string) => {
    setBuilderQuestions(prev => prev.filter(q => q.id !== id));
  };

  // Docente submits exam
  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription) {
      alert("Ingresa los datos principales del examen.");
      return;
    }

    if (builderQuestions.length === 0) {
      alert("Agrega al menos una pregunta al examen para poder publicarlo.");
      return;
    }

    try {
      const examPayload = {
        title: newTitle,
        description: newDescription,
        durationMinutes: newDuration,
        level: newLevel,
        questions: builderQuestions
      };

      const res = await apiSimulate.createExam(examPayload);
      if (res.success) {
        setExams((prev) => [...prev, res.data]);
        setBuilderSuccess(`¡Examen "${res.data.title}" publicado con éxito! Guardado en Laravel.`);
        
        // Clear inputs
        setNewTitle("");
        setNewDescription("");
        setBuilderQuestions([]);
        
        setTimeout(() => setBuilderSuccess(null), 4000);
      }
    } catch (err) {
      console.error(err);
      alert("Error al crear examen.");
    }
  };

  // Format countdown text mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Title box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full border border-orange-100">
            Módulo 3: Evaluaciones en Línea
          </span>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight mt-2 flex items-center gap-2">
            <FileSpreadsheet className="text-orange-500" />
            {isDocente ? "Panel de Exámenes y Evaluación" : "Cuestionarios de Matemática en Tiempo Real"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isDocente 
              ? "Crea cuestionarios en línea con control de temporizador y retroalimentación inmediata autocorregible."
              : "Prepárate con tu cuaderno y lápiz para resolver estas evaluaciones diagnósticas automatizadas."
            }
          </p>
        </div>
      </div>

      {!activeExam ? (
        // INITIAL EXAM LISTS & DOCENT CONSTRUCTOR SCREEN
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* List of active exams available */}
          <div className={`${isDocente ? "lg:col-span-6" : "lg:col-span-12"} space-y-4`}>
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                Listado de Evaluaciones Sincronizadas
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                {exams.map((exam) => {
                  const pointsCount = exam.questions.reduce((acc, q) => acc + q.points, 0);
                  return (
                    <div 
                      key={exam.id}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-100">
                            {exam.level}
                          </span>
                          <span className="text-slate-400 font-mono font-medium flex items-center gap-1">
                            <Timer size={12} /> {exam.durationMinutes} Minutos
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-[14px] mt-2 tracking-tight group-hover:text-blue-600">
                          {exam.title}
                        </h4>
                        <p className="text-slate-500 text-[11px] mt-1 italic">{exam.description}</p>
                      </div>

                      <div className="border-t border-slate-100 pt-3 flex items-center justify-between font-bold text-slate-700">
                        <span className="text-slate-500 font-semibold text-[11.5px]">
                          Preguntas: {exam.questions.length} • Puntos: {pointsCount}
                        </span>
                        {!isDocente ? (
                          <button
                            onClick={() => handleStartExam(exam)}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <Play size={13} fill="currentColor" /> Rendir Examen
                          </button>
                        ) : (
                          <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                            Vista Docente Activa
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Docente Exam Builder Right Column */}
          {isDocente && (
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <div className="bg-orange-50 text-orange-600 p-1.5 rounded-lg">
                    <Plus size={16} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">Constructor de Evaluaciones</h4>
                </div>

                {builderSuccess && (
                  <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-medium border border-emerald-100 flex items-start gap-1.5">
                    <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                    <span>{builderSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleCreateExam} className="space-y-4 text-xs">
                  
                  {/* General exam meta */}
                  <div className="bg-slate-50 p-3 rounded-xl space-y-3 border border-slate-100">
                    <p className="font-bold text-slate-700 border-b border-slate-200 pb-1">1. Datos Generales de la Prueba</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-500 font-semibold mb-1">Título de la Evaluación</label>
                        <input
                          type="text"
                          required
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="Ej. Examen Parcial de Geometría Plana"
                          className="w-full px-3 py-1.5 bg-white border border-slate-205 rounded-lg text-slate-800 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-semibold mb-1">Carga Académica / Nivel</label>
                        <select
                          value={newLevel}
                          onChange={(e) => setNewLevel(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-205 rounded-lg text-slate-800 font-medium"
                        >
                          <option value="1° de Secundaria">1° de Secundaria</option>
                          <option value="2° de Secundaria">2° de Secundaria</option>
                          <option value="3° de Secundaria">3° de Secundaria</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-500 font-semibold mb-1">Límite de Tiempo (Minutos)</label>
                        <input
                          type="number"
                          required
                          min={2}
                          value={newDuration}
                          onChange={(e) => setNewDuration(parseInt(e.target.value) || 10)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-205 rounded-lg text-slate-800 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-semibold mb-1">Indicaciones / Descripción</label>
                        <input
                          type="text"
                          required
                          value={newDescription}
                          onChange={(e) => setNewDescription(e.target.value)}
                          placeholder="Instrucciones del examen en LatAm..."
                          className="w-full px-3 py-1.5 bg-white border border-slate-205 rounded-lg text-slate-800 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Add questions section */}
                  <div className="bg-slate-50 p-3 rounded-xl space-y-3 border border-slate-100">
                    <p className="font-bold text-slate-700 border-b border-slate-205 pb-1">
                      2. Agregar Preguntas al Cuestionario ({builderQuestions.length} Diseñadas)
                    </p>

                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Enunciado de la Pregunta Matemática</label>
                      <textarea
                        rows={1}
                        value={tempQuestionText}
                        onChange={(e) => setTempQuestionText(e.target.value)}
                        placeholder="Ej. Resuelve la ecuación lineal: 4x - 6 = 18. ¿Cuánto vale x?"
                        className="w-full px-3 py-1.5 bg-white border border-slate-205 rounded-lg text-slate-800 font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-slate-500 font-semibold mb-1">Tipo de Pregunta</label>
                        <select
                          value={tempType}
                          onChange={(e) => {
                            const val = e.target.value as QuestionType;
                            setTempType(val);
                            if (val === "true_false") setTempCorrect("true");
                            else if (val === "multiple_choice") setTempCorrect("A");
                            else setTempCorrect("");
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-slate-205 rounded-lg text-slate-800 font-medium"
                        >
                          <option value="multiple_choice">Opción Múltiple</option>
                          <option value="true_false">Verdadero / Falso</option>
                          <option value="numeric">Numérica Corta</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-500 font-semibold mb-1">Puntos Asignados</label>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={tempPoints}
                          onChange={(e) => setTempPoints(parseInt(e.target.value) || 5)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-205 rounded-lg text-slate-800 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-500 font-semibold mb-1">Respuesta Correcta</label>
                        {tempType === "true_false" ? (
                          <select
                            value={tempCorrect}
                            onChange={(e) => setTempCorrect(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white border border-slate-205 rounded-lg text-slate-800 font-medium"
                          >
                            <option value="true">Verdadero</option>
                            <option value="false">Falso</option>
                          </select>
                        ) : tempType === "multiple_choice" ? (
                          <select
                            value={tempCorrect}
                            onChange={(e) => setTempCorrect(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white border border-slate-205 rounded-lg text-slate-800 font-medium"
                          >
                            <option value="A">Opción A</option>
                            <option value="B">Opción B</option>
                            <option value="C">Opción C</option>
                            <option value="D">Opción D</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={tempCorrect}
                            onChange={(e) => setTempCorrect(e.target.value)}
                            placeholder="Ej. 6"
                            className="w-full px-3 py-1.5 bg-white border border-slate-205 rounded-lg text-slate-800 font-medium"
                          />
                        )}
                      </div>
                    </div>

                    {/* Options (Only if multiple choice) */}
                    {tempType === "multiple_choice" && (
                      <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                        <div>
                          <label className="block text-[10px] text-slate-500">Opción A</label>
                          <input
                            type="text"
                            value={tempOptA}
                            onChange={(e) => setTempOptA(e.target.value)}
                            placeholder="Ej: x = 6"
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[11px]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500">Opción B</label>
                          <input
                            type="text"
                            value={tempOptB}
                            onChange={(e) => setTempOptB(e.target.value)}
                            placeholder="Ej: x = 12"
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[11px]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500">Opción C</label>
                          <input
                            type="text"
                            value={tempOptC}
                            onChange={(e) => setTempOptC(e.target.value)}
                            placeholder="Ej: x = 18"
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[11px]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500">Opción D</label>
                          <input
                            type="text"
                            value={tempOptD}
                            onChange={(e) => setTempOptD(e.target.value)}
                            placeholder="Ej: x = 2"
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[11px]"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleAddQuestionToBuilder}
                      className="w-full py-1.5 bg-slate-800 text-white hover:bg-slate-900 border border-slate-700 hover:border-slate-850 font-bold rounded-lg transition-colors"
                    >
                      Añadir Pregunta al Repositorio
                    </button>
                  </div>

                  {/* Questions designer preview list */}
                  {builderQuestions.length > 0 && (
                    <div className="space-y-2 max-h-48 overflow-y-auto bg-slate-50 p-2.5 rounded-xl border border-slate-105">
                      <p className="font-bold text-[11px] text-slate-500">Preguntas en este Examen:</p>
                      {builderQuestions.map((q, qIdx) => (
                        <div key={q.id} className="bg-white p-2.5 rounded border border-slate-200 flex items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <p className="font-semibold text-slate-700">
                              P{qIdx+1}. ({q.points} pt) - {q.text}
                            </p>
                            <p className="text-[10px] text-indigo-600 font-semibold font-mono">
                              Tipo: {q.type} | Respuesta: {q.correctAnswer}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestionFromBuilder(q.id)}
                            className="text-rose-500 hover:text-rose-700 p-1"
                            title="Eliminar pregunta"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Save everything */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all shadow shadow-indigo-600/10 flex items-center justify-center gap-1 text-[13px]"
                  >
                    <FileSpreadsheet size={16} />
                    Publicar Examen en Laravel API Back
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        // ACTIVE RUNNING EXAM OR RESULTS SCREEN
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm max-w-3xl mx-auto space-y-6">
          
          {/* Result view */}
          {isQuizCompleted && quizResult ? (
            <div className="space-y-6">
              
              {/* Score header */}
              <div className="text-center bg-slate-50 rounded-2xl p-6 border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Award size={100} className="text-blue-600" />
                </div>

                <span className="text-[10px] font-bold uppercase py-1 px-3 bg-blue-100 text-blue-700 rounded-full">
                  Resultado de la Evaluación
                </span>
                
                <h3 className="font-bold text-[15px] text-slate-500 mt-3">{quizResult.examTitle}</h3>
                
                {/* Score out of 20 */}
                <div className="my-5 flex flex-col items-center">
                  <span className={`text-5xl font-black ${quizResult.passed ? "text-emerald-500" : "text-rose-500"}`}>
                    {quizResult.score}
                  </span>
                  <span className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Calificación (Escala 0 – 20)</span>
                </div>

                <div className="flex justify-center gap-4 text-xs font-medium text-slate-650">
                  <div className="px-3 py-1 bg-white rounded-lg border">
                    Estado: <span className={`font-bold ${quizResult.passed ? "text-emerald-600" : "text-rose-600"}`}>
                      {quizResult.passed ? "APROBADO" : "REQUIERE REPASO"}
                    </span>
                  </div>
                  <div className="px-3 py-1 bg-white rounded-lg border">
                    Tiempo de Resolución: <span className="font-mono font-bold text-slate-800">{Math.floor(quizResult.timeSpentSeconds / 60)}m {quizResult.timeSpentSeconds % 60}s</span>
                  </div>
                </div>
              </div>

              {/* Review answers list with correctness ticks / crosses */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ClipboardList size={14} /> Revisión Detallada de Respuestas
                </h4>

                {activeExam.questions.map((q, idx) => {
                  const studAns = quizResult.answers[q.id];
                  const qIsCorrect = studAns && studAns.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();

                  return (
                    <div 
                      key={q.id}
                      className={`p-4 rounded-xl border flex flex-col gap-2 ${
                        qIsCorrect ? "bg-emerald-50/20 border-emerald-100" : "bg-rose-50/20 border-rose-100"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-semibold text-slate-800 text-[13px] leading-relaxed">
                          P{idx+1}. {q.text}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-slate-400 whitespace-nowrap">
                          Valor: {q.points} Puntos
                        </span>
                      </div>

                      {/* Options or custom value overview */}
                      {q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-1 text-xs">
                          {q.options.map((opt) => {
                            const isOptCorrectKey = opt.startsWith(q.correctAnswer);
                            const isOptUserKey = studAns && opt.startsWith(studAns);
                            return (
                              <div 
                                key={opt}
                                className={`p-2 rounded-lg border ${
                                  isOptCorrectKey 
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                                    : isOptUserKey 
                                      ? "bg-rose-50 text-rose-800 border-rose-100" 
                                      : "bg-white text-slate-600 border-slate-100"
                                }`}
                              >
                                {opt}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-1 text-xs font-semibold">
                        <div className={`p-1.5 rounded-full ${qIsCorrect ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                          {qIsCorrect ? <Check size={14} /> : <X size={14} />}
                        </div>
                        <span className="text-slate-650">
                          Tu respuesta: <strong className={qIsCorrect ? "text-emerald-700" : "text-rose-700"}>{studAns || "(Sin respuesta)"}</strong>
                          {" • "}
                          Clave del examen: <strong className="text-emerald-700">{q.correctAnswer}</strong>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Close result and go back */}
              <div className="pt-2 text-center">
                <button
                  onClick={() => setActiveExam(null)}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-900 font-bold text-white text-xs rounded-xl shadow transition-colors"
                >
                  Regresar al Panel de Evaluaciones
                </button>
              </div>

            </div>
          ) : (
            // TESTING LIVE QUESTIONS RENDERING
            <div className="space-y-6">
              
              {/* Header inside quiz */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-slate-800 text-sm leading-tight">{activeExam.title}</h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Evaluación Virtual Estudiante</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-xl font-mono text-sm font-bold border border-orange-100">
                  <Timer size={16} className="animate-spin-slow" />
                  {formatTime(timeLeftSeconds)}
                </div>
              </div>

              {/* Progress Bar of evaluation questions completed */}
              <div>
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400 mb-1">
                  <span>Progreso de Resolución</span>
                  <span>Pregunta {currentQuestionIndex + 1} de {activeExam.questions.length}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-orange-500 h-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / activeExam.questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Current Question Block */}
              {(() => {
                const q = activeExam.questions[currentQuestionIndex];
                if (!q) return null;

                return (
                  <div className="space-y-4 py-2">
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2.5 py-0.5 rounded">
                        {currentQuestionIndex + 1}
                      </span>
                      <p className="text-[14px] font-bold text-slate-800 leading-normal tracking-tight select-text">
                        {q.text}
                      </p>
                    </div>

                    {/* Question answers widget according to type */}
                    {q.type === "multiple_choice" && q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {q.options.map((opt) => {
                          const optKey = opt.charAt(0); // "A", "B", "C", "D"
                          const isSelected = studentAnswers[q.id] === optKey;

                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                setStudentAnswers(prev => ({ ...prev, [q.id]: optKey }));
                              }}
                              className={`text-left p-3.5 rounded-xl border text-xs font-medium transition-all ${
                                isSelected 
                                  ? "bg-orange-50 text-orange-950 border-orange-500 font-bold shadow-sm"
                                  : "bg-white hover:bg-slate-50 border-slate-200 text-slate-755"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {q.type === "true_false" && (
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setStudentAnswers(prev => ({ ...prev, [q.id]: "true" }));
                          }}
                          className={`text-center py-3.5 rounded-xl border text-xs font-bold transition-all ${
                            studentAnswers[q.id] === "true"
                              ? "bg-orange-50 text-orange-950 border-orange-500 shadow-sm"
                              : "bg-white hover:bg-slate-50 border-slate-205 text-slate-700"
                          }`}
                        >
                          Verdadero
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setStudentAnswers(prev => ({ ...prev, [q.id]: "false" }));
                          }}
                          className={`text-center py-3.5 rounded-xl border text-xs font-bold transition-all ${
                            studentAnswers[q.id] === "false"
                              ? "bg-orange-50 text-orange-950 border-orange-500 shadow-sm"
                              : "bg-white hover:bg-slate-50 border-slate-205 text-slate-700"
                          }`}
                        >
                          Falso
                        </button>
                      </div>
                    )}

                    {q.type === "numeric" && (
                      <div className="pt-2 max-w-sm">
                        <label className="block text-slate-505 text-[11px] mb-1">Ingresa tu cálculo numérico exacto:</label>
                        <input
                          type="text"
                          required
                          value={studentAnswers[q.id] || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setStudentAnswers(prev => ({ ...prev, [q.id]: val }));
                          }}
                          placeholder="Ej. 12"
                          className="px-3.5 py-2 w-full bg-slate-55 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 text-center focus:ring-1 focus:ring-orange-500 focus:outline-none"
                        />
                      </div>
                    )}

                  </div>
                );
              })()}

              {/* Action buttons (Prev, Next, Submit) */}
              <div className="flex justify-between items-center border-t border-slate-100 pt-4 text-xs font-bold">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors disabled:opacity-30"
                >
                  Anterior
                </button>

                {currentQuestionIndex < activeExam.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="px-5 py-2 bg-slate-800 text-white hover:bg-slate-900 rounded-lg flex items-center gap-0.5 transition-colors"
                  >
                    Siguiente <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (confirm("¿Estás seguro de que deseas finalizar tu examen de matemática? Las respuestas se enviarán al servidor Laravel.")) {
                        handleFinishExam(false);
                      }
                    }}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1 transition-all shadow shadow-emerald-600/10"
                  >
                    Enviar Examen y Ver Score
                  </button>
                )}
              </div>

              {/* Floating warning info */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-2 text-[10px] text-amber-800 leading-relaxed">
                <AlertCircle size={14} className="shrink-0 text-amber-500 mt-0.5" />
                <div>
                  No abandones la pestaña ni recargues la aplicación. Al finalizar, tu resultado se registrará inmediatamente en el servidor Laravel y se notificará en la consola de APIs inferior.
                </div>
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
}
