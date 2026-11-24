import { useMediaConfig, fileMime } from "@cereja-project/ui-core";
export function MediaFileInfo({ file }: { file: File }) {
  const { labels, config } = useMediaConfig();
  const size =
    file.size < 1024
      ? `${file.size} B`
      : file.size < 1024 ** 2
        ? `${new Intl.NumberFormat(config.locale, { maximumFractionDigits: 1 }).format(file.size / 1024)} KB`
        : `${new Intl.NumberFormat(config.locale, { maximumFractionDigits: 1 }).format(file.size / 1024 ** 2)} MB`;
  return (
    <dl className="md-file-info">
      <div>
        <dt>{labels.fileName}</dt>
        <dd>{file.name}</dd>
      </div>
      <div>
        <dt>{labels.fileType}</dt>
        <dd>{fileMime(file) || labels.unknownType}</dd>
      </div>
      <div>
        <dt>{labels.fileSize}</dt>
        <dd>{size}</dd>
      </div>
    </dl>
  );
}
