const TEMPLATES = {
  overdue: "Ola {member}, o livro {title} venceu em {dueDate}. Multa atual: R$ {fine}.",
  ok: "Ola {member}, o livro {title} esta em dia. Devolucao ate {dueDate}.",
};

// Simula a busca do template num servico externo (CMS, arquivo, etc).
function loadTemplate(key) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(TEMPLATES[key]), 15);
  });
}

function fill(template, values) {
  let out = template;
  for (const [chave, valor] of Object.entries(values)) {
    out = out.replaceAll(`{${chave}}`, valor);
  }
  return out;
}

async function noticeFor(loan, book, fine) {
  const key = fine > 0 ? "overdue" : "ok";
  const template = await loadTemplate(key);

  return fill(template, {
    member: loan.member,
    title: book.title,
    dueDate: loan.dueDate,
    fine: fine.toFixed(2),
  });
}

module.exports = { noticeFor, fill };
