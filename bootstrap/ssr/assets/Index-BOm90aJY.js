import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BG6RGD2S.js";
import { Head, Link, router } from "@inertiajs/react";
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
function MentorIndex({ auth, mentors }) {
  const toggleStatus = (id) => {
    router.patch(route("mentors.toggle-status", id));
  };
  const startChat = (mentor) => {
    window.dispatchEvent(new CustomEvent("start-chat", {
      detail: { user: mentor }
    }));
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200", children: __("Mentor List") }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("mentors.create"),
            className: "inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150",
            children: __("Add Mentor")
          }
        )
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("Mentor List") }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800", children: /* @__PURE__ */ jsx("div", { className: "p-6 text-gray-900 dark:text-gray-100", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 dark:bg-gray-700", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300", children: __("Name") }),
            /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300", children: __("Email") }),
            /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300", children: __("Gender") }),
            /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300", children: __("Age Group") }),
            /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300", children: __("Action") })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700", children: mentors.length > 0 ? mentors.map((mentor) => /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
              /* @__PURE__ */ jsx(
                ProfilePhoto,
                {
                  src: mentor.profile_photo_url,
                  alt: mentor.first_name,
                  className: "w-8 h-8 rounded-full object-cover",
                  fallbackClassName: "w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold text-xs",
                  fallback: (mentor.first_name || "M").charAt(0).toUpperCase()
                }
              ),
              /* @__PURE__ */ jsx("span", { children: [mentor.first_name, mentor.last_name].filter(Boolean).join(" ") })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400", children: mentor.email }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400", children: mentor.gender ? __(mentor.gender) : "-" }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400", children: mentor.age_group ? __(mentor.age_group) : "-" }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5 whitespace-nowrap text-sm font-medium", children: /* @__PURE__ */ jsxs("div", { className: "flex space-x-3", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => startChat(mentor),
                  className: "text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300",
                  title: __("Chat"),
                  children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z", clipRule: "evenodd" }) })
                }
              ),
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: route("mentors.edit", mentor.id),
                  className: "text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300",
                  children: __("Edit")
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => toggleStatus(mentor.id),
                  className: `${mentor.is_active ? "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300" : "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"}`,
                  children: mentor.is_active ? __("Active") : __("Inactive")
                }
              )
            ] }) })
          ] }, mentor.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "5", className: "px-6 py-2.5 text-center text-sm text-gray-500 dark:text-gray-400", children: __("No mentors found.") }) }) })
        ] }) }) }) }) }) })
      ]
    }
  );
}
export {
  MentorIndex as default
};
