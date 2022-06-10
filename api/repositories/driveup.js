const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class DriveUp {

    async insert(vehicleAlert) {
        try {
            const lat = vehicleAlert.geom.coordinates[1]
            const long = vehicleAlert.geom.coordinates[0]
            const sql = 'INSERT INTO driveup (idEvent, idVehicle, idEventType, idzona, odometer, recordedat, latitude, longitude, customer, car, namegroup, alert, message, successend, successendloc, datereg) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now() - interval 4 hour)'
            await query(sql, [vehicleAlert.idEvent, vehicleAlert.idVehicle, vehicleAlert.idEventType, vehicleAlert.idzona, vehicleAlert.odometer, vehicleAlert.recordedat, lat, long, vehicleAlert.customer, vehicleAlert.car.plate, vehicleAlert.group, vehicleAlert.alert, vehicleAlert.message, vehicleAlert.successend, vehicleAlert.successendloc])

            return true
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError(error)
        }
    }

    async insertLocation(car) {
        try {

            const sql = 'INSERT INTO driveuplocation set ?'
            const result = await query(sql, car)

            return result.insertId
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError(error)
        }
    }

    async updateLocation(id_travel, obs, id) {
        try {
            const sql = 'UPDATE driveuplocation set id_travel = ?, container = ? where id = ?'
            await query(sql, [id_travel, obs, id])

            return true
        } catch (error) {
            throw new InvalidArgumentError(error)
        }
    }

    async checkIntheLocation(plate) {
        try {
            const sql = `SELECT dr.recordedat, dr.plate, dr.code, dr.location, dr.isInside
            FROM api.driveuplocation dr
            WHERE dr.recordedat = (SELECT MAX(drr.recordedat) FROM api.driveuplocation drr WHERE drr.plate = dr.plate) and plate = ?`

            const result = await query(sql, plate)
            return result
        } catch (error) {
            throw new InvalidArgumentError(error)
        }
    }

    async countInthePlace(place) {
        try {
            const sql = `SELECT dr.recordedat as date, dr.plate, dr.isInside, dr.location, ca.cartype, ca.capacity, now() as now
            FROM api.driveuplocation dr
            LEFT JOIN api.car ca on dr.plate = ca.plate
            WHERE dr.recordedat = (SELECT MAX(drr.recordedat) FROM api.driveuplocation drr WHERE drr.plate = dr.plate)
            GROUP BY dr.plate 
            HAVING location LIKE ? and isInside = -1
            ORDER BY dr.recordedat ASC`

            const result = await query(sql, `%${place}%`)
            return result
        } catch (error) {
            throw new InvalidArgumentError(error)
        }
    }

    async countNotInthePlace() {
        try {
            const sql = `SELECT dr.recordedat as date, dr.plate, dr.isInside, dr.location, ca.cartype, ca.capacity
            FROM api.driveuplocation dr
            LEFT JOIN api.car ca on dr.plate = ca.plate
            WHERE dr.recordedat = (SELECT MAX(drr.recordedat) FROM api.driveuplocation drr WHERE drr.plate = dr.plate)
            GROUP BY dr.plate 
            HAVING isInside = 1
            ORDER BY dr.recordedat ASC`

            const result = await query(sql)
            return result
        } catch (error) {
            throw new InvalidArgumentError(error)
        }
    }

    async countInMaintenance(place) {
        try {
            let sql = `SELECT distinct(ca.plate) as plate, ca.thirst, ca.obs as description, ca.cartype, ca.capacity
            FROM api.car ca
            WHERE ca.status = 2 `

            if (place) sql += `and thirst = '${place}' `

            sql += `GROUP BY ca.plate 
            ORDER BY ca.plate ASC `

            const result = await query(sql)
            return result
        } catch (error) {
            throw new InvalidArgumentError(error)
        }
    }

    async historicContainer(msg) {
        try {
            let sql = `SELECT max(tr.id) as id, tr.type as typecode, tr.period, tr.obs, IF(tr.period = 1, "Mañana", "Noche") as perioddesc, DATE_FORMAT(tr.date, '%H:%i %d/%m/%Y') as datedesc, dr.id as id_driver,
            IF(dr.name is null, "", dr.name) as driverdesc, dr.idcard, tr.origin, tr.route, tr.delivery, us.name, tr.company_name, tr.company_idcard,
                    CASE
                        WHEN tr.type = 1 THEN "Viatico Nacional"
                        WHEN tr.type = 2 THEN "Retiro Contenedor"
                        WHEN tr.type = 3 THEN "Mantenimiento"
                        WHEN tr.type = 4 THEN "Region Metropolitana"
                        WHEN tr.type = 5 THEN "Retorno"
                        WHEN tr.type = 6 THEN "Transferencia"
                        WHEN tr.type = 7 THEN "Devolucion de Contenedor"
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
                        WHEN tr.route = 37 THEN "Cap. Bado"
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
                        WHEN tr.origin = 34 THEN "Canindeyu"
                        WHEN tr.origin = 35 THEN "Zona Franca km11"
                        WHEN tr.origin = 36 THEN "Hernandarias"
                        WHEN tr.origin = 37 THEN "Cap. Bado"
                        ELSE ""
						END as origindesc,
                        CASE
                        WHEN tr.delivery = 1 THEN "KM 1"
                        WHEN tr.delivery = 2 THEN "KM 28"
                        WHEN tr.delivery = 3 THEN "YPANÉ"
                        WHEN tr.delivery = 4 THEN "AC. KM 1"
                        WHEN tr.delivery = 5 THEN "LOG. HERRAMIENTAS"
                        WHEN tr.delivery = 5 THEN "LOG. HERRAMIENTAS"
                        WHEN tr.delivery = 6 THEN "LOG. VEHÍCULOS"
                        WHEN tr.delivery = 7 THEN "LOG. EQUIPOS"
                        WHEN tr.delivery = 8 THEN "P. Seguro"
                        WHEN tr.delivery = 9 THEN "P. Terport"
                        WHEN tr.delivery = 10 THEN "P. Fenix"
                        WHEN tr.delivery = 11 THEN "PJC"
                        WHEN tr.delivery = 12 THEN "Itapua"
                        WHEN tr.delivery = 13 THEN "Salto"
                        WHEN tr.delivery = 14 THEN "Pindoty"
                        WHEN tr.delivery = 15 THEN "Santa Rita"
                        WHEN tr.delivery = 16 THEN "Fernando de la Mora"
                        WHEN tr.delivery = 17 THEN "MRA"
                        WHEN tr.delivery = 18 THEN "San Lorenzo"
                        WHEN tr.delivery = 19 THEN "Ñemby"
                        WHEN tr.delivery = 20 THEN "Chacoi"
                        WHEN tr.delivery = 21 THEN "Sobre ruta 2"
                        WHEN tr.delivery = 22 THEN "Caaguazu"
                        WHEN tr.delivery = 23 THEN "Campo 9"
                        WHEN tr.delivery = 24 THEN "Campo 8"
                        WHEN tr.delivery = 25 THEN "Villarrica"
                        WHEN tr.delivery = 26 THEN "Chaco"
                        WHEN tr.delivery = 27 THEN "Villeta"
                        WHEN tr.delivery = 28 THEN "Eusebio Ayala"
                        WHEN tr.delivery = 29 THEN "CaacupeMi"
                        WHEN tr.delivery = 30 THEN "Pillar"
                        WHEN tr.delivery = 31 THEN "Villa Elisa"
                        WHEN tr.delivery = 32 THEN "Nasser"
                        WHEN tr.delivery = 33 THEN "Centrales Ypané"
                        WHEN tr.delivery = 34 THEN "Canindeyu"
                        WHEN tr.delivery = 35 THEN "Zona Franca km11"
                        WHEN tr.delivery = 36 THEN "Hernandarias"
                        WHEN tr.delivery = 37 THEN "Cap. Bado"
                        ELSE ""
                    END as deliverydesc
                        FROM api.travel tr
                        INNER JOIN api.driver dr ON dr.id = tr.id_driver
                        INNER JOIN api.user us ON tr.id_login = us.id_login 
                        where tr.obs = ?`

            const result = await query(sql, msg)
            return result
        } catch (error) {
            throw new InvalidArgumentError(error)
        }
    }

    async listLocations(id_travel) {
        try {
            const sql = `SELECT du.isInside, du.location, du.plateDesc, DATE_FORMAT(du.recordedat, '%H:%i %d/%m/%Y') as date,
                        CASE
                        WHEN du.isInside = 1 THEN "*Salída* del"
                        WHEN du.isInside = -1 THEN "*Llegada* al"
                        ELSE ""
                        END as isInsideDesc
                        FROM api.driveuplocation du
                        WHERE du.id_travel = ?
                        ORDER BY du.recordedat ASC`
            const result = await query(sql, [id_travel])
            return result
        } catch (error) {
            throw new InvalidArgumentError(error)
        }
    }


    async findTravel(plate) {
        try {
            const sql = `SELECT max(tr.id) as id, tr.type as typecode, tr.period, tr.obs as description, IF(tr.period = 1, "Mañana", "Noche") as perioddesc, DATE_FORMAT(tr.date, '%H:%i %d/%m/%Y') as datedesc, dr.id as id_driver,
            IF(dr.name is null, "", dr.name) as driverdesc, dr.idcard, tr.origin, tr.route, tr.delivery, us.name, tr.company_name, tr.company_idcard, ca.plate, ca.cartype, ca.model,
                    CASE
                        WHEN tr.type = 1 THEN "Viatico Nacional"
                        WHEN tr.type = 2 THEN "Retiro Contenedor"
                        WHEN tr.type = 3 THEN "Mantenimiento"
                        WHEN tr.type = 4 THEN "Region Metropolitana"
                        WHEN tr.type = 5 THEN "Retorno"
                        WHEN tr.type = 6 THEN "Transferencia"
                        WHEN tr.type = 7 THEN "Devolucion de Contenedor"
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
                        WHEN tr.route = 37 THEN "Cap. Bado"
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
                        WHEN tr.origin = 34 THEN "Canindeyu"
                        WHEN tr.origin = 35 THEN "Zona Franca km11"
                        WHEN tr.origin = 36 THEN "Hernandarias"
                        WHEN tr.origin = 37 THEN "Cap. Bado"
                        ELSE ""
						END as origindesc,
                        CASE
                        WHEN tr.delivery = 1 THEN "KM 1"
                        WHEN tr.delivery = 2 THEN "KM 28"
                        WHEN tr.delivery = 3 THEN "YPANÉ"
                        WHEN tr.delivery = 4 THEN "AC. KM 1"
                        WHEN tr.delivery = 5 THEN "LOG. HERRAMIENTAS"
                        WHEN tr.delivery = 5 THEN "LOG. HERRAMIENTAS"
                        WHEN tr.delivery = 6 THEN "LOG. VEHÍCULOS"
                        WHEN tr.delivery = 7 THEN "LOG. EQUIPOS"
                        WHEN tr.delivery = 8 THEN "P. Seguro"
                        WHEN tr.delivery = 9 THEN "P. Terport"
                        WHEN tr.delivery = 10 THEN "P. Fenix"
                        WHEN tr.delivery = 11 THEN "PJC"
                        WHEN tr.delivery = 12 THEN "Itapua"
                        WHEN tr.delivery = 13 THEN "Salto"
                        WHEN tr.delivery = 14 THEN "Pindoty"
                        WHEN tr.delivery = 15 THEN "Santa Rita"
                        WHEN tr.delivery = 16 THEN "Fernando de la Mora"
                        WHEN tr.delivery = 17 THEN "MRA"
                        WHEN tr.delivery = 18 THEN "San Lorenzo"
                        WHEN tr.delivery = 19 THEN "Ñemby"
                        WHEN tr.delivery = 20 THEN "Chacoi"
                        WHEN tr.delivery = 21 THEN "Sobre ruta 2"
                        WHEN tr.delivery = 22 THEN "Caaguazu"
                        WHEN tr.delivery = 23 THEN "Campo 9"
                        WHEN tr.delivery = 24 THEN "Campo 8"
                        WHEN tr.delivery = 25 THEN "Villarrica"
                        WHEN tr.delivery = 26 THEN "Chaco"
                        WHEN tr.delivery = 27 THEN "Villeta"
                        WHEN tr.delivery = 28 THEN "Eusebio Ayala"
                        WHEN tr.delivery = 29 THEN "CaacupeMi"
                        WHEN tr.delivery = 30 THEN "Pillar"
                        WHEN tr.delivery = 31 THEN "Villa Elisa"
                        WHEN tr.delivery = 32 THEN "Nasser"
                        WHEN tr.delivery = 33 THEN "Centrales Ypané"
                        WHEN tr.delivery = 34 THEN "Canindeyu"
                        WHEN tr.delivery = 35 THEN "Zona Franca km11"
                        WHEN tr.delivery = 36 THEN "Hernandarias"
                        WHEN tr.delivery = 37 THEN "Cap. Bado"
                        ELSE ""
                    END as deliverydesc
                        FROM api.travel tr
                        INNER JOIN api.driver dr ON dr.id = tr.id_driver
                        INNER JOIN api.user us ON tr.id_login = us.id_login 
                        INNER JOIN api.travelcar tc ON tr.id = tc.id_travel AND tc.id_car = (SELECT id FROM api.car WHERE plate = ?) 
						INNER JOIN api.car ca ON tc.id_car = ca.id 
                        where tr.id = (SELECT MAX(trr.id) FROM api.travel trr 
                        INNER JOIN api.travelcar tc ON trr.id = tc.id_travel AND tc.id_car = (SELECT id FROM api.car WHERE plate = ?) 
						INNER JOIN api.car ca ON tc.id_car = ca.id 
                        where ca.plate = ? and trr.date between (now() - interval 4 day) and now())`

            const result = await query(sql, [plate, plate, plate])
            return result[0]
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new DriveUp()