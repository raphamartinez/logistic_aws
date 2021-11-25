const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Travel {

    async list(date, lastdate, period) {

        try {
            let sql = `SELECT tr.id, tr.type as typecode, tr.period, tr.obs, IF(tr.period = 1, "Mañana", "Noche") as perioddesc, DATE_FORMAT(tr.date, '%H:%i %d/%m/%Y') as datedesc, dr.id as id_driver,
            IF(dr.name is null, "", dr.name) as driverdesc, tr.origin, tr.route,
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
                        WHEN tr.route = 22 THEN "Caaguazu"
                        WHEN tr.route = 23 THEN "Campo 9"
                        WHEN tr.route = 24 THEN "Campo 8"
                        WHEN tr.route = 25 THEN "Villarrica"
                        WHEN tr.route = 26 THEN "Chaco"
                        WHEN tr.route = 27 THEN "Villeta"
                        WHEN tr.route = 28 THEN "Eusebio Ayala"
                        WHEN tr.route = 29 THEN "CaacupeMi"
                        WHEN tr.route = 30 THEN "Pillar"
                        WHEN tr.route = 31 THEN "Villa Elisa"
                        WHEN tr.route = 32 THEN "Nasser"
                        WHEN tr.route = 33 THEN "Centrales Ypané"
                        WHEN tr.route = 34 THEN "Canindeyu"
                        WHEN tr.route = 35 THEN "Zona Franca km11"
                        WHEN tr.route = 36 THEN "Hernandarias"
                        ELSE ""
                    END as routedesc,
                        CASE
                        WHEN tr.origin = 1 THEN "KM 1"
                        WHEN tr.origin = 2 THEN "KM 28"
                        WHEN tr.origin = 3 THEN "YPANÉ"
                        WHEN tr.origin = 4 THEN "AC. KM 1"
                        WHEN tr.origin = 5 THEN "LOG. HERRAMIENTAS"
                        WHEN tr.origin = 5 THEN "LOG. HERRAMIENTAS"
                        WHEN tr.origin = 6 THEN "LOG. VEHÍCULOS"
                        WHEN tr.origin = 7 THEN "LOG. EQUIPOS"
                        WHEN tr.origin = 8 THEN "P. Seguro"
                        WHEN tr.origin = 9 THEN "P. Terport"
                        WHEN tr.origin = 10 THEN "P. Fenix"
                        WHEN tr.origin = 11 THEN "PJC"
                        WHEN tr.origin = 12 THEN "Itapua"
                        WHEN tr.origin = 13 THEN "Salto"
                        WHEN tr.origin = 14 THEN "Pindoty"
                        WHEN tr.origin = 15 THEN "Santa Rita"
                        WHEN tr.origin = 16 THEN "Fernando de la Mora"
                        WHEN tr.origin = 17 THEN "MRA"
                        WHEN tr.origin = 18 THEN "San Lorenzo"
                        WHEN tr.origin = 19 THEN "Ñemby"
                        WHEN tr.origin = 20 THEN "Chacoi"
                        WHEN tr.origin = 21 THEN "Sobre ruta 2"
                        WHEN tr.origin = 22 THEN "Caaguacu"
                        WHEN tr.origin = 23 THEN "Campo 9"
                        WHEN tr.origin = 24 THEN "Campo 8"
                        WHEN tr.origin = 25 THEN "Villa Rica"
                        WHEN tr.origin = 26 THEN "Chaco"
                        WHEN tr.origin = 27 THEN "Villeta"
                        WHEN tr.origin = 28 THEN "Eusebio Ayala"
                        WHEN tr.origin = 29 THEN "CaacupeMi"
                        WHEN tr.origin = 30 THEN "Pillar"
                        WHEN tr.origin = 31 THEN "Villalisa"
                        WHEN tr.origin = 32 THEN "Nasser"
                        WHEN tr.origin = 33 THEN "Centrales Ypané"
                        WHEN tr.route = 34 THEN "Canindeyu"
                        WHEN tr.route = 35 THEN "Zona Franca km11"
                        WHEN tr.route = 36 THEN "Hernandarias"
                        ELSE ""
						END as origindesc
                        FROM api.travel tr
                        LEFT JOIN api.driver dr ON tr.id_driver = dr.id 
                        WHERE tr.date between ? and ? `

            if (period) sql += `AND tr.period = '${period}'`

            const data = await query(sql, [date, lastdate])
            return data
        } catch (error) {
            console.log(error);
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    listPeriodCar(date, period) {
        let sql = `SELECT ca.id as id_car, ca.plate, ca.brand, ca.model, ca.cartype, DATE_FORMAT(ca.year, '%Y') as year, ca.color, ca.obs, ca.capacity, ca.status as status_car FROM api.car ca
        LEFT JOIN api.travelcar tc ON ca.id = tc.id_car
        LEFT JOIN api.travel tr ON tc.id_travel = tr.id
        WHERE ca.id NOT IN (
        SELECT ca.id
        FROM api.car ca
        INNER JOIN api.travelcar tc ON ca.id = tc.id_car
        INNER JOIN api.travel tr ON tc.id_travel = tr.id
        WHERE tr.date = ? AND tr.period = ?
        GROUP BY id
        ORDER BY id
        ) AND ca.status = 1
        GROUP BY ca.plate
        ORDER BY ca.plate`

        return query(sql, [date, period])
    }

    async listPlates(id) {
        try {
            const sql = `SELECT tc.id, tc.id_car, tc.type, ca.plate, ca.cartype, ca.brand, ca.model, ca.capacity, DATE_FORMAT(ca.year, '%Y') as year
            FROM api.travelcar tc
            INNER JOIN api.car ca ON tc.id_car = ca.id
            WHERE tc.id_travel = ?`

            return query(sql, id)

        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    async history(id) {
        try {
            const sql = `SELECT tc.id, tc.id_car, tc.type, ca.plate, ca.cartype, ca.brand, ca.model, ca.capacity, DATE_FORMAT(ca.year, '%Y') as year
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
            const sql = `INSERT INTO travel (date, period, origin, route, id_driver, id_login, type, obs, datereg)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, now() - interval 4 hour  )`

            await query(sql, [car.date, car.period, car.origin, car.route, car.driver, id_login, car.type, car.obs])

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
            throw new InternalServerError('No se pudieron agregar los datos')
        }
    }

    async view(id_travel){
        try {
            const sql = `SELECT tr.id, tr.type as typecode, tr.period, tr.obs, IF(tr.period = 1, "Mañana", "Noche") as perioddesc, DATE_FORMAT(tr.date, '%H:%i %d/%m/%Y') as datedesc, dr.id as id_driver,
            IF(dr.name is null, "", dr.name) as driverdesc, dr.idcard, tr.origin, tr.route,
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
                        WHEN tr.route = 22 THEN "Caaguazu"
                        WHEN tr.route = 23 THEN "Campo 9"
                        WHEN tr.route = 24 THEN "Campo 8"
                        WHEN tr.route = 25 THEN "Villarrica"
                        WHEN tr.route = 26 THEN "Chaco"
                        WHEN tr.route = 27 THEN "Villeta"
                        WHEN tr.route = 28 THEN "Eusebio Ayala"
                        WHEN tr.route = 29 THEN "CaacupeMi"
                        WHEN tr.route = 30 THEN "Pillar"
                        WHEN tr.route = 31 THEN "Villa Elisa"
                        WHEN tr.route = 32 THEN "Nasser"
                        WHEN tr.route = 33 THEN "Centrales Ypané"
                        WHEN tr.route = 34 THEN "Canindeyu"
                        WHEN tr.route = 35 THEN "Zona Franca km11"
                        WHEN tr.route = 36 THEN "Hernandarias"
                        ELSE ""
                    END as routedesc,
                        CASE
                        WHEN tr.origin = 1 THEN "KM 1"
                        WHEN tr.origin = 2 THEN "KM 28"
                        WHEN tr.origin = 3 THEN "YPANÉ"
                        WHEN tr.origin = 4 THEN "AC. KM 1"
                        WHEN tr.origin = 5 THEN "LOG. HERRAMIENTAS"
                        WHEN tr.origin = 5 THEN "LOG. HERRAMIENTAS"
                        WHEN tr.origin = 6 THEN "LOG. VEHÍCULOS"
                        WHEN tr.origin = 7 THEN "LOG. EQUIPOS"
                        WHEN tr.origin = 8 THEN "P. Seguro"
                        WHEN tr.origin = 9 THEN "P. Terport"
                        WHEN tr.origin = 10 THEN "P. Fenix"
                        WHEN tr.origin = 11 THEN "PJC"
                        WHEN tr.origin = 12 THEN "Itapua"
                        WHEN tr.origin = 13 THEN "Salto"
                        WHEN tr.origin = 14 THEN "Pindoty"
                        WHEN tr.origin = 15 THEN "Santa Rita"
                        WHEN tr.origin = 16 THEN "Fernando de la Mora"
                        WHEN tr.origin = 17 THEN "MRA"
                        WHEN tr.origin = 18 THEN "San Lorenzo"
                        WHEN tr.origin = 19 THEN "Ñemby"
                        WHEN tr.origin = 20 THEN "Chacoi"
                        WHEN tr.origin = 21 THEN "Sobre ruta 2"
                        WHEN tr.origin = 22 THEN "Caaguacu"
                        WHEN tr.origin = 23 THEN "Campo 9"
                        WHEN tr.origin = 24 THEN "Campo 8"
                        WHEN tr.origin = 25 THEN "Villa Rica"
                        WHEN tr.origin = 26 THEN "Chaco"
                        WHEN tr.origin = 27 THEN "Villeta"
                        WHEN tr.origin = 28 THEN "Eusebio Ayala"
                        WHEN tr.origin = 29 THEN "CaacupeMi"
                        WHEN tr.origin = 30 THEN "Pillar"
                        WHEN tr.origin = 31 THEN "Villalisa"
                        WHEN tr.origin = 32 THEN "Nasser"
                        WHEN tr.origin = 33 THEN "Centrales Ypané"
                        WHEN tr.route = 34 THEN "Canindeyu"
                        WHEN tr.route = 35 THEN "Zona Franca km11"
                        WHEN tr.route = 36 THEN "Hernandarias"
                        ELSE ""
						END as origindesc
                        FROM api.travel tr
                        LEFT JOIN api.driver dr ON tr.id_driver = dr.id 
                        WHERE tr.id = ? `

            const data = await query(sql, id_travel)

            return data[0]
        } catch (error) {
            throw new InternalServerError('No se pudieron listar los datos')
        }
    }
}

module.exports = new Travel()