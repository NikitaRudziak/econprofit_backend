process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const express = require('express')
const rp = require('request-promise-native');
const app = express()
const port = 3001

const api_model = require('./api_model');
// const { response } = require('express');
// const subroute;
const subroute = '/maffback';

app.use(express.json())
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000 ');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
});

function myFunc(arg) {
    let arr = [];
    let d = new Date()
    let od = new Date(d);
    od.setDate(od.getDate() - 1)
    to = '',
    from = '';
    to = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
    from = od.getFullYear() + '-' + (od.getMonth() + 1) + '-' + (od.getDate())
    console.log(from, to);
    rp(testing( from, to ))
        .then(parsedBody => {
            parsedBody.map(item => {
                let obj = {
                    friendlyCode: Number(item['deviceNumber']),
                    chargingFrom: item['startTime'].replace('T', ' ').slice(0, -1),
                    chargingTo: item['finishTime'] ? item['finishTime'].replace('T', ' ').slice(0, -1) : null,
                    kWh: item['energy'],
                    totalCost: item['billVat'] ? item['billVat'] : 0.0,
                    email: item['userLogin'],
                    connector: item['connectorName']
                  }
                arr.push(obj);
            })
            console.log(arr)
            arr.map(item => {
                api_model.pushNewDay(item)
                
            })
        })
        .catch(err => {
            res.send(err);
        });
}
  
// setInterval(myFunc, 86400000, 'funky');

const testing = (from, to) => {
    const options = {
        // uri: `http://apigateway.malankabn.by/admin/api/v1/session-histories?timeFrom=${from}&timeTo=${to}`,
        uri: `http://apigateway.malankabn.by/admin/api/v1/session-histories?timeFrom=2022-11-25T00:00:00.108864Z&timeTo=2022-12-31T23:59:59.181772Z`,
        // &timeTo=2023-09-08T23:59:59.181772Z
        headers: {
            'User-Agent': 'Request-Promise',
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjpbIjFfQURNSU4iLCIyX1VTRVIiLCI2X0FETUlOIiwiN19DSEFUX09QRVJBVE9SIiwiMV9TVEFSVF9DSEFSR0VfU0VTU0lPTiIsIjFfU1RPUF9DSEFSR0VfU0VTU0lPTiJdLCJzdWIiOiI2NDJkZDczMi1mZTEyLTQwOGQtYTQ5ZS1kNGIxYzViY2RkNGYiLCJpYXQiOjE2ODc1MDUxNTQsImV4cCI6MTY4NzUzMzk1NH0.EZpW75pB5RzjUVgAXzjfE2EHOKB-Bz1e5cO0LyT70tqoB4CampwJQPcv2wSAIqzvx5zSInAgd7T7BkfGmX-GQw'
        },
        json: true // Automatically parses the JSON string in the response
    };
    return options
}

app.get('/test/:from/:to', (req, res) => {
    let arr = [];
    rp(testing(req.params['from'], req.params['to']))
        .then(parsedBody => {
            parsedBody.map(item => {
                let obj = {
                    friendlyCode: Number(item['deviceNumber']),
                    chargingFrom: item['startTime'].replace('T', ' ').slice(0, -1),
                    chargingTo: item['finishTime'] ? item['finishTime'].replace('T', ' ').slice(0, -1) : null,
                    kWh: item['energy'],
                    totalCost: item['billVat'] ? item['billVat'] : 0.0,
                    email: item['userLogin'],
                    connector: item['connectorName']
                  }
                arr.push(obj);
            })
            console.log(arr)
            arr.map(item => {
                api_model.pushNewDay(item)
                
            })
        })
        .catch(err => {
            res.send(err);
        });
})

// function myFunc(arg) {
//     let arr = [];
//     let d = new Date()
//     let od = new Date(d);
//     od.setDate(od.getDate() - 1)
//     to = '',
//     from = '';
//     to = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
//     from = od.getFullYear() + '-' + (od.getMonth() + 1) + '-' + (od.getDate())
//     console.log(from, to);
//     // rp(testing( from, to ))
//     //     .then(parsedBody => {
//     //         parsedBody['Content'].map(item => {
//     //             let obj = {
//     //                 friendlyCode: Number(item['ChargePoint']['FriendlyCode'].substr(-12)),
//     //                 chargingFrom: item['ChargingFrom'].replace('T', ' ').slice(0, -1),
//     //                 chargingTo: item['ChargingTo'] ? item['ChargingTo'].replace('T', ' ').slice(0, -1) : null,
//     //                 kWh: item['MeterActiveEnergyEnd'],
//     //                 totalCost: item['TotalCost'] ? item['TotalCost'] : 0.0,
//     //                 email: item['Identification']['User']['Email'],
//     //                 connector: item['Connector']['Type']['Title']
//     //               }
//     //             arr.push(obj);
//     //         })
//     //         console.log(arr)
//     //         arr.map(item => {
//     //             api_model.pushNewDay(item)
                
//     //         })
//     //     })
//     //     .catch(err => {
//     //         res.send(err);
//     //     });
// }
  
// // setTimeout(myFunc, 3000, 'funky');

// const testing = (from, to) => {
//     const options = {
//         // uri: `https://belorusneft.etrel.com/UrchinWebApi/chargingSessions?pageNumber=1&sortColumn=energyConsumtion&sortDirection=asc&chargingFrom=${from}&chargingTo=${to}`,
//         uri: `https://belorusneft.etrel.com/UrchinWebApi/chargingSessions?pageNumber=1&sortColumn=energyConsumtion&sortDirection=asc&chargingFrom=2022-02-01&chargingTo=2022-02-02`,
//         headers: {
//             'User-Agent': 'Request-Promise',
//             'Content-Type': 'application/json; charset=utf-8',
//             'Accept': 'application/json',
//             'Authorization': 'Basic QVBJQUNDRVNTLTEzNDk6dDV3dFJEUkxQZFhncTYwVVhnS3NhQzVRWWFmU0VpMzk='
//         },
//         json: true // Automatically parses the JSON string in the response
//     };
//     return options
// }

// app.get(subroute+'/test/:from/:to', (req,res) => {
//   rp(testing(req.params['from'], req.params['to']))
//     .then(parsedBody => {
//       res.send(parsedBody);
//   })
//     .catch(err => {
//       res.send(err);
//   });
// })

// app.get(subroute+'/location', (req, res) => {
//   api_model.getLocations()
//     .then(response => {
//       res.status(200).send(response);
//     })
//     .catch(error => {
//       res.status(500).send(error);
//     })
//   })

// app.get(subroute+'/station', (req, res) => {
//   api_model.getStations()
//     .then(response => {
//       res.status(200).send(response);
//     })
//     .catch(error => {
//       res.status(500).send(error);
//     })
//   })

// app.get(subroute+'/summaryValues', (req, res) => {
//   api_model.getSummary()
//     .then(response => {
//       res.status(200).send(response);
//     })
//     .catch(error => {
//       res.status(500).send(error);
//     })
//   })

// app.get(subroute+'/summaryFailed', (req, res) => {
//   api_model.getFailed()
//     .then(response => {
//       res.status(200).send(response);
//     })
//     .catch(error => {
//       res.status(500).send(error);
//     })
//   })

// app.get(subroute+'/summarybyregion', (req, res) => {
//   api_model.getByRegion()
//     .then(response => {
//       res.status(200).send(response);
//     })
//     .catch(error => {
//       res.status(500).send(error);
//     })
//   })

// app.get(subroute+'/chademo', (req, res) => {
//   api_model.getChademo()
//     .then(response => {
//       res.status(200).send(response);
//     })
//     .catch(error => {
//       res.status(500).send(error);
//     })
//   })

// app.get(subroute+'/ccs', (req, res) => {
//   api_model.getCCS()
//     .then(response => {
//       res.status(200).send(response);
//     })
//     .catch(error => {
//       res.status(500).send(error);
//     })
//   })

// app.get(subroute+'/type2', (req, res) => {
//   api_model.getType2()
//     .then(response => {
//       res.status(200).send(response);
//     })
//     .catch(error => {
//       res.status(500).send(error);
//     })
//   })

// app.get(subroute+'/type2plug', (req, res) => {
//   api_model.getType2Plug()
//     .then(response => {
//       res.status(200).send(response);
//     })
//     .catch(error => {
//       res.status(500).send(error);
//     })
//   })

// app.get(subroute+'/byconnector', (req, res) => {
//   api_model.getByConnector()
//     .then(response => {
//       res.status(200).send(response);
//     })
//     .catch(error => {
//       res.status(500).send(error);
//     })
//   })

// app.get(subroute+'/locationinfo/:id', (req, res) => {
//   api_model.getLocationInfo(req.params['id'])
//     .then(response => {
//       res.status(200).send(response);
//     })
//     .catch(error => {
//       res.status(500).send(error);
//     })
// })

// app.get(subroute+'/sessioninfo/:id', (req, res) => {
//   api_model.getSessionInfo(req.params['id'])
//     .then(response => {
//       res.status(200).send(response);
//     })
//     .catch(error => {
//       res.status(500).send(error);
//     })
// })

// app.get(subroute+'/percentinfo', (req, res) => {
//   api_model.getPercentInfo()
//     .then(response => {
//       res.status(200).send(response);
//     })
//     .catch(error => {
//       res.status(500).send(error);
//     })
// })
// app.get(subroute+'/countinfo', (req, res) => {
//   api_model.getCountInfo()
//     .then(response => {
//       res.status(200).send(response);
//     })
//     .catch(error => {
//       res.status(500).send(error);
//     })
// })

// app.get(subroute+'/lastdate', (req, res) => {
//   api_model.getLastDate()
//     .then(response => {
//       res.status(200).send(response);
//     })
//     .catch(error => {
//       res.status(500).send(error);
//     })
// })

// app.use(express.json());
// app.post(subroute+'/newDay', (req, res) => {
//   api_model.pushNewDay(req.body)
//   .then(response => {
//     res.status(200).send(response);
//     })
//   .catch(error => {
//     res.status(500).send(error);
//   })
// }) 

// // ----------------------------

app.get('/regionstat', (req, res) => {
    api_model.getRegionStat()
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/dest', (req, res) => {
    api_model.getDestination()
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/regionsess', (req, res) => {
    api_model.getRegionSess()
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/regioncount', (req, res) => {
    api_model.getRegionStationCount()
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/getcp', (req, res) => {
    api_model.getCP()
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})


app.get('/getregmarkers', (req, res) => {
    api_model.getRegMarkers()
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/gettotalzatr', (req, res) => {
    api_model.getTotalZatr()
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

// -----------------------------

app.get('/test/:from/:to', (req, res) => {
    rp(testing(req.params['from'], req.params['to']))
        .then(parsedBody => {
            res.send(parsedBody);
        })
        .catch(err => {
            res.send(err);
        });
})

app.get('/totalmonth/:from/:to', (req, res) => {
    api_model.getTotalMonth(req.params['from'], req.params['to'])
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
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

// newmaff----------------------------------
app.get('/locationmark', (req, res) => {
    api_model.getLocationForMark()
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/locationfull/:id', (req, res) => {
    api_model.getLocationsFull(req.params['id'])
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/locationabout/:id', (req, res) => {
    api_model.getLocationAbout(req.params['id'])
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/stationabout/:id', (req, res) => {
    api_model.getStationAbout(req.params['id'])
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/locationstat/:id', (req, res) => {
    api_model.getLocationStat(req.params['id'])
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

// newmaff-------------------------

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

app.get('/timespend/:id', (req, res) => {
    api_model.getTimeSpend(req.params['id'])
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/getalp/:id', (req, res) => {
    api_model.getAlpById(req.params['id'])
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/getalpto/:id', (req, res) => {
    api_model.getAlpTOById(req.params['id'])
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/timespendbyregion', (req, res) => {
    api_model.getTimeSpendByRegion()
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/bymode', (req, res) => {
    api_model.getByMode()
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/bymodecountry', (req, res) => {
    api_model.getByModeCountry()
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})
app.get('/getconstantsbymonth', (req, res) => {
    api_model.getConstantByMonth()
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})
app.post('/addconstant', (req, res) => {
    console.log(req.body)
    
    api_model.addConstant(req.body)
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

app.get('/getIndicatorsByYear', (req, res) => {
    api_model.getIndicatorsByYear()
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/getUsersCountByYear', (req, res) => {
    api_model.getUsersCountByYear()
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/getIndicatorsByYear2/:id', (req, res) => {
    api_model.getIndicatorsByYearId(req.params['id'])
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/getStationCountByYear', (req, res) => {
    api_model.getStationCountByYear()
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/getStationCountByYearId/:id', (req, res) => {
    api_model.getStationCountByYearId(req.params['id'])
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/getMainIndicatorsList/:id', (req, res) => {
    api_model.getMainIndicatorsList(req.params['id'])
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