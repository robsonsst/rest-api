const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//Retorna todos os alunos
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error});
        }
        conn.query(
            'SELECT * FROM aluno',
            (error, result, fields) => {
                if(error){
                    return res.status(500).send({error: error});
                }
                const response = {
                    quantidade: result.length,
                    alunos: result.map(aluno => {
                        return {
                            id_aluno: aluno.id_aluno,
                            id_curso: aluno.id_curso,
                            nome: aluno.nome,
                            data_nascimento: aluno.data_nascimento,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um aluno específico',
                                url: 'http://localhost:3001/aluno/' + aluno.id_aluno
                            }
                        }
                    })
                }
                return res.status(200).send(response);
            }
        ) 
    })
});

//Insere um aluno
router.post('/', (req, res, next) => {
    //verifica se existe curso com o id passado
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error});
        }
        conn.query(
            'SELECT * FROM curso WHERE id_curso = ?',
            [req.body.id_curso],
            (error, result, field) => {                
                if(error){
                    return res.status(500).send({error: error});
                }
                if(result.length == 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado nenhum curso com esse ID'
                    })
                }
                conn.query(
                    `INSERT INTO aluno 
                        (id_curso, nome, data_nascimento) 
                    VALUES 
                        (?, ?, ?);`,
                    [
                        req.body.id_curso,
                        req.body.nome, 
                        req.body.data_nascimento
                    ],
                    (error, result, field) => {
                        conn.release(); //libera a conexão
        
                        if(error){
                            return res.status(500).send({error: error});
                        }
                        
                        const response = {
                            mensagem: 'Aluno inserido com sucesso',
                            alunoCriado: {
                                id_aluno: result.id_aluno,
                                id_curso: req.body.id_curso,
                                nome: req.body.nome,
                                data_nascimento: req.body.data_nascimento,
                                request: {
                                    tipo: 'GET',
                                    descricao: 'Retorna todos os alunos',
                                    url: 'http://localhost:3001/aluno'
                                }
                            }
                        }
                        return res.status(201).send(response);
                    }
                )            
            }
        )
    })            
});

//Retorna os dados de um aluno
router.get('/:id_aluno', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error});
        }
        conn.query(
            'SELECT * FROM aluno WHERE id_aluno = ?;',
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
                    aluno: {
                        id_aluno: result[0].id_aluno,
                        id_curso: result[0].id_curso,
                        nome: result[0].nome,
                        data_nascimento: result[0].data_nascimento,                    
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os alunos',
                            url: 'http://localhost:3001/aluno'
                        }
                    }
                }
                return res.status(200).send(response);
            }
        ) 
    });
});

//Altera um aluno
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error});
        }
        conn.query(
            `UPDATE aluno
                SET id_curso = ?,
                    nome = ?,                    
                    data_nascimento = ?
              WHERE id_aluno = ?`,
            [
                req.body.id_curso,
                req.body.nome, 
                req.body.data_nascimento,
                req.body.id_aluno
            ],
            (error, result, fields) => {
                if(error){
                    return res.status(500).send({error: error});
                }
                const response = {
                    mensagem: 'Aluno atualizado com sucesso',
                    alunoAtualizado: {
                        id_aluno: req.body.id_aluno,
                        id_curso: req.body.id_curso,
                        nome: req.body.nome,
                        data_nascimento: req.body.data_nascimento,                        
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um aluno específico',
                            url: 'http://localhost:3001/aluno/' + req.body.id_aluno
                        }
                    }
                }
                return res.status(202).send(response);
            }
        ) 
    })
});

//Deleta um aluno
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error});
        }
        conn.query(
            'DELETE FROM aluno WHERE id_aluno = ?',
            [req.body.id_aluno],
            (error, resultado, fields) => {
                if(error){
                    return res.status(500).send({error: error});
                }

                const responde = {
                    mensagem: 'Aluno excluído com sucesso!!',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um aluno',
                        url: 'https://localhost:3001/aluno',
                        body: {
                            id_curso:'Number',
                            nome: 'String',
                            data_nascimento: 'Date',                            
                        }
                    }
                }
                return res.status(202).send(responde);
            }
        ) 
    })
});

module.exports = router;