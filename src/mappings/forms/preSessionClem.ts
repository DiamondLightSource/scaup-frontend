import { DynamicFormEntry } from "@/types/forms";

export const preSessionClemForm = [
  {
    id: "clipped",
    label: "Grid Clipped",
    type: "checkbox",
    hint: "Whether your grids were clipped or not",
  },
  {
    id: "Auto grid mark",
    label: "Describe auto grid mark",
    type: "textarea",
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
    id: "experimentTypeSeparator",
    label: "Experiment Type",
    type: "separator",
  },
  {
    id: "fluorescenceMap",
    label: "Fluorescence map (2D correlation)",
    type: "checkbox",
  },
  {
    id: "roiZStack",
    label: "ROI Z-stack (3D correlation)",
    type: "checkbox",
  },
  {
    id: "filterCube",
    label: "Filter Cube",
    type: "separator",
  },
  {
    id: "trxEt",
    label: "TRX ET",
    hint: "Ex: BP 560/40; Em: BP 630/75; Dichroic: LP 585",
    type: "checkbox",
  },
  {
    id: "dapiEt",
    label: "DAPI ET",
    hint: "Ex: BP 350/50; Em: BP 460/50; Dichroic: LP 400",
    type: "checkbox",
  },
  {
    id: "gfpEt",
    label: "GFP ET ",
    hint: "Ex: 470/40; Em: 525/50; Dichroic: 495",
    type: "checkbox",
  },
  {
    id: "farRedY5",
    label: "GFP ET ",
    hint: "Ex: BP 620/60; Em: 700/75; Dichroic: 660",
    type: "checkbox",
  },
  {
    id: "other",
    label: "Other",
    hint: "Please inform LC as soon as possible",
    type: "checkbox",
  },
  {
    id: "comments",
    label: "Any other information relevant to your session?",
    type: "textarea",
  },
] as DynamicFormEntry[];
