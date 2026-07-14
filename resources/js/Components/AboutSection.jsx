import { __ } from '@/Utils/lang'

export default function AboutSection () {
    return (
        <section id='tentang-kami' className='w-full bg-white dark:bg-gray-800 relative z-10'>
            <div className='mx-auto max-w-3xl px-6 py-14 sm:py-20'>
                <div className='w-16 h-1 bg-blue-600 rounded-full mb-5' />

                <h2 className='text-2xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-wide mb-6'>
                    {__('About Us')}
                </h2>

                <div className='space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base'>
                    <p>
                        {__('PPA Mawar Saron Tompasobaru is a child development center operating under Gereja Pantekosta di Indonesia (GPdI), based in Tompasobaru, South Minahasa Regency, North Sulawesi, Indonesia. We run child development programs in partnership with Compassion Indonesia, focusing on education, health, and spiritual development for children in our community.')}
                    </p>
                    <p>
                        {__('Gereja Pantekosta di Indonesia has been officially recognized as a Christian Protestant religious institution under the Decree of the Director General for Christian Protestant Community Guidance, Ministry of Religious Affairs of the Republic of Indonesia, No. 30 of 1988.')}
                    </p>
                    <p>
                        {__('This application, mitra-project.com, was built to support communication and digital services for our congregation, volunteers, and the children in our care.')}
                    </p>
                </div>

                <dl className='mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-200 dark:border-gray-700 pt-6'>
                    <div>
                        <dt className='text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400'>
                            {__('Address')}
                        </dt>
                        <dd className='mt-1 text-sm text-gray-700 dark:text-gray-300'>
                            {__('Jl. Raya Tompasobaru Satu Jaga II, Tompasobaru, South Minahasa Regency, North Sulawesi, 95357, Indonesia')}
                        </dd>
                    </div>
                    <div>
                        <dt className='text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400'>
                            {__('Contact')}
                        </dt>
                        <dd className='mt-1 text-sm text-gray-700 dark:text-gray-300'>
                            <a href='mailto:respon@mitra-project.com' className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                                respon@mitra-project.com
                            </a>
                        </dd>
                    </div>
                </dl>
            </div>
        </section>
    )
}
