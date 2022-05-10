SELECT * FROM disciplina;
-- 


SELECT aluno.id_aluno,
                    aluno.nome_aluno,
                    aluno.data_nascimento,
                    curso.id_curso,
                    curso.nome
                FROM aluno
            INNER JOIN curso
                ON curso.id_curso = aluno.id_curso
                WHERE id_aluno = 1;

SELECT aluno.nome_aluno, disciplina.nome_disciplina, situacao 
    FROM aluno_disciplina
    WHERE aluno_disciplina.id_aluno = aluno.id_aluno AND aluno_disciplina.id_disciplina = disciplina.id_disciplina;

