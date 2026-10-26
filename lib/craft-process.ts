export type CraftStage = {
  number: string;
  label: string;
  title: string;
  description: string;
  detail: string;
  icon: "leaf" | "wind" | "paths" | "heat" | "grade" | "cup" | "pack";
};

export const craftStages: CraftStage[] = [
  {
    number: "01",
    label: "Leaf Selection",
    title: "It begins with the leaf.",
    description: "Fresh leaf is considered for tenderness, appearance and condition before it enters processing.",
    detail: "Leaf condition, maturity and handling matter from the first stage.",
    icon: "leaf",
  },
  {
    number: "02",
    label: "Withering",
    title: "Preparing the leaf for change.",
    description: "Where the tea style calls for it, withering reduces leaf moisture and makes the leaf more pliable for subsequent handling.",
    detail: "Air movement, moisture and leaf condition are important considerations during withering.",
    icon: "wind",
  },
  {
    number: "03",
    label: "Processing",
    title: "Two paths. Distinct expressions.",
    description: "The route depends on the tea: specialty leaf is handled to retain structure, while CTC processing creates granules for a brisk Assam cup.",
    detail: "Specialty processing and CTC manufacturing require different techniques.",
    icon: "paths",
  },
  {
    number: "04",
    label: "Oxidation & Drying",
    title: "Where character takes shape.",
    description: "Oxidation and drying are adapted to the intended tea style, shaping colour, aroma and flavour.",
    detail: "Time, moisture, temperature and sensory evaluation influence the final result.",
    icon: "heat",
  },
  {
    number: "05",
    label: "Sorting & Grading",
    title: "Every grade has its purpose.",
    description: "Processed tea is sorted by leaf form and particle size. BP, PF and PD are documented Ekoratoli CTC grades.",
    detail: "Relevant grades include BP, PF, PD and selected orthodox classifications.",
    icon: "grade",
  },
  {
    number: "06",
    label: "Cupping & Evaluation",
    title: "The final judgment is in the cup.",
    description: "Representative samples are considered for dry and infused leaf, liquor, body, aroma and finish.",
    detail: "Cupping connects manufacturing decisions with the experience of the finished tea.",
    icon: "cup",
  },
  {
    number: "07",
    label: "Packaging & Dispatch",
    title: "Protecting the character of the tea.",
    description: "Finished tea is prepared for retail or commercial supply; packaging requirements depend on the intended format.",
    detail: "Retail and bulk supply requirements differ in packaging and presentation.",
    icon: "pack",
  },
];

export const cuppingCriteria = [
  ["01", "Dry Leaf", "The appearance, colour, grain or leaf form, and overall uniformity of the dry tea."],
  ["02", "Infused Leaf", "The condition and appearance of the leaf after brewing."],
  ["03", "Liquor", "The brightness, colour and clarity of the brewed tea."],
  ["04", "Body", "The weight, briskness and mouthfeel of the infusion."],
  ["05", "Aroma & Finish", "The fragrance of the tea and the impression it leaves after tasting."],
] as const;
