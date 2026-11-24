import type { ImageData, TranscriptCue, Chapter } from "@cereja-project/ui-react";
export const media = "/fixtures/media/sample.mp4";
export const tracks = [
  {
    id: "pt",
    src: "/fixtures/tracks/sample.vtt",
    language: "pt-BR",
    label: "Português — sons de teste",
    kind: "captions" as const,
    default: true,
  },
];
export const cues: TranscriptCue[] = [
  {
    id: "one",
    start: 0,
    end: 5,
    text: "Um tom contínuo acompanha um padrão visual de teste.",
  },
  {
    id: "two",
    start: 5,
    end: 12,
    text: "O padrão continua em movimento até o final do arquivo.",
  },
];
export const chapters: Chapter[] = [
  { id: "start", start: 0, title: "Início do teste" },
  { id: "middle", start: 5, title: "Segundo trecho" },
];
export const images: ImageData[] = [
  {
    id: "mountains",
    src: "/illustrations/mountains.svg",
    alt: "Ilustração de duas montanhas com neve nos picos e um sol ao fundo.",
    caption: "Montanhas",
    description: "Formas geométricas em tons neutros compõem a paisagem.",
  },
  {
    id: "coast",
    src: "/illustrations/coast.svg",
    alt: "Ilustração de um barco à vela próximo de uma faixa de areia.",
    caption: "Litoral",
  },
  {
    id: "forest",
    src: "/illustrations/forest.svg",
    alt: "Ilustração de três árvores entre colinas, sob um céu claro.",
    caption: "Floresta",
  },
];
