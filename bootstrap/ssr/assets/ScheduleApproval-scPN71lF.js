import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import idLocale from "@fullcalendar/core/locales/id";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BG6RGD2S.js";
import { usePage, Head } from "@inertiajs/react";
import { u as useTrans } from "./lang-COBcTD8W.js";
import axios from "axios";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "./ThemeToggle-BY9dagkZ.js";
import "./TextInput-D0qTZeQv.js";
import "./ProfilePhoto-CJ2Z04pO.js";
import "./Modal-CKHW52Ki.js";
import "./SecondaryButton-TjIrbn1G.js";
import "./PrimaryButton-BNNL2gCI.js";
import "./DangerButton-B7to2Tbx.js";
import "./Footer-B7ihPSZ8.js";
import "./useTheme-CngFDcs1.js";
function ScheduleApproval({ auth }) {
  const __ = useTrans();
  const { locale } = usePage().props;
  const AGENDA_LABELS = {
    pengisian_rmd: __("Pengisian RMD"),
    pertemuan_umum: __("Pertemuan Umum"),
    rapat_youth: __("Rapat Youth"),
    lainnya: __("Others")
  };
  const [schedules, setSchedules] = useState({ data: [], meta: {} });
  const [calendarSchedules, setCalendarSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [showBanner, setShowBanner] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    start_date: "",
    end_date: "",
    sort_by: "created_at",
    sort_order: "desc"
  });
  const [modal, setModal] = useState({ show: false, type: "", data: null });
  const [reason, setReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [notification, setNotification] = useState(null);
  const tableRef = useRef(null);
  const [deletionRequests, setDeletionRequests] = useState({ data: [], total: 0 });
  const [deletionLoading, setDeletionLoading] = useState(true);
  const fetchCalendarSchedules = async () => {
    try {
      const response = await axios.get(route("api.admin.schedules.pending"), {
        params: { per_page: 500, sort_by: "scheduled_at", sort_order: "asc" }
      });
      setCalendarSchedules(response.data.data || []);
    } catch (error) {
      console.error("Error fetching calendar schedules:", error);
    }
  };
  const fetchSchedules = async (page = 1) => {
    setLoading(true);
    try {
      const params = { ...filters, page };
      const response = await axios.get(route("api.admin.schedules.pending"), { params });
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchDeletionRequests = async () => {
    setDeletionLoading(true);
    try {
      const response = await axios.get(route("api.admin.schedules.deletion-requests"), {
        params: { per_page: 50 }
      });
      setDeletionRequests(response.data);
    } catch (error) {
      console.error("Error fetching deletion requests:", error);
    } finally {
      setDeletionLoading(false);
    }
  };
  useEffect(() => {
    fetchCalendarSchedules();
    fetchDeletionRequests();
  }, []);
  useEffect(() => {
    fetchSchedules();
  }, [filters]);
  const refreshAll = () => {
    fetchCalendarSchedules();
    fetchSchedules();
    fetchDeletionRequests();
  };
  const calendarEvents = calendarSchedules.map((s) => ({
    id: `pending-${s.id}`,
    title: `${s.mentor?.name ?? __("Mentor")} — ${AGENDA_LABELS[s.agenda_type] ?? s.agenda ?? __("Meeting")}`,
    start: s.scheduled_at,
    end: s.end_time,
    backgroundColor: "#F59E0B",
    borderColor: "#D97706",
    textColor: "#1C1917",
    extendedProps: { schedule: s }
  }));
  const handleCalendarEventClick = ({ event }) => {
    openModal("preview", event.extendedProps.schedule);
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  const handleSelectSchedule = (id) => {
    setSelectedSchedules(
      (prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };
  const handleSelectAll = (e) => {
    setSelectedSchedules(e.target.checked ? schedules.data.map((s) => s.id) : []);
  };
  const openModal = (type, data = null) => {
    setModal({ show: true, type, data });
    setReason("");
  };
  const closeModal = () => {
    setModal({ show: false, type: "", data: null });
    setReason("");
  };
  const handleAction = async () => {
    setProcessing(true);
    try {
      if (modal.type === "approve") {
        await axios.post(route("api.admin.schedules.approve", modal.data.id));
      } else if (modal.type === "reject") {
        await axios.post(route("api.admin.schedules.reject", modal.data.id), { reason });
      } else if (modal.type === "request_modification") {
        await axios.post(route("api.admin.schedules.request-modification", modal.data.id), { reason });
      } else if (modal.type === "bulk_approve") {
        await axios.post(route("api.admin.schedules.bulk-approve"), { ids: selectedSchedules });
        setSelectedSchedules([]);
      } else if (modal.type === "bulk_reject") {
        await axios.post(route("api.admin.schedules.bulk-reject"), { ids: selectedSchedules, reason });
        setSelectedSchedules([]);
      } else if (modal.type === "approve_deletion") {
        await axios.post(route("api.admin.schedules.approve-deletion", modal.data.id));
      } else if (modal.type === "reject_deletion") {
        await axios.post(route("api.admin.schedules.reject-deletion", modal.data.id), { reason });
      }
      closeModal();
      refreshAll();
      const successMessages = {
        approve: __("Schedule approved successfully."),
        reject: __("Schedule rejected successfully."),
        request_modification: __("Modification requested successfully."),
        bulk_approve: __("Schedules approved successfully."),
        bulk_reject: __("Schedules rejected successfully."),
        approve_deletion: __("Meeting deleted successfully."),
        reject_deletion: __("Deletion request rejected. Meeting has been restored.")
      };
      showNotification("success", successMessages[modal.type] ?? __("Action completed successfully."));
    } catch (error) {
      console.error("Error performing action:", error);
      showNotification("error", __("An error occurred. Please try again."));
    } finally {
      setProcessing(false);
    }
  };
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };
  const handleSort = (field) => {
    setFilters((prev) => ({
      ...prev,
      sort_by: field,
      sort_order: prev.sort_by === field && prev.sort_order === "asc" ? "desc" : "asc"
    }));
  };
  const renderSortIcon = (field) => {
    if (filters.sort_by !== field) return null;
    return filters.sort_order === "asc" ? " ↑" : " ↓";
  };
  const pendingCount = calendarSchedules.length;
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      user: auth.user,
      header: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold text-xl text-gray-800 leading-tight", children: __("Schedule Approval Dashboard") }),
        pendingCount > 0 && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300", children: [
          pendingCount,
          " ",
          __("pending")
        ] })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("Schedule Approval") }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6", children: [
          showBanner && pendingCount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 p-4 bg-amber-50 border border-amber-300 rounded-xl shadow-sm", children: [
            /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-amber-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" }) }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-amber-800", children: pendingCount === 1 ? __("There is 1 mentor schedule waiting for your approval.") : __("There are :count mentor schedules waiting for your approval.").replace(":count", pendingCount) }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-600 mt-0.5", children: __("Review the calendar below and approve or reject each schedule.") }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => tableRef.current?.scrollIntoView({ behavior: "smooth" }),
                  className: "mt-2 text-xs font-semibold text-amber-700 underline hover:text-amber-900",
                  children: __("Go to schedule list →")
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setShowBanner(false),
                className: "flex-shrink-0 text-amber-500 hover:text-amber-700 p-1 rounded",
                title: __("Dismiss"),
                children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white overflow-hidden shadow-sm sm:rounded-xl p-6", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-base font-semibold text-gray-800 mb-4 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-amber-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
              __("Pending Meeting Calendar"),
              /* @__PURE__ */ jsxs("span", { className: "ml-auto flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5", children: [
                /* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" }),
                __("Pending Approval")
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              FullCalendar,
              {
                plugins: [dayGridPlugin, interactionPlugin],
                locale: locale === "id" ? idLocale : "en",
                headerToolbar: {
                  left: "prev,next today",
                  center: "title",
                  right: ""
                },
                initialView: "dayGridMonth",
                events: calendarEvents,
                eventClick: handleCalendarEventClick,
                dayMaxEvents: 3,
                height: "auto",
                eventTimeFormat: { hour: "2-digit", minute: "2-digit", hour12: false },
                dayCellClassNames: (arg) => {
                  const dateStr = arg.date.toISOString().split("T")[0];
                  const hasPending = calendarSchedules.some(
                    (s) => s.scheduled_at && s.scheduled_at.startsWith(dateStr)
                  );
                  return hasPending ? ["fc-day-pending"] : [];
                }
              }
            ),
            /* @__PURE__ */ jsx("style", { children: `
                            .fc-day-pending { background-color: #FFFBEB !important; }
                            .fc-day-pending .fc-daygrid-day-number { color: #B45309; font-weight: 700; }
                            .fc-event { cursor: pointer; border-radius: 4px; font-size: 0.75rem; }

                            @media (max-width: 640px) {
                                .fc .fc-toolbar {
                                    display: flex;
                                    flex-wrap: wrap;
                                    gap: 4px;
                                    align-items: center;
                                }
                                .fc .fc-toolbar-chunk:nth-child(2) {
                                    order: -1;
                                    width: 100%;
                                    text-align: center;
                                }
                                .fc .fc-toolbar-title { font-size: 1.1rem; }
                                .fc .fc-button {
                                    padding: 0.2rem 0.45rem;
                                    font-size: 0.7rem;
                                }
                                .fc .fc-button .fc-icon { font-size: 0.9rem; }
                                .fc .fc-daygrid-day-frame {
                                    min-height: unset !important;
                                    aspect-ratio: 1 / 1;
                                    overflow: hidden;
                                }
                                .fc .fc-daygrid-day-number {
                                    font-size: 0.65rem;
                                    padding: 2px 3px !important;
                                }
                                .fc .fc-daygrid-event {
                                    height: 5px;
                                    border-radius: 3px;
                                    margin: 1px 2px !important;
                                }
                                .fc .fc-event-title,
                                .fc .fc-event-time { display: none; }
                                .fc .fc-daygrid-more-link { font-size: 0.6rem; }
                            }
                        ` })
          ] }),
          /* @__PURE__ */ jsxs("div", { ref: tableRef, className: "bg-white overflow-hidden shadow-sm sm:rounded-xl p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center mb-6 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 w-full md:w-auto", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "search",
                    placeholder: __("Search mentor or agenda..."),
                    className: "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm",
                    value: filters.search,
                    onChange: handleFilterChange
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "date",
                    name: "start_date",
                    className: "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm",
                    value: filters.start_date,
                    onChange: handleFilterChange
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "date",
                    name: "end_date",
                    className: "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm",
                    value: filters.end_date,
                    onChange: handleFilterChange
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                selectedSchedules.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: () => openModal("bulk_approve"),
                      className: "bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow transition",
                      children: [
                        __("Approve"),
                        " (",
                        selectedSchedules.length,
                        ")"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: () => openModal("bulk_reject"),
                      className: "bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow transition",
                      children: [
                        __("Reject"),
                        " (",
                        selectedSchedules.length,
                        ")"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: refreshAll,
                    className: "bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded shadow transition",
                    children: __("Refresh")
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [
              /* @__PURE__ */ jsx("thead", { className: "bg-amber-50", children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    onChange: handleSelectAll,
                    checked: schedules.data.length > 0 && selectedSchedules.length === schedules.data.length,
                    className: "rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  }
                ) }),
                /* @__PURE__ */ jsxs(
                  "th",
                  {
                    scope: "col",
                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-amber-100",
                    onClick: () => handleSort("mentor.name"),
                    children: [
                      __("Mentor"),
                      " ",
                      renderSortIcon("mentor.name")
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "th",
                  {
                    scope: "col",
                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-amber-100",
                    onClick: () => handleSort("agenda"),
                    children: [
                      __("Agenda"),
                      " ",
                      renderSortIcon("agenda")
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "th",
                  {
                    scope: "col",
                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-amber-100",
                    onClick: () => handleSort("scheduled_at"),
                    children: [
                      __("Date & Time"),
                      " ",
                      renderSortIcon("scheduled_at")
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: __("Participants") }),
                /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: __("Actions") })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: loading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "6", className: "px-6 py-4 text-center text-gray-500", children: __("Loading schedules...") }) }) : schedules.data.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", { colSpan: "6", className: "px-6 py-12 text-center text-gray-400", children: [
                /* @__PURE__ */ jsx("svg", { className: "mx-auto h-10 w-10 mb-2 text-gray-300", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }),
                __("No pending schedules found.")
              ] }) }) : schedules.data.map((schedule) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-amber-50 transition", children: [
                /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: selectedSchedules.includes(schedule.id),
                    onChange: () => handleSelectSchedule(schedule.id),
                    className: "rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  }
                ) }),
                /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-gray-900", children: schedule.mentor ? schedule.mentor.name : __("Unknown") }),
                  /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: schedule.mentor ? schedule.mentor.email : "" })
                ] }),
                /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
                  schedule.agenda_type && /* @__PURE__ */ jsx("span", { className: "inline-block px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-700 mb-1", children: AGENDA_LABELS[schedule.agenda_type] ?? schedule.agenda_type }),
                  schedule.agenda && /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-900", children: schedule.agenda }),
                  schedule.notes && /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 truncate max-w-xs", title: schedule.notes, children: schedule.notes })
                ] }),
                /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-gray-900", children: new Date(schedule.scheduled_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500", children: [
                    new Date(schedule.scheduled_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
                    " –",
                    new Date(schedule.end_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex -space-x-2 overflow-hidden", children: [
                    schedule.participants && schedule.participants.slice(0, 3).map((p) => /* @__PURE__ */ jsx("div", { className: "inline-flex h-8 w-8 rounded-full ring-2 ring-white bg-indigo-200 items-center justify-center text-xs font-bold text-indigo-700", title: p.name, children: p.name?.charAt(0) }, p.id)),
                    schedule.participants && schedule.participants.length > 3 && /* @__PURE__ */ jsxs("div", { className: "inline-flex h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 items-center justify-center text-xs font-medium text-gray-500", children: [
                      "+",
                      schedule.participants.length - 3
                    ] })
                  ] }),
                  (!schedule.participants || schedule.participants.length === 0) && /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400", children: __("No participants") })
                ] }),
                /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2", children: [
                  /* @__PURE__ */ jsx("button", { onClick: () => openModal("preview", schedule), className: "text-indigo-600 hover:text-indigo-900", children: __("Preview") }),
                  /* @__PURE__ */ jsx("button", { onClick: () => openModal("approve", schedule), className: "text-green-600 hover:text-green-900", children: __("Approve") }),
                  /* @__PURE__ */ jsx("button", { onClick: () => openModal("request_modification", schedule), className: "text-yellow-600 hover:text-yellow-900", children: __("Modify") }),
                  /* @__PURE__ */ jsx("button", { onClick: () => openModal("reject", schedule), className: "text-red-600 hover:text-red-900", children: __("Reject") })
                ] })
              ] }, schedule.id)) })
            ] }) }),
            (schedules.next_page_url || schedules.prev_page_url) && /* @__PURE__ */ jsxs("div", { className: "mt-4 flex justify-between items-center", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => fetchSchedules(schedules.current_page - 1),
                  disabled: !schedules.prev_page_url,
                  className: "px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50",
                  children: __("Previous")
                }
              ),
              /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-700", children: [
                __("Page"),
                " ",
                schedules.current_page,
                " ",
                __("of"),
                " ",
                schedules.last_page
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => fetchSchedules(schedules.current_page + 1),
                  disabled: !schedules.next_page_url,
                  className: "px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50",
                  children: __("Next")
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white overflow-hidden shadow-sm sm:rounded-xl p-6", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-base font-semibold text-gray-800 mb-4 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-red-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }),
              __("Deletion Requests"),
              (deletionRequests.total ?? 0) > 0 && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300", children: [
                deletionRequests.total,
                " ",
                __("pending")
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [
              /* @__PURE__ */ jsx("thead", { className: "bg-red-50", children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: __("Mentor") }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: __("Agenda") }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: __("Date & Time") }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: __("Participants") }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: __("Actions") })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: deletionLoading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "5", className: "px-6 py-4 text-center text-gray-500", children: __("Loading...") }) }) : (deletionRequests.data ?? []).length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", { colSpan: "5", className: "px-6 py-12 text-center text-gray-400", children: [
                /* @__PURE__ */ jsx("svg", { className: "mx-auto h-10 w-10 mb-2 text-gray-300", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }),
                __("No pending deletion requests.")
              ] }) }) : (deletionRequests.data ?? []).map((schedule) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-red-50 transition", children: [
                /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-gray-900", children: schedule.mentor ? `${schedule.mentor.first_name ?? ""} ${schedule.mentor.last_name ?? ""}`.trim() || __("Unknown") : __("Unknown") }),
                  /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: schedule.mentor?.email })
                ] }),
                /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
                  schedule.agenda_type && /* @__PURE__ */ jsx("span", { className: "inline-block px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-700 mb-1", children: AGENDA_LABELS[schedule.agenda_type] ?? schedule.agenda_type }),
                  /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-900", children: schedule.agenda })
                ] }),
                /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-gray-900", children: new Date(schedule.scheduled_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500", children: [
                    new Date(schedule.scheduled_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
                    " –",
                    " ",
                    new Date(schedule.end_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex -space-x-2 overflow-hidden", children: [
                    (schedule.participants ?? []).slice(0, 3).map((p) => /* @__PURE__ */ jsx("div", { className: "inline-flex h-8 w-8 rounded-full ring-2 ring-white bg-indigo-200 items-center justify-center text-xs font-bold text-indigo-700", title: p.name, children: p.name?.charAt(0) }, p.id)),
                    (schedule.participants ?? []).length > 3 && /* @__PURE__ */ jsxs("div", { className: "inline-flex h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 items-center justify-center text-xs font-medium text-gray-500", children: [
                      "+",
                      schedule.participants.length - 3
                    ] })
                  ] }),
                  !(schedule.participants ?? []).length && /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400", children: __("No participants") })
                ] }),
                /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => openModal("approve_deletion", schedule),
                      className: "text-red-600 hover:text-red-900 font-semibold",
                      children: __("Approve Deletion")
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => openModal("reject_deletion", schedule),
                      className: "text-gray-600 hover:text-gray-900",
                      children: __("Reject")
                    }
                  )
                ] })
              ] }, schedule.id)) })
            ] }) })
          ] })
        ] }) }),
        notification && /* @__PURE__ */ jsx("div", { className: `fixed top-4 right-4 z-[200] px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all ${notification.type === "success" ? "bg-green-600" : "bg-red-600"}`, children: notification.message }),
        modal.show && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto", "aria-labelledby": "modal-title", role: "dialog", "aria-modal": "true", children: /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0", children: [
          /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity", "aria-hidden": "true", onClick: closeModal }),
          /* @__PURE__ */ jsx("span", { className: "hidden sm:inline-block sm:align-middle sm:h-screen", "aria-hidden": "true", children: "​" }),
          /* @__PURE__ */ jsxs("div", { className: "inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4", children: /* @__PURE__ */ jsx("div", { className: "sm:flex sm:items-start", children: /* @__PURE__ */ jsxs("div", { className: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full", children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-lg leading-6 font-medium text-gray-900", id: "modal-title", children: [
                modal.type === "approve" && __("Approve Schedule"),
                modal.type === "reject" && __("Reject Schedule"),
                modal.type === "request_modification" && __("Request Modification"),
                modal.type === "bulk_approve" && __("Bulk Approve Schedules"),
                modal.type === "bulk_reject" && __("Bulk Reject Schedules"),
                modal.type === "preview" && __("Schedule Details"),
                modal.type === "approve_deletion" && __("Approve Deletion"),
                modal.type === "reject_deletion" && __("Reject Deletion Request")
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-2", children: modal.type === "preview" ? /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500 space-y-2", children: [
                /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsxs("strong", { children: [
                    __("Mentor"),
                    ":"
                  ] }),
                  " ",
                  modal.data.mentor?.name
                ] }),
                modal.data.agenda_type && /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsxs("strong", { children: [
                    __("Agenda Type"),
                    ":"
                  ] }),
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "inline-block px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-700", children: AGENDA_LABELS[modal.data.agenda_type] ?? modal.data.agenda_type })
                ] }),
                modal.data.agenda && /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsxs("strong", { children: [
                    __("Agenda"),
                    ":"
                  ] }),
                  " ",
                  modal.data.agenda
                ] }),
                modal.data.tools_materials && /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsxs("strong", { children: [
                    __("Tools & Materials"),
                    ":"
                  ] }),
                  " ",
                  modal.data.tools_materials
                ] }),
                /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsxs("strong", { children: [
                    __("Date"),
                    ":"
                  ] }),
                  " ",
                  new Date(modal.data.scheduled_at).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
                ] }),
                /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsxs("strong", { children: [
                    __("Time"),
                    ":"
                  ] }),
                  " ",
                  new Date(modal.data.scheduled_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
                  " – ",
                  new Date(modal.data.end_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
                ] }),
                /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsxs("strong", { children: [
                    __("Location"),
                    ":"
                  ] }),
                  " ",
                  modal.data.location || __("N/A")
                ] }),
                modal.data.meeting_link && /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsxs("strong", { children: [
                    __("Meeting Link"),
                    ":"
                  ] }),
                  " ",
                  /* @__PURE__ */ jsx("a", { href: modal.data.meeting_link, target: "_blank", rel: "noreferrer", className: "text-indigo-600 underline", children: modal.data.meeting_link })
                ] }),
                /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsxs("strong", { children: [
                    __("Notes"),
                    ":"
                  ] }),
                  " ",
                  modal.data.notes || __("N/A")
                ] }),
                /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsxs("strong", { children: [
                  __("Participants"),
                  ":"
                ] }) }),
                /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5", children: modal.data.participants && modal.data.participants.map((p) => /* @__PURE__ */ jsx("li", { children: p.name }, p.id)) }),
                /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2", children: [
                  /* @__PURE__ */ jsx("button", { onClick: () => {
                    closeModal();
                    openModal("approve", modal.data);
                  }, className: "px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded hover:bg-green-200 transition", children: __("Approve") }),
                  /* @__PURE__ */ jsx("button", { onClick: () => {
                    closeModal();
                    openModal("request_modification", modal.data);
                  }, className: "px-3 py-1.5 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition", children: __("Modify") }),
                  /* @__PURE__ */ jsx("button", { onClick: () => {
                    closeModal();
                    openModal("reject", modal.data);
                  }, className: "px-3 py-1.5 text-xs font-semibold bg-red-100 text-red-700 rounded hover:bg-red-200 transition", children: __("Reject") })
                ] })
              ] }) : modal.type === "approve_deletion" ? /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500 space-y-2", children: [
                /* @__PURE__ */ jsx("p", { className: "text-red-600 font-medium", children: __("This will permanently delete the meeting. This action cannot be undone.") }),
                /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsxs("strong", { children: [
                    __("Mentor"),
                    ":"
                  ] }),
                  " ",
                  modal.data?.mentor ? `${modal.data.mentor.first_name ?? ""} ${modal.data.mentor.last_name ?? ""}`.trim() : __("Unknown")
                ] }),
                /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsxs("strong", { children: [
                    __("Agenda"),
                    ":"
                  ] }),
                  " ",
                  modal.data?.agenda
                ] }),
                /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsxs("strong", { children: [
                    __("Date"),
                    ":"
                  ] }),
                  " ",
                  modal.data?.scheduled_at && new Date(modal.data.scheduled_at).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
                ] })
              ] }) : modal.type === "reject_deletion" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-4", children: __("Provide a reason for rejecting the deletion request. The meeting will be restored to scheduled.") }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    className: "w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500",
                    rows: "3",
                    placeholder: __("Enter reason..."),
                    value: reason,
                    onChange: (e) => setReason(e.target.value)
                  }
                )
              ] }) : modal.type === "bulk_approve" ? /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: __("Are you sure you want to approve :count selected schedules?").replace(":count", selectedSchedules.length) }) : modal.type === "bulk_reject" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-4", children: __("Are you sure you want to reject :count selected schedules?").replace(":count", selectedSchedules.length) }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    className: "w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500",
                    rows: "4",
                    placeholder: __("Enter reason for rejection..."),
                    value: reason,
                    onChange: (e) => setReason(e.target.value)
                  }
                )
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 mb-4", children: [
                  modal.type === "approve" && __('Are you sure you want to approve ":agenda"?').replace(":agenda", AGENDA_LABELS[modal.data.agenda_type] ?? modal.data.agenda ?? ""),
                  modal.type === "reject" && __('Please provide a reason for rejecting ":agenda".').replace(":agenda", AGENDA_LABELS[modal.data.agenda_type] ?? modal.data.agenda ?? ""),
                  modal.type === "request_modification" && __('Please provide feedback for ":agenda".').replace(":agenda", AGENDA_LABELS[modal.data.agenda_type] ?? modal.data.agenda ?? "")
                ] }),
                (modal.type === "reject" || modal.type === "request_modification") && /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    className: "w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500",
                    rows: "4",
                    placeholder: __("Enter reason or feedback..."),
                    value: reason,
                    onChange: (e) => setReason(e.target.value)
                  }
                )
              ] }) })
            ] }) }) }),
            /* @__PURE__ */ jsx("div", { className: "bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse", children: modal.type !== "preview" ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: handleAction,
                  disabled: processing || (modal.type === "reject" || modal.type === "bulk_reject" || modal.type === "request_modification" || modal.type === "reject_deletion") && !reason.trim(),
                  className: `w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${modal.type === "reject" || modal.type === "bulk_reject" || modal.type === "approve_deletion" ? "bg-red-600 hover:bg-red-700 focus:ring-red-500" : modal.type === "request_modification" || modal.type === "reject_deletion" ? "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500" : "bg-green-600 hover:bg-green-700 focus:ring-green-500"} disabled:opacity-50`,
                  children: processing ? __("Processing...") : __("Confirm")
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: closeModal,
                  className: "mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm",
                  children: __("Cancel")
                }
              )
            ] }) : /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: closeModal,
                className: "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm",
                children: __("Close")
              }
            ) })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  ScheduleApproval as default
};
