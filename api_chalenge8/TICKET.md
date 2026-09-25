# Relatório de Testes e Bugs

## 1. Bugs encontrados

| Arquivo > função              | Causa em uma frase                                                                                                                                   | Correção de sintoma que eu NÃO fiz, e por que                                                                                    |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `orderService > cancelOrder`  | A função permite cancelar uma compra mesmo quando ela já foi excluída, retornando sucesso e fazendo com que o banco fique com itens que não existem. | Não realizei nenhuma correção antes do relatório, pois a intenção é identificar e documentar o bug primeiro e corrigi-lo depois. |
| `reportService > salesReport` | O relatório soma todos os pedidos, incluindo aqueles com `status: cancelled`.                                                                        | Não realizei nenhuma correção antes do relatório, pois a intenção é identificar e documentar o bug primeiro e corrigi-lo depois. |

## 2. O que investiguei e decidi que NÃO é bug

* `GET /products` — a rota busca os produtos normalmente e retorna a lista de produtos do banco.
* `GET /products/:id` — a rota busca o produto normalmente.
* `GET /orders` — a rota busca as ordens normalmente.
* `GET /orders/:id` — a rota busca a ordem normalmente.
* `POST /orders` — a rota cria a ordem normalmente, aplica o cupom e não permite comprar produtos que estão esgotados.
* `GET /coupons` — a rota faz o que promete e retorna os cupons corretamente.
* `GET /coupons/:id/validate` — a rota retorna corretamente, verificando o status dos cupons no banco e realizando a validação.
* `POST /orders/:id/cancel` — o funcionamento normal do cancelamento ocorre, porém foi identificado o bug específico de permitir o cancelamento mesmo quando a compra já foi excluída.
* `GET /reports/sales` — a existência da rota e seu funcionamento foram testados, porém foi identificado um bug específico: pedidos cancelados estão sendo incluídos na soma. A regra esperada é que pedidos com `status: cancelled` não entrem na soma.

## 3. Cobertura de rotas

| Rota                        | O que eu testei                                                                       | Resultado                                                                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /products`             | Chamei a função normal para buscar os produtos.                                       | A lista de produtos do banco retornou normalmente.                                                                                        |
| `GET /products/:id`         | Chamei a função normal para buscar o produto.                                         | Retornou normalmente.                                                                                                                     |
| `GET /orders`               | Chamei a função normal para buscar as ordens.                                         | A lista de ordens retornou normalmente.                                                                                                   |
| `GET /orders/:id`           | Chamei a função normal para buscar a ordem.                                           | Retornou normalmente.                                                                                                                     |
| `POST /orders`              | Testei a criação de uma ordem, a aplicação de cupom e a situação de produto esgotado. | Criou a ordem normalmente, aplicou o cupom e não permitiu comprar produto esgotado.                                                       |
| `POST /orders/:id/cancel`   | Testei o cancelamento de uma ordem, inclusive quando ela já havia sido excluída.      | O cancelamento funciona normalmente, mas a rota também retorna sucesso quando a compra já foi excluída, causando o problema identificado. |
| `GET /coupons`              | Testei o retorno dos cupons.                                                          | Retornou corretamente e faz o que a rota promete.                                                                                         |
| `GET /coupons/:id/validate` | Testei a validação dos cupons.                                                        | Retornou corretamente, verificando o status dos cupons no banco.                                                                          |
| `GET /reports/sales`        | Testei a soma das vendas com pedidos cancelados.                                      | Retornou a soma de todos os pedidos, incluindo os cancelados, contrariando a regra esperada.                                              |

## 4. Reprodução

### Bug 1 — Cancelamento de ordem inexistente

**Função:** `orderService.cancelOrder`

**Comportamento observado:** ao tentar cancelar uma compra que já foi excluída, a operação retorna sucesso mesmo que a compra não exista mais.

**Consequência:** isso faz com que o banco fique com itens que não existem.

**Correção:** ainda não realizada. Será feita após a conclusão deste relatório.

### Bug 2 — Relatório de vendas inclui pedidos cancelados

**Função:** `reportService.salesReport`

**Comportamento esperado:** pedidos com `status: cancelled` não devem entrar na soma.

**Comportamento observado:** o relatório retorna a soma completa, incluindo os pedidos cancelados.

**Correção:** ainda não realizada. Será feita após a conclusão deste relatório.

## 5. Resíduo

Até o momento, não foi realizada nenhuma alteração ou limpeza manual no banco de dados.

No caso do bug de cancelamento, foi observado que a operação pode fazer com que o banco fique com itens que não existem, porém nenhuma limpeza foi realizada antes deste relatório.

O bug do relatório de vendas não altera os dados do banco; o problema observado está no valor retornado pelo relatório.

As correções dos dois bugs serão realizadas posteriormente à elaboração deste relatório.
