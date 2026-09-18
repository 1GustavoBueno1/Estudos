# Desafio 8 — API de Biblioteca

Porta: **3011**. Sem autenticacao.

```bash
npm install
npm start
```

Multa de atraso: **R$ 0,50 por dia**. Pra a multa dar sempre o mesmo valor
independente do dia em que voce testar, todas as rotas de multa aceitam
`?today=2026-10-01`. **Use sempre essa data nos testes.**

---

## ⚠️ Etapa 0 — obrigatoria, e diferente da do desafio 7

No desafio 7 eu pedi pra voce dizer o que cada funcao fazia, e voce me
respondeu o **nome da funcao traduzido**. `getAvailableRooms` virou "busca
salas livres". Isso nao e leitura, e parafrase do nome.

Entao dessa vez nao da pra responder pelo nome. **Previsao de saida:**

Sem rodar o servidor, sem rodar `node`, sem corrigir nada — le o corpo das
funcoes e escreve **o valor exato** que cada chamada abaixo devolve **hoje,
com o codigo do jeito que esta**. Nao o que deveria devolver: o que vai
devolver.

```js
loanService.countActiveLoans(1)
loanService.availableCopies(1)
loanService.availableCopies(2)
loanService.allReturned(1)
loanService.allReturned(2)
loanService.totalFines("2026-10-01")
```

Escreve os 6 valores. Depois roda isso e compara:

```bash
node -e "
const s = require('./services/loanService');
console.log('countActiveLoans(1) =', s.countActiveLoans(1));
console.log('availableCopies(1)  =', s.availableCopies(1));
console.log('availableCopies(2)  =', s.availableCopies(2));
console.log('allReturned(1)      =', s.allReturned(1));
console.log('allReturned(2)      =', s.allReturned(2));
console.log('totalFines          =', s.totalFines('2026-10-01'));
"
```

Me manda as duas listas: **o que voce previu** e **o que saiu**. As duas,
mesmo que tenham dado diferente — principalmente se tiverem dado diferente.
A diferenca entre elas e o exercicio inteiro. Se voce editar a previsao
depois de ver o resultado, o desafio perde a graca e eu nao tenho como te
ajudar no ponto que importa.

---

## Rotas

| Metodo | Rota | Observacao |
|---|---|---|
| GET | `/books` | — |
| GET | `/books/:id/availability` | copias totais, disponiveis, e se tudo foi devolvido |
| GET | `/loans` | todos os emprestimos |
| GET | `/loans/sorted` | emprestimos ordenados por data de vencimento |
| GET | `/loans/fines` | `?today=2026-10-01` |
| GET | `/loans/:id/notice` | `?today=2026-10-01` — aviso pro membro |

**Acervo:** 1 = Clean Code (3 copias), 2 = O Hobbit (2 copias),
3 = Duna (1 copia).

**Emprestimos:** `returnedAt: null` significa que o livro **ainda esta com a
pessoa**. Livro 1 tem 2 emprestimos em aberto e 1 ja devolvido. Livro 2 tem 3
emprestimos, **todos ja devolvidos**. Livro 3 tem 1 em aberto.

---

## Sintomas (5 bugs)

**1.** `GET /books/2/availability` diz que ha **-1** copias disponiveis. Um
numero negativo de copias nao existe. O Hobbit tem 2 copias e ninguem esta com
ele — deveria dizer 2. `GET /books/1/availability` diz 0, e o certo seria 1.

**2.** Na mesma resposta, o campo `allReturned` do livro 1 vem `true`. Mas Ana
e Bruno estao com o livro ate agora. Repara que nos livros 2 e 3 esse campo vem
**certo** — testar so um livro nao mostra o problema.

**3.** `GET /loans/fines?today=2026-10-01` devolve `2.5`. Sao tres emprestimos
em aberto e atrasados, e a multa de um deles sozinho ja passa disso.

**4.** Chama `GET /loans` e anota a ordem dos ids. Chama `GET /loans/sorted`.
Chama `GET /loans` de novo. A ordem original nao volta mais — a rota de
ordenacao mudou os dados do "banco" de forma permanente.

**5.** `GET /loans/1/notice?today=2026-10-01` responde `{"notice": {}}`. Um
objeto vazio, sem erro nenhum no console. A mensagem existe e o template esta
certo — o problema e como o controller pega o resultado.

---

## Regras

- Nao reescreva o projeto. Corrija.
- **Nenhum desses 5 bugs da pra achar pelo nome da funcao.** Todos os nomes
  descrevem corretamente o que a funcao *deveria* fazer. O erro esta sempre
  dentro do corpo, ou em como o retorno dela e usado.
- Antes de mexer numa funcao, le ela inteira, de cima a baixo. Incluindo as
  funcoes auxiliares que ela chama.
