process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const express = require('express')
// var axios = require('axios');
// var request = require('request');
// var http = require('http')
const rp = require('request-promise-native');
const app = express()
const port = 3003

const api_model = require('./api_model');
const { response } = require('express');


app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000 ');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

const testing = (from, to) => {
  const options = {
    uri: `https://belorusneft.etrel.com/UrchinWebApi/chargingSessions?pageNumber=1&sortColumn=energyConsumtion&sortDirection=asc&chargingFrom=${from}&chargingTo=${to}`,
    // uri: `https://belorusneft.etrel.com/UrchinWebApi/chargingSessions?pageNumber=1&sortColumn=energyConsumtion&sortDirection=asc&chargingFrom=2021-03-18&chargingTo=2021-03-22`,
    headers: {
      'User-Agent': 'Request-Promise',
      'Content-Type': 'application/json; charset=utf-8', 
      'Accept': 'application/json', 
      'Authorization': 'Basic QVBJQUNDRVNTLTEzNDk6dDV3dFJEUkxQZFhncTYwVVhnS3NhQzVRWWFmU0VpMzk='
    },
    json: true // Automatically parses the JSON string in the response
  };
  return options
}
// const options = {
//   uri: 'https://belorusneft.etrel.com/UrchinWebApi/chargingSessions?pageNumber=1&sortColumn=energyConsumtion&sortDirection=asc&chargingFrom=2021-03-15T00:00:01.1100000Z&chargingTo=2021-03-18T00:00:00.1100000Z',
//   headers: {
//     'User-Agent': 'Request-Promise',
//     'Content-Type': 'application/json; charset=utf-8', 
//     'Accept': 'application/json', 
//     'Authorization': 'Basic QVBJQUNDRVNTLTEzNDk6dDV3dFJEUkxQZFhncTYwVVhnS3NhQzVRWWFmU0VpMzk='
//   },
//   json: true // Automatically parses the JSON string in the response
// };

app.get('/test/:from/:to', (req,res) => {
  rp(testing(req.params['from'], req.params['to']))
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

app.get('/summaryValues', (req, res) => {
  api_model.getSummary()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
  })

app.get('/summaryFailed', (req, res) => {
  api_model.getFailed()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
  })

app.get('/summarybyregion', (req, res) => {
  api_model.getByRegion()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
  })

app.get('/chademo', (req, res) => {
  api_model.getChademo()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
  })

app.get('/ccs', (req, res) => {
  api_model.getCCS()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
  })

app.get('/type2', (req, res) => {
  api_model.getType2()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
  })

app.get('/type2plug', (req, res) => {
  api_model.getType2Plug()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
  })

app.get('/byconnector', (req, res) => {
  api_model.getByConnector()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
  })
  
app.get('/locationinfo/:id', (req, res) => {
  api_model.getLocationInfo(req.params['id'])
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
})

app.get('/sessioninfo/:id', (req, res) => {
  api_model.getSessionInfo(req.params['id'])
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
})

app.get('/percentinfo', (req, res) => {
  api_model.getPercentInfo()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
})
app.get('/countinfo', (req, res) => {
  api_model.getCountInfo()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
})

app.get('/lastdate', (req, res) => {
  api_model.getLastDate()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
})

app.use(express.json());
  app.post('/newDay', (req, res) => {
    api_model.pushNewDay(req.body)
    .then(response => {
      res.status(200).send(response);
      })
    .catch(error => {
      res.status(500).send(error);
    })
  }) 

// app.post('/newday', (req, res) => {
//   api_model.pushNewDay(req.body)
//   // console.log(req.body)
//   .then(response => {
//     res.status(200).send(req.body);
//   })

//   throw new Error('Something broke! ')
// })

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})