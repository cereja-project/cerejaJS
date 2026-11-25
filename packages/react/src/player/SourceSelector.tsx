import {
  Field,
  Select,
  useMediaConfig,
  type MediaSource,
} from "@cereja-project/ui-core";
export interface SourceOption {
  id: string;
  label: string;
  source: MediaSource;
}
export function SourceSelector({
  sources,
  value,
  onValueChange,
}: {
  sources: SourceOption[];
  value: string;
  onValueChange: (id: string) => void;
}) {
  const { labels } = useMediaConfig();
  return (
    <Field label={labels.mediaSource}>
      <Select
        value={value}
        disabled={!sources.length}
        onChange={(e) => onValueChange(e.target.value)}
      >
        {sources.map((source) => (
          <option key={source.id} value={source.id}>
            {source.label}
          </option>
        ))}
      </Select>
    </Field>
  );
}
