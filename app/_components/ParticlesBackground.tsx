'use client';

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticlesBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Particles
        id="tsparticles"
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 120,
          interactivity: { 
            events: { onHover: { enable: true, mode: "grab" } }, 
            modes: { grab: { distance: 150, links: { opacity: 0.5 } } } 
          },
          particles: {
            color: { value: "#3498db" },
            links: { color: "#3498db", distance: 140, enable: true, opacity: 0.15, width: 1 },
            move: { enable: true, speed: 1.5, direction: "none", random: true, straight: false, outModes: { default: "out" } },
            number: { density: { enable: true, width: 800, height: 800 }, value: 50 },
            opacity: { value: 0.3 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
