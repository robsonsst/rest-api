const express = require('express');
const router = express.Router();

const AlunoDisciplinaController = require('../controllers/alunoDisciplinaController');

router.get('/', AlunoDisciplinaController.getAlunoDisciplina);
router.post('/', AlunoDisciplinaController.postAlunoDisciplina);
router.get('/:id_aluno', AlunoDisciplinaController.getAlunoDisciplinaEspecifico);

module.exports = router;