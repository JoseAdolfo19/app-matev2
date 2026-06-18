/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { StudentRecord } from "../types";
import { MOCK_STUDENTS, apiSimulate } from "../mockData";
import { 
  Users, Search, Filter, FileText, Download, CheckCircle, AlertTriangle, 
  TrendingUp, Percent, FileDown, ArrowUpDown, RefreshCw, BarChart3, PieChart
} from "lucide-react";

export default function AcademicTracking() {
  const [students, setStudents] = useState<StudentRecord[]>(MOCK_STUDENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState("Todas");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [sortBy, setSortBy] = useState<"name" | "grade">("name");
  const [loading, setLoading] = useState(false);
  const [exportingType, setExportingType] = useState<"pdf" | "excel" | null>(null);

  // Load students with filter fetch simulation
  const fetchFilteredStudents = async () => {
    setLoading(true);
    try {
      const filters = {
        search: searchQuery,
        section: sectionFilter === "Todas" ? undefined : sectionFilter
      };
      const res = await apiSimulate.getStudents(filters);
      if (res.success) {
        let list = res.data;
        if (statusFilter !== "Todos") {
          list = list.filter(st => st.status === statusFilter.toLowerCase());
        }
        
        // Sorting logic
        if (sortBy === "name") {
          list.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "grade") {
          list.sort((a, b) => b.averageGrade - a.averageGrade);
        }

        setStudents(list);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredStudents();
  }, [searchQuery, sectionFilter, statusFilter, sortBy]);

  // Calculations for static mathematical indicators
  const totalStudents = students.length;
  const excellentCount = students.filter(s => s.status === "excelente").length;
  const regularCount = students.filter(s => s.status === "regular").length;
  const riskCount = students.filter(s => s.status === "riesgo").length;

  const totalGradeSum = students.reduce((acc, s) => acc + s.averageGrade, 0);
  const averageGrade = totalStudents > 0 ? parseFloat((totalGradeSum / totalStudents).toFixed(1)) : 0;
  
  const passedStudentsCount = students.filter(s => s.averageGrade >= 11).length;
  const passRate = totalStudents > 0 ? Math.round((passedStudentsCount / totalStudents) * 100) : 0;

  // Mock Export Handler
  const handleExport = async (format: "pdf" | "excel") => {
    setExportingType(format);
    
    // Simulate API query log
    const { addApiLog } = require("../mockData");
    addApiLog("POST", `/reports/export`, { format, student_count: students.length, filter_section: sectionFilter }, {
      status: "processing",
      mime_type: format === "pdf" ? "application/pdf" : "application/vnd.ms-excel",
      download_url: `https://mi-api-laravel.test/api/v1/reports/downloads/report_${Date.now()}.${format}`,
      file_size_kb: format === "pdf" ? 420 : 128
    }, 200);

    await new Promise((resolve) => setTimeout(resolve, 1500));
    setExportingType(null);

    // Trigger dummy download / printable print preview
    const dateStr = new Date().toLocaleDateString();
    
    if (format === "pdf") {
      const printContent = `
        Plataforma Matemática - Reporte Escolar (${dateStr})
        ==================================================
        Sección: ${sectionFilter} | Promedio General: ${averageGrade} / 20
        Tasa de Aprobación Activa: ${passRate}%

        Estudiantes Registrados:
        ${students.map((s, i) => `${i+1}. ${s.name} (${s.section}) - Nota Promedio: ${s.averageGrade} - Estado: ${s.status.toUpperCase()}`).join("\n")}
      `;
      alert(`📄 [PDF Generado] Archivo descargado con éxito.\nContenido del reporte:\n${printContent}`);
    } else {
      alert(`📊 [Excel Sincronizado] Documento de hojas de cálculo "Reporte_Matematica_${sectionFilter}.xlsx" sincronizado adecuadamente con el Gestor de Archivos de Laravel Core.`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* KPI Top containers */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Estudiantes</span>
            <span className="text-xl font-bold text-slate-800">{totalStudents}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">En la sección activa</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Promedio General</span>
            <span className="text-xl font-bold text-slate-800">{averageGrade} / 20</span>
            <span className={`text-[10px] font-bold block mt-0.5 ${averageGrade >= 13 ? "text-emerald-600" : "text-rose-600"}`}>
              {averageGrade >= 11 ? "Nivel Satisfactorio" : "Requiere Reforzamiento"}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
            <Percent size={24} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Tasa de Aprobación</span>
            <span className="text-xl font-bold text-slate-800">{passRate}%</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">{passedStudentsCount} alumnos con nota {`>= 11`}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-rose-50 text-rose-600 p-3 rounded-xl">
            <AlertTriangle size={24} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Estudiantes en Riesgo</span>
            <span className="text-xl font-bold text-rose-600">{riskCount}</span>
            <span className="text-[10px] text-rose-500 font-medium block mt-0.5">Requieren atención prioritaria</span>
          </div>
        </div>

      </div>

      {/* Interactive Charts & Reports block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dynamic clean SVG performance representation */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <BarChart3 size={15} className="text-blue-500" />
            Gráfico de Rendimiento Matemático por Alumno
          </h3>

          <div className="h-60 flex flex-col justify-between py-2">
            {totalStudents === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400 text-xs py-10">
                Aplica filtros para renderizar los datos del aula
              </div>
            ) : (
              <div className="h-full flex items-end justify-between gap-3 px-2 pt-6 relative border-b border-l border-slate-200">
                
                {/* 11 grade passing reference line */}
                <div className="absolute left-0 right-0 border-t border-dashed border-rose-400/40" style={{ bottom: `${(11 / 20) * 100}%` }}>
                  <span className="absolute right-2 -mt-3.5 text-[9px] font-bold text-rose-500 font-mono tracking-wide bg-white px-1">Línea de Aprobación Mínima (Nota: 11)</span>
                </div>

                {students.map((st) => {
                  // Calc height % representing score out of 20
                  const heightPercent = (st.averageGrade / 20) * 100;
                  const barColor = 
                    st.status === "excelente" ? "bg-gradient-to-t from-emerald-500 to-emerald-400" :
                    st.status === "regular" ? "bg-gradient-to-t from-blue-500 to-blue-400" : 
                    "bg-gradient-to-t from-rose-500 to-rose-400";

                  return (
                    <div key={st.id} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-1.5 hidden group-hover:block bg-slate-900 text-white p-2 rounded-lg text-[10px] w-28 text-center z-10 pointer-events-none shadow-xl border border-slate-800">
                        <p className="font-bold truncate">{st.name}</p>
                        <p className="font-semibold text-amber-400 mt-0.5">Nota: {st.averageGrade} / 20</p>
                        <p className="text-slate-400">Lecciones: {st.completedLessonsCount}</p>
                      </div>

                      {/* Bar represent */}
                      <div 
                        className={`w-full rounded-t-md transition-all duration-500 ${barColor} hover:brightness-105 active:scale-95 cursor-pointer max-w-[40px]`}
                        style={{ height: `${heightPercent}%` }}
                      ></div>

                      {/* Label under bar (Short initial) */}
                      <span className="text-[9px] text-slate-500 font-semibold truncate max-w-[45px] text-center mt-2 font-mono">
                        {st.name.split(" ")[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Legend indicators */}
            <div className="flex gap-4 justify-center text-[10px] font-bold text-slate-400 mt-2">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-400 rounded"></span>Excelente (15 - 20)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-blue-400 rounded"></span>Regular (11 - 14)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-400 rounded"></span>Riesgo (00 - 10)</span>
            </div>

          </div>
        </div>

        {/* Status Circular/Pie representation chart using CSS vector */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <PieChart size={15} className="text-indigo-500" />
            Distribución por Estatus
          </h3>

          <div className="flex flex-col items-center justify-between h-56 py-2">
            {totalStudents === 0 ? (
              <div className="text-xs text-slate-400 italic">Sin datos</div>
            ) : (
              <>
                {/* Simulated circular pie representation chart using clean border blocks */}
                <div className="relative w-32 h-32 rounded-full border-8 border-slate-100 flex items-center justify-center p-2.5">
                  <div className="text-center">
                    <span className="text-2xl font-black text-slate-800">{passRate}%</span>
                    <span className="block text-[8px] uppercase tracking-wider font-bold text-slate-400">Aprobados</span>
                  </div>
                  
                  {/* Decorative circular layers representing ratios */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-emerald-500"
                      strokeDasharray={`${(excellentCount / totalStudents) * 100} ${100 - (excellentCount / totalStudents) * 100}`}
                      strokeWidth="2.8"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                </div>

                <div className="w-full space-y-1.5 text-[11px] font-medium text-slate-600">
                  <div className="flex justify-between items-center bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Excelente</span>
                    <span className="font-bold text-slate-800">{excellentCount} Estudiantes ({Math.round((excellentCount/totalStudents)*100)}%)</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Regular</span>
                    <span className="font-bold text-slate-800">{regularCount} Estudiantes ({Math.round((regularCount/totalStudents)*100)}%)</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span>En Riesgo</span>
                    <span className="font-bold text-slate-800">{riskCount} Estudiantes ({Math.round((riskCount/totalStudents)*100)}%)</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Search filters and Student Actions table */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        
        {/* Controls, query fields, export buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre o correo..."
                className="pl-9 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Filter by Section */}
            <div className="flex items-center gap-1.5">
              <Filter size={14} className="text-slate-400 shrink-0" />
              <select
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
                className="px-3 py-2 w-full bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
              >
                <option value="Todas">Todas las secciones</option>
                <option value="1° de Secundaria">1° de Secundaria</option>
                <option value="2° de Secundaria">2° de Secundaria</option>
              </select>
            </div>

            {/* Filter by Grade Estatus */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown size={14} className="text-slate-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 w-full bg-slate-50 border border-slate-205 rounded-xl text-xs text-slate-800 font-medium"
              >
                <option value="Todos">Todos los estatus</option>
                <option value="Excelente">Excelente (15+)</option>
                <option value="Regular">Regular (11 - 14)</option>
                <option value="Riesgo">Riesgo (10-)</option>
              </select>
            </div>

          </div>

          {/* EXPORTS TRIGGER BUTTONS */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport("pdf")}
              disabled={exportingType !== null}
              className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100/80 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {exportingType === "pdf" ? (
                <span className="w-3 h-3 rounded-full border border-rose-600 border-t-transparent animate-spin"></span>
              ) : (
                <FileText size={14} />
              )}
              Exportar PDF
            </button>
            <button
              onClick={() => handleExport("excel")}
              disabled={exportingType !== null}
              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {exportingType === "excel" ? (
                <span className="w-3 h-3 rounded-full border border-emerald-600 border-t-transparent animate-spin"></span>
              ) : (
                <Download size={14} />
              )}
              Exportar Excel
            </button>
          </div>

        </div>

        {/* Grid/Table lists */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <RefreshCw className="animate-spin text-slate-400" />
            <span className="ml-2 text-xs text-slate-400">Filtrando registros en Laravel...</span>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-12 text-slate-405 text-xs italic">
            Ningún estudiante coincide con los criterios de búsqueda o filtros indicados.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 font-bold text-slate-500 uppercase tracking-wider text-[9px] border-b border-slate-100">
                <tr>
                  <th className="p-3">Estudiante</th>
                  <th className="p-3">Sección</th>
                  <th className="p-3 text-center">Avance Lecciones</th>
                  <th className="p-3 text-center">Exámenes Rendidos</th>
                  <th className="p-3 text-center">Promedio Notas</th>
                  <th className="p-3 text-center">Estatus</th>
                  <th className="p-3 text-right">Última Actividad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11.5px] text-slate-700 font-medium">
                {students.map((st) => {
                  
                  const statusColors = 
                    st.status === "excelente" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                    st.status === "regular" ? "bg-blue-50 text-blue-700 border-blue-100" :
                    "bg-rose-50 text-rose-700 border-rose-100";

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-slate-800">{st.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono font-medium">{st.email}</div>
                      </td>
                      <td className="p-3 whitespace-nowrap">{st.section}</td>
                      <td className="p-3 text-center font-bold text-slate-600">{st.completedLessonsCount} / 4</td>
                      <td className="p-3 text-center font-bold text-slate-600">{st.completedExamsCount} / 2</td>
                      <td className="p-3 text-center font-black text-slate-800">{st.averageGrade}</td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] uppercase font-bold tracking-wider ${statusColors}`}>
                          {st.status}
                        </span>
                      </td>
                      <td className="p-3 text-right text-[10.5px] text-slate-500">{st.lastActive}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}
