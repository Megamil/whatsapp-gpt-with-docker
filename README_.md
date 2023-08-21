npm install -g @wppconnect/server-cli
wppserver --port 8000

npm install -g @wppconnect/frontend
wppserver --frontend


```
$ http://localhost:8000/api-docs/
$ http://localhost:21465/
```

#Gerar o token
'''
curl -X 'POST' \
  'http://localhost:21465/api/NERDWHATS_AMERICA/THISISMYSECURETOKEN/generate-token' \
  -H 'accept: application/json' \
  -d ''
'''

Projeto: https://github.com/wppconnect-team/wppconnect
Docker: https://github.com/wppconnect-team/wpp-docker
Linha de comando: docker run -p 8080:8080 --name wppconnect-server-cli --rm wppconnect/server-cli:1.3.7 wppserver --secretKey My53c3tKY --port 8080 --frontend

Usado no node: https://github.com/wppconnect-team/wppconnect-server
Exemplo rápido: https://github.com/wppconnect-team/server-cli


Preços: https://openai.com/pricing
Api Key: https://platform.openai.com/account/api-keys
Calculadora: https://platform.openai.com/tokenizer
Postman: https://www.postman.com/downloads/
Docker: https://www.docker.com/
NodeJS: https://nodejs.org/en