export {}


type Proridade =  "baixa" | "media" | "alta"
// let variavel: prioridade = "urgente"

type Id = number|string
let a: Id = "1"
let b: Id = 2
// let c: id = false


type Status = "pendente" | "fazendo" | "concluida";
type task = {
    id: number;
    nome: string;
    descricao?: string;
    status: Status;
};

// let task5: task = {id: 1, nome: "Estudar", status: "urgente"};

type EstadoLogin = "deslogado" | "logando" | "logado" | "erro"

let estado: EstadoLogin = "deslogado"
estado = "logando"
estado = "logado"
estado = "erro"
// estado = "Explodiu o sistema"

