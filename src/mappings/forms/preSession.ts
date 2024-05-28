import { DynamicFormEntry } from "@/components/input/form/input";

export const preSessionForm = [
  {
    id: "gridSeparator",
    label: "Grid Information",
    type: "separator",
  },
  {
    id: "grids",
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
    label: "Pixel Size",
    hint: "Please refer to the latest instrument calibrated pixel sizes on the eBIC website",
    type: "text",
  },
  {
    id: "totalDose",
    label: "Total Dose (e-/ A°)",
    type: "text",
  },
  {
    id: "dosePerFrame",
    label: "Dose per Frame (e-/ A°)",
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
    id: "Any other information relevant to your session",
    label: "Preferred Tilt Scheme",
    type: "textarea",
  },
] as DynamicFormEntry[];
