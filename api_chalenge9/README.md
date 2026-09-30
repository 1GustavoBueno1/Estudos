# Desafio 11 — Loja API

API Node/Express de pedidos de uma loja (produtos, pedidos, cupons, frete, estoque).
O código tem bugs plantados: alguns aparecem no `TICKET.md`, outros **não**.

## Como rodar
```bash
npm install
npm start           # http://localhost:3000
npm run repro       # reprodução dos itens do ticket
```

## Regras do desafio
- A fonte da verdade é o `REGRAS.md`. Se algo do ticket não é bug, cite a regra.
- Corrija a **causa** no código. Não edite dados (`seed.json`, estado em memória) para mascarar sintoma.
- Não reescreva o projeto: só corrija o que está errado, mantendo a estrutura (routes / controllers / services / db).
- Bugs que o ticket não menciona também contam. O relatório precisa cobri-los.

## Relatório esperado (`RELATORIO.md`)
Para cada item:
1. **Sintoma** (o que se vê)
2. **Causa raiz** (arquivo e função, e por que acontece)
3. **Correção** (o que mudou)
4. **Verificação** (comando/requisição que você rodou e a saída)

Organize em três blocos:
- **A. Itens do ticket que são bug**
- **B. Itens do ticket que NÃO são bug** (cite a regra do `REGRAS.md`)
- **C. Bugs que o ticket não menciona**

Cole também a saída completa de `npm run repro`.
