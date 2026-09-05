import type { Request, Response } from "express";
import { criarPedido } from "../services/pedidos_service.js";

export async function cadastrarPedido(req: Request, res: Response) {
    const { usuario_id, produto_id, quantidade } = req.body;

    const resultado = await criarPedido(
        usuario_id,
        produto_id,
        quantidade
    );

    if ("erro" in resultado) {
        return res.status(resultado.status).json({
            message: resultado.erro
        });
    }

    return res.status(201).json(resultado);
}