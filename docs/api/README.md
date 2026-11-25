# API pública

A versão 0.1.0 é candidata e ainda precisa da validação manual indicada em `../accessibility/manual-results.md`.

## Pacotes

| Importação                                                          | Conteúdo                                                          |
| ------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `@cereja-project/ui-core`                                                    | Tipos, MediaRoot, MediaHost, useMedia, configuração e primitivas  |
| `@cereja-project/ui-react`                                                   | Componentes prontos, composição dos controles e reexports do core |
| `@cereja-project/ui-react/styles.css`                                        | Tokens neutros e estilos dos componentes                          |
| `@cereja-project/ui-react/tokens.css`                                        | Apenas os tokens padrão                                           |
| `@cereja-project/ui-react/components.css`                                    | Apenas estilos; forneça os tokens na aplicação                    |
| `@cereja-project/ui-providers`                                               | autoAdapter e resolveAdapter; importação dos motores sob demanda  |
| `@cereja-project/ui-providers/native`, `/hls`, `/dash`, `/youtube`, `/vimeo` | Factories explícitas dos adaptadores                              |
| `@cereja-project/ui-providers/config`                                        | Valores padrão e tipos das opções de carregamento externo         |

## Players

VideoPlayer e AudioPlayer recebem:

| Propriedade       | Tipo / função                                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------------------------- |
| `label`           | String obrigatória; nome acessível da região e da mídia                                                         |
| `source`          | `{ type: 'file' \| 'hls' \| 'dash', src, mimeType? }` ou `{ type: 'youtube' \| 'vimeo', id, embedUrl?, live? }` |
| `poster`          | URL de imagem para vídeo nativo                                                                                 |
| `tracks`          | Array `{ id, src, language, label, kind: 'captions' \| 'subtitles', default? }`                                 |
| `transcript`      | Array `{ id, start, end, text }`, com tempos em segundos                                                        |
| `chapters`        | Array `{ id, start, title }`                                                                                    |
| `describedSource` | Fonte da versão com audiodescrição integrada                                                                    |
| `describedTracks` | Legendas da versão descrita; omitir para reutilizar tracks                                                      |
| `loadStrategy`    | `immediate` (padrão) ou `on-interaction`; a segunda evita carregar o provedor até ativação                      |
| `shortcuts`       | Booleano; padrão true, somente no contêiner em foco, nunca global                                               |
| `onError`         | Callback por erro distinto; use code para tratamento e evite expor cause em produção                            |
| `adapterFactory`  | Integração opcional de um adaptador próprio, com o mesmo contrato de estado/comandos                            |

URLs precisam ser acessíveis no navegador. HTTPS/HTTP/blob são aceitos para mídia; iframes aceitam apenas hosts oficiais HTTPS. URLs assinadas funcionam com tipo explícito. Cookies, CORS, CSP, codecs e permissões do provedor continuam sujeitos à aplicação/servidor.

Uma legenda descritiva inclui sons significativos, não apenas fala. Uma transcrição não substitui automaticamente a audiodescrição exigida para determinado conteúdo. Para lives de YouTube/Vimeo, declare live=true: a UI mantém o controle de navegação dentro do iframe, sem inventar uma janela DVR.

## Composição

MediaRoot recebe `{source, kind, adapterFactory, children, onError?}`. Inclua um único MediaHost vazio; o adaptador administra seus filhos. useMedia retorna `{snapshot, execute}`. Comandos são assíncronos e retornam `{ok:true}` ou `{ok:false,error}`; o resultado não substitui o evento que confirma o novo estado de reprodução.

O snapshot contém status, posição, paused (estado de pausa que também vale durante buffering), duração (null quando desconhecida), seekable, volume, muted, playbackRate, availablePlaybackRates (quando informado pelo provedor), live, tracks, selectedTrackIds, capabilities e error. Duração desconhecida nunca deve ser convertida em porcentagem.

Primitivas sem CSS visual ainda exigem contraste, foco e alvos adequados na apresentação. VisuallyHidden mantém o CSS mínimo necessário à sua função. Os controles prontos são PlayerControls, SeekControl, VolumeControl, CaptionMenu, TrackMenu, ChapterMenu, DescriptionToggle e Transcript. Use-os dentro de MediaRoot. Transcript também aceita follow, desativado por padrão.

## Imagens

Image/Figure recebem image. Gallery recebe items. ImageViewer recebe `{items, activeId, onActiveChange, returnFocusRef?}`; forneça returnFocusRef ao usar o visualizador sozinho e quando o acionador puder ser removido.

ImageData exige `{id,src,alt}` para conteúdo informativo ou `{id,src,decorative:true}` para decoração; caption e description são opcionais. JS sem tipagem recebe aviso de desenvolvimento para alt ausente. Conteúdo alternativo precisa ser correto, não pode ser inferido do nome do arquivo.

## Configuração

MediaConfigProvider é opcional: `{labels:Partial<MediaLabels>,config:Partial<MediaConfig>,children}`. Herda valores do provedor pai. defaultLabels/defaultConfig são públicos; mantenha parâmetros positivos e coerentes ao sobrescrever. Os defaults de interação ficam em `packages/core/src/config.tsx`.

Para timeouts específicos de um iframe, passe uma factory personalizada: `options => createYouTubeAdapter({...options,settings:{sdkTimeout:20000,readyTimeout:20000,pollInterval:500}})`. Os defaults ficam em `packages/providers/src/config.ts`. Instâncias compartilham o carregamento do SDK YouTube; a primeira solicitação determina o timeout dessa carga compartilhada.

Menus de mídia escolhem por padrão um portal dentro do player, inclusive para fullscreen. Menu também aceita portalContainer para composições próprias. Ao trocar a versão descrita, a restauração aguarda a janela navegável; positionRestoreTimeout (padrão 5000 ms) limita a espera. Uma falha de seek não inicia automaticamente a nova reprodução.
