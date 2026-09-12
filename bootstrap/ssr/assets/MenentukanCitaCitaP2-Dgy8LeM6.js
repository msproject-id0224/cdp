import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { a as autoGrow } from "./autoGrow-BUc_DkMi.js";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-qz7IKsDN.js";
import { useForm, Head, Link, router } from "@inertiajs/react";
import { _ as __ } from "./lang-COBcTD8W.js";
import { P as PrimaryButton } from "./PrimaryButton-BNNL2gCI.js";
import { Transition } from "@headlessui/react";
import { C as ConfirmModal } from "./ConfirmModal-Bqr5rb3_.js";
import "./Dropdown-BgvF6zKd.js";
import "./ThemeToggle-BY9dagkZ.js";
import "./TextInput-D0qTZeQv.js";
import "axios";
import "./ProfilePhoto-B39VtFFM.js";
import "./Modal-CKHW52Ki.js";
import "./SecondaryButton-TjIrbn1G.js";
import "./DangerButton-B7to2Tbx.js";
import "./Footer-CDwTxrct.js";
import "./useTheme-CngFDcs1.js";
function MenentukanCitaCitaP2({ auth, careerExplorationP2, files }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [confirmState, setConfirmState] = useState({ show: false, title: "", message: "", onConfirm: null });
  const askConfirm = (title, message, fn) => setConfirmState({ show: true, title, message, onConfirm: fn });
  const closeConfirm = () => setConfirmState((s) => ({ ...s, show: false }));
  const defaultSwot = [
    { aspect: "S", description: "" },
    { aspect: "W", description: "" },
    { aspect: "O", description: "" },
    { aspect: "T", description: "" }
  ];
  const { data, setData, post, processing, recentlySuccessful } = useForm({
    final_career_choice: careerExplorationP2?.final_career_choice || "",
    final_career_reason: careerExplorationP2?.final_career_reason || "",
    swot_definition: careerExplorationP2?.swot_definition || "",
    swot_analysis_data: careerExplorationP2?.swot_analysis_data || defaultSwot,
    chapter4_check1: !!careerExplorationP2?.chapter4_check1,
    chapter4_check2: !!careerExplorationP2?.chapter4_check2,
    chapter4_check3: !!careerExplorationP2?.chapter4_check3,
    mentoring_notes: careerExplorationP2?.mentoring_notes || ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("rmd.career-exploration-p2.store"), {
      preserveScroll: true
    });
  };
  const updateSwot = (index, value) => {
    const updated = [...data.swot_analysis_data];
    updated[index] = { ...updated[index], description: value };
    setData("swot_analysis_data", updated);
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);
    router.post(route("rmd.files.upload"), {
      file,
      meeting_type: "career-exploration-p2"
    }, {
      forceFormData: true,
      onProgress: (progress) => {
        setUploadProgress(progress.percentage);
      },
      onSuccess: () => {
        setIsUploading(false);
        setUploadProgress(0);
      },
      onError: () => {
        setIsUploading(false);
        setUploadProgress(0);
      }
    });
  };
  const deleteFile = (fileId) => {
    askConfirm(
      __("RMD_DELETE"),
      __("RMD_DELETE_CONFIRMATION"),
      () => router.delete(route("rmd.files.delete", fileId))
    );
  };
  const swotLabels = [
    __("RMD_CH4_P2_SWOT_STRENGTH"),
    __("RMD_CH4_P2_SWOT_WEAKNESS"),
    __("RMD_CH4_P2_SWOT_OPPORTUNITY"),
    __("RMD_CH4_P2_SWOT_THREAT")
  ];
  const swotColors = [
    "bg-green-400 dark:bg-green-700",
    "bg-red-400 dark:bg-red-700",
    "bg-blue-400 dark:bg-blue-700",
    "bg-yellow-400 dark:bg-yellow-600"
  ];
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      user: auth.user,
      header: /* @__PURE__ */ jsx("h2", { className: "font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight", children: __("RMD_CH4_P2_TITLE") }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("RMD_CH4_P2_TITLE") }),
        /* @__PURE__ */ jsxs("div", { className: "py-12 bg-gray-50 dark:bg-gray-900 min-h-screen relative", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute inset-0 pointer-events-none z-0",
              style: {
                backgroundImage: "url('/images/rmd-backgrounds/latar-_11_.svg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                opacity: 0.08
              }
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 relative z-10", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-center space-y-2", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-lg font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest", children: __("RMD_CH4_P2_CHAPTER") }),
                /* @__PURE__ */ jsx("h3", { className: "text-3xl font-black text-gray-900 dark:text-white uppercase", children: __("RMD_CH4_P2_MAIN_TITLE") }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-400 italic font-medium", children: __("RMD_CH4_P2_MEETING") })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-8 text-gray-700 dark:text-gray-300 text-lg leading-relaxed", children: /* @__PURE__ */ jsx("p", { children: __("RMD_CH4_P2_OPENING_TEXT") }) })
            ] }),
            /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-8", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 space-y-6", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider", children: __("RMD_CH4_P2_FINAL_CAREER_TITLE") }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-gray-700 dark:text-gray-300 font-medium", children: __("RMD_CH4_P2_FINAL_CAREER_LABEL") }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      className: "w-full rounded-2xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 focus:border-orange-400 focus:ring-orange-400 shadow-sm text-lg font-bold",
                      value: data.final_career_choice,
                      onChange: (e) => setData("final_career_choice", e.target.value),
                      placeholder: __("RMD_CH4_P2_FINAL_CAREER_PLACEHOLDER")
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-gray-700 dark:text-gray-300 font-medium", children: __("RMD_CH4_P2_FINAL_CAREER_REASON_LABEL") }),
                  /* @__PURE__ */ jsx(
                    "textarea",
                    {
                      ref: autoGrow,
                      onInput: (e) => autoGrow(e.target),
                      className: "w-full max-w-full rounded-2xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-orange-400 focus:ring-orange-400 shadow-sm min-h-[120px]",
                      value: data.final_career_reason,
                      onChange: (e) => setData("final_career_reason", e.target.value),
                      placeholder: __("RMD_CH4_P2_FINAL_CAREER_REASON_PLACEHOLDER")
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600", children: /* @__PURE__ */ jsx("button", { type: "submit", disabled: processing, className: "px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50", children: processing ? __("RMD_SAVING") : __("RMD_SAVE_ANSWER_BUTTON") }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 space-y-6", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider", children: __("RMD_CH4_P2_SWOT_TITLE") }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-gray-700 dark:text-gray-300 font-medium", children: __("RMD_CH4_P2_SWOT_DEF_LABEL") }),
                  /* @__PURE__ */ jsx(
                    "textarea",
                    {
                      ref: autoGrow,
                      onInput: (e) => autoGrow(e.target),
                      className: "w-full max-w-full rounded-2xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-cyan-400 focus:ring-cyan-400 shadow-sm min-h-[100px]",
                      value: data.swot_definition,
                      onChange: (e) => setData("swot_definition", e.target.value),
                      placeholder: __("RMD_CH4_P2_SWOT_DEF_PLACEHOLDER")
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: "border-2 border-orange-400 dark:border-orange-700 rounded-3xl overflow-hidden shadow-lg", children: /* @__PURE__ */ jsxs("table", { className: "w-full border-collapse", children: [
                  /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-cyan-400 dark:bg-cyan-700 text-white", children: [
                    /* @__PURE__ */ jsx("th", { className: "py-4 px-6 border-r border-white/20 w-1/3 text-center font-bold", children: __("RMD_CH4_P2_SWOT_TABLE_ASPECT") }),
                    /* @__PURE__ */ jsx("th", { className: "py-4 px-6 text-center font-bold", children: __("RMD_CH4_P2_SWOT_TABLE_DESCRIPTION") })
                  ] }) }),
                  /* @__PURE__ */ jsx("tbody", { className: "divide-y-2 divide-orange-400 dark:divide-orange-700 text-gray-800 dark:text-gray-200", children: data.swot_analysis_data.map((row, index) => /* @__PURE__ */ jsxs("tr", { children: [
                    /* @__PURE__ */ jsx("td", { className: "py-6 px-6 border-r-2 border-orange-400 dark:border-orange-700 text-center bg-gray-50 dark:bg-gray-800/50", children: /* @__PURE__ */ jsx("span", { className: `inline-block px-4 py-2 rounded-full text-white font-bold text-sm ${swotColors[index]}`, children: swotLabels[index] }) }),
                    /* @__PURE__ */ jsx("td", { className: "p-2", children: /* @__PURE__ */ jsx(
                      "textarea",
                      {
                        ref: autoGrow,
                        onInput: (e) => autoGrow(e.target),
                        className: "w-full max-w-full min-h-[128px] border-none focus:ring-0 bg-transparent resize dark:text-gray-200",
                        value: row.description,
                        onChange: (e) => updateSwot(index, e.target.value),
                        placeholder: __("RMD_CH4_P2_SWOT_PLACEHOLDER")
                      }
                    ) })
                  ] }, index)) })
                ] }) }),
                /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600", children: /* @__PURE__ */ jsx("button", { type: "submit", disabled: processing, className: "px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50", children: processing ? __("RMD_SAVING") : __("RMD_SAVE_ANSWER_BUTTON") }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 space-y-6", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider", children: __("RMD_CH4_P2_CHECKLIST_TITLE") }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400", children: __("RMD_CH4_P2_CHECKLIST_DESC") }),
                /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4", children: [
                  { id: "chapter4_check1", label: __("RMD_CH4_P2_CHECK1") },
                  { id: "chapter4_check2", label: __("RMD_CH4_P2_CHECK2") },
                  { id: "chapter4_check3", label: __("RMD_CH4_P2_CHECK3") }
                ].map((item) => /* @__PURE__ */ jsxs("label", { className: "flex items-center space-x-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-900/40 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/60 transition-colors", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "checkbox",
                      className: "w-6 h-6 rounded border-2 border-orange-400 text-orange-500 focus:ring-orange-500 dark:bg-gray-700",
                      checked: data[item.id],
                      onChange: (e) => setData(item.id, e.target.checked)
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "text-gray-800 dark:text-gray-200 font-medium", children: item.label })
                ] }, item.id)) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 space-y-4", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider", children: __("RMD_CH4_P2_MENTORING_NOTES_TITLE") }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    ref: autoGrow,
                    onInput: (e) => autoGrow(e.target),
                    className: "w-full max-w-full rounded-2xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-cyan-400 focus:ring-cyan-400 shadow-sm min-h-[120px]",
                    value: data.mentoring_notes,
                    onChange: (e) => setData("mentoring_notes", e.target.value),
                    placeholder: __("RMD_CH4_P2_MENTORING_NOTES_PLACEHOLDER")
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600", children: /* @__PURE__ */ jsx("button", { type: "submit", disabled: processing, className: "px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50", children: processing ? __("RMD_SAVING") : __("RMD_SAVE_ANSWER_BUTTON") }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-4 pt-4 pb-4", children: [
                /* @__PURE__ */ jsx(
                  Transition,
                  {
                    show: recentlySuccessful,
                    enter: "transition ease-in-out",
                    enterFrom: "opacity-0",
                    leave: "transition ease-in-out",
                    leaveTo: "opacity-0",
                    children: /* @__PURE__ */ jsx("p", { className: "text-sm text-green-600 dark:text-green-400 font-bold", children: __("RMD_CH4_P2_SUCCESS_MSG") })
                  }
                ),
                /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, className: "px-12 py-4 text-lg font-bold uppercase tracking-widest bg-orange-500 hover:bg-orange-600 focus:bg-orange-600 active:bg-orange-700", children: __("RMD_CH4_P2_BTN_SAVE") })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-2xl font-black text-gray-900 dark:text-white mb-6", children: __("RMD_SUPPORTING_DOCS_TITLE") }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
                /* @__PURE__ */ jsxs("label", { className: "relative group cursor-pointer block", children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute -inset-1 bg-gradient-to-r from-cyan-400 to-orange-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" }),
                  /* @__PURE__ */ jsx("div", { className: "relative flex items-center justify-center px-6 py-4 bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl group-hover:border-cyan-400 transition-colors", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400 font-medium", children: isUploading ? `${__("RMD_UPLOADING")} ${uploadProgress}%` : __("RMD_UPLOAD_PLACEHOLDER") }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 mt-1", children: __("RMD_UPLOAD_LIMIT_10MB") })
                  ] }) }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "file",
                      className: "hidden",
                      onChange: handleFileUpload,
                      disabled: isUploading
                    }
                  )
                ] }),
                files && files.length > 0 && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6", children: files.map((file) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 overflow-hidden", children: [
                    /* @__PURE__ */ jsx("div", { className: "p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg text-cyan-600", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }),
                    /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 truncate", children: file.file_name })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "a",
                      {
                        href: route("rmd.files.download", file.id),
                        className: "p-2 text-gray-400 hover:text-cyan-500 transition-colors",
                        title: __("RMD_DOWNLOAD"),
                        children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }) })
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => deleteFile(file.id),
                        className: "p-2 text-gray-400 hover:text-red-500 transition-colors",
                        title: __("RMD_DELETE"),
                        children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) })
                      }
                    )
                  ] })
                ] }, file.id)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center py-8", children: [
              /* @__PURE__ */ jsxs(
                Link,
                {
                  href: route("rmd.career-exploration"),
                  className: "flex items-center gap-2 text-gray-500 hover:text-cyan-500 font-bold transition-colors",
                  children: [
                    /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15 19l-7-7 7-7" }) }),
                    __("RMD_CH4_P2_BTN_PREV")
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route("rmd.chapters"),
                    className: "px-8 py-3 bg-white dark:bg-gray-800 border-2 border-cyan-400 text-cyan-500 rounded-full font-bold hover:bg-cyan-50 transition-colors shadow-sm",
                    children: __("RMD_TABLE_OF_CONTENTS")
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route("rmd.preparation-dream-island"),
                    className: "flex items-center gap-2 px-8 py-3 bg-cyan-500 text-white rounded-full font-bold hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-200 dark:shadow-none",
                    children: [
                      __("RMD_CH4_P2_BTN_NEXT"),
                      /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 5l7 7-7 7" }) })
                    ]
                  }
                )
              ] })
            ] })
          ] })
        ] }),
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
            confirmLabel: __("RMD_DELETE")
          }
        )
      ]
    }
  );
}
export {
  MenentukanCitaCitaP2 as default
};
