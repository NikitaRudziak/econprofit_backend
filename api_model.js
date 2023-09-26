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
        pool.query("select * from econprofit.sessions, econprofit.stations where econprofit.sessions.friendlycode = econprofit.stations.friendlycode  and  econprofit.stations.locationid = $1", [id], (error, results) => {
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
        pool.query('select econprofit.locations.id, econprofit.locations.name, econprofit.locations.address, econprofit.locations.cp_2022, count(econprofit.stations.friendlycode) from econprofit.stations, econprofit.locations where econprofit.stations.locationid = econprofit.locations.id group by econprofit.locations.name,econprofit.locations.id', (error, results) => {
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
        pool.query("select econprofit.locations.company, count(econprofit.stations.friendlycode), sum(econprofit.locations.cp_2022) as cp, sum(kapzatr) as  kapzatr from econprofit.locations, econprofit.stations where econprofit.locations.id = econprofit.stations.locationid group by econprofit.locations.company order by econprofit.locations.company", (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getTotalZatr = () => {
    return new Promise(function(resolve, reject) {
        pool.query("select econprofit.locations.company, sum(kapzatr) as  kapzatr from econprofit.locations group by econprofit.locations.company order by econprofit.locations.company", (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getTotalMonth = (from, to) => {
    return new Promise(function(resolve, reject) {
        // const { from, to } = body
        // console.log(from)
        // console.log(to)
        pool.query("select econprofit.locations.company, sum(kwh) as totalkwhbyMonth, sum(totalcost) as totalcostbyMonth from econprofit.sessions, econprofit.stations, econprofit.locations where econprofit.stations.friendlycode = econprofit.sessions.friendlycode and econprofit.stations.locationid = econprofit.locations.id and chargingfrom >= $1 and chargingfrom < $2 GROUP BY econprofit.locations.company  order by econprofit.locations.company", [from, to], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}



// /////////////////////////////
const getCP = () => {
    return new Promise(function(resolve, reject) {
        pool.query("select econprofit.locations.company, sum(cp_2022) as cp from econprofit.locations group by econprofit.locations.company order by econprofit.locations.company", (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getRegMarkers = () => {
    return new Promise(function(resolve, reject) {
        pool.query("select * from econprofit.regmarkers", (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}


// /////////////////////
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

const getConstantByMonth = () => {
    return new Promise(function(resolve, reject) {
        pool.query('select * from econprofit.constants', (error, results) => {
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

const getAlpById = (id) => {
    return new Promise(function(resolve, reject) {
        pool.query(`select econprofit.locations.name, round(sum(econprofit.worktypes.minforwork + road) * 52.8 / 60, 2), count(econprofit.worktypes.minforwork)  from econprofit.tickets, econprofit.worktypes, econprofit.stations, econprofit.locations where econprofit.tickets.work = econprofit.worktypes.name and (econprofit.tickets.worktype = 'Заявка' or econprofit.tickets.worktype = 'Ремонт')and econprofit.stations.friendlycode = econprofit.tickets.friendlycode and econprofit.stations.locationid = econprofit.locations.id and dateend >= '2022-08-01' and dateend < '2022-09-01' and econprofit.locations.id = $1 group by econprofit.locations.name, econprofit.locations.road order by round`, [id], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getAlpTOById = (id) => {
    return new Promise(function(resolve, reject) {
        pool.query(`select econprofit.locations.name, count(econprofit.stations.friendlycode) * 1386 as price from econprofit.tickets, econprofit.stations, econprofit.locations where econprofit.tickets.worktype = 'ТО' and econprofit.stations.friendlycode = econprofit.tickets.friendlycode and econprofit.stations.locationid = econprofit.locations.id and dateend >= '2022-06-01' and dateend < '2022-07-01' and econprofit.locations.id = $1 group by econprofit.locations.name`, [id], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const pushNewDay = (body) => {
    console.log(body)
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

const addConstant = (body) => {
    const now = new Date();
    return new Promise(function(resolve, reject) {
        console.log('hello world')
        const {name,
            monthdate,
            sumkwh,
            kwhperday,
            sumcost,
            nds,
            costwnds,
            energy,
            bank,
            amort,
            techobsl,
            rent,
            insure,
            zp,
            prog,
            sviaz,
            askue,
            komandir,
            other, 
            plan,
            energykwh} = body
        pool.query('INSERT INTO econprofit.constants(name, monthdate, sumkwh, kwhperday, sumcost, nds, costwnds, energy,bank, amort, techobsl, rent, insure, zp, prog, sviaz, askue, komandir, other, plan,energykwh) VALUES ($1,$2, $3,$4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *', [name,
            monthdate,
            Number(sumkwh),
            Number(kwhperday),
                Number(sumcost),
                    Number(nds),
                        Number(costwnds),
                            Number(energy),
                                Number(bank),
                                    Number(amort),
                                        Number(techobsl),
                                            Number(rent),
                                                Number(insure),
                                                    Number(zp),
                                                        Number(prog),
                                                            Number(sviaz),
                                                                Number(askue),
                                                                    Number(komandir),
                                                                        Number(other),
                                                                            Number(plan),
                                                                                Number(energykwh)], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(`A new merchant has been added added: `)
        })
    })
  }

//   -------------------------------------

const getLocationForMark = () => {
    return new Promise(function(resolve, reject) {
        pool.query(`select econprofit.locations.id, econprofit.locations.name, latitude, longitude, sum(totalcost), kapzatr, count(econprofit.stations.id), sum(power) as power from econprofit.locations, econprofit.stations, econprofit.sessions
        where econprofit.locations.id = econprofit.stations.locationid and econprofit.sessions.friendlycode =  econprofit.stations.friendlycode and econprofit.sessions.chargingto >= '2023-01-01'
        group by econprofit.locations.id, econprofit.locations.name, kapzatr`, (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getLocationAbout = (id) => {
    console.log(id)
    return new Promise(function(resolve, reject) {
        pool.query(`Select name, address, region, company, sum(power), count(econprofit.stations.id), destination, nearplaces, latitude, longitude  
                        from econprofit.locations, econprofit.stations
                        where econprofit.locations.id = econprofit.stations.locationid and econprofit.locations.id =$1
                        group by name, address, region, company, destination, nearplaces, latitude, longitude `
                        , [id],  (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getStationAbout = (id) => {
    console.log(id)
    return new Promise(function(resolve, reject) {
        pool.query(`Select econprofit.guarantee.friendlycode, power, econprofit.guarantee.cumdate from econprofit.stations, econprofit.guarantee where econprofit.guarantee.friendlycode = econprofit.stations.friendlycode and econprofit.stations.locationid = $1`
                        , [id],  (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getLocationStat = (id) => {
    console.log(id)
    return new Promise(function(resolve, reject) {
        pool.query(`select sum(totalcost) as income, kapzatr, count(econprofit.sessions.id) as sessionCnt, 
        (select count(econprofit.sessions.id) from econprofit.sessions, econprofit.stations where econprofit.sessions.friendlycode = econprofit.stations.friendlycode and locationid = $1 and kwh < 0.5) as sessionFailCnt,
        avg(kwh) as avgKwh, avg(chargingto - chargingfrom) as avgTime, sum(kwh) as totalKwh from econprofit.sessions, econprofit.stations, econprofit.locations where econprofit.sessions.friendlycode = econprofit.stations.friendlycode 
        and econprofit.stations.locationid = econprofit.locations.id and chargingto >= '2023-01-01' and locationid = $1
        group by kapzatr`
                        , [id],  (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getLocationsFull = (id) => {
    console.log(id)
    let arr = JSON.parse(id)
    console.log(arr.region)
    console.log(arr.stationType)
    console.log(arr.company)
    console.log(arr.vendor)
    console.log(arr.locationType)
    console.log(arr.kwFrom)
    console.log(arr.kwTo)
    console.log(arr.stationNum)
    console.log(Number(arr.stationNum) > 0)
    // for(let key in id) {
    //     console.log(key + ":", id[key]);
    // }
    return new Promise(function(resolve, reject) {
        pool.query(`select distinct econprofit.locations.id,econprofit.locations.name, econprofit.locations.address, count(econprofit.stations.id)
                        from econprofit.locations,econprofit.stations 
                        where econprofit.stations.locationid = econprofit.locations.id 
                            and econprofit.locations.region = any($1) 
                            and econprofit.stations.stationmode = any($2) 
                            and econprofit.locations.company = any($3) 
                            and econprofit.stations.vendor = any($4)
                            and econprofit.locations.nearplaces = any($5)
                            and econprofit.stations.power >= $6
                            and econprofit.stations.power <= $7
                            ${Number(arr.stationNum) > 0 ? 'and econprofit.stations.friendlycode = $8' : 'and econprofit.stations.friendlycode = any(select friendlycode from econprofit.stations)'}
                            group by econprofit.locations.id, econprofit.locations.name, econprofit.locations.address order by econprofit.locations.name`
                            , arr.stationNum ? [arr.region, arr.stationType, arr.company, arr.vendor, arr.locationType, arr.kwFrom, arr.kwTo, arr.stationNum] : [arr.region, arr.stationType, arr.company, arr.vendor, arr.locationType, arr.kwFrom, arr.kwTo],  (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getIndicatorsByYear = () => {
    return new Promise(function(resolve, reject) {
        pool.query(`SELECT  to_char(date_trunc('year', chargingto), 'DD.MM.YYYY') as date, count(id) as sessionCount, sum(kwh) as sumenergy, (sum(kwh) / 365 ) as avgenergy,sum(totalcost) AS valueVat, sum(totalcost) / 120*20 AS nds
        FROM econprofit.sessions
        WHERE chargingto >= '2021-01-01'
          AND chargingto <= '2023-12-31'
        GROUP BY date_trunc('year', chargingto)`, (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getUsersCountByYear = () => {
    return new Promise(function(resolve, reject) {
        pool.query(`SELECT   to_char(date_trunc('year', chargingto), 'DD.MM.YYYY') as date, count(distinct email) as userCount
        FROM econprofit.sessions
        WHERE chargingto >= '2021-01-01'
          AND chargingto <= '2023-12-31'
        GROUP BY date_trunc('year', chargingto)`, (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getIndicatorsByYearId = (id) => {
    console.log(id)
    return new Promise(function(resolve, reject) {
        pool.query(`SELECT  to_char(date_trunc('year', chargingto), 'DD.MM.YYYY') as date, count(econprofit.sessions.id) as sessionCount, sum(kwh) as sumenergy, (sum(kwh) / 365 ) as avgenergy,sum(totalcost) AS valueVat, sum(totalcost) / 120*20 AS nds
        FROM econprofit.sessions,  econprofit.stations, econprofit.locations
        WHERE chargingto >= '2021-01-01'
          AND chargingto <= '2023-12-31' and econprofit.stations.locationid = econprofit.locations.id and econprofit.stations.friendlycode = econprofit.sessions.friendlycode and company = $1
        GROUP BY date_trunc('year', chargingto)`, [id], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getStationCountByYearId = (id) => {
    console.log(id)
    return new Promise(function(resolve, reject) {
        pool.query(`select to_char(date_trunc('year', cumdate), 'DD.MM.YYYY') as date, count(econprofit.stations.friendlycode)
        from econprofit.stations, econprofit.locations, econprofit.guarantee 
        where econprofit.stations.locationid = econprofit.locations.id and econprofit.stations.friendlycode = econprofit.guarantee.friendlycode and company = $1
        group by date_trunc('year', cumdate)
        order by date_trunc('year', cumdate) asc`, [id], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getStationCountByYear = () => {
    // console.log(id)
    return new Promise(function(resolve, reject) {
        pool.query(`select to_char(date_trunc('year', cumdate), 'DD.MM.YYYY') as date, count(econprofit.stations.friendlycode)
        from econprofit.stations, econprofit.locations, econprofit.guarantee 
        where econprofit.stations.locationid = econprofit.locations.id and econprofit.stations.friendlycode = econprofit.guarantee.friendlycode
        group by date_trunc('year', cumdate)
        order by date_trunc('year', cumdate) asc`, (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getMainIndicatorsList = (id) => {
    let arr = JSON.parse(id)
    console.log(arr)
    // let param = null;
    // if (id == "Выручка") {
    //     param = 'totalcost'
    // }
    // console.log(param)
    return new Promise(function(resolve, reject) {
        pool.query(`select econprofit.locations.id, econprofit.locations.name, econprofit.locations.address, sum(kwh) as sumkwh, sum(totalcost) as totalcost, count(econprofit.sessions.id) as sessioncount
        from econprofit.locations, econprofit.stations, econprofit.sessions 
        where econprofit.locations.id = econprofit.stations.locationid 
        and econprofit.stations.friendlycode = econprofit.sessions.friendlycode
        and chargingfrom >= $1 and  chargingto < $2
        group by econprofit.locations.id, econprofit.locations.name, econprofit.locations.address`, [arr.dateFrom, arr.dateTo], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
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
    getTimeSpend,
    getCP,
    getRegMarkers,
    addConstant,
    getConstantByMonth,
    getTotalMonth,
    getTotalZatr,
    getAlpById,
    getAlpTOById,
    // -----------------------------------
    getLocationsFull,
    getLocationAbout,
    getStationAbout,
    getLocationStat,
    getLocationForMark,
    getIndicatorsByYear,
    getMainIndicatorsList,
    getIndicatorsByYearId,
    getStationCountByYearId,
    getStationCountByYear,
    getUsersCountByYear
}