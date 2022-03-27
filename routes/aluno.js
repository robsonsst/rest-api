const express = require('express');
const router = express.Router();

//Retorna todos os alunos
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Retorna os alunos'
    });
});

//Insere um aluno
router.post('/', (req, res, next) => {
    const aluno = {
        nome: req.body.nome,
        data_nascimento: req.body.data_nascimento,
        id_curso: req.body.id_curso
    };

    res.status(201).send({
        mensagem: 'Aluno criado',
        alunoCriado: aluno
    });
});

//Retorna os dados de um aluno
router.get('/:id_aluno', (req, res, next) => {
    const id = req.params.id_aluno
    res.status(200).send({
        mensagem: 'Detalhes do aluno',
        id_aluno: id 
    });
});

//Altera um aluno
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Usando o PATCH dentro da rota de aluno'
    });
});

//Deleta um aluno
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Aluno excluído!'
    });
});

module.exports = router;