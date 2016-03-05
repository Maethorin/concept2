# concept2
Site Concept2 Brasil


## Configurando ambiente

Cria ambiente virtual
Instala dependências

Define postactivate:

vim $VIRTUAL_ENV/bin/postactivate
export APP_SETTINGS=app.config.DevelopmentConfig
export DATABASE_URL=postgresql+psycopg2://concept2:concept2@localhost:5432/concept2
cd <pasta-projetos>/concept2

Cria banco:

sudo su postgres
psql
CREATE ROLE concept2 SUPERUSER LOGIN PASSWORD 'concept2';
CREATE DATABASE concept2;
ALTER DATABASE concept2 OWNER TO concept2;

Migrations:

Primeira vez:
python manage.py db init

Sempre que houver alteração de estrutura
python manage.py db migrate

