FROM postgres:12

RUN apt-get clean && apt-get update && \
    apt-get install -y postgresql-contrib

ADD *.sql /docker-entrypoint-initdb.d/

VOLUME /var/lib/postgresql/data
