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
            GROUP BY car 
            HAVING idzona = ?
            ORDER BY date DESC`

            const result = await query(sql, place)
            return result
        } catch (error) {
            throw new InvalidArgumentError(error)
        }
    }

}

module.exports = new DriveUp()