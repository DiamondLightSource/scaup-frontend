import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { TreeView } from "./treeView";

describe("Tree View", () => {
  it("should render root", () => {
    render(<TreeView data={[{ id: "1", label: "Test", data: {} }]} />);

    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("should render remove/edit buttons by default", () => {
    render(<TreeView data={[{ id: "1", label: "Test", data: {} }]} />);

    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });

  it("should not render remove button if specified", () => {
    render(<TreeView data={[{ id: "1", isUndeletable: true, label: "Test", data: {} }]} />);

    expect(screen.queryByRole("button", { name: "Remove" })).not.toBeInTheDocument();
  });

  it("should not render edit button if specified", () => {
    render(<TreeView data={[{ id: "1", isImmutable: true, label: "Test", data: {} }]} />);

    expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
  });

  it("should not render remove button in parents with children", () => {
    render(
      <TreeView
        data={[
          { id: "1", label: "Parent", data: {}, children: [{ id: "2", label: "Child", data: {} }] },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Parent" }));

    expect(screen.getAllByRole("button", { name: "Remove" })).toHaveLength(1);
  });

  it("should render item tag", () => {
    render(<TreeView data={[{ id: "1", label: "Test", tag: "Tag Value", data: {} }]} />);

    expect(screen.getByText("Tag Value")).toBeInTheDocument();
  });

  it("should render item tag in item with children", () => {
    render(
      <TreeView
        data={[
          {
            id: "1",
            label: "Test",
            tag: "Tag Value",
            data: { position: 7 },
            children: [{ id: "2", label: "Test", data: {} }],
          },
        ]}
      />,
    );

    expect(screen.getByText("Tag Value")).toBeInTheDocument();
  });
});
