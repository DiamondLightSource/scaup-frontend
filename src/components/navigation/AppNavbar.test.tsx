import { render, screen } from "@testing-library/react";
import { AppNavbar } from "./AppNavbar";

const mocks = vi.hoisted(() => {
  return {
    permissionsMock: vi.fn(() => ({ permissions: ["em_admin"] })),
  };
});

vi.mock("next-auth/next", () => ({ getServerSession: mocks.permissionsMock }));

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

  it("should not display inventory link if user is not eBIC staff", async () => {
    mocks.permissionsMock.mockReturnValueOnce({ permissions: [""] });
    render(await AppNavbar());

    expect(screen.queryByText(/inventory/i)).not.toBeInTheDocument();
  });

  it("should display inventory link if user is eBIC staff", async () => {
    render(await AppNavbar());

    expect(screen.getByText(/inventory/i)).toBeInTheDocument();
  });
});
