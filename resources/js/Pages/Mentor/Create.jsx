import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { __ } from '@/Utils/lang';

export default function MentorCreate({ auth }) {
    const { data, setData, post, errors, processing } = useForm({
        first_name: '',
        last_name: '',
        nickname: '',
        email: '',
        phone_number: '',
        age: '',
        date_of_birth: '',
        gender: '',
        age_group: '',
        bio: '',
    });

    const [confirmingUserCreation, setConfirmingUserCreation] = useState(false);

    const confirmUserCreation = (e) => {
        e.preventDefault();
        setConfirmingUserCreation(true);
    };

    const createUser = () => {
        post(route('mentors.store'), {
            onSuccess: () => closeModal(),
            onFinish: () => setConfirmingUserCreation(false),
        });
    };

    const closeModal = () => {
        setConfirmingUserCreation(false);
    };

    useEffect(() => {
        if (data.date_of_birth) {
            const birthDate = new Date(data.date_of_birth);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            setData('age', age);
        } else {
            setData('age', '');
        }
    }, [data.date_of_birth]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {__('Create Mentor')}
                </h2>
            }
        >
            <Head title={__('Create Mentor')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={confirmUserCreation} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="first_name" value={__('First Name')} />
                                    <TextInput
                                        id="first_name"
                                        className="mt-1 block w-full"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        required
                                        isFocused
                                        autoComplete="given-name"
                                    />
                                    <InputError className="mt-2" message={errors.first_name} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="last_name" value={__('Last Name')} />
                                    <TextInput
                                        id="last_name"
                                        className="mt-1 block w-full"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        autoComplete="family-name"
                                    />
                                    <InputError className="mt-2" message={errors.last_name} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="nickname" value={__('Nickname')} />
                                    <TextInput
                                        id="nickname"
                                        className="mt-1 block w-full"
                                        value={data.nickname}
                                        onChange={(e) => setData('nickname', e.target.value)}
                                        autoComplete="nickname"
                                    />
                                    <InputError className="mt-2" message={errors.nickname} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="email" value={__('Email')} />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoComplete="username"
                                    />
                                    <InputError className="mt-2" message={errors.email} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="phone_number" value={__('Phone Number')} />
                                    <TextInput
                                        id="phone_number"
                                        type="tel"
                                        className="mt-1 block w-full"
                                        value={data.phone_number}
                                        onChange={(e) => setData('phone_number', e.target.value)}
                                        autoComplete="tel"
                                    />
                                    <InputError className="mt-2" message={errors.phone_number} />
                                </div>
                                
                                <div>
                                    <InputLabel htmlFor="date_of_birth" value={__('Date of Birth')} />
                                    <TextInput
                                        id="date_of_birth"
                                        type="date"
                                        className="mt-1 block w-full"
                                        value={data.date_of_birth}
                                        onChange={(e) => setData('date_of_birth', e.target.value)}
                                    />
                                    <InputError className="mt-2" message={errors.date_of_birth} />
                                </div>
                                
                                <div>
                                    <InputLabel htmlFor="gender" value={__('Gender')} />
                                    <select
                                        id="gender"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        value={data.gender}
                                        onChange={(e) => setData('gender', e.target.value)}
                                    >
                                        <option value="">{__('Select Gender')}</option>
                                        <option value="male">{__('Male')}</option>
                                        <option value="female">{__('Female')}</option>
                                    </select>
                                    <InputError className="mt-2" message={errors.gender} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="age" value={__('Age')} />
                                    <TextInput
                                        id="age"
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={data.age}
                                        onChange={(e) => setData('age', e.target.value)}
                                    />
                                    <InputError className="mt-2" message={errors.age} />
                                </div>
                                
                                <div>
                                    <InputLabel htmlFor="age_group" value={__('Age Group')} />
                                    <select
                                        id="age_group"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        value={data.age_group}
                                        onChange={(e) => setData('age_group', e.target.value)}
                                    >
                                        <option value="">{__('Select Age Group')}</option>
                                        <option value="Survival">{__('Survival')}</option>
                                        <option value="0-2">{__('0-2')}</option>
                                        <option value="3-5">{__('3-5')}</option>
                                        <option value="6-8">{__('6-8')}</option>
                                        <option value="9-11">{__('9-11')}</option>
                                        <option value="12-14">{__('12-14')}</option>
                                        <option value="15-18">{__('15-18')}</option>
                                        <option value="19+">{__('19+')}</option>
                                    </select>
                                    <InputError className="mt-2" message={errors.age_group} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="bio" value={__('Profile Description (Bio)')} />
                                    <textarea
                                        id="bio"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        value={data.bio}
                                        onChange={(e) => setData('bio', e.target.value)}
                                        rows="4"
                                    ></textarea>
                                    <InputError className="mt-2" message={errors.bio} />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>{__('Create')}</PrimaryButton>
                                    <Link
                                        href={route('mentors.index')}
                                        className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                    >
                                        {__('Cancel')}
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={confirmingUserCreation} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {__('Confirm Mentor Creation')}
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {__('Please review the mentor details before adding.')}
                    </p>

                    <div className="mt-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">{__('Full Name')}:</span>
                                <span className="block text-sm text-gray-900 dark:text-gray-100">{data.first_name} {data.last_name}</span>
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">{__('Email')}:</span>
                                <span className="block text-sm text-gray-900 dark:text-gray-100">{data.email}</span>
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">{__('Phone Number')}:</span>
                                <span className="block text-sm text-gray-900 dark:text-gray-100">{data.phone_number || '-'}</span>
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">{__('Status')}:</span>
                                <span className="block text-sm text-green-600 font-semibold">{__('Active')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            {__('Cancel')}
                        </SecondaryButton>

                        <PrimaryButton className="ms-3" disabled={processing} onClick={createUser}>
                            {__('Add Mentor')}
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
