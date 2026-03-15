import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ProfilePhoto from '@/Components/ProfilePhoto';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { __ } from '@/Utils/lang';

export default function MentorEdit({ auth, mentor }) {

    const { data: photoData, setData: setPhotoData, post: postPhoto, processing: photoProcessing, errors: photoErrors, reset: resetPhoto } = useForm({
        photo: null,
    });

    const submitPhoto = (e) => {
        e.preventDefault();
        postPhoto(route('admin.profile-photos.upload', mentor.id), {
            onSuccess: () => resetPhoto(),
        });
    };

    const { data, setData, patch, errors, processing } = useForm({
        first_name: mentor.first_name,
        last_name: mentor.last_name || '',
        nickname: mentor.nickname || '',
        email: mentor.email,
        phone_number: mentor.phone_number || '',
        age: mentor.age || '',
        date_of_birth: mentor.date_of_birth || '',
        gender: mentor.gender || '',
        age_group: mentor.age_group || '',
        specialization: mentor.specialization || '',
        experience: mentor.experience || '',
        bio: mentor.bio || '',
    });

    const submit = (e) => {
        e.preventDefault();

        patch(route('mentors.update', mentor.id));
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
                    {__('Edit Mentor')}
                </h2>
            }
        >
            <Head title={__('Edit Mentor')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium mb-4">{__('Profile Photo')}</h3>
                            <div className="flex flex-col md:flex-row md:items-start md:space-x-6 space-y-4 md:space-y-0">
                                <div className="flex-shrink-0">
                                    <ProfilePhoto 
                                        src={mentor.profile_photo_url} 
                                        alt={mentor.name} 
                                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700" 
                                        fallbackClassName="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 border-2 border-gray-200 dark:border-gray-700"
                                        fallback={
                                            <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                                                {mentor.name.charAt(0).toUpperCase()}
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
                                    <InputLabel htmlFor="specialization" value={__('Specialization')} />
                                    <TextInput
                                        id="specialization"
                                        className="mt-1 block w-full"
                                        value={data.specialization}
                                        onChange={(e) => setData('specialization', e.target.value)}
                                    />
                                    <InputError className="mt-2" message={errors.specialization} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="experience" value={__('Experience')} />
                                    <TextInput
                                        id="experience"
                                        className="mt-1 block w-full"
                                        value={data.experience}
                                        onChange={(e) => setData('experience', e.target.value)}
                                    />
                                    <InputError className="mt-2" message={errors.experience} />
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
                                    <PrimaryButton disabled={processing}>{__('Save')}</PrimaryButton>
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
        </AuthenticatedLayout>
    );
}
