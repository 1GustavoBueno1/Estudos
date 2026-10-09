# Relatório — Desafio 12 (Biblioteca API)

## A) Itens do ticket
Para cada item 1 a 6: **bug real** ou **comportamento correto**?
- Se bug: onde está a causa (arquivo e linha), por que errava e o que você mudou.
- Se comportamento correto: cite a regra (Rn) que o justifica. Não altere o código.

| # | Veredito | Regra / causa | Correção |
|---|----------|---------------|----------|
| 1 |          |               |          |
| 2 |          |               |          |
|3
| 4 |          |               |          |
| 5 |          |               |          |
| 6 |          |               |          |

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


1 = era um bug, nao e nada que envolva regras e sim erro nas regras de negocio, o codigo dava o limite de R$20 apenas no final quando ele ja efetuava o calculo de desconto para estudantes, a solução foi colocar o limitador antes de aplicar o desconto
2 = R16, no arquivo bookService.js era apenas um erro na regra de negocio que ignorava os livro com a quantidade = 1, mostrando apenas os > 1.
3 = R14 no arquivo loan service, a solução foi colcoar a data final do empréstimo
4 = R10, ela entregou o livro atrasada
5 = R14, nao pode renovar emprestismo atrasado
6 = R6, livros de referencia nao podem ser emprestados