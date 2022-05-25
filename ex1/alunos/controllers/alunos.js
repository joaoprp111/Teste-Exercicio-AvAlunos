var Aluno = require('../models/alunos')

//Listar Alunos
module.exports.listarAlfabeticamente = function(){
    return Aluno
        .find({},{_id: 0, idAluno: 1, nome: 1, curso: 1})
        .sort({nome: 1})
        .exec()
}

//Listar Alunos
module.exports.listarAlfabeticamenteTudo = function(){
    return Aluno
        .find()
        .sort({nome: 1})
        .exec()
}

//Listar Cursos
module.exports.listarCursosAlfabeticamente = function(){
    return Aluno
        .find({},{curso: 1})
        .sort({curso: 1})
        .exec()
}

//Listar Notas do projeto
module.exports.listarNotasProjeto = function(){
    return Aluno
        .find({},{projeto: 1})
        .sort({projeto: 1})
        .exec()
}

//Listar Alunos pelo seu curso
module.exports.listarPorCurso = function(curso){
    return Aluno
        .find({curso: curso},{_id: 0, idAluno: 1, nome: 1, curso: 1})
        .sort({nome: 1})
        .exec()
}

//Procurar Alunos por Id
module.exports.consultar = function(id){
    return Aluno
        .findOne({idAluno: id})
        .exec()
}

/*
//Procurar Casamentos por Data
module.exports.consultarPorNome = n => {
    var nome = new RegExp(n,'i')
    return Casamento
        .find({nome: nome})
        .exec()
}

//Procurar Casamentos por Data
module.exports.consultarPorAno = d => {
    var date = new RegExp(d)
    return Casamento
        .find({date: date})
        .exec()
}*/

