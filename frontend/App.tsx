/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { User } from "./types";
import Auth from "./components/Auth";
import LessonsManager from "./components/LessonsManager";
import EvaluationsManager from "./components/EvaluationsManager";
import AcademicTracking from "./components/AcademicTracking";
import HomeDashboard from "./components/HomeDashboard";
import BrandingSettings from "./components/BrandingSettings";
import LaravelTerminal from "./components/LaravelTerminal";
import { addApiLog } from "./mockData";
import { 
  GraduationCap, BookOpen, Layers, Terminal, LayoutDashboard, 
  Settings, HelpCircle, LogOut, Search, Bell, AlertTriangle, BookOpenCheck 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Handle successful login or registration
  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    // Dynamic default: always land on the beautiful dashboard
    setActiveTab("dashboard");
  };

  // Logged out clear triggers
  const handleLogout = () => {
    addApiLog("POST", "/auth/logout", null, { success: true, session: "invalidated" }, 200);
    setUser(null);
  };

  const getProfileInitials = (nameStr: string) => {
    return nameStr
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      
      {/* Dynamic Main App Container */}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          {!user ? (
            <motion.div
              key="auth-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {/* Educational header */}
              <div className="bg-slate-900 text-white text-[11px] py-1.5 px-4 flex items-center justify-between font-mono border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  <span>Servidor de Simulación Sanctum: Activo</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Terminal size={12} className="text-blue-400" />
                  <span>Laravel Sanctum Client Gateway Interface</span>
                </div>
              </div>

              <Auth onLoginSuccess={handleLoginSuccess} />
            </motion.div>
          ) : (
            <motion.div
              key="platform-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex min-h-screen bg-slate-100 text-slate-800 font-sans"
            >
              {/* MathFlow Left Sidebar Navigation */}
              <aside className="w-64 bg-[#0A1128] text-slate-100 flex flex-col shrink-0 border-r border-slate-800 hidden md:flex min-h-screen sticky top-0 justify-between">
                <div>
                  <div className="p-6 border-b border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#004AC6] text-white rounded flex items-center justify-center font-extrabold text-lg shadow-lg shadow-blue-500/20">%</div>
                      <h1 className="text-base font-black tracking-tight text-white flex flex-col">
                        MathFlow <span className="text-[10px] uppercase font-bold tracking-widest text-[#046A38] -mt-1 font-mono">Aula Virtual</span>
                      </h1>
                    </div>
                  </div>

                  <nav className="p-4 space-y-1">
                    <div className="text-[9px] uppercase font-extrabold text-slate-500 tracking-widest mb-2 px-2">Menú Principal</div>
                    
                    {/* Dashboard */}
                    <button
                      onClick={() => setActiveTab("dashboard")}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "dashboard" 
                          ? "bg-[#004AC6] text-white shadow-md shadow-blue-600/10" 
                          : "hover:bg-slate-800/40 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <LayoutDashboard size={15} />
                      Dashboard
                    </button>

                    {/* lessons */}
                    <button
                      onClick={() => setActiveTab("lessons")}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "lessons" 
                          ? "bg-[#004AC6] text-white shadow-md shadow-blue-600/10" 
                          : "hover:bg-slate-800/40 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <BookOpen size={15} />
                      Lecciones
                    </button>

                    {/* exams */}
                    <button
                      onClick={() => setActiveTab("exams")}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "exams" 
                          ? "bg-[#004AC6] text-white shadow-md shadow-blue-600/10" 
                          : "hover:bg-slate-800/40 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Layers size={15} />
                      Evaluaciones
                    </button>

                    {/* reports (Only Docente) */}
                    {user.role === "docente" && (
                      <button
                        onClick={() => setActiveTab("reports")}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeTab === "reports" 
                            ? "bg-[#004AC6] text-white shadow-md shadow-blue-600/10" 
                            : "hover:bg-slate-800/40 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <GraduationCap size={15} />
                        Reportes
                      </button>
                    )}

                    <div className="text-[9px] uppercase font-extrabold text-slate-500 tracking-widest pt-4 pb-2 px-2">Configuración</div>

                    {/* settings */}
                    <button
                      onClick={() => setActiveTab("settings")}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "settings" 
                          ? "bg-[#004AC6] text-white shadow-md shadow-blue-600/10" 
                          : "hover:bg-slate-800/40 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Settings size={15} />
                      Ajustes
                    </button>

                    {/* help */}
                    <button
                      onClick={() => setActiveTab("help")}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "help" 
                          ? "bg-[#004AC6] text-white shadow-md shadow-blue-600/10" 
                          : "hover:bg-slate-800/40 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <HelpCircle size={15} />
                      Ayuda
                    </button>
                  </nav>
                </div>

                {/* Footer User Signature */}
                <div className="p-4 border-t border-slate-800 bg-[#080d1f]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-400/90 text-slate-950 flex items-center justify-center font-black text-xs shrink-0 border border-slate-700">
                      {getProfileInitials(user.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate leading-tight">{user.name}</p>
                      <p className="text-[9px] text-slate-400 font-mono italic mt-0.5 uppercase tracking-wide">
                        {user.role === "docente" ? "Docente" : `Alumno • ${user.section}`}
                      </p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="text-slate-450 hover:text-rose-500 transition-colors p-1"
                      title="Cerrar sesión"
                    >
                      <LogOut size={14} />
                    </button>
                  </div>
                </div>
              </aside>

              {/* Main Workspace Frame */}
              <div className="flex-grow flex flex-col min-w-0">
                
                {/* Upper Status Header */}
                <header className="h-16 bg-white border-b border-slate-250 flex items-center justify-between px-6 md:px-8 shrink-0">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xs md:text-sm font-extrabold text-slate-700 uppercase tracking-wider">
                      {activeTab === "dashboard" && "Dashboard General"}
                      {activeTab === "lessons" && "Panel de Lecciones Académicas"}
                      {activeTab === "exams" && "Pizarra de Evaluaciones Curriculares"}
                      {activeTab === "reports" && "Seguimiento y Registro de Notas"}
                      {activeTab === "settings" && "Configuración de Sistema"}
                      {activeTab === "help" && "Centro de Apoyo Matemático"}
                    </h2>
                    <span className="text-[10px] bg-green-50 text-green-700 border border-green-200/60 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      Sanctum API Connect
                    </span>
                  </div>

                  <div className="flex items-center gap-3 md:gap-5">
                    {/* Compact Search Field */}
                    <div className="relative hidden sm:block">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">🔍</span>
                      <input
                        type="text"
                        placeholder="Buscar módulo o tema..."
                        className="pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-xs w-48 md:w-56 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
                      />
                    </div>

                    <button className="p-1 px-2 text-slate-400 hover:text-slate-600 transition-colors text-xs font-semibold border rounded-lg hidden sm:block">
                      🔔
                    </button>

                    <div className="flex items-center gap-2 pl-3 border-l border-slate-205">
                      <button
                        onClick={handleLogout}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/50 px-3 py-1.5 rounded-lg border border-rose-100 transition-all cursor-pointer"
                      >
                        Salir
                      </button>
                    </div>
                  </div>
                </header>

                {/* Mobile Navigation Bar */}
                <div className="md:hidden bg-[#0A1128] p-2 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`px-3 py-1 text-xs font-bold whitespace-nowrap transition-colors rounded ${
                      activeTab === "dashboard" ? "bg-blue-600 text-white" : "text-slate-400 bg-slate-900/60"
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab("lessons")}
                    className={`px-3 py-1 text-xs font-bold whitespace-nowrap transition-colors rounded ${
                      activeTab === "lessons" ? "bg-blue-600 text-white" : "text-slate-400 bg-slate-900/60"
                    }`}
                  >
                    Lecciones
                  </button>
                  <button
                    onClick={() => setActiveTab("exams")}
                    className={`px-3 py-1 text-xs font-bold whitespace-nowrap transition-colors rounded ${
                      activeTab === "exams" ? "bg-blue-600 text-white" : "text-slate-400 bg-slate-900/60"
                    }`}
                  >
                    Pruebas
                  </button>
                  {user.role === "docente" && (
                    <button
                      onClick={() => setActiveTab("reports")}
                      className={`px-3 py-1 text-xs font-bold whitespace-nowrap transition-colors rounded ${
                        activeTab === "reports" ? "bg-blue-600 text-white" : "text-slate-400 bg-slate-900/60"
                      }`}
                    >
                      Reportes
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`px-3 py-1 text-xs font-bold whitespace-nowrap transition-colors rounded ${
                      activeTab === "settings" ? "bg-blue-600 text-white" : "text-slate-400 bg-slate-900/60"
                    }`}
                  >
                    Ajustes
                  </button>
                </div>

                {/* Main Content Body Container */}
                <main className="flex-1 p-5 md:p-8 max-w-7xl w-full mx-auto pb-24">
                  <AnimatePresence mode="wait">
                    
                    {activeTab === "dashboard" && (
                      <motion.div
                        key="dashboard-tab"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <HomeDashboard user={user} setActiveTab={setActiveTab} />
                      </motion.div>
                    )}

                    {activeTab === "lessons" && (
                      <motion.div
                        key="lessons-tab"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <LessonsManager user={user} />
                      </motion.div>
                    )}

                    {activeTab === "exams" && (
                      <motion.div
                        key="exams-tab"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <EvaluationsManager user={user} />
                      </motion.div>
                    )}

                    {activeTab === "reports" && user.role === "docente" && (
                      <motion.div
                        key="reports-tab"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <AcademicTracking />
                      </motion.div>
                    )}

                    {activeTab === "settings" && (
                      <motion.div
                        key="settings-tab"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {user.role === "docente" ? (
                          <BrandingSettings />
                        ) : (
                          <div className="bg-white p-7 rounded-2xl border border-slate-100 shadow-sm max-w-lg space-y-4">
                            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">Mi Perfil Estudiantil</h2>
                            <div className="flex gap-4 items-center">
                              <img className="w-14 h-14 rounded-full border border-slate-300" src={user.avatar || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120"} alt="User" referrerPolicy="no-referrer" />
                              <div>
                                <h3 className="font-extrabold text-slate-800 text-lg">{user.name}</h3>
                                <p className="text-xs text-slate-500">Grado: {user.section}</p>
                              </div>
                            </div>
                            <div className="space-y-2 pt-2 text-xs">
                              <div className="flex justify-between p-1.5 bg-slate-50 border rounded-lg">
                                <span className="text-slate-500">Correo Electrónico:</span>
                                <span className="font-bold text-slate-800">{user.email}</span>
                              </div>
                              <div className="flex justify-between p-1.5 bg-slate-50 border rounded-lg">
                                <span className="text-slate-500">Clase Principal:</span>
                                <span className="font-bold text-[#046A38]">Aritmética y Álgebra</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => alert(`Sincronizado perfil de Alex Rivera satisfactoriamente.`)}
                              className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs rounded-xl"
                            >
                              Guardar cambios de perfil
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === "help" && (
                      <motion.div
                        key="help-tab"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="space-y-6">
                          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                            <h1 className="text-base font-extrabold text-slate-800">Centro de Materiales de Ayuda</h1>
                            <p className="text-xs text-slate-500 mt-1">Soporte didáctico interactivo y glosarios matemáticos habilitados.</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-3">
                              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b pb-2">
                                <BookOpenCheck size={16} className="text-[#004AC6]" />
                                Glosario de LaTeX Soportado
                              </h3>
                              <p className="text-xs text-slate-500">Utiliza la pestaña del editor para incrustar fracciones completas, matrices complejas y teoremas:</p>
                              
                              <div className="bg-slate-50 p-3 rounded-lg border font-mono text-[11px] text-slate-700 space-y-1">
                                <p><strong>Fracciones:</strong> <span className="text-blue-600">\frac{"{a}"}{"{b}"}</span></p>
                                <p><strong>Exponentes:</strong> <span className="text-blue-600">x^2 + y^2 = r^2</span></p>
                                <p><strong>Suma integral:</strong> <span className="text-blue-600">\int a^x dx</span></p>
                                <p><strong>Raíz cuadrada:</strong> <span className="text-blue-600">\sqrt{"{x}"}</span></p>
                              </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-3">
                              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b pb-2">
                                <AlertTriangle size={15} className="text-amber-500" />
                                Preguntas Académicas Frecuentes
                              </h3>
                              
                              <div className="space-y-2 text-xs">
                                <details className="p-2 border rounded-lg cursor-pointer bg-slate-50/50">
                                  <summary className="font-bold text-slate-750">¿Cómo se califican los exámenes?</summary>
                                  <p className="text-slate-500 mt-1">Se utiliza el método de auto-puntuación de Laravel en base a 20 puntos, validando arrastre y coincidencia exacta.</p>
                                </details>
                                <details className="p-2 border rounded-lg cursor-pointer bg-slate-50/50">
                                  <summary className="font-bold text-slate-750">¿Mis lecciones guardan respuestas?</summary>
                                  <p className="text-slate-500 mt-1">Sí, se sincornizan de manera asíncrona mediante el log de transacciones del cliente Sanctum.</p>
                                </details>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </main>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Persistent Laravel Integration Inspector Console */}
      <LaravelTerminal />

    </div>
  );
}
