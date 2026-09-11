import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { a as autoGrow } from "./autoGrow-BUc_DkMi.js";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-DY-v4bup.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { _ as __ } from "./lang-COBcTD8W.js";
import { P as PrimaryButton } from "./PrimaryButton-BNNL2gCI.js";
import { Transition } from "@headlessui/react";
import "./Dropdown-BgvF6zKd.js";
import "./ThemeToggle-BY9dagkZ.js";
import "./TextInput-D0qTZeQv.js";
import "axios";
import "./ProfilePhoto-B39VtFFM.js";
import "./Modal-CKHW52Ki.js";
import "./SecondaryButton-TjIrbn1G.js";
import "./DangerButton-B7to2Tbx.js";
import "./Footer-CDwTxrct.js";
import "./useTheme-CngFDcs1.js";
const LEARNING_STYLE_PROFESSIONS = {
  visual_professions: [
    {
      category: "Seni & Desain Kreatif",
      items: [
        "Desainer Grafis / UI/UX Designer",
        "Animator / Motion Graphic Designer",
        "Fotografer / Videografer",
        "Ilustrator / Seniman Digital",
        "Fashion Desainer / Stylist",
        "Sutradara Film / Sinematografer"
      ]
    },
    {
      category: "Arsitektur & Teknik Visual",
      items: [
        "Arsitek / Arsitektur Lansekap",
        "Interior Desainer",
        "Drafter / CAD Engineer",
        "Urban Planner / Perencana Kota"
      ]
    },
    {
      category: "Sains & Data Visual",
      items: [
        "Analis Data / Data Visualization Specialist",
        "Ahli Radiologi / Sonografer Medis",
        "Kartografer / GIS Specialist",
        "Astronom / Astrofisikawan"
      ]
    },
    {
      category: "Media & Komunikasi Visual",
      items: [
        "Art Director / Creative Director",
        "Game Designer / Game Developer",
        "Kurator Museum / Sejarawan Seni",
        "Jurnalis Foto / Jurnalis Visual"
      ]
    }
  ],
  auditory_professions: [
    {
      category: "Pendidikan & Komunikasi",
      items: [
        "Guru / Dosen / Pengajar",
        "Penyiar Radio / Podcaster",
        "Presenter TV / MC / Host",
        "Jurnalis / Reporter Berita"
      ]
    },
    {
      category: "Hukum & Konseling",
      items: [
        "Pengacara / Advokat / Jaksa",
        "Konselor Psikologi / Terapis Bicara",
        "Penerjemah Lisan / Interpreter",
        "Mediator / Negosiator Konflik"
      ]
    },
    {
      category: "Seni & Musik",
      items: [
        "Musisi / Penyanyi Profesional",
        "Aktor / Pengisi Suara (Voice Actor)",
        "Komposer / Produser Musik",
        "Guru Musik / Terapis Musik"
      ]
    },
    {
      category: "Bisnis & Pelayanan",
      items: [
        "Sales Manager / Marketing Komunikasi",
        "Public Speaker / Motivator",
        "Customer Experience Manager",
        "Konsultan SDM / Pelatih Korporat"
      ]
    }
  ],
  kinesthetic_professions_style: [
    {
      category: "Olahraga & Seni Gerak",
      items: [
        "Atlet Profesional / Pelatih Olahraga",
        "Penari / Koreografer",
        "Personal Trainer / Instruktur Fitness",
        "Instruktur Yoga / Pilates / Martial Arts"
      ]
    },
    {
      category: "Kesehatan & Medis",
      items: [
        "Dokter Umum / Dokter Bedah",
        "Fisioterapis / Terapis Okupasi",
        "Perawat / Bidan Profesional",
        "Dokter Gigi / Teknisi Gigi"
      ]
    },
    {
      category: "Teknik & Rekayasa Praktis",
      items: [
        "Mekanik / Teknisi Otomotif",
        "Tukang Kayu / Pengrajin (Craftsman)",
        "Teknisi Listrik / Elektronik",
        "Insinyur Konstruksi / Teknisi Lapangan"
      ]
    },
    {
      category: "Pangan, Alam & Keselamatan",
      items: [
        "Chef / Koki Profesional / Pastry Chef",
        "Petani Modern / Agripreneur",
        "Ahli Konservasi Alam / Ranger",
        "Petugas Pemadam Kebakaran / Tim SAR"
      ]
    }
  ]
};
const getParsedItems = (str) => {
  if (!str) return /* @__PURE__ */ new Set();
  return new Set(
    str.split(",").map((s) => s.trim()).filter(Boolean)
  );
};
const toggleItem = (currentStr, item) => {
  const items = getParsedItems(currentStr);
  if (items.has(item)) {
    items.delete(item);
  } else {
    items.add(item);
  }
  return Array.from(items).join(", ");
};
const addCustomItem = (currentStr, customItem) => {
  if (!customItem.trim()) return currentStr;
  const items = getParsedItems(currentStr);
  items.add(customItem.trim());
  return Array.from(items).join(", ");
};
const MULTIPLE_INTELLIGENCE_DATA = {
  linguistic: {
    abilities: [
      "Membaca dan menulis dengan baik dan cepat",
      "Mudah mengingat kata-kata, kutipan, dan informasi verbal",
      "Pandai bercerita dan menjelaskan ide secara lisan",
      "Peka terhadap makna, ritme, dan bunyi bahasa",
      "Mampu mempelajari bahasa asing dengan mudah",
      "Kemampuan retorika, persuasi, dan debat yang kuat",
      "Suka bermain kata-kata (teka-teki, pantun, puisi)",
      "Mampu menulis dengan gaya dan struktur yang variatif"
    ],
    professions: [
      "Penulis / Novelis / Sastrawan",
      "Jurnalis / Reporter / Editor",
      "Pengacara / Advokat / Jaksa",
      "Guru / Dosen Bahasa / Pengajar",
      "Penyiar / Presenter / Host Acara",
      "Penerjemah / Interpreter / Translator",
      "Politikus / Orator / Juru Bicara",
      "Copywriter / Content Writer / Blogger",
      "Diplomat / Negosiator",
      "Penyair / Penulis Skenario / Script Writer"
    ]
  },
  logical_math: {
    abilities: [
      "Berpikir logis, sistematis, dan analitis",
      "Mampu memecahkan masalah matematika dan sains",
      "Mengenali pola, hubungan, dan sebab-akibat dengan cepat",
      "Berpikir abstrak dan ilmiah",
      "Mampu mengklasifikasikan, mengurutkan, dan mengkategorikan",
      "Menyukai eksperimen, pembuktian logis, dan strategi",
      "Kemampuan kalkulasi dan komputasi yang kuat",
      "Senang dengan teka-teki logika dan permainan strategi"
    ],
    professions: [
      "Ilmuwan / Peneliti / Akademisi",
      "Insinyur / Engineer (Sipil, Mesin, Elektro)",
      "Programmer / Software Developer / Data Scientist",
      "Akuntan / Auditor / Analis Keuangan",
      "Ahli Statistik / Matematikawan / Aktuaris",
      "Dokter / Ahli Medis / Apoteker",
      "Ekonom / Analis Bisnis / Konsultan Strategi",
      "Detektif / Investigator / Kriminolog",
      "Arsitek / Perencana Kota / Quantity Surveyor",
      "Trader / Analis Investasi / Manajer Risiko"
    ]
  },
  visual_spatial: {
    abilities: [
      "Berpikir dalam bentuk gambar, peta, dan diagram",
      "Orientasi ruang dan navigasi yang kuat",
      "Mampu membayangkan objek dalam tiga dimensi",
      "Peka terhadap warna, garis, bentuk, dan komposisi",
      "Mudah membaca peta, grafik, dan ilustrasi teknis",
      "Mampu memvisualisasikan perubahan dan transformasi",
      "Kepekaan estetika dan seni visual yang tinggi",
      "Pandai menggambar, merancang, dan mendekorasi"
    ],
    professions: [
      "Arsitek / Desainer Interior / Urban Planner",
      "Desainer Grafis / UI/UX Designer / Motion Designer",
      "Pilot / Navigator / Kapten Kapal",
      "Pelukis / Seniman / Ilustrator",
      "Ahli Radiologi / Dokter Bedah",
      "Insinyur / Drafter / CAD Engineer",
      "Fotografer / Videografer / Sinematografer",
      "Animator / Game Designer / 3D Artist",
      "Kartografer / GIS Specialist / Geomatics Engineer",
      "Ahli Geologi / Astronomer / Oseanograf"
    ]
  },
  kinesthetic: {
    abilities: [
      "Mengontrol gerakan tubuh dengan presisi dan kelincahan",
      "Belajar paling efektif melalui praktik langsung (hands-on)",
      "Koordinasi fisik dan keseimbangan yang sangat baik",
      "Peka terhadap sentuhan, tekstur, dan sensasi fisik",
      "Mampu memanipulasi objek dengan keterampilan tangan",
      "Mengekspresikan diri melalui gerakan dan tari",
      "Ketangkasan, refleks cepat, dan reaksi fisik yang baik",
      "Ketahanan fisik dan stamina yang kuat"
    ],
    professions: [
      "Atlet Profesional / Olahragawan / Pelatih Olahraga",
      "Penari / Koreografer / Instruktur Seni Gerak",
      "Dokter Bedah / Dokter Gigi / Bidan Profesional",
      "Pengrajin / Seniman Pahat / Tukang Kayu",
      "Aktor / Performer / Seniman Pertunjukan",
      "Fisioterapis / Terapis Okupasi / Chiropractor",
      "Mekanik / Teknisi Otomotif / Insinyur Lapangan",
      "Chef / Koki Profesional / Pastry Chef",
      "Personal Trainer / Instruktur Fitness / Yoga",
      "Petugas Pemadam Kebakaran / Tim SAR / Tentara"
    ]
  },
  musical: {
    abilities: [
      "Peka terhadap ritme, nada, melodi, dan harmoni musik",
      "Mudah mengenali dan mereproduksi pola-pola musik",
      "Mampu bernyanyi atau memainkan alat musik dengan baik",
      "Memahami struktur, teori, dan komposisi musik",
      "Kemampuan membedakan suara, irama, dan pitch dengan akurat",
      "Mengingat informasi lebih mudah melalui lagu atau musik",
      "Mampu menciptakan dan menyusun komposisi musik",
      "Kepekaan emosional yang tinggi terhadap ekspresi musikal"
    ],
    professions: [
      "Musisi / Penyanyi Profesional",
      "Komposer / Arranger / Produser Musik",
      "Guru Musik / Instruktur Vokal / Instruktur Alat Musik",
      "Sound Engineer / Audio Engineer / Music Producer",
      "Terapis Musik / Music Therapist",
      "Konduktor Orkestra / Dirigen",
      "Penyiar Radio / DJ / Podcaster",
      "Pengisi Suara / Voice Actor / Dubber",
      "Kritikus Musik / Musikolog / Jurnalis Musik",
      "Game Audio Designer / Komposer Soundtrack Film"
    ]
  },
  interpersonal: {
    abilities: [
      "Memahami perasaan, motivasi, dan kebutuhan orang lain",
      "Berkomunikasi secara efektif dan persuasif",
      "Berempati tinggi dan mudah membaca emosi",
      "Mampu memimpin, mengorganisasi, dan mempengaruhi orang",
      "Pandai menyelesaikan konflik dan negosiasi",
      "Mampu bekerja sama dalam tim secara harmonis",
      "Mudah bergaul dan membangun jaringan sosial yang luas",
      "Peka terhadap dinamika kelompok dan situasi sosial"
    ],
    professions: [
      "Guru / Konselor / Psikolog",
      "Manajer / Pemimpin Tim / Direktur",
      "Politikus / Diplomat / Juru Bicara",
      "Pekerja Sosial / Konselor Karir",
      "Pengacara / Mediator / Negosiator",
      "Sales Manager / Marketing / Customer Relations",
      "HR Manager / Rekruter / Trainer Korporat",
      "Terapis / Psikiater / Life Coach",
      "Pemimpin Agama / Rohaniawan / Konselor Spiritual",
      "Event Organizer / Public Relations / Brand Strategist"
    ]
  },
  intrapersonal: {
    abilities: [
      "Memahami diri sendiri secara mendalam (kekuatan & kelemahan)",
      "Kemampuan refleksi, introspeksi, dan kesadaran diri yang kuat",
      "Mampu mengatur emosi, motivasi, dan tujuan pribadi",
      "Mandiri dan memiliki disiplin diri yang kuat",
      "Mampu menetapkan visi jangka panjang dan merencanakan",
      "Peka terhadap nilai-nilai, keyakinan, dan prinsip hidup",
      "Mampu bekerja secara mandiri dengan fokus dan konsentrasi tinggi",
      "Kemampuan berpikir mendalam, filosofis, dan reflektif"
    ],
    professions: [
      "Psikolog / Konselor Klinis / Psikoterapis",
      "Filsuf / Penulis / Pemikir",
      "Pengusaha / Entrepreneur / Intrapreneur",
      "Peneliti / Ilmuwan Mandiri",
      "Penulis / Blogger / Content Creator",
      "Rohaniawan / Pemimpin Spiritual / Pendeta",
      "Life Coach / Mentor / Motivator",
      "Seniman / Kreator Independen",
      "Dokter / Ahli Kesehatan Mental / Psikiater",
      "Manajer Proyek / Konsultan Strategi"
    ]
  },
  naturalist: {
    abilities: [
      "Mengenali dan mengklasifikasikan flora, fauna, dan mineral",
      "Kepekaan tinggi terhadap lingkungan alam sekitar",
      "Mengamati pola alam dan perubahan ekosistem",
      "Mampu bertahan dan beradaptasi di lingkungan alam",
      "Kepedulian tinggi terhadap konservasi dan pelestarian alam",
      "Membedakan spesies dan memahami karakteristik makhluk hidup",
      "Kemampuan berkebun, bercocok tanam, dan budidaya",
      "Senang mengeksplorasi alam (hiking, diving, birdwatching)"
    ],
    professions: [
      "Biolog / Ahli Ekologi / Ahli Taksonomi",
      "Dokter Hewan / Veteriner / Konservator Satwa",
      "Petani Modern / Agronome / Ahli Hortikultura",
      "Ahli Lingkungan / Konservasionis / Aktivis Lingkungan",
      "Ahli Botani / Zoologi / Entomologi",
      "Geolog / Oseanograf / Ahli Meteorologi",
      "Ranger / Penjaga Hutan / Taman Nasional",
      "Peneliti Kelautan / Ahli Biologi Laut",
      "Landscape Architect / Ahli Agroforestri",
      "Chef Berbasis Bahan Alam / Ahli Pangan Alami"
    ]
  }
};
function MenentukanCitaCita({ auth, careerExploration }) {
  const { data, setData, post, processing, recentlySuccessful } = useForm({
    visual_professions: careerExploration?.visual_professions || "",
    auditory_professions: careerExploration?.auditory_professions || "",
    kinesthetic_professions_style: careerExploration?.kinesthetic_professions_style || "",
    interested_professions_from_style: careerExploration?.interested_professions_from_style || "",
    linguistic_ability: careerExploration?.linguistic_ability || "",
    linguistic_professions: careerExploration?.linguistic_professions || "",
    logical_math_ability: careerExploration?.logical_math_ability || "",
    logical_math_professions: careerExploration?.logical_math_professions || "",
    visual_spatial_ability: careerExploration?.visual_spatial_ability || "",
    visual_spatial_professions: careerExploration?.visual_spatial_professions || "",
    kinesthetic_ability: careerExploration?.kinesthetic_ability || "",
    kinesthetic_professions: careerExploration?.kinesthetic_professions || "",
    musical_ability: careerExploration?.musical_ability || "",
    musical_professions: careerExploration?.musical_professions || "",
    interpersonal_ability: careerExploration?.interpersonal_ability || "",
    interpersonal_professions: careerExploration?.interpersonal_professions || "",
    intrapersonal_ability: careerExploration?.intrapersonal_ability || "",
    intrapersonal_professions: careerExploration?.intrapersonal_professions || "",
    naturalist_ability: careerExploration?.naturalist_ability || "",
    naturalist_professions: careerExploration?.naturalist_professions || "",
    consider_learning_style: !!careerExploration?.consider_learning_style,
    consider_intelligence: !!careerExploration?.consider_intelligence,
    consider_academic_achievement: !!careerExploration?.consider_academic_achievement,
    consider_parental_support: !!careerExploration?.consider_parental_support,
    consider_gods_will: !!careerExploration?.consider_gods_will,
    additional_considerations: careerExploration?.additional_considerations || "",
    career_decision_matrix: careerExploration?.career_decision_matrix || [
      { alternative: "", factors: "" },
      { alternative: "", factors: "" },
      { alternative: "", factors: "" }
    ]
  });
  const [customText, setCustomText] = useState({
    visual_professions: "",
    auditory_professions: "",
    kinesthetic_professions_style: ""
  });
  const STYLE_IDS = [
    "visual_professions",
    "auditory_professions",
    "kinesthetic_professions_style"
  ];
  const activeStyle = STYLE_IDS.find((id) => getParsedItems(data[id]).size > 0) ?? null;
  const clearStyle = (styleId) => {
    setData({
      ...data,
      [styleId]: "",
      interested_professions_from_style: ""
    });
  };
  const [miCustomText, setMiCustomText] = useState({
    linguistic_ability: "",
    linguistic_professions: "",
    logical_math_ability: "",
    logical_math_professions: "",
    visual_spatial_ability: "",
    visual_spatial_professions: "",
    kinesthetic_ability: "",
    kinesthetic_professions: "",
    musical_ability: "",
    musical_professions: "",
    interpersonal_ability: "",
    interpersonal_professions: "",
    intrapersonal_ability: "",
    intrapersonal_professions: "",
    naturalist_ability: "",
    naturalist_professions: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("rmd.career-exploration.store"), {
      preserveScroll: true
    });
  };
  const updateMatrix = (index, field, value) => {
    const newMatrix = [...data.career_decision_matrix];
    newMatrix[index][field] = value;
    setData("career_decision_matrix", newMatrix);
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      user: auth.user,
      header: /* @__PURE__ */ jsx("h2", { className: "font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight", children: __("RMD_CH4_TITLE") }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("RMD_CH4_DETERMINE_GOAL_TITLE") }),
        /* @__PURE__ */ jsxs("div", { className: "py-12 bg-gray-50 dark:bg-gray-900 min-h-screen relative", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute inset-0 pointer-events-none z-0",
              style: {
                backgroundImage: "url('/images/rmd-backgrounds/latar-_10_.svg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                opacity: 0.08
              }
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 relative z-10", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-center space-y-2", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-lg font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest", children: __("RMD_CH4_CHAPTER") }),
                /* @__PURE__ */ jsx("h3", { className: "text-3xl font-black text-gray-900 dark:text-white uppercase", children: __("RMD_CH4_MAIN_TITLE") }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-400 italic font-medium", children: __("RMD_CH4_MEETING") })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-8 space-y-6 text-gray-700 dark:text-gray-300 text-lg leading-relaxed", children: /* @__PURE__ */ jsxs("section", { children: [
                /* @__PURE__ */ jsx("h5", { className: "text-xl font-bold text-gray-900 dark:text-white mb-3", children: __("RMD_CH4_OPENING_TITLE") }),
                /* @__PURE__ */ jsx("p", { children: __("RMD_CH4_OPENING_TEXT_1") }),
                /* @__PURE__ */ jsx("p", { className: "mt-4", children: __("RMD_CH4_OPENING_TEXT_2") })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-8", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 space-y-6", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold text-gray-900 dark:text-white", children: __("RMD_CH4_PROFESSION_TITLE") }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsx("h5", { className: "text-lg font-semibold text-gray-800 dark:text-gray-200 italic underline decoration-orange-400 decoration-2", children: __("RMD_CH4_LEARNING_STYLE") }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400", children: __("RMD_CH4_LEARNING_STYLE_DESC") })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-around py-8", children: [
                  /* @__PURE__ */ jsxs("div", { className: "text-center space-y-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-orange-400 rounded-full flex items-center justify-center text-white text-3xl", children: "👁️" }),
                    /* @__PURE__ */ jsx("p", { className: "font-bold uppercase text-sm tracking-widest", children: __("RMD_CH4_VISUAL") })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "text-center space-y-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white text-3xl", children: "👂" }),
                    /* @__PURE__ */ jsx("p", { className: "font-bold uppercase text-sm tracking-widest", children: __("RMD_CH4_AUDITORY") })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "text-center space-y-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl", children: "👆" }),
                    /* @__PURE__ */ jsx("p", { className: "font-bold uppercase text-sm tracking-widest", children: __("RMD_CH4_KINESTHETIC") })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg text-sm text-amber-800 dark:text-amber-300", children: [
                  /* @__PURE__ */ jsx("span", { className: "shrink-0", children: "⚠️" }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    "Pilih profesi dari",
                    " ",
                    /* @__PURE__ */ jsx("strong", { children: "1 gaya belajar saja" }),
                    ". Setelah memilih, gaya belajar lainnya akan terkunci. Klik ",
                    /* @__PURE__ */ jsx("em", { children: "Ganti Pilihan" }),
                    " untuk beralih ke gaya belajar lain."
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "border-2 border-orange-400 dark:border-orange-700 rounded-3xl overflow-hidden shadow-lg", children: /* @__PURE__ */ jsxs("table", { className: "w-full border-collapse", children: [
                  /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-cyan-400 dark:bg-cyan-700 text-white", children: [
                    /* @__PURE__ */ jsx("th", { className: "py-4 px-6 border-r border-white/20 w-1/4 text-center font-bold", children: __(
                      "RMD_CH4_TABLE_LEARNING_STYLE"
                    ) }),
                    /* @__PURE__ */ jsx("th", { className: "py-4 px-6 text-center font-bold", children: __(
                      "RMD_CH4_TABLE_SUITABLE_PROFESSION"
                    ) })
                  ] }) }),
                  /* @__PURE__ */ jsx("tbody", { className: "divide-y-2 divide-orange-400 dark:divide-orange-700 text-gray-800 dark:text-gray-200", children: [
                    {
                      label: __("RMD_CH4_VISUAL"),
                      id: "visual_professions",
                      icon: "👁️",
                      accentBg: "bg-orange-50 dark:bg-orange-900/10",
                      accentBorder: "border-orange-200 dark:border-orange-800",
                      accentText: "text-orange-700 dark:text-orange-300",
                      checkColor: "accent-orange-500"
                    },
                    {
                      label: __(
                        "RMD_CH4_AUDITORY_LABEL"
                      ),
                      id: "auditory_professions",
                      icon: "👂",
                      accentBg: "bg-red-50 dark:bg-red-900/10",
                      accentBorder: "border-red-200 dark:border-red-800",
                      accentText: "text-red-700 dark:text-red-300",
                      checkColor: "accent-red-500"
                    },
                    {
                      label: __(
                        "RMD_CH4_KINESTHETIC"
                      ),
                      id: "kinesthetic_professions_style",
                      icon: "👆",
                      accentBg: "bg-green-50 dark:bg-green-900/10",
                      accentBorder: "border-green-200 dark:border-green-800",
                      accentText: "text-green-700 dark:text-green-300",
                      checkColor: "accent-green-500"
                    }
                  ].map((item) => {
                    const checked = getParsedItems(
                      data[item.id]
                    );
                    const categories = LEARNING_STYLE_PROFESSIONS[item.id] || [];
                    const allPredefined = categories.flatMap((c) => c.items);
                    const customItems = Array.from(
                      checked
                    ).filter(
                      (i) => !allPredefined.includes(i)
                    );
                    const isLocked = activeStyle !== null && activeStyle !== item.id;
                    return /* @__PURE__ */ jsxs("tr", { children: [
                      /* @__PURE__ */ jsx(
                        "td",
                        {
                          className: `py-6 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center align-top bg-gray-50 dark:bg-gray-800/50`,
                          children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2 sticky top-4", children: [
                            /* @__PURE__ */ jsx(
                              "span",
                              {
                                className: `text-4xl${isLocked ? " opacity-40" : ""}`,
                                children: item.icon
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              "span",
                              {
                                className: `font-bold text-sm uppercase tracking-wider${isLocked ? " text-gray-400 dark:text-gray-500" : ""}`,
                                children: item.label
                              }
                            ),
                            isLocked ? /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 border border-gray-200 dark:bg-gray-700 dark:text-gray-500 dark:border-gray-600", children: "🔒 Terkunci" }) : checked.size > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
                              /* @__PURE__ */ jsxs(
                                "span",
                                {
                                  className: `text-xs font-semibold px-2 py-0.5 rounded-full ${item.accentBg} ${item.accentText} border ${item.accentBorder}`,
                                  children: [
                                    checked.size,
                                    " ",
                                    "dipilih"
                                  ]
                                }
                              ),
                              /* @__PURE__ */ jsx(
                                "button",
                                {
                                  type: "button",
                                  onClick: () => clearStyle(
                                    item.id
                                  ),
                                  className: "text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold underline mt-1 transition-colors",
                                  children: "Ganti Pilihan"
                                }
                              )
                            ] }) : null
                          ] })
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "td",
                        {
                          className: `p-4 align-top${isLocked ? " opacity-40 pointer-events-none select-none" : ""}`,
                          children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                            categories.map(
                              (cat) => /* @__PURE__ */ jsxs(
                                "div",
                                {
                                  children: [
                                    /* @__PURE__ */ jsxs("p", { className: "text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2", children: [
                                      /* @__PURE__ */ jsx(
                                        "span",
                                        {
                                          className: `inline-block w-6 h-0.5 rounded ${item.accentBg.replace(
                                            "bg-",
                                            "bg-"
                                          ).replace(
                                            "/10",
                                            ""
                                          )} bg-current opacity-50`
                                        }
                                      ),
                                      cat.category
                                    ] }),
                                    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-1", children: cat.items.map(
                                      (prof) => /* @__PURE__ */ jsxs(
                                        "label",
                                        {
                                          className: `flex items-center gap-2.5 cursor-pointer rounded-lg px-3 py-2 transition-all select-none ${checked.has(
                                            prof
                                          ) ? `${item.accentBg} border ${item.accentBorder}` : "hover:bg-gray-50 dark:hover:bg-gray-700/40 border border-transparent"}`,
                                          children: [
                                            /* @__PURE__ */ jsx(
                                              "input",
                                              {
                                                type: "checkbox",
                                                className: `w-4 h-4 rounded shrink-0 ${item.checkColor}`,
                                                checked: checked.has(
                                                  prof
                                                ),
                                                onChange: () => setData(
                                                  item.id,
                                                  toggleItem(
                                                    data[item.id],
                                                    prof
                                                  )
                                                )
                                              }
                                            ),
                                            /* @__PURE__ */ jsx(
                                              "span",
                                              {
                                                className: `text-sm leading-snug ${checked.has(
                                                  prof
                                                ) ? `${item.accentText} font-medium` : "text-gray-700 dark:text-gray-300"}`,
                                                children: prof
                                              }
                                            )
                                          ]
                                        },
                                        prof
                                      )
                                    ) })
                                  ]
                                },
                                cat.category
                              )
                            ),
                            customItems.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
                              /* @__PURE__ */ jsx("p", { className: "text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2", children: "Profesi Lainnya (Ditambahkan)" }),
                              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: customItems.map(
                                (ci) => /* @__PURE__ */ jsxs(
                                  "span",
                                  {
                                    className: "flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-700",
                                    children: [
                                      ci,
                                      /* @__PURE__ */ jsx(
                                        "button",
                                        {
                                          type: "button",
                                          onClick: () => setData(
                                            item.id,
                                            toggleItem(
                                              data[item.id],
                                              ci
                                            )
                                          ),
                                          className: "ml-1 text-blue-400 hover:text-red-500 font-bold leading-none",
                                          title: "Hapus",
                                          children: "×"
                                        }
                                      )
                                    ]
                                  },
                                  ci
                                )
                              ) })
                            ] }),
                            /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700", children: [
                              /* @__PURE__ */ jsx(
                                "input",
                                {
                                  type: "text",
                                  value: customText[item.id],
                                  onChange: (e) => setCustomText(
                                    (prev) => ({
                                      ...prev,
                                      [item.id]: e.target.value
                                    })
                                  ),
                                  onKeyDown: (e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      if (customText[item.id].trim()) {
                                        setData(
                                          item.id,
                                          addCustomItem(
                                            data[item.id],
                                            customText[item.id]
                                          )
                                        );
                                        setCustomText(
                                          (prev) => ({
                                            ...prev,
                                            [item.id]: ""
                                          })
                                        );
                                      }
                                    }
                                  },
                                  className: "flex-1 text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 dark:text-gray-200",
                                  placeholder: "Tambah profesi lainnya…"
                                }
                              ),
                              /* @__PURE__ */ jsx(
                                "button",
                                {
                                  type: "button",
                                  onClick: () => {
                                    if (customText[item.id].trim()) {
                                      setData(
                                        item.id,
                                        addCustomItem(
                                          data[item.id],
                                          customText[item.id]
                                        )
                                      );
                                      setCustomText(
                                        (prev) => ({
                                          ...prev,
                                          [item.id]: ""
                                        })
                                      );
                                    }
                                  },
                                  className: "px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg font-semibold transition-colors shrink-0",
                                  children: "+ Tambah"
                                }
                              )
                            ] })
                          ] })
                        }
                      )
                    ] }, item.id);
                  }) })
                ] }) }),
                (() => {
                  const SOURCES = [
                    {
                      id: "visual_professions",
                      label: __("RMD_CH4_VISUAL"),
                      icon: "👁️",
                      chipBase: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-200 dark:border-orange-700"
                    },
                    {
                      id: "auditory_professions",
                      label: __("RMD_CH4_AUDITORY_LABEL"),
                      icon: "👂",
                      chipBase: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-200 dark:border-red-700"
                    },
                    {
                      id: "kinesthetic_professions_style",
                      label: __("RMD_CH4_KINESTHETIC"),
                      icon: "👆",
                      chipBase: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-200 dark:border-green-700"
                    }
                  ];
                  const interested = getParsedItems(
                    data.interested_professions_from_style
                  );
                  const toggleInterested = (prof) => {
                    const set = getParsedItems(
                      data.interested_professions_from_style
                    );
                    if (set.has(prof)) {
                      set.delete(prof);
                    } else {
                      set.add(prof);
                    }
                    setData(
                      "interested_professions_from_style",
                      Array.from(set).join(", ")
                    );
                  };
                  const allCheckedCount = SOURCES.reduce(
                    (n, s) => n + getParsedItems(data[s.id]).size,
                    0
                  );
                  return /* @__PURE__ */ jsxs("div", { className: "mt-4 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-l-4 border-blue-400", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 mb-4", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 italic text-sm", children: __("RMD_CH4_NOTE_MARK_THREE") }),
                      /* @__PURE__ */ jsxs(
                        "span",
                        {
                          className: `shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border ${interested.size > 0 ? "bg-blue-500 text-white border-blue-500" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600"}`,
                          children: [
                            interested.size,
                            " dipilih"
                          ]
                        }
                      )
                    ] }),
                    allCheckedCount === 0 ? /* @__PURE__ */ jsx("div", { className: "py-6 text-center text-gray-400 dark:text-gray-500 text-sm italic", children: "Belum ada profesi yang dicentang di tabel di atas. Silakan pilih profesi yang sesuai terlebih dahulu." }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: SOURCES.map((src) => {
                      const profs = Array.from(
                        getParsedItems(
                          data[src.id]
                        )
                      );
                      if (profs.length === 0)
                        return null;
                      return /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsxs("p", { className: "text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1.5", children: [
                          /* @__PURE__ */ jsx("span", { children: src.icon }),
                          " ",
                          src.label
                        ] }),
                        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: profs.map(
                          (prof) => /* @__PURE__ */ jsxs(
                            "button",
                            {
                              type: "button",
                              onClick: () => toggleInterested(
                                prof
                              ),
                              className: `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${interested.has(
                                prof
                              ) ? "bg-blue-500 text-white border-blue-600 shadow-md scale-[1.03]" : `${src.chipBase} hover:opacity-80`}`,
                              children: [
                                interested.has(
                                  prof
                                ) && /* @__PURE__ */ jsx("span", { className: "text-xs font-black", children: "✓" }),
                                prof
                              ]
                            },
                            prof
                          )
                        ) })
                      ] }, src.id);
                    }) })
                  ] });
                })(),
                /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600", children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: processing,
                    className: "px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50",
                    children: processing ? __("RMD_SAVING") : __("RMD_SAVE_ANSWER_BUTTON")
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 space-y-6", children: [
                /* @__PURE__ */ jsx("h5", { className: "text-lg font-semibold text-gray-800 dark:text-gray-200 italic underline decoration-orange-400 decoration-2", children: __("RMD_CH4_MULTIPLE_INTELLIGENCE_TITLE") }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400", children: __("RMD_CH4_MULTIPLE_INTELLIGENCE_DESC") }),
                /* @__PURE__ */ jsx("div", { className: "border-2 border-orange-400 dark:border-orange-700 rounded-3xl overflow-hidden shadow-lg overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full border-collapse", children: [
                  /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-cyan-400 dark:bg-cyan-700 text-white", children: [
                    /* @__PURE__ */ jsx("th", { className: "py-4 px-4 border-r border-white/20 w-12 text-center font-bold", children: __("RMD_CH4_TABLE_NO") }),
                    /* @__PURE__ */ jsx("th", { className: "py-4 px-6 border-r border-white/20 w-1/4 text-center font-bold", children: __(
                      "RMD_CH4_TABLE_MULTIPLE_INTELLIGENCE"
                    ) }),
                    /* @__PURE__ */ jsx("th", { className: "py-4 px-6 border-r border-white/20 text-center font-bold", children: __("RMD_CH4_TABLE_ABILITY") }),
                    /* @__PURE__ */ jsx("th", { className: "py-4 px-6 text-center font-bold", children: __(
                      "RMD_CH4_TABLE_SUITABLE_PROFESSION"
                    ) })
                  ] }) }),
                  /* @__PURE__ */ jsx("tbody", { className: "divide-y-2 divide-orange-400 dark:divide-orange-700 text-gray-800 dark:text-gray-200 text-sm", children: [
                    {
                      no: 1,
                      key: "linguistic",
                      label: __(
                        "RMD_CH4_MI_LINGUISTIC"
                      ),
                      ability: "linguistic_ability",
                      professions: "linguistic_professions"
                    },
                    {
                      no: 2,
                      key: "logical_math",
                      label: __(
                        "RMD_CH4_MI_LOGICAL_MATH"
                      ),
                      ability: "logical_math_ability",
                      professions: "logical_math_professions"
                    },
                    {
                      no: 3,
                      key: "visual_spatial",
                      label: __(
                        "RMD_CH4_MI_VISUAL_SPATIAL"
                      ),
                      ability: "visual_spatial_ability",
                      professions: "visual_spatial_professions"
                    },
                    {
                      no: 4,
                      key: "kinesthetic",
                      label: __(
                        "RMD_CH4_MI_KINESTHETIC"
                      ),
                      ability: "kinesthetic_ability",
                      professions: "kinesthetic_professions"
                    },
                    {
                      no: 5,
                      key: "musical",
                      label: __("RMD_CH4_MI_MUSICAL"),
                      ability: "musical_ability",
                      professions: "musical_professions"
                    },
                    {
                      no: 6,
                      key: "interpersonal",
                      label: __(
                        "RMD_CH4_MI_INTERPERSONAL"
                      ),
                      ability: "interpersonal_ability",
                      professions: "interpersonal_professions"
                    },
                    {
                      no: 7,
                      key: "intrapersonal",
                      label: __(
                        "RMD_CH4_MI_INTRAPERSONAL"
                      ),
                      ability: "intrapersonal_ability",
                      professions: "intrapersonal_professions"
                    },
                    {
                      no: 8,
                      key: "naturalist",
                      label: __(
                        "RMD_CH4_MI_NATURALIST"
                      ),
                      ability: "naturalist_ability",
                      professions: "naturalist_professions"
                    }
                  ].map((item) => {
                    const miInfo = MULTIPLE_INTELLIGENCE_DATA[item.key];
                    const abilityChecked = getParsedItems(
                      data[item.ability]
                    );
                    const profChecked = getParsedItems(
                      data[item.professions]
                    );
                    const customAbilities = Array.from(
                      abilityChecked
                    ).filter(
                      (a) => !miInfo.abilities.includes(
                        a
                      )
                    );
                    const customProfs = Array.from(
                      profChecked
                    ).filter(
                      (p) => !miInfo.professions.includes(
                        p
                      )
                    );
                    return /* @__PURE__ */ jsxs("tr", { children: [
                      /* @__PURE__ */ jsx("td", { className: "py-4 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold bg-gray-50 dark:bg-gray-800/50 align-top", children: item.no }),
                      /* @__PURE__ */ jsx("td", { className: "py-4 px-4 border-r-2 border-orange-400 dark:border-orange-700 font-bold bg-gray-50 dark:bg-gray-800/50 align-top text-sm leading-snug", children: item.label }),
                      /* @__PURE__ */ jsx("td", { className: "p-3 border-r-2 border-orange-400 dark:border-orange-700 align-top", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                        miInfo.abilities.map(
                          (ab) => /* @__PURE__ */ jsxs(
                            "label",
                            {
                              className: `flex items-start gap-2 cursor-pointer rounded px-2 py-1.5 transition-all select-none text-xs ${abilityChecked.has(
                                ab
                              ) ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700" : "hover:bg-gray-50 dark:hover:bg-gray-700/40 border border-transparent"}`,
                              children: [
                                /* @__PURE__ */ jsx(
                                  "input",
                                  {
                                    type: "checkbox",
                                    className: "w-3.5 h-3.5 rounded shrink-0 accent-blue-500 mt-0.5",
                                    checked: abilityChecked.has(
                                      ab
                                    ),
                                    onChange: () => setData(
                                      item.ability,
                                      toggleItem(
                                        data[item.ability],
                                        ab
                                      )
                                    )
                                  }
                                ),
                                /* @__PURE__ */ jsx(
                                  "span",
                                  {
                                    className: `leading-snug ${abilityChecked.has(
                                      ab
                                    ) ? "text-blue-700 dark:text-blue-300 font-medium" : "text-gray-700 dark:text-gray-300"}`,
                                    children: ab
                                  }
                                )
                              ]
                            },
                            ab
                          )
                        ),
                        customAbilities.map(
                          (ca) => /* @__PURE__ */ jsxs(
                            "span",
                            {
                              className: "flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded border border-blue-200 dark:border-blue-700",
                              children: [
                                ca,
                                /* @__PURE__ */ jsx(
                                  "button",
                                  {
                                    type: "button",
                                    onClick: () => setData(
                                      item.ability,
                                      toggleItem(
                                        data[item.ability],
                                        ca
                                      )
                                    ),
                                    className: "ml-1 text-blue-400 hover:text-red-500 font-bold leading-none",
                                    children: "×"
                                  }
                                )
                              ]
                            },
                            ca
                          )
                        ),
                        /* @__PURE__ */ jsxs("div", { className: "flex gap-1 pt-2 border-t border-gray-100 dark:border-gray-700", children: [
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              type: "text",
                              value: miCustomText[item.ability] || "",
                              onChange: (e) => setMiCustomText(
                                (prev) => ({
                                  ...prev,
                                  [item.ability]: e.target.value
                                })
                              ),
                              onKeyDown: (e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  if ((miCustomText[item.ability] || "").trim()) {
                                    setData(
                                      item.ability,
                                      addCustomItem(
                                        data[item.ability],
                                        miCustomText[item.ability]
                                      )
                                    );
                                    setMiCustomText(
                                      (prev) => ({
                                        ...prev,
                                        [item.ability]: ""
                                      })
                                    );
                                  }
                                }
                              },
                              className: "flex-1 text-xs border border-gray-200 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 focus:ring-1 focus:ring-blue-400 dark:text-gray-200",
                              placeholder: "Tambah kemampuan lain…"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => {
                                if ((miCustomText[item.ability] || "").trim()) {
                                  setData(
                                    item.ability,
                                    addCustomItem(
                                      data[item.ability],
                                      miCustomText[item.ability]
                                    )
                                  );
                                  setMiCustomText(
                                    (prev) => ({
                                      ...prev,
                                      [item.ability]: ""
                                    })
                                  );
                                }
                              },
                              className: "px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded font-semibold shrink-0",
                              children: "+"
                            }
                          )
                        ] })
                      ] }) }),
                      /* @__PURE__ */ jsx("td", { className: "p-3 align-top", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                        miInfo.professions.map(
                          (prof) => /* @__PURE__ */ jsxs(
                            "label",
                            {
                              className: `flex items-start gap-2 cursor-pointer rounded px-2 py-1.5 transition-all select-none text-xs ${profChecked.has(
                                prof
                              ) ? "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700" : "hover:bg-gray-50 dark:hover:bg-gray-700/40 border border-transparent"}`,
                              children: [
                                /* @__PURE__ */ jsx(
                                  "input",
                                  {
                                    type: "checkbox",
                                    className: "w-3.5 h-3.5 rounded shrink-0 accent-orange-500 mt-0.5",
                                    checked: profChecked.has(
                                      prof
                                    ),
                                    onChange: () => setData(
                                      item.professions,
                                      toggleItem(
                                        data[item.professions],
                                        prof
                                      )
                                    )
                                  }
                                ),
                                /* @__PURE__ */ jsx(
                                  "span",
                                  {
                                    className: `leading-snug ${profChecked.has(
                                      prof
                                    ) ? "text-orange-700 dark:text-orange-300 font-medium" : "text-gray-700 dark:text-gray-300"}`,
                                    children: prof
                                  }
                                )
                              ]
                            },
                            prof
                          )
                        ),
                        customProfs.map(
                          (cp) => /* @__PURE__ */ jsxs(
                            "span",
                            {
                              className: "flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 text-xs px-2 py-1 rounded border border-orange-200 dark:border-orange-700",
                              children: [
                                cp,
                                /* @__PURE__ */ jsx(
                                  "button",
                                  {
                                    type: "button",
                                    onClick: () => setData(
                                      item.professions,
                                      toggleItem(
                                        data[item.professions],
                                        cp
                                      )
                                    ),
                                    className: "ml-1 text-orange-400 hover:text-red-500 font-bold leading-none",
                                    children: "×"
                                  }
                                )
                              ]
                            },
                            cp
                          )
                        ),
                        /* @__PURE__ */ jsxs("div", { className: "flex gap-1 pt-2 border-t border-gray-100 dark:border-gray-700", children: [
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              type: "text",
                              value: miCustomText[item.professions] || "",
                              onChange: (e) => setMiCustomText(
                                (prev) => ({
                                  ...prev,
                                  [item.professions]: e.target.value
                                })
                              ),
                              onKeyDown: (e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  if ((miCustomText[item.professions] || "").trim()) {
                                    setData(
                                      item.professions,
                                      addCustomItem(
                                        data[item.professions],
                                        miCustomText[item.professions]
                                      )
                                    );
                                    setMiCustomText(
                                      (prev) => ({
                                        ...prev,
                                        [item.professions]: ""
                                      })
                                    );
                                  }
                                }
                              },
                              className: "flex-1 text-xs border border-gray-200 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 focus:ring-1 focus:ring-orange-400 dark:text-gray-200",
                              placeholder: "Tambah profesi lain…"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => {
                                if ((miCustomText[item.professions] || "").trim()) {
                                  setData(
                                    item.professions,
                                    addCustomItem(
                                      data[item.professions],
                                      miCustomText[item.professions]
                                    )
                                  );
                                  setMiCustomText(
                                    (prev) => ({
                                      ...prev,
                                      [item.professions]: ""
                                    })
                                  );
                                }
                              },
                              className: "px-2 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded font-semibold shrink-0",
                              children: "+"
                            }
                          )
                        ] })
                      ] }) })
                    ] }, item.no);
                  }) })
                ] }) }),
                /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600", children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: processing,
                    className: "px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50",
                    children: processing ? __("RMD_SAVING") : __("RMD_SAVE_ANSWER_BUTTON")
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 space-y-6", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider", children: __("RMD_CH4_DETERMINE_GOAL_TITLE") }),
                /* @__PURE__ */ jsxs("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: [
                  __("RMD_CH4_DETERMINE_GOAL_DESC"),
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "italic font-bold", children: "decision making" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4", children: [
                  {
                    id: "consider_learning_style",
                    label: __(
                      "RMD_CH4_CONSIDER_LEARNING_STYLE"
                    )
                  },
                  {
                    id: "consider_intelligence",
                    label: __(
                      "RMD_CH4_CONSIDER_INTELLIGENCE"
                    )
                  },
                  {
                    id: "consider_academic_achievement",
                    label: __("RMD_CH4_CONSIDER_ACADEMIC")
                  },
                  {
                    id: "consider_parental_support",
                    label: __("RMD_CH4_CONSIDER_PARENTAL")
                  },
                  {
                    id: "consider_gods_will",
                    label: __("RMD_CH4_CONSIDER_GODS_WILL")
                  }
                ].map((item) => /* @__PURE__ */ jsxs(
                  "label",
                  {
                    className: "flex items-center space-x-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-900/40 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/60 transition-colors",
                    children: [
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "checkbox",
                          className: "w-6 h-6 rounded border-2 border-orange-400 text-orange-500 focus:ring-orange-500 dark:bg-gray-700",
                          checked: data[item.id],
                          onChange: (e) => setData(
                            item.id,
                            e.target.checked
                          )
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { className: "text-gray-800 dark:text-gray-200 font-medium", children: item.label })
                    ]
                  },
                  item.id
                )) }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-4", children: [
                  /* @__PURE__ */ jsx("h5", { className: "font-bold text-gray-800 dark:text-gray-200", children: __("RMD_CH4_ADDITIONAL_CONSIDERATIONS") }),
                  /* @__PURE__ */ jsx(
                    "textarea",
                    {
                      ref: autoGrow,
                      onInput: (e) => autoGrow(e.target),
                      className: "w-full max-w-full bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-gray-200 dark:border-gray-700 focus:ring-orange-400 min-h-[128px] resize",
                      value: data.additional_considerations,
                      onChange: (e) => setData(
                        "additional_considerations",
                        e.target.value
                      ),
                      placeholder: __(
                        "RMD_CH4_PLACEHOLDER_DISCUSS"
                      )
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600", children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: processing,
                    className: "px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50",
                    children: processing ? __("RMD_SAVING") : __("RMD_SAVE_ANSWER_BUTTON")
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 space-y-6", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider", children: __("RMD_CH4_DECISION_MATRIX_TITLE") }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400 italic leading-relaxed", children: __("RMD_CH4_DECISION_MATRIX_DESC") }),
                /* @__PURE__ */ jsx("div", { className: "border-2 border-orange-400 dark:border-orange-700 rounded-3xl overflow-hidden shadow-lg", children: /* @__PURE__ */ jsxs("table", { className: "w-full border-collapse", children: [
                  /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-cyan-400 dark:bg-cyan-700 text-white", children: [
                    /* @__PURE__ */ jsx("th", { className: "py-4 px-6 border-r border-white/20 w-1/3 text-center font-bold uppercase tracking-wider", children: __(
                      "RMD_CH4_TABLE_ALTERNATIVE"
                    ) }),
                    /* @__PURE__ */ jsx("th", { className: "py-4 px-6 text-center font-bold uppercase tracking-wider", children: __("RMD_CH4_TABLE_FACTORS") })
                  ] }) }),
                  /* @__PURE__ */ jsx("tbody", { className: "divide-y-2 divide-orange-400 dark:divide-orange-700 text-gray-800 dark:text-gray-200", children: data.career_decision_matrix.map(
                    (row, index) => /* @__PURE__ */ jsxs("tr", { children: [
                      /* @__PURE__ */ jsx("td", { className: "p-4 border-r-2 border-orange-400 dark:border-orange-700 bg-gray-50 dark:bg-gray-800/50", children: /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "text",
                          className: "w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-cyan-400 font-bold text-center",
                          value: row.alternative,
                          onChange: (e) => updateMatrix(
                            index,
                            "alternative",
                            e.target.value
                          ),
                          placeholder: `${__(
                            "RMD_CH4_PLACEHOLDER_ALTERNATIVE"
                          )} ${index + 1}`
                        }
                      ) }),
                      /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx(
                        "textarea",
                        {
                          ref: autoGrow,
                          onInput: (e) => autoGrow(e.target),
                          className: "w-full max-w-full min-h-[160px] border-none focus:ring-0 bg-transparent resize dark:text-gray-200",
                          value: row.factors,
                          onChange: (e) => updateMatrix(
                            index,
                            "factors",
                            e.target.value
                          ),
                          placeholder: __(
                            "RMD_CH4_PLACEHOLDER_FACTORS"
                          )
                        }
                      ) })
                    ] }, index)
                  ) })
                ] }) }),
                /* @__PURE__ */ jsxs("div", { className: "bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-2xl border-l-8 border-cyan-400 space-y-3", children: [
                  /* @__PURE__ */ jsxs("p", { className: "text-gray-700 dark:text-gray-300 text-sm", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-bold", children: __("RMD_CH4_TIPS_LABEL") }),
                    " ",
                    __("RMD_CH4_TIPS_TEXT")
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 text-sm italic", children: __("RMD_CH4_PARENT_ADVICE") })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600", children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: processing,
                    className: "px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50",
                    children: processing ? __("RMD_SAVING") : __("RMD_SAVE_ANSWER_BUTTON")
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "bg-orange-50 dark:bg-orange-900/20 p-8 rounded-3xl border-2 border-orange-400 dark:border-orange-700 text-center space-y-4", children: /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 text-lg leading-relaxed", children: __("RMD_CH4_FINAL_REFLECTION") }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-4 pt-8 border-b-2 border-gray-100 dark:border-gray-800 pb-12", children: [
                /* @__PURE__ */ jsx(
                  Transition,
                  {
                    show: recentlySuccessful,
                    enter: "transition ease-in-out",
                    enterFrom: "opacity-0",
                    leave: "transition ease-in-out",
                    leaveTo: "opacity-0",
                    children: /* @__PURE__ */ jsx("p", { className: "text-sm text-green-600 dark:text-green-400 font-bold", children: __("RMD_CH4_SUCCESS_MSG") })
                  }
                ),
                /* @__PURE__ */ jsx(
                  PrimaryButton,
                  {
                    disabled: processing,
                    className: "px-12 py-4 text-lg font-bold uppercase tracking-widest bg-orange-500 hover:bg-orange-600 focus:bg-orange-600 active:bg-orange-700",
                    children: __("RMD_CH4_BTN_SAVE")
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center py-8", children: [
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route("rmd.the-only-one-meeting-3"),
                    className: "flex items-center gap-2 text-gray-500 hover:text-cyan-500 font-bold transition-colors",
                    children: [
                      /* @__PURE__ */ jsx(
                        "svg",
                        {
                          className: "w-5 h-5",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24",
                          children: /* @__PURE__ */ jsx(
                            "path",
                            {
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              strokeWidth: "2",
                              d: "M15 19l-7-7 7-7"
                            }
                          )
                        }
                      ),
                      __("RMD_CH4_BTN_PREV")
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsx(
                    Link,
                    {
                      href: route("rmd.chapters"),
                      className: "px-8 py-3 bg-white dark:bg-gray-800 border-2 border-cyan-400 text-cyan-500 rounded-full font-bold hover:bg-cyan-50 transition-colors shadow-sm",
                      children: __("RMD_CH4_BTN_TOC")
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    Link,
                    {
                      href: route("rmd.career-exploration-p2"),
                      className: "flex items-center gap-2 px-8 py-3 bg-cyan-500 text-white rounded-full font-bold hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-200 dark:shadow-none",
                      children: [
                        __("RMD_CH4_BTN_NEXT"),
                        /* @__PURE__ */ jsx(
                          "svg",
                          {
                            className: "w-5 h-5",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /* @__PURE__ */ jsx(
                              "path",
                              {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: "2",
                                d: "M9 5l7 7-7 7"
                              }
                            )
                          }
                        )
                      ]
                    }
                  )
                ] })
              ] })
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  MenentukanCitaCita as default
};
