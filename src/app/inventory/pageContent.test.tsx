import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { TopLevelContainerCreationForm } from "./pageContent";
import mockRouter from "next-router-mock";

describe("Proposal Page Content", () => {
  it("should redirect to new top level container when created", async () => {
    render(<TopLevelContainerCreationForm />);

    fireEvent.change(screen.getByRole("textbox", { name: "Name" }), {
      target: { value: "New Name" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create" }));
    await waitFor(() => expect(mockRouter.pathname).toBe("/inventory/1/dewar/1"));
  });
});
