import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { _ as __ } from "./lang-COBcTD8W.js";
import { D as Dropdown } from "./Dropdown-BgvF6zKd.js";
import { P as ProfilePhoto } from "./ProfilePhoto-CJ2Z04pO.js";
import { F as Footer } from "./Footer-B7ihPSZ8.js";
import "@headlessui/react";
import "react";
function GetStarted() {
  const title = __("Child Development Program");
  const switchLanguage = (locale) => {
    router.post(
      route("language.switch", locale),
      {},
      { preserveScroll: true }
    );
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: __("Get Started") }),
    /* @__PURE__ */ jsx("style", { children: `
                @keyframes kenburns {
                    0%   { transform: scale(1)    translateX(0)    translateY(0); }
                    25%  { transform: scale(1.08) translateX(-1%)  translateY(-1%); }
                    50%  { transform: scale(1.12) translateX(1%)   translateY(-2%); }
                    75%  { transform: scale(1.08) translateX(-1%)  translateY(1%); }
                    100% { transform: scale(1)    translateX(0)    translateY(0); }
                }
                @keyframes fadeInUp {
                    0%   { opacity: 0; transform: translateY(30px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes titleGlow {
                    0%, 100% { text-shadow: 0 0 20px rgba(255,255,255,0.8), 0 4px 24px rgba(0,0,0,0.4); }
                    50%      { text-shadow: 0 0 40px rgba(255,255,255,1),   0 4px 32px rgba(0,0,0,0.5); }
                }
                @keyframes floatLogo {
                    0%, 100% { transform: translateY(0px); }
                    50%      { transform: translateY(-10px); }
                }
                .bg-kenburns {
                    animation: kenburns 20s ease-in-out infinite;
                    will-change: transform;
                }
                .title-glow {
                    animation: titleGlow 3s ease-in-out infinite, fadeInUp 0.8s ease-out both;
                }
                .logo-float {
                    animation: floatLogo 4s ease-in-out infinite, fadeInUp 0.6s ease-out both;
                }
                .btn-fade {
                    animation: fadeInUp 1s ease-out 0.4s both;
                }
            ` }),
    /* @__PURE__ */ jsxs("div", { className: "relative min-h-screen overflow-hidden flex flex-col", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 bg-kenburns bg-cover bg-center",
          style: { backgroundImage: "url('/assets/img/background.webp')" }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60 pointer-events-none" }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4 z-20", children: /* @__PURE__ */ jsxs(Dropdown, { children: [
        /* @__PURE__ */ jsx(Dropdown.Trigger, { children: /* @__PURE__ */ jsx("button", { className: "flex items-center justify-center p-2 rounded-full hover:bg-white/20 transition-colors focus:outline-none", children: /* @__PURE__ */ jsx(
          ProfilePhoto,
          {
            src: "/assets/img/globe.png",
            alt: __("Language"),
            className: "h-8 w-8 object-contain drop-shadow-md hover:scale-110 transition-transform duration-200 brightness-0 invert",
            fallbackClassName: "h-8 w-8 bg-white/50 rounded-full flex items-center justify-center text-xs",
            fallback: "🌐"
          }
        ) }) }),
        /* @__PURE__ */ jsxs(Dropdown.Content, { children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => switchLanguage("id"),
              className: "block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition",
              children: __("Bahasa")
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => switchLanguage("en"),
              className: "block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition",
              children: __("English")
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center relative z-10 px-6 pt-16 pb-6", children: [
        /* @__PURE__ */ jsx(
          ProfilePhoto,
          {
            src: "/assets/img/logo-rmd.png",
            alt: __("Logo RMD"),
            className: "h-28 sm:h-36 w-auto mb-6 object-contain drop-shadow-2xl logo-float",
            fallbackClassName: "h-28 sm:h-36 w-28 sm:w-36 mb-6 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold text-2xl rounded-lg shadow-lg logo-float",
            fallback: "RMD"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "w-20 h-1 bg-white/70 rounded-full mb-5", style: { animation: "fadeInUp 0.7s ease-out 0.2s both" } }),
        /* @__PURE__ */ jsx(
          "h1",
          {
            className: "title-glow text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white text-center uppercase leading-tight w-full max-w-sm sm:max-w-xl",
            style: { letterSpacing: "0.07em" },
            children: title
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "w-20 h-1 bg-white/70 rounded-full mt-5 mb-8", style: { animation: "fadeInUp 0.7s ease-out 0.3s both" } }),
        /* @__PURE__ */ jsx("div", { className: "btn-fade", children: /* @__PURE__ */ jsx(
          Link,
          {
            href: route("login"),
            className: "inline-block bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-4 px-10 sm:px-12 rounded-full transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 hover:scale-105 text-base sm:text-lg tracking-wide",
            children: __("Get Started")
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsx(Footer, { transparent: true }) })
    ] })
  ] });
}
export {
  GetStarted as default
};
