import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-qz7IKsDN.js";
import { Head, Link } from "@inertiajs/react";
import { _ as __ } from "./lang-COBcTD8W.js";
import { P as PrimaryButton } from "./PrimaryButton-BNNL2gCI.js";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "react";
import "./ThemeToggle-BY9dagkZ.js";
import "./TextInput-D0qTZeQv.js";
import "axios";
import "./ProfilePhoto-B39VtFFM.js";
import "./Modal-CKHW52Ki.js";
import "./SecondaryButton-TjIrbn1G.js";
import "./DangerButton-B7to2Tbx.js";
import "./Footer-CDwTxrct.js";
import "./useTheme-CngFDcs1.js";
function GodsPurpose({ auth }) {
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      user: auth.user,
      header: /* @__PURE__ */ jsx("h2", { className: "font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight", children: __("RMD_GODS_PURPOSE_TITLE") }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("RMD_GODS_PURPOSE_TITLE") }),
        /* @__PURE__ */ jsxs("div", { className: "py-12 bg-gray-50 dark:bg-gray-900 min-h-screen relative", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute inset-0 pointer-events-none z-0",
              style: {
                backgroundImage: "url('/images/rmd-backgrounds/latar-_4_.svg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                opacity: 0.08
              }
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto sm:px-6 lg:px-8 relative z-10", children: /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "p-6 text-gray-900 dark:text-gray-100 space-y-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2", children: __("RMD_GODS_PURPOSE_TITLE").toUpperCase() }),
              /* @__PURE__ */ jsx("div", { className: "w-24 h-1 bg-indigo-500 mx-auto rounded" })
            ] }),
            /* @__PURE__ */ jsxs("section", { className: "prose dark:prose-invert max-w-none", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200", children: __("RMD_OPENING_TITLE") }),
              /* @__PURE__ */ jsxs("div", { className: "bg-indigo-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner mb-6", children: [
                /* @__PURE__ */ jsx("p", { className: "mb-4 leading-relaxed", children: __("RMD_GODS_PURPOSE_TEXT_1") }),
                /* @__PURE__ */ jsx("p", { className: "mb-4 leading-relaxed", children: __("RMD_GODS_PURPOSE_TEXT_2") })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mb-4 leading-relaxed", children: __("RMD_GODS_PURPOSE_TEXT_3") }),
              /* @__PURE__ */ jsx("p", { className: "mb-4 leading-relaxed", children: __("RMD_GODS_PURPOSE_TEXT_4") }),
              /* @__PURE__ */ jsx("blockquote", { className: "border-l-4 border-indigo-500 pl-4 italic text-gray-600 dark:text-gray-400 my-6", children: __("RMD_GODS_PURPOSE_QUOTE") })
            ] }),
            /* @__PURE__ */ jsxs("section", { className: "prose dark:prose-invert max-w-none", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200", children: __("RMD_IMPORTANCE_TITLE") }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center gap-6 mb-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "mb-4 leading-relaxed", children: __("RMD_THOMAS_CARLYLE_QUOTE") }),
                  /* @__PURE__ */ jsx("p", { className: "mb-4 leading-relaxed", children: __("RMD_IMPORTANCE_TEXT_1") })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "md:w-1/3 flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "text-9xl text-indigo-200 dark:text-indigo-900", children: "🧭" }) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-6 rounded-lg", children: /* @__PURE__ */ jsx("p", { className: "leading-relaxed", children: __("RMD_IMPORTANCE_TEXT_2") }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-700", children: [
              /* @__PURE__ */ jsxs(
                Link,
                {
                  href: route("rmd.profile"),
                  className: "inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150",
                  children: [
                    "« ",
                    __("RMD_BACK_TO_PROFILE")
                  ]
                }
              ),
              /* @__PURE__ */ jsx(Link, { href: route("rmd.what-the-bible-says"), children: /* @__PURE__ */ jsxs(PrimaryButton, { children: [
                __("RMD_NEXT_BIBLE_SAYS"),
                " »"
              ] }) })
            ] })
          ] }) }) })
        ] })
      ]
    }
  );
}
export {
  GodsPurpose as default
};
