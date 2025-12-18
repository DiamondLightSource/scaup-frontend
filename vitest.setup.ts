
import { setLocationMock } from "@/components/containers/__mocks__";
import { server } from "@/mocks/server";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";

const pathnameMock = vi.fn(() => "/");
export const toastMock = vi.fn();

vi.mock("next/cache", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return { ...actual, updateTag: () => {}, revalidatePath: () => {} };
});

vi.mock("next/headers", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return { ...actual, cookies: async () => new Map(), headers: async () => new Map()};
});

vi.mock("next/navigation", () => ({
  ...require("next-router-mock"),
  usePathname: pathnameMock,
  redirect: vi.fn(),
}));
window.scrollTo = () => {};
window.print = () => {};

process.env.NEXT_PUBLIC_API_URL = "http://localhost/api";
process.env.SERVER_API_URL = "http://localhost/api";
process.env.PATO_URL = "https://pato.ac.uk";

beforeEach(() => server.listen());

afterEach(() => {
  server.resetHandlers();
  toastMock.mockClear();
  setLocationMock.mockClear();
  cleanup();
});

afterAll(() => {
  server.close();
});

vi.mock("@chakra-ui/react", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    createStandaloneToast: () => ({ toast: toastMock }),
    useToast: () => toastMock,
  };
});
