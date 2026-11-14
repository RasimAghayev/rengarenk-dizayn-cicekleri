import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RegisterForm from "@/features/auth/components/RegisterForm";

const { signUpMock, toastSpy } = vi.hoisted(() => ({
  signUpMock: vi.fn(),
  toastSpy: vi.fn(),
}));

vi.mock("@/hooks/use-user", () => ({
  useUser: () => ({
    user: null,
    session: null,
    loading: false,
    signIn: vi.fn(),
    signUp: signUpMock,
    signOut: vi.fn(),
    hasPermission: vi.fn(),
  }),
}));

vi.mock("@/hooks/use-toast", () => ({
  toast: toastSpy,
  useToast: () => ({ toast: toastSpy, dismiss: vi.fn(), toasts: [] }),
}));

function renderRegisterForm() {
  return render(
    <MemoryRouter initialEntries={["/register"]}>
      <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<div>login page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

function fillForm({
  password = "sup3rSecret",
  confirmPassword = "sup3rSecret",
  email = "new.user@example.com",
} = {}) {
  fireEvent.change(screen.getByLabelText("First Name"), {
    target: { value: "New" },
  });
  fireEvent.change(screen.getByLabelText("Last Name"), {
    target: { value: "User" },
  });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: email } });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: password },
  });
  fireEvent.change(screen.getByLabelText("Confirm Password"), {
    target: { value: confirmPassword },
  });
}

function submit() {
  fireEvent.click(screen.getByRole("button", { name: "Register" }));
}

beforeEach(() => {
  signUpMock.mockReset();
  toastSpy.mockReset();
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  signUpMock.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
});

describe("RegisterForm - registration cannot self-assign the admin role", () => {
  it("TC_AUTH_REGISTER_001 always submits role 'client' in the sign-up metadata", async () => {
    renderRegisterForm();
    fillForm();
    submit();

    await waitFor(() => expect(signUpMock).toHaveBeenCalledTimes(1));

    const [email, password, metadata] = signUpMock.mock.calls[0];
    expect(email).toBe("new.user@example.com");
    expect(password).toBe("sup3rSecret");
    expect(metadata).toEqual({
      first_name: "New",
      last_name: "User",
      role: "client",
    });
    expect(JSON.stringify(metadata)).not.toContain("admin");
  });

  it("TC_AUTH_REGISTER_002 redirects to the login page after a successful sign-up", async () => {
    renderRegisterForm();
    fillForm();
    submit();

    await waitFor(() =>
      expect(screen.getByText("login page")).toBeTruthy(),
    );
    expect(toastSpy).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Registration successful" }),
    );
  });

  it("TC_AUTH_REGISTER_003 blocks submission when the passwords differ", async () => {
    renderRegisterForm();
    fillForm({ confirmPassword: "different" });
    submit();

    expect(signUpMock).not.toHaveBeenCalled();
    expect(toastSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Passwords don't match",
        variant: "destructive",
      }),
    );
  });

  it("TC_AUTH_REGISTER_004 surfaces a backend sign-up error without navigating", async () => {
    signUpMock.mockResolvedValue({
      data: null,
      error: { message: "User already registered" },
    });

    renderRegisterForm();
    fillForm();
    submit();

    await waitFor(() =>
      expect(toastSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Registration failed",
          description: "User already registered",
          variant: "destructive",
        }),
      ),
    );
    expect(screen.queryByText("login page")).toBeNull();
  });

  it("TC_AUTH_REGISTER_005 recovers when the sign-up call throws", async () => {
    signUpMock.mockRejectedValue(new Error("socket closed"));

    renderRegisterForm();
    fillForm();
    submit();

    await waitFor(() =>
      expect(toastSpy).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Registration failed" }),
      ),
    );
    expect(screen.queryByText("login page")).toBeNull();
  });
});