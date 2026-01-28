'use client';

import { useParams, useRouter } from 'next/navigation';
import { Box, Container, Typography, Button, Chip, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const MotionBox = motion(Box);

const POSITIONS = [
  {
    slug: 'senior-frontend-engineer',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description:
      'We are looking for an experienced Frontend Engineer to join our growing team. You will be responsible for building and maintaining our e-commerce platform using modern web technologies.',
    responsibilities: [
      'Build and maintain high-quality web applications using React, Next.js, and TypeScript',
      'Collaborate with designers and backend engineers to implement new features',
      'Write clean, maintainable, and well-tested code',
      'Participate in code reviews and contribute to technical decisions',
      'Mentor junior developers and share knowledge with the team',
    ],
    requirements: [
      '5+ years of experience in frontend development',
      'Expert knowledge of React, TypeScript, and modern web technologies',
      'Experience with state management libraries (Redux, Zustand, etc.)',
      'Strong understanding of responsive design and accessibility',
      'Experience with testing frameworks (Jest, React Testing Library, Playwright)',
      'Excellent communication and collaboration skills',
    ],
    niceToHave: [
      'Experience with Next.js and server-side rendering',
      'Knowledge of design systems and component libraries',
      'Experience with e-commerce platforms',
      'Contributions to open-source projects',
    ],
  },
  {
    slug: 'product-manager',
    title: 'Product Manager',
    department: 'Product',
    location: 'New York, NY',
    type: 'Full-time',
    description:
      'Join our product team to help shape the future of our e-commerce platform. You will work closely with engineering, design, and business teams to deliver exceptional customer experiences.',
    responsibilities: [
      'Define product vision and strategy for key platform features',
      'Gather and prioritize requirements from customers and stakeholders',
      'Work with engineering and design teams to deliver features',
      'Analyze metrics and user feedback to inform product decisions',
      'Communicate product plans and progress to stakeholders',
    ],
    requirements: [
      '3+ years of product management experience, preferably in e-commerce',
      'Strong analytical and problem-solving skills',
      'Experience with agile development methodologies',
      'Excellent communication and presentation skills',
      'Data-driven approach to decision making',
    ],
    niceToHave: [
      'MBA or technical background',
      'Experience with A/B testing and experimentation',
      'Knowledge of UX design principles',
    ],
  },
  {
    slug: 'customer-support-specialist',
    title: 'Customer Support Specialist',
    department: 'Support',
    location: 'Remote',
    type: 'Full-time',
    description:
      'Help our customers have the best shopping experience possible. You will be the first point of contact for customer inquiries and work to resolve issues quickly and efficiently.',
    responsibilities: [
      'Respond to customer inquiries via email, chat, and phone',
      'Troubleshoot issues and provide solutions',
      'Document customer interactions and feedback',
      'Collaborate with other teams to resolve complex issues',
      'Identify trends and suggest improvements to processes',
    ],
    requirements: [
      '2+ years of customer support experience',
      'Excellent written and verbal communication skills',
      'Strong problem-solving abilities',
      'Patient and empathetic approach to customer service',
      'Ability to work independently in a remote environment',
    ],
    niceToHave: [
      'Experience with e-commerce or retail',
      'Knowledge of support tools (Zendesk, Intercom, etc.)',
      'Multilingual capabilities',
    ],
  },
  {
    slug: 'marketing-coordinator',
    title: 'Marketing Coordinator',
    department: 'Marketing',
    location: 'New York, NY',
    type: 'Full-time',
    description:
      'Support our marketing initiatives to grow brand awareness and drive customer acquisition. You will work across multiple channels including email, social media, and content marketing.',
    responsibilities: [
      'Coordinate marketing campaigns across multiple channels',
      'Create and schedule social media content',
      'Manage email marketing campaigns',
      'Track and report on marketing metrics',
      'Collaborate with creative team on marketing materials',
    ],
    requirements: [
      '2+ years of marketing experience',
      'Experience with email marketing platforms (Mailchimp, SendGrid, etc.)',
      'Strong writing and editing skills',
      'Basic graphic design skills',
      'Analytical mindset with attention to detail',
    ],
    niceToHave: [
      'Experience with SEO and content marketing',
      'Knowledge of marketing automation tools',
      'E-commerce or retail marketing experience',
    ],
  },
  {
    slug: 'warehouse-associate',
    title: 'Warehouse Associate',
    department: 'Operations',
    location: 'Newark, NJ',
    type: 'Full-time',
    description:
      'Join our warehouse team to help fulfill customer orders accurately and efficiently. You will be responsible for picking, packing, and shipping products to customers.',
    responsibilities: [
      'Pick and pack customer orders accurately',
      'Receive and organize incoming inventory',
      'Maintain a clean and organized workspace',
      'Operate warehouse equipment safely',
      'Meet productivity and quality standards',
    ],
    requirements: [
      'Previous warehouse or logistics experience preferred',
      'Ability to lift up to 50 lbs',
      'Attention to detail and accuracy',
      'Reliable and punctual',
      'Ability to work in a fast-paced environment',
    ],
    niceToHave: [
      'Forklift certification',
      'Experience with warehouse management systems',
      'Experience in e-commerce fulfillment',
    ],
  },
];

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const position = POSITIONS.find((p) => p.slug === slug);

  if (!position) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Position Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The position you&apos;re looking for doesn&apos;t exist or has been filled.
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/careers')}
          startIcon={<ArrowBackIcon />}
        >
          Back to Careers
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="md">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            onClick={() => router.push('/careers#open-positions')}
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 4 }}
          >
            Back to All Positions
          </Button>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
              mb: 2,
            }}
          >
            {position.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            <Chip
              label={position.department}
              variant="outlined"
              sx={{
                borderColor: 'secondary.main',
                color: 'text.primary',
                fontWeight: 500,
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {position.location}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {position.type}
            </Typography>
          </Box>

          <Typography
            variant="body1"
            sx={{ fontSize: '1.125rem', lineHeight: 1.8, mb: 6, color: 'text.primary' }}
          >
            {position.description}
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, mb: 3, fontSize: { xs: '1.25rem', md: '1.5rem' } }}
            >
              Responsibilities
            </Typography>
            <Box component="ul" sx={{ pl: 3, m: 0 }}>
              {position.responsibilities.map((item, index) => (
                <Box
                  component="li"
                  key={index}
                  sx={{
                    mb: 2,
                    '&::marker': { color: 'secondary.main' },
                  }}
                >
                  <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                    {item}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, mb: 3, fontSize: { xs: '1.25rem', md: '1.5rem' } }}
            >
              Requirements
            </Typography>
            <Box component="ul" sx={{ pl: 3, m: 0 }}>
              {position.requirements.map((item, index) => (
                <Box
                  component="li"
                  key={index}
                  sx={{
                    mb: 2,
                    '&::marker': { color: 'secondary.main' },
                  }}
                >
                  <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                    {item}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {position.niceToHave && position.niceToHave.length > 0 && (
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, mb: 3, fontSize: { xs: '1.25rem', md: '1.5rem' } }}
              >
                Nice to Have
              </Typography>
              <Box component="ul" sx={{ pl: 3, m: 0 }}>
                {position.niceToHave.map((item, index) => (
                  <Box
                    component="li"
                    key={index}
                    sx={{
                      mb: 2,
                      '&::marker': { color: 'text.secondary' },
                    }}
                  >
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          <Divider sx={{ mb: 4 }} />

          <Box
            sx={{
              bgcolor: 'secondary.main',
              p: 4,
              borderRadius: 2,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: 'secondary.contrastText',
              }}
            >
              Interested in this position?
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 3, color: 'secondary.contrastText', opacity: 0.9 }}
            >
              Send your resume and cover letter to{' '}
              <Box
                component="a"
                href="mailto:careers@footy.com"
                sx={{
                  color: 'secondary.contrastText',
                  fontWeight: 600,
                  textDecoration: 'underline',
                }}
              >
                careers@footy.com
              </Box>
            </Typography>
            <Typography variant="body2" sx={{ color: 'secondary.contrastText', opacity: 0.8 }}>
              Please include the position title in the subject line
            </Typography>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
}
