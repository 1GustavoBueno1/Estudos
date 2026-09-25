# Relatório de Testes e Bugs

## 1. Bugs encontrados

| Arquivo > função | Causa em uma frase | Correção de sintoma que eu NÃO fiz, e por que |
| --- | --- | --- |
| `stockService > checkAvailability` (usado por `orderService.createOrder`) | Cada item do pedido é conferido isoladamente contra o estoque cheio, então dois itens do mesmo produto na mesma requisição passam na validação e `reserve` derruba o estoque para negativo. | Não zerei nem reajustei o estoque do produto afetado: isso esconderia o sintoma sem corrigir a validação, que é onde está a causa. |
| `orderService > cancelOrder` | A função não verifica se o pedido já está cancelado, então cada nova chamada devolve os itens ao estoque outra vez e responde 200 como se fosse um cancelamento válido. | Não corrigi o estoque inflado manualmente, porque o número errado é consequência do cancelamento repetido — corrigir o estoque deixaria a rota continuar aceitando cancelamento duplicado. |
| `reportService > salesReport` | O filtro compara `o.status !== "canceled"` (com um L) enquanto o banco grava `"cancelled"` (com dois L), então nenhum pedido cancelado é excluído da soma. | Não troquei o status dos pedidos no banco para bater com o filtro: o dado do banco está certo, quem está errado é a string do filtro. |
| `couponService > validateCoupon` (usado por `GET /coupons/:code/validate`) | A função incrementa `coupon.uses` dentro da validação, então a rota de validação — que só deveria consultar — consome um uso do cupom a cada chamada. | Não reverti o contador de usos na mão, porque o valor voltaria a subir na próxima consulta; o efeito colateral precisa sair da função de validação. |

## 2. O que investiguei e decidi que NÃO é bug

* `GET /products` — retorna a lista do banco normalmente, em cópias (`products.map`), sem vazar referência.
* `GET /products/:id` — retorna o produto e responde 404 quando o id não existe.
* `GET /orders` — retorna a lista de pedidos normalmente.
* `GET /orders/:id` — retorna o pedido e responde 404 quando o id não existe.
* `POST /orders` com um único item acima do estoque — bloqueado corretamente. A regra "não vender mais do que existe em estoque" é aplicada pelo `if (product.stock < item.qty)` em `checkAvailability`. Testei `qty: 21` para a Caneca (estoque 20) e a API respondeu `estoque insuficiente para Caneca`. O furo só aparece quando o mesmo produto vem repetido em itens separados, e por isso está listado como bug na seção 1.
* Regra de frete — `shippingFor` cobra R$ 19,90 e zera a partir de R$ 200 já com desconto aplicado, que é a regra descrita no código.
* Regras de recusa de cupom — cupom inexistente, expirado (`todayISO > expiresAt`), esgotado (`uses >= maxUses`) e subtotal abaixo do mínimo são recusados corretamente. O problema do cupom não está em qual cupom ele aceita, e sim no contador que ele altera durante a validação.
* `POST /orders/:id/cancel` para um pedido confirmado — o cancelamento em si funciona: muda o status e devolve os itens ao estoque. O defeito está apenas na repetição da chamada.

## 3. Cobertura de rotas

| Rota | O que eu testei | Resultado |
| --- | --- | --- |
| `GET /products` | Busquei a lista completa de produtos. | Retornou a lista do banco normalmente. |
| `GET /products/:id` | Busquei um produto existente e conferi o estoque antes e depois dos testes. | Retornou o produto corretamente; serviu de termômetro para os bugs de estoque. |
| `GET /orders` | Busquei a lista de pedidos. | Retornou a lista do banco normalmente. |
| `GET /orders/:id` | Busquei um pedido existente. | Retornou o pedido corretamente. |
| `POST /orders` | Criei pedido simples, com cupom, com produto acima do estoque e com o mesmo produto repetido em dois itens. | Criou o pedido, aplicou o cupom e barrou o item único acima do estoque; **falhou** no item repetido, aceitando 7 + 7 unidades de Bone com estoque 12. |
| `POST /orders/:id/cancel` | Cancelei um pedido e depois chamei a mesma rota de novo várias vezes. | Cancela corretamente na primeira vez; **falhou** nas chamadas seguintes, respondendo 200 e devolvendo os itens ao estoque de novo a cada chamada. |
| `GET /coupons` | Listei os cupons e comparei o campo `uses` antes e depois de validar. | A listagem em si está correta; serviu para provar que `uses` sobe durante a validação. |
| `GET /coupons/:code/validate` | Validei um cupom válido e conferi o contador de usos antes e depois. | Retornou `{"valid":true,"discount":10}` corretamente, mas **alterou o banco**: `uses` do BEMVINDO10 subiu de 3 para 4. |
| `GET /reports/sales` | Pedi o relatório do período inteiro e depois um período que contém só o pedido cancelado. | **Falhou**: o pedido 4 (`status: "cancelled"`, total 109,90) entrou na soma nos dois casos. |

## 4. Reprodução

Todos os testes abaixo foram feitos com o servidor recém-iniciado (`node server.js`, porta 3015), com o banco em memória no estado original.

### Bug 1 — Item repetido fura a validação de estoque

**Função:** `stockService.checkAvailability`, chamada por `orderService.createOrder`

**Passos:**

```
GET  /products/4                     -> stock: 12
POST /orders  { "customer": "Teste",
                "items": [ { "productId": 4, "qty": 7 },
                           { "productId": 4, "qty": 7 } ] }
GET  /products/4
```

**Comportamento esperado:** o pedido deveria ser recusado, porque são 14 unidades de Bone para um estoque de 12.

**Comportamento observado:** o pedido foi criado com status `confirmed` e subtotal R$ 630,00, e o estoque do Bone foi para **-2**.

**Causa:** o laço de `checkAvailability` compara cada item sozinho contra `product.stock`. Como 7 é menor que 12 nas duas voltas, os dois itens passam; só depois `reserve` subtrai as duas quantidades. Não existe soma por produto antes da conferência.

**Observação:** o banco já vem com um rastro desse mesmo problema — o pedido 3 tem duas linhas de Camiseta com `qty: 3` cada, e o produto 1 está cadastrado com `stock: -1`.

**Correção:** ainda não realizada. Será feita após a conclusão deste relatório.

### Bug 2 — Cancelamento repetido infla o estoque

**Função:** `orderService.cancelOrder`

**Passos:**

```
GET  /products/4              -> stock: 12
POST /orders/4/cancel         (o pedido 4 ja esta com status "cancelled" no banco)
GET  /products/4              -> stock: 14
POST /orders/4/cancel
POST /orders/4/cancel
GET  /products/4              -> stock: 18
```

**Comportamento esperado:** um pedido já cancelado não deveria ser cancelado de novo; a rota deveria recusar a operação e não mexer no estoque.

**Comportamento observado:** cada chamada respondeu 200 com o pedido, e cada chamada somou +2 no estoque do Bone. Em três chamadas o estoque foi de 12 para 18.

**Causa:** `cancelOrder` só testa se o pedido existe (`if (!order) return null`). Não há nenhuma verificação de `order.status === "cancelled"` antes de chamar `stockService.release(order.items)`, então a devolução ao estoque é executada quantas vezes a rota for chamada.

**Correção:** ainda não realizada. Será feita após a conclusão deste relatório.

### Bug 3 — Relatório de vendas inclui pedidos cancelados

**Função:** `reportService.salesReport`

**Passos:**

```
GET /reports/sales?from=2026-09-20&to=2026-09-20
```

Esse intervalo contém apenas o pedido 4, do Diego, que está no banco com `status: "cancelled"` e total R$ 109,90.

**Comportamento esperado:** `{ orders: 0, total: 0 }`, porque pedidos cancelados não entram na soma.

**Comportamento observado:** `{"from":"2026-09-20","to":"2026-09-20","orders":1,"total":109.9}`.

No período inteiro o efeito é o mesmo: `GET /reports/sales?from=2026-09-01&to=2026-09-30` retorna `orders: 6` e `total: 1067.61`, quando o correto seria 5 pedidos e R$ 957,71 (1067,61 - 109,90).

**Causa:** o filtro está escrito como `.filter((o) => o.status !== "canceled")`, com um único L, enquanto o banco grava o status como `"cancelled"`, com dois L. Como as strings nunca são iguais, a comparação é sempre verdadeira e nenhum pedido é descartado. O comentário logo acima da função confirma a intenção: "sem contar pedidos cancelados".

**Correção:** ainda não realizada. Será feita após a conclusão deste relatório.

### Bug 4 — Validar cupom consome um uso

**Função:** `couponService.validateCoupon`, chamada por `GET /coupons/:code/validate`

**Passos:**

```
GET /coupons                                                   -> BEMVINDO10 uses: 3
GET /coupons/BEMVINDO10/validate?subtotal=100&today=2026-09-25 -> {"valid":true,"discount":10}
GET /coupons                                                   -> BEMVINDO10 uses: 4
```

**Comportamento esperado:** a validação é uma consulta (o próprio comentário do controller diz que é "usado pelo site quando o cliente digita o cupom no carrinho"), então ela não deveria alterar o cupom.

**Comportamento observado:** o contador `uses` subiu de 3 para 4 sem que nenhum pedido tivesse sido criado. Repetindo a consulta, o cupom chega em `maxUses` e passa a ser recusado como "cupom esgotado" sem nunca ter sido usado de fato.

**Causa:** a linha `coupon.uses += 1` está dentro de `validateCoupon`, e `db.findCoupon` devolve a referência real do objeto do banco, não uma cópia. O incremento deveria acontecer apenas quando o pedido é efetivamente criado.

**Correção:** ainda não realizada. Será feita após a conclusão deste relatório.

## 5. Resíduo

O banco é em memória (`db/database.js`), então ele volta ao estado original toda vez que o servidor é reiniciado.

Durante os testes o banco foi sujado de propósito: o estoque do Bone chegou a -2 no teste do item repetido e a 18 no teste de cancelamento repetido, o contador de usos do BEMVINDO10 subiu para 4, e foram criados pedidos de teste com os clientes "Teste" e "Teste2". Nada disso foi corrigido na mão — o servidor de teste foi encerrado ao final, o que já desfaz todas essas alterações.

Não foi feita nenhuma alteração no código: nenhum dos quatro bugs foi corrigido, e nenhum valor foi ajustado manualmente no `db/database.js` para mascarar sintoma. O único resíduo que permanece no repositório é o que já estava lá antes dos testes: o produto 1 (Camiseta) com `stock: -1` e o pedido 3 com a Camiseta repetida em duas linhas, que são a marca do Bug 1 no próprio arquivo de dados.

As correções dos quatro bugs serão realizadas posteriormente à elaboração deste relatório.
