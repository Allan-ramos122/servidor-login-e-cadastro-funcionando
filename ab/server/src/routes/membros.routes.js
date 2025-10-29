const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const membroController = require('../controllers/membro.controller');

// Configuração do multer para salvar imagens em /uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Formato de imagem inválido. Use PNG ou JPEG.'));
    }
    cb(null, true);
  },
});

// Rotas para o CRUD de membros
router.post('/', upload.single('me_imagem'), membroController.createMembro);
router.get('/', membroController.getAllMembros);
router.get('/:id', membroController.getMembroById);
router.put('/:id', upload.single('me_imagem'), membroController.updateMembro);
router.delete('/:id', membroController.deleteMembro);

module.exports = router;
