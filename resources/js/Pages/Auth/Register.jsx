import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { __ } from '@/Utils/lang';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        id_number: '',
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset(),
        });
    };

    return (
        <GuestLayout>
            <Head title={__('Register')} />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="first_name" value={__('First Name')} />

                    <TextInput
                        id="first_name"
                        name="first_name"
                        value={data.first_name}
                        className="mt-1 block w-full"
                        autoComplete="given-name"
                        isFocused={true}
                        onChange={(e) => setData('first_name', e.target.value)}
                        required
                    />

                    <InputError message={errors.first_name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="last_name" value={__('Last Name')} />

                    <TextInput
                        id="last_name"
                        name="last_name"
                        value={data.last_name}
                        className="mt-1 block w-full"
                        autoComplete="family-name"
                        onChange={(e) => setData('last_name', e.target.value)}
                    />

                    <InputError message={errors.last_name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="id_number" value={__('ID Number')} />

                    <TextInput
                        id="id_number"
                        name="id_number"
                        value={data.id_number}
                        className="mt-1 block w-full"
                        autoComplete="id_number"
                        onChange={(e) => setData('id_number', e.target.value)}
                        required
                    />

                    <InputError message={errors.id_number} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value={__('Email')} />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                    >
                        {__('Already registered?')}
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        {__('Register')}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
