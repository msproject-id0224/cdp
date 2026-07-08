import { jsxs, jsx } from "react/jsx-runtime";
import { P as PrimaryButton } from "./PrimaryButton-BNNL2gCI.js";
import { S as SecondaryButton } from "./SecondaryButton-TjIrbn1G.js";
import { D as DangerButton } from "./DangerButton-B7to2Tbx.js";
import { M as Modal } from "./Modal-CKHW52Ki.js";
import { G as GuestLayout } from "./GuestLayout-B6KH_Jlu.js";
import { useForm, Head, Link, router } from "@inertiajs/react";
import { _ as __ } from "./lang-COBcTD8W.js";
import { useState } from "react";
import "@headlessui/react";
import "./useTheme-CngFDcs1.js";
import "./ProfilePhoto-CJ2Z04pO.js";
import "./Footer-B7ihPSZ8.js";
function VerifyEmail({ status }) {
  const { post, processing } = useForm({});
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    post(route("verification.send"));
  };
  const confirmLogout = (e) => {
    e.preventDefault();
    setConfirmingLogout(true);
  };
  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setConfirmingLogout(false);
    router.post(route("logout"));
  };
  return /* @__PURE__ */ jsxs(GuestLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: __("Email Verification") }),
    /* @__PURE__ */ jsx("div", { className: "mb-4 text-sm text-gray-600", children: __("Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.") }),
    status === "verification-link-sent" && /* @__PURE__ */ jsx("div", { className: "mb-4 text-sm font-medium text-green-600", children: __("A new verification link has been sent to the email address you provided during registration.") }),
    /* @__PURE__ */ jsx("form", { onSubmit: submit, children: /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: __("Resend Verification Email") }),
      /* @__PURE__ */ jsx(
        Link,
        {
          as: "button",
          type: "button",
          onClick: confirmLogout,
          className: "rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
          children: __("Log Out")
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx(Modal, { show: confirmingLogout, onClose: () => setConfirmingLogout(false), children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Are you sure you want to log out?") }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end", children: [
        /* @__PURE__ */ jsx(SecondaryButton, { onClick: () => setConfirmingLogout(false), children: __("Cancel") }),
        /* @__PURE__ */ jsx(DangerButton, { className: "ms-3", onClick: logout, children: __("Yes, Log Out") })
      ] })
    ] }) })
  ] });
}
export {
  VerifyEmail as default
};
