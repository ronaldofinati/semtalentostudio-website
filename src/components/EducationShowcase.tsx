"use client";

import { ImagensColorirSection } from "@/components/ImagensColorirSection";
import { QuimicaLabSection } from "@/components/QuimicaLabSection";
import { JogoDamasSection } from "@/components/JogoDamasSection";
import { JogoXadrezSection } from "@/components/JogoXadrezSection";
import { SimuladorEducacionalSection } from "@/components/SimuladorEducacionalSection";
import { useToolHashSync } from "@/hooks/useToolHashSync";

type ActiveTool =
  | "imagens-colorir"
  | "simulador-educacional"
  | "quimica-lab"
  | "jogo-damas"
  | "jogo-xadrez";

function hashToTool(hash: string): ActiveTool | null {
  if (hash === "#imagens-colorir") return "imagens-colorir";
  if (hash === "#simulador-educacional") return "simulador-educacional";
  if (hash === "#quimica-lab") return "quimica-lab";
  if (hash === "#jogo-damas") return "jogo-damas";
  if (hash === "#jogo-xadrez") return "jogo-xadrez";
  return null;
}

export function EducationShowcase() {
  const { active, setTool } = useToolHashSync<ActiveTool>({
    hashToTool,
  });

  if (active === "imagens-colorir") {
    return (
      <ImagensColorirSection
        forceOpen
        onOpenChange={(open) => setTool(open ? "imagens-colorir" : null)}
      />
    );
  }

  if (active === "simulador-educacional") {
    return (
      <SimuladorEducacionalSection
        forceOpen
        onOpenChange={(open) =>
          setTool(open ? "simulador-educacional" : null)
        }
      />
    );
  }

  if (active === "quimica-lab") {
    return (
      <QuimicaLabSection
        forceOpen
        onOpenChange={(open) => setTool(open ? "quimica-lab" : null)}
      />
    );
  }

  if (active === "jogo-damas") {
    return (
      <JogoDamasSection
        forceOpen
        onOpenChange={(open) => setTool(open ? "jogo-damas" : null)}
      />
    );
  }

  if (active === "jogo-xadrez") {
    return (
      <JogoXadrezSection
        forceOpen
        onOpenChange={(open) => setTool(open ? "jogo-xadrez" : null)}
      />
    );
  }

  return (
    <div className="grid auto-rows-fr gap-6 sm:grid-cols-2">
      <ImagensColorirSection
        onOpenChange={(open) => setTool(open ? "imagens-colorir" : null)}
      />
      <SimuladorEducacionalSection
        onOpenChange={(open) =>
          setTool(open ? "simulador-educacional" : null)
        }
      />
      <QuimicaLabSection
        onOpenChange={(open) => setTool(open ? "quimica-lab" : null)}
      />
      <JogoDamasSection
        onOpenChange={(open) => setTool(open ? "jogo-damas" : null)}
      />
      <JogoXadrezSection
        onOpenChange={(open) => setTool(open ? "jogo-xadrez" : null)}
      />
    </div>
  );
}