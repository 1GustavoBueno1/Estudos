# Desafio 10 — API da Loja

Porta **3015**. Sem autenticacao.

```bash
npm install
npm start
```

As rotas aceitam `?today=YYYY-MM-DD` pra fixar a data de referencia.
**Use `2026-09-22` nos testes.**

O banco e em memoria: **toda vez que voce reinicia o servidor, os dados voltam
ao estado inicial.** Use isso a seu favor pra repetir um teste do zero.

---

## O que muda nesse desafio

Mesmo formato do 9: um ticket de quem nao e dev, sem dizer quantos bugs
existem, com coisa que nao e bug e com bug que ninguem reportou.

Duas coisas novas, feitas em cima do que deu errado no 9:

**1. Sintoma x causa.** No 9 voce corrigiu a Carla editando o dado dela no
banco. Aqui, varios problemas deixaram **residuo** nos dados (um numero errado,
um status estranho). Editar o residuo nao conserta nada: o proximo pedido
estraga de novo. Pra cada bug, o relatorio precisa dizer qual seria a correcao
de sintoma e por que voce nao fez ela.

Mexer em dado so vale **depois** de corrigir a causa, e so como limpeza do
estrago que ja foi feito. Se fizer isso, diga no relatorio.

**2. Rota que ninguem citou.** No 9 o bug escondido estava numa rota que o
ticket nao mencionava e voce nao abriu. Aqui o relatorio tem que listar
**todas** as rotas e o que voce testou em cada uma.

---

## O ticket

> **De:** Marina (atendimento)
> **Assunto:** loja - problemas da semana
>
> Oi! De novo eu, desculpa kkk
>
> **1.** A Camiseta ta aparecendo com estoque **-1** no site. A Carla comprou 6
> e a gente so tinha 5. Como o sistema deixou vender o que nao tinha?
>
> **2.** O Rafael reclamou que pagou frete. O pedido dele deu R$ 209,90 em
> produtos e a gente anuncia frete gratis acima de R$ 200. Ele quer o frete de
> volta.
>
> **3.** O cupom **PRIMAVERA** ta dizendo "esgotado" pra todo mundo. O limite
> era 5 usos, e eu contei na mao: so **2 pedidos** usaram ele.
>
> **4.** O relatorio de vendas da semana (18 a 22) deu mais do que entrou no
> caixa. Acho que tem pedido cancelado sendo contado.
>
> Valeu!

---

## Rotas

| Metodo | Rota | Pra que serve |
|---|---|---|
| GET | `/products` | lista produtos com estoque |
| GET | `/products/:id` | um produto |
| GET | `/orders` | lista pedidos |
| GET | `/orders/:id` | um pedido |
| POST | `/orders` | cria pedido |
| POST | `/orders/:id/cancel` | cancela pedido |
| GET | `/coupons` | lista cupons com usos |
| GET | `/coupons/:code/validate?subtotal=` | o site chama quando o cliente digita o cupom no carrinho |
| GET | `/reports/sales?from=&to=` | relatorio de vendas do periodo |

Corpo do `POST /orders`:

```json
{
  "customer": "Nome",
  "items": [{ "productId": 3, "qty": 1 }],
  "coupon": "BEMVINDO10"
}
```

`coupon` e opcional.

---

## Regras de negocio

Isso e o combinado com o dono da loja. Use pra decidir o que e bug.

- Nao pode vender mais do que tem em estoque. **Estoque nunca fica negativo.**
- **Frete:** R$ 19,90. E gratis quando o valor dos produtos **ja com o
  desconto do cupom** for R$ 200 ou mais.
- **Cupom:** cada cupom tem um limite de usos. **Um uso = um pedido criado com
  ele.** O cupom vale ate o fim do dia de `expiresAt`.
- **Cancelamento:** devolve os itens pro estoque. O uso do cupom **nao** volta.
- **Pedido recusado** (qualquer erro 400) nao pode deixar nenhum efeito:
  nem estoque mexido, nem uso de cupom gasto.
- **Relatorio de vendas:** quantidade de pedidos e soma do `total` (com frete)
  no periodo, **sem** pedidos cancelados.

---

## O que eu quero de volta

**Relatorio primeiro, codigo depois.** Formato:

**1. Bugs encontrados** — um por linha:

| Arquivo > funcao | Causa em uma frase | Correcao de sintoma que eu NAO fiz, e por que |
|---|---|---|

**2. O que investiguei e decidi que NAO e bug** — e por que, citando a regra.

**3. Cobertura de rotas** — todas as 9 rotas, uma linha cada:

| Rota | O que eu testei | Resultado |
|---|---|---|

**4. Reproducao** — pra cada bug, a requisicao e o que ela devolveu.

**5. Residuo** — se algum bug deixou dado errado no banco, qual e, e se voce
limpou (depois de corrigir a causa).

---

## Regras

- Nao reescreva o projeto. Corrija.
- Antes de mudar uma linha, saiba dizer em portugues o que ela faz e por que o
  resultado dela esta errado.
- Contrato de rota nao muda de graca: se ninguem reclamou do formato de uma
  resposta, ele continua igual.
- Depois de cada correcao, **reinicie o servidor e rode a reproducao de novo.**
  Se voce nao viu o bug sumir, voce nao sabe se corrigiu.
