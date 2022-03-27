const express = require('express');
const router = express.Router();

//Retorna todas as disciplinas
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Retorna as disciplinas'
    });
});

//Insere uma disciplina
router.post('/', (req, res, next) => {
    const disciplina = {
        nome: req.body.nome,
        codigo: req.body.codigo,
        semestre: req.body.semestre,
        id_professor: req.body.id_professor
    };

    res.status(201).send({
        mensagem: 'Disciplina criada!',
        disciplinaCriada: disciplina
    });
});

//Retorna os dados de uma disciplina
router.get('/:id_disciplina', (req, res, next) => {
    const id = req.params.id_disciplina
    res.status(200).send({
        mensagem: 'Detalhes da disciplina',
        id_disciplina: id 
    });
});

//Altera uma disciplina
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Usando o PATCH dentro da rota de disciplina'
    });
});

//Deleta uma disciplina
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Disciplina excluída!'
    });
});

module.exports = router;