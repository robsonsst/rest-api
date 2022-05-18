const mysql = require('../mysql');

//try{
  //const result = await mysql.execute();
//} catch(error){
  //return res.status(500).send({ error: error });
//}

exports.getDisciplina = async (req, res, next) => {
  try{
    const result = await mysql.execute(
      `SELECT disciplina.id_disciplina,
          disciplina.nome_disciplina,
          disciplina.codigo,
          disciplina.semestre,
          professor.id_professor,
          professor.nome
        FROM disciplina
        INNER JOIN professor
          ON professor.id_professor = disciplina.id_professor;`
    );
    const response = {
      quantidade: result.length,
      disciplinas: result.map((disciplina) => {
        return {
          id: disciplina.id_disciplina,
          nome: disciplina.nome_disciplina,
          codigo: disciplina.codigo,
          semestre: disciplina.semestre,
          professor: {
            id: disciplina.id_professor,
            nome: disciplina.nome,
          },
          request: {
            tipo: 'GET',
            descricao: 'Retorna os detalhes de uma disciplina específica',
            url:
              'http://localhost:3001/disciplina/' +
              disciplina.id_disciplina,
          },
        };
      }),
    };
    return res.status(200).send(response);
  } catch(error){
    return res.status(500).send({ error: error });
  }
};

exports.postDisciplina = async (req, res, next) => {
  try{
    const queryProfessor = "SELECT * FROM professor WHERE id_professor = ?;";
    const resultProfessor = await mysql.execute(queryProfessor, [req.body.id_professor]);

    if (resultProfessor.length == 0) {
      return res.status(404).send({
        mensagem: 'Não foi encontrado nenhum professor com esse ID',
      });
    }

    const queryDisciplina = `INSERT INTO disciplina 
                                (id_professor, nome_disciplina, codigo, semestre) 
                                  VALUES 
                                    (?, ?, ?, ?);`;
    const resultDisciplina = await mysql.execute(queryDisciplina, [
      req.body.id_professor,
      req.body.nome_disciplina,
      req.body.codigo,
      req.body.semestre,
    ]);

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
          url: 'http://localhost:3001/disciplina',
        },
      },
    };
    return res.status(201).send(response);    
  } catch (error){
    return res.status(500).send({ error: error });
  }              
};

exports.getDisciplinaEspecifica = async(req, res, next) => {
  try{
    const query = `SELECT  disciplina.id_disciplina,
                      disciplina.nome_disciplina,
                      disciplina.codigo,
                      disciplina.semestre,
                      professor.id_professor,
                      professor.nome
                    FROM disciplina
                    INNER JOIN professor
                    ON professor.id_professor = disciplina.id_professor
                    WHERE id_disciplina = ?;`;
    const result = await mysql.execute(query, [req.params.id_disciplina]);

    if (result.length == 0) {
      return res.status(404).send({
        mensagem: 'Não foi encontrada nenhuma disciplina com esse ID',
      });
    }
    const response = {
      disciplina: {
        id: result[0].id_disciplina,
        nome: result[0].nome_disciplina,
        codigo: result[0].codigo,
        semestre: result[0].semestre,
        professor: {
          id: result[0].id_professor,
          nome: result[0].nome,
        },
        request: {
          tipo: 'GET',
          descricao: 'Retorna todas as disciplinas',
          url: 'http://localhost:3001/disciplina',
        },
      },
    };
    return res.status(200).send(response);
  } catch(error){
    return res.status(500).send({ error: error });
  }  
};

exports.updateDisciplina = async (req, res, next) => {
  try{
    const query = `UPDATE disciplina
                    SET id_professor = ?,
                        nome_disciplina = ?,                    
                        codigo = ?,
                        semestre = ?
                    WHERE id_disciplina = ?`;
    await mysql.execute();
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
          url: 'http://localhost:3001/disciplina/' + req.body.id_disciplina,
        },
      },
    };
    return res.status(202).send(response);
  } catch(error){
    return res.status(500).send({ error: error });
  }          
};

exports.deleteDisciplina = async (req, res, next) => {
  try{
    query = 'DELETE FROM disciplina WHERE id_disciplina = ?;';    
    await mysql.execute(query, [req.body.id_disciplina]);
   
    const response = {
      mensagem: 'Disciplina excluído com sucesso!!',
      request: {
        tipo: 'POST',
        descricao: 'Insere uma disciplina',
        url: 'https://localhost:3001/disciplina',
        body: {
          id_professor: 'Number',
          nome_disciplina: 'String',
          codigo: 'String',
          semestre: 'Number',
        },
      },
    };
    return res.status(202).send(response);  
  } catch(error){
    return res.status(500).send({ error: error });
  }  
};
