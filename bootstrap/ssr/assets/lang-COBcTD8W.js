import { usePage } from "@inertiajs/react";
function __(key, replace = {}) {
  const translations = (typeof globalThis !== "undefined" ? globalThis.translations : null) || {};
  let translation = translations[key] !== void 0 ? translations[key] : key;
  Object.keys(replace).forEach(function(k) {
    translation = translation.replace(new RegExp(":" + k, "g"), replace[k]);
  });
  return translation;
}
function useTrans() {
  const { translations = {} } = usePage().props;
  return function t(key, replace = {}) {
    let translation = translations[key] !== void 0 ? translations[key] : key;
    Object.keys(replace).forEach(function(k) {
      translation = translation.replace(new RegExp(":" + k, "g"), replace[k]);
    });
    return translation;
  };
}
export {
  __ as _,
  useTrans as u
};
