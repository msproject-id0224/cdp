import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-CKYSMoJT.js";
import { router, Head, Link } from "@inertiajs/react";
import { _ as __ } from "./lang-COBcTD8W.js";
import { P as Pagination } from "./Pagination-CRnq7q04.js";
import { T as TextInput } from "./TextInput-D0qTZeQv.js";
import { S as SelectInput } from "./SelectInput-inadq0Bq.js";
import { useState, useRef, useEffect } from "react";
import { P as ProfilePhoto } from "./ProfilePhoto-CJ2Z04pO.js";
import RmdDetailSummary from "./RmdDetailSummary-l8LO3MEm.js";
import axios from "axios";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "./ThemeToggle-BY9dagkZ.js";
import "./Modal-CKHW52Ki.js";
import "./SecondaryButton-TjIrbn1G.js";
import "./PrimaryButton-BNNL2gCI.js";
import "./DangerButton-B7to2Tbx.js";
import "./Footer-CDwTxrct.js";
import "./useTheme-CngFDcs1.js";
function RmdDrawer({ participant, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  useEffect(() => {
    if (!participant) return;
    setLoading(true);
    setError(null);
    axios.get(route("participants.rmd-summary", participant.id)).then((res) => setData(res.data)).catch(() => setError(__("Gagal memuat data RMD."))).finally(() => setLoading(false));
  }, [participant?.id]);
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);
  if (!participant) return null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-black/40 z-40 transition-opacity",
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "fixed inset-y-0 right-0 z-50 flex flex-col w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
          /* @__PURE__ */ jsx(
            ProfilePhoto,
            {
              src: participant.profile_photo_url,
              alt: participant.first_name,
              className: "w-9 h-9 rounded-full object-cover shrink-0",
              fallbackClassName: "w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0",
              fallback: (participant.first_name || "P").charAt(0).toUpperCase()
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-sm font-bold text-gray-900 dark:text-gray-100 truncate", children: [
              participant.first_name,
              " ",
              participant.last_name,
              participant.nickname && /* @__PURE__ */ jsxs("span", { className: "ml-1 text-xs font-normal text-gray-400", children: [
                "(",
                participant.nickname,
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: [
              participant.age ? `${participant.age} ${__("Years")}` : "",
              participant.gender ? ` · ${participant.gender}` : "",
              participant.education ? ` · ${participant.education}` : ""
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onClose,
            className: "ml-3 shrink-0 p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition",
            "aria-label": "Tutup",
            children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }) })
          }
        )
      ] }),
      data?.rmdProgress && /* @__PURE__ */ jsxs("div", { className: "px-5 py-3 bg-indigo-50 dark:bg-indigo-900/30 border-b border-indigo-100 dark:border-indigo-800 shrink-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold text-indigo-700 dark:text-indigo-300", children: [
            __("Progres RMD"),
            " — ",
            data.rmdProgress.filled_count,
            "/",
            data.rmdProgress.total_modules,
            " ",
            __("modul")
          ] }),
          /* @__PURE__ */ jsx("span", { className: `text-xs font-semibold px-2 py-0.5 rounded-full ${data.rmdProgress.overall_status === "Selesai" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : data.rmdProgress.overall_status === "Sedang Mengisi" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"}`, children: data.rmdProgress.overall_status })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-full bg-indigo-200 dark:bg-indigo-800 rounded-full h-2", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: `h-2 rounded-full transition-all ${data.rmdProgress.overall_percentage === 100 ? "bg-green-500" : "bg-indigo-500"}`,
            style: { width: `${data.rmdProgress.overall_percentage}%` }
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-5", children: [
        loading && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-40", children: /* @__PURE__ */ jsxs("svg", { className: "animate-spin w-8 h-8 text-indigo-500", fill: "none", viewBox: "0 0 24 24", children: [
          /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
          /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8v8z" })
        ] }) }),
        error && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-40 text-sm text-red-500", children: error }),
        !loading && !error && data && /* @__PURE__ */ jsx(RmdDetailSummary, { rmdDetail: data.rmdDetail, rmdProgress: data.rmdProgress })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "px-5 py-3 border-t border-gray-200 dark:border-gray-700 shrink-0 flex justify-between items-center", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("participants.show", participant.id),
            className: "text-xs text-indigo-600 dark:text-indigo-400 hover:underline",
            children: [
              __("Buka halaman detail lengkap"),
              " →"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onClose,
            className: "px-3 py-1.5 text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition",
            children: __("Tutup")
          }
        )
      ] })
    ] })
  ] });
}
function ParticipantIndex({ auth, participants, filters, mentors }) {
  const isAdmin = auth?.user?.role === "admin";
  const isMentorOrAdmin = auth?.user?.role === "admin" || auth?.user?.role === "mentor";
  const [queryParams, setQueryParams] = useState({
    search: filters.search || "",
    status: filters.status || "",
    gender: filters.gender || "",
    age_group: filters.age_group || "",
    sort_by: filters.sort_by || "created_at",
    sort_direction: filters.sort_direction || "desc",
    per_page: filters.per_page || "10"
  });
  const [rmdParticipant, setRmdParticipant] = useState(null);
  const isFirstRender = useRef(true);
  const formatIdNumber = (idNumber) => {
    if (!idNumber) return "-";
    const str = idNumber.toString();
    const prefix = "ID-0224";
    if (str.startsWith(prefix)) return str;
    return prefix + str.padStart(5, "0");
  };
  const toggleStatus = (id) => {
    if (!isAdmin) return;
    router.patch(route("participants.toggle-status", id));
  };
  const handleAssignMentor = (participantId, mentorId) => {
    if (!isAdmin) return;
    router.patch(route("participants.assign-mentor", participantId), { mentor_id: mentorId }, { preserveScroll: true });
  };
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const id = setTimeout(() => {
      router.get(route("participants.index"), queryParams, {
        preserveState: true,
        preserveScroll: true,
        replace: true
      });
    }, 300);
    return () => clearTimeout(id);
  }, [queryParams]);
  const handleSort = (column) => {
    setQueryParams((prev) => ({
      ...prev,
      sort_by: column,
      sort_direction: prev.sort_by === column && prev.sort_direction === "asc" ? "desc" : "asc"
    }));
  };
  const SortIcon = ({ column }) => {
    if (queryParams.sort_by !== column) return /* @__PURE__ */ jsx("span", { className: "ml-1 text-gray-400", children: "⇅" });
    return queryParams.sort_direction === "asc" ? /* @__PURE__ */ jsx("span", { className: "ml-1", children: "↑" }) : /* @__PURE__ */ jsx("span", { className: "ml-1", children: "↓" });
  };
  const isRmdEligible = (p) => {
    if (p.date_of_birth) {
      const birth = new Date(p.date_of_birth);
      const diff = (/* @__PURE__ */ new Date() - birth) / (365.25 * 24 * 3600 * 1e3);
      return diff >= 12;
    }
    return typeof p.age === "number" && p.age >= 12;
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200", children: __("Participant List") }),
        isAdmin && /* @__PURE__ */ jsx(
          Link,
          {
            href: route("participants.create"),
            className: "inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150",
            children: __("Add Participant")
          }
        )
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("Participant List") }),
        rmdParticipant && /* @__PURE__ */ jsx(
          RmdDrawer,
          {
            participant: rmdParticipant,
            onClose: () => setRmdParticipant(null)
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "bg-white overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-800 p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-4 mb-6", children: [
            /* @__PURE__ */ jsx("div", { className: "w-full md:w-1/3", children: /* @__PURE__ */ jsx(
              TextInput,
              {
                placeholder: __("Search..."),
                className: "w-full",
                value: queryParams.search,
                onChange: (e) => setQueryParams({ ...queryParams, search: e.target.value })
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "w-full md:w-1/4", children: /* @__PURE__ */ jsxs(
              SelectInput,
              {
                className: "w-full",
                value: queryParams.status,
                onChange: (e) => setQueryParams({ ...queryParams, status: e.target.value }),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: __("All Status") }),
                  /* @__PURE__ */ jsx("option", { value: "active", children: __("Active") }),
                  /* @__PURE__ */ jsx("option", { value: "inactive", children: __("Inactive") })
                ]
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "w-full md:w-1/4", children: /* @__PURE__ */ jsxs(
              SelectInput,
              {
                className: "w-full",
                value: queryParams.gender,
                onChange: (e) => setQueryParams({ ...queryParams, gender: e.target.value }),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: __("All Gender") }),
                  /* @__PURE__ */ jsx("option", { value: "Laki-laki", children: __("Laki-laki") }),
                  /* @__PURE__ */ jsx("option", { value: "Perempuan", children: __("Perempuan") })
                ]
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "w-full md:w-1/4", children: /* @__PURE__ */ jsxs(
              SelectInput,
              {
                className: "w-full",
                value: queryParams.age_group,
                onChange: (e) => setQueryParams({ ...queryParams, age_group: e.target.value }),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: __("All Age Groups") }),
                  /* @__PURE__ */ jsx("option", { value: "0-2", children: __("0-2") }),
                  /* @__PURE__ */ jsx("option", { value: "3-5", children: __("3-5") }),
                  /* @__PURE__ */ jsx("option", { value: "6-8", children: __("6-8") }),
                  /* @__PURE__ */ jsx("option", { value: "9-11", children: __("9-11") }),
                  /* @__PURE__ */ jsx("option", { value: "12-14", children: __("12-14") }),
                  /* @__PURE__ */ jsx("option", { value: "15-18", children: __("15-18") }),
                  /* @__PURE__ */ jsx("option", { value: "19+", children: __("19+") })
                ]
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "w-full md:w-1/6", children: /* @__PURE__ */ jsxs(
              SelectInput,
              {
                className: "w-full",
                value: queryParams.per_page,
                onChange: (e) => setQueryParams({ ...queryParams, per_page: e.target.value }),
                children: [
                  /* @__PURE__ */ jsxs("option", { value: "10", children: [
                    "10 / ",
                    __("Page")
                  ] }),
                  /* @__PURE__ */ jsxs("option", { value: "25", children: [
                    "25 / ",
                    __("Page")
                  ] }),
                  /* @__PURE__ */ jsxs("option", { value: "50", children: [
                    "50 / ",
                    __("Page")
                  ] }),
                  /* @__PURE__ */ jsxs("option", { value: "100", children: [
                    "100 / ",
                    __("Page")
                  ] }),
                  /* @__PURE__ */ jsxs("option", { value: "250", children: [
                    "250 / ",
                    __("Page")
                  ] })
                ]
              }
            ) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 dark:bg-gray-700", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsxs("th", { onClick: () => handleSort("first_name"), className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600", children: [
                __("Name"),
                " ",
                /* @__PURE__ */ jsx(SortIcon, { column: "first_name" })
              ] }),
              /* @__PURE__ */ jsxs("th", { onClick: () => handleSort("id_number"), className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 hidden md:table-cell", children: [
                __("ID"),
                " ",
                /* @__PURE__ */ jsx(SortIcon, { column: "id_number" })
              ] }),
              /* @__PURE__ */ jsxs("th", { onClick: () => handleSort("age"), className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600", children: [
                __("Age/Gender"),
                " ",
                /* @__PURE__ */ jsx(SortIcon, { column: "age" })
              ] }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 hidden lg:table-cell", children: __("Age Group") }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300", children: __("Status") }),
              isAdmin && /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 hidden lg:table-cell", children: __("Assigned Mentor") }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 hidden lg:table-cell", children: __("Last Update") }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300", children: __("Actions") })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700", children: participants.data && participants.data.length > 0 ? participants.data.map((participant) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out", children: [
              /* @__PURE__ */ jsx("td", { className: "px-4 py-2 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsx(
                  ProfilePhoto,
                  {
                    src: participant.profile_photo_url,
                    alt: participant.first_name,
                    className: "w-8 h-8 rounded-full object-cover",
                    fallbackClassName: "w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold text-xs",
                    fallback: (participant.first_name || "P").charAt(0).toUpperCase()
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsxs(
                    Link,
                    {
                      href: route("participants.show", participant.id),
                      className: "text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline",
                      children: [
                        participant.first_name,
                        " ",
                        participant.last_name
                      ]
                    }
                  ),
                  participant.nickname && /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-gray-500 dark:text-gray-400", children: [
                    "(",
                    participant.nickname,
                    ")"
                  ] })
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-2 whitespace-nowrap hidden md:table-cell", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300", children: formatIdNumber(participant.id_number) }) }),
              /* @__PURE__ */ jsxs("td", { className: "px-4 py-2 whitespace-nowrap", children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-900 dark:text-gray-100", children: participant.age ? `${participant.age} ${__("Years")}` : "-" }),
                /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 dark:text-gray-400", children: participant.gender ? __(participant.gender) : "-" })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400 hidden lg:table-cell", children: participant.age_group ? __(participant.age_group) : "-" }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-2 whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: `px-2 inline-flex text-[10px] leading-5 font-semibold rounded-full ${participant.is_active ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}`, children: participant.is_active ? __("Active") : __("Inactive") }) }),
              isAdmin && /* @__PURE__ */ jsx("td", { className: "px-4 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400 hidden lg:table-cell", children: /* @__PURE__ */ jsxs(
                "select",
                {
                  className: "block w-full py-1 px-2 text-xs border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm",
                  value: participant.mentor_id || "",
                  onChange: (e) => handleAssignMentor(participant.id, e.target.value),
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: __("Unassigned") }),
                    mentors && mentors.map((mentor) => /* @__PURE__ */ jsx("option", { value: mentor.id, children: mentor.name }, mentor.id))
                  ]
                }
              ) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-2 whitespace-nowrap text-xs text-gray-700 dark:text-gray-300 font-mono hidden lg:table-cell", children: participant.updated_at ? (() => {
                const d = new Date(participant.updated_at);
                return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getFullYear()).slice(-2)}`;
              })() : "-" }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-2 whitespace-nowrap text-xs font-medium", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                isAdmin && /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route("participants.edit", participant.id),
                    className: "text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300",
                    children: __("Edit")
                  }
                ),
                isAdmin && /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => toggleStatus(participant.id),
                    className: `${participant.is_active ? "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" : "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"}`,
                    children: participant.is_active ? __("Deactivate") : __("Activate")
                  }
                ),
                isMentorOrAdmin && isRmdEligible(participant) && /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => setRmdParticipant(participant),
                    className: "inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-[10px] font-semibold transition",
                    children: [
                      /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }),
                      "RMD"
                    ]
                  }
                )
              ] }) })
            ] }, participant.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: isAdmin ? 8 : 7, className: "px-6 py-2.5 text-center text-sm text-gray-500 dark:text-gray-400", children: __("No participants found.") }) }) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(Pagination, { links: participants.links }) })
        ] }) }) })
      ]
    }
  );
}
export {
  ParticipantIndex as default
};
