# Componentes e exemplos da versão 0.2

A API anterior continua disponível. Os componentes gerais são exportados pelo core e reexportados por react; CSS só é carregado explicitamente. Card/Separator e composições de mídia ficam em react. As páginas do catálogo incluem contratos principais, teclado, responsabilidade de conteúdo e código JSX/TSX compilável.

## Formulários

Field associa um único controle a label/description/error/required. Input/Textarea/Select mesclam IDs e descrições do contexto com atributos nativos e expõem ref. Use controles específicos para checkbox/radio/file. RadioGroup usa fieldset/legend; Switch é checkbox nativo com role=switch. Não use placeholder como rótulo.

## Navegação e estados

Tabs tem ativação manual e orientação configurável. Accordion permite múltiplos itens abertos e estado controlado. Pagination usa páginas base 1 e normaliza limites visuais sem callback durante render. Breadcrumbs sinaliza a última página.

Alert é estático por padrão; announce ativa status/alert apenas quando necessário. Progress omite value no modo indeterminado. Skeleton é decorativo e só gera anúncio quando recebe label. EmptyState permite ação real opcional. Card é um contêiner; não transforma uma área com botões internos em outro botão.

## Mídia

MediaCard/Grid/List usam seleção explícita, identificada por id. A seleção da coleção se refere aos itens fornecidos; para preservar seleção entre páginas, una as seleções visíveis ao estado global como no exemplo MediaLibrary.

Carousel não avança automaticamente e não faz loop. ImageComparison recebe alternativas próprias e tem controles sem arrastar e opção lado a lado. A aplicação continua responsável por explicar o que a comparação significa.

CompactAudioPlayer reutiliza o AudioPlayer. Players aceitam children dentro do contexto para compor TranscriptSearch, ChapterList e controles adicionais. SourceSelector é controlado; MediaSourcePlayer usa VideoPlayer e restauração de posição para troca explícita de fontes. Sem equivalência temporal entre versões, a aplicação deve comunicar as diferenças. Posição é ajustada aos intervalos da origem e a retomada ocorre somente após seek aceito.

TranscriptSearch pesquisa texto fornecido, ignora diferenças de acentuação e não desloca o foco com o relógio. O conteúdo continua disponível para leitura quando seek não é possível.

## Arquivos locais

FilePicker valida accept, maxFiles e maxSizeBytes (inteiros não negativos), aceita controle por files/onFilesChange e limpa o input após seleção para permitir selecionar o mesmo arquivo novamente. MIME ausente usa extensões conhecidas como apoio; isso não constitui validação de segurança de servidor.

MediaPreview só cria URLs para conteúdo exibível e as revoga quando troca/desmonta. Imagens informativas precisam de alt; HTML e SVG enviados não são incorporados como documentos. Tipos sem prévia mostram apenas metadados. Não há upload, conversão ou processamento remoto.

## Tradução e conteúdo

MediaConfigProvider amplia labels/config existentes (incluindo locale para números). Rótulos sintéticos de adaptadores são recebidos como labels opcionais no AdapterFactory; a instância recebe os defaults configurados ao inicializar. Mudar labels gerais atualiza os controles, mas faixas já lidas podem conservar os nomes até um novo evento ou reinicialização da origem.

## Exemplos executáveis

Podcast, Lesson, MediaLibrary, ProductGallery, AccessibleForm, LocalFiles, Preferences, ThemeComposition e States ficam em apps/docs/src/examples/complete. Cada um tem fonte TSX e equivalente -js.jsx; jsx-index.jsx é compilado pelo catálogo. Snippets individuais ficam em apps/docs/src/catalog/snippets.
