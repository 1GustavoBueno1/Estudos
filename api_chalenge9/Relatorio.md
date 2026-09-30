Bugs
1 do ticket = 1.1 ele retorna o calculo do desconto normal, mas tem um erro de calculo
1.2 no arquivo couponService a função de calcular chamada discountFor
1.3 Tirei o valor do frete que era somado junto com o total, como citado na regra R11
1.4 http://localhost:3000/orders/1 e voltou: {
    "id": 1,
    "customerId": 1,
    "items": [
        {
            "productId": 9,
            "quantity": 50,
            "unitPrice": 2
        }
    ],
    "couponCode": "BEMVINDO10",
    "subtotal": 100,
    "discount": 12.5,
    "shipping": 25,
    "total": 112.5,
    "status": "pending",
    "createdAt": "2026-09-30T12:50:25.168Z"
}

2 = não existia nada que devolvesse os produtos ao estoque, no arquivo orderService na função cancel não existia nada que devolvesse ao stock os itens cancelados, a solução foi implementar uma função que devolve os produtos ao carrinho

3 = aqui ao passar as paginas ele não mostrava o ultimo item devido ao um erro no calculo, ele diminui a quantidade de itens para mostrar por pagina mas ao fazer isso ele removia o ultimo item, a correção foi apenas remover um o numero 1 da conta, estav presente no arquivo orderProduct na função List


Não e Bug
4 = não e bug, o subtotal do pedido não e igual e nem passa de 200, ou seja deve ser cobrado igual tendo em vista que ele passa de 200 apenas somado ao valor do frete na regra R10

5 = O cupom não deve voltar mesmo se o pedido foi cancelado como diz na regra R14

6 = O cliente não pode cancelar depois do pedido ser enviado como diz na regra R16