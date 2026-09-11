import { jsxs, jsx } from "react/jsx-runtime";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DDs2XNYP.js";
import { P as PrimaryButton } from "./PrimaryButton-BNNL2gCI.js";
import { T as TextInput } from "./TextInput-D0qTZeQv.js";
import { M as Modal } from "./Modal-CKHW52Ki.js";
import { S as SecondaryButton } from "./SecondaryButton-TjIrbn1G.js";
import { P as ProfilePhoto } from "./ProfilePhoto-B39VtFFM.js";
import { Transition } from "@headlessui/react";
import { usePage, useForm, Link } from "@inertiajs/react";
import { useState } from "react";
import { _ as __ } from "./lang-COBcTD8W.js";
function UpdateProfileInformation({
  mustVerifyEmail,
  status,
  className = ""
}) {
  const user = usePage().props.auth.user;
  const [confirmingProfileUpdate, setConfirmingProfileUpdate] = useState(false);
  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
    first_name: user.first_name,
    last_name: user.last_name || "",
    id_number: user.id_number || "",
    email: user.email
  });
  const confirmProfileUpdate = (e) => {
    e.preventDefault();
    setConfirmingProfileUpdate(true);
  };
  const submit = () => {
    patch(route("profile.update"), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => closeModal(),
      onFinish: () => setConfirmingProfileUpdate(false)
    });
  };
  const closeModal = () => {
    setConfirmingProfileUpdate(false);
  };
  return /* @__PURE__ */ jsxs("section", { className, children: [
    /* @__PURE__ */ jsxs("header", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Profile Information") }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600 dark:text-gray-400", children: __("Update your account's profile information and email address.") })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: confirmProfileUpdate, className: "mt-6 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4 mb-4", children: [
        /* @__PURE__ */ jsx(
          ProfilePhoto,
          {
            src: user.profile_photo_url,
            alt: user.name,
            className: "h-20 w-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700",
            fallbackClassName: "h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 text-2xl font-bold border-2 border-gray-200 dark:border-gray-700",
            fallback: (user.name || "U").charAt(0).toUpperCase()
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-gray-100", children: user.name }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: user.email })
        ] })
      ] }),
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
      mustVerifyEmail && user.email_verified_at === null && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-gray-800", children: [
          __("Your email address is unverified."),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("verification.send"),
              method: "post",
              as: "button",
              className: "rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
              children: __("Click here to re-send the verification email.")
            }
          )
        ] }),
        status === "verification-link-sent" && /* @__PURE__ */ jsx("div", { className: "mt-2 text-sm font-medium text-green-600", children: __("A new verification link has been sent to your email address.") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: __("Save") }),
        /* @__PURE__ */ jsx(
          Transition,
          {
            show: recentlySuccessful,
            enter: "transition ease-in-out",
            enterFrom: "opacity-0",
            leave: "transition ease-in-out",
            leaveTo: "opacity-0",
            children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: __("Saved.") })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(Modal, { show: confirmingProfileUpdate, onClose: closeModal, children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900", children: __("Confirm Profile Update") }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600", children: __("Are you sure you want to update your profile information?") }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end", children: [
        /* @__PURE__ */ jsx(SecondaryButton, { onClick: closeModal, children: __("Cancel") }),
        /* @__PURE__ */ jsx(PrimaryButton, { className: "ms-3", disabled: processing, onClick: submit, children: processing ? __("Saving...") : __("Confirm Save") })
      ] })
    ] }) })
  ] });
}
export {
  UpdateProfileInformation as default
};
