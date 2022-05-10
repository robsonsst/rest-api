const express = require('express');
const router = express.Router();

const DisciplinaController = require('../controllers/disciplinaController');

router.get('/', DisciplinaController.getDisciplina);
router.post('/', DisciplinaController.postDisciplina);
router.get('/:id_disciplina', DisciplinaController.getDisciplinaEspecifica);
router.patch('/', DisciplinaController.updateDisciplina);
router.delete('/', DisciplinaController.deleteDisciplina);

module.exports = router;