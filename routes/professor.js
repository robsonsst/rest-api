const express = require('express');
const router = express.Router();

//Retorna todas os professores
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Retorna os professores'
    });
});

//Insere um professor
router.post('/', (req, res, next) => {
    const professor = {
        nome: req.body.nome,
    };
    
    res.status(201).send({
        mensagem: 'Professor criado!',
        professorCriado: professor
    });
});

//Retorna os dados de um professor
router.get('/:id_professor', (req, res, next) => {
    const id = req.params.id_professor
    res.status(200).send({
        mensagem: 'Detalhes do professor',
        id_professor: id 
    });
});

//Altera uma professor
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Usando o PATCH dentro da rota de professor'
    });
});

//Deleta um professor
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Professor excluído!'
    });
});

module.exports = router;