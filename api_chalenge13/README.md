# Desafio 13 — Clínica API

API Node/Express (em memória) de agendamento de consultas. Há bugs plantados.

```
npm install
npm run repro        # reproduz os 6 itens do ticket
npm start            # sobe a API na porta 3000
npm run dev          # igual ao start, mas com /__clock e /__reset para testar no Postman
```

Para testar datas, defina `FAKE_NOW` (ex.: `FAKE_NOW=2026-11-09T10:00:00-03:00`). No `npm run dev` use
`POST /__clock` com `{"now": "2026-11-09T10:00:00-03:00"}` (body `{}` volta ao relógio real) e
`POST /__reset` para zerar o banco.

Rotas: `GET /doctors`, `GET /doctors/:id`, `GET /doctors/:id/slots?date=`, `GET /patients/:id`,
`POST /patients/:id/pay`, `POST /appointments`, `GET /appointments`, `GET /appointments/:id`,
`POST /appointments/:id/cancel`, `POST /appointments/:id/reschedule`.

Regras do desafio:
- Leia primeiro REGRAS.md (fonte da verdade) e TICKET.md.
- Corrija a **causa**; não edite dados para mascarar o sintoma e não reescreva o projeto.
- Preencha o RELATORIO.md (formato curto: blocos A, B e C).
