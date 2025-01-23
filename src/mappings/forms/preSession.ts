import { DynamicFormEntry } from "@/types/forms";

export const preSessionForm = [
  {
    id: "gridSeparator",
    label: "Grid Information",
    type: "separator",
  },
  {
    id: "clipped",
    label: "Grid Clipped",
    type: "checkbox",
    hint: "Whether your grids were clipped or not",
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
    id: "imagingSeparator",
    label: "Imaging Conditions",
    type: "separator",
  },
  {
    id: "pixelSize",
    label: "Pixel Size (Å)",
    hint: "Please refer to the latest instrument calibrated pixel sizes on the eBIC website",
    type: "text",
  },
  {
    id: "totalDose",
    label: "Total Dose (e-/Å)",
    type: "text",
  },
  {
    id: "dosePerFrame",
    label: "Dose per Frame (e-/Å)",
    type: "text",
  },

  {
    id: "cryoEtSeparator",
    label: "Cryo-ET Information",
    type: "separator",
  },
  {
    id: "tiltSpan",
    label: "Tilt Span (°)",
    type: "text",
  },

  {
    id: "tiltStep",
    label: "Tilt Step (°)",
    type: "text",
  },

  {
    id: "startAngle",
    label: "Start Angle (°)",
    type: "text",
  },
  {
    id: "tiltScheme",
    label: "Preferred Tilt Scheme",
    type: "text",
  },
  {
    id: "sessionSetupSeparator",
    label: "Session Setup",
    type: "separator",
  },
  {
    id: "useTomoEpu",
    label: "Use Tomo or EPU?",
    type: "dropdown",
    values: [
      {
        label: "Tomo",
        value: "Tomo",
      },
      {
        label: "EPU",
        value: "EPU",
      },
    ],
  },
  {
    id: "experimentType",
    label: "Experiment Type",
    type: "dropdown",
    values: [
      {
        label: "3D-ED",
        value: "3D-ED",
      },
      {
        label: "Tomography",
        value: "Tomography",
      },
      {
        label: "Lamellaetomography",
        value: "Lamellaetomography",
      },
      {
        label: "Single Particle Analysis",
        value: "Single Particle Analysis",
      },
    ],
  },
  {
    id: "comments",
    label: "Any other information relevant to your session?",
    type: "textarea",
  },
] as DynamicFormEntry[];
