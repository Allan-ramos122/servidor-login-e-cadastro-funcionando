const express = require('express');
const router = express.Router();

// Importa o controller que acabamos de criar
// (Ajuste o caminho '../controllers/vagasController' se necessário)
const vagasController = require('../controllers/vagasController');

// Define as rotas de CRUD para /vagas

// Rota para CRIAR uma nova vaga
// (POST http://localhost:3000/vagas)
router.post('/', vagasController.createVaga);

// Rota para LER (obter) todas as vagas
// (GET http://localhost:3000/vagas)
router.get('/', vagasController.getAllVagas);

// Rota para LER (obter) uma vaga específica por ID
// (GET http://localhost:3000/vagas/1)
router.get('/:id', vagasController.getVagaById);

// Rota para ATUALIZAR uma vaga por ID
// (PUT http://localhost:3000/vagas/1)
router.put('/:id', vagasController.updateVaga);

// Rota para DELETAR uma vaga por ID
// (DELETE http://localhost:3000/vagas/1)
router.delete('/:id', vagasController.deleteVaga);

// Exporta o router para ser usado no seu arquivo principal (app.js ou server.js)
module.exports = router;