import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BG6RGD2S.js";
import { router, Head, Link } from "@inertiajs/react";
import { T as TextInput } from "./TextInput-D0qTZeQv.js";
import { S as SelectInput } from "./SelectInput-inadq0Bq.js";
import { P as Pagination } from "./Pagination-DbN0dqrA.js";
import { C as ConfirmModal } from "./ConfirmModal-Bqr5rb3_.js";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "./ThemeToggle-BY9dagkZ.js";
import "axios";
import "./ProfilePhoto-CJ2Z04pO.js";
import "./Modal-CKHW52Ki.js";
import "./SecondaryButton-TjIrbn1G.js";
import "./lang-COBcTD8W.js";
import "./PrimaryButton-BNNL2gCI.js";
import "./DangerButton-B7to2Tbx.js";
import "./Footer-B7ihPSZ8.js";
import "./useTheme-CngFDcs1.js";
function Index({ auth, screenings, filters }) {
  const [search, setSearch] = useState(filters.search || "");
  const [status, setStatus] = useState(filters.status || "");
  const [date, setDate] = useState(filters.date || "");
  const [isInitialMount, setIsInitialMount] = useState(true);
  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }
    const timer = setTimeout(() => {
      router.get(
        route("health-screenings.index"),
        { search, status, date },
        { preserveState: true, replace: true, preserveScroll: true }
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [search, status, date]);
  const [confirmState, setConfirmState] = useState({ show: false, title: "", message: "", onConfirm: null });
  const askConfirm = (title, message, fn) => setConfirmState({ show: true, title, message, onConfirm: fn });
  const closeConfirm = () => setConfirmState((s) => ({ ...s, show: false }));
  const handleDelete = (id) => {
    askConfirm(
      "Hapus Data Pemeriksaan",
      "Apakah Anda yakin ingin menghapus data pemeriksaan ini? Tindakan ini tidak dapat dibatalkan.",
      () => router.delete(route("health-screenings.destroy", id))
    );
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200", children: "Pemeriksaan Kesehatan" }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("health-screenings.create"),
            className: "px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150",
            children: "+ Tambah Pemeriksaan"
          }
        )
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Pemeriksaan Kesehatan" }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "p-6 text-gray-900 dark:text-gray-100", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-col sm:flex-row gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
              TextInput,
              {
                placeholder: "Cari nama atau ID...",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                className: "w-full"
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "w-full sm:w-48", children: /* @__PURE__ */ jsxs(
              SelectInput,
              {
                value: status,
                onChange: (e) => setStatus(e.target.value),
                className: "w-full",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Semua Status" }),
                  /* @__PURE__ */ jsx("option", { value: "normal", children: "Normal" }),
                  /* @__PURE__ */ jsx("option", { value: "mild", children: "Ringan (Mild)" }),
                  /* @__PURE__ */ jsx("option", { value: "moderate", children: "Sedang (Moderate)" }),
                  /* @__PURE__ */ jsx("option", { value: "severe", children: "Sangat Buruk (Severe)" })
                ]
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "w-full sm:w-48", children: /* @__PURE__ */ jsx(
              TextInput,
              {
                type: "date",
                value: date,
                onChange: (e) => setDate(e.target.value),
                className: "w-full"
              }
            ) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 dark:bg-gray-700", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "Peserta" }),
              /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "Tanggal" }),
              /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "BB / TB (BMI)" }),
              /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "Status Gizi" }),
              /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "Pemeriksa" }),
              /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "Aksi" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700", children: screenings.data.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "6", className: "px-6 py-4 text-center text-gray-500 dark:text-gray-400", children: "Tidak ada data pemeriksaan ditemukan." }) }) : screenings.data.map((item) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors", children: [
              /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-gray-900 dark:text-white", children: [
                  item.user?.first_name,
                  " ",
                  item.user?.last_name
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400", children: item.user?.id_number || "-" })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400", children: new Date(item.checked_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) }),
              /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400", children: [
                item.weight ? `${item.weight} kg` : "-",
                " / ",
                item.height ? `${item.height} cm` : "-",
                item.bmi && /* @__PURE__ */ jsxs("span", { className: "ml-1 text-xs font-bold text-indigo-600", children: [
                  "(",
                  item.bmi,
                  ")"
                ] })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-1 text-xs font-semibold rounded-full ${item.malnutrition_status === "normal" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : item.malnutrition_status === "mild" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" : item.malnutrition_status === "moderate" ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`, children: item.malnutrition_status === "normal" ? "Normal" : item.malnutrition_status === "mild" ? "Ringan" : item.malnutrition_status === "moderate" ? "Sedang" : "Sangat Buruk" }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400", children: item.examiner_name || "-" }),
              /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route("health-screenings.edit", item.id),
                    className: "text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300",
                    children: "Edit"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: route("health-screenings.export-pdf", item.id),
                    target: "_blank",
                    className: "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300",
                    children: "PDF"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleDelete(item.id),
                    className: "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300",
                    children: "Hapus"
                  }
                )
              ] })
            ] }, item.id)) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(Pagination, { links: screenings.links }) })
        ] }) }) }) }),
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
            confirmLabel: "Ya, Hapus"
          }
        )
      ]
    }
  );
}
export {
  Index as default
};
