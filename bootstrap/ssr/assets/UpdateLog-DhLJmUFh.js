import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-CKYSMoJT.js";
import { router, Head, Link } from "@inertiajs/react";
import { u as useTrans } from "./lang-COBcTD8W.js";
import { P as Pagination } from "./Pagination-CRnq7q04.js";
import { T as TextInput } from "./TextInput-D0qTZeQv.js";
import { P as ProfilePhoto } from "./ProfilePhoto-CJ2Z04pO.js";
import { useState, useRef, useEffect } from "react";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "./ThemeToggle-BY9dagkZ.js";
import "axios";
import "./Modal-CKHW52Ki.js";
import "./SecondaryButton-TjIrbn1G.js";
import "./PrimaryButton-BNNL2gCI.js";
import "./DangerButton-B7to2Tbx.js";
import "./Footer-CDwTxrct.js";
import "./useTheme-CngFDcs1.js";
const formatDDMMYY = (dateString) => {
  if (!dateString) return "-";
  const d = new Date(dateString);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
};
function UpdateLog({ participants, filters }) {
  const __ = useTrans();
  const [search, setSearch] = useState(filters.search || "");
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const id = setTimeout(() => {
      router.get(route("participants.update-log"), { search }, {
        preserveState: true,
        preserveScroll: true,
        replace: true
      });
    }, 300);
    return () => clearTimeout(id);
  }, [search]);
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200", children: __("Daftar Pembaruan Partisipan") }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("Daftar Pembaruan Partisipan") }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "bg-white overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-800 p-6", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-6 flex items-center gap-4", children: /* @__PURE__ */ jsx(
            TextInput,
            {
              placeholder: __("Search..."),
              className: "w-full max-w-sm",
              value: search,
              onChange: (e) => setSearch(e.target.value)
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 dark:bg-gray-700", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300", children: __("Name") }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 hidden md:table-cell", children: __("ID") }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 hidden md:table-cell", children: __("Age Group") }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300", children: __("Status") }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300", children: __("Last Update") })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700", children: participants.data && participants.data.length > 0 ? participants.data.map((p) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150", children: [
              /* @__PURE__ */ jsx("td", { className: "px-4 py-2 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsx(
                  ProfilePhoto,
                  {
                    src: p.profile_photo_url,
                    alt: p.first_name,
                    className: "w-8 h-8 rounded-full object-cover",
                    fallbackClassName: "w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold text-xs",
                    fallback: (p.first_name || "P").charAt(0).toUpperCase()
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route("participants.show", p.id),
                    className: "text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline",
                    children: [
                      p.first_name,
                      " ",
                      p.last_name,
                      p.nickname && /* @__PURE__ */ jsxs("span", { className: "ml-1 text-[10px] text-gray-500 dark:text-gray-400", children: [
                        "(",
                        p.nickname,
                        ")"
                      ] })
                    ]
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-2 whitespace-nowrap hidden md:table-cell", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300", children: p.id_number ? `ID-0224${String(p.id_number).padStart(5, "0")}` : "-" }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400 hidden md:table-cell", children: p.age_group || "-" }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-2 whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: `px-2 inline-flex text-[10px] leading-5 font-semibold rounded-full ${p.is_active ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}`, children: p.is_active ? __("Active") : __("Inactive") }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-2 whitespace-nowrap text-xs text-gray-700 dark:text-gray-300 font-mono", children: formatDDMMYY(p.updated_at) })
            ] }, p.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "5", className: "px-6 py-2.5 text-center text-sm text-gray-500 dark:text-gray-400", children: __("No participants found.") }) }) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(Pagination, { links: participants.links }) })
        ] }) }) })
      ]
    }
  );
}
export {
  UpdateLog as default
};
