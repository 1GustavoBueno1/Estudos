import json



def ler_json(caminho:str) -> dict:
    try:
        with open(caminho, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}
    except json.JSONDecodeError:
        return {}

caminho = "./voltandoAestudar/dados.json"
print(ler_json(caminho))