const PLUM = "#3B2649";
const RAYS = 12;

/**
 * Illustrated storyboard for "apply at home → forgotten → hours outdoors → reapplication skipped".
 * Purely presentational: Problem.tsx animates the `.ps-*` hooks with a scrubbed GSAP timeline.
 */
export function ProblemScene() {
  return (
    <svg
      viewBox="0 0 1200 640"
      className="block h-full w-full"
      role="img"
      aria-label="Illustration: sunscreen is applied at home, left in a drawer, and skipped after hours outdoors"
    >
      <defs>
        <linearGradient id="ps-morning" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F7C6D6" />
          <stop offset="1" stopColor="#FFF1DC" />
        </linearGradient>
        <linearGradient id="ps-noon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFDD74" />
          <stop offset="1" stopColor="#FFF7ED" />
        </linearGradient>
        <radialGradient id="ps-glow">
          <stop offset="0" stopColor="#FFF3BF" stopOpacity="0.95" />
          <stop offset="1" stopColor="#FFE69A" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* sky */}
      <rect width="1200" height="640" fill="url(#ps-morning)" />
      <rect className="ps-sky-noon" width="1200" height="640" fill="url(#ps-noon)" opacity="0" />

      {/* sun (rises behind the hills) */}
      <g className="ps-sun">
        <circle className="ps-sun-glow" r="150" fill="url(#ps-glow)" />
        <g className="ps-rays">
          {Array.from({ length: RAYS }, (_, i) => (
            <rect key={i} x="-5" y="-96" width="10" height="28" rx="5" fill="#FFC93C" transform={`rotate(${(360 / RAYS) * i})`} />
          ))}
        </g>
        <circle r="56" fill="#FFD45E" stroke="#FFC93C" strokeWidth="6" />
      </g>

      {/* clouds */}
      <g className="ps-cloud" opacity="0.9">
        <g transform="translate(300 120)" fill="#fff">
          <ellipse rx="54" ry="22" />
          <ellipse cx="-30" cy="-10" rx="30" ry="22" />
          <ellipse cx="22" cy="-16" rx="34" ry="26" />
        </g>
      </g>
      <g className="ps-cloud-2" opacity="0.8">
        <g transform="translate(980 210)" fill="#fff">
          <ellipse rx="44" ry="18" />
          <ellipse cx="-22" cy="-8" rx="24" ry="18" />
          <ellipse cx="18" cy="-12" rx="28" ry="20" />
        </g>
      </g>

      {/* hills + ground */}
      <path d="M0 470 C200 420 380 470 560 480 C760 490 960 430 1200 470 V640 H0 Z" fill="#CBB5EF" opacity="0.55" />
      <path d="M0 520 C260 480 520 540 780 520 C960 506 1080 500 1200 512 V640 H0 Z" fill="#B9E4CD" />
      <path d="M0 585 C300 565 700 600 1200 575 V640 H0 Z" fill="#9FD3B8" />

      {/* tree */}
      <g>
        <rect x="1058" y="400" width="24" height="140" rx="10" fill="#C9A27A" stroke={PLUM} strokeWidth="4" />
        <circle cx="1070" cy="372" r="64" fill="#8FD0AE" stroke={PLUM} strokeWidth="4" />
        <circle cx="1016" cy="410" r="44" fill="#8FD0AE" stroke={PLUM} strokeWidth="4" />
        <circle cx="1124" cy="408" r="46" fill="#8FD0AE" stroke={PLUM} strokeWidth="4" />
      </g>

      {/* room */}
      <g>
        <rect x="30" y="200" width="334" height="340" rx="42" fill="#FFFDF8" stroke={PLUM} strokeWidth="4" />
        <rect x="64" y="244" width="120" height="96" rx="18" fill="#D9ECFA" stroke={PLUM} strokeWidth="3.5" />
        <line x1="124" y1="244" x2="124" y2="340" stroke={PLUM} strokeWidth="3" />
        <line x1="64" y1="292" x2="184" y2="292" stroke={PLUM} strokeWidth="3" />
        <rect x="64" y="440" width="262" height="100" rx="16" fill="#F5B2C7" stroke={PLUM} strokeWidth="4" />
        <rect x="76" y="496" width="238" height="34" rx="10" fill="#F9C9D8" stroke={PLUM} strokeWidth="3" />
        <circle cx="195" cy="513" r="5" fill={PLUM} />
        <rect className="ps-drawer" x="76" y="450" width="238" height="38" rx="10" fill="#FFE69A" stroke={PLUM} strokeWidth="3" />
        <circle className="ps-drawer-knob" cx="195" cy="469" r="5" fill={PLUM} />
      </g>

      {/* standard bottle on dresser */}
      <g className="ps-bottle" transform="translate(150 440)">
        <rect x="-26" y="-84" width="52" height="84" rx="14" fill="#FFE69A" stroke={PLUM} strokeWidth="3.5" />
        <rect x="-15" y="-104" width="30" height="22" rx="7" fill={PLUM} />
        <circle cy="-42" r="12" fill="#fff" stroke={PLUM} strokeWidth="2.5" />
        <circle cy="-42" r="5" fill="#FFC93C" />
      </g>

      {/* stretching tether: bottle ⇢ person */}
      <line className="ps-tether" x1="150" y1="462" x2="150" y2="462" stroke={PLUM} strokeWidth="4" strokeDasharray="4 12" strokeLinecap="round" opacity="0.55" />

      {/* person (origin at feet) */}
      <g className="ps-person">
        <g className="ps-bob">
          <rect x="-26" y="-38" width="20" height="38" rx="9" fill={PLUM} />
          <rect x="6" y="-38" width="20" height="38" rx="9" fill={PLUM} />
          <rect x="-36" y="-136" width="72" height="104" rx="34" fill="#CBB5EF" stroke={PLUM} strokeWidth="4" />
          <g className="ps-bag" transform="translate(30 -92) rotate(8)">
            <rect x="0" y="0" width="40" height="46" rx="12" fill="#F5B2C7" stroke={PLUM} strokeWidth="3.5" />
            <path d="M8 2 C8 -16 32 -16 32 2" fill="none" stroke={PLUM} strokeWidth="3.5" />
          </g>
          <circle cy="-168" r="32" fill="#FFD9C7" stroke={PLUM} strokeWidth="4" />
          <path d="M-32 -172 C-32 -204 32 -204 32 -172 C20 -186 -20 -186 -32 -172 Z" fill={PLUM} />
          <circle cx="-11" cy="-166" r="3.6" fill={PLUM} />
          <circle cx="11" cy="-166" r="3.6" fill={PLUM} />
          <path className="ps-mouth-happy" d="M-9 -152 Q0 -144 9 -152" fill="none" stroke={PLUM} strokeWidth="3" strokeLinecap="round" />
          <path className="ps-mouth-flat" d="M-8 -150 L8 -150" fill="none" stroke={PLUM} strokeWidth="3" strokeLinecap="round" opacity="0" />
          {/* "applying" sparkles */}
          {[
            [-46, -190],
            [46, -194],
            [-54, -150],
            [54, -156],
          ].map(([x, y], i) => (
            <path key={i} className="ps-spark" d={`M${x} ${y - 10} L${x + 3} ${y - 3} L${x + 10} ${y} L${x + 3} ${y + 3} L${x} ${y + 10} L${x - 3} ${y + 3} L${x - 10} ${y} L${x - 3} ${y - 3} Z`} fill="#FFC93C" opacity="0" />
          ))}
          {/* speech bubble */}
          <g className="ps-bubble" opacity="0">
            <rect x="-24" y="-290" width="104" height="62" rx="26" fill="#fff" stroke={PLUM} strokeWidth="4" />
            <path d="M0 -229 L-6 -208 L18 -229 Z" fill="#fff" stroke={PLUM} strokeWidth="4" strokeLinejoin="round" />
            <rect x="-4" y="-232" width="30" height="8" fill="#fff" />
            <text x="28" y="-248" textAnchor="middle" fontSize="40" fontWeight="800" fill="#C2477A" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
              ?
            </text>
          </g>
        </g>
      </g>

      <text className="ps-still" x="195" y="580" textAnchor="middle" fontSize="20" fontWeight="700" fill={PLUM} opacity="0" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
        Still at home
      </text>

      {/* clock HUD */}
      <g transform="translate(1100 92)">
        <circle r="46" fill="#fff" stroke={PLUM} strokeWidth="4" />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1="0" y1="-38" x2="0" y2={i % 3 === 0 ? -29 : -33} stroke={PLUM} strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${i * 30})`} />
        ))}
        <line className="ps-hand" x1="0" y1="0" x2="0" y2="-30" stroke="#C2477A" strokeWidth="4.5" strokeLinecap="round" />
        <circle r="5" fill={PLUM} />
      </g>
      <text x="1100" y="168" textAnchor="middle" fontSize="18" fontWeight="700" fill={PLUM} style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
        Hours outdoors
      </text>

      {/* illustrative protection meter */}
      <g transform="translate(40 40)">
        <text y="-8" fontSize="18" fontWeight="700" fill={PLUM} style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
          Protection from the first application
        </text>
        <rect y="6" width="340" height="28" rx="14" fill="#fff" stroke={PLUM} strokeWidth="3.5" />
        <rect className="ps-meter" x="4" y="10" width="332" height="20" rx="10" fill="#4FB587" />
      </g>

      <text x="1150" y="618" textAnchor="end" fontSize="13" fill={PLUM} opacity="0.55" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
        Illustrative storyboard, not measured data
      </text>
    </svg>
  );
}
