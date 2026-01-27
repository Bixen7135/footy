'use client';

import { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);

interface InfoBlock {
  title: string;
  content: string[];
}

const blocks: InfoBlock[] = [
  {
    title: 'Exchanges',
    content: [
      'Free shipping on all exchanges',
      'Exchange for a different size or color',
      'Exchange request must be made within 30 days',
      'Original item must be returned in unworn condition',
    ],
  },
  {
    title: 'Refund Timeline',
    content: [
      'Processing: 1-2 business days after receipt',
      'Refund issued: 5-7 business days',
      'Refund shipping fee: $5.99 deducted from refund',
      'Refund method: Original payment method',
    ],
  },
];

export default function ExpandableInfoBlocks() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleBlock = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
          }}
        >
          {blocks.map((block, index) => {
            const isExpanded = expandedIndex === index;

            return (
              <MotionBox
                key={block.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                onClick={() => toggleBlock(index)}
                sx={{
                  cursor: 'pointer',
                  overflow: 'hidden',
                  borderRadius: '12px',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                }}
              >
                <MotionBox
                  animate={{
                    height: isExpanded ? 'auto' : '100px',
                    bgcolor: isExpanded ? 'background.paper' : 'secondary.main',
                  }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  sx={{
                    p: 3,
                    border: isExpanded ? 1 : 0,
                    borderColor: 'divider',
                    borderLeft: isExpanded ? '12px solid' : 'none',
                    borderLeftColor: 'secondary.main',
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '1.5rem', md: '1.875rem' },
                      color: isExpanded ? 'text.primary' : 'secondary.contrastText',
                      fontFamily: 'var(--font-satoshi)',
                      mb: isExpanded ? 3 : 0,
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {block.title}
                  </Typography>

                  <AnimatePresence>
                    {isExpanded && (
                      <MotionBox
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <Box component="ul" sx={{ m: 0, pl: 3 }}>
                          {block.content.map((item, i) => (
                            <Box
                              key={i}
                              component="li"
                              sx={{
                                fontSize: '1rem',
                                lineHeight: 1.8,
                                color: 'text.secondary',
                                mb: 1,
                                '&:last-child': { mb: 0 },
                              }}
                            >
                              {item}
                            </Box>
                          ))}
                        </Box>
                      </MotionBox>
                    )}
                  </AnimatePresence>
                </MotionBox>
              </MotionBox>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
