# Pesquisa — RTX 3060 / TechPowerUp

## Fonte consultada

[TechPowerUp GPU Database](https://www.techpowerup.com/gpu-specs/)

A página passou por uma verificação automática e ficou acessível após o carregamento. A listagem popular mostra a entrada **GeForce RTX 3060 12 GB**, lançada em 25 de fevereiro de 2021, com GPU **GA106**, barramento **PCIe 4.0 x16**, memória **12 GB GDDR6 / 192 bit**, clock de GPU listado em **1777 MHz**, clock de memória em **1875 MHz** e configuração **3584 CUDA cores / 112 TMUs / 48 ROPs**.

Ainda é necessário abrir a página específica da RTX 3060 para confirmar TDP, potência da placa e demais especificações completas. A listagem da planilha local já informa TDP de 170 W para a RTX 3060 12 GB, mas a fonte externa deve ser usada para validação.

## Ficha detalhada confirmada

[GeForce RTX 3060 12 GB Specs](https://www.techpowerup.com/gpu-specs/geforce-rtx-3060-12-gb.c3682)

A ficha informa **TDP de 170 W**, conector de alimentação de 12 pinos, fonte sugerida de 450 W, arquitetura Ampere em processo de 8 nm baseada no GA106, 12 GB GDDR6 em barramento de 192 bits, clock base de 1320 MHz e boost de 1777 MHz. Os conectores são 1x HDMI 2.1 e 3x DisplayPort 1.4a.

## Review de placa customizada

[EVGA GeForce RTX 3060 XC Review](https://www.techpowerup.com/review/evga-geforce-rtx-3060-xc/)

O review é de uma RTX 3060 XC da EVGA, portanto medições de consumo/performance devem ser identificadas como uma placa customizada, não como valor universal para toda RTX 3060. A tabela introdutória registra MSRP de US$ 330 para a RTX 3060, estimativa de US$ 420 no período do review, e boost de 1852 MHz para a EVGA RTX 3060 XC.

## Metodologia de performance

[Average FPS](https://www.techpowerup.com/review/evga-geforce-rtx-3060-xc/29.html) informa que a TechPowerUp calcula a média dos resultados de todos os jogos do conjunto de testes, com gráficos separados para **1920×1080**, **2560×1440** e **3840×2160**.

[Relative Performance](https://www.techpowerup.com/review/evga-geforce-rtx-3060-xc/30.html) informa que cada gráfico toma a placa testada como **100%** e expressa as demais placas de forma relativa a ela. Isso é adequado para o dashboard como índice comparável, mas não substitui um FPS médio universal: o valor depende do conjunto de jogos, presets e resolução do review.

## Consumo medido no review

[Power Consumption](https://www.techpowerup.com/review/evga-geforce-rtx-3060-xc/36.html) informa que o sistema de aquisição coleta **40 amostras por segundo** e registra digitalmente cada ponto, em vez de apenas médias e picos. O texto contextualiza que a RTX 3060 fica **bem abaixo de 200 W** em consumo e que a eficiência energética é um pouco inferior à de outras placas Ampere, mas superior à geração Turing; também registra fonte mínima recomendada de 550 W para a placa testada/review.

A página apresenta gráficos de consumo idle, gaming/típico e máximo. A leitura visual parcial mostrou uma lista de valores de idle de outras GPUs, mas a linha específica da RTX 3060 não estava no trecho atualmente visível; não será usado um número exato sem extração da linha correspondente.

## Captura do gráfico

O gráfico de consumo da página 36 foi salvo para leitura detalhada em `research-assets/rtx3060-power-consumption-chart.png` e `.webp`. A captura tem 500×1490 px e será interpretada apenas nos valores legíveis, sem reconstruir números ocultos ou cortados.

## Valores legíveis nos gráficos

A captura do gráfico **Idle** mostra **EVGA RTX 3060 XC 12 GB: 13 W**.

Após rolar para o gráfico seguinte, a linha destacada **EVGA RTX 3060 XC 12 GB: 16 W** foi legível; o contexto do gráfico é a seção **Multi-Monitor**. Esses valores são da placa EVGA RTX 3060 XC testada, não devem ser generalizados automaticamente para qualquer modelo RTX 3060.

## Continuação da leitura visual

Após duas rolagens adicionais, a página alcançou o gráfico **Video Playback**. O trecho visível começa com GTX 1660 6 GB em 9 W, GTX 1060 6 GB em 10 W e outras placas; a linha da EVGA RTX 3060 XC ainda não apareceu nesse viewport. O gráfico imediatamente anterior terminou com RX 6800 XT 41 W. Não foi inferido valor para a RTX 3060 a partir desses trechos parciais.

## Video Playback e Gaming

A captura do gráfico **Video Playback** mostra **EVGA RTX 3060 XC 12 GB: 17 W**. Após a rolagem seguinte, o gráfico **Gaming** começou a aparecer; o trecho visível inicia com GTX 1650 Super 4 GB em 106 W, GTX 1060 3 GB em 107 W e GTX 1060 6 GB em 114 W. A linha da RTX 3060 ainda precisa ser capturada no gráfico Gaming; nenhum valor foi inferido a partir da ordem parcial.

## Carga gaming e máxima

A imagem original [Power Consumption — Gaming](https://tpucdn.com/review/evga-geforce-rtx-3060-xc/images/power-gaming.png) mostra **EVGA RTX 3060 XC 12 GB: 181 W**.

A imagem original [Power Consumption — Maximum](https://tpucdn.com/review/evga-geforce-rtx-3060-xc/images/power-maximum.png) mostra **EVGA RTX 3060 XC 12 GB: 179 W**. O resultado máximo abaixo do gaming é possível porque os testes representam cargas diferentes; deve ser reportado como medição específica do review, não como contradição ou como TDP.

Valores confirmados para a placa testada: idle **13 W**, multi-monitor **16 W**, video playback **17 W**, gaming **181 W**, máximo **179 W**, TDP de referência da ficha **170 W**.

## Tarifa de energia em São Paulo

[Enel São Paulo — Tarifa de Energia Elétrica](https://www.enel.com.br/pt-saopaulo/Para_Voce/tarifa-energia-eletrica.html)

A página oficial informa a Resolução Homologatória nº **3.596/2026**, de 30/06/2026, com tarifas válidas a partir de **04/07/2026**. Para **B1 — Residencial**, a tabela publicada traz **TUSD de R$ 472,42/MWh** e **TE de R$ 316,96/MWh**, totalizando **R$ 789,38/MWh = R$ 0,78938/kWh** antes de impostos, iluminação pública e bandeira tarifária.

Para modalidade tarifária branca B1 residencial, a página publica TUSD de R$ 997,85/MWh na ponta, R$ 682,59/MWh no intermediário e R$ 367,33/MWh fora de ponta; a TE é R$ 482,45/MWh na ponta e R$ 301,91/MWh no intermediário e fora de ponta. O cálculo principal deverá usar B1 convencional e declarar que impostos, CIP e bandeira podem alterar o valor final da fatura.

A Enel também informa que a bandeira tarifária é definida pela ANEEL e aplicada conforme o mês, independentemente do consumo individual.

## Bandeira tarifária de agosto de 2026

[ANEEL — Bandeira Tarifária continua amarela em agosto](https://www.gov.br/aneel/pt-br/assuntos/noticias/2026-defeso-eleitoral/bandeira-tarifaria-continua-amarela-em-agosto)

A ANEEL informou que agosto de 2026 permanece na **bandeira amarela**, com cobrança adicional de **R$ 1,885 por 100 kWh**, equivalente a **R$ 0,01885/kWh**. Portanto, uma simulação para agosto pode usar uma tarifa de referência de **R$ 0,80823/kWh** antes de impostos/CIP, somando a tarifa B1 convencional da Enel (R$ 0,78938/kWh) ao adicional da bandeira amarela. Para projeções mensais e anuais, o dashboard deverá permitir desligar a bandeira ou informar outro valor, pois ela varia por mês.

## Performance média por resolução

O gráfico [Average FPS 1920×1080](https://tpucdn.com/review/evga-geforce-rtx-3060-xc/images/average-fps-1920-1080.png) mostra **média de 117 FPS** para a EVGA RTX 3060 XC no conjunto de jogos do review.

O gráfico [Average FPS 2560×1440](https://tpucdn.com/review/evga-geforce-rtx-3060-xc/images/average-fps-2560-1440.png) mostra **média de 86 FPS** para a mesma placa e conjunto de jogos.

Esses números são médias agregadas do review de 25/02/2021, não uma promessa para todos os jogos atuais. Devem ser apresentados no dashboard como referência de bancada com fonte, resolução e contexto explícitos.
