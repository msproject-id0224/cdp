import { Link, usePage } from '@inertiajs/react';

export default function Pagination({ links }) {
    const { translations } = usePage().props;

    const __ = (key) => translations?.[key] || key;

    return (
        links.length > 3 && (
            <div className="mb-4">
                <div className="flex flex-wrap mt-8">
                    {links.map((link, key) => {
                        let label = link.label;
                        if (
                            label.includes('&laquo;') || 
                            label.includes('Previous') || 
                            label === 'Previous'
                        ) {
                            label = __('Previous');
                        } else if (
                            label.includes('&raquo;') || 
                            label.includes('Next') || 
                            label === 'Next'
                        ) {
                            label = __('Next');
                        }

                        return link.url === null ? (
                            <div
                                key={key}
                                className="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded"
                                dangerouslySetInnerHTML={{ __html: label }}
                            />
                        ) : (
                            <Link
                                key={key}
                                className={`mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-indigo-500 focus:text-indigo-500 ${
                                    link.active ? 'bg-blue-700 text-white' : 'bg-white text-gray-700'
                                }`}
                                href={link.url}
                                dangerouslySetInnerHTML={{ __html: label }}
                            />
                        );
                    })}
                </div>
            </div>
        )
    );
}
