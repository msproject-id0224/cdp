import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-qz7IKsDN.js";
import { Head, Link, router } from "@inertiajs/react";
import axios from "axios";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "./ThemeToggle-BY9dagkZ.js";
import "./TextInput-D0qTZeQv.js";
import "./ProfilePhoto-B39VtFFM.js";
import "./Modal-CKHW52Ki.js";
import "./SecondaryButton-TjIrbn1G.js";
import "./lang-COBcTD8W.js";
import "./PrimaryButton-BNNL2gCI.js";
import "./DangerButton-B7to2Tbx.js";
import "./Footer-CDwTxrct.js";
import "./useTheme-CngFDcs1.js";
const fmtTime = (dt) => dt ? new Date(dt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-";
const fmtFull = (dt) => dt ? new Date(dt).toLocaleString("id-ID", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit"
}) : "-";
function Pill({ color, children }) {
  const map = {
    green: "bg-green-100 text-green-700 border-green-300",
    blue: "bg-blue-100 text-blue-700 border-blue-300",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-300",
    orange: "bg-orange-100 text-orange-700 border-orange-300",
    gray: "bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
  };
  return /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[color] ?? map.gray}`, children });
}
function SessionStatus({ session, meetingStatus }) {
  if (!session) {
    if (meetingStatus === "pending") return /* @__PURE__ */ jsx(Pill, { color: "orange", children: "Menunggu Persetujuan Admin" });
    return /* @__PURE__ */ jsx(Pill, { color: "gray", children: "Belum Ada Sesi" });
  }
  if (session.is_active && session.email_sent) return /* @__PURE__ */ jsx(Pill, { color: "green", children: "Aktif · Email Terkirim ✓" });
  if (session.is_active && !session.email_sent) return /* @__PURE__ */ jsx(Pill, { color: "blue", children: "Aktif · Email Belum Terkirim" });
  if (!session.is_active && !session.email_sent) return /* @__PURE__ */ jsx(Pill, { color: "yellow", children: "Sesi Siap · Menunggu T-10 menit" });
  return /* @__PURE__ */ jsx(Pill, { color: "gray", children: "Nonaktif" });
}
function Sessions({ auth, meetings }) {
  const [loading, setLoading] = useState({});
  const [flash, setFlash] = useState(null);
  const notify = (text, type = "success") => {
    setFlash({ text, type });
    setTimeout(() => setFlash(null), 4e3);
  };
  const resendEmail = async (meeting) => {
    setLoading((p) => ({ ...p, [meeting.id]: "email" }));
    try {
      const res = await axios.post(
        route("api.admin.attendance.resend-email", { session: meeting.session.id })
      );
      notify(res.data.message);
      router.reload({ only: ["meetings"] });
    } catch (err) {
      notify(err.response?.data?.message ?? "Gagal mengirim email.", "error");
    } finally {
      setLoading((p) => ({ ...p, [meeting.id]: null }));
    }
  };
  const deactivate = async (meeting) => {
    if (!confirm("Yakin ingin menonaktifkan sesi absensi ini?")) return;
    setLoading((p) => ({ ...p, [meeting.id]: "deactivate" }));
    try {
      const res = await axios.post(
        route("api.admin.attendance.deactivate", { session: meeting.session.id })
      );
      notify(res.data.message);
      router.reload({ only: ["meetings"] });
    } catch (err) {
      notify(err.response?.data?.message ?? "Gagal menonaktifkan.", "error");
    } finally {
      setLoading((p) => ({ ...p, [meeting.id]: null }));
    }
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      user: auth.user,
      header: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight", children: "Status Sesi Absensi" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("admin.attendance.qr-display"),
              className: "inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700",
              children: "Tampilkan QR (Android)"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("admin.attendance.monitor"),
              className: "inline-flex items-center px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-md hover:bg-gray-300",
              children: "Monitor Absensi"
            }
          )
        ] })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Sesi Absensi" }),
        /* @__PURE__ */ jsx("div", { className: "py-10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-5", children: [
          flash && /* @__PURE__ */ jsx("div", { className: `px-4 py-3 rounded-xl text-sm font-medium border ${flash.type === "error" ? "bg-red-50 text-red-800 border-red-300" : "bg-green-50 text-green-800 border-green-300"}`, children: flash.text }),
          /* @__PURE__ */ jsxs("div", { className: "bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4 text-sm text-indigo-800 dark:text-indigo-200", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold mb-1.5", children: "Alur Otomatis" }),
            /* @__PURE__ */ jsxs("ol", { className: "list-decimal list-inside space-y-1 text-xs", children: [
              /* @__PURE__ */ jsxs("li", { children: [
                "Admin menyetujui jadwal mentor → ",
                /* @__PURE__ */ jsx("strong", { children: "sesi absensi + barcode otomatis dibuat" }),
                "."
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                "Sistem mengirim barcode ke email mentor ",
                /* @__PURE__ */ jsx("strong", { children: "10 menit sebelum kegiatan mulai" }),
                " (via scheduler)."
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                "Mentor ",
                /* @__PURE__ */ jsx("strong", { children: "Android" }),
                ": scan barcode dari layar admin (halaman Tampilkan QR)."
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                "Mentor ",
                /* @__PURE__ */ jsx("strong", { children: "PC" }),
                ": unduh barcode dari email → upload di halaman Absensi."
              ] }),
              /* @__PURE__ */ jsx("li", { children: "Setelah scan berhasil, mentor upload foto dokumentasi kegiatan." })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-2.5 text-xs text-indigo-600 dark:text-indigo-400 font-mono bg-indigo-100 dark:bg-indigo-800/60 inline-block px-2 py-0.5 rounded", children: "php artisan schedule:work" }),
            /* @__PURE__ */ jsx("span", { className: "ml-2 text-xs text-indigo-500", children: "← jalankan di server untuk aktifkan scheduler" })
          ] }),
          meetings.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow p-12 text-center text-gray-400 dark:text-gray-500", children: "Tidak ada kegiatan terjadwal hari ini." }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: meetings.map((meeting) => {
            const session = meeting.session;
            const busy = loading[meeting.id];
            const qrSendTime = meeting.scheduled_at ? new Date(new Date(meeting.scheduled_at).getTime() - 10 * 6e4).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-";
            return /* @__PURE__ */ jsx(
              "div",
              {
                className: `bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-5 ${session?.is_active && session?.email_sent ? "border-green-500" : session?.is_active ? "border-blue-500" : session ? "border-yellow-400" : "border-gray-300"}`,
                children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-start md:justify-between gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 space-y-1.5", children: [
                    /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900 dark:text-white", children: meeting.agenda || /* @__PURE__ */ jsx("span", { className: "italic text-gray-400", children: "Tanpa Judul" }) }),
                    /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
                      "Mentor: ",
                      /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-700 dark:text-gray-300", children: meeting.mentor_name }),
                      meeting.mentor_email && /* @__PURE__ */ jsxs("span", { className: "ml-1 text-xs text-gray-400", children: [
                        "(",
                        meeting.mentor_email,
                        ")"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-400 dark:text-gray-500", children: [
                      "Jadwal: ",
                      fmtTime(meeting.scheduled_at),
                      " – ",
                      fmtTime(meeting.end_time),
                      " · Email QR dikirim pukul ",
                      /* @__PURE__ */ jsx("strong", { className: "text-gray-600 dark:text-gray-300", children: qrSendTime })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 pt-1", children: [
                      /* @__PURE__ */ jsx(SessionStatus, { session, meetingStatus: meeting.meeting_status }),
                      session?.email_sent && /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-400", children: [
                        "Terkirim: ",
                        fmtFull(session.email_sent_at)
                      ] }),
                      session?.activated_at && !session.email_sent && /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-400", children: [
                        "Sesi dibuat: ",
                        fmtFull(session.activated_at)
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 shrink-0 items-start", children: session ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => resendEmail(meeting),
                        disabled: !!busy,
                        className: "px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition",
                        children: busy === "email" ? "Mengirim…" : "Kirim Ulang Email QR"
                      }
                    ),
                    session.is_active && /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => deactivate(meeting),
                        disabled: !!busy,
                        className: "px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition",
                        children: busy === "deactivate" ? "Menonaktifkan…" : "Nonaktifkan"
                      }
                    )
                  ] }) : /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400 italic self-center", children: meeting.meeting_status === "pending" ? "Setujui jadwal untuk membuat sesi" : "Sesi belum terbuat" }) })
                ] })
              },
              meeting.id
            );
          }) })
        ] }) })
      ]
    }
  );
}
export {
  Sessions as default
};
