const express = require('express');
const router = express.Router();

const AlunoController = require('../controllers/alunoController');

router.get('/', AlunoController.getAluno);
router.post('/', AlunoController.postAluno);
router.get('/:id_aluno', AlunoController.getAlunoEspecifico);
router.patch('/', AlunoController.updateAluno);
router.delete('/', AlunoController.deleteAluno);

module.exports = router;