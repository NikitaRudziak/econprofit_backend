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
    pool.query('select sum(kWh) as sumkw, sum(totalcost) as sumtotal, count(friendlycode) as sessioncount from econprofit.sessions', (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

const getFailed = () => {
  return new Promise(function(resolve, reject) {
    pool.query('select count(friendlycode) as failedsessioncount from econprofit.sessions where kwh < 0.5', (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

const getChademo = () => {
  return new Promise(function(resolve, reject) {
    pool.query("select sum(kwh) as chademokwh, sum(totalcost) as chademototal, count(friendlycode) as sessioncount from econprofit.sessions where connector = 'Пистолет CHAdeMO'", (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

const getCCS = () => {
  return new Promise(function(resolve, reject) {
    pool.query("select sum(kwh) as ccskwh, sum(totalcost) as ccstotal, count(friendlycode) as sessioncount from econprofit.sessions where connector = 'Пистолет CCS'", (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

const getType2 = () => {
  return new Promise(function(resolve, reject) {
    pool.query("select sum(kwh) as type2kwh, sum(totalcost) as type2total, count(friendlycode) as sessioncount from econprofit.sessions where connector = 'Вилка Type 2'", (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

const getType2Plug = () => {
  return new Promise(function(resolve, reject) {
    pool.query("select sum(kwh) as type2plugkwh, sum(totalcost) as type2plugtotal, count(friendlycode) as sessioncount from econprofit.sessions where connector = 'Розетка Type 2'", (error, results) => {
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
    pool.query('select * from econprofit.sessions, econprofit.stations where econprofit.sessions.friendlycode = econprofit.stations.friendlycode and econprofit.stations.locationid = $1', [id], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

const getPercentInfo = () => {
  return new Promise(function(resolve, reject) {
    pool.query('select econprofit.locations.name, econprofit.locations.address, econprofit.locations.region, econprofit.locations.latitude, econprofit.locations.longitude,  sum(kwh) from econprofit.sessions, econprofit.stations, econprofit.locations where econprofit.sessions.friendlycode = econprofit.stations.friendlycode and econprofit.stations.locationid = econprofit.locations.id  group by econprofit.locations.name, econprofit.locations.address, econprofit.locations.latitude, econprofit.locations.longitude, econprofit.locations.region', (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

const getCountInfo = () => {
  return new Promise(function(resolve, reject) {
    pool.query('select econprofit.locations.id, econprofit.locations.name, count(econprofit.stations.friendlycode) from econprofit.stations, econprofit.locations where econprofit.stations.locationid = econprofit.locations.id group by econprofit.locations.name,econprofit.locations.id', (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}



const getByRegion = () => {
  return new Promise(function(resolve, reject) {
    pool.query('select econprofit.locations.company, sum(kwh) as sumkwh, sum(totalcost) as sumtotal, count(econprofit.sessions.id) from econprofit.sessions, econprofit.stations, econprofit.locations where econprofit.stations.friendlycode = econprofit.sessions.friendlycode and econprofit.stations.locationid = econprofit.locations.id GROUP BY econprofit.locations.company', (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

const getByConnector = () => {
  return new Promise(function(resolve, reject) {
    pool.query('select connector, sum(kwh) as sumkwh  from econprofit.sessions where kwh >= 0.5 group by connector', (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

const getLastDate = () => {
  return new Promise(function(resolve, reject) {
    pool.query('select chargingfrom from econprofit.sessions order by chargingfrom desc limit 1', (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

const pushNewDay = (body) => {
  return new Promise(function(resolve, reject) {
    // console.log(body)
    const { friendlyCode, chargingFrom, chargingTo, kWh, totalCost, email, connector} = body
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
  getByConnector,
  getPercentInfo,
  getCountInfo,
  getLastDate
}