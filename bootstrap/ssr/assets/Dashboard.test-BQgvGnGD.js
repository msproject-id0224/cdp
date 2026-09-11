import { jsx, jsxs } from "react/jsx-runtime";
import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import Dashboard from "./Dashboard-C9oZJhjU.js";
import "./AuthenticatedLayout-DY-v4bup.js";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "@inertiajs/react";
import "react";
import "./ThemeToggle-BY9dagkZ.js";
import "./TextInput-D0qTZeQv.js";
import "axios";
import "./ProfilePhoto-B39VtFFM.js";
import "./Modal-CKHW52Ki.js";
import "./SecondaryButton-TjIrbn1G.js";
import "./lang-COBcTD8W.js";
import "./PrimaryButton-BNNL2gCI.js";
import "./DangerButton-B7to2Tbx.js";
import "./Footer-CDwTxrct.js";
import "./useTheme-CngFDcs1.js";
import "./InputLabel-DDs2XNYP.js";
import "./InputError-CBvD_6aD.js";
import "./ConfirmModal-Bqr5rb3_.js";
import "@fullcalendar/react";
import "@fullcalendar/daygrid";
import "@fullcalendar/interaction";
import "@fullcalendar/core/locales/id";
import "./SelectInput-inadq0Bq.js";
import "./Pagination-CRnq7q04.js";
vi.mock("@inertiajs/react", () => ({
  Head: ({ title }) => /* @__PURE__ */ jsx("div", { "data-testid": "head", children: title }),
  Link: ({ children }) => /* @__PURE__ */ jsx("a", { children }),
  usePage: () => ({
    props: {
      auth: {
        user: { name: "Test User" }
      }
    }
  })
}));
vi.mock("@/Layouts/AuthenticatedLayout", () => ({
  default: ({ children, header }) => /* @__PURE__ */ jsxs("div", { "data-testid": "layout", children: [
    /* @__PURE__ */ jsx("div", { "data-testid": "header", children: header }),
    children
  ] })
}));
vi.mock("@/Components/MentorScheduleTable", () => ({
  default: () => /* @__PURE__ */ jsx("div", { "data-testid": "mentor-schedule-table", children: "Schedule Table" })
}));
vi.mock("@/Components/Dashboard/ScheduleTab", () => ({
  default: () => /* @__PURE__ */ jsx("div", { "data-testid": "schedule-tab", children: "Schedule Tab" })
}));
vi.mock("@/Components/Dashboard/PhotoRequestsTab", () => ({
  default: () => /* @__PURE__ */ jsx("div", { "data-testid": "photo-requests-tab", children: "Photo Requests Tab" })
}));
vi.mock("@/Utils/lang", () => ({
  __: (key) => key
}));
describe("Dashboard Component", () => {
  const validUser = {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    profile_photo_url: null,
    profile_photo_status: "active"
  };
  it("renders correctly with valid admin user", () => {
    render(/* @__PURE__ */ jsx(Dashboard, { auth: { user: validUser }, schedules: [], photoRequests: [] }));
    expect(screen.getByTestId("layout")).toBeInTheDocument();
    expect(screen.getByText("Admin User")).toBeInTheDocument();
    expect(screen.getByText("Overview")).toBeInTheDocument();
  });
  it("handles user with missing name (uses fallback)", () => {
    const userWithoutName = {
      ...validUser,
      name: null,
      first_name: null
    };
    render(/* @__PURE__ */ jsx(Dashboard, { auth: { user: userWithoutName }, schedules: [], photoRequests: [] }));
    expect(screen.getByText("User")).toBeInTheDocument();
  });
  it("handles user with missing role (defaults to participant)", () => {
    const userWithoutRole = {
      ...validUser,
      role: null
      // This caused charAt error before fix
    };
    render(/* @__PURE__ */ jsx(Dashboard, { auth: { user: userWithoutRole }, schedules: [], photoRequests: [] }));
    expect(screen.getByTestId("layout")).toBeInTheDocument();
  });
  it("handles user with non-string role (converts to string)", () => {
    const userWithObjRole = {
      ...validUser,
      role: 123
      // This caused charAt error before fix
    };
    render(/* @__PURE__ */ jsx(Dashboard, { auth: { user: userWithObjRole }, schedules: [], photoRequests: [] }));
    expect(screen.getByTestId("layout")).toBeInTheDocument();
  });
  it("returns null if auth.user is missing", () => {
    const { container } = render(/* @__PURE__ */ jsx(Dashboard, { auth: { user: null }, schedules: [], photoRequests: [] }));
    expect(container).toBeEmptyDOMElement();
  });
});
