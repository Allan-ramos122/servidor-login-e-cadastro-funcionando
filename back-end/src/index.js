// Arquivo: index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
// Importe o 'pool' do seu arquivo de banco de dados
const pool = require('./controladores/bd.js');

const app = express();

app.use(cors());
app.use(express.json());

// Função de LOGIN (buscar)
const buscar = async (req, res) => {
  const { mail, nome } = req.body;

  if (!mail || !nome) {
    return res.status(400).json({ erro: 'email e nome são obrigatórios' });
  }

  try {
    const query = 'SELECT * FROM tbusuario WHERE email = $1';
    const result = await pool.query(query, [mail]);

    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    const usuario = result.rows[0];

    if (usuario.nome !== nome) {
      return res.status(401).json({ erro: 'Nome incorreto' });
    }
    
    // CORREÇÃO: Adiciona a resposta de sucesso que estava faltando
    return res.status(200).json(usuario);

  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Função de CADASTRO (criar)
const criar = async (req, res) => {
  const { email, nome } = req.body;

  if (!email || email.length == 0) {
    return res.status(400).json({ erro: "Forneça o email" });
  } else if (!nome || nome.length == 0) {
    return res.status(400).json({ erro: "Forneça o nome" });
  }

  try {
    // 1. Verifica se o usuário já existe
    let resposta = await pool.query(
      "SELECT * FROM tbusuario WHERE email=$1 LIMIT 1",
      [email]
    );

    if (resposta.rowCount > 0) {
      // 409 Conflict é o status correto para "recurso já existe"
      return res.status(409).json({ erro: "E-mail já cadastrado." }); 
    }

    // 2. Se não existe, insere o novo usuário
    resposta = await pool.query(
      "INSERT INTO tbusuario (email,nome) values ($1,$2) RETURNING idusuario, email, nome",
      [email, nome]
    );
    
    // CORREÇÃO: Envia status 201 (Criado) como o front-end espera
    return res.status(201).json(resposta.rows[0]);

  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Rotas Corrigidas
app.post("/usuario", criar); // <-- Corrigido de app.get para app.post
app.post("/login", buscar);

app.use((req, res) => {
  res.status(404).json({ erro: "Rota desconhecida" });
});

const PORTA = process.env.PORTA || 3030;
app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});