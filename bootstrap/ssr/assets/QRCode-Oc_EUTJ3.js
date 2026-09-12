import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-qz7IKsDN.js";
import { QRCodeSVG } from "qrcode.react";
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
function QRCodeDisplay({ auth }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(/* @__PURE__ */ new Date());
  const [countdown, setCountdown] = useState(15);
  const fetchSessions = async () => {
    try {
      const res = await axios.get(route("api.admin.attendance.active-sessions"));
      setSessions(res.data.sessions);
      setLastUpdated(/* @__PURE__ */ new Date());
      setCountdown(15);
    } catch (err) {
      console.error("Error fetching active sessions:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 15e3);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const tick = setInterval(() => setCountdown((c) => c > 0 ? c - 1 : 15), 1e3);
    return () => clearInterval(tick);
  }, []);
  const fmt = (dt) => dt ? new Date(dt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-";
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      user: auth.user,
      header: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight", children: "Tampilan QR Absensi" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: route("admin.attendance.sessions"),
              className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition",
              children: [
                /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }),
                "Kelola Sesi"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: route("admin.attendance.monitor"),
              className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition shadow-sm",
              children: [
                /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }) }),
                "Monitor Absensi"
              ]
            }
          )
        ] })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "QR Absensi – Layar Admin" }),
        /* @__PURE__ */ jsx("div", { className: "py-6 sm:py-10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 shadow-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
              /* @__PURE__ */ jsxs("span", { className: "relative flex h-2.5 w-2.5", children: [
                /* @__PURE__ */ jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" }),
                /* @__PURE__ */ jsx("span", { className: "relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-gray-600 dark:text-gray-400", children: [
                "Diperbarui: ",
                /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-800 dark:text-gray-200", children: lastUpdated.toLocaleTimeString("id-ID") })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "hidden sm:flex items-center gap-1.5 text-gray-400 dark:text-gray-500", children: [
                "· Refresh otomatis dalam",
                /* @__PURE__ */ jsx("span", { className: "inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold tabular-nums", children: countdown }),
                "detik"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${sessions.length > 0 ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"}`, children: sessions.length > 0 ? `${sessions.length} sesi aktif` : "Tidak ada sesi aktif" }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: fetchSessions,
                  className: "inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition",
                  children: [
                    /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) }),
                    "Refresh"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3", children: [
            /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-amber-800 dark:text-amber-200", children: [
              /* @__PURE__ */ jsx("strong", { children: "Untuk Mentor Android:" }),
              " Arahkan kamera HP ke QR code melalui menu",
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Absensi → Scan Barcode" }),
              ". QR code juga telah dikirim ke email mentor."
            ] })
          ] }),
          loading ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-28 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700", children: [
            /* @__PURE__ */ jsxs("svg", { className: "animate-spin h-10 w-10 text-indigo-500 mb-4", fill: "none", viewBox: "0 0 24 24", children: [
              /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
              /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-400", children: "Memuat sesi aktif…" })
          ] }) : sessions.length === 0 ? (
            /* ── Empty State ─────────────────────────────────── */
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-24 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 shadow-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative mb-8", children: [
                /* @__PURE__ */ jsx("div", { className: "w-40 h-40 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-20 h-20 text-gray-300 dark:text-gray-600", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M3 3h7v7H3V3zm1 1v5h5V4H4zm1 1h3v3H5V5zM13 3h7v7h-7V3zm1 1v5h5V4h-5zm1 1h3v3h-3V5zM3 13h7v7H3v-7zm1 1v5h5v-5H4zm1 1h3v3H5v-3zm8 1h2v2h-2v-2zm2-2h2v2h-2v-2zm2 2h2v2h-2v-2zm-4 2h2v2h-2v-2zm2 2h2v2h-2v-2zm2-2h2v2h-2v-2zm0 2h2v2h-2v-2z" }) }) }),
                /* @__PURE__ */ jsx("span", { className: "absolute inset-0 rounded-2xl border-2 border-gray-200 dark:border-gray-600 animate-ping opacity-30" })
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-700 dark:text-gray-300 mb-2", children: "Tidak ada sesi aktif" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6", children: "Belum ada sesi kegiatan yang sedang berlangsung. Aktifkan sesi terlebih dahulu agar QR code muncul di sini." }),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  href: route("admin.attendance.sessions"),
                  className: "inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-sm",
                  children: [
                    /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }),
                    "Kelola Sesi Kegiatan"
                  ]
                }
              )
            ] })
          ) : (
            /* ── Sessions Grid (single or multiple) ─────────── */
            /* @__PURE__ */ jsx("div", { className: `grid gap-8 ${sessions.length === 1 ? "grid-cols-1 max-w-2xl mx-auto w-full" : sessions.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"}`, children: sessions.map((session) => /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 px-6 pt-5 pb-4 text-white", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [
                  /* @__PURE__ */ jsxs("span", { className: "relative flex h-2 w-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" }),
                    /* @__PURE__ */ jsx("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-green-400" })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold tracking-wide uppercase text-indigo-200", children: "Sesi Aktif" })
                ] }),
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold leading-snug", children: session.agenda }),
                /* @__PURE__ */ jsxs("p", { className: "text-indigo-200 text-sm mt-0.5", children: [
                  session.mentor_name,
                  " · ",
                  fmt(session.scheduled_at),
                  "–",
                  fmt(session.end_time)
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 px-6 py-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 uppercase tracking-wide", children: "MULAI" }),
                  /* @__PURE__ */ jsx("div", { className: "bg-white p-3 rounded-xl border-2 border-green-200 shadow-inner", children: /* @__PURE__ */ jsx(
                    QRCodeSVG,
                    {
                      value: session.qr_payload,
                      size: sessions.length === 1 ? 180 : 140,
                      level: "H",
                      marginSize: 1
                    }
                  ) }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-green-600 dark:text-green-400 text-center font-medium", children: "Scan saat tiba" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 uppercase tracking-wide", children: "SELESAI" }),
                  /* @__PURE__ */ jsx("div", { className: "bg-white p-3 rounded-xl border-2 border-red-200 shadow-inner", children: /* @__PURE__ */ jsx(
                    QRCodeSVG,
                    {
                      value: session.checkout_qr_payload,
                      size: sessions.length === 1 ? 180 : 140,
                      level: "H",
                      marginSize: 1
                    }
                  ) }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600 dark:text-red-400 text-center font-medium", children: "Scan saat selesai" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "px-6 pb-5 space-y-2", children: [
                session.expires_at && /* @__PURE__ */ jsxs("p", { className: "text-xs text-orange-600 dark:text-orange-400 text-center", children: [
                  "Berlaku hingga: ",
                  new Date(session.expires_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: `flex items-center justify-center gap-1.5 text-xs font-medium ${session.email_sent ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"}`, children: session.email_sent ? "✓ QR MULAI & SELESAI terkirim ke email" : "⚠ Email QR belum terkirim" })
              ] })
            ] }, session.session_id)) })
          )
        ] }) })
      ]
    }
  );
}
export {
  QRCodeDisplay as default
};
