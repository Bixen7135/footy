'use client';

import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import RecyclingIcon from '@mui/icons-material/Recycling';

const VALUES = [
  {
    icon: <VerifiedIcon sx={{ fontSize: 40 }} />,
    title: 'Authenticity',
    description:
      'Every product we sell is 100% authentic. We partner directly with brands and authorized distributors to guarantee quality.',
  },
  {
    icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
    title: 'Fast Shipping',
    description:
      'We know you want your new kicks fast. That\'s why we offer express shipping options and same-day processing.',
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
    title: 'Customer First',
    description:
      'Our dedicated support team is here to help with sizing, returns, and any questions you might have.',
  },
  {
    icon: <RecyclingIcon sx={{ fontSize: 40 }} />,
    title: 'Sustainability',
    description:
      'We\'re committed to reducing our environmental footprint through eco-friendly packaging and carbon-neutral shipping.',
  },
];

export default function AboutPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          About Footy
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 700, mx: 'auto', fontWeight: 400 }}
        >
          Your destination for premium footwear. We believe everyone deserves to step out
          in style without compromising on quality or comfort.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 6 },
          mb: 6,
          bgcolor: 'grey.900',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Our Story
        </Typography>
        <Typography
          variant="body1"
          sx={{ maxWidth: 800, mx: 'auto', color: 'grey.300', lineHeight: 1.8 }}
        >
          Founded by footwear enthusiasts, Footy started with a simple mission: make it easy
          for everyone to find their perfect pair of shoes. We were tired of endless searching
          through countless stores, dealing with poor customer service, and worrying about
          authenticity. So we built something better. Today, we curate the best selection of
          sneakers, boots, and running shoes from the brands you love,
          all in one place with the shopping experience you deserve.
        </Typography>
      </Paper>

      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" sx={{ mb: 4 }}>
          Our Values
        </Typography>
        <Grid container spacing={3}>
          {VALUES.map((value) => (
            <Grid item xs={12} sm={6} md={3} key={value.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  textAlign: 'center',
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ color: 'grey.700', mb: 2 }}>{value.icon}</Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {value.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {value.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, border: 1, borderColor: 'divider' }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              By the Numbers
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We&apos;re proud of what we&apos;ve built and the community we&apos;ve created.
              Here&apos;s a glimpse at our journey so far.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography variant="h3" fontWeight={800} color="primary">
                  50K+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Happy Customers
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h3" fontWeight={800} color="primary">
                  500+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Products
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h3" fontWeight={800} color="primary">
                  30+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Top Brands
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h3" fontWeight={800} color="primary">
                  4.9
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Customer Rating
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Join Our Journey
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          We&apos;re always looking for passionate people to join our team. Check out our
          careers page to see current openings.
        </Typography>
      </Box>
    </Container>
  );
}
