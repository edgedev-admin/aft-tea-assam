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
    description: "Fresh leaves are assessed for tenderness, appearance and condition before processing. Careful selection helps establish a sound starting point, whether the leaf is destined for a specialty tea or a robust Assam CTC.",
    detail: "Leaf condition, maturity and handling matter from the first stage.",
    icon: "leaf",
  },
  {
    number: "02",
    label: "Withering",
    title: "Preparing the leaf for change.",
    description: "Fresh tea leaves undergo controlled withering, allowing moisture to reduce and the leaf to become more pliable. This prepares the material for processing and contributes to the development of tea character.",
    detail: "Air movement, moisture and leaf condition are important considerations during withering.",
    icon: "wind",
  },
  {
    number: "03",
    label: "Processing",
    title: "Two paths. Distinct expressions.",
    description: "After preparation, tea follows the production method suited to its intended character. Specialty leaf teas emphasise careful handling and preservation of leaf structure, while CTC processing produces the granules associated with strong, brisk Assam tea.",
    detail: "Specialty processing and CTC manufacturing require different techniques.",
    icon: "paths",
  },
  {
    number: "04",
    label: "Oxidation & Drying",
    title: "Where character takes shape.",
    description: "Controlled oxidation contributes to the development of colour, aroma and flavour. Subsequent drying helps stabilise the finished tea, with processing decisions adapted to the particular tea style.",
    detail: "Time, moisture, temperature and sensory evaluation influence the final result.",
    icon: "heat",
  },
  {
    number: "05",
    label: "Sorting & Grading",
    title: "Every grade has its purpose.",
    description: "Once processed, tea is sorted according to leaf form and particle size. From whole-leaf selections to commercial CTC grades, this stage helps prepare teas for their intended uses and markets.",
    detail: "Relevant grades include BP, PF, PD and selected orthodox classifications.",
    icon: "grade",
  },
  {
    number: "06",
    label: "Cupping & Evaluation",
    title: "The final judgment is in the cup.",
    description: "Tea samples are assessed through their appearance, infused leaf, liquor, body, aroma and finish. Sensory evaluation helps the team understand the characteristics of each processed lot.",
    detail: "Cupping connects manufacturing decisions with the experience of the finished tea.",
    icon: "cup",
  },
  {
    number: "07",
    label: "Packaging & Dispatch",
    title: "Protecting the character of the tea.",
    description: "After processing and evaluation, tea is prepared for its intended retail or commercial supply format. Appropriate packaging and handling help protect the finished product during storage and transportation.",
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
