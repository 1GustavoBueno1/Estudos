const tasks = [
    {id: 1, nome: "estudo", done: false, prioridade: 1},
    {id: 2, nome: "trabalho", done: false, prioridade: 2},
    {id: 3, nome: "academia", done: true, prioridade: 3}
]
const soma = tasks.filter(task => !task.done).reduce((acc, task) => acc + task.prioridade, 0);
const junta = tasks.filter(task => !task.done).map(task => task.nome).join(", ");
const contagem = tasks.reduce((acc, task) =>{
    if (task.done) {
        acc.feitas += 1
    } else {
        acc.pendentes += 1
    }
    return acc
}, {feitas: 0, pendentes: 0});

console.log(contagem)
