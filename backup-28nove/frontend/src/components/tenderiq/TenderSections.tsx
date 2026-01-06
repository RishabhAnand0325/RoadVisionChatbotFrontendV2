import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const TenderSections = () => {
  const sections = [
    { id: "1", title: "Eligibility Criteria", content: "Contractor must have minimum 7 years experience in highway construction with annual turnover of ₹20 Cr+" },
    { id: "2", title: "Technical Specifications", content: "Detailed technical specifications for materials, construction methods, and quality standards." },
    { id: "3", title: "Financial Requirements", content: "EMD: ₹31 Lakhs, Performance Security: 5% of contract value, Bank guarantee validity: 12 months" },
    { id: "4", title: "Submission Requirements", content: "Technical bid, Financial bid, Supporting documents, and declarations" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>RFP Sections</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          {sections.map((section) => (
            <AccordionItem key={section.id} value={section.id}>
              <AccordionTrigger>{section.title}</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm">{section.content}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default TenderSections;
