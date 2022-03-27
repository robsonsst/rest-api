const express = require('express');
const router = express.Router();

//Retorna todas os os alunos_disciplinas
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Retorna os alunos_disciplinas'
    });
});

//Insere um aluno_disciplina
router.post('/', (req, res, next) => {
    const aluno_disciplina = {
        id_aluno: req.body.id_aluno,
        id_disciplina: req.body.id_disciplina,
        situacao: req.body.situacao
    };

    res.status(201).send({
        mensagem: 'Aluno_Disciplina criado',
        alunoDisciplinaCriado: aluno_disciplina
    });
});

//Retorna os dados de um aluno_disciplina
router.get('/:id_aluno_disciplina', (req, res, next) => {
    const id = req.params.id_aluno_disciplina
    res.status(200).send({
        mensagem: 'Detalhes do aluno_disciplina',
        id_aluno_disciplina: id 
    });
});

//Altera um aluno_disciplina
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Usando o PATCH dentro da rota de aluno_disciplina'
    });
});

//Deleta um aluno_disciplina
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Aluno_disciplina excluído!'
    });
});

module.exports = router;