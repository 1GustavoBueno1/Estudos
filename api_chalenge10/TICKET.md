# TICKET #412 — Reclamações do balcão (Biblioteca Municipal)

Chegaram estas 6 reclamações dos atendentes. Para cada uma: investigue, diga se é **bug** ou
**comportamento correto pelas regras** (neste caso cite a regra e **não altere o código**), e corrija
a causa dos bugs reais. Use `npm run repro` para reproduzir.

1. **Multa de estudante alta demais.** O Bruno (estudante) devolveu "O Cortiço" com mais de um mês de
   atraso e a multa veio R$ 15,00. Parece cobrança a mais para estudante.

2. **Livro com uma única cópia some da busca.** "Capitães da Areia" tem 1 cópia na estante, mas não
   aparece em `GET /books?available=true`.

3. **Renovação encurtou o prazo.** A Ana pegou "Dom Casmurro" em 01/10 e renovou em 03/10. O novo
   vencimento ficou em 17/10 e ela reclamou que perdeu dias.

4. **Multa por poucas horas.** A Ana devolveu um livro às 08h do dia seguinte ao vencimento (poucas
   horas depois do prazo) e foi multada em R$ 0,75. Isso é abuso.

5. **Renovação recusada.** A Ana tentou renovar um livro que já estava atrasado e a API respondeu 409.
   O atendente acha que deveria deixar renovar.

6. **Atlas não empresta.** Não consigo emprestar o "Atlas Geográfico" para ninguém (erro 422).

---
Atenção: o ticket não cita todos os problemas. Faça uma revisão crítica do código contra o REGRAS.md.
