'use client';

import { useState } from 'react';
import type { ChangeEvent } from 'react';
import Link from 'next/link';
import { Box, Container } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ProtectedRoute } from '@/components/auth';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/api';
import type { User } from '@/types';

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const getInitials = (name?: string | null) => {
  if (!name) return 'FT';
  const parts = name.split(' ').filter(Boolean);
  const first = parts[0]?.[0] || '';
  const last = parts[1]?.[0] || '';
  return `${first}${last}`.toUpperCase() || 'FT';
};

function AccountContent() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const firstName = user?.name?.split(' ')[0] || 'there';
  const handle = user?.email?.split('@')[0] || 'member';
  const initials = getInitials(user?.name);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
    setSuccess(false);
  };

  const handleEdit = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
    });
    setIsEditing(true);
    setError(null);
    setSuccess(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await api.patch<User>('/users/me', {
        name: formData.name.trim(),
        phone: formData.phone.trim() || null,
      });

      useAuthStore.setState((state) => ({
        ...state,
        user: response.data,
      }));

      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 200px)',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'radial-gradient(circle at 20% 15%, rgba(24, 24, 24, 0.08) 0%, transparent 50%), radial-gradient(circle at 85% 10%, rgba(158, 255, 0, 0.2) 0%, transparent 45%), radial-gradient(circle at 10% 80%, rgba(158, 255, 0, 0.18) 0%, transparent 45%)'
              : 'radial-gradient(circle at 20% 15%, rgba(255, 255, 255, 0.08) 0%, transparent 50%), radial-gradient(circle at 85% 10%, rgba(158, 255, 0, 0.18) 0%, transparent 45%), radial-gradient(circle at 10% 80%, rgba(158, 255, 0, 0.1) 0%, transparent 45%)',
          opacity: 0.9,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(transparent 31px, rgba(0, 0, 0, 0.08) 32px), linear-gradient(90deg, transparent 31px, rgba(0, 0, 0, 0.08) 32px)',
          backgroundSize: '32px 32px',
          opacity: 0.06,
          zIndex: 0,
          pointerEvents: 'none',
          mixBlendMode: 'multiply',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 5, md: 9 } }}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1.1fr 0.9fr' },
                gap: { xs: 4, md: 6 },
                alignItems: 'end',
                mb: { xs: 5, md: 8 },
              }}
            >
              <Box>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1.5,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                    mb: 2,
                  }}
                >
                  Account Atelier
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      width: '48px',
                      height: '2px',
                      bgcolor: 'secondary.main',
                    }}
                  />
                </Box>
                <Box
                  component="h1"
                  sx={{
                    fontSize: { xs: '2.6rem', sm: '3.6rem', md: '4.6rem' },
                    fontWeight: 900,
                    lineHeight: 0.92,
                    letterSpacing: '-0.04em',
                    color: 'text.primary',
                    mb: 2,
                    fontFamily: 'var(--font-satoshi)',
                  }}
                >
                  Welcome back,
                  <br />
                  <Box
                    component="span"
                    sx={{
                      background: (theme) =>
                        theme.palette.mode === 'light'
                          ? 'linear-gradient(120deg, #181818 0%, #7ECC00 70%)'
                          : 'linear-gradient(120deg, #ffffff 0%, #9EFF00 70%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {firstName}
                  </Box>
                </Box>
                <Box
                  sx={{
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    color: 'text.secondary',
                    lineHeight: 1.7,
                    maxWidth: '520px',
                  }}
                >
                  Your profile is the heartbeat of your Footy experience. Keep it precise, polished, and
                  ready for every drop.
                </Box>
              </Box>

              <Box
                sx={{
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: 'divider',
                  p: 3,
                  bgcolor: 'background.paper',
                  display: 'grid',
                  gap: 2,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '4px',
                    background: 'linear-gradient(90deg, #9EFF00 0%, transparent 80%)',
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      bgcolor: 'secondary.main',
                      color: 'secondary.contrastText',
                      boxShadow: (theme) =>
                        theme.palette.mode === 'light'
                          ? '0 10px 20px rgba(24, 24, 24, 0.12)'
                          : '0 10px 24px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    {initials}
                  </Box>
                  <Box>
                    <Box
                      sx={{
                        fontSize: '0.85rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'text.secondary',
                        fontWeight: 700,
                      }}
                    >
                      Member ID
                    </Box>
                    <Box
                      sx={{
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: 'text.primary',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      @{handle}
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {['Profile', 'Orders', 'Wishlist'].map((label) => (
                    <Box
                      key={label}
                      sx={{
                        px: 2,
                        py: 0.75,
                        borderRadius: '999px',
                        border: '1px solid',
                        borderColor: 'divider',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        fontWeight: 700,
                        color: 'text.secondary',
                      }}
                    >
                      {label}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </motion.div>

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.35 }}
              >
                <Box
                  sx={{
                    mb: 4,
                    p: 2.5,
                    bgcolor: (theme) =>
                      theme.palette.mode === 'light' ? '#9EFF00' : 'rgba(158, 255, 0, 0.15)',
                    color: (theme) => (theme.palette.mode === 'light' ? '#181818' : '#9EFF00'),
                    borderRadius: '14px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <CheckIcon />
                  Profile updated successfully
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1.1fr 0.9fr' },
              gap: { xs: 3, md: 4 },
              alignItems: 'start',
            }}
          >
            <motion.div variants={itemVariants}>
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '22px',
                  p: { xs: 3, md: 5 },
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                  '&:hover': {
                    boxShadow: (theme) =>
                      theme.palette.mode === 'light'
                        ? '0 24px 60px rgba(24, 24, 24, 0.12)'
                        : '0 24px 60px rgba(0, 0, 0, 0.35)',
                    borderColor: 'secondary.main',
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    right: -40,
                    top: -40,
                    width: 140,
                    height: 140,
                    borderRadius: '28px',
                    border: '1px solid',
                    borderColor: 'divider',
                    transform: 'rotate(12deg)',
                    opacity: 0.4,
                  }}
                />

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 4,
                  }}
                >
                  <Box>
                    <Box
                      component="h2"
                      sx={{
                        fontSize: { xs: '1.6rem', md: '2.1rem' },
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        color: 'text.primary',
                        mb: 0.5,
                        fontFamily: 'var(--font-satoshi)',
                      }}
                    >
                      Personal dossier
                    </Box>
                    <Box sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
                      {isEditing ? 'Refine your details with precision' : 'Your account essentials'}
                    </Box>
                  </Box>

                  {!isEditing && (
                    <Box
                      component="button"
                      type="button"
                      onClick={handleEdit}
                      aria-label="Edit profile"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 2.75,
                        py: 1.25,
                        bgcolor: 'transparent',
                        border: '1.5px solid',
                        borderColor: 'divider',
                        borderRadius: '999px',
                        color: 'text.primary',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                        '&:hover': {
                          borderColor: 'secondary.main',
                          bgcolor: (theme) =>
                            theme.palette.mode === 'light'
                              ? 'rgba(24, 24, 24, 0.04)'
                              : 'rgba(255, 255, 255, 0.06)',
                          transform: 'translateY(-2px)',
                        },
                        '&:active': {
                          transform: 'translateY(0)',
                        },
                      }}
                    >
                      <EditIcon />
                      Edit
                    </Box>
                  )}
                </Box>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Box
                        sx={{
                          mb: 3,
                          p: 2,
                          bgcolor: (theme) =>
                            theme.palette.mode === 'light'
                              ? 'rgba(255, 0, 0, 0.08)'
                              : 'rgba(255, 0, 0, 0.15)',
                          color: (theme) => (theme.palette.mode === 'light' ? '#d32f2f' : '#ff5252'),
                          borderRadius: '12px',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                        }}
                      >
                        {error}
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      key="editing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box>
                          <Box
                            component="label"
                            sx={{
                              display: 'block',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              letterSpacing: '0.2em',
                              textTransform: 'uppercase',
                              color: 'text.secondary',
                              mb: 1.5,
                            }}
                          >
                            Full Name
                          </Box>
                          <Box
                            component="input"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            sx={{
                              width: '100%',
                              px: 2.5,
                              py: 2,
                              fontSize: '1rem',
                              fontWeight: 500,
                              color: 'text.primary',
                              bgcolor: 'transparent',
                              border: '2px solid',
                              borderColor: 'divider',
                              borderRadius: '14px',
                              outline: 'none',
                              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                              fontFamily: 'inherit',
                              '&:focus': {
                                borderColor: 'secondary.main',
                                bgcolor: (theme) =>
                                  theme.palette.mode === 'light'
                                    ? 'rgba(158, 255, 0, 0.04)'
                                    : 'rgba(158, 255, 0, 0.08)',
                              },
                            }}
                          />
                        </Box>

                        <Box>
                          <Box
                            component="label"
                            sx={{
                              display: 'block',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              letterSpacing: '0.2em',
                              textTransform: 'uppercase',
                              color: 'text.secondary',
                              mb: 1.5,
                            }}
                          >
                            Phone Number <Box component="span" sx={{ opacity: 0.6 }}>(Optional)</Box>
                          </Box>
                          <Box
                            component="input"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            sx={{
                              width: '100%',
                              px: 2.5,
                              py: 2,
                              fontSize: '1rem',
                              fontWeight: 500,
                              color: 'text.primary',
                              bgcolor: 'transparent',
                              border: '2px solid',
                              borderColor: 'divider',
                              borderRadius: '14px',
                              outline: 'none',
                              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                              fontFamily: 'inherit',
                              '&:focus': {
                                borderColor: 'secondary.main',
                                bgcolor: (theme) =>
                                  theme.palette.mode === 'light'
                                    ? 'rgba(158, 255, 0, 0.04)'
                                    : 'rgba(158, 255, 0, 0.08)',
                              },
                            }}
                          />
                        </Box>

                        <Box>
                          <Box
                            component="label"
                            sx={{
                              display: 'block',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              letterSpacing: '0.2em',
                              textTransform: 'uppercase',
                              color: 'text.secondary',
                              mb: 1.5,
                            }}
                          >
                            Email Address
                          </Box>
                          <Box
                            component="input"
                            type="email"
                            value={user?.email}
                            disabled
                            sx={{
                              width: '100%',
                              px: 2.5,
                              py: 2,
                              fontSize: '1rem',
                              fontWeight: 500,
                              color: 'text.disabled',
                              bgcolor: (theme) =>
                                theme.palette.mode === 'light'
                                  ? 'rgba(0, 0, 0, 0.02)'
                                  : 'rgba(255, 255, 255, 0.03)',
                              border: '2px solid',
                              borderColor: 'divider',
                              borderRadius: '14px',
                              outline: 'none',
                              cursor: 'not-allowed',
                              fontFamily: 'inherit',
                            }}
                          />
                          <Box
                            sx={{
                              mt: 1,
                              fontSize: '0.75rem',
                              color: 'text.secondary',
                              fontStyle: 'italic',
                            }}
                          >
                            Email cannot be changed
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                          <Box
                            component="button"
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                            sx={{
                              flex: 1,
                              minWidth: { xs: '100%', sm: '220px' },
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 1,
                              px: 3,
                              py: 2,
                              bgcolor: 'primary.main',
                              color: 'primary.contrastText',
                              border: 'none',
                              borderRadius: '14px',
                              fontSize: '1rem',
                              fontWeight: 700,
                              cursor: isSaving ? 'not-allowed' : 'pointer',
                              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                              opacity: isSaving ? 0.6 : 1,
                              '&:hover': {
                                transform: isSaving ? 'none' : 'translateY(-2px)',
                                boxShadow: isSaving ? 'none' : '0 10px 24px rgba(24, 24, 24, 0.2)',
                              },
                              '&:active': {
                                transform: 'translateY(0)',
                              },
                            }}
                          >
                            {isSaving ? (
                              <>
                                <Box
                                  component="span"
                                  sx={{
                                    width: '16px',
                                    height: '16px',
                                    border: '2px solid',
                                    borderColor: 'currentColor',
                                    borderTopColor: 'transparent',
                                    borderRadius: '50%',
                                    animation: 'spin 0.8s linear infinite',
                                    '@keyframes spin': {
                                      '0%': { transform: 'rotate(0deg)' },
                                      '100%': { transform: 'rotate(360deg)' },
                                    },
                                  }}
                                />
                                Saving...
                              </>
                            ) : (
                              <>
                                <CheckIcon />
                                Save Changes
                              </>
                            )}
                          </Box>
                          <Box
                            component="button"
                            type="button"
                            onClick={handleCancel}
                            disabled={isSaving}
                            sx={{
                              flex: 1,
                              minWidth: { xs: '100%', sm: '180px' },
                              px: 3,
                              py: 2,
                              bgcolor: 'transparent',
                              color: 'text.primary',
                              border: '2px solid',
                              borderColor: 'divider',
                              borderRadius: '14px',
                              fontSize: '1rem',
                              fontWeight: 700,
                              cursor: isSaving ? 'not-allowed' : 'pointer',
                              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                              opacity: isSaving ? 0.5 : 1,
                              '&:hover': {
                                borderColor: isSaving ? 'divider' : 'secondary.main',
                                bgcolor: isSaving
                                  ? 'transparent'
                                  : (theme) =>
                                      theme.palette.mode === 'light'
                                        ? 'rgba(24, 24, 24, 0.04)'
                                        : 'rgba(255, 255, 255, 0.06)',
                                transform: isSaving ? 'none' : 'translateY(-2px)',
                              },
                              '&:active': {
                                transform: 'translateY(0)',
                              },
                            }}
                          >
                            Cancel
                          </Box>
                        </Box>
                      </Box>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="viewing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box sx={{ display: 'grid', gap: 3 }}>
                        <Box>
                          <Box
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              letterSpacing: '0.2em',
                              textTransform: 'uppercase',
                              color: 'text.secondary',
                              mb: 1.5,
                            }}
                          >
                            Full Name
                          </Box>
                          <Box
                            sx={{
                              fontSize: { xs: '1.25rem', md: '1.5rem' },
                              fontWeight: 700,
                              color: 'text.primary',
                              letterSpacing: '-0.01em',
                            }}
                          >
                            {user?.name}
                          </Box>
                        </Box>

                        <Box>
                          <Box
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              letterSpacing: '0.2em',
                              textTransform: 'uppercase',
                              color: 'text.secondary',
                              mb: 1.5,
                            }}
                          >
                            Email Address
                          </Box>
                          <Box
                            sx={{
                              fontSize: { xs: '1rem', md: '1.125rem' },
                              fontWeight: 600,
                              color: 'text.primary',
                            }}
                          >
                            {user?.email}
                          </Box>
                        </Box>

                        <Box>
                          <Box
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              letterSpacing: '0.2em',
                              textTransform: 'uppercase',
                              color: 'text.secondary',
                              mb: 1.5,
                            }}
                          >
                            Phone Number
                          </Box>
                          <Box
                            sx={{
                              fontSize: { xs: '1rem', md: '1.125rem' },
                              fontWeight: 600,
                              color: user?.phone ? 'text.primary' : 'text.secondary',
                              fontStyle: user?.phone ? 'normal' : 'italic',
                            }}
                          >
                            {user?.phone || 'Not provided'}
                          </Box>
                        </Box>
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </motion.div>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <motion.div variants={itemVariants}>
                <Box
                  component={Link}
                  href="/account/orders"
                  sx={{
                    display: 'block',
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '18px',
                    p: 3,
                    textDecoration: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                    '&:hover': {
                      transform: 'translateX(8px)',
                      borderColor: 'secondary.main',
                      boxShadow: (theme) =>
                        theme.palette.mode === 'light'
                          ? '0 12px 32px rgba(24, 24, 24, 0.12)'
                          : '0 12px 32px rgba(0, 0, 0, 0.3)',
                      '& .arrow': {
                        transform: 'translateX(4px)',
                      },
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box
                      component="h3"
                      sx={{
                        fontSize: '1.3rem',
                        fontWeight: 800,
                        color: 'text.primary',
                        letterSpacing: '-0.01em',
                        fontFamily: 'var(--font-satoshi)',
                      }}
                    >
                      Order history
                    </Box>
                    <Box className="arrow" sx={{ color: 'text.secondary', transition: 'transform 0.3s' }}>
                      <ArrowIcon />
                    </Box>
                  </Box>
                  <Box sx={{ fontSize: '0.9rem', color: 'text.secondary', lineHeight: 1.6, mt: 1 }}>
                    Track deliveries and returns with precision.
                  </Box>
                </Box>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Box
                  component={Link}
                  href="/account/wishlist"
                  sx={{
                    display: 'block',
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '18px',
                    p: 3,
                    textDecoration: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                    '&:hover': {
                      transform: 'translateX(8px)',
                      borderColor: 'secondary.main',
                      boxShadow: (theme) =>
                        theme.palette.mode === 'light'
                          ? '0 12px 32px rgba(24, 24, 24, 0.12)'
                          : '0 12px 32px rgba(0, 0, 0, 0.3)',
                      '& .arrow': {
                        transform: 'translateX(4px)',
                      },
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box
                      component="h3"
                      sx={{
                        fontSize: '1.3rem',
                        fontWeight: 800,
                        color: 'text.primary',
                        letterSpacing: '-0.01em',
                        fontFamily: 'var(--font-satoshi)',
                      }}
                    >
                      Wishlist vault
                    </Box>
                    <Box className="arrow" sx={{ color: 'text.secondary', transition: 'transform 0.3s' }}>
                      <ArrowIcon />
                    </Box>
                  </Box>
                  <Box sx={{ fontSize: '0.9rem', color: 'text.secondary', lineHeight: 1.6, mt: 1 }}>
                    Curate future pickups and saved favorites.
                  </Box>
                </Box>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Box
                  component={Link}
                  href="/catalog"
                  sx={{
                    display: 'block',
                    bgcolor: 'secondary.main',
                    border: '1px solid',
                    borderColor: 'secondary.main',
                    borderRadius: '18px',
                    p: 3,
                    textDecoration: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                    '&:hover': {
                      transform: 'translateX(8px) scale(1.02)',
                      boxShadow: '0 12px 32px rgba(158, 255, 0, 0.35)',
                      '& .arrow': {
                        transform: 'translateX(4px)',
                      },
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box
                      component="h3"
                      sx={{
                        fontSize: '1.3rem',
                        fontWeight: 800,
                        color: 'secondary.contrastText',
                        letterSpacing: '-0.01em',
                        fontFamily: 'var(--font-satoshi)',
                      }}
                    >
                      Continue shopping
                    </Box>
                    <Box className="arrow" sx={{ color: 'secondary.contrastText', transition: 'transform 0.3s' }}>
                      <ArrowIcon />
                    </Box>
                  </Box>
                  <Box sx={{ fontSize: '0.9rem', color: 'secondary.contrastText', lineHeight: 1.6, mt: 1 }}>
                    Step into new releases and classics.
                  </Box>
                </Box>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Box
                  sx={{
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '18px',
                    p: 3,
                  }}
                >
                  <Box
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'text.secondary',
                      mb: 1.5,
                    }}
                  >
                    Account status
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                    <Box>
                      <Box
                        sx={{
                          fontSize: '1.2rem',
                          fontWeight: 800,
                          color: 'text.primary',
                          fontFamily: 'var(--font-satoshi)',
                        }}
                      >
                        Active member
                      </Box>
                      <Box sx={{ fontSize: '0.85rem', color: 'text.secondary', mt: 0.5 }}>
                        Last sync just now
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: '999px',
                        bgcolor: 'secondary.main',
                        color: 'secondary.contrastText',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Live
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <AccountContent />
    </ProtectedRoute>
  );
}
