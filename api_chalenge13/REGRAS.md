# Regras de negócio — Clínica API (agenda de consultas)

Estas regras são a fonte da verdade. Se o código contraria uma regra, é bug.
Se o código segue a regra e o usuário reclama, **não é bug** — não altere.
Todos os horários e datas de regra são no relógio de **Brasília (UTC-3)**.

## Dinheiro
- **R1.** Valores em reais, com no máximo 2 casas decimais. Arredondamento "meio para cima" no centavo, inclusive nos valores acumulados (`owed`).

## Agendamento
- **R2.** Atendimento de segunda a sexta, em dois blocos: 08:00–12:00 e 14:00–18:00. Cada consulta dura 30 minutos e começa em múltiplo de 30 min, sem segundos. A última do bloco da manhã começa às 11:30 e a da tarde às 17:30. Fora disso: 422.
- **R3.** Antecedência: a consulta precisa começar **pelo menos 2 horas depois de agora** (exatamente 2h é permitido) e a data dela pode ser **no máximo 60 dias de calendário** depois da data de hoje. Fora disso: 422.
- **R4.** Um médico não pode ter duas consultas agendadas que se sobreponham. Os intervalos são `[início, fim)`: uma consulta que termina às 09:30 **não** conflita com outra que começa às 09:30. Consulta cancelada não ocupa horário. Conflito: 409.
- **R5.** Um paciente também não pode ter duas consultas agendadas que se sobreponham, mesmo com médicos diferentes (mesma semântica de intervalo do R4). Conflito: 409.
- **R6.** No máximo **2 consultas agendadas por paciente por dia** (dia de Brasília). A 3ª é recusada (422). Consulta cancelada não conta.
- **R7.** Paciente com débito (`owed > 0`) não pode agendar (422). `POST /patients/:id/pay` quita todo o débito de uma vez.

## Preço
- **R8.** O preço da consulta é o `price` do médico; paciente de plano `convenio` tem 30% de desconto (preço × 0,70, arredondado pelo R1). O preço é gravado na consulta no momento do agendamento e não muda depois.

## Cancelamento
- **R9.** Só se cancela consulta `scheduled` que ainda não começou (senão 409).
- **R10.** Taxa de cancelamento, calculada sobre o **preço gravado na consulta** (R8, já com desconto de convênio) e arredondada pelo R1:
  - faltando **24h ou mais** para o início: sem taxa (exatamente 24h = sem taxa);
  - faltando **menos de 24h e pelo menos 2h**: 50% do preço (exatamente 2h = 50%);
  - faltando **menos de 2h**: 100% do preço.
- **R11.** A taxa é gravada na consulta (`fee`) e somada ao débito do paciente (`owed`). Cancelar libera o horário (do médico, do paciente e do limite diário).

## Remarcação
- **R12.** Cada consulta pode ser remarcada **uma única vez** (`POST /appointments/:id/reschedule`, com `startsAt`). Só consulta `scheduled` que ainda não começou. A remarcação exige **24 horas ou mais** de antecedência em relação ao horário **original** (exatamente 24h é permitido; senão 409). O novo horário passa pelas mesmas regras de agendar (R2, R3, R4, R5, R6), ignorando a própria consulta nos conflitos. Mantém o preço e não gera taxa. Uma remarcação recusada não altera nada.

## Status
- **R13.** Status gravado: `scheduled` ou `cancelled`. `done` é **derivado** (consulta `scheduled` cujo horário já terminou) e aparece só na resposta; nunca é gravado.

## Consulta de horários
- **R14.** `GET /doctors/:id/slots?date=YYYY-MM-DD` devolve os horários de início que **poderiam ser agendados agora** naquele dia: respeitam R2 (nenhum horário fora do expediente), R3 (antecedência e janela) e R4 (médico livre). Fim de semana: lista vazia. `date` inválido: 400.

## Listagem
- **R15.** `GET /appointments` é paginado: `page` começa em 1, `pageSize` padrão 5 (máx. 20). Resposta: `items`, `page`, `pageSize`, `total`, `totalPages` (= `ceil(total / pageSize)`). Filtros `doctorId`, `status` (valor derivado, inclusive `done`) e `date` (dia de Brasília do início da consulta) são aplicados **antes** de paginar; `total` e `totalPages` refletem o resultado filtrado. Ordem: início crescente, depois id.

## Erros
- **R16.** Id inexistente de médico, paciente ou consulta: 404. `patientId`/`doctorId` ausentes ou não inteiros, e `startsAt` ausente, inválido ou sem fuso (ISO 8601 com `Z` ou `±hh:mm`): 400.
