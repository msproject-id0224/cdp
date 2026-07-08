import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { M as Modal } from "./Modal-CKHW52Ki.js";
import { useState, useCallback, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import { u as useTrans } from "./lang-COBcTD8W.js";
import { P as ProfilePhoto } from "./ProfilePhoto-CJ2Z04pO.js";
import "@headlessui/react";
const MODULE_COLORS = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-cyan-500",
  "bg-teal-500",
  "bg-green-500",
  "bg-amber-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-rose-500"
];
function CircleProgress({ percentage, size = 76 }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ - percentage / 100 * circ;
  const col = percentage === 100 ? "#22c55e" : percentage > 0 ? "#6366f1" : "#d1d5db";
  return /* @__PURE__ */ jsxs("svg", { width: size, height: size, className: "-rotate-90", children: [
    /* @__PURE__ */ jsx("circle", { cx: size / 2, cy: size / 2, r, fill: "none", stroke: "#e5e7eb", strokeWidth: 8, className: "dark:stroke-gray-700" }),
    /* @__PURE__ */ jsx(
      "circle",
      {
        cx: size / 2,
        cy: size / 2,
        r,
        fill: "none",
        stroke: col,
        strokeWidth: 8,
        strokeDasharray: circ,
        strokeDashoffset: dash,
        strokeLinecap: "round",
        style: { transition: "stroke-dashoffset .4s ease" }
      }
    )
  ] });
}
function Pill({ pct, label }) {
  if (pct === 100) return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300", children: [
    /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }),
    label
  ] });
  if (pct > 0) return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300", children: [
    /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z", clipRule: "evenodd" }) }),
    label
  ] });
  return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400", children: [
    /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }),
    label
  ] });
}
function FieldValue({ value, type, __ }) {
  const [expanded, setExpanded] = useState(false);
  if (value === null || value === void 0 || value === "") {
    return /* @__PURE__ */ jsx("span", { className: "italic text-gray-400 dark:text-gray-600 text-xs", children: __("(empty)") });
  }
  if (type === "boolean") {
    return value ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-medium", children: [
      /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }),
      "Ya"
    ] }) : /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-gray-400 text-xs font-medium", children: [
      /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z", clipRule: "evenodd" }) }),
      "Tidak"
    ] });
  }
  if (type === "date") {
    return /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-700 dark:text-gray-300", children: value });
  }
  if (type === "number") {
    return /* @__PURE__ */ jsx("span", { className: "text-xs font-mono text-gray-700 dark:text-gray-300", children: value });
  }
  if (type === "image") {
    return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400", children: [
      /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
      "Ada gambar"
    ] });
  }
  if (type === "array") {
    const items = Array.isArray(value) ? value : [];
    if (items.length === 0) return /* @__PURE__ */ jsx("span", { className: "italic text-gray-400 text-xs", children: __("(empty)") });
    return /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1 mt-0.5", children: items.map((item, i) => /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[11px] rounded border border-indigo-200 dark:border-indigo-700", children: item }, i)) });
  }
  if (type === "json") {
    if (Array.isArray(value)) {
      return /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-600 dark:text-gray-400 mt-0.5 space-y-1", children: value.map((item, i) => /* @__PURE__ */ jsx("div", { className: "pl-2 border-l-2 border-indigo-200 dark:border-indigo-700", children: typeof item === "object" ? Object.entries(item).map(([k, v]) => /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
        /* @__PURE__ */ jsxs("span", { className: "font-medium text-gray-500 dark:text-gray-400 capitalize shrink-0", children: [
          k,
          ":"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-gray-700 dark:text-gray-300", children: String(v) })
      ] }, k)) : /* @__PURE__ */ jsx("span", { children: String(item) }) }, i)) });
    }
    if (typeof value === "object") {
      return /* @__PURE__ */ jsx("div", { className: "text-xs mt-0.5 space-y-0.5", children: Object.entries(value).map(([k, v]) => /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
        /* @__PURE__ */ jsxs("span", { className: "font-medium text-gray-500 dark:text-gray-400 capitalize shrink-0", children: [
          k,
          ":"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-gray-700 dark:text-gray-300", children: String(v) })
      ] }, k)) });
    }
    return /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-700 dark:text-gray-300", children: String(value) });
  }
  const str = String(value);
  const LIMIT = 220;
  if (str.length <= LIMIT) {
    return /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap", children: str });
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap", children: expanded ? str : str.slice(0, LIMIT) + "…" }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setExpanded((p) => !p),
        className: "ml-1 text-[11px] text-indigo-500 hover:text-indigo-700 underline",
        children: expanded ? __("collapse") : __("show more")
      }
    )
  ] });
}
function RmdDetailModal({ show, onClose, userId }) {
  const __ = useTrans();
  const { locale } = usePage().props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [openModule, setOpenModule] = useState(null);
  const [openSections, setOpenSections] = useState(/* @__PURE__ */ new Set());
  const toggleModule = (i) => {
    setOpenModule((p) => p === i ? null : i);
    setOpenSections(/* @__PURE__ */ new Set());
  };
  const toggleSection = useCallback((key) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);
  useEffect(() => {
    if (show && userId) {
      setOpenModule(null);
      setOpenSections(/* @__PURE__ */ new Set());
      setData(null);
      setError(null);
      fetchData();
    }
  }, [show, userId]);
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(route("rmd-report.participant.details", userId));
      setData(res.data);
    } catch {
      setError(__("Failed to fetch participant data."));
    } finally {
      setLoading(false);
    }
  };
  const fmt = (d) => {
    if (!d) return "–";
    return new Date(d).toLocaleString(locale === "id" ? "id-ID" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const barColor = (pct) => pct === 100 ? "bg-green-500" : pct > 0 ? "bg-indigo-500" : "bg-gray-200 dark:bg-gray-700";
  return /* @__PURE__ */ jsx(Modal, { show, onClose, maxWidth: "3xl", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", style: { maxHeight: "92vh" }, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-gray-900 dark:text-gray-100", children: __("Participant RMD Progress Details") }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }) }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "overflow-y-auto flex-1 px-6 py-5 space-y-5", children: [
      loading && /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center py-16", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" }) }),
      error && /* @__PURE__ */ jsxs("div", { className: "text-center py-10", children: [
        /* @__PURE__ */ jsx("p", { className: "text-red-500 mb-3 text-sm", children: error }),
        /* @__PURE__ */ jsx("button", { onClick: fetchData, className: "text-indigo-600 hover:underline text-sm", children: __("Try Again") })
      ] }),
      !loading && !error && data && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4 flex gap-4", children: [
          /* @__PURE__ */ jsx(
            ProfilePhoto,
            {
              src: data.user.profile_photo_url,
              alt: data.user.name,
              className: "w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-600 shadow shrink-0 mt-0.5",
              fallbackClassName: "w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xl border-2 border-white dark:border-gray-600 shadow shrink-0 mt-0.5",
              fallback: (data.user.name || "P").charAt(0).toUpperCase()
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-500 dark:text-gray-400", children: __("Full Name") }),
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900 dark:text-gray-100 truncate", children: data.user.name })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-500 dark:text-gray-400", children: __("ID Number") }),
              /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-800 dark:text-gray-200", children: data.user.id_number || "–" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-500 dark:text-gray-400", children: __("Age") }),
              /* @__PURE__ */ jsxs("p", { className: "font-medium text-gray-800 dark:text-gray-200", children: [
                data.user.age,
                " ",
                __("year(s)")
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-500 dark:text-gray-400", children: __("Email") }),
              /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-800 dark:text-gray-200 truncate text-xs", children: data.user.email })
            ] }),
            data.user.mentor_name && /* @__PURE__ */ jsxs("div", { className: "col-span-2", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-500 dark:text-gray-400", children: __("Assigned Mentor") }),
              /* @__PURE__ */ jsxs("p", { className: "font-medium text-indigo-700 dark:text-indigo-300 flex items-center gap-1 text-sm", children: [
                /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) }),
                data.user.mentor_name
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "shrink-0 flex flex-col items-center justify-center gap-1 pl-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(CircleProgress, { percentage: data.summary.percentage, size: 76 }),
              /* @__PURE__ */ jsxs("span", { className: "absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-800 dark:text-gray-100", children: [
                data.summary.percentage,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-gray-500 dark:text-gray-400 text-center", children: [
              data.summary.filled_modules,
              "/",
              data.summary.total_modules,
              " modul"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: `h-2.5 rounded-full transition-all ${barColor(data.summary.percentage)}`,
              style: { width: `${data.summary.percentage}%` }
            }
          ) }),
          /* @__PURE__ */ jsx(Pill, { pct: data.summary.percentage, label: data.summary.status })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
            "Klik modul → seksi → field untuk melihat detail isian"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-1.5", children: data.modules.map((mod, mi) => /* @__PURE__ */ jsxs("div", { className: "border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                className: "w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors",
                onClick: () => toggleModule(mi),
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx("span", { className: `w-2.5 h-2.5 rounded-full shrink-0 ${MODULE_COLORS[mi % MODULE_COLORS.length]}` }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-900 dark:text-gray-100 truncate", children: mod.name }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0 ml-2", children: [
                          /* @__PURE__ */ jsx(Pill, { pct: mod.percentage, label: mod.status }),
                          /* @__PURE__ */ jsx(
                            "svg",
                            {
                              className: `w-4 h-4 text-gray-400 transition-transform duration-200 ${openModule === mi ? "rotate-180" : ""}`,
                              fill: "none",
                              viewBox: "0 0 24 24",
                              stroke: "currentColor",
                              children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 9l-7 7-7-7" })
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx("div", { className: "flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5", children: /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: `h-1.5 rounded-full transition-all ${barColor(mod.percentage)}`,
                            style: { width: `${mod.percentage}%` }
                          }
                        ) }),
                        /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-gray-500 dark:text-gray-400 tabular-nums shrink-0", children: [
                          mod.percentage,
                          "%"
                        ] })
                      ] })
                    ] })
                  ] }),
                  mod.last_updated && /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 pl-6", children: [
                    "Terakhir: ",
                    fmt(mod.last_updated),
                    mod.filled_at && mod.filled_at !== mod.last_updated && /* @__PURE__ */ jsxs("span", { className: "ml-2", children: [
                      "· Mulai: ",
                      fmt(mod.filled_at)
                    ] })
                  ] })
                ]
              }
            ),
            openModule === mi && mod.sections?.length > 0 && /* @__PURE__ */ jsx("div", { className: "border-t border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700/60 bg-gray-50 dark:bg-gray-800/50", children: mod.sections.map((sec, si) => {
              const secKey = `${mi}-${si}`;
              const secOpen = openSections.has(secKey);
              return /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    className: "w-full text-left px-5 py-2.5 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors",
                    onClick: () => toggleSection(secKey),
                    children: [
                      /* @__PURE__ */ jsx("div", { className: "w-20 shrink-0", children: /* @__PURE__ */ jsx("div", { className: "bg-gray-200 dark:bg-gray-700 rounded-full h-1.5", children: /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: `h-1.5 rounded-full ${barColor(sec.percentage)}`,
                          style: { width: `${sec.percentage}%` }
                        }
                      ) }) }),
                      /* @__PURE__ */ jsx("span", { className: "flex-1 text-xs font-medium text-gray-700 dark:text-gray-300", children: sec.label }),
                      /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-gray-500 dark:text-gray-400 tabular-nums shrink-0", children: [
                        sec.filled,
                        "/",
                        sec.total
                      ] }),
                      sec.fields?.length > 0 && /* @__PURE__ */ jsx(
                        "svg",
                        {
                          className: `w-3.5 h-3.5 text-gray-400 transition-transform duration-150 shrink-0 ${secOpen ? "rotate-180" : ""}`,
                          fill: "none",
                          viewBox: "0 0 24 24",
                          stroke: "currentColor",
                          children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 9l-7 7-7-7" })
                        }
                      )
                    ]
                  }
                ),
                secOpen && sec.fields?.length > 0 && /* @__PURE__ */ jsx("div", { className: "px-5 pb-3 space-y-2.5 bg-white dark:bg-gray-900/30", children: sec.fields.map((field, fi) => /* @__PURE__ */ jsx("div", { className: `rounded-md px-3 py-2 border text-xs ${field.filled ? "border-green-100 dark:border-green-900/40 bg-green-50/60 dark:bg-green-900/10" : "border-gray-100 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/30"}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: `mt-0.5 shrink-0 w-3.5 h-3.5 ${field.filled ? "text-green-500" : "text-gray-300 dark:text-gray-600"}`, children: field.filled ? /* @__PURE__ */ jsx("svg", { fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) }) : /* @__PURE__ */ jsx("svg", { fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-600 dark:text-gray-400 mb-0.5", children: field.label }),
                    /* @__PURE__ */ jsx(FieldValue, { value: field.value, type: field.type, __ })
                  ] })
                ] }) }, fi)) })
              ] }, si);
            }) })
          ] }, mi)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end shrink-0", children: /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: onClose,
        className: "px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors",
        children: __("Close")
      }
    ) })
  ] }) });
}
export {
  RmdDetailModal as default
};
