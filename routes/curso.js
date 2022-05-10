const express = require('express');
const router = express.Router();

const CursoController = require('../controllers/cursoController');

router.get('/', CursoController.getCurso);
router.post('/', CursoController.postCurso);
router.get('/:id_curso', CursoController.getCursoEspecifico);
router.patch('/', CursoController.updateCurso);
router.delete('/', CursoController.deleteCurso);

module.exports = router;