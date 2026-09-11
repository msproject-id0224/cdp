import { jsx, jsxs } from "react/jsx-runtime";
import { M as Modal } from "./Modal-CKHW52Ki.js";
import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import { u as useTrans } from "./lang-COBcTD8W.js";
import { P as ProfilePhoto } from "./ProfilePhoto-B39VtFFM.js";
import "@headlessui/react";
function RmdDetailModal({ show, onClose, userId }) {
  const __ = useTrans();
  const { locale } = usePage().props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);
  useEffect(() => {
    if (show && userId) {
      fetchData();
      setExpandedModule(null);
    } else {
      setData(null);
      setError(null);
    }
  }, [show, userId]);
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(route("rmd-report.participant.details", userId));
      setData(response.data);
    } catch (err) {
      console.error("Error fetching participant details:", err);
      setError(__("Failed to fetch participant data."));
    } finally {
      setLoading(false);
    }
  };
  const getStatusColor = (percentage) => {
    if (percentage === 100) return "text-green-600 dark:text-green-400";
    if (percentage > 0) return "text-yellow-600 dark:text-yellow-400";
    return "text-gray-500 dark:text-gray-400";
  };
  const getBarColor = (percentage) => {
    if (percentage === 100) return "bg-green-500";
    if (percentage > 0) return "bg-indigo-500";
    return "bg-gray-300 dark:bg-gray-600";
  };
  const getSectionIcon = (percentage) => {
    if (percentage === 100) return /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-green-500 shrink-0", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) });
    if (percentage > 0) return /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-yellow-500 shrink-0", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z", clipRule: "evenodd" }) });
    return /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-gray-400 shrink-0", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) });
  };
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  return /* @__PURE__ */ jsx(Modal, { show, onClose, maxWidth: "2xl", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Participant RMD Progress Details") }),
      /* @__PURE__ */ jsxs("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-500", children: [
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: __("Close") }),
        /* @__PURE__ */ jsx("svg", { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }) })
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center py-12", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" }) }) : error ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-red-500", children: [
      error,
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: fetchData,
          className: "block mx-auto mt-4 text-indigo-600 hover:text-indigo-800 underline",
          children: __("Try Again")
        }
      )
    ] }) : data ? /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 grid grid-cols-2 gap-4 text-sm relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4", children: /* @__PURE__ */ jsx(
          ProfilePhoto,
          {
            src: data.user.profile_photo_url,
            alt: data.user.name,
            className: "w-16 h-16 rounded-full object-cover border-2 border-white dark:border-gray-600 shadow-sm",
            fallbackClassName: "w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 font-bold text-2xl border-2 border-white dark:border-gray-600 shadow-sm",
            fallback: (data?.user?.name || "P").charAt(0).toUpperCase()
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "block text-gray-500 dark:text-gray-400", children: __("Full Name") }),
          /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: data.user.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "block text-gray-500 dark:text-gray-400", children: __("ID Number") }),
          /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: data.user.id_number || "-" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "block text-gray-500 dark:text-gray-400", children: __("Age") }),
          /* @__PURE__ */ jsxs("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: [
            data.user.age,
            " ",
            __("year(s)")
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "block text-gray-500 dark:text-gray-400", children: __("Overall Status") }),
          /* @__PURE__ */ jsxs("span", { className: `font-medium ${data.summary.percentage === 100 ? "text-green-600" : "text-indigo-600"}`, children: [
            data.summary.status,
            " (",
            data.summary.percentage,
            "%)"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 italic mb-1", children: __("Click on a module to see details of filled/unfilled sections.") }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2 max-h-[60vh] overflow-y-auto pr-1", children: data.modules.map((module, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden",
          children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                className: "w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
                onClick: () => setExpandedModule(expandedModule === index ? null : index),
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-2", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: module.name }),
                      module.sections?.length > 0 && /* @__PURE__ */ jsx(
                        "svg",
                        {
                          className: `w-4 h-4 text-gray-400 transition-transform ${expandedModule === index ? "rotate-180" : ""}`,
                          fill: "none",
                          viewBox: "0 0 24 24",
                          stroke: "currentColor",
                          children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 9l-7 7-7-7" })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: `text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 ${getStatusColor(module.percentage)}`, children: module.status })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mb-1.5", children: /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: `h-2 rounded-full transition-all ${getBarColor(module.percentage)}`,
                      style: { width: `${module.percentage}%` }
                    }
                  ) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-gray-500 dark:text-gray-400", children: [
                    /* @__PURE__ */ jsxs("span", { children: [
                      __("Progress"),
                      ": ",
                      module.percentage,
                      "%"
                    ] }),
                    /* @__PURE__ */ jsxs("span", { children: [
                      __("Last Update"),
                      ": ",
                      formatDate(module.last_updated)
                    ] })
                  ] })
                ]
              }
            ),
            expandedModule === index && module.sections?.length > 0 && /* @__PURE__ */ jsx("div", { className: "border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 px-3 pb-3 pt-2 space-y-2", children: module.sections.map((section, si) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              getSectionIcon(section.percentage),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-0.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-gray-700 dark:text-gray-300 truncate", children: section.label }),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500 dark:text-gray-400 ml-2 shrink-0", children: [
                    section.filled,
                    "/",
                    section.total
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700", children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `h-1.5 rounded-full ${getBarColor(section.percentage)}`,
                    style: { width: `${section.percentage}%` }
                  }
                ) })
              ] })
            ] }, si)) })
          ]
        },
        index
      )) })
    ] }) : null,
    /* @__PURE__ */ jsx("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700",
        onClick: onClose,
        children: __("Close")
      }
    ) })
  ] }) });
}
export {
  RmdDetailModal as default
};
