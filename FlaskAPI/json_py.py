import json

def save_cars(Carros):
    with open('FlaskAPI/Cars.json', 'w', encoding = 'utf-8') as f:
        json.dump(Carros, f, ensure_ascii = False, indent = 4)
def load_cars():
    try:
        with open('FlaskAPI/Cars.json', 'r') as f:
            return json.load(f)
    except (FileNotFoundError, FileExistsError):
        return []
