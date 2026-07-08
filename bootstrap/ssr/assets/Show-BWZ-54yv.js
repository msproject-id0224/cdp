import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BG6RGD2S.js";
import { usePage, Head, Link } from "@inertiajs/react";
import { _ as __ } from "./lang-COBcTD8W.js";
import { useState, useMemo } from "react";
import { P as PrimaryButton } from "./PrimaryButton-BNNL2gCI.js";
import { S as SecondaryButton } from "./SecondaryButton-TjIrbn1G.js";
import { T as TextInput } from "./TextInput-D0qTZeQv.js";
import { S as SelectInput } from "./SelectInput-inadq0Bq.js";
import { P as ProfilePhoto } from "./ProfilePhoto-CJ2Z04pO.js";
import RmdDetailSummary from "./RmdDetailSummary-l8LO3MEm.js";
import axios from "axios";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "./ThemeToggle-BY9dagkZ.js";
import "./Modal-CKHW52Ki.js";
import "./DangerButton-B7to2Tbx.js";
import "./Footer-B7ihPSZ8.js";
import "./useTheme-CngFDcs1.js";
function ParticipantShow({ auth, participant, notes, tasks, meetings, messages, metrics, analytics, rmdProgress, rmdDetail }) {
  const { locale } = usePage().props;
  const isAdmin = auth?.user?.role === "admin";
  const [status, setStatus] = useState(participant.is_active ? "active" : "inactive");
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [noteText, setNoteText] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);
  const [noteError, setNoteError] = useState("");
  const [noteItems, setNoteItems] = useState(notes || []);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskLoading, setTaskLoading] = useState(false);
  const [taskError, setTaskError] = useState("");
  const [taskItems, setTaskItems] = useState(tasks || []);
  const [meetingDateTime, setMeetingDateTime] = useState("");
  const [meetingLocation, setMeetingLocation] = useState("");
  const [meetingAgenda, setMeetingAgenda] = useState("");
  const [meetingLoading, setMeetingLoading] = useState(false);
  const [meetingError, setMeetingError] = useState("");
  const [meetingItems, setMeetingItems] = useState(meetings || []);
  const participantAge = useMemo(() => {
    if (participant.date_of_birth) {
      const birthDate = new Date(participant.date_of_birth);
      const today = /* @__PURE__ */ new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || m === 0 && today.getDate() < birthDate.getDate()) {
        age--;
      }
      return age;
    }
    return typeof participant.age === "number" ? participant.age : 0;
  }, [participant.date_of_birth, participant.age]);
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString(locale === "id" ? "id-ID" : "en-US");
  };
  const handleUpdateStatus = async () => {
    setStatusLoading(true);
    setStatusError("");
    try {
      await axios.patch(route("participants.status.update", participant.id), { status });
    } catch (error) {
      setStatusError(__("Failed to update status."));
    } finally {
      setStatusLoading(false);
    }
  };
  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setNoteLoading(true);
    setNoteError("");
    try {
      const response = await axios.post(route("participants.notes.store", participant.id), { note: noteText });
      setNoteItems((prev) => [response.data, ...prev]);
      setNoteText("");
    } catch (error) {
      setNoteError(__("Failed to add note."));
    } finally {
      setNoteLoading(false);
    }
  };
  const handleAddTask = async () => {
    if (!taskTitle.trim()) return;
    setTaskLoading(true);
    setTaskError("");
    try {
      const response = await axios.post(route("participants.tasks.store", participant.id), {
        title: taskTitle,
        description: taskDescription || null,
        due_date: taskDueDate || null
      });
      setTaskItems((prev) => [response.data, ...prev]);
      setTaskTitle("");
      setTaskDescription("");
      setTaskDueDate("");
    } catch (error) {
      setTaskError(__("Failed to add task."));
    } finally {
      setTaskLoading(false);
    }
  };
  const handleUpdateTaskStatus = async (taskId, nextStatus) => {
    try {
      const response = await axios.patch(route("participants.tasks.update", { participant: participant.id, task: taskId }), {
        status: nextStatus
      });
      setTaskItems((prev) => prev.map((item) => item.id === taskId ? response.data : item));
    } catch (error) {
      setTaskError(__("Failed to update task status."));
    }
  };
  const handleAddMeeting = async () => {
    if (!meetingDateTime) return;
    setMeetingLoading(true);
    setMeetingError("");
    try {
      const response = await axios.post(route("participants.meetings.store", participant.id), {
        scheduled_at: meetingDateTime,
        location: meetingLocation || null,
        agenda: meetingAgenda || null
      });
      setMeetingItems((prev) => [response.data, ...prev]);
      setMeetingDateTime("");
      setMeetingLocation("");
      setMeetingAgenda("");
    } catch (error) {
      setMeetingError(__("Failed to schedule meeting."));
    } finally {
      setMeetingLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxs("nav", { className: "text-xs text-gray-500 dark:text-gray-400", children: [
          /* @__PURE__ */ jsx(Link, { href: route("dashboard"), className: "hover:text-gray-700 dark:hover:text-gray-200", children: __("Dashboard") }),
          /* @__PURE__ */ jsx("span", { className: "mx-2", children: "/" }),
          /* @__PURE__ */ jsx(Link, { href: route("participants.index"), className: "hover:text-gray-700 dark:hover:text-gray-200", children: __("Participants") }),
          /* @__PURE__ */ jsx("span", { className: "mx-2", children: "/" }),
          /* @__PURE__ */ jsx("span", { className: "text-gray-700 dark:text-gray-200", children: __("My Participant") })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200", children: __("My Participant") })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("My Participant") }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsx(
                  ProfilePhoto,
                  {
                    src: participant.profile_photo_url,
                    alt: participant.first_name,
                    className: "w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold object-cover",
                    fallbackClassName: "w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold",
                    fallback: (participant.first_name?.[0] || "P").toUpperCase()
                  }
                ),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100", children: [
                    participant.first_name,
                    " ",
                    participant.last_name || "",
                    participant.nickname && /* @__PURE__ */ jsxs("span", { className: "ml-2 text-sm font-normal text-gray-500 dark:text-gray-400", children: [
                      "(",
                      participant.nickname,
                      ")"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: participant.email })
                ] })
              ] }),
              isAdmin && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs(SelectInput, { value: status, onChange: (e) => setStatus(e.target.value), className: "w-36", children: [
                  /* @__PURE__ */ jsx("option", { value: "active", children: __("Active") }),
                  /* @__PURE__ */ jsx("option", { value: "inactive", children: __("Inactive") })
                ] }),
                /* @__PURE__ */ jsx(PrimaryButton, { onClick: handleUpdateStatus, disabled: statusLoading, children: statusLoading ? __("Saving...") : __("Update Status") })
              ] })
            ] }),
            isAdmin && statusError && /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-red-600", children: statusError }),
            /* @__PURE__ */ jsxs("div", { className: "mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: __("ID Number") }),
                /* @__PURE__ */ jsx("div", { children: participant.id_number || "-" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: __("Date of Birth") }),
                /* @__PURE__ */ jsx("div", { children: formatDate(participant.date_of_birth) })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: __("Gender") }),
                /* @__PURE__ */ jsx("div", { children: participant.gender || "-" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: __("Age") }),
                /* @__PURE__ */ jsx("div", { children: participant.age || "-" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: __("Education") }),
                /* @__PURE__ */ jsx("div", { children: participant.education || "-" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: __("Age Group") }),
                /* @__PURE__ */ jsx("div", { children: participant.age_group || "-" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-5", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: __("Total Tasks") }),
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100", children: metrics.total_tasks })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-5", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: __("Completed Tasks") }),
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100", children: metrics.completed_tasks })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-5", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: __("Completion Rate") }),
              /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100", children: [
                metrics.completion_rate,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-5", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: __("Meetings") }),
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100", children: metrics.meetings_count })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-5", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: __("Upcoming Meetings") }),
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100", children: metrics.upcoming_meetings_count })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-5", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: __("Messages") }),
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100", children: metrics.messages_count })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-gray-900 dark:text-gray-100", children: __("Performance Analytics") }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: __("Last Message") }),
                /* @__PURE__ */ jsx("div", { children: formatDateTime(analytics.last_message_at) })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: __("Last Meeting") }),
                /* @__PURE__ */ jsx("div", { children: formatDateTime(analytics.last_meeting_at) })
              ] })
            ] })
          ] }),
          isAdmin && rmdDetail && participantAge >= 12 && /* @__PURE__ */ jsx(RmdDetailSummary, { rmdDetail, rmdProgress }),
          rmdProgress && participantAge >= 12 && /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-gray-900 dark:text-gray-100", children: __("Progres RMD") }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: [
                  rmdProgress.filled_count,
                  " / ",
                  rmdProgress.total_modules,
                  " ",
                  __("modul")
                ] }),
                /* @__PURE__ */ jsx("span", { className: `text-xs font-semibold px-2 py-0.5 rounded-full ${rmdProgress.overall_status === "Selesai" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : rmdProgress.overall_status === "Sedang Mengisi" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"}`, children: rmdProgress.overall_status })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1", children: [
                /* @__PURE__ */ jsx("span", { children: __("Keseluruhan") }),
                /* @__PURE__ */ jsxs("span", { children: [
                  rmdProgress.overall_percentage,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: `h-2 rounded-full transition-all ${rmdProgress.overall_percentage === 100 ? "bg-green-500" : "bg-indigo-500"}`,
                  style: { width: `${rmdProgress.overall_percentage}%` }
                }
              ) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-3", children: rmdProgress.modules.map((module, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-5 h-5 shrink-0 flex items-center justify-center", children: module.percentage === 100 ? /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-green-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M5 13l4 4L19 7" }) }) : module.percentage > 0 ? /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-yellow-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }) : /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-gray-300 dark:text-gray-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-0.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-gray-700 dark:text-gray-300 truncate", children: module.name }),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500 dark:text-gray-400 ml-2 shrink-0", children: [
                    module.percentage,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5", children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `h-1.5 rounded-full ${module.percentage === 100 ? "bg-green-500" : "bg-indigo-400"}`,
                    style: { width: `${module.percentage}%` }
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsx("span", { className: `text-xs px-1.5 py-0.5 rounded shrink-0 ${module.status === "Selesai Mengisi" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : module.status === "Sedang Mengisi" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"}`, children: module.status === "Selesai Mengisi" ? "✓" : module.status === "Sedang Mengisi" ? "…" : "–" })
            ] }, idx)) }),
            rmdProgress.modules.some((m) => m.last_updated) && /* @__PURE__ */ jsxs("p", { className: "mt-4 text-xs text-gray-400 dark:text-gray-500", children: [
              __("Terakhir diperbarui"),
              ": ",
              rmdProgress.modules.filter((m) => m.last_updated).sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated))[0]?.last_updated
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-gray-900 dark:text-gray-100", children: __("Add Note") }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  className: "mt-3 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100",
                  rows: "3",
                  value: noteText,
                  onChange: (e) => setNoteText(e.target.value),
                  placeholder: __("Write note...")
                }
              ),
              noteError && /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-red-600", children: noteError }),
              /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(PrimaryButton, { onClick: handleAddNote, disabled: noteLoading, children: noteLoading ? __("Saving...") : __("Add Note") }) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-3", children: [
                noteItems.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: __("No notes yet.") }),
                noteItems.map((note) => /* @__PURE__ */ jsxs("div", { className: "border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 mb-1", children: formatDateTime(note.created_at) }),
                  /* @__PURE__ */ jsx("div", { className: "text-gray-700 dark:text-gray-200", children: note.note })
                ] }, note.id))
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-gray-900 dark:text-gray-100", children: __("Assigned Tasks") }),
              /* @__PURE__ */ jsxs("div", { className: "mt-3 grid grid-cols-1 gap-3", children: [
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    value: taskTitle,
                    onChange: (e) => setTaskTitle(e.target.value),
                    placeholder: __("Task title")
                  }
                ),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    className: "w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100",
                    rows: "2",
                    value: taskDescription,
                    onChange: (e) => setTaskDescription(e.target.value),
                    placeholder: __("Task description")
                  }
                ),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    type: "date",
                    value: taskDueDate,
                    onChange: (e) => setTaskDueDate(e.target.value)
                  }
                ),
                taskError && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: taskError }),
                /* @__PURE__ */ jsx(PrimaryButton, { onClick: handleAddTask, disabled: taskLoading, children: taskLoading ? __("Saving...") : __("Add Task") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-3", children: [
                taskItems.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: __("No tasks yet.") }),
                taskItems.map((task) => /* @__PURE__ */ jsxs("div", { className: "border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-800 dark:text-gray-100", children: task.title }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: task.status })
                  ] }),
                  task.description && /* @__PURE__ */ jsx("p", { className: "mt-1 text-gray-600 dark:text-gray-300", children: task.description }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: task.due_date ? `${__("Due")} ${formatDate(task.due_date)}` : "-" }),
                    task.status !== "completed" && /* @__PURE__ */ jsx(SecondaryButton, { onClick: () => handleUpdateTaskStatus(task.id, "completed"), children: __("Mark Completed") })
                  ] })
                ] }, task.id))
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-gray-900 dark:text-gray-100", children: __("Schedule Meeting") }),
              /* @__PURE__ */ jsxs("div", { className: "mt-3 grid grid-cols-1 gap-3", children: [
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    type: "datetime-local",
                    value: meetingDateTime,
                    onChange: (e) => setMeetingDateTime(e.target.value)
                  }
                ),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    value: meetingLocation,
                    onChange: (e) => setMeetingLocation(e.target.value),
                    placeholder: __("Location")
                  }
                ),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    className: "w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100",
                    rows: "2",
                    value: meetingAgenda,
                    onChange: (e) => setMeetingAgenda(e.target.value),
                    placeholder: __("Agenda")
                  }
                ),
                meetingError && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: meetingError }),
                /* @__PURE__ */ jsx(PrimaryButton, { onClick: handleAddMeeting, disabled: meetingLoading, children: meetingLoading ? __("Saving...") : __("Schedule") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-3", children: [
                meetingItems.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: __("No meetings yet.") }),
                meetingItems.map((meeting) => /* @__PURE__ */ jsxs("div", { className: "border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-800 dark:text-gray-100", children: formatDateTime(meeting.scheduled_at) }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: meeting.status })
                  ] }),
                  meeting.location && /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 mt-1", children: meeting.location }),
                  meeting.agenda && /* @__PURE__ */ jsx("div", { className: "text-gray-600 dark:text-gray-300 mt-1", children: meeting.agenda })
                ] }, meeting.id))
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-gray-900 dark:text-gray-100", children: __("Communication History") }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3 max-h-96 overflow-y-auto", children: [
                messages.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: __("No messages yet.") }),
                messages.map((msg) => /* @__PURE__ */ jsxs("div", { className: "border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-800 dark:text-gray-100", children: msg.sender?.name || __("User") }),
                    /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: formatDateTime(msg.created_at) })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "mt-2 text-gray-600 dark:text-gray-300", children: msg.message })
                ] }, msg.id))
              ] })
            ] })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  ParticipantShow as default
};
