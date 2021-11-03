const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Travel {

    async list(date, period) {
        try {
            let sql = `SELECT tr.id, tr.period, tr.obs, IF(tr.period = 1, "Mañana", "Noche") as perioddesc, DATE_FORMAT(tr.date, '%d/%m/%Y') as datedesc, dr.id as id_driver,
            IF(dr.name is null, "", dr.name) as driverdesc,
                    CASE
                        WHEN tr.type = 1 THEN "Viatico Nacional"
                        WHEN tr.type = 2 THEN "Retiro Contenedor"
                        WHEN tr.type = 3 THEN "Mantenimiento"
                        ELSE ""
                    END as type,
                    CASE
                        WHEN tr.route = 1 THEN "KM 1"
                        WHEN tr.route = 2 THEN "KM 28"
                        WHEN tr.route = 3 THEN "YPANÉ"
                        WHEN tr.route = 4 THEN "AC. KM 1"
                        WHEN tr.route = 5 THEN "LOG. HERRAMIENTAS"
                        WHEN tr.route = 5 THEN "LOG. HERRAMIENTAS"
                        WHEN tr.route = 6 THEN "LOG. VEHÍCULOS"
                        WHEN tr.route = 7 THEN "LOG. EQUIPOS"
                        WHEN tr.route = 8 THEN "P. Seguro"
                        WHEN tr.route = 9 THEN "P. Terport"
                        WHEN tr.route = 10 THEN "P. Fenix"
                        WHEN tr.route = 11 THEN "PJC"
                        WHEN tr.route = 12 THEN "Itapua"
                        WHEN tr.route = 13 THEN "Salto"
                        WHEN tr.route = 14 THEN "Pindoty"
                        WHEN tr.route = 15 THEN "Santa Rita"
                        WHEN tr.route = 16 THEN "Fernando de la Mora"
                        WHEN tr.route = 17 THEN "MRA"
                        WHEN tr.route = 18 THEN "San Lorenzo"
                        WHEN tr.route = 19 THEN "Ñemby"
                        WHEN tr.route = 20 THEN "Chacoi"
                        WHEN tr.route = 21 THEN "Sobre ruta 2"
                        WHEN tr.route = 22 THEN "Caaguacu"
                        WHEN tr.route = 23 THEN "Campo 9"
                        WHEN tr.route = 24 THEN "Campo 8"
                        WHEN tr.route = 25 THEN "Villa Rica"
                        WHEN tr.route = 26 THEN "Chaco"
                        WHEN tr.route = 27 THEN "Villeta"
                        WHEN tr.route = 28 THEN "Eusebio Ayala"
                        WHEN tr.route = 29 THEN "CaacupeMi"
                        WHEN tr.route = 30 THEN "Pillar"
                        ELSE ""
                    END as routedesc
                        FROM api.travel tr
                        LEFT JOIN api.driver dr ON tr.id_driver = dr.id 
                        WHERE tr.date = ? `

            if(period) sql += `AND tr.period = '${period}'`

            const data = await query(sql, date)
            return data
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    async listPlates (id) {
        try {
            const sql = `SELECT tc.id, tc.id_car, tc.type, ca.plate, ca.cartype, ca.brand, ca.model, DATE_FORMAT(ca.year, '%Y') as year
            FROM api.travelcar tc
            INNER JOIN api.car ca ON tc.id_car = ca.id
            WHERE tc.id_travel = ?`

            return query(sql, id)

        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

   async insert(car, id_login) {
        try {
            const sql = `INSERT INTO travel (date, period, route, id_driver, id_login, type, obs, datereg)  VALUES (?, ?, ?, ?, ?, ?, ?, now() - interval 4 hour  )`

            await query(sql, [car.date, car.period, car.route, car.driver, id_login, car.type, car.obs])

            const sqlId = 'select LAST_INSERT_ID() as id from api.travel LIMIT 1'
            const obj = await query(sqlId)
            return obj[0].id
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error')
        }
    }

    async delete(id) {
        try {
            const sqlcar = `DELETE FROM api.travelcar WHERE id_travel = ?`

            await query(sqlcar, id)

            const sql = `DELETE FROM api.travel WHERE id = ?`

            return query(sql, id)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    insertCar(car, id, type) {

        try {
            const sql = `INSERT INTO travelcar (id_car, id_travel, type)  VALUES (?, ?, ?)`

            return query(sql, [car, id, type])
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

}

module.exports = new Travel()