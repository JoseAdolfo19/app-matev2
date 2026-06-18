/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { GraduationCap, LogOut, Code, User as UserIcon, BarChart2, BookOpen, FileSpreadsheet } from "lucide-react";
import { User } from "../types";

interface HeaderProps {
  user: User;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Header({ user, onLogout, activeTab, setActiveTab }: HeaderProps) {
  const isDocente = user.role === "docente";

  return (
    <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl text-white shadow-md shadow-blue-500/20">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none">MatemáticaInteractiva</h1>
              <span className="text-[10px] text-slate-400 font-medium">Core de Aprendizaje Escolar</span>
            </div>
          </div>

          {/* Navigation Links according to user role */}
          <nav className="hidden md:flex space-x-1 bg-slate-50 border border-slate-100 p-1 rounded-xl">
            {isDocente ? (
              <>
                <button
                  onClick={() => setActiveTab("lessons")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "lessons"
                      ? "bg-white text-blue-600 shadow-sm font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                  }`}
                >
                  <BookOpen size={16} />
                  Gestión de Lecciones
                </button>
                <button
                  onClick={() => setActiveTab("exams")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "exams"
                      ? "bg-white text-blue-600 shadow-sm font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                  }`}
                >
                  <FileSpreadsheet size={16} />
                  Constructor de Exámenes
                </button>
                <button
                  onClick={() => setActiveTab("reports")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "reports"
                      ? "bg-white text-blue-600 shadow-sm font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                  }`}
                >
                  <BarChart2 size={16} />
                  Seguimiento Académico
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab("lessons")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "lessons"
                      ? "bg-white text-blue-600 shadow-sm font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                  }`}
                >
                  <BookOpen size={16} />
                  Mis Clases y Unidades
                </button>
                <button
                  onClick={() => setActiveTab("exams")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "exams"
                      ? "bg-white text-blue-600 shadow-sm font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                  }`}
                >
                  <FileSpreadsheet size={16} />
                  Evaluaciones en Línea
                </button>
              </>
            )}
          </nav>

          {/* User info and Logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 text-right">
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-800 leading-none">{user.name}</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">
                  {isDocente ? "Docente" : `Alumno • ${user.section}`}
                </p>
              </div>
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`}
                alt="Avatar"
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full ring-2 ring-blue-500/10 object-cover"
              />
            </div>

            <button
              onClick={onLogout}
              className="text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors border border-slate-100"
              title="Cerrar sesión"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Links */}
        <div className="md:hidden flex space-x-1 pb-3 overflow-x-auto">
          {isDocente ? (
            <>
              <button
                onClick={() => setActiveTab("lessons")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === "lessons"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <BookOpen size={13} />
                Gestión de Lecciones
              </button>
              <button
                onClick={() => setActiveTab("exams")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === "exams"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <FileSpreadsheet size={13} />
                Constructor Exámenes
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === "reports"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <BarChart2 size={13} />
                Seguimiento
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab("lessons")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === "lessons"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <BookOpen size={13} />
                Mis Clases
              </button>
              <button
                onClick={() => setActiveTab("exams")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === "exams"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <FileSpreadsheet size={13} />
                Evaluaciones
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
