import { jsxs, jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BG6RGD2S.js";
import { router, Head, Link } from "@inertiajs/react";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "./ThemeToggle-BY9dagkZ.js";
import "./TextInput-D0qTZeQv.js";
import "axios";
import "./ProfilePhoto-CJ2Z04pO.js";
import "./Modal-CKHW52Ki.js";
import "./SecondaryButton-TjIrbn1G.js";
import "./lang-COBcTD8W.js";
import "./PrimaryButton-BNNL2gCI.js";
import "./DangerButton-B7to2Tbx.js";
import "./Footer-B7ihPSZ8.js";
import "./useTheme-CngFDcs1.js";
function Monitor({ auth, attendances = [], sessions = [] }) {
  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({ only: ["attendances", "sessions"] });
    }, 3e4);
    return () => clearInterval(interval);
  }, []);
  const fmtTime = (dt) => dt ? new Date(dt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-";
  const fmtDate = (dt) => dt ? new Date(dt).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }) : "-";
  const deviceLabel = (type) => {
    if (type === "android") return { label: "Android", cls: "bg-green-100 text-green-700" };
    if (type === "pc") return { label: "PC/Web", cls: "bg-blue-100 text-blue-700" };
    return { label: "-", cls: "bg-gray-100 text-gray-500" };
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      user: auth.user,
      header: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight", children: "Monitor Absensi Mentor" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("admin.attendance.sessions"),
              className: "inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700",
              children: "Kelola Sesi"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("admin.attendance.qr-display"),
              className: "inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700",
              children: "Tampilkan QR"
            }
          )
        ] })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Monitor Absensi" }),
        /* @__PURE__ */ jsx("div", { className: "py-10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6", children: [
          sessions.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: sessions.map((s) => /* @__PURE__ */ jsxs(
            "span",
            {
              className: `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${s.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"}`,
              children: [
                s.is_active && /* @__PURE__ */ jsxs("span", { className: "relative flex h-1.5 w-1.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" }),
                  /* @__PURE__ */ jsx("span", { className: "relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" })
                ] }),
                "Sesi #",
                s.meeting_id,
                " ",
                s.is_active ? "aktif" : "nonaktif"
              ]
            },
            s.meeting_id
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-gray-200 dark:border-gray-700", children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-base font-semibold text-gray-900 dark:text-white", children: [
                "Data Absensi Hari Ini — ",
                (/* @__PURE__ */ new Date()).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-0.5", children: "Diperbarui otomatis setiap 30 detik" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm", children: [
              /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-500 dark:text-gray-300 tracking-wider", children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left w-12", children: "No" }),
                /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left", children: "Deskripsi Aktivitas" }),
                /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left", children: "Mentor" }),
                /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left", children: "Mulai (Scan)" }),
                /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left", children: "Selesai (Upload Dok.)" }),
                /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left", children: "Perangkat" }),
                /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left", children: "Status / Dokumentasi" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800", children: attendances.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "7", className: "px-5 py-10 text-center text-gray-400 dark:text-gray-500", children: "Belum ada absensi tercatat hari ini." }) }) : attendances.map((att) => {
                const dev = deviceLabel(att.device_type);
                return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors", children: [
                  /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-gray-500 dark:text-gray-400 font-medium", children: att.no }),
                  /* @__PURE__ */ jsxs("td", { className: "px-5 py-4", children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-900 dark:text-white", children: att.agenda }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-0.5", children: fmtDate(att.scheduled_at) })
                  ] }),
                  /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-gray-700 dark:text-gray-300", children: att.mentor_name }),
                  /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-green-700 dark:text-green-400 font-medium", children: fmtTime(att.check_in_at) }),
                  /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-blue-700 dark:text-blue-400 font-medium", children: att.check_out_at ? fmtTime(att.check_out_at) : /* @__PURE__ */ jsx("span", { className: "text-gray-400 text-xs italic", children: "Menunggu dokumentasi" }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded-full text-xs font-medium ${dev.cls}`, children: dev.label }) }),
                  /* @__PURE__ */ jsxs("td", { className: "px-5 py-4", children: [
                    /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded-full text-xs font-semibold ${att.status === "Hadir" ? "bg-green-100 text-green-700" : att.status === "Sakit" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`, children: att.status }),
                    att.documentation_path && /* @__PURE__ */ jsx(
                      "a",
                      {
                        href: att.documentation_path,
                        target: "_blank",
                        rel: "noreferrer",
                        className: "block mt-1 text-xs text-indigo-600 hover:underline",
                        children: "Lihat Dokumentasi ↗"
                      }
                    )
                  ] })
                ] }, att.id);
              }) })
            ] }) })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  Monitor as default
};
