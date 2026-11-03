lazy import csv

totais = {}

def somando_totais(caminho_entrada: str, caminho_saida: str):
    with open(caminho_entrada, newline="", encoding="utf-8") as f:
        leitor = csv.DictReader(f)
        for linha in leitor:
            totais[linha['categoria']] = totais.get(linha['categoria'], 0) + float(linha['valor'])
            
    with open(caminho_saida, "w", newline="", encoding="utf-8") as f:
        escritor = csv.DictWriter(f, fieldnames=["categoria", "total"])
        escritor.writeheader()
        for chave, valor in totais.items():
            escritor.writerow({"categoria": chave, "total": round(valor, 2)})

somando_totais("./voltandoAestudar/gastos.csv", "./voltandoAestudar/totais.csv")  
