import { server } from "@/mocks/server";

const pathnameMock = jest.fn(() => "/");

jest.mock("next/navigation", () => ({ ...require("next-router-mock"), usePathname: pathnameMock }));
window.scrollTo = () => {};
window.structuredClone = (x: any) => JSON.parse(JSON.stringify(x));

beforeEach(() => server.listen());
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});
