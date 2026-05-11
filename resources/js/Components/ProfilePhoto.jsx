import { useState } from 'react';

export default function ProfilePhoto({ src, alt, className, fallback, fallbackClassName }) {
    const [error, setError] = useState(false);

    // If src is empty string or null, don't even try to render img
    if (src && !error) {
        return (
            <img 
                src={src} 
                alt={alt} 
                onError={() => setError(true)}
                className={className} 
            />
        );
    }

    return (
        <div className={fallbackClassName || className}>
            {fallback || (
                <span className="text-gray-500 font-bold">
                    {(alt || 'U').charAt(0).toUpperCase()}
                </span>
            )}
        </div>
    );
}
