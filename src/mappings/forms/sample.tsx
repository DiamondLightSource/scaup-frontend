import { DynamicFormEntry } from "@/components/input/formInput";
import { BaseShipmentItem } from "@/mappings/pages";

export interface PositionedItem extends BaseShipmentItem {
  position: number | null;
}

export const sampleForm = [
  {
    id: "foil",
    label: "Foil",
    type: "dropdown",
    values: [
      { label: "Quantifoil copper", value: "Quantifoil copper" },
      { label: "Quantifoil gold", value: "Quantifoil gold" },
      { label: "Quantifoil nickel", value: "Quantifoil nickel" },
      { label: "C-flat", value: "C-flat" },
      { label: "Au-flat", value: "Au-flat" },
      { label: "UltrAuFoil", value: "UltrAuFoil" },
      { label: "HexAuFoil", value: "HexAuFoil" },
    ],
  },
  {
    id: "film",
    label: "Film",
    type: "dropdown",
    values: [
      { label: "Holey carbon", value: "Holey carbon" },
      { label: "Holey carbon + 2nm C", value: "Holey carbon + 2nm C" },
      { label: "Holey carbon + graphene oxide", value: "Holey carbon + graphene oxide" },
      { label: "Holey carbon + graphene", value: "Holey carbon + graphene" },
      { label: "Multi-hole", value: "Multi-hole" },
      { label: "Holey carbon - square", value: "Holey carbon - square" },
    ],
  },
  {
    id: "mesh",
    label: "Mesh",
    type: "dropdown",
    values: [
      { label: "200", value: "200" },
      { label: "300", value: "300" },
      { label: "400", value: "400" },
    ],
  },
  {
    id: "ratio",
    label: "Ratio",
    type: "dropdown",
    values: [
      { label: "R 0.6/1", value: "R 0.6/1" },
      { label: "R 1.2/1.3", value: "R 1.2/1.3" },
      { label: "R 2/1", value: "R 2/1" },
      { label: "R 2/2", value: "R 2/2" },
      { label: "R 3.5/1", value: "R 3.5/1" },
      { label: "R 1/2", value: "R 1/2" },
      { label: "R 1/4", value: "R 1/4" },
      { label: "R 2/4", value: "R 2/4" },
    ],
  },
] as DynamicFormEntry[];
