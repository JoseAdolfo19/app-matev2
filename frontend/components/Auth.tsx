/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { User, Role } from "../types";
import { apiSimulate, LARAVEL_API_BASE } from "../mockData";
import { LogIn, UserPlus, GraduationCap, ShieldCheck, Mail, Lock, User as UserIcon, BookOpen, AlertCircle, Eye, EyeOff, Info } from "lucide-react";

interface AuthProps {
  onLoginSuccess: (user: User) => void;
}

export default function Auth({ onLoginSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role>("estudiante");
  const [showPassword, setShowPassword] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [section, setSection] = useState("3ero Secundaria");
  const [subject, setSubject] = useState("Álgebra y Geometría");
  const [password, setPassword] = useState("password123");
  const [docenteCode, setDocenteCode] = useState("MAT-DOC-2026");

  // Status
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Por favor, introduce tu correo electrónico.");
      return;
    }
    if (!isLogin && !name) {
      setErrorMsg("Por favor, introduce tu nombre.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (isLogin) {
        // Mock Login
        const res = await apiSimulate.login(email, selectedRole);
        if (res.success) {
          setSuccessMsg("¡Conectado con éxito a la API de Laravel!");
          setTimeout(() => {
            onLoginSuccess(res.data.user);
          }, 800);
        } else {
          setErrorMsg(res.message || "Error al autenticar. Revisa tu correo o rol.");
        }
      } else {
        // Mock Register
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        // Simulating writing dynamic register payload logs
        const registerPayload = {
          name,
          email,
          role: selectedRole,
          password,
          ...(selectedRole === "estudiante" ? { section } : { subject, docenteCode })
        };

        const mockUserRes = {
          id: `user-${Date.now()}`,
          name,
          email,
          role: selectedRole,
          section: selectedRole === "estudiante" ? section : undefined,
          avatar: selectedRole === "docente" 
            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
            : "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120"
        };

        // Record register log
        const { addApiLog } = await import("../mockData");
        addApiLog("POST", "/auth/register", registerPayload, { user: mockUserRes, status: "registered" }, 201);

        setSuccessMsg("¡Cuenta registrada con éxito en Laravel Sanctum! Iniciando sesión...");
        setTimeout(() => {
          onLoginSuccess(mockUserRes);
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg("Ocurrió un error al contactar el servidor Laravel Sanctum. Comprueba tus datos.");
    } finally {
      setLoading(false);
    }
  };

  const handleAutofill = (role: Role) => {
    setSelectedRole(role);
    if (role === "docente") {
      setEmail("profesor@lasalleurubamba.edu.pe");
    } else {
      setEmail("juan.perez@lasalleurubamba.edu.pe");
    }
    setPassword("password123");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-8 font-sans">
      
      {/* Outer dual column card wrapper */}
      <div className="bg-white rounded-[24px] shadow-2xl shadow-slate-200 border border-slate-100 w-full max-w-5xl overflow-hidden min-h-[640px] flex flex-col md:flex-row">
        
        {/* LEFT COLUMN: BRAND INSIGHT SECTION (BLUE WRAPPER) */}
        <div className="w-full md:w-[45%] bg-[#004AC6] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle math graph background vectors */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none select-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <defs>
                <pattern id="cardGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cardGrid)" />
            </svg>
          </div>

          {/* Logo element */}
          <div className="flex items-center gap-3 z-10">
            <div className="w-9 h-9 bg-white text-blue-600 rounded-lg flex items-center justify-center font-black text-xl shadow-lg shadow-blue-900/20">
              %
            </div>
            <span className="text-xl font-extrabold tracking-tight">MathFlow</span>
          </div>

          {/* Motivating Central Hero Lines */}
          <div className="my-10 md:my-0 z-10">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight mb-4">
              Tu camino al dominio matemático comienza aquí.
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Únete a miles de estudiantes que transforman su relación con los números a través de aprendizaje interactivo y datos en tiempo real.
            </p>
          </div>

          {/* Testimonial Quote wrapper */}
          <div className="bg-blue-700/40 border border-blue-500/30 rounded-2xl p-5 z-10 backdrop-blur-sm">
            <div className="flex items-center gap-3.5 mb-3">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120"
                alt="Sofía Martínez" 
                className="w-10 h-10 rounded-full border border-blue-400 object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-xs font-bold text-white">Sofía Martínez</p>
                <p className="text-[10px] text-blue-200 font-semibold tracking-wider uppercase">Mentora Senior</p>
              </div>
            </div>
            <p className="text-xs text-blue-50 leading-relaxed italic">
              "MathFlow no solo enseña fórmulas, enseña a pensar. La plataforma ideal para la educación del siglo XXI."
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIONABLE FORM SECTION */}
        <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-between">
          <div>
            {/* Header Area */}
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                {isLogin ? "Iniciar sesión" : "Crear cuenta"}
              </h1>
              {/* Subtle Switcher */}
              <div className="flex gap-1.5 border border-slate-200/50 bg-slate-50 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setSelectedRole("estudiante")}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded transition-all uppercase ${
                    selectedRole === "estudiante"
                      ? "bg-blue-600 text-white"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Alumno
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole("docente")}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded transition-all uppercase ${
                    selectedRole === "docente"
                      ? "bg-slate-800 text-white"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Docente
                </button>
              </div>
            </div>

            <p className="text-slate-500 text-xs mb-6">
              {isLogin 
                ? "Bienvenido de nuevo. Regístrate o selecciona tu cuenta de pruebas." 
                : "Regístrate para empezar tu aventura matemática."}
            </p>

            {/* Autofill test credentials drawer (clean & non-intrusive) */}
            <div className="mb-5 bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex flex-col gap-2">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Acceso de Simulación Rápido:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleAutofill("estudiante")}
                  className="flex-1 text-[11px] py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-[#004AC6] font-extrabold rounded-lg border border-blue-100 transition-colors"
                >
                  Demo Estudiante
                </button>
                <button
                  type="button"
                  onClick={() => handleAutofill("docente")}
                  className="flex-1 text-[11px] py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-lg border border-slate-200 transition-colors"
                >
                  Demo Docente
                </button>
              </div>
            </div>

            {/* Form element */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Complete Name field (register only) */}
              {!isLogin && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Nombre completo</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-[13px] h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Juan Pérez"
                      className="pl-10 pr-4 py-2.5 w-full bg-slate-50 border border-slate-200/70 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-slate-800 font-medium"
                    />
                  </div>
                </div>
              )}

              {/* Email Address field */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Correo electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-[13px] h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nombre@ejemplo.com"
                    className="pl-10 pr-4 py-2.5 w-full bg-slate-50 border border-slate-200/70 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-slate-800 font-medium"
                  />
                </div>
              </div>

              {/* Segment & Specialty fields (register only) */}
              {!isLogin && selectedRole === "estudiante" && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Grado Escolar</label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="px-3.5 py-2.5 w-full bg-slate-50 border border-slate-200/70 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-slate-800 font-bold"
                  >
                    <option value="3ero Secundaria">3ero Secundaria</option>
                    <option value="4to Secundaria">4to Secundaria</option>
                    <option value="5to Secundaria">5to Secundaria</option>
                  </select>
                </div>
              )}

              {!isLogin && selectedRole === "docente" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Especialidad</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Curso docente"
                      className="px-3.5 py-2.5 w-full bg-slate-50 border border-slate-200/70 rounded-xl text-xs focus:outline-none text-slate-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Código de acceso</label>
                    <input
                      type="text"
                      required
                      value={docenteCode}
                      onChange={(e) => setDocenteCode(e.target.value)}
                      placeholder="MAT-DOC-2026"
                      className="px-3 py-2.5 w-full bg-indigo-50 border border-indigo-200/50 rounded-xl text-xs text-center font-semibold text-indigo-700"
                    />
                  </div>
                </div>
              )}

              {/* Password field with Show/Hide toggle */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-[13px] h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 caracteres, número incluido."
                    className="pl-10 pr-10 py-2.5 w-full bg-slate-50 border border-slate-200/70 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[13px] text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {!isLogin && (
                  <span className="text-[10px] text-slate-400 mt-1 block">Mínimo 8 caracteres, incluyendo un número.</span>
                )}
              </div>

              {/* Status messages indicator */}
              {errorMsg && (
                <div className="rounded-xl bg-rose-50 border border-rose-100 p-3 text-xs text-rose-600 flex items-start gap-2">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="rounded-xl bg-green-50 border border-green-150 p-3 text-xs text-green-700 flex items-start gap-2">
                  <ShieldCheck size={15} className="shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Submit button directly stylized */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#004AC6] hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-600/10 flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer mt-2"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                ) : (
                  <>
                    <span>{isLogin ? "Iniciar sesión" : "Crear cuenta"}</span>
                    <span className="text-sm font-light">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200/70"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <span className="bg-white px-3">O continúa con</span>
              </div>
            </div>

            {/* Google alternative */}
            <button
              type="button"
              onClick={() => {
                setName(selectedRole === "docente" ? "Prof. García" : "Alex Rivera");
                setEmail(selectedRole === "docente" ? "profesor@lasalleurubamba.edu.pe" : "estudiante@lasalleurubamba.edu.pe");
                setSuccessMsg("Simulación Google OAuth: cargado perfil correcto. Redirigiendo...");
                setTimeout(() => {
                  onLoginSuccess({
                    id: "google-oauth-user",
                    name: selectedRole === "docente" ? "Prof. García" : "Alex Rivera",
                    email: selectedRole === "docente" ? "profesor@lasalleurubamba.edu.pe" : "estudiante@lasalleurubamba.edu.pe",
                    role: selectedRole,
                    section: selectedRole === "estudiante" ? "3ero Secundaria" : undefined,
                    avatar: selectedRole === "docente" 
                      ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120"
                      : "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120"
                  });
                }, 800);
              }}
              className="w-full py-2.5 px-4 border border-slate-250 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.93 1 12 1 7.37 1 3.4 3.61 1.48 7.42l3.87 3C6.31 7.22 8.94 5.04 12 5.04z" />
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.51h6.46c-.29 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-2 3.71-4.94 3.71-8.61z" />
                <path fill="#FBBC05" d="M5.35 14.42c-.25-.74-.39-1.53-.39-2.35s.14-1.61.39-2.35l-3.87-3C.56 8.35 0 10.11 0 12s.56 3.65 1.48 5.28l3.87-3c0-.01 0-.01 0 0z" />
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.1.74-2.51 1.18-4.26 1.18-3.06 0-5.69-2.18-6.65-5.38L1.48 16c1.92 3.81 5.89 6.42 10.52 6.42z" />
              </svg>
              <span>{isLogin ? "Iniciar sesión con Google" : "Registrarse con Google"}</span>
            </button>
          </div>

          {/* Account Shift Link */}
          <div className="text-center mt-6">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="text-xs font-bold text-[#004AC6] hover:underline"
            >
              {isLogin 
                ? "¿No tienes cuenta? Regístrate gratis" 
                : "Ya tengo cuenta, Iniciar sesión"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
