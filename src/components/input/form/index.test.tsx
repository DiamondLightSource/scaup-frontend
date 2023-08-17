import { DynamicForm } from "@/components/input/form";
import { renderWithForm } from "@/utils/test-utils";
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";

describe("Dynamic Form", () => {
  it("should render form with all fields generated dynamically", () => {
    renderWithForm(<DynamicForm formType='sample' />);

    expect(screen.getByText("Foil")).toBeInTheDocument();
    expect(screen.getByText("Mesh")).toBeInTheDocument();
    expect(screen.getByText("Hole")).toBeInTheDocument();
    expect(screen.getByText("Film")).toBeInTheDocument();
  });

  it("should render options for dropdown based on dynamic data if available", () => {
    renderWithForm(
      <DynamicForm
        formType='dewar'
        prepopData={{
          dewar: {
            codes: [
              { dewarId: 123, dewarCode: "BI-99-9999" },
              { dewarId: 456, dewarCode: "BI-88-8888" },
            ],
          },
        }}
      />,
    );

    expect(screen.getByText("BI-99-9999")).toBeInTheDocument();
    expect(screen.getByText("BI-88-8888")).toBeInTheDocument();
  });
});
