const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//Retorna todos os cursos
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            });
        }
        conn.query(
            'SELECT * FROM curso',
            (error, resultado, fields) => {
                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                return res.status(200).send({
                    responde: resultado
                })
            }
        ) 
    })
});

//Insere um curso
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            });
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
            (error, resultado, field) => {
                conn.release(); //libera a conexão

                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                res.status(201).send({
                    mensagem: 'Curso inserido com sucesso!',
                    id_curso: resultado.insertId
                });
            }
        )
    })
});

//Retorna os dados de um curso
router.get('/:id_curso', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            });
        }
        conn.query(
            'SELECT * FROM curso WHERE id_curso = ?;',
            [req.params.id_curso],
            (error, resultado, fields) => {
                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                return res.status(200).send({
                    responde: resultado
                })
            }
        ) 
    })
});

//Altera um curso
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            });
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
            (error, resultado, fields) => {
                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                return res.status(202).send({
                    mensagem: 'Curso alterado com sucesso',
                })
            }
        ) 
    })
});

//Deleta um curso
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            });
        }
        conn.query(
            'DELETE FROM curso WHERE id_curso = ?',
            [req.body.id_curso],
            (error, resultado, fields) => {
                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                return res.status(202).send({
                    mensagem: 'Curso excluído com sucesso',
                })
            }
        ) 
    })
});

module.exports = router;