# Revisão final da candidata

Uma revisão independente identificou oito problemas importantes e três refinamentos menores. Os importantes foram tratados em uma rodada de correção com testes de regressão. A revisão não declarou conformidade completa nem validou reprodução real.

| Problema                                          | Correção e evidência                                                                                                                 |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Atalhos em contenteditable vazio/plaintext-only   | Excluir áreas editáveis e descendentes; regressões para espaço/K                                                                     |
| Fallback oculto no visualizador independente      | Grupo de retorno persistente e visível quando não há returnFocusRef; remoção do acionador testada                                    |
| Metadados Infinity/NaN em iframes                 | Normalização na fronteira dos adaptadores e store; ranges válidos e formatadores protegidos                                          |
| Posição perdida antes de a janela seekable chegar | Preservar intenção até janela disponível; timeout configurável e aviso; não retomar após seek rejeitado                              |
| Menu fora do elemento fullscreen                  | Portal padrão dentro do player, container configurável; teste de contenção passou, fullscreen real pendente                          |
| Estado fatal YouTube sobrescrito pelo polling     | Preservar status error e caminho de retry; regressão com erro seguido de polling                                                     |
| Ausência de pausa durante buffering               | Campo paused distingue reprodução ativa; botão/atalho podem cancelar a reprodução pendente                                           |
| Invocação de npm incompatível com Windows         | Usar Node + npm_execpath, sem depender de executar npm.cmd diretamente; scripts executados em Linux, confirmação em Windows pendente |

Na integração final também foram corrigidos foco após retry/carregamento por interação e filtragem de velocidades pela lista efetivamente informada pelo provedor. O exemplo HLS ao vivo usa uma janela móvel local testada na camada HTTP/manifesto; a reprodução no navegador segue pendente.

A suíte final está em unit-results.json. Os consumidores empacotados JSX/TSX/SSR estão em ../compatibility/consumers.json. As limitações de ambiente e a matriz de leitores de tela continuam em manual-results.md.

Os três refinamentos menores adiados estão registrados em known-limitations.md: anexação não atômica de faixas inválidas, alguns labels sintéticos fora do dicionário e aviso de alt também em produção.
