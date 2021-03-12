process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const express = require('express')
// var axios = require('axios');
// var request = require('request');
// var http = require('http')
const rp      = require('request-promise-native');
const app = express()
const port = 3003

const api_model = require('./api_model');
const { response } = require('express');

app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000 ');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

// let testing = '1';
const options = {
  uri: 'https://belorusneft.etrel.com/UrchinWebApi/chargingSessions?pageNumber=1&sortColumn=energyConsumtion&sortDirection=asc&chargingFrom=2021-01-01T10:30:35.1100000Z&chargingTo=2021-01-02T00:00:00.1100000Z',
  headers: {
    'User-Agent': 'Request-Promise',
    'Content-Type': 'application/json; charset=utf-8', 
    'Accept': 'application/json', 
    'Authorization': 'Basic QVBJQUNDRVNTLTEzNDk6dDV3dFJEUkxQZFhncTYwVVhnS3NhQzVRWWFmU0VpMzk='
  },
  json: true // Automatically parses the JSON string in the response
};

app.get('/test', (req,res) => {
  rp(options)
    .then(parsedBody => {
      res.send(parsedBody);
  })
    .catch(err => {
      res.send(err);
  });
})

app.get('/location', (req, res) => {
  api_model.getLocations()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
  })

app.get('/station', (req, res) => {
  api_model.getStations()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
  })
  

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})