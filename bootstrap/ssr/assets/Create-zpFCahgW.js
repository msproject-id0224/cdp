import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-DY-v4bup.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DDs2XNYP.js";
import { M as Modal } from "./Modal-CKHW52Ki.js";
import { P as PrimaryButton } from "./PrimaryButton-BNNL2gCI.js";
import { S as SecondaryButton } from "./SecondaryButton-TjIrbn1G.js";
import { T as TextInput } from "./TextInput-D0qTZeQv.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { _ as __ } from "./lang-COBcTD8W.js";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "./ThemeToggle-BY9dagkZ.js";
import "axios";
import "./ProfilePhoto-B39VtFFM.js";
import "./DangerButton-B7to2Tbx.js";
import "./Footer-CDwTxrct.js";
import "./useTheme-CngFDcs1.js";
function MentorCreate({ auth }) {
  const { data, setData, post, errors, processing } = useForm({
    first_name: "",
    last_name: "",
    nickname: "",
    email: "",
    phone_number: "",
    age: "",
    date_of_birth: "",
    gender: "",
    age_group: "",
    bio: ""
  });
  const [confirmingUserCreation, setConfirmingUserCreation] = useState(false);
  const confirmUserCreation = (e) => {
    e.preventDefault();
    setConfirmingUserCreation(true);
  };
  const createUser = () => {
    post(route("mentors.store"), {
      onSuccess: () => closeModal(),
      onFinish: () => setConfirmingUserCreation(false)
    });
  };
  const closeModal = () => {
    setConfirmingUserCreation(false);
  };
  useEffect(() => {
    if (data.date_of_birth) {
      const birthDate = new Date(data.date_of_birth);
      const today = /* @__PURE__ */ new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || m === 0 && today.getDate() < birthDate.getDate()) {
        age--;
      }
      setData("age", age);
    } else {
      setData("age", "");
    }
  }, [data.date_of_birth]);
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200", children: __("Create Mentor") }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("Create Mentor") }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800", children: /* @__PURE__ */ jsx("div", { className: "p-6 text-gray-900 dark:text-gray-100", children: /* @__PURE__ */ jsxs("form", { onSubmit: confirmUserCreation, className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "first_name", value: __("First Name") }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "first_name",
                className: "mt-1 block w-full",
                value: data.first_name,
                onChange: (e) => setData("first_name", e.target.value),
                required: true,
                isFocused: true,
                autoComplete: "given-name"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.first_name })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "last_name", value: __("Last Name") }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "last_name",
                className: "mt-1 block w-full",
                value: data.last_name,
                onChange: (e) => setData("last_name", e.target.value),
                autoComplete: "family-name"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.last_name })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "nickname", value: __("Nickname") }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "nickname",
                className: "mt-1 block w-full",
                value: data.nickname,
                onChange: (e) => setData("nickname", e.target.value),
                autoComplete: "nickname"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.nickname })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "email", value: __("Email") }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "email",
                type: "email",
                className: "mt-1 block w-full",
                value: data.email,
                onChange: (e) => setData("email", e.target.value),
                required: true,
                autoComplete: "username"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.email })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "phone_number", value: __("Phone Number") }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "phone_number",
                type: "tel",
                className: "mt-1 block w-full",
                value: data.phone_number,
                onChange: (e) => setData("phone_number", e.target.value),
                autoComplete: "tel"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.phone_number })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "date_of_birth", value: __("Date of Birth") }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "date_of_birth",
                type: "date",
                className: "mt-1 block w-full",
                value: data.date_of_birth,
                onChange: (e) => setData("date_of_birth", e.target.value)
              }
            ),
            /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.date_of_birth })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "gender", value: __("Gender") }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                id: "gender",
                className: "mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm",
                value: data.gender,
                onChange: (e) => setData("gender", e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: __("Select Gender") }),
                  /* @__PURE__ */ jsx("option", { value: "male", children: __("Male") }),
                  /* @__PURE__ */ jsx("option", { value: "female", children: __("Female") })
                ]
              }
            ),
            /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.gender })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "age", value: __("Age") }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "age",
                type: "number",
                className: "mt-1 block w-full",
                value: data.age,
                onChange: (e) => setData("age", e.target.value)
              }
            ),
            /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.age })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "age_group", value: __("Age Group") }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                id: "age_group",
                className: "mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm",
                value: data.age_group,
                onChange: (e) => setData("age_group", e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: __("Select Age Group") }),
                  /* @__PURE__ */ jsx("option", { value: "Survival", children: __("Survival") }),
                  /* @__PURE__ */ jsx("option", { value: "0-2", children: __("0-2") }),
                  /* @__PURE__ */ jsx("option", { value: "3-5", children: __("3-5") }),
                  /* @__PURE__ */ jsx("option", { value: "6-8", children: __("6-8") }),
                  /* @__PURE__ */ jsx("option", { value: "9-11", children: __("9-11") }),
                  /* @__PURE__ */ jsx("option", { value: "12-14", children: __("12-14") }),
                  /* @__PURE__ */ jsx("option", { value: "15-18", children: __("15-18") }),
                  /* @__PURE__ */ jsx("option", { value: "19+", children: __("19+") })
                ]
              }
            ),
            /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.age_group })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "bio", value: __("Profile Description (Bio)") }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                id: "bio",
                className: "mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm",
                value: data.bio,
                onChange: (e) => setData("bio", e.target.value),
                rows: "4"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.bio })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: __("Create") }),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("mentors.index"),
                className: "inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150",
                children: __("Cancel")
              }
            )
          ] })
        ] }) }) }) }) }),
        /* @__PURE__ */ jsx(Modal, { show: confirmingUserCreation, onClose: closeModal, children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Confirm Mentor Creation") }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600 dark:text-gray-400", children: __("Please review the mentor details before adding.") }),
          /* @__PURE__ */ jsx("div", { className: "mt-6 space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("span", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: [
                __("Full Name"),
                ":"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "block text-sm text-gray-900 dark:text-gray-100", children: [
                data.first_name,
                " ",
                data.last_name
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("span", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: [
                __("Email"),
                ":"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "block text-sm text-gray-900 dark:text-gray-100", children: data.email })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("span", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: [
                __("Phone Number"),
                ":"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "block text-sm text-gray-900 dark:text-gray-100", children: data.phone_number || "-" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("span", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: [
                __("Status"),
                ":"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "block text-sm text-green-600 font-semibold", children: __("Active") })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end", children: [
            /* @__PURE__ */ jsx(SecondaryButton, { onClick: closeModal, children: __("Cancel") }),
            /* @__PURE__ */ jsx(PrimaryButton, { className: "ms-3", disabled: processing, onClick: createUser, children: __("Add Mentor") })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  MentorCreate as default
};
