"use client";

export default function Loader({ size = 5 }) {
  const s = `${size}rem`;

  return (
    <div className="flex items-center justify-center">
      <svg
        style={{ width: s, height: s }}
        viewBox="0 0 50 50"
        className="animate-spin-slow"
      >
        {/* Background ring */}
        <circle
          cx="25"
          cy="25"
          r="22"
          stroke="rgba(11,28,57,0.06)"
          strokeWidth="5"
          fill="none"
        />

        {/* Gradient spin arc */}
        <defs>
          <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4A017" stopOpacity="1" />
            <stop offset="60%" stopColor="#0B1C39" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0B1C39" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        <path
          d="M 25 3 A 22 22 0 0 1 47 25"
          stroke="url(#loaderGradient)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 1.3s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
