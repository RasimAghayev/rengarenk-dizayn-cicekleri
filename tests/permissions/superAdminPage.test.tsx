import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SuperAdminPage from "@/features/permissions/pages/SuperAdminPage";
import {
  recordedCalls,
  resetSupabaseMock,
  setQueryResponder,
  tableRowsResponder,
} from "../helpers/supabaseMock";

const { authState } = vi.hoisted(() => ({
  authState: { user: null as unknown, loading: false },
}));

vi.mock("@/hooks/use-user", () => ({
  useUser: () => ({
    user: authState.user,
    session: null,
    loading: authState.loading,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    hasPermission: vi.fn(),
  }),
}));

vi.mock("@/integrations/supabase/client", async () => {
  const helper = await import("../helpers/supabaseMock");
  return { supabase: helper.supabaseMock };
});

function renderPage() {
  return render(
    <MemoryRouter>
      <SuperAdminPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  resetSupabaseMock();
  authState.loading = false;
  authState.user = {
    id: "u-admin",
    email: "admin@example.com",
    user_metadata: { role: "admin" },
  };
});

describe("SuperAdminPage - dashboard smoke test", () => {
  it("TC_SUPERADMIN_SMOKE_001 renders the dashboard with the real Supabase stat counts", async () => {
    setQueryResponder(
      tableRowsResponder({
        profiles: Array.from({ length: 12 }, (_, i) => ({ id: `p${i}` })),
        product_roles: Array.from({ length: 5 }, (_, i) => ({ id: `r${i}` })),
        product_permissions: Array.from({ length: 7 }, (_, i) => ({
          id: `perm${i}`,
        })),
        user_product_roles: Array.from({ length: 9 }, (_, i) => ({
          id: `a${i}`,
        })),
      }),
    );

    renderPage();

    expect(
      await screen.findByText("Administration Dashboard"),
    ).toBeTruthy();
    await waitFor(() => expect(screen.getByText("12")).toBeTruthy());
    expect(screen.getByText("5")).toBeTruthy();
    expect(screen.getByText("7")).toBeTruthy();
    expect(screen.getByText("9")).toBeTruthy();

    const tables = recordedCalls.map((call) => call.table);
    expect(tables).toEqual(
      expect.arrayContaining([
        "profiles",
        "product_roles",
        "product_permissions",
        "user_product_roles",
      ]),
    );
    expect(screen.getByRole("tab", { name: /product roles/i })).toBeTruthy();
    expect(screen.getByRole("tab", { name: /^permissions$/i })).toBeTruthy();
    expect(screen.getByRole("tab", { name: /user assignments/i })).toBeTruthy();
  });

  it("TC_SUPERADMIN_SMOKE_002 renders the restricted-access notice", async () => {
    setQueryResponder(() => ({ data: [], error: null }));

    renderPage();

    expect(await screen.findByText("Admin Access Only")).toBeTruthy();
    expect(
      screen.getByText(
        "This area is restricted to super administrators only. Changes made here affect the entire system.",
      ),
    ).toBeTruthy();
  });

  it("TC_SUPERADMIN_SMOKE_003 redirects a non-admin to the home page", async () => {
    authState.user = {
      id: "u-client",
      email: "client@example.com",
      user_metadata: { role: "client" },
    };

    renderPage();

    await waitFor(() =>
      expect(screen.getByText("Loading admin panel...")).toBeTruthy(),
    );
    expect(screen.queryByText("Administration Dashboard")).toBeNull();
  });
});