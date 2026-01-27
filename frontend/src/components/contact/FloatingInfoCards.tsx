'use client';

import { Box, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const MotionBox = motion(Box);

interface ContactInfo {
  icon: React.ReactNode;
  title: string;
  details: string;
  subDetails?: string;
  offset: { xs: number; md: number };
}

const contactData: ContactInfo[] = [
  {
    icon: <EmailIcon sx={{ fontSize: 40 }} />,
    title: 'Email',
    details: 'support@footy.com',
    subDetails: '24-hour response time',
    offset: { xs: 0, md: 0 },
  },
  {
    icon: <PhoneIcon sx={{ fontSize: 40 }} />,
    title: 'Phone',
    details: '+1 (555) 123-4567',
    subDetails: 'Mon-Fri, 9am-6pm EST',
    offset: { xs: 0, md: 40 },
  },
  {
    icon: <LocationOnIcon sx={{ fontSize: 40 }} />,
    title: 'Address',
    details: '123 Shoe Street',
    subDetails: 'New York, NY 10001',
    offset: { xs: 0, md: 20 },
  },
  {
    icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
    title: 'Hours',
    details: 'Mon-Fri: 9am-6pm',
    subDetails: 'Sat: 10am-4pm EST',
    offset: { xs: 0, md: 0 },
  },
];

const dropVariants = {
  hidden: (offset: number) => ({
    y: -offset - 200,
    opacity: 0,
  }),
  visible: (offset: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      mass: 1,
    },
  }),
};

export default function FloatingInfoCards() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        gap: 3,
      }}
    >
      {contactData.map((contact, index) => (
        <MotionBox
          key={contact.title}
          custom={contact.offset.md}
          variants={dropVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 + index * 0.15 }}
          whileHover={{
            y: -8,
            boxShadow: '0 8px 24px rgba(158, 255, 0, 0.3)',
            transition: { duration: 0.3 },
          }}
          sx={{
            p: 3,
            bgcolor: 'grey.900',
            border: 3,
            borderColor: 'secondary.main',
            borderRadius: '12px',
            position: 'relative',
            mt: { xs: 0, md: `${contact.offset.md}px` },
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '@media (prefers-reduced-motion: reduce)': {
              transition: 'none',
            },
          }}
        >
          <Stack spacing={1.5}>
            <Box sx={{ color: 'secondary.main' }}>{contact.icon}</Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '1.125rem',
                color: 'white',
                fontFamily: 'var(--font-satoshi)',
              }}
            >
              {contact.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'secondary.main',
              }}
            >
              {contact.details}
            </Typography>
            {contact.subDetails && (
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                {contact.subDetails}
              </Typography>
            )}
          </Stack>
        </MotionBox>
      ))}
    </Box>
  );
}
