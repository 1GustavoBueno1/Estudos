# Desafio 7 — API de Reservas de Salas

Porta: **3009**. Sem autenticacao.

```bash
npm install
npm start
```

---

## ⚠️ Antes de corrigir qualquer coisa

Esse desafio tem uma **etapa 0 obrigatoria**, e ela vale tanto quanto os bugs.

Sem rodar o servidor e sem tentar consertar nada, leia os arquivos e escreva,
em uma linha cada, **o que a funcao faz e o que ela devolve**:

1. `db.findBookingById`
2. `validateBooking`
3. `bookingService.getAllRooms`
4. `bookingService.getAvailableRooms`
5. `bookingService.applyServiceFee`
6. `bookingService.createBooking`

Me manda essa lista **antes** de mandar as correcoes.

Nesse desafio quase nenhuma linha esta errada sozinha. Cada arquivo, lido
isolado, faz sentido. Os bugs estao no encaixe entre eles.

---

## Rotas

| Metodo | Rota | Body / Query |
|---|---|---|
| GET | `/rooms` | — |
| GET | `/rooms/available` | `?start=2026-10-01T09:00:00&end=2026-10-01T11:00:00` |
| GET | `/bookings` | — |
| GET | `/bookings/:id` | — |
| POST | `/bookings` | `{ "roomId": 2, "customer": "Gustavo", "start": "2026-10-02T14:00:00", "end": "2026-10-02T16:00:00", "people": 3 }` |
| PATCH | `/bookings/:id/people` | `{ "people": 8 }` |

Salas: 1 = Sala Azul (cap. 10, R$50/h), 2 = Sala Verde (cap. 4, R$30/h),
3 = Auditorio (cap. 50, R$200/h).

Ja existe a reserva 1: Ana, sala 1, dia 01/10 das 09:00 as 11:00.

---

## Sintomas (5 bugs)

**1.** Da pra criar reserva com dados que deveriam ser recusados. Manda um POST
sem `customer`, ou com `people` maior que a capacidade da sala, ou com um
`roomId` que nao existe. Nenhum devolve 400 — alguns passam, outro derruba a
requisicao com 500.

**2.** `GET /rooms/available` devolve as tres salas sempre, mesmo passando um
intervalo que bate exatamente em cima da reserva da Ana (01/10 09:00–11:00).
Nenhuma sala e filtrada nunca.

**3.** O preco da reserva criada vem maior do que deveria. Sala Verde, 2 horas:
30 × 2 = 60, mais 10% de taxa = 66. Mas o POST devolve outro valor. E o `GET
/bookings` depois mostra esse mesmo valor errado.

**4.** `PATCH /bookings/1/people` com `{"people": 8}` responde 200 com
`people: 8`. Mas se voce fizer `GET /bookings/1` logo depois, continua 6.

**5.** Reservas coladas uma na outra sao tratadas como conflito. A Ana tem a
sala 1 das 09:00 as 11:00. Consultar `/rooms/available` das 11:00 as 13:00 no
mesmo dia deveria mostrar a Sala Azul como livre — ela nao aparece.
(Esse so fica visivel depois que o bug 2 estiver resolvido.)

---

## Regras

- Nao reescreva o projeto. Corrija.
- Em pelo menos tres desses bugs a correcao e **apagar ou trocar uma coisa que
  esta sobrando no lugar errado**, nao escrever logica nova. Se a sua correcao
  ficou grande, provavelmente voce nao entendeu o que o codigo ja fazia.
