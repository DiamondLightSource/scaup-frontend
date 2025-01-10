import { TreeView } from "@/components/visualisation/treeView";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Tree View", () => {
  it("should render root", () => {
    render(<TreeView data={[{ id: "1", name: "Test", data: {} }]} />);

    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("should render remove/edit buttons by default", () => {
    render(<TreeView data={[{ id: "1", name: "Test", data: {} }]} />);

    expect(screen.getByText("Remove")).toBeInTheDocument();
    expect(screen.getByLabelText(/view/i)).toBeInTheDocument();
  });

  it("should not render remove button if specified", () => {
    render(<TreeView data={[{ id: "1", isUndeletable: true, name: "Test", data: {} }]} />);

    expect(screen.queryByText("Remove")).not.toBeInTheDocument();
  });

  it("should not apply viewable styling if item is not viewable", () => {
    render(<TreeView data={[{ id: "1", isNotViewable: true, name: "Test", data: {} }]} />);

    expect(screen.queryByLabelText(/view/i)).not.toBeInTheDocument();
  });

  it("should not render remove button in parents with children", () => {
    render(
      <TreeView
        data={[
          { id: "1", name: "Parent", data: {}, children: [{ id: "2", name: "Child", data: {} }] },
        ]}
      />,
    );

    fireEvent.click(screen.getByText(/parent/i));

    expect(screen.getAllByText("Remove")).toHaveLength(1);
  });

  it("should not render remove button if component is set to read only mode", () => {
    render(<TreeView readOnly={true} data={[{ id: "1", name: "Parent", data: {} }]} />);

    expect(screen.queryByText("Remove")).not.toBeInTheDocument();
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

  it("should find and render selected item", () => {
    const selectedItem = { id: "2", name: "Test 2", data: {} };
    render(
      <TreeView
        selectedItem={selectedItem}
        data={[
          {
            id: "1",
            name: "Test 1",
            tag: "Tag Value",
            data: { location: 7 },
            children: [selectedItem],
          },
        ]}
      />,
    );

    expect(screen.getByLabelText("View Test 2")).toHaveAttribute("aria-current", "true");
  });

  it("should display item type if available", () => {
    render(<TreeView data={[{ id: "1", name: "Test", data: { type: "someType" } }]} />);

    expect(screen.getByText("Some Type")).toBeInTheDocument();
  });
});
