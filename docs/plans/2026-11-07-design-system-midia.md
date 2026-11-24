# Design system de mídia — Plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar uma biblioteca React de mídia em duas camadas, consumível em JS/TS/JSX/TSX, com componentes neutros, cinco adaptadores e evidências de acessibilidade.
**Architecture:** Core React sem CSS visual, componentes prontos com CSS opcional e adaptadores carregados sob demanda. Contrato único de estado/capacidades com diferenças explícitas por origem.
**Tech Stack:** TypeScript, React, npm workspaces, Vite em modo biblioteca, declarações via tsc, Vitest, Testing Library, Playwright e axe-core; Radix para diálogo/menu/tooltip; hls.js e dash.js; APIs oficiais YouTube/Vimeo. Bibliotecas devem ter licença e compatibilidade verificadas na instalação; versões exatas registradas no lockfile.
**Spec:** [DESIGN_SYSTEM_MIDIA.md](https://chatgpt.com/library?file_id=libfile_eca18e73dee08191bea48a2aa991da00&account_id=personal). Ao executar, manter cópia em `docs/specs/DESIGN_SYSTEM_MIDIA.md`.
**Status:** Desenho aprovado em 07/11/2026. Plano pronto para revisão; nenhum componente implementado neste documento.

## Global Constraints

- React com JS/TS e JSX/TSX.
- Separar comportamento e apresentação, permitindo identidade visual definida pela aplicação.
- Sem reprodução automática por padrão.
- Rótulos padrão em português, substituíveis por dicionários de tradução, sem textos inacessíveis fixados em ícones.
- Objetivo: atender WCAG 2.2 nível AA nos componentes e exemplos sob nosso controle, com evidências por critério aplicável.
- Controles com alvo recomendado de 44 por 44 CSS px.
- WebRTC, DRM, casting e gestão de assinaturas ficam fora desta versão.
- Sem backend de hospedagem, transcodificação, criação automática de legendas, geração de audiodescrição ou serviço de transmissão.
- Publicação em registro público não faz parte desta aprovação.
- Não marcar validação indisponível como aprovada; testes automatizados não substituem a matriz manual.
- Alterações de tema, conteúdo e iframes externos têm responsabilidades e limites documentados.

## Decisões de implementação

Nomes internos provisórios: `@cereja-project/ui-core`, `@cereja-project/ui-react`, `@cereja-project/ui-providers`. Não verificar disponibilidade de nome npm enquanto não houver pedido de publicação. Publicar apenas ESM nesta primeira versão; React e ReactDOM são peer dependencies, nunca embarcados. Meta de compatibilidade: React 18.2 e 19.x; executar a matriz antes de declarar suporte.

Usar HTML nativo para botões e controles range e Radix apenas onde há gerenciamento composto de foco. A camada core inclui semântica e utilitários de acessibilidade; “sem estilos” não implica remover texto visualmente oculto da árvore acessível. Aplicar CSS estritamente necessário em VisuallyHidden, documentando essa exceção.

Scripts de raiz: `build`, `typecheck`, `test` (Vitest run), `test:e2e` (Playwright), `test:providers` (integrações reais separadas) e `docs:dev`. Usar versões estáveis compatíveis verificadas no início, sem assumir versões futuras nem escrever “latest” no lockfile.

## Estrutura de arquivos

| Caminho                                                                                               | Responsabilidade                                         |
| ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| package.json, package-lock.json, tsconfig.base.json, vitest.config.ts, playwright.config.ts           | Workspace, scripts e validação                           |
| packages/core/src/media/types.ts                                                                      | Tipos públicos e contrato de adaptadores                 |
| packages/core/src/media/store.ts, MediaRoot.tsx, useMedia.ts                                          | Ciclo de vida, estado externo e contexto React           |
| packages/core/src/primitives/*.tsx                                                                    | Semântica de controles, diálogo, menu, tooltip e estados |
| packages/core/src/i18n.ts, config.ts                                                                  | Rótulos e valores configuráveis centralizados            |
| packages/core/src/images/types.ts                                                                     | Contrato compartilhado de imagens                        |
| packages/providers/src/{native,hls,dash,youtube,vimeo}.ts                                             | Implementações independentes                             |
| packages/providers/src/{sdk-loader,errors}.ts                                                         | Carga compartilhada e normalização de erros              |
| packages/react/src/player/*.tsx                                                                       | Players, controles, playlist e alternativas              |
| packages/react/src/images/*.tsx                                                                       | Image, Figure, Gallery, ImageViewer                      |
| packages/react/src/styles/{tokens,components}.css                                                     | Tema neutro e composição visual                          |
| packages/_/src/index.ts, packages/_/package.json, packages/_/tsconfig.json, packages/_/vite.config.ts | Exports, compilação e tipos                              |
| apps/docs/src/{main,App}.tsx, apps/docs/src/examples/*                                                | Catálogo interativo Vite e exemplos JSX/TSX              |
| tests/{unit,integration,e2e,providers,consumer}/                                                      | Evidências de comportamento, acessibilidade e consumo    |
| tests/fixtures/{media,streams,tracks}/, tests/fixtures/manifest.json                                  | Mídias controladas e proveniência                        |
| docs/{specs,accessibility,api,compatibility}/                                                         | Desenho, contratos, limitações e evidências              |

## Contratos compartilhados

Definir em `packages/core/src/media/types.ts`; tarefas posteriores importam esses tipos:

- `MediaSource`: união discriminada de `{type:'file'|'hls'|'dash'; src:string; mimeType?:string}` e `{type:'youtube'|'vimeo'; id:string; embedUrl?:string}`. Não deduzir tipo pela extensão.
- `MediaError`: `{code:'unsupported'|'network'|'blocked'|'invalid-source'|'provider'|'aborted'; message:string; recoverable:boolean; cause?:unknown}`.
- `CommandResult`: `{ok:true} | {ok:false; error:MediaError}`.
- `TrackInfo`: `{id:string; label:string; language?:string; kind:'captions'|'subtitles'|'audio'|'quality'}`.
- `Capabilities`: booleanos `seek, volume, rate, captions, audioTracks, quality, fullscreen, pictureInPicture`; iniciar false até confirmação.
- `MediaSnapshot`: `{status:'loading'|'ready'|'playing'|'paused'|'buffering'|'ended'|'error'; currentTime:number; duration:number|null; volume:number; muted:boolean; playbackRate:number; live:boolean; seekable:Array<{start:number;end:number}>; capabilities:Capabilities; tracks:TrackInfo[]; selectedTrackIds:Partial<Record<TrackInfo['kind'],string>>; error:MediaError|null}`.
- `MediaCommand`: união de `{type:'play'|'pause'|'goLive'}`, `{type:'seek';time:number}`, `{type:'volume';value:number}`, `{type:'mute';value:boolean}`, `{type:'rate';value:number}`, `{type:'selectTrack';kind:TrackInfo['kind'];id:string|null}` e `{type:'fullscreen'|'pictureInPicture';value:boolean}`.
- `MediaAdapter`: `getSnapshot():MediaSnapshot`, `subscribe(listener:()=>void):()=>void`, `execute(command:MediaCommand):Promise<CommandResult>`, `destroy():void`.
- `AdapterFactory`: `(options:{source:MediaSource;host:HTMLElement;kind:'audio'|'video';signal:AbortSignal})=>Promise<MediaAdapter>`.
- `MediaRootProps`: `{source:MediaSource;kind:'audio'|'video';adapterFactory:AdapterFactory;children:ReactNode;onError?:(error:MediaError)=>void}`.
- `MediaHost`: componente que registra um único contêiner vazio no contexto; o adaptador administra seu elemento de mídia/iframe. Não misturar manipulação React dos filhos desse host.
- `useMedia():{snapshot:MediaSnapshot;execute:(command:MediaCommand)=>Promise<CommandResult>}`.
- `TextTrackInput`: `{id:string;src:string;language:string;label:string;kind:'captions'|'subtitles';default?:boolean}`; `TranscriptCue`: `{id:string;start:number;end:number;text:string}`; `Chapter`: `{id:string;start:number;title:string}`.
- `PlayerProps`: `{source:MediaSource;label:string;poster?:string;tracks?:TextTrackInput[];transcript?:TranscriptCue[];chapters?:Chapter[];describedSource?:MediaSource;loadStrategy?:'immediate'|'on-interaction';shortcuts?:boolean;onError?:(error:MediaError)=>void}`.
- `ImageData`: `{id:string;src:string;caption?:string;description?:string} & ({decorative:true;alt?:never}|{decorative?:false;alt:string})`.

Configurar todos os textos e parâmetros de interação em `i18n.ts` e `config.ts`. Propostas padrão: avanço/retrocesso 5 s, passos de volume 0,05, zoom entre 1 e 4 com passo 0,25. Manter unidades/conversões matemáticas e nomes de atributos HTML no código. Limites reais de streams sempre vêm do adaptador.

## Review Focus

1. Promessa ou evento antigo após troca de fonte não altera a mídia atual — tarefa 2.
2. URLs assinadas sem extensão e metadados inválidos não geram NaN/Infinity na interface — tarefas 3 e 8.
3. Dois players e um campo editável não recebem atalhos uns dos outros — tarefas 4 e 5.
4. Remoção da imagem/acionador enquanto o visualizador está aberto mantém foco em destino válido — tarefa 7.
5. SDK compartilhado que falha ou inicia durante desmontagem não deixa iframes/listeners órfãos — tarefas 9 e 10.

## Procedimento por tarefa

Cada tarefa abaixo contém seu próprio ciclo: escrever teste de comportamento, observar falha relevante (não apenas erro de configuração), implementar, verificar e criar commit local. Não fazer push/publicação. Se não houver repositório, criar um repositório local isolado no início da execução e preservar entregáveis em arquivo compactado ao final. Configurar somente o necessário para o entregável daquela tarefa.

### 1. Contrato e primeira integração consumível

**Arquivos:** criar configuração de raiz, manifests/configurações dos três pacotes, `types.ts`, exports, `tests/unit/contracts.test.ts` e `tests/consumer/types.test.tsx`.
**Interfaces:** produz os contratos acima e exports compilados; nenhum DOM pode ser acessado ao importar.

- [ ] Configurar compilação, Vitest e testes de consumo necessários a esta tarefa; registrar versões/licenças em `docs/compatibility/dependencies.md`.
- [ ] Escrever `requiresExplicitSourceType`: `expectTypeOf<MediaSource>().not.toMatchTypeOf<string>()`; adicionar casos `@ts-expect-error` para fonte sem tipo e imagem informativa sem alt.
- [ ] Executar `npm run typecheck` e `npm test -- tests/unit/contracts.test.ts`; confirmar falha causada pelo contrato ausente.
- [ ] Implementar tipos/exports e teste de importação ESM em Node sem window/document; excluir React/ReactDOM dos bundles.
- [ ] Executar `npm run build`, `npm run typecheck` e o teste; exigir saída zero e declarações geradas.
- [ ] Criar commit `feat: define media library contracts and package exports`.

### 2. Estado, contexto e cancelamento

**Arquivos:** criar `store.ts`, `MediaRoot.tsx`, `useMedia.ts`, `MediaHost.tsx`, `tests/unit/media-store.test.ts`, `tests/integration/media-root.test.tsx`.
**Interfaces:** consome AdapterFactory/MediaAdapter; produz MediaRoot, MediaHost, useMedia e `createMediaStore():{getSnapshot;subscribe;attach;execute;destroy}`, com `attach(host,source,kind,factory):Promise<void>`.

- [ ] Escrever `ignoresLateSourceEvents`: após trocar A por B e resolver A, `expect(store.getSnapshot()).toEqual(snapshotB)`; verificar destroy de A exatamente uma vez.
- [ ] Escrever `survivesStrictModeAndUnmount`: montar/desmontar/remontar com SDK atrasado não duplica subscriptions e não gera atualização após destroy.
- [ ] Executar `npm test -- tests/unit/media-store.test.ts tests/integration/media-root.test.tsx`; observar falhas.
- [ ] Implementar geração por fonte, AbortController, snapshots imutáveis/cacheados e useSyncExternalStore com snapshot SSR estável; abortar comandos quando o adaptador é invalidado.
- [ ] Reexecutar testes e `npm run typecheck`; exigir PASS e renderização SSR sem hidratação divergente.
- [ ] Criar commit `feat: add lifecycle-safe media state and React context`.

### 3. Reprodução HTML nativa

**Arquivos:** criar `providers/src/native.ts`, `errors.ts`, `tests/unit/native.test.ts`, `tests/e2e/native.spec.ts`, fixture curta autorizada em `tests/fixtures/media/` e seu registro no manifest.
**Interfaces:** produz `createNativeAdapter:AdapterFactory`; elemento nativo pode ser áudio ou vídeo, segundo kind.

- [ ] Escrever `handlesSignedUrlAndRejectedPlay`: fonte file sem extensão mantém src; rejeição de play retorna `{ok:false,error:{code:'blocked',...}}`, não muda para playing.
- [ ] Escrever `normalizesUnknownDuration`: duration NaN/Infinity vira null; erro de codec não causa retry ilimitado.
- [ ] Executar `npm test -- tests/unit/native.test.ts` antes da implementação.
- [ ] Implementar eventos nativos, comandos, capacidades detectadas, remoção de listeners e reset de src no destroy; não habilitar controle de volume quando a plataforma não permite alteração.
- [ ] Executar teste unitário e `npm run test:e2e -- tests/e2e/native.spec.ts`: mídia real avança no tempo após clique, pausa e seek funcionam. Registrar fixture, autoria/licença e codec.
- [ ] Criar commit `feat: implement native audio and video playback`.

### 4. Primitivas e tema neutro

**Arquivos:** criar `core/src/primitives/{Button,IconButton,Slider,Menu,Tooltip,Dialog,VisuallyHidden,Status}.tsx`, `i18n.ts`, `config.ts`, CSS de tokens/componentes e `tests/integration/primitives.test.tsx`.
**Interfaces:** Button preserva atributos nativos; IconButton exige `label:string`; Slider exige `label,min,max,step,value,onValueChange,valueText`; Dialog exige `title,open,onOpenChange,children`. Menu e Tooltip envolvem Radix, com nomes e associação semântica preservados. `MediaConfigProvider({labels,config,children})` é opcional e tem defaults.

- [ ] Escrever `restoresDialogFocus`: abrir/fechar por Escape devolve foco ao acionador; `sliderSupportsKeyboard`: ArrowRight produz incremento e aria-valuetext legível.
- [ ] Escrever `doesNotHijackEditableKeys`: controles não interceptam entrada de texto nem teclas fora do componente.
- [ ] Executar `npm test -- tests/integration/primitives.test.tsx`; observar falhas relevantes.
- [ ] Implementar semântica e wrappers, tema em tons neutros, foco, forced-colors, redução de movimento e alvos de 44 px; ícones decorativos não duplicam nomes acessíveis.
- [ ] Reexecutar teste e axe; verificar tema com contraste de texto normal >=4,5:1 e controles/foco >=3:1 nos cenários aplicáveis.
- [ ] Criar commit `feat: add accessible primitives and neutral theme tokens`.

### 5. Players e controles compostos

**Arquivos:** criar `react/src/player/{AudioPlayer,VideoPlayer,PlayerControls,SeekControl,VolumeControl,TimeDisplay,Playlist}.tsx`, `providers/src/resolve.ts`, `tests/integration/players.test.tsx` e `tests/e2e/players.spec.ts`.
**Interfaces:** AudioPlayer/VideoPlayer consomem PlayerProps; `resolveAdapter(type:MediaSource['type']):Promise<AdapterFactory>` faz import dinâmico. `Playlist({items:Array<{id:string;title:string;source:MediaSource}>,activeId:string,onSelect:(id:string)=>void})` não inicia próximo item automaticamente.

- [ ] Escrever `isolatesPlayersAndShortcuts`: tecla dentro do player A não muda B, não age em inputs e respeita shortcuts=false.
- [ ] Escrever `keepsFocusedControlsVisible`: foco/menu aberto impede ocultação; capacidades false removem ações inoperantes; tempo atual não produz anúncio live contínuo.
- [ ] Executar `npm test -- tests/integration/players.test.tsx` e observar falhas.
- [ ] Implementar controles sobre useMedia, poster, feedback de erro acionável, volume/mute, rate, capítulos via tarefa 6 e fullscreen/PiP apenas quando disponíveis. Estado confirmado vem do adaptador.
- [ ] Executar testes, axe e E2E com mídia real, dois players e layout estreito; verificar que player file não baixa SDK HLS/DASH/YouTube/Vimeo.
- [ ] Criar commit `feat: compose accessible audio and video players`.

### 6. Legendas, transcrição, capítulos e audiodescrição

**Arquivos:** criar `react/src/player/{CaptionMenu,Transcript,ChapterMenu,DescriptionToggle,TrackMenu}.tsx`, `core/src/media/tracks.ts`, `tests/integration/alternatives.test.tsx`, `tests/e2e/alternatives.spec.ts` e fixtures VTT/transcrição/versão descrita.
**Interfaces:** `Transcript({cues:TranscriptCue[],follow?:boolean})`, `ChapterMenu({chapters:Chapter[]})`; `attachTextTracks(media:HTMLMediaElement,tracks:TextTrackInput[]):()=>void`; DescriptionToggle consome describedSource e estado do player.

- [ ] Escrever `transcriptNeverStealsFocus`: avanço de reprodução altera trecho ativo sem focus(); sem capacidade seek, trechos são texto, não botões falsamente funcionais.
- [ ] Escrever `switchesDescriptionAfterMetadata`: versão descrita preserva tempo dentro de seekable; se impossível, informa descontinuidade e não retoma reprodução sem intenção anterior.
- [ ] Executar `npm test -- tests/integration/alternatives.test.tsx`; observar falhas.
- [ ] Implementar faixas VTT nativas, seleção de faixas expostas pelo provider, transcrição independente, capítulos e alternância de vídeo descrito; desmontar tracks da fonte anterior.
- [ ] Executar testes e E2E real para VTT, idioma, erro de carregamento da faixa, capítulos e versão descrita; texto da transcrição nunca é injetado como HTML não confiável.
- [ ] Criar commit `feat: add captions transcripts chapters and described versions`.

### 7. Imagens, galeria e visualizador

**Arquivos:** criar `core/src/images/types.ts`, `react/src/images/{Image,Figure,Gallery,ImageViewer}.tsx`, `tests/integration/images.test.tsx`, `tests/e2e/images.spec.ts`.
**Interfaces:** `Image({image:ImageData})`, `Figure({image:ImageData})`, `Gallery({items:ImageData[]})`, `ImageViewer({items:ImageData[],activeId:string|null,onActiveChange:(id:string|null)=>void})`.

- [ ] Escrever `requiresMeaningfulImageAlternative`: tipos exigem alt ou decorative; JS recebe aviso em desenvolvimento se alt informativo estiver ausente/vazio. Nunca inventar descrição pelo arquivo.
- [ ] Escrever `recoversFocusWhenItemRemoved`: retirar item aberto fecha ou seleciona vizinho válido; ao fechar, foco vai para acionador existente ou contêiner da galeria com tabindex=-1.
- [ ] Executar `npm test -- tests/integration/images.test.tsx`; observar falhas.
- [ ] Implementar legenda/descrição, loading/error, navegação anterior/próximo, zoom por botões e pan por teclado/controles visíveis; nenhuma ação depende apenas de arrastar ou gesto.
- [ ] Executar testes, axe e E2E com itens removidos, imagens decorativas, zoom e reflow; no zoom intencional do visualizador, manter controles acessíveis sem overflow da página.
- [ ] Criar commit `feat: add accessible images gallery and zoom viewer`.

### 8. HLS e DASH, ao vivo e sob demanda

**Arquivos:** criar `providers/src/{hls,dash,live}.ts`, `react/src/player/LiveControl.tsx`, `tests/unit/streaming.test.ts`, `tests/providers/streaming.spec.ts`, fixtures HLS/DASH autorizadas e servidor local de fixture ao vivo em `tests/fixtures/streams/server.ts`.
**Interfaces:** `createHlsAdapter:AdapterFactory`, `createDashAdapter:AdapterFactory`, `getLiveTarget(snapshot:MediaSnapshot):number|null`. LiveControl envia goLive somente quando existe janela seekable utilizável.

- [ ] Escrever `liveWithoutDvrHasNoSeek`: live=true e seekable=[] não renderizam slider de progresso nem Voltar ao vivo; duração desconhecida não é percentual.
- [ ] Escrever `clampsSeekToMovingWindow`: seek fora da janela móvel usa limite válido; término de live atualiza capacidades; não assume que duration=Infinity sozinho identifica live.
- [ ] Executar `npm test -- tests/unit/streaming.test.ts`; observar falhas.
- [ ] Implementar hls.js/dash.js sob demanda, detecção nativa apropriada, faixas/qualidade quando expostas, atualização da janela e destroy/reset dos motores.
- [ ] Executar testes unitários e `npm run test:providers -- tests/providers/streaming.spec.ts`: HLS/DASH reais avançam, manifest ao vivo muda, seek DVR funciona e falhas de rede são visíveis. Incompatibilidade do navegador deve ser documentada, não mascarada por mock.
- [ ] Criar commit `feat: support HLS DASH and live playback`.

### 9. YouTube

**Arquivos:** criar `providers/src/{sdk-loader,youtube}.ts`, `tests/unit/youtube.test.ts`, `tests/providers/youtube.spec.ts`.
**Interfaces:** `createYouTubeAdapter:AdapterFactory`; `loadSdk(key:string,load:()=>Promise<unknown>):Promise<unknown>` compartilha carga e remove entrada rejeitada para permitir nova tentativa explícita.

- [ ] Escrever `sharesSdkAndCleansAbortedInstance`: duas montagens usam uma carga; desmontagem durante carga não cria player órfão; falha não inicia loop.
- [ ] Escrever `preservesProviderCapabilities`: controles próprios não oferecem seleção de faixa indisponível nem escondem controles necessários do iframe.
- [ ] Executar `npm test -- tests/unit/youtube.test.ts`; observar falhas.
- [ ] Implementar SDK oficial, título do iframe, host validado, IDs/URL explícitos, estados/eventos, origem configurada quando exigida e preservação de callback global preexistente.
- [ ] Executar testes e `npm run test:providers -- tests/providers/youtube.spec.ts` com vídeo autorizado para incorporação; checar play/pause, erro de embed, entrada/saída por Tab e loadStrategy=on-interaction sem requisição prévia ao provedor.
- [ ] Criar commit `feat: integrate YouTube with capability-aware controls`.

### 10. Vimeo

**Arquivos:** criar `providers/src/vimeo.ts`, `tests/unit/vimeo.test.ts`, `tests/providers/vimeo.spec.ts`.
**Interfaces:** `createVimeoAdapter:AdapterFactory`; reutiliza sdk-loader e erros, sem tratar métodos Vimeo como síncronos.

- [ ] Escrever `handlesRejectedMethodsAndLateEvents`: rejeição de método vira CommandResult; evento tardio após destroy não altera store.
- [ ] Escrever `handlesRestrictedEmbed`: senha/restrição de domínio/não listado retorna estado e orientação claros, sem fingir reprodução; embedUrl preserva parâmetros necessários autorizados em host Vimeo validado.
- [ ] Executar `npm test -- tests/unit/vimeo.test.ts`; observar falhas.
- [ ] Implementar SDK oficial, faixas expostas, eventos, fallback de controles e carga por interação.
- [ ] Executar testes e `npm run test:providers -- tests/providers/vimeo.spec.ts` com fixture autorizada; registrar operações realmente disponíveis por configuração do vídeo.
- [ ] Criar commit `feat: integrate Vimeo and document provider limitations`.

### 11. Catálogo interativo e consumo real

**Arquivos:** criar app Vite em `apps/docs/`, `examples/{audio,video,transcript,description,hls,dash,youtube,vimeo,gallery,theme}.{jsx,tsx}`, `tests/consumer/{jsx,tsx,ssr}/`, `docs/api/README.md`, `docs/compatibility/providers.md`.
**Interfaces:** usa apenas exports públicos; exemplos usam o mesmo comportamento com CSS neutro, tema alternativo e composição headless.

- [ ] Escrever `packedConsumersUsePublicExports`: pacotes via npm pack instalam em consumidores JSX/TSX e SSR independentes; tipos compilam; SSR não acessa DOM.
- [ ] Executar consumidores antes de finalizar exports e observar falhas relevantes.
- [ ] Implementar catálogo, exemplos, comandos de instalação local e guia de autoria acessível; explicitar que transcrição não substitui automaticamente todos os requisitos de audiodescrição.
- [ ] Executar builds dos consumidores e E2E de navegação do catálogo; medir carregamento modular e garantir uma instância de React.
- [ ] Documentar personalização segura, atalhos, estados, matriz de provedores e migrações; fixar versões testadas de React/navegadores.
- [ ] Criar commit `docs: add interactive catalog and package integration examples`.

### 12. Verificação integrada e entrega

**Arquivos:** criar `tests/e2e/accessibility.spec.ts`, `docs/accessibility/{matrix,manual-results,known-limitations}.md`, `README.md`, `CHANGELOG.md` e `scripts/package-delivery.mjs`.
**Interfaces:** evidências vinculam componente, cenário, ambiente, versão, resultado e pendências; script gera ZIP sem node_modules, segredos ou caches.

- [ ] Escrever cenários axe/teclado das composições finais, reflow, foco não encoberto, erro, forced-colors e reduced-motion; falhas devem identificar componente e condição.
- [ ] Executar `npm run test:e2e -- tests/e2e/accessibility.spec.ts` e corrigir violações reais na camada proprietária.
- [ ] Executar uma rodada final: `npm run typecheck`, `npm test`, `npm run build`, `npm run test:e2e`, `npm run test:providers`. Registrar comandos e resultados; testes pulados não contam como aprovação.
- [ ] Executar matriz manual: NVDA/Firefox e NVDA/Chrome no Windows, VoiceOver/Safari no macOS e iOS, TalkBack/Chrome no Android; teclado, toque, legendas, foco e leitura. Registrar pendente onde não houver acesso.
- [ ] Verificar zoom 200%/400%, viewport estreita e temas; falhas do iframe são registradas por provedor e não encobertas pela pontuação axe da página.
- [ ] Produzir revisão final de código, corrigir problemas e repetir apenas verificações afetadas; criar commit `test: document accessibility and compatibility evidence`.
- [ ] Gerar ZIP dos fontes/documentação/lockfile, pacotes npm locais e instruções; salvar entregáveis e oferecer links. Não publicar npm nem fazer push automaticamente.

## Critério de conclusão

Entregar fonte executável, catálogo e pacotes consumíveis, com todos os cinco adaptadores efetivos. Não chamar a biblioteca de “completamente acessível” se houver validações pendentes, falhas conhecidas ou conteúdo/provedor fora de controle. É possível entregar uma versão candidata utilizável com pendências explicitadas; isso não encerra a validação completa.

## Revisão do plano

Cobertura conferida contra o desenho: SSR/ciclo de vida (1–2), HTML nativo (3), fundamentos/tema/i18n (4), players/playlist (5), alternativas/capítulos (6), imagens (7), streaming (8), iframes (9–10), documentação/consumo (11), evidências e entrega (12). Os cinco modos de falha de Review Focus têm tarefas e testes responsáveis. A ordem é sequencial por contratos, com revisão ao fim de cada unidade.

## Referências de implementação

- [Hls API](https://hlsjs.video-dev.org/api-docs/hls.js.hls)
- [dash.js MediaPlayer](https://dashif.org/dash.js/api/module-MediaPlayer.html)
- [Radix: acessibilidade](https://www.radix-ui.com/primitives/docs/overview/accessibility)
- [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference)
- [Vimeo Player SDK](https://github.com/vimeo/player.js/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

## Forma de execução

Recomendação: implementação nesta sessão pelo agente principal, seguindo as tarefas sequencialmente e com revisão independente ao final, pois os componentes compartilham contratos e decisões de integração. Alternativa: um agente implementador e um revisor por tarefa, com maior isolamento e maior custo de contexto. Escolher a forma de execução após revisar este plano.
