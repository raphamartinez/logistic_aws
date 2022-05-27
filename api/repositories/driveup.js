const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class DriveUp {

    async insert(vehicleAlert) {
        console.log(vehicleAlert);
        try {
            const lat = vehicleAlert.geom.coordinates[1]
            const long = vehicleAlert.geom.coordinates[0]
            const sql = 'INSERT INTO driveup (idEvent, idVehicle, idEventType, idzona, odometer, recordedat, latitude, longitude, customer, car, namegroup, alert, message, successend, successendloc, datereg) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now() - interval 4 hour)'
            await query(sql, [vehicleAlert.idEvent, vehicleAlert.idVehicle, vehicleAlert.idEventType, vehicleAlert.idzona, vehicleAlert.odometer, vehicleAlert.recordedat, lat, long, vehicleAlert.customer, vehicleAlert.car.plate, vehicleAlert.group, vehicleAlert.alert, vehicleAlert.message, vehicleAlert.successend, vehicleAlert.successendloc])
            return true
        } catch (error) {
            throw new InvalidArgumentError(error)
        }
    }

    async countInthePlace(place) {
        try {
            const sql = `SELECT distinct(car) as plate, idVehicle, idEventType, MAX(recordedat) as date, idzona
            FROM api.driveup 
            WHERE idEventType = 3 or idEventType = 4
            GROUP BY car 
            HAVING idzona = ?
            ORDER BY date DESC`

            const result = await query(sql, place)
            return result
        } catch (error) {
            throw new InvalidArgumentError(error)
        }
    }

    async countInMaintenance(place) {
        try {
            let sql = `SELECT distinct(plate) as plate, thirst, obs as description
            FROM api.car 
            WHERE status = 2 `

            if(place) sql+= `and thirst = '${place}' `

            sql+= `GROUP BY plate 
            ORDER BY plate ASC `

            const result = await query(sql)
            return result
        } catch (error) {
            throw new InvalidArgumentError(error)
        }
    }

    async findTravel(plate){
        try {
            const sql = `SELECT tr.id, tr.type as typecode, tr.period, tr.obs, IF(tr.period = 1, "Mañana", "Noche") as perioddesc, DATE_FORMAT(tr.date, '%H:%i %d/%m/%Y') as datedesc, dr.id as id_driver,
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
                        INNER JOIN api.user us ON tr.id_login = us.id_login 
                        LEFT JOIN api.driver dr ON tr.id_driver = dr.id 
                        LEFT JOIN api.travelcar tc ON tc.id_travel = tr.id AND tc.id_car = (SELECT id FROM api.car WHERE plate = 'XBRI007') 
                        ORDER BY tr.date DESC
                        LIMIT 1 `
        } catch (error) {
            
        }
    }
}

module.exports = new DriveUp()