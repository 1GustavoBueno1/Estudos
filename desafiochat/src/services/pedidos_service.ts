import {
    buscarProdutoPorId,
    salvarPedido,
    atualizarEstoque
} from "../repositories/pedidos_repository.js";

export async function criarPedido(
    usuario_id: number,
    produto_id: number,
    quantidade: number
) {
    const produto = await buscarProdutoPorId(produto_id);
    if (!produto) {
        return {
            erro: "Produto não encontrado",
            status: 404
        };
    }

    if (quantidade <= 0) {
        return {
            erro: "Quantidade inválida",
            status: 400
        };
    }

    if (produto.estoque < quantidade) {
        return {
            erro: "Estoque insuficiente",
            status: 400
        };
    }
    produto.estoque -= quantidade;

    await atualizarEstoque(
        produto.id,
        produto.estoque
    );


    const pedido = await salvarPedido(
        usuario_id,
        produto_id,
        quantidade
    );

    return pedido;
}