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
    title: "For strength, briskness and the everyday cup.",
    description: "Explore Assam CTC grades including Broken Pekoe, Pekoe Fannings and Pekoe Dust, along with clonal selections. These teas serve different preferences for liquor colour, extraction and blending.",
    detail: "Suitable grades and current availability are discussed against the intended cup, application and commercial requirement.",
    enquiryType: "Commercial CTC",
    cta: "Enquire About CTC Grades",
    markers: ["BP", "PF", "PD", "Clonal selections"],
  },
  {
    number: "02",
    key: "specialty",
    label: "Specialty & Orthodox Tea",
    title: "For buyers seeking character beyond the ordinary.",
    description: "The Nahorchukbari collection includes handcrafted Golden Pearl, selected golden-tip teas and orthodox whole-leaf grades. These offerings bring another dimension to specialty retail, hospitality and considered tea selections.",
    detail: "Leaf style, sensory character and current lot availability can form part of the sourcing conversation.",
    enquiryType: "Specialty / Orthodox Tea",
    cta: "Explore Specialty Tea Supply",
    markers: ["Golden Pearl", "Golden tip", "Whole leaf", "Orthodox"],
  },
  {
    number: "03",
    key: "blend",
    label: "Custom Blending",
    title: "Develop a tea profile for your market.",
    description: "Tea preferences vary by region, customer and intended use. AFT Techno Trade welcomes discussions around CTC, orthodox and selected spiced-tea formulations for specific commercial requirements.",
    detail: "Feasibility, formulation and commercial terms are confirmed through direct discussion with the team.",
    enquiryType: "Custom Blending",
    cta: "Discuss a Custom Blend",
    markers: ["Cup profile", "Application", "Blend direction", "Market brief"],
  },
  {
    number: "04",
    key: "private-label",
    label: "Private Label & Bulk Supply",
    title: "Build your range around your business.",
    description: "For businesses developing their own tea offering, AFT Techno Trade discusses private-label, bulk packaging and supply arrangements according to product specifications and commercial requirements.",
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
