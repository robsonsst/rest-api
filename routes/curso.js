const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//Retorna todos os cursos
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error});
        }
        conn.query(
            'SELECT * FROM curso',
            (error, result, fields) => {
                if(error){
                    return res.status(500).send({error: error});
                }
                const response = {
                    quantidade: result.length,
                    cursos: result.map(curso => {
                        return {
                            id_curso: curso.id_curso,
                            nome: curso.nome,
                            departamento: curso.departamento,
                            modalidade: curso.modalidade,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um curso específico',
                                url: 'http://localhost:3001/curso/' + curso.id_curso
                            }
                        }
                    })
                }
                return res.status(200).send(response);
            }
        ) 
    })
});

//Insere um curso
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error});
        }
        conn.query(
            `INSERT INTO curso 
                (nome, departamento, modalidade) 
            VALUES 
                (?, ?, ?);`,
            [
                req.body.nome, 
                req.body.departamento, 
                req.body.modalidade
            ],
            (error, result, field) => {
                conn.release(); //libera a conexão

                if(error){
                    return res.status(500).send({error: error});
                }
                
                const response = {
                    mensagem: 'Curso inserido com sucesso',
                    cursoCriado: {
                        id_curso: result.id_curso,
                        nome: req.body.nome,
                        departamento: req.body.departamento,
                        modalidade: req.body.modalidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os cursos',
                            url: 'http://localhost:3001/curso'
                        }
                    }
                }
                return res.status(201).send(response);
            }
        )
    })
});

//Retorna os dados de um curso
router.get('/:id_curso', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error});
        }
        conn.query(
            'SELECT * FROM curso WHERE id_curso = ?;',
            [req.params.id_curso],
            (error, result, fields) => {
                if(error){
                    return res.status(500).send({error: error});
                }

                if(result.length == 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado nenhum curso com esse ID'
                    })
                }
                const response = {                         
                    curso: {
                        id_curso: result[0].id_curso,
                        nome: result[0].nome,
                        departamento: result[0].departamento,
                        modalidade: result[0].modalidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os cursos',
                            url: 'http://localhost:3001/curso'
                        }
                    }
                }
                return res.status(200).send(response);
            }
        ) 
    })
});

//Altera um curso
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error});
        }
        conn.query(
            `UPDATE curso
                SET nome = ?,
                    departamento = ?,
                    modalidade = ?
              WHERE id_curso = ?`,
            [
                req.body.nome, 
                req.body.departamento, 
                req.body.modalidade,
                req.body.id_curso
            ],
            (error, result, fields) => {
                if(error){
                    return res.status(500).send({error: error});
                }
                const response = {
                    mensagem: 'Curso atualizado com sucesso',
                    cursoAtualizado: {
                        id_curso: req.body.id_curso,
                        nome: req.body.nome,
                        departamento: req.body.departamento,
                        modalidade: req.body.modalidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um curso específico',
                            url: 'http://localhost:3001/curso/' + req.body.id_curso
                        }
                    }
                }
                return res.status(202).send(response);
            }
        ) 
    })
});

//Deleta um curso
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({error: error});
        }
        conn.query(
            'DELETE FROM curso WHERE id_curso = ?',
            [req.body.id_curso],
            (error, resultado, fields) => {
                if(error){
                    return res.status(500).send({error: error});
                }

                const responde = {
                    mensagem: 'Curso excluído com sucesso!!',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um produto',
                        url: 'https://localhost:3001/curso',
                        body: {
                            nome: 'String',
                            departamento: 'String',
                            modalidade: 'String'
                        }
                    }
                }
                return res.status(202).send(responde);
            }
        ) 
    })
});

module.exports = router;