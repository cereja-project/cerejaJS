import { Alert, useObjectUrl, fileMime, useMediaConfig } from "@cereja-project/ui-core";
import { MediaFileInfo } from "./MediaFileInfo";
import { Image } from "../images/Image";
import { AudioPlayer } from "../player/AudioPlayer";
import { VideoPlayer } from "../player/VideoPlayer";
export function MediaPreview({
  file,
  alt,
  label,
}: {
  file: File | null;
  alt?: string;
  label?: string;
}) {
  const { labels } = useMediaConfig();
  const mime = file ? fileMime(file) : "",
    kind =
      mime.startsWith("image/") && mime !== "image/svg+xml"
        ? "image"
        : mime.startsWith("audio/")
          ? "audio"
          : mime.startsWith("video/")
            ? "video"
            : null;
  const canPreview = !!kind && (kind !== "image" || !!alt?.trim()),
    url = useObjectUrl(file && canPreview ? file : null);
  if (!file) return null;
  return (
    <section
      className="md-media-preview"
      aria-label={label ?? labels.mediaPreview}
    >
      <MediaFileInfo file={file} />
      {kind === "image" && !alt?.trim() ? (
        <Alert>{labels.previewAltRequired}</Alert>
      ) : !kind ? (
        <Alert>{labels.previewUnsupported}</Alert>
      ) : !url ? (
        <p role="status">{labels.loading}</p>
      ) : kind === "image" ? (
        <Image image={{ id: file.name, src: url, alt: alt! }} />
      ) : kind === "audio" ? (
        <AudioPlayer
          label={label ?? file.name}
          source={{ type: "file", src: url }}
        />
      ) : (
        <VideoPlayer
          label={label ?? file.name}
          source={{ type: "file", src: url }}
        />
      )}
    </section>
  );
}
