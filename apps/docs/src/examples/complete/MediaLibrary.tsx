import { useState } from "react";
import {
  Field,
  Input,
  RadioGroup,
  MediaGrid,
  MediaList,
  Pagination,
  Button,
  Dialog,
  Figure,
  type MediaItem,
} from "@cereja-project/ui-react";
import { images } from "../data";
export function MediaLibrary() {
  const all: MediaItem[] = Array.from({ length: 9 }, (_, i) => ({
    id: String(i + 1),
    title: `Paisagem ${i + 1}`,
    image: images[i % images.length],
    description: "Ilustração de demonstração",
    meta: "Imagem · SVG",
  }));
  const [query, setQuery] = useState(""),
    [page, setPage] = useState(1),
    [layout, setLayout] = useState("grid"),
    [selected, setSelected] = useState<string[]>([]),
    [active, setActive] = useState<MediaItem | null>(null);
  const filtered = all.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase()),
    ),
    count = Math.ceil(filtered.length / 3),
    current = Math.min(page, Math.max(1, count)),
    visible = filtered.slice((current - 1) * 3, current * 3),
    Collection = layout === "grid" ? MediaGrid : MediaList;
  return (
    <div className="example-stack">
      <Field label="Buscar mídia">
        <Input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
      </Field>
      <RadioGroup
        name="library-layout"
        label="Visualização"
        value={layout}
        onValueChange={setLayout}
        options={[
          { value: "grid", label: "Grade" },
          { value: "list", label: "Lista" },
        ]}
      />
      <p role="status">{selected.length} mídias selecionadas</p>
      <Button disabled={!selected.length} onClick={() => setSelected([])}>
        Limpar seleção
      </Button>
      <Collection
        items={visible}
        selectedIds={selected}
        onSelectionChange={(ids) =>
          setSelected((previous) => [
            ...previous.filter((id) => !visible.some((item) => item.id === id)),
            ...ids,
          ])
        }
        renderAction={(item) => (
          <Button onClick={() => setActive(item)}>Abrir {item.title}</Button>
        )}
      />
      <Pagination page={current} pageCount={count} onPageChange={setPage} />
      <Dialog
        title={active?.title ?? "Mídia"}
        open={!!active}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      >
        {active?.image && <Figure image={active.image} />}
      </Dialog>
    </div>
  );
}
