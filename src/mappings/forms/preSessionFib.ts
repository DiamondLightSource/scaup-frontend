import { DynamicFormEntry } from "@/types/forms";
import { commentValidation } from "@/utils/generic";

export const preSessionFibForm = [
  {
    id: "gridSeparator",
    label: "Grid Information",
    type: "separator",
  },
  {
    id: "clipped",
    label: "Grid Clipped",
    type: "dropdown",
    validation: {
      required: "Required",
    },
    values: [
      { label: "Not clipped", value: "Not clipped" },
      { label: "Clipped, facing left", value: "Clipped, facing left" },
      { label: "Clipped, facing right", value: "Clipped, facing right" },
    ],
    hint: "Whether your grids were clipped or not, and how they're clipped",
  },
  {
    id: "sessionSetupSeparator",
    label: "Session Setup",
    type: "separator",
  },
  {
    id: "experimentType",
    label: "Experiment Type",
    type: "dropdown",
    validation: {
      required: "Required",
    },
    values: [
      {
        label: "Fully automated lamella preparation",
        value: "Fully automated lamella preparation",
      },
      {
        label: "Partially automated lamella preparation",
        value: "Partially automated lamella preparation",
      },
    ],
  },
  {
    id: "preMillingFluorescenceImaging",
    label: "Pre-milling fluorescence imaging – 2D/3D correlation",
    type: "checkbox",
  },
  {
    id: "postMillingFluorescenceImaging",
    label: "Post-milling fluorescence imaging",
    type: "checkbox",
  },
  {
    id: "comments",
    label: "Any other information relevant to your session?",
    type: "textarea",
    validation: {
      ...commentValidation
    }
  },
] as DynamicFormEntry[];
