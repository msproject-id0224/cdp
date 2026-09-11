import { jsx } from "react/jsx-runtime";
import { forwardRef, useRef, useEffect } from "react";
import { a as autoGrow } from "./autoGrow-BUc_DkMi.js";
const TextArea = forwardRef(function TextArea2({ className = "", isFocused = false, onInput, ...props }, ref) {
  const input = ref ? ref : useRef();
  useEffect(() => {
    if (isFocused) {
      input.current.focus();
    }
    autoGrow(input.current);
  }, []);
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      ...props,
      className: "border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm resize max-w-full overflow-hidden " + className,
      onInput: (e) => {
        autoGrow(e.target);
        onInput?.(e);
      },
      ref: input
    }
  );
});
export {
  TextArea as T
};
