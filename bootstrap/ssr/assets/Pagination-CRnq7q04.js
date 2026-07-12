import { jsx } from "react/jsx-runtime";
import { usePage, Link } from "@inertiajs/react";
function Pagination({ links }) {
  const { translations } = usePage().props;
  const __ = (key) => translations?.[key] || key;
  return links.length > 3 && /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap mt-8", children: links.map((link, key) => {
    const rawLabel = link.label;
    const isPrev = rawLabel.includes("&laquo;") || rawLabel === "Previous";
    const isNext = rawLabel.includes("&raquo;") || rawLabel === "Next";
    let content;
    if (isPrev) {
      content = __("Previous");
    } else if (isNext) {
      content = __("Next");
    } else {
      content = /* @__PURE__ */ jsx("span", { dangerouslySetInnerHTML: { __html: rawLabel } });
    }
    return link.url === null ? /* @__PURE__ */ jsx(
      "div",
      {
        className: "mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded",
        children: content
      },
      key
    ) : /* @__PURE__ */ jsx(
      Link,
      {
        className: `mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-indigo-500 focus:text-indigo-500 ${link.active ? "bg-blue-700 text-white" : "bg-white text-gray-700"}`,
        href: link.url,
        children: content
      },
      key
    );
  }) }) });
}
export {
  Pagination as P
};
