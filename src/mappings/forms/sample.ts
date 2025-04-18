import { DynamicFormEntry } from "@/types/forms";
import { BaseShipmentItem } from "@/mappings/pages";
import { nameValidation } from "@/utils/generic";

export interface PositionedItem extends BaseShipmentItem {
  location: number | null;
}

export const sampleForm = [
  {
    id: "name",
    label: "Name",
    type: "text",
    validation: {
      ...nameValidation,
    },
  },
  {
    id: "copies",
    label: "Copies",
    type: "text",
    values: "1",
    hint: "Number of grids of the same sample",
    validation: {
      min: 1,
      pattern: { value: /[0-9]+/, message: "Must be a valid number" },
    },
  },
  {
    id: "proteinId",
    label: "Macromolecule",
    type: "indicatorDropdown",
    values: {
      $ref: {
        parent: "#/proteins",
        map: { value: "proteinId", label: "name", extra: "safetyLevel" },
      },
    },
    validation: {
      required: "Required",
    },
  },
  {
    id: "buffer",
    label: "Buffer",
    type: "text",
  },
  {
    id: "concentration",
    label: "Concentration (mg/ml)",
    type: "text",
  },
  {
    id: "grid-separator",
    label: "Grid Information",
    type: "separator",
  },
  {
    id: "supportMaterial",
    label: "Support Material",
    type: "dropdown",
    values: [
      { label: "Quantifoil copper", value: "Quantifoil copper" },
      { label: "Quantifoil gold", value: "Quantifoil gold" },
      { label: "Quantifoil nickel", value: "Quantifoil nickel" },
      { label: "Chameleon quantifoil active", value: "Chameleon quantifoil active" },
      { label: "C-flat", value: "C-flat" },
      { label: "Au-flat", value: "Au-flat" },
      { label: "UltrAuFoil", value: "UltrAuFoil" },
      { label: "HexAuFoil", value: "HexAuFoil" },
      { label: "No Foil", value: "No Foil" },
    ],
  },
  {
    id: "foil",
    label: "Foil",
    type: "dropdown",
    values: [
      { label: "Holey carbon", value: "Holey carbon" },
      { label: "Holey carbon + 2nm C", value: "Holey carbon + 2nm C" },
      { label: "Holey carbon + graphene oxide", value: "Holey carbon + graphene oxide" },
      { label: "Holey carbon + graphene", value: "Holey carbon + graphene" },
      { label: "Multi-hole", value: "Multi-hole" },
      { label: "Holey carbon - square", value: "Holey carbon - square" },
      { label: "Gold foil on gold mesh", value: "Gold foil on gold mesh" },
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
    id: "hole",
    label: "Foil Hole Diameter",
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
  {
    id: "vitrification",
    label: "Vitrification",
    type: "editableDropdown",
    values: [
      { label: "GP2", value: "GP2" },
      { label: "Manual", value: "Manual" },
      { label: "Vitrobot", value: "Vitrobot" },
      { label: "High Pressure", value: "High Pressure" },
    ],
  },
  {
    id: "vitrificationConditions",
    label: "Vitrification Conditions",
    type: "textarea",
  },
] as DynamicFormEntry[];
