# Regras de negócio — Biblioteca API (Biblioteca Municipal)

Estas regras são a fonte da verdade. Se o código contraria uma regra, é bug.
Se o código segue a regra e o usuário reclama, **não é bug** — não altere.

## Dinheiro
- **R1.** Todos os valores monetários (`fine`, `unpaidFines`, `paid`) são em reais, com no máximo 2 casas decimais. Arredondamento é "meio para cima" no centavo, inclusive nos valores acumulados.

## Empréstimo
- **R2.** Prazo: membro `regular` = 14 dias; `student` = 21 dias. Contam-se dias de calendário (Brasília) a partir do dia do empréstimo. O empréstimo vence às **23:59:59.999 (Brasília) do último dia do prazo**, inclusive.
- **R3.** Limite de empréstimos **ativos** ao mesmo tempo: `regular` = 3; `student` = 5. Ao atingir o limite, um novo empréstimo é recusado (422).
- **R4.** O membro não pode ter dois empréstimos ativos do mesmo livro (409). Um livro já devolvido pode ser emprestado de novo.
- **R5.** Membro com multa pendente (`unpaidFines > 0`) não pode pegar livro emprestado (422). `POST /members/:id/pay-fines` quita toda a multa pendente de uma vez.
- **R6.** Livros de referência (`isReference`) nunca podem ser emprestados (422).

## Estoque
- **R7.** Só há empréstimo se existir cópia disponível (409 caso contrário). `available` nunca fica negativo.
- **R8.** Criar um empréstimo baixa 1 cópia de `available`. **Um empréstimo rejeitado (qualquer erro) não pode alterar `available` nem dados do membro.**
- **R9.** Devolver repõe 1 cópia. Devolver um empréstimo já devolvido é recusado (409).

## Multa
- **R10.** Multa de **R$ 0,75 por dia de atraso**. Dias de atraso = dias de **calendário** (Brasília) entre o dia do vencimento e o dia da devolução. Devolver no dia do vencimento (até 23:59:59.999) não gera multa; a partir de 00:00 do dia seguinte já conta 1 dia, mesmo que tenham passado poucas horas.
- **R11.** A multa de um empréstimo tem teto de **R$ 20,00**, aplicado **antes** do desconto de estudante.
- **R12.** Membro `student` tem 50% de desconto na multa, aplicado **depois** do teto.
- **R13.** A multa é calculada na devolução, gravada no empréstimo (`fine`) e somada à multa pendente do membro (`unpaidFines`).

## Renovação
- **R14.** Cada empréstimo pode ser renovado **uma única vez**. A renovação estende o vencimento **a partir do vencimento atual** (não a partir de hoje) pelo prazo do tipo de membro (R2). Não renova empréstimo atrasado, já devolvido ou que já tenha sido renovado (409).

## Status
- **R15.** Status gravado: `active` ou `returned`. `overdue` é **derivado** (empréstimo `active` cujo vencimento já passou) e aparece só na resposta; nunca é gravado no banco.

## Listagem de livros
- **R16.** `GET /books` é paginado: `page` começa em 1, `pageSize` padrão 4 (máx. 20). A resposta traz `items`, `page`, `pageSize`, `total` e `totalPages` (= `ceil(total / pageSize)`). Os filtros `q` (busca no título, sem diferenciar maiúsculas/minúsculas) e `available=true` (só livros com `available > 0`) são aplicados **antes** de paginar; `total` e `totalPages` refletem o resultado filtrado. Cada página traz `pageSize` itens (a última pode ter menos), sem repetir nem pular livros.

## Erros
- **R17.** Id inexistente de livro, membro ou empréstimo responde 404.
