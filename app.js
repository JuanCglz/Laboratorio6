const express = require('express')
const weather = require('./weather.js')

const app = express()

const port = process.env.PORT || 3000

app.get('', function(req, res) {
  res.send({
    greeting: 'Laboratorio 6 - JCGA'
  })
})

app.get('/weather', function(req, res) {
  if(!req.query.search) {
    res.send({
      error: 'Debes enviar un lugar para obtener el clima'
    })
  }
  weather.mapBox(req.query.search, function(error, data) {
      if (error) {
        return res.send({
          error: error
        })
      } else {
          weather.darkSky(data.name, data.latitude, data.longitude, function(error, data) {
              if (error) {
                return res.send({
                  error: error
                })
              } else {
                  res.send(data)
              }
          })
      }
  })
})

app.get('*', function(req, res) {
  res.send({
    error: 'Ruta no valida :('
  })
})

app.listen(port, function() {
  console.log('Up and running!')
})
