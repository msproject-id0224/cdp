import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo, useEffect, useRef } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-qz7IKsDN.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { T as TextInput } from "./TextInput-D0qTZeQv.js";
import "./SelectInput-inadq0Bq.js";
import { T as TextArea } from "./TextArea-Bi4KEfIJ.js";
import { P as PrimaryButton } from "./PrimaryButton-BNNL2gCI.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DDs2XNYP.js";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "./ThemeToggle-BY9dagkZ.js";
import "axios";
import "./ProfilePhoto-B39VtFFM.js";
import "./Modal-CKHW52Ki.js";
import "./SecondaryButton-TjIrbn1G.js";
import "./lang-COBcTD8W.js";
import "./DangerButton-B7to2Tbx.js";
import "./Footer-CDwTxrct.js";
import "./useTheme-CngFDcs1.js";
import "./autoGrow-BUc_DkMi.js";
const calculateAgeInMonths = (birthDate, checkDate) => {
  if (!birthDate) return 0;
  const birth = new Date(birthDate);
  const check = checkDate ? new Date(checkDate) : /* @__PURE__ */ new Date();
  let months = (check.getFullYear() - birth.getFullYear()) * 12;
  months -= birth.getMonth();
  months += check.getMonth();
  if (check.getDate() < birth.getDate()) {
    months--;
  }
  return months < 0 ? 0 : months;
};
const calculateAgeInYears = (birthDate, checkDate) => {
  return calculateAgeInMonths(birthDate, checkDate) / 12;
};
const checkWeightForAge = (ageMonths, gender, weight) => {
  if (!weight) return null;
  const isBoy = gender === "male";
  let idealWeight;
  if (ageMonths <= 12) {
    idealWeight = (ageMonths + 9) / 2;
  } else {
    const ageYears = ageMonths / 12;
    idealWeight = 2 * (ageYears + 4);
  }
  if (isBoy) idealWeight *= 1.05;
  const diff = Math.abs(weight - idealWeight);
  const percentDiff = diff / idealWeight * 100;
  if (percentDiff <= 15) return { status: "normal", message: "Berat Badan Ideal", color: "text-green-600" };
  if (percentDiff <= 30) return { status: "warning", message: weight < idealWeight ? "Berat Badan Kurang" : "Berat Badan Berlebih", color: "text-yellow-600" };
  return { status: "danger", message: weight < idealWeight ? "Berat Badan Sangat Kurang" : "Obesitas", color: "text-red-600" };
};
const checkHeightForAge = (ageMonths, gender, height) => {
  if (!height) return null;
  const isBoy = gender === "male";
  let idealHeight;
  if (ageMonths <= 12) {
    idealHeight = 50 + 25 * (ageMonths / 12);
  } else {
    const ageYears = ageMonths / 12;
    idealHeight = ageYears * 6 + 77;
  }
  if (isBoy) idealHeight *= 1.02;
  const diff = Math.abs(height - idealHeight);
  const percentDiff = diff / idealHeight * 100;
  if (percentDiff <= 10) return { status: "normal", message: "Tinggi Badan Ideal", color: "text-green-600" };
  if (percentDiff <= 20) return { status: "warning", message: height < idealHeight ? "Perawakan Pendek (Stunted)" : "Tinggi Diatas Rata-rata", color: "text-yellow-600" };
  return { status: "danger", message: height < idealHeight ? "Sangat Pendek (Severely Stunted)" : "Sangat Tinggi", color: "text-red-600" };
};
const checkPulse = (ageYears, pulse) => {
  if (!pulse) return null;
  let min, max;
  if (ageYears < 1) {
    min = 100;
    max = 160;
  } else if (ageYears < 3) {
    min = 90;
    max = 150;
  } else if (ageYears < 6) {
    min = 80;
    max = 140;
  } else if (ageYears < 12) {
    min = 70;
    max = 120;
  } else {
    min = 60;
    max = 100;
  }
  if (pulse >= min && pulse <= max) return { status: "normal", message: "Nadi Normal", color: "text-green-600" };
  if (pulse >= min * 0.9 && pulse <= max * 1.1) return { status: "warning", message: pulse < min ? "Nadi Agak Lambat" : "Nadi Agak Cepat", color: "text-yellow-600" };
  return { status: "danger", message: pulse < min ? "Bradycardia (Lambat)" : "Tachycardia (Cepat)", color: "text-red-600" };
};
const checkRespiration = (ageYears, resp) => {
  if (!resp) return null;
  let min, max;
  if (ageYears < 1) {
    min = 30;
    max = 60;
  } else if (ageYears < 3) {
    min = 24;
    max = 40;
  } else if (ageYears < 6) {
    min = 22;
    max = 34;
  } else if (ageYears < 12) {
    min = 18;
    max = 30;
  } else {
    min = 12;
    max = 20;
  }
  if (resp >= min && resp <= max) return { status: "normal", message: "Pernapasan Normal", color: "text-green-600" };
  if (resp >= min * 0.8 && resp <= max * 1.2) return { status: "warning", message: resp < min ? "Pernapasan Lambat" : "Pernapasan Cepat", color: "text-yellow-600" };
  return { status: "danger", message: resp < min ? "Bradypnea (Sangat Lambat)" : "Tachypnea (Sangat Cepat)", color: "text-red-600" };
};
const checkHeadCircumference = (ageMonths, gender, hc) => {
  if (!hc) return null;
  const isBoy = gender === "male";
  let ideal;
  if (isBoy) {
    ideal = 34.5 + 4.1 * Math.log(ageMonths + 1);
  } else {
    ideal = 33.9 + 4.05 * Math.log(ageMonths + 1);
  }
  const sd = 1.2;
  const zScore = (hc - ideal) / sd;
  if (Math.abs(zScore) <= 2) {
    return { status: "normal", message: "Lingkar Kepala Normal", color: "text-green-600" };
  } else if (Math.abs(zScore) <= 3) {
    return {
      status: "warning",
      message: zScore < 0 ? "Microcephaly Risk (Kecil)" : "Macrocephaly Risk (Besar)",
      color: "text-yellow-600"
    };
  } else {
    return {
      status: "danger",
      message: zScore < 0 ? "Microcephaly (Sangat Kecil)" : "Macrocephaly (Sangat Besar)",
      color: "text-red-600"
    };
  }
};
const checkBloodPressure = (ageYears, bpString) => {
  if (!bpString) return null;
  const parts = bpString.split("/");
  if (parts.length !== 2) return null;
  const sys = parseInt(parts[0]);
  const dia = parseInt(parts[1]);
  if (isNaN(sys) || isNaN(dia)) return null;
  let maxSys, maxDia;
  if (ageYears < 1) {
    maxSys = 100;
    maxDia = 65;
  } else if (ageYears <= 3) {
    maxSys = 105;
    maxDia = 70;
  } else if (ageYears <= 6) {
    maxSys = 110;
    maxDia = 75;
  } else if (ageYears <= 12) {
    maxSys = 120;
    maxDia = 80;
  } else {
    maxSys = 130;
    maxDia = 85;
  }
  const minSys = 70 + 2 * ageYears;
  let status = "normal";
  let message = "Tensi Normal";
  let color = "text-green-600";
  if (sys > maxSys || dia > maxDia) {
    if (sys > maxSys + 15 || dia > maxDia + 10) {
      status = "danger";
      message = "Hipertensi (Tinggi)";
      color = "text-red-600";
    } else {
      status = "warning";
      message = "Pre-Hipertensi (Agak Tinggi)";
      color = "text-yellow-600";
    }
  } else if (sys < minSys) {
    status = "warning";
    message = "Hipotensi (Rendah)";
    color = "text-yellow-600";
  }
  return { status, message, color };
};
const checkTemperature = (temp) => {
  if (!temp) return null;
  if (temp >= 36.5 && temp <= 37.5) {
    return { status: "normal", message: "Suhu Normal", color: "text-green-600" };
  } else if (temp > 37.5 && temp <= 38.5) {
    return { status: "warning", message: "Demam Ringan (Febris)", color: "text-yellow-600" };
  } else if (temp > 38.5) {
    return { status: "danger", message: "Demam Tinggi (Hyperpyrexia)", color: "text-red-600" };
  } else if (temp < 36) {
    return { status: "danger", message: "Hipotermia (Sangat Dingin)", color: "text-red-600" };
  } else {
    return { status: "warning", message: "Suhu Rendah", color: "text-yellow-600" };
  }
};
const checkImmunizationCompleteness = (ageMonths, givenVaccines) => {
  if (ageMonths === void 0 || !givenVaccines) return null;
  const schedule = [
    { age: 0, vaccines: ["HEB"] },
    // Hep B0
    { age: 1, vaccines: ["BCG", "POL"] },
    // BCG, Polio 1
    { age: 2, vaccines: ["DPT", "HEB", "HIB", "POL", "PCV", "ROT"] },
    // Pentabio 1, Polio 2, PCV 1, Rota 1
    { age: 3, vaccines: ["DPT", "HEB", "HIB", "POL", "PCV", "ROT"] },
    // Pentabio 2, Polio 3, PCV 2, Rota 2
    { age: 4, vaccines: ["DPT", "HEB", "HIB", "POL", "PCV", "ROT"] },
    // Pentabio 3, Polio 4, PCV 3, Rota 3 (IPV dianggap bagian dari POL)
    { age: 9, vaccines: ["MEA", "JAP"] },
    // Campak/MR, JE (JAP)
    { age: 12, vaccines: ["PCV"] },
    // PCV Booster
    { age: 18, vaccines: ["DPT", "HEB", "HIB", "MEA"] }
    // Pentabio Booster, MR Booster
  ];
  let required = /* @__PURE__ */ new Set();
  let recommended = /* @__PURE__ */ new Set();
  schedule.forEach((milestone) => {
    if (ageMonths >= milestone.age) {
      milestone.vaccines.forEach((v) => required.add(v));
    }
  });
  if (ageMonths >= 6) recommended.add("FLU");
  if (ageMonths >= 12) recommended.add("VAR");
  if (ageMonths >= 12) recommended.add("HEA");
  if (ageMonths >= 24) recommended.add("TYP");
  let missingMandatory = [];
  required.forEach((v) => {
    if (!givenVaccines.includes(v)) {
      missingMandatory.push(v);
    }
  });
  const isBasicComplete = missingMandatory.length === 0;
  let extraCount = 0;
  recommended.forEach((v) => {
    if (givenVaccines.includes(v)) extraCount++;
  });
  const isFullyComplete = isBasicComplete && extraCount >= 1;
  if (isFullyComplete) return "fully_complete";
  if (isBasicComplete) return "complete";
  return "incomplete";
};
const VACCINES = [
  { code: "BCG", name: "BCG - Bacillus Calmette-Guerin" },
  { code: "DPT", name: "DPT - Difteri, Pertusis, Tetanus" },
  { code: "DT", name: "DT - Difteri, Tetanus" },
  { code: "FLU", name: "FLU - Influenza" },
  { code: "HEA", name: "HEA - Hepatitis A" },
  { code: "HEB", name: "HEB - Hepatitis B" },
  { code: "HIB", name: "HIB - H. Influenza Tipe B" },
  { code: "HPV", name: "HPV - Human Papilloma Virus" },
  { code: "JAP", name: "JAP - Japanese Encephalitis" },
  { code: "MEA", name: "MEA - Campak / Measles" },
  { code: "MEN", name: "MEN - Radang Selaput Otak / Meningitis" },
  { code: "MMR", name: "MMR - Campak, Gondok, Rubella" },
  { code: "PCV", name: "PCV - Pneumococcal Conjugate Vaccine" },
  { code: "POL", name: "POL - Polio" },
  { code: "ROT", name: "ROT - Rotavirus" },
  { code: "TT", name: "TT - Tetanus Toxoid" },
  { code: "TYP", name: "TYP - Tipes / Typhoid" },
  { code: "VAR", name: "VAR - Cacar Air / Varicella" },
  { code: "YEL", name: "YEL - Demam Kuning / Yellow Fever" }
];
const FINDING_CATEGORIES = {
  physical_appearance: [
    { key: "edema", label: "Busung/pembengkakan (Edema/Swelling)" },
    { key: "lethargic", label: "Lesu (Lethargic)" },
    { key: "skin_problem", label: "Masalah Kulit (Skin Problem)" },
    { key: "jaundice", label: "Penyakit kuning (Jaundice)" },
    { key: "pallor", label: "Muka pucat (Pallor/Paleness)" },
    { key: "other", label: "Lainnya (Other)" }
  ],
  body_system: [
    { key: "auditory", label: "Pendengaran (Auditory)" },
    { key: "lymphatic", label: "Sistem Limfatik (Lymphatic)" },
    { key: "respiratory", label: "Sistem Pernapasan (Respiratory)" },
    { key: "circulatory", label: "Sistem Peredaran Darah (Circulatory)" },
    { key: "musculoskeletal", label: "Sistem Otot & Tulang (Musculoskeletal)" },
    { key: "skin", label: "Kulit (Skin)" },
    { key: "digestive", label: "Sistem Pencernaan (Digestive)" },
    { key: "nervous", label: "Sistem Saraf (Nervous)" },
    { key: "urinary", label: "Sistem Saluran Kencing (Urinary)" },
    { key: "endocrine", label: "Sistem Endokrin (Endocrine)" },
    { key: "reproductive", label: "Sistem Reproduksi (Reproductive)" },
    { key: "vision", label: "Penglihatan (Vision)" }
  ],
  development: [
    { key: "gross_motor", label: "Motorik Kasar (Gross Motor)" },
    { key: "fine_motor", label: "Motorik Halus (Fine Motor)" },
    { key: "language", label: "Bahasa & Bicara (Language/Speech)" },
    { key: "social", label: "Sosial & Kemandirian (Social)" },
    { key: "cognitive", label: "Kognitif (Cognitive)" }
  ],
  lab_test: [
    { key: "full_blood_count", label: "Pemeriksaan Darah Lengkap" },
    { key: "sputum_test", label: "Tes Lendir" },
    { key: "urinalysis", label: "Saluran Kencing" },
    { key: "hiv_test", label: "Tes HIV" },
    { key: "stool_analysis", label: "Analisa Stool" },
    { key: "xray", label: "X-Ray" }
  ]
};
function SearchableParticipantSelect({ value, onChange, error, disabled, initialUser }) {
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState(initialUser ? [initialUser] : []);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    if (value && options.length === 0 && !initialUser) {
      setLoading(true);
      window.axios.get(route("api.health-screenings.participants"), { params: { id: value } }).then((res) => {
        if (res.data && res.data.length > 0) {
          setOptions(res.data);
        }
      }).catch(console.error).finally(() => setLoading(false));
    }
  }, [value, initialUser]);
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      setLoading(true);
      window.axios.get(route("api.health-screenings.participants"), { params: { search } }).then((res) => setOptions(res.data)).catch(console.error).finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [search, isOpen]);
  const selectedLabel = useMemo(() => {
    const found = options.find((o) => o.id === value);
    if (found) return `${found.first_name} ${found.last_name} (${found.id_number || "-"})`;
    if (initialUser && initialUser.id === value) return `${initialUser.first_name} ${initialUser.last_name} (${initialUser.id_number || "-"})`;
    return value ? "Memuat..." : "Pilih Peserta...";
  }, [options, value, initialUser]);
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "relative", ref: dropdownRef, children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        onClick: () => !disabled && setIsOpen(!isOpen),
        className: `w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-900 cursor-pointer flex justify-between items-center ${error ? "border-red-500" : "border-gray-300 dark:border-gray-700"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`,
        children: [
          /* @__PURE__ */ jsx("span", { className: "truncate text-gray-700 dark:text-gray-300", children: selectedLabel }),
          /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxs("div", { className: "absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg", children: [
      /* @__PURE__ */ jsx("div", { className: "p-2 border-b border-gray-100 dark:border-gray-700", children: /* @__PURE__ */ jsx(
        "input",
        {
          autoFocus: true,
          type: "text",
          className: "w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white focus:ring-indigo-500",
          placeholder: "Cari nama...",
          value: search,
          onChange: (e) => setSearch(e.target.value)
        }
      ) }),
      /* @__PURE__ */ jsx("ul", { className: "max-h-60 overflow-y-auto", children: loading ? /* @__PURE__ */ jsx("li", { className: "px-3 py-2 text-xs text-gray-500 text-center", children: "Memuat..." }) : options.length > 0 ? options.map((opt) => /* @__PURE__ */ jsxs(
        "li",
        {
          onClick: () => {
            onChange(opt.id);
            setIsOpen(false);
            setSearch("");
          },
          className: `px-3 py-2 text-sm cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 ${value === opt.id ? "bg-indigo-50 dark:bg-indigo-900/50 font-semibold" : ""}`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "font-medium text-gray-900 dark:text-gray-100", children: [
              opt.first_name,
              " ",
              opt.last_name
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: opt.id_number || "-" })
          ]
        },
        opt.id
      )) : /* @__PURE__ */ jsx("li", { className: "px-3 py-2 text-xs text-gray-500 text-center", children: "Tidak ditemukan" }) })
    ] }),
    error && /* @__PURE__ */ jsx(InputError, { message: error, className: "mt-2" })
  ] });
}
const GrowthIndicator = ({ check, label }) => {
  if (!check) return null;
  return /* @__PURE__ */ jsxs("div", { className: `mt-1 text-xs font-bold ${check.color} flex items-center gap-1`, children: [
    /* @__PURE__ */ jsx("span", { className: `w-2 h-2 rounded-full ${check.color.replace("text-", "bg-")}` }),
    check.message
  ] });
};
function Form({ auth, mode, screening }) {
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const [selectedUser, setSelectedUser] = useState(screening?.user || null);
  const [bpSys, setBpSys] = useState("");
  const [bpDia, setBpDia] = useState("");
  const initialData = useMemo(() => {
    const base = {
      user_id: screening?.user_id || "",
      checked_at: screening?.checked_at ? new Date(screening.checked_at).toISOString().split("T")[0] : today,
      status: "final",
      weight: screening?.weight || "",
      height: screening?.height || "",
      temperature: screening?.temperature || "",
      pulse: screening?.pulse || "",
      respiration: screening?.respiration || "",
      head_circumference: screening?.head_circumference || "",
      blood_pressure: screening?.blood_pressure || "",
      malnutrition_status: screening?.malnutrition_status || "normal",
      immunization_status: screening?.immunization_status || "",
      immunization_other: screening?.immunization_other || "",
      vitamin_a_dose: screening?.vitamin_a_dose || "",
      vitamin_a_date: screening?.vitamin_a_date ? new Date(screening.vitamin_a_date).toISOString().split("T")[0] : "",
      deworming_dose: screening?.deworming_dose || "",
      deworming_date: screening?.deworming_date ? new Date(screening.deworming_date).toISOString().split("T")[0] : "",
      medical_history: screening?.medical_history || "",
      major_findings: screening?.major_findings || "",
      diagnosis: screening?.diagnosis || "",
      therapy: screening?.therapy || "",
      comments: screening?.comments || "",
      examiner_name: screening?.examiner_name || auth.user.name,
      examiner_qualification: screening?.examiner_qualification || "",
      examiner_date: screening?.examiner_signed_at ? new Date(screening.examiner_signed_at).toISOString().split("T")[0] : today,
      // Arrays
      immunizations: VACCINES.map((v) => {
        const existing = screening?.immunizations?.find((i) => i.vaccine_code === v.code);
        return {
          code: v.code,
          name: v.name,
          checked: !!existing,
          date: existing?.received_at ? new Date(existing.received_at).toISOString().split("T")[0] : "",
          dose: existing?.dose || "",
          given_today: existing?.is_given_today || false
        };
      }),
      findings: []
      // Will be populated below
    };
    const findingsList = [];
    Object.entries(FINDING_CATEGORIES).forEach(([cat, items]) => {
      items.forEach((item) => {
        const existing = screening?.findings?.find((f) => f.category === cat && f.item_key === item.key);
        findingsList.push({
          category: cat,
          key: item.key,
          label: item.label,
          status: existing?.status || "normal",
          // normal, abnormal
          description: existing?.description || ""
        });
      });
    });
    base.findings = findingsList;
    return base;
  }, [screening, auth.user.name, today]);
  const { data, setData, post, put, processing, errors, transform } = useForm(initialData);
  useEffect(() => {
    if (initialData.blood_pressure && initialData.blood_pressure.includes("/")) {
      const [s, d] = initialData.blood_pressure.split("/");
      setBpSys(s);
      setBpDia(d);
    }
  }, [initialData.blood_pressure]);
  useEffect(() => {
    if (bpSys && bpDia) {
      setData("blood_pressure", `${bpSys}/${bpDia}`);
    } else if (!bpSys && !bpDia) {
      setData("blood_pressure", "");
    }
  }, [bpSys, bpDia]);
  const ageContext = useMemo(() => {
    if (!selectedUser?.date_of_birth) return null;
    const months = calculateAgeInMonths(selectedUser.date_of_birth, data.checked_at);
    const years = calculateAgeInYears(selectedUser.date_of_birth, data.checked_at);
    return { months, years, gender: selectedUser.gender || "male" };
  }, [selectedUser, data.checked_at]);
  const growthChecks = useMemo(() => {
    if (!ageContext) return {};
    return {
      weight: checkWeightForAge(ageContext.months, ageContext.gender, parseFloat(data.weight)),
      height: checkHeightForAge(ageContext.months, ageContext.gender, parseFloat(data.height)),
      pulse: checkPulse(ageContext.years, parseInt(data.pulse)),
      resp: checkRespiration(ageContext.years, parseInt(data.respiration)),
      head: checkHeadCircumference(ageContext.months, ageContext.gender, parseFloat(data.head_circumference)),
      bp: checkBloodPressure(ageContext.years, data.blood_pressure),
      temp: checkTemperature(parseFloat(data.temperature))
    };
  }, [ageContext, data.weight, data.height, data.pulse, data.respiration, data.head_circumference, data.blood_pressure, data.temperature]);
  useEffect(() => {
    if (mode !== "create") return;
    if (!growthChecks.weight || !growthChecks.height) return;
    const wStatus = growthChecks.weight.status;
    const hStatus = growthChecks.height.status;
    let newStatus = "normal";
    if (wStatus === "danger" || hStatus === "danger") {
      newStatus = "severe";
    } else if (wStatus === "warning" || hStatus === "warning") {
      newStatus = "mild";
    } else {
      newStatus = "normal";
    }
    if (data.malnutrition_status !== newStatus) {
      setData("malnutrition_status", newStatus);
    }
  }, [growthChecks.weight?.status, growthChecks.height?.status]);
  useEffect(() => {
    if (!ageContext) return;
    const checkedVaccines = data.immunizations.filter((i) => i.checked).map((i) => i.code);
    const suggestedStatus = checkImmunizationCompleteness(ageContext.months, checkedVaccines);
    if (suggestedStatus && suggestedStatus !== data.immunization_status) {
      setData("immunization_status", suggestedStatus);
    }
  }, [data.immunizations, ageContext]);
  const bmi = useMemo(() => {
    const w = parseFloat(data.weight);
    const h = parseFloat(data.height);
    if (w > 0 && h > 0) {
      const val = (w / (h / 100 * (h / 100))).toFixed(1);
      let status = "Normal";
      if (val < 18.5) status = "Kurus";
      else if (val >= 25 && val < 30) status = "Gemuk";
      else if (val >= 30) status = "Obesitas";
      return `${val} (${status})`;
    }
    return "-";
  }, [data.weight, data.height]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "create") {
      post(route("health-screenings.store"));
    } else {
      put(route("health-screenings.update", screening.id));
    }
  };
  const updateFinding = (index, field, value) => {
    const newFindings = [...data.findings];
    newFindings[index][field] = value;
    setData("findings", newFindings);
  };
  const updateImmunization = (index, field, value) => {
    const newImm = [...data.immunizations];
    newImm[index][field] = value;
    setData("immunizations", newImm);
  };
  const handleUserSelect = (userId) => {
    setData("user_id", userId);
    window.axios.get(route("api.health-screenings.participants"), { params: { id: userId } }).then((res) => {
      if (res.data && res.data.length > 0) setSelectedUser(res.data[0]);
    });
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200", children: mode === "create" ? "Tambah Pemeriksaan Baru" : "Edit Pemeriksaan Kesehatan" }),
        ageContext && /* @__PURE__ */ jsxs("div", { className: "text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium", children: [
          "Usia Saat Periksa: ",
          Math.floor(ageContext.years),
          " Tahun ",
          ageContext.months % 12,
          " Bulan"
        ] })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: mode === "create" ? "Tambah Pemeriksaan" : "Edit Pemeriksaan" }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-5xl sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 p-6 shadow sm:rounded-lg", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 border-b pb-2", children: "Identitas & Tanda Vital" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Peserta" }),
                /* @__PURE__ */ jsx(
                  SearchableParticipantSelect,
                  {
                    value: data.user_id,
                    onChange: handleUserSelect,
                    error: errors.user_id,
                    disabled: mode === "edit",
                    initialUser: screening?.user
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Tanggal Pemeriksaan" }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    type: "date",
                    className: "w-full mt-1",
                    value: data.checked_at,
                    onChange: (e) => setData("checked_at", e.target.value)
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.checked_at, className: "mt-2" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Berat (kg)" }),
                /* @__PURE__ */ jsx(TextInput, { type: "number", step: "0.1", className: "w-full mt-1", value: data.weight, onChange: (e) => setData("weight", e.target.value) }),
                /* @__PURE__ */ jsx(GrowthIndicator, { check: growthChecks.weight }),
                /* @__PURE__ */ jsx(InputError, { message: errors.weight, className: "mt-2" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Tinggi (cm)" }),
                /* @__PURE__ */ jsx(TextInput, { type: "number", step: "0.1", className: "w-full mt-1", value: data.height, onChange: (e) => setData("height", e.target.value) }),
                /* @__PURE__ */ jsx(GrowthIndicator, { check: growthChecks.height }),
                /* @__PURE__ */ jsx(InputError, { message: errors.height, className: "mt-2" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "BMI (Otomatis)" }),
                /* @__PURE__ */ jsx("div", { className: "mt-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 font-bold text-center", children: bmi })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Suhu (°C)" }),
                /* @__PURE__ */ jsx(TextInput, { type: "number", step: "0.1", className: "w-full mt-1", value: data.temperature, onChange: (e) => setData("temperature", e.target.value) }),
                /* @__PURE__ */ jsx(GrowthIndicator, { check: growthChecks.temp }),
                /* @__PURE__ */ jsx(InputError, { message: errors.temperature, className: "mt-2" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Nadi (bpm)" }),
                /* @__PURE__ */ jsx(TextInput, { type: "number", className: "w-full mt-1", value: data.pulse, onChange: (e) => setData("pulse", e.target.value) }),
                /* @__PURE__ */ jsx(GrowthIndicator, { check: growthChecks.pulse })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Pernapasan (x/m)" }),
                /* @__PURE__ */ jsx(TextInput, { type: "number", className: "w-full mt-1", value: data.respiration, onChange: (e) => setData("respiration", e.target.value) }),
                /* @__PURE__ */ jsx(GrowthIndicator, { check: growthChecks.resp })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Lingkar Kepala (cm)" }),
                /* @__PURE__ */ jsx(TextInput, { type: "number", step: "0.1", className: "w-full mt-1", value: data.head_circumference, onChange: (e) => setData("head_circumference", e.target.value) }),
                /* @__PURE__ */ jsx(GrowthIndicator, { check: growthChecks.head })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Tekanan Darah (Sys / Dia)" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                  /* @__PURE__ */ jsx(
                    TextInput,
                    {
                      type: "number",
                      placeholder: "120",
                      className: "w-full text-center",
                      value: bpSys,
                      onChange: (e) => setBpSys(e.target.value),
                      maxLength: 3
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-gray-400", children: "/" }),
                  /* @__PURE__ */ jsx(
                    TextInput,
                    {
                      type: "number",
                      placeholder: "80",
                      className: "w-full text-center",
                      value: bpDia,
                      onChange: (e) => setBpDia(e.target.value),
                      maxLength: 3
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(GrowthIndicator, { check: growthChecks.bp })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-6 grid grid-cols-1 md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Status Malnutrisi" }),
                /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-wrap gap-4", children: ["normal", "mild", "moderate", "severe"].map((s) => /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "radio",
                      name: "malnutrition_status",
                      value: s,
                      checked: data.malnutrition_status === s,
                      onChange: (e) => setData("malnutrition_status", e.target.value),
                      className: "text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "capitalize text-sm text-gray-700 dark:text-gray-300", children: s === "normal" ? "Normal" : s === "mild" ? "Ringan" : s === "moderate" ? "Sedang" : "Sangat Buruk" })
                ] }, s)) }),
                /* @__PURE__ */ jsx(InputError, { message: errors.malnutrition_status, className: "mt-2" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Tanggapan (Comments)" }),
                /* @__PURE__ */ jsx(
                  TextArea,
                  {
                    className: "mt-1 w-full",
                    rows: "2",
                    placeholder: "Catatan tambahan...",
                    value: data.comments,
                    onChange: (e) => setData("comments", e.target.value)
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.comments, className: "mt-2" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 p-6 shadow sm:rounded-lg", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100 mb-1 border-b pb-2", children: "Imunisasi yang Diberikan" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mb-4 italic", children: "Silahkan tandai semua vaksinasi yang diberikan hari ini jika data imunisasi belum diisi. Jumlah dosis atau B untuk booster." }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 mb-6", children: data.immunizations.map((imm, idx) => /* @__PURE__ */ jsx("div", { className: `p-3 rounded-lg border transition-colors ${imm.checked ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800" : "border-gray-200 dark:border-gray-700"}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: imm.checked,
                  onChange: (e) => updateImmunization(idx, "checked", e.target.checked),
                  className: "mt-1 rounded text-indigo-600 focus:ring-indigo-500"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("div", { className: "font-bold text-sm text-gray-800 dark:text-gray-200", children: imm.name }),
                imm.checked && /* @__PURE__ */ jsxs("div", { className: "mt-2 grid grid-cols-2 gap-2", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "date",
                      className: "text-xs border-gray-300 rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600",
                      value: imm.date,
                      onChange: (e) => updateImmunization(idx, "date", e.target.value)
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      className: "text-xs border-gray-300 rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600",
                      value: imm.dose,
                      onChange: (e) => updateImmunization(idx, "dose", e.target.value),
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "", children: "Pilih Dosis..." }),
                        /* @__PURE__ */ jsx("option", { value: "1", children: "Dosis 1" }),
                        /* @__PURE__ */ jsx("option", { value: "2", children: "Dosis 2" }),
                        /* @__PURE__ */ jsx("option", { value: "3", children: "Dosis 3" }),
                        /* @__PURE__ */ jsx("option", { value: "Booster", children: "Booster" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs("label", { className: "col-span-2 flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: imm.given_today,
                        onChange: (e) => updateImmunization(idx, "given_today", e.target.checked),
                        className: "rounded text-indigo-600 w-3 h-3"
                      }
                    ),
                    "Diberikan Hari Ini"
                  ] })
                ] })
              ] })
            ] }) }, imm.code)) }),
            /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-200 dark:border-gray-700 pt-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Status Kelengkapan Imunisasi" }),
                /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
                  (() => {
                    const status = data.immunization_status;
                    let badgeClass = "bg-gray-100 text-gray-800 border-gray-200";
                    let label = "Belum Ditentukan";
                    if (status === "incomplete") {
                      badgeClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
                      label = "Belum Lengkap";
                    } else if (status === "complete") {
                      badgeClass = "bg-green-100 text-green-800 border-green-200";
                      label = "Lengkap";
                    } else if (status === "fully_complete") {
                      badgeClass = "bg-purple-100 text-purple-800 border-purple-200";
                      label = "Sangat Lengkap";
                    }
                    return /* @__PURE__ */ jsxs("div", { className: `inline-flex items-center px-4 py-2 rounded-lg border-2 font-bold text-sm ${badgeClass}`, children: [
                      /* @__PURE__ */ jsx("span", { className: `w-3 h-3 rounded-full mr-2 ${badgeClass.replace("bg-", "bg-current-").replace("text-", "text-current-").split(" ")[1].replace("text-", "bg-")}` }),
                      label
                    ] });
                  })(),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Status ini ditentukan secara otomatis berdasarkan jenis vaksin yang dicentang di atas dan usia anak." })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Lainnya (tulis imunisasi lainnya yang diterima oleh anak, dan kapan)" }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    className: "mt-1 w-full",
                    value: data.immunization_other,
                    onChange: (e) => setData("immunization_other", e.target.value),
                    placeholder: "Contoh: Vaksin Tifoid (12 Jan 2024)..."
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 p-6 shadow sm:rounded-lg", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 border-b pb-2", children: "Vitamin dan Pengobatan Obat Cacing Diterima" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Vitamin A - Dosis Terakhir yang Diterima", className: "mb-2" }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex gap-4", children: [
                    { value: "given", label: "Sudah Diberikan", color: "text-blue-700 bg-blue-50 border-blue-200" },
                    { value: "none", label: "Belum", color: "text-gray-600 bg-gray-50 border-gray-200" }
                  ].map((opt) => /* @__PURE__ */ jsxs("label", { className: `flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border ${data.vitamin_a_dose === opt.value ? opt.color + " ring-2 ring-offset-1 ring-indigo-500" : "border-gray-200 hover:bg-gray-50"}`, children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "radio",
                        name: "vitamin_a_dose",
                        value: opt.value,
                        checked: data.vitamin_a_dose === opt.value,
                        onChange: (e) => setData("vitamin_a_dose", e.target.value),
                        className: "text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "font-medium text-sm", children: opt.label })
                  ] }, opt.value)) }),
                  data.vitamin_a_dose === "given" && /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx(InputLabel, { value: "Tanggal Diberikan", className: "text-xs text-gray-500 mb-1" }),
                    /* @__PURE__ */ jsx(
                      TextInput,
                      {
                        type: "date",
                        className: "w-full text-sm",
                        value: data.vitamin_a_date,
                        onChange: (e) => setData("vitamin_a_date", e.target.value)
                      }
                    )
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Cacingan - Dosis Terakhir yang diterima", className: "mb-2" }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex gap-4", children: [
                    { value: "yes", label: "Sudah Diberikan", color: "text-green-700 bg-green-50 border-green-200" },
                    { value: "no", label: "Belum", color: "text-gray-600 bg-gray-50 border-gray-200" }
                  ].map((opt) => /* @__PURE__ */ jsxs("label", { className: `flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border ${data.deworming_dose === opt.value ? opt.color + " ring-2 ring-offset-1 ring-indigo-500" : "border-gray-200 hover:bg-gray-50"}`, children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "radio",
                        name: "deworming_dose",
                        value: opt.value,
                        checked: data.deworming_dose === opt.value,
                        onChange: (e) => setData("deworming_dose", e.target.value),
                        className: "text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "font-medium text-sm", children: opt.label })
                  ] }, opt.value)) }),
                  data.deworming_dose === "yes" && /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx(InputLabel, { value: "Tanggal Diberikan", className: "text-xs text-gray-500 mb-1" }),
                    /* @__PURE__ */ jsx(
                      TextInput,
                      {
                        type: "date",
                        className: "w-full text-sm",
                        value: data.deworming_date,
                        onChange: (e) => setData("deworming_date", e.target.value)
                      }
                    )
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 p-6 shadow sm:rounded-lg", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 border-b pb-2", children: "Riwayat Kesehatan / Riwayat Operasi" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Catatan Riwayat Kesehatan / Operasi (Jika ada)" }),
              /* @__PURE__ */ jsx(
                TextArea,
                {
                  className: "mt-1 w-full",
                  rows: "3",
                  placeholder: "Tuliskan riwayat penyakit, alergi, atau operasi yang pernah dijalani...",
                  value: data.medical_history,
                  onChange: (e) => setData("medical_history", e.target.value)
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.medical_history, className: "mt-2" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 p-6 shadow sm:rounded-lg", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 border-b pb-2", children: "Pemeriksaan Fisik & Sistem Tubuh" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-6", children: Object.entries(FINDING_CATEGORIES).map(([catKey, items]) => /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-gray-500 uppercase tracking-wider mb-1", children: catKey === "physical_appearance" ? "Tampilan Fisik" : catKey === "body_system" ? "Gangguan Sistem Tubuh" : catKey === "development" ? "Perkembangan Anak" : "Laboratorium" }),
              catKey === "development" && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 italic mb-3", children: "(Anak di bawah usia 5 tahun)" }),
              /* @__PURE__ */ jsx("div", { className: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${catKey !== "development" ? "mt-3" : ""}`, children: data.findings.map((f, i) => ({ ...f, originalIndex: i })).filter((f) => f.category === catKey).map((f) => /* @__PURE__ */ jsxs("div", { className: `p-3 rounded border ${f.status === "abnormal" ? "bg-red-50 border-red-200 dark:bg-red-900/20" : "bg-gray-50 border-transparent dark:bg-gray-700/30"}`, children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-800 dark:text-gray-200", children: f.label }),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      value: f.status,
                      onChange: (e) => updateFinding(f.originalIndex, "status", e.target.value),
                      className: `text-xs rounded border-0 py-1 pl-2 pr-6 font-bold ${f.status === "abnormal" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`,
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "normal", children: "Normal" }),
                        /* @__PURE__ */ jsx("option", { value: "abnormal", children: "Abnormal" })
                      ]
                    }
                  )
                ] }),
                f.status === "abnormal" && /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    className: "w-full text-xs border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600",
                    rows: "2",
                    placeholder: "Jelaskan kelainan...",
                    value: f.description,
                    onChange: (e) => updateFinding(f.originalIndex, "description", e.target.value)
                  }
                )
              ] }, f.key)) })
            ] }, catKey)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 p-6 shadow sm:rounded-lg", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 border-b pb-2", children: "Kesimpulan & Pengesahan" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 mb-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Temuan Penting (Major Findings)" }),
                /* @__PURE__ */ jsx(TextArea, { className: "mt-1 w-full", rows: "3", value: data.major_findings, onChange: (e) => setData("major_findings", e.target.value) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Diagnosis" }),
                  /* @__PURE__ */ jsx(TextArea, { className: "mt-1 w-full", rows: "3", value: data.diagnosis, onChange: (e) => setData("diagnosis", e.target.value) })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Terapi / Rekomendasi" }),
                  /* @__PURE__ */ jsx(TextArea, { className: "mt-1 w-full", rows: "3", value: data.therapy, onChange: (e) => setData("therapy", e.target.value) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase", children: "Identitas Pemeriksa" }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Nama Pemeriksa" }),
                  /* @__PURE__ */ jsx(TextInput, { className: "w-full mt-1", value: data.examiner_name, onChange: (e) => setData("examiner_name", e.target.value) }),
                  /* @__PURE__ */ jsx(InputError, { message: errors.examiner_name, className: "mt-2" })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Jabatan / Kualifikasi" }),
                  /* @__PURE__ */ jsx(TextInput, { className: "w-full mt-1", value: data.examiner_qualification, onChange: (e) => setData("examiner_qualification", e.target.value) })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Tanggal Tanda Tangan" }),
                  /* @__PURE__ */ jsx(TextInput, { type: "date", className: "w-full mt-1", value: data.examiner_date, onChange: (e) => setData("examiner_date", e.target.value) })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-4", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("health-screenings.index"),
                className: "px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150",
                children: "Batal"
              }
            ),
            /* @__PURE__ */ jsx(PrimaryButton, { className: "w-40 justify-center", disabled: processing, children: processing ? "Menyimpan..." : "Simpan Data" })
          ] })
        ] }) }) })
      ]
    }
  );
}
export {
  Form as default
};
