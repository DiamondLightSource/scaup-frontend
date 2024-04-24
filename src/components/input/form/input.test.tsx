import { DynamicFormInput, getIndicatorSymbol } from "@/components/input/form/input";
import { renderWithForm } from "@/utils/test-utils";
import { screen } from "@testing-library/react";

describe("Dynamic Form Field", () => {
  it("should render label", () => {
    renderWithForm(<DynamicFormInput id='1' label='Mesh' type='text' />);

    expect(screen.getByText("Mesh")).toBeInTheDocument();
  });

  it("should render hint", () => {
    renderWithForm(<DynamicFormInput id='1' label='Mesh' type='text' hint='hint' />);

    expect(screen.getByText(/hint/i)).toBeInTheDocument();
  });

  it("should render disabled dropdown if no values are provided", () => {
    renderWithForm(
      <DynamicFormInput
        id='1'
        label='Mesh'
        type='dropdown'
        values={[{ label: "1", value: "1" }]}
      />,
    );

    expect(screen.getByRole("combobox")).toHaveProperty("disabled");
  });

  it("should render dropdown with value", () => {
    renderWithForm(
      <DynamicFormInput
        id='1'
        label='Mesh'
        type='dropdown'
        values={[{ label: "1", value: "1" }]}
      />,
    );

    expect(screen.getByRole("combobox")).toHaveDisplayValue("1");
  });

  it("should render checkbox", () => {
    renderWithForm(<DynamicFormInput id='1' label='Mesh' type='checkbox' />);

    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("should render separator", () => {
    renderWithForm(<DynamicFormInput id='1' label='Separator' type='separator' />);

    expect(screen.getByText(/separator/i)).toBeInTheDocument();
  });

  it("should render indicator icon if provided", () => {
    renderWithForm(
      <DynamicFormInput
        id='1'
        label='Separator'
        type='indicatorDropdown'
        values={[{ label: "1", value: "1", extra: "RED" }]}
      />,
    );

    expect(screen.getByText(/🔴/i)).toBeInTheDocument();
  });
});

describe("Indicator Provider", () => {
  it("should return symbol if exists in map", () => {
    expect(getIndicatorSymbol("RED")).toBe("🔴");
  });

  it("should return original value if not in map", () => {
    expect(getIndicatorSymbol("NOT RED")).toBe("(NOT RED)");
  });
});
