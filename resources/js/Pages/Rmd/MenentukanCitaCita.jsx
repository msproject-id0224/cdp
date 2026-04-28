import React, { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm, Link } from '@inertiajs/react'
import { __ } from '@/Utils/lang'
import PrimaryButton from '@/Components/PrimaryButton'
import { Transition } from '@headlessui/react'

// ─── Profesi per Gaya Belajar ─────────────────────────────────────────────
const LEARNING_STYLE_PROFESSIONS = {
    visual_professions: [
        {
            category: 'Seni & Desain Kreatif',
            items: [
                'Desainer Grafis / UI/UX Designer',
                'Animator / Motion Graphic Designer',
                'Fotografer / Videografer',
                'Ilustrator / Seniman Digital',
                'Fashion Desainer / Stylist',
                'Sutradara Film / Sinematografer'
            ]
        },
        {
            category: 'Arsitektur & Teknik Visual',
            items: [
                'Arsitek / Arsitektur Lansekap',
                'Interior Desainer',
                'Drafter / CAD Engineer',
                'Urban Planner / Perencana Kota'
            ]
        },
        {
            category: 'Sains & Data Visual',
            items: [
                'Analis Data / Data Visualization Specialist',
                'Ahli Radiologi / Sonografer Medis',
                'Kartografer / GIS Specialist',
                'Astronom / Astrofisikawan'
            ]
        },
        {
            category: 'Media & Komunikasi Visual',
            items: [
                'Art Director / Creative Director',
                'Game Designer / Game Developer',
                'Kurator Museum / Sejarawan Seni',
                'Jurnalis Foto / Jurnalis Visual'
            ]
        }
    ],
    auditory_professions: [
        {
            category: 'Pendidikan & Komunikasi',
            items: [
                'Guru / Dosen / Pengajar',
                'Penyiar Radio / Podcaster',
                'Presenter TV / MC / Host',
                'Jurnalis / Reporter Berita'
            ]
        },
        {
            category: 'Hukum & Konseling',
            items: [
                'Pengacara / Advokat / Jaksa',
                'Konselor Psikologi / Terapis Bicara',
                'Penerjemah Lisan / Interpreter',
                'Mediator / Negosiator Konflik'
            ]
        },
        {
            category: 'Seni & Musik',
            items: [
                'Musisi / Penyanyi Profesional',
                'Aktor / Pengisi Suara (Voice Actor)',
                'Komposer / Produser Musik',
                'Guru Musik / Terapis Musik'
            ]
        },
        {
            category: 'Bisnis & Pelayanan',
            items: [
                'Sales Manager / Marketing Komunikasi',
                'Public Speaker / Motivator',
                'Customer Experience Manager',
                'Konsultan SDM / Pelatih Korporat'
            ]
        }
    ],
    kinesthetic_professions_style: [
        {
            category: 'Olahraga & Seni Gerak',
            items: [
                'Atlet Profesional / Pelatih Olahraga',
                'Penari / Koreografer',
                'Personal Trainer / Instruktur Fitness',
                'Instruktur Yoga / Pilates / Martial Arts'
            ]
        },
        {
            category: 'Kesehatan & Medis',
            items: [
                'Dokter Umum / Dokter Bedah',
                'Fisioterapis / Terapis Okupasi',
                'Perawat / Bidan Profesional',
                'Dokter Gigi / Teknisi Gigi'
            ]
        },
        {
            category: 'Teknik & Rekayasa Praktis',
            items: [
                'Mekanik / Teknisi Otomotif',
                'Tukang Kayu / Pengrajin (Craftsman)',
                'Teknisi Listrik / Elektronik',
                'Insinyur Konstruksi / Teknisi Lapangan'
            ]
        },
        {
            category: 'Pangan, Alam & Keselamatan',
            items: [
                'Chef / Koki Profesional / Pastry Chef',
                'Petani Modern / Agripreneur',
                'Ahli Konservasi Alam / Ranger',
                'Petugas Pemadam Kebakaran / Tim SAR'
            ]
        }
    ]
}

// ─── Kecerdasan Majemuk – opsi kemampuan & profesi (Howard Gardner) ───────────
const MI_OPTIONS = {
    linguistic_ability: [
        'Berbicara dan berdebat secara efektif',
        'Menulis kreatif (cerita, puisi, esai)',
        'Membaca kritis dan analitis',
        'Menghafal kosa kata dengan mudah',
        'Mendongeng dan bercerita',
        'Retorika dan persuasi verbal',
        'Menguasai lebih dari satu bahasa',
        'Bermain kata (humor, pantun, puisi)'
    ],
    linguistic_professions: [
        'Penulis / Novelis',
        'Jurnalis / Reporter Berita',
        'Pengacara / Advokat',
        'Guru / Dosen',
        'Penyair / Sastrawan',
        'Penyiar Radio / TV',
        'Pembicara Publik / Motivator',
        'Penerjemah / Interpreter',
        'Editor / Proofreader',
        'Politisi / Diplomat',
        'Komedian / Stand-Up Comedian'
    ],
    logical_math_ability: [
        'Berpikir logis dan kritis',
        'Memahami dan mengoperasikan angka',
        'Memecahkan masalah secara sistematis',
        'Mengenali pola dan urutan',
        'Penalaran abstrak dan deduktif',
        'Merancang eksperimen ilmiah',
        'Analisis dan interpretasi data',
        'Pemrograman dan algoritma'
    ],
    logical_math_professions: [
        'Ilmuwan / Peneliti',
        'Insinyur / Engineer',
        'Akuntan / Auditor Keuangan',
        'Dokter Umum / Spesialis',
        'Ekonom / Analis Keuangan',
        'Programmer / Software Developer',
        'Analis Data / Data Scientist',
        'Matematikawan / Statistikawan',
        'Ahli Farmasi / Apoteker',
        'Ahli Forensik'
    ],
    visual_spatial_ability: [
        'Berpikir tiga dimensi (3D)',
        'Memvisualisasikan objek dan ruang',
        'Membaca peta, diagram, dan grafik',
        'Navigasi dan orientasi arah',
        'Menggambar dan melukis',
        'Memahami proporsi dan perspektif',
        'Imajinasi visual yang kuat',
        'Merakit dan merancang objek'
    ],
    visual_spatial_professions: [
        'Arsitek',
        'Seniman / Pelukis',
        'Desainer Grafis / UI-UX Designer',
        'Desainer Interior',
        'Pilot / Navigator',
        'Fotografer / Videografer',
        'Dokter Bedah / Ahli Radiologi',
        'Perencana Kota / Urban Planner',
        'Kartografer / GIS Specialist',
        'Insinyur Sipil / Konstruksi',
        'Animator / Motion Designer'
    ],
    kinesthetic_ability: [
        'Koordinasi fisik dan motorik halus',
        'Keseimbangan dan kelincahan tubuh',
        'Kekuatan dan stamina fisik',
        'Kontrol gerakan yang presisi',
        'Kreasi dengan tangan (handcraft)',
        'Ekspresi melalui gerakan tubuh',
        'Kemampuan olahraga dan seni bela diri',
        'Kepekaan taktil (sentuhan & tekstur)'
    ],
    kinesthetic_professions: [
        'Atlet Profesional / Pelatih Olahraga',
        'Penari / Koreografer',
        'Aktor / Aktris',
        'Dokter Bedah / Fisioterapis',
        'Mekanik / Teknisi Lapangan',
        'Pengrajin / Craftsman',
        'Chef / Koki Profesional',
        'Instruktur Yoga / Pilates',
        'Ahli Kebugaran / Personal Trainer'
    ],
    musical_ability: [
        'Kepekaan terhadap nada dan melodi',
        'Memainkan instrumen musik',
        'Bernyanyi dengan presisi nada',
        'Menciptakan melodi dan lirik',
        'Membaca dan menulis notasi musik',
        'Kepekaan terhadap ritme dan irama',
        'Mengingat lagu dan melodi dengan mudah',
        'Menganalisis dan mengapresiasi musik'
    ],
    musical_professions: [
        'Musisi / Penyanyi Profesional',
        'Komposer / Penulis Lagu',
        'Konduktor Orkestra',
        'Guru Musik / Terapis Musik',
        'Produser Rekaman / Sound Engineer',
        'DJ / Music Director',
        'Pengisi Soundtrack Film / Game',
        'Kritikus Musik / Jurnalis Musik'
    ],
    interpersonal_ability: [
        'Empati dan memahami perasaan orang lain',
        'Kepekaan terhadap suasana hati',
        'Memimpin dan memotivasi kelompok',
        'Bernegosiasi dan mediasi konflik',
        'Komunikasi verbal dan nonverbal',
        'Membangun hubungan dan jejaring',
        'Bekerja sama dalam tim',
        'Membaca bahasa tubuh orang lain'
    ],
    interpersonal_professions: [
        'Guru / Konselor Sekolah',
        'Psikolog / Psikiater',
        'Manajer / Pemimpin Tim',
        'Politisi / Diplomat',
        'Pekerja Sosial / Relawan',
        'Pemimpin Agama / Rohaniawan',
        'Sales Manager / Marketing',
        'HR Manager / Pelatih Korporat',
        'Event Organizer',
        'Dokter / Perawat'
    ],
    intrapersonal_ability: [
        'Kesadaran diri (self-awareness)',
        'Memahami kekuatan dan kelemahan diri',
        'Regulasi dan pengelolaan emosi',
        'Refleksi diri yang mendalam',
        'Pemahaman nilai dan tujuan hidup',
        'Kemandirian dalam berpikir dan bertindak',
        'Perencanaan karir jangka panjang',
        'Ketahanan mental (resilience)'
    ],
    intrapersonal_professions: [
        'Psikolog / Terapis',
        'Filsuf / Teolog',
        'Penulis / Blogger',
        'Pengusaha / Entrepreneur',
        'Pemimpin Spiritual / Rohaniawan',
        'Konsultan Karir / Life Coach',
        'Peneliti Independen',
        'Ahli Etika / Bioetika'
    ],
    naturalist_ability: [
        'Mengenali dan mengklasifikasikan flora & fauna',
        'Kepekaan terhadap lingkungan alam',
        'Memahami ekosistem dan rantai makanan',
        'Mengamati pola dan perubahan alam',
        'Merawat tanaman dan hewan',
        'Pemahaman geografi dan cuaca alam',
        'Kemampuan survival di alam terbuka',
        'Kepekaan terhadap isu lingkungan hidup'
    ],
    naturalist_professions: [
        'Ahli Biologi / Ekologi',
        'Dokter Hewan / Zoologi',
        'Petani Modern / Agripreneur',
        'Ahli Konservasi Lingkungan',
        'Ranger / Penjaga Hutan',
        'Chef / Ahli Kuliner (Bahan Alam)',
        'Ahli Geologi / Geografi',
        'Peneliti Lingkungan / Klimatologi',
        'Ilmuwan Kelautan / Marine Biologist'
    ]
}
// ─────────────────────────────────────────────────────────────────────────────

const getParsedItems = str => {
    if (!str) return new Set()
    return new Set(
        str
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
    )
}

const toggleItem = (currentStr, item) => {
    const items = getParsedItems(currentStr)
    if (items.has(item)) {
        items.delete(item)
    } else {
        items.add(item)
    }
    return Array.from(items).join(', ')
}

const addCustomItem = (currentStr, customItem) => {
    if (!customItem.trim()) return currentStr
    const items = getParsedItems(currentStr)
    items.add(customItem.trim())
    return Array.from(items).join(', ')
}
// ─── Kecerdasan Majemuk — Howard Gardner ────────────────────────────────────
const MULTIPLE_INTELLIGENCE_DATA = {
    linguistic: {
        abilities: [
            'Membaca dan menulis dengan baik dan cepat',
            'Mudah mengingat kata-kata, kutipan, dan informasi verbal',
            'Pandai bercerita dan menjelaskan ide secara lisan',
            'Peka terhadap makna, ritme, dan bunyi bahasa',
            'Mampu mempelajari bahasa asing dengan mudah',
            'Kemampuan retorika, persuasi, dan debat yang kuat',
            'Suka bermain kata-kata (teka-teki, pantun, puisi)',
            'Mampu menulis dengan gaya dan struktur yang variatif'
        ],
        professions: [
            'Penulis / Novelis / Sastrawan',
            'Jurnalis / Reporter / Editor',
            'Pengacara / Advokat / Jaksa',
            'Guru / Dosen Bahasa / Pengajar',
            'Penyiar / Presenter / Host Acara',
            'Penerjemah / Interpreter / Translator',
            'Politikus / Orator / Juru Bicara',
            'Copywriter / Content Writer / Blogger',
            'Diplomat / Negosiator',
            'Penyair / Penulis Skenario / Script Writer'
        ]
    },
    logical_math: {
        abilities: [
            'Berpikir logis, sistematis, dan analitis',
            'Mampu memecahkan masalah matematika dan sains',
            'Mengenali pola, hubungan, dan sebab-akibat dengan cepat',
            'Berpikir abstrak dan ilmiah',
            'Mampu mengklasifikasikan, mengurutkan, dan mengkategorikan',
            'Menyukai eksperimen, pembuktian logis, dan strategi',
            'Kemampuan kalkulasi dan komputasi yang kuat',
            'Senang dengan teka-teki logika dan permainan strategi'
        ],
        professions: [
            'Ilmuwan / Peneliti / Akademisi',
            'Insinyur / Engineer (Sipil, Mesin, Elektro)',
            'Programmer / Software Developer / Data Scientist',
            'Akuntan / Auditor / Analis Keuangan',
            'Ahli Statistik / Matematikawan / Aktuaris',
            'Dokter / Ahli Medis / Apoteker',
            'Ekonom / Analis Bisnis / Konsultan Strategi',
            'Detektif / Investigator / Kriminolog',
            'Arsitek / Perencana Kota / Quantity Surveyor',
            'Trader / Analis Investasi / Manajer Risiko'
        ]
    },
    visual_spatial: {
        abilities: [
            'Berpikir dalam bentuk gambar, peta, dan diagram',
            'Orientasi ruang dan navigasi yang kuat',
            'Mampu membayangkan objek dalam tiga dimensi',
            'Peka terhadap warna, garis, bentuk, dan komposisi',
            'Mudah membaca peta, grafik, dan ilustrasi teknis',
            'Mampu memvisualisasikan perubahan dan transformasi',
            'Kepekaan estetika dan seni visual yang tinggi',
            'Pandai menggambar, merancang, dan mendekorasi'
        ],
        professions: [
            'Arsitek / Desainer Interior / Urban Planner',
            'Desainer Grafis / UI/UX Designer / Motion Designer',
            'Pilot / Navigator / Kapten Kapal',
            'Pelukis / Seniman / Ilustrator',
            'Ahli Radiologi / Dokter Bedah',
            'Insinyur / Drafter / CAD Engineer',
            'Fotografer / Videografer / Sinematografer',
            'Animator / Game Designer / 3D Artist',
            'Kartografer / GIS Specialist / Geomatics Engineer',
            'Ahli Geologi / Astronomer / Oseanograf'
        ]
    },
    kinesthetic: {
        abilities: [
            'Mengontrol gerakan tubuh dengan presisi dan kelincahan',
            'Belajar paling efektif melalui praktik langsung (hands-on)',
            'Koordinasi fisik dan keseimbangan yang sangat baik',
            'Peka terhadap sentuhan, tekstur, dan sensasi fisik',
            'Mampu memanipulasi objek dengan keterampilan tangan',
            'Mengekspresikan diri melalui gerakan dan tari',
            'Ketangkasan, refleks cepat, dan reaksi fisik yang baik',
            'Ketahanan fisik dan stamina yang kuat'
        ],
        professions: [
            'Atlet Profesional / Olahragawan / Pelatih Olahraga',
            'Penari / Koreografer / Instruktur Seni Gerak',
            'Dokter Bedah / Dokter Gigi / Bidan Profesional',
            'Pengrajin / Seniman Pahat / Tukang Kayu',
            'Aktor / Performer / Seniman Pertunjukan',
            'Fisioterapis / Terapis Okupasi / Chiropractor',
            'Mekanik / Teknisi Otomotif / Insinyur Lapangan',
            'Chef / Koki Profesional / Pastry Chef',
            'Personal Trainer / Instruktur Fitness / Yoga',
            'Petugas Pemadam Kebakaran / Tim SAR / Tentara'
        ]
    },
    musical: {
        abilities: [
            'Peka terhadap ritme, nada, melodi, dan harmoni musik',
            'Mudah mengenali dan mereproduksi pola-pola musik',
            'Mampu bernyanyi atau memainkan alat musik dengan baik',
            'Memahami struktur, teori, dan komposisi musik',
            'Kemampuan membedakan suara, irama, dan pitch dengan akurat',
            'Mengingat informasi lebih mudah melalui lagu atau musik',
            'Mampu menciptakan dan menyusun komposisi musik',
            'Kepekaan emosional yang tinggi terhadap ekspresi musikal'
        ],
        professions: [
            'Musisi / Penyanyi Profesional',
            'Komposer / Arranger / Produser Musik',
            'Guru Musik / Instruktur Vokal / Instruktur Alat Musik',
            'Sound Engineer / Audio Engineer / Music Producer',
            'Terapis Musik / Music Therapist',
            'Konduktor Orkestra / Dirigen',
            'Penyiar Radio / DJ / Podcaster',
            'Pengisi Suara / Voice Actor / Dubber',
            'Kritikus Musik / Musikolog / Jurnalis Musik',
            'Game Audio Designer / Komposer Soundtrack Film'
        ]
    },
    interpersonal: {
        abilities: [
            'Memahami perasaan, motivasi, dan kebutuhan orang lain',
            'Berkomunikasi secara efektif dan persuasif',
            'Berempati tinggi dan mudah membaca emosi',
            'Mampu memimpin, mengorganisasi, dan mempengaruhi orang',
            'Pandai menyelesaikan konflik dan negosiasi',
            'Mampu bekerja sama dalam tim secara harmonis',
            'Mudah bergaul dan membangun jaringan sosial yang luas',
            'Peka terhadap dinamika kelompok dan situasi sosial'
        ],
        professions: [
            'Guru / Konselor / Psikolog',
            'Manajer / Pemimpin Tim / Direktur',
            'Politikus / Diplomat / Juru Bicara',
            'Pekerja Sosial / Konselor Karir',
            'Pengacara / Mediator / Negosiator',
            'Sales Manager / Marketing / Customer Relations',
            'HR Manager / Rekruter / Trainer Korporat',
            'Terapis / Psikiater / Life Coach',
            'Pemimpin Agama / Rohaniawan / Konselor Spiritual',
            'Event Organizer / Public Relations / Brand Strategist'
        ]
    },
    intrapersonal: {
        abilities: [
            'Memahami diri sendiri secara mendalam (kekuatan & kelemahan)',
            'Kemampuan refleksi, introspeksi, dan kesadaran diri yang kuat',
            'Mampu mengatur emosi, motivasi, dan tujuan pribadi',
            'Mandiri dan memiliki disiplin diri yang kuat',
            'Mampu menetapkan visi jangka panjang dan merencanakan',
            'Peka terhadap nilai-nilai, keyakinan, dan prinsip hidup',
            'Mampu bekerja secara mandiri dengan fokus dan konsentrasi tinggi',
            'Kemampuan berpikir mendalam, filosofis, dan reflektif'
        ],
        professions: [
            'Psikolog / Konselor Klinis / Psikoterapis',
            'Filsuf / Penulis / Pemikir',
            'Pengusaha / Entrepreneur / Intrapreneur',
            'Peneliti / Ilmuwan Mandiri',
            'Penulis / Blogger / Content Creator',
            'Rohaniawan / Pemimpin Spiritual / Pendeta',
            'Life Coach / Mentor / Motivator',
            'Seniman / Kreator Independen',
            'Dokter / Ahli Kesehatan Mental / Psikiater',
            'Manajer Proyek / Konsultan Strategi'
        ]
    },
    naturalist: {
        abilities: [
            'Mengenali dan mengklasifikasikan flora, fauna, dan mineral',
            'Kepekaan tinggi terhadap lingkungan alam sekitar',
            'Mengamati pola alam dan perubahan ekosistem',
            'Mampu bertahan dan beradaptasi di lingkungan alam',
            'Kepedulian tinggi terhadap konservasi dan pelestarian alam',
            'Membedakan spesies dan memahami karakteristik makhluk hidup',
            'Kemampuan berkebun, bercocok tanam, dan budidaya',
            'Senang mengeksplorasi alam (hiking, diving, birdwatching)'
        ],
        professions: [
            'Biolog / Ahli Ekologi / Ahli Taksonomi',
            'Dokter Hewan / Veteriner / Konservator Satwa',
            'Petani Modern / Agronome / Ahli Hortikultura',
            'Ahli Lingkungan / Konservasionis / Aktivis Lingkungan',
            'Ahli Botani / Zoologi / Entomologi',
            'Geolog / Oseanograf / Ahli Meteorologi',
            'Ranger / Penjaga Hutan / Taman Nasional',
            'Peneliti Kelautan / Ahli Biologi Laut',
            'Landscape Architect / Ahli Agroforestri',
            'Chef Berbasis Bahan Alam / Ahli Pangan Alami'
        ]
    }
}
// ──────────────────────────────────────────────────────────────────────────────

export default function MenentukanCitaCita ({ auth, careerExploration }) {
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        visual_professions: careerExploration?.visual_professions || '',
        auditory_professions: careerExploration?.auditory_professions || '',
        kinesthetic_professions_style:
            careerExploration?.kinesthetic_professions_style || '',
        interested_professions_from_style:
            careerExploration?.interested_professions_from_style || '',
        linguistic_ability: careerExploration?.linguistic_ability || '',
        linguistic_professions: careerExploration?.linguistic_professions || '',
        logical_math_ability: careerExploration?.logical_math_ability || '',
        logical_math_professions:
            careerExploration?.logical_math_professions || '',
        visual_spatial_ability: careerExploration?.visual_spatial_ability || '',
        visual_spatial_professions:
            careerExploration?.visual_spatial_professions || '',
        kinesthetic_ability: careerExploration?.kinesthetic_ability || '',
        kinesthetic_professions:
            careerExploration?.kinesthetic_professions || '',
        musical_ability: careerExploration?.musical_ability || '',
        musical_professions: careerExploration?.musical_professions || '',
        interpersonal_ability: careerExploration?.interpersonal_ability || '',
        interpersonal_professions:
            careerExploration?.interpersonal_professions || '',
        intrapersonal_ability: careerExploration?.intrapersonal_ability || '',
        intrapersonal_professions:
            careerExploration?.intrapersonal_professions || '',
        naturalist_ability: careerExploration?.naturalist_ability || '',
        naturalist_professions: careerExploration?.naturalist_professions || '',
        consider_learning_style: !!careerExploration?.consider_learning_style,
        consider_intelligence: !!careerExploration?.consider_intelligence,
        consider_academic_achievement:
            !!careerExploration?.consider_academic_achievement,
        consider_parental_support:
            !!careerExploration?.consider_parental_support,
        consider_gods_will: !!careerExploration?.consider_gods_will,
        additional_considerations:
            careerExploration?.additional_considerations || '',
        career_decision_matrix: careerExploration?.career_decision_matrix || [
            { alternative: '', factors: '' },
            { alternative: '', factors: '' },
            { alternative: '', factors: '' }
        ]
    })

    const [customText, setCustomText] = useState({
        visual_professions: '',
        auditory_professions: '',
        kinesthetic_professions_style: ''
    })

    const STYLE_IDS = [
        'visual_professions',
        'auditory_professions',
        'kinesthetic_professions_style'
    ]
    const activeStyle =
        STYLE_IDS.find(id => getParsedItems(data[id]).size > 0) ?? null

    const clearStyle = styleId => {
        setData({
            ...data,
            [styleId]: '',
            interested_professions_from_style: ''
        })
    }

    const [miCustomText, setMiCustomText] = useState({
        linguistic_ability: '',
        linguistic_professions: '',
        logical_math_ability: '',
        logical_math_professions: '',
        visual_spatial_ability: '',
        visual_spatial_professions: '',
        kinesthetic_ability: '',
        kinesthetic_professions: '',
        musical_ability: '',
        musical_professions: '',
        interpersonal_ability: '',
        interpersonal_professions: '',
        intrapersonal_ability: '',
        intrapersonal_professions: '',
        naturalist_ability: '',
        naturalist_professions: ''
    })

    const submit = e => {
        e.preventDefault()
        post(route('rmd.career-exploration.store'), {
            preserveScroll: true
        })
    }

    const updateMatrix = (index, field, value) => {
        const newMatrix = [...data.career_decision_matrix]
        newMatrix[index][field] = value
        setData('career_decision_matrix', newMatrix)
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className='font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight'>
                    {__('RMD_CH4_TITLE')}
                </h2>
            }
        >
            <Head title={__('RMD_CH4_DETERMINE_GOAL_TITLE')} />

            <div className='py-12 bg-gray-50 dark:bg-gray-900 min-h-screen relative'>
                {/* RMD Background */}
                <div
                    className='absolute inset-0 pointer-events-none z-0'
                    style={{
                        backgroundImage:
                            "url('/images/rmd-backgrounds/latar-_10_.svg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundAttachment: 'fixed',
                        opacity: 0.08
                    }}
                />
                <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 relative z-10'>
                    {/* Header Section */}
                    <div className='bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700'>
                        <div className='text-center space-y-2'>
                            <h4 className='text-lg font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest'>
                                {__('RMD_CH4_CHAPTER')}
                            </h4>
                            <h3 className='text-3xl font-black text-gray-900 dark:text-white uppercase'>
                                {__('RMD_CH4_MAIN_TITLE')}
                            </h3>
                            <p className='text-gray-500 dark:text-gray-400 italic font-medium'>
                                {__('RMD_CH4_MEETING')}
                            </p>
                        </div>

                        <div className='mt-8 space-y-6 text-gray-700 dark:text-gray-300 text-lg leading-relaxed'>
                            <section>
                                <h5 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>
                                    {__('RMD_CH4_OPENING_TITLE')}
                                </h5>
                                <p>{__('RMD_CH4_OPENING_TEXT_1')}</p>
                                <p className='mt-4'>
                                    {__('RMD_CH4_OPENING_TEXT_2')}
                                </p>
                            </section>
                        </div>
                    </div>

                    <form onSubmit={submit} className='space-y-8'>
                        {/* Gaya Belajar Section */}
                        <div className='bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 space-y-6'>
                            <h4 className='text-xl font-bold text-gray-900 dark:text-white'>
                                {__('RMD_CH4_PROFESSION_TITLE')}
                            </h4>
                            <div className='space-y-4'>
                                <h5 className='text-lg font-semibold text-gray-800 dark:text-gray-200 italic underline decoration-orange-400 decoration-2'>
                                    {__('RMD_CH4_LEARNING_STYLE')}
                                </h5>
                                <p className='text-gray-600 dark:text-gray-400'>
                                    {__('RMD_CH4_LEARNING_STYLE_DESC')}
                                </p>
                            </div>

                            {/* Visual Icons Placeholder */}
                            <div className='flex justify-around py-8'>
                                <div className='text-center space-y-2'>
                                    <div className='w-20 h-20 bg-orange-400 rounded-full flex items-center justify-center text-white text-3xl'>
                                        👁️
                                    </div>
                                    <p className='font-bold uppercase text-sm tracking-widest'>
                                        {__('RMD_CH4_VISUAL')}
                                    </p>
                                </div>
                                <div className='text-center space-y-2'>
                                    <div className='w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white text-3xl'>
                                        👂
                                    </div>
                                    <p className='font-bold uppercase text-sm tracking-widest'>
                                        {__('RMD_CH4_AUDITORY')}
                                    </p>
                                </div>
                                <div className='text-center space-y-2'>
                                    <div className='w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl'>
                                        👆
                                    </div>
                                    <p className='font-bold uppercase text-sm tracking-widest'>
                                        {__('RMD_CH4_KINESTHETIC')}
                                    </p>
                                </div>
                            </div>

                            {/* Single-style selection notice */}
                            <div className='flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg text-sm text-amber-800 dark:text-amber-300'>
                                <span className='shrink-0'>⚠️</span>
                                <span>
                                    Pilih profesi dari{' '}
                                    <strong>1 gaya belajar saja</strong>.
                                    Setelah memilih, gaya belajar lainnya akan
                                    terkunci. Klik <em>Ganti Pilihan</em> untuk
                                    beralih ke gaya belajar lain.
                                </span>
                            </div>
                            <div className='border-2 border-orange-400 dark:border-orange-700 rounded-3xl overflow-hidden shadow-lg'>
                                <table className='w-full border-collapse'>
                                    <thead>
                                        <tr className='bg-cyan-400 dark:bg-cyan-700 text-white'>
                                            <th className='py-4 px-6 border-r border-white/20 w-1/4 text-center font-bold'>
                                                {__(
                                                    'RMD_CH4_TABLE_LEARNING_STYLE'
                                                )}
                                            </th>
                                            <th className='py-4 px-6 text-center font-bold'>
                                                {__(
                                                    'RMD_CH4_TABLE_SUITABLE_PROFESSION'
                                                )}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y-2 divide-orange-400 dark:divide-orange-700 text-gray-800 dark:text-gray-200'>
                                        {[
                                            {
                                                label: __('RMD_CH4_VISUAL'),
                                                id: 'visual_professions',
                                                icon: '👁️',
                                                accentBg:
                                                    'bg-orange-50 dark:bg-orange-900/10',
                                                accentBorder:
                                                    'border-orange-200 dark:border-orange-800',
                                                accentText:
                                                    'text-orange-700 dark:text-orange-300',
                                                checkColor: 'accent-orange-500'
                                            },
                                            {
                                                label: __(
                                                    'RMD_CH4_AUDITORY_LABEL'
                                                ),
                                                id: 'auditory_professions',
                                                icon: '👂',
                                                accentBg:
                                                    'bg-red-50 dark:bg-red-900/10',
                                                accentBorder:
                                                    'border-red-200 dark:border-red-800',
                                                accentText:
                                                    'text-red-700 dark:text-red-300',
                                                checkColor: 'accent-red-500'
                                            },
                                            {
                                                label: __(
                                                    'RMD_CH4_KINESTHETIC'
                                                ),
                                                id: 'kinesthetic_professions_style',
                                                icon: '👆',
                                                accentBg:
                                                    'bg-green-50 dark:bg-green-900/10',
                                                accentBorder:
                                                    'border-green-200 dark:border-green-800',
                                                accentText:
                                                    'text-green-700 dark:text-green-300',
                                                checkColor: 'accent-green-500'
                                            }
                                        ].map(item => {
                                            const checked = getParsedItems(
                                                data[item.id]
                                            )
                                            const categories =
                                                LEARNING_STYLE_PROFESSIONS[
                                                    item.id
                                                ] || []
                                            const allPredefined =
                                                categories.flatMap(c => c.items)
                                            const customItems = Array.from(
                                                checked
                                            ).filter(
                                                i => !allPredefined.includes(i)
                                            )
                                            const isLocked =
                                                activeStyle !== null &&
                                                activeStyle !== item.id
                                            return (
                                                <tr key={item.id}>
                                                    {/* Label column */}
                                                    <td
                                                        className={`py-6 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center align-top bg-gray-50 dark:bg-gray-800/50`}
                                                    >
                                                        <div className='flex flex-col items-center gap-2 sticky top-4'>
                                                            <span
                                                                className={`text-4xl${
                                                                    isLocked
                                                                        ? ' opacity-40'
                                                                        : ''
                                                                }`}
                                                            >
                                                                {item.icon}
                                                            </span>
                                                            <span
                                                                className={`font-bold text-sm uppercase tracking-wider${
                                                                    isLocked
                                                                        ? ' text-gray-400 dark:text-gray-500'
                                                                        : ''
                                                                }`}
                                                            >
                                                                {item.label}
                                                            </span>
                                                            {isLocked ? (
                                                                <span className='text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 border border-gray-200 dark:bg-gray-700 dark:text-gray-500 dark:border-gray-600'>
                                                                    🔒 Terkunci
                                                                </span>
                                                            ) : checked.size >
                                                              0 ? (
                                                                <>
                                                                    <span
                                                                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.accentBg} ${item.accentText} border ${item.accentBorder}`}
                                                                    >
                                                                        {
                                                                            checked.size
                                                                        }{' '}
                                                                        dipilih
                                                                    </span>
                                                                    <button
                                                                        type='button'
                                                                        onClick={() =>
                                                                            clearStyle(
                                                                                item.id
                                                                            )
                                                                        }
                                                                        className='text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold underline mt-1 transition-colors'
                                                                    >
                                                                        Ganti
                                                                        Pilihan
                                                                    </button>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                    </td>

                                                    {/* Checkbox column */}
                                                    <td
                                                        className={`p-4 align-top${
                                                            isLocked
                                                                ? ' opacity-40 pointer-events-none select-none'
                                                                : ''
                                                        }`}
                                                    >
                                                        <div className='space-y-4'>
                                                            {categories.map(
                                                                cat => (
                                                                    <div
                                                                        key={
                                                                            cat.category
                                                                        }
                                                                    >
                                                                        <p className='text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2'>
                                                                            <span
                                                                                className={`inline-block w-6 h-0.5 rounded ${item.accentBg
                                                                                    .replace(
                                                                                        'bg-',
                                                                                        'bg-'
                                                                                    )
                                                                                    .replace(
                                                                                        '/10',
                                                                                        ''
                                                                                    )} bg-current opacity-50`}
                                                                            />
                                                                            {
                                                                                cat.category
                                                                            }
                                                                        </p>
                                                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-1'>
                                                                            {cat.items.map(
                                                                                prof => (
                                                                                    <label
                                                                                        key={
                                                                                            prof
                                                                                        }
                                                                                        className={`flex items-center gap-2.5 cursor-pointer rounded-lg px-3 py-2 transition-all select-none ${
                                                                                            checked.has(
                                                                                                prof
                                                                                            )
                                                                                                ? `${item.accentBg} border ${item.accentBorder}`
                                                                                                : 'hover:bg-gray-50 dark:hover:bg-gray-700/40 border border-transparent'
                                                                                        }`}
                                                                                    >
                                                                                        <input
                                                                                            type='checkbox'
                                                                                            className={`w-4 h-4 rounded shrink-0 ${item.checkColor}`}
                                                                                            checked={checked.has(
                                                                                                prof
                                                                                            )}
                                                                                            onChange={() =>
                                                                                                setData(
                                                                                                    item.id,
                                                                                                    toggleItem(
                                                                                                        data[
                                                                                                            item
                                                                                                                .id
                                                                                                        ],
                                                                                                        prof
                                                                                                    )
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                        <span
                                                                                            className={`text-sm leading-snug ${
                                                                                                checked.has(
                                                                                                    prof
                                                                                                )
                                                                                                    ? `${item.accentText} font-medium`
                                                                                                    : 'text-gray-700 dark:text-gray-300'
                                                                                            }`}
                                                                                        >
                                                                                            {
                                                                                                prof
                                                                                            }
                                                                                        </span>
                                                                                    </label>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}

                                                            {/* Custom items already added */}
                                                            {customItems.length >
                                                                0 && (
                                                                <div>
                                                                    <p className='text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2'>
                                                                        Profesi
                                                                        Lainnya
                                                                        (Ditambahkan)
                                                                    </p>
                                                                    <div className='flex flex-wrap gap-2'>
                                                                        {customItems.map(
                                                                            ci => (
                                                                                <span
                                                                                    key={
                                                                                        ci
                                                                                    }
                                                                                    className='flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-700'
                                                                                >
                                                                                    {
                                                                                        ci
                                                                                    }
                                                                                    <button
                                                                                        type='button'
                                                                                        onClick={() =>
                                                                                            setData(
                                                                                                item.id,
                                                                                                toggleItem(
                                                                                                    data[
                                                                                                        item
                                                                                                            .id
                                                                                                    ],
                                                                                                    ci
                                                                                                )
                                                                                            )
                                                                                        }
                                                                                        className='ml-1 text-blue-400 hover:text-red-500 font-bold leading-none'
                                                                                        title='Hapus'
                                                                                    >
                                                                                        ×
                                                                                    </button>
                                                                                </span>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Add custom profession */}
                                                            <div className='flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700'>
                                                                <input
                                                                    type='text'
                                                                    value={
                                                                        customText[
                                                                            item
                                                                                .id
                                                                        ]
                                                                    }
                                                                    onChange={e =>
                                                                        setCustomText(
                                                                            prev => ({
                                                                                ...prev,
                                                                                [item.id]:
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                            })
                                                                        )
                                                                    }
                                                                    onKeyDown={e => {
                                                                        if (
                                                                            e.key ===
                                                                            'Enter'
                                                                        ) {
                                                                            e.preventDefault()
                                                                            if (
                                                                                customText[
                                                                                    item
                                                                                        .id
                                                                                ].trim()
                                                                            ) {
                                                                                setData(
                                                                                    item.id,
                                                                                    addCustomItem(
                                                                                        data[
                                                                                            item
                                                                                                .id
                                                                                        ],
                                                                                        customText[
                                                                                            item
                                                                                                .id
                                                                                        ]
                                                                                    )
                                                                                )
                                                                                setCustomText(
                                                                                    prev => ({
                                                                                        ...prev,
                                                                                        [item.id]:
                                                                                            ''
                                                                                    })
                                                                                )
                                                                            }
                                                                        }
                                                                    }}
                                                                    className='flex-1 text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 dark:text-gray-200'
                                                                    placeholder='Tambah profesi lainnya…'
                                                                />
                                                                <button
                                                                    type='button'
                                                                    onClick={() => {
                                                                        if (
                                                                            customText[
                                                                                item
                                                                                    .id
                                                                            ].trim()
                                                                        ) {
                                                                            setData(
                                                                                item.id,
                                                                                addCustomItem(
                                                                                    data[
                                                                                        item
                                                                                            .id
                                                                                    ],
                                                                                    customText[
                                                                                        item
                                                                                            .id
                                                                                    ]
                                                                                )
                                                                            )
                                                                            setCustomText(
                                                                                prev => ({
                                                                                    ...prev,
                                                                                    [item.id]:
                                                                                        ''
                                                                                })
                                                                            )
                                                                        }
                                                                    }}
                                                                    className='px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg font-semibold transition-colors shrink-0'
                                                                >
                                                                    + Tambah
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            {/* ── Pilih 3 Favorit dari centangan di atas ── */}
                            {(() => {
                                const SOURCES = [
                                    {
                                        id: 'visual_professions',
                                        label: __('RMD_CH4_VISUAL'),
                                        icon: '👁️',
                                        chipBase:
                                            'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-200 dark:border-orange-700'
                                    },
                                    {
                                        id: 'auditory_professions',
                                        label: __('RMD_CH4_AUDITORY_LABEL'),
                                        icon: '👂',
                                        chipBase:
                                            'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-200 dark:border-red-700'
                                    },
                                    {
                                        id: 'kinesthetic_professions_style',
                                        label: __('RMD_CH4_KINESTHETIC'),
                                        icon: '👆',
                                        chipBase:
                                            'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-200 dark:border-green-700'
                                    }
                                ]

                                const interested = getParsedItems(
                                    data.interested_professions_from_style
                                )

                                const toggleInterested = prof => {
                                    const set = getParsedItems(
                                        data.interested_professions_from_style
                                    )
                                    if (set.has(prof)) {
                                        set.delete(prof)
                                    } else {
                                        set.add(prof)
                                    }
                                    setData(
                                        'interested_professions_from_style',
                                        Array.from(set).join(', ')
                                    )
                                }

                                const allCheckedCount = SOURCES.reduce(
                                    (n, s) =>
                                        n + getParsedItems(data[s.id]).size,
                                    0
                                )

                                return (
                                    <div className='mt-4 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-l-4 border-blue-400'>
                                        <div className='flex items-start justify-between gap-3 mb-4'>
                                            <p className='text-gray-700 dark:text-gray-300 italic text-sm'>
                                                {__('RMD_CH4_NOTE_MARK_THREE')}
                                            </p>
                                            <span
                                                className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border ${
                                                    interested.size > 0
                                                        ? 'bg-blue-500 text-white border-blue-500'
                                                        : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600'
                                                }`}
                                            >
                                                {interested.size} dipilih
                                            </span>
                                        </div>

                                        {allCheckedCount === 0 ? (
                                            <div className='py-6 text-center text-gray-400 dark:text-gray-500 text-sm italic'>
                                                Belum ada profesi yang dicentang
                                                di tabel di atas. Silakan pilih
                                                profesi yang sesuai terlebih
                                                dahulu.
                                            </div>
                                        ) : (
                                            <div className='space-y-4'>
                                                {SOURCES.map(src => {
                                                    const profs = Array.from(
                                                        getParsedItems(
                                                            data[src.id]
                                                        )
                                                    )
                                                    if (profs.length === 0)
                                                        return null
                                                    return (
                                                        <div key={src.id}>
                                                            <p className='text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1.5'>
                                                                <span>
                                                                    {src.icon}
                                                                </span>{' '}
                                                                {src.label}
                                                            </p>
                                                            <div className='flex flex-wrap gap-2'>
                                                                {profs.map(
                                                                    prof => (
                                                                        <button
                                                                            key={
                                                                                prof
                                                                            }
                                                                            type='button'
                                                                            onClick={() =>
                                                                                toggleInterested(
                                                                                    prof
                                                                                )
                                                                            }
                                                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                                                                                interested.has(
                                                                                    prof
                                                                                )
                                                                                    ? 'bg-blue-500 text-white border-blue-600 shadow-md scale-[1.03]'
                                                                                    : `${src.chipBase} hover:opacity-80`
                                                                            }`}
                                                                        >
                                                                            {interested.has(
                                                                                prof
                                                                            ) && (
                                                                                <span className='text-xs font-black'>
                                                                                    ✓
                                                                                </span>
                                                                            )}
                                                                            {
                                                                                prof
                                                                            }
                                                                        </button>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )
                            })()}
                            {/* ─────────────────────────────────────────────── */}
                            <div className='flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600'>
                                <button
                                    type='submit'
                                    disabled={processing}
                                    className='px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50'
                                >
                                    {processing
                                        ? __('RMD_SAVING')
                                        : __('RMD_SAVE_ANSWER_BUTTON')}
                                </button>
                            </div>
                        </div>

                        {/* Kecerdasan Majemuk Section */}
                        <div className='bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 space-y-6'>
                            <h5 className='text-lg font-semibold text-gray-800 dark:text-gray-200 italic underline decoration-orange-400 decoration-2'>
                                {__('RMD_CH4_MULTIPLE_INTELLIGENCE_TITLE')}
                            </h5>
                            <p className='text-gray-600 dark:text-gray-400'>
                                {__('RMD_CH4_MULTIPLE_INTELLIGENCE_DESC')}
                            </p>

                            <div className='border-2 border-orange-400 dark:border-orange-700 rounded-3xl overflow-hidden shadow-lg overflow-x-auto'>
                                <table className='w-full border-collapse'>
                                    <thead>
                                        <tr className='bg-cyan-400 dark:bg-cyan-700 text-white'>
                                            <th className='py-4 px-4 border-r border-white/20 w-12 text-center font-bold'>
                                                {__('RMD_CH4_TABLE_NO')}
                                            </th>
                                            <th className='py-4 px-6 border-r border-white/20 w-1/4 text-center font-bold'>
                                                {__(
                                                    'RMD_CH4_TABLE_MULTIPLE_INTELLIGENCE'
                                                )}
                                            </th>
                                            <th className='py-4 px-6 border-r border-white/20 text-center font-bold'>
                                                {__('RMD_CH4_TABLE_ABILITY')}
                                            </th>
                                            <th className='py-4 px-6 text-center font-bold'>
                                                {__(
                                                    'RMD_CH4_TABLE_SUITABLE_PROFESSION'
                                                )}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y-2 divide-orange-400 dark:divide-orange-700 text-gray-800 dark:text-gray-200 text-sm'>
                                        {[
                                            {
                                                no: 1,
                                                key: 'linguistic',
                                                label: __(
                                                    'RMD_CH4_MI_LINGUISTIC'
                                                ),
                                                ability: 'linguistic_ability',
                                                professions:
                                                    'linguistic_professions'
                                            },
                                            {
                                                no: 2,
                                                key: 'logical_math',
                                                label: __(
                                                    'RMD_CH4_MI_LOGICAL_MATH'
                                                ),
                                                ability: 'logical_math_ability',
                                                professions:
                                                    'logical_math_professions'
                                            },
                                            {
                                                no: 3,
                                                key: 'visual_spatial',
                                                label: __(
                                                    'RMD_CH4_MI_VISUAL_SPATIAL'
                                                ),
                                                ability:
                                                    'visual_spatial_ability',
                                                professions:
                                                    'visual_spatial_professions'
                                            },
                                            {
                                                no: 4,
                                                key: 'kinesthetic',
                                                label: __(
                                                    'RMD_CH4_MI_KINESTHETIC'
                                                ),
                                                ability: 'kinesthetic_ability',
                                                professions:
                                                    'kinesthetic_professions'
                                            },
                                            {
                                                no: 5,
                                                key: 'musical',
                                                label: __('RMD_CH4_MI_MUSICAL'),
                                                ability: 'musical_ability',
                                                professions:
                                                    'musical_professions'
                                            },
                                            {
                                                no: 6,
                                                key: 'interpersonal',
                                                label: __(
                                                    'RMD_CH4_MI_INTERPERSONAL'
                                                ),
                                                ability:
                                                    'interpersonal_ability',
                                                professions:
                                                    'interpersonal_professions'
                                            },
                                            {
                                                no: 7,
                                                key: 'intrapersonal',
                                                label: __(
                                                    'RMD_CH4_MI_INTRAPERSONAL'
                                                ),
                                                ability:
                                                    'intrapersonal_ability',
                                                professions:
                                                    'intrapersonal_professions'
                                            },
                                            {
                                                no: 8,
                                                key: 'naturalist',
                                                label: __(
                                                    'RMD_CH4_MI_NATURALIST'
                                                ),
                                                ability: 'naturalist_ability',
                                                professions:
                                                    'naturalist_professions'
                                            }
                                        ].map(item => {
                                            const miInfo =
                                                MULTIPLE_INTELLIGENCE_DATA[
                                                    item.key
                                                ]
                                            const abilityChecked =
                                                getParsedItems(
                                                    data[item.ability]
                                                )
                                            const profChecked = getParsedItems(
                                                data[item.professions]
                                            )
                                            const customAbilities = Array.from(
                                                abilityChecked
                                            ).filter(
                                                a =>
                                                    !miInfo.abilities.includes(
                                                        a
                                                    )
                                            )
                                            const customProfs = Array.from(
                                                profChecked
                                            ).filter(
                                                p =>
                                                    !miInfo.professions.includes(
                                                        p
                                                    )
                                            )
                                            return (
                                                <tr key={item.no}>
                                                    <td className='py-4 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold bg-gray-50 dark:bg-gray-800/50 align-top'>
                                                        {item.no}
                                                    </td>
                                                    <td className='py-4 px-4 border-r-2 border-orange-400 dark:border-orange-700 font-bold bg-gray-50 dark:bg-gray-800/50 align-top text-sm leading-snug'>
                                                        {item.label}
                                                    </td>

                                                    {/* Kemampuan */}
                                                    <td className='p-3 border-r-2 border-orange-400 dark:border-orange-700 align-top'>
                                                        <div className='space-y-1'>
                                                            {miInfo.abilities.map(
                                                                ab => (
                                                                    <label
                                                                        key={ab}
                                                                        className={`flex items-start gap-2 cursor-pointer rounded px-2 py-1.5 transition-all select-none text-xs ${
                                                                            abilityChecked.has(
                                                                                ab
                                                                            )
                                                                                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                                                                                : 'hover:bg-gray-50 dark:hover:bg-gray-700/40 border border-transparent'
                                                                        }`}
                                                                    >
                                                                        <input
                                                                            type='checkbox'
                                                                            className='w-3.5 h-3.5 rounded shrink-0 accent-blue-500 mt-0.5'
                                                                            checked={abilityChecked.has(
                                                                                ab
                                                                            )}
                                                                            onChange={() =>
                                                                                setData(
                                                                                    item.ability,
                                                                                    toggleItem(
                                                                                        data[
                                                                                            item
                                                                                                .ability
                                                                                        ],
                                                                                        ab
                                                                                    )
                                                                                )
                                                                            }
                                                                        />
                                                                        <span
                                                                            className={`leading-snug ${
                                                                                abilityChecked.has(
                                                                                    ab
                                                                                )
                                                                                    ? 'text-blue-700 dark:text-blue-300 font-medium'
                                                                                    : 'text-gray-700 dark:text-gray-300'
                                                                            }`}
                                                                        >
                                                                            {ab}
                                                                        </span>
                                                                    </label>
                                                                )
                                                            )}
                                                            {customAbilities.map(
                                                                ca => (
                                                                    <span
                                                                        key={ca}
                                                                        className='flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded border border-blue-200 dark:border-blue-700'
                                                                    >
                                                                        {ca}
                                                                        <button
                                                                            type='button'
                                                                            onClick={() =>
                                                                                setData(
                                                                                    item.ability,
                                                                                    toggleItem(
                                                                                        data[
                                                                                            item
                                                                                                .ability
                                                                                        ],
                                                                                        ca
                                                                                    )
                                                                                )
                                                                            }
                                                                            className='ml-1 text-blue-400 hover:text-red-500 font-bold leading-none'
                                                                        >
                                                                            ×
                                                                        </button>
                                                                    </span>
                                                                )
                                                            )}
                                                            <div className='flex gap-1 pt-2 border-t border-gray-100 dark:border-gray-700'>
                                                                <input
                                                                    type='text'
                                                                    value={
                                                                        miCustomText[
                                                                            item
                                                                                .ability
                                                                        ] || ''
                                                                    }
                                                                    onChange={e =>
                                                                        setMiCustomText(
                                                                            prev => ({
                                                                                ...prev,
                                                                                [item.ability]:
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                            })
                                                                        )
                                                                    }
                                                                    onKeyDown={e => {
                                                                        if (
                                                                            e.key ===
                                                                            'Enter'
                                                                        ) {
                                                                            e.preventDefault()
                                                                            if (
                                                                                (
                                                                                    miCustomText[
                                                                                        item
                                                                                            .ability
                                                                                    ] ||
                                                                                    ''
                                                                                ).trim()
                                                                            ) {
                                                                                setData(
                                                                                    item.ability,
                                                                                    addCustomItem(
                                                                                        data[
                                                                                            item
                                                                                                .ability
                                                                                        ],
                                                                                        miCustomText[
                                                                                            item
                                                                                                .ability
                                                                                        ]
                                                                                    )
                                                                                )
                                                                                setMiCustomText(
                                                                                    prev => ({
                                                                                        ...prev,
                                                                                        [item.ability]:
                                                                                            ''
                                                                                    })
                                                                                )
                                                                            }
                                                                        }
                                                                    }}
                                                                    className='flex-1 text-xs border border-gray-200 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 focus:ring-1 focus:ring-blue-400 dark:text-gray-200'
                                                                    placeholder='Tambah kemampuan lain…'
                                                                />
                                                                <button
                                                                    type='button'
                                                                    onClick={() => {
                                                                        if (
                                                                            (
                                                                                miCustomText[
                                                                                    item
                                                                                        .ability
                                                                                ] ||
                                                                                ''
                                                                            ).trim()
                                                                        ) {
                                                                            setData(
                                                                                item.ability,
                                                                                addCustomItem(
                                                                                    data[
                                                                                        item
                                                                                            .ability
                                                                                    ],
                                                                                    miCustomText[
                                                                                        item
                                                                                            .ability
                                                                                    ]
                                                                                )
                                                                            )
                                                                            setMiCustomText(
                                                                                prev => ({
                                                                                    ...prev,
                                                                                    [item.ability]:
                                                                                        ''
                                                                                })
                                                                            )
                                                                        }
                                                                    }}
                                                                    className='px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded font-semibold shrink-0'
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Profesi yang Sesuai */}
                                                    <td className='p-3 align-top'>
                                                        <div className='space-y-1'>
                                                            {miInfo.professions.map(
                                                                prof => (
                                                                    <label
                                                                        key={
                                                                            prof
                                                                        }
                                                                        className={`flex items-start gap-2 cursor-pointer rounded px-2 py-1.5 transition-all select-none text-xs ${
                                                                            profChecked.has(
                                                                                prof
                                                                            )
                                                                                ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700'
                                                                                : 'hover:bg-gray-50 dark:hover:bg-gray-700/40 border border-transparent'
                                                                        }`}
                                                                    >
                                                                        <input
                                                                            type='checkbox'
                                                                            className='w-3.5 h-3.5 rounded shrink-0 accent-orange-500 mt-0.5'
                                                                            checked={profChecked.has(
                                                                                prof
                                                                            )}
                                                                            onChange={() =>
                                                                                setData(
                                                                                    item.professions,
                                                                                    toggleItem(
                                                                                        data[
                                                                                            item
                                                                                                .professions
                                                                                        ],
                                                                                        prof
                                                                                    )
                                                                                )
                                                                            }
                                                                        />
                                                                        <span
                                                                            className={`leading-snug ${
                                                                                profChecked.has(
                                                                                    prof
                                                                                )
                                                                                    ? 'text-orange-700 dark:text-orange-300 font-medium'
                                                                                    : 'text-gray-700 dark:text-gray-300'
                                                                            }`}
                                                                        >
                                                                            {
                                                                                prof
                                                                            }
                                                                        </span>
                                                                    </label>
                                                                )
                                                            )}
                                                            {customProfs.map(
                                                                cp => (
                                                                    <span
                                                                        key={cp}
                                                                        className='flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 text-xs px-2 py-1 rounded border border-orange-200 dark:border-orange-700'
                                                                    >
                                                                        {cp}
                                                                        <button
                                                                            type='button'
                                                                            onClick={() =>
                                                                                setData(
                                                                                    item.professions,
                                                                                    toggleItem(
                                                                                        data[
                                                                                            item
                                                                                                .professions
                                                                                        ],
                                                                                        cp
                                                                                    )
                                                                                )
                                                                            }
                                                                            className='ml-1 text-orange-400 hover:text-red-500 font-bold leading-none'
                                                                        >
                                                                            ×
                                                                        </button>
                                                                    </span>
                                                                )
                                                            )}
                                                            <div className='flex gap-1 pt-2 border-t border-gray-100 dark:border-gray-700'>
                                                                <input
                                                                    type='text'
                                                                    value={
                                                                        miCustomText[
                                                                            item
                                                                                .professions
                                                                        ] || ''
                                                                    }
                                                                    onChange={e =>
                                                                        setMiCustomText(
                                                                            prev => ({
                                                                                ...prev,
                                                                                [item.professions]:
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                            })
                                                                        )
                                                                    }
                                                                    onKeyDown={e => {
                                                                        if (
                                                                            e.key ===
                                                                            'Enter'
                                                                        ) {
                                                                            e.preventDefault()
                                                                            if (
                                                                                (
                                                                                    miCustomText[
                                                                                        item
                                                                                            .professions
                                                                                    ] ||
                                                                                    ''
                                                                                ).trim()
                                                                            ) {
                                                                                setData(
                                                                                    item.professions,
                                                                                    addCustomItem(
                                                                                        data[
                                                                                            item
                                                                                                .professions
                                                                                        ],
                                                                                        miCustomText[
                                                                                            item
                                                                                                .professions
                                                                                        ]
                                                                                    )
                                                                                )
                                                                                setMiCustomText(
                                                                                    prev => ({
                                                                                        ...prev,
                                                                                        [item.professions]:
                                                                                            ''
                                                                                    })
                                                                                )
                                                                            }
                                                                        }
                                                                    }}
                                                                    className='flex-1 text-xs border border-gray-200 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 focus:ring-1 focus:ring-orange-400 dark:text-gray-200'
                                                                    placeholder='Tambah profesi lain…'
                                                                />
                                                                <button
                                                                    type='button'
                                                                    onClick={() => {
                                                                        if (
                                                                            (
                                                                                miCustomText[
                                                                                    item
                                                                                        .professions
                                                                                ] ||
                                                                                ''
                                                                            ).trim()
                                                                        ) {
                                                                            setData(
                                                                                item.professions,
                                                                                addCustomItem(
                                                                                    data[
                                                                                        item
                                                                                            .professions
                                                                                    ],
                                                                                    miCustomText[
                                                                                        item
                                                                                            .professions
                                                                                    ]
                                                                                )
                                                                            )
                                                                            setMiCustomText(
                                                                                prev => ({
                                                                                    ...prev,
                                                                                    [item.professions]:
                                                                                        ''
                                                                                })
                                                                            )
                                                                        }
                                                                    }}
                                                                    className='px-2 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded font-semibold shrink-0'
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className='flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600'>
                                <button
                                    type='submit'
                                    disabled={processing}
                                    className='px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50'
                                >
                                    {processing
                                        ? __('RMD_SAVING')
                                        : __('RMD_SAVE_ANSWER_BUTTON')}
                                </button>
                            </div>
                        </div>

                        {/* Menentukan Cita-Cita Checklist */}
                        <div className='bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 space-y-6'>
                            <h4 className='text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider'>
                                {__('RMD_CH4_DETERMINE_GOAL_TITLE')}
                            </h4>
                            <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                                {__('RMD_CH4_DETERMINE_GOAL_DESC')}{' '}
                                <span className='italic font-bold'>
                                    decision making
                                </span>
                            </p>

                            <div className='grid grid-cols-1 gap-4'>
                                {[
                                    {
                                        id: 'consider_learning_style',
                                        label: __(
                                            'RMD_CH4_CONSIDER_LEARNING_STYLE'
                                        )
                                    },
                                    {
                                        id: 'consider_intelligence',
                                        label: __(
                                            'RMD_CH4_CONSIDER_INTELLIGENCE'
                                        )
                                    },
                                    {
                                        id: 'consider_academic_achievement',
                                        label: __('RMD_CH4_CONSIDER_ACADEMIC')
                                    },
                                    {
                                        id: 'consider_parental_support',
                                        label: __('RMD_CH4_CONSIDER_PARENTAL')
                                    },
                                    {
                                        id: 'consider_gods_will',
                                        label: __('RMD_CH4_CONSIDER_GODS_WILL')
                                    }
                                ].map(item => (
                                    <label
                                        key={item.id}
                                        className='flex items-center space-x-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-900/40 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/60 transition-colors'
                                    >
                                        <input
                                            type='checkbox'
                                            className='w-6 h-6 rounded border-2 border-orange-400 text-orange-500 focus:ring-orange-500 dark:bg-gray-700'
                                            checked={data[item.id]}
                                            onChange={e =>
                                                setData(
                                                    item.id,
                                                    e.target.checked
                                                )
                                            }
                                        />
                                        <span className='text-gray-800 dark:text-gray-200 font-medium'>
                                            {item.label}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            <div className='space-y-4 pt-4'>
                                <h5 className='font-bold text-gray-800 dark:text-gray-200'>
                                    {__('RMD_CH4_ADDITIONAL_CONSIDERATIONS')}
                                </h5>
                                <textarea
                                    className='w-full bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-gray-200 dark:border-gray-700 focus:ring-orange-400 min-h-[128px] resize'
                                    value={data.additional_considerations}
                                    onChange={e =>
                                        setData(
                                            'additional_considerations',
                                            e.target.value
                                        )
                                    }
                                    placeholder={__(
                                        'RMD_CH4_PLACEHOLDER_DISCUSS'
                                    )}
                                />
                            </div>
                            <div className='flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600'>
                                <button
                                    type='submit'
                                    disabled={processing}
                                    className='px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50'
                                >
                                    {processing
                                        ? __('RMD_SAVING')
                                        : __('RMD_SAVE_ANSWER_BUTTON')}
                                </button>
                            </div>
                        </div>

                        {/* Career Decision Matrix */}
                        <div className='bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 space-y-6'>
                            <h4 className='text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider'>
                                {__('RMD_CH4_DECISION_MATRIX_TITLE')}
                            </h4>
                            <p className='text-gray-600 dark:text-gray-400 italic leading-relaxed'>
                                {__('RMD_CH4_DECISION_MATRIX_DESC')}
                            </p>

                            <div className='border-2 border-orange-400 dark:border-orange-700 rounded-3xl overflow-hidden shadow-lg'>
                                <table className='w-full border-collapse'>
                                    <thead>
                                        <tr className='bg-cyan-400 dark:bg-cyan-700 text-white'>
                                            <th className='py-4 px-6 border-r border-white/20 w-1/3 text-center font-bold uppercase tracking-wider'>
                                                {__(
                                                    'RMD_CH4_TABLE_ALTERNATIVE'
                                                )}
                                            </th>
                                            <th className='py-4 px-6 text-center font-bold uppercase tracking-wider'>
                                                {__('RMD_CH4_TABLE_FACTORS')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y-2 divide-orange-400 dark:divide-orange-700 text-gray-800 dark:text-gray-200'>
                                        {data.career_decision_matrix.map(
                                            (row, index) => (
                                                <tr key={index}>
                                                    <td className='p-4 border-r-2 border-orange-400 dark:border-orange-700 bg-gray-50 dark:bg-gray-800/50'>
                                                        <input
                                                            type='text'
                                                            className='w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-cyan-400 font-bold text-center'
                                                            value={
                                                                row.alternative
                                                            }
                                                            onChange={e =>
                                                                updateMatrix(
                                                                    index,
                                                                    'alternative',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder={`${__(
                                                                'RMD_CH4_PLACEHOLDER_ALTERNATIVE'
                                                            )} ${index + 1}`}
                                                        />
                                                    </td>
                                                    <td className='p-4'>
                                                        <textarea
                                                            className='w-full min-h-[160px] border-none focus:ring-0 bg-transparent resize dark:text-gray-200'
                                                            value={row.factors}
                                                            onChange={e =>
                                                                updateMatrix(
                                                                    index,
                                                                    'factors',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder={__(
                                                                'RMD_CH4_PLACEHOLDER_FACTORS'
                                                            )}
                                                        />
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className='bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-2xl border-l-8 border-cyan-400 space-y-3'>
                                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                                    <span className='font-bold'>
                                        {__('RMD_CH4_TIPS_LABEL')}
                                    </span>{' '}
                                    {__('RMD_CH4_TIPS_TEXT')}
                                </p>
                                <p className='text-gray-700 dark:text-gray-300 text-sm italic'>
                                    {__('RMD_CH4_PARENT_ADVICE')}
                                </p>
                            </div>
                            <div className='flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600'>
                                <button
                                    type='submit'
                                    disabled={processing}
                                    className='px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50'
                                >
                                    {processing
                                        ? __('RMD_SAVING')
                                        : __('RMD_SAVE_ANSWER_BUTTON')}
                                </button>
                            </div>
                        </div>

                        {/* Final Reflection */}
                        <div className='bg-orange-50 dark:bg-orange-900/20 p-8 rounded-3xl border-2 border-orange-400 dark:border-orange-700 text-center space-y-4'>
                            <p className='text-gray-700 dark:text-gray-300 text-lg leading-relaxed'>
                                {__('RMD_CH4_FINAL_REFLECTION')}
                            </p>
                        </div>

                        {/* Submit Section */}
                        <div className='flex items-center justify-end gap-4 pt-8 border-b-2 border-gray-100 dark:border-gray-800 pb-12'>
                            <Transition
                                show={recentlySuccessful}
                                enter='transition ease-in-out'
                                enterFrom='opacity-0'
                                leave='transition ease-in-out'
                                leaveTo='opacity-0'
                            >
                                <p className='text-sm text-green-600 dark:text-green-400 font-bold'>
                                    {__('RMD_CH4_SUCCESS_MSG')}
                                </p>
                            </Transition>

                            <PrimaryButton
                                disabled={processing}
                                className='px-12 py-4 text-lg font-bold uppercase tracking-widest bg-orange-500 hover:bg-orange-600 focus:bg-orange-600 active:bg-orange-700'
                            >
                                {__('RMD_CH4_BTN_SAVE')}
                            </PrimaryButton>
                        </div>

                        {/* Navigation Section */}
                        <div className='flex justify-between items-center py-8'>
                            <Link
                                href={route('rmd.the-only-one-meeting-3')}
                                className='flex items-center gap-2 text-gray-500 hover:text-cyan-500 font-bold transition-colors'
                            >
                                <svg
                                    className='w-5 h-5'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='M15 19l-7-7 7-7'
                                    />
                                </svg>
                                {__('RMD_CH4_BTN_PREV')}
                            </Link>

                            <div className='flex items-center gap-4'>
                                <Link
                                    href={route('rmd.chapters')}
                                    className='px-8 py-3 bg-white dark:bg-gray-800 border-2 border-cyan-400 text-cyan-500 rounded-full font-bold hover:bg-cyan-50 transition-colors shadow-sm'
                                >
                                    {__('RMD_CH4_BTN_TOC')}
                                </Link>

                                <Link
                                    href={route('rmd.career-exploration-p2')}
                                    className='flex items-center gap-2 px-8 py-3 bg-cyan-500 text-white rounded-full font-bold hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-200 dark:shadow-none'
                                >
                                    {__('RMD_CH4_BTN_NEXT')}
                                    <svg
                                        className='w-5 h-5'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth='2'
                                            d='M9 5l7 7-7 7'
                                        />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
