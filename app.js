const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const rotaDisciplina = require('./routes/disciplina');
const rotaAluno = require('./routes/aluno');
const rotaProfessor = require('./routes/professor');
const rotaCurso = require('./routes/curso');
const rotaAlunoDisciplina = require('./routes/aluno_disciplina');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false})); //Aceita apenas dados simples
app.use(bodyParser.json()); //Aceita apenas o formato json de entrada

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if(req.method === 'OPTIONS'){
        req.header('Access-Control-Allow-Metrods', 'PUT', 'POST', 'PATCH', 'DELETE', 'GET');
        return res.status(200).send({});
    }

    next();
});

app.use('/disciplina', rotaDisciplina);
app.use('/aluno', rotaAluno);
app.use('/professor', rotaProfessor);
app.use('/curso', rotaCurso);
app.use('/aluno-disciplina', rotaAlunoDisciplina);

//Se for fornecida uma rota desconhecida, entra aqui
app.use((req, res, next) => {
   const erro = new Error('Não encontrado');
   erro.status = 404;
   next(erro);
});

app.use((error, req, res, nex) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;