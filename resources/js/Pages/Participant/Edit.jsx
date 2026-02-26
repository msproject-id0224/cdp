import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ProfilePhoto from '@/Components/ProfilePhoto';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { __ } from '@/Utils/lang';

export default function ParticipantEdit({ auth, participant }) {

    const { data: photoData, setData: setPhotoData, post: postPhoto, processing: photoProcessing, errors: photoErrors, reset: resetPhoto } = useForm({
        photo: null,
    });

    const submitPhoto = (e) => {
        e.preventDefault();
        postPhoto(route('admin.profile-photos.upload', participant.id), {
            onSuccess: () => resetPhoto(),
        });
    };

    const { data, setData, patch, errors, processing } = useForm({
        first_name: participant.first_name,
        last_name: participant.last_name || '',
        nickname: participant.nickname || '',
        email: participant.email,
        id_number: participant.id_number ? participant.id_number.replace('ID-0224', '') : '',
        date_of_birth: participant.date_of_birth || '',
        age: participant.age || '',
        gender: participant.gender || '',
        education: participant.education || '',
        age_group: participant.age_group || '',
        height: participant.height || '',
        weight: participant.weight || '',
        communication: participant.communication || '',
    });

    const submit = (e) => {
        e.preventDefault();

        patch(route('participants.update', participant.id));
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
                    {__('Edit Participant')}
                </h2>
            }
        >
            <Head title={__('Edit Participant')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium mb-4">{__('Profile Photo')}</h3>
                            <div className="flex flex-col md:flex-row md:items-start md:space-x-6 space-y-4 md:space-y-0">
                                <div className="flex-shrink-0">
                                    <ProfilePhoto 
                                        src={participant.profile_photo_url} 
                                        alt={participant.name} 
                                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700" 
                                        fallbackClassName="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 border-2 border-gray-200 dark:border-gray-700"
                                        fallback={
                                            <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                                                {participant.name.charAt(0).toUpperCase()}
                                            </span>
                                        }
                                    />
                                </div>
                                <div className="flex-grow max-w-xl">
                                    <form onSubmit={submitPhoto}>
                                        <InputLabel htmlFor="photo" value={__('Upload New Photo')} />
                                        <input 
                                            type="file" 
                                            id="photo" 
                                            onChange={e => setPhotoData('photo', e.target.files[0])}
                                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900 dark:file:text-indigo-300"
                                            accept="image/*"
                                        />
                                        <InputError message={photoErrors.photo} className="mt-2" />
                                        <div className="mt-4">
                                            <PrimaryButton disabled={photoProcessing}>{__('Update Photo')}</PrimaryButton>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        <InputLabel htmlFor="gender" value={__('Gender')} />
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
                                        <InputError className="mt-2" message={errors.gender} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="education" value={__('Education')} />
                                        <select
                                            id="education"
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            value={data.education}
                                            onChange={(e) => setData('education', e.target.value)}
                                        >
                                            <option value="">{__('Select Education')}</option>
                                            <option value="Dibawah Umur">{__('Underage')}</option>
                                            <option value="TK">{__('TK')}</option>
                                            <option value="SD">{__('SD')}</option>
                                            <option value="SMP">{__('SMP')}</option>
                                            <option value="SMA">{__('SMA')}</option>
                                            <option value="D3">{__('D3')}</option>
                                            <option value="S1">{__('S1')}</option>
                                        </select>
                                        <InputError className="mt-2" message={errors.education} />
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
                                        <InputLabel htmlFor="height" value={__('Height (cm)')} />
                                        <TextInput
                                            id="height"
                                            type="number"
                                            step="0.01"
                                            className="mt-1 block w-full"
                                            value={data.height}
                                            onChange={(e) => setData('height', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors.height} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="weight" value={__('Weight (kg)')} />
                                        <TextInput
                                            id="weight"
                                            type="number"
                                            step="0.01"
                                            className="mt-1 block w-full"
                                            value={data.weight}
                                            onChange={(e) => setData('weight', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors.weight} />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="communication" value={__('Communication')} />
                                    <textarea
                                        id="communication"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        value={data.communication}
                                        onChange={(e) => setData('communication', e.target.value)}
                                        rows="3"
                                    ></textarea>
                                    <InputError className="mt-2" message={errors.communication} />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>{__('Save')}</PrimaryButton>
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
