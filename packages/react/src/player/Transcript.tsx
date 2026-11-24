import { useEffect, useRef, useState, useId } from "react";
import {
  Button,
  useMedia,
  useMediaConfig,
  type TranscriptCue,
} from "@cereja-project/ui-core";
import { formatTime } from "./format";
export function Transcript({
  cues,
  follow = false,
  headingLevel = 2,
}: {
  cues: TranscriptCue[];
  follow?: boolean;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}) {
  const { snapshot: s, execute } = useMedia(),
    { labels } = useMediaConfig();
  const [following, setFollowing] = useState(follow);
  const list = useRef<HTMLOListElement>(null),
    id = useId();
  const Heading = ("h" + headingLevel) as "h2" | "h3" | "h4" | "h5" | "h6";
  const active = cues.find(
    (c) =>
      Number.isFinite(c.start) &&
      c.start <= s.currentTime &&
      c.end > s.currentTime,
  )?.id;
  useEffect(() => {
    if (!following || !list.current) return;
    const node = list.current.querySelector<HTMLElement>(
      '[aria-current="true"]',
    );
    if (node) {
      const top = node.offsetTop - list.current.offsetTop;
      list.current.scrollTop = Math.max(0, top - list.current.clientHeight / 2);
    }
  }, [active, following]);
  return (
    <section className="md-transcript" aria-label={labels.transcript}>
      <Heading>{labels.transcript}</Heading>
      <label className="md-checkbox" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          checked={following}
          onChange={(e) => setFollowing(e.target.checked)}
        />
        {labels.followTranscript}
      </label>
      <ol ref={list}>
        {cues
          .filter(
            (c) =>
              Number.isFinite(c.start) &&
              Number.isFinite(c.end) &&
              c.start >= 0 &&
              c.end > c.start,
          )
          .map((c) => (
            <li key={c.id}>
              {s.capabilities.seek ? (
                <Button
                  aria-current={c.id === active ? "true" : undefined}
                  onClick={() => void execute({ type: "seek", time: c.start })}
                >
                  <span className="md-cue-time">{formatTime(c.start)}</span>{" "}
                  {c.text}
                </Button>
              ) : (
                <p>
                  <span className="md-cue-time">{formatTime(c.start)}</span>{" "}
                  {c.text}
                </p>
              )}
            </li>
          ))}
      </ol>
    </section>
  );
}
