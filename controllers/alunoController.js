const mysql = require('../mysql');

exports.getAluno = async (req, res, next) => {
  try {
    const result = await mysql.execute(
      `SELECT aluno.id_aluno,
                aluno.nome_aluno,
                aluno.data_nascimento,
                curso.id_curso,
                curso.nome
            FROM aluno
            INNER JOIN curso
                ON curso.id_curso = aluno.id_curso;`
    );
    const response = {
      quantidade: result.length,
      alunos: result.map((aluno) => {
        return {
          id: aluno.id_aluno,
          nome: aluno.nome_aluno,
          data_nascimento: aluno.data_nascimento,
          curso: {
            id: aluno.id_curso,
            nome: aluno.nome,
          },
          request: {
            tipo: 'GET',
            descricao: 'Retorna os detalhes de um aluno específico',
            url: 'http://localhost:3001/aluno/' + aluno.id_aluno,
          },
        };
      }),
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.postAluno = async (req, res, next) => {
  try {
    const queryCurso = 'SELECT * FROM curso WHERE id_curso = ?';
    const resultCurso = await mysql.execute(queryCurso, [req.body.id_curso]);

    if (resultCurso.length == 0) {
      return res.status(404).send({
        mensagem: 'Não foi encontrado nenhum curso com esse ID',
      });
    }

    const queryAluno = `INSERT INTO aluno 
                                (id_curso, nome_aluno, data_nascimento) 
                            VALUES 
                                (?, ?, ?);`;
    const resultAluno = await mysql.execute(queryAluno, [
      req.body.id_curso,
      req.body.nome_aluno,
      req.body.data_nascimento,
    ]);

    const response = {
      mensagem: 'Aluno inserido com sucesso',
      alunoCriado: {
        id_aluno: resultAluno.id_aluno,
        id_curso: req.body.id_curso,
        nome_aluno: req.body.nome_aluno,
        data_nascimento: req.body.data_nascimento,
        request: {
          tipo: 'GET',
          descricao: 'Retorna todos os alunos',
          url: 'http://localhost:3001/aluno',
        },
      },
    };
    return res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.getAlunoEspecifico = async (req, res, next) => {
  try {
    const query = `SELECT aluno.id_aluno,
                            aluno.nome_aluno,
                            aluno.data_nascimento,
                            curso.id_curso,
                            curso.nome
                        FROM aluno
                        INNER JOIN curso
                            ON curso.id_curso = aluno.id_curso
                        WHERE id_aluno = ?;`;
    const result = await mysql.execute(query, [req.params.id_aluno]);

    if (result.length == 0) {
      return res.status(404).send({
        mensagem: 'Não foi encontrado nenhum aluno com esse ID',
      });
    }

    const response = {
      aluno: {
        id: result[0].id_aluno,
        nome: result[0].nome_aluno,
        data_nascimento: result[0].data_nascimento,
        curso: {
          id: result[0].id_curso,
          nome: result[0].nome,
        },
        request: {
          tipo: 'GET',
          descricao: 'Retorna todos os alunos',
          url: 'http://localhost:3001/aluno',
        },
      },
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.updateAluno = async (req, res, next) => {
  try {
    const query = `UPDATE aluno
                        SET id_curso = ?,
                            nome_aluno = ?,                    
                            data_nascimento = ?
                        WHERE id_aluno = ?`;
    await mysql.execute(query, [
      req.body.id_curso,
      req.body.nome_aluno,
      req.body.data_nascimento,
      req.body.id_aluno,
    ]);
    const response = {
      mensagem: 'Aluno atualizado com sucesso',
      alunoAtualizado: {
        id_aluno: req.body.id_aluno,
        id_curso: req.body.id_curso,
        nome_aluno: req.body.nome_aluno,
        data_nascimento: req.body.data_nascimento,
        request: {
          tipo: 'GET',
          descricao: 'Retorna os detalhes de um aluno específico',
          url: 'http://localhost:3001/aluno/' + req.body.id_aluno,
        },
      },
    };
    return res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.deleteAluno = async (req, res, next) => {
  try {
    const query = 'DELETE FROM aluno WHERE id_aluno = ?';
    await mysql.execute(query, [req.body.id_aluno]);
    const response = {
      mensagem: 'Aluno excluído com sucesso!!',
      request: {
        tipo: 'POST',
        descricao: 'Insere um aluno',
        url: 'https://localhost:3001/aluno',
        body: {
          id_curso: 'Number',
          nome_aluno: 'String',
          data_nascimento: 'Date',
        },
      },
    };
    return res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
