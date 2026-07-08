import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BG6RGD2S.js";
import { useForm, Head, Link, router } from "@inertiajs/react";
import { _ as __ } from "./lang-COBcTD8W.js";
import { P as PrimaryButton } from "./PrimaryButton-BNNL2gCI.js";
import { Transition } from "@headlessui/react";
import { C as ConfirmModal } from "./ConfirmModal-Bqr5rb3_.js";
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
function TheOnlyOneMeeting3({ auth, socioEmotional, files }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [confirmState, setConfirmState] = useState({ show: false, title: "", message: "", onConfirm: null });
  const askConfirm = (title, message, fn) => setConfirmState({ show: true, title, message, onConfirm: fn });
  const closeConfirm = () => setConfirmState((s) => ({ ...s, show: false }));
  const { data, setData, post, processing, recentlySuccessful, errors } = useForm({
    learning_style_practice: socioEmotional?.learning_style_practice || "",
    learning_style_impact: socioEmotional?.learning_style_impact || "",
    birth_order_siblings: socioEmotional?.birth_order_siblings || "",
    parents_occupation: socioEmotional?.parents_occupation || "",
    home_responsibilities: socioEmotional?.home_responsibilities || "",
    family_uniqueness: socioEmotional?.family_uniqueness || "",
    extracurricular_activities: socioEmotional?.extracurricular_activities || "",
    ppa_activities: socioEmotional?.ppa_activities || "",
    hobbies: socioEmotional?.hobbies || "",
    strengths: socioEmotional?.strengths || "",
    weaknesses: socioEmotional?.weaknesses || "",
    reflection_learned: socioEmotional?.reflection_learned || "",
    reflection_improvement: socioEmotional?.reflection_improvement || "",
    height: socioEmotional?.height || "",
    weight: socioEmotional?.weight || "",
    physical_traits: socioEmotional?.physical_traits || "",
    favorite_sports: socioEmotional?.favorite_sports || "",
    sports_achievements: socioEmotional?.sports_achievements || "",
    eating_habits: socioEmotional?.eating_habits || "",
    sleeping_habits: socioEmotional?.sleeping_habits || "",
    health_issues: socioEmotional?.health_issues || "",
    physical_likes: socioEmotional?.physical_likes || "",
    physical_development_goal: socioEmotional?.physical_development_goal || "",
    spiritual_knowledge_jesus: socioEmotional?.spiritual_knowledge_jesus || "",
    spiritual_relationship_growth: socioEmotional?.spiritual_relationship_growth || "",
    spiritual_love_obedience: socioEmotional?.spiritual_love_obedience || "",
    spiritual_community: socioEmotional?.spiritual_community || "",
    spiritual_bible_study: socioEmotional?.spiritual_bible_study || "",
    spiritual_mentor: socioEmotional?.spiritual_mentor || "",
    spiritual_reflection_learned: socioEmotional?.spiritual_reflection_learned || "",
    spiritual_reflection_improvement: socioEmotional?.spiritual_reflection_improvement || "",
    chapter3_check1: !!socioEmotional?.chapter3_check1,
    chapter3_check2: !!socioEmotional?.chapter3_check2,
    chapter3_check3: !!socioEmotional?.chapter3_check3,
    chapter3_check4: !!socioEmotional?.chapter3_check4
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("rmd.the-only-one-meeting-3.store"), {
      preserveScroll: true
    });
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);
    router.post(route("rmd.files.upload"), {
      file,
      meeting_type: "the-only-one-meeting-3"
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
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      user: auth.user,
      header: /* @__PURE__ */ jsx("h2", { className: "font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight", children: __("RMD_MEETING_3_TITLE") }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("RMD_MEETING_3_TITLE") }),
        /* @__PURE__ */ jsxs("div", { className: "py-12 bg-gray-50 dark:bg-gray-900 min-h-screen relative", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute inset-0 pointer-events-none z-0",
              style: {
                backgroundImage: "url('/images/rmd-backgrounds/latar-_9_.svg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                opacity: 0.08
              }
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 relative z-10", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-cyan-400 p-8 text-center text-white", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold tracking-widest uppercase", children: __("RMD_MEETING_3_CHAPTER") }),
                /* @__PURE__ */ jsx("h1", { className: "text-4xl font-black mt-2", children: __("RMD_MEETING_3_MAIN_TITLE") }),
                /* @__PURE__ */ jsx("p", { className: "text-xl italic mt-2 opacity-90", children: __("RMD_MEETING_3_SUBTITLE") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-8 space-y-6", children: [
                /* @__PURE__ */ jsxs("section", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-2xl font-black text-gray-900 dark:text-white mb-4", children: __("RMD_OPENING_SECTION_TITLE") }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-lg", children: [
                    /* @__PURE__ */ jsx("p", { children: __("RMD_MEETING_3_INTRO_TEXT_1") }),
                    /* @__PURE__ */ jsxs("div", { className: "bg-orange-50 dark:bg-orange-900/20 p-6 rounded-2xl border-l-4 border-orange-400 italic", children: [
                      '"',
                      __("RMD_MEETING_3_REFLECTION_QUESTION_1"),
                      '"'
                    ] }),
                    /* @__PURE__ */ jsx(
                      "textarea",
                      {
                        className: "w-full rounded-2xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-cyan-500 focus:ring-cyan-500 shadow-sm min-h-[100px] resize",
                        placeholder: __("RMD_TABLE_ANSWER_PLACEHOLDER"),
                        value: data.learning_style_practice,
                        onChange: (e) => setData("learning_style_practice", e.target.value)
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "textarea",
                      {
                        className: "w-full rounded-2xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-cyan-500 focus:ring-cyan-500 shadow-sm min-h-[100px] resize",
                        placeholder: __("RMD_MEETING_3_PLACEHOLDER_IMPACT"),
                        value: data.learning_style_impact,
                        onChange: (e) => setData("learning_style_impact", e.target.value)
                      }
                    ),
                    /* @__PURE__ */ jsx("p", { children: __("RMD_MEETING_3_INTRO_TEXT_2") }),
                    /* @__PURE__ */ jsx("p", { children: __("RMD_MEETING_3_INTRO_TEXT_3") })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600", children: /* @__PURE__ */ jsx("button", { type: "submit", form: "meeting3-form", disabled: processing, className: "px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50", children: processing ? __("RMD_SAVING") : __("RMD_SAVE_ANSWER_BUTTON") }) })
                ] }),
                /* @__PURE__ */ jsx("hr", { className: "border-gray-100 dark:border-gray-700" }),
                /* @__PURE__ */ jsxs("section", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-2xl font-black text-gray-900 dark:text-white mb-4 leading-tight", children: __("RMD_PHYSICAL_ASPECT_TITLE") }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 text-lg mb-6 leading-relaxed", children: __("RMD_PHYSICAL_ASPECT_DESC") }),
                  /* @__PURE__ */ jsxs("form", { id: "meeting3-form", onSubmit: submit, className: "space-y-12", children: [
                    /* @__PURE__ */ jsx("div", { className: "border-2 border-orange-400 dark:border-orange-700 rounded-3xl overflow-hidden shadow-lg bg-white dark:bg-gray-800", children: /* @__PURE__ */ jsxs("table", { className: "w-full border-collapse", children: [
                      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-cyan-400 dark:bg-cyan-700 text-white", children: [
                        /* @__PURE__ */ jsx("th", { className: "py-4 px-4 border-r border-white/20 w-16 text-center font-bold", children: __("RMD_TABLE_NO") }),
                        /* @__PURE__ */ jsx("th", { className: "py-4 px-6 border-r border-white/20 text-center font-bold", children: __("RMD_TABLE_QUESTION") }),
                        /* @__PURE__ */ jsx("th", { className: "py-4 px-6 text-center font-bold", children: __("RMD_TABLE_ANSWER") })
                      ] }) }),
                      /* @__PURE__ */ jsx("tbody", { className: "divide-y-2 divide-orange-400 dark:divide-orange-700 text-gray-800 dark:text-gray-200", children: [
                        { no: 1, q: __("RMD_PHYSICAL_Q1"), key: "height" },
                        { no: 2, q: __("RMD_PHYSICAL_Q2"), key: "weight" },
                        { no: 3, q: __("RMD_PHYSICAL_Q3"), key: "physical_traits" },
                        { no: 4, q: __("RMD_PHYSICAL_Q4"), key: "favorite_sports" },
                        { no: 5, q: __("RMD_PHYSICAL_Q5"), key: "sports_achievements" },
                        { no: 6, q: __("RMD_PHYSICAL_Q6"), key: "eating_habits" },
                        { no: 7, q: __("RMD_PHYSICAL_Q7"), key: "sleeping_habits" },
                        { no: 8, q: __("RMD_PHYSICAL_Q8"), key: "health_issues" }
                      ].map((item) => /* @__PURE__ */ jsxs("tr", { children: [
                        /* @__PURE__ */ jsx("td", { className: "py-6 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold", children: item.no }),
                        /* @__PURE__ */ jsx("td", { className: "py-6 px-6 border-r-2 border-orange-400 dark:border-orange-700 font-medium", children: item.q }),
                        /* @__PURE__ */ jsx("td", { className: "p-2", children: /* @__PURE__ */ jsx(
                          "textarea",
                          {
                            className: "w-full min-h-[96px] border-none focus:ring-0 bg-transparent resize dark:text-gray-200",
                            value: data[item.key],
                            onChange: (e) => setData(item.key, e.target.value),
                            placeholder: __("RMD_TABLE_ANSWER_PLACEHOLDER")
                          }
                        ) })
                      ] }, item.no)) })
                    ] }) }),
                    /* @__PURE__ */ jsxs("div", { className: "mt-8 space-y-6", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 text-lg italic", children: __("RMD_REFLECTION_INSTRUCTION") }),
                      /* @__PURE__ */ jsx("div", { className: "border-2 border-orange-400 dark:border-orange-700 rounded-3xl overflow-hidden shadow-lg bg-white dark:bg-gray-800", children: /* @__PURE__ */ jsxs("table", { className: "w-full border-collapse", children: [
                        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-cyan-400 dark:bg-cyan-700 text-white", children: [
                          /* @__PURE__ */ jsx("th", { className: "py-4 px-4 border-r border-white/20 w-16 text-center font-bold", children: __("RMD_TABLE_NO") }),
                          /* @__PURE__ */ jsx("th", { className: "py-4 px-6 border-r border-white/20 text-center font-bold", children: __("RMD_PHYSICAL_ASPECT_SHORT") }),
                          /* @__PURE__ */ jsx("th", { className: "py-4 px-6 text-center font-bold", children: __("RMD_TABLE_ANSWER") })
                        ] }) }),
                        /* @__PURE__ */ jsxs("tbody", { className: "divide-y-2 divide-orange-400 dark:divide-orange-700 text-gray-800 dark:text-gray-200", children: [
                          /* @__PURE__ */ jsxs("tr", { children: [
                            /* @__PURE__ */ jsx("td", { className: "py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold", children: "1" }),
                            /* @__PURE__ */ jsx("td", { className: "py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 font-medium", children: __("RMD_PHYSICAL_REFLECT_Q1") }),
                            /* @__PURE__ */ jsx("td", { className: "p-2", children: /* @__PURE__ */ jsx(
                              "textarea",
                              {
                                className: "w-full min-h-[128px] border-none focus:ring-0 bg-transparent resize dark:text-gray-200",
                                value: data.physical_likes,
                                onChange: (e) => setData("physical_likes", e.target.value),
                                placeholder: __("RMD_TABLE_ANSWER_PLACEHOLDER")
                              }
                            ) })
                          ] }),
                          /* @__PURE__ */ jsxs("tr", { children: [
                            /* @__PURE__ */ jsx("td", { className: "py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold", children: "2" }),
                            /* @__PURE__ */ jsx("td", { className: "py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 font-medium", children: __("RMD_PHYSICAL_REFLECT_Q2") }),
                            /* @__PURE__ */ jsx("td", { className: "p-2", children: /* @__PURE__ */ jsx(
                              "textarea",
                              {
                                className: "w-full min-h-[128px] border-none focus:ring-0 bg-transparent resize dark:text-gray-200",
                                value: data.physical_development_goal,
                                onChange: (e) => setData("physical_development_goal", e.target.value),
                                placeholder: __("RMD_TABLE_ANSWER_PLACEHOLDER")
                              }
                            ) })
                          ] })
                        ] })
                      ] }) })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600", children: /* @__PURE__ */ jsx("button", { type: "submit", disabled: processing, className: "px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50", children: processing ? __("RMD_SAVING") : __("RMD_SAVE_ANSWER_BUTTON") }) }),
                    /* @__PURE__ */ jsx("hr", { className: "border-gray-100 dark:border-gray-700" }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("h4", { className: "text-2xl font-black text-gray-900 dark:text-white mb-4 leading-tight", children: __("RMD_SOCIO_ASPECT_TITLE") }),
                      /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 text-lg mb-6", children: __("RMD_SOCIO_ASPECT_DESC") }),
                      /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 text-lg mb-8 italic", children: __("RMD_SOCIO_ASPECT_INSTRUCTION") }),
                      /* @__PURE__ */ jsx("div", { className: "border-2 border-orange-400 dark:border-orange-700 rounded-3xl overflow-hidden shadow-lg bg-white dark:bg-gray-800", children: /* @__PURE__ */ jsxs("table", { className: "w-full border-collapse", children: [
                        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-cyan-400 dark:bg-cyan-700 text-white", children: [
                          /* @__PURE__ */ jsx("th", { className: "py-4 px-4 border-r border-white/20 w-16 text-center font-bold", children: __("RMD_TABLE_NO") }),
                          /* @__PURE__ */ jsx("th", { className: "py-4 px-6 border-r border-white/20 text-center font-bold", children: __("RMD_TABLE_QUESTION") }),
                          /* @__PURE__ */ jsx("th", { className: "py-4 px-6 text-center font-bold", children: __("RMD_TABLE_ANSWER") })
                        ] }) }),
                        /* @__PURE__ */ jsx("tbody", { className: "divide-y-2 divide-orange-400 dark:divide-orange-700 text-gray-800 dark:text-gray-200", children: [
                          { no: 1, q: __("RMD_SOCIO_Q1"), key: "birth_order_siblings" },
                          { no: 2, q: __("RMD_SOCIO_Q2"), key: "parents_occupation" },
                          { no: 3, q: __("RMD_SOCIO_Q3"), key: "home_responsibilities" },
                          { no: 4, q: __("RMD_SOCIO_Q4"), key: "family_uniqueness" },
                          { no: 5, q: __("RMD_SOCIO_Q5"), key: "extracurricular_activities" },
                          { no: 6, q: __("RMD_SOCIO_Q6"), key: "ppa_activities" },
                          { no: 7, q: __("RMD_SOCIO_Q7"), key: "hobbies" },
                          { no: 8, q: __("RMD_SOCIO_Q8"), key: "strengths" },
                          { no: 9, q: __("RMD_SOCIO_Q9"), key: "weaknesses" }
                        ].map((item) => /* @__PURE__ */ jsxs("tr", { children: [
                          /* @__PURE__ */ jsx("td", { className: "py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold", children: item.no }),
                          /* @__PURE__ */ jsx("td", { className: "py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 font-medium", children: item.q }),
                          /* @__PURE__ */ jsx("td", { className: "p-2", children: /* @__PURE__ */ jsx(
                            "textarea",
                            {
                              className: "w-full min-h-[128px] border-none focus:ring-0 bg-transparent resize dark:text-gray-200",
                              value: data[item.key],
                              onChange: (e) => setData(item.key, e.target.value),
                              placeholder: __("RMD_TABLE_ANSWER_PLACEHOLDER")
                            }
                          ) })
                        ] }, item.no)) })
                      ] }) })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600", children: /* @__PURE__ */ jsx("button", { type: "submit", disabled: processing, className: "px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50", children: processing ? __("RMD_SAVING") : __("RMD_SAVE_ANSWER_BUTTON") }) }),
                    /* @__PURE__ */ jsxs("div", { className: "mt-12 space-y-6", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 text-lg italic", children: __("RMD_REFLECTION_INSTRUCTION") }),
                      /* @__PURE__ */ jsx("div", { className: "border-2 border-orange-400 dark:border-orange-700 rounded-3xl overflow-hidden shadow-lg bg-white dark:bg-gray-800", children: /* @__PURE__ */ jsxs("table", { className: "w-full border-collapse", children: [
                        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-cyan-400 dark:bg-cyan-700 text-white", children: [
                          /* @__PURE__ */ jsx("th", { className: "py-4 px-4 border-r border-white/20 w-16 text-center font-bold", children: __("RMD_TABLE_NO") }),
                          /* @__PURE__ */ jsx("th", { className: "py-4 px-6 border-r border-white/20 text-center font-bold", children: __("RMD_SOCIO_ASPECT_SHORT") }),
                          /* @__PURE__ */ jsx("th", { className: "py-4 px-6 text-center font-bold", children: __("RMD_TABLE_ANSWER") })
                        ] }) }),
                        /* @__PURE__ */ jsxs("tbody", { className: "divide-y-2 divide-orange-400 dark:divide-orange-700 text-gray-800 dark:text-gray-200", children: [
                          /* @__PURE__ */ jsxs("tr", { children: [
                            /* @__PURE__ */ jsx("td", { className: "py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold", children: "1" }),
                            /* @__PURE__ */ jsx("td", { className: "py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold italic", children: __("RMD_TABLE_LEARNED_THINGS") }),
                            /* @__PURE__ */ jsx("td", { className: "p-2", children: /* @__PURE__ */ jsx(
                              "textarea",
                              {
                                className: "w-full min-h-[128px] border-none focus:ring-0 bg-transparent resize dark:text-gray-200",
                                value: data.reflection_learned,
                                onChange: (e) => setData("reflection_learned", e.target.value),
                                placeholder: __("RMD_TABLE_ANSWER_PLACEHOLDER")
                              }
                            ) })
                          ] }),
                          /* @__PURE__ */ jsxs("tr", { children: [
                            /* @__PURE__ */ jsx("td", { className: "py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold", children: "2" }),
                            /* @__PURE__ */ jsx("td", { className: "py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold italic", children: /* @__PURE__ */ jsx("span", { dangerouslySetInnerHTML: { __html: __("RMD_REFLECTION_IMPROVEMENT") } }) }),
                            /* @__PURE__ */ jsx("td", { className: "p-2", children: /* @__PURE__ */ jsx(
                              "textarea",
                              {
                                className: "w-full min-h-[128px] border-none focus:ring-0 bg-transparent resize dark:text-gray-200",
                                value: data.reflection_improvement,
                                onChange: (e) => setData("reflection_improvement", e.target.value),
                                placeholder: __("RMD_TABLE_ANSWER_PLACEHOLDER")
                              }
                            ) })
                          ] })
                        ] })
                      ] }) })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600", children: /* @__PURE__ */ jsx("button", { type: "submit", disabled: processing, className: "px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50", children: processing ? __("RMD_SAVING") : __("RMD_SAVE_ANSWER_BUTTON") }) }),
                    /* @__PURE__ */ jsx("hr", { className: "border-gray-100 dark:border-gray-700" }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("h4", { className: "text-2xl font-black text-gray-900 dark:text-white mb-4 leading-tight", children: __("RMD_SPIRITUAL_ASPECT_TITLE") }),
                      /* @__PURE__ */ jsx("div", { className: "space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-8", children: /* @__PURE__ */ jsx("p", { children: __("RMD_SPIRITUAL_ASPECT_DESC") }) }),
                      /* @__PURE__ */ jsx("div", { className: "border-2 border-orange-400 dark:border-orange-700 rounded-3xl overflow-hidden shadow-lg bg-white dark:bg-gray-800", children: /* @__PURE__ */ jsxs("table", { className: "w-full border-collapse", children: [
                        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-cyan-400 dark:bg-cyan-700 text-white", children: [
                          /* @__PURE__ */ jsx("th", { className: "py-4 px-4 border-r border-white/20 w-16 text-center font-bold", children: __("RMD_TABLE_NO") }),
                          /* @__PURE__ */ jsx("th", { className: "py-4 px-6 border-r border-white/20 text-center font-bold", children: __("RMD_TABLE_QUESTION") }),
                          /* @__PURE__ */ jsx("th", { className: "py-4 px-6 text-center font-bold", children: __("RMD_TABLE_ANSWER") })
                        ] }) }),
                        /* @__PURE__ */ jsxs("tbody", { className: "divide-y-2 divide-orange-400 dark:divide-orange-700 text-gray-800 dark:text-gray-200", children: [
                          /* @__PURE__ */ jsxs("tr", { children: [
                            /* @__PURE__ */ jsx("td", { className: "py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold", children: "1" }),
                            /* @__PURE__ */ jsx("td", { className: "py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 font-medium", children: __("RMD_SPIRITUAL_Q1") }),
                            /* @__PURE__ */ jsx("td", { className: "p-2", children: /* @__PURE__ */ jsx(
                              "textarea",
                              {
                                className: "w-full min-h-[128px] border-none focus:ring-0 bg-transparent resize dark:text-gray-200",
                                value: data.spiritual_knowledge_jesus,
                                onChange: (e) => setData("spiritual_knowledge_jesus", e.target.value),
                                placeholder: __("RMD_TABLE_ANSWER_PLACEHOLDER")
                              }
                            ) })
                          ] }),
                          /* @__PURE__ */ jsxs("tr", { children: [
                            /* @__PURE__ */ jsx("td", { className: "py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold", children: "2" }),
                            /* @__PURE__ */ jsx("td", { className: "py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 font-medium", children: __("RMD_SPIRITUAL_Q2") }),
                            /* @__PURE__ */ jsx("td", { className: "p-2", children: /* @__PURE__ */ jsx(
                              "textarea",
                              {
                                className: "w-full min-h-[128px] border-none focus:ring-0 bg-transparent resize dark:text-gray-200",
                                value: data.spiritual_relationship_growth,
                                onChange: (e) => setData("spiritual_relationship_growth", e.target.value),
                                placeholder: __("RMD_TABLE_ANSWER_PLACEHOLDER")
                              }
                            ) })
                          ] }),
                          /* @__PURE__ */ jsxs("tr", { children: [
                            /* @__PURE__ */ jsx("td", { className: "py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold", children: "3" }),
                            /* @__PURE__ */ jsx("td", { className: "py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 font-medium", children: __("RMD_SPIRITUAL_Q3") }),
                            /* @__PURE__ */ jsx("td", { className: "p-2", children: /* @__PURE__ */ jsx(
                              "textarea",
                              {
                                className: "w-full min-h-[128px] border-none focus:ring-0 bg-transparent resize dark:text-gray-200",
                                value: data.spiritual_love_obedience,
                                onChange: (e) => setData("spiritual_love_obedience", e.target.value),
                                placeholder: __("RMD_TABLE_ANSWER_PLACEHOLDER")
                              }
                            ) })
                          ] }),
                          /* @__PURE__ */ jsxs("tr", { children: [
                            /* @__PURE__ */ jsx("td", { className: "py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold", children: "4" }),
                            /* @__PURE__ */ jsx("td", { className: "py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 font-medium", children: __("RMD_SPIRITUAL_Q4") }),
                            /* @__PURE__ */ jsx("td", { className: "p-2", children: /* @__PURE__ */ jsx(
                              "textarea",
                              {
                                className: "w-full min-h-[128px] border-none focus:ring-0 bg-transparent resize dark:text-gray-200",
                                value: data.spiritual_community,
                                onChange: (e) => setData("spiritual_community", e.target.value),
                                placeholder: __("RMD_TABLE_ANSWER_PLACEHOLDER")
                              }
                            ) })
                          ] }),
                          /* @__PURE__ */ jsxs("tr", { children: [
                            /* @__PURE__ */ jsx("td", { className: "py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold", children: "5" }),
                            /* @__PURE__ */ jsx("td", { className: "py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 font-medium", children: __("RMD_SPIRITUAL_Q5") }),
                            /* @__PURE__ */ jsx("td", { className: "p-2", children: /* @__PURE__ */ jsx(
                              "textarea",
                              {
                                className: "w-full min-h-[128px] border-none focus:ring-0 bg-transparent resize dark:text-gray-200",
                                value: data.spiritual_bible_study,
                                onChange: (e) => setData("spiritual_bible_study", e.target.value),
                                placeholder: __("RMD_TABLE_ANSWER_PLACEHOLDER")
                              }
                            ) })
                          ] }),
                          /* @__PURE__ */ jsxs("tr", { children: [
                            /* @__PURE__ */ jsx("td", { className: "py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold", children: "6" }),
                            /* @__PURE__ */ jsx("td", { className: "py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 font-medium", children: __("RMD_SPIRITUAL_Q6") }),
                            /* @__PURE__ */ jsx("td", { className: "p-2", children: /* @__PURE__ */ jsx(
                              "textarea",
                              {
                                className: "w-full min-h-[128px] border-none focus:ring-0 bg-transparent resize dark:text-gray-200",
                                value: data.spiritual_mentor,
                                onChange: (e) => setData("spiritual_mentor", e.target.value),
                                placeholder: __("RMD_TABLE_ANSWER_PLACEHOLDER")
                              }
                            ) })
                          ] })
                        ] })
                      ] }) }),
                      /* @__PURE__ */ jsxs("div", { className: "mt-8 space-y-6", children: [
                        /* @__PURE__ */ jsxs("div", { className: "bg-cyan-50 dark:bg-cyan-900/20 p-8 rounded-3xl border-l-8 border-cyan-400", children: [
                          /* @__PURE__ */ jsx("h5", { className: "text-xl font-black text-cyan-700 dark:text-cyan-300 mb-4 uppercase tracking-wider", children: __("RMD_IMPORTANT_NOTICE_TITLE") }),
                          /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-gray-700 dark:text-gray-300 text-lg leading-relaxed", children: [
                            /* @__PURE__ */ jsx("p", { children: __("RMD_IMPORTANT_NOTICE_DESC_1") }),
                            /* @__PURE__ */ jsx("p", { className: "italic font-medium", children: __("RMD_IMPORTANT_NOTICE_DESC_2") })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsx("div", { className: "border-2 border-orange-400 dark:border-orange-700 rounded-3xl overflow-hidden shadow-lg bg-white dark:bg-gray-800", children: /* @__PURE__ */ jsxs("table", { className: "w-full border-collapse", children: [
                          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-cyan-400 dark:bg-cyan-700 text-white", children: [
                            /* @__PURE__ */ jsx("th", { className: "py-4 px-4 border-r border-white/20 w-16 text-center font-bold", children: __("RMD_TABLE_NO") }),
                            /* @__PURE__ */ jsx("th", { className: "py-4 px-6 border-r border-white/20 text-center font-bold", children: __("RMD_SPIRITUAL_ASPECT_SHORT") }),
                            /* @__PURE__ */ jsx("th", { className: "py-4 px-6 text-center font-bold", children: __("RMD_TABLE_ANSWER") })
                          ] }) }),
                          /* @__PURE__ */ jsxs("tbody", { className: "divide-y-2 divide-orange-400 dark:divide-orange-700 text-gray-800 dark:text-gray-200", children: [
                            /* @__PURE__ */ jsxs("tr", { children: [
                              /* @__PURE__ */ jsx("td", { className: "py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold", children: "1" }),
                              /* @__PURE__ */ jsx("td", { className: "py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 font-medium", children: __("RMD_REFLECTION_LEARNED") }),
                              /* @__PURE__ */ jsx("td", { className: "p-2", children: /* @__PURE__ */ jsx(
                                "textarea",
                                {
                                  className: "w-full min-h-[128px] border-none focus:ring-0 bg-transparent resize dark:text-gray-200",
                                  value: data.spiritual_reflection_learned,
                                  onChange: (e) => setData("spiritual_reflection_learned", e.target.value),
                                  placeholder: __("RMD_TABLE_ANSWER_PLACEHOLDER")
                                }
                              ) })
                            ] }),
                            /* @__PURE__ */ jsxs("tr", { children: [
                              /* @__PURE__ */ jsx("td", { className: "py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold", children: "2" }),
                              /* @__PURE__ */ jsx("td", { className: "py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 font-medium", children: /* @__PURE__ */ jsx("span", { dangerouslySetInnerHTML: { __html: __("RMD_REFLECTION_IMPROVEMENT") } }) }),
                              /* @__PURE__ */ jsx("td", { className: "p-2", children: /* @__PURE__ */ jsx(
                                "textarea",
                                {
                                  className: "w-full min-h-[128px] border-none focus:ring-0 bg-transparent resize dark:text-gray-200",
                                  value: data.spiritual_reflection_improvement,
                                  onChange: (e) => setData("spiritual_reflection_improvement", e.target.value),
                                  placeholder: __("RMD_TABLE_ANSWER_PLACEHOLDER")
                                }
                              ) })
                            ] })
                          ] })
                        ] }) })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "mt-12 space-y-8", children: [
                        /* @__PURE__ */ jsxs("div", { className: "bg-orange-50 dark:bg-orange-900/20 p-8 rounded-3xl border-2 border-orange-400 dark:border-orange-700 space-y-6", children: [
                          /* @__PURE__ */ jsx("h5", { className: "text-2xl font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest", children: __("RMD_CLOSING_TITLE") }),
                          /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-gray-700 dark:text-gray-300 text-lg leading-relaxed", children: [
                            /* @__PURE__ */ jsx("p", { children: __("RMD_CLOSING_DESC_1") }),
                            /* @__PURE__ */ jsx("p", { children: __("RMD_CLOSING_DESC_2") }),
                            /* @__PURE__ */ jsx("p", { className: "font-bold text-orange-600 dark:text-orange-400 italic", children: __("RMD_CLOSING_DESC_3") })
                          ] }),
                          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 mt-6", children: [
                            { id: "chapter3_check1", label: __("RMD_CLOSING_CHECKLIST_1") },
                            { id: "chapter3_check2", label: __("RMD_CLOSING_CHECKLIST_2") },
                            { id: "chapter3_check3", label: __("RMD_CLOSING_CHECKLIST_3") },
                            { id: "chapter3_check4", label: __("RMD_CLOSING_CHECKLIST_4") }
                          ].map((item) => /* @__PURE__ */ jsxs("label", { className: "flex items-start space-x-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-orange-200 dark:border-orange-900 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors", children: [
                            /* @__PURE__ */ jsx("div", { className: "relative flex items-center", children: /* @__PURE__ */ jsx(
                              "input",
                              {
                                type: "checkbox",
                                className: "w-6 h-6 rounded border-2 border-orange-400 text-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-orange-700",
                                checked: data[item.id],
                                onChange: (e) => setData(item.id, e.target.checked)
                              }
                            ) }),
                            /* @__PURE__ */ jsx("span", { className: "text-gray-700 dark:text-gray-300 font-medium", children: item.label })
                          ] }, item.id)) }),
                          /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600", children: /* @__PURE__ */ jsx("button", { type: "submit", disabled: processing, className: "px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50", children: processing ? __("RMD_SAVING") : __("RMD_SAVE_ANSWER_BUTTON") }) })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "bg-cyan-50 dark:bg-cyan-900/20 p-8 rounded-3xl border-2 border-cyan-400 dark:border-cyan-700 space-y-6", children: [
                          /* @__PURE__ */ jsx("h5", { className: "text-2xl font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest", children: __("RMD_GROUP_PROJECT_TITLE") }),
                          /* @__PURE__ */ jsxs("ul", { className: "space-y-4 text-gray-700 dark:text-gray-300 text-lg list-disc pl-6", children: [
                            /* @__PURE__ */ jsx("li", { children: __("RMD_GROUP_PROJECT_ITEM_1") }),
                            /* @__PURE__ */ jsx("li", { children: __("RMD_GROUP_PROJECT_ITEM_2") })
                          ] })
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-4 mt-8", children: [
                      /* @__PURE__ */ jsx(
                        Transition,
                        {
                          show: recentlySuccessful,
                          enter: "transition ease-in-out",
                          enterFrom: "opacity-0",
                          leave: "transition ease-in-out",
                          leaveTo: "opacity-0",
                          children: /* @__PURE__ */ jsx("p", { className: "text-sm text-green-600 dark:text-green-400 font-medium", children: __("RMD_SAVED_SUCCESS") })
                        }
                      ),
                      /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, className: "bg-orange-500 hover:bg-orange-600 focus:bg-orange-600 active:bg-orange-700", children: __("RMD_SAVE_PROGRESS_CHAPTER_3") })
                    ] })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-2xl font-black text-gray-900 dark:text-white mb-6", children: __("RMD_SUPPORTING_DOCS_TITLE") }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
                /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxs("label", { className: "relative group cursor-pointer block", children: [
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
                ] }) }) }),
                files && files.length > 0 && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6", children: files.map((file) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 overflow-hidden", children: [
                    /* @__PURE__ */ jsx("div", { className: "p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg text-cyan-600", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "C9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }),
                    /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 truncate", children: file.file_name })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "a",
                      {
                        href: route("rmd.files.download", file.id),
                        className: "p-2 text-gray-400 hover:text-cyan-500 transition-colors",
                        title: __("RMD_DOWNLOAD"),
                        children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "C4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }) })
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
                  href: route("rmd.the-only-one-meeting-2"),
                  className: "flex items-center gap-2 text-gray-500 hover:text-cyan-500 font-bold transition-colors",
                  children: [
                    /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15 19l-7-7 7-7" }) }),
                    __("RMD_PREVIOUS_MEETING")
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
                    href: route("rmd.career-exploration"),
                    className: "flex items-center gap-2 px-8 py-3 bg-cyan-500 text-white rounded-full font-bold hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-200 dark:shadow-none",
                    children: [
                      __("RMD_CAREER_EXPLORATION_TITLE"),
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
            confirmLabel: __("RMD_DELETE"),
            danger: true
          }
        )
      ]
    }
  );
}
export {
  TheOnlyOneMeeting3 as default
};
