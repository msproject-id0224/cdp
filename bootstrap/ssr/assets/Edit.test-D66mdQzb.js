import { jsx, jsxs } from "react/jsx-runtime";
import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import Edit from "./Edit-UYht-F1e.js";
import "./AuthenticatedLayout-BG6RGD2S.js";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "@inertiajs/react";
import "react";
import "./ThemeToggle-BY9dagkZ.js";
import "./TextInput-D0qTZeQv.js";
import "axios";
import "./ProfilePhoto-CJ2Z04pO.js";
import "./Modal-CKHW52Ki.js";
import "./SecondaryButton-TjIrbn1G.js";
import "./lang-COBcTD8W.js";
import "./PrimaryButton-BNNL2gCI.js";
import "./DangerButton-B7to2Tbx.js";
import "./Footer-B7ihPSZ8.js";
import "./useTheme-CngFDcs1.js";
import "./InputLabel-DDs2XNYP.js";
import "./InputError-CBvD_6aD.js";
import "./UpdateProfileInformationForm-BwDzSX4r.js";
import "./DeleteUserForm-0J2_j0B6.js";
import "./AdminList-8x1hQYXT.js";
import "./ConfirmModal-Bqr5rb3_.js";
import "./MentorDocuments-CN1Lx_f7.js";
vi.mock("@inertiajs/react", () => ({
  Head: ({ title }) => /* @__PURE__ */ jsx("div", { "data-testid": "head", children: title }),
  Link: ({ children }) => /* @__PURE__ */ jsx("a", { children }),
  usePage: () => ({
    props: {
      auth: {
        user: {
          name: "Test User",
          role: "admin",
          profile_photo_url: null,
          profile_photo_status: "active"
        }
      },
      locale: "en"
    }
  }),
  useForm: () => ({
    data: {},
    setData: vi.fn(),
    post: vi.fn(),
    processing: false,
    errors: {},
    reset: vi.fn(),
    clearErrors: vi.fn()
  }),
  router: {
    patch: vi.fn()
  }
}));
vi.mock("@/Layouts/AuthenticatedLayout", () => ({
  default: ({ children, header }) => /* @__PURE__ */ jsxs("div", { "data-testid": "layout", children: [
    /* @__PURE__ */ jsx("div", { "data-testid": "header", children: header }),
    children
  ] })
}));
vi.mock("./Partials/UpdateProfileInformationForm", () => ({ default: () => /* @__PURE__ */ jsx("div", { children: "Update Form" }) }));
vi.mock("./Partials/DeleteUserForm", () => ({ default: () => /* @__PURE__ */ jsx("div", { children: "Delete Form" }) }));
vi.mock("../Admin/Partials/AdminList", () => ({ default: () => /* @__PURE__ */ jsx("div", { children: "Admin List" }) }));
vi.mock("@/Components/ProfilePhotoUpdateModal", () => ({ default: () => /* @__PURE__ */ jsx("div", { children: "Photo Modal" }) }));
vi.mock("@/Utils/lang", () => ({ __: (key) => key }));
describe("Profile/Edit Component", () => {
  it("renders and handles role safely", () => {
    const { rerender } = render(/* @__PURE__ */ jsx(Edit, { mustVerifyEmail: false, status: null }));
    expect(screen.getByTestId("layout")).toBeInTheDocument();
  });
});
