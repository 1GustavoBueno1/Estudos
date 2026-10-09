# Relatório — Desafio 12 (Biblioteca API)

## A) Itens do ticket
Para cada item 1 a 6: **bug real** ou **comportamento correto**?
- Se bug: onde está a causa (arquivo e linha), por que errava e o que você mudou.
- Se comportamento correto: cite a regra (Rn) que o justifica. Não altere o código.

| # | Veredito | Regra / causa | Correção |
|---|----------|---------------|----------|
| 1 | Bug | Violava a R11/R12: em `src/services/fineService.js` (`fineFor`) o desconto de estudante era aplicado antes do teto de R$ 20,00. Bruno teve 40 dias de atraso: 40 × 0,75 = 30,00 → 50% = 15,00 → teto não atuava. Pela regra: 30,00 → teto 20,00 → 50% = 10,00 | Aplicar `Math.min(baseFine, FINE_CAP)` primeiro (R11) e só depois o desconto `* (1 - rules.fineDiscount)` (R12). Multa agora: R$ 10,00 |
| 2 | Bug | Violava a R16: em `src/services/bookService.js` (`list`) o filtro `available=true` usava `b.available > 1`, então livros com exatamente 1 cópia (ex.: "Capitães da Areia") sumiam | Trocar por `b.available >= 1` (equivale a `available > 0`) |
| 3 | Bug | Violava a R14: em `src/services/loanService.js` (`renew`) a base da renovação era `clock.now()` (dia da renovação, 03/10), e não o vencimento atual (15/10). Por isso o novo vencimento caía em 17/10 em vez de 29/10 | Usar `brtDate(new Date(loan.dueAt))` como base. Novo vencimento: 29/10 às 23:59:59.999 (Brasília) |
| 4 | Comportamento correto | R10: o atraso conta dias de calendário (Brasília), não horas. O vencimento era 15/10 às 23:59:59.999; a devolução foi em 16/10 às 08h, e a partir de 00:00 do dia seguinte já conta 1 dia, mesmo que tenham passado poucas horas. 1 × R$ 0,75 = R$ 0,75 | Nenhuma (código não alterado) |
| 5 | Comportamento correto | R14: empréstimo atrasado não pode ser renovado (409) | Nenhuma (código não alterado) |
| 6 | Comportamento correto | R6: o "Atlas Geográfico" é livro de referência (`isReference: true`) e nunca pode ser emprestado (422) | Nenhuma (código não alterado) |

## B) Bugs escondidos (não citados no ticket)
Para cada um: regra violada (Rn), arquivo/linha, como reproduzir, o que você mudou.

| # | Bug (o que errava) | Regra | Onde (arquivo) | Correção |
|---|--------------------|-------|----------------|----------|
| 1 | A busca `q` era aplicada depois da paginação: procurava só na página atual, e `total`/`totalPages` contavam os livros sem o filtro | R16 | `src/services/bookService.js` (`list`) | Aplicar o filtro `q` em `books` antes de calcular `total` e fazer o `slice` |
| 2 | `book.available -= 1` rodava antes das validações: um empréstimo recusado (multa, limite, livro repetido) ainda tirava uma cópia do estoque | R8 | `src/services/loanService.js` (`create`) | Mover a baixa do estoque para depois de todas as validações |
| 3 | A checagem de livro repetido usava todos os empréstimos, inclusive os devolvidos: um livro já devolvido não podia ser emprestado de novo | R4 | `src/services/loanService.js` (`create`) | Incluir `l.status === 'active'` na condição |
| 4 | O limite de empréstimos ativos usava `>`, permitindo um empréstimo a mais (4 para regular, 6 para student) | R3 | `src/services/loanService.js` (`create`) | Trocar por `>= rules.maxActive` |
| 5 | O vencimento era calculado como agora + N×24h, caindo no horário do empréstimo e não às 23:59:59.999 (Brasília) do último dia | R2 | `src/services/loanService.js` (`create`) | `endOfDay(addDays(brtDate(now), rules.termDays))` |
| 6 | `unpaidFines` acumulava sem arredondar, gerando erros de ponto flutuante (ex.: `0.30000000000000004`) | R1 / R13 | `src/services/loanService.js` (`giveBack`) | `round2(member.unpaidFines + fine)` |
| 7 | A renovação sempre somava 14 dias; para `student` deveriam ser 21 | R14 (com R2) | `src/services/loanService.js` (`renew`) | Usar `rules.termDays` em vez do valor fixo `14` |

## C) Verificação depois da correção
Cole aqui a saída real do `npm run repro` depois de corrigir tudo, e liste os cenários extras que
você rodou para os bugs do bloco B (comando e resultado). "Acho que corrigi" não vale.

### Saída do `npm run repro`

```
=== Item 1: multa do estudante (Bruno, "O Cortiço")
empréstimo: 201 vence 2026-10-23T02:59:59.999Z
devolução: 200 multa = 10

=== Item 2: GET /books?available=true (Capitães da Areia, id 2, tem 1 cópia)
ids listados: 1,2,3,4,5,6,7,8,9,10,11,12 | total 12

=== Item 3: renovação (Ana, "Dom Casmurro", emprestado 01/10, renovado 03/10)
vencimento original: 2026-10-16T02:59:59.999Z
após renovar: 200 vence 2026-10-30T02:59:59.999Z

=== Item 4: multa por poucas horas (Ana devolve 08h do dia seguinte ao vencimento)
vence 2026-10-16T02:59:59.999Z
devolução: 200 multa = 0.75

=== Item 5: renovar empréstimo atrasado (Ana)
renovar: 409 {"error":"Empréstimo atrasado não pode ser renovado"}

=== Item 6: emprestar o "Atlas Geográfico" (id 10)
empréstimo: 422 {"error":"Livros de referência não podem ser emprestados"}
```

### Cenários extras do bloco B (requisições HTTP com `FAKE_NOW`)

| # | O que testei | Resultado |
|---|--------------|-----------|
| 1 | `GET /books?q=o&page=2&pageSize=2` | 200, ids `6,8`, `total` 7, `totalPages` 4 (filtro aplicado antes de paginar) |
| 2 | Tentei emprestar com multa (Carla, `unpaidFines` 5) o livro 2 e conferi `GET /books/2` | 422 "Membro com multa pendente" e `available` continuou 1 |
| 3 | Ana pegou o livro 7, devolveu e pegou de novo | 201, status `active` |
| 4 | Ana (regular) com 3 empréstimos ativos pediu o 4º | 422 "Limite de empréstimos ativos atingido" |
| 5 | Empréstimo em 01/10 às 10h | `dueAt` regular `2026-10-16T02:59:59.999Z` (15/10 23:59:59.999 BRT); student `2026-10-23T02:59:59.999Z` (22/10) |
| 6 | Ana devolveu dois livros com 1 e 2 dias de atraso (0,75 + 1,50) e conferi `GET /members/1` | `unpaidFines` = 2.25 |
| 7 | Bruno (student) renovou em 03/10 um empréstimo que vencia em 22/10 | `dueAt` passou de `2026-10-23T02:59:59.999Z` para `2026-11-13T02:59:59.999Z` (+21 dias) |
