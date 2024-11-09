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

const axios = require('axios').default;

app.get('/Estacao', (req, res, next) => {
    console.log("Estação está carregando...");
    res.send("Carregamento iniciado");
});