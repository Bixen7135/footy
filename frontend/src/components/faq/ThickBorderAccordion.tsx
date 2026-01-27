'use client';

import { useState } from 'react';
import { Box, Typography, Collapse, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MotionBox = motion(Box);

interface FAQ {
  question: string;
  answer: string;
}

interface ThickBorderAccordionProps {
  faq: FAQ;
  index: number;
  questionNumber: string;
}

export default function ThickBorderAccordion({
  faq,
  index,
  questionNumber,
}: ThickBorderAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MotionBox
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ delay: index * 0.08, duration: 0.6 }}
      sx={{
        position: 'relative',
        bgcolor: 'background.paper',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 0 20px rgba(158, 255, 0, 0.2)',
        },
      }}
    >
      {/* Thick expanding left border */}
      <MotionBox
        animate={{
          width: isOpen ? '40px' : '8px',
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          bgcolor: 'secondary.main',
          zIndex: 1,
        }}
      />

      {/* Question header */}
      <Box
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          p: 3,
          pl: 6,
          cursor: 'pointer',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Question number */}
        <MotionBox
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          sx={{
            fontFamily: 'var(--font-satoshi)',
            fontWeight: 900,
            fontSize: { xs: '3rem', md: '5rem' },
            color: 'secondary.main',
            lineHeight: 1,
            flexShrink: 0,
            '@media (prefers-reduced-motion: reduce)': {
              transform: 'none !important',
            },
          }}
        >
          {questionNumber}
        </MotionBox>

        {/* Question text */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.125rem', md: '1.5rem' },
              fontFamily: 'var(--font-satoshi)',
              lineHeight: 1.3,
            }}
          >
            {faq.question}
          </Typography>
        </Box>

        {/* Expand icon */}
        <IconButton
          sx={{
            color: 'text.primary',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          <ExpandMoreIcon sx={{ fontSize: 32 }} />
        </IconButton>
      </Box>

      {/* Answer section */}
      <Collapse in={isOpen} timeout={400}>
        <MotionBox
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          sx={{
            p: 3,
            pt: 0,
            pl: 6,
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1.8,
              color: 'text.secondary',
              fontFamily: 'var(--font-inter)',
              maxWidth: '900px',
            }}
          >
            {faq.answer}
          </Typography>
        </MotionBox>
      </Collapse>
    </MotionBox>
  );
}
