const Pool = require('pg').Pool
const pool = new Pool({
    user: 'aup_admin',
    host: 'tu-stor.ngdu.beloil.by',
    database: 'aupdb',
    password: 'admin4aup',
    port: 5432,
    // user: 'postgres',
    // host: 'localhost',
    // database: 'postgres',
    // // database: 'promservice',
    // password: 'root',
    // port: 3030,
});

const getLocations = () => {
    return new Promise(function(resolve, reject) {
        pool.query('SELECT * FROM econprofit.locations ORDER BY id asc', (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getStations = () => {
    return new Promise(function(resolve, reject) {
        pool.query('SELECT * FROM econprofit.stations ORDER BY id ASC', (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getSummary = () => {
    return new Promise(function(resolve, reject) {
        pool.query("select sum(kWh) as sumkw, sum(totalcost) as sumtotal, count(friendlycode) as sessioncount from econprofit.sessions where chargingfrom >= '2022-01-01'", (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getFailed = () => {
    return new Promise(function(resolve, reject) {
        pool.query("select count(friendlycode) as failedsessioncount from econprofit.sessions where kwh < 0.5 and chargingfrom >= '2022-01-01'", (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getChademo = () => {
    return new Promise(function(resolve, reject) {
        pool.query("select sum(kwh) as chademokwh, sum(totalcost) as chademototal, count(friendlycode) as sessioncount from econprofit.sessions where connector = 'Пистолет CHAdeMO' and chargingfrom >= '2022-01-01'", (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getCCS = () => {
    return new Promise(function(resolve, reject) {
        pool.query("select sum(kwh) as ccskwh, sum(totalcost) as ccstotal, count(friendlycode) as sessioncount from econprofit.sessions where connector = 'Пистолет CCS' and chargingfrom >= '2022-01-01'", (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getType2 = () => {
    return new Promise(function(resolve, reject) {
        pool.query("select sum(kwh) as type2kwh, sum(totalcost) as type2total, count(friendlycode) as sessioncount from econprofit.sessions where connector = 'Вилка Type 2' and chargingfrom >= '2022-01-01'", (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getType2Plug = () => {
    return new Promise(function(resolve, reject) {
        pool.query("select sum(kwh) as type2plugkwh, sum(totalcost) as type2plugtotal, count(friendlycode) as sessioncount from econprofit.sessions where connector = 'Розетка Type 2' and chargingfrom >= '2022-01-01'", (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getLocationInfo = (id) => {
    return new Promise(function(resolve, reject) {
        pool.query('select * from econprofit.stations, econprofit.locations where econprofit.stations.locationid = econprofit.locations.id and econprofit.locations.id = $1', [id], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getSessionInfo = (id) => {
    return new Promise(function(resolve, reject) {
        pool.query("select * from econprofit.sessions, econprofit.stations where econprofit.sessions.friendlycode = econprofit.stations.friendlycode and chargingfrom >= '2022-01-01' and econprofit.stations.locationid = $1", [id], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getPercentInfo = () => {
    return new Promise(function(resolve, reject) {
        pool.query("select econprofit.locations.name, econprofit.locations.address, econprofit.locations.region, econprofit.locations.latitude, econprofit.locations.longitude,  sum(kwh), nearplaces, nearplaces_add, company from econprofit.sessions, econprofit.stations, econprofit.locations where econprofit.sessions.friendlycode = econprofit.stations.friendlycode and econprofit.stations.locationid = econprofit.locations.id and chargingfrom >= '2022-01-01' group by econprofit.locations.name, econprofit.locations.address, econprofit.locations.latitude, econprofit.locations.longitude, econprofit.locations.region, nearplaces, nearplaces_add, company order by sum desc", (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getCountInfo = () => {
    return new Promise(function(resolve, reject) {
        pool.query('select econprofit.locations.id, econprofit.locations.name, econprofit.locations.address, count(econprofit.stations.friendlycode) from econprofit.stations, econprofit.locations where econprofit.stations.locationid = econprofit.locations.id group by econprofit.locations.name,econprofit.locations.id', (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}



const getByRegion = () => {
    return new Promise(function(resolve, reject) {
        pool.query("select econprofit.locations.company, sum(kwh) as sumkwh, sum(totalcost) as sumtotal, count(econprofit.sessions.id) from econprofit.sessions, econprofit.stations, econprofit.locations where econprofit.stations.friendlycode = econprofit.sessions.friendlycode and econprofit.stations.locationid = econprofit.locations.id and chargingfrom >= '2022-01-01' GROUP BY econprofit.locations.company", (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getByConnector = () => {
    return new Promise(function(resolve, reject) {
        pool.query("select connector, sum(kwh) as sumkwh  from econprofit.sessions where kwh >= 0.5 and chargingfrom >= '2022-01-01' group by connector ", (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getLastDate = () => {
    return new Promise(function(resolve, reject) {
        pool.query("select chargingfrom from econprofit.sessions where chargingfrom >= '2022-01-01' order by chargingfrom desc limit 1", (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getRegionStat = () => {
    return new Promise(function(resolve, reject) {
        pool.query("select econprofit.locations.company, sum(kwh) as totalkwh, sum(totalcost) as totalcost, count(econprofit.sessions.friendlycode) from econprofit.sessions, econprofit.stations, econprofit.locations where econprofit.sessions.friendlycode = econprofit.stations.friendlycode and econprofit.stations.locationid = econprofit.locations.id and chargingfrom >= '2022-01-01' group by econprofit.locations.company order by econprofit.locations.company", (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

// const getRegionStat = () => {
//   return new Promise(function(resolve, reject) {
//     pool.query('select econprofit.locations.company, sum(kwh) as totalkwh, sum(totalcost) as totalcost, count(econprofit.sessions.friendlycode) from econprofit.sessions, econprofit.stations, econprofit.locations where econprofit.sessions.friendlycode = econprofit.stations.friendlycode and econprofit.stations.locationid = econprofit.locations.id  group by econprofit.locations.company order by econprofit.locations.company', (error, results) => {
//       if (error) {
//         reject(error)
//       }
//       resolve(results.rows);
//     })
//   })
// }


const getDestination = () => {
    return new Promise(function(resolve, reject) {
        pool.query("select company, destination, count(name) from econprofit.locations, econprofit.stations where econprofit.locations.id = econprofit.stations.locationid group by region, company, destination order by company", (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}


const getRegionSess = () => {
    return new Promise(function(resolve, reject) {
        pool.query("select econprofit.locations.company, econprofit.sessions.connector, count(econprofit.sessions.friendlycode), sum(kwh), sum(totalcost) as totalcost from econprofit.sessions, econprofit.stations, econprofit.locations where econprofit.stations.friendlycode = econprofit.sessions.friendlycode and econprofit.stations.locationid = econprofit.locations.id and chargingfrom >= '2022-01-01' GROUP BY econprofit.locations.company, econprofit.sessions.connector  order by econprofit.locations.company, econprofit.sessions.connector", (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getRegionStationCount = () => {
    return new Promise(function(resolve, reject) {
        pool.query("select econprofit.locations.company, count(econprofit.stations.friendlycode) from econprofit.locations, econprofit.stations where econprofit.locations.id = econprofit.stations.locationid group by econprofit.locations.company order by econprofit.locations.company", (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getByMode = () => {
    return new Promise(function(resolve, reject) {
        pool.query("select econprofit.locations.company, econprofit.stations.stationmode, count(econprofit.stations.friendlycode) from econprofit.locations, econprofit.stations where econprofit.locations.id = econprofit.stations.locationid group by econprofit.locations.company, econprofit.stations.stationmode order by econprofit.locations.company, econprofit.stations.stationmode", (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getTimeSpend = (id) => {
    return new Promise(function(resolve, reject) {
        pool.query("select econprofit.locations.name,  sum(chargingto-chargingfrom)/count(chargingto) as timespend from econprofit.sessions, econprofit.locations, econprofit.stations  where econprofit.locations.id = econprofit.stations.locationid and econprofit.stations.friendlycode = econprofit.sessions.friendlycode and chargingto is not null and totalcost > 0.1 and econprofit.locations.id = $1 and chargingfrom >= '2022-01-01' group by econprofit.locations.name order by timespend desc", [id], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getTimeSpendByRegion = () => {
    return new Promise(function(resolve, reject) {
        pool.query('select econprofit.locations.company,  sum(chargingto-chargingfrom)/count(chargingto) as timespend from econprofit.sessions, econprofit.locations, econprofit.stations  where econprofit.locations.id = econprofit.stations.locationid and econprofit.stations.friendlycode = econprofit.sessions.friendlycode and chargingto is not null and totalcost > 0.1 group by econprofit.locations.company order by econprofit.locations.company', (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getByModeCountry = () => {
    return new Promise(function(resolve, reject) {
        pool.query('select econprofit.stations.stationmode, count(econprofit.stations.friendlycode) from econprofit.locations, econprofit.stations where econprofit.locations.id = econprofit.stations.locationid group by econprofit.stations.stationmode order by econprofit.stations.stationmode', (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const pushNewDay = (body) => {
    return new Promise(function(resolve, reject) {
        const { friendlyCode, chargingFrom, chargingTo, kWh, totalCost, email, connector } = body
        pool.query('INSERT INTO econprofit.sessions (friendlycode, chargingFrom, chargingTo, kWh, totalCost, email, connector) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [friendlyCode, chargingFrom, chargingTo, kWh, totalCost, email, connector], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(`A new merchant has been added added: `)
        })
    })
}

module.exports = {
    getLocations,
    getStations,
    pushNewDay,
    getSummary,
    getFailed,
    getChademo,
    getCCS,
    getType2,
    getType2Plug,
    getLocationInfo,
    getSessionInfo,
    getByRegion,
    getTimeSpendByRegion,
    getByConnector,
    getPercentInfo,
    getCountInfo,
    getLastDate,
    getRegionStat,
    getDestination,
    getRegionSess,
    getRegionStationCount,
    getByMode,
    getByModeCountry,
    getTimeSpend
}