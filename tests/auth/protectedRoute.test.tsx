import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "@/App";

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

function navigateTo(path: string) {
  window.history.pushState({}, "", path);
}

beforeEach(() => {
  authState.user = null;
  authState.loading = false;
});

describe("ProtectedRoute - admin route authorization", () => {
  it("TC_AUTH_PROTECTEDROUTE_001 redirects an anonymous visitor to /login", async () => {
    navigateTo("/admin");

    render(<App />);

    await waitFor(() => expect(screen.getByText("Welcome Back")).toBeTruthy());
    expect(window.location.pathname).toBe("/login");
  });

  it("TC_AUTH_PROTECTEDROUTE_002 renders the admin dashboard for an admin user", async () => {
    authState.user = {
      id: "u-admin",
      email: "admin@example.com",
      user_metadata: { role: "admin" },
    };
    navigateTo("/admin");

    render(<App />);

    await waitFor(() =>
      expect(screen.getByText("Administration Dashboard")).toBeTruthy(),
    );
    expect(window.location.pathname).toBe("/admin");
  });

  it("TC_AUTH_PROTECTEDROUTE_003 denies a signed-in non-admin and lands on the home page", async () => {
    authState.user = {
      id: "u-client",
      email: "client@example.com",
      user_metadata: { role: "client" },
    };
    navigateTo("/admin");

    render(<App />);

    // The guard redirects to /login; LoginPage then bounces the still-signed-in
    // user to "/" (src/features/auth/pages/LoginPage.tsx). Either way the
    // protected page must never render.
    await waitFor(() => expect(window.location.pathname).toBe("/"));
    expect(screen.queryByText("Administration Dashboard")).toBeNull();
  });

  it("TC_AUTH_PROTECTEDROUTE_004 does not grant access through a dev-mode flag", async () => {
    // Vitest runs with import.meta.env.DEV === true; the guard must not use it.
    expect(import.meta.env.DEV).toBe(true);

    authState.user = null;
    navigateTo("/admin/settings");

    render(<App />);

    await waitFor(() => expect(screen.getByText("Welcome Back")).toBeTruthy());
    expect(window.location.pathname).toBe("/login");
  });

  it("TC_AUTH_PROTECTEDROUTE_005 shows a loading state while the session is unknown", async () => {
    authState.user = null;
    authState.loading = true;
    navigateTo("/admin");

    const { container } = render(<App />);

    expect(container.querySelector(".animate-spin")).toBeTruthy();
    expect(window.location.pathname).toBe("/admin");
  });
});