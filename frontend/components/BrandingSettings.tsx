/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Palette, UploadCloud, Calendar, Bell, Shield, Download, RefreshCw, 
  Trash2, Plus, Check, CheckCircle2, FileJson, GraduationCap 
} from "lucide-react";
import { addApiLog } from "../mockData";

export default function BrandingSettings() {
  // Brand color palette states
  const [primaryColor, setPrimaryColor] = useState("#004AC6");
  const [secondaryColor, setSecondaryColor] = useState("#046A38");
  const [brandLogo, setBrandLogo] = useState<string | null>(
    "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=120"
  );
  
  // States for form interaction
  const [brandSaved, setBrandSaved] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);

  // Semesters / Academic periods states
  const [periods, setPeriods] = useState([
    { id: "p-1", name: "Primer Trimestre 2026", status: "activo", dates: "Mar 01 - May 30" },
    { id: "p-2", name: "Segundo Trimestre 2026", status: "planificado", dates: "Jun 01 - Ago 31" },
    { id: "p-3", name: "Tercer Trimestre 2026", status: "inactivo", dates: "Sep 01 - Nov 30" }
  ]);
  const [showAddPeriod, setShowAddPeriod] = useState(false);
  const [newPeriodName, setNewPeriodName] = useState("");
  const [newPeriodDates, setNewPeriodDates] = useState("Sep 01 - Nov 30");

  // Notifications systems states
  const [notifAlerts, setNotifAlerts] = useState(true);
  const [notifReminders, setNotifReminders] = useState(true);
  const [notifTasks, setNotifTasks] = useState(false);
  const [notifEmails, setNotifEmails] = useState(true);

  // Backup state
  const [backupSyncing, setBackupSyncing] = useState(false);
  const [lastBackup, setLastBackup] = useState("Hoy, hace 4 horas");

  // Save branding change handler
  const saveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log to simulated API
    addApiLog("POST", "/settings/branding", {
      primaryColor,
      secondaryColor,
      logoUrl: brandLogo
    }, {
      status: "applied",
      updated_at: new Date().toISOString()
    }, 200);

    setBrandSaved(true);
    setTimeout(() => setBrandSaved(false), 3000);
  };

  // Upload logo wrapper
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoUploading(true);
      const reader = new FileReader();
      reader.onload = () => {
        setBrandLogo(reader.result as string);
        setLogoUploading(false);
        addApiLog("POST", "/settings/branding/upload-logo", { filename: "colegio_logo.png" }, { status: "uploaded", url: "data:image/png;..." }, 201);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Add academic semester handler
  const handleAddPeriod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPeriodName.trim()) return;

    const newPeriod = {
      id: `p-${Date.now()}`,
      name: newPeriodName,
      status: "inactivo",
      dates: newPeriodDates
    };

    // Log period creation
    addApiLog("POST", "/settings/periods", newPeriod, { status: "created", list_count: periods.length + 1 }, 201);

    setPeriods([...periods, newPeriod]);
    setNewPeriodName("");
    setShowAddPeriod(false);
  };

  // Sync Database
  const triggerSyncDatabase = async () => {
    setBackupSyncing(true);
    
    addApiLog("POST", "/settings/backup/sync", { force: true }, {
      tables_synced: ["users", "lessons", "exams", "enrollments", "evaluations"],
      records_count: 1459,
      duration_ms: 680
    }, 200);

    await new Promise((resolve) => setTimeout(resolve, 1200));
    setBackupSyncing(false);
    setLastBackup("Ahora mismo");
  };

  // Download DB snapshot
  const triggerDownloadBackup = () => {
    addApiLog("GET", "/settings/backup/download", {}, {
      filename: `backup_snap_${Date.now()}.json`,
      size_bytes: 4850212
    }, 200);

    const backupData = {
      app: "MathFlow",
      version: "3.2.0-stable",
      timestamp: new Date().toISOString(),
      branding: { primaryColor, secondaryColor, logo: brandLogo },
      sections_count: 5,
      active_periods: periods
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mathflow_laravel_copia_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Banner Title Configuración Institucional */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <h1 className="text-xl font-black text-slate-800 tracking-tight">Configuración Institucional</h1>
        <p className="text-xs text-slate-500 mt-1">Gestión general de marca didáctica, periodos escolares semestrales y copias de seguridad de la base de datos de Laravel.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COMPONENT: BRAND MANAGEMENT (SCREEN 3) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 lg:col-span-2">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Palette size={16} className="text-blue-600" />
            Gestión de Marca e Identidad
          </h2>

          <form onSubmit={saveBranding} className="space-y-5">
            
            {/* Logo simulation upload area */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Logo Institucional (Colegio)</label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                {/* Logo Preview */}
                <div className="border border-slate-200/60 p-4 rounded-xl bg-slate-50 flex items-center justify-center gap-4 relative">
                  {brandLogo ? (
                    <img 
                      src={brandLogo} 
                      alt="Logo Brand Temp" 
                      className="w-16 h-16 rounded-xl border object-cover bg-white shrink-0" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl border border-dashed text-slate-400 text-xs flex items-center justify-center">Sin Logo</div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate">colegio_logo.png</p>
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5 uppercase">Resolución: 512x512</p>
                    {brandLogo && (
                      <button 
                        type="button" 
                        onClick={() => setBrandLogo(null)}
                        className="text-[10px] text-rose-600 hover:underline font-bold mt-1 block text-left"
                      >
                        Eliminar archivo
                      </button>
                    )}
                  </div>
                </div>

                {/* Upload drag drop zone */}
                <div className="relative border-2 border-dashed border-slate-250 bg-slate-50/50 hover:bg-slate-50 hover:border-blue-500 rounded-xl p-4 transition-all text-center flex flex-col items-center justify-center cursor-pointer min-h-[102px]">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <UploadCloud size={24} className="text-slate-400 mb-1" />
                  <p className="text-xs font-bold text-slate-700">
                    {logoUploading ? "Subiendo..." : "Selecciona o Arrastra logo"}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-0.5">Formatos soportados: PNG, JPG (Máx. 1.2MB)</p>
                </div>
              </div>
            </div>

            {/* Colors selectors swatches */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Color Primario (Header / Botones)</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 border border-slate-200 rounded-xl cursor-pointer p-0 bg-transparent shrink-0" 
                  />
                  <input 
                    type="text" 
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-grow px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-750 font-bold" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Color Secundario (Banners / Tags)</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-10 h-10 border border-slate-200 rounded-xl cursor-pointer p-0 bg-transparent shrink-0" 
                  />
                  <input 
                    type="text" 
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-grow px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-755 font-bold" 
                  />
                </div>
              </div>

            </div>

            {/* Fast preset palette swatch suggestions */}
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-2">Templos de color rápidos:</span>
              <div className="flex gap-2.5">
                {[
                  { pri: "#004AC6", sec: "#046A38", name: "La Salle Corporativo" },
                  { pri: "#1e1b4b", sec: "#4338ca", name: "Indi Cosmic" },
                  { pri: "#0f172a", sec: "#0d9488", name: "Modern Dark Teal" },
                  { pri: "#701a75", sec: "#ec4899", name: "Royal Pink" }
                ].map((preset, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setPrimaryColor(preset.pri);
                      setSecondaryColor(preset.sec);
                    }}
                    className="p-1 px-2.5 bg-slate-50 hover:bg-slate-100 border rounded-lg text-[10px] font-bold text-slate-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="flex gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: preset.pri }}></span>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: preset.sec }}></span>
                    </span>
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              {brandSaved ? (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-150 px-3 py-1.5 rounded-lg flex items-center gap-1">
                  <CheckCircle2 size={13} /> ¡Marca guardada e implementada!
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 italic">Los cambios se aplican inmediatamente en tu sesión activa.</span>
              )}
              
              <button
                type="submit"
                className="bg-slate-900 border border-slate-920 text-white font-black text-xs px-4.5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow shadow-slate-900/10 cursor-pointer"
              >
                Guardar Configuración de Marca
              </button>
            </div>

          </form>
        </div>

        {/* RIGHT PANEL 1: BACKUPS SECTION */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Shield size={16} className="text-indigo-600" />
            Copias de Seguridad
          </h2>

          <div className="p-3.5 bg-slate-50 border border-slate-205 rounded-xl space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-600">
              <span>Estado Sincronizado:</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Activa
              </span>
            </div>
            <div className="flex justify-between text-xs font-medium text-slate-600">
              <span>Última Sincronización:</span>
              <span className="font-mono text-[11px] font-bold text-slate-700">{lastBackup}</span>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            <p className="text-[10px] text-slate-500 leading-normal">
              Descarga snapshots completos o fuerza sincronización con la API persistente de Laravel Sanctum local.
            </p>

            <button
              onClick={triggerDownloadBackup}
              className="w-full flex items-center justify-center gap-2 py-2 px-3.5 bg-blue-50 hover:bg-blue-100 text-[#004AC6] text-xs font-bold rounded-xl transition-colors cursor-pointer border border-blue-100"
            >
              <Download size={15} />
              Descargar Snapshot de Base de Datos
            </button>

            <button
              onClick={triggerSyncDatabase}
              disabled={backupSyncing}
              className="w-full flex items-center justify-center gap-2 py-2 px-3.5 border border-slate-250 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={backupSyncing ? "animate-spin" : ""} />
              {backupSyncing ? "Sincronizando..." : "Sincronizar ahora"}
            </button>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* BOTTOM PANEL 1: PERIODOS ACADEMICOS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Calendar size={16} className="text-indigo-600" />
              Periodos Académicos
            </h2>
            <button
              onClick={() => setShowAddPeriod(!showAddPeriod)}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus size={13} /> Nuevo Periodo
            </button>
          </div>

          {showAddPeriod && (
            <form onSubmit={handleAddPeriod} className="p-3 bg-slate-50 border border-slate-250 rounded-xl space-y-3.5 animate-fadeIn">
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Añadir Módulo Escolar:</span>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newPeriodName}
                  onChange={(e) => setNewPeriodName(e.target.value)}
                  placeholder="Ej. Cuarto Trimestre 2026"
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-850" 
                  required
                />
                <input 
                  type="text" 
                  value={newPeriodDates}
                  onChange={(e) => setNewPeriodDates(e.target.value)}
                  placeholder="Dic 01 - Dic 23"
                  className="w-32 px-3 py-2 bg-white border border-slate-205 rounded-xl text-xs font-mono text-slate-600" 
                />
              </div>
              <div className="flex justify-end gap-2 text-xs font-bold">
                <button type="button" onClick={() => setShowAddPeriod(false)} className="px-3 py-1 bg-slate-200 rounded-lg text-slate-600">Cancelar</button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white rounded-lg">Confirmar</button>
              </div>
            </form>
          )}

          <div className="space-y-2.5 pt-1">
            {periods.map(per => {
              const statusColor = 
                per.status === "activo" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                per.status === "planificado" ? "bg-amber-50 text-amber-700 border-amber-100" :
                "bg-slate-50 text-slate-400 border-slate-200";

              return (
                <div key={per.id} className="p-3 border border-slate-100 hover:bg-slate-50/50 rounded-xl flex items-center justify-between gap-3 font-medium text-slate-700 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-tight">{per.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{per.dates}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase border ${statusColor}`}>
                      {per.status}
                    </span>
                    {per.id !== "p-1" && (
                      <button 
                        onClick={() => setPeriods(periods.filter(p => p.id !== per.id))}
                        className="text-slate-350 hover:text-rose-600 p-1"
                        title="Eliminar periodo"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM PANEL 2: NOTIFICACIONES GLOBALES */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell size={16} className="text-blue-600" />
            Notificaciones Globales
          </h2>

          <p className="text-[10px] text-slate-500 leading-normal">
            Gestiona la activación de alertas y recordatorios asíncronos distribuidos mediante el despachador de Laravel Mailer.
          </p>

          <div className="space-y-3.5 pt-2 select-none">
            
            <label className="flex items-center justify-between gap-3 cursor-pointer p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
              <div>
                <span className="text-xs font-extrabold text-slate-700 block leading-tight">Alertar bajas calificaciones</span>
                <span className="text-[9px] text-slate-400">Coordinado por e-mail a los apoderados</span>
              </div>
              <input 
                type="checkbox" 
                checked={notifAlerts}
                onChange={() => setNotifAlerts(!notifAlerts)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
              />
            </label>

            <label className="flex items-center justify-between gap-3 cursor-pointer p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
              <div>
                <span className="text-xs font-extrabold text-slate-700 block leading-tight">Recordatorios antes de exámenes</span>
                <span className="text-[9px] text-slate-400">3 horas previas al inicio de la evaluación</span>
              </div>
              <input 
                type="checkbox" 
                checked={notifReminders}
                onChange={() => setNotifReminders(!notifReminders)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
              />
            </label>

            <label className="flex items-center justify-between gap-3 cursor-pointer p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
              <div>
                <span className="text-xs font-extrabold text-slate-700 block leading-tight">Alertar entrega de tareas docente</span>
                <span className="text-[9px] text-slate-400">Notificar al profesor cuando los alumnos cargan material</span>
              </div>
              <input 
                type="checkbox" 
                checked={notifTasks}
                onChange={() => setNotifTasks(!notifTasks)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
              />
            </label>

            <label className="flex items-center justify-between gap-3 cursor-pointer p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
              <div>
                <span className="text-xs font-extrabold text-slate-700 block leading-tight">Anuncios vía Boletines</span>
                <span className="text-[9px] text-slate-400">Entrega de estadísticas mensuales</span>
              </div>
              <input 
                type="checkbox" 
                checked={notifEmails}
                onChange={() => setNotifEmails(!notifEmails)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
              />
            </label>

          </div>
        </div>

      </div>

    </div>
  );
}
