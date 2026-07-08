function contando() {
    let count = 0
    return function() {
        count += 1;
        return count;
    }

    };
const contador = contando();

function criarmulti(multi) {
    return function (numero) {
        return numero * multi

    }
};
const usuario = {
    nome: "gustavo",
    saudar: function() {
        console.log(`Olá ${this.nome}`)
    }
}
const x = usuario.saudar
x()