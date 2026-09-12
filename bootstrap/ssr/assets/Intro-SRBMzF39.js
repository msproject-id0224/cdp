import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-qz7IKsDN.js";
import { Head, Link } from "@inertiajs/react";
import { _ as __ } from "./lang-COBcTD8W.js";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "react";
import "./ThemeToggle-BY9dagkZ.js";
import "./TextInput-D0qTZeQv.js";
import "axios";
import "./ProfilePhoto-B39VtFFM.js";
import "./Modal-CKHW52Ki.js";
import "./SecondaryButton-TjIrbn1G.js";
import "./PrimaryButton-BNNL2gCI.js";
import "./DangerButton-B7to2Tbx.js";
import "./Footer-CDwTxrct.js";
import "./useTheme-CngFDcs1.js";
function RmdIntro({ auth }) {
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      user: auth.user,
      header: /* @__PURE__ */ jsx("h2", { className: "font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight", children: __("RMD_INTRO_TITLE") }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("RMD_INTRO_TITLE") }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg", children: /* @__PURE__ */ jsx("div", { className: "p-6 text-gray-900 dark:text-gray-100", children: /* @__PURE__ */ jsxs("div", { className: "prose dark:prose-invert max-w-none", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold mb-6 text-center", children: __("WHAT IS MY FUTURE PLAN BOOK") }),
          /* @__PURE__ */ jsx("p", { className: "mb-4 text-lg leading-relaxed", children: __("RMD_WHAT_IS_TEXT_1") }),
          /* @__PURE__ */ jsxs("div", { className: "my-6 pl-4 border-l-4 border-blue-500 italic text-gray-700 dark:text-gray-300", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold", children: __("RMD_WHAT_IS_QUOTE_TITLE") }),
            /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 mt-2 space-y-1", children: [
              /* @__PURE__ */ jsx("li", { children: __("RMD_WHAT_IS_LIST_1") }),
              /* @__PURE__ */ jsx("li", { children: __("RMD_WHAT_IS_LIST_2") }),
              /* @__PURE__ */ jsx("li", { children: __("RMD_WHAT_IS_LIST_3") }),
              /* @__PURE__ */ jsx("li", { children: __("RMD_WHAT_IS_LIST_4") })
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mb-4 text-lg leading-relaxed", children: __("RMD_WHAT_IS_TEXT_2") }),
          /* @__PURE__ */ jsx("p", { className: "mb-4 text-lg leading-relaxed", children: __("RMD_WHAT_IS_TEXT_3") }),
          /* @__PURE__ */ jsx("p", { className: "mb-4 text-lg leading-relaxed", children: __("RMD_WHAT_IS_TEXT_4") }),
          /* @__PURE__ */ jsx("p", { className: "mb-4 text-lg leading-relaxed", children: __("RMD_WHAT_IS_TEXT_5") }),
          /* @__PURE__ */ jsx("p", { className: "mb-8 text-lg leading-relaxed font-medium", children: __("RMD_WHAT_IS_TEXT_6") }),
          /* @__PURE__ */ jsx("div", { className: "mt-8 flex justify-center", children: /* @__PURE__ */ jsx(
            Link,
            {
              href: route("rmd.profile"),
              className: "inline-flex items-center px-6 py-3 bg-green-600 border border-transparent rounded-md font-bold text-base text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150",
              children: __("RMD_READY_BTN")
            }
          ) })
        ] }) }) }) }) })
      ]
    }
  );
}
export {
  RmdIntro as default
};
