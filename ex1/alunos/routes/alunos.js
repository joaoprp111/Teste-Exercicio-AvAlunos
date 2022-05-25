var express = require('express');
var router = express.Router();
var axios = require('axios');
var Aluno = require('../controllers/alunos');
const url = require('url');

function countTpc(dados){
  var newJsonList = []
  dados.forEach(aluno => {
    var tpcs = aluno.tpc
    var jsonObject = {}
    jsonObject.idAluno = aluno.idAluno
    jsonObject.nome = aluno.nome
    jsonObject.curso = aluno.curso
    jsonObject.tpcsRealizados = tpcs.length

    newJsonList.push(jsonObject)
  });

  return newJsonList
}

function agruparPorCurso(dados){
  var dict = {}
  dados.forEach(aluno => {
    var curso = aluno.curso
    if (dict[curso] == undefined)
      dict[curso] = 1
    else
      dict[curso] = dict[curso] + 1
  });

  var cursos = Object.keys(dict)
  var lista = []
  cursos.forEach(c => {
    var objectCurso = {}
    objectCurso[c] = dict[c]
    lista.push(objectCurso)
  });

  return lista
}

function agruparPorNotasProjeto(dados){
  var dict = {}
  dados.forEach(aluno => {
    var nota = aluno.projeto
    if (dict[nota] == undefined)
      dict[nota] = 1
    else
      dict[nota] = dict[nota] + 1
  });

  var notas = Object.keys(dict)
  var lista = []
  notas.forEach(n => {
    var objectNota = {}
    objectNota[n] = dict[n]
    lista.push(objectNota)
  });

  return lista
}

function filtrarAlunosRecurso(dados){
  var lista = []
  dados.forEach(aluno => {
    var exames = aluno.exames
    if (exames.recurso != undefined){
      var objectAluno = {
        idAluno: aluno.idAluno,
        nome: aluno.nome,
        curso: aluno.curso,
        recurso: exames.recurso
      }
      lista.push(objectAluno)
    }
  });

  return lista
}

function getNotas(tpcs){
  res = []
  tpcs.forEach(tpc => {
    var nota = parseFloat(tpc.nota)
    res.push(nota)
  });

  return res
}

function calcularAvaliacao(dados){
  var lista = []
  dados.forEach(aluno => {
    var notaFinal = undefined
    var notaProjeto = parseInt(aluno.projeto)
    //console.log('Nota projeto: ' + notaProjeto)
    var notasExames = Object.values(aluno.exames).filter(a => a != undefined)
    var notaMaxima = Math.max(...notasExames)
    //console.log('Nota maxima exames: ' + notaMaxima)
    var notasTpc = getNotas(aluno.tpc)
    var somaTpcs = notasTpc.reduce((a, b) => a + b, 0)
    //console.log('Soma dos tpcs: ' + somaTpcs)

    if (notaProjeto < 8)
      notaFinal = "R"
    else if (notaMaxima < 8)
      notaFinal = "R"
    else{
      var notaFinalProvisoria = somaTpcs + 0.4 * notaProjeto + 0.4 * notaMaxima
      //console.log(notaFinalProvisoria)
      if (notaFinalProvisoria < 10)
        notaFinal = "R"
      else
        notaFinal = notaFinalProvisoria
    }

    var notaFinalObject = {
      idAluno: aluno.idAluno,
      nome: aluno.nome,
      curso: aluno.curso,
      notaFinal: notaFinal
    }
    lista.push(notaFinalObject)
  });

  return lista
}

/* GET home page. */
router.get('/', function(req, res, next) {
  var q = url.parse(req.url,true).query;
  if (q.curso != undefined){
    var curso = q.curso
    Aluno.listarPorCurso(curso)
      .then(dados => {
        res.status(200).jsonp(dados)
      })
      .catch(error => {
        res.status(500).jsonp({erro:error})
      })
  }
  else if (q.groupBy != undefined && q.groupBy == 'curso'){
    Aluno.listarCursosAlfabeticamente()
      .then(dados => {
        resultado = agruparPorCurso(dados)
        res.status(200).jsonp(resultado)
      })
      .catch(error => {
        res.status(500).jsonp({erro:error})
      })
  }
  else if (q.groupBy != undefined && q.groupBy == 'projeto'){
    Aluno.listarNotasProjeto()
      .then(dados => {
        resultado = agruparPorNotasProjeto(dados)
        res.status(200).jsonp(resultado)
      })
      .catch(error => {
        res.status(500).jsonp({erro:error})
      })
  }
  else if (q.groupBy != undefined && q.groupBy == 'recurso'){
    Aluno.listarAlfabeticamenteTudo()
      .then(dados => {
        resultado = filtrarAlunosRecurso(dados)
        res.status(200).jsonp(resultado)
      })
      .catch(error => {
        res.status(500).jsonp({erro:error})
      })
  }
  else{
    console.log('Listar por ordem alfabética')
    Aluno.listarAlfabeticamente()
    .then(dados => {
      res.status(200).jsonp(dados)
    })
    .catch(error => {
      res.status(500).jsonp({erro:error})
    })
  }
});

router.get('/tpc', function(req, res, next) {
  Aluno.listarAlfabeticamenteTudo()
    .then(dados => {
      dadosComTPC = countTpc(dados)
      res.status(200).jsonp(dadosComTPC)
    })
    .catch(error => {
      res.status(500).jsonp({erro:error})
    })
});

router.get('/avaliados', function(req, res, next) {
  Aluno.listarAlfabeticamenteTudo()
    .then(dados => {
      resultado = calcularAvaliacao(dados)
      res.status(200).jsonp(resultado)
    })
    .catch(error => {
      res.status(500).jsonp({erro:error})
    })
});

router.get('/:id', function(req, res, next) {
  var id = req.params.id
  Aluno.consultar(id)
    .then(dados => {
      res.status(200).jsonp(dados)
    })
    .catch(error => {
      res.status(500).jsonp({erro:error})
    })
});

module.exports = router;
