// Inicia o Express.js
const express = require('express');
const app = express();

// Body Parser - usado para processar dados da requisição HTTP
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Inicia o Servidor na porta 8080
let porta = 8060;
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


db.run(`CREATE TABLE IF NOT EXISTS cobrancas 
        (codigo INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, cartao TEXT NOT NULL, valor INTEGER NOT NULL, cpf TEXT NOT NULL)`, 
        [], (err) => {
           if (err) {
              console.log('ERRO: não foi possível criar tabela.');
              throw err;
           }
      });   

// Método HTTP POST /Cadastro-Posto - cadastra um novo posto
app.post('/Cobranca', (req, res, next) => {
    db.run(`INSERT INTO cobrancas(cartao, valor, cpf) VALUES(?,?,?)`, 
         [req.body.cartao, req.body.valor, req.body.cpf], (err) => {
        if (err) {
            console.log("Error: " + err);
            res.status(500).send('Erro ao realizar cobrança.');
        } else {
            console.log('Cobrança realizada com sucesso!');
            res.status(200).send('Cobrança realizada com sucesso!');
        }
    });
});

// Método HTTP GET /Cadastro-Postos - retorna todos os cadastros
app.get('/Cobranca', (req, res, next) => {
    db.all(`SELECT * FROM cobrancas`, [], (err, result) => {
        if (err) {
             console.log("Erro: " + err);
             res.status(500).send('Erro ao obter dados.');
        } else {
            res.status(200).json(result);
        }
    });
});

// Método HTTP GET /Posto/:codigo - retorna o posto com base no codigo
app.get('/Usuario/:cpf', (req, res, next) => {
    db.get( `SELECT * FROM cobrancas WHERE cpf = ?`, 
            req.params.cpf, (err, result) => {
        if (err) { 
            console.log("Erro: "+err);
            res.status(500).send('Erro ao obter dados.');
        } else if (result == null) {
            console.log("Nenhuma cobrança encontrada.");
            res.status(404).send('Nenhuma cobrança encontrada.');
        } else {
            res.status(200).json(result);
        }
    });
});

//Método HTTP DELETE /Posto/:codigo - remove um posto
app.delete('/Usuario/:cpf', (req, res, next) => {
    db.run(`DELETE FROM usuarios WHERE cpf = ?`, req.params.cpf, function(err) {
      if (err){
         res.status(500).send('Erro ao remover usuario.');
      } else if (this.changes == 0) {
         console.log("Usuario não encontrado.");
         res.status(404).send('Usuario não encontrado.');
      } else {
         res.status(200).send('Usuario removido com sucesso!');
      }
   });
});