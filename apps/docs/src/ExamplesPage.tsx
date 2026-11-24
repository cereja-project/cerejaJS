import { useState } from "react";
import { Button, Tabs } from "@cereja-project/ui-react";
import { Podcast } from "./examples/complete/Podcast";
import { Lesson } from "./examples/complete/Lesson";
import { MediaLibrary } from "./examples/complete/MediaLibrary";
import { ProductGallery } from "./examples/complete/ProductGallery";
import { AccessibleForm } from "./examples/complete/AccessibleForm";
import { LocalFiles } from "./examples/complete/LocalFiles";
import { Preferences } from "./examples/complete/Preferences";
import { ThemeComposition } from "./examples/complete/ThemeComposition";
import { States } from "./examples/complete/States";
import podcastTS from "./examples/complete/Podcast.tsx?raw";
import podcastJS from "./examples/complete/Podcast-js.jsx?raw";
import lessonTS from "./examples/complete/Lesson.tsx?raw";
import lessonJS from "./examples/complete/Lesson-js.jsx?raw";
import libraryTS from "./examples/complete/MediaLibrary.tsx?raw";
import libraryJS from "./examples/complete/MediaLibrary-js.jsx?raw";
import galleryTS from "./examples/complete/ProductGallery.tsx?raw";
import galleryJS from "./examples/complete/ProductGallery-js.jsx?raw";
import formTS from "./examples/complete/AccessibleForm.tsx?raw";
import formJS from "./examples/complete/AccessibleForm-js.jsx?raw";
import filesTS from "./examples/complete/LocalFiles.tsx?raw";
import filesJS from "./examples/complete/LocalFiles-js.jsx?raw";
import preferencesTS from "./examples/complete/Preferences.tsx?raw";
import preferencesJS from "./examples/complete/Preferences-js.jsx?raw";
import themeTS from "./examples/complete/ThemeComposition.tsx?raw";
import themeJS from "./examples/complete/ThemeComposition-js.jsx?raw";
import statesTS from "./examples/complete/States.tsx?raw";
import statesJS from "./examples/complete/States-js.jsx?raw";
const examples = [
  {
    id: "podcast",
    title: "Podcast",
    description: "Player compacto, episódios e busca na transcrição.",
    Component: Podcast,
    tsx: podcastTS,
    jsx: podcastJS,
  },
  {
    id: "lesson",
    title: "Aula acessível",
    description:
      "Capítulos, legendas, transcrição e versão com audiodescrição.",
    Component: Lesson,
    tsx: lessonTS,
    jsx: lessonJS,
  },
  {
    id: "library",
    title: "Biblioteca de mídia",
    description:
      "Busca, seleção, grade/lista, paginação e detalhes em diálogo.",
    Component: MediaLibrary,
    tsx: libraryTS,
    jsx: libraryJS,
  },
  {
    id: "gallery",
    title: "Galeria de produto",
    description: "Carrossel manual, ampliação e comparação de imagens.",
    Component: ProductGallery,
    tsx: galleryTS,
    jsx: galleryJS,
  },
  {
    id: "form",
    title: "Formulário acessível",
    description: "Campos, resumo de erros com links e confirmação local.",
    Component: AccessibleForm,
    tsx: formTS,
    jsx: formJS,
  },
  {
    id: "files",
    title: "Arquivos locais",
    description: "Seleção, limites, remoção e prévias sem upload.",
    Component: LocalFiles,
    tsx: filesTS,
    jsx: filesJS,
  },
  {
    id: "preferences",
    title: "Preferências",
    description: "Abas, acordeão e escolhas com estado compartilhado.",
    Component: Preferences,
    tsx: preferencesTS,
    jsx: preferencesJS,
  },
  {
    id: "theme",
    title: "Temas e composição",
    description: "Tokens, tradução e comportamento sem estilos.",
    Component: ThemeComposition,
    tsx: themeTS,
    jsx: themeJS,
  },
  {
    id: "states",
    title: "Estados da interface",
    description: "Carregamento, ausência de conteúdo, erro e recuperação.",
    Component: States,
    tsx: statesTS,
    jsx: statesJS,
  },
];
export function ExamplesPage() {
  const [active, setActive] = useState<string | null>(null);
  const example = examples.find((e) => e.id === active);
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">COMPOSIÇÕES / FLUXOS COMPLETOS</p>
        <h1>Exemplos completos</h1>
        <p>
          Veja como combinar componentes. Para começar com uma API, consulte o
          exemplo básico no catálogo.
        </p>
      </div>
      <div className="example-picker">
        {examples.map((e) => (
          <Button
            key={e.id}
            aria-label={`Abrir ${e.title}`}
            aria-pressed={active === e.id}
            onClick={() => setActive(e.id)}
          >
            {e.title}
          </Button>
        ))}
      </div>
      {example ? (
        <>
          <div className="preview-card">
            <header className="preview-heading">
              <h2>{example.title}</h2>
            </header>
            <div className="preview-body">
              <p className="example-description">{example.description}</p>
              <example.Component key={example.id} />
            </div>
          </div>
          <section className="docs-code">
            <h2>Código</h2>
            <Tabs
              label="Código do exemplo completo"
              defaultValue="tsx"
              items={[
                {
                  value: "tsx",
                  label: "TSX",
                  content: (
                    <pre tabIndex={0} aria-label="Código do exemplo completo">
                      <code>{example.tsx}</code>
                    </pre>
                  ),
                },
                {
                  value: "jsx",
                  label: "JSX",
                  content: (
                    <pre tabIndex={0} aria-label="Código do exemplo completo">
                      <code>{example.jsx}</code>
                    </pre>
                  ),
                },
              ]}
            />
          </section>
        </>
      ) : (
        <div className="example-cards">
          {examples.map((e) => (
            <article className="catalog-card" key={e.id}>
              <h2>{e.title}</h2>
              <p>{e.description}</p>
              <Button onClick={() => setActive(e.id)}>
                Explorar {e.title}
              </Button>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
