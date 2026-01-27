'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, TextField, Button, Snackbar, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { useFormGlitch } from '@/hooks/useFormGlitch';
import NoiseTexture from '../ui/NoiseTexture';

const MotionBox = motion(Box);

// Validation schema
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function OffsetContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [triggerGlitch, setTriggerGlitch] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { backgroundColor } = useFormGlitch(triggerGlitch, {
    iterations: 8,
    duration: 500,
    colors: ['#9EFF00', '#ffffff', '#000000', '#9EFF00'],
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setTriggerGlitch(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsSubmitted(true);
    setShowSuccess(true);

    // Reset form with stagger delay
    setTimeout(() => {
      reset();
      setIsSubmitted(false);
      setTriggerGlitch(false);
    }, 1500);
  };

  return (
    <>
      <MotionBox
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        sx={{
          position: 'relative',
          p: { xs: 3, md: 4 },
          bgcolor: backgroundColor || 'background.paper',
          border: 2,
          borderColor: 'divider',
          borderRadius: '12px',
          overflow: 'hidden',
          transition: 'background-color 0.05s ease',
        }}
      >
        {/* Noise texture overlay */}
        <NoiseTexture opacity={0.03} animate={false} blendMode="overlay" />

        {/* Green flood on success */}
        {isSubmitted && (
          <MotionBox
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            sx={{
              position: 'absolute',
              inset: 0,
              bgcolor: 'secondary.main',
              transformOrigin: 'right',
              zIndex: 1,
            }}
          />
        )}

        <Box sx={{ position: 'relative', zIndex: 2 }}>
          {/* Name field - Full width */}
          <Box sx={{ mb: 3 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="NAME"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  InputLabelProps={{
                    sx: {
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '& fieldset': { borderWidth: '2px' },
                      '&:hover fieldset': { borderColor: 'secondary.main' },
                      '&.Mui-focused fieldset': {
                        borderColor: 'secondary.main',
                        borderWidth: '4px',
                      },
                      '&.Mui-focused': {
                        transform: 'scale(1.02)',
                        transition: 'transform 0.2s ease',
                        '@media (prefers-reduced-motion: reduce)': {
                          transform: 'none',
                        },
                      },
                    },
                  }}
                />
              )}
            />
          </Box>

          {/* Email + Subject side-by-side with offset */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 3,
              mb: 3,
            }}
          >
            <Box sx={{ mt: { xs: 0, sm: 0 } }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="EMAIL"
                    type="email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputLabelProps={{
                      sx: {
                        fontSize: '12px',
                        fontWeight: 600,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': { borderWidth: '2px' },
                        '&:hover fieldset': { borderColor: 'secondary.main' },
                        '&.Mui-focused fieldset': {
                          borderColor: 'secondary.main',
                          borderWidth: '4px',
                        },
                        '&.Mui-focused': {
                          transform: 'scale(1.02)',
                          transition: 'transform 0.2s ease',
                          '@media (prefers-reduced-motion: reduce)': {
                            transform: 'none',
                          },
                        },
                      },
                    }}
                  />
                )}
              />
            </Box>

            <Box sx={{ mt: { xs: 0, sm: '20px' } }}>
              <Controller
                name="subject"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="SUBJECT"
                    fullWidth
                    error={!!errors.subject}
                    helperText={errors.subject?.message}
                    InputLabelProps={{
                      sx: {
                        fontSize: '12px',
                        fontWeight: 600,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': { borderWidth: '2px' },
                        '&:hover fieldset': { borderColor: 'secondary.main' },
                        '&.Mui-focused fieldset': {
                          borderColor: 'secondary.main',
                          borderWidth: '4px',
                        },
                        '&.Mui-focused': {
                          transform: 'scale(1.02)',
                          transition: 'transform 0.2s ease',
                          '@media (prefers-reduced-motion: reduce)': {
                            transform: 'none',
                          },
                        },
                      },
                    }}
                  />
                )}
              />
            </Box>
          </Box>

          {/* Message field with green left border */}
          <Box sx={{ mb: 4 }}>
            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="MESSAGE"
                  multiline
                  rows={5}
                  fullWidth
                  error={!!errors.message}
                  helperText={errors.message?.message}
                  InputLabelProps={{
                    sx: {
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      position: 'relative',
                      '& fieldset': { borderWidth: '2px' },
                      '&:hover fieldset': { borderColor: 'secondary.main' },
                      '&.Mui-focused fieldset': {
                        borderColor: 'secondary.main',
                        borderWidth: '4px',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '12px',
                        bgcolor: 'secondary.main',
                        borderRadius: '8px 0 0 8px',
                      },
                    },
                  }}
                />
              )}
            />
          </Box>

          {/* Submit button with green bar */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: '60px',
                height: '4px',
                bgcolor: 'secondary.main',
                display: { xs: 'none', sm: 'block' },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'secondary.main',
                color: 'secondary.contrastText',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                '&:hover': {
                  bgcolor: 'grey.900',
                  color: 'white',
                },
              }}
            >
              Send Message
            </Button>
          </Box>
        </Box>
      </MotionBox>

      {/* Success notification */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{
            bgcolor: 'secondary.main',
            color: 'secondary.contrastText',
            fontWeight: 600,
          }}
        >
          Message sent successfully! We&apos;ll get back to you soon.
        </Alert>
      </Snackbar>
    </>
  );
}
