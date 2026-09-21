# Desafio 9 — API de Assinaturas

Porta **3013**. Sem autenticacao.

```bash
npm install
npm start
```

Todas as rotas aceitam `?today=YYYY-MM-DD` pra fixar a data de referencia.
**Use `2026-09-20` nos testes**, salvo quando eu indicar outra data.

---

## O que muda nesse desafio

Nos oito anteriores eu te entreguei uma lista numerada de bugs com os sintomas
descritos. Isso nao acontece no trabalho.

Aqui voce recebe **um ticket**, escrito por uma pessoa de atendimento que nao e
desenvolvedora. Como todo ticket de verdade:

- **Nao digo quantos bugs existem.**
- **Nem tudo que esta no ticket e bug.** Tem coisa ali que funciona exatamente
  como deveria, e a sua resposta correta e explicar por que, nao "consertar".
- **Nem todo bug esta no ticket.** Tem pelo menos um problema real que ninguem
  reportou, porque ninguem percebeu ainda. Ele so aparece se voce for olhar.
- Os sintomas relatados nao apontam pro arquivo onde esta a causa.

---

## O ticket

> **De:** Marina (atendimento)
> **Assunto:** reclamacoes da semana - cobranca
>
> Oi! Juntei aqui o que chegou essa semana, desculpa se algo for besteira minha:
>
> **1.** A Carla cancelou a assinatura dela dia 10 e mesmo assim entrou na
> cobranca. Ela mandou print e ta bem irritada. Conferi aqui no sistema e o
> cancelamento dela ta registrado, entao nao foi erro nosso de digitacao.
>
> **2.** O Bruno reclamou que o teste gratis dele acabou um dia antes. A gente
> vendeu 15 dias comecando dia 01/09, entao ele deveria ter o dia 15 inteiro,
> mas no dia 15 o sistema ja tratou ele como cliente pagante.
>
> **3.** Abri o relatorio de receita umas tres vezes hoje de manha pra conferir
> um numero, e deu um valor **diferente em cada vez**, sem ninguem ter mexido em
> nada. Me assustou. Nao sei se sou eu que to fazendo algo errado.
>
> **4.** O Fabio assinou o plano Pro semana passada e ele nao aparece na receita.
> Ele e cliente novo mas ja e cliente, entao deveria contar, ne? Da uma olhada. 
>
> Qualquer coisa me chama.

---

## Rotas

| Metodo | Rota |
|---|---|
| GET | `/plans` |
| GET | `/subscriptions` |
| GET | `/subscriptions/:id` |
| GET | `/subscriptions/:id/price` |
| POST | `/subscriptions/:id/cancel` |
| GET | `/billing/revenue` |
| POST | `/billing/renew-all` |

**Planos:** basic R$ 29,90 · pro R$ 79,90 · enterprise R$ 249,90

**Assinantes:** 1 Ana (pro) · 2 Bruno (basic, teste ate 15/09) · 3 Carla
(enterprise, cancelada em 10/09) · 4 Diego (pro, cancelada em 20/08) ·
5 Elis (basic, 20% de desconto) · 6 Fabio (pro, teste ate 02/10)

**Regras de negocio** (isso aqui e o combinado com o cliente, use como
referencia pra decidir o que e bug e o que nao e):

- Quem esta em periodo de teste **nao paga** e **nao entra na receita**. O teste
  vale ate o fim do dia de `trialEndsAt`.
- Quem cancelou **nao deve ser cobrado** nos ciclos seguintes.
- O desconto de uma assinatura vale **so pra ela**, nao para o plano inteiro.
- A receita mensal e a soma do que cada assinatura cobravel paga hoje.

---

## O que eu quero de volta

Nao e so o codigo corrigido. Quero tambem um **relatorio curto**, do jeito que
voce escreveria a descricao de um Pull Request pro seu time:

**1. O que eu encontrei** — uma linha por problema:
   `arquivo > funcao > causa em uma frase`

**2. O que eu investiguei e decidi que NAO e bug** — e por que.
   Se voce "corrigir" tudo que o ticket menciona sem questionar nada, voce vai
   quebrar uma coisa que funciona. Essa parte do relatorio vale tanto quanto a
   primeira.

**3. Como reproduzi cada um** — o comando ou a requisicao que mostra o problema
   acontecendo, e o resultado que ela devolveu.

Manda o relatorio **antes** de mandar o codigo corrigido. Primeiro a gente
combina o diagnostico, depois voce conserta.

---

## Regras

- Nao reescreva o projeto. Corrija.
- Antes de mudar qualquer linha, saiba dizer em portugues o que ela calcula e
  por que o resultado dela esta errado. Se voce so esta mexendo ate o numero
  ficar bonito, para e volta a ler.
- Se uma correcao sua muda o formato de uma resposta que ninguem reclamou,
  desfaz. Contrato de rota nao se mexe de graca.
