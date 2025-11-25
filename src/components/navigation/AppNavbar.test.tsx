import { render, screen } from "@testing-library/react";
import { AppNavbar } from "./AppNavbar";

const mocks = vi.hoisted(() => {
  return {
    getSessionMock: vi.fn(() => ({
      user: { fedid: "abc1234", permissions: ["em_admin"], name: "Foo" },
    })),
  };
});

vi.mock("@/utils/auth", () => ({
  auth: { api: { getSession: mocks.getSessionMock } },
}));

describe("App Navbar", () => {
  it.each([{ deployType: "beta" }, { deployType: "dev" }])(
    "should display $deployType in phase banner when deploy type is $deployType",
    async ({ deployType }) => {
      process.env.DEPLOY_TYPE = deployType;
      render(await AppNavbar());

      expect(screen.getByText(deployType.toUpperCase())).toBeInTheDocument();
    },
  );

  it("should not display phase banner if deploy type is production", async () => {
    process.env.DEPLOY_TYPE = "production";
    render(await AppNavbar());

    expect(screen.queryByText(/still in testing/i)).not.toBeInTheDocument();
  });

  it("should display inventory link if user is eBIC staff", async () => {
    render(await AppNavbar());

    expect(screen.getByText(/inventory/i)).toBeInTheDocument();
  });

  it("should not display inventory link if user is not eBIC staff", async () => {
    mocks.getSessionMock.mockReturnValueOnce({
      user: { fedid: "abc1234", permissions: [], name: "Foo" },
    });
    render(await AppNavbar());

    expect(screen.queryByText(/inventory/i)).not.toBeInTheDocument();
  });
});
