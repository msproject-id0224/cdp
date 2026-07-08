import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BG6RGD2S.js";
import { usePage, useForm, Head, router } from "@inertiajs/react";
import { _ as __ } from "./lang-COBcTD8W.js";
import { I as InputLabel } from "./InputLabel-DDs2XNYP.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { P as PrimaryButton } from "./PrimaryButton-BNNL2gCI.js";
import { S as SecondaryButton } from "./SecondaryButton-TjIrbn1G.js";
import { T as TextInput } from "./TextInput-D0qTZeQv.js";
import UpdateProfileInformation from "./UpdateProfileInformationForm-BwDzSX4r.js";
import DeleteUserForm from "./DeleteUserForm-0J2_j0B6.js";
import AdminList from "./AdminList-8x1hQYXT.js";
import { P as ProfilePhoto } from "./ProfilePhoto-CJ2Z04pO.js";
import { M as MentorDocuments } from "./MentorDocuments-CN1Lx_f7.js";
import { useRef, useState } from "react";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "./ThemeToggle-BY9dagkZ.js";
import "axios";
import "./Modal-CKHW52Ki.js";
import "./DangerButton-B7to2Tbx.js";
import "./Footer-B7ihPSZ8.js";
import "./useTheme-CngFDcs1.js";
import "./ConfirmModal-Bqr5rb3_.js";
const EditableInfoRow = ({ label, value, field, user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || "");
  const [processing, setProcessing] = useState(false);
  const handleSave = () => {
    setProcessing(true);
    const data = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      job_title: user.job_title,
      [field]: editValue
    };
    router.patch(route("profile.update"), data, {
      preserveScroll: true,
      onSuccess: () => {
        setIsEditing(false);
        setProcessing(false);
        if (onUpdate) onUpdate();
      },
      onError: () => {
        setProcessing(false);
      }
    });
  };
  const handleCancel = () => {
    setEditValue(value || "");
    setIsEditing(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 border-b border-gray-200 dark:border-gray-700 last:border-0 items-center", children: [
    /* @__PURE__ */ jsx("dt", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: label }),
    /* @__PURE__ */ jsx("dd", { className: "mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0 flex justify-between items-center", children: isEditing ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 w-full max-w-md", children: [
      /* @__PURE__ */ jsx(
        TextInput,
        {
          value: editValue,
          onChange: (e) => setEditValue(e.target.value),
          className: "w-full",
          autoFocus: true
        }
      ),
      /* @__PURE__ */ jsx(PrimaryButton, { onClick: handleSave, disabled: processing, className: "px-3 py-1 text-xs", children: __("Save") }),
      /* @__PURE__ */ jsx(SecondaryButton, { onClick: handleCancel, disabled: processing, className: "px-3 py-1 text-xs", children: __("Cancel") })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("span", { children: value || "-" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setIsEditing(true),
          className: "ml-4 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors",
          title: __("Edit"),
          children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" }) })
        }
      )
    ] }) })
  ] });
};
function Edit({ mustVerifyEmail, status }) {
  const { auth, locale } = usePage().props;
  const user = auth.user;
  const isAdmin = user.role === "admin";
  const photoInputRef = useRef(null);
  const { data: photoData, setData: setPhotoData, post: postPhoto, processing: photoProcessing, errors: photoErrors, reset: resetPhoto } = useForm({
    photo: null
  });
  const submitPhotoRequest = (e) => {
    e.preventDefault();
    let routeName;
    let routeParams = {};
    if (isAdmin) {
      routeName = "admin.profile-photos.upload";
      routeParams = { user: user.id };
    } else {
      routeName = user.role === "mentor" ? "mentor.profile-photo.request" : "participant.profile-photo.request";
    }
    postPhoto(route(routeName, routeParams), {
      onSuccess: () => resetPhoto()
    });
  };
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };
  const InfoRow = ({ label, value }) => /* @__PURE__ */ jsxs("div", { className: "py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 border-b border-gray-200 dark:border-gray-700 last:border-0", children: [
    /* @__PURE__ */ jsx("dt", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: label }),
    /* @__PURE__ */ jsx("dd", { className: "mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0", children: value || "-" })
  ] });
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200", children: isAdmin ? __("Admin Information") : __("Profile") }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("Profile") }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-white overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-800 transition-colors duration-200", children: /* @__PURE__ */ jsxs("div", { className: "p-6 text-gray-900 dark:text-gray-100", children: [
            /* @__PURE__ */ jsxs("div", { className: "px-4 sm:px-0 mb-6 border-b border-gray-200 dark:border-gray-700 pb-6", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100 mb-4", children: __("Profile Photo") }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-start md:space-x-6 space-y-4 md:space-y-0", children: [
                /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx(
                  ProfilePhoto,
                  {
                    src: user.profile_photo_url,
                    alt: user.name,
                    className: "w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700",
                    fallbackClassName: "w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 border-2 border-gray-200 dark:border-gray-700",
                    fallback: /* @__PURE__ */ jsx("svg", { className: "w-12 h-12", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) })
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "flex-grow max-w-xl", children: !isAdmin && user.profile_photo_status === "pending" ? /* @__PURE__ */ jsx("div", { className: "bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-yellow-400", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }) }),
                  /* @__PURE__ */ jsx("div", { className: "ml-3", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-yellow-700 dark:text-yellow-200", children: __("Your photo update request is pending approval.") }) })
                ] }) }) : /* @__PURE__ */ jsxs("form", { onSubmit: submitPhotoRequest, children: [
                  user.profile_photo_status === "rejected" && /* @__PURE__ */ jsx("div", { className: "mb-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
                    /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-red-400", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) }),
                    /* @__PURE__ */ jsx("div", { className: "ml-3", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-red-700 dark:text-red-200", children: __("Your last photo request was rejected.") }) })
                  ] }) }),
                  /* @__PURE__ */ jsx(InputLabel, { htmlFor: "photo", value: isAdmin ? __("Change Profile Photo") : __("Request Photo Update") }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mt-2", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        ref: photoInputRef,
                        type: "file",
                        id: "photo",
                        onChange: (e) => setPhotoData("photo", e.target.files[0]),
                        className: "hidden",
                        accept: "image/*"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => photoInputRef.current?.click(),
                        className: "px-4 py-2 text-sm font-semibold rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800 transition-colors",
                        children: __("Choose File")
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs", children: photoData.photo ? photoData.photo.name : __("No file chosen") }),
                    /* @__PURE__ */ jsx(PrimaryButton, { disabled: photoProcessing, children: isAdmin ? __("Save Photo") : __("Submit Request") })
                  ] }),
                  /* @__PURE__ */ jsx(InputError, { message: photoErrors.photo, className: "mt-2" })
                ] }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "px-4 sm:px-0 mb-6", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold leading-7 text-gray-900 dark:text-gray-100", children: isAdmin ? __("Admin Information") : __("Participant Information") }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400", children: isAdmin ? __("Administrator account information details.") : __("Personal details and membership status.") })
            ] }),
            /* @__PURE__ */ jsx("dl", { className: "divide-y divide-gray-100 dark:divide-gray-700", children: isAdmin ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(EditableInfoRow, { label: __("First Name"), value: user.first_name, field: "first_name", user }),
              /* @__PURE__ */ jsx(EditableInfoRow, { label: __("Last Name"), value: user.last_name, field: "last_name", user }),
              /* @__PURE__ */ jsx(EditableInfoRow, { label: __("Email"), value: user.email, field: "email", user }),
              /* @__PURE__ */ jsx(EditableInfoRow, { label: __("Phone Number"), value: user.phone_number, field: "phone_number", user }),
              /* @__PURE__ */ jsx(EditableInfoRow, { label: __("Job Title"), value: user.job_title, field: "job_title", user })
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(InfoRow, { label: __("Full Name"), value: user.name }),
              /* @__PURE__ */ jsx(InfoRow, { label: __("Email Address"), value: user.email }),
              /* @__PURE__ */ jsx(InfoRow, { label: __("Phone Number"), value: user.phone_number }),
              /* @__PURE__ */ jsx(InfoRow, { label: __("Address"), value: user.address }),
              /* @__PURE__ */ jsx(InfoRow, { label: __("Date of Birth"), value: formatDate(user.date_of_birth) }),
              /* @__PURE__ */ jsx(InfoRow, { label: __("Membership Status"), value: user.role ? __(String(user.role).charAt(0).toUpperCase() + String(user.role).slice(1)) : "-" })
            ] }) })
          ] }) }),
          isAdmin ? /* @__PURE__ */ jsx("div", { className: "p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg mt-6", children: /* @__PURE__ */ jsx(AdminList, {}) }) : /* @__PURE__ */ jsx("div", { className: "p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg mt-6", children: /* @__PURE__ */ jsx(
            UpdateProfileInformation,
            {
              mustVerifyEmail,
              status,
              className: "max-w-xl"
            }
          ) }),
          user.role === "mentor" && /* @__PURE__ */ jsx("div", { className: "p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg mt-6", children: /* @__PURE__ */ jsx(MentorDocuments, {}) }),
          !isAdmin && user.role !== "participant" && user.role !== "mentor" && /* @__PURE__ */ jsx("div", { className: "p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg mt-6", children: /* @__PURE__ */ jsx(DeleteUserForm, { className: "max-w-xl" }) })
        ] }) })
      ]
    }
  );
}
export {
  Edit as default
};
