import "@testing-library/jest-dom";

import { server } from "@/mocks/server";

const pathnameMock = jest.fn(() => "/");
export const toastMock = jest.fn();

jest.mock("next/navigation", () => ({ ...require("next-router-mock"), usePathname: pathnameMock }));
window.scrollTo = () => {};
window.structuredClone = (x: any) => JSON.parse(JSON.stringify(x));

process.env.REACT_APP_API_URL = "http://localhost/api";

beforeEach(() => server.listen());
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
  toastMock.mockClear();
});

export const mockSession = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  data: { name: "admin", accessToken: "a" },
  user: {},
};

jest.mock("next-auth/react", () => {
  const originalModule = jest.requireActual("next-auth/react");
  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => ({
      data: mockSession,
      status: "authenticated",
    })),
  };
});

// Reference: https://github.com/nextauthjs/next-auth/discussions/4185#discussioncomment-2397318
// We also need to mock the whole next-auth package, since it's used in
// our various pages via the `export { getServerSideProps }` function.
jest.mock("next-auth/next", () => ({
  __esModule: true,
  default: jest.fn(),
  getServerSession: jest.fn(
    () =>
      new Promise((resolve) => {
        resolve({
          expiresIn: undefined,
          loggedInAt: undefined,
          someProp: "someString",
        });
      }),
  ),
}));

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  createStandaloneToast: () => ({ toast: toastMock }),
  useToast: () => toastMock,
}));
