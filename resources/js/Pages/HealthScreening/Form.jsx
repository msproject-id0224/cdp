import React, { useState, useEffect, useRef, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import TextArea from '@/Components/TextArea';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import * as Growth from '@/Utils/GrowthStandards';

// ── Constants ────────────────────────────────────────────────────────────────
const VACCINES = [
    { code:'BCG',  name:'BCG - Bacillus Calmette-Guerin' },
    { code:'DPT',  name:'DPT - Difteri, Pertusis, Tetanus' },
    { code:'DT',   name:'DT - Difteri, Tetanus' },
    { code:'FLU',  name:'FLU - Influenza' },
    { code:'HEA',  name:'HEA - Hepatitis A' },
    { code:'HEB',  name:'HEB - Hepatitis B' },
    { code:'HIB',  name:'HIB - H. Influenza Tipe B' },
    { code:'HPV',  name:'HPV - Human Papilloma Virus' },
    { code:'JAP',  name:'JAP - Japanese Encephalitis' },
    { code:'MEA',  name:'MEA - Campak / Measles' },
    { code:'MEN',  name:'MEN - Radang Selaput Otak / Meningitis' },
    { code:'MMR',  name:'MMR - Campak, Gondok, Rubella' },
    { code:'PCV',  name:'PCV - Pneumococcal Conjugate Vaccine' },
    { code:'POL',  name:'POL - Polio' },
    { code:'ROT',  name:'ROT - Rotavirus' },
    { code:'TT',   name:'TT - Tetanus Toxoid' },
    { code:'TYP',  name:'TYP - Tipes / Typhoid' },
    { code:'VAR',  name:'VAR - Cacar Air / Varicella' },
    { code:'YEL',  name:'YEL - Demam Kuning / Yellow Fever' },
];

const FINDING_CATEGORIES = {
    physical_appearance: [
        { key:'edema',        label:'Busung/pembengkakan (Edema/Swelling)' },
        { key:'lethargic',    label:'Lesu (Lethargic)' },
        { key:'skin_problem', label:'Masalah Kulit (Skin Problem)' },
        { key:'jaundice',     label:'Penyakit kuning (Jaundice)' },
        { key:'pallor',       label:'Muka pucat (Pallor/Paleness)' },
        { key:'other',        label:'Lainnya (Other)' },
    ],
    body_system: [
        { key:'auditory',        label:'Pendengaran (Auditory)' },
        { key:'lymphatic',       label:'Sistem Limfatik (Lymphatic)' },
        { key:'respiratory',     label:'Sistem Pernapasan (Respiratory)' },
        { key:'circulatory',     label:'Sistem Peredaran Darah (Circulatory)' },
        { key:'musculoskeletal', label:'Sistem Otot & Tulang (Musculoskeletal)' },
        { key:'skin',            label:'Kulit (Skin)' },
        { key:'digestive',       label:'Sistem Pencernaan (Digestive)' },
        { key:'nervous',         label:'Sistem Saraf (Nervous)' },
        { key:'urinary',         label:'Sistem Saluran Kencing (Urinary)' },
        { key:'endocrine',       label:'Sistem Endokrin (Endocrine)' },
        { key:'reproductive',    label:'Sistem Reproduksi (Reproductive)' },
        { key:'vision',          label:'Penglihatan (Vision)' },
    ],
    development: [
        { key:'gross_motor',    label:'Motorik Kasar (Gross Motor)' },
        { key:'fine_motor',     label:'Motorik Halus (Fine Motor)' },
        { key:'language',       label:'Bahasa & Bicara (Language/Speech)' },
        { key:'social',         label:'Sosial & Kemandirian (Social)' },
        { key:'cognitive',      label:'Kognitif (Cognitive)' },
    ],
    lab_test: [
        { key:'full_blood_count', label:'Pemeriksaan Darah Lengkap' },
        { key:'sputum_test',      label:'Tes Lendir' },
        { key:'urinalysis',       label:'Saluran Kencing' },
        { key:'hiv_test',         label:'Tes HIV' },
        { key:'stool_analysis',   label:'Analisa Stool' },
        { key:'xray',             label:'X-Ray' },
    ]
};

// ── Searchable Select Component ──────────────────────────────────────────────
function SearchableParticipantSelect({ value, onChange, error, disabled, initialUser }) {
    const [search, setSearch] = useState('');
    const [options, setOptions] = useState(initialUser ? [initialUser] : []);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    // Initial fetch for selected value if not provided in initialUser
    useEffect(() => {
        if (value && options.length === 0 && !initialUser) {
            setLoading(true);
            window.axios.get(route('api.health-screenings.participants'), { params: { id: value } })
                .then(res => {
                    if (res.data && res.data.length > 0) {
                        setOptions(res.data);
                    }
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [value, initialUser]);

    useEffect(() => {
        if (!isOpen) return;
        const timer = setTimeout(() => {
            setLoading(true);
            window.axios.get(route('api.health-screenings.participants'), { params: { search } })
                .then(res => setOptions(res.data))
                .catch(console.error)
                .finally(() => setLoading(false));
        }, 300);
        return () => clearTimeout(timer);
    }, [search, isOpen]);

    const selectedLabel = useMemo(() => {
        const found = options.find(o => o.id === value);
        if (found) return `${found.first_name} ${found.last_name} (${found.id_number || '-'})`;
        if (initialUser && initialUser.id === value) return `${initialUser.first_name} ${initialUser.last_name} (${initialUser.id_number || '-'})`;
        return value ? 'Memuat...' : 'Pilih Peserta...';
    }, [options, value, initialUser]);

    // Handle outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div 
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-900 cursor-pointer flex justify-between items-center ${
                    error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <span className="truncate text-gray-700 dark:text-gray-300">{selectedLabel}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                    <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                        <input
                            autoFocus
                            type="text"
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white focus:ring-indigo-500"
                            placeholder="Cari nama..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <ul className="max-h-60 overflow-y-auto">
                        {loading ? (
                            <li className="px-3 py-2 text-xs text-gray-500 text-center">Memuat...</li>
                        ) : options.length > 0 ? (
                            options.map(opt => (
                                <li 
                                    key={opt.id}
                                    onClick={() => {
                                        onChange(opt.id);
                                        setIsOpen(false);
                                        setSearch(''); // Reset search but keep options
                                    }}
                                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 ${value === opt.id ? 'bg-indigo-50 dark:bg-indigo-900/50 font-semibold' : ''}`}
                                >
                                    <div className="font-medium text-gray-900 dark:text-gray-100">{opt.first_name} {opt.last_name}</div>
                                    <div className="text-xs text-gray-500">{opt.id_number || '-'}</div>
                                </li>
                            ))
                        ) : (
                            <li className="px-3 py-2 text-xs text-gray-500 text-center">Tidak ditemukan</li>
                        )}
                    </ul>
                </div>
            )}
            {error && <InputError message={error} className="mt-2" />}
        </div>
    );
}

// ── Indicator Component ──────────────────────────────────────────────────────
const GrowthIndicator = ({ check, label }) => {
    if (!check) return null;
    return (
        <div className={`mt-1 text-xs font-bold ${check.color} flex items-center gap-1`}>
            <span className={`w-2 h-2 rounded-full ${check.color.replace('text-', 'bg-')}`}></span>
            {check.message}
        </div>
    );
};

// ── Main Form Component ──────────────────────────────────────────────────────
export default function Form({ auth, mode, screening }) {
    const today = new Date().toISOString().split('T')[0];
    const [selectedUser, setSelectedUser] = useState(screening?.user || null);
    
    // Separate BP State
    const [bpSys, setBpSys] = useState('');
    const [bpDia, setBpDia] = useState('');

    // Transform initial data for form
    const initialData = useMemo(() => {
        const base = {
            user_id: screening?.user_id || '',
            checked_at: screening?.checked_at ? new Date(screening.checked_at).toISOString().split('T')[0] : today,
            status: 'final',
            weight: screening?.weight || '',
            height: screening?.height || '',
            temperature: screening?.temperature || '',
            pulse: screening?.pulse || '',
            respiration: screening?.respiration || '',
            head_circumference: screening?.head_circumference || '',
            blood_pressure: screening?.blood_pressure || '',
            malnutrition_status: screening?.malnutrition_status || 'normal',
            immunization_status: screening?.immunization_status || '',
            immunization_other: screening?.immunization_other || '',
            vitamin_a_dose: screening?.vitamin_a_dose || '',
            vitamin_a_date: screening?.vitamin_a_date ? new Date(screening.vitamin_a_date).toISOString().split('T')[0] : '',
            deworming_dose: screening?.deworming_dose || '',
            deworming_date: screening?.deworming_date ? new Date(screening.deworming_date).toISOString().split('T')[0] : '',
            medical_history: screening?.medical_history || '',
            major_findings: screening?.major_findings || '',
            diagnosis: screening?.diagnosis || '',
            therapy: screening?.therapy || '',
            comments: screening?.comments || '',
            examiner_name: screening?.examiner_name || auth.user.name,
            examiner_qualification: screening?.examiner_qualification || '',
            examiner_date: screening?.examiner_signed_at ? new Date(screening.examiner_signed_at).toISOString().split('T')[0] : today,
            
            // Arrays
            immunizations: VACCINES.map(v => {
                const existing = screening?.immunizations?.find(i => i.vaccine_code === v.code);
                return {
                    code: v.code,
                    name: v.name,
                    checked: !!existing,
                    date: existing?.received_at ? new Date(existing.received_at).toISOString().split('T')[0] : '',
                    dose: existing?.dose || '',
                    given_today: existing?.is_given_today || false,
                };
            }),
            findings: [] // Will be populated below
        };

        // Populate findings
        const findingsList = [];
        Object.entries(FINDING_CATEGORIES).forEach(([cat, items]) => {
            items.forEach(item => {
                const existing = screening?.findings?.find(f => f.category === cat && f.item_key === item.key);
                findingsList.push({
                    category: cat,
                    key: item.key,
                    label: item.label,
                    status: existing?.status || 'normal', // normal, abnormal
                    description: existing?.description || ''
                });
            });
        });
        base.findings = findingsList;

        return base;
    }, [screening, auth.user.name, today]);

    const { data, setData, post, put, processing, errors, transform } = useForm(initialData);

    // Initialize BP inputs from data
    useEffect(() => {
        if (initialData.blood_pressure && initialData.blood_pressure.includes('/')) {
            const [s, d] = initialData.blood_pressure.split('/');
            setBpSys(s);
            setBpDia(d);
        }
    }, [initialData.blood_pressure]);

    // Update main BP data when parts change
    useEffect(() => {
        if (bpSys && bpDia) {
            setData('blood_pressure', `${bpSys}/${bpDia}`);
        } else if (!bpSys && !bpDia) {
            setData('blood_pressure', '');
        }
    }, [bpSys, bpDia]);

    // Calculate Age Context
    const ageContext = useMemo(() => {
        if (!selectedUser?.date_of_birth) return null;
        const months = Growth.calculateAgeInMonths(selectedUser.date_of_birth, data.checked_at);
        const years = Growth.calculateAgeInYears(selectedUser.date_of_birth, data.checked_at);
        return { months, years, gender: selectedUser.gender || 'male' };
    }, [selectedUser, data.checked_at]);

    // Real-time Growth Checks
    const growthChecks = useMemo(() => {
        if (!ageContext) return {};
        return {
            weight: Growth.checkWeightForAge(ageContext.months, ageContext.gender, parseFloat(data.weight)),
            height: Growth.checkHeightForAge(ageContext.months, ageContext.gender, parseFloat(data.height)),
            pulse: Growth.checkPulse(ageContext.years, parseInt(data.pulse)),
            resp: Growth.checkRespiration(ageContext.years, parseInt(data.respiration)),
            head: Growth.checkHeadCircumference(ageContext.months, ageContext.gender, parseFloat(data.head_circumference)),
            bp: Growth.checkBloodPressure(ageContext.years, data.blood_pressure),
            temp: Growth.checkTemperature(parseFloat(data.temperature)),
        };
    }, [ageContext, data.weight, data.height, data.pulse, data.respiration, data.head_circumference, data.blood_pressure, data.temperature]);

    // Update malnutrition status automatically based on OVERALL vital signs
    useEffect(() => {
        if (mode !== 'create') return; // Only auto-set on create to avoid overwriting existing data
        if (!growthChecks.weight || !growthChecks.height) return;

        // Logic: Worst case scenario wins
        // If any indicator is Danger -> Severe
        // Else if any indicator is Warning -> Mild
        // Else -> Normal
        
        // Prioritize Weight and Height for Malnutrition status
        const wStatus = growthChecks.weight.status;
        const hStatus = growthChecks.height.status;
        
        let newStatus = 'normal';
        
        if (wStatus === 'danger' || hStatus === 'danger') {
            newStatus = 'severe'; // Sangat Buruk / Obesitas / Sangat Pendek
        } else if (wStatus === 'warning' || hStatus === 'warning') {
            newStatus = 'mild'; // Ringan / Pendek
        } else {
            newStatus = 'normal';
        }

        // Only update if changed to avoid loop (though setData is stable)
        if (data.malnutrition_status !== newStatus) {
            setData('malnutrition_status', newStatus);
        }
    }, [growthChecks.weight?.status, growthChecks.height?.status]);

    // Update immunization status automatically based on checked vaccines and age
    useEffect(() => {
        if (!ageContext) return;
        
        // Collect checked vaccines
        const checkedVaccines = data.immunizations
            .filter(i => i.checked)
            .map(i => i.code);
            
        const suggestedStatus = Growth.checkImmunizationCompleteness(ageContext.months, checkedVaccines);
        
        // Only auto-update if suggestedStatus is valid and different
        // We allow manual override, so maybe only set if not 'fully_complete' manually?
        // Or just set it. Let's set it but user can change it back (though effect might fight them)
        // To avoid fighting user, only set if current is empty OR in create mode
        // Let's make it responsive:
        
        if (suggestedStatus && suggestedStatus !== data.immunization_status) {
             setData('immunization_status', suggestedStatus);
        }
    }, [data.immunizations, ageContext]); // Dependency on immunizations array content (deep check might be needed if object ref changes)

    // BP Masking Logic - Deprecated in favor of split input
    // const handleBpChange = ... 

    // Auto-calculate BMI
    const bmi = useMemo(() => {
        const w = parseFloat(data.weight);
        const h = parseFloat(data.height);
        if (w > 0 && h > 0) {
            const val = (w / ((h/100) * (h/100))).toFixed(1);
            let status = 'Normal';
            if (val < 18.5) status = 'Kurus';
            else if (val >= 25 && val < 30) status = 'Gemuk';
            else if (val >= 30) status = 'Obesitas';
            return `${val} (${status})`;
        }
        return '-';
    }, [data.weight, data.height]);

    // Handle submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === 'create') {
            post(route('health-screenings.store'));
        } else {
            put(route('health-screenings.update', screening.id));
        }
    };
    
    // ... helpers ...
    const updateFinding = (index, field, value) => {
        const newFindings = [...data.findings];
        newFindings[index][field] = value;
        setData('findings', newFindings);
    };

    const updateImmunization = (index, field, value) => {
        const newImm = [...data.immunizations];
        newImm[index][field] = value;
        setData('immunizations', newImm);
    };

    // User selection handler
    const handleUserSelect = (userId) => {
        setData('user_id', userId);
        // We need to fetch the user details to calculate age context if it's a new selection
        // The SearchableParticipantSelect component handles options internally, 
        // but we need the selected user object here for birth date.
        // For simplicity, we can fetch it or pass it up if the component supports it.
        // Ideally SearchableParticipantSelect should return the full object.
        // Let's modify SearchableParticipantSelect slightly or fetch here.
        window.axios.get(route('api.health-screenings.participants'), { params: { id: userId } })
            .then(res => {
                if (res.data && res.data.length > 0) setSelectedUser(res.data[0]);
            });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        {mode === 'create' ? 'Tambah Pemeriksaan Baru' : 'Edit Pemeriksaan Kesehatan'}
                    </h2>
                    {ageContext && (
                        <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                            Usia Saat Periksa: {Math.floor(ageContext.years)} Tahun {ageContext.months % 12} Bulan
                        </div>
                    )}
                </div>
            }
        >
            <Head title={mode === 'create' ? 'Tambah Pemeriksaan' : 'Edit Pemeriksaan'} />

            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        
                        {/* 1. Identitas & Vital Signs */}
                        <div className="bg-white dark:bg-gray-800 p-6 shadow sm:rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 border-b pb-2">
                                Identitas & Tanda Vital
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <InputLabel value="Peserta" />
                                    <SearchableParticipantSelect 
                                        value={data.user_id}
                                        onChange={handleUserSelect}
                                        error={errors.user_id}
                                        disabled={mode === 'edit'}
                                        initialUser={screening?.user}
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Tanggal Pemeriksaan" />
                                    <TextInput 
                                        type="date" 
                                        className="w-full mt-1"
                                        value={data.checked_at}
                                        onChange={e => setData('checked_at', e.target.value)}
                                    />
                                    <InputError message={errors.checked_at} className="mt-2" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <InputLabel value="Berat (kg)" />
                                    <TextInput type="number" step="0.1" className="w-full mt-1" value={data.weight} onChange={e => setData('weight', e.target.value)} />
                                    <GrowthIndicator check={growthChecks.weight} />
                                    <InputError message={errors.weight} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel value="Tinggi (cm)" />
                                    <TextInput type="number" step="0.1" className="w-full mt-1" value={data.height} onChange={e => setData('height', e.target.value)} />
                                    <GrowthIndicator check={growthChecks.height} />
                                    <InputError message={errors.height} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel value="BMI (Otomatis)" />
                                    <div className="mt-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 font-bold text-center">
                                        {bmi}
                                    </div>
                                </div>
                                <div>
                                    <InputLabel value="Suhu (°C)" />
                                    <TextInput type="number" step="0.1" className="w-full mt-1" value={data.temperature} onChange={e => setData('temperature', e.target.value)} />
                                    <GrowthIndicator check={growthChecks.temp} />
                                    <InputError message={errors.temperature} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel value="Nadi (bpm)" />
                                    <TextInput type="number" className="w-full mt-1" value={data.pulse} onChange={e => setData('pulse', e.target.value)} />
                                    <GrowthIndicator check={growthChecks.pulse} />
                                </div>
                                <div>
                                    <InputLabel value="Pernapasan (x/m)" />
                                    <TextInput type="number" className="w-full mt-1" value={data.respiration} onChange={e => setData('respiration', e.target.value)} />
                                    <GrowthIndicator check={growthChecks.resp} />
                                </div>
                                <div>
                                    <InputLabel value="Lingkar Kepala (cm)" />
                                    <TextInput type="number" step="0.1" className="w-full mt-1" value={data.head_circumference} onChange={e => setData('head_circumference', e.target.value)} />
                                    <GrowthIndicator check={growthChecks.head} />
                                </div>
                                <div>
                                    <InputLabel value="Tekanan Darah (Sys / Dia)" />
                                    <div className="flex items-center gap-2 mt-1">
                                        <TextInput 
                                            type="number" 
                                            placeholder="120" 
                                            className="w-full text-center" 
                                            value={bpSys} 
                                            onChange={e => setBpSys(e.target.value)}
                                            maxLength={3} 
                                        />
                                        <span className="text-xl font-bold text-gray-400">/</span>
                                        <TextInput 
                                            type="number" 
                                            placeholder="80" 
                                            className="w-full text-center" 
                                            value={bpDia} 
                                            onChange={e => setBpDia(e.target.value)}
                                            maxLength={3} 
                                        />
                                    </div>
                                    <GrowthIndicator check={growthChecks.bp} />
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel value="Status Malnutrisi" />
                                    <div className="mt-2 flex flex-wrap gap-4">
                                        {['normal', 'mild', 'moderate', 'severe'].map(s => (
                                            <label key={s} className="flex items-center gap-2 cursor-pointer">
                                                <input 
                                                    type="radio" 
                                                    name="malnutrition_status" 
                                                    value={s}
                                                    checked={data.malnutrition_status === s}
                                                    onChange={e => setData('malnutrition_status', e.target.value)}
                                                    className="text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                />
                                                <span className="capitalize text-sm text-gray-700 dark:text-gray-300">
                                                    {s === 'normal' ? 'Normal' : s === 'mild' ? 'Ringan' : s === 'moderate' ? 'Sedang' : 'Sangat Buruk'}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    <InputError message={errors.malnutrition_status} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel value="Tanggapan (Comments)" />
                                    <TextArea 
                                        className="mt-1 w-full" 
                                        rows="2" 
                                        placeholder="Catatan tambahan..." 
                                        value={data.comments} 
                                        onChange={e => setData('comments', e.target.value)} 
                                    />
                                    <InputError message={errors.comments} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* 2. Imunisasi */}
                        <div className="bg-white dark:bg-gray-800 p-6 shadow sm:rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1 border-b pb-2">
                                Imunisasi yang Diberikan
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 italic">
                                Silahkan tandai semua vaksinasi yang diberikan hari ini jika data imunisasi belum diisi. Jumlah dosis atau B untuk booster.
                            </p>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 mb-6">
                                {data.immunizations.map((imm, idx) => (
                                    <div key={imm.code} className={`p-3 rounded-lg border transition-colors ${imm.checked ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800' : 'border-gray-200 dark:border-gray-700'}`}>
                                        <div className="flex items-start gap-3">
                                            <input 
                                                type="checkbox" 
                                                checked={imm.checked}
                                                onChange={e => updateImmunization(idx, 'checked', e.target.checked)}
                                                className="mt-1 rounded text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <div className="flex-1">
                                                <div className="font-bold text-sm text-gray-800 dark:text-gray-200">{imm.name}</div>
                                                {imm.checked && (
                                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                                        <input 
                                                            type="date" 
                                                            className="text-xs border-gray-300 rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600"
                                                            value={imm.date}
                                                            onChange={e => updateImmunization(idx, 'date', e.target.value)}
                                                        />
                                                        <select 
                                                            className="text-xs border-gray-300 rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600"
                                                            value={imm.dose}
                                                            onChange={e => updateImmunization(idx, 'dose', e.target.value)}
                                                        >
                                                            <option value="">Pilih Dosis...</option>
                                                            <option value="1">Dosis 1</option>
                                                            <option value="2">Dosis 2</option>
                                                            <option value="3">Dosis 3</option>
                                                            <option value="Booster">Booster</option>
                                                        </select>
                                                        <label className="col-span-2 flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={imm.given_today}
                                                                onChange={e => updateImmunization(idx, 'given_today', e.target.checked)}
                                                                className="rounded text-indigo-600 w-3 h-3"
                                                            />
                                                            Diberikan Hari Ini
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <div className="mb-4">
                                    <InputLabel value="Status Kelengkapan Imunisasi" />
                                    <div className="mt-2">
                                        {(() => {
                                            const status = data.immunization_status;
                                            let badgeClass = 'bg-gray-100 text-gray-800 border-gray-200';
                                            let label = 'Belum Ditentukan';
                                            
                                            if (status === 'incomplete') {
                                                badgeClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
                                                label = 'Belum Lengkap';
                                            } else if (status === 'complete') {
                                                badgeClass = 'bg-green-100 text-green-800 border-green-200';
                                                label = 'Lengkap';
                                            } else if (status === 'fully_complete') {
                                                badgeClass = 'bg-purple-100 text-purple-800 border-purple-200'; // Ungu
                                                label = 'Sangat Lengkap';
                                            }

                                            return (
                                                <div className={`inline-flex items-center px-4 py-2 rounded-lg border-2 font-bold text-sm ${badgeClass}`}>
                                                    <span className={`w-3 h-3 rounded-full mr-2 ${badgeClass.replace('bg-', 'bg-current-').replace('text-', 'text-current-').split(' ')[1].replace('text-', 'bg-')}`}></span>
                                                    {label}
                                                </div>
                                            );
                                        })()}
                                        <p className="text-xs text-gray-500 mt-1">
                                            Status ini ditentukan secara otomatis berdasarkan jenis vaksin yang dicentang di atas dan usia anak.
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <InputLabel value="Lainnya (tulis imunisasi lainnya yang diterima oleh anak, dan kapan)" />
                                    <TextInput 
                                        className="mt-1 w-full" 
                                        value={data.immunization_other} 
                                        onChange={e => setData('immunization_other', e.target.value)} 
                                        placeholder="Contoh: Vaksin Tifoid (12 Jan 2024)..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3. Vitamin & Obat Cacing */}
                        <div className="bg-white dark:bg-gray-800 p-6 shadow sm:rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 border-b pb-2">
                                Vitamin dan Pengobatan Obat Cacing Diterima
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Vitamin A */}
                                <div>
                                    <InputLabel value="Vitamin A - Dosis Terakhir yang Diterima" className="mb-2" />
                                    <div className="flex flex-col gap-3">
                                        <div className="flex gap-4">
                                            {[
                                                { value: 'given', label: 'Sudah Diberikan', color: 'text-blue-700 bg-blue-50 border-blue-200' },
                                                { value: 'none', label: 'Belum', color: 'text-gray-600 bg-gray-50 border-gray-200' },
                                            ].map((opt) => (
                                                <label key={opt.value} className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border ${data.vitamin_a_dose === opt.value ? opt.color + ' ring-2 ring-offset-1 ring-indigo-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                                                    <input 
                                                        type="radio" 
                                                        name="vitamin_a_dose" 
                                                        value={opt.value}
                                                        checked={data.vitamin_a_dose === opt.value}
                                                        onChange={e => setData('vitamin_a_dose', e.target.value)}
                                                        className="text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                    />
                                                    <span className="font-medium text-sm">
                                                        {opt.label}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                        {data.vitamin_a_dose === 'given' && (
                                            <div>
                                                <InputLabel value="Tanggal Diberikan" className="text-xs text-gray-500 mb-1" />
                                                <TextInput 
                                                    type="date" 
                                                    className="w-full text-sm"
                                                    value={data.vitamin_a_date}
                                                    onChange={e => setData('vitamin_a_date', e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Obat Cacing */}
                                <div>
                                    <InputLabel value="Cacingan - Dosis Terakhir yang diterima" className="mb-2" />
                                    <div className="flex flex-col gap-3">
                                        <div className="flex gap-4">
                                            {[
                                                { value: 'yes', label: 'Sudah Diberikan', color: 'text-green-700 bg-green-50 border-green-200' },
                                                { value: 'no', label: 'Belum', color: 'text-gray-600 bg-gray-50 border-gray-200' },
                                            ].map((opt) => (
                                                <label key={opt.value} className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border ${data.deworming_dose === opt.value ? opt.color + ' ring-2 ring-offset-1 ring-indigo-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                                                    <input 
                                                        type="radio" 
                                                        name="deworming_dose" 
                                                        value={opt.value}
                                                        checked={data.deworming_dose === opt.value}
                                                        onChange={e => setData('deworming_dose', e.target.value)}
                                                        className="text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                    />
                                                    <span className="font-medium text-sm">
                                                        {opt.label}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                        {data.deworming_dose === 'yes' && (
                                            <div>
                                                <InputLabel value="Tanggal Diberikan" className="text-xs text-gray-500 mb-1" />
                                                <TextInput 
                                                    type="date" 
                                                    className="w-full text-sm"
                                                    value={data.deworming_date}
                                                    onChange={e => setData('deworming_date', e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Riwayat Kesehatan */}
                        <div className="bg-white dark:bg-gray-800 p-6 shadow sm:rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 border-b pb-2">
                                Riwayat Kesehatan / Riwayat Operasi
                            </h3>
                            <div>
                                <InputLabel value="Catatan Riwayat Kesehatan / Operasi (Jika ada)" />
                                <TextArea 
                                    className="mt-1 w-full" 
                                    rows="3" 
                                    placeholder="Tuliskan riwayat penyakit, alergi, atau operasi yang pernah dijalani..."
                                    value={data.medical_history} 
                                    onChange={e => setData('medical_history', e.target.value)} 
                                />
                                <InputError message={errors.medical_history} className="mt-2" />
                            </div>
                        </div>

                        {/* 5. Pemeriksaan Fisik & Sistem Tubuh */}
                        <div className="bg-white dark:bg-gray-800 p-6 shadow sm:rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 border-b pb-2">
                                Pemeriksaan Fisik & Sistem Tubuh
                            </h3>
                            <div className="space-y-6">
                                {Object.entries(FINDING_CATEGORIES).map(([catKey, items]) => (
                                    <div key={catKey}>
                                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                                            {catKey === 'physical_appearance' ? 'Tampilan Fisik' 
                                                : catKey === 'body_system' ? 'Gangguan Sistem Tubuh' 
                                                : catKey === 'development' ? 'Perkembangan Anak'
                                                : 'Laboratorium'}
                                        </h4>
                                        {catKey === 'development' && (
                                            <p className="text-xs text-gray-500 italic mb-3">
                                                (Anak di bawah usia 5 tahun)
                                            </p>
                                        )}
                                        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${catKey !== 'development' ? 'mt-3' : ''}`}>
                                            {data.findings
                                                .map((f, i) => ({ ...f, originalIndex: i }))
                                                .filter(f => f.category === catKey)
                                                .map((f) => (
                                                    <div key={f.key} className={`p-3 rounded border ${f.status === 'abnormal' ? 'bg-red-50 border-red-200 dark:bg-red-900/20' : 'bg-gray-50 border-transparent dark:bg-gray-700/30'}`}>
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{f.label}</span>
                                                            <select 
                                                                value={f.status}
                                                                onChange={e => updateFinding(f.originalIndex, 'status', e.target.value)}
                                                                className={`text-xs rounded border-0 py-1 pl-2 pr-6 font-bold ${f.status === 'abnormal' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                                                            >
                                                                <option value="normal">Normal</option>
                                                                <option value="abnormal">Abnormal</option>
                                                            </select>
                                                        </div>
                                                        {f.status === 'abnormal' && (
                                                            <textarea
                                                                className="w-full text-xs border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                                                                rows="2"
                                                                placeholder="Jelaskan kelainan..."
                                                                value={f.description}
                                                                onChange={e => updateFinding(f.originalIndex, 'description', e.target.value)}
                                                            ></textarea>
                                                        )}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 4. Kesimpulan & Tanda Tangan */}
                        <div className="bg-white dark:bg-gray-800 p-6 shadow sm:rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 border-b pb-2">
                                Kesimpulan & Pengesahan
                            </h3>
                            
                            <div className="grid grid-cols-1 gap-6 mb-6">
                                <div>
                                    <InputLabel value="Temuan Penting (Major Findings)" />
                                    <TextArea className="mt-1 w-full" rows="3" value={data.major_findings} onChange={e => setData('major_findings', e.target.value)} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel value="Diagnosis" />
                                        <TextArea className="mt-1 w-full" rows="3" value={data.diagnosis} onChange={e => setData('diagnosis', e.target.value)} />
                                    </div>
                                    <div>
                                        <InputLabel value="Terapi / Rekomendasi" />
                                        <TextArea className="mt-1 w-full" rows="3" value={data.therapy} onChange={e => setData('therapy', e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase">Identitas Pemeriksa</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <InputLabel value="Nama Pemeriksa" />
                                        <TextInput className="w-full mt-1" value={data.examiner_name} onChange={e => setData('examiner_name', e.target.value)} />
                                        <InputError message={errors.examiner_name} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel value="Jabatan / Kualifikasi" />
                                        <TextInput className="w-full mt-1" value={data.examiner_qualification} onChange={e => setData('examiner_qualification', e.target.value)} />
                                    </div>
                                    <div>
                                        <InputLabel value="Tanggal Tanda Tangan" />
                                        <TextInput type="date" className="w-full mt-1" value={data.examiner_date} onChange={e => setData('examiner_date', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-4">
                            <Link
                                href={route('health-screenings.index')}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                            >
                                Batal
                            </Link>
                            <PrimaryButton className="w-40 justify-center" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Data'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
