import { jsxs, jsx } from "react/jsx-runtime";
import { usePage, useForm, Head, router } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import { G as GuestLayout } from "./GuestLayout-DqRRGjIq.js";
import { P as PrimaryButton } from "./PrimaryButton-BNNL2gCI.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { _ as __ } from "./lang-COBcTD8W.js";
import "./useTheme-CngFDcs1.js";
import "./ProfilePhoto-CJ2Z04pO.js";
import "./Footer-CDwTxrct.js";
function VerifyOtp() {
  const { channel, displayTarget, flash } = usePage().props;
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    otp: ""
  });
  const [countdown, setCountdown] = useState(60);
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1e3);
    }
    return () => clearInterval(timer);
  }, [countdown]);
  useEffect(() => {
    if (data.otp.length === 6) {
      submit();
    }
  }, [data.otp]);
  useEffect(() => {
    if (errors.otp) {
      const timer = setTimeout(() => {
        reset("otp");
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 1e3);
      return () => clearTimeout(timer);
    }
  }, [errors.otp]);
  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) {
      setData("otp", value);
      if (errors.otp) clearErrors("otp");
    }
  };
  const submit = (e) => {
    if (e) e.preventDefault();
    post(route("otp.verify"), {
      preserveScroll: true,
      onError: () => {
      }
    });
  };
  const handleResend = () => {
    setCountdown(60);
    router.post(route("otp.resend"), {}, {
      preserveScroll: true
    });
  };
  const isComplete = data.otp.length === 6;
  const hasError = !!errors.otp;
  let borderColorClass = "border-gray-300 dark:border-gray-700";
  if (hasError) borderColorClass = "border-red-500 focus:border-red-500 ring-red-500";
  else if (isComplete) borderColorClass = "border-green-500 focus:border-green-500 ring-green-500";
  else borderColorClass = "border-gray-300 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-500";
  return /* @__PURE__ */ jsxs(GuestLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: __("Confirm OTP") }),
    flash?.success && /* @__PURE__ */ jsx("div", { className: "mb-4 font-medium text-sm text-green-600 dark:text-green-400 text-center bg-green-100 dark:bg-green-900/30 p-2 rounded-lg border border-green-200 dark:border-green-800", children: flash.success }),
    flash?.error && /* @__PURE__ */ jsx("div", { className: "mb-4 font-medium text-sm text-red-600 dark:text-red-400 text-center bg-red-100 dark:bg-red-900/30 p-2 rounded-lg border border-red-200 dark:border-red-800", children: flash.error }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800 dark:text-gray-100", children: __("Confirm OTP") }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-2", children: channel === "whatsapp" ? __("Please enter the 6-digit OTP code sent to your WhatsApp number") : __("Please enter the 6-digit OTP code sent to your email") }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1", children: displayTarget })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: inputRef,
            type: "text",
            inputMode: "numeric",
            pattern: "[0-9]*",
            maxLength: "6",
            value: data.otp,
            onChange: handleChange,
            className: `w-full text-center text-3xl font-mono tracking-[0.5em] py-4 rounded-lg bg-white/50 dark:bg-gray-800/50 shadow-sm focus:ring-2 transition-all outline-none ${borderColorClass}`,
            placeholder: "••••••",
            "aria-label": __("OTP Code"),
            "aria-invalid": hasError,
            autoComplete: "one-time-code"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 font-mono pointer-events-none", children: [
          data.otp.length,
          "/6"
        ] })
      ] }),
      /* @__PURE__ */ jsx(InputError, { message: errors.otp, className: "mt-2 text-center" }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(PrimaryButton, { className: "w-full justify-center py-3", disabled: processing || !isComplete, children: processing ? __("Verifying...") : __("Confirm OTP") }) }),
      /* @__PURE__ */ jsx("div", { className: "text-center", children: countdown > 0 ? /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
        __("Resend code in"),
        " ",
        /* @__PURE__ */ jsxs("span", { className: "font-mono font-bold", children: [
          countdown,
          "s"
        ] })
      ] }) : /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: handleResend,
          className: "text-sm text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors",
          children: __("Resend Code")
        }
      ) })
    ] })
  ] });
}
export {
  VerifyOtp as default
};
