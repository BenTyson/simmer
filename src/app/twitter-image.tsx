import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Simmer - Recipe Search Without the Bloat';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fffdf7 0%, #fff5f2 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(255, 107, 53, 0.1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -150,
            right: -150,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'rgba(0, 217, 192, 0.1)',
          }}
        />

        {/* Logo/Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 120,
            height: 120,
            borderRadius: 24,
            background: 'linear-gradient(135deg, #ff6b35 0%, #f04d1a 100%)',
            marginBottom: 40,
            boxShadow: '0 20px 40px rgba(255, 107, 53, 0.3)',
          }}
        >
          <svg
            width="70"
            height="70"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 11v6a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-6" />
            <path d="M3 11h18" />
            <path d="M12 3v3" />
            <path d="M8 5v2" />
            <path d="M16 5v2" />
          </svg>
        </div>

        {/* Brand name */}
        <div
          style={{
            display: 'flex',
            fontSize: 80,
            fontWeight: 800,
            color: '#1c1917',
            marginBottom: 20,
            letterSpacing: '-0.02em',
          }}
        >
          Simmer
        </div>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            fontSize: 32,
            color: '#57534e',
            textAlign: 'center',
            maxWidth: 800,
          }}
        >
          Recipe Search Without the Bloat
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 40,
          }}
        >
          {['Clean Recipes', 'Easy Scaling', 'Shopping Lists'].map((feature) => (
            <div
              key={feature}
              style={{
                display: 'flex',
                padding: '12px 24px',
                borderRadius: 50,
                background: 'rgba(255, 107, 53, 0.1)',
                color: '#ff6b35',
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
