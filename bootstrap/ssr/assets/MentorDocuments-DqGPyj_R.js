import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { u as useTrans } from "./lang-COBcTD8W.js";
const getDocumentMeta = (__) => ({
  ijazah_terakhir: {
    label: __("Ijazah Pendidikan Terakhir"),
    note: __("One-time upload"),
    noteColor: "text-blue-600 dark:text-blue-400",
    oneTime: true
  },
  surat_pernyataan: {
    label: __("Surat Pernyataan Mentor"),
    note: __("1-year validity"),
    noteColor: "text-amber-600 dark:text-amber-400",
    oneTime: false
  },
  surat_pernyataan_komitmen_perlindungan_anak: {
    label: __("Surat Pernyataan Komitmen Perlindungan Anak"),
    note: __("1-year validity"),
    noteColor: "text-amber-600 dark:text-amber-400",
    oneTime: false
  },
  surat_keterangan_catatan_kepolisian: {
    label: __("Surat Keterangan Catatan Kepolisian"),
    note: "",
    noteColor: "",
    oneTime: false
  },
  ktp: {
    label: __("KTP"),
    note: "",
    noteColor: "",
    oneTime: false
  }
});
function formatBytes(bytes) {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function StatusBadge({ doc }) {
  const __ = useTrans();
  if (!doc)
    return /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400", children: __("Not Uploaded") });
  if (doc.is_expired)
    return /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400", children: __("Expired") });
  if (doc.is_expiring_soon)
    return /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400", children: __("Expiring Soon") });
  return /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400", children: __("Uploaded") });
}
function MentorDocuments({ readOnly = false, mentorId = null }) {
  const __ = useTrans();
  const DOCUMENT_META = getDocumentMeta(__);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);
  const [notification, setNotification] = useState(null);
  const fileInputRefs = useRef({});
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };
  const fetchDocs = () => {
    setLoading(true);
    const params = mentorId ? { mentor_id: mentorId } : {};
    axios.get(route("api.mentor-documents.index"), { params }).then((res) => setRows(res.data)).catch(
      () => showNotification("error", __("Failed to load documents."))
    ).finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchDocs();
  }, [mentorId]);
  const handleUpload = (documentType, file) => {
    if (!file) return;
    setUploading(documentType);
    const fd = new FormData();
    fd.append("document_type", documentType);
    fd.append("file", file);
    axios.post(route("api.mentor-documents.upload"), fd, {
      headers: { "Content-Type": "multipart/form-data" }
    }).then((res) => {
      showNotification(
        "success",
        res.data.message || __("Document uploaded.")
      );
      setRows(
        (prev) => prev.map(
          (r) => r.document_type === documentType ? { ...r, document: res.data.document } : r
        )
      );
      if (fileInputRefs.current[documentType]) {
        fileInputRefs.current[documentType].value = "";
      }
    }).catch((err) => {
      const msg = err.response?.data?.message || __("Upload failed. Please try again.");
      showNotification("error", msg);
    }).finally(() => setUploading(null));
  };
  const handleDownload = (docId) => {
    window.open(route("api.mentor-documents.download", docId), "_blank");
  };
  const completedCount = rows.filter(
    (r) => r.document && !r.document.is_expired
  ).length;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold text-gray-900 dark:text-gray-100", children: __("My Personal Documents") }),
      /* @__PURE__ */ jsxs("p", { className: "mt-0.5 text-sm text-gray-500 dark:text-gray-400", children: [
        __("Complete all required documents below."),
        " ",
        /* @__PURE__ */ jsxs(
          "span",
          {
            className: `font-medium ${completedCount === rows.length ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`,
            children: [
              completedCount,
              "/",
              rows.length,
              " ",
              __("completed")
            ]
          }
        )
      ] })
    ] }) }),
    notification && /* @__PURE__ */ jsxs(
      "div",
      {
        className: `flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border ${notification.type === "success" ? "bg-green-50 dark:bg-green-900/40 text-green-800 dark:text-green-100 border-green-200 dark:border-green-700" : "bg-red-50 dark:bg-red-900/40 text-red-800 dark:text-red-100 border-red-200 dark:border-red-700"}`,
        children: [
          notification.type === "success" ? /* @__PURE__ */ jsx(
            "svg",
            {
              className: "w-4 h-4 shrink-0",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M5 13l4 4L19 7"
                }
              )
            }
          ) : /* @__PURE__ */ jsx(
            "svg",
            {
              className: "w-4 h-4 shrink-0",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M6 18L18 6M6 6l12 12"
                }
              )
            }
          ),
          notification.message
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 dark:bg-gray-700", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase w-10", children: "No" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase", children: __("File Description") }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase", children: __("Date") }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase", children: __("Status") }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase", children: __("Action") })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800", children: loading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs(
        "td",
        {
          colSpan: 5,
          className: "px-4 py-8 text-center text-gray-400",
          children: [
            /* @__PURE__ */ jsxs(
              "svg",
              {
                className: "animate-spin w-5 h-5 mx-auto mb-1",
                fill: "none",
                viewBox: "0 0 24 24",
                children: [
                  /* @__PURE__ */ jsx(
                    "circle",
                    {
                      className: "opacity-25",
                      cx: "12",
                      cy: "12",
                      r: "10",
                      stroke: "currentColor",
                      strokeWidth: "4"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      className: "opacity-75",
                      fill: "currentColor",
                      d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    }
                  )
                ]
              }
            ),
            __("Loading...")
          ]
        }
      ) }) : rows.map((row) => {
        const meta = DOCUMENT_META[row.document_type] || {};
        const doc = row.document;
        const canUpload = !readOnly && !(meta.oneTime && doc && !doc.is_expired);
        const isUploading = uploading === row.document_type;
        return /* @__PURE__ */ jsxs(
          "tr",
          {
            className: "group hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-colors cursor-default",
            children: [
              /* @__PURE__ */ jsx("td", { className: "px-4 py-2 text-gray-500 dark:text-gray-400 font-medium group-hover:text-indigo-100 transition-colors", children: row.no }),
              /* @__PURE__ */ jsxs("td", { className: "px-4 py-2", children: [
                /* @__PURE__ */ jsx("div", { className: "font-medium text-gray-900 dark:text-gray-100 group-hover:text-white transition-colors", children: meta.label }),
                meta.note && /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `text-xs mt-0.5 ${meta.noteColor} group-hover:text-indigo-200`,
                    children: meta.note
                  }
                ),
                doc && /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-400 mt-0.5 group-hover:text-indigo-200 transition-colors", children: [
                  doc.file_name,
                  " ·",
                  " ",
                  formatBytes(doc.file_size)
                ] })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-2 text-gray-600 dark:text-gray-300 whitespace-nowrap group-hover:text-indigo-100 transition-colors", children: doc ? /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { children: doc.uploaded_at }),
                doc.expires_at && /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `text-xs mt-0.5 group-hover:text-indigo-200 ${doc.is_expired ? "text-red-500" : doc.is_expiring_soon ? "text-amber-500" : "text-gray-400"}`,
                    children: [
                      __("Expires"),
                      ":",
                      " ",
                      doc.expires_at
                    ]
                  }
                )
              ] }) : /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "-" }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-2 group-hover:[&_span]:bg-white/20 group-hover:[&_span]:text-white transition-colors", children: /* @__PURE__ */ jsx(StatusBadge, { doc }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-2 text-right whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
                doc && /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => handleDownload(
                      doc.id
                    ),
                    className: "inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors",
                    title: __("Download"),
                    children: [
                      /* @__PURE__ */ jsx(
                        "svg",
                        {
                          className: "w-3.5 h-3.5",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24",
                          children: /* @__PURE__ */ jsx(
                            "path",
                            {
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              strokeWidth: 2,
                              d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            }
                          )
                        }
                      ),
                      __("Download")
                    ]
                  }
                ),
                canUpload && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "file",
                      ref: (el) => fileInputRefs.current[row.document_type] = el,
                      className: "hidden",
                      accept: ".pdf",
                      onChange: (e) => handleUpload(
                        row.document_type,
                        e.target.files[0]
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: () => fileInputRefs.current[row.document_type]?.click(),
                      disabled: isUploading,
                      className: "inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/60 transition-colors disabled:opacity-60",
                      title: doc ? __(
                        "Re-upload"
                      ) : __(
                        "Upload"
                      ),
                      children: [
                        isUploading ? /* @__PURE__ */ jsxs(
                          "svg",
                          {
                            className: "w-3.5 h-3.5 animate-spin",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            children: [
                              /* @__PURE__ */ jsx(
                                "circle",
                                {
                                  className: "opacity-25",
                                  cx: "12",
                                  cy: "12",
                                  r: "10",
                                  stroke: "currentColor",
                                  strokeWidth: "4"
                                }
                              ),
                              /* @__PURE__ */ jsx(
                                "path",
                                {
                                  className: "opacity-75",
                                  fill: "currentColor",
                                  d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                }
                              )
                            ]
                          }
                        ) : /* @__PURE__ */ jsx(
                          "svg",
                          {
                            className: "w-3.5 h-3.5",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /* @__PURE__ */ jsx(
                              "path",
                              {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12"
                              }
                            )
                          }
                        ),
                        doc ? __(
                          "Re-upload"
                        ) : __("Upload")
                      ]
                    }
                  )
                ] }),
                !readOnly && meta.oneTime && doc && !doc.is_expired && /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "text-xs text-gray-400 italic group-hover:text-indigo-200",
                    title: __(
                      "Cannot be re-uploaded"
                    ),
                    children: __("Locked")
                  }
                )
              ] }) })
            ]
          },
          row.document_type
        );
      }) })
    ] }) }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 dark:text-gray-500", children: __("Accepted format: PDF only · Max 5 MB per file") })
  ] });
}
export {
  MentorDocuments as M
};
