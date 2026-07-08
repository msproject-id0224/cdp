import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BG6RGD2S.js";
import { router, Head } from "@inertiajs/react";
import { u as useTrans } from "./lang-COBcTD8W.js";
import { P as Pagination } from "./Pagination-DbN0dqrA.js";
import { T as TextInput } from "./TextInput-D0qTZeQv.js";
import { S as SelectInput } from "./SelectInput-inadq0Bq.js";
import { useState, useEffect } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler, ArcElement } from "chart.js";
import RmdDetailModal from "./RmdDetailModal-DYt9fpPv.js";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "./ThemeToggle-BY9dagkZ.js";
import "axios";
import "./ProfilePhoto-CJ2Z04pO.js";
import "./Modal-CKHW52Ki.js";
import "./SecondaryButton-TjIrbn1G.js";
import "./PrimaryButton-BNNL2gCI.js";
import "./DangerButton-B7to2Tbx.js";
import "./Footer-B7ihPSZ8.js";
import "./useTheme-CngFDcs1.js";
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);
function RmdReportIndex({ auth, reports, filters, chartData, totalParticipants, userRole }) {
  const __ = useTrans();
  const [search, setSearch] = useState(filters.search || "");
  const [status, setStatus] = useState(filters.status || "");
  const [perPage, setPerPage] = useState(filters.per_page || "10");
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get("active_tab");
      if (tabParam === "charts" || tabParam === "participants") return tabParam;
      const stored = localStorage.getItem("rmd_report_tab");
      return stored === "charts" || stored === "participants" ? stored : "participants";
    } catch {
      return "participants";
    }
  });
  const changeTab = (tab) => {
    setActiveTab(tab);
    try {
      localStorage.setItem("rmd_report_tab", tab);
    } catch {
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chartType, setChartType] = useState("bar");
  const STATUS_DISPLAY = {
    "Selesai": __("Completed"),
    "Sedang Mengisi": __("In Progress"),
    "Belum Mulai": __("Not Started")
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== (filters.search || "")) {
        handleFilterChange("search", search);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);
  const handleFilterChange = (key, value) => {
    setIsLoading(true);
    router.get(
      route("rmd-report.index"),
      { ...filters, [key]: value },
      {
        preserveState: true,
        preserveScroll: true,
        onFinish: () => setIsLoading(false)
      }
    );
  };
  const handleSort = (column) => {
    const direction = filters.sort === column && filters.direction === "asc" ? "desc" : "asc";
    handleFilterChange("sort", column);
    handleFilterChange("direction", direction);
  };
  const getStatusColor = (status2) => {
    switch (status2) {
      case "Selesai":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Sedang Mengisi":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  const handleUserClick = (userId) => {
    setSelectedUser(userId);
    setIsModalOpen(true);
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top"
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };
  const renderAgeChart = () => {
    const data = chartData.age_distribution;
    if (!data || !data.datasets || data.datasets.length === 0) return null;
    const options = {
      ...chartOptions,
      plugins: {
        ...chartOptions.plugins,
        title: { display: true, text: __("Age Distribution of Participants") }
      },
      scales: {
        y: { ...chartOptions.scales.y, title: { display: true, text: __("Number of Participants") } },
        x: { title: { display: true, text: __("Age Range") } }
      }
    };
    return /* @__PURE__ */ jsx(Bar, { options, data });
  };
  const renderParticipationChart = () => {
    const data = chartData.participation_rate;
    if (!data || !data.datasets || data.datasets.length === 0) return null;
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "right" },
        title: { display: true, text: __("RMD Participation") }
      },
      elements: {
        arc: {
          borderWidth: 0
        }
      }
    };
    return /* @__PURE__ */ jsx(Doughnut, { options, data });
  };
  const renderCareerChoiceChart = () => {
    const dist = chartData.career_choice_distribution;
    if (!dist || !dist.labels || dist.labels.length === 0) return null;
    const totalEligible = dist.total_eligible || 0;
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: true, text: __("Final Career Choice Distribution") },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const count = ctx.parsed.y;
              const pct = totalEligible > 0 ? (count / totalEligible * 100).toFixed(1) : 0;
              return ` ${count} ${__("participants")} (${pct}% ${__("of total eligible")})`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 },
          title: { display: true, text: __("Number of Participants") }
        },
        x: {
          title: { display: true, text: __("Career Choice") },
          ticks: {
            maxRotation: 45,
            minRotation: 30
          }
        }
      }
    };
    return /* @__PURE__ */ jsx(Bar, { options, data: dist });
  };
  const renderGayaBelajarChart = () => {
    const data = chartData.gaya_belajar_distribution;
    if (!data || !data.datasets || data.datasets.length === 0) return null;
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "right" },
        title: { display: true, text: __("Learning Style Distribution") }
      },
      elements: {
        arc: {
          borderWidth: 0
        }
      }
    };
    return /* @__PURE__ */ jsx(Doughnut, { options, data });
  };
  const renderIntelligenceChart = () => {
    const data = chartData.kecerdasan_majemuk_scores;
    if (!data || !data.datasets || data.datasets.length === 0) return null;
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: true, text: __("Average Multiple Intelligence Score") }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 50,
          title: { display: true, text: __("Average Score (0-50)") }
        },
        x: {
          title: { display: true, text: __("Intelligence Category") },
          ticks: {
            maxRotation: 45,
            minRotation: 30
          }
        }
      }
    };
    return /* @__PURE__ */ jsx(Bar, { options, data });
  };
  const renderAcademicChart = () => {
    const data = chartData.prestasi_akademik_distribution;
    if (!data || !data.datasets || data.datasets.length === 0) return null;
    const options = {
      ...chartOptions,
      plugins: {
        ...chartOptions.plugins,
        title: { display: true, text: __("Academic Achievement Distribution") }
      },
      scales: {
        y: { ...chartOptions.scales.y, title: { display: true, text: __("Number of Participants") } },
        x: { title: { display: true, text: __("Highest Score Range") } }
      }
    };
    return /* @__PURE__ */ jsx(Bar, { options, data });
  };
  const renderModuleFunnelChart = () => {
    const data = chartData.module_completion_funnel;
    if (!data || !data.datasets || data.datasets.length === 0) return null;
    const totalEligible = chartData.module_completion_funnel?.total_eligible || 0;
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: {
        legend: { display: false },
        title: { display: true, text: __("Module Completion Funnel") },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const count = ctx.parsed.x;
              const pct = totalEligible > 0 ? (count / totalEligible * 100).toFixed(1) : 0;
              return ` ${count} ${__("participants")} (${pct}%)`;
            }
          }
        }
      },
      scales: {
        x: { beginAtZero: true, title: { display: true, text: __("Number of Participants") } },
        y: { title: { display: true, text: __("Module") } }
      }
    };
    return /* @__PURE__ */ jsx(Bar, { options, data });
  };
  const renderCareerConsiderationChart = () => {
    const data = chartData.career_consideration_factors;
    if (!data || !data.datasets || data.datasets.length === 0) return null;
    const options = {
      ...chartOptions,
      plugins: {
        ...chartOptions.plugins,
        legend: { display: false },
        title: { display: true, text: __("Career Choice Consideration Factors") }
      },
      scales: {
        y: { ...chartOptions.scales.y, title: { display: true, text: __("Number of Participants") } },
        x: { title: { display: true, text: __("Factor") } }
      }
    };
    return /* @__PURE__ */ jsx(Bar, { options, data });
  };
  const renderTopIntelligenceChart = () => {
    const data = chartData.top_intelligence_distribution;
    if (!data || !data.datasets || data.datasets.length === 0) return null;
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "right" },
        title: { display: true, text: __("Dominant Intelligence Distribution") }
      },
      elements: {
        arc: {
          borderWidth: 0
        }
      }
    };
    return /* @__PURE__ */ jsx(Doughnut, { options, data });
  };
  const renderFavoriteSubjectChart = () => {
    const dist = chartData.favorite_subject_distribution;
    if (!dist || !dist.labels || dist.labels.length === 0) return null;
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: true, text: __("Top Favorite Subjects") }
      },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 }, title: { display: true, text: __("Number of Participants") } },
        x: { ticks: { maxRotation: 45, minRotation: 30 } }
      }
    };
    return /* @__PURE__ */ jsx(Bar, { options, data: dist });
  };
  const renderLeastFavoriteSubjectChart = () => {
    const dist = chartData.least_favorite_subject_distribution;
    if (!dist || !dist.labels || dist.labels.length === 0) return null;
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: true, text: __("Top Least Favorite Subjects") }
      },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 }, title: { display: true, text: __("Number of Participants") } },
        x: { ticks: { maxRotation: 45, minRotation: 30 } }
      }
    };
    return /* @__PURE__ */ jsx(Bar, { options, data: dist });
  };
  const renderLeadershipChart = () => {
    const data = chartData.leadership_traits_distribution;
    if (!data || !data.datasets || data.datasets.length === 0) return null;
    const options = {
      ...chartOptions,
      plugins: {
        ...chartOptions.plugins,
        legend: { display: false },
        title: { display: true, text: __("Leadership Traits Checked") }
      },
      scales: {
        y: { ...chartOptions.scales.y, title: { display: true, text: __("Number of Participants") } },
        x: { title: { display: true, text: __("Leadership Point") } }
      }
    };
    return /* @__PURE__ */ jsx(Bar, { options, data });
  };
  const renderReflectionCheckpointsChart = () => {
    const data = chartData.reflection_checkpoints_distribution;
    if (!data || !data.datasets || data.datasets.length === 0) return null;
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: {
        legend: { display: false },
        title: { display: true, text: __("Chapter Reflection Checkpoints") }
      },
      scales: {
        x: { beginAtZero: true, ticks: { stepSize: 1 }, title: { display: true, text: __("Number of Participants") } },
        y: { title: { display: true, text: __("Checkpoint") } }
      }
    };
    return /* @__PURE__ */ jsx(Bar, { options, data });
  };
  const renderSubmissionTrendChart = () => {
    const data = chartData.submission_trend;
    if (!data || !data.datasets || data.datasets.length === 0) return null;
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: true, text: __("Module Submission Trend (Last 6 Months)") }
      },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 }, title: { display: true, text: __("Number of Submissions") } },
        x: { title: { display: true, text: __("Month") } }
      }
    };
    return /* @__PURE__ */ jsx(Line, { options, data });
  };
  const renderMentorProgressChart = () => {
    const data = chartData.mentor_progress_comparison;
    if (!data || !data.datasets || data.datasets.length === 0) return null;
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: {
        legend: { display: false },
        title: { display: true, text: __("Average Participant Progress by Mentor") }
      },
      scales: {
        x: { beginAtZero: true, max: 100, title: { display: true, text: __("Average Progress (%)") } },
        y: { title: { display: true, text: __("Mentor") } }
      }
    };
    return /* @__PURE__ */ jsx(Bar, { options, data });
  };
  const renderProgressChart = () => {
    const data = chartData.progress_distribution;
    if (!data || !data.datasets || data.datasets.length === 0) return null;
    const options = {
      ...chartOptions,
      indexAxis: "y",
      plugins: {
        ...chartOptions.plugins,
        title: { display: true, text: __("Module Completion Progress") }
      },
      scales: {
        x: { ...chartOptions.scales.y, title: { display: true, text: __("Number of Participants") } },
        y: { title: { display: true, text: __("Number of Completed Modules") } }
      }
    };
    return /* @__PURE__ */ jsx(Bar, { options, data });
  };
  const renderCharts = () => {
    if (chartData?.error) {
      return /* @__PURE__ */ jsx("div", { className: "col-span-full flex items-center justify-center h-40 text-red-500 bg-white dark:bg-gray-800 rounded-lg shadow p-6", children: chartData.error });
    }
    return /* @__PURE__ */ jsxs("div", { className: "space-y-6 mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "p-3 rounded-full bg-indigo-100 text-indigo-500 dark:bg-indigo-900 dark:text-indigo-200", children: /* @__PURE__ */ jsx("svg", { className: "w-8 h-8", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "ml-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: __("Total Participants (12+ Years)") }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-semibold text-gray-900 dark:text-gray-100", children: totalParticipants || 0 })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Age Distribution") }),
            chartData?.age_distribution?.total !== void 0 && /* @__PURE__ */ jsxs("span", { className: "px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200", children: [
              __("Total"),
              ": ",
              chartData.age_distribution.total
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-64", children: renderAgeChart() || /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full text-gray-500", children: __("No data available") }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Participation Rate (12+ Years)") }),
            chartData?.participation_rate?.total !== void 0 && /* @__PURE__ */ jsxs("span", { className: "px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", children: [
              __("Total"),
              ": ",
              chartData.participation_rate.total
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "h-64 flex justify-center relative group", children: [
            renderParticipationChart() || /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full text-gray-500", children: __("No data available") }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-75", children: __("Data only includes participants aged 12 and above") })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6 lg:col-span-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Module Completion Progress (12+ Years)") }),
            chartData?.progress_distribution?.total !== void 0 && /* @__PURE__ */ jsxs("span", { className: "px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", children: [
              __("Total"),
              ": ",
              chartData.progress_distribution.total
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "h-80 relative group", children: [
            renderProgressChart() || /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full text-gray-500", children: __("No data available") }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-75", children: __("Data only includes participants aged 12 and above") })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6 lg:col-span-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Final Career Choice Distribution") }),
            chartData?.career_choice_distribution?.total_eligible !== void 0 && /* @__PURE__ */ jsxs("span", { className: "px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200", children: [
              chartData.career_choice_distribution.total,
              " / ",
              chartData.career_choice_distribution.total_eligible,
              " ",
              __("participants")
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-96", children: renderCareerChoiceChart() || /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full text-gray-500", children: __("No data available") }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Gaya Belajar") }),
            chartData?.gaya_belajar_distribution?.total !== void 0 && /* @__PURE__ */ jsxs("span", { className: "px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200", children: [
              __("Total"),
              ": ",
              chartData.gaya_belajar_distribution.total
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-64", children: renderGayaBelajarChart() || /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full text-gray-500", children: __("No data available") }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Prestasi Akademik") }),
            chartData?.prestasi_akademik_distribution?.total !== void 0 && /* @__PURE__ */ jsxs("span", { className: "px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200", children: [
              __("Total"),
              ": ",
              chartData.prestasi_akademik_distribution.total
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-64", children: renderAcademicChart() || /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full text-gray-500", children: __("No data available") }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6 lg:col-span-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Skor Kecerdasan Majemuk") }),
            chartData?.kecerdasan_majemuk_scores?.total !== void 0 && /* @__PURE__ */ jsxs("span", { className: "px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200", children: [
              __("Total"),
              ": ",
              chartData.kecerdasan_majemuk_scores.total,
              " ",
              __("participants")
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-96", children: renderIntelligenceChart() || /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full text-gray-500", children: __("No data available") }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6 lg:col-span-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Module Completion Funnel") }),
            chartData?.module_completion_funnel?.total_eligible !== void 0 && /* @__PURE__ */ jsxs("span", { className: "px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200", children: [
              __("Total"),
              ": ",
              chartData.module_completion_funnel.total_eligible,
              " ",
              __("participants")
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-96", children: renderModuleFunnelChart() || /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full text-gray-500", children: __("No data available") }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Career Consideration Factors") }),
            chartData?.career_consideration_factors?.total !== void 0 && /* @__PURE__ */ jsxs("span", { className: "px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", children: [
              __("Total"),
              ": ",
              chartData.career_consideration_factors.total
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-64", children: renderCareerConsiderationChart() || /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full text-gray-500", children: __("No data available") }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Dominant Intelligence") }),
            chartData?.top_intelligence_distribution?.total !== void 0 && /* @__PURE__ */ jsxs("span", { className: "px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", children: [
              __("Total"),
              ": ",
              chartData.top_intelligence_distribution.total
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-64", children: renderTopIntelligenceChart() || /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full text-gray-500", children: __("No data available") }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Top Favorite Subjects") }),
            chartData?.favorite_subject_distribution?.total_eligible !== void 0 && /* @__PURE__ */ jsxs("span", { className: "px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200", children: [
              chartData.favorite_subject_distribution.total,
              " / ",
              chartData.favorite_subject_distribution.total_eligible,
              " ",
              __("participants")
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-72", children: renderFavoriteSubjectChart() || /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full text-gray-500", children: __("No data available") }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Top Least Favorite Subjects") }),
            chartData?.least_favorite_subject_distribution?.total_eligible !== void 0 && /* @__PURE__ */ jsxs("span", { className: "px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200", children: [
              chartData.least_favorite_subject_distribution.total,
              " / ",
              chartData.least_favorite_subject_distribution.total_eligible,
              " ",
              __("participants")
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-72", children: renderLeastFavoriteSubjectChart() || /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full text-gray-500", children: __("No data available") }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Leadership Traits") }),
            chartData?.leadership_traits_distribution?.total !== void 0 && /* @__PURE__ */ jsxs("span", { className: "px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", children: [
              __("Total"),
              ": ",
              chartData.leadership_traits_distribution.total
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-64", children: renderLeadershipChart() || /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full text-gray-500", children: __("No data available") }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Reflection Checkpoints") }),
            chartData?.reflection_checkpoints_distribution?.total !== void 0 && /* @__PURE__ */ jsxs("span", { className: "px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200", children: [
              __("Total"),
              ": ",
              chartData.reflection_checkpoints_distribution.total
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-64", children: renderReflectionCheckpointsChart() || /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full text-gray-500", children: __("No data available") }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6 lg:col-span-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Submission Trend") }),
            chartData?.submission_trend?.total !== void 0 && /* @__PURE__ */ jsxs("span", { className: "px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200", children: [
              __("Total"),
              ": ",
              chartData.submission_trend.total
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-72", children: renderSubmissionTrendChart() || /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full text-gray-500", children: __("No data available") }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6 lg:col-span-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Progress by Mentor") }),
            chartData?.mentor_progress_comparison?.total !== void 0 && /* @__PURE__ */ jsxs("span", { className: "px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", children: [
              __("Total"),
              ": ",
              chartData.mentor_progress_comparison.total,
              " ",
              __("participants")
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-96", children: renderMentorProgressChart() || /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full text-gray-500", children: __("No data available") }) })
        ] })
      ] })
    ] });
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200", children: __("RMD Report") }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("RMD Report") }),
        /* @__PURE__ */ jsx(
          RmdDetailModal,
          {
            show: isModalOpen,
            onClose: () => setIsModalOpen(false),
            userId: selectedUser
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6", children: [
          userRole === "mentor" && /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-blue-500 shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-blue-700 dark:text-blue-300", children: __("Showing RMD progress of participants assigned to you.") })
          ] }),
          userRole !== "mentor" && /* @__PURE__ */ jsx("div", { className: "bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 px-4 sm:px-6", children: /* @__PURE__ */ jsxs("nav", { className: "-mb-px flex space-x-8", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => changeTab("participants"),
                className: `${activeTab === "participants" ? "border-indigo-500 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`,
                children: __("Participant List (> 12 Years)")
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => changeTab("charts"),
                className: `${activeTab === "charts" ? "border-indigo-500 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`,
                children: __("Charts")
              }
            )
          ] }) }),
          userRole !== "mentor" && activeTab === "charts" && renderCharts(),
          (userRole === "mentor" || activeTab === "participants") && /* @__PURE__ */ jsx("div", { className: "bg-white shadow-sm sm:rounded-lg dark:bg-gray-800", children: /* @__PURE__ */ jsxs("div", { className: "p-6 text-gray-900 dark:text-gray-100", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium", children: __("Participant List (> 12 Years)") }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-500", children: [
                __("Total"),
                ": ",
                reports.total,
                " ",
                __("Participants")
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-end flex-grow", children: [
                /* @__PURE__ */ jsx("div", { className: "w-full md:w-1/3", children: /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    type: "text",
                    value: search,
                    onChange: (e) => setSearch(e.target.value),
                    placeholder: __("Search Name or ID Number"),
                    className: "w-full"
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "w-full md:w-1/4", children: /* @__PURE__ */ jsxs(
                  SelectInput,
                  {
                    value: status,
                    onChange: (e) => {
                      setStatus(e.target.value);
                      handleFilterChange("status", e.target.value);
                    },
                    className: "w-full",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: __("All Status") }),
                      /* @__PURE__ */ jsx("option", { value: "Belum Mulai", children: __("Not Started") }),
                      /* @__PURE__ */ jsx("option", { value: "Sedang Mengisi", children: __("In Progress") }),
                      /* @__PURE__ */ jsx("option", { value: "Selesai", children: __("Completed") })
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "w-full md:w-40", children: /* @__PURE__ */ jsxs(
                  SelectInput,
                  {
                    value: perPage,
                    onChange: (e) => {
                      setPerPage(e.target.value);
                      handleFilterChange("per_page", e.target.value);
                    },
                    className: "w-full",
                    children: [
                      /* @__PURE__ */ jsxs("option", { value: "10", children: [
                        "10 ",
                        __("per page")
                      ] }),
                      /* @__PURE__ */ jsxs("option", { value: "50", children: [
                        "50 ",
                        __("per page")
                      ] }),
                      /* @__PURE__ */ jsxs("option", { value: "100", children: [
                        "100 ",
                        __("per page")
                      ] })
                    ]
                  }
                ) })
              ] }),
              userRole !== "mentor" && /* @__PURE__ */ jsxs("div", { className: "flex gap-2 shrink-0", children: [
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: route("rmd-report.export.excel", filters),
                    className: "inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-500 active:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150",
                    children: "Excel"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: route("rmd-report.export.pdf", filters),
                    className: "inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150",
                    children: "PDF"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: route("rmd-report.export.analytics"),
                    className: "inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-500 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150",
                    title: __("Download Full Analytics Data"),
                    children: __("Analytics Data")
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative overflow-x-auto border rounded-lg dark:border-gray-700", children: [
              isLoading && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" }) }),
              /* @__PURE__ */ jsxs("table", { className: "w-full text-sm text-left text-gray-500 dark:text-gray-400", children: [
                /* @__PURE__ */ jsx("thead", { className: "text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400", children: /* @__PURE__ */ jsxs("tr", { children: [
                  /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600", onClick: () => handleSort("user_name"), children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                    __("Participant Name"),
                    filters.sort === "user_name" && /* @__PURE__ */ jsx("span", { className: "ml-1", children: filters.direction === "asc" ? "↑" : "↓" })
                  ] }) }),
                  /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3", children: __("ID Number") }),
                  /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3", children: __("Cita-cita") }),
                  /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3", children: __("Gaya Belajar") }),
                  /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-center", children: __("Module Progress") }),
                  /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-center", children: __("Status") }),
                  /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3", children: __("Last Updated") }),
                  /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-center", children: __("Action") })
                ] }) }),
                /* @__PURE__ */ jsx("tbody", { children: reports.data.length > 0 ? reports.data.map((item) => /* @__PURE__ */ jsxs(
                  "tr",
                  {
                    className: "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40",
                    children: [
                      /* @__PURE__ */ jsx("td", { className: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white", children: item.user_name }),
                      /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: item.user_id_number || "-" }),
                      /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: item.cita_cita || "-" }),
                      /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: item.gaya_belajar || "-" }),
                      /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx("div", { className: "flex-grow bg-gray-200 rounded-full h-2 dark:bg-gray-700", children: /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: `h-2 rounded-full transition-all ${item.status === "Selesai" ? "bg-green-500" : item.percentage > 0 ? "bg-indigo-500" : "bg-gray-300 dark:bg-gray-600"}`,
                            style: { width: `${item.percentage}%` }
                          }
                        ) }),
                        /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500 dark:text-gray-400 shrink-0 tabular-nums", children: [
                          item.filled_modules_count,
                          "/",
                          item.total_modules
                        ] })
                      ] }) }),
                      /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`, children: STATUS_DISPLAY[item.status] ?? item.status }) }),
                      /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap", children: item.last_updated }),
                      /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => handleUserClick(item.user_id),
                          className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1",
                          children: [
                            /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }) }),
                            __("Module Progress")
                          ]
                        }
                      ) })
                    ]
                  },
                  item.user_id
                )) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "8", className: "px-6 py-4 text-center text-gray-500 dark:text-gray-400", children: __("No data found.") }) }) })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(Pagination, { links: reports.links }) })
          ] }) })
        ] }) })
      ]
    }
  );
}
export {
  RmdReportIndex as default
};
