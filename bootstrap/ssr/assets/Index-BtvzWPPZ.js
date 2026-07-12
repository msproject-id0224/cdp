import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BG6RGD2S.js";
import { useForm, router, Head, Link } from "@inertiajs/react";
import { _ as __ } from "./lang-COBcTD8W.js";
import { P as PrimaryButton } from "./PrimaryButton-BNNL2gCI.js";
import { S as SelectInput } from "./SelectInput-inadq0Bq.js";
import { T as TextInput } from "./TextInput-D0qTZeQv.js";
import { useState, useEffect, useRef } from "react";
import { P as Pagination } from "./Pagination-CRnq7q04.js";
import { M as Modal } from "./Modal-CKHW52Ki.js";
import { S as SecondaryButton } from "./SecondaryButton-TjIrbn1G.js";
import { D as DangerButton } from "./DangerButton-B7to2Tbx.js";
import { I as InputLabel } from "./InputLabel-DDs2XNYP.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "./ThemeToggle-BY9dagkZ.js";
import "axios";
import "./ProfilePhoto-CJ2Z04pO.js";
import "./Footer-B7ihPSZ8.js";
import "./useTheme-CngFDcs1.js";
function GiftReceptionForm({ show, onClose, gift }) {
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    usage_plan: gift.usage_plan || "",
    gift_description: gift.gift_description || "",
    gift_value: gift.gift_value || "",
    proof_photos: [],
    action: "submit"
    // 'draft' or 'submit' (submit sets to pending_verification)
  });
  const [previews, setPreviews] = useState([]);
  useEffect(() => {
    if (show) {
      setData({
        usage_plan: gift.usage_plan || "",
        gift_description: gift.gift_description || "",
        gift_value: gift.gift_value || "",
        proof_photos: [],
        action: "submit"
      });
      setPreviews([]);
      clearErrors();
    }
  }, [show, gift]);
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      alert("Maksimal 3 file.");
      return;
    }
    setData("proof_photos", files);
    const newPreviews = files.map((file) => {
      if (file.type.startsWith("image/")) {
        return URL.createObjectURL(file);
      }
      return null;
    });
    setPreviews(newPreviews);
  };
  const submit = (actionType) => {
    data.action = actionType;
    post(route("gifts.upload-proof", gift.id), {
      onSuccess: () => {
        reset();
        onClose();
      },
      preserveScroll: true
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    submit("submit");
  };
  const handleDraft = (e) => {
    e.preventDefault();
    submit("draft");
  };
  return /* @__PURE__ */ jsx(Modal, { show, onClose, maxWidth: "2xl", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 dark:text-gray-100 mb-4", children: __("Formulir Penerimaan Hadiah") }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "block text-xs text-gray-500", children: __("Nama Partisipan") }),
          /* @__PURE__ */ jsxs("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: [
            gift.user?.first_name,
            " ",
            gift.user?.last_name
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "block text-xs text-gray-500", children: __("ID Hadiah") }),
          /* @__PURE__ */ jsx("span", { className: "font-medium text-indigo-600", children: gift.gift_code })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "block text-xs text-gray-500", children: __("Jenis Hadiah") }),
          /* @__PURE__ */ jsx("span", { className: "capitalize text-gray-700 dark:text-gray-300", children: gift.type })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "block text-xs text-gray-500", children: __("Model") }),
          /* @__PURE__ */ jsx("span", { className: "capitalize text-gray-700 dark:text-gray-300", children: gift.model })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "gift_description", value: __("Keterangan Hadiah (Nama, Deskripsi, Syarat)") }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            id: "gift_description",
            className: "mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm",
            rows: "3",
            value: data.gift_description,
            onChange: (e) => setData("gift_description", e.target.value),
            placeholder: "Contoh: Sepatu Sekolah Nike (Ukuran 40), Syarat: Foto saat dipakai.",
            required: true
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.gift_description, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "gift_value", value: __("Perkiraan Nilai Hadiah (Rp)") }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "gift_value",
            type: "number",
            className: "mt-1 block w-full",
            value: data.gift_value,
            onChange: (e) => setData("gift_value", e.target.value),
            placeholder: "0"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.gift_value, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "usage_plan", value: __("Rencana Penggunaan Hadiah") }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            id: "usage_plan",
            className: "mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm",
            rows: "3",
            value: data.usage_plan,
            onChange: (e) => setData("usage_plan", e.target.value),
            placeholder: "Jelaskan bagaimana hadiah ini akan digunakan...",
            required: true
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.usage_plan, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "proof_photos", value: __("Upload Dokumentasi (Foto/PDF, Max 3 File)") }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "proof_photos",
            type: "file",
            multiple: true,
            accept: "image/*,application/pdf",
            onChange: handleFileChange,
            className: "mt-1 block w-full text-sm text-gray-500 dark:text-gray-400\n                                file:mr-4 file:py-2 file:px-4\n                                file:rounded-md file:border-0\n                                file:text-sm file:font-semibold\n                                file:bg-indigo-50 file:text-indigo-700\n                                hover:file:bg-indigo-100"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Format: JPG, PNG, PDF. Maks 5MB per file." }),
        /* @__PURE__ */ jsx(InputError, { message: errors.proof_photos, className: "mt-2" }),
        previews.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-4 grid grid-cols-3 gap-2", children: previews.map((src, index) => /* @__PURE__ */ jsx("div", { className: "relative aspect-square bg-gray-100 rounded overflow-hidden", children: src ? /* @__PURE__ */ jsx("img", { src, alt: `Preview ${index}`, className: "object-cover w-full h-full" }) : /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full text-gray-400", children: /* @__PURE__ */ jsx("span", { className: "text-xs", children: "PDF Document" }) }) }, index)) }),
        gift.proof_photo_path && gift.proof_photo_path.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium mb-1", children: "File Sebelumnya:" }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc pl-4 text-xs text-blue-600", children: gift.proof_photo_path.map((path, idx) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("a", { href: `/storage/${path}`, target: "_blank", rel: "noopener noreferrer", className: "hover:underline", children: [
            "Dokumen ",
            idx + 1
          ] }) }, idx)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700", children: [
        /* @__PURE__ */ jsx(SecondaryButton, { onClick: onClose, disabled: processing, children: __("Batal") }),
        /* @__PURE__ */ jsx(SecondaryButton, { onClick: handleDraft, disabled: processing, children: processing && data.action === "draft" ? __("Menyimpan...") : __("Simpan Draft") }),
        /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, onClick: handleSubmit, children: processing && data.action === "submit" ? __("Mengirim...") : __("Kirim Verifikasi") })
      ] })
    ] })
  ] }) });
}
function GiftVerificationModal({ show, onClose, gift }) {
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    status: "",
    // 'received' or 'returned'
    admin_notes: ""
  });
  useEffect(() => {
    if (show) {
      reset();
      clearErrors();
    }
  }, [show, gift]);
  const submit = (status) => {
    data.status = status;
    post(route("gifts.verify", gift.id), {
      onSuccess: () => {
        onClose();
      },
      preserveScroll: true
    });
  };
  const handleApprove = () => submit("received");
  const handleReject = () => submit("returned");
  return /* @__PURE__ */ jsx(Modal, { show, onClose, maxWidth: "2xl", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Verifikasi Penerimaan Hadiah") }),
      /* @__PURE__ */ jsx("span", { className: "px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-800", children: __("Menunggu Verifikasi") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "block text-xs text-gray-500", children: __("Partisipan") }),
          /* @__PURE__ */ jsxs("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: [
            gift.user?.first_name,
            " ",
            gift.user?.last_name
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "block text-xs text-gray-500", children: __("ID Hadiah") }),
          /* @__PURE__ */ jsx("span", { className: "font-medium text-indigo-600", children: gift.gift_code })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "block text-xs text-gray-500", children: __("Rencana Penggunaan") }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-700 dark:text-gray-300 mt-1", children: gift.usage_plan || "-" })
        ] }),
        gift.gift_description && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "block text-xs text-gray-500", children: __("Keterangan Hadiah") }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-700 dark:text-gray-300 mt-1", children: gift.gift_description })
        ] }),
        gift.gift_value && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "block text-xs text-gray-500", children: __("Nilai Hadiah") }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-700 dark:text-gray-300 mt-1", children: [
            "Rp ",
            parseInt(gift.gift_value).toLocaleString()
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: __("Dokumentasi Bukti") }),
          gift.proof_photo_path && gift.proof_photo_path.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2 max-h-60 overflow-y-auto", children: gift.proof_photo_path.map((path, idx) => /* @__PURE__ */ jsx("div", { className: "relative group", children: path.endsWith(".pdf") ? /* @__PURE__ */ jsxs(
            "a",
            {
              href: `/storage/${path}`,
              target: "_blank",
              className: "flex flex-col items-center justify-center h-24 bg-gray-100 rounded border border-gray-200 hover:bg-gray-200 transition",
              children: [
                /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-red-500 mb-1", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z", clipRule: "evenodd" }) }),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600 truncate w-full text-center px-1", children: "PDF Document" })
              ]
            }
          ) : /* @__PURE__ */ jsx("a", { href: `/storage/${path}`, target: "_blank", className: "block relative aspect-square bg-gray-100 rounded overflow-hidden border border-gray-200", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: `/storage/${path}`,
              alt: `Proof ${idx}`,
              className: "object-cover w-full h-full hover:scale-105 transition-transform duration-300"
            }
          ) }) }, idx)) }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 italic", children: __("Tidak ada dokumen yang diunggah.") })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "admin_notes", value: __("Catatan Admin (Opsional)") }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              id: "admin_notes",
              className: "mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm text-sm",
              rows: "3",
              value: data.admin_notes,
              onChange: (e) => setData("admin_notes", e.target.value),
              placeholder: "Tambahkan catatan jika perlu (misal alasan penolakan)..."
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.admin_notes, className: "mt-2" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700", children: [
      /* @__PURE__ */ jsx(SecondaryButton, { onClick: onClose, disabled: processing, children: __("Batal") }),
      /* @__PURE__ */ jsx(DangerButton, { onClick: handleReject, disabled: processing, className: "bg-red-600 hover:bg-red-700", children: processing ? __("Memproses...") : __("Tolak / Revisi") }),
      /* @__PURE__ */ jsx(PrimaryButton, { onClick: handleApprove, disabled: processing, className: "bg-green-600 hover:bg-green-700", children: processing ? __("Memproses...") : __("Terima & Verifikasi") })
    ] })
  ] }) });
}
function GiftDetailModal({ show, onClose, gift }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const openLightbox = (src) => setSelectedImage(src);
  const closeLightbox = () => setSelectedImage(null);
  useEffect(() => {
    if (show && gift) {
      fetch(route("gifts.log-view", gift.id), {
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),
          "Content-Type": "application/json"
        }
      }).catch((err) => console.error("Failed to log view", err));
    }
  }, [show, gift]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Modal, { show, onClose, maxWidth: "3xl", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900 dark:text-gray-100", children: __("Detail Penerimaan Hadiah") }),
        /* @__PURE__ */ jsx("span", { className: "px-3 py-1 text-sm font-bold rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300", children: __("Telah Diterima") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5 shadow-sm", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2", children: __("Informasi Partisipan") }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-xs text-gray-400", children: __("Nama Lengkap") }),
                /* @__PURE__ */ jsxs("span", { className: "text-base font-medium text-gray-900 dark:text-gray-100", children: [
                  gift.user?.first_name,
                  " ",
                  gift.user?.last_name
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-xs text-gray-400", children: __("ID Hadiah") }),
                /* @__PURE__ */ jsx("span", { className: "text-base font-mono text-indigo-600 dark:text-indigo-400 font-bold", children: gift.gift_code })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-xs text-gray-400", children: __("Tanggal Penerimaan") }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: gift.reception_date ? new Date(gift.reception_date).toLocaleDateString() : "-" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5 shadow-sm", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2", children: __("Detail Penggunaan") }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              gift.gift_description && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-xs text-gray-400", children: __("Deskripsi Hadiah") }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-800 dark:text-gray-200 mt-1", children: gift.gift_description })
              ] }),
              gift.gift_value && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-xs text-gray-400", children: __("Nilai Hadiah") }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm font-bold text-green-600 mt-1", children: [
                  "Rp ",
                  parseInt(gift.gift_value).toLocaleString("id-ID")
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-xs text-gray-400", children: __("Rencana Penggunaan") }),
                /* @__PURE__ */ jsx("div", { className: "bg-gray-50 dark:bg-gray-700/50 p-3 rounded mt-1", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-700 dark:text-gray-300 italic", children: [
                  '"',
                  gift.usage_plan || "-",
                  '"'
                ] }) })
              ] }),
              gift.admin_notes && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-xs text-gray-400", children: __("Catatan Verifikator") }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: gift.admin_notes })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4", children: __("Dokumentasi Penerimaan") }),
          gift.proof_photo_path && gift.proof_photo_path.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4", children: gift.proof_photo_path.map((path, idx) => /* @__PURE__ */ jsx("div", { className: "group relative aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md", children: path.endsWith(".pdf") ? /* @__PURE__ */ jsxs(
            "a",
            {
              href: `/storage/${path}`,
              target: "_blank",
              className: "flex flex-col items-center justify-center h-full w-full hover:bg-gray-50 dark:hover:bg-gray-700 transition",
              children: [
                /* @__PURE__ */ jsx("svg", { className: "w-10 h-10 text-red-500 mb-2", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z", clipRule: "evenodd" }) }),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-gray-600 dark:text-gray-400", children: "PDF Document" }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-400 mt-1", children: "Klik untuk unduh" })
              ]
            }
          ) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: `/storage/${path}`,
                alt: `Dokumentasi ${idx + 1}`,
                className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer",
                onClick: () => openLightbox(`/storage/${path}`)
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100", children: /* @__PURE__ */ jsx("span", { className: "bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm", children: __("Perbesar") }) })
          ] }) }, idx)) }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600", children: [
            /* @__PURE__ */ jsx("svg", { className: "w-12 h-12 text-gray-300 mb-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 italic", children: __("Tidak ada foto dokumentasi tersedia.") })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-8 flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700", children: /* @__PURE__ */ jsx(SecondaryButton, { onClick: onClose, children: __("Tutup") }) })
    ] }) }),
    selectedImage && /* @__PURE__ */ jsxs(
      "div",
      {
        className: "fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 animate-fade-in",
        onClick: closeLightbox,
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none",
              onClick: closeLightbox,
              children: /* @__PURE__ */ jsx("svg", { className: "w-8 h-8", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }) })
            }
          ),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: selectedImage,
              alt: "Full Preview",
              className: "max-w-full max-h-[90vh] object-contain rounded shadow-2xl",
              onClick: (e) => e.stopPropagation()
            }
          )
        ]
      }
    )
  ] });
}
function GiftIndex({ auth, gifts, filters = {} }) {
  const isAdmin = auth.user.role === "admin";
  const isMentor = auth.user.role === "mentor";
  const { delete: destroy, processing } = useForm();
  const [search, setSearch] = useState(filters.search || "");
  const [type, setType] = useState(filters.type || "");
  const [model, setModel] = useState(filters.model || "");
  const [status, setStatus] = useState(filters.status || "");
  const [sortBy, setSortBy] = useState(filters.sort_by || "created_at");
  const [sortOrder, setSortOrder] = useState(filters.sort_order || "desc");
  const [perPage, setPerPage] = useState(filters.per_page || 25);
  const [confirmingDeletion, setConfirmingDeletion] = useState(false);
  const [giftToDelete, setGiftToDelete] = useState(null);
  const [showReceptionForm, setShowReceptionForm] = useState(false);
  const [selectedGiftForReception, setSelectedGiftForReception] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedGiftForVerification, setSelectedGiftForVerification] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedGiftForDetail, setSelectedGiftForDetail] = useState(null);
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timeoutId = setTimeout(() => {
      router.get(
        route("gifts.index"),
        { search, type, model, status, sort_by: sortBy, sort_order: sortOrder, per_page: perPage },
        { preserveState: true, replace: true, preserveScroll: true }
      );
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [search, type, model, status, sortBy, sortOrder, perPage]);
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  const confirmDelete = (gift) => {
    setGiftToDelete(gift);
    setConfirmingDeletion(true);
  };
  const handleDelete = () => {
    if (giftToDelete) {
      destroy(route("gifts.destroy", giftToDelete.id), {
        preserveScroll: true,
        onSuccess: () => closeModal(),
        onError: () => {
          closeModal();
        }
      });
    }
  };
  const handleOpenReceptionForm = (gift) => {
    setSelectedGiftForReception(gift);
    setShowReceptionForm(true);
  };
  const handleOpenVerification = (gift) => {
    setSelectedGiftForVerification(gift);
    setShowVerificationModal(true);
  };
  const handleOpenDetail = (gift) => {
    setSelectedGiftForDetail(gift);
    setShowDetailModal(true);
  };
  const closeModal = () => {
    setConfirmingDeletion(false);
    setGiftToDelete(null);
    setShowReceptionForm(false);
    setSelectedGiftForReception(null);
    setShowVerificationModal(false);
    setSelectedGiftForVerification(null);
    setShowDetailModal(false);
    setSelectedGiftForDetail(null);
  };
  const SortIcon = ({ column }) => {
    if (sortBy !== column) return /* @__PURE__ */ jsx("span", { className: "text-gray-400 ml-1", children: "⇅" });
    return sortOrder === "asc" ? /* @__PURE__ */ jsx("span", { className: "ml-1", children: "↑" }) : /* @__PURE__ */ jsx("span", { className: "ml-1", children: "↓" });
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200", children: __("Daftar Partisipan Penerima Hadiah") }),
        isAdmin && /* @__PURE__ */ jsx(Link, { href: route("gifts.create"), children: /* @__PURE__ */ jsx(PrimaryButton, { children: __("Tambah Penerima Hadiah") }) })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("Daftar Partisipan Penerima Hadiah") }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "p-6 text-gray-900 dark:text-gray-100", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-6 flex flex-col md:flex-row gap-4 justify-between items-end", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 w-full", children: [
            /* @__PURE__ */ jsx(
              TextInput,
              {
                placeholder: __("Cari Nama, ID Hadiah, Surat..."),
                value: search,
                onChange: (e) => setSearch(e.target.value),
                className: "w-full"
              }
            ),
            /* @__PURE__ */ jsxs(
              SelectInput,
              {
                value: type,
                onChange: (e) => setType(e.target.value),
                className: "w-full",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: __("Semua Jenis") }),
                  /* @__PURE__ */ jsx("option", { value: "birthday", children: __("Ulang Tahun") }),
                  /* @__PURE__ */ jsx("option", { value: "family", children: __("Keluarga") }),
                  /* @__PURE__ */ jsx("option", { value: "general", children: __("Umum") })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              SelectInput,
              {
                value: status,
                onChange: (e) => setStatus(e.target.value),
                className: "w-full",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: __("Semua Status") }),
                  /* @__PURE__ */ jsx("option", { value: "pending", children: __("Belum diterima") }),
                  /* @__PURE__ */ jsx("option", { value: "pending_verification", children: __("Menunggu Verifikasi") }),
                  /* @__PURE__ */ jsx("option", { value: "received", children: __("Telah diterima") }),
                  /* @__PURE__ */ jsx("option", { value: "returned", children: __("Dikembalikan") }),
                  /* @__PURE__ */ jsx("option", { value: "draft", children: __("Draft") })
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-500 whitespace-nowrap", children: [
                __("Show"),
                ":"
              ] }),
              /* @__PURE__ */ jsxs(
                SelectInput,
                {
                  value: perPage,
                  onChange: (e) => setPerPage(parseInt(e.target.value)),
                  className: "w-20",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "10", children: "10" }),
                    /* @__PURE__ */ jsx("option", { value: "25", children: "25" }),
                    /* @__PURE__ */ jsx("option", { value: "50", children: "50" }),
                    /* @__PURE__ */ jsx("option", { value: "100", children: "100" })
                  ]
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 dark:bg-gray-700", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __("No.") }),
              /* @__PURE__ */ jsxs(
                "th",
                {
                  className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition",
                  onClick: () => handleSort("user.name"),
                  children: [
                    __("Nama Partisipan"),
                    " ",
                    /* @__PURE__ */ jsx(SortIcon, { column: "user.name" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "th",
                {
                  className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition",
                  onClick: () => handleSort("gift_code"),
                  children: [
                    __("ID Hadiah"),
                    " ",
                    /* @__PURE__ */ jsx(SortIcon, { column: "gift_code" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "th",
                {
                  className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition",
                  onClick: () => handleSort("letter_code"),
                  children: [
                    __("ID Surat"),
                    " ",
                    /* @__PURE__ */ jsx(SortIcon, { column: "letter_code" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "th",
                {
                  className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition",
                  onClick: () => handleSort("status"),
                  children: [
                    __("Status"),
                    " ",
                    /* @__PURE__ */ jsx(SortIcon, { column: "status" })
                  ]
                }
              ),
              isAdmin && /* @__PURE__ */ jsx("th", { className: "px-6 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: __("Aksi") })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700", children: gifts.data.length > 0 ? gifts.data.map((gift, index) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-700/50 transition", children: [
              /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400", children: (gifts.current_page - 1) * gifts.per_page + index + 1 }),
              /* @__PURE__ */ jsxs("td", { className: "px-6 py-2.5 whitespace-nowrap", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-gray-900 dark:text-gray-100", children: [
                  gift.user.first_name,
                  " ",
                  gift.user.last_name
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: gift.user.id_number })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5 whitespace-nowrap text-sm text-indigo-600 dark:text-indigo-400", children: isMentor && gift.status !== "received" ? /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleOpenReceptionForm(gift),
                  className: "hover:underline text-left",
                  title: "Proses Penerimaan Hadiah",
                  children: gift.gift_code
                }
              ) : isAdmin ? gift.status === "received" ? /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleOpenDetail(gift),
                  className: "hover:underline text-left font-medium text-green-600 dark:text-green-400",
                  title: "Lihat Detail Penerimaan",
                  children: gift.gift_code
                }
              ) : /* @__PURE__ */ jsx(Link, { href: route("gifts.edit", gift.id), className: "hover:underline", children: gift.gift_code }) : /* @__PURE__ */ jsx("span", { children: gift.gift_code }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5 whitespace-nowrap text-sm text-indigo-600 dark:text-indigo-400", children: gift.letter_code ? /* @__PURE__ */ jsx("a", { href: "#", onClick: (e) => e.preventDefault(), className: "hover:underline cursor-pointer", title: "Lihat Dokumen", children: gift.letter_code }) : "-" }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5 whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${gift.status === "received" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : gift.status === "returned" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" : gift.status === "pending_verification" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" : gift.status === "draft" ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"}`, children: gift.status === "pending" ? "Belum diterima" : gift.status === "received" ? "Telah diterima" : gift.status === "pending_verification" ? "Menunggu Verifikasi" : gift.status === "draft" ? "Draft" : "Dikembalikan" }) }),
              isAdmin && /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5 whitespace-nowrap text-right text-sm font-medium", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
                gift.status === "pending_verification" && /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleOpenVerification(gift),
                    className: "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 font-bold",
                    children: __("Verifikasi")
                  }
                ),
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route("gifts.edit", gift.id),
                    className: "text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300",
                    children: __("Edit")
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => confirmDelete(gift),
                    className: "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300",
                    children: __("Hapus")
                  }
                )
              ] }) })
            ] }, gift.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "6", className: "px-6 py-10 text-center text-gray-500 dark:text-gray-400", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-12 h-12 mb-3 text-gray-300", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" }) }),
              /* @__PURE__ */ jsx("p", { children: __("Belum ada data hadiah yang ditemukan.") })
            ] }) }) }) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(Pagination, { links: gifts.links }) })
        ] }) }) }) }),
        selectedGiftForReception && /* @__PURE__ */ jsx(
          GiftReceptionForm,
          {
            show: showReceptionForm,
            onClose: closeModal,
            gift: selectedGiftForReception
          }
        ),
        selectedGiftForVerification && /* @__PURE__ */ jsx(
          GiftVerificationModal,
          {
            show: showVerificationModal,
            onClose: closeModal,
            gift: selectedGiftForVerification
          }
        ),
        selectedGiftForDetail && /* @__PURE__ */ jsx(
          GiftDetailModal,
          {
            show: showDetailModal,
            onClose: closeModal,
            gift: selectedGiftForDetail
          }
        ),
        /* @__PURE__ */ jsx(Modal, { show: confirmingDeletion, onClose: closeModal, children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Apakah Anda yakin ingin menghapus data hadiah ini?") }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600 dark:text-gray-400", children: __("Data yang dihapus tidak dapat dikembalikan. Pastikan data ini tidak sedang digunakan untuk referensi lain.") }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end", children: [
            /* @__PURE__ */ jsx(SecondaryButton, { onClick: closeModal, children: __("Batal") }),
            /* @__PURE__ */ jsx(DangerButton, { className: "ml-3", disabled: processing, onClick: handleDelete, children: processing ? __("Menghapus...") : __("Hapus Data") })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  GiftIndex as default
};
