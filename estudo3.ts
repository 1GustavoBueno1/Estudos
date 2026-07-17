interface Task {
    id: number;
    nome: string;
    descricao?: string;
    status: boolean;
};
interface LoginRespostas {
    access_token: string;
    token_type: string;

};


const task1: Task = {id: 1, nome: "Estudo em type", descricao: "Estudar ts todo dia", status: false};
// const task2: task = {id: 1, nome: "Estudo em type", descricao: "Vazio"};
// const task3: task = {id: 1, nome: "Estudo em type", descricao: "Vazio", status: false, proridade: 1};
const task4: Task = {id: 1, nome: "Estudo em type", status: false};
function formatartask(task: Task): string {
    if (task.status) {
        return `[x] ${task.nome}`
    }
    return `[ ] ${task.nome}`
};

console.log(formatartask(task1));