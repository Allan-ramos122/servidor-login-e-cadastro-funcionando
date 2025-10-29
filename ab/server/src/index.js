// Importa o framework Express para criar e gerenciar o servidor web
const express = require("express");
const rotas = require("./routes");
const path = require('path');
const dotenv = require("dotenv");

// Carrega as variáveis de ambiente definidas no arquivo .env
dotenv.config();

// Cria uma instância do aplicativo Express
const app = express();

// Middleware para permitir o envio de dados em formato JSON no corpo das requisições
app.use(express.json());

// Caminho da pasta do frontend (public)
app.use(express.static(path.join(__dirname, '../../public')));

// Servir imagens estáticas da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Usando as rotas da API com prefixo /api
app.use('/api', rotas);

// Middleware para rotas não encontradas
app.use(function(_req, res){
  res.status(404).json({ error: "Rota não encontrada"});
});

// Lê a variável PORT definida no arquivo .env
const port = process.env.PORT || 3000;

// Inicia o servidor na porta definida e exibe uma mensagem no console
app.listen(port, function () {
  console.log(`Servidor rodando na porta ${port}`);
});
