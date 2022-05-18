const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')
const Twilio = require('./twilio')
const fetch = require('node-fetch')

class DriveUp {

    async vehicleAlerts() {

        const endDate = new Date()
        const startDate = new Date(endDate.getTime() + (-1 * 60000))
        const month = endDate.getMonth() + 1 > 9 ? endDate.getMonth() + 1 : `0${endDate.getMonth() + 1}`
        const minutes = startDate.getMinutes() > 9 ? startDate.getMinutes() : `0${startDate.getMinutes()}`
        const hours = startDate.getHours() > 9 ? startDate.getHours() : `0${startDate.getHours()}`

        const data = await fetch(`https://api.driveup.info/rest/vehicle/alerts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-driveup-token': process.env.DRIVEUP_TOKEN
            },
            body: JSON.stringify({
                'from': `${startDate.getFullYear()}-${month}-${startDate.getDate()}T${hours}:${minutes}:00Z`,
                'to': `${startDate.getFullYear()}-${month}-${startDate.getDate()}T${hours}:${minutes}:59Z`
            })
        })

        const vehicleAlerts = await data.json();
        return vehicleAlerts
    }

    async cars() {

        const data = await fetch(`https://api.driveup.info/vehicles`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-driveup-token': process.env.DRIVEUP_TOKEN
            }
        })

        const cars = await data.json();
        return cars
    }

    async customers() {

        const data = await fetch(`https://api.driveup.info/rest/geofence/geofence`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-driveup-token': process.env.DRIVEUP_TOKEN
            }
        })

        const customers = await data.json();
        return customers
    }

    async alertTypes() {

        const data = await fetch(`https://api.driveup.info/rest/alert/types`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-driveup-token': process.env.DRIVEUP_TOKEN
            }
        })

        const alerts = await data.json();
        return alerts
    }

    async saveAlerts(vehicleAlerts, cars, alerts, customers) {
        for (let vehicleAlert of vehicleAlerts) {
            let customer = vehicleAlert.data ? customers.find(customer => customer.id === vehicleAlert.data.idzona) : ''
            let car = cars.find(car => car.vehicleId === vehicleAlert.idVehicle)
            vehicleAlert.customer = customer.name
            vehicleAlert.car = {
                plate: car.plate,
                model: car.modelDescription,
                category: car.kind
            }

            let alertType = ''
            let group = ''
            console.log(vehicleAlert.customer);
            alerts.find(alert => {
                alert.types.forEach(type => {
                    if (type.ideventtype === vehicleAlert.idEventType) {
                        const idgroup = alert.ideventtypegroup
                        if (idgroup === 9 || idgroup === 10 || idgroup === 12) {
                            group = 'Manutenção' 
                            alertType = type.description
                        }

                        if (idgroup === 3 || idgroup === 4 || idgroup === 5 || idgroup === 11) {
                            group = 'Operação'
                            alertType = type.description
                        }
                        
                        if (idgroup === 2) {
                            group = 'Cliente'
                            switch (type.ideventtype) {
                                case 3:
                                    alertType = `Llegada al ${vehicleAlert.customer}`
                                    break
                                case 4:
                                    alertType = `Salída del ${vehicleAlert.customer}`
                                    break
                            }
                        }
                    }
                })
            })
            vehicleAlert.alert = alertType

            if (vehicleAlert.geom.coordinates.length === 2) {
                const date = new Date(vehicleAlert.recordedat)
                date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000 + (-1) * 60 * 60 * 1000);

                let message = `*${vehicleAlert.alert}*\n${vehicleAlert.car.plate} - ${vehicleAlert.car.category}\nSin informacion del Chofer\n`
                message += `${date.toLocaleTimeString('pt-BR')} ${date.toLocaleDateString('pt-BR')}\n`

                const resultMsg = await fetch(`http://localhost:5000/group/sendmessage/${group}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'message': message
                    })
                })


                if (resultMsg) {
                    const data = await fetch(`http://localhost:5000/group/sendlocation/${group}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            'latitude': vehicleAlert.geom.coordinates[1],
                            'longitude': vehicleAlert.geom.coordinates[0],
                            'description': vehicleAlert.alert
                        })
                    })
                    console.log(data);
                }
            }
        }
    }

    async stream() {

        const stream = await fetch(`https://api.driveup.info/stream`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-driveup-token': process.env.DRIVEUP_TOKEN
            }
        })
    }

}

module.exports = new DriveUp