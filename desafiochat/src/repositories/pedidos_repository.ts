import database from "../database.js"

export async function buscarProdutoPorId(id: number) {
    return database.produtos.find(
        produto => produto.id === id
    );
}

export async function atualizarEstoque(
    produto_id: number,
    novoEstoque: number
) {
    const produto = database.produtos.find(
        produto => produto.id === produto_id
    );

    if (produto) {
        produto.estoque = novoEstoque;
    }
}

export async function salvarPedido(
    usuario_id: number,
    produto_id: number,
    quantidade: number
) {
    const pedido = {
        id: database.pedidos.length + 1,
        usuario_id,
        produto_id,
        quantidade
    };

    database.pedidos.push(pedido);

    return pedido;
}