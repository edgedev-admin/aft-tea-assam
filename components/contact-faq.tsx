"use client";

import { Plus } from "lucide-react";
import { useId, useState } from "react";

const questions = [
  ["Where is AFT Techno Trade based?", "AFT Techno Trade operates in the Dikom and Lahowal area near Dibrugarh, Upper Assam."],
  ["What types of tea can I enquire about?", "You can enquire about commercial Assam CTC, specialty and orthodox teas, the Ajanta Tea collection, and other documented offerings."],
  ["Can I discuss a wholesale order?", "Yes. Include your preferred tea type, approximate quantity and delivery destination to help the team understand your requirements."],
  ["Can businesses discuss custom blends or private-label tea?", "AFT Techno Trade's company materials describe these services. Specific formulations, packaging and commercial arrangements can be discussed with the team."],
  ["What details should I include in my message?", "Your name, contact information, tea type, intended use and any relevant quantity or sourcing preferences are useful starting points."],
  ["Can I contact AFT directly?", "Yes. Use the verified phone number or business email listed on this page."],
] as const;

export function ContactFaq() {
  const [open, setOpen] = useState(0);
  const baseId = useId();

  return <div className="contact-faq-list">
    {questions.map(([question, answer], index) => {
      const isOpen = open === index;
      const answerId = `${baseId}-answer-${index}`;
      return <article className={isOpen ? "is-open" : ""} key={question}>
        <h3>
          <button type="button" aria-expanded={isOpen} aria-controls={answerId} onClick={() => setOpen(isOpen ? -1 : index)}>
            <span>{question}</span><Plus size={20} aria-hidden="true" />
          </button>
        </h3>
        <div className="contact-faq-answer" id={answerId} role="region" aria-hidden={!isOpen}>
          <div><p>{answer}</p></div>
        </div>
      </article>;
    })}
  </div>;
}
