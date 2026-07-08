import { forwardRef, useEffect, useRef } from 'react';
import { autoGrow } from '@/Utils/autoGrow';

export default forwardRef(function TextArea({ className = '', isFocused = false, onInput, ...props }, ref) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
        autoGrow(input.current);
    }, []);

    return (
        <textarea
            {...props}
            className={
                'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm resize max-w-full overflow-hidden ' +
                className
            }
            onInput={(e) => {
                autoGrow(e.target);
                onInput?.(e);
            }}
            ref={input}
        />
    );
});
