import { BaseShipmentItem } from "@/mappings/pages";
import { renderWithForm } from "@/utils/test-utils";
import { screen } from "@testing-library/react";
import { DynamicFormView } from "./formView";

const sampleData: BaseShipmentItem = {
  type: "sample",
  mesh: 1,
  hole: 1,
  foil: "Au-flat",
  film: 1,
};

describe("Dynamic Form View", () => {
  it("should render labels as mapped in form schema", () => {
    renderWithForm(<DynamicFormView formType='sample' data={sampleData} />);

    expect(screen.getByText("Foil")).toBeInTheDocument();
    expect(screen.getByText("Mesh")).toBeInTheDocument();
    expect(screen.getByText("Film")).toBeInTheDocument();
  });

  it("should not render items not described in form schema", () => {
    renderWithForm(<DynamicFormView formType='sample' data={sampleData} />);

    expect(screen.queryByText("type")).not.toBeInTheDocument();
  });

  it("should render values", () => {
    renderWithForm(<DynamicFormView formType='sample' data={sampleData} />);

    expect(screen.getByText(/au-flat/i)).toBeInTheDocument();
  });

  it("should render booleans as a yes/no", () => {
    renderWithForm(
      <DynamicFormView formType='gridBox' data={{ type: "gridBox", requestedReturn: true }} />,
    );

    expect(screen.getByText(/yes/i)).toBeInTheDocument();
  });
});
