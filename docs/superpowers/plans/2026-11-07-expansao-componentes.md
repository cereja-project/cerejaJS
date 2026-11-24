# Expansão Cereja UI — Plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans para execução sequencial nesta sessão. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ampliar o Cereja UI com componentes gerais e de mídia e nove exemplos completos, preservando acessibilidade, neutralidade e os pacotes existentes.
**Architecture:** Continuar core/react/providers. Core fornece semântica, comportamento e contratos; react compõe a apresentação por tokens. Componentes gerais não importam os motores de mídia. Preservar APIs da versão 0.1.
**Tech Stack:** React/TypeScript, HTML nativo, Radix onde interação composta justificar, Vitest/Testing Library/axe e Playwright. Reutilizar Vite, declarações tsc e testes de consumidores existentes.
**Spec:** `docs/specs/2026-11-07-expansao-componentes.md`, aprovado pela usuária. [Cópia do desenho](https://chatgpt.com/library?file_id=libfile_976a632609c08191bc97bd806c792f41&account_id=personal).
**Execução escolhida:** agente principal nesta sessão, revisão independente ao final. Não pedir nova escolha de método.
**Estado:** plano para revisão antes da implementação.

## Global Constraints

- Manter core sem estilos visuais e componentes prontos neutros, tokens CSS, tradução de rótulos, SSR e carregamento sob demanda dos adaptadores.
- Esta expansão não altera os contratos públicos existentes sem necessidade documentada.
- Select será nativo nesta etapa; combobox pesquisável, editor rico e tabela de dados ficam para uma expansão própria.
- Carousel não gira sozinho.
- FilePicker funciona com botão/input nativo, com arrastar como alternativa opcional.
- O componente não inclui upload, conversão ou processamento remoto.
- Sem anúncios a cada frame/progresso.
- Alvos padrão de 44 CSS px para controles interativos, reflow, alto contraste e redução de movimento.
- Não publicar em npm ou hospedar o projeto sem solicitação.
- Aprovar testes pulados ou ambientes indisponíveis é proibido; registrar as pendências reais.

## Review Focus

1. Controles em dois Field ou formulários não compartilham IDs nem perdem relações de erro — tarefa 1.
2. Navegação por teclado não alcança painéis/itens ocultos de tabs e carousel — tarefas 2 e 4.
3. Trocas de File/Blob e desmontagem em StrictMode revogam apenas URLs de propriedade da biblioteca e não invalidam a prévia atual — tarefa 6.
4. Seleção/paginação mantém estados válidos quando itens são removidos ou o conjunto fica vazio — tarefas 2 e 3.
5. Busca e troca de fonte não movem foco inesperadamente nem consomem intenção de seek antes da janela navegável — tarefa 5.

## Estrutura e interfaces compartilhadas

Novos arquivos de comportamento ficam em `packages/core/src/forms/`, `navigation/`, `feedback/`, `files/` e `media/`; apresentação em diretórios equivalentes de `packages/react/src/`. Componentes são exportados pelos index.ts públicos. Ampliar config/i18n e CSS existentes, sem importar CSS automaticamente pelo JS.

### Formulários

- `Field({label,description?,error?,required?,children})`: contexto com `controlId,descriptionId,errorId,invalid,required`; IDs gerados por useId. Um controle por Field; preservar também IDs explicitamente fornecidos.
- `Input`, `Textarea` e `Select`: forwardRef e atributos HTML nativos. Input exclui tipos checkbox/radio/file nesta API; controles específicos têm interfaces próprias.
- `Checkbox({label,description?,...nativeInputProps})`: input nativo de tipo checkbox com ref, checked/defaultChecked/onChange, name/value/required/disabled.
- `RadioGroup({label,name,options,value?,defaultValue?,onValueChange?,disabled?,required?,error?})`, options `Array<{value:string;label:string;disabled?:boolean}>`: fieldset/legend e rádios nativos; valor único.
- `Switch({label,checked?,defaultChecked?,onCheckedChange?,disabled?,name?,value?})`: checkbox nativo com role=switch e semântica de checked, foco e submissão preservados.
- `useFieldControl({id?,describedBy?,invalid?,required?})`: produz atributos id/aria-describedby/aria-invalid/required mesclados com o Field.

### Navegação e composição

- `Tabs({label,items,value?,defaultValue?,onValueChange?,orientation?})`, itens `{value,label,content:ReactNode,disabled?}`: ativação manual, setas/Home/End navegam, Enter/Espaço ativa; painel inativo hidden. Roving tabindex e IDs SSR estáveis.
- `Accordion({items,value?,defaultValue?,onValueChange?})`: itens `{id,title,content:ReactNode,disabled?}`; value/defaultValue string[] permitem múltiplos abertos; usar details/summary quando suficiente, com integração controlada definida.
- `Breadcrumbs({label?,items:Array<{label:string;href?:string}>})`: nav/lista; último item aria-current=page, sem link falso.
- `Pagination({page,pageCount,onPageChange,label?})`: page começa em 1; 0 páginas representa lista vazia e não cria controles inválidos. Lista limitada de páginas com primeira/última e elipses não interativas; clamp visual sem callback durante render.
- `Card({children,...divProps})`, `Separator({orientation?,decorative?})`.
- `Alert({children,title?,tone?:'info'|'success'|'warning'|'error',announce?:'off'|'polite'|'assertive'})`: padrão off para conteúdo estático; sem depender só de cor.
- `Progress({label,value?,max?})`: valor omitido = indeterminado; normalizar limites inválidos, progress nativo.
- `Skeleton({label?,width?,height?})`: parte visual aria-hidden, rótulo de estado único pelo componente ou pelo agrupamento consumidor; sem animação obrigatória.
- `EmptyState({title,description?,action?:ReactNode})`.

### Mídia e arquivos

- `MediaItem={id:string;title:string;description?:string;source?:MediaSource;image?:ImageData;meta?:string}`.
- `MediaCard({item,selected?,onSelect?,action?:ReactNode})`: seleção por checkbox/botão explícito; sem controles interativos aninhados.
- `MediaGrid({items,selectedIds?,onSelectionChange?,renderAction?})` e `MediaList`: apresentação nativa em lista, sem role=grid se não houver comportamento de grade ARIA.
- `Carousel({label,items:ImageData[],index?,defaultIndex?,onIndexChange?})`: somente item ativo interativo; anterior/próximo desabilitados nos limites, sem loop implícito.
- `ImageComparison({label,before:ImageData,after:ImageData,value?,defaultValue?,onValueChange?})`: 0–100, slider nativo, botões e modo lado a lado; comparação não depende só de uma imagem recortada.
- `CompactAudioPlayer(props:PlayerProps)`: apresentação compacta, preserva controles e alternativas do AudioPlayer; não duplicar estado/adapter.
- `SeekBackButton({seconds?})` e `SeekForwardButton({seconds?})`: usam config.seekStep e useMedia; indisponíveis se seek não for possível.
- `ChapterList({chapters:Chapter[]})`: capítulos como texto quando não navegáveis; ações explícitas quando seek disponível.
- `TranscriptSearch({cues:TranscriptCue[]})`: query local, contagem/estado vazio; usa Transcript para resultados e não altera foco durante reprodução.
- `SourceSelector({sources:Array<{id,label,source}>,value,onValueChange})`: seleção controlada explícita. `MediaSourcePlayer` compõe VideoPlayer com troca e restauração; extrair a lógica já existente para `usePositionRestore`, usada também na versão descrita.
- `FilePicker({label,accept?,maxFiles?,maxSizeBytes?,multiple?,files?,defaultFiles?,onFilesChange?,disabled?})`: array File, rejeições com motivo por arquivo, seleção local; sem rede.
- `useObjectUrl(file:Blob|null):string|null`: cria URL em effect e revoga a própria ao trocar/desmontar; não criar em render.
- `MediaPreview({file:File|null,alt?,label?})`: tipo image/audio/video reconhecido; alt obrigatório para imagem informativa; tipo desconhecido mostra MediaFileInfo, nunca renderiza HTML enviado.
- `MediaFileInfo({file:File})`: nome, tipo e tamanho legíveis.
- `MediaLoading({label?})`, `MediaUnavailable({title?,description?})`, `MediaErrorState({message?,onRetry?})`: composições dos estados gerais com labels traduzíveis.

## Procedimento

Em cada tarefa: testes de comportamento primeiro, observar falha relevante, implementar, executar teste específico e suíte inteira, typecheck, registrar no ledger e criar commit local. Não fazer push. Novas dependências precisam de licença/compatibilidade verificadas; preferir primitivas existentes ou HTML nativo. Reavaliar o ambiente de navegador na tarefa 9.

### Tarefa 1 — Campos e escolhas

**Arquivos:** criar core/forms/{Field,Input,Textarea,Select,Checkbox,RadioGroup,Switch}.tsx e useFieldControl.ts; wrappers em react/forms/; teste `tests/integration/forms.test.tsx`; modificar index/i18n/CSS.
**Interfaces:** produz APIs de formulários acima, consumidas pelos exemplos da tarefa 8.

- [ ] Escrever testes: dois campos têm IDs distintos; input tem nome/descrição/erro corretos; `expect(input).toHaveAccessibleDescription('Obrigatório')`; alterar checkbox/switch e navegar rádios respeita disabled e value.
- [ ] Executar `npm test -- tests/integration/forms.test.tsx` antes de implementar e confirmar falha por funcionalidade ausente.
- [ ] Implementar APIs com HTML nativo e merge de atributos, forwardRef e estado controlado/não controlado; preservar submissão do formulário.
- [ ] Rodar typecheck e suíte; verificar FormData real para name/value e associação de erro após rerender.
- [ ] Commit `feat: add accessible form fields and selection controls`.

### Tarefa 2 — Navegação, estrutura e estados

**Arquivos:** core/navigation/{Tabs,Accordion,Breadcrumbs,Pagination}.tsx; core/feedback/{Alert,Progress,Skeleton,EmptyState}.tsx; react/layout/{Card,Separator}.tsx e wrappers de apresentação por domínio; testes navigation.test.tsx e feedback.test.tsx.
**Interfaces:** produz APIs descritas acima; consome Button/config/i18n existentes.

- [ ] Testar Tab/setas/Home/End/Enter em Tabs, painéis ocultos fora da navegação, abertura de Accordion, página atual/limites e queda de pageCount; `expect(hiddenPanel).not.toBeVisible()`.
- [ ] Testar Progress indeterminado sem aria-valuenow e valor válido após normalização; Skeleton decorativo; Alert estático sem anunciar por padrão e variantes explícitas.
- [ ] Observar falha com `npm test -- tests/integration/navigation.test.tsx tests/integration/feedback.test.tsx`.
- [ ] Implementar APIs, manter IDs e estado coerentes em SSR, dados removidos e lista vazia.
- [ ] Executar comandos específicos, typecheck e suíte inteira; commit `feat: add navigation feedback and layout components`.

### Tarefa 3 — Organização da mídia

**Arquivos:** core/media/items.ts; react/media/{MediaCard,MediaGrid,MediaList}.tsx; teste `tests/integration/media-collections.test.tsx`.
**Interfaces:** produz MediaItem e componentes; consome Image, Checkbox, Card e estados anteriores.

- [ ] Testar seleção por checkbox sem ativar a ação de abrir; ausência de controles aninhados; exclusão de item selecionado não gera seleção fantasma no callback seguinte.
- [ ] Observar falha com `npm test -- tests/integration/media-collections.test.tsx`.
- [ ] Implementar apresentação em lista e seleção opcional, callback apenas por ação; IDs como identidade e não índices.
- [ ] Executar teste, axe, typecheck e suíte; commit `feat: add selectable media collections`.

### Tarefa 4 — Carrossel e comparação

**Arquivos:** core/images/{useCarousel,useImageComparison}.ts; react/images/{Carousel,ImageComparison}.tsx; teste `tests/integration/image-compositions.test.tsx`.
**Interfaces:** produz APIs de imagem acima; consome ImageData, Image e controles nativos.

- [ ] Testar navegação por botões/teclado, limites, remoção de imagem ativa e itens ocultos sem ações focalizáveis; nenhuma mudança por timer.
- [ ] Testar comparação com range e botões, clamp 0–100 e modo lado a lado com ambas as alternativas acessíveis.
- [ ] Rodar o teste antes da implementação; observar falha.
- [ ] Implementar comportamento no core e CSS neutro no react, sem arrastar obrigatório e sem rotação automática.
- [ ] Executar teste, axe, typecheck e suíte; commit `feat: add manual carousel and accessible image comparison`.

### Tarefa 5 — Reprodução e alternativas ampliadas

**Arquivos:** react/player/{CompactAudioPlayer,SourceSelector,MediaSourcePlayer,SeekBackButton,SeekForwardButton,TranscriptSearch,ChapterList}.tsx; core/media/usePositionRestore.ts; modificar Player.tsx; teste `tests/integration/media-extensions.test.tsx`.
**Interfaces:** consome useMedia, contratos existentes e PlayerProps; produz controles e hook compartilhado de restauração `usePositionRestore({requestRef,snapshot,execute,timeout,onUnavailable})`, em que requestRef contém {time,playing}|null.

- [ ] Testar busca com zero/vários resultados sem roubar foco; ChapterList sem seek como texto; botões de salto usam config e capacidades.
- [ ] Testar troca de fonte sem autoplay involuntário, pronta antes da janela seekable, seek rejeitado sem retomada e posição fora da nova duração.
- [ ] Rodar o teste antes de implementar e confirmar falhas; preservar as regressões existentes de audiodescrição.
- [ ] Implementar extração da restauração sem duplicar lógica de Player/adapter; nova origem escolhida apenas por ação explícita.
- [ ] Executar testes novos + alternatives/players existentes, typecheck e suíte; commit `feat: extend media navigation and searchable transcripts`.

### Tarefa 6 — Arquivos locais e prévias

**Arquivos:** core/files/{validateFiles,useObjectUrl}.ts; react/files/{FilePicker,MediaPreview,MediaFileInfo}.tsx; testes `tests/unit/files.test.ts` e `tests/integration/file-picker.test.tsx`.
**Interfaces:** `validateFiles(files,options):{accepted:File[];rejected:Array<{file:File;reason:'type'|'size'|'count'}>}`; demais APIs acima.

- [ ] Testar accept por extensão/MIME/wildcard, MIME vazio, limites exatos e quantidade com seleção múltipla; limites negativos recebem erro de configuração documentado.
- [ ] Testar seleção via input, remoção e re-seleção do mesmo arquivo; object URLs criadas/revogadas em troca, desmontagem e StrictMode. `expect(currentPreviewUrl).not.toBe(revokedUrl)`.
- [ ] Rodar testes antes da implementação e confirmar falhas.
- [ ] Implementar sem rede, sem criar URLs em render e sem tratar HTML/SVG enviado como documento executável; fallback seguro para arquivo não suportado.
- [ ] Executar testes, typecheck e suíte; commit `feat: add local file selection and media previews`.

### Tarefa 7 — Estados de mídia e refinamentos anteriores

**Arquivos:** react/media/{MediaLoading,MediaUnavailable,MediaErrorState}.tsx; core/media/tracks.ts, i18n/config, providers/{native,hls,dash}.ts, react/images/Image.tsx; testes `tests/integration/media-states.test.tsx`, `tests/unit/tracks.test.ts`.
**Interfaces:** estados reutilizam componentes gerais; ampliar labels com nomes sintéticos e passar traduções aos adaptadores por opções tipadas, preservando defaults quando chamados diretamente.

- [ ] Testar retry produz ação; ausência de retry não cria botão vazio; status de carregamento não duplica anúncios.
- [ ] Testar uma faixa válida seguida de URL inválida não altera o DOM; labels customizados substituem nomes sintéticos; aviso de alt só em desenvolvimento.
- [ ] Rodar testes antes da correção e observar falhas.
- [ ] Validar todo o lote de tracks antes de anexar, centralizar traduções e restringir aviso de desenvolvimento.
- [ ] Executar regressões de providers/imagens, typecheck e suíte; commit `fix: refine media states tracks and translated defaults`.

### Tarefa 8 — Catálogo por componente e exemplos completos

**Arquivos:** apps/docs/src/{App,ComponentPage,ExamplesPage}.tsx; `catalog/{registry,api}.ts`; `examples/{Podcast,Lesson,MediaLibrary,ProductGallery,AccessibleForm,LocalFiles,Preferences,ThemeComposition,States}.{tsx,jsx}`; docs/api/expansion.md; teste `tests/integration/catalog.test.tsx`.
**Interfaces:** registry `Array<{id,group,title,description,preview,jsx,tsx,props,keyboard,contentRequirements}>` usa somente APIs públicas. JSX/TSX apresentados correspondem ao exemplo executável.

- [ ] Testar navegação para componentes novos, abertura de fluxo completo, submissão inválida com resumo focalizado e links de erro, confirmação local válida e ações de seleção/paginação reais.
- [ ] Observar falha com `npm test -- tests/integration/catalog.test.tsx`.
- [ ] Implementar páginas por componente e nove fluxos definidos no desenho, variações aplicáveis e documentação de conteúdo/teclado. Sem botões sem efeito.
- [ ] Executar build do catálogo e teste; conferir exemplos JSX/TSX compilam, não apenas strings copiadas; commit `docs: expand component catalog and complete interaction examples`.

### Tarefa 9 — Validação, revisão e nova distribuição

**Arquivos:** tests/e2e/expansion.spec.ts, tests/consumer/check.mjs; docs/accessibility/{expansion-results,manual-results,known-limitations}.md; README/CHANGELOG; manifests/lockfile; script de distribuição existente.
**Interfaces:** preservar os três tarballs e o ZIP; nova versão candidata 0.2.0 nos pacotes e dependências internas, atualizando consumidores/README sem nomes de tarball antigos fixados no teste.

- [ ] Adicionar cenários de navegador para formulário, tabs, carousel, comparação, arquivos e troca de fonte; axe com contraste no navegador, sem presumir SR aprovado.
- [ ] Rodar typecheck, suíte inteira, build e consumidores JSX/TSX/SSR em React 18/19; repetir tentativa de E2E/provedores e registrar exatamente o resultado.
- [ ] Reunir revisão independente do diff completo; corrigir importantes/críticos com regressões RED→GREEN e suíte verde. Pendências manuais continuam separadas.
- [ ] Gerar novos tarballs e ZIP, verificar integridade e presença de fontes/catálogo/evidências; atualizar o arquivo de entrega existente após sucesso.
- [ ] Commit `release: prepare expanded media design system candidate`; não fazer push/publicação.

## Autorrevisão e conclusão

Cobertura conferida: formulários (1), navegação/estados/estrutura (2), organização de mídia (3), imagens (4), reprodução/transcrição (5), arquivos (6), estados e refinamentos anteriores (7), exemplos/documentação (8), evidências/distribuição (9). Os cinco focos têm tarefas e casos de teste responsáveis.

A implementação só é concluída para o escopo de código quando todos os componentes e fluxos listados existem, ações têm efeito e os pacotes são consumíveis. Acessibilidade completa continua dependente das verificações manuais e do conteúdo; indisponibilidade de ambiente não é aprovação.

Plano pronto para revisão. Após confirmação, executar neste mesmo método, sem pedir aprovação entre tarefas.
