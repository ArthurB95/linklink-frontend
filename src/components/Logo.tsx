interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export function Logo({
  className = "",
  size = "md",
  showText = true,
}: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: "text-lg" },
    md: { icon: 32, text: "text-2xl" },
    lg: { icon: 40, text: "text-3xl" },
    xl: { icon: 56, text: "text-5xl" },
  };

  const iconSize = sizes[size].icon;
  const textClass = sizes[size].text;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Icon */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient
            id="linkGradient1"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#D946EF" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient
            id="linkGradient2"
            x1="100%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="50%" stopColor="#f67010ff" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>
        </defs>

        {/* First Chain Link - Left */}
        <path
          d="M25 35 C15 35, 10 40, 10 50 C10 60, 15 65, 25 65 L45 65 C45 65, 45 60, 42 55 L28 55 C23 55, 20 52, 20 50 C20 48, 23 45, 28 45 L42 45 C45 40, 45 35, 45 35 Z"
          fill="url(#linkGradient1)"
          className="drop-shadow-lg"
        />

        {/* Second Chain Link - Right */}
        <path
          d="M75 35 C85 35, 90 40, 90 50 C90 60, 85 65, 75 65 L55 65 C55 65, 55 60, 58 55 L72 55 C77 55, 80 52, 80 50 C80 48, 77 45, 72 45 L58 45 C55 40, 55 35, 55 35 Z"
          fill="url(#linkGradient2)"
          className="drop-shadow-lg"
        />

        {/* Connecting dot/circle in the middle */}
        <circle
          cx="50"
          cy="50"
          r="6"
          fill="url(#linkGradient1)"
          className="drop-shadow-md"
        />
      </svg>

      {/* Logo Text */}
      {showText && (
        <div className={`${textClass} font-bold tracking-tight`}>
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            Link
          </span>
          <span className="text-gray-400">.</span>
          <span className="bg-gradient-to-r from-pink-500 via-orange-700 to-red-500 bg-clip-text text-transparent">
            Link
          </span>
          <span className="text-gray-400">.</span>
        </div>
      )}
    </div>
  );
}
