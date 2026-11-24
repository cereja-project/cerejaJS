import { useState, useEffect, useRef, type MutableRefObject } from "react";
import {
  MediaRoot,
  Button,
  Status,
  useMedia,
  useMediaConfig,
  usePositionRestore,
  type PositionRestoreRequest,
  type PlayerProps,
  type AdapterFactory,
} from "@cereja-project/ui-core";
import { autoAdapter } from "@cereja-project/ui-providers";
import { PlayerKeyboard } from "./PlayerKeyboard";
import { PlayerControls } from "./PlayerControls";
import { MediaViewport } from "./MediaViewport";
import { Transcript } from "./Transcript";
import { CaptionMenu } from "./CaptionMenu";
import { TrackMenu } from "./TrackMenu";
import { ChapterMenu } from "./ChapterMenu";
import { DescriptionToggle } from "./DescriptionToggle";
type Resume = PositionRestoreRequest | null;
function PlayerBody({
  props,
  retry,
  described,
  onDescribe,
  pending,
  focusRequest,
  descriptionFocus,
}: {
  props: PlayerProps;
  retry: () => void;
  described: boolean;
  onDescribe: () => void;
  pending: MutableRefObject<Resume>;
  focusRequest: MutableRefObject<boolean>;
  descriptionFocus: MutableRefObject<boolean>;
}) {
  const { snapshot: s, execute } = useMedia(),
    { labels, config } = useMediaConfig();
  const titleRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    descriptionFocus.current = false;
  }, [descriptionFocus]);
  useEffect(() => {
    if (!focusRequest.current || s.status === "loading") return;
    focusRequest.current = false;
    if (
      document.activeElement === document.body ||
      document.activeElement === document.documentElement
    ) {
      const region = titleRef.current?.closest("[data-media-player]");
      const target =
        region?.querySelector<HTMLButtonElement>(
          "[data-media-play]:not(:disabled)",
        ) ?? region?.querySelector<HTMLButtonElement>("button:not(:disabled)");
      target?.focus();
    }
  }, [s.status, focusRequest]);
  const [restoreFailed, setRestoreFailed] = useState(false);
  useEffect(() => props.onSnapshot?.(s), [s, props.onSnapshot]);
  usePositionRestore({
    requestRef: pending,
    snapshot: s,
    execute,
    timeout: config.positionRestoreTimeout,
    onUnavailable: () => setRestoreFailed(true),
    sourceKey: JSON.stringify(
      described && props.describedSource ? props.describedSource : props.source,
    ),
  });
  function toggleDescription() {
    pending.current = {
      time: pending.current?.time ?? s.currentTime,
      playing:
        pending.current?.playing ??
        (!s.paused && (s.status === "playing" || s.status === "buffering")),
    };
    onDescribe();
  }
  return (
    <>
      <p className="md-player-title" ref={titleRef}>
        {props.label}
      </p>
      <MediaViewport
        label={props.label}
        poster={props.poster}
        tracks={
          described ? (props.describedTracks ?? props.tracks) : props.tracks
        }
      />
      {["youtube", "vimeo"].includes(props.source.type) && (
        <p className="md-provider-note">{labels.providerControls}</p>
      )}
      <PlayerControls />
      <div className="md-actions md-extra-controls">
        <CaptionMenu />
        <TrackMenu kind="audio" />
        <TrackMenu kind="quality" />
        {props.chapters && <ChapterMenu chapters={props.chapters} />}{" "}
        {props.describedSource && (
          <DescriptionToggle
            autoFocus={descriptionFocus.current}
            enabled={described}
            onToggle={toggleDescription}
          />
        )}
      </div>
      {restoreFailed ? (
        <Status>{labels.positionRestoreUnavailable}</Status>
      ) : (
        described && <Status>{labels.descriptionNotice}</Status>
      )}
      {s.status === "error" && <Button onClick={retry}>{labels.retry}</Button>}
      {props.transcript && <Transcript cues={props.transcript} />}
      {props.children}
    </>
  );
}
function Session({
  kind,
  adapterFactory = autoAdapter,
  ...props
}: PlayerProps & { kind: "audio" | "video"; adapterFactory?: AdapterFactory }) {
  const { labels } = useMediaConfig();
  const [loaded, setLoaded] = useState(props.loadStrategy !== "on-interaction"),
    [attempt, setAttempt] = useState(0),
    [described, setDescribed] = useState(false);
  const internalPending = useRef<Resume>(null);
  const pending = props.positionRestoreRef ?? internalPending;
  const focusRequest = useRef(false);
  const descriptionFocus = useRef(false);
  if (!loaded)
    return (
      <section className="md-player" aria-label={props.label}>
        <p className="md-player-title">{props.label}</p>
        <p>{labels.externalNotice}</p>
        <Button
          onClick={() => {
            focusRequest.current = true;
            setLoaded(true);
          }}
        >
          {labels.load}
        </Button>
      </section>
    );
  return (
    <MediaRoot
      key={`${attempt}:${described}`}
      source={
        described && props.describedSource
          ? props.describedSource
          : props.source
      }
      kind={kind}
      adapterFactory={adapterFactory}
      onError={props.onError}
    >
      <PlayerKeyboard label={props.label} shortcuts={props.shortcuts}>
        <PlayerBody
          props={props}
          retry={() => {
            focusRequest.current = true;
            setAttempt((x) => x + 1);
          }}
          described={described}
          onDescribe={() => {
            descriptionFocus.current = true;
            setDescribed((x) => !x);
          }}
          pending={pending}
          focusRequest={focusRequest}
          descriptionFocus={descriptionFocus}
        />
      </PlayerKeyboard>
    </MediaRoot>
  );
}
export function Player(
  props: PlayerProps & {
    kind: "audio" | "video";
    adapterFactory?: AdapterFactory;
  },
) {
  return <Session key={JSON.stringify(props.source)} {...props} />;
}
