# Limitações conhecidas

- A versão é candidata: faltam reprodução real validada, revisão visual em navegador e a matriz manual de leitores de tela.
- Um iframe de terceiro continua sob controle do provedor. Não há promessa de identidade visual integral, legenda extraível ou paridade de controles.
- HLS nativo não fornece toda a informação do manifesto ao adaptador; a identificação automática de live é conservadora.
- O volume programático e o picture-in-picture dependem de navegador/dispositivo.
- Conteúdo fornecido sem alternativas corretas e temas com contraste insuficiente podem tornar a aplicação inacessível.
- JS sem TypeScript não impede conteúdo alternativo incorreto; o aviso de desenvolvimento não substitui revisão editorial.
- A versão descrita dos exemplos contém narração sintética em inglês; é uma fixture técnica com proveniência registrada.
- A configuração de algumas contas Vimeo pode impedir alteração de qualidade/velocidade/faixa. Os controles internos permanecem disponíveis.

Não há publicação no npm nem serviço de hospedagem de mídia associado a este projeto.

## Atualização 0.2

Os três refinamentos anteriores foram corrigidos: anexação atômica de faixas VTT, traduções dos rótulos sintéticos e aviso de alt restrito ao desenvolvimento. A execução de scripts em Windows ainda requer confirmação no ambiente de destino. A matriz manual e a execução real em navegadores permanecem pendentes quando indisponíveis.
