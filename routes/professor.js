const express = require('express');
const router = express.Router();

const ProfessorController = require('../controllers/professorController');

router.get('/', ProfessorController.getProfessor);
router.post('/', ProfessorController.postProfessor);
router.get('/:id_professor', ProfessorController.getProfessorEspecifico);
router.patch('/', ProfessorController.updateProfessor);
router.delete('/', ProfessorController.deleteProfessor);

module.exports = router;