import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BG6RGD2S.js";
import { useForm, Head, Link, router } from "@inertiajs/react";
import { _ as __ } from "./lang-COBcTD8W.js";
import { Transition } from "@headlessui/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { C as ConfirmModal } from "./ConfirmModal-Bqr5rb3_.js";
import "./Dropdown-BgvF6zKd.js";
import "./ThemeToggle-BY9dagkZ.js";
import "./TextInput-D0qTZeQv.js";
import "axios";
import "./ProfilePhoto-CJ2Z04pO.js";
import "./Modal-CKHW52Ki.js";
import "./SecondaryButton-TjIrbn1G.js";
import "./PrimaryButton-BNNL2gCI.js";
import "./DangerButton-B7to2Tbx.js";
import "./Footer-B7ihPSZ8.js";
import "./useTheme-CngFDcs1.js";
const INTELLIGENCE_DATA = {
  linguistic: {
    icon: "📝",
    cardBg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-300 dark:border-purple-700",
    textColor: "text-purple-700 dark:text-purple-300",
    badgeBg: "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200",
    desc: "Pandai menggunakan kata-kata secara efektif, baik lisan maupun tulisan. Sensitif terhadap suara, makna, dan struktur bahasa.",
    strengths: ["Menulis & membaca", "Bercerita & berdebat", "Belajar bahasa baru", "Berkomunikasi efektif"],
    careers: ["Penulis / Sastrawan", "Jurnalis / Reporter", "Guru / Dosen", "Pengacara / Advokat", "Penerjemah", "Editor / Redaktur", "Penyiar / Presenter", "Public Relations"]
  },
  logical_mathematical: {
    icon: "🔢",
    cardBg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-300 dark:border-blue-700",
    textColor: "text-blue-700 dark:text-blue-300",
    badgeBg: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200",
    desc: "Mampu berpikir logis, memecahkan masalah matematis, dan menemukan pola abstrak dengan mudah dan sistematis.",
    strengths: ["Analisis & logika", "Pemrograman komputer", "Pemecahan masalah", "Berpikir sistematis"],
    careers: ["Programmer / Developer", "Insinyur / Engineer", "Ilmuwan / Peneliti", "Akuntan / Analis Keuangan", "Analis Data / Data Scientist", "Dokter / Tenaga Medis", "Arsitek", "Matematikawan"]
  },
  visual_spatial: {
    icon: "🎨",
    cardBg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-300 dark:border-yellow-700",
    textColor: "text-yellow-700 dark:text-yellow-300",
    badgeBg: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200",
    desc: "Mampu berpikir dalam gambar dan ruang, memvisualisasikan objek dari berbagai sudut dengan imajinasi visual yang kuat.",
    strengths: ["Menggambar & desain", "Membaca peta & navigasi", "Imajinasi visual kuat", "Memahami ruang & bentuk"],
    careers: ["Arsitek", "Desainer Grafis / UI/UX", "Fotografer / Videografer", "Animator / Motion Designer", "Pilot / Navigator", "Seniman / Pelukis", "Sutradara Film", "Interior Desainer"]
  },
  kinesthetic: {
    icon: "🤸",
    cardBg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-300 dark:border-red-700",
    textColor: "text-red-700 dark:text-red-300",
    badgeBg: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200",
    desc: "Terampil menggunakan tubuh dan tangan; belajar paling efektif melalui gerakan, sentuhan, dan pengalaman langsung.",
    strengths: ["Olahraga & atletik", "Kerajinan tangan", "Koordinasi tubuh", "Belajar lewat praktik"],
    careers: ["Atlet / Pelatih Olahraga", "Penari / Koreografer", "Dokter Bedah / Fisioterapis", "Mekanik / Teknisi", "Chef / Koki Profesional", "Aktor / Performer", "Terapis Fisik", "Pemadam Kebakaran"]
  },
  musical: {
    icon: "🎵",
    cardBg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-300 dark:border-green-700",
    textColor: "text-green-700 dark:text-green-300",
    badgeBg: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200",
    desc: "Peka terhadap nada, ritme, dan pola musikal. Mudah mengenali, menciptakan, dan mengolah musik dalam berbagai bentuk.",
    strengths: ["Bernyanyi & memainkan instrumen", "Komposisi musik", "Menghafal nada & ritme", "Ekspresi melalui musik"],
    careers: ["Musisi / Penyanyi", "Komposer / Penulis Lagu", "Guru Musik / Instruktur", "Sound Engineer", "Produser Musik", "Terapis Musik", "Penyiar Radio / Podcaster", "Konduktor Orkestra"]
  },
  interpersonal: {
    icon: "🤝",
    cardBg: "bg-indigo-50 dark:bg-indigo-900/20",
    border: "border-indigo-300 dark:border-indigo-700",
    textColor: "text-indigo-700 dark:text-indigo-300",
    badgeBg: "bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200",
    desc: "Mudah memahami dan berinteraksi dengan orang lain; peka terhadap perasaan, motivasi, dan kebutuhan orang di sekitarnya.",
    strengths: ["Komunikasi & empati", "Kepemimpinan tim", "Mediasi & negosiasi", "Membangun relasi"],
    careers: ["Guru / Konselor Sekolah", "Psikolog / Terapis", "Pemimpin / Manajer", "Sales / Marketing", "Diplomat / Hub. Internasional", "Dokter / Perawat", "HR Manager", "Social Worker"]
  },
  intrapersonal: {
    icon: "🪞",
    cardBg: "bg-pink-50 dark:bg-pink-900/20",
    border: "border-pink-300 dark:border-pink-700",
    textColor: "text-pink-700 dark:text-pink-300",
    badgeBg: "bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-200",
    desc: "Memiliki pemahaman mendalam tentang diri sendiri: kekuatan, kelemahan, dan motivasi. Mandiri dan mampu merencanakan hidup dengan baik.",
    strengths: ["Refleksi & introspeksi", "Kemandirian & disiplin", "Perencanaan hidup", "Fokus & determinasi"],
    careers: ["Penulis / Blogger", "Psikolog / Konselor", "Wirausaha / Entrepreneur", "Filosof / Pemikir", "Life Coach / Motivator", "Rohaniawan / Pendeta", "Peneliti", "Terapis"]
  },
  naturalist: {
    icon: "🌿",
    cardBg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-300 dark:border-emerald-700",
    textColor: "text-emerald-700 dark:text-emerald-300",
    badgeBg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200",
    desc: "Mampu mengenali dan mengkategorikan makhluk hidup dan fenomena alam; peka terhadap lingkungan dan mencintai alam.",
    strengths: ["Identifikasi flora & fauna", "Observasi alam", "Pelestarian lingkungan", "Berpikir ekosistem"],
    careers: ["Biolog / Ekolog", "Dokter Hewan / Zoolog", "Agripreneur / Petani Modern", "Ahli Lingkungan / Konservasi", "Peneliti Alam", "Geograf / Kartograf", "Chef / Food Scientist", "Landscape Desainer"]
  },
  existential: {
    icon: "🌌",
    cardBg: "bg-cyan-50 dark:bg-cyan-900/20",
    border: "border-cyan-300 dark:border-cyan-700",
    textColor: "text-cyan-700 dark:text-cyan-300",
    badgeBg: "bg-cyan-100 text-cyan-800 dark:bg-cyan-800 dark:text-cyan-200",
    desc: "Suka merenungkan pertanyaan mendalam tentang kehidupan, tujuan hidup, dan makna keberadaan manusia.",
    strengths: ["Berpikir filosofis", "Analisis etika & moral", "Pertanyaan mendalam", "Visi jangka panjang"],
    careers: ["Filosof / Teolog", "Rohaniawan / Pemimpin Rohani", "Life Coach / Konselor", "Penulis / Esayis", "Peneliti Sosial / Humaniora", "Pendidik / Akademisi", "Penasihat / Mediator Konflik", "Aktivis Sosial"]
  }
};
const ALL_CAREERS = [
  { name: "Guru / Pendidik", tags: ["linguistic", "interpersonal", "intrapersonal"] },
  { name: "Penulis Lagu / Liricist", tags: ["linguistic", "musical", "intrapersonal"] },
  { name: "Jurnalis / Wartawan", tags: ["linguistic", "interpersonal"] },
  { name: "Pengacara / Advokat", tags: ["linguistic", "logical_mathematical", "interpersonal"] },
  { name: "Penyiar / MC / Presenter TV", tags: ["linguistic", "musical", "interpersonal"] },
  { name: "Penulis Kreatif / Sastrawan", tags: ["linguistic", "intrapersonal"] },
  { name: "Public Relations / Humas", tags: ["linguistic", "interpersonal"] },
  { name: "Politisi / Negarawan", tags: ["linguistic", "interpersonal", "existential"] },
  { name: "Life Coach / Konselor Karir", tags: ["linguistic", "interpersonal", "intrapersonal", "existential"] },
  { name: "Pendidik / Dosen", tags: ["linguistic", "existential", "interpersonal"] },
  { name: "Penasihat Rohani / Rohaniawan", tags: ["linguistic", "existential", "intrapersonal", "interpersonal"] },
  { name: "Programmer / Developer", tags: ["logical_mathematical", "visual_spatial"] },
  { name: "Insinyur / Engineer", tags: ["logical_mathematical", "visual_spatial", "kinesthetic"] },
  { name: "Ilmuwan / Peneliti", tags: ["logical_mathematical", "naturalist", "intrapersonal"] },
  { name: "Dokter / Tenaga Medis", tags: ["logical_mathematical", "interpersonal", "kinesthetic"] },
  { name: "Akuntan / Analis Keuangan", tags: ["logical_mathematical", "intrapersonal"] },
  { name: "Analis Data / Data Scientist", tags: ["logical_mathematical", "visual_spatial"] },
  { name: "Arsitek", tags: ["logical_mathematical", "visual_spatial"] },
  { name: "Ahli Hukum / Notaris", tags: ["logical_mathematical", "linguistic", "intrapersonal"] },
  { name: "Game Developer / Desainer Game", tags: ["logical_mathematical", "visual_spatial", "musical"] },
  { name: "Sound Engineer / Audio Teknisi", tags: ["musical", "logical_mathematical", "visual_spatial"] },
  { name: "Desainer Grafis / UI/UX", tags: ["visual_spatial", "logical_mathematical"] },
  { name: "Fotografer / Videografer", tags: ["visual_spatial", "kinesthetic"] },
  { name: "Animator / Motion Designer", tags: ["visual_spatial", "musical", "kinesthetic"] },
  { name: "Sutradara / Produser Film", tags: ["visual_spatial", "musical", "interpersonal"] },
  { name: "Interior Desainer / Landscape Desainer", tags: ["visual_spatial", "naturalist"] },
  { name: "Pilot / Navigator", tags: ["visual_spatial", "logical_mathematical", "kinesthetic"] },
  { name: "Atlet / Pelatih Olahraga", tags: ["kinesthetic", "interpersonal"] },
  { name: "Penari / Koreografer", tags: ["kinesthetic", "musical", "visual_spatial"] },
  { name: "Dokter Bedah / Fisioterapis", tags: ["kinesthetic", "logical_mathematical", "interpersonal"] },
  { name: "Chef / Koki Profesional", tags: ["kinesthetic", "naturalist", "visual_spatial"] },
  { name: "Aktor / Performer / Seniman Pertunjukan", tags: ["kinesthetic", "musical", "linguistic", "interpersonal"] },
  { name: "Musisi / Penyanyi Profesional", tags: ["musical", "interpersonal"] },
  { name: "Komposer / Produser Musik", tags: ["musical", "intrapersonal", "logical_mathematical"] },
  { name: "Guru Musik / Instruktur Seni", tags: ["musical", "linguistic", "interpersonal"] },
  { name: "Terapis Musik", tags: ["musical", "interpersonal", "intrapersonal"] },
  { name: "Penyiar Radio / Podcaster", tags: ["musical", "linguistic"] },
  { name: "Psikolog / Terapis", tags: ["interpersonal", "intrapersonal", "linguistic"] },
  { name: "Pemimpin Organisasi / CEO", tags: ["interpersonal", "intrapersonal", "linguistic", "existential"] },
  { name: "Sales / Marketing Manager", tags: ["interpersonal", "linguistic"] },
  { name: "Diplomat / Hubungan Internasional", tags: ["interpersonal", "linguistic", "existential"] },
  { name: "HR Manager / Rekruter", tags: ["interpersonal", "linguistic", "intrapersonal"] },
  { name: "Social Worker / Aktivis Sosial", tags: ["interpersonal", "existential", "naturalist"] },
  { name: "Wirausaha / Entrepreneur", tags: ["intrapersonal", "interpersonal", "logical_mathematical"] },
  { name: "Filosof / Teolog", tags: ["existential", "linguistic", "intrapersonal"] },
  { name: "Peneliti Sosial / Humaniora", tags: ["existential", "linguistic", "logical_mathematical"] },
  { name: "Konselor Rohani / Pendamping", tags: ["existential", "interpersonal", "intrapersonal"] },
  { name: "Mediator Konflik / Negosiator", tags: ["existential", "interpersonal", "linguistic"] },
  { name: "Biolog / Ekolog", tags: ["naturalist", "logical_mathematical"] },
  { name: "Dokter Hewan / Zoolog", tags: ["naturalist", "logical_mathematical", "kinesthetic"] },
  { name: "Agripreneur / Petani Modern", tags: ["naturalist", "logical_mathematical", "intrapersonal"] },
  { name: "Ahli Lingkungan / Konservasi Alam", tags: ["naturalist", "existential", "interpersonal"] },
  { name: "Geograf / Peneliti Alam", tags: ["naturalist", "visual_spatial", "logical_mathematical"] }
];
const getCareerSuggestions = (topKeys) => {
  const keySet = new Set(topKeys);
  return ALL_CAREERS.map((c) => ({ ...c, matchCount: c.tags.filter((t) => keySet.has(t)).length })).filter((c) => c.matchCount >= 2).sort((a, b) => b.matchCount - a.matchCount || a.name.localeCompare(b.name));
};
function TheOnlyOneMeeting2({ auth, multipleIntelligence, files }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navError, setNavError] = useState(null);
  const [confirmState, setConfirmState] = useState({ show: false, title: "", message: "", onConfirm: null });
  const askConfirm = (title, message, fn) => setConfirmState({ show: true, title, message, onConfirm: fn });
  const closeConfirm = () => setConfirmState((s) => ({ ...s, show: false }));
  const getInitialData = (data2) => {
    if (Array.isArray(data2)) {
      const obj = {};
      data2.forEach((val, idx) => {
        obj[idx] = val;
      });
      return obj;
    }
    return data2 || {};
  };
  const { data, setData, post, processing, recentlySuccessful, errors } = useForm({
    linguistic_checklist: getInitialData(multipleIntelligence?.linguistic_checklist),
    logical_mathematical_checklist: getInitialData(multipleIntelligence?.logical_mathematical_checklist),
    visual_spatial_checklist: getInitialData(multipleIntelligence?.visual_spatial_checklist),
    kinesthetic_checklist: getInitialData(multipleIntelligence?.kinesthetic_checklist),
    musical_checklist: getInitialData(multipleIntelligence?.musical_checklist),
    interpersonal_checklist: getInitialData(multipleIntelligence?.interpersonal_checklist),
    intrapersonal_checklist: getInitialData(multipleIntelligence?.intrapersonal_checklist),
    naturalist_checklist: getInitialData(multipleIntelligence?.naturalist_checklist),
    existential_checklist: getInitialData(multipleIntelligence?.existential_checklist),
    reflection_suitability: multipleIntelligence?.reflection_suitability || "",
    reflection_development: multipleIntelligence?.reflection_development || "",
    reflection_new_learning: multipleIntelligence?.reflection_new_learning || "",
    reflection_plan: multipleIntelligence?.reflection_plan || ""
  });
  const linguisticItems = [
    __("RMD_LINGUISTIC_1"),
    __("RMD_LINGUISTIC_2"),
    __("RMD_LINGUISTIC_3"),
    __("RMD_LINGUISTIC_4"),
    __("RMD_LINGUISTIC_5"),
    __("RMD_LINGUISTIC_6"),
    __("RMD_LINGUISTIC_7"),
    __("RMD_LINGUISTIC_8"),
    __("RMD_LINGUISTIC_9"),
    __("RMD_LINGUISTIC_10")
  ];
  const logicalMathematicalItems = [
    __("RMD_LOGICAL_MATHEMATICAL_1"),
    __("RMD_LOGICAL_MATHEMATICAL_2"),
    __("RMD_LOGICAL_MATHEMATICAL_3"),
    __("RMD_LOGICAL_MATHEMATICAL_4"),
    __("RMD_LOGICAL_MATHEMATICAL_5"),
    __("RMD_LOGICAL_MATHEMATICAL_6"),
    __("RMD_LOGICAL_MATHEMATICAL_7"),
    __("RMD_LOGICAL_MATHEMATICAL_8"),
    __("RMD_LOGICAL_MATHEMATICAL_9"),
    __("RMD_LOGICAL_MATHEMATICAL_10")
  ];
  const visualSpatialItems = [
    __("RMD_VISUAL_SPATIAL_1"),
    __("RMD_VISUAL_SPATIAL_2"),
    __("RMD_VISUAL_SPATIAL_3"),
    __("RMD_VISUAL_SPATIAL_4"),
    __("RMD_VISUAL_SPATIAL_5"),
    __("RMD_VISUAL_SPATIAL_6"),
    __("RMD_VISUAL_SPATIAL_7"),
    __("RMD_VISUAL_SPATIAL_8"),
    __("RMD_VISUAL_SPATIAL_9"),
    __("RMD_VISUAL_SPATIAL_10")
  ];
  const kinestheticItems = [
    __("RMD_KINESTETIC_1"),
    __("RMD_KINESTETIC_2"),
    __("RMD_KINESTETIC_3"),
    __("RMD_KINESTETIC_4"),
    __("RMD_KINESTETIC_5"),
    __("RMD_KINESTETIC_6"),
    __("RMD_KINESTETIC_7"),
    __("RMD_KINESTETIC_8"),
    __("RMD_KINESTETIC_9"),
    __("RMD_KINESTETIC_10")
  ];
  const musicalItems = [
    __("RMD_MUSICAL_1"),
    __("RMD_MUSICAL_2"),
    __("RMD_MUSICAL_3"),
    __("RMD_MUSICAL_4"),
    __("RMD_MUSICAL_5"),
    __("RMD_MUSICAL_6"),
    __("RMD_MUSICAL_7"),
    __("RMD_MUSICAL_8"),
    __("RMD_MUSICAL_9"),
    __("RMD_MUSICAL_10")
  ];
  const interpersonalItems = [
    __("RMD_INTERPERSONAL_1"),
    __("RMD_INTERPERSONAL_2"),
    __("RMD_INTERPERSONAL_3"),
    __("RMD_INTERPERSONAL_4"),
    __("RMD_INTERPERSONAL_5"),
    __("RMD_INTERPERSONAL_6"),
    __("RMD_INTERPERSONAL_7"),
    __("RMD_INTERPERSONAL_8"),
    __("RMD_INTERPERSONAL_9"),
    __("RMD_INTERPERSONAL_10")
  ];
  const intrapersonalItems = [
    __("RMD_INTRAPERSONAL_1"),
    __("RMD_INTRAPERSONAL_2"),
    __("RMD_INTRAPERSONAL_3"),
    __("RMD_INTRAPERSONAL_4"),
    __("RMD_INTRAPERSONAL_5"),
    __("RMD_INTRAPERSONAL_6"),
    __("RMD_INTRAPERSONAL_7"),
    __("RMD_INTRAPERSONAL_8"),
    __("RMD_INTRAPERSONAL_9"),
    __("RMD_INTRAPERSONAL_10")
  ];
  const naturalistItems = [
    __("RMD_NATURALIST_1"),
    __("RMD_NATURALIST_2"),
    __("RMD_NATURALIST_3"),
    __("RMD_NATURALIST_4"),
    __("RMD_NATURALIST_5"),
    __("RMD_NATURALIST_6"),
    __("RMD_NATURALIST_7"),
    __("RMD_NATURALIST_8"),
    __("RMD_NATURALIST_9"),
    __("RMD_NATURALIST_10")
  ];
  const existentialItems = [
    __("RMD_EXISTENTIAL_1"),
    __("RMD_EXISTENTIAL_2"),
    __("RMD_EXISTENTIAL_3"),
    __("RMD_EXISTENTIAL_4"),
    __("RMD_EXISTENTIAL_5"),
    __("RMD_EXISTENTIAL_6"),
    __("RMD_EXISTENTIAL_7"),
    __("RMD_EXISTENTIAL_8"),
    __("RMD_EXISTENTIAL_9"),
    __("RMD_EXISTENTIAL_10")
  ];
  const handleRadioChange = (category, index, value) => {
    const fieldName = `${category}_checklist`;
    setData(fieldName, {
      ...data[fieldName],
      [index]: parseInt(value)
    });
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("rmd.the-only-one-meeting-2.store"));
  };
  const calculateScore = (checklist) => {
    if (!checklist) return 0;
    return Object.values(checklist).reduce((a, b) => a + (parseInt(b) || 0), 0);
  };
  const sections = [
    { title: __("RMD_SECTION_LINGUISTIC"), items: linguisticItems, key: "linguistic", color: "purple" },
    { title: __("RMD_SECTION_LOGICAL_MATHEMATICAL"), items: logicalMathematicalItems, key: "logical_mathematical", color: "blue" },
    { title: __("RMD_SECTION_VISUAL_SPATIAL"), items: visualSpatialItems, key: "visual_spatial", color: "yellow" },
    { title: __("RMD_SECTION_KINESTETIC"), items: kinestheticItems, key: "kinesthetic", color: "red" },
    { title: __("RMD_SECTION_MUSICAL"), items: musicalItems, key: "musical", color: "green" },
    { title: __("RMD_SECTION_INTERPERSONAL"), items: interpersonalItems, key: "interpersonal", color: "indigo" },
    { title: __("RMD_SECTION_INTRAPERSONAL"), items: intrapersonalItems, key: "intrapersonal", color: "pink" },
    { title: __("RMD_SECTION_NATURALIST"), items: naturalistItems, key: "naturalist", color: "emerald" },
    { title: __("RMD_SECTION_EXISTENTIAL"), items: existentialItems, key: "existential", color: "cyan" }
  ];
  const sortedScores = sections.map((s) => ({
    key: s.key,
    title: s.title.split(". ")[1] || s.title,
    // Fallback if no dot separation in translation
    score: calculateScore(data[`${s.key}_checklist`])
  })).sort((a, b) => b.score - a.score);
  const topThree = sortedScores.slice(0, 3);
  const isCompleted = sections.every(
    (section) => data[`${section.key}_checklist`] && Object.keys(data[`${section.key}_checklist`]).length === section.items.length
  ) && data.reflection_new_learning?.trim() && data.reflection_plan?.trim();
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("meeting_type", "the-only-one-meeting-2");
    setIsUploading(true);
    router.post(route("rmd.files.upload"), formData, {
      onProgress: (progress) => {
        setUploadProgress(progress.percentage);
      },
      onFinish: () => {
        setIsUploading(false);
        setUploadProgress(0);
      }
    });
  };
  const handleDeleteFile = (fileId) => {
    askConfirm(
      __("RMD_DELETE"),
      __("RMD_CONFIRM_DELETE_FILE"),
      () => router.delete(route("rmd.files.delete", fileId))
    );
  };
  const navigateToMeeting3 = () => {
    setIsNavigating(true);
    setNavError(null);
    router.visit(route("rmd.the-only-one-meeting-3"), {
      onFinish: () => setIsNavigating(false),
      onError: () => {
        setIsNavigating(false);
        setNavError(__("RMD_NAV_ERROR"));
      }
    });
  };
  const renderQuestions = (items, category, colorClass, borderColorClass, ringColorClass, textColorClass) => {
    return items.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "mb-6 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-gray-800 dark:text-gray-200 font-medium mb-3", children: [
        /* @__PURE__ */ jsxs("span", { className: "mr-2 font-bold", children: [
          idx + 1,
          "."
        ] }),
        " ",
        item
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-4 ml-6", children: [1, 2, 3, 4, 5].map((val) => /* @__PURE__ */ jsxs("label", { className: "flex items-center space-x-2 cursor-pointer group", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "radio",
            name: `${category}_${idx}`,
            value: val,
            checked: data[`${category}_checklist`]?.[idx] === val,
            onChange: (e) => handleRadioChange(category, idx, e.target.value),
            className: `w-5 h-5 ${colorClass} bg-gray-100 border-gray-300 focus:${ringColorClass} dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600`,
            required: true
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors", children: val })
      ] }, val)) })
    ] }, idx));
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      user: auth.user,
      header: /* @__PURE__ */ jsx("h2", { className: "font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight", children: __("RMD_THE_ONLY_ONE_MEETING_2_TITLE") }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("RMD_THE_ONLY_ONE_MEETING_2_TITLE") }),
        /* @__PURE__ */ jsxs("div", { className: "py-12 bg-gray-50 dark:bg-gray-900 min-h-screen relative", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute inset-0 pointer-events-none z-0",
              style: {
                backgroundImage: "url('/images/rmd-backgrounds/latar-_8_.svg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                opacity: 0.08
              }
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10", children: /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "p-6 text-gray-900 dark:text-gray-100", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center mb-8 border-b-2 border-purple-200 dark:border-purple-800 pb-4", children: [
              /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-purple-600 dark:text-purple-400", children: __("RMD_THE_ONLY_ONE_TITLE") }),
              /* @__PURE__ */ jsx("p", { className: "text-lg italic text-gray-600 dark:text-gray-400 mt-2", children: __("RMD_MEETING_2") })
            ] }),
            /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-8", children: [
              /* @__PURE__ */ jsxs("section", { className: "mb-8", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-4 text-gray-800 dark:text-gray-200", children: __("RMD_OPENING") }),
                /* @__PURE__ */ jsxs("div", { className: "prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300", children: [
                  /* @__PURE__ */ jsx("p", { children: __("RMD_OPENING_TEXT_1") }),
                  /* @__PURE__ */ jsx("div", { className: "bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg my-4 border-l-4 border-yellow-400", children: /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside space-y-2", children: [
                    /* @__PURE__ */ jsx("li", { children: __("RMD_OPENING_LIST_1") }),
                    /* @__PURE__ */ jsx("li", { children: __("RMD_OPENING_LIST_2") }),
                    /* @__PURE__ */ jsx("li", { children: __("RMD_OPENING_LIST_3") })
                  ] }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("section", { className: "mb-8 border-t-2 border-gray-200 dark:border-gray-700 pt-8", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold mb-4 text-purple-700 dark:text-purple-400", children: __("RMD_MULTIPLE_INTELLIGENCES") }),
                /* @__PURE__ */ jsxs("div", { className: "prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300", children: [
                  /* @__PURE__ */ jsx("p", { children: __("RMD_INSTRUCTION_TEXT_1") }),
                  /* @__PURE__ */ jsxs("ol", { className: "list-decimal list-inside space-y-2 ml-4 mt-2", children: [
                    /* @__PURE__ */ jsx("li", { children: __("RMD_INSTRUCTION_LIST_1") }),
                    /* @__PURE__ */ jsx("li", { children: __("RMD_INSTRUCTION_LIST_2") })
                  ] })
                ] })
              ] }),
              sections.map((section) => {
                const colorMap = {
                  purple: {
                    border: "border-purple-200 dark:border-purple-800",
                    bg: "bg-purple-50 dark:bg-purple-900/10",
                    text: "text-purple-800 dark:text-purple-300",
                    radio: "text-purple-600",
                    ring: "focus:ring-purple-500",
                    scoreBg: "bg-purple-100 dark:bg-purple-900",
                    scoreText: "text-purple-800 dark:text-purple-200",
                    scoreBorder: "border-purple-200 dark:border-purple-800"
                  },
                  blue: {
                    border: "border-blue-200 dark:border-blue-800",
                    bg: "bg-blue-50 dark:bg-blue-900/10",
                    text: "text-blue-800 dark:text-blue-300",
                    radio: "text-blue-600",
                    ring: "focus:ring-blue-500",
                    scoreBg: "bg-blue-100 dark:bg-blue-900",
                    scoreText: "text-blue-800 dark:text-blue-200",
                    scoreBorder: "border-blue-200 dark:border-blue-800"
                  },
                  yellow: {
                    border: "border-yellow-200 dark:border-yellow-800",
                    bg: "bg-yellow-50 dark:bg-yellow-900/10",
                    text: "text-yellow-800 dark:text-yellow-300",
                    radio: "text-yellow-600",
                    ring: "focus:ring-yellow-500",
                    scoreBg: "bg-yellow-100 dark:bg-yellow-900",
                    scoreText: "text-yellow-800 dark:text-yellow-200",
                    scoreBorder: "border-yellow-200 dark:border-yellow-800"
                  },
                  red: {
                    border: "border-red-200 dark:border-red-800",
                    bg: "bg-red-50 dark:bg-red-900/10",
                    text: "text-red-800 dark:text-red-300",
                    radio: "text-red-600",
                    ring: "focus:ring-red-500",
                    scoreBg: "bg-red-100 dark:bg-red-900",
                    scoreText: "text-red-800 dark:text-red-200",
                    scoreBorder: "border-red-200 dark:border-red-800"
                  },
                  green: {
                    border: "border-green-200 dark:border-green-800",
                    bg: "bg-green-50 dark:bg-green-900/10",
                    text: "text-green-800 dark:text-green-300",
                    radio: "text-green-600",
                    ring: "focus:ring-green-500",
                    scoreBg: "bg-green-100 dark:bg-green-900",
                    scoreText: "text-green-800 dark:text-green-200",
                    scoreBorder: "border-green-200 dark:border-green-800"
                  },
                  indigo: {
                    border: "border-indigo-200 dark:border-indigo-800",
                    bg: "bg-indigo-50 dark:bg-indigo-900/10",
                    text: "text-indigo-800 dark:text-indigo-300",
                    radio: "text-indigo-600",
                    ring: "focus:ring-indigo-500",
                    scoreBg: "bg-indigo-100 dark:bg-indigo-900",
                    scoreText: "text-indigo-800 dark:text-indigo-200",
                    scoreBorder: "border-indigo-200 dark:border-indigo-800"
                  },
                  pink: {
                    border: "border-pink-200 dark:border-pink-800",
                    bg: "bg-pink-50 dark:bg-pink-900/10",
                    text: "text-pink-800 dark:text-pink-300",
                    radio: "text-pink-600",
                    ring: "focus:ring-pink-500",
                    scoreBg: "bg-pink-100 dark:bg-pink-900",
                    scoreText: "text-pink-800 dark:text-pink-200",
                    scoreBorder: "border-pink-200 dark:border-pink-800"
                  },
                  emerald: {
                    border: "border-emerald-200 dark:border-emerald-800",
                    bg: "bg-emerald-50 dark:bg-emerald-900/10",
                    text: "text-emerald-800 dark:text-emerald-300",
                    radio: "text-emerald-600",
                    ring: "focus:ring-emerald-500",
                    scoreBg: "bg-emerald-100 dark:bg-emerald-900",
                    scoreText: "text-emerald-800 dark:text-emerald-200",
                    scoreBorder: "border-emerald-200 dark:border-emerald-800"
                  },
                  cyan: {
                    border: "border-cyan-200 dark:border-cyan-800",
                    bg: "bg-cyan-50 dark:bg-cyan-900/10",
                    text: "text-cyan-800 dark:text-cyan-300",
                    radio: "text-cyan-600",
                    ring: "focus:ring-cyan-500",
                    scoreBg: "bg-cyan-100 dark:bg-cyan-900",
                    scoreText: "text-cyan-800 dark:text-cyan-200",
                    scoreBorder: "border-cyan-200 dark:border-cyan-800"
                  }
                };
                const colors = colorMap[section.color];
                return /* @__PURE__ */ jsxs("section", { className: `mb-8 border-2 ${colors.border} rounded-lg p-6 ${colors.bg}`, children: [
                  /* @__PURE__ */ jsx("h4", { className: `text-xl font-bold mb-6 ${colors.text}`, children: section.title }),
                  /* @__PURE__ */ jsx("div", { className: "space-y-4", children: renderQuestions(section.items, section.key, colors.radio, "", colors.ring) }),
                  errors[`${section.key}_checklist`] && /* @__PURE__ */ jsx(InputError, { message: errors[`${section.key}_checklist`], className: "mt-2" }),
                  /* @__PURE__ */ jsxs("div", { className: `mt-8 pt-4 border-t ${colors.scoreBorder} flex justify-between items-center`, children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "submit",
                        disabled: processing,
                        className: "px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50",
                        children: processing ? __("RMD_SAVING") : __("RMD_SAVE_ANSWER_BUTTON")
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: `${colors.scoreBg} px-6 py-3 rounded-full`, children: [
                      /* @__PURE__ */ jsx("span", { className: `text-lg font-bold ${colors.scoreText} mr-2`, children: __("RMD_TOTAL_SCORE") }),
                      /* @__PURE__ */ jsx("span", { className: `text-2xl font-extrabold ${colors.scoreText}`, children: calculateScore(data[`${section.key}_checklist`]) })
                    ] })
                  ] })
                ] }, section.key);
              }),
              /* @__PURE__ */ jsxs("section", { className: "mt-12 mb-8 bg-white dark:bg-gray-800 border-4 border-blue-400 dark:border-blue-600 rounded-3xl overflow-hidden shadow-xl", children: [
                /* @__PURE__ */ jsx("div", { className: "bg-blue-400 dark:bg-blue-600 py-4 px-6", children: /* @__PURE__ */ jsx("p", { className: "text-white text-center font-bold italic", children: __("RMD_SCORE_SUMMARY_INSTRUCTION") }) }),
                /* @__PURE__ */ jsx("div", { className: "p-6 md:p-8", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
                  /* @__PURE__ */ jsx("div", { className: "border-2 border-orange-300 dark:border-orange-800 rounded-2xl overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left", children: [
                    /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-cyan-400 dark:bg-cyan-700 text-white", children: [
                      /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-bold border-r border-white/20", children: __("RMD_INTELLIGENCE_TYPE") }),
                      /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-bold", children: __("RMD_MY_SCORE") })
                    ] }) }),
                    /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-orange-200 dark:divide-orange-900", children: sections.map((section, idx) => {
                      const score = calculateScore(data[`${section.key}_checklist`]);
                      return /* @__PURE__ */ jsxs("tr", { className: "dark:text-gray-200", children: [
                        /* @__PURE__ */ jsxs("td", { className: "py-3 px-4 border-r border-orange-200 dark:border-orange-900 font-medium", children: [
                          idx + 1,
                          ". ",
                          section.title.split(". ")[1] || section.title
                        ] }),
                        /* @__PURE__ */ jsx("td", { className: "py-3 px-4 font-bold text-center bg-orange-50 dark:bg-orange-900/20", children: score })
                      ] }, idx);
                    }) })
                  ] }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsx("div", { className: "bg-cyan-400 dark:bg-cyan-700 text-white py-3 px-6 rounded-t-2xl font-bold text-center", children: __("RMD_TOP_THREE_INTELLIGENCES") }),
                    /* @__PURE__ */ jsx("div", { className: "border-2 border-orange-300 dark:border-orange-800 rounded-b-2xl p-6 flex-grow bg-white dark:bg-gray-800", children: /* @__PURE__ */ jsxs("table", { className: "w-full border-collapse", children: [
                      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-200", children: [
                        /* @__PURE__ */ jsx("th", { className: "py-2 px-3 border border-orange-300 dark:border-orange-800 font-bold text-sm", children: __("RMD_RANK_NO") }),
                        /* @__PURE__ */ jsx("th", { className: "py-2 px-3 border border-orange-300 dark:border-orange-800 font-bold text-sm", children: __("RMD_INTELLIGENCE") }),
                        /* @__PURE__ */ jsx("th", { className: "py-2 px-3 border border-orange-300 dark:border-orange-800 font-bold text-sm", children: __("RMD_SCORE") })
                      ] }) }),
                      /* @__PURE__ */ jsx("tbody", { children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxs("tr", { children: [
                        /* @__PURE__ */ jsx("td", { className: "py-4 px-3 border border-orange-300 dark:border-orange-800 text-center font-bold text-gray-700 dark:text-gray-300", children: i + 1 }),
                        /* @__PURE__ */ jsx("td", { className: "py-4 px-3 border border-orange-300 dark:border-orange-800 font-bold text-blue-600 dark:text-blue-400", children: topThree[i]?.title || "-" }),
                        /* @__PURE__ */ jsx("td", { className: "py-4 px-3 border border-orange-300 dark:border-orange-800 text-center font-black text-xl text-orange-600 dark:text-orange-400", children: topThree[i]?.score || 0 })
                      ] }, i)) })
                    ] }) })
                  ] })
                ] }) })
              ] }),
              topThree[0]?.score > 0 && (() => {
                const topKeys = topThree.map((t) => t.key).filter(Boolean);
                const suggestions = getCareerSuggestions(topKeys);
                const primary = suggestions.filter((c) => c.matchCount === 3);
                const secondary = suggestions.filter((c) => c.matchCount === 2);
                return /* @__PURE__ */ jsxs("section", { className: "mt-8 border-2 border-orange-300 dark:border-orange-700 rounded-3xl overflow-hidden shadow-xl", children: [
                  /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-orange-500 to-yellow-400 py-4 px-6 text-center", children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-white font-black text-xl", children: "💡 Analisis Kecerdasan & Saran Karir" }),
                    /* @__PURE__ */ jsx("p", { className: "text-orange-100 text-sm mt-1", children: "Berdasarkan 3 Kecerdasan Dominan Kamu" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "p-5 bg-orange-50 dark:bg-gray-800 grid grid-cols-1 md:grid-cols-3 gap-4", children: topThree.map((intel, idx) => {
                    const profile = INTELLIGENCE_DATA[intel.key];
                    if (!profile) return null;
                    return /* @__PURE__ */ jsxs("div", { className: `${profile.cardBg} ${profile.border} border-2 rounded-2xl p-4`, children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-2xl", children: profile.icon }),
                        /* @__PURE__ */ jsxs("span", { className: `${profile.badgeBg} px-2 py-0.5 rounded-full text-xs font-bold`, children: [
                          "#",
                          idx + 1,
                          " · ",
                          intel.score,
                          " poin"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsx("h4", { className: `font-black text-base ${profile.textColor} mb-1`, children: intel.title }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed", children: profile.desc }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-700 dark:text-gray-300 mb-1", children: "Kekuatan:" }),
                      /* @__PURE__ */ jsx("ul", { className: "space-y-0.5", children: profile.strengths.map((s, i) => /* @__PURE__ */ jsxs("li", { className: "text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-orange-500 mt-0.5 shrink-0", children: "•" }),
                        " ",
                        s
                      ] }, i)) })
                    ] }, intel.key);
                  }) }),
                  /* @__PURE__ */ jsxs("div", { className: "px-5 pb-5 bg-orange-50 dark:bg-gray-800", children: [
                    /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-2xl border-2 border-orange-200 dark:border-orange-800 overflow-hidden", children: [
                      /* @__PURE__ */ jsxs("div", { className: "bg-orange-100 dark:bg-orange-900/40 px-5 py-3 border-b border-orange-200 dark:border-orange-800", children: [
                        /* @__PURE__ */ jsx("h4", { className: "font-black text-orange-800 dark:text-orange-200 text-base", children: "🎯 Saran Profesi" }),
                        /* @__PURE__ */ jsx("p", { className: "text-xs text-orange-600 dark:text-orange-400 mt-0.5", children: "Profesi yang paling sesuai dengan kombinasi kecerdasanmu" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "p-5 space-y-5", children: [
                        primary.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1", children: [
                            "⭐ ",
                            /* @__PURE__ */ jsx("span", { children: "Profesi Utama" }),
                            /* @__PURE__ */ jsx("span", { className: "font-normal text-gray-500", children: "(cocok dengan 3 kecerdasanmu)" })
                          ] }),
                          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: primary.map((c, i) => /* @__PURE__ */ jsx("span", { className: "bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 px-3 py-1.5 rounded-full text-sm font-semibold border border-orange-200 dark:border-orange-700", children: c.name }, i)) })
                        ] }),
                        secondary.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1", children: [
                            "✨ ",
                            /* @__PURE__ */ jsx("span", { children: "Profesi Pendukung" }),
                            /* @__PURE__ */ jsx("span", { className: "font-normal text-gray-500", children: "(cocok dengan 2 dari 3 kecerdasanmu)" })
                          ] }),
                          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: secondary.map((c, i) => /* @__PURE__ */ jsx("span", { className: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-700", children: c.name }, i)) })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-100 dark:border-gray-700 pt-4", children: [
                          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-gray-700 dark:text-gray-300 mb-3", children: "📋 Profesi per Kecerdasan" }),
                          /* @__PURE__ */ jsx("div", { className: "space-y-2", children: topThree.map((intel) => {
                            const profile = INTELLIGENCE_DATA[intel.key];
                            if (!profile) return null;
                            return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start gap-2", children: [
                              /* @__PURE__ */ jsxs("span", { className: `${profile.badgeBg} px-2 py-0.5 rounded text-xs font-bold shrink-0`, children: [
                                profile.icon,
                                " ",
                                intel.title
                              ] }),
                              /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600 dark:text-gray-400 leading-relaxed", children: profile.careers.join(" · ") })
                            ] }, intel.key);
                          }) })
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-blue-800 dark:text-blue-200 leading-relaxed text-center", children: [
                      "💬 ",
                      /* @__PURE__ */ jsx("strong", { children: "Ingat:" }),
                      " Hasil ini menunjukkan ",
                      /* @__PURE__ */ jsx("em", { children: "potensi dan kecenderunganmu" }),
                      ", bukan batasan. Kamu bisa sukses di bidang apapun yang kamu tekuni dengan sungguh-sungguh. Teruslah belajar dan kembangkan dirimu! 🌟"
                    ] }) })
                  ] })
                ] });
              })(),
              /* @__PURE__ */ jsxs("section", { className: "mt-12 space-y-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-800 dark:text-gray-200", children: __("RMD_REFLECTION_TITLE") || "Refleksi" }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "submit",
                      disabled: processing,
                      className: "px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50",
                      children: processing ? __("RMD_SAVING") : __("RMD_SAVE_ANSWER_BUTTON")
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: "border-2 border-orange-400 dark:border-orange-700 rounded-3xl overflow-hidden shadow-lg bg-white dark:bg-gray-800", children: /* @__PURE__ */ jsxs("table", { className: "w-full border-collapse", children: [
                  /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-cyan-400 dark:bg-cyan-700 text-white", children: [
                    /* @__PURE__ */ jsx("th", { className: "py-4 px-4 border-r border-white/20 w-16 text-center font-bold", children: __("RMD_NO") }),
                    /* @__PURE__ */ jsx("th", { className: "py-4 px-6 border-r border-white/20 text-center font-bold", children: __("RMD_MULTIPLE_INTELLIGENCES") }),
                    /* @__PURE__ */ jsx("th", { className: "py-4 px-6 text-center font-bold", children: __("RMD_ANSWER") })
                  ] }) }),
                  /* @__PURE__ */ jsxs("tbody", { className: "divide-y-2 divide-orange-400 dark:divide-orange-700 text-gray-800 dark:text-gray-200", children: [
                    /* @__PURE__ */ jsxs("tr", { children: [
                      /* @__PURE__ */ jsx("td", { className: "py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold", children: "1" }),
                      /* @__PURE__ */ jsx("td", { className: "py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold italic", children: __("RMD_REFLECTION_LEARNING_LABEL") }),
                      /* @__PURE__ */ jsx("td", { className: "p-2", children: /* @__PURE__ */ jsx(
                        "textarea",
                        {
                          className: "w-full min-h-[128px] border-none focus:ring-0 bg-transparent resize dark:text-gray-200",
                          value: data.reflection_new_learning,
                          onChange: (e) => setData("reflection_new_learning", e.target.value),
                          placeholder: __("RMD_PLACEHOLDER_WRITE_HERE")
                        }
                      ) })
                    ] }),
                    /* @__PURE__ */ jsxs("tr", { children: [
                      /* @__PURE__ */ jsx("td", { className: "py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold", children: "2" }),
                      /* @__PURE__ */ jsx("td", { className: "py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold italic", children: __("RMD_REFLECTION_DEVELOPMENT_LABEL") }),
                      /* @__PURE__ */ jsx("td", { className: "p-2", children: /* @__PURE__ */ jsx(
                        "textarea",
                        {
                          className: "w-full min-h-[128px] border-none focus:ring-0 bg-transparent resize dark:text-gray-200",
                          value: data.reflection_plan,
                          onChange: (e) => setData("reflection_plan", e.target.value),
                          placeholder: __("RMD_PLACEHOLDER_WRITE_HERE")
                        }
                      ) })
                    ] })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4 py-8", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 text-lg leading-relaxed", children: __("RMD_CLOSING_TEXT_1") }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 text-lg leading-relaxed", children: __("RMD_CLOSING_TEXT_2") })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 p-8 rounded-3xl border-2 border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-2xl font-black text-gray-900 dark:text-white mb-6", children: __("RMD_GROUP_PROJECT") }),
                  /* @__PURE__ */ jsxs("ul", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-4 text-gray-700 dark:text-gray-300 text-lg", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-orange-500 font-bold text-2xl mt-[-4px]", children: "•" }),
                      /* @__PURE__ */ jsx("span", { dangerouslySetInnerHTML: { __html: __("RMD_PROJECT_ITEM_1") } })
                    ] }),
                    /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-4 text-gray-700 dark:text-gray-300 text-lg", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-orange-500 font-bold text-2xl mt-[-4px]", children: "•" }),
                      /* @__PURE__ */ jsx("span", { children: __("RMD_PROJECT_ITEM_2") })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "hidden md:block absolute bottom-0 right-8 opacity-20 pointer-events-none", children: /* @__PURE__ */ jsx("svg", { width: "150", height: "150", viewBox: "0 0 24 24", fill: "currentColor", className: "text-purple-500", children: /* @__PURE__ */ jsx("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" }) }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 mt-12 pt-8 border-t border-gray-100 dark:border-gray-700", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route("rmd.chapters"),
                    className: "text-gray-500 hover:text-gray-700 font-medium flex items-center gap-2 transition-colors",
                    children: __("RMD_BACK")
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsx(
                    Transition,
                    {
                      show: recentlySuccessful,
                      enter: "transition ease-in-out",
                      enterFrom: "opacity-0",
                      leave: "transition ease-in-out",
                      leaveTo: "opacity-0",
                      children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: __("RMD_SAVED") })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "submit",
                      disabled: processing,
                      className: "px-6 py-2.5 bg-[#1e293b] hover:bg-[#334155] text-white text-sm font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50",
                      children: __("RMD_SAVE_ANSWER_BUTTON")
                    }
                  ),
                  isCompleted && /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: navigateToMeeting3,
                      disabled: isNavigating,
                      className: "px-6 py-2.5 bg-[#a855f7] hover:bg-[#9333ea] text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2 uppercase tracking-wider disabled:opacity-50",
                      children: isNavigating ? __("RMD_LOADING") : __("RMD_NEXT_MEETING_3")
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("section", { className: "mt-12 border-t-2 border-gray-200 dark:border-gray-700 pt-8", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200", children: __("RMD_ATTACHMENTS_DOCUMENTS") }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-4", children: __("RMD_UPLOAD_INSTRUCTION") }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
                /* @__PURE__ */ jsxs("div", { className: "border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-purple-400 dark:hover:border-purple-500 transition-colors", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "file",
                      id: "file-upload",
                      className: "hidden",
                      onChange: handleFileUpload,
                      disabled: isUploading
                    }
                  ),
                  /* @__PURE__ */ jsxs("label", { htmlFor: "file-upload", className: "cursor-pointer", children: [
                    /* @__PURE__ */ jsx("svg", { className: "mx-auto h-12 w-12 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" }) }),
                    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm font-semibold text-purple-600 dark:text-purple-400", children: isUploading ? `${__("RMD_UPLOADING")} ${uploadProgress}%` : __("RMD_CLICK_TO_UPLOAD") }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: __("RMD_MAX_FILE_SIZE") })
                  ] }),
                  isUploading && /* @__PURE__ */ jsx("div", { className: "mt-4 w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700", children: /* @__PURE__ */ jsx("div", { className: "bg-purple-600 h-2 rounded-full transition-all duration-300", style: { width: `${uploadProgress}%` } }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxs("h4", { className: "font-bold text-gray-700 dark:text-gray-300 mb-2", children: [
                    __("RMD_FILE_LIST"),
                    " (",
                    files?.length || 0,
                    ")"
                  ] }),
                  files?.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 italic", children: __("RMD_NO_FILES_UPLOADED") }) : /* @__PURE__ */ jsx("ul", { className: "divide-y divide-gray-200 dark:divide-gray-700", children: files?.map((file) => /* @__PURE__ */ jsxs("li", { className: "py-3 flex items-center justify-between group", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                      /* @__PURE__ */ jsx("div", { className: "bg-purple-100 dark:bg-purple-900/30 p-2 rounded mr-3", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-purple-600 dark:text-purple-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[150px] md:max-w-[200px]", title: file.file_name, children: file.file_name }),
                        /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
                          (file.file_size / 1024).toFixed(1),
                          " KB • ",
                          new Date(file.created_at).toLocaleDateString()
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(
                        "a",
                        {
                          href: route("rmd.files.download", file.id),
                          className: "p-1 text-gray-400 hover:text-blue-500 transition-colors",
                          title: __("RMD_DOWNLOAD"),
                          children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }) })
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => handleDeleteFile(file.id),
                          className: "p-1 text-gray-400 hover:text-red-500 transition-colors",
                          title: __("RMD_DELETE"),
                          children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) })
                        }
                      )
                    ] })
                  ] }, file.id)) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              Transition,
              {
                show: isCompleted,
                enter: "transition-opacity duration-500",
                enterFrom: "opacity-0",
                enterTo: "opacity-100",
                leave: "transition-opacity duration-300",
                leaveFrom: "opacity-100",
                leaveTo: "opacity-0",
                children: /* @__PURE__ */ jsxs("div", { className: "mt-16 mb-8 flex flex-col items-center border-t-2 border-gray-100 dark:border-gray-700 pt-12", children: [
                  /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
                    /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold text-gray-800 dark:text-gray-200", children: __("RMD_COMPLETION_TITLE") }),
                    /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-2", children: __("RMD_COMPLETION_SUBTITLE") })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: navigateToMeeting3,
                      disabled: isNavigating,
                      "aria-label": __("RMD_NEXT_MEETING_3_BUTTON"),
                      className: `
                                            relative group flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 
                                            hover:from-cyan-600 hover:to-blue-700 text-white font-black text-xl rounded-full 
                                            shadow-[0_10px_20px_-5px_rgba(6,182,212,0.4)] hover:shadow-[0_15px_30px_-10px_rgba(6,182,212,0.6)] 
                                            transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800
                                            disabled:opacity-50 disabled:cursor-not-allowed
                                        `,
                      children: isNavigating ? /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsxs("svg", { className: "animate-spin -ml-1 mr-3 h-6 w-6 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
                          /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                          /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
                        ] }),
                        __("RMD_LOADING")
                      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx("span", { children: __("RMD_NEXT_MEETING_3_BUTTON") }),
                        /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 group-hover:translate-x-2 transition-transform duration-300", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "3", d: "M13 7l5 5m0 0l-5 5m5-5H6" }) })
                      ] })
                    }
                  ),
                  navError && /* @__PURE__ */ jsx("p", { className: "mt-4 text-red-500 text-sm font-medium animate-bounce", children: navError })
                ] })
              }
            )
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsx(
          ConfirmModal,
          {
            show: confirmState.show,
            title: confirmState.title,
            message: confirmState.message,
            onConfirm: () => {
              confirmState.onConfirm?.();
              closeConfirm();
            },
            onCancel: closeConfirm,
            confirmLabel: __("RMD_DELETE"),
            danger: true
          }
        )
      ]
    }
  );
}
export {
  TheOnlyOneMeeting2 as default
};
