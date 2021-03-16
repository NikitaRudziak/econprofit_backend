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
      pool.query('SELECT * FROM econprofit.locations ORDER BY id ASC', (error, results) => {
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
    pool.query('select * from econprofit.sessions where econprofit.sessions.friendlycode = $1', [id], (error, results) => {
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
  getSessionInfo
}