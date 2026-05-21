'use client'

import { useState } from "react";

const STATUS_CONFIG = {
  Available: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
    border: "border-emerald-200 dark:border-emerald-800",
    slotBg: "#d1fae5",
    slotText: "#065f46",
    slotBorder: "#6ee7b7",
  },
  "Emergency Only": {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
    border: "border-amber-200 dark:border-amber-800",
    slotBg: "#fef3c7",
    slotText: "#92400e",
    slotBorder: "#fcd34d",
  },
  "Off-duty": {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-500 dark:text-gray-400",
    dot: "bg-gray-400",
    border: "border-gray-200 dark:border-gray-700",
    slotBg: "#f1f5f9",
    slotText: "#94a3b8",
    slotBorder: "#e2e8f0",
  },
};

const INITIAL_DATA = [
  {
    id: 1, day: "Monday", status: "Available",
    timeSlots: [
      { start: "09:00", end: "10:00" }, { start: "10:00", end: "11:00" },
      { start: "12:30", end: "13:30" }, { start: "15:00", end: "16:00" },
    ]
  },
  {
    id: 2, day: "Tuesday", status: "Available",
    timeSlots: [
      { start: "09:30", end: "10:30" }, { start: "11:00", end: "12:00" },
      { start: "13:30", end: "14:30" }, { start: "16:00", end: "17:00" },
    ]
  },
  {
    id: 3, day: "Wednesday", status: "Available",
    timeSlots: [
      { start: "08:30", end: "09:30" }, { start: "10:30", end: "11:30" },
      { start: "14:00", end: "15:00" }, { start: "17:00", end: "18:00" },
    ]
  },
  {
    id: 4, day: "Thursday", status: "Available",
    timeSlots: [
      { start: "09:00", end: "10:00" }, { start: "11:00", end: "12:00" },
      { start: "13:00", end: "14:00" }, { start: "15:30", end: "16:30" },
    ]
  },
  {
    id: 5, day: "Friday", status: "Off-duty",
    timeSlots: []
  },
  {
    id: 6, day: "Saturday", status: "Available",
    timeSlots: [
      { start: "10:00", end: "11:00" }, { start: "12:00", end: "13:00" },
      { start: "14:30", end: "15:30" },
    ]
  },
  {
    id: 7, day: "Sunday", status: "Available",
    timeSlots: [
      { start: "09:00", end: "10:00" }, { start: "11:30", end: "12:30" },
      { start: "14:00", end: "15:00" }, { start: "16:00", end: "17:00" },
    ]
  }
];

const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_SHORT = { Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu", Friday: "Fri", Saturday: "Sat", Sunday: "Sun" };

// Timeline: 8am–19:00 = 11 hours = 660 minutes
const TIMELINE_START = 8 * 60; // 480
const TIMELINE_END = 19 * 60;  // 1140
const TIMELINE_DURATION = TIMELINE_END - TIMELINE_START; // 660

function toMins(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function to12Hour(t) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

function pct(mins) {
  return ((mins - TIMELINE_START) / TIMELINE_DURATION) * 100;
}

const HOUR_MARKS = Array.from({ length: 12 }, (_, i) => {
  const h = 8 + i;
  return { label: h <= 12 ? `${h}am` : `${h - 12}pm`, pct: pct(h * 60) };
});

function StatusPill({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Off-duty"];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

function SlotTooltip({ slot, visible }) {
  if (!visible) return null;
  return (
    <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 bg-slate-900 text-white text-[10px] font-mono rounded-md px-2 py-1 whitespace-nowrap shadow-lg pointer-events-none">
      {to12Hour(slot.start)} – {to12Hour(slot.end)}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
    </div>
  );
}

function TimelineBar({ day }) {
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const cfg = STATUS_CONFIG[day.status] || STATUS_CONFIG["Off-duty"];

  if (day.status === "Off-duty" || day.timeSlots.length === 0) {
    return (
      <div className="relative h-8 rounded-lg overflow-hidden flex items-center px-3" style={{ background: "#f8fafc", border: "1.5px dashed #e2e8f0" }}>
        <span className="text-[11px] text-slate-400 italic font-medium tracking-wide">Off-duty</span>
      </div>
    );
  }

  return (
    <div className="relative h-8 rounded-lg overflow-visible" style={{ background: "#f1f5f9" }}>
      {day.timeSlots.map((slot, i) => {
        const startPct = pct(toMins(slot.start));
        const endPct = pct(toMins(slot.end));
        const widthPct = endPct - startPct;
        const isHovered = hoveredSlot === i;
        return (
          <div
            key={i}
            onMouseEnter={() => setHoveredSlot(i)}
            onMouseLeave={() => setHoveredSlot(null)}
            className="absolute top-0 h-full rounded-md cursor-pointer transition-all duration-150"
            style={{
              left: `${startPct}%`,
              width: `${widthPct}%`,
              background: isHovered ? cfg.slotBorder : cfg.slotBg,
              border: `1.5px solid ${cfg.slotBorder}`,
              zIndex: isHovered ? 20 : 10,
              transform: isHovered ? "scaleY(1.15)" : "scaleY(1)",
              transformOrigin: "center",
            }}
          >
            <SlotTooltip slot={slot} visible={isHovered} />
          </div>
        );
      })}
    </div>
  );
}

export default function AvailabilitySchedule() {
  const [rows, setRows] = useState(INITIAL_DATA);
  const [view, setView] = useState("list"); // "timeline" | "list"
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState({ day: "", status: "Available", timeSlots: [{ start: "09:00", end: "10:00" }] });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const usedDays = rows.map((r) => r.day);
  const availableDays = ALL_DAYS.filter((d) => !usedDays.includes(d));

  // Sort rows by day order
  const sortedRows = [...rows].sort((a, b) => ALL_DAYS.indexOf(a.day) - ALL_DAYS.indexOf(b.day));

  const startEdit = (row) => { setEditingId(row.id); setEditDraft(JSON.parse(JSON.stringify(row))); };
  const cancelEdit = () => { setEditingId(null); setEditDraft(null); };
  const saveEdit = () => {
    setRows(rows.map((r) => r.id === editingId ? { ...editDraft } : r));
    setEditingId(null); setEditDraft(null);
  };

  const confirmDelete = (id) => setDeleteConfirmId(id);
  const cancelDelete = () => setDeleteConfirmId(null);
  const doDelete = () => { setRows(rows.filter((r) => r.id !== deleteConfirmId)); setDeleteConfirmId(null); };

  const openAdd = () => {
    const first = availableDays[0] || "";
    setNewEntry({ day: first, status: "Available", timeSlots: [{ start: "09:00", end: "10:00" }] });
    setShowAddModal(true);
  };
  const saveAdd = () => {
    if (!newEntry.day) return;
    setRows([...rows, { ...newEntry, id: Date.now() }]);
    setShowAddModal(false);
  };

  const totalSlots = rows.reduce((acc, r) => acc + r.timeSlots.length, 0);
  const availableDaysCount = rows.filter(r => r.status === "Available").length;

  return (
    <div className="lg:col-span-2 space-y-5">
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.97); } to { opacity:1; transform:scale(1); } }
        .slide-up { animation: slideUp 0.25s ease forwards; }
        .scale-in { animation: scaleIn 0.2s ease; }
        .row-enter { animation: slideUp 0.2s ease; }
      `}</style>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Weekly Schedule
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">
            <span className="text-slate-600 dark:text-slate-300 font-bold">{availableDaysCount}</span> active days ·{" "}
            <span className="text-slate-600 dark:text-slate-300 font-bold">{totalSlots}</span> time slots
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 gap-0.5">
            {[["timeline", "Timeline"], ["list", "List"]].map(([v, label]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${view === v ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TIMELINE VIEW */}
      {view === "timeline" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden slide-up">
          {/* Hour ruler */}
          <div className="relative border-b border-slate-100 dark:border-slate-800 h-7 ml-24 mr-4">
            {HOUR_MARKS.filter((_, i) => i % 2 === 0).map((mark) => (
              <div
                key={mark.label}
                className="absolute top-0 h-full flex flex-col items-center"
                style={{ left: `${mark.pct}%` }}
              >
                <div className="w-px h-2 bg-slate-200 dark:bg-slate-700 mt-1" />
                <span className="mono text-[9px] text-slate-400 font-medium mt-0.5">{mark.label}</span>
              </div>
            ))}
          </div>

          {/* Day rows */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {sortedRows.map((row, idx) => {
              const isWeekend = row.day === "Saturday" || row.day === "Sunday";
              return (
                <div
                  key={row.id}
                  className={`flex items-center gap-3 px-4 py-3 group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30 ${isWeekend ? "bg-slate-50/40 dark:bg-slate-800/10" : ""}`}
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  {/* Day label */}
                  <div className="w-20 shrink-0">
                    <div className={`text-sm font-extrabold tracking-tight ${row.status === "Off-duty" ? "text-slate-400" : "text-slate-800 dark:text-slate-100"}`}>
                      {DAY_SHORT[row.day]}
                    </div>
                    <div className="mt-0.5">
                      <StatusPill status={row.status} />
                    </div>
                  </div>

                  {/* Bar */}
                  <div className="flex-1">
                    <TimelineBar day={row} />
                  </div>

                  {/* Slot count */}
                  <div className="w-8 text-center shrink-0">
                    {row.timeSlots.length > 0 ? (
                      <span className="mono text-xs font-bold text-slate-400">{row.timeSlots.length}</span>
                    ) : (
                      <span className="mono text-xs text-slate-300">—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-5">
            {Object.entries(STATUS_CONFIG).map(([label, cfg]) => {
              const count = rows.filter(r => r.status === label).length;
              return (
                <span key={label} className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                  <span className={`w-2 h-2 rounded-sm ${cfg.dot}`} />
                  {count}× {label}
                </span>
              );
            })}
            <span className="ml-auto text-[10px] mono text-slate-300">hover slots for times</span>
          </div>
        </div>
      )}

      {/* LIST VIEW */}
      {view === "list" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden slide-up">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                {["Day", "Status", "Time Slots", "Actions"].map((h, i) => (
                  <th key={h} className={`px-5 py-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ${i === 3 ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedRows.map((row) => {
                const isEditing = editingId === row.id;
                const draft = isEditing ? editDraft : row;
                return (
                  <tr key={row.id} className={`group transition-colors ${isEditing ? "bg-blue-50/40 dark:bg-blue-950/20" : "hover:bg-slate-50/60 dark:hover:bg-slate-800/30"}`}>
                    {/* Day */}
                    <td className="px-5 py-3.5">
                      <span className={`font-extrabold text-sm tracking-tight ${row.status === "Off-duty" ? "text-slate-400" : "text-slate-800 dark:text-slate-100"}`}>
                        {row.day}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      {isEditing ? (
                        <select
                          value={draft.status}
                          onChange={(e) => setEditDraft({ ...draft, status: e.target.value, timeSlots: e.target.value === "Off-duty" ? [] : draft.timeSlots })}
                          className="text-xs font-bold border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <StatusPill status={row.status} />
                      )}
                    </td>

                    {/* Time Slots */}
                    <td className="px-5 py-3.5">
                      {isEditing && draft.status !== "Off-duty" ? (
                        <div className="space-y-1.5">
                          {draft.timeSlots.map((slot, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <input type="time" value={slot.start}
                                onChange={(e) => {
                                  const slots = [...draft.timeSlots];
                                  slots[i] = { ...slots[i], start: e.target.value };
                                  setEditDraft({ ...draft, timeSlots: slots });
                                }}
                                className="mono text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400" />
                              <span className="text-slate-400 text-xs">–</span>
                              <input type="time" value={slot.end}
                                onChange={(e) => {
                                  const slots = [...draft.timeSlots];
                                  slots[i] = { ...slots[i], end: e.target.value };
                                  setEditDraft({ ...draft, timeSlots: slots });
                                }}
                                className="mono text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400" />
                              <button onClick={() => setEditDraft({ ...draft, timeSlots: draft.timeSlots.filter((_, j) => j !== i) })}
                                className="text-slate-400 hover:text-red-500 transition-colors p-0.5 rounded">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => setEditDraft({ ...draft, timeSlots: [...draft.timeSlots, { start: "09:00", end: "10:00" }] })}
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-1"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                            Add slot
                          </button>
                        </div>
                      ) : row.timeSlots.length === 0 ? (
                        <span className="text-xs italic text-slate-400">No slots</span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {row.timeSlots.map((slot, i) => (
                            <span key={i} className="mono inline-flex items-center text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-md px-2 py-0.5">
                              {to12Hour(slot.start)}–{to12Hour(slot.end)}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {deleteConfirmId === row.id ? (
                          <>
                            <span className="text-xs text-red-500 font-bold mr-1">Delete?</span>
                            <button onClick={doDelete} className="text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-2.5 py-1.5 rounded-md transition-colors">Yes</button>
                            <button onClick={cancelDelete} className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-md transition-colors">No</button>
                          </>
                        ) : isEditing ? (
                          <>
                            <button onClick={saveEdit} className="inline-flex items-center gap-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md transition-colors">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                              Save
                            </button>
                            <button onClick={cancelEdit} className="text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md transition-colors">Cancel</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(row)} title="Edit"
                              className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors opacity-0 group-hover:opacity-100">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-2.828 1.172H7v-2a4 4 0 011.172-2.828z" />
                              </svg>
                            </button>
                            <button onClick={() => confirmDelete(row.id)} title="Delete"
                              className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {/* {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="scale-in bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-sm">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">Add Day</h2>
                <p className="text-xs text-slate-400 mt-0.5">Set availability for a new day</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Day</label>
                <select value={newEntry.day} onChange={(e) => setNewEntry({ ...newEntry, day: e.target.value })}
                  className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400">
                  {availableDays.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Status</label>
                <select value={newEntry.status}
                  onChange={(e) => setNewEntry({ ...newEntry, status: e.target.value, timeSlots: e.target.value === "Off-duty" ? [] : newEntry.timeSlots })}
                  className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400">
                  {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {newEntry.status !== "Off-duty" && (
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Time Slots</label>
                  <div className="space-y-1.5">
                    {newEntry.timeSlots.map((slot, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <input type="time" value={slot.start}
                          onChange={(e) => { const s = [...newEntry.timeSlots]; s[i] = { ...s[i], start: e.target.value }; setNewEntry({ ...newEntry, timeSlots: s }); }}
                          className="mono flex-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        <span className="text-slate-300 text-xs">–</span>
                        <input type="time" value={slot.end}
                          onChange={(e) => { const s = [...newEntry.timeSlots]; s[i] = { ...s[i], end: e.target.value }; setNewEntry({ ...newEntry, timeSlots: s }); }}
                          className="mono flex-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        {newEntry.timeSlots.length > 1 && (
                          <button onClick={() => setNewEntry({ ...newEntry, timeSlots: newEntry.timeSlots.filter((_, j) => j !== i) })}
                            className="text-slate-400 hover:text-red-500 p-0.5 rounded transition-colors">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    <button onClick={() => setNewEntry({ ...newEntry, timeSlots: [...newEntry.timeSlots, { start: "09:00", end: "10:00" }] })}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-1 transition-colors">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                      Add another slot
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button onClick={() => setShowAddModal(false)} className="text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300 px-4 py-2 rounded-lg transition-colors">Cancel</button>
              <button onClick={saveAdd} className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors shadow-sm">Add Entry</button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}