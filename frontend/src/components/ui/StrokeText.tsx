'use client';

import { Typography, TypographyProps } from '@mui/material';
import { SxProps, Theme } from '@mui/system';

interface StrokeTextProps extends Omit<TypographyProps, 'sx'> {
  strokeWidth?: number;
  strokeColor?: string;
  fillColor?: string;
  sx?: SxProps<Theme>;
}

export default function StrokeText({
  strokeWidth = 4,
  strokeColor = '#9EFF00',
  fillColor = 'transparent',
  sx,
  ...props
}: StrokeTextProps) {
  return (
    <Typography
      {...props}
      sx={{
        WebkitTextStroke: `${strokeWidth}px ${strokeColor}`,
        WebkitTextFillColor: fillColor,
        textFillColor: fillColor,
        paintOrder: 'stroke fill',
        ...sx,
      }}
    />
  );
}
