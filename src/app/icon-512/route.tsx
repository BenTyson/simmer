import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'linear-gradient(135deg, #ff6b35 0%, #f04d1a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="320"
          height="320"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Pot with steam icon */}
          <path d="M3 11v6a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-6" />
          <path d="M3 11h18" />
          <path d="M12 3v3" />
          <path d="M8 5v2" />
          <path d="M16 5v2" />
        </svg>
      </div>
    ),
    {
      width: 512,
      height: 512,
    }
  );
}
