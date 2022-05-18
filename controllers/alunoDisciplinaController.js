const mysql = require('../mysql').pool;

exports.getAlunoDisciplina = (req, res, next) => {
  mysql.getConnection((error, conn) => {
      if(error){
          return res.status(500).send({error: error});
      }
      conn.query(`SELECT aluno.id_aluno,
                         aluno.nome_aluno,
                         disciplina.id_disciplina,
                         disciplina.nome_disciplina, 
                         aluno_disciplina.situacao
                      FROM aluno_disciplina, aluno, disciplina
                  WHERE aluno.id_aluno = aluno_disciplina.id_aluno 
                  AND 
                  disciplina.id_disciplina = aluno_disciplina.id_disciplina;`,
          (error, result, fields) => {
              if(error){
                  return res.status(500).send({error: error});
              }
              const response = {
                  quantidade: result.length,
                  alunos_disciplinas: result.map(ad => {
                      return {
                          id_aluno: ad.id_aluno,
                          nome_aluno: ad.nome_aluno,
                          id_disciplina: ad.id_disciplina,
                          nome_disciplina: ad.nome_disciplina,
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
};

exports.postAlunoDisciplina = (req, res, next) => {
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
};

exports.getAlunoDisciplinaEspecifico = (req, res, next) => {
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
};