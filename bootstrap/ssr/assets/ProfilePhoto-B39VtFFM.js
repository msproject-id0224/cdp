import { jsx } from "react/jsx-runtime";
import { useState } from "react";
function ProfilePhoto({ src, alt, className, fallback, fallbackClassName }) {
  const [error, setError] = useState(false);
  if (src && !error) {
    return /* @__PURE__ */ jsx(
      "img",
      {
        src,
        alt,
        onError: () => setError(true),
        className
      }
    );
  }
  return /* @__PURE__ */ jsx("div", { className: fallbackClassName || className, children: fallback || /* @__PURE__ */ jsx("span", { className: "text-gray-500 font-bold", children: (alt || "U").charAt(0).toUpperCase() }) });
}
export {
  ProfilePhoto as P
};
