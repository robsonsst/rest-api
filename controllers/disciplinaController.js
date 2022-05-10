const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

exports.getDisciplina = (req, res, next) => {
  mysql.getConnection((error, conn) => {
      if(error){
          return res.status(500).send({error: error});
      }
      conn.query(`SELECT disciplina.id_disciplina,
                         disciplina.nome_disciplina,
                         disciplina.codigo,
                         disciplina.semestre,
                         professor.id_professor,
                         professor.nome
                      FROM disciplina
                  INNER JOIN professor
                      ON professor.id_professor = disciplina.id_professor;`,
          (error, result, fields) => {
              if(error){
                  return res.status(500).send({error: error});
              }
              const response = {
                  quantidade: result.length,
                  disciplinas: result.map(disciplina => {
                      return {
                          id: disciplina.id_disciplina,
                          nome: disciplina.nome_disciplina,
                          codigo: disciplina.codigo,
                          semestre: disciplina.semestre,
                          professor: {
                              id: disciplina.id_professor,
                              nome: disciplina.nome
                          },
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
};

exports.postDisciplina = (req, res, next) => {
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
                      (id_professor, nome_disciplina, codigo, semestre) 
                  VALUES 
                      (?, ?, ?, ?);`,
                  [                        
                      req.body.id_professor,
                      req.body.nome_disciplina,
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
                              nome_disciplina: req.body.nome_disciplina,
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
};

exports.getDisciplinaEspecifica = (req, res, next) => {
  mysql.getConnection((error, conn) => {
      if(error){
          return res.status(500).send({error: error});
      }
      conn.query(`SELECT  disciplina.id_disciplina,
                          disciplina.nome_disciplina,
                          disciplina.codigo,
                          disciplina.semestre,
                          professor.id_professor,
                          professor.nome
                      FROM disciplina
                  INNER JOIN professor
                      ON professor.id_professor = disciplina.id_professor
                      WHERE id_disciplina = ?;`,
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
                      id: result[0].id_disciplina,                        
                      nome: result[0].nome_disciplina,
                      codigo: result[0].codigo,
                      semestre: result[0].semestre,
                      professor: {
                          id: result[0].id_professor,
                          nome: result[0].nome
                      },
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
};

exports.updateDisciplina = (req, res, next) => {
  mysql.getConnection((error, conn) => {
      if(error){
          return res.status(500).send({error: error});
      }
      conn.query(
          `UPDATE disciplina
              SET id_professor = ?,
                  nome_disciplina = ?,                    
                  codigo = ?,
                  semestre = ?
            WHERE id_disciplina = ?`,
          [
              req.body.id_professor,
              req.body.nome_disciplina, 
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
                      nome_disciplina: req.body.nome_disciplina,
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
};

exports.deleteDisciplina = (req, res, next) => {
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
                          nome_disciplina: 'String',
                          codigo: 'String',
                          semestre: 'Number'                            
                      }
                  }
              }
              return res.status(202).send(responde);
          }
      ) 
  })
};