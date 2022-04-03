const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//Retorna tudo de aluno_disciplina
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error});
        }
        conn.query(
            'SELECT * FROM aluno_disciplina',
            (error, result, fields) => {
                if(error){
                    return res.status(500).send({error: error});
                }
                const response = {
                    quantidade: result.length,
                    alunos_disciplinas: result.map(ad => {
                        return {
                            id_aluno: ad.id_aluno,
                            id_disciplina: ad.id_disciplina,
                            situacao: ad.situacao,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de aluno_disciplina específico',
                                url: 'http://localhost:3001/aluno-disciplina/' + ad.id_aluno
                            }
                        }
                    })
                }
                return res.status(200).send(response);
            }
        ) 
    })
});

//Insere um aluno_disciplina
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error});
        }
        conn.query(
            `INSERT INTO aluno_disciplina 
                (id_aluno, id_disciplina, situacao) 
            VALUES 
                (?, ?, ?);`,
            [
                req.body.id_aluno, 
                req.body.id_disciplina, 
                req.body.situacao
            ],
            (error, result, field) => {
                conn.release(); //libera a conexão

                if(error){
                    return res.status(500).send({error: error});
                }
                
                const response = {
                    mensagem: 'Aluno_disciplina inserido com sucesso',
                    alunoDisciplinaCriado: {
                        id_aluno: req.body.id_aluno,
                        id_disciplina: req.body.id_disciplina,
                        nome: req.body.nome,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna tudo em aluno_disciplina',
                            url: 'http://localhost:3001/aluno-disciplina'
                        }
                    }
                }
                return res.status(201).send(response);
            }
        )
    })
});

//Retorna os dados de um aluno_disciplina
router.get('/:id_aluno', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error});
        }
        conn.query(
            'SELECT * FROM aluno_disciplina WHERE id_aluno = ?;',
            [req.params.id_aluno],
            (error, result, fields) => {
                if(error){
                    return res.status(500).send({error: error});
                }

                if(result.length == 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado nenhum aluno com esse ID'
                    })
                }
                const response = {                         
                    alunoDisciplina: {
                        id_aluno: result[0].id_aluno,
                        id_disciplina: result[0].id_disciplina,
                        situacao: result[0].situacao,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna tudo em aluno_disciplina',
                            url: 'http://localhost:3001/aluno-disciplina'
                        }
                    }
                }
                return res.status(200).send(response);
            }
        ) 
    })
});

//Altera um aluno_disciplina
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error});
        }
        conn.query(
            `UPDATE aluno_disciplina
                SET id_aluno = ?,
                    id_disciplina = ?,
                    situacao = ?
              WHERE id_aluno = ?`,
            [
                req.body.situacao, 
                req.body.id_aluno, 
                req.body.id_disciplina
            ],
            (error, result, fields) => {
                if(error){
                    return res.status(500).send({error: error});
                }
                const response = {
                    mensagem: 'Aluno_disciplina atualizado com sucesso',
                    alunoDisciplinaAtualizado: {
                        id_aluno: req.body.id_aluno,
                        id_disciplina: req.body.id_disciplina,
                        situacao: req.body.situacao,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um aluno_disciplina específico',
                            url: 'http://localhost:3001/aluno-disciplina/' + req.body.id_aluno
                        }
                    }
                }
                return res.status(202).send(response);
            }
        ) 
    })
});

//Deleta um aluno_disciplina
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error});
        }
        conn.query(
            'DELETE FROM aluno_disciplina WHERE id_aluno = ? AND id_disciplina = ?',
            [req.body.id_aluno],
            (error, result, fields) => {
                if(error){
                    return res.status(500).send({error: error});
                }

                const responde = {
                    mensagem: 'Aluno_Disciplina excluído com sucesso!!',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um aluno_disciplina',
                        url: 'https://localhost:3001/aluno-disciplina',
                        body: {
                            id_aluno: 'Number',
                            id_disciplina: 'Number',
                            situacao: 'String'
                        }
                    }
                }
                return res.status(202).send(responde);
            }
        ) 
    })
});

module.exports = router;