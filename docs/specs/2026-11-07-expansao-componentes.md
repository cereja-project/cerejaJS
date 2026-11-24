# Expansão do Cereja UI: componentes gerais e mídia

Data: 07/11/2026. Estado: desenho para aprovação.

## Objetivo e decisões

Expandir a biblioteca React existente para cobrir componentes gerais e novos componentes de mídia, com exemplos completos em JSX e TSX. Manter core sem estilos visuais e componentes prontos neutros, tokens CSS, tradução de rótulos, SSR e carregamento sob demanda dos adaptadores. Esta expansão não altera os contratos públicos existentes sem necessidade documentada.

A usuária confirmou os dois grupos: mídia e componentes gerais. O catálogo e os pacotes atuais já fornecem players, alternativas, imagens, galeria, diálogo, menu, tooltip, botão e slider; esses itens serão reutilizados.

## Abordagem

Manter os pacotes core/react/providers e organizar os novos arquivos por domínio é a escolha recomendada. Uma biblioteca independente duplicaria configuração e testes; novos pacotes por componente acrescentariam instalação e versionamento sem benefício suficiente neste momento. Imports públicos permitem eliminar código não utilizado; componentes gerais não devem carregar SDKs de mídia.

## Componentes gerais propostos

| Grupo                 | Componentes                                                          |
| --------------------- | -------------------------------------------------------------------- |
| Formulários           | Field, Input, Textarea, Select nativo, Checkbox, RadioGroup e Switch |
| Estrutura e navegação | Tabs, Accordion, Breadcrumbs e Pagination                            |
| Informação e estados  | Alert, Progress, Skeleton e EmptyState                               |
| Composição            | Card e Separator                                                     |

Button, Dialog, Menu, Tooltip e Slider permanecem na base; terão mais exemplos e documentação, sem cópias equivalentes. Field fornece associação de rótulo, descrição, obrigatoriedade e erro. Os controles aceitam atributos nativos, refs, estados disabled/readOnly quando aplicáveis e uso controlado/não controlado coerente. Select será nativo nesta etapa; combobox pesquisável, editor rico e tabela de dados ficam para uma expansão própria.

Tabs, RadioGroup e Switch podem reutilizar primitivas mantidas, com contrato público próprio e revisão de licença/compatibilidade na implementação. Card não será automaticamente clicável nem receberá tabindex sem ação real.

## Componentes de mídia propostos

| Grupo                  | Componentes                                                            |
| ---------------------- | ---------------------------------------------------------------------- |
| Organização            | MediaCard, MediaGrid e MediaList com seleção opcional                  |
| Imagens                | Carousel manual e ImageComparison                                      |
| Reprodução             | CompactAudioPlayer, SourceSelector, SeekBackButton e SeekForwardButton |
| Alternativas           | TranscriptSearch e ChapterList                                         |
| Arquivos               | FilePicker, MediaPreview e MediaFileInfo                               |
| Estados compartilhados | MediaLoading, MediaUnavailable e MediaErrorState                       |

Os novos controles compostos reutilizam MediaRoot/useMedia e capacidades existentes. TranscriptSearch filtra texto fornecido e navega apenas quando seek está disponível; resultados e ausência de resultados são comunicados sem mover o foco automaticamente.

Carousel não gira sozinho. Controles anterior/próximo, posição e itens ocultos têm semântica e foco definidos; não depender de swipe. ImageComparison recebe duas imagens com alternativas próprias e oferece slider/botões e visualização lado a lado para não tornar a comparação dependente de arrastar ou da visão de uma divisória.

SourceSelector identifica a fonte e troca apenas mediante ação explícita. Preserva posição quando possível usando o mecanismo já existente e informa descontinuidades; não afirma equivalência temporal entre arquivos diferentes.

FilePicker funciona com botão/input nativo, com arrastar como alternativa opcional. Recebe tipos aceitos, limite de tamanho e quantidade configuráveis. MediaPreview trata objetos File/Blob locais, usa e revoga object URLs ao trocar/remover/desmontar; não envia arquivos à rede. Validação no cliente não substitui validação de um eventual servidor da aplicação. O componente não inclui upload, conversão ou processamento remoto.

## Exemplos completos

1. Podcast com player compacto, playlist e transcrição pesquisável.
2. Aula com capítulos, legendas e versão descrita.
3. Biblioteca de mídia com cards/lista, seleção, paginação e estados vazios.
4. Galeria de produto com carrossel manual, zoom e comparação de imagens.
5. Formulário acessível com campos, escolhas, instruções, erros e confirmação local.
6. Seleção e prévia de arquivos locais, com limites e remoção.
7. Preferências de reprodução usando abas, acordeão e switches.
8. Temas personalizados, tradução de rótulos e composição sem estilos.
9. Estados de carregamento, erro, recuperação, progresso e indisponibilidade.

O catálogo terá páginas por componente, com variações padrão/desabilitada/inválida conforme aplicável, código JSX e TSX, API, teclado e responsabilidades de conteúdo. Fluxos completos terão sua própria área. Ações de demonstração produzirão resultado observável; sem botões sem efeito ou resultados de backend inventados.

## Acessibilidade e comportamento

Objetivo WCAG 2.2 AA, sujeito à validação por cenário.

- HTML nativo quando suficiente; nomes, estados e relações de descrição/erro corretos.
- Labels visíveis; placeholder não substitui rótulo. Erros ligados aos campos e resumo com links após envio inválido.
- Teclado, foco visível e restauração; abas/rádios/acordeões respeitam o padrão escolhido. Atalhos não interferem em campos editáveis.
- Sem anúncios a cada frame/progresso. Mudanças relevantes comunicadas com prioridade adequada.
- Skeleton decorativo fora da árvore acessível, acompanhado por estado de carregamento nomeado; Progress com rótulo e modo indeterminado correto.
- Alvos padrão de 44 CSS px para controles interativos, reflow, alto contraste e redução de movimento.
- Imagens e mídia continuam exigindo alternativas editoriais corretas; nenhum componente gera automaticamente essas alternativas.
- Exemplos de erros não dependerão apenas de cor; tokens personalizados precisam preservar contraste.

## Verificação e entrega

Testes de interação para navegação/seleção, associação de rótulos/erros, controle de foco, busca, troca de fonte, comparação e ciclo de vida de arquivos. Testes axe nas composições, casos de navegador prontos e consumo dos pacotes em JSX/TSX/SSR. Não criar testes que apenas confirmem texto de fonte ou detalhes privados.

A entrega atualizada inclui ZIP com fontes, catálogo, pacotes locais e evidências. Corrigir também os três refinamentos registrados na primeira versão: anexação atômica de faixas VTT, labels sintéticos traduzíveis e aviso de alt restrito ao desenvolvimento.

Validar o ambiente de navegador novamente antes de registrar bloqueio persistente. Validações que continuarem indisponíveis, inclusive NVDA/VoiceOver/TalkBack, permanecem pendentes e não serão substituídas por aprovação automatizada. Não publicar em npm ou hospedar o projeto sem solicitação.

## Sequência de implementação

Fundações de formulário → navegação/estados → organização e imagens de mídia → reprodução/transcrições → arquivos locais → catálogo e fluxos → revisão e distribuição.

Componentes fora desta lista não fazem parte desta expansão. Detalhes de nomes de arquivos, assinaturas e comandos serão fixados no plano de implementação após aprovação deste desenho.
