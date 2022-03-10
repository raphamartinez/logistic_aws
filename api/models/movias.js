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

            // for (let car of cars) {
            //    // const id = await Repositorie.insert(car);

            //     let inputs = car.inputs.reduce(function (r, a) {
            //         r[a[`${search.group}`]] = r[a[`${search.group}`]] || [];
            //         r[a[`${search.group}`]].push(a);
            //         return r;
            //     }, Object.create({}));

            //     for (let input of inputs) {
            //         await Repositorie.insertAccessorie(input, 1, id);
            //     }

            //     for (let input of inputs) {
            //         await Repositorie.insertAccessorie(input, 1, id);
            //     }
            // }

            return cars
        } catch (error) {
            console.log(error);
        }
    }

    async Tracking(cars, id_token) {

        const startDh = new Date("03/07/22 00:00:00");
        const endDh = new Date("03/07/22 23:59:59");

        try {


            for (let car of cars) {
                console.log(car.licensePlate);

                const data = await fetch(`https://www.movias.com.br:8443/ws/v1/tracking?startDh=${startDh.toLocaleDateString('pt-BR')} 00:00:00&endDh=${endDh.toLocaleDateString('pt-BR')} 23:59:59&licensePlate=${car.licensePlate}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${id_token}`
                    }
                })

                const history = await data.json();
                console.log(history);
                for (let tracking of history) {
                    await Repositorie.insert(tracking);
                }
            }

            // startDh.setDate(startDh.getDate() + 2);
            // endDh.setDate(endDh.getDate() + 2);

            console.log("finish");
            return cars
        } catch (error) {
            console.log(error);
        }
    }
}


module.exports = new Movias