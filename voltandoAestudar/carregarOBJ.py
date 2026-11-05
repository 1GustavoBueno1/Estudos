import json
import os


def ler_json_seguro(caminho: str) -> dict:
    temp = caminho + ".tmp"
    try:
        with open(caminho, "r", encoding="utf-8") as f:
            dados = json.load(f)
        os.replace(temp, caminho)
        return dados
    except FileNotFoundError:
        raise RuntimeError('Arquivo não encontrado')
    except json.JSONDecodeError:
        raise 
print(ler_json_seguro("./voltandoAestudar/jsonteste1.json"))