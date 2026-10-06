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
2 = Realmente era um bug nao existe regra espeficia para este, era apenas um erro na regra de negocio que ignorava os livro com a quantidade = 1, mostrando apenas os > 1.
3 = nao e bug, segundo a regra R2 o livro fica emprestado por 14 dias, como ela renovou dia 3 dia 17 fecha certo
4 = não, não e abuso e apenas a regra R10 em vigor, para ela nao ser multada ela deveria ter entregado o livro antes de 23:59:59, mas ela entregou apos este horario e segundo as regras ela deve sim ser multada
5 = segundo a propria regra R14 ela nao pode renovar um emprestimo atrasado
6 = 