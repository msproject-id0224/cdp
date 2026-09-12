import { jsx, jsxs } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-qz7IKsDN.js";
import { useForm, Head } from "@inertiajs/react";
import { P as PrimaryButton } from "./PrimaryButton-BNNL2gCI.js";
import { D as DangerButton } from "./DangerButton-B7to2Tbx.js";
import { S as SecondaryButton } from "./SecondaryButton-TjIrbn1G.js";
import { M as Modal } from "./Modal-CKHW52Ki.js";
import { P as ProfilePhoto } from "./ProfilePhoto-B39VtFFM.js";
import { _ as __ } from "./lang-COBcTD8W.js";
import { T as TextInput } from "./TextInput-D0qTZeQv.js";
import { I as InputLabel } from "./InputLabel-DDs2XNYP.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { P as Pagination } from "./Pagination-CRnq7q04.js";
import { useState } from "react";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "./ThemeToggle-BY9dagkZ.js";
import "axios";
import "./Footer-CDwTxrct.js";
import "./useTheme-CngFDcs1.js";
function PhotoApprovalModal({
  show = false,
  request,
  onConfirm,
  onCancel,
  processing = false
}) {
  if (!request) return null;
  const handleConfirm = () => {
    onConfirm(request);
  };
  return /* @__PURE__ */ jsx(Modal, { show, onClose: onCancel, maxWidth: "md", children: /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
    e.preventDefault();
    handleConfirm();
  }, className: "p-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 dark:text-gray-100 mb-4", children: __("Confirm Photo Approval") }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center mb-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 relative group", children: [
        /* @__PURE__ */ jsx(
          ProfilePhoto,
          {
            src: request.photo_url,
            alt: request.user.name,
            className: "w-32 h-32 rounded-full object-cover border-4 border-gray-100 dark:border-gray-700 shadow-lg transition-transform transform group-hover:scale-105 duration-300",
            fallbackClassName: "w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 border-4 border-gray-100 dark:border-gray-700 shadow-lg transition-transform transform group-hover:scale-105 duration-300",
            fallback: /* @__PURE__ */ jsx("span", { className: "text-4xl font-bold text-gray-500 dark:text-gray-400", children: (request.user?.name || "U").charAt(0).toUpperCase() })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full border border-gray-200 dark:border-gray-600 pointer-events-none" })
      ] }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-800 dark:text-gray-200", children: request.user?.name || "User" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: request.user?.email || "-" }),
      /* @__PURE__ */ jsx("span", { className: "mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 capitalize", children: __(request.user?.role || "participant") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end space-x-3", children: [
      /* @__PURE__ */ jsx(SecondaryButton, { type: "button", onClick: onCancel, disabled: processing, children: __("Cancel") }),
      /* @__PURE__ */ jsx(
        PrimaryButton,
        {
          type: "submit",
          className: "bg-green-600 hover:bg-green-700 focus:bg-green-700 active:bg-green-800 dark:bg-green-500 dark:hover:bg-green-400 dark:focus:bg-green-400 dark:active:bg-green-300 border-green-600 dark:border-green-500",
          disabled: processing,
          children: processing ? __("Approving...") : __("Approve Photo")
        }
      )
    ] })
  ] }) });
}
function ProfilePhotoRequests({ auth, requests }) {
  const [rejectingRequest, setRejectingRequest] = useState(null);
  const [approvingRequest, setApprovingRequest] = useState(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({
    reason: ""
  });
  const { post: postApprove, processing: approveProcessing } = useForm({});
  const { data: bulkData, setData: setBulkData, post: postBulk, processing: bulkProcessing, errors: bulkErrors, reset: resetBulk } = useForm({
    csv_file: null,
    photos: []
  });
  const openApproveModal = (request) => {
    setApprovingRequest(request);
  };
  const closeApproveModal = () => {
    setApprovingRequest(null);
  };
  const confirmApprove = (request) => {
    postApprove(route("admin.profile-photos.approve", request.id), {
      onSuccess: () => closeApproveModal()
    });
  };
  const openRejectModal = (request) => {
    setRejectingRequest(request);
  };
  const closeRejectModal = () => {
    setRejectingRequest(null);
    reset();
  };
  const submitReject = (e) => {
    e.preventDefault();
    post(route("admin.profile-photos.reject", rejectingRequest.id), {
      onSuccess: () => closeRejectModal()
    });
  };
  const submitBulk = (e) => {
    e.preventDefault();
    postBulk(route("admin.profile-photos.bulk-upload-csv"), {
      forceFormData: true,
      onSuccess: () => {
        setShowBulkModal(false);
        resetBulk();
      }
    });
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200", children: __("Profile Photo Management") }),
        /* @__PURE__ */ jsx(PrimaryButton, { onClick: () => setShowBulkModal(true), children: __("Bulk Upload (CSV)") })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("Photo Management") }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800", children: /* @__PURE__ */ jsxs("div", { className: "p-6 text-gray-900 dark:text-gray-100", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold mb-6", children: [
            __("Pending Requests"),
            " (",
            requests.total,
            ")"
          ] }),
          requests.data.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-400 text-center py-8", children: __("No pending photo requests.") }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: requests.data.map((request) => /* @__PURE__ */ jsxs("div", { className: "border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col items-center", children: [
            /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx(
              ProfilePhoto,
              {
                src: request.photo_url,
                alt: request.user.name,
                className: "w-32 h-32 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700",
                fallbackClassName: "w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 border-2 border-gray-200 dark:border-gray-700",
                fallback: /* @__PURE__ */ jsx("span", { className: "text-4xl font-bold text-gray-500 dark:text-gray-400", children: request.user.name.charAt(0).toUpperCase() })
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "text-center mb-4", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold", children: request.user.name }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: request.user.email }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-500 dark:text-gray-400 mt-1 capitalize", children: __(request.user.role) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex space-x-2 w-full", children: [
              /* @__PURE__ */ jsx(
                PrimaryButton,
                {
                  onClick: () => openApproveModal(request),
                  className: "flex-1 justify-center text-xs",
                  disabled: processing || approveProcessing,
                  children: __("Approve")
                }
              ),
              /* @__PURE__ */ jsx(
                DangerButton,
                {
                  onClick: () => openRejectModal(request),
                  className: "flex-1 justify-center text-xs",
                  disabled: processing || approveProcessing,
                  children: __("Reject")
                }
              )
            ] })
          ] }, request.id)) }),
          /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(Pagination, { links: requests.links }) })
        ] }) }) }) }),
        /* @__PURE__ */ jsx(
          PhotoApprovalModal,
          {
            show: !!approvingRequest,
            request: approvingRequest,
            onConfirm: confirmApprove,
            onCancel: closeApproveModal,
            processing: approveProcessing
          }
        ),
        /* @__PURE__ */ jsx(Modal, { show: !!rejectingRequest, onClose: closeRejectModal, children: /* @__PURE__ */ jsxs("form", { onSubmit: submitReject, className: "p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Reject Profile Photo") }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600 dark:text-gray-400", children: __("Please provide a reason for rejecting the photo for :name", { name: rejectingRequest?.user.name }) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "reason", value: __("Reason"), className: "sr-only" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "reason",
                type: "text",
                name: "reason",
                value: data.reason,
                onChange: (e) => setData("reason", e.target.value),
                className: "mt-1 block w-full",
                placeholder: __("e.g., Image is blurry, inappropriate content, etc."),
                isFocused: true
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.reason, className: "mt-2" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end", children: [
            /* @__PURE__ */ jsx(SecondaryButton, { onClick: closeRejectModal, children: __("Cancel") }),
            /* @__PURE__ */ jsx(DangerButton, { className: "ms-3", disabled: processing, children: __("Reject Photo") })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(Modal, { show: showBulkModal, onClose: () => setShowBulkModal(false), children: /* @__PURE__ */ jsxs("form", { onSubmit: submitBulk, className: "p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Bulk Upload Profile Photos") }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "csv_file", value: __("CSV Template") }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "csv_file",
                type: "file",
                accept: ".csv",
                onChange: (e) => setBulkData("csv_file", e.target.files[0]),
                className: "mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              }
            ),
            /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-gray-500", children: [
              __("CSV format"),
              ": ",
              /* @__PURE__ */ jsx("code", { children: "id_number,photo_name" })
            ] }),
            /* @__PURE__ */ jsx(InputError, { message: bulkErrors.csv_file, className: "mt-2" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "photos", value: __("Photo Files") }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "photos",
                type: "file",
                multiple: true,
                accept: "image/*",
                onChange: (e) => setBulkData("photos", Array.from(e.target.files)),
                className: "mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-gray-500", children: __("Upload all photos listed in the CSV.") }),
            /* @__PURE__ */ jsx(InputError, { message: bulkErrors.photos, className: "mt-2" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end", children: [
            /* @__PURE__ */ jsx(SecondaryButton, { onClick: () => setShowBulkModal(false), children: __("Cancel") }),
            /* @__PURE__ */ jsx(PrimaryButton, { className: "ms-3", disabled: bulkProcessing, children: __("Start Bulk Upload") })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  ProfilePhotoRequests as default
};
