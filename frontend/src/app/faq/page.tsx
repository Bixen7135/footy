'use client';

import { useState } from 'react';
import { Box, Container } from '@mui/material';
import StackedHeroSection from '@/components/faq/StackedHeroSection';
import CategoryChips from '@/components/faq/CategoryChips';
import ThickBorderAccordion from '@/components/faq/ThickBorderAccordion';

const FAQ_CATEGORIES = [
  {
    title: 'Orders & Shipping',
    questions: [
      {
        question: 'How long does shipping take?',
        answer:
          'Standard shipping typically takes 5-7 business days. Express shipping is available for 2-3 business day delivery. Shipping times may vary based on your location and product availability.',
      },
      {
        question: 'How can I track my order?',
        answer:
          'Once your order ships, you will receive a confirmation email with a tracking number. You can also view your order status by logging into your account and visiting the Orders section.',
      },
      {
        question: 'Do you ship internationally?',
        answer:
          'Currently, we ship within the United States only. We are working on expanding our shipping options to international destinations in the near future.',
      },
      {
        question: 'Can I change or cancel my order?',
        answer:
          'Orders can be modified or cancelled within 1 hour of placement. After that, the order enters processing and cannot be changed. Please contact customer support immediately if you need to make changes.',
      },
    ],
  },
  {
    title: 'Returns & Exchanges',
    questions: [
      {
        question: 'What is your return policy?',
        answer:
          'We offer a 30-day return policy for unworn items in original packaging. Items must be in their original condition with all tags attached. Returns are free for exchanges; refunds may incur a shipping fee.',
      },
      {
        question: 'How do I start a return?',
        answer:
          'Log into your account, go to Order History, select the item you wish to return, and follow the return instructions. You will receive a prepaid shipping label via email.',
      },
      {
        question: 'How long do refunds take?',
        answer:
          'Once we receive your return, refunds are processed within 5-7 business days. The refund will be credited to your original payment method.',
      },
    ],
  },
  {
    title: 'Products & Sizing',
    questions: [
      {
        question: 'How do I find my shoe size?',
        answer:
          'Visit our Size Guide page for detailed instructions on measuring your feet. We provide size charts for all brands and recommend measuring both feet, as sizes can vary between brands.',
      },
      {
        question: 'Are your products authentic?',
        answer:
          'Yes, all products sold on Footy are 100% authentic. We source directly from brands and authorized distributors. We guarantee the authenticity of every item we sell.',
      },
      {
        question: 'Do you offer wide or narrow widths?',
        answer:
          'Width availability varies by product. If a shoe is available in different widths, you will see width options on the product page. Use the filter options to find shoes in your preferred width.',
      },
    ],
  },
  {
    title: 'Account & Payment',
    questions: [
      {
        question: 'What payment methods do you accept?',
        answer:
          'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and Apple Pay. All transactions are securely processed.',
      },
      {
        question: 'Is my payment information secure?',
        answer:
          'Yes, we use industry-standard SSL encryption to protect your payment information. We never store your full credit card details on our servers.',
      },
      {
        question: 'How do I reset my password?',
        answer:
          'Click the "Forgot Password" link on the login page. You will receive an email with instructions to reset your password. The reset link expires after 24 hours for security purposes.',
      },
    ],
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('Orders & Shipping');
  const categories = FAQ_CATEGORIES.map((cat) => cat.title);

  const activeQuestions =
    FAQ_CATEGORIES.find((cat) => cat.title === activeCategory)?.questions || [];

  let questionCounter = 0;
  FAQ_CATEGORIES.forEach((category) => {
    if (category.title === activeCategory) {
      return;
    }
    questionCounter += category.questions.length;
  });

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <StackedHeroSection />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <CategoryChips
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {activeQuestions.map((faq, index) => {
            const globalIndex = questionCounter + index + 1;
            const questionNumber = globalIndex.toString().padStart(2, '0');

            return (
              <ThickBorderAccordion
                key={`${activeCategory}-${index}`}
                faq={faq}
                index={index}
                questionNumber={questionNumber}
              />
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
