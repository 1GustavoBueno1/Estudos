const { db } = require('../db/database');
const { AppError } = require('../utils/errors');
const { round2 } = require('../utils/money');

const RULES = {
  regular: { termDays: 14, maxActive: 3, fineDiscount: 0 },
  student: { termDays: 21, maxActive: 5, fineDiscount: 0.5 },
};

function getById(id) {
  const member = db.members.find((m) => m.id === id);
  if (!member) throw new AppError(404, 'Membro não encontrado');
  return member;
}

function rulesFor(member) {
  return RULES[member.type];
}

function activeLoans(member) {
  return db.loans.filter((l) => l.memberId === member.id && l.status === 'active');
}

function present(member) {
  return {
    id: member.id,
    name: member.name,
    type: member.type,
    unpaidFines: member.unpaidFines,
    activeLoans: activeLoans(member).length,
  };
}

// Quita toda a multa pendente de uma vez.
function payFines(id) {
  const member = getById(id);
  const paid = round2(member.unpaidFines);
  member.unpaidFines = 0;
  return { paid, member: present(member) };
}

module.exports = { getById, rulesFor, activeLoans, present, payFines, RULES };
