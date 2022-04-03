const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//Retorna todas as disciplinas 
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error});
        }
        conn.query(
            'SELECT * FROM disciplina',
            (error, result, fields) => {
                if(error){
                    return res.status(500).send({error: error});
                }
                const response = {
                    quantidade: result.length,
                    disciplinas: result.map(disciplina => {
                        return {
                            id_disciplina: disciplina.id_disciplina,
                            id_professor: disciplina.id_professor,
                            nome: disciplina.nome,
                            codigo: disciplina.codigo,
                            semestre: disciplina.semestre,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de uma disciplina específica',
                                url: 'http://localhost:3001/disciplina/' + disciplina.id_disciplina
                            }
                        }
                    })
                }
                return res.status(200).send(response);
            }
        ) 
    })
});

//Insere uma disciplina
router.post('/', (req, res, next) => {
    //verifica se existe professor com o id passado
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error});
        }
        
        conn.query(
            'SELECT * FROM professor WHERE id_professor = ?',
            [req.body.id_professor],
            (error, result, field) => {                
                if(error){
                    return res.status(500).send({error: error});
                }
                if(result.length == 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado nenhum professor com esse ID'
                    })
                }
                conn.query(
                    `INSERT INTO disciplina 
                        (id_professor, nome, codigo, semestre) 
                    VALUES 
                        (?, ?, ?, ?);`,
                    [                        
                        req.body.id_professor,
                        req.body.nome,
                        req.body.codigo, 
                        req.body.semestre
                    ],
                    (error, result, field) => {
                        conn.release(); //libera a conexão
        
                        if(error){
                            return res.status(500).send({error: error});
                        }
                        
                        const response = {
                            mensagem: 'Disciplina inserida com sucesso',
                            disciplinaCriado: {
                                id_disciplina: result.id_disciplina,
                                id_professor: req.body.id_professor,
                                nome: req.body.nome,
                                codigo: req.body.codigo,
                                semestre: req.body.semestre,
                                request: {
                                    tipo: 'GET',
                                    descricao: 'Retorna todas as disciplinas',
                                    url: 'http://localhost:3001/disciplina'
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

//Retorna os dados de uma disciplina
router.get('/:id_disciplina', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error});
        }
        conn.query(
            'SELECT * FROM disciplina WHERE id_disciplina = ?;',
            [req.params.id_disciplina],
            (error, result, fields) => {
                if(error){
                    return res.status(500).send({error: error});
                }

                if(result.length == 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrada nenhuma disciplina com esse ID'
                    })
                }
                const response = {                         
                    disciplina: {
                        id_disciplina: result[0].id_disciplina,
                        id_professor: result[0].id_professor,
                        nome: result[0].nome,
                        codigo: result[0].codigo,
                        semestre: result[0].semestre,                    
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todas as disciplinas',
                            url: 'http://localhost:3001/disciplina'
                        }
                    }
                }
                return res.status(200).send(response);
            }
        ) 
    });
});

//Altera uma disciplina
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error});
        }
        conn.query(
            `UPDATE disciplina
                SET id_professor = ?,
                    nome = ?,                    
                    codigo = ?,
                    semestre = ?
              WHERE id_disciplina = ?`,
            [
                req.body.id_professor,
                req.body.nome, 
                req.body.codigo,
                req.body.semestre,
                req.body.id_disciplina
            ],
            (error, result, fields) => {
                if(error){
                    return res.status(500).send({error: error});
                }
                const response = {
                    mensagem: 'Disciplina atualizada com sucesso',
                    disciplinaAtualizado: {
                        id_disciplina: req.body.id_disciplina,
                        id_professor: req.body.id_professor,
                        nome: req.body.nome,
                        codigo: req.body.codigo,
                        semestre: req.body.semestre,                        
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de uma disciplina específica',
                            url: 'http://localhost:3001/disciplina/' + req.body.id_disciplina
                        }
                    }
                }
                return res.status(202).send(response);
            }
        ) 
    })
});

//Deleta uma disciplina
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error});
        }
        conn.query(
            'DELETE FROM disciplina WHERE id_disciplina = ?',
            [req.body.id_disciplina],
            (error, resultado, fields) => {
                if(error){
                    return res.status(500).send({error: error});
                }

                const responde = {
                    mensagem: 'Disciplina excluído com sucesso!!',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere uma disciplina',
                        url: 'https://localhost:3001/disciplina',
                        body: {
                            id_professor:'Number',
                            nome: 'String',
                            codigo: 'String',
                            semestre: 'Number'                            
                        }
                    }
                }
                return res.status(202).send(responde);
            }
        ) 
    })
});

module.exports = router;