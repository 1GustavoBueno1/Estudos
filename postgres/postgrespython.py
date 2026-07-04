import psycopg

conn = psycopg.connect("dbname=estudos user=estudos password=estudos")
with conn.cursor() as cur:
    cur.execute("""
        CREATE TABLE IF NOT EXISTS ususarios(
            id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            nome varchar(100) NOT NULL,
            email text NOT NULL UNIQUE,
            senha text NOT NULL,
            criado_em TIMESTAMP NULL DEFAULT NOW()
        )
    
""")
    cur.execute("""
        CREATE TABLE IF NOT EXISTS tarefas(
                id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                titulo varchar(100) NOT NULL,
                descricao text NOT NULL,
                usuario_id INT NOT NULL REFERENCES ususarios(id) ON DELETE CASCADE,
                criado_em TIMESTAMP NULL DEFAULT NOW()
                )


""")
conn.commit()
conn.close()


