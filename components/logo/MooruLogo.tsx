const GuroosLogo = () => (
    <div className="flex items-center gap-2">
      {/* ICON */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#01696f]"
      >
        {/* Book Shape */}
        <path
          d="M6 10C6 8.9 6.9 8 8 8H20C23 8 24 10 24 10V40C24 40 23 38 20 38H8C6.9 38 6 37.1 6 36V10Z"
          fill="currentColor"
          opacity="0.9"
        />
        <path
          d="M42 10C42 8.9 41.1 8 40 8H28C25 8 24 10 24 10V40C24 40 25 38 28 38H40C41.1 38 42 37.1 42 36V10Z"
          fill="currentColor"
          opacity="0.7"
        />
  
        {/* Center "M" Shape */}
        <path
          d="M16 28L20 20L24 26L28 20L32 28"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
  
      {/* TEXT */}
      <div className="flex flex-col leading-tight">
        <span className="text-xl font-semibold tracking-tight">
          Guroos
        </span>
        <span className="text-xs text-gray-500">
          Read. Listen. Watch. Ask
        </span>
      </div>
    </div>
  );