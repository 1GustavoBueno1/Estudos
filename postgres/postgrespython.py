import psycopg

conn = psycopg.connect("dbname=estudos user=estudos password=estudos")
with conn.cursor() as cur:
    cur.execute("""
        CREATE TABLE IF NOT EXISTS usuarios(
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
                usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
                titulo varchar(100) NOT NULL,
                descricao text NOT NULL,
                status varchar(20) NOT NULL DEFAULT 'pendente',
                criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
                )
""")
    cur.execute("""
        CREATE INDEX IF NOT EXISTS idx_tarefas_usuario_id ON tarefas(usuario_id);
""")
conn.commit()
conn.close()


