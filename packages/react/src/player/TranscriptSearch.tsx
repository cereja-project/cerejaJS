import { useState } from "react";
import {
  Field,
  Input,
  EmptyState,
  useMediaConfig,
  type TranscriptCue,
} from "@cereja-project/ui-core";
import { Transcript } from "./Transcript";
const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase();
export function TranscriptSearch({ cues }: { cues: TranscriptCue[] }) {
  const [query, setQuery] = useState("");
  const { labels } = useMediaConfig(),
    search = normalize(query.trim()),
    results = cues.filter((c) => normalize(c.text).includes(search));
  return (
    <section
      className="md-transcript-search"
      aria-label={labels.searchTranscript}
    >
      <Field label={labels.searchTranscript}>
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Field>
      <p role="status">
        {results.length} {labels.transcriptResults}
      </p>
      {results.length ? (
        <Transcript cues={results} />
      ) : (
        <EmptyState title={labels.noTranscriptResults} />
      )}
    </section>
  );
}
