# Usa Debian como la imagen base
FROM debian:latest

# Actualiza el índice de paquetes e instala las dependencias necesarias
RUN apt-get update && apt-get install -y \
    nodejs \
    curl \
    git \
    zip \
    unzip \
    wget \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    #mariadb-server \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copia los archivos del proyecto al contenedor
RUN curl -fsSL https://bun.sh/install | bash

COPY . ./home

RUN cd /home && pwd && ls -la

RUN cd /home/sisventa && ~/.bun/bin/bun install 

RUN cd /home/start && \
    ~/.bun/bin/bun install 
    
# Expone el puerto 80 para que pueda accederse al servidor web
EXPOSE 8080

#CMD ["apachectl", "-D", "FOREGROUND"]

# Inicia el servidor web de PHP
#RUN cd /var/www/html/disan
CMD ["/root/.bun/bin/bun","/home/start/index.ts"]
