import { jsxs, jsx } from "react/jsx-runtime";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DDs2XNYP.js";
import { P as PrimaryButton } from "./PrimaryButton-BNNL2gCI.js";
import { T as TextInput } from "./TextInput-D0qTZeQv.js";
import { G as GuestLayout } from "./GuestLayout-B6KH_Jlu.js";
import { usePage, useForm, Head, router } from "@inertiajs/react";
import { _ as __ } from "./lang-COBcTD8W.js";
import { useState } from "react";
import axios from "axios";
import "./useTheme-CngFDcs1.js";
import "./ProfilePhoto-CJ2Z04pO.js";
import "./Footer-B7ihPSZ8.js";
function Login({ status, canResetPassword }) {
  const { flash } = usePage().props;
  const { data, setData, processing, errors, setError, clearErrors } = useForm({
    email: ""
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
  const submit = async (e) => {
    e.preventDefault();
    setClientError("");
    clearErrors();
    const isValid = validateEmail(data.email);
    if (!isValid) return;
    setIsSubmitting(true);
    try {
      const response = await axios.post(route("login"), {
        email: data.email
      });
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
  return /* @__PURE__ */ jsxs(GuestLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: __("Login") }),
    status && /* @__PURE__ */ jsx("div", { className: "mb-4 text-sm font-medium text-green-600", children: status }),
    flash?.error && /* @__PURE__ */ jsx("div", { className: "mb-4 text-sm font-medium text-red-600 bg-red-100 p-3 rounded border border-red-200", children: flash.error }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800 dark:text-gray-100", children: __("Login") }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-2", children: __("Enter your email to receive an OTP code.") })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { children: [
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
