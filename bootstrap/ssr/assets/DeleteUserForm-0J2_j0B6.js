import { jsxs, jsx } from "react/jsx-runtime";
import { D as DangerButton } from "./DangerButton-B7to2Tbx.js";
import { M as Modal } from "./Modal-CKHW52Ki.js";
import { S as SecondaryButton } from "./SecondaryButton-TjIrbn1G.js";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { _ as __ } from "./lang-COBcTD8W.js";
import "@headlessui/react";
function DeleteUserForm({ className = "" }) {
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const {
    delete: destroy,
    processing,
    reset,
    clearErrors
  } = useForm();
  const confirmUserDeletion = () => {
    setConfirmingUserDeletion(true);
  };
  const deleteUser = (e) => {
    e.preventDefault();
    destroy(route("profile.destroy"), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onFinish: () => reset()
    });
  };
  const closeModal = () => {
    setConfirmingUserDeletion(false);
    clearErrors();
    reset();
  };
  return /* @__PURE__ */ jsxs("section", { className: `space-y-6 ${className}`, children: [
    /* @__PURE__ */ jsxs("header", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Delete Account") }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600 dark:text-gray-400", children: __("Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.") })
    ] }),
    /* @__PURE__ */ jsx(DangerButton, { onClick: confirmUserDeletion, children: __("Delete Account") }),
    /* @__PURE__ */ jsx(Modal, { show: confirmingUserDeletion, onClose: closeModal, children: /* @__PURE__ */ jsxs("form", { onSubmit: deleteUser, className: "p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Are you sure you want to delete your account?") }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600 dark:text-gray-400", children: __("Once your account is deleted, all of its resources and data will be permanently deleted. Please confirm you would like to permanently delete your account.") }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end", children: [
        /* @__PURE__ */ jsx(SecondaryButton, { onClick: closeModal, children: __("Cancel") }),
        /* @__PURE__ */ jsx(DangerButton, { className: "ms-3", disabled: processing, children: __("Delete Account") })
      ] })
    ] }) })
  ] });
}
export {
  DeleteUserForm as default
};
