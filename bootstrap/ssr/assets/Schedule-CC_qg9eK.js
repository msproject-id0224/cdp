import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect, useMemo } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BG6RGD2S.js";
import { usePage, useForm, Head } from "@inertiajs/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import idLocale from "@fullcalendar/core/locales/id";
import { M as Modal } from "./Modal-CKHW52Ki.js";
import { I as InputLabel } from "./InputLabel-DDs2XNYP.js";
import { T as TextInput } from "./TextInput-D0qTZeQv.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { P as PrimaryButton } from "./PrimaryButton-BNNL2gCI.js";
import { S as SecondaryButton } from "./SecondaryButton-TjIrbn1G.js";
import { D as DangerButton } from "./DangerButton-B7to2Tbx.js";
import { S as SelectInput } from "./SelectInput-inadq0Bq.js";
import { u as useTrans, _ as __ } from "./lang-COBcTD8W.js";
import axios from "axios";
import { P as ProfilePhoto } from "./ProfilePhoto-CJ2Z04pO.js";
import { QRCodeCanvas } from "qrcode.react";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "./ThemeToggle-BY9dagkZ.js";
import "./Footer-B7ihPSZ8.js";
import "./useTheme-CngFDcs1.js";
function Checkbox({ className = "", ...props }) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      ...props,
      type: "checkbox",
      className: "rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 " + className
    }
  );
}
function MentorScheduleTab() {
  const __2 = useTrans();
  const { auth, locale } = usePage().props;
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [generalMeetingDates, setGeneralMeetingDates] = useState(/* @__PURE__ */ new Set());
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [modalMode, setModalMode] = useState("create_availability");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [filterParticipant, setFilterParticipant] = useState("all");
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const exportDropdownRef = useRef(null);
  const [listSearch, setListSearch] = useState("");
  const [listStatus, setListStatus] = useState("all");
  const [listStartDate, setListStartDate] = useState("");
  const [listEndDate, setListEndDate] = useState("");
  useRef(null);
  const availabilityForm = useForm({
    start_time: "",
    end_time: "",
    day_of_week: "",
    is_recurring: false,
    specific_date: ""
  });
  const meetingForm = useForm({
    participant_ids: [],
    max_participants: 1,
    scheduled_at: "",
    end_time: "",
    location: "",
    meeting_link: "",
    agenda_type: "",
    agenda: "",
    tools_materials: "",
    notes: "",
    status: "scheduled"
  });
  const [participantSearch, setParticipantSearch] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: "", message: "", onConfirm: null, onCancel: null });
  const [notification, setNotification] = useState(null);
  const showConfirm = (title, message, onConfirm, onCancel = null) => {
    setConfirmDialog({ open: true, title, message, onConfirm, onCancel });
  };
  const closeConfirm = (confirmed = false) => {
    if (!confirmed) confirmDialog.onCancel?.();
    setConfirmDialog({ open: false, title: "", message: "", onConfirm: null, onCancel: null });
  };
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };
  useEffect(() => {
    fetchSchedules();
    axios.get(route("api.general-meeting-dates")).then((res) => setGeneralMeetingDates(new Set(res.data))).catch(() => {
    });
  }, []);
  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await axios.get(route("api.mentor-schedules"));
      const { availabilities, meetings, participants: participants2 } = response.data;
      setParticipants(participants2 || []);
      const calendarEvents = [];
      availabilities.forEach((avail) => {
        if (avail.is_recurring) {
          calendarEvents.push({
            id: `avail-${avail.id}`,
            groupId: "available",
            daysOfWeek: [avail.day_of_week],
            // 0=Sunday
            startTime: avail.start_time,
            endTime: avail.end_time,
            display: "background",
            color: "#10B981",
            // Green
            extendedProps: { type: "availability", data: avail }
          });
        } else {
          calendarEvents.push({
            id: `avail-${avail.id}`,
            groupId: "available",
            start: `${avail.specific_date}T${avail.start_time}`,
            end: `${avail.specific_date}T${avail.end_time}`,
            display: "background",
            color: "#10B981",
            extendedProps: { type: "availability", data: avail }
          });
        }
      });
      meetings.forEach((meeting) => {
        let color = "#3B82F6";
        if (meeting.status === "confirmed") color = "#10B981";
        if (meeting.status === "cancelled") color = "#6B7280";
        if (meeting.status === "pending") color = "#F59E0B";
        if (meeting.status === "deletion_requested") color = "#EF4444";
        const start = meeting.scheduled_at.endsWith("Z") ? meeting.scheduled_at : meeting.scheduled_at + "Z";
        const end = meeting.end_time.endsWith("Z") ? meeting.end_time : meeting.end_time + "Z";
        calendarEvents.push({
          id: `meeting-${meeting.id}`,
          title: `${__2("Meeting")} (${meeting.participants?.length || 0}/${meeting.max_participants})`,
          start,
          end,
          backgroundColor: color,
          borderColor: color,
          extendedProps: { type: "meeting", data: meeting }
        });
      });
      setEvents(calendarEvents);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };
  const toDateTimeLocal = (date) => {
    const pad = (n) => n < 10 ? "0" + n : n;
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()) + "T" + pad(date.getHours()) + ":" + pad(date.getMinutes());
  };
  const handleShowQr = (id) => {
    setQrData(id);
    setIsQrModalOpen(true);
  };
  const handleDateSelect = (selectInfo) => {
    const clickedDate = selectInfo.startStr.split("T")[0];
    if (!generalMeetingDates.has(clickedDate)) {
      showNotification("error", __2("This date has not been approved by admin for scheduling."));
      return;
    }
    setSelectedDate(selectInfo);
    let startStr, endStr;
    let startTimeStr, endTimeStr;
    if (selectInfo.allDay) {
      const s = new Date(selectInfo.start);
      s.setHours(14, 0, 0, 0);
      const e = new Date(selectInfo.start);
      e.setHours(16, 0, 0, 0);
      startStr = toDateTimeLocal(s);
      endStr = toDateTimeLocal(e);
      startTimeStr = "14:00";
      endTimeStr = "16:00";
    } else {
      startStr = toDateTimeLocal(selectInfo.start);
      endStr = toDateTimeLocal(selectInfo.end);
      startTimeStr = selectInfo.start.toTimeString().substring(0, 5);
      endTimeStr = selectInfo.end.toTimeString().substring(0, 5);
    }
    meetingForm.setData({
      participant_ids: [],
      max_participants: 1,
      scheduled_at: startStr,
      end_time: endStr,
      location: "",
      meeting_link: "",
      agenda_type: "pertemuan_umum",
      agenda: "",
      tools_materials: "",
      notes: "",
      status: "scheduled"
    });
    setParticipantSearch("");
    availabilityForm.setData({
      ...availabilityForm.data,
      start_time: startTimeStr,
      end_time: endTimeStr,
      specific_date: selectInfo.startStr.split("T")[0],
      day_of_week: selectInfo.start.getDay()
    });
    setModalMode("create_meeting");
    setIsModalOpen(true);
  };
  const handleEventClick = (clickInfo) => {
    const { type, data } = clickInfo.event.extendedProps;
    setSelectedEvent({ type, data });
    if (type === "meeting") {
      const utcStart = new Date(data.scheduled_at.endsWith("Z") ? data.scheduled_at : data.scheduled_at + "Z");
      const utcEnd = new Date(data.end_time.endsWith("Z") ? data.end_time : data.end_time + "Z");
      meetingForm.setData({
        participant_ids: data.participants ? data.participants.map((p) => p.id) : data.participant_id ? [data.participant_id] : [],
        max_participants: data.max_participants || 1,
        scheduled_at: toDateTimeLocal(utcStart),
        end_time: toDateTimeLocal(utcEnd),
        location: data.location || "",
        meeting_link: data.meeting_link || "",
        agenda_type: data.agenda_type || "",
        agenda: data.agenda || "",
        tools_materials: data.tools_materials || "",
        notes: data.notes || "",
        status: data.status
      });
      setParticipantSearch("");
      setModalMode("edit_meeting");
    } else {
      setModalMode("view_availability");
    }
    setIsModalOpen(true);
  };
  const submitAvailability = (e) => {
    e.preventDefault();
    availabilityForm.clearErrors();
    axios.post(route("api.mentor-availability.store"), availabilityForm.data).then((response) => {
      setIsModalOpen(false);
      availabilityForm.reset();
      showNotification("success", __2("Availability saved successfully."));
      const avail = response.data;
      if (avail?.id) {
        setEvents((prev) => [...prev, buildAvailabilityEvent(avail)]);
      } else {
        fetchSchedules();
      }
    }).catch((error) => {
      if (error.response?.status === 422) {
        Object.keys(error.response.data.errors).forEach((key) => {
          availabilityForm.setError(key, error.response.data.errors[key][0]);
        });
      } else {
        console.error("Error saving availability:", error);
        showNotification("error", __2("Failed to save availability. Please try again."));
      }
    });
  };
  const buildAvailabilityEvent = (avail) => {
    if (avail.is_recurring) {
      return {
        id: `avail-${avail.id}`,
        groupId: "available",
        daysOfWeek: [avail.day_of_week],
        startTime: avail.start_time,
        endTime: avail.end_time,
        display: "background",
        color: "#10B981",
        extendedProps: { type: "availability", data: avail }
      };
    }
    return {
      id: `avail-${avail.id}`,
      groupId: "available",
      start: `${avail.specific_date}T${avail.start_time}`,
      end: `${avail.specific_date}T${avail.end_time}`,
      display: "background",
      color: "#10B981",
      extendedProps: { type: "availability", data: avail }
    };
  };
  const buildMeetingEvent = (meeting) => {
    let color = "#3B82F6";
    if (meeting.status === "confirmed") color = "#10B981";
    if (meeting.status === "cancelled") color = "#6B7280";
    if (meeting.status === "pending") color = "#F59E0B";
    if (meeting.status === "deletion_requested") color = "#EF4444";
    const start = (meeting.scheduled_at || "").endsWith("Z") ? meeting.scheduled_at : meeting.scheduled_at + "Z";
    const end = (meeting.end_time || "").endsWith("Z") ? meeting.end_time : meeting.end_time + "Z";
    return {
      id: `meeting-${meeting.id}`,
      title: `${__2("Meeting")} (${meeting.participants?.length ?? 0}/${meeting.max_participants})`,
      start,
      end,
      backgroundColor: color,
      borderColor: color,
      extendedProps: { type: "meeting", data: meeting }
    };
  };
  const submitMeeting = (e) => {
    e.preventDefault();
    meetingForm.clearErrors();
    const isEdit = modalMode === "edit_meeting";
    if (!isEdit) {
      const scheduledAt = new Date(meetingForm.data.scheduled_at);
      if (scheduledAt <= /* @__PURE__ */ new Date()) {
        meetingForm.setError("scheduled_at", __2("Meeting time must be in the future."));
        return;
      }
    }
    const url = isEdit ? route("api.mentor-meetings.update", selectedEvent.data.id) : route("api.mentor-meetings.store");
    const method = isEdit ? "patch" : "post";
    const payload = {
      ...meetingForm.data,
      scheduled_at: new Date(meetingForm.data.scheduled_at).toISOString(),
      end_time: new Date(meetingForm.data.end_time).toISOString()
    };
    axios[method](url, payload).then((response) => {
      setIsModalOpen(false);
      meetingForm.reset();
      showNotification("success", response.data.message || __2("Meeting saved successfully."));
      const meeting = response.data.meeting;
      if (meeting) {
        const newEvent = buildMeetingEvent(meeting);
        if (isEdit) {
          setEvents((prev) => prev.map((e2) => e2.id === newEvent.id ? newEvent : e2));
        } else {
          setEvents((prev) => [...prev, newEvent]);
        }
      } else {
        fetchSchedules();
      }
    }).catch((error) => {
      if (error.response?.status === 422) {
        if (error.response.data.errors) {
          Object.keys(error.response.data.errors).forEach((key) => {
            meetingForm.setError(key, error.response.data.errors[key][0]);
          });
        } else if (error.response.data.message) {
          meetingForm.setError("scheduled_at", error.response.data.message);
        }
      } else {
        console.error("Error saving meeting:", error);
        showNotification("error", __2("Failed to save meeting. Please try again."));
      }
    });
  };
  const deleteAvailability = () => {
    if (!selectedEvent || selectedEvent.type !== "availability") return;
    showConfirm(
      __2("Delete Availability"),
      __2("Are you sure you want to delete this availability slot?"),
      () => {
        axios.delete(route("api.mentor-availability.destroy", selectedEvent.data.id)).then(() => {
          setIsModalOpen(false);
          showNotification("success", __2("Availability deleted."));
          const deletedId = `avail-${selectedEvent.data.id}`;
          setEvents((prev) => prev.filter((e) => e.id !== deletedId));
        }).catch(() => showNotification("error", __2("Failed to delete availability.")));
      }
    );
  };
  const deleteMeeting = () => {
    if (!selectedEvent || selectedEvent.type !== "meeting") return;
    const meeting = selectedEvent.data;
    if (meeting.status === "deletion_requested") {
      showNotification("error", __2("Deletion request is already pending admin approval."));
      return;
    }
    showConfirm(
      __2("Request Meeting Deletion"),
      __2("This will send a deletion request to admin for approval. The meeting will be removed once admin approves."),
      () => {
        axios.delete(route("api.mentor-meetings.destroy", meeting.id)).then((response) => {
          setIsModalOpen(false);
          showNotification("success", response.data.message || __2("Deletion request submitted."));
          const updatedMeeting = response.data.meeting;
          if (updatedMeeting) {
            const newEvent = buildMeetingEvent(updatedMeeting);
            setEvents((prev) => prev.map((e) => e.id === newEvent.id ? newEvent : e));
          } else {
            fetchSchedules();
          }
        }).catch((error) => {
          console.error("Error requesting meeting deletion:", error);
          showNotification("error", error.response?.data?.message || __2("Failed to submit deletion request."));
        });
      }
    );
  };
  const handleEventDrop = (dropInfo) => {
    const { event } = dropInfo;
    const { type, data } = event.extendedProps;
    if (type !== "meeting") {
      dropInfo.revert();
      return;
    }
    let newStart = new Date(event.start);
    if (event.allDay || newStart.getHours() === 0 && newStart.getMinutes() === 0) {
      const oldStart2 = dropInfo.oldEvent.start;
      if (oldStart2) {
        newStart.setHours(oldStart2.getHours());
        newStart.setMinutes(oldStart2.getMinutes());
      }
    }
    const start = newStart.toISOString();
    const oldStart = dropInfo.oldEvent.start;
    const oldEnd = dropInfo.oldEvent.end;
    let end;
    if (oldStart && oldEnd) {
      end = new Date(newStart.getTime() + (oldEnd.getTime() - oldStart.getTime())).toISOString();
    } else if (event.end) {
      end = event.end.toISOString();
    } else {
      end = new Date(newStart.getTime() + 60 * 60 * 1e3).toISOString();
    }
    dropInfo.revert();
    showConfirm(
      __2("Reschedule Meeting"),
      __2("Are you sure you want to reschedule this meeting?"),
      () => {
        axios.patch(route("api.mentor-meetings.update", data.id), { scheduled_at: start, end_time: end }).then((response) => {
          showNotification("success", __2("Meeting rescheduled successfully."));
          const updated = response.data.meeting;
          if (updated) {
            const newEvent = buildMeetingEvent(updated);
            setEvents((prev) => prev.map((e) => e.id === newEvent.id ? newEvent : e));
          } else {
            fetchSchedules();
          }
        }).catch((error) => {
          console.error("Error rescheduling meeting:", error);
          showNotification("error", __2("Failed to reschedule meeting."));
        });
      }
    );
  };
  const filteredEvents = events.filter((event) => {
    if (filterType !== "all") {
      if (filterType === "availability" && event.extendedProps.type !== "availability") return false;
      if (filterType === "meeting" && event.extendedProps.type !== "meeting") return false;
    }
    if (filterParticipant !== "all" && event.extendedProps.type === "meeting") {
      const meetingParticipants = event.extendedProps.data.participants || [];
      if (!meetingParticipants.some((p) => p.id == filterParticipant)) {
        if (event.extendedProps.data.participant_id != filterParticipant) return false;
      }
    }
    return true;
  });
  const filteredListEvents = events.filter((event) => {
    const { type, data } = event.extendedProps;
    const date = new Date(event.start);
    if (listStatus !== "all") {
      if (type === "availability") {
        if (listStatus !== "scheduled" && listStatus !== "available") return false;
      } else {
        if (data.status !== listStatus) return false;
      }
    }
    if (listSearch) {
      const search = listSearch.toLowerCase();
      const agenda = (data.agenda || "").toLowerCase();
      const notes = (data.notes || "").toLowerCase();
      const participants2 = (data.participants || []).map((p) => (p.first_name + " " + p.last_name).toLowerCase()).join(" ");
      if (!agenda.includes(search) && !notes.includes(search) && !participants2.includes(search)) {
        return false;
      }
    }
    if (listStartDate) {
      const startDate = new Date(listStartDate);
      if (date < startDate) return false;
    }
    if (listEndDate) {
      const endDate = new Date(listEndDate);
      endDate.setHours(23, 59, 59, 999);
      if (date > endDate) return false;
    }
    return true;
  }).sort((a, b) => new Date(a.start) - new Date(b.start));
  useEffect(() => {
    const handler = (e) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(e.target)) {
        setExportDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const buildExportRows = () => {
    return filteredListEvents.map((event) => {
      const { type, data } = event.extendedProps;
      const start = new Date(event.start);
      const end = event.end ? new Date(event.end) : null;
      const agendaLabel = AGENDA_OPTIONS.find((o) => o.value === data.agenda_type)?.label ?? (data.agenda_type || "");
      const participantNames = (data.participants || []).map((p) => `${p.first_name} ${p.last_name}`).join(", ");
      return {
        [__2("Date")]: start.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
        [__2("Start Time")]: start.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        [__2("End Time")]: end ? end.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "",
        [__2("Type")]: type === "meeting" ? __2("Meeting") : __2("Availability"),
        [__2("Agenda")]: agendaLabel,
        [__2("Participants")]: participantNames,
        [__2("Location")]: data.location || "",
        [__2("Status")]: type === "meeting" ? STATUS_LABELS[data.status] ?? data.status : __2("Available"),
        [__2("Notes")]: data.notes || ""
      };
    });
  };
  const handleExportCSV = () => {
    const rows = buildExportRows();
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const csvLines = [
      headers.join(","),
      ...rows.map((row) => headers.map((h) => `"${String(row[h]).replace(/"/g, '""')}"`).join(","))
    ];
    const blob = new Blob([csvLines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mentor-schedule.csv";
    a.click();
    URL.revokeObjectURL(url);
    setExportDropdownOpen(false);
  };
  const handleExportExcel = () => {
    const rows = buildExportRows();
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const ths = headers.map((h) => `<th>${h}</th>`).join("");
    const trs = rows.map(
      (row) => `<tr>${headers.map((h) => `<td>${String(row[h] ?? "").replace(/</g, "&lt;")}</td>`).join("")}</tr>`
    ).join("");
    const html = `<html><head><meta charset="utf-8"/></head><body><table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></body></html>`;
    const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mentor-schedule.xls";
    a.click();
    URL.revokeObjectURL(url);
    setExportDropdownOpen(false);
  };
  const handleExportPDF = () => {
    const rows = buildExportRows();
    if (!rows.length) return;
    const doc = new jsPDF({ orientation: "landscape" });
    const headers = Object.keys(rows[0]);
    doc.setFontSize(13);
    doc.text(__2("Mentor Schedule"), 14, 15);
    autoTable(doc, {
      startY: 22,
      head: [headers],
      body: rows.map((r) => headers.map((h) => r[h])),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [79, 70, 229] }
    });
    doc.save("mentor-schedule.pdf");
    setExportDropdownOpen(false);
  };
  const scheduledDate = meetingForm.data.scheduled_at ? meetingForm.data.scheduled_at.split("T")[0] : "";
  const scheduledTime = meetingForm.data.scheduled_at ? meetingForm.data.scheduled_at.split("T")[1] || "" : "";
  const endTimePart = meetingForm.data.end_time ? meetingForm.data.end_time.split("T")[1] || "" : "";
  const nowDateTimeLocal = toDateTimeLocal(/* @__PURE__ */ new Date());
  const allParticipantsSelected = participants.length > 0 && participants.every((p) => meetingForm.data.participant_ids.includes(p.id));
  const dateMeetingMap = useMemo(() => {
    const map = {};
    events.forEach((event) => {
      if (event.extendedProps?.type !== "meeting") return;
      const status = event.extendedProps.data?.status;
      const start = event.start;
      if (!start || !status) return;
      const dateStr = new Date(start).toLocaleDateString("en-CA");
      if (!map[dateStr]) map[dateStr] = { pending: 0, approved: 0, total: 0 };
      map[dateStr].total++;
      if (["pending", "modification_requested"].includes(status)) map[dateStr].pending++;
      else if (["scheduled", "confirmed"].includes(status)) map[dateStr].approved++;
    });
    return map;
  }, [events]);
  const getDayCellClassNames = (arg) => {
    const dateStr = arg.date.toLocaleDateString("en-CA");
    const day = dateMeetingMap[dateStr];
    const classes = [];
    if (generalMeetingDates.has(dateStr)) classes.push("fc-day-general-meeting");
    if (day?.pending > 0) classes.push("fc-day-meeting-pending");
    else if (day?.total > 0) classes.push("fc-day-meeting-approved");
    return classes;
  };
  const AGENDA_OPTIONS = [
    { value: "pengisian_rmd", label: __2("Pengisian RMD") },
    { value: "pertemuan_umum", label: __2("Pertemuan Umum") },
    { value: "rapat_youth", label: __2("Rapat Youth") },
    { value: "lainnya", label: __2("Lainnya") }
  ];
  const STATUS_LABELS = {
    scheduled: __2("Scheduled"),
    pending: __2("Pending Approval"),
    confirmed: __2("Confirmed"),
    cancelled: __2("Cancelled"),
    completed: __2("Completed"),
    modification_requested: __2("Modification Requested"),
    rejected: __2("Rejected")
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center mb-4 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4 w-full md:w-auto flex-wrap", children: [
          /* @__PURE__ */ jsx("div", { className: "w-full md:w-48", children: /* @__PURE__ */ jsxs(
            SelectInput,
            {
              className: "w-full",
              value: filterType,
              onChange: (e) => setFilterType(e.target.value),
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: __2("All Events") }),
                /* @__PURE__ */ jsx("option", { value: "availability", children: __2("Availability Only") }),
                /* @__PURE__ */ jsx("option", { value: "meeting", children: __2("Meetings Only") })
              ]
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "w-full md:w-48", children: /* @__PURE__ */ jsxs(
            SelectInput,
            {
              className: "w-full",
              value: filterParticipant,
              onChange: (e) => setFilterParticipant(e.target.value),
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: __2("All Participants") }),
                participants.map((p) => /* @__PURE__ */ jsx("option", { value: p.id, children: p.nickname || p.first_name }, p.id))
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", ref: exportDropdownRef, children: [
          /* @__PURE__ */ jsxs(SecondaryButton, { onClick: () => setExportDropdownOpen((o) => !o), children: [
            __2("Export"),
            /* @__PURE__ */ jsx("svg", { className: "ml-1.5 w-4 h-4 inline-block", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })
          ] }),
          exportDropdownOpen && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 overflow-hidden", children: [
            /* @__PURE__ */ jsxs("button", { onClick: handleExportCSV, className: "w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }),
              "CSV"
            ] }),
            /* @__PURE__ */ jsxs("button", { onClick: handleExportExcel, className: "w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-emerald-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 10h18M3 14h18M10 3v18M14 3v18M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" }) }),
              "Excel"
            ] }),
            /* @__PURE__ */ jsxs("button", { onClick: handleExportPDF, className: "w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" }) }),
              "PDF"
            ] })
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
          editable: true,
          selectable: true,
          selectMirror: true,
          dayMaxEvents: true,
          weekends: true,
          events: filteredEvents,
          select: handleDateSelect,
          eventClick: handleEventClick,
          eventDrop: handleEventDrop,
          dayCellClassNames: getDayCellClassNames,
          height: "auto",
          eventTimeFormat: {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
          }
        }
      ),
      /* @__PURE__ */ jsx("style", { children: `
                    .fc-day-general-meeting { background-color: #DCFCE7 !important; }
                    .fc-day-general-meeting .fc-daygrid-day-number { color: #15803D; font-weight: 700; }
                    .fc-day-meeting-pending  { background-color: #FED7AA !important; }
                    .fc-day-meeting-pending  .fc-daygrid-day-number { color: #C2410C; font-weight: 700; }
                    .fc-day-meeting-approved { background-color: #BBF7D0 !important; }
                    .fc-day-meeting-approved .fc-daygrid-day-number { color: #15803D; font-weight: 700; }
                    .fc-day-meeting-pending:hover,
                    .fc-day-meeting-approved:hover { filter: brightness(0.94); }

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
                    .dark .fc-day-meeting-pending  { background-color: #7c2d12 !important; }
                    .dark .fc-day-meeting-pending  .fc-daygrid-day-number { color: #fdba74 !important; }
                    .dark .fc-day-meeting-approved { background-color: #14532d !important; }
                    .dark .fc-day-meeting-approved .fc-daygrid-day-number { color: #86efac !important; }

                    @media (max-width: 640px) {
                        /* Toolbar: stack title on top, controls on bottom row */
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
                        .fc .fc-toolbar-title {
                            font-size: 1.1rem;
                        }
                        .fc .fc-button {
                            padding: 0.2rem 0.45rem;
                            font-size: 0.7rem;
                        }
                        .fc .fc-button .fc-icon {
                            font-size: 0.9rem;
                        }

                        /* Square day cells */
                        .fc .fc-daygrid-day-frame {
                            min-height: unset !important;
                            aspect-ratio: 1 / 1;
                            overflow: hidden;
                        }
                        .fc .fc-daygrid-day-number {
                            font-size: 0.65rem;
                            padding: 2px 3px !important;
                        }

                        /* Show events as compact dots */
                        .fc .fc-daygrid-event {
                            height: 5px;
                            border-radius: 3px;
                            margin: 1px 2px !important;
                        }
                        .fc .fc-event-title,
                        .fc .fc-event-time {
                            display: none;
                        }
                        .fc .fc-daygrid-more-link {
                            font-size: 0.6rem;
                        }
                    }
                ` })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center mb-6 gap-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __2("Schedule List") }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 w-full md:w-auto", children: [
          /* @__PURE__ */ jsx("div", { className: "w-full md:w-64", children: /* @__PURE__ */ jsx(
            TextInput,
            {
              placeholder: __2("Search participants, agenda..."),
              value: listSearch,
              onChange: (e) => setListSearch(e.target.value),
              className: "w-full"
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "w-full md:w-40", children: /* @__PURE__ */ jsxs(
            SelectInput,
            {
              value: listStatus,
              onChange: (e) => setListStatus(e.target.value),
              className: "w-full",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: __2("All Status") }),
                /* @__PURE__ */ jsx("option", { value: "scheduled", children: __2("Scheduled") }),
                /* @__PURE__ */ jsx("option", { value: "pending", children: __2("Pending Approval") }),
                /* @__PURE__ */ jsx("option", { value: "confirmed", children: __2("Confirmed") }),
                /* @__PURE__ */ jsx("option", { value: "cancelled", children: __2("Cancelled") }),
                /* @__PURE__ */ jsx("option", { value: "completed", children: __2("Completed") })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center", children: [
            /* @__PURE__ */ jsx(
              TextInput,
              {
                type: "date",
                value: listStartDate,
                onChange: (e) => setListStartDate(e.target.value),
                className: "w-36"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "-" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                type: "date",
                value: listEndDate,
                onChange: (e) => setListEndDate(e.target.value),
                className: "w-36"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 dark:bg-gray-700", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __2("Date & Time") }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __2("Mentor") }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __2("Type") }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __2("Participants") }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __2("Status") }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __2("Action") })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700", children: filteredListEvents.length > 0 ? filteredListEvents.map((event) => {
          const { type, data } = event.extendedProps;
          const date = new Date(event.start);
          const endDate = event.end ? new Date(event.end) : null;
          return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors", children: [
            /* @__PURE__ */ jsxs("td", { className: "px-6 py-2.5 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100", children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium", children: date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) }),
              /* @__PURE__ */ jsxs("div", { className: "text-gray-500 text-xs", children: [
                date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
                endDate && ` – ${endDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`
              ] })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100", children: auth.user.name }),
            /* @__PURE__ */ jsxs("td", { className: "px-6 py-2.5 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100", children: [
              /* @__PURE__ */ jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                    ${type === "meeting" ? "bg-purple-100 text-purple-800" : "bg-teal-100 text-teal-800"}`, children: type === "meeting" ? __2("Meeting") : __2("Availability") }),
              type === "meeting" && data.agenda_type && /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500 mt-1", children: [
                AGENDA_OPTIONS.find((o) => o.value === data.agenda_type)?.label || data.agenda_type,
                data.agenda_type === "lainnya" && data.agenda && `: ${data.agenda}`
              ] })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5 text-sm text-gray-900 dark:text-gray-100", children: type === "meeting" && data.participants && data.participants.length > 0 ? /* @__PURE__ */ jsxs("div", { className: "flex -space-x-2 overflow-hidden", children: [
              data.participants.slice(0, 3).map((p) => /* @__PURE__ */ jsx("div", { title: p.first_name + " " + p.last_name, children: /* @__PURE__ */ jsx(
                ProfilePhoto,
                {
                  src: p.profile_photo_url,
                  alt: p.first_name,
                  className: "inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800",
                  fallback: (p.first_name?.[0] || "P").toUpperCase()
                }
              ) }, p.id)),
              data.participants.length > 3 && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-100 text-xs font-medium text-gray-500", children: [
                "+",
                data.participants.length - 3
              ] })
            ] }) : /* @__PURE__ */ jsx("span", { className: "text-gray-400 italic text-xs", children: __2("No participants") }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5 whitespace-nowrap", children: type === "meeting" ? /* @__PURE__ */ jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                        ${data.status === "confirmed" ? "bg-green-100 text-green-800" : data.status === "pending" ? "bg-yellow-100 text-yellow-800" : data.status === "cancelled" || data.status === "rejected" ? "bg-red-100 text-red-800" : data.status === "modification_requested" ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"}`, children: STATUS_LABELS[data.status] ?? data.status }) : /* @__PURE__ */ jsx("span", { className: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800", children: __2("Available") }) }),
            /* @__PURE__ */ jsxs("td", { className: "px-6 py-2.5 whitespace-nowrap text-right text-sm font-medium", children: [
              type === "meeting" && /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleShowQr(data.id),
                  className: "text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4",
                  title: __2("Show QR Code"),
                  children: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-5 h-5 inline-block", children: [
                    /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" }),
                    /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75zM16.5 19.5h.75v.75h-.75v-.75zM19.5 16.5h.75v.75h-.75v-.75z" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleEventClick({ event: { extendedProps: { type, data } } }),
                  className: "text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300",
                  children: __2("Details")
                }
              )
            ] })
          ] }, event.id);
        }) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "6", className: "px-6 py-12 text-center text-sm text-gray-500", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center", children: [
          /* @__PURE__ */ jsx("svg", { className: "h-12 w-12 text-gray-400 mb-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
          /* @__PURE__ */ jsx("p", { children: __2("No schedules found matching your criteria.") })
        ] }) }) }) })
      ] }) })
    ] }),
    notification && /* @__PURE__ */ jsxs("div", { className: `fixed top-5 right-5 z-[200] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium border transition-all animate-fade-in ${notification.type === "success" ? "bg-green-50 dark:bg-green-900/80 text-green-800 dark:text-green-100 border-green-200 dark:border-green-700" : "bg-red-50 dark:bg-red-900/80 text-red-800 dark:text-red-100 border-red-200 dark:border-red-700"}`, children: [
      notification.type === "success" ? /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) : /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }),
      notification.message
    ] }),
    /* @__PURE__ */ jsx(Modal, { show: confirmDialog.open, onClose: () => closeConfirm(false), maxWidth: "sm", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-red-600 dark:text-red-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold text-gray-900 dark:text-gray-100", children: confirmDialog.title }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: confirmDialog.message })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-5 flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(SecondaryButton, { onClick: () => closeConfirm(false), children: __2("Cancel") }),
        /* @__PURE__ */ jsx(DangerButton, { onClick: () => {
          confirmDialog.onConfirm?.();
          closeConfirm(true);
        }, children: __2("Confirm") })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Modal, { show: isModalOpen && !["create_meeting", "edit_meeting"].includes(modalMode), onClose: () => setIsModalOpen(false), children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      modalMode === "create_menu" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __2("Select Action") }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs(
            SecondaryButton,
            {
              className: "justify-center h-24 flex-col gap-2",
              onClick: () => setModalMode("create_availability"),
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-xl", children: "📅" }),
                __2("Set Availability")
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            SecondaryButton,
            {
              className: "justify-center h-24 flex-col gap-2",
              onClick: () => setModalMode("create_meeting"),
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-xl", children: "🤝" }),
                __2("Schedule Meeting")
              ]
            }
          )
        ] })
      ] }),
      modalMode === "create_availability" && /* @__PURE__ */ jsxs("form", { onSubmit: submitAvailability, className: "space-y-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __2("Set Availability") }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: __2("Start Time") }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                type: "time",
                className: "w-full mt-1",
                value: availabilityForm.data.start_time,
                onChange: (e) => availabilityForm.setData("start_time", e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: __2("End Time") }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                type: "time",
                className: "w-full mt-1",
                value: availabilityForm.data.end_time,
                onChange: (e) => availabilityForm.setData("end_time", e.target.value)
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              checked: availabilityForm.data.is_recurring,
              onChange: (e) => availabilityForm.setData("is_recurring", e.target.checked)
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: __2("Recurring (Weekly)") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 mt-4", children: [
          /* @__PURE__ */ jsx(SecondaryButton, { onClick: () => setIsModalOpen(false), children: __2("Cancel") }),
          /* @__PURE__ */ jsx(PrimaryButton, { disabled: availabilityForm.processing, children: __2("Save") })
        ] })
      ] }),
      modalMode === "view_availability" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __2("Availability Slot") }),
        /* @__PURE__ */ jsxs("p", { children: [
          __2("Start"),
          ": ",
          selectedEvent?.data.start_time
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          __2("End"),
          ": ",
          selectedEvent?.data.end_time
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          __2("Recurring"),
          ": ",
          selectedEvent?.data.is_recurring ? __2("Yes") : __2("No")
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 mt-4", children: [
          /* @__PURE__ */ jsx(SecondaryButton, { onClick: () => setIsModalOpen(false), children: __2("Close") }),
          /* @__PURE__ */ jsx(DangerButton, { onClick: deleteAvailability, children: __2("Delete") })
        ] })
      ] })
    ] }) }),
    isModalOpen && (modalMode === "create_meeting" || modalMode === "edit_meeting") && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 overflow-y-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-gray-700/75", onClick: () => setIsModalOpen(false) }),
      /* @__PURE__ */ jsx("div", { className: "relative mx-auto mt-6 mb-10 w-full max-w-2xl px-4 sm:px-0", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100", children: modalMode === "create_meeting" ? __2("Schedule Meeting") : __2("Edit Meeting") }),
          /* @__PURE__ */ jsx("button", { onClick: () => setIsModalOpen(false), className: "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submitMeeting, className: "px-6 py-5 space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: __2("Date & Time") }),
            /* @__PURE__ */ jsxs("div", { className: "mt-1 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700", children: [
              /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-indigo-800 dark:text-indigo-200 mb-3", children: scheduledDate ? (/* @__PURE__ */ new Date(scheduledDate + "T00:00:00")).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : __2("No date selected") }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: __2("Start Time") }),
                  /* @__PURE__ */ jsx(
                    TextInput,
                    {
                      type: "time",
                      className: "w-full mt-1",
                      value: scheduledTime,
                      min: modalMode === "create_meeting" && scheduledDate === nowDateTimeLocal.split("T")[0] ? nowDateTimeLocal.split("T")[1] : void 0,
                      onChange: (e) => meetingForm.setData("scheduled_at", `${scheduledDate}T${e.target.value}`)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: __2("End Time") }),
                  /* @__PURE__ */ jsx(
                    TextInput,
                    {
                      type: "time",
                      className: "w-full mt-1",
                      value: endTimePart,
                      min: scheduledTime || void 0,
                      onChange: (e) => meetingForm.setData("end_time", `${scheduledDate}T${e.target.value}`)
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx(InputError, { message: meetingForm.errors.scheduled_at }),
            /* @__PURE__ */ jsx(InputError, { message: meetingForm.errors.end_time })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
              /* @__PURE__ */ jsx(InputLabel, { value: __2("Participants") }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "text-xs text-indigo-600 dark:text-indigo-400 hover:underline",
                  onClick: () => meetingForm.setData(
                    "participant_ids",
                    allParticipantsSelected ? [] : participants.map((p) => p.id)
                  ),
                  children: allParticipantsSelected ? __2("Deselect All") : __2("Select All")
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                placeholder: __2("Search participants..."),
                className: "w-full mb-2",
                value: participantSearch,
                onChange: (e) => setParticipantSearch(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "max-h-44 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg divide-y divide-gray-100 dark:divide-gray-700", children: [
              participants.filter((p) => {
                if (!participantSearch) return true;
                const s = participantSearch.toLowerCase();
                return (p.first_name + " " + p.last_name + " " + (p.nickname || "")).toLowerCase().includes(s);
              }).map((p) => {
                const checked = meetingForm.data.participant_ids.includes(p.id);
                return /* @__PURE__ */ jsxs(
                  "label",
                  {
                    className: `flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${checked ? "bg-indigo-50 dark:bg-indigo-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"}`,
                    children: [
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "checkbox",
                          className: "rounded border-gray-300 text-indigo-600 focus:ring-indigo-500",
                          checked,
                          onChange: (e) => {
                            if (e.target.checked) {
                              meetingForm.setData("participant_ids", [...meetingForm.data.participant_ids, p.id]);
                            } else {
                              meetingForm.setData("participant_ids", meetingForm.data.participant_ids.filter((id) => id !== p.id));
                            }
                          }
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        ProfilePhoto,
                        {
                          src: p.profile_photo_url,
                          alt: p.first_name,
                          className: "w-7 h-7 rounded-full object-cover shrink-0",
                          fallback: (p.first_name?.[0] || "P").toUpperCase()
                        }
                      ),
                      /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-800 dark:text-gray-100 leading-tight", children: [
                        p.first_name,
                        " ",
                        p.last_name,
                        p.nickname && /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-400 ml-1", children: [
                          "(",
                          p.nickname,
                          ")"
                        ] })
                      ] })
                    ]
                  },
                  p.id
                );
              }),
              participants.length === 0 && /* @__PURE__ */ jsx("div", { className: "p-3 text-sm text-gray-500 italic text-center", children: __2("No participants assigned") })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-gray-500", children: [
              meetingForm.data.participant_ids.length,
              " ",
              __2("selected")
            ] }),
            /* @__PURE__ */ jsx(InputError, { message: meetingForm.errors.participant_ids })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: __2("Meeting Agenda") }),
            /* @__PURE__ */ jsx("div", { className: "mt-2 space-y-2", children: AGENDA_OPTIONS.map((opt) => /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "radio",
                  name: "agenda_type",
                  value: opt.value,
                  checked: meetingForm.data.agenda_type === opt.value,
                  onChange: () => meetingForm.setData("agenda_type", opt.value),
                  className: "text-indigo-600 focus:ring-indigo-500"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: opt.label })
            ] }, opt.value)) }),
            meetingForm.data.agenda_type === "lainnya" && /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
              /* @__PURE__ */ jsx(InputLabel, { value: __2("Description") }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  className: "w-full mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 rounded-md shadow-sm text-sm",
                  rows: 2,
                  placeholder: __2("Describe the agenda..."),
                  value: meetingForm.data.agenda,
                  onChange: (e) => meetingForm.setData("agenda", e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ jsx(InputError, { message: meetingForm.errors.agenda_type })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: __2("Tools & Materials") }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                className: "w-full mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 rounded-md shadow-sm text-sm",
                rows: 2,
                placeholder: __2("e.g. Alkitab, buku catatan, pena..."),
                value: meetingForm.data.tools_materials,
                onChange: (e) => meetingForm.setData("tools_materials", e.target.value)
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: meetingForm.errors.tools_materials })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: __2("Location") }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                className: "w-full mt-1",
                placeholder: __2("e.g. Ruang Meeting A, Online..."),
                value: meetingForm.data.location,
                onChange: (e) => meetingForm.setData("location", e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: __2("Meeting Link") }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                className: "w-full mt-1",
                placeholder: "https://...",
                value: meetingForm.data.meeting_link,
                onChange: (e) => meetingForm.setData("meeting_link", e.target.value)
              }
            )
          ] }),
          modalMode === "edit_meeting" && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: __2("Status") }),
            meetingForm.data.status === "deletion_requested" ? /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md text-sm text-red-700 dark:text-red-400", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" }) }),
              __2("Deletion Pending Admin Approval")
            ] }) : /* @__PURE__ */ jsxs(
              SelectInput,
              {
                className: "w-full mt-1",
                value: meetingForm.data.status,
                onChange: (e) => meetingForm.setData("status", e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "scheduled", children: __2("Scheduled") }),
                  /* @__PURE__ */ jsx("option", { value: "pending", children: __2("Pending Approval") }),
                  /* @__PURE__ */ jsx("option", { value: "confirmed", children: __2("Confirmed") }),
                  /* @__PURE__ */ jsx("option", { value: "cancelled", children: __2("Cancelled") }),
                  /* @__PURE__ */ jsx("option", { value: "completed", children: __2("Completed") })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: __2("Notes") }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                className: "w-full mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 rounded-md shadow-sm text-sm",
                rows: 2,
                value: meetingForm.data.notes,
                onChange: (e) => meetingForm.setData("notes", e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700", children: [
            modalMode === "edit_meeting" ? selectedEvent?.data?.status === "deletion_requested" ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-700", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
              __2("Deletion Pending Approval")
            ] }) : /* @__PURE__ */ jsx(DangerButton, { type: "button", onClick: deleteMeeting, children: __2("Request Deletion") }) : /* @__PURE__ */ jsx("div", {}),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx(SecondaryButton, { type: "button", onClick: () => setIsModalOpen(false), children: __2("Cancel") }),
              /* @__PURE__ */ jsx(PrimaryButton, { disabled: meetingForm.processing, children: __2("Save") })
            ] })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Modal, { show: isQrModalOpen, onClose: () => setIsQrModalOpen(false), children: /* @__PURE__ */ jsxs("div", { className: "p-6 text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 dark:text-gray-100 mb-4", children: __2("Attendance QR Code") }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-4", children: qrData && /* @__PURE__ */ jsx(
        QRCodeCanvas,
        {
          value: qrData.toString(),
          size: 256,
          level: "H",
          includeMargin: true
        }
      ) }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-6", children: __2("Scan this QR code to check in/out for the meeting.") }),
      /* @__PURE__ */ jsx(SecondaryButton, { onClick: () => setIsQrModalOpen(false), children: __2("Close") })
    ] }) })
  ] });
}
const PRIORITY_STYLES = {
  high: { bg: "bg-red-500", badge: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
  medium: { bg: "bg-blue-500", badge: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  low: { bg: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" }
};
function Schedule({ auth, adminSchedules = [] }) {
  const [selected, setSelected] = useState(null);
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200", children: __("Schedule Management") }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("Schedule Management") }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6", children: [
          adminSchedules.length > 0 && /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-base font-semibold text-gray-900 dark:text-gray-100 mb-4", children: [
              __("Program Activities"),
              /* @__PURE__ */ jsxs("span", { className: "ml-2 text-xs font-normal text-gray-400", children: [
                "(",
                adminSchedules.length,
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-2", children: [...adminSchedules].sort((a, b) => new Date(a.date) - new Date(b.date)).map((s) => {
              const ps = PRIORITY_STYLES[s.priority] || PRIORITY_STYLES.medium;
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setSelected(s),
                  className: "w-full text-left flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: `w-1 self-stretch rounded-full shrink-0 ${ps.bg}` }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-800 dark:text-gray-100", children: s.name }),
                        /* @__PURE__ */ jsx("span", { className: `text-[10px] px-2 py-0.5 rounded-full font-medium ${ps.badge}`, children: s.priority })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "mt-0.5 text-xs text-gray-500 dark:text-gray-400", children: [
                        (/* @__PURE__ */ new Date(s.date + "T00:00:00")).toLocaleDateString([], { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
                        s.start_time && ` · ${s.start_time.substring(0, 5)}`,
                        s.end_time && `–${s.end_time.substring(0, 5)}`,
                        s.location && ` · ${s.location}`
                      ] }),
                      s.description && /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs text-gray-600 dark:text-gray-300 truncate", children: s.description })
                    ] })
                  ]
                },
                s.id
              );
            }) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800", children: /* @__PURE__ */ jsx("div", { className: "p-6 text-gray-900 dark:text-gray-100", children: /* @__PURE__ */ jsx(MentorScheduleTab, {}) }) })
        ] }) }),
        selected && /* @__PURE__ */ jsx(
          "div",
          {
            className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4",
            onClick: () => setSelected(null),
            children: /* @__PURE__ */ jsxs(
              "div",
              {
                className: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 relative",
                onClick: (e) => e.stopPropagation(),
                children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setSelected(null),
                      className: "absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200",
                      children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: `text-xs px-2.5 py-0.5 rounded-full font-medium ${(PRIORITY_STYLES[selected.priority] || PRIORITY_STYLES.medium).badge}`, children: selected.priority }),
                  /* @__PURE__ */ jsx("h3", { className: "mt-3 text-lg font-bold text-gray-900 dark:text-gray-100", children: selected.name }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: (/* @__PURE__ */ new Date(selected.date + "T00:00:00")).toLocaleDateString([], { weekday: "long", day: "numeric", month: "long", year: "numeric" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3 text-sm", children: [
                    selected.start_time && /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                      /* @__PURE__ */ jsx("span", { className: "w-28 shrink-0 text-gray-500 dark:text-gray-400", children: __("Time") }),
                      /* @__PURE__ */ jsxs("span", { className: "text-gray-800 dark:text-gray-100", children: [
                        selected.start_time.substring(0, 5),
                        selected.end_time ? `–${selected.end_time.substring(0, 5)}` : ""
                      ] })
                    ] }),
                    selected.location && /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                      /* @__PURE__ */ jsx("span", { className: "w-28 shrink-0 text-gray-500 dark:text-gray-400", children: __("Location") }),
                      /* @__PURE__ */ jsx("span", { className: "text-gray-800 dark:text-gray-100", children: selected.location })
                    ] }),
                    selected.pic && /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                      /* @__PURE__ */ jsx("span", { className: "w-28 shrink-0 text-gray-500 dark:text-gray-400", children: __("PIC") }),
                      /* @__PURE__ */ jsx("span", { className: "text-gray-800 dark:text-gray-100", children: selected.pic })
                    ] }),
                    selected.description && /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                      /* @__PURE__ */ jsx("span", { className: "w-28 shrink-0 text-gray-500 dark:text-gray-400", children: __("Description") }),
                      /* @__PURE__ */ jsx("span", { className: "text-gray-800 dark:text-gray-100 break-words", children: selected.description })
                    ] })
                  ] })
                ]
              }
            )
          }
        )
      ]
    }
  );
}
export {
  Schedule as default
};
