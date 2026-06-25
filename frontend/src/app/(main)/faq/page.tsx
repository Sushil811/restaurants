"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What are your opening hours?",
      answer: "We are open for Dinner Service from Monday to Thursday (5:00 PM – 10:00 PM) and Friday to Saturday (5:00 PM – 11:00 PM). We also offer Sunday Brunch (11:00 AM – 3:00 PM) and Sunday Dinner (5:00 PM – 9:30 PM)."
    },
    {
      question: "Do I need to make a reservation?",
      answer: "While we do accept walk-ins if space permits, we highly recommend making a reservation in advance, especially for weekends, holidays, or large groups, to guarantee your table."
    },
    {
      question: "Do you have a dress code?",
      answer: "Yes, our dress code is smart elegant. We kindly ask our guests to avoid sportswear, beachwear, and excessively casual attire to maintain the sophisticated ambiance of our restaurant."
    },
    {
      question: "Can you accommodate dietary restrictions?",
      answer: "Absolutely. We offer a variety of vegetarian, vegan, and gluten-free options. Please inform us of any specific allergies or dietary requirements when making your reservation or placing your order."
    },
    {
      question: "Do you offer private dining or event catering?",
      answer: "Yes, we offer both! We have an exclusive private dining room for intimate gatherings, and we also provide comprehensive catering services for off-site events. Please visit our Catering page or contact us for more details."
    },
    {
      question: "Where can I park?",
      answer: "Valet parking is available at our main entrance. There is also a public parking garage located just one block away from the restaurant."
    }
  ];

  return (
    <div className="bg-[#0D0D0D] text-white pt-32 pb-24 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl md:text-5xl text-[#C9A84C] mb-4 text-center">
          Frequently Asked Questions
        </h1>
        <p className="text-[#F5ECD7]/60 text-center mb-12 text-sm font-sans">
          Answers to common questions about dining at Lumiere.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-[#C9A84C]/20 rounded-lg overflow-hidden bg-[#111111]"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-[#1A1A1A] transition-colors"
              >
                <span className="font-display text-lg text-white pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-[#C9A84C] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#C9A84C] flex-shrink-0" />
                )}
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-4 pt-2 text-[#F5ECD7]/70 text-sm font-sans leading-relaxed border-t border-[#C9A84C]/10">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
