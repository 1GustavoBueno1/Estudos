# Regras de negócio — Loja API (Casa & Cia)

Estas regras são a fonte da verdade. Se o código contraria uma regra, é bug.
Se o código segue a regra e o usuário reclama, **não é bug** — não altere.

## Dinheiro
- **R1.** Todos os valores monetários (`subtotal`, `discount`, `shipping`, `total`, `unitPrice`) são em reais, com no máximo 2 casas decimais. Arredondamento é "meio para cima" no centavo.

## Pedido
- **R2.** `subtotal` = soma de `preço unitário × quantidade` de todos os itens.
- **R3.** `total` = `subtotal − desconto + frete`.
- **R4.** O preço unitário fica **congelado** no momento em que o pedido é criado. Alterar o preço do produto depois **não** muda pedidos já feitos.
- **R5.** `quantity` de cada item deve ser um **número inteiro maior que zero** (400 caso contrário).
- **R6.** Se o mesmo produto aparecer em mais de uma linha do pedido, o estoque é verificado pela **soma** das quantidades.

## Estoque
- **R7.** O pedido só é criado se houver estoque suficiente para todos os itens (409 caso contrário). O estoque nunca fica negativo.
- **R8.** Criar um pedido baixa o estoque. **Um pedido rejeitado (qualquer erro) não pode alterar estoque nem uso de cupom.**
- **R9.** Cancelar um pedido devolve ao estoque as quantidades dele.

## Frete
- **R10.** Frete fixo de R$ 25,00. **Frete grátis** quando o `subtotal` (antes do desconto) for **maior ou igual a R$ 200,00**.

## Cupom
- **R11.** Tipos: `percent` (percentual sobre o **subtotal**, sem contar frete) e `fixed` (valor fixo). O desconto nunca passa do subtotal.
- **R12.** O cupom só vale se: existir; **não estar expirado** (vale até 23:59:59 do dia `expiresAt`, horário de Brasília, inclusive); ter `uses < maxUses`; e o `subtotal` ser `>= minSubtotal`. Caso contrário o pedido é recusado com 422.
- **R13.** O uso do cupom (`uses`) só é contado quando o pedido é criado com sucesso.
- **R14.** **Cancelar um pedido NÃO devolve o uso do cupom.** Cupom gasto é gasto.

## Status
- **R15.** Fluxo: `pending → paid → shipped → delivered`.
- **R16.** Só é possível cancelar pedidos em `pending` ou `paid`. Pedido `shipped`, `delivered` ou já `cancelled` não pode ser cancelado (409).

## Listagem de produtos
- **R17.** `GET /products` é paginado: `page` começa em 1, `pageSize` padrão 5 (máx. 50). A resposta traz `items`, `page`, `pageSize`, `total` e `totalPages` (= `ceil(total / pageSize)`). Cada página traz `pageSize` itens (a última pode ter menos), sem repetir nem pular produtos.
