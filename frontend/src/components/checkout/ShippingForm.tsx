'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  TextField,
  Button,
  Grid2 as Grid,
  Typography,
  MenuItem,
} from '@mui/material';
import type { ShippingAddress } from '@/types';

// US states for dropdown
const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

// Validation schema
const shippingSchema = z.object({
  name: z.string().min(1, 'Full name is required').max(255),
  line1: z.string().min(1, 'Address is required').max(255),
  line2: z.string().max(255).optional(),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  postal_code: z
    .string()
    .min(1, 'ZIP code is required')
    .regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
  country: z.string().min(1).max(100).default('United States'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[\d\s\-\(\)\+]+$/, 'Invalid phone number format'),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

interface ShippingFormProps {
  onSubmit: (address: ShippingAddress) => void;
  initialValues?: Partial<ShippingAddress>;
  isLoading?: boolean;
}

export function ShippingForm({
  onSubmit,
  initialValues,
  isLoading = false,
}: ShippingFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      name: initialValues?.name || '',
      line1: initialValues?.line1 || '',
      line2: initialValues?.line2 || '',
      city: initialValues?.city || '',
      state: initialValues?.state || '',
      postal_code: initialValues?.postal_code || '',
      country: 'United States',
      phone: initialValues?.phone || '',
    },
  });

  const onFormSubmit = (data: ShippingFormData) => {
    onSubmit({
      ...data,
      line2: data.line2 || undefined,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onFormSubmit)}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Shipping Address
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Full Name"
                error={!!errors.name}
                helperText={errors.name?.message}
                autoComplete="name"
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Controller
            name="line1"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Street Address"
                error={!!errors.line1}
                helperText={errors.line1?.message}
                autoComplete="address-line1"
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Controller
            name="line2"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Apartment, suite, etc. (optional)"
                error={!!errors.line2}
                helperText={errors.line2?.message}
                autoComplete="address-line2"
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="City"
                error={!!errors.city}
                helperText={errors.city?.message}
                autoComplete="address-level2"
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="State"
                error={!!errors.state}
                helperText={errors.state?.message}
                autoComplete="address-level1"
              >
                {US_STATES.map((state) => (
                  <MenuItem key={state.value} value={state.value}>
                    {state.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="postal_code"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="ZIP Code"
                error={!!errors.postal_code}
                helperText={errors.postal_code?.message}
                autoComplete="postal-code"
                placeholder="12345"
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Phone Number"
                error={!!errors.phone}
                helperText={errors.phone?.message}
                autoComplete="tel"
                placeholder="(555) 123-4567"
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isLoading}
            sx={{ mt: 2, height: 48 }}
          >
            Continue to Review
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
