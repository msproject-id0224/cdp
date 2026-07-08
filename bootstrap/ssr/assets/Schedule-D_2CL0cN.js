import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BG6RGD2S.js";
import { Head } from "@inertiajs/react";
import { _ as __ } from "./lang-COBcTD8W.js";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "./ThemeToggle-BY9dagkZ.js";
import "./TextInput-D0qTZeQv.js";
import "axios";
import "./ProfilePhoto-CJ2Z04pO.js";
import "./Modal-CKHW52Ki.js";
import "./SecondaryButton-TjIrbn1G.js";
import "./PrimaryButton-BNNL2gCI.js";
import "./DangerButton-B7to2Tbx.js";
import "./Footer-B7ihPSZ8.js";
import "./useTheme-CngFDcs1.js";
const STATUS_STYLES = {
  scheduled: { bg: "bg-blue-500", text: "text-white", badge: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  pending: { bg: "bg-yellow-400", text: "text-gray-900", badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" },
  rejected: { bg: "bg-red-500", text: "text-white", badge: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
  modification_requested: { bg: "bg-orange-400", text: "text-white", badge: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300" }
};
function statusStyle(status) {
  return STATUS_STYLES[status] || STATUS_STYLES.pending;
}
function statusLabel(status) {
  const labels = {
    scheduled: __("Scheduled"),
    pending: __("Pending"),
    rejected: __("Rejected"),
    modification_requested: __("Modification Requested")
  };
  return labels[status] || status;
}
function formatTime(dt) {
  if (!dt) return "";
  return new Date(dt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function formatFullDate(dt) {
  if (!dt) return "-";
  return new Date(dt).toLocaleDateString([], { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
const PRIORITY_STYLES = {
  high: { bg: "bg-red-500", badge: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
  medium: { bg: "bg-blue-500", badge: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  low: { bg: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" }
};
function priorityStyle(priority) {
  return PRIORITY_STYLES[priority] || PRIORITY_STYLES.medium;
}
function Schedule({ auth, meetings = [], adminSchedules = [] }) {
  const today = /* @__PURE__ */ new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const startPad = firstDay.getDay();
  const totalCells = Math.ceil((startPad + lastDay.getDate()) / 7) * 7;
  const monthName = firstDay.toLocaleDateString([], { month: "long", year: "numeric" });
  const dayNames = [__("Sun"), __("Mon"), __("Tue"), __("Wed"), __("Thu"), __("Fri"), __("Sat")];
  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
  }
  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
  }
  function goToday() {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  }
  function meetingsForDate(date) {
    return meetings.filter((m) => {
      if (!m.scheduled_at) return false;
      return sameDay(new Date(m.scheduled_at), date);
    });
  }
  function adminSchedulesForDate(date) {
    return adminSchedules.filter((s) => {
      if (!s.date) return false;
      return sameDay(/* @__PURE__ */ new Date(s.date + "T00:00:00"), date);
    });
  }
  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - startPad + 1;
    if (dayNum < 1 || dayNum > lastDay.getDate()) return null;
    const date = new Date(currentYear, currentMonth, dayNum);
    return { date, dayNum, events: meetingsForDate(date), adminEvents: adminSchedulesForDate(date) };
  });
  const mentorName = (m) => {
    if (!m.mentor) return "-";
    return [m.mentor.first_name, m.mentor.last_name].filter(Boolean).join(" ");
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      user: auth.user,
      header: /* @__PURE__ */ jsx("h2", { className: "font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight", children: __("My Schedule") }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("My Schedule") }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto sm:px-6 lg:px-8 space-y-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3 text-xs", children: Object.entries(STATUS_STYLES).map(([key, s]) => /* @__PURE__ */ jsxs("span", { className: `flex items-center gap-1.5 px-2 py-1 rounded-full ${s.badge}`, children: [
            /* @__PURE__ */ jsx("span", { className: `w-2 h-2 rounded-full ${s.bg}` }),
            statusLabel(key)
          ] }, key)) }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 shadow-sm sm:rounded-xl overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: prevMonth,
                    className: "p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition",
                    "aria-label": __("Previous month"),
                    children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-gray-600 dark:text-gray-300", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) })
                  }
                ),
                /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold text-gray-900 dark:text-gray-100 capitalize min-w-[180px] text-center", children: monthName }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: nextMonth,
                    className: "p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition",
                    "aria-label": __("Next month"),
                    children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-gray-600 dark:text-gray-300", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: goToday,
                  className: "text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition",
                  children: __("Today")
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 border-b border-gray-100 dark:border-gray-700", children: dayNames.map((d) => /* @__PURE__ */ jsx("div", { className: "py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide", children: d }, d)) }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 divide-x divide-y divide-gray-100 dark:divide-gray-700", children: cells.map((cell, idx) => {
              if (!cell) {
                return /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "min-h-[42px] sm:min-h-[90px] bg-gray-50 dark:bg-gray-900/30"
                  },
                  `empty-${idx}`
                );
              }
              const isToday = sameDay(cell.date, today);
              const isWeekend = cell.date.getDay() === 0 || cell.date.getDay() === 6;
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `min-h-[42px] sm:min-h-[90px] p-1 sm:p-1.5 flex flex-col gap-0.5 sm:gap-1 ${isWeekend ? "bg-gray-50/60 dark:bg-gray-900/20" : ""}`,
                  children: [
                    /* @__PURE__ */ jsx("span", { className: `text-[10px] sm:text-xs font-medium w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full self-end ${isToday ? "bg-indigo-600 text-white" : "text-gray-700 dark:text-gray-300"}`, children: cell.dayNum }),
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-0.5 sm:hidden", children: [
                      cell.events.map((event) => {
                        const s = statusStyle(event.status);
                        return /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: () => setSelected(event),
                            className: `w-1.5 h-1.5 rounded-full ${s.bg} hover:opacity-80`,
                            title: event.agenda || mentorName(event)
                          },
                          event.id
                        );
                      }),
                      cell.adminEvents.map((s) => {
                        const ps = priorityStyle(s.priority);
                        return /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: () => setSelectedAdmin(s),
                            className: `w-1.5 h-1.5 rounded-full ${ps.bg} hover:opacity-80`,
                            title: s.name
                          },
                          `admin-${s.id}`
                        );
                      })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex sm:flex-col sm:gap-1", children: [
                      cell.events.map((event) => {
                        const s = statusStyle(event.status);
                        return /* @__PURE__ */ jsxs(
                          "button",
                          {
                            onClick: () => setSelected(event),
                            className: `w-full text-left text-[10px] leading-tight px-1.5 py-1 rounded ${s.bg} ${s.text} font-medium truncate hover:opacity-80 transition`,
                            title: event.agenda || mentorName(event),
                            children: [
                              formatTime(event.scheduled_at),
                              " ",
                              mentorName(event)
                            ]
                          },
                          event.id
                        );
                      }),
                      cell.adminEvents.map((s) => {
                        const ps = priorityStyle(s.priority);
                        return /* @__PURE__ */ jsxs(
                          "button",
                          {
                            onClick: () => setSelectedAdmin(s),
                            className: `w-full text-left text-[10px] leading-tight px-1.5 py-1 rounded ${ps.bg} text-white font-medium truncate hover:opacity-80 transition`,
                            title: s.name,
                            children: [
                              s.start_time ? s.start_time.substring(0, 5) + " " : "",
                              s.name
                            ]
                          },
                          `admin-${s.id}`
                        );
                      })
                    ] })
                  ]
                },
                cell.dayNum
              );
            }) })
          ] }),
          adminSchedules.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 shadow-sm sm:rounded-xl p-5", children: [
            /* @__PURE__ */ jsxs("h4", { className: "text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4", children: [
              __("Program Activities"),
              /* @__PURE__ */ jsxs("span", { className: "ml-2 text-xs font-normal text-gray-400", children: [
                "(",
                adminSchedules.length,
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-2", children: [...adminSchedules].sort((a, b) => new Date(a.date) - new Date(b.date)).map((s) => {
              const ps = priorityStyle(s.priority);
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setSelectedAdmin(s),
                  className: "w-full text-left flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: `w-1 self-stretch rounded-full shrink-0 ${ps.bg}` }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-800 dark:text-gray-100", children: s.name }),
                        /* @__PURE__ */ jsx("span", { className: `text-[10px] px-2 py-0.5 rounded-full font-medium ${ps.badge}`, children: s.priority })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "mt-0.5 text-xs text-gray-500 dark:text-gray-400", children: [
                        (/* @__PURE__ */ new Date(s.date + "T00:00:00")).toLocaleDateString([], { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
                        s.start_time && ` · ${s.start_time.substring(0, 5)}`,
                        s.end_time && `–${s.end_time.substring(0, 5)}`,
                        s.location && ` · ${s.location}`
                      ] }),
                      s.description && /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs text-gray-600 dark:text-gray-300 truncate", children: s.description })
                    ] })
                  ]
                },
                s.id
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 shadow-sm sm:rounded-xl p-5", children: [
            /* @__PURE__ */ jsxs("h4", { className: "text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4", children: [
              __("All Meetings"),
              /* @__PURE__ */ jsxs("span", { className: "ml-2 text-xs font-normal text-gray-400", children: [
                "(",
                meetings.length,
                ")"
              ] })
            ] }),
            meetings.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-10 text-gray-400 dark:text-gray-500", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-12 h-12 mx-auto mb-3 opacity-40", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
              /* @__PURE__ */ jsx("p", { className: "text-sm", children: __("No meetings yet.") })
            ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: [...meetings].sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at)).map((m) => {
              const s = statusStyle(m.status);
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setSelected(m),
                  className: "w-full text-left flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: `w-1 self-stretch rounded-full shrink-0 ${s.bg}` }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-800 dark:text-gray-100", children: formatFullDate(m.scheduled_at) }),
                        /* @__PURE__ */ jsx("span", { className: `text-[10px] px-2 py-0.5 rounded-full font-medium ${s.badge}`, children: statusLabel(m.status) })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "mt-0.5 text-xs text-gray-500 dark:text-gray-400", children: [
                        formatTime(m.scheduled_at),
                        m.end_time && ` – ${formatTime(m.end_time)}`,
                        m.location && ` · ${m.location}`
                      ] }),
                      m.agenda && /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs text-gray-600 dark:text-gray-300 truncate", children: m.agenda }),
                      /* @__PURE__ */ jsxs("div", { className: "mt-0.5 text-[11px] text-gray-400", children: [
                        __("Mentor"),
                        ": ",
                        mentorName(m)
                      ] })
                    ] })
                  ]
                },
                m.id
              );
            }) })
          ] })
        ] }) }),
        selectedAdmin && /* @__PURE__ */ jsx(
          "div",
          {
            className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4",
            onClick: () => setSelectedAdmin(null),
            children: /* @__PURE__ */ jsxs(
              "div",
              {
                className: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 relative",
                onClick: (e) => e.stopPropagation(),
                children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setSelectedAdmin(null),
                      className: "absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200",
                      children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: `text-xs px-2.5 py-0.5 rounded-full font-medium ${priorityStyle(selectedAdmin.priority).badge}`, children: selectedAdmin.priority }),
                  /* @__PURE__ */ jsx("h3", { className: "mt-3 text-lg font-bold text-gray-900 dark:text-gray-100", children: selectedAdmin.name }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: (/* @__PURE__ */ new Date(selectedAdmin.date + "T00:00:00")).toLocaleDateString([], { weekday: "long", day: "numeric", month: "long", year: "numeric" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3 text-sm", children: [
                    selectedAdmin.start_time && /* @__PURE__ */ jsx(Row, { label: __("Time"), value: `${selectedAdmin.start_time.substring(0, 5)}–${selectedAdmin.end_time ? selectedAdmin.end_time.substring(0, 5) : ""}` }),
                    selectedAdmin.location && /* @__PURE__ */ jsx(Row, { label: __("Location"), value: selectedAdmin.location }),
                    selectedAdmin.pic && /* @__PURE__ */ jsx(Row, { label: __("PIC"), value: selectedAdmin.pic }),
                    selectedAdmin.description && /* @__PURE__ */ jsx(Row, { label: __("Description"), value: selectedAdmin.description })
                  ] })
                ]
              }
            )
          }
        ),
        selected && /* @__PURE__ */ jsx(
          "div",
          {
            className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4",
            onClick: () => setSelected(null),
            children: /* @__PURE__ */ jsxs(
              "div",
              {
                className: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 relative",
                onClick: (e) => e.stopPropagation(),
                children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setSelected(null),
                      className: "absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200",
                      children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: `text-xs px-2.5 py-0.5 rounded-full font-medium ${statusStyle(selected.status).badge}`, children: statusLabel(selected.status) }),
                  /* @__PURE__ */ jsx("h3", { className: "mt-3 text-lg font-bold text-gray-900 dark:text-gray-100", children: formatFullDate(selected.scheduled_at) }),
                  /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
                    formatTime(selected.scheduled_at),
                    selected.end_time && ` – ${formatTime(selected.end_time)}`
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3 text-sm", children: [
                    /* @__PURE__ */ jsx(Row, { label: __("Mentor"), value: mentorName(selected) }),
                    selected.location && /* @__PURE__ */ jsx(Row, { label: __("Location"), value: selected.location }),
                    selected.meeting_link && /* @__PURE__ */ jsx(
                      Row,
                      {
                        label: __("Meeting Link"),
                        value: /* @__PURE__ */ jsx(
                          "a",
                          {
                            href: selected.meeting_link,
                            target: "_blank",
                            rel: "noreferrer",
                            className: "text-indigo-600 dark:text-indigo-400 underline break-all",
                            children: selected.meeting_link
                          }
                        )
                      }
                    ),
                    selected.agenda && /* @__PURE__ */ jsx(Row, { label: __("Agenda"), value: selected.agenda }),
                    selected.notes && /* @__PURE__ */ jsx(Row, { label: __("Notes"), value: selected.notes })
                  ] }),
                  selected.status === "rejected" && selected.rejection_reason && /* @__PURE__ */ jsxs("div", { className: "mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-700 dark:text-red-300", children: [
                    /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
                      __("Rejection Reason"),
                      ": "
                    ] }),
                    selected.rejection_reason
                  ] })
                ]
              }
            )
          }
        )
      ]
    }
  );
}
function Row({ label, value }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
    /* @__PURE__ */ jsx("span", { className: "w-28 shrink-0 text-gray-500 dark:text-gray-400", children: label }),
    /* @__PURE__ */ jsx("span", { className: "text-gray-800 dark:text-gray-100 break-words", children: value })
  ] });
}
export {
  Schedule as default
};
