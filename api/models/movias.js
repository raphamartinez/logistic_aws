const fetch = require('node-fetch');
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')
const Repositorie = require('../repositories/movias')


class Movias {


    async Login() {

        try {

            const data = await fetch(`https://www.movias.com.br:8443/ws/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: process.env.MOVIAS_USER,
                    password: process.env.MOVIAS_PASS
                })
            })

            const responses = await data.json();

            console.log(responses.id_token);

            return responses.id_token
        } catch (error) {
            console.log(error);
        }
    }


    async Cars(id_token) {

        try {

            const data = await fetch(`https://www.movias.com.br:8443/ws/v1/vehicle`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${id_token}`
                }
            })

            const cars = await data.json();

            return cars
        } catch (error) {
            console.log(error);
        }
    }

    async Tracking(cars, id_token) {

        const startDh = new Date("01/01/22 00:00:00");
        const endDh = new Date("01/01/22 23:59:59");

        const now = new Date("03/29/22 23:59:59");

        try {

            while (endDh.getTime() <= now.getTime()) {
                for (let car of cars) {
                    console.log(car.licensePlate);

                    const data = await fetch(`https://www.movias.com.br:8443/ws/v1/telemetry/day?startDh=${startDh.toLocaleDateString('pt-BR')} 00:00:00&endDh=${endDh.toLocaleDateString('pt-BR')} 23:59:59&licensePlate=${car.licensePlate}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${id_token}`
                        }
                    })

                    const history = await data.json();

                    for (let obj of history) {
                        let tracking = obj.telemetry[0];

                        tracking.licensePlate = obj.licensePlate;
                        tracking.idVeiculo = obj.idVeiculo;

                        const stDate = tracking.startDate.split("/")
                        const startDate = new Date(`${stDate[1]}-${stDate[0]}-${stDate[2]}`)
                        tracking.startDate = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()} ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}`

                        const enDate = tracking.endDate.split("/")
                        const endDate = new Date(`${enDate[1]}-${enDate[0]}-${enDate[2]}`)
                        console.log(endDate);
                        tracking.endDate = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()} ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}`

                        console.log(tracking);

                        await Repositorie.insert(tracking);
                    }

                }

                startDh.setDate(startDh.getDate() + 1);
                endDh.setDate(endDh.getDate() + 1);
            }

            console.log("finish");
            return cars
        } catch (error) {
            console.log(error);
        }
    }
}


module.exports = new Movias