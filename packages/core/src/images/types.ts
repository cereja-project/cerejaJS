export type ImageData = {
  id: string;
  src: string;
  caption?: string;
  description?: string;
} & ({ decorative: true; alt?: never } | { decorative?: false; alt: string });
