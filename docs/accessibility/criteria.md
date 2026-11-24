# Roteiro de acessibilidade

WCAG 2.2 AA é o objetivo. Esta é uma lista de evidências a reunir, não uma declaração de conformidade integral.

| Critérios / tema                              | Implementação / evidência a verificar                                                                  |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 1.1.1 Conteúdo não textual                    | alt informativo ou decorative explícito; validação editorial do conteúdo                               |
| 1.2.1–1.2.5 Alternativas de mídia             | Legendas de fala/sons, transcrição adequada e versão descrita; legendas ao vivo fornecidas pela origem |
| 1.3.1 / 1.3.2 Semântica / sequência           | Elementos nativos, rótulos, diálogo e listas; leitura manual                                           |
| 1.4.3 / 1.4.11 Contraste                      | Tokens padrão contrastantes; validar renderização e todo tema personalizado                            |
| 1.4.4 / 1.4.10 Redimensionamento / reflow     | Zoom 200%/400%, controles que se reorganizam e viewport estreita                                       |
| 2.1.1 / 2.1.2 Teclado / ausência de armadilha | Teclado em todos os controles, Escape e retorno de foco; incluir iframe                                |
| 2.1.4 Atalhos de caractere                    | Restritos ao contêiner em foco, ignoram campos editáveis e podem ser desabilitados                     |
| 2.2.2 / 2.3.1 Movimento e flashes             | Sem autoplay por padrão; revisar também o conteúdo audiovisual fornecido                               |
| 2.4.3 / 2.4.7 / 2.4.11 Foco                   | Ordem, foco visível, não encoberto e restauração no visualizador                                       |
| 2.5.3 Nome e rótulo                           | Nomes acessíveis incluem rótulos visíveis                                                              |
| 2.5.7 Arrastar                                | Sliders, zoom e pan têm operação por teclado/botões                                                    |
| 2.5.8 Tamanho de alvo                         | Controles padrão com alvo recomendado 44×44 CSS px; validar composição final                           |
| 3.1.1 / 3.3.2 Idioma / instruções             | Aplicação declara idioma; labels são substituíveis; erros dão orientação                               |
| 4.1.2 / 4.1.3 Nome/papel/valor e status       | Ranges nativos com valor textual, estados, anúncios seletivos sem relógio live                         |

Os testes axe em jsdom desativam apenas color-contrast, pois não há layout/pintura de navegador. O teste de navegador mantém a verificação de contraste. Nenhuma pontuação axe equivale a conformidade WCAG completa.

Duas verificações adicionais de conteúdo: conferir que legendas incluem sons necessários e que a audiodescrição transmite informação visual relevante. A existência de uma URL ou faixa não comprova a qualidade dessas alternativas.
