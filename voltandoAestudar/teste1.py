import string

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


def contar_palavras(texto: str) -> dict[str, int]:    
    retorno = {}
    for palavra in texto.lower().split():
        palavra = texto.strip(string.punctuation)
        if not palavra:
            continue
        retorno[palavra] = retorno.get(palavra, 0) + 1
    return retorno
pessoas = [{"nome": "Ana", "cidade": "SC"}, {"nome": "Bia", "cidade": "SP"}, {"nome": "Caio", "cidade": "SC"}]

def agrupar(pessoas: list):
    retorno = {}
    for p in pessoas:
        retorno.setdefault(p['cidade'], []).append(p['nome'])
    return retorno

pessoas = [{"nome": "Ana", "cidade": "SC"}, {"nome": "Bia", "cidade": "SP"}, {"nome": "Caio", "cidade": "SC"}]
print(agrupar(pessoas))