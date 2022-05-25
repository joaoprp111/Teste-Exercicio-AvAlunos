var mongoose = require('mongoose')

var alunoSchema = new mongoose.Schema({
    _id: String,
    idAluno: String,
    nome: String,
    curso: String,
    tpc: [
        {
            tp: String,
            nota: Number
        }
    ],
    projeto: Number,
    exames: {
        normal: Number,
        recurso: Number,
        especial: Number
    }
})

module.exports = mongoose.model('alunos', alunoSchema)