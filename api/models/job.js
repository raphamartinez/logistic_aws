const CronJob = require('cron').CronJob
const DriveUp = require('../models/driveup')

const jobAlert = new CronJob('1 * * * * *', async () => {
    try {
        console.log('Executed Job!');
        const vehicleAlerts = await DriveUp.vehicleAlerts()
        const cars = await DriveUp.cars()
        const alertTypes = await DriveUp.alertTypes()
        const customers = await DriveUp.customers()
        DriveUp.saveAlerts(vehicleAlerts, cars, alertTypes, customers)

    } catch (error) {
        console.log(`Error when consulting the alerts - ${error}`);
    }
});

module.exports = { jobAlert }