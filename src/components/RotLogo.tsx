import React from 'react';

interface RotLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'symbol';
  lightMode?: boolean;
}

export const RotLogo: React.FC<RotLogoProps> = ({
  className = 'h-12 w-auto',
  variant = 'full',
}) => {
  if (variant === 'symbol') {
    return (
      <svg
        viewBox="0 0 160 160"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="rot_red_grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
        </defs>

        {/* Outer Split Red Ring */}
        <path
          d="M 80 18 A 62 62 0 0 1 138 60 L 122 70 A 44 44 0 0 0 80 36 A 44 44 0 0 0 38 72 L 22 62 A 62 62 0 0 1 80 18 Z"
          fill="url(#rot_red_grad)"
        />
        <path
          d="M 142 88 A 62 62 0 0 1 80 142 A 62 62 0 0 1 22 98 L 38 88 A 44 44 0 0 0 80 124 A 44 44 0 0 0 126 80 L 142 88 Z"
          fill="url(#rot_red_grad)"
        />

        {/* Shopping Cart Icon Inside O */}
        <g fill="#DC2626">
          <path
            d="M 52 58 L 60 58 L 68 88 L 108 88 L 114 66 L 66 66 L 68 60 L 118 60 C 121 60 123 63 122 66 L 114 94 C 113 97 110 99 107 99 L 66 99 C 63 99 60 97 59 94 L 52 58 Z"
          />
          {/* Cart Wheels */}
          <circle cx="70" cy="108" r="5" />
          <circle cx="102" cy="108" r="5" />
          {/* Inner Cart Lines */}
          <rect x="74" y="72" width="30" height="3" rx="1.5" />
          <rect x="76" y="80" width="26" height="3" rx="1.5" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 460 170"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="rot_red_hero" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="50%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>
      </defs>

      {/* ---------------- R (Sharp Modern Black) ---------------- */}
      <g fill="#111827">
        {/* Main Stem & Top Curve */}
        <path d="M 40 24 L 145 24 C 172 24 188 38 188 58 C 188 74 176 86 156 91 L 192 136 L 150 136 L 118 96 L 76 96 L 76 136 L 40 136 Z M 76 48 L 76 74 L 138 74 C 148 74 154 69 154 61 C 154 53 148 48 138 48 Z" />
        {/* Modern Sharp Cut Inset on left leg */}
        <path d="M 40 76 L 76 96 L 40 114 Z" fill="#FFFFFF" />
      </g>

      {/* ---------------- O (Red Split Ring with Shopping Cart) ---------------- */}
      <g transform="translate(195, 14)">
        {/* Top-Right Arc */}
        <path
          d="M 60 12 A 52 52 0 0 1 110 48 L 95 57 A 36 36 0 0 0 60 28 A 36 36 0 0 0 25 58 L 10 49 A 52 52 0 0 1 60 12 Z"
          fill="url(#rot_red_hero)"
        />
        {/* Bottom-Left Arc */}
        <path
          d="M 112 70 A 52 52 0 0 1 60 116 A 52 52 0 0 1 10 78 L 25 69 A 36 36 0 0 0 60 100 A 36 36 0 0 0 97 61 L 112 70 Z"
          fill="url(#rot_red_hero)"
        />

        {/* Shopping Cart Icon Inside O */}
        <g fill="#DC2626">
          <path d="M 37 46 L 44 46 L 50 72 L 85 72 L 90 53 L 49 53 L 51 48 L 94 48 C 96.5 48 98 50 97.5 52.5 L 90.5 76 C 90 78.5 87.5 80 85 80 L 49 80 C 46.5 80 44 78 43 75.5 L 37 46 Z" />
          <circle cx="53" cy="88" r="4.5" />
          <circle cx="81" cy="88" r="4.5" />
          <rect x="56" y="58" width="26" height="2.5" rx="1.2" fill="#DC2626" />
          <rect x="58" y="65" width="22" height="2.5" rx="1.2" fill="#DC2626" />
        </g>
      </g>

      {/* ---------------- T (Sharp Modern Black) ---------------- */}
      <g fill="#111827">
        <path d="M 324 24 L 436 24 L 418 48 L 398 48 L 398 136 L 362 136 L 362 48 L 324 48 Z" />
      </g>

      {/* ---------------- E-COMMERCE SOLUTIONS Subtitle ---------------- */}
      {variant === 'full' && (
        <>
          {/* Left Red Line */}
          <line x1="44" y1="149" x2="80" y2="149" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />

          {/* Text */}
          <text
            x="230"
            y="153"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="12.5"
            fontWeight="900"
            fill="#111827"
            letterSpacing="5"
            textAnchor="middle"
          >
            E-COMMERCE SOLUTIONS
          </text>

          {/* Right Red Line */}
          <line x1="380" y1="149" x2="416" y2="149" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />

          {/* BUILD | GROW | SUCCEED */}
          <text
            x="230"
            y="166"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="9"
            fontWeight="800"
            letterSpacing="3.5"
            textAnchor="middle"
          >
            <tspan fill="#374151">BUILD  |  </tspan>
            <tspan fill="#DC2626" fontWeight="900">GROW</tspan>
            <tspan fill="#374151">  |  SUCCEED</tspan>
          </text>
        </>
      )}
    </svg>
  );
};

export const ROT_LOGO_SVG_DATA_URI = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 170" fill="none"><defs><linearGradient id="rot_red_hero" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23EF4444"/><stop offset="50%" stop-color="%23DC2626"/><stop offset="100%" stop-color="%23991B1B"/></linearGradient></defs><g fill="%23111827"><path d="M 40 24 L 145 24 C 172 24 188 38 188 58 C 188 74 176 86 156 91 L 192 136 L 150 136 L 118 96 L 76 96 L 76 136 L 40 136 Z M 76 48 L 76 74 L 138 74 C 148 74 154 69 154 61 C 154 53 148 48 138 48 Z"/><path d="M 40 76 L 76 96 L 40 114 Z" fill="%23FFFFFF"/></g><g transform="translate(195, 14)"><path d="M 60 12 A 52 52 0 0 1 110 48 L 95 57 A 36 36 0 0 0 60 28 A 36 36 0 0 0 25 58 L 10 49 A 52 52 0 0 1 60 12 Z" fill="url(%23rot_red_hero)"/><path d="M 112 70 A 52 52 0 0 1 60 116 A 52 52 0 0 1 10 78 L 25 69 A 36 36 0 0 0 60 100 A 36 36 0 0 0 97 61 L 112 70 Z" fill="url(%23rot_red_hero)"/><g fill="%23DC2626"><path d="M 37 46 L 44 46 L 50 72 L 85 72 L 90 53 L 49 53 L 51 48 L 94 48 C 96.5 48 98 50 97.5 52.5 L 90.5 76 C 90 78.5 87.5 80 85 80 L 49 80 C 46.5 80 44 78 43 75.5 L 37 46 Z"/><circle cx="53" cy="88" r="4.5"/><circle cx="81" cy="88" r="4.5"/><rect x="56" y="58" width="26" height="2.5" rx="1.2" fill="%23DC2626"/><rect x="58" y="65" width="22" height="2.5" rx="1.2" fill="%23DC2626"/></g></g><g fill="%23111827"><path d="M 324 24 L 436 24 L 418 48 L 398 48 L 398 136 L 362 136 L 362 48 L 324 48 Z"/></g><line x1="44" y1="149" x2="80" y2="149" stroke="%23DC2626" stroke-width="2.5" stroke-linecap="round"/><text x="230" y="153" font-family="system-ui, -apple-system, sans-serif" font-size="12.5" font-weight="900" fill="%23111827" letter-spacing="5" text-anchor="middle">E-COMMERCE SOLUTIONS</text><line x1="380" y1="149" x2="416" y2="149" stroke="%23DC2626" stroke-width="2.5" stroke-linecap="round"/><text x="230" y="166" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="800" letter-spacing="3.5" text-anchor="middle"><tspan fill="%23374151">BUILD  |  </tspan><tspan fill="%23DC2626" font-weight="900">GROW</tspan><tspan fill="%23374151">  |  SUCCEED</tspan></text></svg>`;
