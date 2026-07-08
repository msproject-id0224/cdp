import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
import { _ as __ } from "./lang-COBcTD8W.js";
import { u as useTheme } from "./useTheme-CngFDcs1.js";
import { P as ProfilePhoto } from "./ProfilePhoto-CJ2Z04pO.js";
import { F as Footer } from "./Footer-B7ihPSZ8.js";
function GuestLayout({ children }) {
  useTheme();
  return /* @__PURE__ */ jsxs("div", { className: "relative min-h-screen flex flex-col overflow-hidden", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 bg-cover bg-center",
        style: {
          backgroundImage: "url('/assets/img/background.webp')",
          filter: "blur(5px)",
          transform: "scale(1.05)"
          // Reduced scale as blur is smaller
        }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/20 dark:bg-black/40 transition-colors duration-300" }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-center justify-center relative z-10 w-full", children: /* @__PURE__ */ jsx("div", { className: "w-full sm:max-w-md", children: /* @__PURE__ */ jsxs("div", { className: "overflow-hidden bg-white/50 dark:bg-gray-900/80 backdrop-blur-sm px-8 py-10 shadow-2xl sm:rounded-2xl border border-white/20 dark:border-gray-700 transition-colors duration-300", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center mb-8", children: /* @__PURE__ */ jsxs(Link, { href: "/", className: "flex flex-col items-center", children: [
        /* @__PURE__ */ jsx(
          ProfilePhoto,
          {
            src: "/assets/img/logo-rmd.png",
            alt: __("Logo RMD"),
            className: "h-24 w-auto mb-4 object-contain",
            fallbackClassName: "h-24 w-auto mb-4 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold text-xl rounded-lg px-4",
            fallback: "RMD"
          }
        ),
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-gray-800 dark:text-gray-100 text-center uppercase tracking-wider transition-colors duration-300", children: __("Child Development Program") })
      ] }) }),
      children
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10 w-full", children: /* @__PURE__ */ jsx(Footer, {}) })
  ] });
}
export {
  GuestLayout as G
};
