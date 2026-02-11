import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How accurate is the symptom checker?",
    answer: "Our symptom checker uses advanced AI algorithms and is regularly updated with the latest medical knowledge. While it provides helpful insights, it's designed to be a preliminary tool and should not replace professional medical advice.",
  },
  {
    question: "Is my health data secure?",
    answer: "Yes, we take data security seriously. All your health information is encrypted and stored securely following HIPAA guidelines. We never share your personal information without your explicit consent.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. If you cancel, you'll continue to have access to your premium features until the end of your billing period.",
  },
  {
    question: "How do I get support if I need help?",
    answer: "We offer multiple support channels including in-app chat, email support, and community forums. Premium users get priority support with faster response times.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our platform.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}