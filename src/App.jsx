import React from "react";
import "./App.css";

const BASE = { x: 300, y: 560 };

const FLOWERS = [
  { x: 150, y: 330, color: "var(--neon-violet)" },
  { x: 215, y: 250, color: "var(--neon-violet)" },
  { x: 300, y: 185, color: "var(--neon-blue)" },
  { x: 385, y: 240, color: "var(--neon-pink)" },
  { x: 450, y: 320, color: "var(--neon-pink)" },
];

// Deterministic random function
const rand = (i) => {
  const s = Math.sin(i * 9301 + 49297) * 233280;
  return s - Math.floor(s);
};

// Stars
const STARS = Array.from({ length: 60 }, (_, i) => ({
  left: rand(i) * 100,
  top: rand(i + 100) * 100,
  size: 1 + rand(i + 200) * 2.5,
  delay: rand(i + 300) * 4,
}));

// Grass blades
const BLADES = [
  ...Array.from({ length: 7 }, (_, i) => {
    const x = 120 + i * 14;

    return `M${x + 60} 570 Q${x - 30} 450 ${95 + i * 16} ${
      150 + i * 45
    }`;
  }),

  ...Array.from({ length: 7 }, (_, i) => {
    const x = 480 - i * 14;

    return `M${x - 60} 570 Q${x + 30} 450 ${505 - i * 16} ${
      150 + i * 45
    }`;
  }),

  ...Array.from({ length: 14 }, (_, i) => {
    const x = 210 + i * 13;

    const tip =
      x +
      (i < 7 ? -30 : 30) +
      (rand(i) - 0.5) * 20;

    return `M${300 + (x - 300) * 0.3} 570 Q${x} 520 ${tip} ${
      460 + rand(i + 9) * 40
    }`;
  }),
];

function Flower({ x, y, color, i }) {
  const cx =
    (BASE.x + x) / 2 +
    (x - BASE.x) * 0.05;

  const cy = (BASE.y + y) / 2;

  const duration = 2.2 + i * 0.2;

  return (
    <g>
      {/* Stem */}
      <path
        className="draw stem"
        pathLength="1"
        d={`M${BASE.x} ${BASE.y} Q${cx} ${cy} ${x} ${y}`}
        stroke={color}
        style={{
          "--d": `${1.2 + i * 0.15}s`,
        }}
      />

      {/* Flower */}
      <g transform={`translate(${x} ${y})`}>
        <g
          className="bloom"
          style={{
            "--d": `${duration}s`,
            color: color,
          }}
        >
          {/* Petals */}
          {Array.from({ length: 8 }, (_, p) => (
            <ellipse
              key={p}
              className="petal"
              cx="0"
              cy="-26"
              rx="9"
              ry="26"
              transform={`rotate(${p * 45 - 22})`}
            />
          ))}

          {/* Stamens */}
          {Array.from({ length: 5 }, (_, p) => (
            <g
              key={p}
              transform={`rotate(${-50 + p * 25})`}
            >
              <line
                className="stamen"
                x1="0"
                y1="0"
                x2="0"
                y2="-30"
              />

              <circle
                className="anther"
                cx="0"
                cy="-32"
                r="2.6"
              />
            </g>
          ))}

          {/* Flower center */}
          <circle className="core" r="4" />
        </g>
      </g>
    </g>
  );
}

function App() {
  return (
    <main className="flower-scene-container">

      {/* Stars */}
      {STARS.map((star, i) => (
        <span
          key={i}
          className="star"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* SVG Scene */}
      <svg
        className="flower-svg"
        viewBox="0 0 600 600"
        aria-label="Neon flowers blooming"
      >
        <defs>

          {/* Glow */}
          <filter
            id="glow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur
              stdDeviation="4"
              result="b"
            />

            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Grass gradient */}
          <linearGradient
            id="grass"
            x1="0"
            y1="1"
            x2="0"
            y2="0"
          >
            <stop
              offset="0"
              stopColor="var(--grass-dark)"
            />

            <stop
              offset="1"
              stopColor="var(--grass-light)"
            />
          </linearGradient>

        </defs>

        <g filter="url(#glow)">

          {/* Grass */}
          {BLADES.map((d, i) => (
            <path
              key={i}
              className="draw blade"
              pathLength="1"
              d={d}
              style={{
                "--d": `${rand(i + 50) * 0.8}s`,
              }}
            />
          ))}

          {/* Small glowing loops */}
          {Array.from({ length: 24 }, (_, i) => {
            const left = i < 12;
            const k = i % 12;

            const x = left
              ? 230 + k * 5 + rand(i) * 10
              : 370 - k * 5 - rand(i) * 10;

            const y =
              470 +
              k * 6 +
              rand(i + 7) * 15;

            return (
              <g
                key={i}
                transform={`translate(${x} ${y}) rotate(${
                  rand(i) * 80 - 40
                })`}
              >
                <ellipse
                  className="loop"
                  rx="6"
                  ry="9"
                  stroke={
                    left
                      ? "var(--neon-blue)"
                      : "var(--neon-pink)"
                  }
                  style={{
                    "--d": `${
                      1.8 + rand(i + 3) * 0.6
                    }s`,
                  }}
                />
              </g>
            );
          })}

          {/* Flowers */}
          {FLOWERS.map((flower, i) => (
            <Flower
              key={i}
              {...flower}
              i={i}
            />
          ))}

        </g>
      </svg>

    </main>
  );
}

export default App;