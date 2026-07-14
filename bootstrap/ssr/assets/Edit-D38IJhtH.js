import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-CKYSMoJT.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DDs2XNYP.js";
import { P as PrimaryButton } from "./PrimaryButton-BNNL2gCI.js";
import { T as TextInput } from "./TextInput-D0qTZeQv.js";
import { P as ProfilePhoto } from "./ProfilePhoto-CJ2Z04pO.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { useEffect } from "react";
import { _ as __ } from "./lang-COBcTD8W.js";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "./ThemeToggle-BY9dagkZ.js";
import "axios";
import "./Modal-CKHW52Ki.js";
import "./SecondaryButton-TjIrbn1G.js";
import "./DangerButton-B7to2Tbx.js";
import "./Footer-CDwTxrct.js";
import "./useTheme-CngFDcs1.js";
function ParticipantEdit({ auth, participant }) {
  const { data: photoData, setData: setPhotoData, post: postPhoto, processing: photoProcessing, errors: photoErrors, reset: resetPhoto } = useForm({
    photo: null
  });
  const submitPhoto = (e) => {
    e.preventDefault();
    postPhoto(route("admin.profile-photos.upload", participant.id), {
      onSuccess: () => resetPhoto()
    });
  };
  const { data, setData, patch, errors, processing } = useForm({
    first_name: participant.first_name ?? "",
    last_name: participant.last_name ?? "",
    nickname: participant.nickname ?? "",
    email: participant.email ?? "",
    id_number: participant.id_number ? participant.id_number.replace("ID-0224", "") : "",
    date_of_birth: participant.date_of_birth ? String(participant.date_of_birth).substring(0, 10) : "",
    age: participant.age ?? "",
    gender: participant.gender ?? "",
    education: participant.education ?? "",
    age_group: participant.age_group ?? "",
    height: participant.height != null ? participant.height : "",
    weight: participant.weight != null ? participant.weight : "",
    communication: participant.communication ?? ""
  });
  const submit = (e) => {
    e.preventDefault();
    patch(route("participants.update", participant.id));
  };
  useEffect(() => {
    if (data.date_of_birth) {
      const birthDate = new Date(data.date_of_birth);
      const today = /* @__PURE__ */ new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || m === 0 && today.getDate() < birthDate.getDate()) {
        age--;
      }
      setData("age", age);
    } else {
      setData("age", "");
    }
  }, [data.date_of_birth]);
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200", children: __("Edit Participant") }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("Edit Participant") }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800", children: [
          /* @__PURE__ */ jsxs("div", { className: "p-6 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium mb-4", children: __("Profile Photo") }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-start md:space-x-6 space-y-4 md:space-y-0", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx(
                ProfilePhoto,
                {
                  src: participant.profile_photo_url,
                  alt: participant.name,
                  className: "w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700",
                  fallbackClassName: "w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 border-2 border-gray-200 dark:border-gray-700",
                  fallback: /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-gray-500 dark:text-gray-400", children: participant.name.charAt(0).toUpperCase() })
                }
              ) }),
              /* @__PURE__ */ jsx("div", { className: "flex-grow max-w-xl", children: /* @__PURE__ */ jsxs("form", { onSubmit: submitPhoto, children: [
                /* @__PURE__ */ jsx(InputLabel, { htmlFor: "photo", value: __("Upload New Photo") }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "file",
                    id: "photo",
                    onChange: (e) => setPhotoData("photo", e.target.files[0]),
                    className: "mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900 dark:file:text-indigo-300",
                    accept: "image/*"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: photoErrors.photo, className: "mt-2" }),
                /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(PrimaryButton, { disabled: photoProcessing, children: __("Update Photo") }) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-6 text-gray-900 dark:text-gray-100", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { htmlFor: "id_number", value: __("ID Number") }),
              /* @__PURE__ */ jsxs("div", { className: "mt-1 flex rounded-md shadow-sm", children: [
                /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-5 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 whitespace-nowrap", children: "ID-0224" }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    id: "id_number",
                    className: "block w-full rounded-none rounded-r-md",
                    value: data.id_number,
                    onChange: (e) => setData("id_number", e.target.value),
                    autoComplete: "id_number"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.id_number })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { htmlFor: "first_name", value: __("First Name") }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "first_name",
                  className: "mt-1 block w-full",
                  value: data.first_name,
                  onChange: (e) => setData("first_name", e.target.value),
                  required: true,
                  isFocused: true,
                  autoComplete: "given-name"
                }
              ),
              /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.first_name })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { htmlFor: "last_name", value: __("Last Name") }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "last_name",
                  className: "mt-1 block w-full",
                  value: data.last_name,
                  onChange: (e) => setData("last_name", e.target.value),
                  autoComplete: "family-name"
                }
              ),
              /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.last_name })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { htmlFor: "nickname", value: __("Nickname") }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "nickname",
                  className: "mt-1 block w-full",
                  value: data.nickname,
                  onChange: (e) => setData("nickname", e.target.value),
                  autoComplete: "nickname"
                }
              ),
              /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.nickname })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { htmlFor: "email", value: __("Email") }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "email",
                  type: "email",
                  className: "mt-1 block w-full",
                  value: data.email,
                  onChange: (e) => setData("email", e.target.value),
                  required: true,
                  autoComplete: "username"
                }
              ),
              /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.email })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { htmlFor: "date_of_birth", value: __("Date of Birth") }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    id: "date_of_birth",
                    type: "date",
                    className: "mt-1 block w-full",
                    value: data.date_of_birth,
                    onChange: (e) => setData("date_of_birth", e.target.value)
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.date_of_birth })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { htmlFor: "age", value: __("Age") }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    id: "age",
                    type: "number",
                    className: "mt-1 block w-full",
                    value: data.age,
                    onChange: (e) => setData("age", e.target.value)
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.age })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { htmlFor: "gender", value: __("Gender") }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    id: "gender",
                    className: "mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm",
                    value: data.gender,
                    onChange: (e) => setData("gender", e.target.value),
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: __("Select Gender") }),
                      /* @__PURE__ */ jsx("option", { value: "Laki-laki", children: __("Male") }),
                      /* @__PURE__ */ jsx("option", { value: "Perempuan", children: __("Female") })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.gender })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { htmlFor: "education", value: __("Education") }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    id: "education",
                    className: "mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm",
                    value: data.education,
                    onChange: (e) => setData("education", e.target.value),
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: __("Select Education") }),
                      /* @__PURE__ */ jsx("option", { value: "Dibawah Umur", children: __("Underage") }),
                      /* @__PURE__ */ jsx("option", { value: "TK", children: __("TK") }),
                      /* @__PURE__ */ jsx("option", { value: "SD", children: __("SD") }),
                      /* @__PURE__ */ jsx("option", { value: "SMP", children: __("SMP") }),
                      /* @__PURE__ */ jsx("option", { value: "SMA", children: __("SMA") }),
                      /* @__PURE__ */ jsx("option", { value: "D3", children: __("D3") }),
                      /* @__PURE__ */ jsx("option", { value: "S1", children: __("S1") })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.education })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { htmlFor: "age_group", value: __("Age Group") }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    id: "age_group",
                    className: "mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm",
                    value: data.age_group,
                    onChange: (e) => setData("age_group", e.target.value),
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: __("Select Age Group") }),
                      /* @__PURE__ */ jsx("option", { value: "Survival", children: __("Survival") }),
                      /* @__PURE__ */ jsx("option", { value: "0-2", children: __("0-2") }),
                      /* @__PURE__ */ jsx("option", { value: "3-5", children: __("3-5") }),
                      /* @__PURE__ */ jsx("option", { value: "6-8", children: __("6-8") }),
                      /* @__PURE__ */ jsx("option", { value: "9-11", children: __("9-11") }),
                      /* @__PURE__ */ jsx("option", { value: "12-14", children: __("12-14") }),
                      /* @__PURE__ */ jsx("option", { value: "15-18", children: __("15-18") }),
                      /* @__PURE__ */ jsx("option", { value: "19+", children: __("19+") })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.age_group })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { htmlFor: "height", value: __("Height (cm)") }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    id: "height",
                    type: "number",
                    step: "0.01",
                    className: "mt-1 block w-full",
                    value: data.height,
                    onChange: (e) => setData("height", e.target.value)
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.height })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { htmlFor: "weight", value: __("Weight (kg)") }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    id: "weight",
                    type: "number",
                    step: "0.01",
                    className: "mt-1 block w-full",
                    value: data.weight,
                    onChange: (e) => setData("weight", e.target.value)
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.weight })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { htmlFor: "communication", value: __("Communication") }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  id: "communication",
                  className: "mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm",
                  value: data.communication,
                  onChange: (e) => setData("communication", e.target.value),
                  rows: "3"
                }
              ),
              /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.communication })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: __("Save") }),
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: route("participants.index"),
                  className: "inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150",
                  children: __("Cancel")
                }
              )
            ] })
          ] }) })
        ] }) }) })
      ]
    }
  );
}
export {
  ParticipantEdit as default
};
