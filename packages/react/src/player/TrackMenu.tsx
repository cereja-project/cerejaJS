import { Menu, useMedia, useMediaConfig, type TrackInfo } from "@cereja-project/ui-core";
export function TrackMenu({ kind }: { kind: TrackInfo["kind"] }) {
  const { snapshot: s, execute } = useMedia(),
    { labels } = useMediaConfig();
  const tracks = s.tracks.filter((t) =>
    kind === "captions"
      ? ["captions", "subtitles"].includes(t.kind)
      : t.kind === kind,
  );
  const capable =
    kind === "captions"
      ? s.capabilities.captions
      : kind === "audio"
        ? s.capabilities.audioTracks
        : kind === "quality"
          ? s.capabilities.quality
          : s.capabilities.captions;
  if (!capable || !tracks.length) return null;
  const selected =
    kind === "captions"
      ? (s.selectedTrackIds.captions ?? s.selectedTrackIds.subtitles)
      : s.selectedTrackIds[kind];
  return (
    <Menu
      label={
        kind === "audio"
          ? labels.audioTrack
          : kind === "quality"
            ? labels.quality
            : labels.captions
      }
      items={[
        ...(kind === "captions"
          ? [
              {
                id: "off",
                label: labels.off,
                checked: !selected,
                onSelect: () =>
                  void execute({
                    type: "selectTrack",
                    kind: "captions",
                    id: null,
                  }),
              },
            ]
          : []),
        ...tracks.map((t) => ({
          id: t.id,
          label: t.label,
          checked: selected === t.id,
          onSelect: () =>
            void execute({ type: "selectTrack", kind: t.kind, id: t.id }),
        })),
      ]}
    />
  );
}
