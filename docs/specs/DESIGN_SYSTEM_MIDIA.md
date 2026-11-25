# Design system de mídia para React

Data: 07/11/2026. Estado: proposta para aprovação; implementação ainda não iniciada.

## Intenção e decisões confirmadas

Criar uma biblioteca reutilizável para aplicações React em JS/TS e JSX/TSX, com foco em mídia e acessibilidade. Separar comportamento e apresentação, permitindo identidade visual definida pela aplicação. Incluir arquivos por URL, transmissões e incorporações do YouTube/Vimeo.

## Abordagens consideradas

1. Headless somente: máxima liberdade, mas transfere todo o layout e sua validação à aplicação.
2. Componentes neutros prontos: integração rápida, menor flexibilidade estrutural.
3. Duas camadas: comportamento reutilizável e componentes neutros prontos; custo maior de manutenção e documentação. Escolhida pela usuária.

## Arquitetura proposta

- Core React: hooks, contextos e primitivas sem CSS visual, com contratos de estado, eventos, nomes acessíveis e interação. A composição deve preservar semântica e não permitir substituições arbitrárias que quebrem teclado silenciosamente.
- Componentes React: composição do core, layout responsivo e CSS neutro importado separadamente. Tokens semânticos para cores, tipografia, espaçamento, tamanho de controles, bordas, foco e movimento. Não exigir Tailwind ou um provedor global de tema.
- Adaptadores de reprodução independentes: HTMLMediaElement, HLS, DASH, YouTube e Vimeo. Carregamento sob demanda; não incluir SDKs de todos os provedores em um player simples.
- Entrega: pacotes JavaScript compilados com declarações TypeScript, exports explícitos, exemplos JSX/TSX, documentação interativa e guia de migração/versionamento. Nomes dos pacotes e ferramenta de build ficam para a implementação.
- SSR: não acessar window/document na importação; inicializar SDKs apenas no cliente, com estado inicial estável para hidratação. Limpar listeners, timers e instâncias ao desmontar ou trocar fonte.

## Escopo dos componentes

| Família      | Componentes e recursos                                                                                                                          |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Vídeo        | Player, poster, reprodução/pausa, progresso, volume, tempo, velocidade, legendas, capítulos, tela cheia e picture-in-picture quando disponíveis |
| Áudio        | Player, progresso, volume, velocidade, metadados e playlist                                                                                     |
| Alternativas | Transcrição estática/sincronizada, seleção de legendas e acesso a versão com audiodescrição                                                     |
| Imagens      | Image, Figure, Gallery e ImageViewer com zoom, descrição e diálogo                                                                              |
| Primitivas   | Button, IconButton, Slider, Menu, Tooltip, Dialog, VisuallyHidden e mensagens de estado                                                         |

Não ampliar esta primeira versão para um catálogo completo de formulários e tabelas. Sem backend de hospedagem, transcodificação, criação automática de legendas, geração de audiodescrição ou serviço de transmissão.

## Fontes e capacidades

Proposta técnica do assistente: transmissões significam inicialmente HLS e MPEG-DASH, ao vivo ou sob demanda. WebRTC, DRM, casting e gestão de assinaturas ficam fora desta versão. Validar essas fronteiras na aprovação.

O consumidor declara o tipo de fonte explicitamente; não depender apenas da extensão da URL, pois URLs assinadas podem não ter extensão. Cada adaptador informa capacidades e indisponibilidades: seek, volume, velocidade, legendas, faixas de áudio, qualidade, fullscreen, PiP e estado ao vivo. Capacidades podem mudar após carregar metadados.

Comandos e eventos comuns devem distinguir loading, ready, playing, paused, buffering, ended e error. Rejeições de play, restrições do navegador, perda de rede, CORS e bloqueio de incorporação devem resultar em feedback acionável, sem loops de repetição automáticos. Trocar fonte cancela efeitos e eventos da fonte anterior. Várias instâncias funcionam sem atalhos ou estados globais conflitantes.

| Origem          | Política proposta                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------------- |
| Arquivo por URL | Controles próprios, capacidades dependentes de navegador/codec e configuração do servidor                     |
| HLS/DASH        | Adaptadores opcionais, reprodução nativa quando apropriada, fallback de erro explícito quando incompatível    |
| YouTube/Vimeo   | Iframes e APIs oficiais; preservar controles do provedor quando não houver equivalência acessível e suportada |

Não prometer personalização visual integral do interior de iframes, acesso aos arquivos de legenda, audiodescrição ou paridade de controles entre provedores. Não sobrepor controles que escondam funções necessárias. Documentar a matriz real de capacidades por adaptador e navegador durante a implementação.

Ao vivo: mostrar estado Ao vivo; oferecer Voltar ao vivo apenas quando houver janela navegável. Sem DVR, não oferecer seek. Não representar duração desconhecida/infinita como progresso percentual de um arquivo. Legendas ao vivo são fornecidas pela origem; a biblioteca não as produz.

## Acessibilidade

Objetivo: atender WCAG 2.2 nível AA nos componentes e exemplos sob nosso controle, com evidências por critério aplicável. A conformidade da aplicação completa depende também dos temas, conteúdo e provedores externos; não apresentar uma certificação geral.

- Preferir HTML nativo, nomes acessíveis, estados comunicados e ordem de leitura coerente.
- Teclado completo sem armadilhas; foco visível e não encoberto. Restaurar foco ao fechar diálogos; menus com comportamento consistente e Escape. Atalhos de caractere não ficam ativos globalmente: funcionam somente na área pertinente e podem ser desabilitados.
- Sliders com alternativas a arrastar, rótulo e valor textual adequado, inclusive tempo e volume. Disponibilizar controles de zoom e navegação sem gestos obrigatórios.
- Controles não desaparecem quando contêm foco ou um menu aberto. Evitar anúncios a cada atualização de tempo; anunciar mudanças relevantes sem excesso.
- Tema neutro com contraste adequado de texto, controles e foco. Suportar forced-colors, zoom, reflow e prefers-reduced-motion. Controles com alvo recomendado de 44 por 44 CSS px.
- Sem reprodução automática por padrão. Sem flashes/efeitos decorativos; conteúdo audiovisual continua sendo responsabilidade do autor.
- Imagens informativas exigem texto alternativo; decorativas precisam ser declaradas explicitamente. Texto alternativo não é substituído automaticamente por nome de arquivo ou legenda.
- Legendas devem poder representar fala e sons significativos. Aceitar faixas WebVTT para fontes próprias; transcrições fornecidas separadamente para fontes sem acesso ao conteúdo das faixas.
- Audiodescrição: primeira versão aceita uma versão alternativa do vídeo com descrição integrada; preservar posição quando tecnicamente possível e informar eventuais descontinuidades. Seleção de faixa de áudio depende de capacidade efetivamente exposta. Não implementar mistura de áudio externo como se fosse universal.
- Transcrição interativa com botões para trechos navegáveis, acompanhamento visual opcional e sem deslocar foco automaticamente. Em origens sem seek, manter transcrição somente textual.
- Rótulos padrão em português, substituíveis por dicionários de tradução, sem textos inacessíveis fixados em ícones.

## Integração e documentação

API composta para personalização e componentes prontos para casos comuns. Métodos imperativos de reprodução retornam resultado/erro; eventos normalizados preservam detalhes do provedor quando necessário. Modelar estado de reprodução efetivo a partir da origem, evitando prometer controle síncrono de uma API assíncrona.

Exemplos: áudio simples, vídeo com WebVTT e transcrição, versão audiodescrita, HLS ao vivo, DASH, YouTube, Vimeo, galeria e tema personalizado. Cada exemplo informa conteúdo exigido, atalhos, limitações e verificação manual. Oferecer estado inicial sem carregar o iframe até ativação como opção de integração.

## Validação e critérios de entrega

- Testes de comportamento e contrato dos adaptadores; controles exibidos apenas quando operacionais, inclusive após alterações de capacidade.
- Testes de integração com teclado, foco, erros, troca de fonte e desmontagem. Axe automatizado nas composições documentadas, sem tratá-lo como prova completa.
- Testes reais dos provedores e streams com fixtures licenciadas/autorizadas; mocks não comprovam reprodução ou acessibilidade de iframe.
- Matriz manual proposta: NVDA com Firefox/Chrome no Windows; VoiceOver com Safari no macOS/iOS; TalkBack com Chrome no Android. Registrar versões e resultados. Se um ambiente estiver indisponível, marcar como pendente, nunca aprovado.
- Validar zoom de 200%/400%, viewport estreita, alto contraste, movimento reduzido, múltiplos players, navegação por toque/teclado e personalização de tema.
- Cada componente deve ter documentação, exemplo funcional e evidência dos testes aplicáveis. A primeira versão não estará concluída enquanto adaptadores pedidos estiverem apenas simulados.

## Ordem proposta e decisões delegadas

Implementar fundações e reprodução por arquivo; alternativas acessíveis e galerias; HLS/DASH; YouTube/Vimeo; validação cruzada e documentação final. Todos integram o escopo, mesmo sendo desenvolvidos em etapas.

O implementador selecionará bibliotecas de primitives/streaming mantidas, após verificar APIs, licenças e compatibilidade; não reescrever motores de streaming. Também definirá build, organização de testes, nomes finais e versões React suportadas, documentando a matriz antes da publicação. Publicação em registro público não faz parte desta aprovação.

## Referências oficiais consultadas

- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Guia de mídia acessível WAI: https://www.w3.org/WAI/media/av/
- YouTube IFrame API: https://developers.google.com/youtube/iframe_api_reference
- Parâmetros YouTube: https://developers.google.com/youtube/player_parameters
- Vimeo Player SDK: https://github.com/vimeo/player.js/

## Aprovação solicitada

Aprovar arquitetura e escopo deste documento, incluindo HLS/DASH como interpretação inicial de transmissões e os limites de controle de provedores externos. Após aprovação, elaborar plano de implementação e construir a biblioteca.
