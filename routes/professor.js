const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//Retorna todos os professores
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error});
        }
        conn.query(
            'SELECT * FROM professor',
            (error, result, fields) => {
                if(error){
                    return res.status(500).send({error: error});
                }
                const response = {
                    quantidade: result.length,
                    professores: result.map(professor => {
                        return {
                            id_professor: professor.id_professor,
                            nome: professor.nome,                            
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um professor específico',
                                url: 'http://localhost:3001/professor/' + professor.id_professor
                            }
                        }
                    })
                }
                return res.status(200).send(response);
            }
        ) 
    })
});

//Insere um professor
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error});
        }
        conn.query(
            'INSERT INTO professor (nome) VALUES (?);',
            [req.body.nome],
            (error, result, field) => {
                conn.release(); //libera a conexão

                if(error){
                    return res.status(500).send({error: error});
                }
                
                const response = {
                    mensagem: 'Professor inserido com sucesso',
                    professorCriado: {
                        id_professor: result.id_professor,
                        nome: req.body.nome,                        
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os professores',
                            url: 'http://localhost:3001/professor'
                        }
                    }
                }
                return res.status(201).send(response);
            }
        )
    })
});

//Retorna os dados de um professor
router.get('/:id_professor', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error});
        }
        conn.query(
            'SELECT * FROM professor WHERE id_professor = ?;',
            [req.params.id_professor],
            (error, result, fields) => {
                if(error){
                    return res.status(500).send({error: error});
                }

                if(result.length == 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado nenhum professor com esse ID'
                    })
                }
                const response = {                         
                    professor: {
                        id_professor: result[0].id_professor,
                        nome: result[0].nome,                        
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os professores',
                            url: 'http://localhost:3001/professor'
                        }
                    }
                }
                return res.status(200).send(response);
            }
        ) 
    })
});

//Altera um professor
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error});
        }
        conn.query(
            `UPDATE professor
                SET nome = ?                
              WHERE id_professor = ?`,
            [
                req.body.nome,                 
                req.body.id_professor
            ],
            (error, result, fields) => {
                if(error){
                    return res.status(500).send({error: error});
                }
                const response = {
                    mensagem: 'Professor atualizado com sucesso',
                    professorAtualizado: {
                        id_professor: req.body.id_professor,
                        nome: req.body.nome,                        
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um professor específico',
                            url: 'http://localhost:3001/professor/' + req.body.id_professor
                        }
                    }
                }
                return res.status(202).send(response);
            }
        ) 
    })
});

//Deleta um professor
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error});
        }
        conn.query(
            'DELETE FROM professor WHERE id_professor = ?',
            [req.body.id_professor],
            (error, resultado, fields) => {
                if(error){
                    return res.status(500).send({error: error});
                }

                const responde = {
                    mensagem: 'Professor excluído com sucesso!!',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um professor',
                        url: 'https://localhost:3001/professor',
                        body: {
                            nome: 'String',                           
                        }
                    }
                }
                return res.status(202).send(responde);
            }
        ) 
    })
});

module.exports = router;