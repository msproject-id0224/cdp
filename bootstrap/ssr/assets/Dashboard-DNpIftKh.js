import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-qz7IKsDN.js";
import { useForm, Head, Link, router } from "@inertiajs/react";
import { u as useTrans } from "./lang-COBcTD8W.js";
import { P as Pagination } from "./Pagination-CRnq7q04.js";
import { T as TextInput } from "./TextInput-D0qTZeQv.js";
import { useState } from "react";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "./ThemeToggle-BY9dagkZ.js";
import "axios";
import "./ProfilePhoto-B39VtFFM.js";
import "./Modal-CKHW52Ki.js";
import "./SecondaryButton-TjIrbn1G.js";
import "./PrimaryButton-BNNL2gCI.js";
import "./DangerButton-B7to2Tbx.js";
import "./Footer-CDwTxrct.js";
import "./useTheme-CngFDcs1.js";
function RmdDashboard({ auth, stats, participants, filters, ppaInfo, staffList }) {
  const __ = useTrans();
  const [search, setSearch] = useState(filters.search || "");
  const [editMode, setEditMode] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({
    fiscal_year: ppaInfo.fiscal_year || "",
    church_name: ppaInfo.church_name || "",
    ppa_id: ppaInfo.ppa_id || "",
    cluster: ppaInfo.cluster || "",
    rmd_period: ppaInfo.rmd_period || "",
    pic_user_id: ppaInfo.pic_user_id || ""
  });
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      router.get(
        route("rmd.dashboard"),
        { search: value },
        { preserveState: true, preserveScroll: true, replace: true }
      );
    }, 500);
  };
  const handleSave = (e) => {
    e.preventDefault();
    post(route("rmd.dashboard.ppa-info"), {
      onSuccess: () => setEditMode(false)
    });
  };
  const handleCancel = () => {
    reset();
    setEditMode(false);
  };
  const inputClass = "w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500";
  const errorClass = "text-red-500 text-xs mt-0.5";
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200", children: __("RMD Implementation") }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("RMD Dashboard") }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-blue-900 text-white text-center py-2 font-bold text-lg uppercase", children: __("RMD Implementation") }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-blue-100 dark:bg-blue-900/50 border-b border-blue-200 dark:border-blue-800 px-4 py-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-blue-900 dark:text-blue-100 font-bold text-sm uppercase flex-1 text-center", children: __("PPA Information") }),
              !editMode && /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setEditMode(true),
                  className: "text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded",
                  children: __("Edit")
                }
              )
            ] }),
            /* @__PURE__ */ jsx("form", { onSubmit: handleSave, children: /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-0 text-sm border border-gray-300 dark:border-gray-600", children: [
                /* @__PURE__ */ jsx("div", { className: "border-b border-r border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium", children: __("RMD Fiscal Year") }),
                /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 dark:border-gray-600 p-2 text-center", children: editMode ? /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(
                    TextInput,
                    {
                      value: data.fiscal_year,
                      onChange: (e) => setData("fiscal_year", e.target.value),
                      placeholder: __("e.g., FY 2025/2026"),
                      className: inputClass
                    }
                  ),
                  errors.fiscal_year && /* @__PURE__ */ jsx("p", { className: errorClass, children: errors.fiscal_year })
                ] }) : ppaInfo.fiscal_year }),
                /* @__PURE__ */ jsx("div", { className: "border-b border-r border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium", children: __("Church Name") }),
                /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 dark:border-gray-600 p-2 text-center", children: editMode ? /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(
                    TextInput,
                    {
                      value: data.church_name,
                      onChange: (e) => setData("church_name", e.target.value),
                      placeholder: __("Church name"),
                      className: inputClass
                    }
                  ),
                  errors.church_name && /* @__PURE__ */ jsx("p", { className: errorClass, children: errors.church_name })
                ] }) : ppaInfo.church_name }),
                /* @__PURE__ */ jsx("div", { className: "border-b border-r border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium", children: __("PPA ID No") }),
                /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 dark:border-gray-600 p-2 text-center", children: editMode ? /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(
                    TextInput,
                    {
                      value: data.ppa_id,
                      onChange: (e) => setData("ppa_id", e.target.value),
                      placeholder: __("e.g., ID 0224"),
                      className: inputClass
                    }
                  ),
                  errors.ppa_id && /* @__PURE__ */ jsx("p", { className: errorClass, children: errors.ppa_id })
                ] }) : /* @__PURE__ */ jsx("span", { className: "text-indigo-600 dark:text-indigo-400 font-medium", children: ppaInfo.ppa_id }) }),
                /* @__PURE__ */ jsx("div", { className: "border-b border-r border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium", children: __("Cluster") }),
                /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 dark:border-gray-600 p-2 text-center", children: editMode ? /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(
                    TextInput,
                    {
                      value: data.cluster,
                      onChange: (e) => setData("cluster", e.target.value),
                      placeholder: __("Cluster name"),
                      className: inputClass
                    }
                  ),
                  errors.cluster && /* @__PURE__ */ jsx("p", { className: errorClass, children: errors.cluster })
                ] }) : ppaInfo.cluster }),
                /* @__PURE__ */ jsx("div", { className: "border-b border-r border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium", children: __("RMD Period") }),
                /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 dark:border-gray-600 p-2 text-center", children: editMode ? /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(
                    TextInput,
                    {
                      value: data.rmd_period,
                      onChange: (e) => setData("rmd_period", e.target.value),
                      placeholder: __("e.g., January 2025 - June 2025"),
                      className: inputClass
                    }
                  ),
                  errors.rmd_period && /* @__PURE__ */ jsx("p", { className: errorClass, children: errors.rmd_period })
                ] }) : /* @__PURE__ */ jsx("span", { className: "text-indigo-600 dark:text-indigo-400", children: ppaInfo.rmd_period }) }),
                /* @__PURE__ */ jsx("div", { className: "border-b border-r border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium", children: __("RMD Facilitator Name & Position") }),
                /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300 dark:border-gray-600 p-2 text-center", children: editMode ? /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      value: data.pic_user_id,
                      onChange: (e) => setData("pic_user_id", e.target.value),
                      className: inputClass,
                      children: [
                        /* @__PURE__ */ jsxs("option", { value: "", children: [
                          "-- ",
                          __("Select PIC"),
                          " --"
                        ] }),
                        staffList.map((s) => /* @__PURE__ */ jsx("option", { value: s.id, children: s.label }, s.id))
                      ]
                    }
                  ),
                  errors.pic_user_id && /* @__PURE__ */ jsx("p", { className: errorClass, children: errors.pic_user_id })
                ] }) : /* @__PURE__ */ jsx("span", { className: "text-indigo-600 dark:text-indigo-400", children: ppaInfo.pic_name ?? "-" }) }),
                /* @__PURE__ */ jsx("div", { className: "border-r border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium", children: __("Number of RMD Mentors") }),
                /* @__PURE__ */ jsxs("div", { className: "p-2 text-center", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-indigo-600 dark:text-indigo-400 font-medium", children: [
                    stats.mentor_count,
                    " ",
                    __("Person(s)")
                  ] }),
                  editMode && /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-400 ml-1", children: [
                    "(",
                    __("automatic"),
                    ")"
                  ] })
                ] })
              ] }),
              editMode && /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 mt-3", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handleCancel,
                    className: "px-4 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",
                    children: __("Cancel")
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: processing,
                    className: "px-4 py-1.5 text-sm rounded bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50",
                    children: processing ? __("Saving...") : __("Save")
                  }
                )
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100 text-center py-1 font-bold text-sm uppercase border-t border-b border-blue-200 dark:border-blue-800", children: __("Youth Count & Attendance") }),
            /* @__PURE__ */ jsx("div", { className: "p-4 pt-0 overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm border-collapse border border-gray-300 dark:border-gray-600", children: [
              /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-blue-900 text-white", children: [
                /* @__PURE__ */ jsx("th", { className: "border border-blue-800 p-2 w-1/3" }),
                /* @__PURE__ */ jsx("th", { className: "border border-blue-800 p-2 w-1/6 text-center", children: __("Age Group 12-14") }),
                /* @__PURE__ */ jsx("th", { className: "border border-blue-800 p-2 w-1/6 text-center", children: __("Age Group 15-18") }),
                /* @__PURE__ */ jsx("th", { className: "border border-blue-800 p-2 w-1/6 text-center", children: __("Age Group 19+") })
              ] }) }),
              /* @__PURE__ */ jsxs("tbody", { children: [
                /* @__PURE__ */ jsxs("tr", { children: [
                  /* @__PURE__ */ jsx("td", { className: "border border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium", children: __("Youth Count per Age Group") }),
                  /* @__PURE__ */ jsx("td", { className: "border border-gray-300 dark:border-gray-600 p-2 text-center", children: stats.count_12_14 }),
                  /* @__PURE__ */ jsx("td", { className: "border border-gray-300 dark:border-gray-600 p-2 text-center", children: stats.count_15_18 }),
                  /* @__PURE__ */ jsx("td", { className: "border border-gray-300 dark:border-gray-600 p-2 text-center", children: stats.count_19_plus })
                ] }),
                /* @__PURE__ */ jsxs("tr", { children: [
                  /* @__PURE__ */ jsx("td", { className: "border border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium", children: __("RMD Group Count per Age Group") }),
                  /* @__PURE__ */ jsx("td", { className: "border border-gray-300 dark:border-gray-600 p-2 text-center", children: stats.groups_12_14 }),
                  /* @__PURE__ */ jsx("td", { className: "border border-gray-300 dark:border-gray-600 p-2 text-center", children: stats.groups_15_18 }),
                  /* @__PURE__ */ jsx("td", { className: "border border-gray-300 dark:border-gray-600 p-2 text-center", children: stats.groups_19_plus })
                ] }),
                /* @__PURE__ */ jsxs("tr", { className: "bg-blue-50 dark:bg-blue-900/20", children: [
                  /* @__PURE__ */ jsx("td", { className: "border border-gray-300 dark:border-gray-600 p-2 font-medium", children: __("Total Youth in PPA") }),
                  /* @__PURE__ */ jsx("td", { colSpan: "3", className: "border border-gray-300 dark:border-gray-600 p-2 text-center font-bold", children: stats.total_teens })
                ] }),
                /* @__PURE__ */ jsxs("tr", { className: "bg-blue-50 dark:bg-blue-900/20", children: [
                  /* @__PURE__ */ jsx("td", { className: "border border-gray-300 dark:border-gray-600 p-2 font-medium", children: __("Total RMD Groups in PPA") }),
                  /* @__PURE__ */ jsx("td", { colSpan: "3", className: "border border-gray-300 dark:border-gray-600 p-2 text-center font-bold", children: stats.total_groups })
                ] }),
                /* @__PURE__ */ jsxs("tr", { children: [
                  /* @__PURE__ */ jsx("td", { className: "border border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium", children: __("RMD Meeting Attendance Rate (Ch 1 - Ch 6)") }),
                  /* @__PURE__ */ jsx("td", { className: "border border-gray-300 dark:border-gray-600 p-2 text-center", children: stats.attendance["12_14"] ?? "-" }),
                  /* @__PURE__ */ jsx("td", { className: "border border-gray-300 dark:border-gray-600 p-2 text-center", children: stats.attendance["15_18"] ?? "-" }),
                  /* @__PURE__ */ jsx("td", { className: "border border-gray-300 dark:border-gray-600 p-2 text-center", children: stats.attendance["19_plus"] ?? "-" })
                ] })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-center mb-6 gap-4", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900 dark:text-gray-100 uppercase", children: __("Participant List (> 12 Years)") }),
              /* @__PURE__ */ jsx("div", { className: "w-full sm:w-64", children: /* @__PURE__ */ jsx(
                TextInput,
                {
                  type: "text",
                  placeholder: __("Search Name / ID..."),
                  value: search,
                  onChange: handleSearch,
                  className: "w-full"
                }
              ) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [
              /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 dark:bg-gray-700", children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: "px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __("ID Number") }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __("Full Name") }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __("Age") }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __("Age Group") }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __("Action") })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700", children: participants.data.length > 0 ? participants.data.map((participant) => {
                const birthDate = new Date(participant.date_of_birth);
                const today = /* @__PURE__ */ new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || m === 0 && today.getDate() < birthDate.getDate()) age--;
                let ageGroup = null;
                if (age >= 12 && age <= 14) ageGroup = "12-14";
                else if (age >= 15 && age <= 18) ageGroup = "15-18";
                else if (age >= 19) ageGroup = "19+";
                const ageGroupLabel = ageGroup ? `${__("KU")} ${ageGroup}` : __("Unknown");
                return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-700", children: [
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5 whitespace-nowrap text-sm font-medium text-indigo-600 dark:text-indigo-400", children: participant.id_number || "-" }),
                  /* @__PURE__ */ jsxs("td", { className: "px-6 py-2.5 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100", children: [
                    participant.first_name,
                    " ",
                    participant.last_name
                  ] }),
                  /* @__PURE__ */ jsxs("td", { className: "px-6 py-2.5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400", children: [
                    age,
                    " ",
                    __("year(s)")
                  ] }),
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5 whitespace-nowrap text-sm", children: /* @__PURE__ */ jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ageGroup === "12-14" ? "bg-green-100 text-green-800" : ageGroup === "15-18" ? "bg-blue-100 text-blue-800" : ageGroup === "19+" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-600"}`, children: ageGroupLabel }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5 whitespace-nowrap text-right text-sm font-medium", children: /* @__PURE__ */ jsx(
                    Link,
                    {
                      href: route("participants.show", participant.id),
                      className: "text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300",
                      children: __("Details")
                    }
                  ) })
                ] }, participant.id);
              }) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "5", className: "px-6 py-2.5 text-center text-sm text-gray-500 dark:text-gray-400", children: __("No participants over 12 years old.") }) }) })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(Pagination, { links: participants.links }) })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  RmdDashboard as default
};
