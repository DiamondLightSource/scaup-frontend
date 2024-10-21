import { fireEvent, screen } from "@testing-library/react";
import { renderWithForm } from "@/utils/test-utils";
import { EditableDropdown } from "./EditableDropdown";
import { Controller } from "react-hook-form";

export const values = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
];

describe("Editable Dropdown", () => {
  it("should display textbox if 'other' option is chosen", async () => {
    renderWithForm(
      <Controller
        name='test'
        render={({ field: { onChange, value } }) => (
          <EditableDropdown id='1' values={values} onChange={onChange} selectedValue={value} />
        )}
      />,
    );

    const selectComponent = screen.getByRole("combobox");
    fireEvent.change(selectComponent, { target: { value: "other" } });

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should not display textbox if valid dropdown item is selected", async () => {
    renderWithForm(
      <Controller
        name='test'
        render={({ field: { onChange } }) => (
          <EditableDropdown id='1' values={values} onChange={onChange} selectedValue='1' />
        )}
      />,
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("should fire callback with dropdown value if valid item is selected", async () => {
    const changeCallback = vi.fn();
    renderWithForm(
      <Controller
        name='test'
        render={() => (
          <EditableDropdown id='1' values={values} onChange={changeCallback} selectedValue='1' />
        )}
      />,
    );

    const selectComponent = screen.getByRole("combobox");
    fireEvent.change(selectComponent, { target: { value: "2" } });

    expect(changeCallback).toHaveBeenCalledWith("2");
  });

  it("should fire callback with textbox value if 'other' is selected", async () => {
    const changeCallback = vi.fn();
    renderWithForm(
      <Controller
        name='test'
        render={() => (
          <EditableDropdown
            id='1'
            values={values}
            onChange={changeCallback}
            selectedValue='other'
          />
        )}
      />,
    );

    const selectComponent = screen.getByRole("textbox");
    fireEvent.change(selectComponent, { target: { value: "test-text-123" } });

    expect(changeCallback).toHaveBeenCalledWith("test-text-123");
  });
});
