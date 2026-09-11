import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-DY-v4bup.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DDs2XNYP.js";
import { P as PrimaryButton } from "./PrimaryButton-BNNL2gCI.js";
import { T as TextInput } from "./TextInput-D0qTZeQv.js";
import { P as ProfilePhoto } from "./ProfilePhoto-B39VtFFM.js";
import { M as MentorDocuments } from "./MentorDocuments-DqGPyj_R.js";
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
function MentorEdit({ auth, mentor }) {
  const { data: photoData, setData: setPhotoData, post: postPhoto, processing: photoProcessing, errors: photoErrors, reset: resetPhoto } = useForm({
    photo: null
  });
  const submitPhoto = (e) => {
    e.preventDefault();
    postPhoto(route("admin.profile-photos.upload", mentor.id), {
      onSuccess: () => resetPhoto()
    });
  };
  const { data, setData, patch, errors, processing } = useForm({
    first_name: mentor.first_name,
    last_name: mentor.last_name || "",
    nickname: mentor.nickname || "",
    email: mentor.email,
    phone_number: mentor.phone_number || "",
    age: mentor.age || "",
    date_of_birth: mentor.date_of_birth || "",
    gender: mentor.gender || "",
    age_group: mentor.age_group || "",
    specialization: mentor.specialization || "",
    experience: mentor.experience || "",
    bio: mentor.bio || ""
  });
  const submit = (e) => {
    e.preventDefault();
    patch(route("mentors.update", mentor.id));
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
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200", children: __("Edit Mentor") }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: __("Edit Mentor") }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800", children: [
            /* @__PURE__ */ jsxs("div", { className: "p-6 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium mb-4", children: __("Profile Photo") }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-start md:space-x-6 space-y-4 md:space-y-0", children: [
                /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx(
                  ProfilePhoto,
                  {
                    src: mentor.profile_photo_url,
                    alt: mentor.name,
                    className: "w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700",
                    fallbackClassName: "w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 border-2 border-gray-200 dark:border-gray-700",
                    fallback: /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-gray-500 dark:text-gray-400", children: mentor.name.charAt(0).toUpperCase() })
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
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { htmlFor: "phone_number", value: __("Phone Number") }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    id: "phone_number",
                    type: "tel",
                    className: "mt-1 block w-full",
                    value: data.phone_number,
                    onChange: (e) => setData("phone_number", e.target.value),
                    autoComplete: "tel"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.phone_number })
              ] }),
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
                      /* @__PURE__ */ jsx("option", { value: "male", children: __("Male") }),
                      /* @__PURE__ */ jsx("option", { value: "female", children: __("Female") })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.gender })
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
                /* @__PURE__ */ jsx(InputLabel, { htmlFor: "specialization", value: __("Specialization") }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    id: "specialization",
                    className: "mt-1 block w-full",
                    value: data.specialization,
                    onChange: (e) => setData("specialization", e.target.value)
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.specialization })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { htmlFor: "experience", value: __("Experience") }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    id: "experience",
                    className: "mt-1 block w-full",
                    value: data.experience,
                    onChange: (e) => setData("experience", e.target.value)
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.experience })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { htmlFor: "bio", value: __("Profile Description (Bio)") }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    id: "bio",
                    className: "mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm",
                    value: data.bio,
                    onChange: (e) => setData("bio", e.target.value),
                    rows: "4"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.bio })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: __("Save") }),
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route("mentors.index"),
                    className: "inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150",
                    children: __("Cancel")
                  }
                )
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-6 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800", children: /* @__PURE__ */ jsx("div", { className: "p-6 text-gray-900 dark:text-gray-100", children: /* @__PURE__ */ jsx(MentorDocuments, { readOnly: true, mentorId: mentor.id }) }) })
        ] }) })
      ]
    }
  );
}
export {
  MentorEdit as default
};
