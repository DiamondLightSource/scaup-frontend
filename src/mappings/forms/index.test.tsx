import { DynamicForm } from "@/mappings/forms";
import { renderWithForm } from "@/utils/test-utils";
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";

describe("Dynamic Form", () => {
  it("should render form with all fields generated dynamically", () => {
    renderWithForm(<DynamicForm formType='sample' />);

    expect(screen.getByText("Foil")).toBeInTheDocument();
    expect(screen.getByText("Mesh")).toBeInTheDocument();
    expect(screen.getByText("Ratio")).toBeInTheDocument();
    expect(screen.getByText("Film")).toBeInTheDocument();
  });
});
