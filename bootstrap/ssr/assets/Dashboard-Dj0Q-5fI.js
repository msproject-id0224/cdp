import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BG6RGD2S.js";
import { useForm, router, usePage, Head, Link } from "@inertiajs/react";
import { _ as __, u as useTrans } from "./lang-COBcTD8W.js";
import { useState, useEffect, useMemo } from "react";
import { C as ConfirmModal } from "./ConfirmModal-Bqr5rb3_.js";
import { P as PrimaryButton } from "./PrimaryButton-BNNL2gCI.js";
import { D as DangerButton } from "./DangerButton-B7to2Tbx.js";
import { S as SecondaryButton } from "./SecondaryButton-TjIrbn1G.js";
import { M as Modal } from "./Modal-CKHW52Ki.js";
import { T as TextInput } from "./TextInput-D0qTZeQv.js";
import { I as InputLabel } from "./InputLabel-DDs2XNYP.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { P as ProfilePhoto } from "./ProfilePhoto-CJ2Z04pO.js";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import idLocale from "@fullcalendar/core/locales/id";
import { S as SelectInput } from "./SelectInput-inadq0Bq.js";
import { P as Pagination } from "./Pagination-DbN0dqrA.js";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "./ThemeToggle-BY9dagkZ.js";
import "axios";
import "./Footer-B7ihPSZ8.js";
import "./useTheme-CngFDcs1.js";
function PhotoRequestsTab({ initialRequests }) {
  const [requests, setRequests] = useState(initialRequests || []);
  const [search, setSearch] = useState("");
  const [rejectingRequest, setRejectingRequest] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [confirmState, setConfirmState] = useState({ show: false, title: "", message: "", onConfirm: null });
  const askConfirm = (title, message, fn) => setConfirmState({ show: true, title, message, onConfirm: fn });
  const closeConfirm = () => setConfirmState((s) => ({ ...s, show: false }));
  useEffect(() => {
    setRequests(initialRequests || []);
  }, [initialRequests]);
  const { data, setData, post, processing, errors, reset } = useForm({
    reason: ""
  });
  const filteredRequests = requests.filter((request) => {
    const userName = request.user?.name || request.user?.first_name || "";
    const userEmail = request.user?.email || "";
    const searchTerm = search.toLowerCase();
    return userName.toLowerCase().includes(searchTerm) || userEmail.toLowerCase().includes(searchTerm);
  });
  const approve = (id) => {
    askConfirm(
      __("Setujui Foto"),
      __("Are you sure you want to approve this photo?"),
      () => {
        setProcessingId(id);
        router.post(route("admin.profile-photos.approve", id), {}, {
          preserveScroll: true,
          preserveState: true,
          onSuccess: () => {
            setRequests((prev) => prev.filter((r) => r.id !== id));
            setProcessingId(null);
          },
          onError: () => setProcessingId(null)
        });
      }
    );
  };
  const openRejectModal = (request) => {
    setRejectingRequest(request);
    setData("reason", "");
  };
  const closeRejectModal = () => {
    setRejectingRequest(null);
    reset();
  };
  const submitReject = (e) => {
    e.preventDefault();
    post(route("admin.profile-photos.reject", rejectingRequest.id), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        setRequests((prev) => prev.filter((r) => r.id !== rejectingRequest.id));
        closeRejectModal();
      }
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-center gap-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Pending Photo Requests") }),
      /* @__PURE__ */ jsx("div", { className: "w-full sm:w-64", children: /* @__PURE__ */ jsx(
        TextInput,
        {
          type: "text",
          placeholder: __("Search requests..."),
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "w-full"
        }
      ) })
    ] }),
    filteredRequests.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700", children: search ? __("No requests found matching your search.") : __("No pending photo requests.") }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredRequests.map((request) => /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 relative group", children: [
        /* @__PURE__ */ jsx(
          ProfilePhoto,
          {
            src: request.photo_url,
            alt: request.user?.name || request.user?.first_name || "User",
            className: "w-32 h-32 rounded-full object-cover border-4 border-gray-100 dark:border-gray-700 group-hover:border-indigo-100 dark:group-hover:border-indigo-900 transition-colors",
            fallbackClassName: "w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 border-4 border-gray-100 dark:border-gray-700",
            fallback: /* @__PURE__ */ jsx("span", { className: "text-4xl font-bold text-gray-500 dark:text-gray-400", children: (request.user?.name || request.user?.first_name || "U").charAt(0).toUpperCase() })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-4 flex-1", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-semibold text-gray-900 dark:text-gray-100", children: request.user?.name || request.user?.first_name || __("User") }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: request.user?.email }),
        /* @__PURE__ */ jsx("span", { className: `inline-block mt-2 px-2 py-0.5 text-[10px] rounded-full capitalize ${request.user?.role === "mentor" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"}`, children: __(request.user?.role || "participant") }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-400 mt-2", children: new Date(request.created_at).toLocaleDateString() })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex space-x-2 w-full mt-auto", children: [
        /* @__PURE__ */ jsx(
          PrimaryButton,
          {
            onClick: () => approve(request.id),
            className: "flex-1 justify-center text-xs",
            disabled: processingId === request.id,
            children: processingId === request.id ? __("Processing...") : __("Approve")
          }
        ),
        /* @__PURE__ */ jsx(
          DangerButton,
          {
            onClick: () => openRejectModal(request),
            className: "flex-1 justify-center text-xs",
            disabled: processingId === request.id,
            children: __("Reject")
          }
        )
      ] })
    ] }, request.id)) }),
    /* @__PURE__ */ jsx(Modal, { show: !!rejectingRequest, onClose: closeRejectModal, children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Reject Profile Photo") }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600 dark:text-gray-400", children: __("Please provide a reason for rejecting the photo for :name", { name: rejectingRequest?.user?.name || rejectingRequest?.user?.first_name || __("User") }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "reason", value: __("Reason"), className: "sr-only" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "reason",
            type: "text",
            name: "reason",
            value: data.reason,
            onChange: (e) => setData("reason", e.target.value),
            className: "mt-1 block w-full",
            placeholder: __("e.g., Image is blurry, inappropriate content, etc."),
            isFocused: true
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.reason, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end", children: [
        /* @__PURE__ */ jsx(SecondaryButton, { onClick: closeRejectModal, children: __("Cancel") }),
        /* @__PURE__ */ jsx(DangerButton, { className: "ms-3", onClick: submitReject, disabled: processing, children: __("Reject Photo") })
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
        confirmLabel: __("Ya, Setujui"),
        danger: false
      }
    )
  ] });
}
const STATUS_BADGE = {
  pending: "bg-orange-100 text-orange-700",
  scheduled: "bg-green-100 text-green-700",
  confirmed: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
  modification_requested: "bg-yellow-100 text-yellow-700",
  completed: "bg-gray-100 text-gray-700"
};
function ScheduleTab() {
  const __2 = useTrans();
  const { locale } = usePage().props;
  const AGENDA_LABELS = {
    pengisian_rmd: __2("Pengisian RMD"),
    pertemuan_umum: __2("Pertemuan Umum"),
    rapat_youth: __2("Rapat Youth"),
    lainnya: __2("Others")
  };
  const STATUS_LABELS = {
    pending: __2("Pending Approval"),
    scheduled: __2("Scheduled"),
    confirmed: __2("Confirmed"),
    rejected: __2("Rejected"),
    modification_requested: __2("Modification Requested"),
    completed: __2("Completed")
  };
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    date: "",
    priority: "all",
    page: 1
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedSchedule, setSelectedSchedule] = useState(null);
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
  const [mentorMeetings, setMentorMeetings] = useState([]);
  const [showBanner, setShowBanner] = useState(true);
  const [dayModal, setDayModal] = useState({ show: false, date: "", meetings: [] });
  const [generalMeetingDates, setGeneralMeetingDates] = useState(/* @__PURE__ */ new Set());
  const [detailModal, setDetailModal] = useState({ show: false, meeting: null, loading: false });
  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      Object.keys(params).forEach((key) => {
        if (params[key] === "" || params[key] === "all") delete params[key];
      });
      const response = await window.axios.get(route("api.schedules"), { params });
      setSchedules(response.data.data);
      setPagination(response.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => fetchSchedules(), 300);
    return () => clearTimeout(timer);
  }, [filters]);
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
    fetchGeneralMeetingDates();
  }, []);
  const fetchGeneralMeetingDates = async () => {
    try {
      const res = await window.axios.get(route("api.general-meeting-dates"));
      setGeneralMeetingDates(new Set(res.data));
    } catch (e) {
      console.error("Error fetching general meeting dates:", e);
    }
  };
  const toggleGeneralMeetingDate = async (dateStr, e) => {
    e.stopPropagation();
    try {
      const res = await window.axios.post(route("api.admin.general-meeting-dates.toggle"), { date: dateStr });
      setGeneralMeetingDates((prev) => {
        const next = new Set(prev);
        res.data.enabled ? next.add(dateStr) : next.delete(dateStr);
        return next;
      });
    } catch (e2) {
      console.error("Error toggling general meeting date:", e2);
    }
  };
  const openMeetingDetail = async (meetingId) => {
    setDetailModal({ show: true, meeting: null, loading: true });
    try {
      const res = await window.axios.get(route("api.admin.schedules.details", meetingId));
      setDetailModal({ show: true, meeting: res.data, loading: false });
    } catch (e) {
      console.error("Error fetching meeting details:", e);
      setDetailModal({ show: false, meeting: null, loading: false });
    }
  };
  const dateMeetingMap = useMemo(() => {
    const map = {};
    mentorMeetings.forEach((m) => {
      const raw = m.scheduled_at || "";
      if (!raw) return;
      const utc = raw.endsWith("Z") ? raw : raw + "Z";
      const dateStr = new Date(utc).toLocaleDateString("en-CA");
      if (!map[dateStr]) map[dateStr] = { pending: 0, approved: 0, total: 0, meetings: [] };
      map[dateStr].total++;
      if (["pending", "modification_requested"].includes(m.status)) map[dateStr].pending++;
      else if (["scheduled", "confirmed"].includes(m.status)) map[dateStr].approved++;
      map[dateStr].meetings.push(m);
    });
    return map;
  }, [mentorMeetings]);
  const pendingMeetingsCount = useMemo(
    () => mentorMeetings.filter((m) => m.status === "pending").length,
    [mentorMeetings]
  );
  const calendarEvents = useMemo(
    () => mentorMeetings.map((m) => {
      const raw = m.scheduled_at || "";
      const start = raw ? raw.endsWith("Z") ? raw : raw + "Z" : null;
      const rawEnd = m.end_time || "";
      const end = rawEnd ? rawEnd.endsWith("Z") ? rawEnd : rawEnd + "Z" : null;
      const isPending = ["pending", "modification_requested"].includes(m.status);
      return {
        id: `meeting-${m.id}`,
        title: `${m.mentor?.name ?? __2("Mentor")} — ${AGENDA_LABELS[m.agenda_type] ?? m.agenda ?? __2("Meeting")}`,
        start,
        end,
        backgroundColor: isPending ? "#F97316" : "#22C55E",
        borderColor: isPending ? "#EA580C" : "#16A34A",
        textColor: "#ffffff",
        extendedProps: { meeting: m }
      };
    }),
    [mentorMeetings]
  );
  const dayCellClassNames = (arg) => {
    const dateStr = arg.date.toLocaleDateString("en-CA");
    const dayData = dateMeetingMap[dateStr];
    const classes = [];
    if (generalMeetingDates.has(dateStr)) classes.push("fc-day-general-meeting");
    if (dayData?.pending > 0) classes.push("fc-day-mentor-pending");
    else if (dayData?.total > 0) classes.push("fc-day-mentor-approved");
    return classes;
  };
  const dayCellContent = (arg) => {
    const dateStr = arg.date.toLocaleDateString("en-CA");
    const isGM = generalMeetingDates.has(dateStr);
    return /* @__PURE__ */ jsxs("div", { className: "fc-daygrid-day-top-inner w-full", children: [
      /* @__PURE__ */ jsx("span", { className: "fc-daygrid-day-number", children: arg.dayNumberText }),
      /* @__PURE__ */ jsxs(
        "label",
        {
          className: "flex items-center gap-0.5 cursor-pointer mt-0.5 select-none",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: isGM,
                onChange: (e) => toggleGeneralMeetingDate(dateStr, e),
                className: "w-3 h-3 accent-green-600 cursor-pointer"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: `text-[9px] font-bold leading-tight ${isGM ? "text-green-700" : "text-red-500"}`, children: isGM ? "A" : "N" })
          ]
        }
      )
    ] });
  };
  const handleDateClick = (info) => {
    const dayData = dateMeetingMap[info.dateStr];
    if (dayData && dayData.total > 0) {
      setDayModal({ show: true, date: info.dateStr, meetings: dayData.meetings });
    }
  };
  const handleEventClick = ({ event }) => {
    const m = event.extendedProps.meeting;
    const raw = m.scheduled_at || "";
    const utc = raw ? raw.endsWith("Z") ? raw : raw + "Z" : "";
    const dateStr = utc ? new Date(utc).toLocaleDateString("en-CA") : "";
    const dayData = dateMeetingMap[dateStr];
    if (dayData) setDayModal({ show: true, date: dateStr, meetings: dayData.meetings });
  };
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };
  const handlePageChange = (url) => {
    if (!url) return;
    const urlParams = new URL(url).searchParams;
    setFilters((prev) => ({ ...prev, page: urlParams.get("page") }));
  };
  const openModal = (mode, schedule = null) => {
    setModalMode(mode);
    setSelectedSchedule(schedule);
    clearErrors();
    if (mode === "edit" && schedule) {
      setData({
        name: schedule.name,
        date: schedule.date,
        all_day: schedule.start_time === "00:00:00" && schedule.end_time === "23:59:00",
        start_time: schedule.start_time ? schedule.start_time.substring(0, 5) : "",
        end_time: schedule.end_time ? schedule.end_time.substring(0, 5) : "",
        description: schedule.description || "",
        priority: schedule.priority,
        pic: schedule.pic,
        location: schedule.location || "",
        status: schedule.status || "scheduled",
        notify_target: schedule.notify_target || "all_user"
      });
    } else {
      reset();
      setData("date", (/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
    }
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };
  const submit = (e) => {
    e.preventDefault();
    const action = modalMode === "add" ? route("schedule.store") : route("schedule.update", selectedSchedule.id);
    const method = modalMode === "add" ? post : patch;
    method(action, { onSuccess: () => {
      closeModal();
      fetchSchedules();
    } });
  };
  const handleDelete = () => {
    askConfirm(
      __2("Hapus Jadwal"),
      __2("Are you sure you want to delete this activity?"),
      () => destroy(route("schedule.destroy", selectedSchedule.id), { onSuccess: () => {
        closeModal();
        fetchSchedules();
      } })
    );
  };
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const fmtDate = (dateStr) => dateStr ? (/* @__PURE__ */ new Date(dateStr + "T00:00:00")).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }) : "";
  const fmtTime = (dt) => dt ? new Date(dt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "";
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    showBanner && pendingMeetingsCount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 p-4 bg-orange-50 border border-orange-300 rounded-xl shadow-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-orange-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-orange-800", children: pendingMeetingsCount === 1 ? __2("There is 1 mentor schedule waiting for your approval.") : __2("There are :count mentor schedules waiting for your approval.").replace(":count", pendingMeetingsCount) }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-orange-600 mt-0.5", children: __2("Click an orange date cell in the calendar below to review and approve.") }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: route("admin.schedule-approval.index"),
            className: "mt-2 inline-block text-xs font-semibold text-orange-700 underline hover:text-orange-900",
            children: __2("Go to Schedule Approval →")
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setShowBanner(false),
          className: "flex-shrink-0 text-orange-400 hover:text-orange-600 p-1 rounded",
          title: __2("Dismiss"),
          children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-sm rounded-xl border border-gray-200 p-6", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-base font-semibold text-gray-800 mb-4 flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-gray-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
        __2("Mentor Meeting Calendar"),
        /* @__PURE__ */ jsxs("span", { className: "ml-auto flex items-center gap-3 text-xs", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-orange-600", children: [
            /* @__PURE__ */ jsx("span", { className: "w-3 h-3 rounded-sm bg-orange-400 inline-block" }),
            __2("Pending Approval")
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-green-600", children: [
            /* @__PURE__ */ jsx("span", { className: "w-3 h-3 rounded-sm bg-green-400 inline-block" }),
            __2("All Approved")
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-green-700", children: [
            /* @__PURE__ */ jsx("span", { className: "w-3 h-3 rounded-sm bg-green-300 inline-block" }),
            __2("General Meeting")
          ] })
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
          eventClick: handleEventClick,
          dateClick: handleDateClick,
          dayCellClassNames,
          dayCellContent,
          dayMaxEvents: 3,
          height: "auto",
          eventTimeFormat: { hour: "2-digit", minute: "2-digit", hour12: false }
        }
      ),
      /* @__PURE__ */ jsx("style", { children: `
                    .fc-day-general-meeting { background-color: #DCFCE7 !important; }
                    .fc-day-general-meeting .fc-daygrid-day-number { color: #15803D; font-weight: 700; }
                    .fc-day-mentor-pending { background-color: #FED7AA !important; }
                    .fc-day-mentor-pending .fc-daygrid-day-number { color: #C2410C; font-weight: 700; }
                    .fc-day-mentor-approved { background-color: #BBF7D0 !important; cursor: pointer; }
                    .fc-day-mentor-approved .fc-daygrid-day-number { color: #15803D; font-weight: 700; }
                    .fc-day-mentor-pending:hover, .fc-day-mentor-approved:hover { filter: brightness(0.94); }
                    .fc-daygrid-day-top-inner { display: flex; flex-direction: column; align-items: flex-end; padding: 2px 4px; }
                    .fc-event { cursor: pointer; border-radius: 4px; font-size: 0.72rem; }

                    /* ── Dark mode ── */
                    .dark .fc { color: #e5e7eb; }
                    .dark .fc-toolbar-title { color: #f3f4f6 !important; }
                    .dark .fc th,
                    .dark .fc td,
                    .dark .fc-scrollgrid,
                    .dark .fc-scrollgrid-section > td { border-color: #374151 !important; }
                    .dark .fc .fc-col-header-cell { background-color: #1f2937; }
                    .dark .fc .fc-col-header-cell-cushion { color: #9ca3af !important; }
                    .dark .fc .fc-daygrid-day { background-color: #1f2937; }
                    .dark .fc .fc-daygrid-day-number { color: #d1d5db !important; }
                    .dark .fc .fc-day-other .fc-daygrid-day-number { color: #6b7280 !important; }
                    .dark .fc .fc-day-today { background-color: #312e81 !important; }
                    .dark .fc .fc-day-today .fc-daygrid-day-number { color: #a5b4fc !important; }
                    .dark .fc .fc-daygrid-more-link { color: #818cf8 !important; }
                    .dark .fc .fc-button {
                        background-color: #374151 !important;
                        border-color: #4b5563 !important;
                        color: #e5e7eb !important;
                    }
                    .dark .fc .fc-button:hover {
                        background-color: #4b5563 !important;
                        border-color: #6b7280 !important;
                    }
                    .dark .fc .fc-button:not(:disabled):active,
                    .dark .fc .fc-button-active {
                        background-color: #4f46e5 !important;
                        border-color: #4338ca !important;
                    }
                    .dark .fc-day-general-meeting { background-color: #14532d !important; }
                    .dark .fc-day-general-meeting .fc-daygrid-day-number { color: #86efac !important; }
                    .dark .fc-day-mentor-pending  { background-color: #7c2d12 !important; }
                    .dark .fc-day-mentor-pending  .fc-daygrid-day-number { color: #fdba74 !important; }
                    .dark .fc-day-mentor-approved { background-color: #14532d !important; }
                    .dark .fc-day-mentor-approved .fc-daygrid-day-number { color: #86efac !important; }

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
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 flex-1", children: [
          /* @__PURE__ */ jsx(
            TextInput,
            {
              placeholder: __2("Search schedules..."),
              value: filters.search,
              onChange: (e) => handleFilterChange("search", e.target.value),
              className: "w-full sm:w-64"
            }
          ),
          /* @__PURE__ */ jsxs(
            SelectInput,
            {
              value: filters.status,
              onChange: (e) => handleFilterChange("status", e.target.value),
              className: "w-full sm:w-40",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: __2("All Status") }),
                /* @__PURE__ */ jsx("option", { value: "scheduled", children: __2("Scheduled") }),
                /* @__PURE__ */ jsx("option", { value: "ongoing", children: __2("Ongoing") }),
                /* @__PURE__ */ jsx("option", { value: "completed", children: __2("Completed") }),
                /* @__PURE__ */ jsx("option", { value: "cancelled", children: __2("Cancelled") })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              type: "date",
              value: filters.date,
              onChange: (e) => handleFilterChange("date", e.target.value),
              className: "w-full sm:w-40"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(PrimaryButton, { onClick: () => openModal("add"), children: __2("Add Schedule") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200", children: [
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: __2("Activity") }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: __2("Date & Time") }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: __2("Priority") }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: __2("Notify To") }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: __2("PIC") }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: __2("Status") }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: __2("Actions") })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: loading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "7", className: "px-6 py-4 text-center text-gray-500", children: __2("Loading...") }) }) : schedules.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "7", className: "px-6 py-4 text-center text-gray-500", children: __2("No schedules found.") }) }) : schedules.map((schedule) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [
            /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [
              /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-gray-900", children: schedule.name }),
              schedule.location && /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: schedule.location })
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [
              /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-900", children: new Date(schedule.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500", children: [
                schedule.start_time?.substring(0, 5) || "-",
                " – ",
                schedule.end_time?.substring(0, 5) || "-"
              ] })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(schedule.priority)}`, children: __2(schedule.priority) }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800", children: schedule.notify_target === "all_user" ? __2("All Users") : schedule.notify_target === "mentor_only" ? __2("Mentor Only") : schedule.notify_target === "participant_only" ? __2("Participant Only") : schedule.notify_target === "staff_only" ? __2("Staff Only") : __2("All Users") }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: schedule.pic }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 capitalize", children: __2(schedule.status) }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => openModal("edit", schedule),
                className: "text-indigo-600 hover:text-indigo-900",
                children: __2("Edit")
              }
            ) })
          ] }, schedule.id)) })
        ] }) }),
        pagination.links && pagination.links.length > 3 && /* @__PURE__ */ jsx("div", { className: "px-6 py-4 border-t border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-700", children: [
            __2("Showing"),
            " ",
            pagination.from,
            " ",
            __2("to"),
            " ",
            pagination.to,
            " ",
            __2("of"),
            " ",
            pagination.total,
            " ",
            __2("results")
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-1", children: pagination.links.map((link, i) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handlePageChange(link.url),
              disabled: !link.url || link.active,
              className: `px-3 py-1 rounded text-sm ${link.active ? "bg-indigo-600 text-white" : !link.url ? "text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"}`,
              dangerouslySetInnerHTML: { __html: link.label }
            },
            i
          )) })
        ] }) })
      ] })
    ] }),
    dayModal.show && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto", role: "dialog", "aria-modal": "true", children: /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0", children: [
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity", onClick: () => setDayModal({ show: false, date: "", meetings: [] }) }),
      /* @__PURE__ */ jsx("span", { className: "hidden sm:inline-block sm:align-middle sm:h-screen", children: "​" }),
      /* @__PURE__ */ jsxs("div", { className: "inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white px-6 pt-5 pb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-base font-semibold text-gray-900", children: [
              __2("Mentor Schedules"),
              " — ",
              fmtDate(dayModal.date)
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setDayModal({ show: false, date: "", meetings: [] }),
                className: "text-gray-400 hover:text-gray-600",
                children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3 max-h-80 overflow-y-auto", children: dayModal.meetings.map((m) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: `p-3 rounded-lg border ${m.status === "pending" ? "bg-orange-50 border-orange-200" : "bg-green-50 border-green-200"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-900 truncate", children: m.mentor?.name ?? __2("Mentor") }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: AGENDA_LABELS[m.agenda_type] ?? m.agenda ?? __2("Meeting") }),
                    /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 mt-0.5", children: [
                      fmtTime(m.scheduled_at),
                      " – ",
                      fmtTime(m.end_time),
                      m.location ? ` · ${m.location}` : ""
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: `flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[m.status] ?? "bg-gray-100 text-gray-700"}`, children: STATUS_LABELS[m.status] ?? m.status })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "mt-2 flex justify-end", children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => openMeetingDetail(m.id),
                    className: "text-xs font-medium text-indigo-600 hover:text-indigo-800 underline",
                    children: __2("View Details")
                  }
                ) })
              ]
            },
            m.id
          )) }),
          dayModal.meetings.some((m) => m.status === "pending") && /* @__PURE__ */ jsx("div", { className: "mt-4 pt-3 border-t border-gray-100", children: /* @__PURE__ */ jsxs(
            "a",
            {
              href: route("admin.schedule-approval.index"),
              className: "inline-flex items-center gap-1 text-sm font-semibold text-orange-700 hover:text-orange-900 underline",
              children: [
                /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }),
                __2("Review pending schedules →")
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "bg-gray-50 px-6 py-3 flex justify-end", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setDayModal({ show: false, date: "", meetings: [] }),
            className: "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 shadow-sm",
            children: __2("Close")
          }
        ) })
      ] })
    ] }) }),
    detailModal.show && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[60] overflow-y-auto", role: "dialog", "aria-modal": "true", children: /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0", children: [
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity", onClick: () => setDetailModal({ show: false, meeting: null, loading: false }) }),
      /* @__PURE__ */ jsx("span", { className: "hidden sm:inline-block sm:align-middle sm:h-screen", children: "​" }),
      /* @__PURE__ */ jsx("div", { className: "inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full", children: detailModal.loading ? /* @__PURE__ */ jsxs("div", { className: "px-6 py-10 flex items-center justify-center", children: [
        /* @__PURE__ */ jsxs("svg", { className: "animate-spin h-6 w-6 text-indigo-500 mr-3", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
          /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
          /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8v8H4z" })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-500", children: [
          __2("Loading"),
          "…"
        ] })
      ] }) : detailModal.meeting && (() => {
        const m = detailModal.meeting;
        const mentorName = m.mentor ? `${m.mentor.first_name ?? ""} ${m.mentor.last_name ?? ""}`.trim() : __2("Mentor");
        m.approved_by ? m.approved_by_user ? `${m.approved_by_user.first_name ?? ""} ${m.approved_by_user.last_name ?? ""}`.trim() : String(m.approved_by) : null;
        const approvedByUser = m.approvedBy ?? null;
        const approvedByName = approvedByUser ? `${approvedByUser.first_name ?? ""} ${approvedByUser.last_name ?? ""}`.trim() : null;
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white px-6 pt-5 pb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold text-gray-900", children: __2("Meeting Details") }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setDetailModal({ show: false, meeting: null, loading: false }),
                  className: "text-gray-400 hover:text-gray-600",
                  children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-400 uppercase tracking-wide", children: __2("Mentor") }),
                /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-gray-800 font-medium", children: mentorName }),
                m.mentor?.email && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: m.mentor.email })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-400 uppercase tracking-wide", children: __2("Status") }),
                /* @__PURE__ */ jsx("span", { className: `inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[m.status] ?? "bg-gray-100 text-gray-700"}`, children: STATUS_LABELS[m.status] ?? m.status })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-400 uppercase tracking-wide", children: __2("Agenda Type") }),
                /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-gray-800", children: AGENDA_LABELS[m.agenda_type] ?? m.agenda_type ?? "—" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-400 uppercase tracking-wide", children: __2("Date & Time") }),
                /* @__PURE__ */ jsxs("p", { className: "mt-0.5 text-gray-800", children: [
                  fmtDate(m.scheduled_at),
                  " ",
                  fmtTime(m.scheduled_at),
                  " – ",
                  fmtTime(m.end_time)
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-400 uppercase tracking-wide", children: __2("Location") }),
                /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-gray-800", children: m.location || "—" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-400 uppercase tracking-wide", children: __2("Meeting Link") }),
                m.meeting_link ? /* @__PURE__ */ jsx("a", { href: m.meeting_link, target: "_blank", rel: "noopener noreferrer", className: "mt-0.5 text-indigo-600 underline break-all", children: m.meeting_link }) : /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-gray-800", children: "—" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-400 uppercase tracking-wide", children: __2("Max Participants") }),
                /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-gray-800", children: m.max_participants ?? "—" })
              ] }),
              m.approved_at && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-400 uppercase tracking-wide", children: __2("Approved By") }),
                /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-gray-800", children: approvedByName ?? "—" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: fmtDate(m.approved_at) })
              ] }),
              m.agenda && /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-400 uppercase tracking-wide", children: __2("Agenda") }),
                /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-gray-800 whitespace-pre-wrap", children: m.agenda })
              ] }),
              m.tools_materials && /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-400 uppercase tracking-wide", children: __2("Tools & Materials") }),
                /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-gray-800 whitespace-pre-wrap", children: m.tools_materials })
              ] }),
              m.notes && /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-400 uppercase tracking-wide", children: __2("Notes") }),
                /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-gray-800 whitespace-pre-wrap", children: m.notes })
              ] }),
              m.rejection_reason && /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-red-400 uppercase tracking-wide", children: __2("Rejection / Modification Reason") }),
                /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-red-700 whitespace-pre-wrap", children: m.rejection_reason })
              ] }),
              m.participants && m.participants.length > 0 && /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
                /* @__PURE__ */ jsxs("p", { className: "text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1", children: [
                  __2("Participants"),
                  " (",
                  m.participants.length,
                  ")"
                ] }),
                /* @__PURE__ */ jsx("ul", { className: "divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden", children: m.participants.map((p) => /* @__PURE__ */ jsxs("li", { className: "flex items-center justify-between px-3 py-1.5 bg-white", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-800", children: `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() }),
                  p.pivot?.status && /* @__PURE__ */ jsx("span", { className: `text-xs px-2 py-0.5 rounded-full font-medium ${p.pivot.status === "confirmed" ? "bg-green-100 text-green-700" : p.pivot.status === "declined" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`, children: p.pivot.status })
                ] }, p.id)) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-gray-50 px-6 py-3 flex justify-end", children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDetailModal({ show: false, meeting: null, loading: false }),
              className: "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 shadow-sm",
              children: __2("Close")
            }
          ) })
        ] });
      })() })
    ] }) }),
    /* @__PURE__ */ jsx(Modal, { show: isModalOpen, onClose: closeModal, children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 mb-6", children: modalMode === "add" ? __2("Add Schedule") : __2("Edit Schedule") }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "name", value: __2("Activity Name") }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "name",
              value: data.name,
              onChange: (e) => setData("name", e.target.value),
              className: "mt-1 block w-full",
              required: true
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.name, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "date", value: __2("Date") }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "date",
                type: "date",
                value: data.date,
                onChange: (e) => setData("date", e.target.value),
                className: "mt-1 block w-full",
                required: true
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.date, className: "mt-2" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "status", value: __2("Status") }),
            /* @__PURE__ */ jsxs(
              SelectInput,
              {
                id: "status",
                value: data.status,
                onChange: (e) => setData("status", e.target.value),
                className: "mt-1 block w-full",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "scheduled", children: __2("Scheduled") }),
                  /* @__PURE__ */ jsx("option", { value: "ongoing", children: __2("Ongoing") }),
                  /* @__PURE__ */ jsx("option", { value: "completed", children: __2("Completed") }),
                  /* @__PURE__ */ jsx("option", { value: "cancelled", children: __2("Cancelled") })
                ]
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.status, className: "mt-2" })
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
              __2("All Day"),
              " ",
              /* @__PURE__ */ jsxs("span", { className: "text-gray-400 font-normal", children: [
                "(24 ",
                __2("hours"),
                ")"
              ] })
            ] })
          ] }),
          !data.all_day && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { htmlFor: "start_time", value: __2("Start Time") }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "start_time",
                  type: "time",
                  value: data.start_time,
                  onChange: (e) => setData("start_time", e.target.value),
                  className: "mt-1 block w-full",
                  required: true
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.start_time, className: "mt-2" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { htmlFor: "end_time", value: __2("End Time") }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "end_time",
                  type: "time",
                  value: data.end_time,
                  onChange: (e) => setData("end_time", e.target.value),
                  className: "mt-1 block w-full",
                  required: true
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.end_time, className: "mt-2" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "location", value: __2("Location") }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "location",
              value: data.location,
              onChange: (e) => setData("location", e.target.value),
              className: "mt-1 block w-full"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.location, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "priority", value: __2("Priority") }),
            /* @__PURE__ */ jsxs(
              SelectInput,
              {
                id: "priority",
                value: data.priority,
                onChange: (e) => setData("priority", e.target.value),
                className: "mt-1 block w-full",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "low", children: __2("Low") }),
                  /* @__PURE__ */ jsx("option", { value: "medium", children: __2("Medium") }),
                  /* @__PURE__ */ jsx("option", { value: "high", children: __2("High") })
                ]
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.priority, className: "mt-2" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "pic", value: __2("PIC") }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "pic",
                value: data.pic,
                onChange: (e) => setData("pic", e.target.value),
                className: "mt-1 block w-full",
                required: true
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.pic, className: "mt-2" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "description", value: __2("Description") }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "description",
              value: data.description,
              onChange: (e) => setData("description", e.target.value),
              className: "mt-1 block w-full"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.description, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "notify_target", value: __2("Notify To") }),
          /* @__PURE__ */ jsxs(
            SelectInput,
            {
              id: "notify_target",
              value: data.notify_target,
              onChange: (e) => setData("notify_target", e.target.value),
              className: "mt-1 block w-full",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all_user", children: __2("All Users") }),
                /* @__PURE__ */ jsx("option", { value: "mentor_only", children: __2("Mentor Only") }),
                /* @__PURE__ */ jsx("option", { value: "participant_only", children: __2("Participant Only") }),
                /* @__PURE__ */ jsx("option", { value: "staff_only", children: __2("Staff Only") })
              ]
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.notify_target, className: "mt-2" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-between", children: [
        modalMode === "edit" ? /* @__PURE__ */ jsx(DangerButton, { type: "button", onClick: handleDelete, disabled: processing, children: __2("Delete") }) : /* @__PURE__ */ jsx("div", {}),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx(SecondaryButton, { onClick: closeModal, children: __2("Cancel") }),
          /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: modalMode === "add" ? __2("Create") : __2("Update") })
        ] })
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
        confirmLabel: __2("Ya, Hapus")
      }
    )
  ] });
}
function LetterHistory({ letters, filters }) {
  const [search, setSearch] = useState(filters.letter_search || "");
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      router.get(
        route("dashboard"),
        { ...filters, letter_search: value, active_tab: "letters" },
        { preserveState: true, preserveScroll: true, replace: true }
      );
    }, 500);
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-center mb-6 gap-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Riwayat Surat") }),
      /* @__PURE__ */ jsx("div", { className: "w-full sm:w-64", children: /* @__PURE__ */ jsx(
        TextInput,
        {
          type: "text",
          placeholder: __("Cari Nomor Surat / Perihal..."),
          value: search,
          onChange: handleSearch,
          className: "w-full"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 dark:bg-gray-700", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __("Nomor Surat") }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __("Tanggal") }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __("Perihal") }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __("Status") }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __("Aksi") })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700", children: letters.data.length > 0 ? letters.data.map((letter) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-700", children: [
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100", children: letter.letter_number }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400", children: new Date(letter.sent_at).toLocaleDateString() }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-gray-500 dark:text-gray-400", children: letter.subject }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${letter.status === "read" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : letter.status === "received" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"}`, children: letter.status === "read" ? __("Dibaca") : letter.status === "received" ? __("Diterima") : __("Terkirim") }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: letter.file_path ? /* @__PURE__ */ jsx(
          "a",
          {
            href: `/storage/${letter.file_path}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300",
            children: __("Unduh PDF")
          }
        ) : /* @__PURE__ */ jsx("span", { className: "text-gray-400 cursor-not-allowed", children: __("Tidak ada file") }) })
      ] }, letter.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "5", className: "px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400", children: __("Tidak ada riwayat surat.") }) }) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(Pagination, { links: letters.links }) })
  ] });
}
function GiftHistory({ gifts, filters }) {
  const [dateStart, setDateStart] = useState(filters.gift_date_start || "");
  const [dateEnd, setDateEnd] = useState(filters.gift_date_end || "");
  const handleFilter = () => {
    router.get(
      route("dashboard"),
      { ...filters, gift_date_start: dateStart, gift_date_end: dateEnd, active_tab: "gifts" },
      { preserveState: true, preserveScroll: true, replace: true }
    );
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-center mb-6 gap-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Riwayat Gift") }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 w-full sm:w-auto items-end", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "block text-xs text-gray-500 mb-1", children: __("Dari") }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              type: "date",
              value: dateStart,
              onChange: (e) => setDateStart(e.target.value),
              className: "w-full text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "block text-xs text-gray-500 mb-1", children: __("Sampai") }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              type: "date",
              value: dateEnd,
              onChange: (e) => setDateEnd(e.target.value),
              className: "w-full text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleFilter,
            className: "px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150 h-[42px]",
            children: __("Filter")
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 dark:bg-gray-700", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __("Kode Hadiah") }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __("Tanggal") }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __("Jenis") }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __("Nilai") }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __("Status") })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700", children: gifts.data.length > 0 ? gifts.data.map((gift) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-700", children: [
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 dark:text-indigo-400", children: gift.gift_code }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400", children: new Date(gift.created_at).toLocaleDateString() }),
        /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize", children: [
          gift.type,
          " (",
          gift.model,
          ")"
        ] }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400", children: gift.gift_value ? `Rp ${parseInt(gift.gift_value).toLocaleString("id-ID")}` : "-" }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${gift.status === "received" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : gift.status === "returned" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" : gift.status === "pending_verification" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"}`, children: gift.status === "received" ? __("Diterima") : gift.status === "returned" ? __("Dikembalikan") : gift.status === "pending_verification" ? __("Verifikasi") : __("Pending") }) })
      ] }, gift.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "5", className: "px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400", children: __("Tidak ada riwayat hadiah.") }) }) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(Pagination, { links: gifts.links }) })
  ] });
}
const PERF_CRITERIA_KEYS = [
  { key: "jadwal", labelKey: "Jadwal", descKey: "Schedule criteria desc" },
  { key: "kehadiran", labelKey: "Kehadiran", descKey: "Attendance criteria desc" },
  { key: "surat", labelKey: "Surat", descKey: "Letter criteria desc" },
  { key: "gift", labelKey: "Gift", descKey: "Gift criteria desc" },
  { key: "update_anak", labelKey: "Update", descKey: "Child Update criteria desc" }
];
function PerfBar({ value }) {
  const pct = Math.min(value / 10 * 100, 100);
  const color = value >= 8 ? "bg-green-500" : value >= 5 ? "bg-yellow-400" : "bg-red-500";
  return /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1", children: /* @__PURE__ */ jsx("div", { className: `${color} h-2 rounded-full transition-all`, style: { width: `${pct}%` } }) });
}
function Dashboard({ auth, photoRequests, letters, gifts, filters, mentorPerformance }) {
  const __2 = useTrans();
  const user = auth.user;
  const role = user?.role ? String(user.role) : "participant";
  const PERF_CRITERIA = PERF_CRITERIA_KEYS.map((c) => ({
    key: c.key,
    label: __2(c.labelKey),
    desc: __2(c.descKey)
  }));
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get("active_tab");
      if (tabParam) return tabParam;
      return localStorage.getItem("dashboard_tab") ?? "overview";
    } catch {
      return "overview";
    }
  });
  const changeTab = (tab) => {
    setActiveTab(tab);
    try {
      localStorage.setItem("dashboard_tab", tab);
    } catch {
    }
  };
  const getUserName = () => user?.name || user?.first_name || __2("User");
  const getUserInitials = () => getUserName().charAt(0).toUpperCase();
  if (!user) {
    return null;
  }
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("h2", { className: "text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200", children: [
        __2("Dashboard"),
        " ",
        __2(user?.role)
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __2("Dashboard") }),
        /* @__PURE__ */ jsx("div", { className: "py-6 sm:py-12", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800", children: /* @__PURE__ */ jsxs("div", { className: "p-6 text-gray-900 dark:text-gray-100", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-8 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                ProfilePhoto,
                {
                  src: user.profile_photo_url,
                  alt: getUserName(),
                  className: "w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md",
                  fallbackClassName: "w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold border-4 border-white dark:border-gray-800 shadow-md",
                  fallback: getUserInitials()
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 shadow-sm ${user.profile_photo_status === "active" ? "bg-green-500" : user.profile_photo_status === "pending" ? "bg-yellow-500" : "bg-red-500"}`,
                  title: `${__2("Photo Status")}: ${__2(
                    user.profile_photo_status
                  )}`
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 text-center md:text-left", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold", children: getUserName() }),
              user.role === "participant" && user.id_number && /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400 mb-1", children: [
                "ID: ",
                user.id_number
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mb-2", children: user.email }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center md:justify-start gap-2", children: [
                /* @__PURE__ */ jsxs(
                  "span",
                  {
                    className: `px-2 py-0.5 text-xs rounded-full ${user.profile_photo_status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : user.profile_photo_status === "pending" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`,
                    children: [
                      __2("Photo Status"),
                      ":",
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "capitalize", children: __2(
                        user.profile_photo_status
                      ) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 capitalize", children: __2(user.role) })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "border-b border-gray-200 dark:border-gray-700 mb-6", children: /* @__PURE__ */ jsxs("nav", { className: "-mb-px flex space-x-8 overflow-x-auto", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => changeTab("overview"),
                  className: `${activeTab === "overview" ? "border-indigo-500 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`,
                  children: __2("Overview")
                }
              ),
              role === "participant" && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => changeTab("letters"),
                    className: `${activeTab === "letters" ? "border-indigo-500 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`,
                    children: __2("Letter History")
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => changeTab("gifts"),
                    className: `${activeTab === "gifts" ? "border-indigo-500 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`,
                    children: __2("Gift History")
                  }
                )
              ] }),
              user.role === "admin" && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => changeTab("schedule"),
                    className: `${activeTab === "schedule" ? "border-indigo-500 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`,
                    children: __2("Schedule")
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => changeTab("photos"),
                    className: `${activeTab === "photos" ? "border-indigo-500 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`,
                    children: [
                      __2("Photo Requests"),
                      photoRequests && photoRequests.length > 0 && /* @__PURE__ */ jsx("span", { className: "ml-2 bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200 py-0.5 px-2 rounded-full text-xs", children: photoRequests.length })
                    ]
                  }
                )
              ] }),
              (role === "admin" || role === "mentor") && /* @__PURE__ */ jsxs(
                Link,
                {
                  href: route("health-screenings.index"),
                  className: `border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`,
                  children: [
                    /* @__PURE__ */ jsx("span", { children: __2("Pemeriksaan Kesehatan") }),
                    /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" }) })
                  ]
                }
              )
            ] }) }),
            activeTab === "overview" && /* @__PURE__ */ jsxs("div", { className: "animate-fade-in", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold mb-4", children: role === "admin" ? __2("Admin Panel") : role === "mentor" ? __2("Mentor Panel") : __2("Participant Panel") }),
              /* @__PURE__ */ jsx("p", { className: "mb-6", children: role === "admin" ? __2("Welcome, Administrator. You have full access to the system.") : role === "mentor" ? __2("Welcome, Mentor. You can manage participants and health checks.") : __2("Welcome to the Child Development Program. Please check your schedule.", { nickname: user.nickname || user.first_name }) }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
                user.role === "admin" && /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route(
                      "mentors.index"
                    ),
                    className: "p-6 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition shadow-sm dark:bg-blue-900/20 dark:border-blue-800 dark:hover:bg-blue-900/30",
                    children: [
                      /* @__PURE__ */ jsx("h4", { className: "font-semibold text-blue-700 dark:text-blue-400", children: __2("Mentor List") }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm text-blue-600 mt-2 dark:text-blue-500", children: __2(
                        "Manage and view all registered mentors."
                      ) })
                    ]
                  }
                ),
                user.role === "admin" && /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route(
                      "participants.index"
                    ),
                    className: "p-6 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition shadow-sm dark:bg-green-900/20 dark:border-green-800 dark:hover:bg-green-900/30",
                    children: [
                      /* @__PURE__ */ jsx("h4", { className: "font-semibold text-green-700 dark:text-green-400", children: __2("Participant List") }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm text-green-600 mt-2 dark:text-green-500", children: __2(
                        "Manage and view all registered participants."
                      ) })
                    ]
                  }
                ),
                user.role === "admin" && /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route("profile.edit"),
                    className: "p-6 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition shadow-sm dark:bg-indigo-900/20 dark:border-indigo-800 dark:hover:bg-indigo-900/30",
                    children: [
                      /* @__PURE__ */ jsx("h4", { className: "font-semibold text-indigo-700 dark:text-indigo-400", children: __2("Admin List") }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm text-indigo-600 mt-2 dark:text-indigo-500", children: __2("Manage registered administrators.") })
                    ]
                  }
                ),
                user.role === "mentor" && /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route("participants.index"),
                    className: "p-6 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition shadow-sm dark:bg-green-900/20 dark:border-green-800 dark:hover:bg-green-900/30",
                    children: [
                      /* @__PURE__ */ jsx("h4", { className: "font-semibold text-green-700 dark:text-green-400", children: __2("Participant List") }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm text-green-600 mt-2 dark:text-green-500", children: __2(
                        "View your assigned participants."
                      ) })
                    ]
                  }
                ),
                user.role === "mentor" && mentorPerformance && /* @__PURE__ */ jsxs("div", { className: "col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-5 shadow-sm", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("h4", { className: "font-bold text-indigo-700 dark:text-indigo-300 text-base", children: __2("My Performance Assessment") }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-indigo-500 dark:text-indigo-400 mt-0.5", children: __2("Score range 1–10 points per criteria") })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                      /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400", children: __2("Total Points") }),
                      /* @__PURE__ */ jsxs("div", { className: `text-3xl font-black tabular-nums ${mentorPerformance.total >= 8 ? "text-green-600 dark:text-green-400" : mentorPerformance.total >= 5 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"}`, children: [
                        mentorPerformance.total.toFixed(2),
                        /* @__PURE__ */ jsx("span", { className: "text-base font-normal text-gray-400", children: "/10" })
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: `text-xs font-semibold mt-0.5 ${mentorPerformance.total >= 8 ? "text-green-600 dark:text-green-400" : mentorPerformance.total >= 5 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"}`, children: mentorPerformance.total >= 8 ? __2("Good Performance") : mentorPerformance.total >= 5 ? __2("Fair Performance") : __2("Needs Improvement") })
                    ] }) })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3", children: PERF_CRITERIA.map((c) => {
                    const val = mentorPerformance[c.key] ?? 0;
                    return /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800/60 rounded-lg p-3 shadow-sm", children: [
                      /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1", children: c.label }),
                      /* @__PURE__ */ jsx("div", { className: `text-xl font-black tabular-nums ${val >= 8 ? "text-green-600 dark:text-green-400" : val >= 5 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"}`, children: val.toFixed(2) }),
                      /* @__PURE__ */ jsx(PerfBar, { value: val }),
                      /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-400 mt-1.5 leading-tight", children: c.desc })
                    ] }, c.key);
                  }) })
                ] }),
                user.role === "admin" && /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route("participants.update-log"),
                    className: "p-6 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition shadow-sm dark:bg-teal-900/20 dark:border-teal-800 dark:hover:bg-teal-900/30",
                    children: [
                      /* @__PURE__ */ jsx("h4", { className: "font-semibold text-teal-700 dark:text-teal-400", children: __2("Daftar Pembaruan Partisipan") }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm text-teal-600 mt-2 dark:text-teal-500", children: __2("View participants sorted by latest update.") })
                    ]
                  }
                ),
                user.role === "admin" && /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route(
                      "gifts.index"
                    ),
                    className: "p-6 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition shadow-sm dark:bg-yellow-900/20 dark:border-yellow-800 dark:hover:bg-yellow-900/30",
                    children: [
                      /* @__PURE__ */ jsx("h4", { className: "font-semibold text-yellow-700 dark:text-yellow-400", children: __2("Gift Recipients List") }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm text-yellow-600 mt-2 dark:text-yellow-500", children: __2(
                        "Manage gift recipients list."
                      ) })
                    ]
                  }
                ),
                user.role === "mentor" && /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route("gifts.index"),
                    className: "p-6 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition shadow-sm dark:bg-yellow-900/20 dark:border-yellow-800 dark:hover:bg-yellow-900/30",
                    children: [
                      /* @__PURE__ */ jsx("h4", { className: "font-semibold text-yellow-700 dark:text-yellow-400", children: __2("Gift Recipients List") }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm text-yellow-600 mt-2 dark:text-yellow-500", children: __2(
                        "View gifts received by your participants."
                      ) })
                    ]
                  }
                ),
                user.role === "admin" && /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route(
                      "admin.attendance.monitor"
                    ),
                    className: "p-6 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition shadow-sm dark:bg-purple-900/20 dark:border-purple-800 dark:hover:bg-purple-900/30",
                    children: [
                      /* @__PURE__ */ jsx("h4", { className: "font-semibold text-purple-700 dark:text-purple-400", children: __2(
                        "Attendance Monitor"
                      ) }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm text-purple-600 mt-2 dark:text-purple-500", children: __2(
                        "Monitor mentor attendance and QR codes."
                      ) })
                    ]
                  }
                )
              ] })
            ] }),
            activeTab === "schedule" && user.role === "admin" && /* @__PURE__ */ jsx("div", { className: "animate-fade-in", children: /* @__PURE__ */ jsx(ScheduleTab, {}) }),
            activeTab === "photos" && user.role === "admin" && /* @__PURE__ */ jsx("div", { className: "animate-fade-in", children: /* @__PURE__ */ jsx(
              PhotoRequestsTab,
              {
                initialRequests: photoRequests
              }
            ) }),
            activeTab === "letters" && role === "participant" && /* @__PURE__ */ jsx("div", { className: "animate-fade-in", children: /* @__PURE__ */ jsx(LetterHistory, { letters, filters }) }),
            activeTab === "gifts" && role === "participant" && /* @__PURE__ */ jsx("div", { className: "animate-fade-in", children: /* @__PURE__ */ jsx(GiftHistory, { gifts, filters }) })
          ] })
        ] }) }) }) })
      ]
    }
  );
}
export {
  Dashboard as default
};
