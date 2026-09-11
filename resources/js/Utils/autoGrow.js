/**
 * Grows a textarea's height to fit its content, up to any CSS max-height set on it.
 * Call on mount (via ref) to size pre-filled content, and on every input event
 * to keep growing as the user types.
 */
export function autoGrow(el) {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
}
