import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm, usePage, Link } from '@inertiajs/react'
import InputLabel from '@/Components/InputLabel'
import TextInput from '@/Components/TextInput'
import SelectInput from '@/Components/SelectInput'
import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton'
import InputError from '@/Components/InputError'
import Modal from '@/Components/Modal'
import ProfilePhoto from '@/Components/ProfilePhoto'
import { __ } from '@/Utils/lang'
import { useState } from 'react'

// Module → route mapping (order matches the RMD flow)
const MODULE_CONFIG = [
    { name: 'Profil RMD',             route: 'rmd.profile',                   icon: '📋', desc: 'Data pribadi & tanggal rencana lulus' },
    { name: 'Refleksi Alkitab',       route: 'rmd.what-the-bible-says',        icon: '📖', desc: 'Refleksi firman Tuhan tentang rencana-Nya' },
    { name: 'Sukses Sejati',          route: 'rmd.true-success',               icon: '🏆', desc: 'Definisi & ukuran sukses menurut Alkitab' },
    { name: 'The Only One',           route: 'rmd.the-only-one',               icon: '⭐', desc: 'Keunikan diri, gaya belajar & prestasi akademik' },
    { name: 'Kecerdasan Majemuk',     route: 'rmd.the-only-one-meeting-2',     icon: '🧠', desc: 'Skor kecerdasan majemuk (9 kecerdasan)' },
    { name: 'Sosial Emosional',       route: 'rmd.the-only-one-meeting-3',     icon: '💬', desc: 'Keluarga, aktivitas, fisik & spiritual' },
    { name: 'Eksplorasi Karir',       route: 'rmd.career-exploration',         icon: '🎯', desc: 'Profesi berdasarkan bakat & kecerdasan' },
    { name: 'Eksplorasi Karir P2',    route: 'rmd.career-exploration-p2',      icon: '🏁', desc: 'Pilihan karir final & analisis SWOT' },
    { name: 'Persiapan Pulau Impian', route: 'rmd.preparation-dream-island',   icon: '🏝️', desc: 'Pertanyaan profesi, SWOT & rencana perbaikan' },
]

export default function RmdProfile ({ auth, rmdProfile, graduationPlanDate, rmdProgress, isFirstFill }) {
    const user = auth.user
    usePage()
    const [isEditing, setIsEditing] = useState(false)
    const [modalState, setModalState] = useState({
        show: false,
        type: 'success', // 'success' or 'error'
        title: '',
        message: ''
    })

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        date_of_birth: user.date_of_birth 
            ? user.date_of_birth.split('T')[0] 
            : (user.age ? new Date(new Date().setFullYear(new Date().getFullYear() - user.age)).toISOString().split('T')[0] : ''),
        gender: user.gender || '',
        profile_photo: null,
        first_filled_at: rmdProfile?.first_filled_at
            ? String(rmdProfile.first_filled_at).split('T')[0]
            : new Date().toISOString().split('T')[0],
        first_filled_age: rmdProfile?.first_filled_age || user.age || '',
        first_filled_education:
            rmdProfile?.first_filled_education || user.education || '',
        first_filled_education_institution:
            rmdProfile?.first_filled_education_institution || ''
    })

    const [photoPreview, setPhotoPreview] = useState(user.profile_photo_url)

    const handlePhotoChange = e => {
        const file = e.target.files[0]
        setData('profile_photo', file)
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPhotoPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const submit = e => {
        e.preventDefault()

        // Remove browser confirmation
        // if (!confirm(__('Are you sure you want to save these profile changes?'))) {
        //     return;
        // }

        post(route('rmd.profile.store'), {
            forceFormData: true,
            onSuccess: () => {
                setIsEditing(false)
                setModalState({
                    show: true,
                    type: 'success',
                    title: __('RMD_PROFILE_SUCCESS_TITLE'),
                    message: __('RMD_PROFILE_SUCCESS_MSG')
                })
            },
            onError: () => {
                setModalState({
                    show: true,
                    type: 'error',
                    title: __('RMD_PROFILE_ERROR_TITLE'),
                    message: __('RMD_PROFILE_ERROR_MSG')
                })
            }
        })
    }

    const closeModal = () => {
        setModalState(prev => ({ ...prev, show: false }))
    }

    const cancelEdit = () => {
        reset()
        setPhotoPreview(user.profile_photo_url)
        setIsEditing(false)
    }

    const formatDate = dateString => {
        if (!dateString) return '-'
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    // Calculate graduation plan date dynamically based on DOB input
    const dynamicGraduationDate = data.date_of_birth
        ? new Date(
              new Date(data.date_of_birth).setFullYear(
                  new Date(data.date_of_birth).getFullYear() + 21
              )
          )
        : graduationPlanDate
        ? new Date(graduationPlanDate)
        : null

    const InfoRow = ({ label, value }) => (
        <div className='py-2 border-b border-gray-100 dark:border-gray-700 last:border-0'>
            <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                {label}
            </dt>
            <dd className='mt-1 text-sm text-gray-900 dark:text-gray-100 font-semibold'>
                {value || '-'}
            </dd>
        </div>
    )

    return (
        <AuthenticatedLayout
            user={user}
            header={
                <h2 className='font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight'>
                    {__('RMD_PROFILE_TITLE')}
                </h2>
            }
        >
            <Head title={__('RMD_PROFILE_TITLE')} />

            <div className='py-12'>
                <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                    {/* Flash Message removed here as it will be shown in modal */}

                    <div className='bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg'>
                        <div className='p-6 text-gray-900 dark:text-gray-100'>
                            <div className='flex justify-between items-start mb-6'>
                                <div>
                                    <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                                        {__('RMD_PROFILE_TITLE').toUpperCase()}
                                    </h3>
                                    <p className='mt-1 text-sm text-gray-600 dark:text-gray-400 max-w-xl'>
                                        {__('RMD_PROFILE_SUBTITLE')}
                                    </p>
                                </div>
                                {!isEditing && (
                                    <PrimaryButton
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            className='h-4 w-4 mr-2'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            stroke='currentColor'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
                                            />
                                        </svg>
                                        {__('RMD_PROFILE_EDIT')}
                                    </PrimaryButton>
                                )}
                            </div>

                            {isEditing ? (
                                <form
                                    onSubmit={submit}
                                    className='space-y-6 animate-fade-in-up'
                                >
                                    {/* Edit Mode */}

                                    {/* Profile Photo */}
                                    <div className='flex flex-col items-center mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                                        <div className='relative w-32 h-32 mb-4 group'>
                                            <ProfilePhoto
                                                key={photoPreview} // Reset state when preview changes
                                                src={photoPreview}
                                                alt={__('RMD_PROFILE_TITLE')}
                                                className='w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-600 shadow-lg'
                                                fallbackClassName='w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 text-4xl font-bold border-4 border-white dark:border-gray-600 shadow-lg'
                                                fallback={(user.name || 'U')
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            />
                                            <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                                                <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    className='h-8 w-8 text-white'
                                                    fill='none'
                                                    viewBox='0 0 24 24'
                                                    stroke='currentColor'
                                                >
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        strokeWidth={2}
                                                        d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
                                                    />
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        strokeWidth={2}
                                                        d='M15 13a3 3 0 11-6 0 3 3 0 016 0z'
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <label
                                            htmlFor='profile_photo'
                                            className='cursor-pointer text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium text-sm'
                                        >
                                            {__('RMD_PROFILE_CHANGE_PHOTO')}
                                        </label>
                                        <input
                                            type='file'
                                            id='profile_photo'
                                            onChange={handlePhotoChange}
                                            className='hidden'
                                            accept='image/*'
                                        />
                                        <InputError
                                            message={errors.profile_photo}
                                            className='mt-2'
                                        />
                                    </div>

                                    {/* Personal Data Form */}
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        <div>
                                            <InputLabel
                                                htmlFor='first_name'
                                                value={__(
                                                    'RMD_PROFILE_FIRST_NAME'
                                                )}
                                            />
                                            <TextInput
                                                id='first_name'
                                                value={data.first_name}
                                                onChange={e =>
                                                    setData(
                                                        'first_name',
                                                        e.target.value
                                                    )
                                                }
                                                className='mt-1 block w-full'
                                                required
                                            />
                                            <InputError
                                                message={errors.first_name}
                                                className='mt-2'
                                            />
                                        </div>
                                        <div>
                                            <InputLabel
                                                htmlFor='last_name'
                                                value={__(
                                                    'RMD_PROFILE_LAST_NAME'
                                                )}
                                            />
                                            <TextInput
                                                id='last_name'
                                                value={data.last_name}
                                                onChange={e =>
                                                    setData(
                                                        'last_name',
                                                        e.target.value
                                                    )
                                                }
                                                className='mt-1 block w-full'
                                            />
                                            <InputError
                                                message={errors.last_name}
                                                className='mt-2'
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor='email'
                                            value={__('RMD_PROFILE_EMAIL')}
                                        />
                                        <TextInput
                                            id='email'
                                            type='email'
                                            value={data.email}
                                            className='mt-1 block w-full bg-gray-100 cursor-not-allowed'
                                            readOnly
                                            disabled
                                        />
                                        <p className='text-xs text-gray-500 mt-1'>
                                            {__('RMD_PROFILE_EMAIL_LOCKED')}
                                        </p>
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor='phone_number'
                                            value={__('RMD_PROFILE_PHONE')}
                                        />
                                        <TextInput
                                            id='phone_number'
                                            value={data.phone_number}
                                            onChange={e =>
                                                setData(
                                                    'phone_number',
                                                    e.target.value
                                                )
                                            }
                                            className='mt-1 block w-full'
                                        />
                                        <InputError
                                            message={errors.phone_number}
                                            className='mt-2'
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor='address'
                                            value={__('RMD_PROFILE_ADDRESS')}
                                        />
                                        <TextInput
                                            id='address'
                                            value={data.address}
                                            onChange={e =>
                                                setData(
                                                    'address',
                                                    e.target.value
                                                )
                                            }
                                            className='mt-1 block w-full'
                                        />
                                        <InputError
                                            message={errors.address}
                                            className='mt-2'
                                        />
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        <div>
                                            <InputLabel
                                                htmlFor='date_of_birth'
                                                value={__('RMD_PROFILE_DOB')}
                                            />
                                            <TextInput
                                                id='date_of_birth'
                                                type='date'
                                                value={data.date_of_birth}
                                                className='mt-1 block w-full bg-gray-100 cursor-not-allowed'
                                                readOnly
                                                disabled
                                            />
                                            <p className='text-xs text-gray-500 mt-1'>
                                                {__('RMD_PROFILE_DOB_LOCKED')}
                                            </p>
                                        </div>
                                        <div>
                                            <InputLabel
                                                htmlFor='gender'
                                                value={__('RMD_PROFILE_GENDER')}
                                            />
                                            <SelectInput
                                                id='gender'
                                                value={data.gender}
                                                onChange={e =>
                                                    setData(
                                                        'gender',
                                                        e.target.value
                                                    )
                                                }
                                                className='mt-1 block w-full'
                                            >
                                                <option value=''>
                                                    {__(
                                                        'RMD_PROFILE_SELECT_GENDER'
                                                    )}
                                                </option>
                                                <option value='Male'>
                                                    {__('RMD_PROFILE_MALE')}
                                                </option>
                                                <option value='Female'>
                                                    {__('RMD_PROFILE_FEMALE')}
                                                </option>
                                            </SelectInput>
                                            <InputError
                                                message={errors.gender}
                                                className='mt-2'
                                            />
                                        </div>
                                    </div>

                                    <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-100 dark:border-blue-800'>
                                        <InputLabel
                                            value={__(
                                                'RMD_PROFILE_GRADUATION_DATE'
                                            )}
                                            className='text-blue-800 dark:text-blue-300'
                                        />
                                        <div className='mt-1 text-lg font-bold text-blue-900 dark:text-blue-200'>
                                            {dynamicGraduationDate
                                                ? formatDate(
                                                      dynamicGraduationDate.toISOString()
                                                  )
                                                : '-'}
                                        </div>
                                        <p className='mt-1 text-xs text-blue-600 dark:text-blue-400'>
                                            {__('RMD_PROFILE_AUTO_CALC')}
                                        </p>
                                    </div>

                                    <div className='border-t border-gray-200 dark:border-gray-700 pt-6'>
                                        <h4 className='font-semibold text-lg text-gray-800 dark:text-gray-200 mb-4'>
                                            {__('RMD_PROFILE_INITIAL_ENTRY')}
                                        </h4>

                                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                            {/* Tanggal Pengisian — terkunci setelah pertama kali diisi */}
                                            <div>
                                                <InputLabel htmlFor='first_filled_at' value={__('RMD_PROFILE_ENTRY_DATE')} />
                                                <TextInput
                                                    id='first_filled_at'
                                                    type='date'
                                                    value={data.first_filled_at}
                                                    onChange={e => isFirstFill && setData('first_filled_at', e.target.value)}
                                                    className={`mt-1 block w-full ${!isFirstFill ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''}`}
                                                    readOnly={!isFirstFill}
                                                    disabled={!isFirstFill}
                                                />
                                                {!isFirstFill && (
                                                    <p className='mt-1 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1'>
                                                        <svg className='w-3 h-3 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                                                        </svg>
                                                        {__('Tidak dapat diubah')}
                                                    </p>
                                                )}
                                                <InputError message={errors.first_filled_at} className='mt-2' />
                                            </div>

                                            {/* Usia saat mengisi */}
                                            <div>
                                                <InputLabel htmlFor='first_filled_age' value={__('RMD_PROFILE_AGE')} />
                                                <TextInput
                                                    id='first_filled_age'
                                                    type='number'
                                                    value={data.first_filled_age}
                                                    onChange={e => setData('first_filled_age', e.target.value)}
                                                    className='mt-1 block w-full'
                                                />
                                                <InputError message={errors.first_filled_age} className='mt-2' />
                                            </div>

                                            {/* Pendidikan */}
                                            <div>
                                                <InputLabel htmlFor='first_filled_education' value={__('RMD_PROFILE_EDUCATION')} />
                                                <SelectInput
                                                    id='first_filled_education'
                                                    value={data.first_filled_education}
                                                    onChange={e => setData('first_filled_education', e.target.value)}
                                                    className='mt-1 block w-full'
                                                >
                                                    <option value=''>{__('RMD_PROFILE_SELECT_EDUCATION')}</option>
                                                    <option value='SD'>SD</option>
                                                    <option value='SMP'>SMP</option>
                                                    <option value='SMA'>SMA / SMK</option>
                                                    <option value='D1'>D1</option>
                                                    <option value='D2'>D2</option>
                                                    <option value='D3'>D3</option>
                                                    <option value='S1'>S1 / D4</option>
                                                </SelectInput>
                                                <InputError message={errors.first_filled_education} className='mt-2' />
                                            </div>
                                        </div>

                                        {/* Institusi Pendidikan — selalu tampil, selalu bisa diedit */}
                                        <div className='mt-4'>
                                            <InputLabel htmlFor='first_filled_education_institution' value={__('RMD_PROFILE_EDU_INSTITUTION')} />
                                            <TextInput
                                                id='first_filled_education_institution'
                                                value={data.first_filled_education_institution}
                                                onChange={e => setData('first_filled_education_institution', e.target.value)}
                                                className='mt-1 block w-full'
                                                placeholder={__('Contoh: Unsrat, Unima / Politeknik Negeri Manado / dll')}
                                            />
                                            <InputError message={errors.first_filled_education_institution} className='mt-2' />
                                        </div>
                                    </div>

                                    <div className='flex items-center justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700'>
                                        <SecondaryButton
                                            onClick={cancelEdit}
                                            disabled={processing}
                                        >
                                            {__('RMD_PROFILE_CANCEL')}
                                        </SecondaryButton>
                                        <PrimaryButton
                                            disabled={processing}
                                            className={
                                                processing
                                                    ? 'opacity-75 cursor-wait'
                                                    : ''
                                            }
                                        >
                                            {processing && (
                                                <svg
                                                    className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    fill='none'
                                                    viewBox='0 0 24 24'
                                                >
                                                    <circle
                                                        className='opacity-25'
                                                        cx='12'
                                                        cy='12'
                                                        r='10'
                                                        stroke='currentColor'
                                                        strokeWidth='4'
                                                    ></circle>
                                                    <path
                                                        className='opacity-75'
                                                        fill='currentColor'
                                                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                                    ></path>
                                                </svg>
                                            )}
                                            {__('RMD_PROFILE_SAVE')}
                                        </PrimaryButton>
                                    </div>
                                </form>
                            ) : (
                                <div className='space-y-8 animate-fade-in-up'>
                                    {/* View Mode */}

                                    {/* Profile Header */}
                                    <div className='flex flex-col md:flex-row items-center md:items-start md:space-x-8 pb-8 border-b border-gray-100 dark:border-gray-700'>
                                        <div className='relative w-32 h-32 mb-4 md:mb-0'>
                                            <ProfilePhoto
                                                src={user.profile_photo_url}
                                                alt={user.name}
                                                className='w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-600 shadow-lg'
                                                fallbackClassName='w-full h-full rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-500 dark:text-indigo-300 flex items-center justify-center text-4xl font-bold border-4 border-white dark:border-gray-600 shadow-lg'
                                                fallback={(user.name || 'U')
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            />
                                        </div>
                                        <div className='text-center md:text-left flex-1'>
                                            <h4 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                                {user.name}
                                            </h4>
                                            <p className='text-indigo-600 dark:text-indigo-400 font-medium mb-2'>
                                                {user.email}
                                            </p>
                                            <div className='flex flex-wrap justify-center md:justify-start gap-2'>
                                                <span className='px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium'>
                                                    {user.gender || '-'}
                                                </span>
                                                <span className='px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium'>
                                                    {user.age
                                                        ? `${user.age} ${__(
                                                              'Years Old'
                                                          )}`
                                                        : '-'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8'>
                                        <div>
                                            <h5 className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 border-b pb-2'>
                                                {__('Personal Information')}
                                            </h5>
                                            <dl>
                                                <InfoRow
                                                    label={__(
                                                        'RMD_PROFILE_FIRST_NAME'
                                                    )}
                                                    value={user.first_name}
                                                />
                                                <InfoRow
                                                    label={__(
                                                        'RMD_PROFILE_LAST_NAME'
                                                    )}
                                                    value={user.last_name}
                                                />
                                                <InfoRow
                                                    label={__(
                                                        'RMD_PROFILE_PHONE'
                                                    )}
                                                    value={user.phone_number}
                                                />
                                                <InfoRow
                                                    label={__(
                                                        'RMD_PROFILE_ADDRESS'
                                                    )}
                                                    value={user.address}
                                                />
                                                <InfoRow
                                                    label={__(
                                                        'RMD_PROFILE_DOB'
                                                    )}
                                                    value={formatDate(
                                                        user.date_of_birth
                                                    )}
                                                />
                                            </dl>
                                        </div>

                                        <div>
                                            <div className='flex items-center gap-2 mb-4 border-b pb-2'>
                                                <h5 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
                                                    {__('RMD_PROFILE_INITIAL_ENTRY')}
                                                </h5>
                                                {rmdProfile?.first_filled_at && (
                                                    <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'>
                                                        <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                                                        </svg>
                                                        {__('Terkunci')}
                                                    </span>
                                                )}
                                            </div>
                                            <dl>
                                                <InfoRow
                                                    label={__('RMD_PROFILE_ENTRY_DATE')}
                                                    value={formatDate(rmdProfile?.first_filled_at)}
                                                />
                                                <InfoRow
                                                    label={__('RMD_PROFILE_AGE')}
                                                    value={rmdProfile?.first_filled_age ? `${rmdProfile.first_filled_age} tahun` : null}
                                                />
                                                <InfoRow
                                                    label={__('RMD_PROFILE_EDUCATION')}
                                                    value={rmdProfile?.first_filled_education}
                                                />
                                                <InfoRow
                                                    label={__('RMD_PROFILE_EDU_INSTITUTION')}
                                                    value={rmdProfile?.first_filled_education_institution}
                                                />
                                                <InfoRow
                                                    label={__('RMD_PROFILE_GRADUATION_DATE')}
                                                    value={formatDate(graduationPlanDate)}
                                                />
                                            </dl>
                                        </div>
                                    </div>

                                    {/* Navigation Button */}
                                    <div className='flex justify-end pt-8 border-t border-gray-100 dark:border-gray-700 mt-8'>
                                        <Link
                                            href={route('rmd.gods-purpose')}
                                            className='inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150'
                                        >
                                            {__('RMD_PROFILE_NEXT')} &raquo;
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── RMD Module Checklist ─────────────────────────────────────── */}
            {rmdProgress && (
                <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8'>
                    <div className='bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg'>
                        <div className='p-6'>
                            {/* Header */}
                            <div className='flex items-center justify-between mb-5'>
                                <div>
                                    <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                                        {__('Checklist Pengisian RMD')}
                                    </h3>
                                    <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                                        {__('Lengkapi semua modul di bawah ini untuk menyelesaikan RMD kamu')}
                                    </p>
                                </div>
                                {/* Overall progress badge */}
                                {(() => {
                                    const done  = rmdProgress.filter(m => m.percentage === 100).length
                                    const total = rmdProgress.length
                                    const pct   = Math.round((done / total) * 100)
                                    return (
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                            pct === 100
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                : pct > 0
                                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                                : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                                        }`}>
                                            {done}/{total} {__('modul selesai')}
                                        </span>
                                    )
                                })()}
                            </div>

                            {/* Overall progress bar */}
                            {(() => {
                                const pct = Math.round(
                                    (rmdProgress.filter(m => m.percentage === 100).length / rmdProgress.length) * 100
                                )
                                return (
                                    <div className='mb-5'>
                                        <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                                            <div
                                                className={`h-2 rounded-full transition-all ${pct === 100 ? 'bg-green-500' : 'bg-indigo-500'}`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <p className='text-right text-xs text-gray-400 mt-1'>{pct}%</p>
                                    </div>
                                )
                            })()}

                            {/* Module rows */}
                            <div className='space-y-2'>
                                {MODULE_CONFIG.map((mod, idx) => {
                                    const prog = rmdProgress.find(m => m.name === mod.name)
                                    const pct  = prog?.percentage ?? 0
                                    const done = pct === 100
                                    const started = pct > 0 && pct < 100

                                    return (
                                        <Link
                                            key={mod.name}
                                            href={route(mod.route)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors group ${
                                                done
                                                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
                                                    : started
                                                    ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                                                    : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                            }`}
                                        >
                                            {/* Step number / check */}
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                                                done    ? 'bg-green-500 text-white'
                                                : started ? 'bg-yellow-400 text-white'
                                                : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300'
                                            }`}>
                                                {done ? (
                                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M5 13l4 4L19 7' />
                                                    </svg>
                                                ) : idx + 1}
                                            </div>

                                            {/* Icon + text */}
                                            <span className='text-xl shrink-0'>{mod.icon}</span>
                                            <div className='flex-1 min-w-0'>
                                                <p className={`text-sm font-semibold truncate ${
                                                    done ? 'text-green-800 dark:text-green-200'
                                                    : started ? 'text-yellow-800 dark:text-yellow-200'
                                                    : 'text-gray-700 dark:text-gray-200'
                                                }`}>
                                                    {mod.name}
                                                </p>
                                                <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>{mod.desc}</p>
                                            </div>

                                            {/* Progress pill */}
                                            <div className='shrink-0 flex items-center gap-2'>
                                                {started && (
                                                    <div className='w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5'>
                                                        <div className='h-1.5 rounded-full bg-yellow-400' style={{ width: `${pct}%` }} />
                                                    </div>
                                                )}
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                                    done    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                    : started ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                                    : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                                                }`}>
                                                    {done ? __('Selesai') : started ? `${pct}%` : __('Belum Diisi')}
                                                </span>
                                                <svg className='w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7' />
                                                </svg>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Modal show={modalState.show} onClose={closeModal}>
                <div className='p-6'>
                    <div
                        className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
                            modalState.type === 'success'
                                ? 'bg-green-100'
                                : 'bg-red-100'
                        } mb-4`}
                    >
                        {modalState.type === 'success' ? (
                            <svg
                                className='h-6 w-6 text-green-600'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M5 13l4 4L19 7'
                                />
                            </svg>
                        ) : (
                            <svg
                                className='h-6 w-6 text-red-600'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M6 18L18 6M6 6l12 12'
                                />
                            </svg>
                        )}
                    </div>
                    <h2 className='text-lg font-medium text-gray-900 dark:text-gray-100 text-center mb-2'>
                        {modalState.title}
                    </h2>
                    <p className='text-sm text-gray-500 dark:text-gray-400 text-center mb-6'>
                        {modalState.message}
                    </p>
                    <div className='flex justify-center'>
                        <PrimaryButton onClick={closeModal}>
                            {__('OK')}
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    )
}
