import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { _ as __ } from "./lang-COBcTD8W.js";
import "@inertiajs/react";
const val = (v) => v !== null && v !== void 0 && v !== "" ? v : "-";
const fmtDate = (v) => {
  if (!v) return "-";
  const d = new Date(v);
  if (isNaN(d)) return v;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};
const fmtDatetime = (v) => {
  if (!v) return "-";
  const d = new Date(v);
  if (isNaN(d)) return v;
  const date = d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  if (hh === "00" && mm === "00") return date;
  return `${date} ${hh}:${mm}`;
};
const countChecked = (arr) => {
  if (!arr) return 0;
  if (Array.isArray(arr)) return arr.filter(Boolean).length;
  if (typeof arr === "object") return Object.values(arr).filter(Boolean).length;
  return 0;
};
const totalItems = (arr) => {
  if (!arr) return 0;
  if (Array.isArray(arr)) return arr.length;
  if (typeof arr === "object") return Object.keys(arr).length;
  return 0;
};
const Row = ({ label, value, wide = false }) => /* @__PURE__ */ jsxs("div", { className: `py-2 ${wide ? "" : "sm:grid sm:grid-cols-3 sm:gap-4"}`, children: [
  /* @__PURE__ */ jsx("dt", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5", children: label }),
  /* @__PURE__ */ jsx("dd", { className: `text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap ${wide ? "" : "sm:col-span-2"}`, children: val(value) })
] });
const ScoreBadge = ({ checked, total }) => {
  const pct = total > 0 ? Math.round(checked / total * 100) : 0;
  const color = pct >= 70 ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : pct >= 40 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400";
  return /* @__PURE__ */ jsxs("span", { className: `ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${color}`, children: [
    checked,
    "/",
    total,
    " (",
    pct,
    "%)"
  ] });
};
const JsonTable = ({ data }) => {
  if (!data) return /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-400", children: "-" });
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const swotKeys = ["strengths", "weaknesses", "opportunities", "threats"];
    const isSwot = swotKeys.some((k) => k in data);
    if (isSwot) {
      const labels = { strengths: "Strengths", weaknesses: "Weaknesses", opportunities: "Opportunities", threats: "Threats" };
      return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2 mt-1", children: swotKeys.map((k) => /* @__PURE__ */ jsxs("div", { className: "border rounded p-2 dark:border-gray-600", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1", children: labels[k] }),
        Array.isArray(data[k]) ? /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside text-xs text-gray-700 dark:text-gray-300 space-y-0.5", children: data[k].length > 0 ? data[k].map((item, i) => /* @__PURE__ */ jsx("li", { children: item }, i)) : /* @__PURE__ */ jsx("li", { className: "text-gray-400", children: "-" }) }) : /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-700 dark:text-gray-300", children: data[k] || "-" })
      ] }, k)) });
    }
    return /* @__PURE__ */ jsx("div", { className: "space-y-1 mt-1", children: Object.entries(data).map(([k, v]) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2 text-xs", children: [
      /* @__PURE__ */ jsxs("span", { className: "font-medium text-gray-500 dark:text-gray-400 min-w-32", children: [
        k,
        ":"
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-gray-700 dark:text-gray-300", children: typeof v === "object" ? JSON.stringify(v) : String(v) })
    ] }, k)) });
  }
  if (Array.isArray(data) && data.length > 0) {
    const keys = Object.keys(data[0] || {});
    return /* @__PURE__ */ jsx("div", { className: "overflow-x-auto mt-1", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs border-collapse", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "bg-gray-100 dark:bg-gray-700", children: keys.map((k) => /* @__PURE__ */ jsx("th", { className: "px-2 py-1 border dark:border-gray-600 text-left font-semibold text-gray-600 dark:text-gray-300", children: k }, k)) }) }),
      /* @__PURE__ */ jsx("tbody", { children: data.map((row, i) => /* @__PURE__ */ jsx("tr", { className: i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-750", children: keys.map((k) => /* @__PURE__ */ jsx("td", { className: "px-2 py-1 border dark:border-gray-600 text-gray-700 dark:text-gray-300", children: typeof row[k] === "boolean" ? row[k] ? "✓" : "✗" : row[k] ?? "-" }, k)) }, i)) })
    ] }) });
  }
  return /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-400", children: "-" });
};
const Accordion = ({ id, title, icon, filled, progress, open, onToggle, children }) => /* @__PURE__ */ jsxs("div", { className: "border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden", children: [
  /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: () => onToggle(id),
      className: "w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition-colors",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
          /* @__PURE__ */ jsx("span", { className: "text-lg shrink-0", children: icon }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-800 dark:text-gray-100 truncate", children: title }),
          filled ? /* @__PURE__ */ jsxs("span", { className: "hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 shrink-0", children: [
            progress,
            "%"
          ] }) : /* @__PURE__ */ jsx("span", { className: "hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 shrink-0", children: __("Belum diisi") })
        ] }),
        /* @__PURE__ */ jsx(
          "svg",
          {
            className: `w-4 h-4 text-gray-500 shrink-0 transition-transform ${open ? "rotate-180" : ""}`,
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 9l-7 7-7-7" })
          }
        )
      ]
    }
  ),
  open && /* @__PURE__ */ jsx("div", { className: "px-4 py-4 bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700", children: filled ? children : /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 italic py-2", children: __("Belum diisi oleh partisipan.") }) })
] });
const Section = ({ title, children }) => /* @__PURE__ */ jsxs("div", { className: "py-3 first:pt-0", children: [
  /* @__PURE__ */ jsx("h5", { className: "text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-2", children: title }),
  /* @__PURE__ */ jsx("dl", { className: "space-y-1", children })
] });
function RmdDetailSummary({ rmdDetail, rmdProgress }) {
  const [openModule, setOpenModule] = useState(null);
  const toggle = (key) => setOpenModule((prev) => prev === key ? null : key);
  const modPct = (name) => {
    const m = rmdProgress?.modules?.find((m2) => m2.name === name);
    return m ? m.percentage : 0;
  };
  const {
    profile,
    bible_reflection,
    true_success,
    the_only_one,
    multiple_intelligence,
    socio_emotional,
    career_exploration,
    career_exploration_p2,
    dream_island
  } = rmdDetail || {};
  const intelligences = [
    { label: "Linguistik", field: "linguistic_checklist" },
    { label: "Logis-Matematis", field: "logical_mathematical_checklist" },
    { label: "Visual-Spasial", field: "visual_spatial_checklist" },
    { label: "Kinestetik", field: "kinesthetic_checklist" },
    { label: "Musikal", field: "musical_checklist" },
    { label: "Interpersonal", field: "interpersonal_checklist" },
    { label: "Intrapersonal", field: "intrapersonal_checklist" },
    { label: "Naturalis", field: "naturalist_checklist" },
    { label: "Eksistensial", field: "existential_checklist" }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6", children: [
    /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4", children: __("Detail Isian RMD") }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(
        Accordion,
        {
          id: "profile",
          title: "Profil RMD",
          icon: "📋",
          filled: !!profile,
          progress: modPct("Profil RMD"),
          open: openModule === "profile",
          onToggle: toggle,
          children: /* @__PURE__ */ jsxs(Section, { title: "Informasi Profil", children: [
            /* @__PURE__ */ jsx(Row, { label: "Tanggal Rencana Lulus", value: fmtDate(profile?.graduation_plan_date) }),
            /* @__PURE__ */ jsx(Row, { label: "Pertama Kali Mengisi", value: fmtDatetime(profile?.first_filled_at) }),
            /* @__PURE__ */ jsx(Row, { label: "Usia Saat Mengisi", value: profile?.first_filled_age }),
            /* @__PURE__ */ jsx(Row, { label: "Pendidikan Saat Mengisi", value: profile?.first_filled_education }),
            /* @__PURE__ */ jsx(Row, { label: "Institusi Pendidikan", value: profile?.first_filled_education_institution })
          ] })
        }
      ),
      /* @__PURE__ */ jsxs(
        Accordion,
        {
          id: "bible",
          title: "Refleksi Alkitab",
          icon: "📖",
          filled: !!bible_reflection,
          progress: modPct("Refleksi Alkitab"),
          open: openModule === "bible",
          onToggle: toggle,
          children: [
            /* @__PURE__ */ jsxs(Section, { title: "Yeremia 29:11", children: [
              /* @__PURE__ */ jsx(Row, { label: "Siapa yang mengetahui rencana?", value: bible_reflection?.jeremiah_29_11_who_knows, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Rencana seperti apa?", value: bible_reflection?.jeremiah_29_11_plans, wide: true })
            ] }),
            /* @__PURE__ */ jsxs(Section, { title: "Efesus 2:10", children: [
              /* @__PURE__ */ jsx(Row, { label: "Dibuat oleh siapa?", value: bible_reflection?.ephesians_2_10_made_by, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Untuk tujuan apa?", value: bible_reflection?.ephesians_2_10_purpose, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Allah menghendaki kita?", value: bible_reflection?.ephesians_2_10_god_wants, wide: true })
            ] }),
            /* @__PURE__ */ jsxs(Section, { title: "Kejadian 1:26-28", children: [
              /* @__PURE__ */ jsx(Row, { label: "Gambaran / Rupa Allah", value: bible_reflection?.genesis_1_26_28_image, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Tujuan penciptaan manusia", value: bible_reflection?.genesis_1_26_28_purpose, wide: true })
            ] }),
            /* @__PURE__ */ jsxs(Section, { title: "Ringkasan", children: [
              /* @__PURE__ */ jsx(Row, { label: "Poin 1", value: bible_reflection?.summary_point_1, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Poin 2", value: bible_reflection?.summary_point_2, wide: true })
            ] }),
            /* @__PURE__ */ jsxs(Section, { title: "Ayat Favorit", children: [
              /* @__PURE__ */ jsx(Row, { label: "Ayat", value: bible_reflection?.favorite_verse, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Alasan", value: bible_reflection?.reason_favorite_verse, wide: true })
            ] }),
            /* @__PURE__ */ jsx(Section, { title: "Kepemimpinan (checklist)", children: [1, 2, 3, 4, 5].map((n) => bible_reflection?.[`leadership_c${n}`] !== void 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 py-0.5", children: [
              /* @__PURE__ */ jsx("span", { className: `w-4 h-4 rounded-full flex items-center justify-center text-xs ${bible_reflection[`leadership_c${n}`] ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`, children: bible_reflection[`leadership_c${n}`] ? "✓" : "–" }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-600 dark:text-gray-400", children: [
                "Kepemimpinan ",
                n
              ] })
            ] }, n)) }),
            /* @__PURE__ */ jsx(Section, { title: "Refleksi Bab", children: /* @__PURE__ */ jsx(Row, { label: "Pembelajaran", value: bible_reflection?.chapter_learning_text, wide: true }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Accordion,
        {
          id: "true_success",
          title: "Sukses Sejati",
          icon: "🏆",
          filled: !!true_success,
          progress: modPct("Sukses Sejati"),
          open: openModule === "true_success",
          onToggle: toggle,
          children: [
            /* @__PURE__ */ jsxs(Section, { title: "Definisi & Ukuran Sukses", children: [
              /* @__PURE__ */ jsx(Row, { label: "Definisi hidup sukses", value: true_success?.successful_life_definition, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Ukuran sukses umum", value: true_success?.general_success_measure, wide: true })
            ] }),
            /* @__PURE__ */ jsxs(Section, { title: "Perspektif Alkitab", children: [
              /* @__PURE__ */ jsx(Row, { label: "Lukas 2:52 – Pertumbuhan", value: true_success?.luke_2_52_growth, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Filipi 2:5-10 – Tindakan", value: true_success?.philippians_2_5_10_actions, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Sukses Yesus vs Dunia", value: true_success?.jesus_success_vs_society, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Pendapat Allah tentang Yesus", value: true_success?.god_opinion_on_jesus, wide: true })
            ] }),
            /* @__PURE__ */ jsx(Section, { title: "Refleksi", children: /* @__PURE__ */ jsx(Row, { label: "Pembelajaran baru", value: true_success?.new_learning_text, wide: true }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Accordion,
        {
          id: "only_one",
          title: "The Only One",
          icon: "⭐",
          filled: !!the_only_one,
          progress: modPct("The Only One"),
          open: openModule === "only_one",
          onToggle: toggle,
          children: [
            /* @__PURE__ */ jsxs(Section, { title: "Keunikan Diri", children: [
              /* @__PURE__ */ jsx(Row, { label: "Sifat/Ciri Unik", value: the_only_one?.unique_traits, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Tingkat Pendidikan Saat Ini", value: the_only_one?.current_education_level })
            ] }),
            /* @__PURE__ */ jsxs(Section, { title: "Prestasi Akademik", children: [
              /* @__PURE__ */ jsx(Row, { label: "Mata pelajaran favorit", value: the_only_one?.favorite_subject }),
              /* @__PURE__ */ jsx(Row, { label: "Alasan favorit", value: the_only_one?.favorite_subject_reason, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Mata pelajaran kurang diminati", value: the_only_one?.least_favorite_subject }),
              /* @__PURE__ */ jsx(Row, { label: "Alasan kurang diminati", value: the_only_one?.least_favorite_subject_reason, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Nilai tertinggi – Mapel", value: the_only_one?.highest_score_subject }),
              /* @__PURE__ */ jsx(Row, { label: "Nilai tertinggi – Nilai", value: the_only_one?.highest_score_value }),
              /* @__PURE__ */ jsx(Row, { label: "Nilai terendah – Mapel", value: the_only_one?.lowest_score_subject }),
              /* @__PURE__ */ jsx(Row, { label: "Nilai terendah – Nilai", value: the_only_one?.lowest_score_value })
            ] }),
            /* @__PURE__ */ jsx(Section, { title: "Gaya Belajar (Checklist)", children: [
              { label: "Visual", field: "visual_checklist" },
              { label: "Auditori", field: "auditory_checklist" },
              { label: "Kinestetik", field: "kinesthetic_checklist" }
            ].map(({ label, field }) => {
              const arr = the_only_one?.[field];
              const checked = countChecked(arr);
              const total = totalItems(arr);
              return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-0.5", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: label }),
                /* @__PURE__ */ jsx(ScoreBadge, { checked, total })
              ] }, field);
            }) }),
            /* @__PURE__ */ jsxs(Section, { title: "Refleksi", children: [
              /* @__PURE__ */ jsx(Row, { label: "Hal yang dipelajari", value: the_only_one?.learned_aspects, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Hal yang perlu ditingkatkan", value: the_only_one?.aspects_to_improve, wide: true })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Accordion,
        {
          id: "mi",
          title: "Kecerdasan Majemuk",
          icon: "🧠",
          filled: !!multiple_intelligence,
          progress: modPct("Kecerdasan Majemuk"),
          open: openModule === "mi",
          onToggle: toggle,
          children: [
            /* @__PURE__ */ jsx(Section, { title: "Skor per Kecerdasan", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-x-6", children: intelligences.map(({ label, field }) => {
              const arr = multiple_intelligence?.[field];
              const checked = countChecked(arr);
              const total = totalItems(arr);
              return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-1 border-b dark:border-gray-700 last:border-0", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: label }),
                /* @__PURE__ */ jsx(ScoreBadge, { checked, total })
              ] }, field);
            }) }) }),
            /* @__PURE__ */ jsxs(Section, { title: "Refleksi", children: [
              /* @__PURE__ */ jsx(Row, { label: "Pembelajaran baru", value: multiple_intelligence?.reflection_new_learning, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Rencana ke depan", value: multiple_intelligence?.reflection_plan, wide: true })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Accordion,
        {
          id: "socio",
          title: "Sosial Emosional",
          icon: "💬",
          filled: !!socio_emotional,
          progress: modPct("Sosial Emosional"),
          open: openModule === "socio",
          onToggle: toggle,
          children: [
            /* @__PURE__ */ jsxs(Section, { title: "Gaya Belajar", children: [
              /* @__PURE__ */ jsx(Row, { label: "Praktik gaya belajar", value: socio_emotional?.learning_style_practice, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Dampak gaya belajar", value: socio_emotional?.learning_style_impact, wide: true })
            ] }),
            /* @__PURE__ */ jsxs(Section, { title: "Keluarga", children: [
              /* @__PURE__ */ jsx(Row, { label: "Urutan kelahiran / Saudara", value: socio_emotional?.birth_order_siblings }),
              /* @__PURE__ */ jsx(Row, { label: "Pekerjaan orang tua", value: socio_emotional?.parents_occupation }),
              /* @__PURE__ */ jsx(Row, { label: "Tanggung jawab di rumah", value: socio_emotional?.home_responsibilities, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Keunikan keluarga", value: socio_emotional?.family_uniqueness, wide: true })
            ] }),
            /* @__PURE__ */ jsxs(Section, { title: "Aktivitas", children: [
              /* @__PURE__ */ jsx(Row, { label: "Kegiatan ekstrakurikuler", value: socio_emotional?.extracurricular_activities, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Kegiatan PPA", value: socio_emotional?.ppa_activities, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Hobi", value: socio_emotional?.hobbies, wide: true })
            ] }),
            /* @__PURE__ */ jsxs(Section, { title: "Kekuatan & Kelemahan", children: [
              /* @__PURE__ */ jsx(Row, { label: "Kekuatan", value: socio_emotional?.strengths, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Kelemahan", value: socio_emotional?.weaknesses, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Hal yang dipelajari", value: socio_emotional?.reflection_learned, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Hal yang perlu ditingkatkan", value: socio_emotional?.reflection_improvement, wide: true })
            ] }),
            /* @__PURE__ */ jsxs(Section, { title: "Fisik", children: [
              /* @__PURE__ */ jsx(Row, { label: "Tinggi badan (cm)", value: socio_emotional?.height }),
              /* @__PURE__ */ jsx(Row, { label: "Berat badan (kg)", value: socio_emotional?.weight }),
              /* @__PURE__ */ jsx(Row, { label: "Ciri fisik", value: socio_emotional?.physical_traits, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Olahraga favorit", value: socio_emotional?.favorite_sports }),
              /* @__PURE__ */ jsx(Row, { label: "Prestasi olahraga", value: socio_emotional?.sports_achievements, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Pola makan", value: socio_emotional?.eating_habits, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Pola tidur", value: socio_emotional?.sleeping_habits, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Masalah kesehatan", value: socio_emotional?.health_issues, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Yang disukai dari tubuh", value: socio_emotional?.physical_likes, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Tujuan perkembangan fisik", value: socio_emotional?.physical_development_goal, wide: true })
            ] }),
            /* @__PURE__ */ jsxs(Section, { title: "Spiritual", children: [
              /* @__PURE__ */ jsx(Row, { label: "Pengetahuan tentang Yesus", value: socio_emotional?.spiritual_knowledge_jesus, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Pertumbuhan hubungan dengan Allah", value: socio_emotional?.spiritual_relationship_growth, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Cinta & ketaatan", value: socio_emotional?.spiritual_love_obedience, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Komunitas iman", value: socio_emotional?.spiritual_community, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Belajar Alkitab", value: socio_emotional?.spiritual_bible_study, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Mentor rohani", value: socio_emotional?.spiritual_mentor, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Pembelajaran rohani", value: socio_emotional?.spiritual_reflection_learned, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Rencana perkembangan rohani", value: socio_emotional?.spiritual_reflection_improvement, wide: true })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Accordion,
        {
          id: "career",
          title: "Eksplorasi Karir",
          icon: "🎯",
          filled: !!career_exploration,
          progress: modPct("Eksplorasi Karir"),
          open: openModule === "career",
          onToggle: toggle,
          children: [
            /* @__PURE__ */ jsxs(Section, { title: "Profesi Berdasarkan Gaya Belajar", children: [
              /* @__PURE__ */ jsx(Row, { label: "Profesi visual", value: career_exploration?.visual_professions, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Profesi auditori", value: career_exploration?.auditory_professions, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Profesi kinestetik", value: career_exploration?.kinesthetic_professions_style, wide: true }),
              /* @__PURE__ */ jsx(Row, { label: "Profesi paling diminati", value: career_exploration?.interested_professions_from_style, wide: true })
            ] }),
            /* @__PURE__ */ jsx(Section, { title: "Profesi Berdasarkan Kecerdasan Majemuk", children: [
              ["Linguistik", "linguistic_ability", "linguistic_professions"],
              ["Logis-Matematis", "logical_math_ability", "logical_math_professions"],
              ["Visual-Spasial", "visual_spatial_ability", "visual_spatial_professions"],
              ["Kinestetik", "kinesthetic_ability", "kinesthetic_professions"],
              ["Musikal", "musical_ability", "musical_professions"],
              ["Interpersonal", "interpersonal_ability", "interpersonal_professions"],
              ["Intrapersonal", "intrapersonal_ability", "intrapersonal_professions"],
              ["Naturalis", "naturalist_ability", "naturalist_professions"]
            ].map(([label, abilityField, profField]) => /* @__PURE__ */ jsxs("div", { className: "py-1.5 border-b dark:border-gray-700 last:border-0", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 mb-0.5", children: label }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs text-gray-700 dark:text-gray-300", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "Kemampuan:" }),
                  " ",
                  val(career_exploration?.[abilityField])
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "Profesi:" }),
                  " ",
                  val(career_exploration?.[profField])
                ] })
              ] })
            ] }, label)) }),
            /* @__PURE__ */ jsxs(Section, { title: "Pertimbangan Karir", children: [
              /* @__PURE__ */ jsx(Row, { label: "Pertimbangan tambahan", value: career_exploration?.additional_considerations, wide: true }),
              /* @__PURE__ */ jsxs("div", { className: "py-2", children: [
                /* @__PURE__ */ jsx("dt", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 mb-1", children: "Matriks Keputusan Karir" }),
                /* @__PURE__ */ jsx(JsonTable, { data: career_exploration?.career_decision_matrix })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "py-1.5", children: [
                /* @__PURE__ */ jsx("dt", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 mb-1", children: "Pertimbangan yang Dipilih" }),
                /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mt-1", children: [
                  ["Gaya Belajar", "consider_learning_style"],
                  ["Kecerdasan", "consider_intelligence"],
                  ["Prestasi Akademik", "consider_academic_achievement"],
                  ["Dukungan Orang Tua", "consider_parental_support"],
                  ["Kehendak Allah", "consider_gods_will"]
                ].map(([label, field]) => /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded-full text-xs font-medium ${career_exploration?.[field] ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 line-through"}`, children: label }, field)) })
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Accordion,
        {
          id: "career_p2",
          title: "Eksplorasi Karir – Bagian 2",
          icon: "🏁",
          filled: !!career_exploration_p2,
          progress: modPct("Eksplorasi Karir P2"),
          open: openModule === "career_p2",
          onToggle: toggle,
          children: [
            career_exploration_p2?.final_career_choice && /* @__PURE__ */ jsxs("div", { className: "mb-4 px-4 py-3 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded-lg", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wide mb-1", children: "✦ Pilihan Karir Akhir" }),
              /* @__PURE__ */ jsx("p", { className: "text-base font-bold text-indigo-800 dark:text-indigo-200", children: career_exploration_p2.final_career_choice }),
              career_exploration_p2.final_career_reason && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-indigo-700 dark:text-indigo-300 whitespace-pre-wrap", children: career_exploration_p2.final_career_reason })
            ] }),
            /* @__PURE__ */ jsxs(Section, { title: "Analisis SWOT", children: [
              /* @__PURE__ */ jsx(Row, { label: "Definisi SWOT", value: career_exploration_p2?.swot_definition, wide: true }),
              /* @__PURE__ */ jsxs("div", { className: "py-2", children: [
                /* @__PURE__ */ jsx("dt", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 mb-1", children: "Data Analisis SWOT" }),
                /* @__PURE__ */ jsx(JsonTable, { data: career_exploration_p2?.swot_analysis_data })
              ] })
            ] }),
            /* @__PURE__ */ jsx(Section, { title: "Catatan Mentoring", children: /* @__PURE__ */ jsx(Row, { label: "Catatan", value: career_exploration_p2?.mentoring_notes, wide: true }) }),
            /* @__PURE__ */ jsx(Section, { title: "Checklist Bab 4", children: [
              ["Eksplorasi karir selesai", "chapter4_check1"],
              ["Analisis SWOT selesai", "chapter4_check2"],
              ["Yakin dengan keputusan karir", "chapter4_check3"]
            ].map(([label, field]) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 py-0.5", children: [
              /* @__PURE__ */ jsx("span", { className: `w-4 h-4 rounded flex items-center justify-center text-xs ${career_exploration_p2?.[field] ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500"}`, children: career_exploration_p2?.[field] ? "✓" : "–" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: label })
            ] }, field)) })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Accordion,
        {
          id: "dream",
          title: "Persiapan Pulau Impian",
          icon: "🏝️",
          filled: !!dream_island,
          progress: modPct("Persiapan Pulau Impian"),
          open: openModule === "dream",
          onToggle: toggle,
          children: [
            /* @__PURE__ */ jsx(Section, { title: "Pertanyaan Profesi", children: /* @__PURE__ */ jsx("div", { className: "py-1", children: /* @__PURE__ */ jsx(JsonTable, { data: dream_island?.profession_questions }) }) }),
            /* @__PURE__ */ jsx(Section, { title: "Analisis SWOT", children: /* @__PURE__ */ jsx("div", { className: "py-1", children: /* @__PURE__ */ jsx(JsonTable, { data: dream_island?.swot_analysis }) }) }),
            /* @__PURE__ */ jsx(Section, { title: "Rencana Perbaikan", children: /* @__PURE__ */ jsx(Row, { label: "Rencana", value: dream_island?.improvement_plan, wide: true }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  RmdDetailSummary as default
};
