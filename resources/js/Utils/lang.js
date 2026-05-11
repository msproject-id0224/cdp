import { usePage } from '@inertiajs/react';

/**
 * Translate a key using the current locale's translations.
 * Reads from window.translations (set by Inertia on every navigation).
 * Falls back to the key itself if no translation is found.
 */
export function __(key, replace = {}) {
    const translations = window.translations || {};

    let translation = translations[key] !== undefined
        ? translations[key]
        : key;

    Object.keys(replace).forEach(function (k) {
        translation = translation.replace(new RegExp(':' + k, 'g'), replace[k]);
    });

    return translation;
}

/**
 * React hook version of __() — reads translations reactively from Inertia props.
 * Use this in components where locale can change without a full page reload.
 * Returns a `t(key, replace)` function.
 */
export function useTrans() {
    const { translations = {} } = usePage().props;

    return function t(key, replace = {}) {
        let translation = translations[key] !== undefined
            ? translations[key]
            : key;

        Object.keys(replace).forEach(function (k) {
            translation = translation.replace(new RegExp(':' + k, 'g'), replace[k]);
        });

        return translation;
    };
}
