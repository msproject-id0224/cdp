import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BG6RGD2S.js";
import { usePage, useForm, Head, Link } from "@inertiajs/react";
import { I as InputLabel } from "./InputLabel-DDs2XNYP.js";
import { T as TextInput } from "./TextInput-D0qTZeQv.js";
import { S as SelectInput } from "./SelectInput-inadq0Bq.js";
import { P as PrimaryButton } from "./PrimaryButton-BNNL2gCI.js";
import { S as SecondaryButton } from "./SecondaryButton-TjIrbn1G.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { M as Modal } from "./Modal-CKHW52Ki.js";
import { P as ProfilePhoto } from "./ProfilePhoto-CJ2Z04pO.js";
import { _ as __ } from "./lang-COBcTD8W.js";
import { useState } from "react";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "./ThemeToggle-BY9dagkZ.js";
import "axios";
import "./DangerButton-B7to2Tbx.js";
import "./Footer-B7ihPSZ8.js";
import "./useTheme-CngFDcs1.js";
const MODULE_CONFIG = [
  { name: "Profil RMD", route: "rmd.profile", icon: "📋", desc: "Data pribadi & tanggal rencana lulus" },
  { name: "Refleksi Alkitab", route: "rmd.what-the-bible-says", icon: "📖", desc: "Refleksi firman Tuhan tentang rencana-Nya" },
  { name: "Sukses Sejati", route: "rmd.true-success", icon: "🏆", desc: "Definisi & ukuran sukses menurut Alkitab" },
  { name: "The Only One", route: "rmd.the-only-one", icon: "⭐", desc: "Keunikan diri, gaya belajar & prestasi akademik" },
  { name: "Kecerdasan Majemuk", route: "rmd.the-only-one-meeting-2", icon: "🧠", desc: "Skor kecerdasan majemuk (9 kecerdasan)" },
  { name: "Sosial Emosional", route: "rmd.the-only-one-meeting-3", icon: "💬", desc: "Keluarga, aktivitas, fisik & spiritual" },
  { name: "Eksplorasi Karir", route: "rmd.career-exploration", icon: "🎯", desc: "Profesi berdasarkan bakat & kecerdasan" },
  { name: "Eksplorasi Karir P2", route: "rmd.career-exploration-p2", icon: "🏁", desc: "Pilihan karir final & analisis SWOT" },
  { name: "Persiapan Pulau Impian", route: "rmd.preparation-dream-island", icon: "🏝️", desc: "Pertanyaan profesi, SWOT & rencana perbaikan" }
];
function RmdProfile({ auth, rmdProfile, graduationPlanDate, rmdProgress, isFirstFill }) {
  const user = auth.user;
  usePage();
  const [isEditing, setIsEditing] = useState(false);
  const [modalState, setModalState] = useState({
    show: false,
    type: "success",
    // 'success' or 'error'
    title: "",
    message: ""
  });
  const { data, setData, post, processing, errors, reset } = useForm({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    phone_number: user.phone_number || "",
    address: user.address || "",
    date_of_birth: user.date_of_birth ? user.date_of_birth.split("T")[0] : user.age ? new Date((/* @__PURE__ */ new Date()).setFullYear((/* @__PURE__ */ new Date()).getFullYear() - user.age)).toISOString().split("T")[0] : "",
    gender: user.gender || "",
    profile_photo: null,
    first_filled_at: rmdProfile?.first_filled_at ? String(rmdProfile.first_filled_at).split("T")[0] : (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    first_filled_age: rmdProfile?.first_filled_age || user.age || "",
    first_filled_education: rmdProfile?.first_filled_education || user.education || "",
    first_filled_education_institution: rmdProfile?.first_filled_education_institution || ""
  });
  const [photoPreview, setPhotoPreview] = useState(user.profile_photo_url);
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setData("profile_photo", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("rmd.profile.store"), {
      forceFormData: true,
      onSuccess: () => {
        setIsEditing(false);
        setModalState({
          show: true,
          type: "success",
          title: __("RMD_PROFILE_SUCCESS_TITLE"),
          message: __("RMD_PROFILE_SUCCESS_MSG")
        });
      },
      onError: () => {
        setModalState({
          show: true,
          type: "error",
          title: __("RMD_PROFILE_ERROR_TITLE"),
          message: __("RMD_PROFILE_ERROR_MSG")
        });
      }
    });
  };
  const closeModal = () => {
    setModalState((prev) => ({ ...prev, show: false }));
  };
  const cancelEdit = () => {
    reset();
    setPhotoPreview(user.profile_photo_url);
    setIsEditing(false);
  };
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };
  const dynamicGraduationDate = data.date_of_birth ? new Date(
    new Date(data.date_of_birth).setFullYear(
      new Date(data.date_of_birth).getFullYear() + 21
    )
  ) : graduationPlanDate ? new Date(graduationPlanDate) : null;
  const InfoRow = ({ label, value }) => /* @__PURE__ */ jsxs("div", { className: "py-2 border-b border-gray-100 dark:border-gray-700 last:border-0", children: [
    /* @__PURE__ */ jsx("dt", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: label }),
    /* @__PURE__ */ jsx("dd", { className: "mt-1 text-sm text-gray-900 dark:text-gray-100 font-semibold", children: value || "-" })
  ] });
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      user,
      header: /* @__PURE__ */ jsx("h2", { className: "font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight", children: __("RMD_PROFILE_TITLE") }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("RMD_PROFILE_TITLE") }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "p-6 text-gray-900 dark:text-gray-100", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-900 dark:text-white", children: __("RMD_PROFILE_TITLE").toUpperCase() }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600 dark:text-gray-400 max-w-xl", children: __("RMD_PROFILE_SUBTITLE") })
            ] }),
            !isEditing && /* @__PURE__ */ jsxs(
              PrimaryButton,
              {
                onClick: () => setIsEditing(true),
                children: [
                  /* @__PURE__ */ jsx(
                    "svg",
                    {
                      xmlns: "http://www.w3.org/2000/svg",
                      className: "h-4 w-4 mr-2",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      children: /* @__PURE__ */ jsx(
                        "path",
                        {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeWidth: 2,
                          d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        }
                      )
                    }
                  ),
                  __("RMD_PROFILE_EDIT")
                ]
              }
            )
          ] }),
          isEditing ? /* @__PURE__ */ jsxs(
            "form",
            {
              onSubmit: submit,
              className: "space-y-6 animate-fade-in-up",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg", children: [
                  /* @__PURE__ */ jsxs("div", { className: "relative w-32 h-32 mb-4 group", children: [
                    /* @__PURE__ */ jsx(
                      ProfilePhoto,
                      {
                        src: photoPreview,
                        alt: __("RMD_PROFILE_TITLE"),
                        className: "w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-600 shadow-lg",
                        fallbackClassName: "w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 text-4xl font-bold border-4 border-white dark:border-gray-600 shadow-lg",
                        fallback: (user.name || "U").charAt(0).toUpperCase()
                      },
                      photoPreview
                    ),
                    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200", children: /* @__PURE__ */ jsxs(
                      "svg",
                      {
                        xmlns: "http://www.w3.org/2000/svg",
                        className: "h-8 w-8 text-white",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: [
                          /* @__PURE__ */ jsx(
                            "path",
                            {
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              strokeWidth: 2,
                              d: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "path",
                            {
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              strokeWidth: 2,
                              d: "M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            }
                          )
                        ]
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "label",
                    {
                      htmlFor: "profile_photo",
                      className: "cursor-pointer text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium text-sm",
                      children: __("RMD_PROFILE_CHANGE_PHOTO")
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "file",
                      id: "profile_photo",
                      onChange: handlePhotoChange,
                      className: "hidden",
                      accept: "image/*"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    InputError,
                    {
                      message: errors.profile_photo,
                      className: "mt-2"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx(
                      InputLabel,
                      {
                        htmlFor: "first_name",
                        value: __(
                          "RMD_PROFILE_FIRST_NAME"
                        )
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      TextInput,
                      {
                        id: "first_name",
                        value: data.first_name,
                        onChange: (e) => setData(
                          "first_name",
                          e.target.value
                        ),
                        className: "mt-1 block w-full",
                        required: true
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      InputError,
                      {
                        message: errors.first_name,
                        className: "mt-2"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx(
                      InputLabel,
                      {
                        htmlFor: "last_name",
                        value: __(
                          "RMD_PROFILE_LAST_NAME"
                        )
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      TextInput,
                      {
                        id: "last_name",
                        value: data.last_name,
                        onChange: (e) => setData(
                          "last_name",
                          e.target.value
                        ),
                        className: "mt-1 block w-full"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      InputError,
                      {
                        message: errors.last_name,
                        className: "mt-2"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(
                    InputLabel,
                    {
                      htmlFor: "email",
                      value: __("RMD_PROFILE_EMAIL")
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    TextInput,
                    {
                      id: "email",
                      type: "email",
                      value: data.email,
                      className: "mt-1 block w-full bg-gray-100 cursor-not-allowed",
                      readOnly: true,
                      disabled: true
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: __("RMD_PROFILE_EMAIL_LOCKED") })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(
                    InputLabel,
                    {
                      htmlFor: "phone_number",
                      value: __("RMD_PROFILE_PHONE")
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    TextInput,
                    {
                      id: "phone_number",
                      value: data.phone_number,
                      onChange: (e) => setData(
                        "phone_number",
                        e.target.value
                      ),
                      className: "mt-1 block w-full"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    InputError,
                    {
                      message: errors.phone_number,
                      className: "mt-2"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(
                    InputLabel,
                    {
                      htmlFor: "address",
                      value: __("RMD_PROFILE_ADDRESS")
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    TextInput,
                    {
                      id: "address",
                      value: data.address,
                      onChange: (e) => setData(
                        "address",
                        e.target.value
                      ),
                      className: "mt-1 block w-full"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    InputError,
                    {
                      message: errors.address,
                      className: "mt-2"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx(
                      InputLabel,
                      {
                        htmlFor: "date_of_birth",
                        value: __("RMD_PROFILE_DOB")
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      TextInput,
                      {
                        id: "date_of_birth",
                        type: "date",
                        value: data.date_of_birth,
                        className: "mt-1 block w-full bg-gray-100 cursor-not-allowed",
                        readOnly: true,
                        disabled: true
                      }
                    ),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: __("RMD_PROFILE_DOB_LOCKED") })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx(
                      InputLabel,
                      {
                        htmlFor: "gender",
                        value: __("RMD_PROFILE_GENDER")
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      SelectInput,
                      {
                        id: "gender",
                        value: data.gender,
                        onChange: (e) => setData(
                          "gender",
                          e.target.value
                        ),
                        className: "mt-1 block w-full",
                        children: [
                          /* @__PURE__ */ jsx("option", { value: "", children: __(
                            "RMD_PROFILE_SELECT_GENDER"
                          ) }),
                          /* @__PURE__ */ jsx("option", { value: "Male", children: __("RMD_PROFILE_MALE") }),
                          /* @__PURE__ */ jsx("option", { value: "Female", children: __("RMD_PROFILE_FEMALE") })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      InputError,
                      {
                        message: errors.gender,
                        className: "mt-2"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-100 dark:border-blue-800", children: [
                  /* @__PURE__ */ jsx(
                    InputLabel,
                    {
                      value: __(
                        "RMD_PROFILE_GRADUATION_DATE"
                      ),
                      className: "text-blue-800 dark:text-blue-300"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "mt-1 text-lg font-bold text-blue-900 dark:text-blue-200", children: dynamicGraduationDate ? formatDate(
                    dynamicGraduationDate.toISOString()
                  ) : "-" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-blue-600 dark:text-blue-400", children: __("RMD_PROFILE_AUTO_CALC") })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-200 dark:border-gray-700 pt-6", children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-semibold text-lg text-gray-800 dark:text-gray-200 mb-4", children: __("RMD_PROFILE_INITIAL_ENTRY") }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx(InputLabel, { htmlFor: "first_filled_at", value: __("RMD_PROFILE_ENTRY_DATE") }),
                      /* @__PURE__ */ jsx(
                        TextInput,
                        {
                          id: "first_filled_at",
                          type: "date",
                          value: data.first_filled_at,
                          onChange: (e) => isFirstFill && setData("first_filled_at", e.target.value),
                          className: `mt-1 block w-full ${!isFirstFill ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed" : ""}`,
                          readOnly: !isFirstFill,
                          disabled: !isFirstFill
                        }
                      ),
                      !isFirstFill && /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1", children: [
                        /* @__PURE__ */ jsx("svg", { className: "w-3 h-3 shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }),
                        __("Tidak dapat diubah")
                      ] }),
                      /* @__PURE__ */ jsx(InputError, { message: errors.first_filled_at, className: "mt-2" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx(InputLabel, { htmlFor: "first_filled_age", value: __("RMD_PROFILE_AGE") }),
                      /* @__PURE__ */ jsx(
                        TextInput,
                        {
                          id: "first_filled_age",
                          type: "number",
                          value: data.first_filled_age,
                          onChange: (e) => setData("first_filled_age", e.target.value),
                          className: "mt-1 block w-full"
                        }
                      ),
                      /* @__PURE__ */ jsx(InputError, { message: errors.first_filled_age, className: "mt-2" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx(InputLabel, { htmlFor: "first_filled_education", value: __("RMD_PROFILE_EDUCATION") }),
                      /* @__PURE__ */ jsxs(
                        SelectInput,
                        {
                          id: "first_filled_education",
                          value: data.first_filled_education,
                          onChange: (e) => setData("first_filled_education", e.target.value),
                          className: "mt-1 block w-full",
                          children: [
                            /* @__PURE__ */ jsx("option", { value: "", children: __("RMD_PROFILE_SELECT_EDUCATION") }),
                            /* @__PURE__ */ jsx("option", { value: "SD", children: "SD" }),
                            /* @__PURE__ */ jsx("option", { value: "SMP", children: "SMP" }),
                            /* @__PURE__ */ jsx("option", { value: "SMA", children: "SMA / SMK" }),
                            /* @__PURE__ */ jsx("option", { value: "D1", children: "D1" }),
                            /* @__PURE__ */ jsx("option", { value: "D2", children: "D2" }),
                            /* @__PURE__ */ jsx("option", { value: "D3", children: "D3" }),
                            /* @__PURE__ */ jsx("option", { value: "S1", children: "S1 / D4" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsx(InputError, { message: errors.first_filled_education, className: "mt-2" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
                    /* @__PURE__ */ jsx(InputLabel, { htmlFor: "first_filled_education_institution", value: __("RMD_PROFILE_EDU_INSTITUTION") }),
                    /* @__PURE__ */ jsx(
                      TextInput,
                      {
                        id: "first_filled_education_institution",
                        value: data.first_filled_education_institution,
                        onChange: (e) => setData("first_filled_education_institution", e.target.value),
                        className: "mt-1 block w-full",
                        placeholder: __("Contoh: Unsrat, Unima / Politeknik Negeri Manado / dll")
                      }
                    ),
                    /* @__PURE__ */ jsx(InputError, { message: errors.first_filled_education_institution, className: "mt-2" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700", children: [
                  /* @__PURE__ */ jsx(
                    SecondaryButton,
                    {
                      onClick: cancelEdit,
                      disabled: processing,
                      children: __("RMD_PROFILE_CANCEL")
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    PrimaryButton,
                    {
                      disabled: processing,
                      className: processing ? "opacity-75 cursor-wait" : "",
                      children: [
                        processing && /* @__PURE__ */ jsxs(
                          "svg",
                          {
                            className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white",
                            xmlns: "http://www.w3.org/2000/svg",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            children: [
                              /* @__PURE__ */ jsx(
                                "circle",
                                {
                                  className: "opacity-25",
                                  cx: "12",
                                  cy: "12",
                                  r: "10",
                                  stroke: "currentColor",
                                  strokeWidth: "4"
                                }
                              ),
                              /* @__PURE__ */ jsx(
                                "path",
                                {
                                  className: "opacity-75",
                                  fill: "currentColor",
                                  d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                }
                              )
                            ]
                          }
                        ),
                        __("RMD_PROFILE_SAVE")
                      ]
                    }
                  )
                ] })
              ]
            }
          ) : /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-fade-in-up", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center md:items-start md:space-x-8 pb-8 border-b border-gray-100 dark:border-gray-700", children: [
              /* @__PURE__ */ jsx("div", { className: "relative w-32 h-32 mb-4 md:mb-0", children: /* @__PURE__ */ jsx(
                ProfilePhoto,
                {
                  src: user.profile_photo_url,
                  alt: user.name,
                  className: "w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-600 shadow-lg",
                  fallbackClassName: "w-full h-full rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-500 dark:text-indigo-300 flex items-center justify-center text-4xl font-bold border-4 border-white dark:border-gray-600 shadow-lg",
                  fallback: (user.name || "U").charAt(0).toUpperCase()
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "text-center md:text-left flex-1", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: user.name }),
                /* @__PURE__ */ jsx("p", { className: "text-indigo-600 dark:text-indigo-400 font-medium mb-2", children: user.email }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center md:justify-start gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium", children: user.gender || "-" }),
                  /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium", children: user.age ? `${user.age} ${__(
                    "Years Old"
                  )}` : "-" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h5", { className: "text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 border-b pb-2", children: __("Personal Information") }),
                /* @__PURE__ */ jsxs("dl", { children: [
                  /* @__PURE__ */ jsx(
                    InfoRow,
                    {
                      label: __(
                        "RMD_PROFILE_FIRST_NAME"
                      ),
                      value: user.first_name
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    InfoRow,
                    {
                      label: __(
                        "RMD_PROFILE_LAST_NAME"
                      ),
                      value: user.last_name
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    InfoRow,
                    {
                      label: __(
                        "RMD_PROFILE_PHONE"
                      ),
                      value: user.phone_number
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    InfoRow,
                    {
                      label: __(
                        "RMD_PROFILE_ADDRESS"
                      ),
                      value: user.address
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    InfoRow,
                    {
                      label: __(
                        "RMD_PROFILE_DOB"
                      ),
                      value: formatDate(
                        user.date_of_birth
                      )
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4 border-b pb-2", children: [
                  /* @__PURE__ */ jsx("h5", { className: "text-lg font-semibold text-gray-800 dark:text-gray-200", children: __("RMD_PROFILE_INITIAL_ENTRY") }),
                  rmdProfile?.first_filled_at && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300", children: [
                    /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }),
                    __("Terkunci")
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("dl", { children: [
                  /* @__PURE__ */ jsx(
                    InfoRow,
                    {
                      label: __("RMD_PROFILE_ENTRY_DATE"),
                      value: formatDate(rmdProfile?.first_filled_at)
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    InfoRow,
                    {
                      label: __("RMD_PROFILE_AGE"),
                      value: rmdProfile?.first_filled_age ? `${rmdProfile.first_filled_age} tahun` : null
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    InfoRow,
                    {
                      label: __("RMD_PROFILE_EDUCATION"),
                      value: rmdProfile?.first_filled_education
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    InfoRow,
                    {
                      label: __("RMD_PROFILE_EDU_INSTITUTION"),
                      value: rmdProfile?.first_filled_education_institution
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    InfoRow,
                    {
                      label: __("RMD_PROFILE_GRADUATION_DATE"),
                      value: formatDate(graduationPlanDate)
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-8 border-t border-gray-100 dark:border-gray-700 mt-8", children: /* @__PURE__ */ jsxs(
              Link,
              {
                href: route("rmd.gods-purpose"),
                className: "inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150",
                children: [
                  __("RMD_PROFILE_NEXT"),
                  " »"
                ]
              }
            ) })
          ] })
        ] }) }) }) }),
        rmdProgress && /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8", children: /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900 dark:text-white", children: __("Checklist Pengisian RMD") }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-0.5", children: __("Lengkapi semua modul di bawah ini untuk menyelesaikan RMD kamu") })
            ] }),
            (() => {
              const done = rmdProgress.filter((m) => m.percentage === 100).length;
              const total = rmdProgress.length;
              const pct = Math.round(done / total * 100);
              return /* @__PURE__ */ jsxs("span", { className: `text-xs font-bold px-3 py-1 rounded-full ${pct === 100 ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : pct > 0 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"}`, children: [
                done,
                "/",
                total,
                " ",
                __("modul selesai")
              ] });
            })()
          ] }),
          (() => {
            const pct = Math.round(
              rmdProgress.filter((m) => m.percentage === 100).length / rmdProgress.length * 100
            );
            return /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
              /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: `h-2 rounded-full transition-all ${pct === 100 ? "bg-green-500" : "bg-indigo-500"}`,
                  style: { width: `${pct}%` }
                }
              ) }),
              /* @__PURE__ */ jsxs("p", { className: "text-right text-xs text-gray-400 mt-1", children: [
                pct,
                "%"
              ] })
            ] });
          })(),
          /* @__PURE__ */ jsx("div", { className: "space-y-2", children: MODULE_CONFIG.map((mod, idx) => {
            const prog = rmdProgress.find((m) => m.name === mod.name);
            const pct = prog?.percentage ?? 0;
            const done = pct === 100;
            const started = pct > 0 && pct < 100;
            return /* @__PURE__ */ jsxs(
              Link,
              {
                href: route(mod.route),
                className: `flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors group ${done ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30" : started ? "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30" : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50"}`,
                children: [
                  /* @__PURE__ */ jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${done ? "bg-green-500 text-white" : started ? "bg-yellow-400 text-white" : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300"}`, children: done ? /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2.5", d: "M5 13l4 4L19 7" }) }) : idx + 1 }),
                  /* @__PURE__ */ jsx("span", { className: "text-xl shrink-0", children: mod.icon }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsx("p", { className: `text-sm font-semibold truncate ${done ? "text-green-800 dark:text-green-200" : started ? "text-yellow-800 dark:text-yellow-200" : "text-gray-700 dark:text-gray-200"}`, children: mod.name }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 truncate", children: mod.desc })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "shrink-0 flex items-center gap-2", children: [
                    started && /* @__PURE__ */ jsx("div", { className: "w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5", children: /* @__PURE__ */ jsx("div", { className: "h-1.5 rounded-full bg-yellow-400", style: { width: `${pct}%` } }) }),
                    /* @__PURE__ */ jsx("span", { className: `text-xs font-semibold px-2 py-0.5 rounded-full ${done ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : started ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"}`, children: done ? __("Selesai") : started ? `${pct}%` : __("Belum Diisi") }),
                    /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 5l7 7-7 7" }) })
                  ] })
                ]
              },
              mod.name
            );
          }) })
        ] }) }) }),
        /* @__PURE__ */ jsx(Modal, { show: modalState.show, onClose: closeModal, children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `mx-auto flex items-center justify-center h-12 w-12 rounded-full ${modalState.type === "success" ? "bg-green-100" : "bg-red-100"} mb-4`,
              children: modalState.type === "success" ? /* @__PURE__ */ jsx(
                "svg",
                {
                  className: "h-6 w-6 text-green-600",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: "2",
                      d: "M5 13l4 4L19 7"
                    }
                  )
                }
              ) : /* @__PURE__ */ jsx(
                "svg",
                {
                  className: "h-6 w-6 text-red-600",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: "2",
                      d: "M6 18L18 6M6 6l12 12"
                    }
                  )
                }
              )
            }
          ),
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 dark:text-gray-100 text-center mb-2", children: modalState.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 text-center mb-6", children: modalState.message }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(PrimaryButton, { onClick: closeModal, children: __("OK") }) })
        ] }) })
      ]
    }
  );
}
export {
  RmdProfile as default
};
