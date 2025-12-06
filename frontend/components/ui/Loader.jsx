"use client";

export default function Loader({ size = 5 }) {
  // We use rems to scale everything proportionally
  const containerStyle = { width: `${size}rem`, height: `${size}rem` };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative" style={containerStyle}>
        
        {/* 1. Static Background Ring (Very Faint Navy) */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 50 50">
          <circle
            cx="25"
            cy="25"
            r="22"
            fill="none"
            stroke="#0B1C39"
            strokeWidth="3"
            strokeOpacity="0.08"
          />
        </svg>

        {/* 2. Outer Spinning Ring (Gold Gradient) */}
        {/* animationDuration is set inline to slow it down for a 'heavier', more premium feel */}
        <svg
          className="absolute inset-0 w-full h-full animate-spin origin-center"
          viewBox="0 0 50 50"
          style={{ animationDuration: "1.5s" }}
        >
          <defs>
            <linearGradient id="goldTail" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4A017" stopOpacity="1" />
              <stop offset="100%" stopColor="#D4A017" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          
          <path
            d="M 25 3 A 22 22 0 0 1 47 25"
            stroke="url(#goldTail)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* 3. Inner Counter-Rotating Ring (Navy Dashed) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-2/3 h-2/3 animate-spin origin-center opacity-70"
            viewBox="0 0 50 50"
            style={{ 
              animationDirection: "reverse", 
              animationDuration: "3s" // Spins slower than outer ring
            }}
          >
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="#0B1C39"
              strokeWidth="1.5"
              strokeDasharray="4 8" // Creates the technical dashed look
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* 4. Center Pulsing Dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-[#D4A017] rounded-full animate-pulse shadow-[0_0_8px_rgba(212,160,23,0.8)]"></div>
        </div>

      </div>
    </div>
  );
}