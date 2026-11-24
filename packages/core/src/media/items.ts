import type { MediaSource } from "./types";
import type { ImageData } from "../images/types";
export interface MediaItem {
  id: string;
  title: string;
  description?: string;
  source?: MediaSource;
  image?: ImageData;
  meta?: string;
}
