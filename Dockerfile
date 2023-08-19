# Use uma imagem base Node.js
FROM node:18

# Diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie os arquivos necessários para o contêiner
COPY package*.json ./
COPY index.js ./
COPY tokens ./tokens

# Instale as dependências
RUN npm install

# Instale o Chromium para uso com o Puppeteer
RUN apt-get update && \
    apt-get install -y chromium && \
    rm -rf /var/lib/apt/lists/*

# Variável de ambiente para desabilitar prompt interativo do Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Exponha a porta que o aplicativo Express está ouvindo
EXPOSE 3002

# Comando para iniciar o aplicativo
CMD ["node", "index.js"]
