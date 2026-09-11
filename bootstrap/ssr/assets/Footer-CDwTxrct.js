import { jsx, jsxs } from "react/jsx-runtime";
import { _ as __ } from "./lang-COBcTD8W.js";
function Footer({ transparent = true }) {
  return /* @__PURE__ */ jsx(
    "footer",
    {
      className: transparent ? "w-full bg-transparent" : "bg-white dark:bg-gray-800 mt-auto",
      children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-6 py-5 sm:py-5", children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: `flex flex-col items-center justify-center text-xs text-center ${transparent ? "text-gray-200 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"}`,
          children: [
            "© ",
            (/* @__PURE__ */ new Date()).getFullYear(),
            " MSProject & ",
            __("CDP Development Team"),
            ". ",
            __("All rights reserved.")
          ]
        }
      ) })
    }
  );
}
export {
  Footer as F
};
