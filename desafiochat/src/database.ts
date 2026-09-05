interface Pedidos {
    id: number,
    usuario_id: number,
    produto_id: number,
    quantidade: number

}


const database = {
    produtos: [
        {
            id: 1,
            nome: "Teclado",
            estoque: 10
        },
        {
            id: 2,
            nome: "Mouse",
            estoque: 5
        }
    ],

    pedidos: [] as Pedidos[]
};

export default database;