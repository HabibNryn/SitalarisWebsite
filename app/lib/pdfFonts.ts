'use client';

import { Font } from '@react-pdf/renderer';

let registered = false;

export function registerPdfFonts() {
  if (registered) return;

  Font.register({
    family: 'Times',
    src: '/fonts/times.ttf',
  });

  registered = true;
}
