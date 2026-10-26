export type SupplyDiscipline = {
  number: string;
  key: "ctc" | "specialty" | "blend" | "private-label";
  label: string;
  title: string;
  description: string;
  detail: string;
  enquiryType: string;
  cta: string;
  markers: readonly string[];
};

export const supplyDisciplines: SupplyDiscipline[] = [
  {
    number: "01",
    key: "ctc",
    label: "Commercial Assam CTC",
    title: "Everyday strength. Commercial clarity.",
    description: "Explore Broken Pekoe, Pekoe Fannings, Pekoe Dust and other documented CTC selections according to your intended cup profile and market requirements.",
    detail: "Suitable grades and current availability are discussed against the intended cup, application and commercial requirement.",
    enquiryType: "Commercial CTC",
    cta: "Enquire About CTC Grades",
    markers: ["BP", "PF", "PD", "Clonal selections"],
  },
  {
    number: "02",
    key: "specialty",
    label: "Specialty & Orthodox Tea",
    title: "Distinctive selections for discerning buyers.",
    description: "Explore specialty tea requirements through Nahorchukbari and other verified AFT offerings, with attention to tea character, preparation and intended use.",
    detail: "Leaf style, sensory character and current lot availability can form part of the sourcing conversation.",
    enquiryType: "Specialty / Orthodox Tea",
    cta: "Explore Specialty Tea Supply",
    markers: ["Golden Pearl", "Golden tip", "Whole leaf", "Orthodox"],
  },
  {
    number: "03",
    key: "blend",
    label: "Custom Blending",
    title: "A tea profile suited to your market.",
    description: "Discuss desired strength, aroma, liquor, flavour and intended application with the AFT team. Feasibility and formulation options are assessed for each enquiry.",
    detail: "Feasibility, formulation and commercial terms are confirmed through direct discussion with the team.",
    enquiryType: "Custom Blending",
    cta: "Discuss a Custom Blend",
    markers: ["Cup profile", "Application", "Blend direction", "Market brief"],
  },
  {
    number: "04",
    key: "private-label",
    label: "Private Label & Bulk Supply",
    title: "Your brand. A considered supply conversation.",
    description: "Explore private-label and bulk supply requirements, including packaging preferences, intended quantities and delivery arrangements, subject to project-specific confirmation.",
    detail: "Packaging, documentation, quantities and dispatch terms are agreed for each applicable project.",
    enquiryType: "Private Label / Bulk Packaging",
    cta: "Discuss Private-Label Supply",
    markers: ["Bulk supply", "Packaging", "Specifications", "Trade terms"],
  },
];

export const wholesaleEnquiryTypes = [
  "Commercial CTC",
  "Specialty / Orthodox Tea",
  "Custom Blending",
  "Private Label / Bulk Packaging",
  "General Wholesale Enquiry",
] as const;
