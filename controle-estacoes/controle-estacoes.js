// Inicia o Express.js
const express = require('express');
const app = express();

// Body Parser - usado para processar dados da requisição HTTP
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Inicia o Servidor na porta 8050
let porta = 8050;
app.listen(porta, () => {
 console.log('Servidor em execução na porta: ' + porta);
});

function sleep(ms) {
    return new Promise(
      resolve => setTimeout(resolve, ms)
    );
  }

app.get('/Estacao', async (req, res, next) => {
    for (var i = 0; i < 9; i++){
        if (i % 2){
            console.log("Estação está carregando...");
        }else{
            console.log("Estação está carregando..");
        }
        await sleep(1000);
    }
    console.log("Carregamento finalizado");
    res.send("Carregamento finalizado");
});