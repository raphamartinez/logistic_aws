const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Movias {

    async insert(tracking) {
        try {
            const sql = `INSERT INTO moviastracking (idVeiculo, licensePlate, totalKmPLitro, totalLitroPhora, totalKmPPorcente, totalPorcentePhora, startDate, endDate,
                odometerEnd, maxSpeedOverallValue, maxRpmValue, distanceTraveled, timingsIdleTime, timeReport, odometerStart, 
                timingsOnTime, timingsTripTime, timingsOffTime, timingsOverSpeed, maxFuelEconomyValue, averagesSpeed,
                averagesRpm, timeTotalViagemSeg ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

            const obj = await query(sql, [tracking.idVeiculo, tracking.licensePlate, tracking.totalKmPLitro, tracking.totalLitroPhora, tracking.totalKmPPorcente, tracking.totalPorcentePhora, tracking.startDate, tracking.endDate,
                tracking.odometerEnd, tracking.maxSpeedOverallValue, tracking.maxRpmValue, tracking.distanceTraveled, tracking.timingsIdleTime, tracking.timeReport, tracking.odometerStart,
                tracking.timingsOnTime, tracking.timingsTripTime, tracking.timingsOffTime, tracking.timingsOverSpeed, tracking.maxFuelEconomyValue, tracking.averagesSpeed, 
                tracking.averagesRpm, tracking.timeTotalViagemSeg]);

            return obj.insertId;
        } catch (error) {
            console.log(error);
            throw new InternalServerError('No se pudieron enumerar los login');
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