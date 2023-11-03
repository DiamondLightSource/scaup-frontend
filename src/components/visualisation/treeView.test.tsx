import { TreeView } from "@/components/visualisation/treeView";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Tree View", () => {
  it("should render root", () => {
    render(<TreeView data={[{ id: "1", name: "Test", data: {} }]} />);

    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("should render remove/edit buttons by default", () => {
    render(<TreeView data={[{ id: "1", name: "Test", data: {} }]} />);

    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View" })).toBeInTheDocument();
  });

  it("should not render remove button if specified", () => {
    render(<TreeView data={[{ id: "1", isUndeletable: true, name: "Test", data: {} }]} />);

    expect(screen.queryByRole("button", { name: "Remove" })).not.toBeInTheDocument();
  });

  it("should not render view button if specified", () => {
    render(<TreeView data={[{ id: "1", isNotViewable: true, name: "Test", data: {} }]} />);

    expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
  });

  it("should not render remove button in parents with children", () => {
    render(
      <TreeView
        data={[
          { id: "1", name: "Parent", data: {}, children: [{ id: "2", name: "Child", data: {} }] },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Parent" }));

    expect(screen.getAllByRole("button", { name: "Remove" })).toHaveLength(1);
  });

  it("should not render remove button if component is set to read only mode", () => {
    render(<TreeView readOnly={true} data={[{ id: "1", name: "Parent", data: {} }]} />);

    expect(screen.queryByRole("button", { name: "Remove" })).not.toBeInTheDocument();
  });

  it("should render item tag", () => {
    render(<TreeView data={[{ id: "1", name: "Test", tag: "Tag Value", data: {} }]} />);

    expect(screen.getByText("Tag Value")).toBeInTheDocument();
  });

  it("should render item tag in item with children", () => {
    render(
      <TreeView
        data={[
          {
            id: "1",
            name: "Test",
            tag: "Tag Value",
            data: { location: 7 },
            children: [{ id: "2", name: "Test", data: {} }],
          },
        ]}
      />,
    );

    expect(screen.getByText("Tag Value")).toBeInTheDocument();
  });
});
