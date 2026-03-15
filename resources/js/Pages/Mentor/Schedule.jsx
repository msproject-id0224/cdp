import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import MentorScheduleTab from '@/Components/Dashboard/MentorScheduleTab';
import { __ } from '@/Utils/lang';

export default function Schedule({ auth }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {__('Schedule Management')}
                </h2>
            }
        >
            <Head title={__('Schedule Management')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <MentorScheduleTab />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
