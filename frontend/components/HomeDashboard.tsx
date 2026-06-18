/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { User } from "../types";
import { 
  Users, TrendingUp, Percent, AlertTriangle, FileText, Download, Share2, 
  BookOpen, Calendar, HelpCircle, Bell, ArrowUpRight, Award, Clock, Star, 
  Flame, Zap, BookMarked, UserCheck, MessageSquare, ChevronRight, CheckCircle2 
} from "lucide-react";
import { addApiLog } from "../mockData";

interface HomeDashboardProps {
  user: User;
  setActiveTab: (tab: string) => void;
}

export default function HomeDashboard({ user, setActiveTab }: HomeDashboardProps) {
  const isDocente = user.role === "docente";

  // State for alert inputs, notifications simulation
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);
  const [announcements, setAnnouncements] = useState([
    { id: 1, text: "Se ha modificado la fecha de la evaluación parcial al Viernes 26.", date: "Hoy, 10:15" },
    { id: 2, text: "Recuerden subir los ejercicios resueltos de la Unidad 3 sobre polígonos.", date: "Ayer, 14:30" }
  ]);

  // Handle live broadcast to student terminals
  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    // Simulate API log
    addApiLog("POST", "/announcements/broadcast", { text: broadcastMessage }, {
      status: "dispatched",
      broadcast_to_sections: ["3ero Secundaria", "4to Secundaria", "5to Secundaria"],
      recipients_count: 84
    }, 201);

    setAnnouncements(prev => [
      { id: Date.now(), text: broadcastMessage, date: "Ahora mismo" },
      ...prev
    ]);
    setBroadcastMessage("");
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 3000);
  };

  // Handle report downloads
  const triggerReportDownload = (reportName: string) => {
    addApiLog("GET", `/reports/download`, { name: reportName, format: "pdf" }, {
      download_token: `TOK-${Math.floor(Math.random() * 900000) + 100000}`,
      status: "success",
      url: `https://mi-api-laravel.test/api/v1/downloads/pdf/${reportName.replace(/\s+/g, "_")}.pdf`
    }, 200);

    alert(`📄 [Reporte Descargado] "${reportName}" ha sido generado desde la base de datos de Laravel y descargado como PDF.`);
  };

  if (isDocente) {
    return (
      <div className="space-y-6">
        
        {/* Banner Docente welcome */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-black">Panel General Docente</h1>
            <p className="text-xs text-indigo-200">Bienvenido de nuevo, Prof. García. Tienes 15 nuevas entregas por revisar en "Álgebra II".</p>
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] bg-indigo-500/30 border border-indigo-400/40 px-3 py-1 rounded-full text-indigo-100 font-mono">
              Sección: 3ero a 5to de Secundaria
            </span>
            <span className="text-[10px] bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full text-emerald-300 font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              API Laravel: Sincronizada
            </span>
          </div>
        </div>

        {/* TOP STATS INDICATORS SCREEN 5 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Promedio General */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px]">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Promedio General del Grupo</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-slate-800">8.4</span>
                  <span className="text-xs font-bold text-emerald-500 flex items-center">↗ +0.3 este mes</span>
                </div>
              </div>
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <TrendingUp size={20} />
              </div>
            </div>
            {/* Sparkline simulation using SVG */}
            <div className="h-8 mt-2 w-full">
              <svg className="w-full h-full text-blue-500" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0,15 Q15,5 30,12 T60,4 T90,8 L100,10" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <path d="M0,15 Q15,5 30,12 T60,4 T90,8 L100,10 L100,20 L0,20 Z" fill="currentColor" className="opacity-10" />
              </svg>
            </div>
          </div>

          {/* Tasa de Aprobacion */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px]">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tasa de Aprobación</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black text-slate-800">92%</span>
                </div>
              </div>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <Percent size={20} />
              </div>
            </div>
            {/* Active students avatars */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex -space-x-2">
                <img className="w-6 h-6 rounded-full border border-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60" alt="S1" />
                <img className="w-6 h-6 rounded-full border border-white" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=60" alt="S2" />
                <img className="w-6 h-6 rounded-full border border-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=60" alt="S3" />
                <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[8px] font-bold border border-white">
                  +28
                </div>
              </div>
              <span className="text-[10px] font-medium text-slate-400">alumnos activos</span>
            </div>
          </div>

          {/* Actividad Reciente */}
          <div className="bg-[#046A38] text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[140px]">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] uppercase font-bold text-emerald-200 tracking-wider">Actividad Reciente</span>
                <p className="text-xs font-extrabold mt-1 leading-tight text-white">15 nuevas entregas <br />en "Álgebra II"</p>
              </div>
              <div className="p-2 bg-emerald-700 text-emerald-100 rounded-xl">
                <Zap size={16} />
              </div>
            </div>
            <button 
              onClick={() => setActiveTab("lessons")}
              className="text-[10px] bg-white text-emerald-950 font-extrabold px-3 py-1.5 rounded-lg w-full text-center hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Revisar ahora</span>
              <span className="text-xs">&rarr;</span>
            </button>
          </div>

        </div>

        {/* COMPETENCIES & REPORTS & LAUNCH DRAWER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Desempeño por competencia card bar chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-blue-600 block"></span>
                Desempeño por Competencia
              </h3>
              <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-500 font-bold">Último Trimestre</span>
            </div>

            <div className="space-y-3.5 pt-1">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Aritmética</span>
                  <span className="text-blue-600">94%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: "94%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Álgebra</span>
                  <span className="text-amber-600">68%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "68%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Geometría</span>
                  <span className="text-emerald-500">82%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: "82%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Probabilidad y Estadística</span>
                  <span className="text-indigo-600">75%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Repotes download side list (Screen 5) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <FileText size={14} className="text-blue-600" />
              Reportes Institucionales
            </h3>
            
            <p className="text-[10px] text-slate-400 shrink-0 leading-tight">Genera informes detallados con sincronización Sanctum API en un clic.</p>

            <div className="space-y-3 pt-1">
              
              <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-700 truncate leading-tight">Asistencia Mensual</p>
                  <p className="text-[9px] text-slate-400 font-mono mt-0.5 uppercase">Formato: PDF / Excel</p>
                </div>
                <button 
                  onClick={() => triggerReportDownload("Asistencia Mensual")}
                  className="p-1 px-2.5 bg-blue-50 text-[#004AC6] hover:bg-blue-100 transition-colors text-[10px] font-extrabold rounded-md flex items-center gap-1 shrink-0"
                >
                  <Download size={11} /> Descargar
                </button>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-700 truncate leading-tight">Registro de Notas</p>
                  <p className="text-[9px] text-slate-400 font-mono mt-0.5 uppercase">Sección 4-B • Trimestre 3</p>
                </div>
                <button 
                  onClick={() => triggerReportDownload("Registro de Notas")}
                  className="p-1 px-2.5 bg-blue-50 text-[#004AC6] hover:bg-blue-100 transition-colors text-[10px] font-extrabold rounded-md flex items-center gap-1 shrink-0"
                >
                  <Download size={11} /> Descargar
                </button>
              </div>

              <button 
                onClick={() => alert(`Sincronizando plantilla de informes personalizados de MathFlow con Laravel Carbon PDF Server...`)}
                className="w-full text-center py-2 border border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-705 transition-colors cursor-pointer"
              >
                + Personalizar Reporte
              </button>

            </div>
          </div>

        </div>

        {/* SEGUIMIENTO DE ESTUDIANTES TABLE (SCREEN 5) */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users size={15} className="text-slate-500" />
                Seguimiento de Estudiantes
              </h3>
              <p className="text-[10px] text-rose-500 font-semibold mt-0.5">⚠️ Alertado: 4 casos críticos requieren atención prioritaria</p>
            </div>
            <button 
              onClick={() => setActiveTab("reports")}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Ver todos (32) &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase">
                  <th className="py-2.5 font-bold">Estudiante</th>
                  <th className="py-2.5 font-bold">Progreso</th>
                  <th className="py-2.5 font-bold text-center">Última Nota</th>
                  <th className="py-2.5 font-bold">Estado</th>
                  <th className="py-2.5 font-bold text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <img className="w-8 h-8 rounded-full border border-slate-100 shrink-0" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80" alt="Student" />
                      <div>
                        <p className="font-bold text-slate-800">Mateo Jiménez</p>
                        <p className="text-[9px] text-slate-400">ID: #4421</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: "88%" }}></div>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500 font-bold">88%</span>
                    </div>
                  </td>
                  <td className="py-3 text-center font-bold text-slate-800">9.5</td>
                  <td className="py-3">
                    <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                      Sobresaliente
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <button 
                      onClick={() => alert(`Enviando notificación escolar directa a Mateo Jiménez sobre su rendimiento sobresaliente.`)}
                      className="text-blue-500 hover:text-blue-700 p-1 font-bold rounded hover:bg-blue-50"
                      title="Sugerir avance"
                    >
                      🚀
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/50">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <img className="w-8 h-8 rounded-full border border-slate-100 shrink-0" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=80" alt="Student" />
                      <div>
                        <p className="font-bold text-slate-800">Sofía Vergara</p>
                        <p className="text-[9px] text-slate-400">ID: #4432</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-450 h-full rounded-full" style={{ width: "32%" }}></div>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500 font-bold">32%</span>
                    </div>
                  </td>
                  <td className="py-3 text-center font-bold text-rose-600">4.2</td>
                  <td className="py-3">
                    <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase bg-rose-50 text-rose-700 border border-rose-100">
                      En Riesgo
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <button 
                      onClick={() => alert(`Enviando advertencia académica por correo a s.vergara@lasalleurubamba.edu.pe coordinada con sus familiares por rendimiento académico.`)}
                      className="text-rose-500 hover:text-rose-700 p-1 font-bold rounded hover:bg-rose-55"
                      title="Enviar alerta familiar"
                    >
                      ✉️
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/50">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <img className="w-8 h-8 rounded-full border border-slate-100 shrink-0" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80" alt="Student" />
                      <div>
                        <p className="font-bold text-slate-800">Lucas Mora</p>
                        <p className="text-[9px] text-slate-400">ID: #4409</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: "65%" }}></div>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500 font-bold">65%</span>
                    </div>
                  </td>
                  <td className="py-3 text-center font-bold text-slate-800">7.8</td>
                  <td className="py-3">
                    <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase bg-blue-50 text-blue-700 border border-blue-100">
                      Regular
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <button 
                      onClick={() => alert(`Programando sesión de reforzamiento guiada de Geometría con Lucas Mora.`)}
                      className="text-amber-500 hover:text-amber-700 p-1 font-bold rounded hover:bg-amber-50"
                      title="Asignar mentoría"
                    >
                      📅
                    </button>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

        {/* ACCIONES RAPIDAS (SCREEN 5) & LIVE ANNOUNCEMENT FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Quick links Grid menu */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Acciones Rápidas del Sistema</h3>
            
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button 
                onClick={() => setActiveTab("exams")}
                className="p-4 bg-slate-50 border border-slate-200/50 rounded-xl hover:bg-blue-50/50 hover:border-blue-200 transition-all text-left space-y-2 cursor-pointer flex flex-col justify-between"
              >
                <div className="w-7 h-7 bg-blue-100 text-[#004AC6] rounded-lg flex items-center justify-center font-bold text-xs">📝</div>
                <div>
                  <p className="text-xs font-bold text-slate-700 leading-tight">Crear Examen</p>
                  <p className="text-[9px] text-slate-400">Generativa disponible</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveTab("lessons")}
                className="p-4 bg-slate-50 border border-slate-200/50 rounded-xl hover:bg-emerald-50/50 hover:border-emerald-200 transition-all text-left space-y-2 cursor-pointer flex flex-col justify-between"
              >
                <div className="w-7 h-7 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-bold text-xs">📁</div>
                <div>
                  <p className="text-xs font-bold text-slate-700 leading-tight">Material de Clase</p>
                  <p className="text-[9px] text-slate-400">Sube PDFs o vídeos</p>
                </div>
              </button>

              <button 
                onClick={() => alert(`Abriendo planificador anual de eventos de matemáticas en Laravel Sanctum DB...`)}
                className="p-4 bg-slate-50 border border-slate-200/50 rounded-xl hover:bg-indigo-50/50 hover:border-indigo-200 transition-all text-left space-y-2 cursor-pointer flex flex-col justify-between"
              >
                <div className="w-7 h-7 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center font-bold text-xs">📅</div>
                <div>
                  <p className="text-xs font-bold text-slate-700 leading-tight">Calendario Escolar</p>
                  <p className="text-[9px] text-slate-400">Fechas límite de pruebas</p>
                </div>
              </button>

              <button 
                onClick={() => alert(`Exportando la base de datos de calificaciones de la sección en formato XLSX sincronizado...`)}
                className="p-4 bg-slate-50 border border-slate-200/50 rounded-xl hover:bg-rose-50/50 hover:border-rose-200 transition-all text-left space-y-2 cursor-pointer flex flex-col justify-between"
              >
                <div className="w-7 h-7 bg-rose-100 text-rose-700 rounded-lg flex items-center justify-center font-bold text-xs">📊</div>
                <div>
                  <p className="text-xs font-bold text-slate-700 leading-tight">Consolidado Final</p>
                  <p className="text-[9px] text-slate-400">Simulación Excel</p>
                </div>
              </button>
            </div>
          </div>

          {/* Real-time announcement broadcasting form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <span className="w-2.5 h-2.5 rounded bg-orange-400 block shrink-0"></span>
              Anunciar Novedad Global
            </h3>

            <form onSubmit={handleBroadcast} className="space-y-3">
              <p className="text-[10px] text-slate-500 leading-tight">Envía anuncios importantes en tiempo real a las pizarras y teléfonos de los estudiantes de todos los grados.</p>
              
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Escribe el mensaje escolar de carácter urgente..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-500 focus:outline-none h-16 resize-none font-medium"
              ></textarea>

              <div className="flex justify-between items-center">
                {broadcastSuccess ? (
                  <span className="text-[10px] text-green-700 font-bold bg-green-50 border border-green-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                    <CheckCircle2 size={12} /> Enviado con éxito
                  </span>
                ) : (
                  <span className="text-[9px] text-slate-400 font-mono">Destinatarios: 3 Secciones</span>
                )}
                
                <button
                  type="submit"
                  className="bg-slate-900 text-white font-extrabold text-[11px] px-3.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Confirmar Envío
                </button>
              </div>
            </form>

            <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Historial de Circulares Envíadas:</span>
              <div className="space-y-1.5 select-none">
                {announcements.map(ann => (
                  <div key={ann.id} className="p-2 border border-slate-100 bg-slate-50 rounded-lg text-[10px] flex justify-between items-start gap-3">
                    <span className="font-medium text-slate-600 line-clamp-2 leading-snug">{ann.text}</span>
                    <span className="text-slate-400 font-mono shrink-0">{ann.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    );
  }

  // ALUMNO DASHBOARD HOME (SCREEN 6)
  return (
    <div className="space-y-6">
      
      {/* Welcome Greeting Alex Banner with dynamic triggers */}
      <div className="bg-[#004AC6] text-white rounded-2xl p-6.5 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Subtle dynamic background path decoration */}
        <div className="absolute inset-y-0 right-10 opacity-10 select-none pointer-events-none hidden md:block">
          <svg className="w-60 h-40" viewBox="0 0 100 100">
            <text x="10" y="50" className="text-4xl font-mono font-black" fill="currentColor">+</text>
            <text x="40" y="30" className="text-4xl font-mono font-black" fill="currentColor">-</text>
            <text x="30" y="90" className="text-4xl font-mono font-black" fill="currentColor">=</text>
            <text x="70" y="70" className="text-5xl font-mono font-black" fill="currentColor">%</text>
          </svg>
        </div>

        <div className="space-y-2.5 z-10 max-w-xl">
          <h1 className="text-2xl md:text-3xl font-black">¡Hola de nuevo, Alex! 👋</h1>
          <p className="text-xs text-blue-100 leading-relaxed font-medium">
            Has completado el <strong className="text-white">85%</strong> de tus objetivos semanales. Estás a solo 2 lecciones de dominar el módulo avanzado sobre Cálculo Integral y obtener la insignia de Oro de la escuela.
          </p>
          <div className="flex gap-4 pt-1">
            <button 
              onClick={() => setActiveTab("lessons")}
              className="bg-white text-blue-700 font-black text-xs px-4 py-2 rounded-xl shadow-md hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Continuar: Álgebra Lineal &rarr;
            </button>
            <button 
              onClick={() => alert(`Desbloqueando logros de Alex Rivera...`)}
              className="bg-blue-700/50 hover:bg-blue-700/80 border border-blue-400/40 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              Ver mis logros
            </button>
          </div>
        </div>

        {/* Small fast stats card */}
        <div className="bg-white/10 shrink-0 border border-white/20 p-4 rounded-2xl z-10 text-center w-full md:w-36 flex flex-row md:flex-col justify-around gap-2 items-center">
          <div className="flex items-center gap-1">
            <Flame className="text-orange-400 shrink-0 animate-bounce" size={18} />
            <span className="text-xl font-extrabold text-white">5 Días</span>
          </div>
          <p className="text-[9px] uppercase tracking-wider font-bold text-blue-200">Racha activa escolar</p>
        </div>
      </div>

      {/* CORE LECCIONES & EVALUATIONS COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left main: Lessons in progress */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-extrabold text-slate-700 tracking-tight flex items-center gap-1.5">
              <BookOpen size={16} className="text-blue-600" />
              Lecciones en curso <span className="text-xs bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full font-mono">3 activas</span>
            </h2>
            <button 
              onClick={() => setActiveTab("lessons")}
              className="text-xs font-bold text-[#004AC6] hover:underline"
            >
              Ver todas
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Card Lesson 1 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3 relative hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
                  Intermedio
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Código: MAT-A3</span>
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 leading-tight">Álgebra Lineal</h3>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Módulo 4: Matrices y Determinantes</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                  <span>Progreso de Lectura</span>
                  <span>68%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: "68%" }}></div>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab("lessons")}
                className="w-full text-center py-2 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-bold rounded-xl text-slate-700 cursor-pointer"
              >
                Continuar teoría
              </button>
            </div>

            {/* Card Lesson 2 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3 relative hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
                  Básico
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Código: MAT-G2</span>
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 leading-tight">Geometría Euclidiana</h3>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Módulo 2: Teorema de Pitágoras</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                  <span>Progreso de Lectura</span>
                  <span>92%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: "92%" }}></div>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab("lessons")}
                className="w-full text-center py-2 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-bold rounded-xl text-slate-700 cursor-pointer"
              >
                Ir a Práctica Inmediata
              </button>
            </div>

          </div>

          {/* COMPENTENCY CIRCULAR/RADIAL PROGRESS BLOCKS */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
              <span>Progreso de Competencias Curriculares</span>
              <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-400 font-bold">Por Unidad Evaluada</span>
            </h3>

            <div className="grid grid-cols-3 gap-4 pt-1 text-center">
              
              <div className="space-y-2 flex flex-col items-center">
                <div className="relative w-16 h-16 rounded-full border-4 border-slate-50 flex items-center justify-center font-bold text-sm text-slate-800">
                  <span className="z-10 font-black">80%</span>
                  {/* CSS SVG Circle ring indicator */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90 text-blue-600" viewBox="0 0 36 36">
                    <path
                      strokeDasharray="80 20"
                      strokeWidth="3.2"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-800 leading-tight">Pensamiento Lógico</p>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-600 block mt-0.5">Excelente</span>
                </div>
              </div>

              <div className="space-y-2 flex flex-col items-center">
                <div className="relative w-16 h-16 rounded-full border-4 border-slate-50 flex items-center justify-center font-bold text-sm text-slate-800">
                  <span className="z-10 font-black">65%</span>
                  <svg className="absolute inset-0 w-full h-full -rotate-90 text-amber-500" viewBox="0 0 36 36">
                    <path
                      strokeDasharray="65 35"
                      strokeWidth="3.2"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-800 leading-tight">Resolución de Problemas</p>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-amber-600 block mt-0.5">En Mejora</span>
                </div>
              </div>

              <div className="space-y-2 flex flex-col items-center">
                <div className="relative w-16 h-16 rounded-full border-4 border-slate-50 flex items-center justify-center font-bold text-sm text-slate-800">
                  <span className="z-10 font-black">90%</span>
                  <svg className="absolute inset-0 w-full h-full -rotate-90 text-emerald-500" viewBox="0 0 36 36">
                    <path
                      strokeDasharray="90 10"
                      strokeWidth="3.2"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-800 leading-tight">Fundamentos Matemáticos</p>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-600 block mt-0.5">Sobresaliente</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right side widgets pane */}
        <div className="space-y-5">
          
          {/* Upcoming assessments list widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Calendar size={14} className="text-blue-500" />
              Próximas Pruebas Escolares
            </h3>

            <div className="space-y-3.5 pt-1">
              
              <div className="flex gap-3 items-start p-3 bg-slate-50 border border-slate-205 rounded-xl">
                <div className="w-11 h-11 rounded-lg bg-blue-50 border border-blue-100 flex flex-col items-center justify-center font-black shrink-0">
                  <span className="text-[9px] uppercase text-blue-500/80 tracking-wide">Oct</span>
                  <span className="text-base text-[#004AC6] -mt-1 leading-tight">24</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-700 truncate leading-tight">Parcial de Cálculo I</p>
                  <p className="text-[9px] text-slate-400 font-medium mt-0.5">Hora: 14:00 • Virtual Sanctum</p>
                </div>
              </div>

              <div className="flex gap-3 items-start p-3 bg-slate-50 border border-slate-205 rounded-xl">
                <div className="w-11 h-11 rounded-lg bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center font-black shrink-0">
                  <span className="text-[9px] uppercase text-indigo-500/80 tracking-wide">Oct</span>
                  <span className="text-base text-indigo-600 -mt-1 leading-tight">27</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-700 truncate leading-tight">Quiz: Probabilidad</p>
                  <p className="text-[9px] text-slate-400 font-medium mt-0.5">Hora: 09:00 • Presencial Sala A</p>
                </div>
              </div>

              <button 
                onClick={() => {
                  addApiLog("POST", "/calendar/reminders", { agenda: "Cálculo I Parcial 24 Oct" }, { status: "created", alert_ms: 180000 }, 201);
                  alert(`🔔 [Sincronizado] Recordatorio asignado con éxito. Se enviará una alerta automática por correo 3 hours antes.`);
                }}
                className="w-full text-center py-2 bg-blue-50 hover:bg-blue-100 hover:text-[#004AC6] text-blue-600 transition-colors text-xs font-bold rounded-xl cursor-pointer"
              >
                + Agendar Recordatorio
              </button>

            </div>
          </div>

          {/* Student activity feed log list */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Star size={14} className="text-orange-400" />
              Historial Reciente de Logros
            </h3>

            <div className="space-y-4 relative pl-3.5 border-l border-slate-100 pt-1">
              
              <div className="relative">
                <span className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white"></span>
                <p className="text-xs font-bold text-slate-700 leading-snug">Completaste el cuestionario de Trigonometría</p>
                <p className="text-[9px] text-slate-400 font-mono mt-0.5 uppercase">Hace 2 horas</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-orange-400 ring-4 ring-white"></span>
                <p className="text-xs font-bold text-slate-700 leading-snug">Obtuviste nueva medalla escolar "Velocidad Lumínica"</p>
                <p className="text-[9px] text-slate-400 font-mono mt-0.5 uppercase">Ayer, 18:45</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white"></span>
                <p className="text-xs font-bold text-slate-700 leading-snug">El profesor García comentó en tu entrega de matrices</p>
                <p className="text-[9px] text-slate-400 font-mono mt-0.5 uppercase font-bold text-blue-500">Ayer, 10:20</p>
              </div>

            </div>
          </div>

          {/* live support click banner */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl relative shadow-md overflow-hidden flex items-center justify-between group">
            <div className="space-y-0.5">
              <p className="text-xs font-black text-white">¿Necesitas ayuda?</p>
              <p className="text-[9px] text-slate-300">Consulta con un tutor en vivo 24/7 disponible.</p>
            </div>
            <button 
              onClick={() => alert(`Conectando con el canal de soporte escolar de MathFlow...`)}
              className="bg-white text-slate-950 font-extrabold w-7 h-7 rounded-lg text-xs hover:bg-slate-150 transition-all flex items-center justify-center cursor-pointer shrink-0"
              title="Chat con Tutor"
            >
              &rarr;
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
