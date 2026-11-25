import { useEffect, useRef, useState } from "react";
import { Button, Field, Input, Alert, Card } from "@cereja-project/ui-react";
import { catalog, groups } from "./catalog/registry";
import { ComponentPage } from "./ComponentPage";
import { ExamplesPage } from "./ExamplesPage";
import { ThemeExample } from "./examples/theme";
function Accessibility() {
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">QUALIDADE / ACESSIBILIDADE</p>
        <h1>Acessibilidade e evidências</h1>
        <p>
          Objetivo WCAG 2.2 AA. Verificações automatizadas e avaliação manual
          são evidências complementares.
        </p>
      </div>
      <Alert title="Versão candidata">
        Leitores de tela, reprodução real, fullscreen, zoom e contraste
        renderizado precisam da matriz manual. Um teste indisponível permanece
        pendente.
      </Alert>
      <div className="detail-grid">
        <article>
          <h2>Comportamento</h2>
          <p>
            Rótulos, instruções e erros associados; controle por teclado; foco
            gerenciado; alternativas às interações de arrastar.
          </p>
        </article>
        <article>
          <h2>Conteúdo e tema</h2>
          <p>
            Quem integra fornece textos alternativos, legendas e audiodescrição
            e preserva o contraste ao mudar as cores.
          </p>
        </article>
      </div>
      <h2>Roteiro de validação</h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Verificação</th>
              <th>Registro</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Comportamento, tipos e semântica automatizada</td>
              <td>docs/accessibility e testes do projeto</td>
            </tr>
            <tr>
              <td>Pacotes JSX, TSX e SSR</td>
              <td>docs/compatibility/consumers.json</td>
            </tr>
            <tr>
              <td>Navegadores reais e provedores</td>
              <td>
                Resultados registrados separadamente, sem presumir aprovação
              </td>
            </tr>
            <tr>
              <td>NVDA, VoiceOver e TalkBack</td>
              <td>Validação manual pendente</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
export function App() {
  const [page, setPage] = useState("catalog"),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("all");
  const main = useRef<HTMLElement>(null),
    navigated = useRef(false);
  const entry = catalog.find((item) => item.id === page);
  useEffect(() => {
    if (navigated.current) main.current?.focus();
  }, [page]);
  function navigate(id: string) {
    navigated.current = true;
    setPage(id);
  }
  const results = catalog.filter(
    (item) =>
      (filter === "all" || item.group === filter) &&
      `${item.name} ${item.description}`
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase()),
  );
  return (
    <div className="docs-layout">
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo
      </a>
      <aside className="docs-sidebar">
        <a
          className="docs-brand"
          href="#main-content"
          onClick={() => navigate("catalog")}
        >
          <span className="brand-symbol" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span>
            Cereja <span className="brand-light">UI</span>
          </span>
        </a>
        <p className="docs-tagline">
          Componentes React para interfaces e mídia.
        </p>
        <nav className="catalog-nav" aria-label="Documentação">
          <div className="nav-group">
            <Button
              aria-current={page === "catalog" ? "page" : undefined}
              onClick={() => navigate("catalog")}
            >
              Catálogo
            </Button>
            <Button
              aria-current={page === "examples" ? "page" : undefined}
              onClick={() => navigate("examples")}
            >
              Exemplos completos
            </Button>
            <Button
              aria-current={page === "theme" ? "page" : undefined}
              onClick={() => navigate("theme")}
            >
              Personalização
            </Button>
            <Button
              aria-current={page === "accessibility" ? "page" : undefined}
              onClick={() => navigate("accessibility")}
            >
              Acessibilidade
            </Button>
          </div>
          {groups.map((group) => (
            <details
              className="catalog-nav-group"
              key={group}
              open={entry?.group === group}
            >
              <summary>
                {group}
                <span>
                  {catalog.filter((item) => item.group === group).length}
                </span>
              </summary>
              <div className="nav-group">
                {catalog
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <Button
                      key={item.id}
                      aria-current={page === item.id ? "page" : undefined}
                      onClick={() => navigate(item.id)}
                    >
                      {item.name}
                    </Button>
                  ))}
              </div>
            </details>
          ))}
        </nav>
        <div className="sidebar-foot">
          <span className="version-pill">v0.2.0 · candidata</span>
          <p>React · JavaScript · TypeScript</p>
        </div>
      </aside>
      <div className="docs-content">
        <header className="docs-topbar">
          <span>
            Documentação /{" "}
            {entry?.name ??
              (page === "examples"
                ? "Exemplos completos"
                : page === "theme"
                  ? "Personalização"
                  : page === "accessibility"
                    ? "Acessibilidade"
                    : "Catálogo")}
          </span>
          <span className="topbar-note">Documentação v0.2</span>
        </header>
        <main id="main-content" ref={main} tabIndex={-1}>
          {page === "catalog" ? (
            <>
              <div className="page-heading">
                <p className="eyebrow">BIBLIOTECA REACT / VERSÃO 0.2</p>
                <h1>Construa com Cereja UI</h1>
                <p>
                  Explore os componentes, teste os exemplos e copie o código
                  para sua aplicação.
                </p>
                <div className="feature-tags">
                  <span>
                    {catalog.filter((c) => c.group !== "Integrações").length}{" "}
                    componentes documentados
                  </span>
                  <span>9 fluxos completos</span>
                  <span>JSX + TSX</span>
                </div>
              </div>
              <div className="catalog-search">
                <Field label="Buscar componentes">
                  <Input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Nome ou funcionalidade"
                  />
                </Field>
                <label className="docs-field">
                  Categoria
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">Todas as categorias</option>
                    {groups.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="catalog-count" role="status">
                {results.length} entradas encontradas
              </p>
              <div className="catalog-grid">
                {results.map((item) => (
                  <article className="catalog-card" key={item.id}>
                    <p className="catalog-group">{item.group}</p>
                    <h2>{item.name}</h2>
                    <p>{item.description}</p>
                    <Button
                      aria-label={`Ver ${item.name}`}
                      onClick={() => navigate(item.id)}
                    >
                      Explorar <span aria-hidden="true">↗</span>
                    </Button>
                  </article>
                ))}
              </div>
              {!results.length && (
                <Card>Nenhum componente encontrado. Altere a busca.</Card>
              )}
            </>
          ) : page === "examples" ? (
            <ExamplesPage />
          ) : page === "theme" ? (
            <>
              <div className="page-heading">
                <p className="eyebrow">FUNDAMENTOS / TOKENS</p>
                <h1>Personalização</h1>
                <p>
                  Personalize a apresentação e confira os contrastes da sua
                  composição.
                </p>
              </div>
              <div className="preview-card">
                <div className="preview-body">
                  <ThemeExample />
                </div>
              </div>
            </>
          ) : page === "accessibility" ? (
            <Accessibility />
          ) : entry ? (
            <ComponentPage key={entry.id} entry={entry} />
          ) : null}
          <footer className="docs-footer">
            <span>Cereja UI · Componentes React</span>
            <span>Versão candidata · Evidências documentadas</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
