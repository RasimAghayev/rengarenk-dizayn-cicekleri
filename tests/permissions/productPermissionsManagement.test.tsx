import { render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductPermissionsManagement from "@/features/permissions/components/ProductPermissionsManagement";
import {
  recordedCalls,
  resetSupabaseMock,
  setQueryResponder,
} from "../helpers/supabaseMock";

const { toastSpy } = vi.hoisted(() => ({ toastSpy: vi.fn() }));

vi.mock("@/hooks/use-toast", () => ({
  toast: toastSpy,
  useToast: () => ({ toast: toastSpy, dismiss: vi.fn(), toasts: [] }),
}));

vi.mock("@/integrations/supabase/client", async () => {
  const helper = await import("../helpers/supabaseMock");
  return { supabase: helper.supabaseMock };
});

const permissionRows = [
  {
    id: "p1",
    name: "product.create",
    description: "Create products",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "p2",
    name: "product.read",
    description: null,
    created_at: "2026-01-02T00:00:00Z",
  },
];

function renderPanel() {
  return render(
    <MemoryRouter>
      <ProductPermissionsManagement />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  resetSupabaseMock();
  toastSpy.mockReset();
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  setQueryResponder((table) => ({
    data: table === "product_permissions" ? permissionRows : [],
    error: null,
  }));
});

describe("ProductPermissionsManagement - backend-wired CRUD panel", () => {
  it("TC_PRODUCTPERMS_SMOKE_001 lists the permissions returned by Supabase", async () => {
    renderPanel();

    expect(await screen.findByText("product.create")).toBeTruthy();
    expect(screen.getByText("product.read")).toBeTruthy();
    expect(screen.getByText("Create products")).toBeTruthy();
    expect(screen.getByText("N/A")).toBeTruthy();
    expect(recordedCalls).toContainEqual({
      table: "product_permissions",
      operation: "select",
    });
    expect(screen.getByRole("button", { name: /add new permission/i })).toBeTruthy();
  });

  it("TC_PRODUCTPERMS_SMOKE_002 shows the empty state when there are no permissions", async () => {
    setQueryResponder(() => ({ data: [], error: null }));

    renderPanel();

    expect(
      await screen.findByText(/No permissions found/i),
    ).toBeTruthy();
  });

  it("TC_PRODUCTPERMS_ERROR_001 surfaces a destructive toast when the fetch fails", async () => {
    setQueryResponder(() => ({
      data: null,
      error: { message: "permission denied for table product_permissions" },
    }));

    renderPanel();

    await waitFor(() =>
      expect(toastSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error fetching permissions",
          variant: "destructive",
        }),
      ),
    );
  });

  it("TC_PRODUCTPERMS_DELETE_001 refuses to delete a permission that is still assigned to a role", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    setQueryResponder((table) => ({
      data:
        table === "product_permissions"
          ? permissionRows
          : table === "product_role_permissions"
            ? [{ id: "rp1" }]
            : [],
      error: null,
    }));

    const { container } = renderPanel();
    const row = (await screen.findByText("product.create")).closest("tr");
    expect(row).toBeTruthy();

    const [, deleteButton] = within(row as HTMLElement).getAllByRole("button");
    deleteButton.click();

    await waitFor(() =>
      expect(toastSpy).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Cannot Delete Permission" }),
      ),
    );
    expect(
      recordedCalls.filter(
        (call) =>
          call.table === "product_permissions" && call.operation === "delete",
      ),
    ).toHaveLength(0);
    expect(container.textContent).toContain("product.create");
  });

  it("TC_PRODUCTPERMS_DELETE_002 does not touch Supabase when the confirmation is dismissed", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);

    renderPanel();
    const row = (await screen.findByText("product.create")).closest("tr");
    const [, deleteButton] = within(row as HTMLElement).getAllByRole("button");

    recordedCalls.length = 0;
    deleteButton.click();

    expect(recordedCalls).toHaveLength(0);
    expect(toastSpy).not.toHaveBeenCalled();
  });
});