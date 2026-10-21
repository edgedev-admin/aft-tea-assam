import type { Metadata } from "next";
import { AftPage, AftSection, CardGrid, PageCta } from "../../components/aft-page";

export const metadata: Metadata = {
  title: "Company Journey",
  description: "AFT Techno Trade's journey from its 2018 establishment in Upper Assam to specialty, CTC and consumer tea supply.",
  alternates: { canonical: "/projects" }
};

const cards = [
  { eyebrow: "2018", title: "Established in Upper Assam", text: "AFT Techno Trade began in the Dikom and Lahowal area of Dibrugarh district." },
  { eyebrow: "February 2022", title: "Golden Pearl at GTAC", text: "A one-kilogram Nahorchukbari Golden Pearl lot fetched Rs 99,999 at the Guwahati Tea Auction Centre." },
  { eyebrow: "Documented portfolio", title: "More than one kind of tea", text: "The current portfolio spans Nahorchukbari specialty tea, Ekoratoli CTC grades, Ajanta Tea and seasonal concepts." }
];

export default function ProjectsPage() {
  return <AftPage kicker="Company Journey" title={"A journey in\nUpper Assam tea."} intro="From commercial manufacturing to a recognised specialty micro-lot, AFT Techno Trade's story brings different dimensions of Assam tea together." image="/images/tea/about-1.jpg">
    <AftSection kicker="Selected milestones" title="Origin, craft and a growing portfolio." text="Only dated milestones supported by the company account or independent reporting are included here."><CardGrid cards={cards}/></AftSection>
    <PageCta/>
  </AftPage>;
}
