import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-DY-v4bup.js";
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
function RmdIndex({ auth }) {
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      user: auth.user,
      header: /* @__PURE__ */ jsx("h2", { className: "font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight", children: __("RMD (My Future Plan)") }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "RMD" }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg", children: /* @__PURE__ */ jsx("div", { className: "p-6 text-gray-900 dark:text-gray-100", children: /* @__PURE__ */ jsxs("div", { className: "prose dark:prose-invert max-w-none", children: [
          /* @__PURE__ */ jsx("p", { className: "mb-4 text-lg leading-relaxed", children: __("RMD_WELCOME_TEXT_1") }),
          /* @__PURE__ */ jsx("p", { className: "mb-4 text-lg leading-relaxed", children: __("RMD_WELCOME_TEXT_2") }),
          /* @__PURE__ */ jsx("p", { className: "mb-8 text-lg leading-relaxed", children: __("RMD_WELCOME_TEXT_3") }),
          /* @__PURE__ */ jsx("div", { className: "mt-8 flex justify-center", children: /* @__PURE__ */ jsx(
            Link,
            {
              href: route("rmd.intro"),
              className: "inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150",
              children: __("RMD Introduction")
            }
          ) })
        ] }) }) }) }) })
      ]
    }
  );
}
export {
  RmdIndex as default
};
