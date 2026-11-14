import React from 'react';
import { Box } from '@mui/material';

/** PulseGuard logo mark: a shield with a heartbeat line. */
export default function BrandMark({ size = 32, sx }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      sx={{ flexShrink: 0, ...sx }}
    >
      <defs>
        <linearGradient id="pg-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1e88e5" />
          <stop offset="1" stopColor="#7b1fa2" />
        </linearGradient>
      </defs>
      <path
        d="M32 4 8 13v17c0 15.2 10.2 26.6 24 30 13.8-3.4 24-14.8 24-30V13L32 4Z"
        fill="url(#pg-grad)"
      />
      <path
        d="M15 33h9l4-9 6 17 4-11 3 3h8"
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  );
}
