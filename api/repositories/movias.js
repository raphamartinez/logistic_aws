const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Movias {

    async insert(tracking) {
        try {
            const sql = `INSERT INTO moviastracking (idVeiculo, licensePlate, dhTracking, latitude, longitude, altitude, locationRef, speed, battery, eventId, driverId, ppc, trip, odometer, rpm, tripDistance, tripFuel, tripTime, accumFuel, accumHours, fuelLevel1, fuelLevel2, oilLevel, isFuelType, isAlcoholPercent, isVin, isFuelEconomy, isFuelConsumption, isAmbientTemperature, isLowResTripFuel, isLowResAccumFuel, isHighResTripFuel, isHighResAccumFuel, 
                inp0, inp1, inp2, inp3, inp4, 
                in0, in1, in2, in3, in4, in5, in6, in7, in8, in9, in10, in11, in12, in13, in14, in15,
                out0, out1, out2, out3, out4, out5, out6, out7, out8, out9, out10, out11, out12, out13, out14, out15 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?)`

            const obj = await query(sql, [tracking.idVeiculo, tracking.licensePlate, tracking.dhTracking, tracking.latitude, tracking.longitude, tracking.altitude, tracking.locationRef, tracking.speed, tracking.battery, tracking.eventId, tracking.driverId, tracking.ppc, tracking.trip, tracking.telemetry.odometer, tracking.telemetry.rpm, tracking.telemetry.tripDistance, tracking.telemetry.tripFuel, tracking.telemetry.tripTime, tracking.telemetry.accumFuel, tracking.telemetry.accumHours, tracking.telemetry.fuelLevel1, tracking.telemetry.fuelLevel2, tracking.telemetry.oilLevel, tracking.telemetry.isFuelType, tracking.telemetry.isAlcoholPercent, tracking.telemetry.isVin, tracking.telemetry.isFuelEconomy, tracking.telemetry.isFuelConsumption, tracking.telemetry.isAmbientTemperature, tracking.telemetry.isLowResTripFuel, tracking.telemetry.isLowResAccumFuel, tracking.telemetry.isHighResTripFuel, tracking.telemetry.isHighResAccumFuel, 
                tracking.inp0, tracking.inp1, tracking.inp2, tracking.inp3, tracking.inp4, 
                tracking.in0, tracking.in1, tracking.in2, tracking.in3, tracking.in4, tracking.in5, tracking.in6, tracking.in7, tracking.in8, tracking.in9, tracking.in10, tracking.in11, tracking.in12, tracking.in13, tracking.in14, tracking.in15,
                tracking.out0, tracking.out1, tracking.out2, tracking.out3, tracking.out4, tracking.out5, tracking.out6, tracking.out7, tracking.out8, tracking.out9, tracking.out10, tracking.out11, tracking.out12, tracking.out13, tracking.out14, tracking.out15])
            return obj.insertId
        } catch (error) {
            console.log(error);
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    async insertCar(car) {
        try {
            const sql = `INSERT INTO moviascar (idVehicle, licensePlate)  VALUES (?, ?)`

            const obj = await query(sql, [car.idVehicle, car.licensePlate])
            return obj.insertId
        } catch (error) {
            console.log(error);
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    async insertAccessorie(accessorie, type, id) {
        try {
            const sql = `INSERT INTO moviascaraccessories (description, type, id_moviascar)  VALUES (?, ?, ?) `

            const obj = await query(sql, [accessorie, type, id])
            return obj.insertId
        } catch (error) {
            console.log(error);
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }



}

module.exports = new Movias()