# Validação da expansão 0.2.0

- 94 testes automatizados aprovados após a revisão independente, incluindo semântica com axe em jsdom, teclado, formulários, seleção, restauração de posição e ciclo de vida de URLs locais.
- Typecheck e build dos pacotes e do catálogo aprovados. Os exemplos TSX são verificados por TypeScript e os exemplos JSX fazem parte do build.
- Consumidores independentes React 18.2 e React 19: TSX, bundle JSX, SSR, estilos e exports públicos aprovados com os tarballs 0.2.0.
- A tentativa de E2E do catálogo e a tentativa dos provedores foram bloqueadas antes de abrir o Chromium: `socket() failed: Operation not permitted`. Os cenários restantes não executaram. Isso não constitui aprovação nem evidência de defeito do produto.

Ainda são necessárias validação visual, reprodução real de arquivos/transmissões e YouTube/Vimeo, fullscreen/PiP em dispositivos e a matriz manual com NVDA, VoiceOver e TalkBack. O axe em jsdom não verifica contraste real, layout ou toda a experiência com tecnologia assistiva.

O conteúdo precisa fornecer legendas, transcrição, audiodescrição e textos alternativos adequados. Quem aplicar um tema precisa verificar contraste e foco visível. Não há declaração de conformidade integral baseada apenas nestes testes.

## Revisão independente

A revisão encontrou e foi corrigida uma perda de foco ao trocar a fonte com audiodescrição disponível. O teste de regressão falhou antes e passou após a correção; a suíte completa foi repetida.

Refinamento menor pendente: a busca na transcrição pode contar um cue com intervalo inválido que a lista deixa de renderizar. Forneça cues com `end > start` e tempos finitos; essa divergência de contagem não foi incluída nesta versão.
