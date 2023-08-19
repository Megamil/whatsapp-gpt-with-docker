//nohup forever start -c 'node --trace-warnings' index.js
const wppconnect = require('@wppconnect-team/wppconnect');
const axios = require('axios');

const express = require("express");
const app = express();
const port = 3002;

const openIAToken = process.env.OPENAI_TOKEN;

app.get('/', (req, res) => {
  res.send("Init server....");
})

app.listen(port, () => {
  initWPP();
  console.log(`listening on port ${port}`);
})


/// 
/// Inicializar servidor WPPConnect
/// 
function initWPP() {

  wppconnect.create({
    session: 'IAGPT', // Informe o nome do cliente que deseja iniciar o bot @todo
    catchQR: (base64Qrimg, asciiQR, attempts, urlCode) => {
      console.log('Número de tentativas para ler o QR code: ', attempts);
      console.log('QR code no terminal: ', asciiQR);
      console.log('Imagem base64 do QR code: ', base64Qrimg);
      console.log('urlCode (data-ref): ', urlCode);
    },
    statusFind: (statusSession, session) => {
      console.log('Status da sessão: ', statusSession); // Retorna isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
      // Cria a sessão wss e retorna "serverClose" caso o servidor seja fechado
      if(statusSession === 'browserClose' || statusSession === 'qrReadFail' || statusSession === 'autocloseCalled' || statusSession === 'desconnectedMobile' || statusSession === 'deleteToken') { initWPP(); }
      console.log('Nome da sessão: ', session);
      console.log("Login realizado com sucesso!");
    },
    headless: 'old', // Chrome sem interface gráfica
    devtools: false, // Não abre as ferramentas de desenvolvedor por padrão
    useChrome: true, // Se falso, usará a instância do Chromium
    debug: false, // Abre uma sessão de depuração
    logQR: true, // Log do QR code automaticamente no terminal
    browserWS: '', // Caso queira usar browserWSEndpoint
    browserArgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      // Isso irá escrever arquivos de memória compartilhada em /tmp em vez de /dev/shm,
      // porque o padrão do Docker para /dev/shm é 64MB
      '--disable-dev-shm-usage',
    ], // Parâmetros a serem adicionados à instância do navegador Chrome
    puppeteerOptions: {
      headless: 'old',
      args: [
        // Necessário para a versão Docker do Puppeteer
        '--no-sandbox',
        '--disable-setuid-sandbox',
        // Isso irá escrever arquivos de memória compartilhada em /tmp em vez de /dev/shm,
        // porque o padrão do Docker para /dev/shm é 64MB
        '--disable-dev-shm-usage',
      ]
    }, // Será passado para puppeteer.launch
    disableWelcome: false, // Opção para desativar a mensagem de boas-vindas que aparece no início
    updatesLog: true, // Log das atualizações de informações automaticamente no terminal
    autoClose: 0, // Fecha automaticamente o wppconnect somente ao escanear o QR code (padrão de 60 segundos; se desejar desativar, atribua 0 ou false)
    tokenStore: 'file', // Define como trabalhar com tokens; pode ser uma interface personalizada
    folderNameToken: './tokens', // Nome da pasta ao salvar tokens
    // BrowserSessionToken
    // Para receber o token do cliente, use a função await client.getSessionTokenBrowser()
    sessionToken: {
      WABrowserId: '"UnXjH....."',
      WASecretBundle: '{"key":"+i/nRgWJ....","encKey":"kGdMR5t....","macKey":"+i/nRgW...."}',
      WAToken1: '"0i8...."',
      WAToken2: '"1@lPpzwC...."',
    }
  })
  .then((client) => start(client))
  .catch((error) => console.log(error));

}

/// 
/// [Opcional] Pode enviar mensagens para algum número seu, avisando quando o servidor foi inicializado ou reinicializado
/// 
function alertServer(client) {

  client.sendText("5511900000000@c.us", "Servidor online!")
    .then((result) => {
      console.log("Servidor online!");
    })
    .catch((error) => {});

}


/// 
/// Inicializa o cliente, deixando pronto para receber as mensagens.
/// 
async function start(client) {

  // alertServer(client);
  console.log("Servidor online!");
  //setInterval(() => alertServer(client), 3600000);
  client.onMessage(async (message) => {
    checkChat(client,message);
  });

}


/// 
/// Checa as mensagens recebidas e toma as ações
/// 
async function checkChat(client,message) {

    var msg = message.body;
    if(msg == null) {return;}

    if(msg.contains("/AIGPT")) {

      await client.startTyping(message.from);
      setTimeout(async function(){
          await client.stopTyping(message.from);
          usingChatGPT(client,message,msg);
          //initChat(client,message);        
      }, 3000); 

    }

    return;

   
    

}


/// 
/// Inicia o filtro do chat, dando opções antes de começar.
/// 
async function initChat(client,message) {

  const buttons = {
    title: 'Olá '+message.sender.formattedName,
    footer: 'Por favor escolha uma das opções a seguir:',
    isDynamicReplyButtonsMsg: true,
    dynamicReplyButtons: [
      {
      buttonId: 'pc1',
          buttonText: {
            displayText: 'Perguntar ao Chat GPT',
          },
          type: 1,
      },
      {
        buttonId: 'pc2',
            buttonText: {
              displayText: 'Perguntar ao Bard',
            },
            type: 1,
      }
    ],
  };

  await client.sendMessageOptions(message.from, 'Seja bem vindo(a)', buttons)
  .then((result) => {
    console.log("Send");
  })
  .catch((error) => {
    console.log("error "+error);
  });

}

async function usingChatGPT(client, message, msg) {
  try { 
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    const requestData = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: msg,
        },
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };

    console.log(requestData);

    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openIAToken}`,
      },
    });

    // Lidere com a resposta da API conforme necessário
    const apiResponse = response.data;
    // Faça algo com a resposta (por exemplo, enviar de volta ao cliente)
    await client.sendText(message.from, apiResponse.choices[0].message.content);
  } catch (error) {
    console.error('Erro ao chamar a API do OpenAI:', error);
  }
}