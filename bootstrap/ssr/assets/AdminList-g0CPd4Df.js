import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { usePage, useForm, router } from "@inertiajs/react";
import { _ as __ } from "./lang-COBcTD8W.js";
import axios from "axios";
import { T as TextInput } from "./TextInput-D0qTZeQv.js";
import { P as PrimaryButton } from "./PrimaryButton-BNNL2gCI.js";
import { S as SecondaryButton } from "./SecondaryButton-TjIrbn1G.js";
import { M as Modal } from "./Modal-CKHW52Ki.js";
import { I as InputLabel } from "./InputLabel-DDs2XNYP.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { P as ProfilePhoto } from "./ProfilePhoto-B39VtFFM.js";
import { C as ConfirmModal } from "./ConfirmModal-Bqr5rb3_.js";
import "@headlessui/react";
function AdminList() {
  const [admins, setAdmins] = useState({ data: [] });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingAdmin, setViewingAdmin] = useState(null);
  const [addingAdmin, setAddingAdmin] = useState(false);
  const { auth } = usePage().props;
  const [confirmState, setConfirmState] = useState({ show: false, title: "", message: "", onConfirm: null });
  const askConfirm = (title, message, fn) => setConfirmState({ show: true, title, message, onConfirm: fn });
  const closeConfirm = () => setConfirmState((s) => ({ ...s, show: false }));
  const { data, setData, patch, processing, errors, reset, clearErrors } = useForm({
    first_name: "",
    last_name: "",
    email: "",
    job_title: "",
    phone_number: ""
  });
  const { data: addData, setData: setAddData, post: postAdmin, processing: addProcessing, errors: addErrors, reset: resetAdd, clearErrors: clearAddErrors } = useForm({
    first_name: "",
    last_name: "",
    email: "",
    job_title: "",
    phone_number: ""
  });
  const openAddModal = () => {
    resetAdd();
    clearAddErrors();
    setAddingAdmin(true);
  };
  const closeAddModal = () => {
    setAddingAdmin(false);
    resetAdd();
    clearAddErrors();
  };
  const submitAdd = (e) => {
    e.preventDefault();
    postAdmin(route("api.admins.store"), {
      onSuccess: () => {
        closeAddModal();
        fetchAdmins();
      }
    });
  };
  const fetchAdmins = async (url = route("api.admins.index")) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (url.includes("?")) {
      } else if (search) {
        url += `?search=${search}`;
      } else {
        if (search && !url.includes("search=")) {
          url += (url.includes("?") ? "&" : "?") + `search=${search}`;
        }
      }
      const response = await axios.get(url);
      setAdmins(response.data);
    } catch (error) {
      console.error("Failed to fetch admins", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAdmins();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);
  const openEditModal = (user) => {
    setEditingUser(user);
    setData({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      job_title: user.job_title || "",
      phone_number: user.phone_number || ""
    });
    clearErrors();
  };
  const closeEditModal = () => {
    setEditingUser(null);
    reset();
    clearErrors();
  };
  const submitEdit = (e) => {
    e.preventDefault();
    patch(route("api.admins.update", editingUser.id), {
      onSuccess: () => {
        closeEditModal();
        fetchAdmins();
      }
    });
  };
  const toggleStatus = async (user) => {
    if (user.id === auth.user.id) return;
    try {
      await router.patch(route("api.admins.toggle-status", user.id), {}, {
        preserveScroll: true,
        onSuccess: () => fetchAdmins()
      });
    } catch (error) {
      console.error("Failed to toggle status", error);
    }
  };
  const deleteUser = (user) => {
    askConfirm(
      __("Hapus Admin"),
      __("Are you sure you want to delete this admin?"),
      async () => {
        try {
          await router.delete(route("api.admins.destroy", user.id), {
            preserveScroll: true,
            onSuccess: () => fetchAdmins()
          });
        } catch (error) {
          console.error("Failed to delete user", error);
        }
      }
    );
  };
  return /* @__PURE__ */ jsxs("section", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("header", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Admin List") }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600 dark:text-gray-400", children: __("Manage registered administrators.") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-full max-w-sm", children: /* @__PURE__ */ jsx(
        TextInput,
        {
          placeholder: __("Search admin..."),
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "w-full"
        }
      ) }),
      /* @__PURE__ */ jsxs(PrimaryButton, { onClick: openAddModal, children: [
        "+ ",
        __("Add Admin")
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "relative overflow-x-auto shadow-md sm:rounded-lg", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm text-left text-gray-500 dark:text-gray-400", children: [
      /* @__PURE__ */ jsx("thead", { className: "text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-2", children: __("Name") }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-2", children: __("Email") }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-2", children: __("Job Title") }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-2", children: __("Status") }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-2", children: __("Registered") })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: loading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "5", className: "px-6 py-2.5 text-center", children: __("Loading...") }) }) : admins.data.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "5", className: "px-6 py-2.5 text-center", children: __("No admins found.") }) }) : admins.data.map((admin) => /* @__PURE__ */ jsxs("tr", { className: "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600", children: [
        /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5 font-medium text-gray-900 dark:text-white whitespace-nowrap", children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setViewingAdmin(admin),
            className: "flex items-center space-x-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition text-left",
            children: [
              /* @__PURE__ */ jsx(
                ProfilePhoto,
                {
                  src: admin.profile_photo_url,
                  alt: admin.name,
                  className: "w-8 h-8 rounded-full object-cover",
                  fallbackClassName: "w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold text-xs",
                  fallback: (admin.name || "A").charAt(0).toUpperCase()
                }
              ),
              /* @__PURE__ */ jsxs("span", { className: "underline underline-offset-2 decoration-dotted", children: [
                admin.name,
                admin.id === auth.user.id && /* @__PURE__ */ jsxs("span", { className: "ml-2 text-xs text-indigo-600 dark:text-indigo-400", children: [
                  "(",
                  __("You"),
                  ")"
                ] })
              ] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5", children: admin.email }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5", children: admin.job_title || "-" }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-1 rounded text-xs ${admin.is_active ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"}`, children: admin.is_active ? __("Active") : __("Inactive") }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-2.5", children: new Date(admin.created_at).toLocaleDateString() })
      ] }, admin.id)) })
    ] }) }),
    admins.links && /* @__PURE__ */ jsx("div", { className: "flex justify-center mt-4 space-x-1", children: admins.links.map((link, i) => {
      const isPrev = link.label.includes("&laquo;") || link.label === "Previous";
      const isNext = link.label.includes("&raquo;") || link.label === "Next";
      return /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => link.url && fetchAdmins(link.url),
          className: `px-3 py-1 rounded ${link.active ? "bg-indigo-600 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"} ${!link.url ? "opacity-50 cursor-not-allowed" : ""}`,
          disabled: !link.url,
          children: isPrev ? __("Previous") : isNext ? __("Next") : /* @__PURE__ */ jsx("span", { dangerouslySetInnerHTML: { __html: link.label } })
        },
        i
      );
    }) }),
    /* @__PURE__ */ jsx(Modal, { show: !!viewingAdmin, onClose: () => setViewingAdmin(null), children: viewingAdmin && /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4 mb-6", children: [
        /* @__PURE__ */ jsx(
          ProfilePhoto,
          {
            src: viewingAdmin.profile_photo_url,
            alt: viewingAdmin.name,
            className: "w-16 h-16 rounded-full object-cover ring-2 ring-indigo-300",
            fallbackClassName: "w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-2xl",
            fallback: (viewingAdmin.name || "A").charAt(0).toUpperCase()
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-gray-900 dark:text-gray-100", children: [
            viewingAdmin.name,
            viewingAdmin.id === auth.user.id && /* @__PURE__ */ jsxs("span", { className: "ml-2 text-sm text-indigo-500", children: [
              "(",
              __("You"),
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsx("span", { className: `mt-1 inline-flex px-2 py-0.5 rounded text-xs font-medium ${viewingAdmin.is_active ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"}`, children: viewingAdmin.is_active ? __("Active") : __("Inactive") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("dl", { className: "space-y-3 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2", children: [
          /* @__PURE__ */ jsx("dt", { className: "font-medium text-gray-500 dark:text-gray-400", children: __("Email") }),
          /* @__PURE__ */ jsx("dd", { className: "text-gray-900 dark:text-gray-100", children: viewingAdmin.email || "-" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2", children: [
          /* @__PURE__ */ jsx("dt", { className: "font-medium text-gray-500 dark:text-gray-400", children: __("Job Title") }),
          /* @__PURE__ */ jsx("dd", { className: "text-gray-900 dark:text-gray-100", children: viewingAdmin.job_title || "-" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2", children: [
          /* @__PURE__ */ jsx("dt", { className: "font-medium text-gray-500 dark:text-gray-400", children: __("Phone Number") }),
          /* @__PURE__ */ jsx("dd", { className: "text-gray-900 dark:text-gray-100", children: viewingAdmin.phone_number || "-" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("dt", { className: "font-medium text-gray-500 dark:text-gray-400", children: __("Registered") }),
          /* @__PURE__ */ jsx("dd", { className: "text-gray-900 dark:text-gray-100", children: new Date(viewingAdmin.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) })
        ] })
      ] }),
      viewingAdmin.id !== auth.user.id && /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap gap-2 border-t border-gray-100 dark:border-gray-700 pt-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setViewingAdmin(null);
              openEditModal(viewingAdmin);
            },
            className: "px-4 py-1.5 text-sm rounded bg-indigo-600 hover:bg-indigo-700 text-white",
            children: __("Edit")
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              toggleStatus(viewingAdmin);
              setViewingAdmin(null);
            },
            className: "px-4 py-1.5 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white",
            children: viewingAdmin.is_active ? __("Deactivate") : __("Activate")
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setViewingAdmin(null);
              deleteUser(viewingAdmin);
            },
            className: "px-4 py-1.5 text-sm rounded bg-red-600 hover:bg-red-700 text-white",
            children: __("Delete")
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 flex justify-end", children: /* @__PURE__ */ jsx(SecondaryButton, { onClick: () => setViewingAdmin(null), children: __("Close") }) })
    ] }) }),
    /* @__PURE__ */ jsx(Modal, { show: addingAdmin, onClose: closeAddModal, children: /* @__PURE__ */ jsxs("form", { onSubmit: submitAdd, className: "p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Add Admin") }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "add_first_name", value: __("First Name") }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "add_first_name",
              value: addData.first_name,
              onChange: (e) => setAddData("first_name", e.target.value),
              className: "mt-1 block w-full",
              required: true
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: addErrors.first_name, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "add_last_name", value: __("Last Name") }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "add_last_name",
              value: addData.last_name,
              onChange: (e) => setAddData("last_name", e.target.value),
              className: "mt-1 block w-full"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: addErrors.last_name, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "add_email", value: __("Email") }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "add_email",
              type: "email",
              value: addData.email,
              onChange: (e) => setAddData("email", e.target.value),
              className: "mt-1 block w-full",
              required: true
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: addErrors.email, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "add_job_title", value: __("Job Title") }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: "add_job_title",
              value: addData.job_title,
              onChange: (e) => setAddData("job_title", e.target.value),
              className: "mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm",
              children: [
                /* @__PURE__ */ jsxs("option", { value: "", children: [
                  "-- ",
                  __("Select Job Title"),
                  " --"
                ] }),
                /* @__PURE__ */ jsx("option", { value: "Sekretaris", children: "Sekretaris" }),
                /* @__PURE__ */ jsx("option", { value: "Bendahara", children: "Bendahara" }),
                /* @__PURE__ */ jsx("option", { value: "Staf Perlindungan Anak", children: "Staf Perlindungan Anak" }),
                /* @__PURE__ */ jsx("option", { value: "Staf Kesehatan", children: "Staf Kesehatan" }),
                /* @__PURE__ */ jsx("option", { value: "Koordinator Tutor-Mentor", children: "Koordinator Tutor-Mentor" }),
                /* @__PURE__ */ jsx("option", { value: "Staf Lainnya", children: "Staf Lainnya" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: addErrors.job_title, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "add_phone_number", value: __("Phone Number") }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "add_phone_number",
              value: addData.phone_number,
              onChange: (e) => setAddData("phone_number", e.target.value),
              className: "mt-1 block w-full"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: addErrors.phone_number, className: "mt-2" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(SecondaryButton, { onClick: closeAddModal, children: __("Cancel") }),
        /* @__PURE__ */ jsx(PrimaryButton, { disabled: addProcessing, children: __("Add Admin") })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Modal, { show: !!editingUser, onClose: closeEditModal, children: /* @__PURE__ */ jsxs("form", { onSubmit: submitEdit, className: "p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Edit Admin") }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "edit_first_name", value: __("First Name") }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "edit_first_name",
              value: data.first_name,
              onChange: (e) => setData("first_name", e.target.value),
              className: "mt-1 block w-full",
              required: true
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.first_name, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "edit_last_name", value: __("Last Name") }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "edit_last_name",
              value: data.last_name,
              onChange: (e) => setData("last_name", e.target.value),
              className: "mt-1 block w-full"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.last_name, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "edit_email", value: __("Email") }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "edit_email",
              type: "email",
              value: data.email,
              onChange: (e) => setData("email", e.target.value),
              className: "mt-1 block w-full",
              required: true
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.email, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "edit_job_title", value: __("Job Title") }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: "edit_job_title",
              value: data.job_title,
              onChange: (e) => setData("job_title", e.target.value),
              className: "mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "-- Pilih Jabatan --" }),
                /* @__PURE__ */ jsx("option", { value: "Sekretaris", children: "Sekretaris" }),
                /* @__PURE__ */ jsx("option", { value: "Bendahara", children: "Bendahara" }),
                /* @__PURE__ */ jsx("option", { value: "Staf Perlindungan Anak", children: "Staf Perlindungan Anak" }),
                /* @__PURE__ */ jsx("option", { value: "Staf Kesehatan", children: "Staf Kesehatan" }),
                /* @__PURE__ */ jsx("option", { value: "Koordinator Tutor-Mentor", children: "Koordinator Tutor-Mentor" }),
                /* @__PURE__ */ jsx("option", { value: "Staf Lainnya", children: "Staf Lainnya" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.job_title, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "edit_phone_number", value: __("Phone Number") }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "edit_phone_number",
              value: data.phone_number,
              onChange: (e) => setData("phone_number", e.target.value),
              className: "mt-1 block w-full"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.phone_number, className: "mt-2" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end", children: [
        /* @__PURE__ */ jsx(SecondaryButton, { onClick: closeEditModal, children: __("Cancel") }),
        /* @__PURE__ */ jsx(PrimaryButton, { className: "ml-3", disabled: processing, children: __("Save") })
      ] })
    ] }) }),
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
        confirmLabel: __("Ya, Hapus")
      }
    )
  ] });
}
export {
  AdminList as default
};
