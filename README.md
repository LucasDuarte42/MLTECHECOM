# GPU Metrics

Dashboard editorial para comparar placas de vídeo por **desempenho por watt** e **custo por FPS**.

O projeto foi construído em React + Vite + Tailwind CSS e inicia em português brasileiro. A base original contém 83 placas com modelo, faixa de resolução, tecnologia, PCIe e TDP. Como a planilha de origem não preenchia preço nem FPS, o dashboard permite editar esses valores diretamente na tabela ou importar um CSV complementar.

## Métricas

- `FPS/W = FPS médio ÷ TDP`
- `R$/FPS = preço ÷ FPS médio`

Os valores informados ficam salvos no armazenamento local do navegador. Nenhum dado é enviado para um servidor.

## Desenvolvimento

```bash
pnpm install
pnpm dev
```

Para validar o projeto:

```bash
pnpm check
pnpm build
```

## Importação

Use o botão **Modelo CSV** no dashboard para obter a estrutura pronta. O arquivo deve conter as colunas `Placa`, `Preço` e/ou `FPS médio`. O importador aceita separadores `;` ou `,` e faz correspondência exata pelo nome da placa.

## Estrutura

A interface principal está em `client/src/pages/Home.tsx`, os tokens visuais em `client/src/index.css` e os dados derivados da planilha em `client/src/data/gpus.ts`. A direção visual está documentada em `ideas.md`.
