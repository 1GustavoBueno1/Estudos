# TICKET #509 — Reclamações da recepção (Clínica Vida)

Chegaram estas 6 reclamações. Para cada uma: investigue, diga se é **bug** ou
**comportamento correto pelas regras** (neste caso cite a regra e **não altere o código**), e corrija
a causa dos bugs reais. Use `npm run repro` para reproduzir.

1. **Horários colados dão conflito.** A recepção marcou a Dra. Helena às 09:00. Ao marcar outro
   paciente com ela às 09:30 (a primeira consulta termina às 09:30) a API respondeu 409.

2. **Taxa de cancelamento do convênio alta.** O Bruno (convênio) cancelou a consulta com a Dra. Helena
   5 horas antes e foi cobrado R$ 90,00 de taxa. Ele reclama que pagou a consulta com desconto de
   convênio e a taxa não parece refletir isso.

3. **Agenda mostra horário que não dá para marcar.** `GET /doctors/1/slots?date=2026-11-12` lista o
   horário das 12:00 e o das 18:00 como livres, mas ao tentar marcar eles a API recusa (422).

4. **Marcar em cima da hora é recusado.** São 08:30 e a recepção tentou marcar uma consulta para as
   10:00. A API respondeu 422. A atendente acha que, se o horário está livre, deveria deixar marcar.

5. **Taxa de 100%.** A Ana cancelou a consulta 1 hora antes do horário e foi cobrada R$ 180,00 (o valor
   inteiro da consulta). A recepção acha abusivo; a taxa máxima deveria ser 50%.

6. **Remarcação recusada.** A consulta da Ana é hoje às 15:00 e agora são 10:00. Ela pediu para remarcar
   para as 16:30 de hoje, horário livre, e a API respondeu 409. O atendente acha que remarcar para um
   horário livre deveria sempre funcionar.

---
Atenção: o ticket não cita todos os problemas. Faça uma revisão crítica do código contra o REGRAS.md.
