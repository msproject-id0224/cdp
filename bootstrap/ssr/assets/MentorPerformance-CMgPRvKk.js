import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BG6RGD2S.js";
import { Head } from "@inertiajs/react";
import { _ as __ } from "./lang-COBcTD8W.js";
import { P as ProfilePhoto } from "./ProfilePhoto-CJ2Z04pO.js";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "react";
import "./ThemeToggle-BY9dagkZ.js";
import "./TextInput-D0qTZeQv.js";
import "axios";
import "./Modal-CKHW52Ki.js";
import "./SecondaryButton-TjIrbn1G.js";
import "./PrimaryButton-BNNL2gCI.js";
import "./DangerButton-B7to2Tbx.js";
import "./Footer-B7ihPSZ8.js";
import "./useTheme-CngFDcs1.js";
const CRITERIA = [
  { key: "jadwal", label: "Schedule Assessment", short: "Jadwal" },
  { key: "kehadiran", label: "Attendance Assessment", short: "Kehadiran" },
  { key: "surat", label: "Letter Writing Assessment", short: "Surat" },
  { key: "gift", label: "Gift Mentoring Assessment", short: "Gift" },
  { key: "update_anak", label: "Child Update Assessment", short: "Update Anak" }
];
function ScoreBadge({ value }) {
  const color = value >= 8 ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" : value >= 5 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300" : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
  return /* @__PURE__ */ jsx("span", { className: `inline-block px-2 py-0.5 rounded-full text-xs font-bold tabular-nums ${color}`, children: value.toFixed(2) });
}
function ScoreBar({ value }) {
  const pct = Math.min(value / 10 * 100, 100);
  const color = value >= 8 ? "bg-green-500" : value >= 5 ? "bg-yellow-400" : "bg-red-500";
  return /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1", children: /* @__PURE__ */ jsx("div", { className: `${color} h-1.5 rounded-full transition-all`, style: { width: `${pct}%` } }) });
}
function TotalBadge({ value }) {
  const color = value >= 8 ? "bg-green-600 text-white" : value >= 5 ? "bg-yellow-500 text-white" : "bg-red-600 text-white";
  const label = value >= 8 ? __("Good") : value >= 5 ? __("Fair") : __("Needs Improvement");
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1", children: [
    /* @__PURE__ */ jsx("span", { className: `text-xl font-black tabular-nums px-3 py-1 rounded-lg ${color}`, children: value.toFixed(2) }),
    /* @__PURE__ */ jsx("span", { className: `text-xs font-semibold ${value >= 8 ? "text-green-600 dark:text-green-400" : value >= 5 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"}`, children: label })
  ] });
}
function MentorPerformance({ performances }) {
  const sorted = [...performances].sort((a, b) => b.total - a.total);
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200", children: __("Mentor Performance Assessment") }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("Mentor Performance Assessment") }),
        /* @__PURE__ */ jsx("div", { className: "py-6 sm:py-10", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6", children: [
            /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm", children: [
              __("Scoring Criteria"),
              " — ",
              __("Score range 1–10 points per criteria")
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-gray-600 dark:text-gray-400", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold text-blue-600", children: __("Schedule") }),
                /* @__PURE__ */ jsx("span", { children: __("Schedule criteria desc") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold text-blue-600", children: __("Attendance") }),
                /* @__PURE__ */ jsx("span", { children: __("Attendance criteria desc") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold text-blue-600", children: __("Letter") }),
                /* @__PURE__ */ jsx("span", { children: __("Letter criteria desc") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold text-blue-600", children: __("Gift") }),
                /* @__PURE__ */ jsx("span", { children: __("Gift criteria desc") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold text-blue-600", children: __("Child Update") }),
                /* @__PURE__ */ jsx("span", { children: __("Child Update criteria desc") })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-4 mt-4 text-xs font-medium", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx("span", { className: "w-3 h-3 rounded-full bg-green-500 inline-block" }),
                " ≥ 8 ",
                __("Good")
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx("span", { className: "w-3 h-3 rounded-full bg-yellow-400 inline-block" }),
                " 5–7.99 ",
                __("Fair")
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx("span", { className: "w-3 h-3 rounded-full bg-red-500 inline-block" }),
                " < 5 ",
                __("Needs Improvement")
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-black text-gray-900 dark:text-gray-100", children: performances.length }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: __("Total Active Mentors") })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-black text-green-600", children: performances.filter((p) => p.total >= 8).length }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: __("Good Performance (≥8)") })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-black text-yellow-500", children: performances.filter((p) => p.total >= 5 && p.total < 8).length }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: __("Fair Performance (5–8)") })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-black text-red-600", children: performances.filter((p) => p.total < 5).length }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: __("Needs Improvement") })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "hidden lg:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700", children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 w-8", children: "#" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300", children: __("Mentor Name") }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-center font-semibold text-gray-700 dark:text-gray-300", children: __("Participants") }),
              CRITERIA.map((c) => /* @__PURE__ */ jsxs("th", { className: "px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 min-w-[110px]", children: [
                /* @__PURE__ */ jsx("span", { title: __(c.label), children: __(c.short) }),
                /* @__PURE__ */ jsx("div", { className: "text-[10px] font-normal text-gray-400", children: __("max. 10") })
              ] }, c.key)),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-center font-semibold text-gray-700 dark:text-gray-300", children: __("Total Points") })
            ] }) }),
            /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-gray-100 dark:divide-gray-700", children: [
              sorted.map((p, idx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors", children: [
                /* @__PURE__ */ jsx("td", { className: "px-4 py-2 text-gray-400 text-xs", children: idx + 1 }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(
                    ProfilePhoto,
                    {
                      src: p.photo,
                      alt: p.name,
                      className: "h-9 w-9 rounded-full object-cover flex-shrink-0",
                      fallbackClassName: "h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 text-sm font-bold flex-shrink-0",
                      fallback: p.name.charAt(0)
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: "font-medium text-gray-900 dark:text-gray-100", children: p.name }),
                    /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-400", children: p.email })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-2 text-center text-gray-600 dark:text-gray-400", children: p.participants_count }),
                CRITERIA.map((c) => /* @__PURE__ */ jsxs("td", { className: "px-3 py-2 text-center", children: [
                  /* @__PURE__ */ jsx(ScoreBadge, { value: p.scores[c.key] }),
                  /* @__PURE__ */ jsx(ScoreBar, { value: p.scores[c.key] })
                ] }, c.key)),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-2 text-center", children: /* @__PURE__ */ jsx(TotalBadge, { value: p.total }) })
              ] }, p.id)),
              sorted.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 8, className: "px-4 py-12 text-center text-gray-400 text-sm", children: __("No active mentor data yet.") }) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "lg:hidden space-y-4", children: [
            sorted.map((p, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400 w-5", children: idx + 1 }),
                /* @__PURE__ */ jsx(
                  ProfilePhoto,
                  {
                    src: p.photo,
                    alt: p.name,
                    className: "h-11 w-11 rounded-full object-cover",
                    fallbackClassName: "h-11 w-11 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold",
                    fallback: p.name.charAt(0)
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-900 dark:text-gray-100 truncate", children: p.name }),
                  /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-400 truncate", children: p.email }),
                  /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500 dark:text-gray-400", children: [
                    p.participants_count,
                    " ",
                    __("participants")
                  ] })
                ] }),
                /* @__PURE__ */ jsx(TotalBadge, { value: p.total })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-3", children: CRITERIA.map((c) => /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 dark:bg-gray-900/40 rounded-lg p-2", children: [
                /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-400 mb-1 font-medium", children: __(c.short) }),
                /* @__PURE__ */ jsx(ScoreBadge, { value: p.scores[c.key] }),
                /* @__PURE__ */ jsx(ScoreBar, { value: p.scores[c.key] })
              ] }, c.key)) })
            ] }, p.id)),
            sorted.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center py-12 text-gray-400 text-sm", children: __("No active mentor data yet.") })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  MentorPerformance as default
};
