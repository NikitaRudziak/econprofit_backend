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
  

module.exports = {
  getLocations,
  getStations
}