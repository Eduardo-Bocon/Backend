// Inicia o Express.js
const express = require('express');
const app = express();

const axios = require('axios');

// Body Parser - usado para processar dados da requisição HTTP
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Método HTTP GET /hello - envia a mensagem: Hello World
app.get('/hello', (req, res) => {
 res.send('Hello World');
});

// Inicia o Servidor na porta 8040
let porta = 8040;
app.listen(porta, () => {
 console.log('Servidor em execução na porta: ' + porta);
});

// Importa o package do SQLite
const sqlite3 = require('sqlite3');

// Acessa o arquivo com o banco de dados
var db = new sqlite3.Database('./dados.db', (err) => {
        if (err) {
            console.log('ERRO: não foi possível conectar ao SQLite.');
            throw err;
        }
        console.log('Conectado ao SQLite!');
    });


db.run(`CREATE TABLE IF NOT EXISTS recargas 
        (codigo INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, valor INTEGER NOT NULL, cpf TEXT NOT NULL)`, 
        [], (err) => {
           if (err) {
              console.log('ERRO: não foi possível criar tabela.');
              throw err;
           }
      });  
      
      
app.post('/Recarga', (req, res, next) => {
    db.run(`INSERT INTO recargas(valor, cpf) VALUES(?,?)`, 
         [req.body.valor, req.body.cpf], async (err) => {
        if (err) {
            console.log("Error: " + err);
            res.status(500).send('Erro ao realizar recarga.');
        } else {
            try {
                await axios.get('http://localhost:8050/Estacao');
                res.status(201).json(novaRecarga);
              } catch (error) {
                console.error("Erro ao carregar estação:", error);
                res.status(500).json({ error: "Erro ao carregar estação" });
              }
            console.log('Recarga realizada com sucesso!');
            res.status(200).send('Recarga realizada com sucesso!');
        }
    });
});

app.get('/Recarga/:cpf', (req, res, next) => {
    db.all( `SELECT * FROM recargas WHERE cpf = ?`,
            req.params.cpf, (err, result) => {
        if (err) { 
            console.log("Erro: "+err);
            res.status(500).send('Erro ao obter dados.');
        } else if (result == null) {
            console.log("Nenhuma recarga encontrada.");
            res.status(404).send('Nenhuma recarga encontrada.');
        } else {
            res.status(200).json(result);
        }
    });
});