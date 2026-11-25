# Validação manual e limites

Estado: pendente. Nenhuma validação com leitor de tela foi marcada como aprovada nesta entrega.

| Ambiente                    | Cenários                                                             | Resultado |
| --------------------------- | -------------------------------------------------------------------- | --------- |
| Windows + NVDA + Firefox    | Teclado, nomes/estados, sliders, menus, diálogo, transcrição, iframe | Pendente  |
| Windows + NVDA + Chrome     | Mesmos cenários e reprodução                                         | Pendente  |
| macOS + VoiceOver + Safari  | Reprodução nativa/HLS, foco, faixas, galeria                         | Pendente  |
| iOS + VoiceOver + Safari    | Toque, volume do dispositivo, fullscreen e iframe                    | Pendente  |
| Android + TalkBack + Chrome | Navegação por toque, controles, transcrição, galeria                 | Pendente  |
| Navegador desktop           | Zoom 200%/400%, 320 CSS px, forced-colors, movimento reduzido        | Pendente  |

Registrar em cada execução: versão da biblioteca, sistema, navegador, leitor de tela, conteúdo usado, passos, resultado, falha e evidência. Não transformar um teste pulado ou um ambiente indisponível em aprovação.

O Chromium automatizado foi inicialmente bloqueado pelo ambiente ao criar seu socket de processo. O navegador conectado de inspeção também não alcançou o servidor local (ERR_CONNECTION_REFUSED). Esses bloqueios não comprovam uma falha ou um sucesso do componente. Os testes permanecem no projeto para execução local/CI.
