import { GridBox } from "@/components/containers/gridBox";
import { initialState } from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem } from "@/mappings/pages";
import { server } from "@/mocks/server";
import { Item } from "@/utils/client/item";
import { nameValidation } from "@/utils/generic";
import { gridBox, renderAndInjectForm, renderWithFormAndStore, sample } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { Controller, useFormContext } from "react-hook-form";
import { DynamicFormInput } from "../input/form/input";

const defaultShipment = {
  ...initialState,
  items: [
    {
      id: "dewar",
      name: "dewar",
      data: { type: "dewar" },
      children: [
        {
          id: "container",
          name: "container",
          data: { type: "puck" },
          children: [gridBox],
        },
      ],
    },
  ],
  activeItem: gridBox,
  unassigned: [
    {
      ...initialState.unassigned[0],
      children: [
        {
          id: "sample",
          name: "Samples",
          data: {},
          children: [sample],
        },
        ...initialState.unassigned[0].children!.slice(1, 3),
      ],
    },
  ],
} satisfies typeof initialState;

const populatedGridBox = {
  ...gridBox,
  children: [{ ...sample, data: { ...sample.data, location: 1 } }],
};

const populatedGridBoxShipment = {
  ...initialState,
  activeItem: populatedGridBox,
  items: [
    {
      ...defaultShipment.items[0],
      children: [
        {
          ...defaultShipment.items[0].children[0],
          children: [populatedGridBox],
        },
      ],
    },
  ],
  isEdit: true,
} satisfies typeof initialState;

describe("Grid Box", () => {
  it("should show modal when grid is clicked", () => {
    renderAndInjectForm(<GridBox shipmentId='1' />, {
      preloadedState: { shipment: defaultShipment },
    });

    fireEvent.click(screen.getByText("2"));

    expect(screen.getByText(/select sample/i)).toBeInTheDocument();
  });

  it("should pre-populate positions with data from state", () => {
    renderAndInjectForm(<GridBox shipmentId='1' />, {
      preloadedState: { shipment: populatedGridBoxShipment },
    });

    expect(screen.getByTestId("1-populated")).toBeInTheDocument();
  });

  it("should display message if no unassigned samples are available", () => {
    renderAndInjectForm(<GridBox shipmentId='1' />, {
      preloadedState: { shipment: populatedGridBoxShipment },
    });

    fireEvent.click(screen.getByText("1"));

    expect(screen.getByText(/no unassigned samples available/i));
  });

  it("should refresh position with clicked sample", async () => {
    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId",
        () => HttpResponse.json({ children: populatedGridBoxShipment.items }),
        { once: true },
      ),
    );

    renderAndInjectForm(<GridBox shipmentId='1' />, {
      preloadedState: { shipment: { ...defaultShipment, isEdit: true } },
    });

    fireEvent.click(screen.getByText("1"));
    fireEvent.click(screen.getByRole("radio"));
    fireEvent.click(screen.getByText(/apply/i));

    await screen.findByTestId("1-populated");
  });

  it("should remove sample from position when remove clicked", async () => {
    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId",
        () => HttpResponse.json({ children: defaultShipment.items }),
        { once: true },
      ),
    );

    renderAndInjectForm(<GridBox shipmentId='1' />, {
      preloadedState: { shipment: populatedGridBoxShipment },
    });

    fireEvent.click(screen.getByText("1"));

    const removeButton = await screen.findByRole("button", { name: "Remove" });
    fireEvent.click(removeButton);

    await screen.findByTestId("1-empty");
  });

  it("should render four grid slots by default", () => {
    renderAndInjectForm(<GridBox shipmentId='1' />, {
      preloadedState: { shipment: populatedGridBoxShipment },
    });

    expect(screen.getAllByRole("button")).toHaveLength(4);
  });

  it("should derive capacity from sibling form component", async () => {
    const FormParent = () => {
      const formContext = useFormContext<BaseShipmentItem>();
      return (
        <>
          <Controller
            name='capacity'
            render={({ field }) => <input data-testid='cap' {...field} value='3'></input>}
          ></Controller>
          <GridBox shipmentId='1' formContext={formContext} />
        </>
      );
    };

    renderWithFormAndStore(<FormParent />, {
      preloadedState: { shipment: populatedGridBoxShipment },
    });

    fireEvent.change(screen.getByTestId("cap"), { target: { value: "5" } });
    await waitFor(() => expect(screen.getAllByRole("button")).toHaveLength(5));
  });

  it("should not allow automatic creation on slot assignment if name is invalid", async () => {
    const FormParent = () => {
      const formContext = useFormContext<BaseShipmentItem>();
      return (
        <>
          <DynamicFormInput
            id='name'
            label='name'
            type='text'
            values='test test'
            validation={nameValidation}
          />
          <GridBox shipmentId='1' formContext={formContext} />
        </>
      );
    };

    renderWithFormAndStore(<FormParent />, {
      preloadedState: {
        shipment: { ...populatedGridBoxShipment, unassigned: defaultShipment.unassigned },
      },
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("test test")).toBeInTheDocument();
    });

    screen.debug();

    fireEvent.click(screen.getByText("1"));
    fireEvent.click(screen.getByRole("radio"));
    fireEvent.click(screen.getByText(/apply/i));

    await screen.findByText(/name must only contain alphanumeric characters and underscores/i);
  });

  it("should create grid box if not yet in database before populating slot", async () => {
    const newPopulatedGridBoxItems = structuredClone(populatedGridBoxShipment.items);

    newPopulatedGridBoxItems[0].children[0].children.push({ ...populatedGridBox, id: 123 });

    server.use(
      http.post(
        "http://localhost/api/shipments/:shipmentId/containers",
        () => HttpResponse.json({ id: 123 }, { status: 201 }),
        { once: true },
      ),
      http.get(
        "http://localhost/api/shipments/:shipmentId",
        () => HttpResponse.json({ children: newPopulatedGridBoxItems }),
        { once: true },
      ),
    );

    renderAndInjectForm(<GridBox shipmentId='1' />, {
      preloadedState: {
        shipment: { ...defaultShipment, activeItem: { ...gridBox, id: "new-gridBox" } },
      },
    });

    fireEvent.click(screen.getByText("1"));
    fireEvent.click(screen.getByRole("radio"));
    fireEvent.click(screen.getByText(/apply/i));

    await screen.findByTestId("1-populated");
  });

  it("should replace existing item in grid box slot", async () => {
    const patchSpy = vi.spyOn(Item, "patch");

    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId",
        () => HttpResponse.json({ children: populatedGridBoxShipment.items }),
        { once: true },
      ),
    );

    renderAndInjectForm(<GridBox shipmentId='1' />, {
      preloadedState: {
        shipment: {
          ...populatedGridBoxShipment,
          isEdit: true,
          unassigned: defaultShipment.unassigned,
        },
      },
    });

    fireEvent.click(screen.getByText("1"));
    fireEvent.click(screen.getByRole("radio"));
    fireEvent.click(screen.getByText(/apply/i));

    await waitFor(() => expect(patchSpy).toHaveBeenCalledTimes(3));
  });
});
