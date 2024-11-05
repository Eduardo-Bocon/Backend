// Inicia o Express.js
const express = require('express');
const app = express();

// Body Parser - usado para processar dados da requisição HTTP
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Inicia o Servidor na porta 8080
let porta = 8080;
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

// Cria a tabela cadastro, caso ela não exista
db.run(`CREATE TABLE IF NOT EXISTS postos 
        (codigo INTEGER NOT NULL UNIQUE, localizacao TEXT NOT NULL)`, 
        [], (err) => {
           if (err) {
              console.log('ERRO: não foi possível criar tabela.');
              throw err;
           }
      });   

// Método HTTP POST /Cadastro-Posto - cadastra um novo posto
app.post('/Posto', (req, res, next) => {
    db.run(`INSERT INTO postos(codigo, localizacao) VALUES(?,?)`, 
         [req.body.codigo, req.body.localizacao], (err) => {
        if (err) {
            console.log("Error: " + err);
            res.status(500).send('Erro ao cadastrar posto.');
        } else {
            console.log('Posto cadastrado com sucesso!');
            res.status(200).send('Posto cadastrado com sucesso!');
        }
    });
});

// Método HTTP GET /Cadastro-Postos - retorna todos os cadastros
app.get('/Posto', (req, res, next) => {
    db.all(`SELECT * FROM postos`, [], (err, result) => {
        if (err) {
             console.log("Erro: " + err);
             res.status(500).send('Erro ao obter dados.');
        } else {
            res.status(200).json(result);
        }
    });
});

// Método HTTP GET /Posto/:codigo - retorna o posto com base no codigo
app.get('/Posto/:codigo', (req, res, next) => {
    db.get( `SELECT * FROM postos WHERE codigo = ?`, 
            req.params.codigo, (err, result) => {
        if (err) { 
            console.log("Erro: "+err);
            res.status(500).send('Erro ao obter dados.');
        } else if (result == null) {
            console.log("Posto não encontrado.");
            res.status(404).send('Posto não encontrado.');
        } else {
            res.status(200).json(result);
        }
    });
});

// Método HTTP PATCH /Posto/:codigo - altera um posto
app.patch('/Posto/:codigo', (req, res, next) => {
    db.run(`UPDATE postos SET localizacao = COALESCE(?,localizacao) WHERE codigo = ?`,
           [req.body.localizacao, req.params.codigo], function(err) {
            if (err){
                res.status(500).send('Erro ao alterar dados.');
            } else if (this.changes == 0) {
                console.log("Posto não encontrado.");
                res.status(404).send('Posto não encontrado.');
            } else {
                res.status(200).send('Posto alterado com sucesso!');
            }
    });
});

//Método HTTP DELETE /Posto/:codigo - remove um posto
app.delete('/Posto/:codigo', (req, res, next) => {
    db.run(`DELETE FROM postos WHERE codigo = ?`, req.params.codigo, function(err) {
      if (err){
         res.status(500).send('Erro ao remover posto.');
      } else if (this.changes == 0) {
         console.log("Posto não encontrado.");
         res.status(404).send('Posto não encontrado.');
      } else {
         res.status(200).send('Posto removido com sucesso!');
      }
   });
});