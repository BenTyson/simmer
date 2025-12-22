import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#ff6b35',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Pot icon */}
          <path d="M3 11v6a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-6" />
          <path d="M3 11h18" />
          <path d="M12 3v3" />
          <path d="M8 5v2" />
          <path d="M16 5v2" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
