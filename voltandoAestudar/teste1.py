def estaticas(numeros: list[float]) ->  tuple[float, float, float]:
    total = len(numeros)
    soma = 0
    for i ,n in enumerate(numeros):
        if not numeros:
            raise ValueError("lista vazia")
        soma += n
        if i == 0:
            maior = n
            menor = n
        if n > maior:
            maior = n
        if n < menor:
            menor = n
    media = soma / total
    return media,  menor, maior

print(estaticas([4, 8, 15]))