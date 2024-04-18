import { ShipmentCreationForm } from "@/app/proposals/[proposalId]/pageContent";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import mockRouter from "next-router-mock";

const baseShipment = { id: 1, proposalReference: "cm00001", name: "", creationDate: "" };

describe("Proposal Page Content", () => {
  it("should redirect to new shipment when created", async () => {
    render(<ShipmentCreationForm proposalId='cm1234' />);

    fireEvent.change(screen.getByRole("textbox", { name: "Name" }), {
      target: { value: "New Name" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create" }));
    await waitFor(() => expect(mockRouter.pathname).toBe("/proposals/cm1234/shipments/123/edit"));
  });
});
