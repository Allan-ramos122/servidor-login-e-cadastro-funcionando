const express = require("express");
const router = express.Router();
const vagas = require('./routes/vagasRoutes')
const publicacao = require("./publicacao.routes");
const noticia = require("./noticia.routes");
const oportunidade = require("./oportunidade.routes");
const membros = require("./membros.routes");

router.use('/publicacoes', publicacao);
router.use('/noticias', noticia);
router.use('/oportunidades', oportunidade);
router.use('/membros', membros);
router.use('/vagas', vagas);
module.exports = router;

