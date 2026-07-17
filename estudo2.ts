interface usuario {
    nome: string;
    idade: Number;
    logado: Boolean;
    telefone?: Number;
};
const gustavo: usuario = {nome: "gustavo", idade: 17, logado: false};

function saudar(user: usuario): string {
    return `Ola ${user.nome}`;
};
console.log(saudar(gustavo));

function criauser(nome: string): usuario {
    return {nome: nome, idade: 17, logado: false};
};

console.log(criauser("gustavo"));