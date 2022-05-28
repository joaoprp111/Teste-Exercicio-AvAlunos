const { default: axios } = require('axios');
var express = require('express');
var router = express.Router();
var url = require('url')

const apikey = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNGNiYTg0OWJhYmI2NjdjYmZkYzE2ZSIsImlhdCI6MTY1MzM5MTc0NiwiZXhwIjoxNjU1OTgzNzQ2fQ.DxCI1zx_2Tq8tue_iDO3-bA8_IuDUVxcDSYzXMNplhDKzfLFtHX7Po4AVWPi6fYIcQ1KZ1KPoRT_svOQ89zuySPRg0wnKosDIWPRF2_YPJVZvw5wZn76mRD7wKRBciSRqpe8lzcRIVGIhifJ9Jk-KikKHhQx4W1OBqrWGanT2pOQoEDwyS55KrwXN7eabvRQn1J01mQ5c7e0sPqjcEQmoB8vM_u7c4MWAMjTFQFw_iAaI-N7wkUkoDAfLnY3HMY3zTMq23P0-AYD4_Jjl9-Gy0e8mEZAIIYmhd6vWLQG3CV3BLmU27khiXZ95nOk620kYD7BwPr5jz-JpF0eLavKaA'

/* GET users listing. */
router.get('/', function(req, res, next) {
  var q = url.parse(req.url,true).query;
  if (q.id != undefined){
    axios.get('http://clav-api.di.uminho.pt/v2/legislacao/' + q.id + '?info=completa&apikey=' + apikey)
      .then(response => {
        var diploma = response.data
        var entidades = diploma.entidades
        var processos = diploma.regula
        res.render('diploma', { title: 'Diploma', diploma: diploma, entidades: entidades, processos: processos});
      })
      .catch(function(error){
        res.render('error', {error: error});
      });
  } else {
    axios.get('http://clav-api.di.uminho.pt/v2/legislacao?apikey=' + apikey)
    .then(response => {
      var diplomas = response.data
      var tamanho = diplomas.length
      res.render('index', { title: 'Diplomas', diplomas: diplomas, tamanho: tamanho});
    })
    .catch(function(error){
      res.render('error', {error: error});
    });
  }
});

module.exports = router;
