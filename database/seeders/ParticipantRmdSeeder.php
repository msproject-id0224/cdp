<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\RmdProfile;
use App\Models\RmdBibleReflection;
use App\Models\RmdTrueSuccess;
use App\Models\RmdTheOnlyOne;
use App\Models\RmdMultipleIntelligence;
use App\Models\RmdSocioEmotional;
use App\Models\RmdCareerExploration;
use App\Models\RmdCareerExplorationP2;
use App\Models\RmdPreparationDreamIsland;
use Carbon\Carbon;

class ParticipantRmdSeeder extends Seeder
{
    // Daftar cita-cita karir yang akan dipilih secara random
    private array $citaCita = [
        'Dokter Umum',
        'Dokter Spesialis Anak',
        'Insinyur Sipil',
        'Software Engineer',
        'Pengacara / Advokat',
        'Guru / Pendidik',
        'Perawat',
        'Arsitek',
        'Pengusaha / Entrepreneur',
        'Psikolog Klinis',
        'Akuntan Publik',
        'Jurnalis',
        'Desainer Grafis',
        'Apoteker',
        'Manajer Bisnis',
    ];

    private array $participants = [
        // Usia 19 (lahir 2006-2007)
        ['first_name' => 'Rizky',    'last_name' => 'Pratama',    'email' => 'rizky.pratama.cdp@gmail.com',    'gender' => 'male',   'dob' => '2006-08-15'],
        ['first_name' => 'Sinta',    'last_name' => 'Dewi',       'email' => 'sinta.dewi.cdp@gmail.com',       'gender' => 'female', 'dob' => '2007-02-20'],
        ['first_name' => 'Bagas',    'last_name' => 'Nugroho',    'email' => 'bagas.nugroho.cdp@gmail.com',    'gender' => 'male',   'dob' => '2006-11-05'],
        // Usia 20 (lahir 2005-2006)
        ['first_name' => 'Aulia',    'last_name' => 'Rahma',      'email' => 'aulia.rahma.cdp@gmail.com',      'gender' => 'female', 'dob' => '2005-07-12'],
        ['first_name' => 'Dimas',    'last_name' => 'Santoso',    'email' => 'dimas.santoso.cdp@gmail.com',    'gender' => 'male',   'dob' => '2006-01-30'],
        ['first_name' => 'Nayla',    'last_name' => 'Putri',      'email' => 'nayla.putri.cdp@gmail.com',      'gender' => 'female', 'dob' => '2005-09-18'],
        ['first_name' => 'Farhan',   'last_name' => 'Maulana',    'email' => 'farhan.maulana.cdp@gmail.com',   'gender' => 'male',   'dob' => '2005-12-03'],
        // Usia 21 (lahir 2004-2005)
        ['first_name' => 'Citra',    'last_name' => 'Lestari',    'email' => 'citra.lestari.cdp@gmail.com',    'gender' => 'female', 'dob' => '2004-06-22'],
        ['first_name' => 'Aditya',   'last_name' => 'Kurniawan',  'email' => 'aditya.kurniawan.cdp@gmail.com', 'gender' => 'male',   'dob' => '2004-10-09'],
        ['first_name' => 'Melinda',  'last_name' => 'Sari',       'email' => 'melinda.sari.cdp@gmail.com',     'gender' => 'female', 'dob' => '2005-03-14'],
    ];

    public function run(): void
    {
        $mentor = User::where('role', 'mentor')->where('is_active', true)->first();

        foreach ($this->participants as $index => $data) {
            $idNumber = 'PAR' . str_pad(100 + $index + 1, 3, '0', STR_PAD_LEFT);
            $citaCitaPilihan = $this->citaCita[array_rand($this->citaCita)];
            $dob = Carbon::parse($data['dob']);
            $age = $dob->age;

            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'id_number'         => $idNumber,
                    'first_name'        => $data['first_name'],
                    'last_name'         => $data['last_name'],
                    'nickname'          => $data['first_name'],
                    'role'              => 'participant',
                    'gender'            => $data['gender'],
                    'date_of_birth'     => $data['dob'],
                    'age'               => $age,
                    'education'         => 'Perguruan Tinggi',
                    'is_active'         => true,
                    'email_verified_at' => now(),
                    'mentor_id'         => $mentor?->id,
                    'phone_number'      => '08' . rand(100000000, 999999999),
                    'address'           => 'Manado, Sulawesi Utara',
                ]
            );

            $this->seedRmd($user, $age, $citaCitaPilihan);

            $this->command->info("✓ {$user->first_name} {$user->last_name} (usia {$age}) — cita-cita: {$citaCitaPilihan}");
        }
    }

    private function seedRmd(User $user, int $age, string $citaCita): void
    {
        $filledAt = Carbon::now()->subMonths(rand(1, 6));

        // 1. Profil RMD
        RmdProfile::updateOrCreate(['user_id' => $user->id], [
            'graduation_plan_date'               => Carbon::now()->addYears(2)->format('Y-m-d'),
            'first_filled_at'                    => $filledAt->format('Y-m-d'),
            'first_filled_age'                   => $age,
            'first_filled_education'             => 'Perguruan Tinggi',
            'first_filled_education_institution' => 'Universitas Sam Ratulangi Manado',
        ]);

        // 2. Refleksi Alkitab
        RmdBibleReflection::updateOrCreate(['user_id' => $user->id], [
            'jeremiah_29_11_who_knows'   => 'Allah yang mengetahui rancangan-Nya untuk masa depan saya.',
            'jeremiah_29_11_plans'       => 'Rancangan damai sejahtera dan bukan rancangan kecelakaan.',
            'ephesians_2_10_made_by'     => 'Saya diciptakan oleh Allah sebagai hasil karya-Nya.',
            'ephesians_2_10_purpose'     => 'Untuk melakukan pekerjaan baik yang telah dipersiapkan Allah.',
            'ephesians_2_10_god_wants'   => 'Allah ingin saya hidup sesuai tujuan yang telah Ia tetapkan.',
            'genesis_1_26_28_image'      => 'Manusia diciptakan menurut gambar dan rupa Allah.',
            'genesis_1_26_28_purpose'    => 'Untuk berkuasa atas ciptaan dan memenuhi bumi.',
            'summary_point_1'            => 'Allah memiliki rencana yang baik untuk setiap individu.',
            'summary_point_2'            => 'Manusia diciptakan dengan tujuan mulia dari Allah.',
            'favorite_verse'             => 'Yeremia 29:11',
            'reason_favorite_verse'      => 'Ayat ini memberikan pengharapan bahwa Allah memiliki rencana terbaik.',
            'leadership_c1'              => 'Melayani dengan hati yang tulus.',
            'leadership_c2'              => 'Bertanggung jawab atas keputusan yang diambil.',
            'leadership_c3'              => 'Menginspirasi orang lain melalui teladan.',
            'leadership_c4'              => 'Berkomunikasi dengan jelas dan efektif.',
            'leadership_c5'              => 'Terus bertumbuh dalam iman dan pengetahuan.',
            'chapter_learning_text'      => 'Saya belajar bahwa identitas saya ada di dalam Kristus dan tujuan hidup saya adalah untuk memuliakan Tuhan.',
        ]);

        // 3. Sukses Sejati
        RmdTrueSuccess::updateOrCreate(['user_id' => $user->id], [
            'successful_life_definition'    => 'Sukses adalah hidup sesuai kehendak Allah dan memberikan dampak positif bagi sesama.',
            'general_success_measure'       => 'Ukuran sukses dunia adalah kekayaan dan jabatan, tetapi sukses sejati adalah pertumbuhan karakter.',
            'luke_2_52_growth'              => 'Bertumbuh dalam hikmat, tubuh, kasih karunia, dan pengetahuan.',
            'philippians_2_5_10_actions'    => 'Memiliki pikiran Kristus: rendah hati dan melayani orang lain.',
            'jesus_success_vs_society'      => 'Yesus tidak kaya secara materi tetapi kaya dalam makna dan dampak kehidupan-Nya.',
            'god_opinion_on_jesus'          => 'Allah sangat berkenan kepada Yesus karena ketaatan dan kasih-Nya.',
            'new_learning_text'             => 'Saya belajar bahwa sukses sejati dimulai dari dalam hati dan karakter yang baik.',
            'new_learning_image_path'       => 'images/default-learning.jpg',
        ]);

        // 4. The Only One
        $checklist = ['item1' => true, 'item2' => true, 'item3' => true];
        RmdTheOnlyOne::updateOrCreate(['user_id' => $user->id], [
            'unique_traits'                => 'Saya memiliki kemampuan komunikasi yang baik dan kreativitas tinggi.',
            'current_education_level'      => 'S1 / Sarjana',
            'favorite_subject'             => 'Matematika',
            'favorite_subject_reason'      => 'Logis dan terstruktur sehingga memudahkan pemecahan masalah.',
            'least_favorite_subject'       => 'Sejarah',
            'least_favorite_subject_reason'=> 'Banyak hafalan yang sulit diingat.',
            'highest_score_subject'        => 'Matematika',
            'highest_score_value'          => '90',
            'lowest_score_subject'         => 'Sejarah',
            'lowest_score_value'           => '70',
            'visual_checklist'             => json_encode($checklist),
            'auditory_checklist'           => json_encode($checklist),
            'kinesthetic_checklist'        => json_encode($checklist),
            'learned_aspects'              => 'Saya belajar tentang keunikan diri yang diberikan Tuhan.',
            'aspects_to_improve'           => 'Saya perlu meningkatkan kemampuan mengelola waktu.',
        ]);

        // 5. Kecerdasan Majemuk
        $intelligenceChecklist = ['item1' => true, 'item2' => true];
        RmdMultipleIntelligence::updateOrCreate(['user_id' => $user->id], [
            'linguistic_checklist'             => json_encode($intelligenceChecklist),
            'logical_mathematical_checklist'   => json_encode($intelligenceChecklist),
            'visual_spatial_checklist'         => json_encode($intelligenceChecklist),
            'kinesthetic_checklist'            => json_encode($intelligenceChecklist),
            'musical_checklist'                => json_encode($intelligenceChecklist),
            'interpersonal_checklist'          => json_encode($intelligenceChecklist),
            'intrapersonal_checklist'          => json_encode($intelligenceChecklist),
            'naturalist_checklist'             => json_encode($intelligenceChecklist),
            'existential_checklist'            => json_encode($intelligenceChecklist),
            'reflection_new_learning'          => 'Saya menyadari kecerdasan dominan saya adalah interpersonal dan linguistik.',
            'reflection_plan'                  => 'Saya akan mengembangkan kecerdasan saya melalui latihan dan pengalaman.',
        ]);

        // 6. Sosial Emosional
        RmdSocioEmotional::updateOrCreate(['user_id' => $user->id], [
            'learning_style_practice'        => 'Belajar sambil berdiskusi dan mempraktikkan langsung.',
            'learning_style_impact'          => 'Pemahaman lebih mendalam dan mudah diingat.',
            'birth_order_siblings'           => 'Anak pertama dari 2 bersaudara.',
            'parents_occupation'             => 'Ayah: Wiraswasta, Ibu: Guru.',
            'home_responsibilities'          => 'Membantu pekerjaan rumah dan mengawasi adik.',
            'family_uniqueness'              => 'Keluarga kami sangat mendukung pendidikan anak-anak.',
            'extracurricular_activities'     => 'PMR, Paduan Suara, Karang Taruna.',
            'ppa_activities'                 => 'Youth Group, Bible Study, Pelayanan Ibadah.',
            'hobbies'                        => 'Membaca, bermain musik, olahraga.',
            'strengths'                      => 'Tekun, bertanggung jawab, komunikatif.',
            'weaknesses'                     => 'Terkadang terlalu perfeksionis dan sulit menolak permintaan.',
            'reflection_learned'             => 'Saya belajar untuk lebih mengenal diri sendiri.',
            'reflection_improvement'         => 'Saya akan meningkatkan kemampuan manajemen waktu.',
            'height'                         => rand(155, 175),
            'weight'                         => rand(50, 75),
            'physical_traits'                => 'Tinggi sedang, berkulit sawo matang, rambut hitam lurus.',
            'favorite_sports'                => 'Badminton dan Renang.',
            'sports_achievements'            => 'Juara 3 badminton antar kelas.',
            'eating_habits'                  => 'Makan 3 kali sehari, menghindari makanan berlemak tinggi.',
            'sleeping_habits'                => 'Tidur 7-8 jam per hari.',
            'health_issues'                  => 'Tidak ada masalah kesehatan serius.',
            'physical_likes'                 => 'Berolahraga di pagi hari membuat saya lebih bersemangat.',
            'physical_development_goal'      => 'Menjaga berat badan ideal dan meningkatkan kebugaran.',
            'spiritual_knowledge_jesus'      => 'Yesus adalah Tuhan dan Juruselamat saya yang memberikan hidup kekal.',
            'spiritual_relationship_growth'  => 'Saya bertumbuh melalui doa harian dan membaca Alkitab.',
            'spiritual_love_obedience'       => 'Saya berusaha menaati perintah Tuhan dalam kehidupan sehari-hari.',
            'spiritual_community'            => 'Aktif dalam komunitas pemuda gereja setiap minggu.',
            'spiritual_bible_study'          => 'Mengikuti pendalaman Alkitab setiap Rabu.',
            'spiritual_mentor'               => 'Didampingi mentor rohani dari gereja.',
            'spiritual_reflection_learned'   => 'Hubungan dengan Tuhan adalah fondasi utama kehidupan.',
            'spiritual_reflection_improvement'=> 'Saya ingin lebih konsisten dalam waktu doa pribadi.',
        ]);

        // 7. Eksplorasi Karir
        $swotData = json_encode([
            'strengths'     => ['Kemampuan komunikasi baik', 'Tekun dan disiplin'],
            'weaknesses'    => ['Kurang pengalaman kerja', 'Terkadang ragu mengambil keputusan'],
            'opportunities' => ['Banyak beasiswa tersedia', 'Kebutuhan profesi tinggi'],
            'threats'       => ['Persaingan ketat', 'Perkembangan teknologi cepat'],
        ]);
        $decisionMatrix = json_encode([
            ['faktor' => 'Minat', 'bobot' => 5, 'nilai' => 4],
            ['faktor' => 'Kemampuan', 'bobot' => 4, 'nilai' => 4],
            ['faktor' => 'Prospek', 'bobot' => 3, 'nilai' => 5],
        ]);
        RmdCareerExploration::updateOrCreate(['user_id' => $user->id], [
            'visual_professions'               => 'Desainer, Arsitek, Fotografer.',
            'auditory_professions'             => 'Musisi, Broadcaster, Guru.',
            'kinesthetic_professions_style'    => 'Atlet, Dokter, Teknisi.',
            'interested_professions_from_style'=> 'Guru dan Dokter sesuai dengan gaya belajar saya.',
            'linguistic_ability'               => 'Mampu berkomunikasi dengan baik secara lisan maupun tulisan.',
            'linguistic_professions'           => 'Penulis, Jurnalis, Pengacara.',
            'logical_math_ability'             => 'Mampu berpikir sistematis dan memecahkan masalah logis.',
            'logical_math_professions'         => 'Insinyur, Akuntan, Analis Data.',
            'visual_spatial_ability'           => 'Mampu memvisualisasikan konsep dengan baik.',
            'visual_spatial_professions'       => 'Arsitek, Desainer Interior, Pilot.',
            'kinesthetic_ability'              => 'Belajar lebih baik melalui praktik langsung.',
            'kinesthetic_professions'          => 'Dokter, Fisioterapis, Chef.',
            'musical_ability'                  => 'Dapat memainkan beberapa alat musik.',
            'musical_professions'              => 'Musisi, Komposer, Terapis Musik.',
            'interpersonal_ability'            => 'Mudah bergaul dan memimpin kelompok.',
            'interpersonal_professions'        => 'Manajer, Konselor, Diplomat.',
            'intrapersonal_ability'            => 'Memahami diri sendiri dengan baik.',
            'intrapersonal_professions'        => 'Psikolog, Penulis, Peneliti.',
            'naturalist_ability'               => 'Peduli terhadap lingkungan alam.',
            'naturalist_professions'           => 'Biolog, Dokter Hewan, Petani Modern.',
            'consider_learning_style'          => 'Gaya belajar visual-auditori cocok untuk profesi pendidikan.',
            'consider_intelligence'            => 'Kecerdasan interpersonal mendukung karir di bidang pelayanan.',
            'consider_academic_achievement'    => 'Nilai akademik mendukung masuk ke program studi pilihan.',
            'consider_parental_support'        => 'Orang tua mendukung pilihan karir selama masuk akal.',
            'consider_gods_will'               => 'Saya berdoa agar pilihan karir sesuai kehendak Tuhan.',
            'additional_considerations'        => 'Mempertimbangkan kebutuhan masyarakat sekitar.',
            'career_decision_matrix'           => $decisionMatrix,
        ]);

        // 8. Eksplorasi Karir P2 — berisi CITA-CITA utama
        RmdCareerExplorationP2::updateOrCreate(['user_id' => $user->id], [
            'final_career_choice'  => $citaCita,
            'final_career_reason'  => "Saya memilih {$citaCita} karena sesuai dengan minat, kemampuan, dan panggilan hidup saya untuk melayani sesama.",
            'swot_definition'      => 'SWOT adalah alat analisis untuk mengevaluasi kekuatan, kelemahan, peluang, dan ancaman dalam pengambilan keputusan karir.',
            'swot_analysis_data'   => $swotData,
            'mentoring_notes'      => "Melalui proses mentoring, saya semakin yakin bahwa {$citaCita} adalah pilihan yang tepat sesuai desain Tuhan untuk hidup saya.",
            'chapter4_check1'      => true,
            'chapter4_check2'      => true,
            'chapter4_check3'      => true,
        ]);

        // 9. Persiapan Pulau Impian
        $professionQuestions = json_encode([
            ['pertanyaan' => 'Apa yang dilakukan seorang ' . $citaCita . '?', 'jawaban' => 'Bekerja di bidang yang relevan dengan keahlian dan panggilan hidup.'],
            ['pertanyaan' => 'Pendidikan apa yang dibutuhkan?', 'jawaban' => 'Sarjana di bidang terkait dari perguruan tinggi terakreditasi.'],
            ['pertanyaan' => 'Berapa penghasilan rata-rata?', 'jawaban' => 'Cukup untuk hidup layak dan membantu keluarga.'],
        ]);
        $swotIsland = json_encode([
            'strengths'     => ['Motivasi tinggi', 'Dukungan keluarga kuat'],
            'weaknesses'    => ['Pengalaman masih terbatas'],
            'opportunities' => ['Banyak peluang di bidang ini'],
            'threats'       => ['Persaingan semakin ketat'],
        ]);
        RmdPreparationDreamIsland::updateOrCreate(['user_id' => $user->id], [
            'profession_questions' => $professionQuestions,
            'swot_analysis'        => $swotIsland,
            'improvement_plan'     => "Rencana saya untuk menjadi {$citaCita}: (1) Menyelesaikan pendidikan S1, (2) Magang/praktik kerja, (3) Mengikuti pelatihan profesional, (4) Membangun jaringan, (5) Terus berdoa dan mengandalkan Tuhan.",
        ]);
    }
}
