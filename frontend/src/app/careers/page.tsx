'use client';

import { Container, Typography, Box, Paper, Grid, Button, Chip } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import GroupsIcon from '@mui/icons-material/Groups';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const BENEFITS = [
  {
    icon: <HealthAndSafetyIcon />,
    title: 'Health & Wellness',
    description: 'Comprehensive health, dental, and vision insurance for you and your family.',
  },
  {
    icon: <TrendingUpIcon />,
    title: 'Growth',
    description: 'Learning budget, career development programs, and promotion opportunities.',
  },
  {
    icon: <GroupsIcon />,
    title: 'Culture',
    description: 'Inclusive environment, team events, and a collaborative work atmosphere.',
  },
  {
    icon: <WorkIcon />,
    title: 'Flexibility',
    description: 'Remote-friendly policies, flexible hours, and generous PTO.',
  },
];

const OPEN_POSITIONS = [
  {
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Product Manager',
    department: 'Product',
    location: 'New York, NY',
    type: 'Full-time',
  },
  {
    title: 'Customer Support Specialist',
    department: 'Support',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Marketing Coordinator',
    department: 'Marketing',
    location: 'New York, NY',
    type: 'Full-time',
  },
  {
    title: 'Warehouse Associate',
    department: 'Operations',
    location: 'Newark, NJ',
    type: 'Full-time',
  },
];

export default function CareersPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Join Our Team
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto', fontWeight: 400 }}
        >
          Help us build the future of footwear retail. We&apos;re looking for passionate
          people who want to make a difference.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 6 },
          mb: 6,
          bgcolor: 'grey.900',
          color: 'white',
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Why Footy?
            </Typography>
            <Typography variant="body1" sx={{ color: 'grey.300', lineHeight: 1.8 }}>
              At Footy, you&apos;ll work alongside talented individuals who are passionate
              about creating exceptional shopping experiences. We value innovation, celebrate
              diversity, and believe in empowering our team members to do their best work.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              {BENEFITS.map((benefit) => (
                <Grid item xs={6} key={benefit.title}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Box sx={{ color: 'grey.400', mt: 0.5 }}>{benefit.icon}</Box>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {benefit.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'grey.400' }}>
                        {benefit.description}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
          Open Positions
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {OPEN_POSITIONS.map((position) => (
            <Paper
              key={position.title}
              elevation={0}
              sx={{
                p: 3,
                border: 1,
                borderColor: 'divider',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {position.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                  <Chip
                    label={position.department}
                    size="small"
                    variant="outlined"
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {position.location}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {position.type}
                  </Typography>
                </Box>
              </Box>
              <Button variant="outlined" size="small">
                View Details
              </Button>
            </Paper>
          ))}
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: 'center',
          bgcolor: 'grey.50',
          border: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Don&apos;t See Your Role?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
          We&apos;re always interested in meeting talented people. Send us your resume and
          tell us how you can contribute to Footy.
        </Typography>
        <Button
          variant="contained"
          size="large"
          href="mailto:careers@footy.com"
        >
          Contact Us
        </Button>
      </Paper>
    </Container>
  );
}
