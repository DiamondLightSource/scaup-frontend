import { DynamicForm } from "@/components/input/form";
import { renderWithForm } from "@/utils/test-utils";
import { fireEvent, screen } from "@testing-library/react";

describe("Dynamic Form", () => {
  it("should render form with all fields generated dynamically", () => {
    renderWithForm(<DynamicForm formType='sample' />);

    expect(screen.getByText("Foil")).toBeInTheDocument();
    expect(screen.getByText("Mesh")).toBeInTheDocument();
    expect(screen.getByText("Film")).toBeInTheDocument();
  });

  it("should render options for dropdown based on dynamic data if available", () => {
    renderWithForm(
      <DynamicForm
        formType='dewar'
        prepopData={{
          dewars: [
            { dewarRegistryId: 123, facilityCode: "BI-99-9999" },
            { dewarRegistryId: 456, facilityCode: "BI-88-8888" },
          ],
        }}
      />,
    );

    expect(screen.getByText("BI-99-9999")).toBeInTheDocument();
    expect(screen.getByText("BI-88-8888")).toBeInTheDocument();
  });

  it("should watch provided fields", () => {
    const watchCallback = vi.fn();
    renderWithForm(<DynamicForm formType='puck' onWatchedUpdated={watchCallback} />);

    fireEvent.change(screen.getByRole("combobox", { name: "Type" }), {
      target: { value: "falconTube" },
    });

    expect(watchCallback).toHaveBeenCalledWith({
      comments: "",
      name: "",
      registeredContainer: "",
      type: "falconTube",
    });
  });

  it("should render passed form if form is dynamic form entry array", () => {
    renderWithForm(<DynamicForm formType={[{ id: "name", label: "Name", type: "text" }]} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  it("should not render anything if passed invalid form type", () => {
    // @ts-expect-error
    renderWithForm(<DynamicForm formType='doesnotexist' />);
  });
});
