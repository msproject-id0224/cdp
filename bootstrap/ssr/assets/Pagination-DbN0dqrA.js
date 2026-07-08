import { jsx } from "react/jsx-runtime";
import { usePage, Link } from "@inertiajs/react";
function Pagination({ links }) {
  const { translations } = usePage().props;
  const __ = (key) => translations?.[key] || key;
  return links.length > 3 && /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap mt-8", children: links.map((link, key) => {
    let label = link.label;
    if (label.includes("&laquo;") || label.includes("Previous") || label === "Previous") {
      label = __("Previous");
    } else if (label.includes("&raquo;") || label.includes("Next") || label === "Next") {
      label = __("Next");
    }
    return link.url === null ? /* @__PURE__ */ jsx(
      "div",
      {
        className: "mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded",
        dangerouslySetInnerHTML: { __html: label }
      },
      key
    ) : /* @__PURE__ */ jsx(
      Link,
      {
        className: `mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-indigo-500 focus:text-indigo-500 ${link.active ? "bg-blue-700 text-white" : "bg-white text-gray-700"}`,
        href: link.url,
        dangerouslySetInnerHTML: { __html: label }
      },
      key
    );
  }) }) });
}
export {
  Pagination as P
};
