# Relatório — Desafio 13 (Clínica API)

## A) Itens do ticket
Para cada item: **Bug** ou **Comportamento correto**. Bug: arquivo, causa e correção. Correto: a regra (Rn) que o justifica.

| # | Veredito | Regra / causa (arquivo) | Correção |
|---|----------|-------------------------|----------|
| 1 | Bug | Violava a R4: em `src/services/scheduleRules.js` (`overlaps`) a comparação usava `<=`, tratando os intervalos como fechados. A consulta das 09:00 termina às 09:30 e a seguinte começa às 09:30; com `<=` isso contava como sobreposição e a API devolvia 409 | Trocar por `aStart < bEnd && bStart < aEnd` (intervalos `[início, fim)`). Marcar 09:30 depois de 09:00 agora devolve 201 |
| 2 | Bug | Violava a R10: em `src/services/pricing.js` (`cancellationFee`) a base da taxa era o `price` cheio do médico (R$ 180,00), sem o desconto de convênio da R8. Bruno cancelou 5h antes: 50% de 180,00 = 90,00, quando o preço da consulta dele era 126,00 | `cancel` (`src/services/appointmentService.js`) passa o paciente para `cancellationFee`, que aplica `base * 0.7` quando `plan === "convenio"`. Taxa agora: 50% de 126,00 = R$ 63,00 |
| 3 | Bug | Violava a R14 (com R2): em `src/services/doctorService.js` (`slots`) o laço usava `m <= to`, incluindo o próprio fim do bloco (12:00 e 18:00) como horário de início. A última consulta da manhã começa às 11:30 e a da tarde às 17:30 | Trocar por `m < to`. A lista de 12/11 passou a ter 16 horários, de 08:00 a 11:30 e de 14:00 a 17:30 |
| 4 | Comportamento correto | R3: a consulta precisa começar pelo menos 2 horas depois de agora. Às 08:30, uma consulta às 10:00 tem só 1h30 de antecedência, então o 422 está certo mesmo com o horário livre | Nenhuma (código não alterado) |
| 5 | Comportamento correto | R10: faltando menos de 2h para o início, a taxa é 100% do preço. Ana cancelou 1h antes de uma consulta de R$ 180,00 → taxa de R$ 180,00. Os 50% valem só entre 2h e menos de 24h | Nenhuma (código não alterado) |
| 6 | Comportamento correto | R12: a remarcação exige 24 horas ou mais de antecedência em relação ao horário original. A consulta era às 15:00 e o pedido foi às 10:00 (5h antes), então o 409 está certo, independente de o novo horário estar livre | Nenhuma (código não alterado) |

## B) Bugs escondidos (não citados no ticket)

| # | Bug (o que errava) | Regra | Onde (arquivo) | Correção |
|---|--------------------|-------|----------------|----------|
| 1 |                    |       |                |          |

(Adicione uma linha por bug.)

## C) Verificação depois da correção
Cole a saída real do `npm run repro` depois de corrigir tudo e liste, em uma tabela curta, o que você
testou (Postman ou script) para cada bug do bloco B e o resultado. "Acho que corrigi" não vale.

### Saída do `npm run repro`

```
=== Item 1: horários colados (Dra. Helena, 09:00 e depois 09:30)
09:00 (Ana): 201
09:30 (Diego): 201 ""

=== Item 2: taxa de cancelamento do convênio (Bruno cancela 5h antes)
cancelamento: 200 taxa = 63
débito do Bruno: 63

=== Item 3: horários livres da Dra. Helena em 2026-11-12 (quinta)
200 16 horários: 08:00 08:30 09:00 09:30 10:00 10:30 11:00 11:30 14:00 14:30 15:00 15:30 16:00 16:30 17:00 17:30
marcar 12:00: 422 "Horário fora do expediente"
marcar 18:00: 422 "Horário fora do expediente"

=== Item 4: marcar em cima da hora (agora 08:30, consulta às 10:00)
marcar: 422 "Agendamento exige antecedência mínima de 2 horas"

=== Item 5: taxa de cancelamento (Ana cancela 1h antes de uma consulta de R$ 180)
cancelamento: 200 taxa = 180

=== Item 6: remarcação no mesmo dia (consulta às 15:00, agora 10:00, novo horário 16:30)
remarcar: 409 "Remarcação exige 24 horas de antecedência"
```
