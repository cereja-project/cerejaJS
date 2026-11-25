# Matriz de capacidades e limitações

Esta matriz descreve a implementação, não substitui resultados de execução. A reprodução real dos cinco adaptadores ainda exige os testes em navegador e conteúdos autorizados. As capacidades podem mudar após carregar metadados.

| Origem           | Reprodução                                    | Legendas                                                 | Qualidade / áudio                                               | Ao vivo                                                  |
| ---------------- | --------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------- |
| Arquivo          | HTMLMediaElement e controles próprios         | WebVTT e seleção nativa                                  | Recursos de áudio avançados não presumidos                      | Não inferido pela duração                                |
| HLS via hls.js   | MSE, sob demanda ou live                      | Faixas expostas pelo motor                               | Listas expostas pelo motor                                      | Manifesto e janela seekable; goLive usa alvo do motor    |
| HLS nativo       | Capacidade do navegador                       | TextTracks nativos                                       | Recursos específicos não presumidos                             | Identificação conservadora de janela móvel               |
| DASH via dash.js | MSE, sob demanda ou live                      | Faixas expostas pelo motor                               | Representações e faixas expostas pelo motor                     | isDynamic e janela nativa navegável                      |
| YouTube          | API oficial, iframe com controles preservados | Controles do provedor; sem lista de legendas customizada | Velocidades informadas pelo provedor; demais recursos no iframe | live=true declarado pelo consumidor; navegação no iframe |
| Vimeo            | SDK oficial, iframe com controles preservados | Faixas que o SDK consegue listar/ativar                  | Qualidades/faixas quando expostas; velocidade fica no iframe    | live=true declarado pelo consumidor; navegação no iframe |

Fullscreen e picture-in-picture customizados são expostos somente para mídia nativa quando detectados. Os iframes preservam as ações próprias do provedor. Restrições do vídeo, da conta, do navegador e do dispositivo podem fazer comandos retornarem erro mesmo após detecção.

HLS/DASH necessitam MSE quando não houver caminho nativo adequado. DRM, WebRTC e casting ficam fora deste escopo. Volume via JavaScript pode ser limitado em dispositivos móveis; usar volume do dispositivo/controles do provedor quando necessário. O suporte final por navegador será confirmado na matriz manual, e não deduzido de feature detection.

Para os exemplos externos, IDs padrão são os usados nas demonstrações dos provedores. Os testes aceitam YOUTUBE_TEST_VIDEO_ID e VIMEO_TEST_VIDEO_ID para vídeos autorizados pela equipe. Não re-hospedamos esses conteúdos.
