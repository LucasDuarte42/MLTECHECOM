# Direção visual — GPU Metrics

## Abordagens consideradas

### 1. Instrument Panel Editorial
**Very Brief Intro:** Um dashboard técnico com linguagem de publicação editorial, inspirado em painéis de engenharia, tabelas de mercado e impressos suíços. A interface equilibra precisão, ritmo tipográfico e uma camada tátil de materialidade.

**Probability:** 0.07

### 2. Thermal Night Lab
**Very Brief Intro:** Uma experiência escura e imersiva, com mapas térmicos, brilhos controlados e acentos de energia para transformar eficiência em uma leitura quase científica. O foco é contraste dramático e sensação de laboratório de hardware.

**Probability:** 0.03

### 3. Consumer Tech Almanac
**Very Brief Intro:** Uma abordagem clara e acessível, com cartões leves, linguagem de revista de tecnologia e comparações rápidas para orientar decisões de compra sem parecer uma planilha. O tom é confiável, prático e amigável.

**Probability:** 0.09

## Abordagem escolhida: Instrument Panel Editorial

### Design Movement
Swiss International Typographic Style reinterpretado para data products: composição assimétrica, hierarquia tipográfica rigorosa, linhas de referência e números como elementos visuais.

### Core Principles
- **Precisão visível:** métricas, unidades e fontes devem ser fáceis de localizar e impossíveis de confundir.
- **Ritmo editorial:** alternar blocos densos de dados com respiros e grandes números de leitura instantânea.
- **Materialidade técnica:** textura de papel técnico, microgrades e marcações lembram uma bancada de engenharia sem virar decoração.
- **Decisão em primeiro plano:** cada visualização deve responder “qual placa entrega mais valor?” em poucos segundos.

### Color Philosophy
O fundo marfim-cinza cria a sensação de folha técnica e reduz a fadiga de leitura. Grafite funciona como instrumento de medição; azul ultramarino sinaliza confiança e é reservado para dados de desempenho; coral queimado marca custo e alertas; verde-lima elétrico é o código proprietário de eficiência por watt. A cor não enfeita: classifica a natureza da informação.

### Layout Paradigm
Estrutura de painel assimétrico: uma barra lateral estreita funciona como legenda e contexto; o conteúdo principal alterna entre uma faixa de leitura rápida e um palco de análise em duas colunas. Gráficos ocupam áreas generosas, enquanto as tabelas permanecem compactas e ancoradas por rótulos laterais.

### Signature Elements
- Marcadores numerados e linhas finas de calibração ao redor de títulos e gráficos.
- Pílulas de unidade com cantos pequenos, mais próximas de etiquetas de instrumento do que de badges genéricos.
- Blocos de destaque em verde-lima elétrico para “eficiência” e coral queimado para “custo por FPS”.

### Interaction Philosophy
Interações devem parecer ajustes em um instrumento: respostas rápidas, estados selecionados muito claros e feedback imediato. Filtros alteram todas as métricas relacionadas; tooltips explicam o cálculo, não apenas repetem o rótulo; ações importantes mantêm o usuário no mesmo contexto visual.

### Animation
Entradas em cascata de 40–60 ms entre blocos, com deslocamento vertical mínimo e opacidade; nada deve saltar ou flutuar sem função. Barras e pontos dos gráficos aparecem com uma expansão curta usando easing de saída. Hover em linhas aumenta contraste e revela a leitura auxiliar; respeitar `prefers-reduced-motion` e remover transições não essenciais.

### Typography System
- **Display:** `Archivo Narrow`, 700–800, para números hero, títulos de seção e rankings; sua largura comprimida mantém densidade sem perder impacto.
- **Body/UI:** `Manrope`, 400–700, para controles, descrições, tabela e microcopy.
- **Monoespaçada:** `IBM Plex Mono`, 500–600, para unidades, fórmulas e valores de referência.
- Hierarquia: títulos curtos em caixa alta com tracking amplo; números principais grandes e compactos; explicações em frases curtas com no máximo 68 caracteres por linha.

### Brand Essence
**GPU Metrics transforma dados brutos de hardware em decisões de compra comparáveis, para quem quer medir valor real — não apenas perseguir o maior FPS.**

Personalidade: **criteriosa, direta, engenhosa**.

### Brand Voice
Headlines são assertivas e orientadas à decisão; CTAs usam verbos de análise; microcopy explica sem infantilizar. Evitar promessas absolutas e superlativos sem base.

Exemplos:
- “Mais quadros não significam mais valor.”
- “Cruzar preço, watts e FPS”

### Wordmark & Logo
O símbolo é um “G” modular construído por três trilhas de circuito em ângulo, com uma interrupção central que lembra um gráfico de eficiência. O logotipo textual usa `Archivo Narrow` com espaçamento customizado e o símbolo aparece como um marcador verde-lima independente no cabeçalho e no favicon.

### Signature Brand Color
**Lima de Eficiência — `#C7F36B`**. Um verde-amarelo técnico, raro o bastante para ser reconhecível, usado apenas onde a interface quer comunicar que uma escolha entrega mais resultado com menos recurso.

## Regras de implementação

- O dashboard deve iniciar em português brasileiro e usar reais, watts e FPS como unidades explícitas.
- Métricas derivadas: `FPS/W = FPS médio ÷ consumo em W`; `R$/FPS = preço em R$ ÷ FPS médio`; `FPS/R$ = FPS médio ÷ preço em R$`.
- Quando a planilha não contiver uma coluna necessária, a interface deve declarar a limitação em vez de inventar valores.
- O tom visual deve permanecer editorial-técnico em todas as telas: evitar gradientes roxos, excesso de cartões arredondados, fundos totalmente centralizados e texto genérico.
- Assets visuais devem reforçar a leitura de bancada de hardware e não competir com os gráficos.

## Style Decisions

- Fundo base marfim-cinza com superfície de papel técnico sutil.
- Cor de marca exclusiva: `#C7F36B`.
- Tipografia não-Inter: Archivo Narrow + Manrope + IBM Plex Mono.
- Layout assimétrico com trilho lateral de contexto e área principal de análise.
- Dados de custo em coral queimado; dados de eficiência em lima; desempenho em azul ultramarino.
