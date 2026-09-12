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
function RewardIndex({ auth, recipients }) {
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200", children: __("Daftar Penerima Hadiah") }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("Daftar Penerima Hadiah") }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "p-6 text-gray-900 dark:text-gray-100", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium", children: __("Partisipan yang Telah Menyelesaikan RMD") }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500", children: [
              __("Total"),
              ": ",
              recipients.length
            ] })
          ] }),
          recipients.length > 0 ? /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 dark:bg-gray-700", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __("Nama Partisipan") }),
              /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __("ID") }),
              /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __("Usia") }),
              /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __("Status") }),
              /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __("Aksi") })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700", children: recipients.map((user) => /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5 whitespace-nowrap", children: /* @__PURE__ */ jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-gray-900 dark:text-gray-100", children: [
                user.first_name,
                " ",
                user.last_name
              ] }) }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400", children: user.id_number || "-" }),
              /* @__PURE__ */ jsxs("td", { className: "px-6 py-2.5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400", children: [
                user.age || "-",
                " ",
                __("Tahun")
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5 whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", children: __("RMD Selesai") }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5 whitespace-nowrap text-right text-sm font-medium", children: /* @__PURE__ */ jsx(
                Link,
                {
                  href: route("participants.show", user.id),
                  className: "text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300",
                  children: __("Lihat Detail")
                }
              ) })
            ] }, user.id)) })
          ] }) }) : /* @__PURE__ */ jsx("div", { className: "text-center py-10 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700", children: /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-400", children: __("Belum ada partisipan yang memenuhi syarat penerima hadiah (RMD Selesai 100%).") }) })
        ] }) }) }) })
      ]
    }
  );
}
export {
  RewardIndex as default
};
