import { useState } from "react";
import { Field, Select, Tabs } from "@cereja-project/ui-react";
import { WidgetPreview, type Variant } from "./catalog/WidgetPreview";
import { previews } from "./catalog/snippets/preview-registry";
import type { CatalogEntry } from "./catalog/registry";
export function ComponentPage({ entry }: { entry: CatalogEntry }) {
  const [variant, setVariant] = useState<Variant>("default");
  const Example = previews[entry.id as keyof typeof previews];
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">{entry.group.toUpperCase()} / COMPONENTE</p>
        <h1>{entry.name}</h1>
        <p>{entry.description}</p>
      </div>
      {entry.variants.length > 1 && (
        <div className="variant-control">
          <Field label="Variação">
            <Select
              value={variant}
              onChange={(e) => setVariant(e.target.value as Variant)}
            >
              {entry.variants.map((v) => (
                <option key={v} value={v}>
                  {v === "default"
                    ? "Padrão"
                    : v === "disabled"
                      ? "Desabilitada"
                      : "Inválida"}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      )}
      <div className="preview-card">
        <header className="preview-heading">
          <h2>Uso básico</h2>
        </header>
        <div className="preview-body component-preview">
          {variant === "default" ? (
            <Example />
          ) : (
            <WidgetPreview
              key={`${entry.id}:${variant}`}
              name={entry.name}
              variant={variant}
            />
          )}
        </div>
      </div>
      <div className="detail-grid">
        <article>
          <h2>Teclado</h2>
          <p>{entry.keyboard}</p>
        </article>
        <article>
          <h2>Acessibilidade</h2>
          <p>{entry.requirements}</p>
        </article>
      </div>
      <section className="docs-code">
        <h2>Código</h2>
        {entry.id === "LiveControl" && (
          <p className="caption-note">
            A transmissão de teste exige o servidor local de desenvolvimento. Em
            produção, use a URL da sua transmissão.
          </p>
        )}
        {entry.tsx.includes("/fixtures/") && (
          <p className="caption-note">
            Substitua as URLs de demonstração pelas suas mídias.
          </p>
        )}
        {variant !== "default" && (
          <p className="caption-note">O código abaixo mostra o uso básico.</p>
        )}
        <Tabs
          label="Linguagem do exemplo"
          defaultValue="tsx"
          items={[
            {
              value: "tsx",
              label: "TSX",
              content: (
                <pre tabIndex={0} aria-label="Código do exemplo">
                  <code>{entry.tsx}</code>
                </pre>
              ),
            },
            {
              value: "jsx",
              label: "JSX",
              content: (
                <pre tabIndex={0} aria-label="Código do exemplo">
                  <code>{entry.jsx}</code>
                </pre>
              ),
            },
          ]}
        />
      </section>
      <section className="docs-api">
        <h2>API</h2>
        <p>
          Propriedades principais. Consulte os tipos do pacote para a referência
          completa.
        </p>
        <div
          className="table-scroll"
          tabIndex={0}
          role="region"
          aria-label={`Propriedades de ${entry.name}`}
        >
          <table>
            <thead>
              <tr>
                <th scope="col">Propriedade</th>
                <th scope="col">Tipo</th>
              </tr>
            </thead>
            <tbody>
              {entry.props.map((prop) => (
                <tr key={prop.name}>
                  <td>
                    <code>{prop.name}</code>
                  </td>
                  <td>
                    <code>{prop.type}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
