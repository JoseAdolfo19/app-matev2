/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { User, Lesson, Exercise, Unit } from "../types";
import { MOCK_UNITS, MOCK_LESSONS, MOCK_EXERCISES, apiSimulate } from "../mockData";
import { 
  BookOpen, Video, FileText, Link2, Plus, Sparkles, CheckCircle2, XCircle, 
  ChevronRight, ArrowLeft, RefreshCw, Layers, ShieldCheck, GraduationCap, AlertCircle, Play
} from "lucide-react";

interface LessonsManagerProps {
  user: User;
}

export default function LessonsManager({ user }: LessonsManagerProps) {
  const isDocente = user.role === "docente";

  const normalizeVideoUrl = (url: string) => {
    const trimmed = url.trim();

    if (trimmed.includes("youtube.com/watch?v=")) {
      const videoId = new URL(trimmed).searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : trimmed;
    }

    if (trimmed.includes("youtu.be/")) {
      const videoId = trimmed.split("youtu.be/")[1]?.split(/[?&]/)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : trimmed;
    }

    if (trimmed.includes("youtube.com/shorts/")) {
      const videoId = trimmed.split("youtube.com/shorts/")[1]?.split(/[?&]/)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : trimmed;
    }

    if (trimmed.includes("youtube.com/embed/") || trimmed.includes("youtube-nocookie.com/embed/")) {
      return trimmed;
    }

    return trimmed;
  };

  const isEmbeddableVideoUrl = (url: string) => {
    const normalized = normalizeVideoUrl(url);
    return normalized.includes("youtube.com/embed/") || normalized.includes("youtube-nocookie.com/embed/");
  };

  // Shared lesson list state (initially mock, editable by Docente)
  const [lessons, setLessons] = useState<Lesson[]>(MOCK_LESSONS);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>("unit-1");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Student exercise state
  const [studentAnswers, setStudentAnswers] = useState<{ [exerciseId: string]: string }>({});
  const [checkedExercises, setCheckedExercises] = useState<{ [exerciseId: string]: { correct: boolean; checked: boolean } }>({});
  const [showExplanation, setShowExplanation] = useState<{ [exerciseId: string]: boolean }>({});

  // Docente creator form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newUnitId, setNewUnitId] = useState("unit-1");
  const [newLevel, setNewLevel] = useState("1° de Secundaria");
  const [newResourceType, setNewResourceType] = useState<"video" | "pdf" | "link">("video");
  const [newResourceValue, setNewResourceValue] = useState("https://www.youtube.com/embed/By9-698Crc4");
  const [formLoading, setFormLoading] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter lessons based on selected unit
  const filteredLessons = lessons.filter(l => l.unitId === selectedUnitId);

  // Handle student exercise verification
  const handleCheckAnswer = (ex: Exercise) => {
    const userAnswerStr = studentAnswers[ex.id]?.trim();
    if (!userAnswerStr) return;

    const isCorrect = userAnswerStr === ex.correctAnswer;
    setCheckedExercises(prev => ({
      ...prev,
      [ex.id]: { correct: isCorrect, checked: true }
    }));

    // Logs the completed exercise or lesson activity event on Laravel backend
    if (isCorrect) {
      const { addApiLog } = require("../mockData");
      addApiLog("POST", `/lessons/${ex.lessonId}/exercises/${ex.id}/check`, { userAnswer: userAnswerStr }, {
        correct: true,
        score_added: 5,
        student: user.name,
        explanation: ex.solutionExplanation
      }, 200);
    } else {
      const { addApiLog } = require("../mockData");
      addApiLog("POST", `/lessons/${ex.lessonId}/exercises/${ex.id}/check`, { userAnswer: userAnswerStr }, {
        correct: false,
        score_added: 0,
        hint: "Inténtalo despejando usando la operación opuesta."
      }, 200);
    }
  };

  const handleLessonCompletedFlag = async () => {
    if (!selectedLesson) return;
    const { addApiLog } = require("../mockData");
    addApiLog("POST", `/lessons/${selectedLesson.id}/complete`, { studentId: user.id }, {
      lessonId: selectedLesson.id,
      completed: true,
      achievementUnlocked: "Estrella matemática de Primer Grado",
      timestamp: new Date().toISOString()
    }, 200);
    alert(`🎉 ¡Excelente! Registraste la lección "${selectedLesson.title}" como completada. El docente recibirá tu avance.`);
  };

  // Handle docente submitting new math lesson
  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription || !newResourceValue) {
      alert("Por favor completa todos los campos requeridos.");
      return;
    }

    setFormLoading(true);
    setSuccessBanner(null);

    try {
      const lessonPayload = {
        unitId: newUnitId,
        title: newTitle,
        description: newDescription,
        level: newLevel,
        resourceType: newResourceType,
        resourceValue: newResourceValue
      };

      const res = await apiSimulate.createLesson(lessonPayload);
      if (res.success) {
        setLessons(prev => [...prev, res.data]);
        setSuccessBanner(`¡Lección "${res.data.title}" creada con éxito! Se sincronizó mediante Laravel Eloquent.`);
        // Reset form
        setNewTitle("");
        setNewDescription("");
        setNewResourceValue("");
        
        // Clear banner after 4 seconds
        setTimeout(() => setSuccessBanner(null), 4000);
      }
    } catch (err) {
      console.error(err);
      alert("Error en el envío simulado.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100">
            Módulo 2: Contenidos Interactivos
          </span>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight mt-2 flex items-center gap-2">
            <BookOpen className="text-blue-600" />
            {isDocente ? "Gestión y Publicación de Lecciones" : "Explora Unidades y Practica Matemática"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isDocente 
              ? "Crea nuevos apuntes, material de referencia, videos de álgebra e integra lecciones con visor de ejercicios."
              : "Selecciona una de las unidades didácticas del plan curricular de matemática del colegio para ver tu material."
            }
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Unit list & index left column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Índice Curricular de Unidades</h3>
            <div className="flex flex-col gap-2">
              {MOCK_UNITS.map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => {
                    setSelectedUnitId(unit.id);
                    setSelectedLesson(null); // Clear selected lesson to show list
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all ${
                    selectedUnitId === unit.id
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-900 font-semibold shadow-sm"
                      : "bg-white border-slate-100 hover:border-slate-200 text-slate-600"
                  }`}
                >
                  <p className="font-bold text-[13px]">{unit.title}</p>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{unit.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Docente form to add lesson */}
          {isDocente && (
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="bg-indigo-50 text-indigo-600 p-1.5 rounded-lg">
                  <Plus size={16} />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Crear Nueva Lección</h4>
              </div>

              {successBanner && (
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-medium border border-emerald-100 flex items-start gap-1.5">
                  <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                  <span>{successBanner}</span>
                </div>
              )}

              <form onSubmit={handleCreateLesson} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Título de la Lección</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ej. Graficar Funciones Lineales en el Plano"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-850 font-medium focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Unidad de Pertenencia</label>
                  <select
                    value={newUnitId}
                    onChange={(e) => setNewUnitId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-850 font-medium focus:ring-1 focus:ring-blue-500"
                  >
                    {MOCK_UNITS.map(u => (
                      <option key={u.id} value={u.id}>{u.title}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Nivel Escolar</label>
                    <select
                      value={newLevel}
                      onChange={(e) => setNewLevel(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-850 font-medium focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="1° de Secundaria">1° de Secundaria</option>
                      <option value="2° de Secundaria">2° de Secundaria</option>
                      <option value="3° de Secundaria">3° de Secundaria</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Tipo de Recurso</label>
                    <select
                      value={newResourceType}
                      onChange={(e) => setNewResourceType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-850 font-medium focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="video">🎞️ Video Tutorial</option>
                      <option value="pdf">📄 PDF de Ejercicios</option>
                      <option value="link">🌐 Enlace Khan Acad.</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">
                    {newResourceType === "pdf" ? "Nombre del Archivo PDF ficticio" : "Enlace / URL del Recurso"}
                  </label>
                  <input
                    type="text"
                    required
                    value={newResourceValue}
                    onChange={(e) => setNewResourceValue(e.target.value)}
                    placeholder={newResourceType === "pdf" ? "Guia_Ecuaciones_Primer_Grado.pdf" : "https://www.youtube.com/embed/By9-698Crc4"}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-850 font-medium focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Descripción de la clase</label>
                  <textarea
                    required
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Describe los propósitos pedagógicos y qué aprenderá el estudiante..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-850 font-medium focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg mt-2 transition-all shadow shadow-indigo-600/10 flex items-center justify-center gap-1"
                >
                  {formLoading ? (
                    <span className="w-3.5 h-3.5 rounded-full border border-white/35 border-t-white animate-spin"></span>
                  ) : (
                    <>
                      <Plus size={14} />
                      Sincronizar con Laravel API
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Detailed lessons list / resource viewer right column */}
        <div className="lg:col-span-8 space-y-6">
          {!selectedLesson ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm min-h-[400px]">
              <div className="flex justify-between items-center border-b border-slate-105 pb-3">
                <h3 className="text-sm font-bold text-slate-700">
                  Lecciones Disponibles en esta Unidad ({filteredLessons.length})
                </h3>
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  Filtro activo
                </span>
              </div>

              {filteredLessons.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <Layers size={36} className="mb-2 text-slate-300" />
                  <p className="font-semibold text-slate-500">No hay lecciones registradas en esta unidad.</p>
                  <p className="text-xs text-slate-400 mt-0.5">Vuelve a seleccionar otra lección o añade una nueva desde el rol docente.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {filteredLessons.map((lesson) => {
                    const resourceIcon = 
                      lesson.resourceType === "video" ? <Video size={16} /> :
                      lesson.resourceType === "pdf" ? <FileText size={16} /> : <Link2 size={16} />;
                    
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => setSelectedLesson(lesson)}
                        className="group bg-slate-50 hover:bg-blue-50/50 p-4 rounded-xl border border-slate-100 hover:border-blue-200 cursor-pointer transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                              {lesson.level}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">{lesson.createdAt}</span>
                          </div>
                          <h4 className="font-bold text-slate-800 text-[14px] mt-2 group-hover:text-blue-700 transition-colors line-clamp-1">
                            {lesson.title}
                          </h4>
                          <p className="text-slate-500 text-xs mt-1.5 line-clamp-3 leading-relaxed">
                            {lesson.description}
                          </p>
                        </div>
                        
                        <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between text-xs font-semibold text-slate-500">
                          <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
                            {resourceIcon}
                            Recurso: {lesson.resourceType}
                          </span>
                          <span className="text-blue-600 flex items-center gap-0.5 text-xs font-bold group-hover:translate-x-0.5 transition-transform">
                            Ver Clase
                            <ChevronRight size={14} />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            // DETAILED LESSON resource visualizer & exercises screen
            <div className="space-y-6">
              
              {/* Back button header */}
              <button
                onClick={() => setSelectedLesson(null)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-100 shadow-sm"
              >
                <ArrowLeft size={14} /> Regresar al índice de lecciones
              </button>

              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
                
                {/* Meta details */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full">
                        {selectedLesson.level}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">Plataforma Educativa de Matemática</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mt-2 tracking-tight">{selectedLesson.title}</h3>
                  </div>
                  <button
                    onClick={handleLessonCompletedFlag}
                    className="text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all"
                  >
                    <CheckCircle2 size={13} /> Marcar Avanzada
                  </button>
                </div>

                {/* Resource Viewer Block */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    📺 Visor de Recursos Pedagógicos
                  </h4>

                  {selectedLesson.resourceType === "video" && isEmbeddableVideoUrl(selectedLesson.resourceValue) && (
                    <div className="bg-slate-950 rounded-xl overflow-hidden aspect-video border border-slate-900 relative shadow flex flex-col justify-between">
                      {/* High fidelity math player mockup */}
                      <iframe
                        src={normalizeVideoUrl(selectedLesson.resourceValue)}
                        title={selectedLesson.title}
                        className="w-full h-full border-none"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}

                  {selectedLesson.resourceType === "video" && !isEmbeddableVideoUrl(selectedLesson.resourceValue) && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center space-y-3">
                      <div className="w-12 h-12 bg-amber-100 text-amber-600 flex items-center justify-center rounded-xl mx-auto">
                        <AlertCircle size={24} />
                      </div>
                      <p className="text-sm font-semibold text-slate-700">Este recurso no está disponible para visualizarse dentro de la app.</p>
                      <p className="text-xs text-slate-500">Puedes abrirlo directamente si necesitas consultarlo.</p>
                    </div>
                  )}

                  {selectedLesson.resourceType === "pdf" && (
                    <div className="bg-gradient-to-tr from-slate-50 to-slate-100 border border-slate-200/80 rounded-xl p-6 text-center space-y-4">
                      <div className="w-12 h-12 bg-red-100 text-red-600 flex items-center justify-center rounded-xl mx-auto shadow-sm">
                        <FileText size={28} />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-800 text-sm">{selectedLesson.resourceValue}</h5>
                        <p className="text-xs text-slate-400 mt-0.5">Guía de ejercicios imprimibles, fórmulas y ejemplos • PDF • 1.4 MB</p>
                      </div>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            const { addApiLog } = require("../mockData");
                            addApiLog("GET", `/files/download/${selectedLesson?.resourceValue}`, null, {
                              download_started: true,
                              file: selectedLesson?.resourceValue,
                              status: "chunk_transferred"
                            }, 200);
                            alert("📥 Descarga ficticia del PDF iniciada. El evento del archivo ha sido notificado a Laravel.");
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow transition-colors"
                        >
                          Descargar Guía de Trabajo
                        </button>
                        <button
                          onClick={() => alert("Mostrando vista previa ficticia en iframe del navegador.")}
                          className="px-4 py-2 bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 text-xs font-bold rounded-lg transition-colors"
                        >
                          Vista Rápida
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedLesson.resourceType === "link" && (
                    <div className="space-y-3">
                      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 text-blue-600 p-2.5 rounded-xl mt-0.5">
                            <Link2 size={20} />
                          </div>
                          <div>
                            <h5 className="font-bold text-blue-900 text-sm">Contenido de Práctica Khan Academy</h5>
                            <p className="text-xs text-blue-700 mt-0.5">
                              Este recurso se abre externamente porque muchos sitios bloquean la carga dentro de un iframe.
                            </p>
                          </div>
                        </div>
                        <a
                          href={selectedLesson.resourceValue}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            const { addApiLog } = require("../mockData");
                            addApiLog("GET", `/redirect-outbound?url=${encodeURIComponent(selectedLesson!.resourceValue)}`, null, {
                              outbound: "Khan Academy",
                              track_completed: true
                            }, 200);
                          }}
                          className="py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold rounded-lg shrink-0 text-center transition-colors block"
                        >
                          Abrir recurso externo
                        </a>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-slate-500 mt-3 italic leading-relaxed">
                    <strong>Descripción del Alumno:</strong> {selectedLesson.description}
                  </p>
                </div>

                {/* Math Exercise Practice Solver area */}
                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      📝 Área de Autopráctica y Ejercicios Interactivos
                    </h4>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      Autocorrectivo
                    </span>
                  </div>

                  {MOCK_EXERCISES.filter(ex => ex.lessonId === selectedLesson.id).length === 0 ? (
                    <div className="text-center py-6 bg-slate-50 rounded-xl text-slate-405 text-xs italic">
                      No hay ejercicios de muestra cargados para esta lección específica. 
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {MOCK_EXERCISES.filter(ex => ex.lessonId === selectedLesson.id).map((ex, index) => {
                        const scoreState = checkedExercises[ex.id];
                        const showExpl = showExplanation[ex.id];

                        return (
                          <div key={ex.id} className="p-4 rounded-xl border border-slate-150 bg-slate-50/50 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-mono text-xs font-bold bg-slate-200 text-slate-650 px-2 py-0.5 rounded shrink-0">
                                Problema {index + 1}
                              </span>
                              <span className="text-[11px] font-semibold text-blue-600 font-mono">f(x) = ax + b</span>
                            </div>
                            
                            <p className="text-sm font-semibold text-slate-800 tracking-tight leading-relaxed select-text whitespace-pre-line">
                              {ex.question}
                            </p>

                            {/* Answer Fields */}
                            <div className="flex flex-wrap items-center gap-3">
                              <div className="relative">
                                <input
                                  type="text"
                                  value={studentAnswers[ex.id] || ""}
                                  disabled={scoreState?.correct}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setStudentAnswers(prev => ({ ...prev, [ex.id]: val }));
                                  }}
                                  placeholder="Ej. 5"
                                  className="px-3.5 py-1.5 w-32 bg-white border border-slate-200 rounded-lg text-sm text-center font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                />
                              </div>

                              <button
                                onClick={() => handleCheckAnswer(ex)}
                                disabled={!studentAnswers[ex.id]?.trim() || scoreState?.correct}
                                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-40"
                              >
                                Verificar
                              </button>

                              {scoreState?.checked && (
                                <div className="flex items-center gap-1.5">
                                  {scoreState.correct ? (
                                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                      <CheckCircle2 size={14} /> ¡Correcto!
                                    </span>
                                  ) : (
                                    <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                                      <XCircle size={14} /> Incorrecto. Revisa el despeje.
                                    </span>
                                  )}
                                  <button
                                    onClick={() => setShowExplanation(prev => ({ ...prev, [ex.id]: !showExpl }))}
                                    className="text-[10px] text-blue-600 hover:underline font-semibold ml-2"
                                  >
                                    {showExpl ? "Ocultar Fórmula" : "Ver Explicación Matemática"}
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Mathematical explanation breakdown */}
                            {showExpl && (
                              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-xs leading-relaxed space-y-1.5 text-blue-900">
                                <p className="font-bold flex items-center gap-1 text-blue-950">
                                  <Sparkles size={13} className="text-amber-500" />
                                  Resolución Paso a Paso:
                                </p>
                                <p className="font-mono whitespace-pre-wrap">{ex.solutionExplanation}</p>
                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
