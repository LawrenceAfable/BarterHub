import { useCallback } from "react";
import { loadLinksPreset } from "@tsparticles/preset-links";
import { Particles } from "@tsparticles/react";

export default function ParticleBackgrounds() {
  const particlesInit = useCallback(async (engine) => {
    await loadLinksPreset(engine); // ✅ load the links preset
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        preset: "links", // ✅ use preset
        fullScreen: { enable: true, zIndex: -1 },
        background: { color: "#ffffff" },
      }}
    />
  );
}
