with open("./voltandoAestudar/totais.csv", newline="", encoding="utf-8") as f:
    escritor = csv.DictWriter(f, fieldnames=["categoria", "total"])
    escritor.writeheader()