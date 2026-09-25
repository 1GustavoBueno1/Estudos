**1. Bugs encontrados** 
|  > funcao | Causa em uma frase | Correcao de sintoma que eu NAO fiz, e por que |
|---|---|---|


**O que investiguei e decidi que NAO e bug— e por que, citando a regra**.

na rota products get, e impossivel efetuar uma compra maior que o stock, o codigo possui o verificador necessario, o if (product.stock < item.qty) impede isso

**3. Cobertura de rotas** — todas as 9 rotas, uma linha cada:

|GET /products | Chamei a funçao normal para buscar os prdutos | A lista do banco de dados de produtos, normal |
|GET /products/id | Chamei a funçao normal para buscar os prdutos | A lista do banco de dados de produtos, normal |
|GET /orders| Chamei a funçao normal para buscar as ordens | A lista do banco de dados de produtos, normal |
|GET /orders/id | Chamei a funçao normal para buscar as ordens | A lista do banco de dados de produtos, normal |
|POST /orders| Chamei a funçao normal para criar a order| criou a ordem normalmente, aplicando cupon e nao deixou passar oque esgotou, mas se voce colocar dois mesmo itens na requisição ele passa... |
|POST /orders/id/cancel| ela cancela normal, mas deixa executar mesmo se a compra ja tiver sido excluida e ainda por cima aumenta o produto a cada cancel pqp

**1. Bugs encontrados** 
|  > funcao | Causa em uma frase | Correcao de sintoma que eu NAO fiz, e por que |
|---|---|---|


**O que investiguei e decidi que NAO e bug— e por que, citando a regra**.

na rota products get, e impossivel efetuar uma compra maior que o stock, o codigo possui o verificador necessario, o if (product.stock < item.qty) impede isso

**3. Cobertura de rotas** — todas as 9 rotas, uma linha cada:

|GET /products | Chamei a funçao normal para buscar os prdutos | A lista do banco de dados de produtos, normal |
|GET /products/id | Chamei a funçao normal para buscar os prdutos | A lista do banco de dados de produtos, normal |
|GET /orders| Chamei a funçao normal para buscar as ordens | A lista do banco de dados de produtos, normal |
|GET /orders/id | Chamei a funçao normal para buscar as ordens | A lista do banco de dados de produtos, normal |
|POST /orders| Chamei a funçao normal para buscar os prdutos | criou a ordem normalmente, aplicando cupon e nao deixou passar oque esgotou |
|POST /orders/id/cancel| ela cancela normal, mas deixa executar mesmo se a compra ja tiver sido excluida
|GET /coupons|faz oque promete, sem erros, se tiver erro e no codigo, pq a rota em si retorna td certo|
GET /coupons/id/validate|retorna certo, nao a bug aqui ele pega o status dos cuponss do banco e verifica, e retonou certo

|GET /reports/sales|a erro, ele retorna a soma de tudo mesmo com os cancelados, mas ele soma|---|