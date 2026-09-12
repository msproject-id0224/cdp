import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-qz7IKsDN.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { _ as __ } from "./lang-COBcTD8W.js";
import { P as PrimaryButton } from "./PrimaryButton-BNNL2gCI.js";
import { I as InputLabel } from "./InputLabel-DDs2XNYP.js";
import { T as TextInput } from "./TextInput-D0qTZeQv.js";
import { S as SelectInput } from "./SelectInput-inadq0Bq.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { useState, useEffect, useMemo } from "react";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "./ThemeToggle-BY9dagkZ.js";
import "axios";
import "./ProfilePhoto-B39VtFFM.js";
import "./Modal-CKHW52Ki.js";
import "./SecondaryButton-TjIrbn1G.js";
import "./DangerButton-B7to2Tbx.js";
import "./Footer-CDwTxrct.js";
import "./useTheme-CngFDcs1.js";
function GiftEdit({ auth, gift, participants }) {
  const { data, setData, put, processing, errors } = useForm({
    user_id: gift.user_id,
    gift_code: gift.gift_code,
    letter_code: gift.letter_code || "",
    type: gift.type,
    model: gift.model,
    status: gift.status
  });
  const formatCodeInput = (rawValue) => {
    let value = rawValue.toUpperCase();
    const clean = value.replace(/[^A-Z0-9]/g, "");
    let formatted = "";
    if (clean.length > 0) {
      if (/[A-Z]/.test(clean[0])) formatted += clean[0];
    }
    if (clean.length > 1) {
      if (/[A-Z]/.test(clean[1])) formatted += clean[1];
    }
    if (formatted.length === 2) formatted += " - ";
    if (clean.length > 2) {
      const digits = clean.substring(2).replace(/[^0-9]/g, "");
      formatted += digits;
    }
    const match = value.match(/^([A-Z]{0,2})(?:\s*-\s*)?([0-9]*)/);
    if (match) {
      const rawLetters = value.replace(/[^A-Z]/g, "").substring(0, 2);
      const rawDigits = value.replace(/[^0-9]/g, "");
      if (rawLetters.length === 2 && rawDigits.length === 0 && value.endsWith(" ")) {
        formatted = rawLetters;
      }
    }
    return formatted;
  };
  const validateCodeFormat = (formatted) => {
    if (formatted.length >= 2 && !/^[A-Z]{2} - [0-9]+$/.test(formatted)) {
      if (formatted.length === 2) return "";
      if (formatted === formatted.substring(0, 2) + " - ") return "";
      return 'Format: 2 Huruf + " - " + Angka (Contoh: AB - 123)';
    }
    return "";
  };
  const [giftCodeError, setGiftCodeError] = useState("");
  const [letterCodeError, setLetterCodeError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  useEffect(() => {
    const participant = participants.find((p) => p.id === parseInt(data.user_id));
    if (participant) {
      setSearchTerm(participant.name);
    }
  }, []);
  const filteredParticipants = useMemo(() => {
    if (!searchTerm) return participants;
    return participants.filter(
      (p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || String(p.id).includes(searchTerm)
    );
  }, [participants, searchTerm]);
  const handleSelectParticipant = (participant) => {
    setData("user_id", participant.id);
    setSearchTerm(participant.name);
    setIsDropdownOpen(false);
  };
  const handleGiftCodeChange = (e) => {
    const formatted = formatCodeInput(e.target.value);
    setData("gift_code", formatted);
    setGiftCodeError(validateCodeFormat(formatted));
  };
  const handleLetterCodeChange = (e) => {
    let value = e.target.value.toUpperCase();
    if (!value) {
      setData("letter_code", "");
      setLetterCodeError("");
      return;
    }
    const firstChar = value.charAt(0);
    if (firstChar !== "C" && firstChar !== "D") {
      return;
    }
    const rest = value.substring(1).replace(/[^0-9]/g, "");
    const maxLength = firstChar === "C" ? 10 : 11;
    const truncatedRest = rest.substring(0, maxLength - 1);
    const newValue = firstChar + truncatedRest;
    setData("letter_code", newValue);
    if (firstChar === "C") {
      if (truncatedRest.length !== 9) {
        setLetterCodeError("Format ID harus C diikuti 9 digit angka");
      } else {
        setLetterCodeError("");
      }
    } else if (firstChar === "D") {
      if (truncatedRest.length !== 10) {
        setLetterCodeError("Format ID harus D diikuti 10 digit angka");
      } else {
        setLetterCodeError("");
      }
    }
  };
  const submit = (e) => {
    e.preventDefault();
    put(route("gifts.update", gift.id), {
      onSuccess: () => {
      }
    });
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200", children: __("Edit Data Hadiah") }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("Edit Data Hadiah") }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg", children: /* @__PURE__ */ jsx("div", { className: "p-6 text-gray-900 dark:text-gray-100", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6 max-w-xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "user_id", value: __("ID Partisipan / Nama") }),
            /* @__PURE__ */ jsxs("div", { className: "relative mt-1", children: [
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "user_search",
                  type: "text",
                  className: "block w-full",
                  placeholder: __("Cari nama atau ID partisipan..."),
                  value: searchTerm,
                  onChange: (e) => {
                    setSearchTerm(e.target.value);
                    setIsDropdownOpen(true);
                    setData("user_id", "");
                  },
                  onFocus: () => setIsDropdownOpen(true),
                  autoComplete: "off"
                }
              ),
              isDropdownOpen && /* @__PURE__ */ jsx("div", { className: "absolute z-10 w-full bg-white dark:bg-gray-700 mt-1 max-h-60 overflow-y-auto shadow-lg rounded-md border border-gray-200 dark:border-gray-600", children: filteredParticipants.length > 0 ? filteredParticipants.map((p) => /* @__PURE__ */ jsx(
                "div",
                {
                  className: "px-4 py-2 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/50 text-sm text-gray-700 dark:text-gray-200",
                  onClick: () => handleSelectParticipant(p),
                  children: p.name
                },
                p.id
              )) : /* @__PURE__ */ jsx("div", { className: "px-4 py-2 text-sm text-gray-500 dark:text-gray-400", children: __("Tidak ditemukan") }) })
            ] }),
            /* @__PURE__ */ jsx(InputError, { message: errors.user_id, className: "mt-2" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "gift_code", value: __("ID Hadiah") }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "gift_code",
                type: "text",
                className: `mt-1 block w-full ${giftCodeError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`,
                value: data.gift_code,
                onChange: handleGiftCodeChange,
                required: true,
                placeholder: "XX - 123456789",
                maxLength: 20
              }
            ),
            giftCodeError && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 mt-1", children: giftCodeError }),
            /* @__PURE__ */ jsx(InputError, { message: errors.gift_code, className: "mt-2" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "letter_code", value: __("ID Surat Terhubung") }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "letter_code",
                type: "text",
                className: `mt-1 block w-full ${letterCodeError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`,
                value: data.letter_code,
                onChange: handleLetterCodeChange,
                required: true,
                placeholder: "Contoh: C012345678",
                maxLength: 11
              }
            ),
            letterCodeError && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 mt-1", children: letterCodeError }),
            /* @__PURE__ */ jsx(InputError, { message: errors.letter_code, className: "mt-2" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "type", value: __("Jenis Hadiah") }),
            /* @__PURE__ */ jsxs(
              SelectInput,
              {
                id: "type",
                className: "mt-1 block w-full",
                value: data.type,
                onChange: (e) => setData("type", e.target.value),
                required: true,
                children: [
                  /* @__PURE__ */ jsx("option", { value: "birthday", children: __("Hadiah Ulang Tahun") }),
                  /* @__PURE__ */ jsx("option", { value: "family", children: __("Hadiah Keluarga") }),
                  /* @__PURE__ */ jsx("option", { value: "general", children: __("Hadiah Umum") })
                ]
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.type, className: "mt-2" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "model", value: __("Model Hadiah") }),
            /* @__PURE__ */ jsxs(
              SelectInput,
              {
                id: "model",
                className: "mt-1 block w-full",
                value: data.model,
                onChange: (e) => setData("model", e.target.value),
                required: true,
                children: [
                  /* @__PURE__ */ jsx("option", { value: "small", children: __("Hadiah Kecil") }),
                  /* @__PURE__ */ jsx("option", { value: "large", children: __("Hadiah Besar") })
                ]
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.model, className: "mt-2" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "status", value: __("Status Hadiah") }),
            /* @__PURE__ */ jsxs(
              SelectInput,
              {
                id: "status",
                className: "mt-1 block w-full",
                value: data.status,
                onChange: (e) => setData("status", e.target.value),
                required: true,
                children: [
                  /* @__PURE__ */ jsx("option", { value: "pending", children: __("Belum diterima") }),
                  /* @__PURE__ */ jsx("option", { value: "received", children: __("Telah diterima") }),
                  /* @__PURE__ */ jsx("option", { value: "returned", children: __("Dikembalikan") })
                ]
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.status, className: "mt-2" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: processing ? __("Menyimpan...") : __("Simpan Perubahan") }),
            /* @__PURE__ */ jsx(Link, { href: route("gifts.index"), className: "text-gray-600 dark:text-gray-400 hover:text-gray-900 underline text-sm", children: __("Batal") })
          ] })
        ] }) }) }) }) })
      ]
    }
  );
}
export {
  GiftEdit as default
};
