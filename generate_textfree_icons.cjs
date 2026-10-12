const fs = require('fs');
const { Resvg } = require('@resvg/resvg-js');

// Master Text-Free Full-Bleed 512x512 SVG
// Royal-blue gradient squircle filling nearly 100% of the canvas with generous corner radius,
// Glowing white open book symbol significantly enlarged to occupy the vast majority of the inner area.
const svg512 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background / Ambient Glow Gradient -->
    <radialGradient id="outerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2563eb" stop-opacity="0.5"/>
      <stop offset="70%" stop-color="#1d4ed8" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#050811" stop-opacity="0"/>
    </radialGradient>

    <!-- Squircle Vibrant Royal-Blue & Cobalt 3D Gradient -->
    <linearGradient id="squircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="35%" stop-color="#2563eb"/>
      <stop offset="70%" stop-color="#1d4ed8"/>
      <stop offset="100%" stop-color="#0f2b82"/>
    </linearGradient>

    <!-- Top Gloss & Inner Highlight Gradient -->
    <linearGradient id="innerGloss" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.8"/>
      <stop offset="25%" stop-color="#3b82f6" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#1e40af" stop-opacity="0"/>
    </linearGradient>

    <!-- Neon Rim Stroke Gradient -->
    <linearGradient id="strokeRim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#93c5fd" stop-opacity="0.95"/>
      <stop offset="50%" stop-color="#60a5fa" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#1e3a8a" stop-opacity="0.3"/>
    </linearGradient>

    <!-- Book Drop Shadow for 3D Floating Depth -->
    <filter id="bookShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#05102a" flood-opacity="0.6"/>
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#030712" flood-opacity="0.4"/>
    </filter>

    <!-- Soft Glow Filter for Open Book -->
    <filter id="whiteGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#bfdbfe" flood-opacity="0.5"/>
    </filter>

    <!-- Book Page Gradient -->
    <linearGradient id="pageGradLeft" x1="100%" y1="0%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#e0e7ff"/>
      <stop offset="30%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>
    <linearGradient id="pageGradRight" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e0e7ff"/>
      <stop offset="30%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>
  </defs>

  <!-- Canvas Deep Obsidian Ground -->
  <rect width="512" height="512" fill="#050811"/>

  <!-- Ambient Glow Bloom behind squircle -->
  <rect x="8" y="8" width="496" height="496" rx="112" fill="url(#outerGlow)"/>

  <!-- Main Royal-Blue Squircle: Stretches to fill nearly 100% of canvas (from x=16, y=16 to 496x496) -->
  <!-- Dimensions: 480x480 with rx="108" for perfect modern squircle curvature -->
  <rect x="16" y="16" width="480" height="480" rx="108" fill="url(#squircleGrad)"/>

  <!-- Squircle Inner Gloss / Bevel Highlight -->
  <rect x="18" y="18" width="476" height="240" rx="106" fill="url(#innerGloss)"/>

  <!-- Crisp Luminous Rim Stroke -->
  <rect x="16" y="16" width="480" height="480" rx="108" fill="none" stroke="url(#strokeRim)" stroke-width="4"/>

  <!-- Inner Subtle Border Accent -->
  <rect x="22" y="22" width="468" height="468" rx="100" fill="none" stroke="#60a5fa" stroke-opacity="0.25" stroke-width="1.5"/>

  <!-- ============================================================ -->
  <!-- VAST, PROMINENT WHITE OPEN BOOK EMBLEM (Significantly Enlarged) -->
  <!-- Centered horizontally at X=256, vertically at Y=256             -->
  <!-- ============================================================ -->
  <g filter="url(#bookShadow)">
    <g filter="url(#whiteGlow)">

      <!-- Left Page: Elegant curved open book wing -->
      <!-- Curves smoothly from center spine (X=256, Y=145) to left edge (X=96, Y=175) -->
      <path d="M 252 152
               C 210 138, 145 146, 96 172
               C 92 174, 90 178, 90 183
               L 90 326
               C 90 332, 94 336, 100 334
               C 146 312, 212 305, 252 318
               Z"
            fill="url(#pageGradLeft)"/>

      <!-- Right Page: Symmetrical open book wing -->
      <!-- Curves smoothly from center spine (X=256, Y=145) to right edge (X=416, Y=175) -->
      <path d="M 260 152
               C 302 138, 367 146, 416 172
               C 420 174, 422 178, 422 183
               L 422 326
               C 422 332, 418 336, 412 334
               C 366 312, 300 305, 260 318
               Z"
            fill="url(#pageGradRight)"/>

      <!-- Inner Depth / Page Turn Shading Layers (Left Secondary Sheet) -->
      <path d="M 252 166
               C 215 154, 158 162, 114 186
               L 114 316
               C 156 295, 215 289, 252 302
               Z"
            fill="#e2e8f0" fill-opacity="0.35"/>

      <!-- Inner Depth / Page Turn Shading Layers (Right Secondary Sheet) -->
      <path d="M 260 166
               C 297 154, 354 162, 398 186
               L 398 316
               C 356 295, 297 289, 260 302
               Z"
            fill="#e2e8f0" fill-opacity="0.35"/>

      <!-- Spine Center Pillar / Binding -->
      <path d="M 252 150
               C 254 148, 258 148, 260 150
               L 260 320
               C 258 322, 254 322, 252 320
               Z"
            fill="#93c5fd" opacity="0.9"/>

      <!-- Bottom Book Stand / Base Ribbon Chevron -->
      <path d="M 256 322
               L 236 348
               L 256 364
               L 276 348
               Z"
            fill="#38bdf8" opacity="0.95"/>
      <path d="M 256 322
               L 242 344
               L 256 356
               L 270 344
               Z"
            fill="#ffffff" opacity="0.9"/>

      <!-- Left Page Elegant Content Line Accents -->
      <path d="M 130 220 C 168 206, 210 206, 236 214"
            stroke="#93c5fd" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.75"/>
      <path d="M 130 248 C 168 234, 210 234, 236 242"
            stroke="#93c5fd" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.75"/>
      <path d="M 145 276 C 178 264, 210 264, 236 270"
            stroke="#93c5fd" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.75"/>

      <!-- Right Page Elegant Content Line Accents -->
      <path d="M 382 220 C 344 206, 302 206, 276 214"
            stroke="#93c5fd" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.75"/>
      <path d="M 382 248 C 344 234, 302 234, 276 242"
            stroke="#93c5fd" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.75"/>
      <path d="M 367 276 C 334 264, 302 264, 276 270"
            stroke="#93c5fd" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.75"/>

      <!-- Sparkle / Knowledge Star Accents Above Book -->
      <path d="M 256 102 L 260 114 L 272 118 L 260 122 L 256 134 L 252 122 L 240 118 L 252 114 Z"
            fill="#ffffff" opacity="0.95"/>
      <circle cx="214" cy="116" r="3" fill="#67e8f9" opacity="0.8"/>
      <circle cx="298" cy="116" r="3" fill="#67e8f9" opacity="0.8"/>

    </g>
  </g>
</svg>`;

// Write master SVG files
fs.writeFileSync('public/icon-512.svg', svg512);
fs.writeFileSync('public/icon-192.svg', svg512);
fs.writeFileSync('public/favicon.svg', svg512);

// Render crisp PNGs using resvg
const resvg512 = new Resvg(svg512, { fitTo: { mode: 'width', value: 512 } });
const pngData512 = resvg512.render().asPng();
fs.writeFileSync('public/icon-512.png', pngData512);

const resvg192 = new Resvg(svg512, { fitTo: { mode: 'width', value: 192 } });
const pngData192 = resvg192.render().asPng();
fs.writeFileSync('public/icon-192.png', pngData192);

const resvgFavicon = new Resvg(svg512, { fitTo: { mode: 'width', value: 64 } });
const pngDataFavicon = resvgFavicon.render().asPng();
fs.writeFileSync('public/favicon.png', pngDataFavicon);

console.log('Successfully generated text-free full-bleed high-contrast icons:');
console.log(' - public/icon-512.png (512x512):', fs.statSync('public/icon-512.png').size, 'bytes');
console.log(' - public/icon-192.png (192x192):', fs.statSync('public/icon-192.png').size, 'bytes');
console.log(' - public/favicon.png (64x64):', fs.statSync('public/favicon.png').size, 'bytes');
console.log(' - public/icon-512.svg');
console.log(' - public/icon-192.svg');
console.log(' - public/favicon.svg');
