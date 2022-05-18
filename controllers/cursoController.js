const mysql = require('../mysql');

exports.getCurso = async (req, res, next) => {
  try{
    const result = await mysql.execute("SELECT * FROM curso;");
    const response = {
      quantidade: result.length,
      cursos: result.map((curso) => {
        return {
          id_curso: curso.id_curso,
          nome: curso.nome,
          departamento: curso.departamento,
          modalidade: curso.modalidade,
          request: {
            tipo: 'GET',
            descricao: 'Retorna os detalhes de um curso específico',
            url: 'http://localhost:3001/curso/' + curso.id_curso,
          },
        };
      }),
    };
    return res.status(200).send(response);
  } catch(error){
    return res.status(500).send({ error: error });
  }
};

exports.postCurso = async (req, res, next) => {
  try{
    const query = `INSERT INTO curso 
                    (nome, departamento, modalidade) 
                  VALUES 
                    (?, ?, ?)`;
    const result = await mysql.execute(query, [
      req.body.nome, req.body.departamento, req.body.modalidade
    ]);
    
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
          url: 'http://localhost:3001/curso',
        },
      },
    };
    return res.status(201).send(response);
  }catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.getCursoEspecifico = async (req, res, next) => {
  try{
    const query = "SELECT * FROM curso WHERE id_curso = ?;";
    const result = await mysql.execute(query, [req.params.id_curso]);

    if (result.length == 0) {
      return res.status(404).send({
        mensagem: 'Não foi encontrado nenhum curso com esse ID',
      });
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
          url: 'http://localhost:3001/curso',
        },
      },
    };
    return res.status(200).send(response);
  }catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.updateCurso = async (req, res, next) => {
  try{
    const query = `UPDATE curso
                    SET nome = ?,
                        departamento = ?,
                        modalidade = ?
                    WHERE id_curso = ?`;
    await mysql.execute(query, [
      req.body.nome,
      req.body.departamento,
      req.body.modalidade,
      req.body.id_curso,
    ]);
    
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
          url: 'http://localhost:3001/curso/' + req.body.id_curso,
        },
      },
    };
    return res.status(202).send(response);
  }catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.deleteCurso = async (req, res, next) => {
  try{

    const query = "DELETE FROM curso WHERE id_curso = ?;"
    await  mysql.execute(query, [req.body.id_curso]);
    const responde = {
      mensagem: 'Curso excluído com sucesso!!',
      request: {
        tipo: 'POST',
        descricao: 'Insere um produto',
        url: 'https://localhost:3001/curso',
        body: {
          nome: 'String',
          departamento: 'String',
          modalidade: 'String',
        },
      },
    };
    return res.status(202).send(responde);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};