/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Terminal, ChevronDown, ChevronUp, RefreshCw, Layers, ShieldCheck, Database } from "lucide-react";
import { ApiLog, getApiLogs, registerLogCallback, LARAVEL_API_BASE } from "../mockData";

export default function LaravelTerminal() {
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeLogId, setActiveLogId] = useState<string | null>(null);

  useEffect(() => {
    // Initial logs load
    setLogs(getApiLogs());

    // Listen to new logs
    registerLogCallback((newLog) => {
      setLogs((prev) => [newLog, ...prev].slice(0, 30));
      // Auto expand to show activity
      setIsOpen(true);
      setActiveLogId(newLog.id);
    });
  }, []);

  const clearLogs = () => {
    setLogs([]);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (status >= 400) return "text-rose-400 border-rose-500/30 bg-rose-500/10";
    return "text-amber-400 border-amber-500/30 bg-amber-500/10";
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "bg-sky-500/20 text-sky-300 border-sky-500/30";
      case "POST": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "PUT": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "DELETE": return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      default: return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950 border-t border-slate-800 font-mono text-xs text-slate-300 transition-all duration-300 shadow-2xl">
      {/* Control bar */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 cursor-pointer select-none hover:bg-slate-850"
      >
        <div className="flex items-center gap-2">
          <Terminal size={15} className="text-amber-400 animate-pulse" />
          <span className="font-bold text-slate-200">Consola de Integración Laravel API Decoupled</span>
          <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] bg-slate-950 text-slate-400 border border-slate-800">
            <Layers size={10} className="text-orange-400" /> API: {LARAVEL_API_BASE}
          </span>
          {logs.length > 0 && (
            <span className="bg-orange-500 text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full">
              {logs.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={clearLogs}
            className="text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-slate-800 text-[10px] flex items-center gap-1 transition-colors"
            title="Limpiar Consola"
          >
            <RefreshCw size={11} /> Limpiar
          </button>
          <div className="text-slate-500 border-l border-slate-800 pl-3 flex items-center gap-1 text-[11px]">
            <Database size={11} className="text-red-400" /> MySQL
            <span className="text-slate-600">|</span>
            <ShieldCheck size={11} className="text-emerald-400" /> Sanction Token Active
          </div>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
          >
            {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
      </div>

      {/* Logs section */}
      {isOpen && (
        <div className="h-64 overflow-y-auto p-4 flex flex-col gap-2 bg-slate-950/95 backdrop-blur-sm max-h-[40vh]">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 py-6">
              <Database size={24} className="mb-2 text-slate-600 opacity-55" />
              <p className="font-semibold text-slate-400">Sin peticiones HTTP activas.</p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-md text-center">
                Interactúa con la interfaz (inicia sesión, crea lecciones, responde cuestionarios, o filtra estudiantes) para ver las peticiones REST fetch simuladas que se conectarían con tu backend en Laravel de producción.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="text-[11px] text-slate-500 border-b border-slate-900 pb-2 flex justify-between items-center">
                <span>Historial de transacciones de Laravel API</span>
                <span>Haz clic en un log para ver el inspect de payload / response</span>
              </div>
              {logs.map((log) => {
                const isActive = activeLogId === log.id;
                return (
                  <div 
                    key={log.id} 
                    className={`rounded overflow-hidden border transition-all ${
                      isActive ? "bg-slate-900 border-orange-500/40 shadow" : "bg-slate-900/40 border-slate-900 hover:border-slate-800"
                    }`}
                  >
                    <div 
                      onClick={() => setActiveLogId(isActive ? null : log.id)}
                      className="p-2 flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getMethodColor(log.method)}`}>
                          {log.method}
                        </span>
                        <span className="text-slate-200 font-semibold break-all text-[11px]">
                          {log.endpoint}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusColor(log.status)}`}>
                          {log.status === 201 ? "201 Created" : log.status === 200 ? "200 OK" : log.status}
                        </span>
                        <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                      </div>
                    </div>

                    {isActive && (
                      <div className="p-3 bg-slate-950 border-t border-slate-900 text-[11px] grid grid-cols-1 md:grid-cols-2 gap-4">
                        {log.payload ? (
                          <div>
                            <p className="text-orange-400 font-bold mb-1 border-b border-slate-900 pb-0.5">📥 Cuerpo de Envío (JSON Payload):</p>
                            <pre className="p-2 rounded bg-slate-900 overflow-x-auto text-[10px] text-teal-300 max-h-40">{log.payload}</pre>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sky-400 font-bold mb-1 border-b border-slate-900 pb-0.5">📥 Parámetros de Consulta (Query):</p>
                            <pre className="p-2 rounded bg-slate-900 text-slate-400 text-[10px] italic">Ninguno (Parámetros vacíos o ruta simple GET)</pre>
                          </div>
                        )}
                        <div>
                          <p className="text-emerald-400 font-bold mb-1 border-b border-slate-900 pb-0.5">📤 Respuesta Simulada del Servidor Laravel:</p>
                          <pre className="p-2 rounded bg-slate-900 overflow-x-auto text-[10px] text-emerald-300 max-h-40">{log.response}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
