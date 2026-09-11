import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-DY-v4bup.js";
import { usePage, useForm, Head } from "@inertiajs/react";
import { _ as __ } from "./lang-COBcTD8W.js";
import { useState, useEffect, useMemo } from "react";
import { M as Modal } from "./Modal-CKHW52Ki.js";
import { C as ConfirmModal } from "./ConfirmModal-Bqr5rb3_.js";
import { I as InputLabel } from "./InputLabel-DDs2XNYP.js";
import { T as TextInput } from "./TextInput-D0qTZeQv.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { P as PrimaryButton } from "./PrimaryButton-BNNL2gCI.js";
import { S as SecondaryButton } from "./SecondaryButton-TjIrbn1G.js";
import { D as DangerButton } from "./DangerButton-B7to2Tbx.js";
import axios from "axios";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "./ThemeToggle-BY9dagkZ.js";
import "./ProfilePhoto-B39VtFFM.js";
import "./Footer-CDwTxrct.js";
import "./useTheme-CngFDcs1.js";
function ScheduleApprovalList() {
  const [schedules, setSchedules] = useState({ data: [], meta: {} });
  const [loading, setLoading] = useState(true);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
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
  useEffect(() => {
    fetchSchedules();
  }, [filters]);
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
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  const handleSelectSchedule = (id) => {
    if (selectedSchedules.includes(id)) {
      setSelectedSchedules(selectedSchedules.filter((s) => s !== id));
    } else {
      setSelectedSchedules([...selectedSchedules, id]);
    }
  };
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedSchedules(schedules.data.map((s) => s.id));
    } else {
      setSelectedSchedules([]);
    }
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
      }
      closeModal();
      fetchSchedules();
    } catch (error) {
      console.error("Error performing action:", error);
      alert(__("An error occurred. Please try again."));
    } finally {
      setProcessing(false);
    }
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
  return /* @__PURE__ */ jsxs("div", { className: "bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mt-6", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: __("Schedule Approval") }),
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
            onClick: () => fetchSchedules(),
            className: "bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded shadow transition",
            children: __("Refresh")
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: /* @__PURE__ */ jsx(
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
            className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100",
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
            className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100",
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
            className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100",
            onClick: () => handleSort("scheduled_at"),
            children: [
              __("Date & Time"),
              " ",
              renderSortIcon("scheduled_at")
            ]
          }
        ),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: __("Participants") }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: __("Actions") })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: loading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "6", className: "px-6 py-2.5 text-center text-sm text-gray-500", children: __("Loading...") }) }) : schedules.data.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "6", className: "px-6 py-2.5 text-center text-sm text-gray-500", children: __("No pending schedules found.") }) }) : schedules.data.map((schedule) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
        /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5 whitespace-nowrap", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: selectedSchedules.includes(schedule.id),
            onChange: () => handleSelectSchedule(schedule.id),
            className: "rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 h-10 w-10", children: schedule.mentor.profile_photo_url ? /* @__PURE__ */ jsx("img", { className: "h-10 w-10 rounded-full object-cover", src: schedule.mentor.profile_photo_url, alt: "" }) : /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold", children: schedule.mentor.name.charAt(0) }) }),
          /* @__PURE__ */ jsxs("div", { className: "ml-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-gray-900", children: schedule.mentor.name }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: schedule.mentor.email })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("td", { className: "px-6 py-2.5", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-900", children: schedule.agenda }),
          schedule.notes && /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 truncate max-w-xs", title: schedule.notes, children: schedule.notes })
        ] }),
        /* @__PURE__ */ jsxs("td", { className: "px-6 py-2.5 whitespace-nowrap", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-900", children: new Date(schedule.scheduled_at).toLocaleDateString() }),
          /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500", children: [
            new Date(schedule.scheduled_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            " -",
            new Date(schedule.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("td", { className: "px-6 py-2.5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex -space-x-2 overflow-hidden", children: [
            schedule.participants && schedule.participants.slice(0, 3).map((p) => /* @__PURE__ */ jsx("div", { className: "inline-flex h-8 w-8 rounded-full ring-2 ring-white bg-gray-300 items-center justify-center text-xs font-bold text-white", title: p.name, children: p.name.charAt(0) }, p.id)),
            schedule.participants && schedule.participants.length > 3 && /* @__PURE__ */ jsxs("div", { className: "inline-flex h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 items-center justify-center text-xs font-medium text-gray-500", children: [
              "+",
              schedule.participants.length - 3
            ] })
          ] }),
          (!schedule.participants || schedule.participants.length === 0) && /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400", children: __("No participants") })
        ] }),
        /* @__PURE__ */ jsxs("td", { className: "px-6 py-2.5 whitespace-nowrap text-right text-sm font-medium", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => openModal("preview", schedule),
              className: "text-indigo-600 hover:text-indigo-900 mr-3",
              children: __("Preview")
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => openModal("approve", schedule),
              className: "text-green-600 hover:text-green-900 mr-3",
              children: __("Approve")
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => openModal("request_modification", schedule),
              className: "text-yellow-600 hover:text-yellow-900 mr-3",
              children: __("Modify")
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => openModal("reject", schedule),
              className: "text-red-600 hover:text-red-900",
              children: __("Reject")
            }
          )
        ] })
      ] }, schedule.id)) })
    ] }) }),
    schedules.meta && schedules.meta.links && /* @__PURE__ */ jsxs("div", { className: "mt-4 flex justify-between items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-700", children: [
        __("Showing"),
        " ",
        /* @__PURE__ */ jsx("span", { className: "font-medium", children: schedules.meta.from || 0 }),
        " ",
        __("to"),
        " ",
        /* @__PURE__ */ jsx("span", { className: "font-medium", children: schedules.meta.to || 0 }),
        " ",
        __("of"),
        " ",
        /* @__PURE__ */ jsx("span", { className: "font-medium", children: schedules.meta.total || 0 }),
        " ",
        __("results")
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex space-x-2", children: schedules.meta.links.filter((link) => link.url).map((link, key) => {
        const isPrev = link.label.includes("&laquo;") || link.label === "Previous";
        const isNext = link.label.includes("&raquo;") || link.label === "Next";
        return /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => fetchSchedules(link.url.split("page=")[1]),
            disabled: link.active,
            className: `px-3 py-1 rounded border ${link.active ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`,
            children: isPrev ? __("Previous") : isNext ? __("Next") : /* @__PURE__ */ jsx("span", { dangerouslySetInnerHTML: { __html: link.label } })
          },
          key
        );
      }) })
    ] }),
    modal.show && /* @__PURE__ */ jsx("div", { className: "fixed z-10 inset-0 overflow-y-auto", "aria-labelledby": "modal-title", role: "dialog", "aria-modal": "true", children: /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0", children: [
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity", "aria-hidden": "true", onClick: closeModal }),
      /* @__PURE__ */ jsx("span", { className: "hidden sm:inline-block sm:align-middle sm:h-screen", "aria-hidden": "true", children: "​" }),
      /* @__PURE__ */ jsxs("div", { className: "inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4", children: /* @__PURE__ */ jsxs("div", { className: "sm:flex sm:items-start", children: [
          /* @__PURE__ */ jsx("div", { className: `mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${modal.type === "approve" || modal.type === "bulk_approve" ? "bg-green-100" : modal.type === "reject" || modal.type === "bulk_reject" ? "bg-red-100" : modal.type === "request_modification" ? "bg-yellow-100" : "bg-indigo-100"}`, children: /* @__PURE__ */ jsx("svg", { className: `h-6 w-6 ${modal.type === "approve" || modal.type === "bulk_approve" ? "text-green-600" : modal.type === "reject" || modal.type === "bulk_reject" ? "text-red-600" : modal.type === "request_modification" ? "text-yellow-600" : "text-indigo-600"}`, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-lg leading-6 font-medium text-gray-900", id: "modal-title", children: [
              modal.type === "approve" && __("Approve Schedule"),
              modal.type === "reject" && __("Reject Schedule"),
              modal.type === "request_modification" && __("Request Modification"),
              modal.type === "bulk_approve" && __("Bulk Approve Schedules"),
              modal.type === "bulk_reject" && __("Bulk Reject Schedules"),
              modal.type === "preview" && __("Schedule Details")
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-2", children: modal.type === "preview" ? /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500 space-y-2", children: [
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsxs("strong", { children: [
                  __("Mentor"),
                  ":"
                ] }),
                " ",
                modal.data.mentor.name
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsxs("strong", { children: [
                  __("Agenda"),
                  ":"
                ] }),
                " ",
                modal.data.agenda
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsxs("strong", { children: [
                  __("Date"),
                  ":"
                ] }),
                " ",
                new Date(modal.data.scheduled_at).toLocaleDateString()
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsxs("strong", { children: [
                  __("Time"),
                  ":"
                ] }),
                " ",
                new Date(modal.data.scheduled_at).toLocaleTimeString(),
                " - ",
                new Date(modal.data.end_time).toLocaleTimeString()
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsxs("strong", { children: [
                  __("Location"),
                  ":"
                ] }),
                " ",
                modal.data.location || __("N/A")
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
              /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5", children: modal.data.participants && modal.data.participants.map((p) => /* @__PURE__ */ jsx("li", { children: p.name }, p.id)) })
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
                modal.type === "approve" && __('Are you sure you want to approve ":agenda"?').replace(":agenda", modal.data.agenda),
                modal.type === "reject" && __('Please provide a reason for rejecting ":agenda".').replace(":agenda", modal.data.agenda),
                modal.type === "request_modification" && __('Please provide feedback for ":agenda".').replace(":agenda", modal.data.agenda)
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
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse", children: modal.type !== "preview" ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handleAction,
              disabled: processing || (modal.type === "reject" || modal.type === "bulk_reject" || modal.type === "request_modification") && !reason.trim(),
              className: `w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${modal.type === "reject" || modal.type === "bulk_reject" ? "bg-red-600 hover:bg-red-700 focus:ring-red-500" : modal.type === "request_modification" ? "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500" : "bg-green-600 hover:bg-green-700 focus:ring-green-500"} disabled:opacity-50`,
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
  ] });
}
const AGENDA_LABELS = {
  pengisian_rmd: "Pengisian RMD",
  pertemuan_umum: "Pertemuan Umum",
  rapat_youth: "Rapat Youth",
  lainnya: "Lainnya"
};
const STATUS_BADGE = {
  pending: "bg-orange-100 text-orange-700 border-orange-200",
  scheduled: "bg-green-100 text-green-700 border-green-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  modification_requested: "bg-yellow-100 text-yellow-700 border-yellow-200",
  completed: "bg-gray-100 text-gray-700 border-gray-200",
  deletion_requested: "bg-red-100 text-red-700 border-red-300"
};
const STATUS_LABELS = {
  pending: __("Pending Approval"),
  scheduled: __("Scheduled"),
  confirmed: __("Confirmed"),
  rejected: __("Rejected"),
  modification_requested: __("Modification Requested"),
  completed: __("Completed"),
  deletion_requested: __("Deletion Requested")
};
function ScheduleIndex({ auth, schedules }) {
  const { locale } = usePage().props;
  const [currentDate, setCurrentDate] = useState(/* @__PURE__ */ new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [mentorMeetings, setMentorMeetings] = useState([]);
  const [showBanner, setShowBanner] = useState(true);
  const [dayModal, setDayModal] = useState({ show: false, date: "", meetings: [] });
  const [deletionLoading, setDeletionLoading] = useState({});
  const [confirmState, setConfirmState] = useState({ show: false, title: "", message: "", onConfirm: null });
  const askConfirm = (title, message, fn) => setConfirmState({ show: true, title, message, onConfirm: fn });
  const closeConfirm = () => setConfirmState((s) => ({ ...s, show: false }));
  const { data, setData, post, patch, delete: destroy, processing, errors, reset, clearErrors } = useForm({
    name: "",
    date: "",
    start_time: "",
    end_time: "",
    all_day: false,
    description: "",
    priority: "medium",
    pic: "",
    location: "",
    status: "scheduled",
    notify_target: "all_user"
  });
  const fetchMentorMeetings = async () => {
    try {
      const res = await window.axios.get(route("api.admin.schedules.all"));
      setMentorMeetings(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Error fetching mentor meetings:", e);
    }
  };
  useEffect(() => {
    fetchMentorMeetings();
  }, []);
  const dateMeetingMap = useMemo(() => {
    const map = {};
    mentorMeetings.forEach((m) => {
      const dateStr = (m.scheduled_at || "").substring(0, 10);
      if (!dateStr) return;
      if (!map[dateStr]) map[dateStr] = { pending: 0, approved: 0, total: 0, deletion_requested: 0, meetings: [] };
      map[dateStr].total++;
      if (m.status === "pending") map[dateStr].pending++;
      else if (m.status === "scheduled") map[dateStr].approved++;
      else if (m.status === "deletion_requested") map[dateStr].deletion_requested++;
      map[dateStr].meetings.push(m);
    });
    return map;
  }, [mentorMeetings]);
  const pendingMeetingsCount = useMemo(
    () => mentorMeetings.filter((m) => m.status === "pending").length,
    [mentorMeetings]
  );
  useEffect(() => {
    if (mentorMeetings.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const meetingId = params.get("meeting_id");
    if (!meetingId) return;
    const meeting = mentorMeetings.find((m) => m.id === parseInt(meetingId));
    if (!meeting) return;
    const dateStr = (meeting.scheduled_at || "").substring(0, 10);
    if (!dateStr) return;
    const meetingDate = /* @__PURE__ */ new Date(dateStr + "T00:00:00");
    setCurrentDate(new Date(meetingDate.getFullYear(), meetingDate.getMonth(), 1));
    const dayMeetings = mentorMeetings.filter((m) => (m.scheduled_at || "").substring(0, 10) === dateStr);
    setDayModal({ show: true, date: dateStr, meetings: dayMeetings });
    window.history.replaceState({}, document.title, window.location.pathname);
  }, [mentorMeetings]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scheduleId = params.get("schedule_id");
    if (scheduleId && schedules.length > 0) {
      const schedule = schedules.find((s) => s.id === parseInt(scheduleId));
      if (schedule) {
        reset();
        clearErrors();
        setData({
          name: schedule.name,
          date: schedule.date,
          start_time: schedule.start_time ? schedule.start_time.substring(0, 5) : "",
          end_time: schedule.end_time ? schedule.end_time.substring(0, 5) : "",
          description: schedule.description,
          priority: schedule.priority,
          pic: schedule.pic,
          location: schedule.location || "",
          status: schedule.status || "scheduled",
          notify_target: schedule.notify_target || "all_user"
        });
        setSelectedSchedule(schedule);
        setModalMode("edit");
        setActiveTab("messages");
        setIsModalOpen(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [schedules]);
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const makeDateStr = (day) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const getCellBg = (day) => {
    const dayData = dateMeetingMap[makeDateStr(day)];
    const isToday = (/* @__PURE__ */ new Date()).toDateString() === new Date(year, month, day).toDateString();
    if (dayData?.deletion_requested > 0) return "bg-red-200 dark:bg-red-800/50 border-red-400 dark:border-red-600";
    if (dayData?.pending > 0) return "bg-orange-200 dark:bg-orange-800/50 border-orange-400 dark:border-orange-600";
    if (dayData?.total > 0) return "bg-green-200 dark:bg-green-800/50 border-green-400 dark:border-green-600";
    if (isToday) return "bg-blue-50 dark:bg-blue-900/20 border-gray-200 dark:border-gray-700";
    return "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700";
  };
  const getDayNumberColor = (day) => {
    const dayData = dateMeetingMap[makeDateStr(day)];
    const isToday = (/* @__PURE__ */ new Date()).toDateString() === new Date(year, month, day).toDateString();
    if (dayData?.deletion_requested > 0) return "text-red-600 font-bold";
    if (dayData?.pending > 0) return "text-orange-600 font-bold";
    if (dayData?.total > 0) return "text-green-600 dark:text-green-400 font-bold";
    if (isToday) return "text-blue-600 dark:text-blue-400 font-semibold";
    return "text-gray-700 dark:text-gray-300";
  };
  const handleDateClick = (day) => {
    const dateStr = makeDateStr(day);
    const dayData = dateMeetingMap[dateStr];
    if (dayData && dayData.total > 0) {
      setDayModal({ show: true, date: dateStr, meetings: dayData.meetings });
      return;
    }
    reset();
    clearErrors();
    setData({
      name: "",
      date: dateStr,
      start_time: "",
      end_time: "",
      description: "",
      priority: "medium",
      pic: auth.user.name,
      location: "",
      status: "scheduled",
      notify_target: "all_user"
    });
    setModalMode("add");
    setActiveTab("details");
    setSelectedSchedule(null);
    setIsModalOpen(true);
  };
  const handleEventClick = (e, schedule) => {
    e.stopPropagation();
    reset();
    clearErrors();
    setData({
      name: schedule.name,
      date: schedule.date,
      start_time: schedule.start_time ? schedule.start_time.substring(0, 5) : "",
      end_time: schedule.end_time ? schedule.end_time.substring(0, 5) : "",
      description: schedule.description,
      priority: schedule.priority,
      pic: schedule.pic,
      location: schedule.location || "",
      status: schedule.status || "scheduled",
      notify_target: schedule.notify_target || "all_user"
    });
    setModalMode("edit");
    setActiveTab("details");
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };
  const fetchMessages = async (scheduleId) => {
    setLoadingMessages(true);
    try {
      const response = await window.axios.get(route("api.schedules.messages", scheduleId));
      setMessages(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMessages(false);
    }
  };
  const handleArchiveMessage = async (messageId) => {
    try {
      await window.axios.patch(route("api.admin.schedule-messages.archive", messageId));
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (activeTab === "messages" && selectedSchedule) {
      fetchMessages(selectedSchedule.id);
    }
  }, [activeTab, selectedSchedule]);
  const [rejectDeletionModal, setRejectDeletionModal] = useState({ show: false, meeting: null, reason: "" });
  const doApproveDeletion = async (meeting) => {
    setDeletionLoading((p) => ({ ...p, [meeting.id]: "approve" }));
    try {
      await window.axios.post(route("api.admin.schedules.approve-deletion", meeting.id));
      await fetchMentorMeetings();
      setDayModal((prev) => ({
        ...prev,
        meetings: prev.meetings.filter((m) => m.id !== meeting.id)
      }));
    } catch (e) {
      console.error("Approve deletion failed", e);
    } finally {
      setDeletionLoading((p) => ({ ...p, [meeting.id]: null }));
    }
  };
  const handleApproveDeletion = (meeting) => {
    askConfirm(
      __("Approve Deletion"),
      __("This will permanently delete the meeting requested by the mentor. This action cannot be undone."),
      () => doApproveDeletion(meeting)
    );
  };
  const openRejectDeletionModal = (meeting) => {
    setRejectDeletionModal({ show: true, meeting, reason: "" });
  };
  const closeRejectDeletionModal = () => {
    setRejectDeletionModal({ show: false, meeting: null, reason: "" });
  };
  const submitRejectDeletion = async () => {
    const meeting = rejectDeletionModal.meeting;
    if (!meeting || !rejectDeletionModal.reason.trim()) return;
    setDeletionLoading((p) => ({ ...p, [meeting.id]: "reject" }));
    try {
      await window.axios.post(route("api.admin.schedules.reject-deletion", meeting.id), {
        reason: rejectDeletionModal.reason.trim()
      });
      await fetchMentorMeetings();
      setDayModal((prev) => ({
        ...prev,
        meetings: prev.meetings.map(
          (m) => m.id === meeting.id ? { ...m, status: "scheduled" } : m
        )
      }));
      closeRejectDeletionModal();
    } catch (e) {
      console.error("Reject deletion failed", e);
    } finally {
      setDeletionLoading((p) => ({ ...p, [meeting.id]: null }));
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };
  const submit = (e) => {
    e.preventDefault();
    if (modalMode === "add") {
      post(route("schedule.store"), { onSuccess: () => closeModal() });
    } else {
      patch(route("schedule.update", selectedSchedule.id), { onSuccess: () => closeModal() });
    }
  };
  const handleDelete = () => {
    askConfirm(
      __("Hapus Jadwal"),
      __("Are you sure you want to delete this activity?"),
      () => destroy(route("schedule.destroy", selectedSchedule.id), { onSuccess: () => closeModal() })
    );
  };
  const currentMonthSchedules = schedules.filter((s) => {
    const sDate = new Date(s.date);
    return sDate.getMonth() === month && sDate.getFullYear() === year;
  });
  const getSchedulesForDay = (day) => currentMonthSchedules.filter((s) => new Date(s.date).getDate() === day);
  const fmtTime = (dt) => dt ? new Date(dt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "";
  const renderCalendarGrid = () => {
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(
        /* @__PURE__ */ jsx("div", { className: "h-14 sm:h-28 md:h-36 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700" }, `empty-${i}`)
      );
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dailySchedules = getSchedulesForDay(day);
      const dateStr = makeDateStr(day);
      const dayData = dateMeetingMap[dateStr];
      days.push(
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `h-14 sm:h-28 md:h-36 border p-1 transition duration-150 ease-in-out hover:brightness-95 cursor-pointer overflow-hidden sm:overflow-y-auto relative ${getCellBg(day)}`,
            onClick: () => handleDateClick(day),
            children: [
              /* @__PURE__ */ jsxs("div", { className: `text-right text-xs sm:text-sm mb-0.5 sm:mb-1 ${getDayNumberColor(day)}`, children: [
                day,
                dayData?.pending > 0 && /* @__PURE__ */ jsx("span", { className: "ml-1 inline-block w-1.5 h-1.5 rounded-full bg-orange-500 align-middle", title: __("Pending Approval") }),
                !dayData?.pending && dayData?.total > 0 && /* @__PURE__ */ jsx("span", { className: "ml-1 inline-block w-1.5 h-1.5 rounded-full bg-green-500 align-middle", title: __("All Approved") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-0.5 sm:hidden", children: [
                dailySchedules.slice(0, 3).map((schedule) => /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `w-1.5 h-1.5 rounded-full ${schedule.priority === "high" ? "bg-red-500" : schedule.priority === "medium" ? "bg-blue-500" : "bg-emerald-500"}`,
                    title: schedule.name
                  },
                  schedule.id
                )),
                dayData?.meetings?.slice(0, 3).map((m) => /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `w-1.5 h-1.5 rounded-full ${m.status === "deletion_requested" ? "bg-red-500" : m.status === "pending" ? "bg-orange-400" : "bg-green-500"}`,
                    title: m.mentor?.name
                  },
                  `meeting-${m.id}`
                ))
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "hidden sm:block space-y-0.5", children: [
                dailySchedules.slice(0, 2).map((schedule) => /* @__PURE__ */ jsxs(
                  "div",
                  {
                    onClick: (e) => handleEventClick(e, schedule),
                    className: `text-xs px-1 py-0.5 rounded truncate text-white cursor-pointer hover:opacity-80 ${schedule.priority === "high" ? "bg-red-500" : schedule.priority === "medium" ? "bg-blue-500" : "bg-emerald-500"}`,
                    title: `${schedule.start_time} - ${schedule.name}`,
                    children: [
                      schedule.start_time && /* @__PURE__ */ jsx("span", { className: "mr-1", children: schedule.start_time.substring(0, 5) }),
                      schedule.name
                    ]
                  },
                  schedule.id
                )),
                dailySchedules.length > 2 && /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-400 pl-1", children: [
                  "+",
                  dailySchedules.length - 2
                ] }),
                dayData?.meetings?.slice(0, 2).map((m) => /* @__PURE__ */ jsxs(
                  "div",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      setDayModal({ show: true, date: dateStr, meetings: dayData.meetings });
                    },
                    className: `text-xs px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 font-medium border ${m.status === "deletion_requested" ? "bg-red-100 text-red-700 border-red-300" : m.status === "pending" ? "bg-orange-100 text-orange-700 border-orange-300" : "bg-green-100 text-green-700 border-green-300"}`,
                    title: `${m.mentor?.name} — ${AGENDA_LABELS[m.agenda_type] ?? m.agenda ?? __("Meeting")}`,
                    children: [
                      "🧑‍🏫 ",
                      m.mentor?.name?.split(" ")[0] ?? __("Mentor")
                    ]
                  },
                  `meeting-${m.id}`
                )),
                dayData?.meetings?.length > 2 && /* @__PURE__ */ jsxs("div", { className: "text-xs text-orange-400 pl-1", children: [
                  "+",
                  dayData.meetings.length - 2,
                  " mentor"
                ] })
              ] })
            ]
          },
          day
        )
      );
    }
    return days;
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight", children: __("Schedule") }),
        pendingMeetingsCount > 0 && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300", children: [
          pendingMeetingsCount,
          " ",
          __("pending")
        ] })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("Schedule") }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-4", children: [
          showBanner && pendingMeetingsCount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 p-4 bg-orange-50 border border-orange-300 rounded-xl shadow-sm", children: [
            /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-orange-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" }) }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-orange-800", children: pendingMeetingsCount === 1 ? __("There is 1 mentor schedule waiting for your approval.") : __("There are :count mentor schedules waiting for your approval.").replace(":count", pendingMeetingsCount) }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-orange-600 mt-0.5", children: __("Orange cells = pending approval. Green cells = all approved. Click to view details.") }),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: route("admin.schedule-approval.index"),
                  className: "mt-2 inline-block text-xs font-semibold text-orange-700 underline hover:text-orange-900",
                  children: __("Go to Schedule Approval →")
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setShowBanner(false),
                className: "flex-shrink-0 text-orange-400 hover:text-orange-600 p-1 rounded",
                title: __("Dismiss"),
                children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "p-6 text-gray-900 dark:text-gray-100", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsx("button", { onClick: prevMonth, className: "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15 19l-7-7 7-7" }) }) }),
              /* @__PURE__ */ jsxs("h3", { className: "text-xl font-bold", children: [
                new Date(year, month).toLocaleString(locale === "id" ? "id-ID" : "en-US", { month: "long" }),
                " ",
                year
              ] }),
              /* @__PURE__ */ jsx("button", { onClick: nextMonth, className: "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 5l7 7-7 7" }) }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-0 mb-2 text-center font-bold text-gray-600 dark:text-gray-400", children: [...Array(7)].map((_, i) => /* @__PURE__ */ jsx("div", { children: new Date(2024, 0, 7 + i).toLocaleString(locale === "id" ? "id-ID" : "en-US", { weekday: "short" }) }, i)) }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-0", children: renderCalendarGrid() }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap gap-4 text-xs", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-red-200 border border-red-400 rounded" }),
                /* @__PURE__ */ jsx("span", { className: "text-red-700 font-medium", children: __("Deletion Requested") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-orange-200 border border-orange-400 rounded" }),
                /* @__PURE__ */ jsx("span", { className: "text-orange-700 font-medium", children: __("Pending Mentor Schedule") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-green-200 border border-green-400 rounded" }),
                /* @__PURE__ */ jsx("span", { className: "text-green-700 font-medium", children: __("All Mentor Schedules Approved") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-red-500 rounded" }),
                /* @__PURE__ */ jsx("span", { children: __("High Priority") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-blue-500 rounded" }),
                /* @__PURE__ */ jsx("span", { children: __("Medium Priority") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-emerald-500 rounded" }),
                /* @__PURE__ */ jsx("span", { children: __("Low Priority") })
              ] })
            ] })
          ] }) }),
          auth.user.role === "admin" && /* @__PURE__ */ jsx(ScheduleApprovalList, {})
        ] }) }),
        dayModal.show && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto", role: "dialog", "aria-modal": "true", children: /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity",
              onClick: () => setDayModal({ show: false, date: "", meetings: [] })
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "hidden sm:inline-block sm:align-middle sm:h-screen", children: "​" }),
          /* @__PURE__ */ jsxs("div", { className: "inline-block align-bottom bg-white dark:bg-gray-800 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full", children: [
            /* @__PURE__ */ jsxs("div", { className: "px-6 pt-5 pb-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                /* @__PURE__ */ jsxs("h3", { className: "text-base font-semibold text-gray-900 dark:text-gray-100", children: [
                  __("Mentor Schedules"),
                  " —",
                  " ",
                  (/* @__PURE__ */ new Date(dayModal.date + "T00:00:00")).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setDayModal({ show: false, date: "", meetings: [] }),
                    className: "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
                    children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "space-y-3 max-h-80 overflow-y-auto", children: dayModal.meetings.map((m) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `p-3 rounded-lg border ${m.status === "deletion_requested" ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700" : m.status === "pending" ? "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700" : "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700"}`,
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-900 dark:text-gray-100", children: m.mentor?.name ?? __("Mentor") }),
                        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-0.5", children: AGENDA_LABELS[m.agenda_type] ?? m.agenda ?? __("Meeting") }),
                        /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-400 dark:text-gray-500 mt-0.5", children: [
                          fmtTime(m.scheduled_at),
                          " – ",
                          fmtTime(m.end_time),
                          m.location ? ` · ${m.location}` : ""
                        ] })
                      ] }),
                      /* @__PURE__ */ jsx("span", { className: `flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_BADGE[m.status] ?? "bg-gray-100 text-gray-700 border-gray-200"}`, children: STATUS_LABELS[m.status] ?? m.status })
                    ] }),
                    m.status === "deletion_requested" && /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mt-2 pt-2 border-t border-red-200 dark:border-red-700", children: [
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => handleApproveDeletion(m),
                          disabled: !!deletionLoading[m.id],
                          className: "flex-1 px-3 py-1.5 text-xs font-medium bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-md transition",
                          children: deletionLoading[m.id] === "approve" ? __("Deleting…") : __("Approve Deletion")
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => openRejectDeletionModal(m),
                          disabled: !!deletionLoading[m.id],
                          className: "flex-1 px-3 py-1.5 text-xs font-medium bg-white hover:bg-gray-50 disabled:opacity-50 text-gray-700 border border-gray-300 rounded-md transition dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600",
                          children: deletionLoading[m.id] === "reject" ? __("Rejecting…") : __("Reject Deletion")
                        }
                      )
                    ] })
                  ]
                },
                m.id
              )) }),
              dayModal.meetings.some((m) => m.status === "pending" || m.status === "deletion_requested") && /* @__PURE__ */ jsx("div", { className: "mt-4 pt-3 border-t border-gray-100 dark:border-gray-700", children: /* @__PURE__ */ jsxs(
                "a",
                {
                  href: route("admin.schedule-approval.index"),
                  className: "inline-flex items-center gap-1 text-sm font-semibold text-orange-700 hover:text-orange-900 underline",
                  children: [
                    /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }),
                    __("Review pending schedules →")
                  ]
                }
              ) }),
              /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => {
                    setDayModal({ show: false, date: "", meetings: [] });
                    reset();
                    clearErrors();
                    setData({
                      name: "",
                      date: dayModal.date,
                      start_time: "",
                      end_time: "",
                      description: "",
                      priority: "medium",
                      pic: auth.user.name,
                      location: "",
                      status: "scheduled",
                      notify_target: "all_user"
                    });
                    setModalMode("add");
                    setActiveTab("details");
                    setSelectedSchedule(null);
                    setIsModalOpen(true);
                  },
                  className: "text-xs text-indigo-600 hover:text-indigo-800 font-medium underline",
                  children: __("+ Add activity for this date")
                }
              ) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "bg-gray-50 dark:bg-gray-700 px-6 py-3 flex justify-end", children: /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setDayModal({ show: false, date: "", meetings: [] }),
                className: "px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 shadow-sm",
                children: __("Close")
              }
            ) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(Modal, { show: isModalOpen, onClose: closeModal, children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 dark:text-gray-100 mb-4", children: modalMode === "add" ? __("Add Activity") : __("Edit Activity") }),
          modalMode === "edit" && /* @__PURE__ */ jsx("div", { className: "flex border-b border-gray-200 dark:border-gray-700 mb-4", children: ["details", "messages"].map((tab) => /* @__PURE__ */ jsx(
            "button",
            {
              className: `py-2 px-4 text-sm font-medium ${activeTab === tab ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700 dark:text-gray-400"}`,
              onClick: () => setActiveTab(tab),
              children: tab === "details" ? __("Details") : __("Communication")
            },
            tab
          )) }),
          activeTab === "details" ? /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { htmlFor: "name", value: __("Activity Name") }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "name",
                  className: "mt-1 block w-full",
                  value: data.name,
                  onChange: (e) => setData("name", e.target.value),
                  required: true,
                  isFocused: true
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.name, className: "mt-2" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { htmlFor: "date", value: __("Date") }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    id: "date",
                    type: "date",
                    className: "mt-1 block w-full",
                    value: data.date,
                    onChange: (e) => setData("date", e.target.value),
                    required: true
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.date, className: "mt-2" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { htmlFor: "priority", value: __("Priority") }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    id: "priority",
                    className: "mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm",
                    value: data.priority,
                    onChange: (e) => setData("priority", e.target.value),
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "low", children: __("Low") }),
                      /* @__PURE__ */ jsx("option", { value: "medium", children: __("Medium") }),
                      /* @__PURE__ */ jsx("option", { value: "high", children: __("High") })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.priority, className: "mt-2" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-2 cursor-pointer select-none", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    className: "w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500",
                    checked: data.all_day,
                    onChange: (e) => {
                      const checked = e.target.checked;
                      setData((d) => ({
                        ...d,
                        all_day: checked,
                        start_time: checked ? "00:00" : "",
                        end_time: checked ? "23:59" : ""
                      }));
                    }
                  }
                ),
                /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: [
                  __("All Day"),
                  " ",
                  /* @__PURE__ */ jsxs("span", { className: "text-gray-400 font-normal", children: [
                    "(24 ",
                    __("hours"),
                    ")"
                  ] })
                ] })
              ] }),
              !data.all_day && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { htmlFor: "start_time", value: __("Start Time") }),
                  /* @__PURE__ */ jsx(
                    TextInput,
                    {
                      id: "start_time",
                      type: "time",
                      className: "mt-1 block w-full",
                      value: data.start_time,
                      onChange: (e) => setData("start_time", e.target.value),
                      required: true
                    }
                  ),
                  /* @__PURE__ */ jsx(InputError, { message: errors.start_time, className: "mt-2" })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { htmlFor: "end_time", value: __("End Time") }),
                  /* @__PURE__ */ jsx(
                    TextInput,
                    {
                      id: "end_time",
                      type: "time",
                      className: "mt-1 block w-full",
                      value: data.end_time,
                      onChange: (e) => setData("end_time", e.target.value),
                      required: true
                    }
                  ),
                  /* @__PURE__ */ jsx(InputError, { message: errors.end_time, className: "mt-2" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { htmlFor: "location", value: __("Location") }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    id: "location",
                    className: "mt-1 block w-full",
                    value: data.location,
                    onChange: (e) => setData("location", e.target.value)
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.location, className: "mt-2" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { htmlFor: "status", value: __("Status") }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    id: "status",
                    className: "mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm",
                    value: data.status,
                    onChange: (e) => setData("status", e.target.value),
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "scheduled", children: __("Scheduled") }),
                      /* @__PURE__ */ jsx("option", { value: "ongoing", children: __("Ongoing") }),
                      /* @__PURE__ */ jsx("option", { value: "completed", children: __("Completed") }),
                      /* @__PURE__ */ jsx("option", { value: "cancelled", children: __("Cancelled") })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.status, className: "mt-2" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { htmlFor: "notify_target", value: __("Notify To") }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  id: "notify_target",
                  className: "mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm",
                  value: data.notify_target,
                  onChange: (e) => setData("notify_target", e.target.value),
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "all_user", children: __("All Users") }),
                    /* @__PURE__ */ jsx("option", { value: "mentor_only", children: __("Mentor Only") }),
                    /* @__PURE__ */ jsx("option", { value: "participant_only", children: __("Participant Only") }),
                    /* @__PURE__ */ jsx("option", { value: "staff_only", children: __("Staff Only") })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.notify_target, className: "mt-2" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { htmlFor: "description", value: __("Description") }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  id: "description",
                  rows: "3",
                  className: "mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm",
                  value: data.description,
                  onChange: (e) => setData("description", e.target.value)
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.description, className: "mt-2" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { htmlFor: "pic", value: __("PIC") }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "pic",
                  className: "mt-1 block w-full",
                  value: data.pic,
                  onChange: (e) => setData("pic", e.target.value),
                  required: true
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.pic, className: "mt-2" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end mt-6", children: [
              modalMode === "edit" && /* @__PURE__ */ jsx(DangerButton, { type: "button", onClick: handleDelete, className: "mr-auto", disabled: processing, children: __("Delete") }),
              /* @__PURE__ */ jsx(SecondaryButton, { onClick: closeModal, className: "mr-3", children: __("Cancel") }),
              /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: modalMode === "add" ? __("Add") : __("Save Changes") })
            ] })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            loadingMessages ? /* @__PURE__ */ jsx("div", { className: "text-center py-4 text-gray-500", children: __("Loading messages...") }) : messages.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-4 text-gray-500", children: __("No messages found.") }) : /* @__PURE__ */ jsx("div", { className: "max-h-96 overflow-y-auto space-y-4", children: messages.map((msg) => /* @__PURE__ */ jsxs("div", { className: "p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold text-sm text-gray-900 dark:text-gray-100", children: msg.user?.name || "Unknown User" }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400", children: new Date(msg.created_at).toLocaleString(locale === "id" ? "id-ID" : "en-US") })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap", children: msg.message }),
              /* @__PURE__ */ jsx("div", { className: "mt-2 flex justify-end", children: /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleArchiveMessage(msg.id),
                  className: "text-xs text-red-600 hover:text-red-800 dark:text-red-400 font-medium",
                  children: __("Archive")
                }
              ) })
            ] }, msg.id)) }),
            /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-6", children: /* @__PURE__ */ jsx(SecondaryButton, { onClick: closeModal, children: __("Close") }) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(
          ConfirmModal,
          {
            show: confirmState.show,
            title: confirmState.title,
            message: confirmState.message,
            onConfirm: () => {
              confirmState.onConfirm?.();
              closeConfirm();
            },
            onCancel: closeConfirm,
            confirmLabel: __("Ya, Hapus")
          }
        ),
        /* @__PURE__ */ jsx(Modal, { show: rejectDeletionModal.show, onClose: closeRejectDeletionModal, maxWidth: "md", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold text-gray-900 dark:text-gray-100 mb-2", children: __("Reject Deletion Request") }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mb-4", children: __("Provide a reason for rejecting the deletion request. The meeting will be restored to scheduled.") }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              className: "w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500",
              rows: "3",
              placeholder: __("Enter reason..."),
              value: rejectDeletionModal.reason,
              onChange: (e) => setRejectDeletionModal((prev) => ({ ...prev, reason: e.target.value }))
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 mt-4", children: [
            /* @__PURE__ */ jsx(SecondaryButton, { onClick: closeRejectDeletionModal, children: __("Cancel") }),
            /* @__PURE__ */ jsx(
              DangerButton,
              {
                onClick: submitRejectDeletion,
                disabled: !rejectDeletionModal.reason.trim() || !!deletionLoading[rejectDeletionModal.meeting?.id],
                children: deletionLoading[rejectDeletionModal.meeting?.id] === "reject" ? __("Rejecting…") : __("Confirm")
              }
            )
          ] })
        ] }) })
      ]
    }
  );
}
export {
  ScheduleIndex as default
};
