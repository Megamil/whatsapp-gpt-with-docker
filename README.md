# Chatbot do WhatsApp com Integração do GPT-3.5-turbo
Este projeto demonstra a integração de um chatbot do WhatsApp usando a API do WhatsApp Web e o modelo GPT-3.5-turbo da OpenAI. O chatbot permite que os usuários interajam com ele por meio de mensagens do WhatsApp e recebam respostas geradas pelo GPT-3.5-turbo.

## Começando
Estas instruções vão orientá-lo a configurar e executar o projeto localmente.

## Pré-requisitos
* [Opcional] Node.js (versão 18 ou posterior)
* [Opcional] Docker
* Obrigatório [Chave da API da OpenAI](https://platform.openai.com/account/api-keys)

## Antes de usar
* Antes de usar atualize a chave OPENAI_TOKEN no docker-compose.yml

## Uso com docker
* Após a instalação do Docker abra a pasta deste projeto no terminal e execute:
```
$ docker-compose up -d
```

## Uso com NodeJS
* Após a instalação do Node.js abra a pasta deste projeto no terminal e execute:
```
$ node index.js
```

## Testar
* Quando executar irá pedir para ler o QRCode no terminal, abra seu WhatsApp e faça a leitura normalmente.
* Envie uma mensagem de outro aparelho para você, com o prefixo /AIGPT [Seu Prompt].