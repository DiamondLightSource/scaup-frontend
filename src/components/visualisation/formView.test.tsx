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
      <DynamicFormView formType='gridBox' data={{ type: "gridBox", fibSession: false }} />,
    );

    expect(screen.getByText(/no/i)).toBeInTheDocument();
  });

  it("should render custom forms", () => {
    renderWithForm(
      <DynamicFormView
        formType={[{ label: "Label", id: "itemId", type: "text" }]}
        data={{ itemId: "Item Value" }}
      />,
    );

    expect(screen.getByText(/item value/i)).toBeInTheDocument();
    expect(screen.getByText(/label/i)).toBeInTheDocument();
  });

  it("should obtain 'human' values from prepopulation data if available", () => {
    renderWithForm(
      <DynamicFormView
        formType={[
          {
            label: "Label",
            id: "itemId",
            type: "dropdown",
            values: { $ref: { parent: "#/a/b", map: { value: "value", label: "label" } } },
          },
        ]}
        data={{ itemId: "1" }}
        prepopData={{
          a: {
            b: [
              { value: "1", label: "a human value" },
              { value: "2", label: "not used" },
            ],
          },
        }}
      />,
    );

    expect(screen.getByText(/a human value/i)).toBeInTheDocument();
    expect(screen.getByText(/label/i)).toBeInTheDocument();
  });

  it("should display original value if field is dropdown, there is a pointer, but no prepop. data", () => {
    renderWithForm(
      <DynamicFormView
        formType={[
          {
            label: "Label",
            id: "itemId",
            type: "dropdown",
            values: { $ref: { parent: "#/a", map: { value: "value", label: "label" } } },
          },
        ]}
        data={{ itemId: "a random id" }}
      />,
    );

    expect(screen.getByText(/a random id/i)).toBeInTheDocument();
    expect(screen.getByText(/label/i)).toBeInTheDocument();
  });
});
