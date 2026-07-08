import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BG6RGD2S.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { _ as __ } from "./lang-COBcTD8W.js";
import { P as PrimaryButton } from "./PrimaryButton-BNNL2gCI.js";
import { I as InputLabel } from "./InputLabel-DDs2XNYP.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { Transition } from "@headlessui/react";
import { B as BibleVerseModal } from "./BibleVerseModal-CAPxa-GS.js";
import "./Dropdown-BgvF6zKd.js";
import "./ThemeToggle-BY9dagkZ.js";
import "./TextInput-D0qTZeQv.js";
import "axios";
import "./ProfilePhoto-CJ2Z04pO.js";
import "./Modal-CKHW52Ki.js";
import "./SecondaryButton-TjIrbn1G.js";
import "./DangerButton-B7to2Tbx.js";
import "./Footer-B7ihPSZ8.js";
import "./useTheme-CngFDcs1.js";
const BIBLE_VERSES = {
  jeremiah: {
    reference: "Yeremia 29:11",
    text: "Sebab Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu, demikianlah firman TUHAN, yaitu rancangan damai sejahtera dan bukan rancangan kecelakaan, untuk memberikan kepadamu hari depan yang penuh harapan.",
    translation: "TB",
    color: "indigo"
  },
  ephesians: {
    reference: "Efesus 2:10",
    text: "Karena kita ini buatan Allah, diciptakan dalam Kristus Yesus untuk melakukan pekerjaan baik, yang dipersiapkan Allah sebelumnya. Ia mau, supaya kita hidup di dalamnya.",
    translation: "TB",
    color: "indigo"
  },
  genesis: {
    reference: "Kejadian 1:26-28",
    text: 'Berfirmanlah Allah: "Baiklah Kita menjadikan manusia menurut gambar dan rupa Kita, supaya mereka berkuasa atas ikan-ikan di laut dan burung-burung di udara dan atas ternak dan atas seluruh bumi dan atas segala binatang melata yang merayap di bumi." Maka Allah menciptakan manusia itu menurut gambar-Nya, menurut gambar Allah diciptakan-Nya dia; laki-laki dan perempuan diciptakan-Nya mereka. Allah memberkati mereka, lalu Allah berfirman kepada mereka: "Beranakcuculah dan bertambah banyak; penuhilah bumi dan taklukkanlah itu, berkuasalah atas ikan-ikan di laut dan burung-burung di udara dan atas segala binatang yang merayap di bumi."',
    translation: "TB",
    color: "indigo"
  }
};
const VerseHeading = ({ label, verseKey, onOpen }) => /* @__PURE__ */ jsxs(
  "button",
  {
    type: "button",
    onClick: () => onOpen(verseKey),
    className: "group flex items-center gap-2 text-left w-full mb-4",
    children: [
      /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold text-indigo-700 dark:text-indigo-300 group-hover:text-indigo-900 dark:group-hover:text-indigo-100 transition-colors", children: label }),
      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs font-medium text-indigo-400 dark:text-indigo-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors border border-indigo-200 dark:border-indigo-700 rounded-full px-2 py-0.5 shrink-0", children: [
        /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }),
        "Lihat ayat"
      ] })
    ]
  }
);
const TextArea = ({ id, value, onChange, placeholder }) => /* @__PURE__ */ jsx(
  "textarea",
  {
    id,
    value,
    onChange,
    placeholder,
    className: "w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 mt-1 block resize",
    rows: "3"
  }
);
function WhatTheBibleSays({ auth, reflection }) {
  const [activeVerse, setActiveVerse] = useState(null);
  const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
    jeremiah_29_11_who_knows: reflection?.jeremiah_29_11_who_knows || "",
    jeremiah_29_11_plans: reflection?.jeremiah_29_11_plans || "",
    ephesians_2_10_made_by: reflection?.ephesians_2_10_made_by || "",
    ephesians_2_10_purpose: reflection?.ephesians_2_10_purpose || "",
    ephesians_2_10_god_wants: reflection?.ephesians_2_10_god_wants || "",
    genesis_1_26_28_image: reflection?.genesis_1_26_28_image || "",
    genesis_1_26_28_purpose: reflection?.genesis_1_26_28_purpose || "",
    summary_point_1: reflection?.summary_point_1 || "",
    summary_point_2: reflection?.summary_point_2 || "",
    favorite_verse: reflection?.favorite_verse || "",
    reason_favorite_verse: reflection?.reason_favorite_verse || "",
    leadership_c1: reflection?.leadership_c1 || "",
    leadership_c2: reflection?.leadership_c2 || "",
    leadership_c3: reflection?.leadership_c3 || "",
    leadership_c4: reflection?.leadership_c4 || "",
    leadership_c5: reflection?.leadership_c5 || "",
    chapter_learning_text: reflection?.chapter_learning_text || "",
    chapter_learning_image: null
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("rmd.what-the-bible-says.store"), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      user: auth.user,
      header: /* @__PURE__ */ jsx("h2", { className: "font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight", children: __("RMD_BIBLE_SAYS_TITLE") }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("RMD_BIBLE_SAYS_TITLE") }),
        /* @__PURE__ */ jsx(
          BibleVerseModal,
          {
            verse: activeVerse ? BIBLE_VERSES[activeVerse] : null,
            onClose: () => setActiveVerse(null)
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "py-12 bg-gray-50 dark:bg-gray-900 min-h-screen relative", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute inset-0 pointer-events-none z-0",
              style: {
                backgroundImage: "url('/images/rmd-backgrounds/latar-_5_.svg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                opacity: 0.08
              }
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10", children: /* @__PURE__ */ jsx("form", { onSubmit: submit, className: "bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "p-6 text-gray-900 dark:text-gray-100 space-y-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2", children: __("RMD_BIBLE_SAYS_MAIN_TITLE") }),
              /* @__PURE__ */ jsx("div", { className: "w-24 h-1 bg-indigo-500 mx-auto rounded" })
            ] }),
            /* @__PURE__ */ jsx("section", { className: "prose dark:prose-invert max-w-none", children: /* @__PURE__ */ jsx("p", { className: "text-lg font-medium text-gray-800 dark:text-gray-200", children: __("RMD_BIBLE_SAYS_INTRO") }) }),
            /* @__PURE__ */ jsxs("div", { className: "bg-indigo-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm", children: [
              /* @__PURE__ */ jsx(VerseHeading, { label: __("RMD_JEREMIAH_29_11"), verseKey: "jeremiah", onOpen: setActiveVerse }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { htmlFor: "jeremiah_29_11_who_knows", value: __("RMD_JEREMIAH_WHO_KNOWS") }),
                  /* @__PURE__ */ jsx(
                    TextArea,
                    {
                      id: "jeremiah_29_11_who_knows",
                      value: data.jeremiah_29_11_who_knows,
                      onChange: (e) => setData("jeremiah_29_11_who_knows", e.target.value)
                    }
                  ),
                  /* @__PURE__ */ jsx(InputError, { message: errors.jeremiah_29_11_who_knows, className: "mt-2" })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { htmlFor: "jeremiah_29_11_plans", value: __("RMD_JEREMIAH_PLANS") }),
                  /* @__PURE__ */ jsx(
                    TextArea,
                    {
                      id: "jeremiah_29_11_plans",
                      value: data.jeremiah_29_11_plans,
                      onChange: (e) => setData("jeremiah_29_11_plans", e.target.value)
                    }
                  ),
                  /* @__PURE__ */ jsx(InputError, { message: errors.jeremiah_29_11_plans, className: "mt-2" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-4 pt-3 border-t border-indigo-100 dark:border-gray-600", children: /* @__PURE__ */ jsx("button", { type: "submit", disabled: processing, className: "px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50", children: processing ? __("RMD_SAVING") : __("RMD_SAVE_ANSWER_BUTTON") }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-indigo-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm", children: [
              /* @__PURE__ */ jsx(VerseHeading, { label: __("RMD_EPHESIANS_2_10"), verseKey: "ephesians", onOpen: setActiveVerse }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { htmlFor: "ephesians_2_10_made_by", value: __("RMD_EPHESIANS_MADE_BY") }),
                  /* @__PURE__ */ jsx(
                    TextArea,
                    {
                      id: "ephesians_2_10_made_by",
                      value: data.ephesians_2_10_made_by,
                      onChange: (e) => setData("ephesians_2_10_made_by", e.target.value)
                    }
                  ),
                  /* @__PURE__ */ jsx(InputError, { message: errors.ephesians_2_10_made_by, className: "mt-2" })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { htmlFor: "ephesians_2_10_purpose", value: __("RMD_EPHESIANS_PURPOSE") }),
                  /* @__PURE__ */ jsx(
                    TextArea,
                    {
                      id: "ephesians_2_10_purpose",
                      value: data.ephesians_2_10_purpose,
                      onChange: (e) => setData("ephesians_2_10_purpose", e.target.value)
                    }
                  ),
                  /* @__PURE__ */ jsx(InputError, { message: errors.ephesians_2_10_purpose, className: "mt-2" })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { htmlFor: "ephesians_2_10_god_wants", value: __("RMD_EPHESIANS_GOD_WANTS") }),
                  /* @__PURE__ */ jsx(
                    TextArea,
                    {
                      id: "ephesians_2_10_god_wants",
                      value: data.ephesians_2_10_god_wants,
                      onChange: (e) => setData("ephesians_2_10_god_wants", e.target.value)
                    }
                  ),
                  /* @__PURE__ */ jsx(InputError, { message: errors.ephesians_2_10_god_wants, className: "mt-2" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-4 pt-3 border-t border-indigo-100 dark:border-gray-600", children: /* @__PURE__ */ jsx("button", { type: "submit", disabled: processing, className: "px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50", children: processing ? __("RMD_SAVING") : __("RMD_SAVE_ANSWER_BUTTON") }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-indigo-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm", children: [
              /* @__PURE__ */ jsx(VerseHeading, { label: __("RMD_GENESIS_1_26_28"), verseKey: "genesis", onOpen: setActiveVerse }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { htmlFor: "genesis_1_26_28_image", value: __("RMD_GENESIS_IMAGE") }),
                  /* @__PURE__ */ jsx(
                    TextArea,
                    {
                      id: "genesis_1_26_28_image",
                      value: data.genesis_1_26_28_image,
                      onChange: (e) => setData("genesis_1_26_28_image", e.target.value)
                    }
                  ),
                  /* @__PURE__ */ jsx(InputError, { message: errors.genesis_1_26_28_image, className: "mt-2" })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { htmlFor: "genesis_1_26_28_purpose", value: __("RMD_GENESIS_PURPOSE") }),
                  /* @__PURE__ */ jsx(
                    TextArea,
                    {
                      id: "genesis_1_26_28_purpose",
                      value: data.genesis_1_26_28_purpose,
                      onChange: (e) => setData("genesis_1_26_28_purpose", e.target.value)
                    }
                  ),
                  /* @__PURE__ */ jsx(InputError, { message: errors.genesis_1_26_28_purpose, className: "mt-2" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-4 pt-3 border-t border-indigo-100 dark:border-gray-600", children: /* @__PURE__ */ jsx("button", { type: "submit", disabled: processing, className: "px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50", children: processing ? __("RMD_SAVING") : __("RMD_SAVE_ANSWER_BUTTON") }) })
            ] }),
            /* @__PURE__ */ jsxs("section", { className: "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-6 rounded-lg", children: [
              /* @__PURE__ */ jsx("p", { className: "mb-4 text-lg leading-relaxed text-gray-800 dark:text-gray-200", children: __("RMD_BIBLE_SAYS_SUMMARY") }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex gap-4 items-start", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-xl text-indigo-600 mt-1", children: "1." }),
                  /* @__PURE__ */ jsx(
                    TextArea,
                    {
                      id: "summary_point_1",
                      value: data.summary_point_1,
                      onChange: (e) => setData("summary_point_1", e.target.value),
                      placeholder: __("RMD_SUMMARY_POINT_1_PLACEHOLDER")
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-4 items-start", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-xl text-indigo-600 mt-1", children: "2." }),
                  /* @__PURE__ */ jsx(
                    TextArea,
                    {
                      id: "summary_point_2",
                      value: data.summary_point_2,
                      onChange: (e) => setData("summary_point_2", e.target.value),
                      placeholder: __("RMD_SUMMARY_POINT_2_PLACEHOLDER")
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600", children: /* @__PURE__ */ jsx("button", { type: "submit", disabled: processing, className: "px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50", children: processing ? __("RMD_SAVING") : __("RMD_SAVE_ANSWER_BUTTON") }) })
            ] }),
            /* @__PURE__ */ jsxs("section", { className: "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-6 rounded-lg", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { htmlFor: "favorite_verse", value: __("RMD_FAVORITE_VERSE_LABEL") }),
                  /* @__PURE__ */ jsx(
                    TextArea,
                    {
                      id: "favorite_verse",
                      value: data.favorite_verse,
                      onChange: (e) => setData("favorite_verse", e.target.value)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { htmlFor: "reason_favorite_verse", value: __("RMD_FAVORITE_VERSE_REASON_LABEL") }),
                  /* @__PURE__ */ jsx(
                    TextArea,
                    {
                      id: "reason_favorite_verse",
                      value: data.reason_favorite_verse,
                      onChange: (e) => setData("reason_favorite_verse", e.target.value)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: "mt-4 p-4 bg-white dark:bg-gray-800 rounded border border-green-300 dark:border-green-600", children: /* @__PURE__ */ jsx("p", { className: "font-bold text-center text-green-700 dark:text-green-400", children: __("RMD_SHARE_INSTRUCTION") }) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600", children: /* @__PURE__ */ jsx("button", { type: "submit", disabled: processing, className: "px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50", children: processing ? __("RMD_SAVING") : __("RMD_SAVE_ANSWER_BUTTON") }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center pt-8 border-t border-gray-200 dark:border-gray-700", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2", children: __("RMD_LEADERSHIP_TITLE") }),
              /* @__PURE__ */ jsx("div", { className: "w-24 h-1 bg-indigo-500 mx-auto rounded" })
            ] }),
            /* @__PURE__ */ jsxs("section", { className: "prose dark:prose-invert max-w-none", children: [
              /* @__PURE__ */ jsx("p", { className: "mb-4 leading-relaxed", children: __("RMD_LEADERSHIP_INTRO_1") }),
              /* @__PURE__ */ jsx("p", { className: "mb-4 leading-relaxed", children: __("RMD_LEADERSHIP_INTRO_2") }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 my-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-lg text-indigo-600", children: "1." }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: data.leadership_c1,
                        onChange: (e) => setData("leadership_c1", e.target.value),
                        placeholder: __("RMD_LEADERSHIP_C1_PLACEHOLDER"),
                        className: "flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-lg text-indigo-600", children: "2." }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: data.leadership_c2,
                        onChange: (e) => setData("leadership_c2", e.target.value),
                        placeholder: __("RMD_LEADERSHIP_C2_PLACEHOLDER"),
                        className: "flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-lg text-indigo-600", children: "3." }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: data.leadership_c3,
                        onChange: (e) => setData("leadership_c3", e.target.value),
                        placeholder: __("RMD_LEADERSHIP_C3_PLACEHOLDER"),
                        className: "flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-lg text-indigo-600", children: "4." }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: data.leadership_c4,
                        onChange: (e) => setData("leadership_c4", e.target.value),
                        placeholder: __("RMD_LEADERSHIP_C4_PLACEHOLDER"),
                        className: "flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-lg text-indigo-600", children: "5." }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: data.leadership_c5,
                        onChange: (e) => setData("leadership_c5", e.target.value),
                        placeholder: __("RMD_LEADERSHIP_C5_PLACEHOLDER"),
                        className: "flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-sm bg-gray-50 dark:bg-gray-700 p-4 rounded-lg", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("strong", { className: "text-indigo-600 dark:text-indigo-400", children: __("RMD_LEADERSHIP_C1_TITLE") }),
                    /* @__PURE__ */ jsx("p", { children: __("RMD_LEADERSHIP_C1_DESC") })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("strong", { className: "text-indigo-600 dark:text-indigo-400", children: __("RMD_LEADERSHIP_C2_TITLE") }),
                    /* @__PURE__ */ jsx("p", { children: __("RMD_LEADERSHIP_C2_DESC") })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("strong", { className: "text-indigo-600 dark:text-indigo-400", children: __("RMD_LEADERSHIP_C3_TITLE") }),
                    /* @__PURE__ */ jsx("p", { children: __("RMD_LEADERSHIP_C3_DESC") })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("strong", { className: "text-indigo-600 dark:text-indigo-400", children: __("RMD_LEADERSHIP_C4_TITLE") }),
                    /* @__PURE__ */ jsx("p", { children: __("RMD_LEADERSHIP_C4_DESC") })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("strong", { className: "text-indigo-600 dark:text-indigo-400", children: __("RMD_LEADERSHIP_C5_TITLE") }),
                    /* @__PURE__ */ jsx("p", { children: __("RMD_LEADERSHIP_C5_DESC") })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mb-4 leading-relaxed", children: __("RMD_LEADERSHIP_CLOSING_INTRO") }),
              /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600", children: /* @__PURE__ */ jsx("button", { type: "submit", disabled: processing, className: "px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50", children: processing ? __("RMD_SAVING") : __("RMD_SAVE_ANSWER_BUTTON") }) })
            ] }),
            /* @__PURE__ */ jsxs("section", { className: "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-6 rounded-lg", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold mb-4 text-blue-800 dark:text-blue-300", children: __("RMD_CHAPTER_REVIEW_TITLE") }),
              /* @__PURE__ */ jsx("p", { className: "mb-4 text-gray-700 dark:text-gray-300", children: __("RMD_CHAPTER_REVIEW_DESC") }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsx(
                  TextArea,
                  {
                    id: "chapter_learning_text",
                    value: data.chapter_learning_text,
                    onChange: (e) => setData("chapter_learning_text", e.target.value),
                    placeholder: __("RMD_CHAPTER_REVIEW_PLACEHOLDER")
                  }
                ),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: __("RMD_CHAPTER_REVIEW_IMAGE_LABEL") }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "file",
                      onChange: (e) => setData("chapter_learning_image", e.target.files[0]),
                      className: "mt-1 block w-full text-sm text-gray-500\n                                                file:mr-4 file:py-2 file:px-4\n                                                file:rounded-full file:border-0\n                                                file:text-sm file:font-semibold\n                                                file:bg-indigo-50 file:text-indigo-700\n                                                hover:file:bg-indigo-100",
                      accept: "image/*"
                    }
                  ),
                  reflection?.chapter_learning_image_path && /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-1", children: __("RMD_CHAPTER_REVIEW_IMAGE_CURRENT") }),
                    /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: `/storage/${reflection.chapter_learning_image_path}`,
                        alt: "Learning Drawing",
                        className: "max-h-48 rounded shadow-sm border border-gray-200"
                      }
                    )
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600", children: /* @__PURE__ */ jsx("button", { type: "submit", disabled: processing, className: "px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50", children: processing ? __("RMD_SAVING") : __("RMD_SAVE_ANSWER_BUTTON") }) })
            ] }),
            /* @__PURE__ */ jsxs("section", { className: "bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 p-6 rounded-lg", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold mb-4 text-purple-800 dark:text-purple-300", children: __("RMD_CLOSING_SECTION_TITLE") }),
              /* @__PURE__ */ jsx("p", { className: "mb-4 leading-relaxed text-gray-700 dark:text-gray-300", children: __("RMD_CLOSING_SECTION_TEXT_1") }),
              /* @__PURE__ */ jsx("p", { className: "mb-4 leading-relaxed text-gray-700 dark:text-gray-300 font-medium", children: __("RMD_CLOSING_SECTION_TEXT_2") }),
              /* @__PURE__ */ jsx("p", { className: "text-center font-bold text-lg text-purple-900 dark:text-purple-200 mt-6", children: __("RMD_CLOSING_SECTION_CONGRATS") })
            ] }),
            /* @__PURE__ */ jsxs("section", { className: "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 p-6 rounded-lg", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold mb-4 text-orange-800 dark:text-orange-300", children: __("RMD_GROUP_PROJECT_TITLE") }),
              /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300", children: [
                /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("span", { className: "font-semibold", children: __("RMD_GROUP_PROJECT_TASK_1") }) }),
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-semibold", children: __("RMD_GROUP_PROJECT_TASK_2_LABEL") }),
                  " ",
                  __("RMD_GROUP_PROJECT_TASK_2_DESC")
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-700", children: [
              /* @__PURE__ */ jsxs(
                Link,
                {
                  href: route("rmd.gods-purpose"),
                  className: "inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150",
                  children: [
                    "« ",
                    __("RMD_BACK_BUTTON")
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                /* @__PURE__ */ jsx(
                  Transition,
                  {
                    show: recentlySuccessful,
                    enter: "transition ease-in-out",
                    enterFrom: "opacity-0",
                    enterTo: "opacity-100",
                    leave: "transition ease-in-out",
                    leaveFrom: "opacity-100",
                    leaveTo: "opacity-0",
                    children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 self-center", children: __("RMD_SAVED_MESSAGE") })
                  }
                ),
                /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: processing ? __("RMD_SAVING") : __("RMD_SAVE_ANSWER_BUTTON") }),
                /* @__PURE__ */ jsx(Link, { href: route("rmd.true-success"), children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-500 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 ml-2", children: [
                  __("RMD_NEXT_TRUE_SUCCESS"),
                  " »"
                ] }) })
              ] })
            ] })
          ] }) }) })
        ] })
      ]
    }
  );
}
export {
  WhatTheBibleSays as default
};
