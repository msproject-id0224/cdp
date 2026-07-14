import { jsxs, jsx } from "react/jsx-runtime";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DDs2XNYP.js";
import { P as PrimaryButton } from "./PrimaryButton-BNNL2gCI.js";
import { T as TextInput } from "./TextInput-D0qTZeQv.js";
import { G as GuestLayout } from "./GuestLayout-DqRRGjIq.js";
import { usePage, useForm, Head, router } from "@inertiajs/react";
import { _ as __ } from "./lang-COBcTD8W.js";
import { useState } from "react";
import axios from "axios";
import "./useTheme-CngFDcs1.js";
import "./ProfilePhoto-CJ2Z04pO.js";
import "./Footer-CDwTxrct.js";
function Login({ status, canResetPassword }) {
  const { flash } = usePage().props;
  const { data, setData, processing, errors, setError, clearErrors } = useForm({
    email: "",
    phone_number: "",
    channel: "mail"
  });
  const [clientError, setClientError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const validateEmail = (value) => {
    if (!value || value.trim() === "") {
      setClientError(__("Email is required"));
      return false;
    }
    setClientError("");
    return true;
  };
  const validatePhone = (value) => {
    if (!value || value.trim() === "") {
      setClientError(__("Nomor WhatsApp wajib diisi."));
      return false;
    }
    setClientError("");
    return true;
  };
  const handleChannelChange = (channel) => {
    setData("channel", channel);
    setClientError("");
    clearErrors();
  };
  const submit = async (e) => {
    e.preventDefault();
    setClientError("");
    clearErrors();
    const isWhatsapp2 = data.channel === "whatsapp";
    const isValid = isWhatsapp2 ? validatePhone(data.phone_number) : validateEmail(data.email);
    if (!isValid) return;
    setIsSubmitting(true);
    try {
      const payload = { channel: data.channel };
      if (isWhatsapp2) {
        payload.phone_number = data.phone_number;
      } else {
        payload.email = data.email;
      }
      const response = await axios.post(route("login"), payload);
      if (response.status === 200 && response.data.success && response.data.nextScreen === "otp") {
        router.visit(route("otp.view"));
      } else {
        setClientError(__("Unexpected response from server."));
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        if (error.response.status === 422) {
          const validationErrors = error.response.data.errors;
          Object.keys(validationErrors).forEach((key) => {
            setError(key, validationErrors[key][0]);
          });
        } else {
          setClientError(error.response.data.message || __("An error occurred. Please try again."));
        }
      } else {
        setClientError(__("Network error. Please check your connection."));
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const isWhatsapp = data.channel === "whatsapp";
  return /* @__PURE__ */ jsxs(GuestLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: __("Login") }),
    status && /* @__PURE__ */ jsx("div", { className: "mb-4 text-sm font-medium text-green-600", children: status }),
    flash?.error && /* @__PURE__ */ jsx("div", { className: "mb-4 text-sm font-medium text-red-600 bg-red-100 p-3 rounded border border-red-200", children: flash.error }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800 dark:text-gray-100", children: __("Login") }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-2", children: isWhatsapp ? __("Enter your WhatsApp number to receive an OTP code.") : __("Enter your email to receive an OTP code.") })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { value: __("Send OTP via"), className: "text-gray-500 dark:text-gray-400 font-semibold" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 flex gap-4", children: [
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "radio",
                name: "channel",
                value: "mail",
                checked: data.channel === "mail",
                onChange: () => handleChannelChange("mail")
              }
            ),
            __("Email")
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "radio",
                name: "channel",
                value: "whatsapp",
                checked: isWhatsapp,
                onChange: () => handleChannelChange("whatsapp")
              }
            ),
            __("WhatsApp")
          ] })
        ] }),
        /* @__PURE__ */ jsx(InputError, { message: errors.channel, className: "mt-2" })
      ] }),
      isWhatsapp ? /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "phone_number", value: __("WhatsApp Number"), className: "text-gray-500 dark:text-gray-400 font-semibold" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "phone_number",
            type: "tel",
            name: "phone_number",
            value: data.phone_number,
            className: "mt-1 block w-full bg-white/50 border-white/30 focus:bg-white/70 dark:bg-gray-800/50 dark:border-gray-700/50 dark:focus:bg-gray-800/70 transition-all",
            autoComplete: "tel",
            placeholder: "08xxxxxxxxxx",
            isFocused: true,
            onChange: (e) => {
              setData("phone_number", e.target.value);
              if (clientError) {
                validatePhone(e.target.value);
              }
            },
            onBlur: (e) => validatePhone(e.target.value)
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: clientError || errors.phone_number, className: "mt-2" })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "email", value: __("Email"), className: "text-gray-500 dark:text-gray-400 font-semibold" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "email",
            type: "email",
            name: "email",
            value: data.email,
            className: "mt-1 block w-full bg-white/50 border-white/30 focus:bg-white/70 dark:bg-gray-800/50 dark:border-gray-700/50 dark:focus:bg-gray-800/70 transition-all",
            autoComplete: "username",
            isFocused: true,
            onChange: (e) => {
              setData("email", e.target.value);
              if (clientError) {
                validateEmail(e.target.value);
              }
            },
            onBlur: (e) => validateEmail(e.target.value)
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: clientError || errors.email, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 flex items-center justify-center", children: /* @__PURE__ */ jsx(PrimaryButton, { className: "w-full justify-center py-3", disabled: isSubmitting || processing, children: isSubmitting ? __("Sending...") : __("Send OTP Code") }) })
    ] })
  ] });
}
export {
  Login as default
};
