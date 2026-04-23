import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { __ } from '@/Utils/lang';

export default function ParticipantCreate({ auth }) {
    const { data, setData, post, errors, processing } = useForm({
        first_name: '',
        last_name: '',
        nickname: '',
        email: '',
        id_number: '',
        date_of_birth: '',
        age: '',
        gender: '',
        education: '',
        education_institution: '',
        age_group: '',
        height: '',
        weight: '',
        communication: '',
    });

    // Check if either ID Number or First Name is filled
    const isFormEnabled = data.id_number.trim().length > 0 || data.first_name.trim().length > 0;

    const submit = (e) => {
        e.preventDefault();

        post(route('participants.store'));
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

    // Helper component for disabled wrapper
    const DisabledWrapper = ({ children, enabled }) => {
        if (enabled) return children;
        return (
            <div className="relative group cursor-not-allowed">
                <div className="opacity-50 pointer-events-none">
                    {children}
                </div>
                {/* Visual Indicator / Tooltip */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 text-center z-10">
                    {__('Isi ID Partisipan atau Nama terlebih dahulu untuk membuka field ini.')}
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {__('Create Participant')}
                </h2>
            }
        >
            <Head title={__('Create Participant')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={submit} className="space-y-6">

                                <div>
                                    <InputLabel htmlFor="id_number" value={__('ID Number')} />
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <span className="inline-flex items-center px-5 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 whitespace-nowrap">
                                            ID-0224
                                        </span>
                                        <TextInput
                                            id="id_number"
                                            className="block w-full rounded-none rounded-r-md"
                                            value={data.id_number}
                                            onChange={(e) => setData('id_number', e.target.value)}
                                            autoComplete="id_number"
                                        />
                                    </div>
                                    <InputError className="mt-2" message={errors.id_number} />
                                </div>
                                
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
                                    <DisabledWrapper enabled={isFormEnabled}>
                                        <TextInput
                                            id="last_name"
                                            className="mt-1 block w-full"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            autoComplete="family-name"
                                        />
                                    </DisabledWrapper>
                                    <InputError className="mt-2" message={errors.last_name} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="nickname" value={__('Nickname')} />
                                    <DisabledWrapper enabled={isFormEnabled}>
                                        <TextInput
                                            id="nickname"
                                            className="mt-1 block w-full"
                                            value={data.nickname}
                                            onChange={(e) => setData('nickname', e.target.value)}
                                            autoComplete="nickname"
                                        />
                                    </DisabledWrapper>
                                    <InputError className="mt-2" message={errors.nickname} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="email" value={__('Email')} />
                                    <DisabledWrapper enabled={isFormEnabled}>
                                        <TextInput
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                            autoComplete="username"
                                        />
                                    </DisabledWrapper>
                                    <InputError className="mt-2" message={errors.email} />
                                </div>

                            

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="date_of_birth" value={__('Date of Birth')} />
                                        <DisabledWrapper enabled={isFormEnabled}>
                                            <TextInput
                                                id="date_of_birth"
                                                type="date"
                                                className="mt-1 block w-full"
                                                value={data.date_of_birth}
                                                onChange={(e) => setData('date_of_birth', e.target.value)}
                                            />
                                        </DisabledWrapper>
                                        <InputError className="mt-2" message={errors.date_of_birth} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="age" value={__('Age')} />
                                        <DisabledWrapper enabled={isFormEnabled}>
                                            <TextInput
                                                id="age"
                                                type="number"
                                                className="mt-1 block w-full"
                                                value={data.age}
                                                onChange={(e) => setData('age', e.target.value)}
                                            />
                                        </DisabledWrapper>
                                        <InputError className="mt-2" message={errors.age} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="gender" value={__('Gender')} />
                                        <DisabledWrapper enabled={isFormEnabled}>
                                            <select
                                                id="gender"
                                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                                value={data.gender}
                                                onChange={(e) => setData('gender', e.target.value)}
                                            >
                                                <option value="">{__('Select Gender')}</option>
                                                <option value="Laki-laki">{__('Male')}</option>
                                                <option value="Perempuan">{__('Female')}</option>
                                            </select>
                                        </DisabledWrapper>
                                        <InputError className="mt-2" message={errors.gender} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="education" value={__('Education')} />
                                        <DisabledWrapper enabled={isFormEnabled}>
                                            <select
                                                id="education"
                                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                                value={data.education}
                                                onChange={(e) => setData('education', e.target.value)}
                                            >
                                                <option value="">{__('Select Education')}</option>
                                                <option value="SD">{__('SD')}</option>
                                                <option value="SMP">{__('SMP')}</option>
                                                <option value="SMK">{__('SMK')}</option>
                                                <option value="D1">{__('D1')}</option>
                                                <option value="D2">{__('D2')}</option>
                                                <option value="D3">{__('D3')}</option>
                                                <option value="S1">{__('S1')}</option>
                                                <option value="S1/D4">{__('S1/D4')}</option>
                                            </select>
                                        </DisabledWrapper>
                                        <InputError className="mt-2" message={errors.education} />
                                    </div>

                                    {isFormEnabled && (data.education === 'S1' || data.education === 'S1/D4') && (
                                        <div>
                                            <InputLabel htmlFor="education_institution" value={__('University / Institute')} />
                                            <TextInput
                                                id="education_institution"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.education_institution}
                                                onChange={(e) => setData('education_institution', e.target.value)}
                                                placeholder={__('e.g., Universitas Indonesia / Politeknik Negeri Bandung')}
                                            />
                                            <InputError className="mt-2" message={errors.education_institution} />
                                        </div>
                                    )}

                                    <div>
                                        <InputLabel htmlFor="age_group" value={__('Age Group')} />
                                        <DisabledWrapper enabled={isFormEnabled}>
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
                                        </DisabledWrapper>
                                        <InputError className="mt-2" message={errors.age_group} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="height" value={__('Height (cm)')} />
                                        <DisabledWrapper enabled={isFormEnabled}>
                                            <TextInput
                                                id="height"
                                                type="number"
                                                step="0.01"
                                                className="mt-1 block w-full"
                                                value={data.height}
                                                onChange={(e) => setData('height', e.target.value)}
                                            />
                                        </DisabledWrapper>
                                        <InputError className="mt-2" message={errors.height} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="weight" value={__('Weight (kg)')} />
                                        <DisabledWrapper enabled={isFormEnabled}>
                                            <TextInput
                                                id="weight"
                                                type="number"
                                                step="0.01"
                                                className="mt-1 block w-full"
                                                value={data.weight}
                                                onChange={(e) => setData('weight', e.target.value)}
                                            />
                                        </DisabledWrapper>
                                        <InputError className="mt-2" message={errors.weight} />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="communication" value={__('Communication')} />
                                    <DisabledWrapper enabled={isFormEnabled}>
                                        <textarea
                                            id="communication"
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            value={data.communication}
                                            onChange={(e) => setData('communication', e.target.value)}
                                            rows="3"
                                        ></textarea>
                                    </DisabledWrapper>
                                    <InputError className="mt-2" message={errors.communication} />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>{__('Create')}</PrimaryButton>
                                    <Link
                                        href={route('participants.index')}
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
        </AuthenticatedLayout>
    );
}
