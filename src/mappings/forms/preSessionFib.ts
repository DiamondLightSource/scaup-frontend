import { DynamicFormEntry } from "@/types/forms";

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
    values: [
      {label: "Not clipped", value: "Not clipped"},
      {label: "Clipped, facing left", value: "Clipped, facing left"},
      {label: "Clipped, facing right", value: "Clipped, facing right"}
    ],
    hint: "Whether your grids were clipped or not, and how they're clipped",
  },
  {
    id: "gridCrossGrating",
    label: "Do you need a cross-grating/quantifoil grid for alignments?",
    type: "dropdown",
    values: [
      { label: "No", value: "No" },
      {
        label: "I need it, and I'm sending it myself",
        value: "I need it, and I'm sending it myself",
      },
      {
        label: "I need it, and eBIC should provide it",
        value: "I need it, and eBIC should provide it",
      },
    ],
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
    type: "checkbox"
  },
  {
    id: "postMillingFluorescenceImaging",
    label: "Post-milling fluorescence imaging",
    type: "checkbox"
  },
  {
    id: "comments",
    label: "Any other information relevant to your session?",
    type: "textarea",
  },
] as DynamicFormEntry[];
