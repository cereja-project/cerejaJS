# Cereja UI

Biblioteca React de componentes de mídia, com duas camadas: comportamento reutilizável e componentes prontos com aparência neutra. Compatível com aplicações JS/TS e JSX/TSX.

**Estado: versão candidata 0.2.0.** O objetivo é WCAG 2.2 AA; a validação manual de leitores de tela e a execução real nos navegadores estão registradas em `docs/accessibility`. Não há certificação geral de acessibilidade.

## Abrir o projeto e o catálogo

Requisitos: Node.js 22.12+ (ou 24+) e npm com suporte a workspaces.

```bash
npm ci
npm run build
npm run docs:dev
```

Abra o endereço local informado pelo Vite. Se o ambiente bloquear a listagem das interfaces de rede, use `npm run docs:dev -- --host 127.0.0.1`.

O catálogo inclui vídeo com WebVTT/transcrição/capítulos, áudio, galeria/zoom, HLS ao vivo e sob demanda, DASH, YouTube, Vimeo, primitivas, composição headless e personalização por tokens. As amostras locais são técnicas e têm proveniência em `tests/fixtures/manifest.json`.

## Instalar em outra aplicação

Os pacotes são locais e ainda não estão publicados no npm. Gere os tarballs com `npm run test:consumer` ou use os incluídos em `artifacts/`.

Na aplicação de destino, instale os três arquivos juntos, ajustando os caminhos:

```bash
npm install ./cereja-ui-core-0.2.0.tgz ./cereja-ui-providers-0.2.0.tgz ./cereja-ui-react-0.2.0.tgz
```

React e ReactDOM são peer dependencies; a aplicação deve fornecer versões compatíveis. Consulte a matriz executada em `docs/compatibility/consumers.json`.

```tsx
import { VideoPlayer } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";

export function MeuVideo() {
  return (
    <VideoPlayer
      label="Apresentação do projeto"
      source={{ type: "file", src: "/video.mp4" }}
      tracks={[
        {
          id: "pt",
          kind: "captions",
          src: "/video.vtt",
          language: "pt-BR",
          label: "Português",
        },
      ]}
    />
  );
}
```

O mesmo exemplo funciona em JSX. Fontes HLS/DASH usam type explícito. Para iframe, use `{type:'youtube',id:'...'}` ou `{type:'vimeo',id:'...'}`, preferencialmente com `loadStrategy="on-interaction"`.

## Personalização e composição

Sobrescreva tokens como `--md-bg`, `--md-fg`, `--md-accent`, `--md-focus`, `--md-font`, `--md-radius` e `--md-control-size`. Preserve contraste e foco visível. Importe tokens.css e components.css separadamente quando precisar de maior controle.

A camada sem estilos usa `MediaRoot`, `MediaHost`, `useMedia` e as primitivas do core. Labels e parâmetros de interação são configuráveis com `MediaConfigProvider`. Veja `docs/api/README.md` e os exemplos JSX/TSX em `apps/docs/src/examples`.

## Verificação

```bash
npm run typecheck
npm test
npm run build
npm run test:consumer
npx playwright install chromium
npm run test:e2e
npm run test:providers
```

Se necessário, defina PLAYWRIGHT_CHROMIUM_EXECUTABLE para um Chromium já instalado. Testes de provedores precisam de rede, permissão de incorporação e conteúdo autorizado; YOUTUBE_TEST_VIDEO_ID e VIMEO_TEST_VIDEO_ID substituem os exemplos padrão.

Os testes unitários usam doubles apenas na fronteira de SDKs externos; eles não comprovam reprodução real do provedor. A matriz manual e os critérios de conclusão estão em `docs/accessibility/`.

## Estrutura

- `packages/core`: contratos, contexto, hooks, configuração e primitivas.
- `packages/react`: players, alternativas, imagens, galeria e CSS.
- `packages/providers`: adaptadores e carga sob demanda.
- `apps/docs`: catálogo interativo e exemplos.
- `tests`: comportamento, integração, navegador, provedores e consumo independente.
- `docs`: desenho aprovado, plano, evidências e limitações.

O projeto não inclui backend, geração de legendas/audiodescrição, DRM, WebRTC ou casting. Publicação em registro e escolha da licença final de distribuição ficam para a mantenedora; as licenças das dependências precisam ser preservadas.

Após compilar, `npm run docs:preview` também abre o catálogo pronto, incluindo o endpoint local da demonstração ao vivo.

## Expansão 0.2

O catálogo reúne 61 componentes documentados e quatro integrações de reprodução, com busca por categoria, variações, API e exemplos JSX/TSX. Há nove fluxos completos em apps/docs/src/examples/complete. As cópias JSX são geradas removendo apenas tipos; o build compila as duas versões.

Novos grupos: formulários, navegação, feedback, coleções de mídia, comparação/carrossel, seleção e prévia de arquivos locais. Formulários demonstram validação local; nenhuma mensagem é enviada. Prévias não fazem upload.

As páginas recebem a aparência neutra dos tokens. Acessibilidade do conteúdo, contraste personalizado e a matriz manual continuam sob verificação. Veja docs/api/expansion.md e docs/accessibility/expansion-results.md.
