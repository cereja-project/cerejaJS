import { useState } from "react";
import * as DS from "@cereja-project/ui-react";
import { autoAdapter } from "@cereja-project/ui-providers";
import { images, cues, chapters, media, tracks } from "../examples/data";
import { HlsExample } from "../examples/hls";
import { DashExample } from "../examples/dash";
import { YouTubeExample } from "../examples/youtube";
import { VimeoExample } from "../examples/vimeo";
import { HeadlessExample } from "../examples/headless";
import { DescriptionExample } from "../examples/description";
export type Variant = "default" | "disabled" | "invalid";
export function WidgetPreview({
  name,
  variant = "default",
}: {
  name: string;
  variant?: Variant;
}) {
  const [checked, setChecked] = useState(false),
    [value, setValue] = useState("one"),
    [text, setText] = useState(""),
    [number, setNumber] = useState(40),
    [page, setPage] = useState(1),
    [index, setIndex] = useState(0),
    [open, setOpen] = useState(false),
    [active, setActive] = useState<string | null>(null),
    [files, setFiles] = useState<File[]>([]),
    [selected, setSelected] = useState<string[]>([]),
    [action, setAction] = useState("");
  const disabled = variant === "disabled",
    error =
      variant === "invalid" ? "Este campo precisa ser revisado." : undefined;
  const items = images.map((image, i) => ({
    id: String(i),
    title: image.caption ?? `Mídia ${i + 1}`,
    image,
  }));
  const sources = [
    {
      id: "one",
      label: "Original",
      source: { type: "file" as const, src: media },
    },
    {
      id: "two",
      label: "Versão descrita",
      source: { type: "file" as const, src: "/fixtures/media/described.mp4" },
    },
  ];
  const video = (children?: React.ReactNode) => (
    <DS.VideoPlayer
      label="Vídeo de demonstração"
      source={{ type: "file", src: media }}
      tracks={tracks}
    >
      {children}
    </DS.VideoPlayer>
  );
  switch (name) {
    case "Field":
    case "Input":
      return (
        <DS.Field
          label="Nome"
          description="Um rótulo persistente e instruções associadas."
          error={error}
          required
        >
          <DS.Input
            disabled={disabled}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </DS.Field>
      );
    case "Textarea":
      return (
        <DS.Field label="Descrição" error={error}>
          <DS.Textarea
            disabled={disabled}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </DS.Field>
      );
    case "Select":
      return (
        <DS.Field label="Formato" error={error}>
          <DS.Select
            disabled={disabled}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          >
            <option value="one">Áudio</option>
            <option value="two">Vídeo</option>
          </DS.Select>
        </DS.Field>
      );
    case "Checkbox":
      return (
        <DS.Checkbox
          label="Incluir transcrição"
          disabled={disabled}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
      );
    case "RadioGroup":
      return (
        <DS.RadioGroup
          label="Qualidade"
          name="preview-quality"
          disabled={disabled}
          error={error}
          options={[
            { value: "one", label: "Padrão" },
            { value: "two", label: "Alta" },
          ]}
          value={value}
          onValueChange={setValue}
        />
      );
    case "Switch":
      return (
        <DS.Switch
          label="Ativar legendas"
          disabled={disabled}
          checked={checked}
          onCheckedChange={setChecked}
        />
      );
    case "Tabs":
      return (
        <DS.Tabs
          label="Conteúdo"
          items={[
            {
              value: "one",
              label: "Descrição",
              content: "Descrição da mídia.",
            },
            {
              value: "two",
              label: "Informações",
              content: "Informações complementares.",
              disabled,
            },
          ]}
          value={value}
          onValueChange={setValue}
        />
      );
    case "Accordion":
      return (
        <DS.Accordion
          items={[
            {
              id: "one",
              title: "Detalhes da mídia",
              content: "Informações que podem ser expandidas.",
              disabled,
            },
            {
              id: "two",
              title: "Licença do conteúdo",
              content: "Informe a licença do conteúdo disponibilizado.",
            },
          ]}
        />
      );
    case "Breadcrumbs":
      return (
        <DS.Breadcrumbs
          items={[
            { label: "Início", href: "/" },
            { label: "Biblioteca", href: "/#biblioteca" },
            { label: "Mídia atual" },
          ]}
        />
      );
    case "Pagination":
      return (
        <DS.Pagination page={page} pageCount={12} onPageChange={setPage} />
      );
    case "Alert":
      return (
        <DS.Alert
          title={variant === "invalid" ? "Revise o conteúdo" : "Informação"}
          tone={variant === "invalid" ? "error" : "info"}
        >
          Uma mensagem acompanhada de texto, sem depender somente de cor.
        </DS.Alert>
      );
    case "Progress":
      return (
        <>
          <DS.Slider
            label="Progresso"
            min={0}
            max={100}
            step={10}
            value={number}
            valueText={`${number}%`}
            onValueChange={setNumber}
          />
          <DS.Progress label="Processamento local demonstrado" value={number} />
        </>
      );
    case "Skeleton":
      return <DS.Skeleton label="Carregando mídia" height="8rem" />;
    case "EmptyState":
      return (
        <>
          <DS.EmptyState
            title="Nenhum resultado"
            description="Altere os termos da busca."
            action={
              <DS.Button onClick={() => setAction("Busca limpa.")}>
                Limpar busca
              </DS.Button>
            }
          />
          {action && <DS.Status>{action}</DS.Status>}
        </>
      );
    case "Card":
      return (
        <DS.Card>
          <p>Informações agrupadas em um cartão.</p>
          <DS.Button onClick={() => setAction("Ação do cartão executada.")}>
            Executar ação
          </DS.Button>
          {action && <DS.Status>{action}</DS.Status>}
        </DS.Card>
      );
    case "Separator":
      return (
        <>
          <p>Primeira seção</p>
          <DS.Separator decorative={false} />
          <p>Segunda seção</p>
        </>
      );
    case "MediaCard":
      return (
        <>
          <DS.MediaCard
            item={items[0]}
            selected={checked}
            onSelect={setChecked}
            action={
              <DS.Button
                onClick={() => setAction("Mídia selecionada para abrir.")}
              >
                Abrir mídia
              </DS.Button>
            }
          />
          {action && <DS.Status>{action}</DS.Status>}
        </>
      );
    case "MediaGrid":
      return (
        <DS.MediaGrid
          items={items}
          selectedIds={selected}
          onSelectionChange={setSelected}
        />
      );
    case "MediaList":
      return (
        <DS.MediaList
          items={items}
          selectedIds={selected}
          onSelectionChange={setSelected}
        />
      );
    case "Carousel":
      return (
        <DS.Carousel
          label="Paisagens"
          items={images}
          index={index}
          onIndexChange={setIndex}
        />
      );
    case "ImageComparison":
      return (
        <DS.ImageComparison
          label="Comparar paisagens"
          before={images[0]}
          after={images[1]}
        />
      );
    case "Image":
      return <DS.Image image={images[0]} />;
    case "Figure":
      return <DS.Figure image={images[0]} />;
    case "Gallery":
      return <DS.Gallery items={images} />;
    case "ImageViewer":
      return (
        <>
          <DS.Button onClick={() => setActive(images[0].id)}>
            Abrir visualizador
          </DS.Button>
          <DS.ImageViewer
            items={images}
            activeId={active}
            onActiveChange={setActive}
          />
        </>
      );
    case "VideoPlayer":
      return video();
    case "AudioPlayer":
      return (
        <DS.AudioPlayer
          label="Áudio de demonstração"
          source={{ type: "file", src: "/fixtures/media/sample.mp3" }}
        />
      );
    case "CompactAudioPlayer":
      return (
        <DS.CompactAudioPlayer
          label="Áudio compacto"
          source={{ type: "file", src: "/fixtures/media/sample.mp3" }}
        />
      );
    case "SourceSelector":
      return (
        <>
          <DS.SourceSelector
            sources={sources}
            value={value}
            onValueChange={setValue}
          />
          <DS.Status>
            Fonte selecionada: {sources.find((s) => s.id === value)?.label}
          </DS.Status>
        </>
      );
    case "MediaSourcePlayer":
      return (
        <DS.MediaSourcePlayer
          label="Seleção de versão"
          sources={sources}
          value={value}
          onValueChange={setValue}
        />
      );
    case "SeekBackButton":
      return video(<DS.SeekBackButton />);
    case "SeekForwardButton":
      return video(<DS.SeekForwardButton seconds={10} />);
    case "TranscriptSearch":
      return video(<DS.TranscriptSearch cues={cues} />);
    case "Transcript":
      return video(<DS.Transcript cues={cues} />);
    case "ChapterList":
      return video(<DS.ChapterList chapters={chapters} />);
    case "ChapterMenu":
      return (
        <DS.VideoPlayer
          label="Capítulos"
          source={{ type: "file", src: media }}
          chapters={chapters}
        />
      );
    case "CaptionMenu":
    case "TrackMenu":
      return video();
    case "DescriptionToggle":
      return <DescriptionExample />;
    case "PlayerControls":
      return (
        <DS.MediaRoot
          kind="video"
          source={{ type: "file", src: media }}
          adapterFactory={autoAdapter}
        >
          <div className="md-player" data-media-player>
            <DS.MediaHost className="md-media-host" />
            <DS.PlayerControls />
          </div>
        </DS.MediaRoot>
      );
    case "SeekControl":
      return video(<DS.SeekControl />);
    case "VolumeControl":
      return video(<DS.VolumeControl />);
    case "TimeDisplay":
      return video(<DS.TimeDisplay />);
    case "LiveControl":
      return <HlsExample live />;
    case "Playlist":
      return (
        <>
          <DS.Playlist
            items={sources.map((s) => ({
              id: s.id,
              title: s.label,
              source: s.source,
            }))}
            activeId={value}
            onSelect={setValue}
          />
          <DS.Status>Selecionado: {value}</DS.Status>
        </>
      );
    case "FilePicker":
      return (
        <DS.FilePicker
          label="Selecionar arquivos"
          files={files}
          onFilesChange={setFiles}
          disabled={disabled}
          multiple
          accept="image/*,audio/*,video/*"
          maxFiles={3}
          maxSizeBytes={5 * 1024 * 1024}
        />
      );
    case "MediaPreview":
      return (
        <>
          <DS.FilePicker
            label="Selecionar uma mídia"
            files={files}
            onFilesChange={setFiles}
            accept="image/*,audio/*,video/*"
          />
          <DS.Field label="Texto alternativo para imagem">
            <DS.Input value={text} onChange={(e) => setText(e.target.value)} />
          </DS.Field>
          <DS.MediaPreview file={files[0] ?? null} alt={text} />
        </>
      );
    case "MediaFileInfo":
      return (
        <DS.MediaFileInfo
          file={
            new File(["Amostra local"], "amostra.txt", { type: "text/plain" })
          }
        />
      );
    case "MediaLoading":
      return <DS.MediaLoading />;
    case "MediaUnavailable":
      return <DS.MediaUnavailable />;
    case "MediaErrorState":
      return (
        <>
          <DS.MediaErrorState
            onRetry={() => setAction("Nova tentativa solicitada localmente.")}
          />
          {action && <DS.Status>{action}</DS.Status>}
        </>
      );
    case "Button":
      return (
        <>
          <DS.Button
            disabled={disabled}
            onClick={() => setAction("Ação executada.")}
          >
            Executar ação
          </DS.Button>
          {action && <DS.Status>{action}</DS.Status>}
        </>
      );
    case "IconButton":
      return (
        <DS.IconButton
          disabled={disabled}
          label="Favoritar mídia"
          aria-pressed={checked}
          onClick={() => setChecked((v) => !v)}
        >
          {checked ? "★" : "☆"}
        </DS.IconButton>
      );
    case "Slider":
      return (
        <DS.Slider
          label="Volume de exemplo"
          min={0}
          max={100}
          step={5}
          value={number}
          valueText={`${number}%`}
          onValueChange={setNumber}
          disabled={disabled}
        />
      );
    case "Menu":
      return (
        <>
          <DS.Menu
            label="Ações"
            items={[
              {
                id: "save",
                label: "Marcar como favorita",
                onSelect: () => setAction("Mídia marcada como favorita."),
              },
              {
                id: "remove",
                label: "Remover marcação",
                onSelect: () => setAction("Marcação removida."),
              },
            ]}
          />
          {action && <DS.Status>{action}</DS.Status>}
        </>
      );
    case "Tooltip":
      return (
        <DS.Tooltip content="Adicionar aos favoritos">
          <DS.IconButton
            label="Adicionar aos favoritos"
            aria-pressed={checked}
            onClick={() => setChecked((v) => !v)}
          >
            ☆
          </DS.IconButton>
        </DS.Tooltip>
      );
    case "Dialog":
      return (
        <DS.Dialog
          title="Detalhes"
          description="Informações complementares da mídia."
          open={open}
          onOpenChange={setOpen}
          trigger={<DS.Button>Abrir diálogo</DS.Button>}
        >
          <p>Escape fecha e devolve o foco ao acionador.</p>
        </DS.Dialog>
      );
    case "VisuallyHidden":
      return (
        <>
          <DS.Button onClick={() => setAction("Ação acessível executada.")}>
            <span aria-hidden="true">☆</span>
            <DS.VisuallyHidden>Favoritar mídia</DS.VisuallyHidden>
          </DS.Button>
          {action && <DS.Status>{action}</DS.Status>}
        </>
      );
    case "Status":
      return (
        <>
          <DS.Button
            onClick={() => setAction("Preferências salvas localmente.")}
          >
            Salvar preferências
          </DS.Button>
          <DS.Status>{action}</DS.Status>
        </>
      );
    case "MediaRoot":
      return <HeadlessExample />;
    case "HLS":
      return <HlsExample />;
    case "DASH":
      return <DashExample />;
    case "YouTube":
      return <YouTubeExample />;
    case "Vimeo":
      return <VimeoExample />;
    default:
      return <DS.MediaUnavailable />;
  }
}
