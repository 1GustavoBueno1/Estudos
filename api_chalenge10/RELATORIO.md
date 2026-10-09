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

## C) Verificação depois da correção
Cole aqui a saída real do `npm run repro` depois de corrigir tudo, e liste os cenários extras que
você rodou para os bugs do bloco B (comando e resultado). "Acho que corrigi" não vale.


1 = era um bug, nao e nada que envolva regras e sim erro nas regras de negocio, o codigo dava o limite de R$20 apenas no final quando ele ja efetuava o calculo de desconto para estudantes, a solução foi colocar o limitador antes de aplicar o desconto
2 = R16, no arquivo loanService era apenas um erro na regra de negocio que ignorava os livro com a quantidade = 1, mostrando apenas os > 1.
3 = R14 no arquivo loan service, a solução foi colcoar a data final do empréstimo
4 = R10, ela entregou o livro atrasada
5 = R14, nao pode renovar emprestismo atrasado
6 = R6, livros de referencia nao podem ser emprestados