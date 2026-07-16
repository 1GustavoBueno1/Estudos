function esperar() {
    return new Promise((resolve) => {
        setTimeout(() => resolve("pronto"), 1000);
    });
};


async function rodar() {
    const resposta = await esperar();
    console.log(resposta)
};

async function buscar() {
    try {
    const resposta = await fetch("https://jsonplaceholder.typicode.com/todos/99999999");
    if (!resposta.ok) {
        throw new Error(`Erro ${resposta.status}`)
    }
    const dados = await resposta.json();
    return dados
} catch(Erro){
    console.log(`fodeu deu esse erro: ${Erro}`)
};
};

