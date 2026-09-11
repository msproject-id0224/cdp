import { jsxs, jsx } from "react/jsx-runtime";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DDs2XNYP.js";
import { P as PrimaryButton } from "./PrimaryButton-BNNL2gCI.js";
import { T as TextInput } from "./TextInput-D0qTZeQv.js";
import { G as GuestLayout } from "./GuestLayout-DqRRGjIq.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { _ as __ } from "./lang-COBcTD8W.js";
import "react";
import "./useTheme-CngFDcs1.js";
import "./ProfilePhoto-CJ2Z04pO.js";
import "./Footer-CDwTxrct.js";
function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    first_name: "",
    last_name: "",
    id_number: "",
    email: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("register"), {
      onFinish: () => reset()
    });
  };
  return /* @__PURE__ */ jsxs(GuestLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: __("Register") }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "first_name", value: __("First Name") }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "first_name",
            name: "first_name",
            value: data.first_name,
            className: "mt-1 block w-full",
            autoComplete: "given-name",
            isFocused: true,
            onChange: (e) => setData("first_name", e.target.value),
            required: true
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.first_name, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "last_name", value: __("Last Name") }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "last_name",
            name: "last_name",
            value: data.last_name,
            className: "mt-1 block w-full",
            autoComplete: "family-name",
            onChange: (e) => setData("last_name", e.target.value)
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.last_name, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "id_number", value: __("ID Number") }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "id_number",
            name: "id_number",
            value: data.id_number,
            className: "mt-1 block w-full",
            autoComplete: "id_number",
            onChange: (e) => setData("id_number", e.target.value),
            required: true
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.id_number, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "email", value: __("Email") }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "email",
            type: "email",
            name: "email",
            value: data.email,
            className: "mt-1 block w-full",
            autoComplete: "username",
            onChange: (e) => setData("email", e.target.value),
            required: true
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.email, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-end", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("login"),
            className: "rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800",
            children: __("Already registered?")
          }
        ),
        /* @__PURE__ */ jsx(PrimaryButton, { className: "ms-4", disabled: processing, children: __("Register") })
      ] })
    ] })
  ] });
}
export {
  Register as default
};
