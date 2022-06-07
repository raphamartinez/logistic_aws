const Repositorie = require('../repositories/driveup')
const RepositorieTravel = require('../repositories/travel')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

const listCars = [
    {
        code: 'XBRI106TRASCAN',
        plate: 'XBRI106',
        description: 'XBRI106 TRA SCAN'
    },
    {
        code: 'XBRI107TRASCAN',
        plate: 'XBRI107',
        description: 'XBRI107 TRA SCAN'
    },
    {
        code: 'BAT633CAMHYUN',
        plate: 'BAT633',
        description: 'BAT633 CAM HYUN'
    },
    {
        code: 'CEO412CAMFOTO',
        plate: 'CEO412',
        description: 'CEO412 CAM FOTO'
    },
    {
        code: 'CEV932CAMFUSO',
        plate: 'CEV932',
        description: 'CEV932 CAM FUSO'
    },
    {
        code: 'XBRI005TRASCAN',
        plate: 'XBRI005',
        description: 'XBRI005 TRA SCAN'
    },
    {
        code: 'XBRI007TRASCAN',
        plate: 'XBRI007',
        description: 'XBRI007 TRA SCAN'
    },
    {
        code: 'XBRI002TRASCAN',
        plate: 'XBRI002',
        description: 'XBRI002 TRA SCAN'
    },
    {
        code: 'CEO411CAMFOTO',
        plate: 'CEO411',
        description: 'CEO411 CAM FOTO'
    },
    {
        code: 'CAS702CAMHYUN',
        plate: 'CAS702',
        description: 'CAS702 CAM HYUN'
    },
    {
        code: 'CEU784CAMFUSO',
        plate: 'CEU784',
        description: 'CEU784 CAM FUSO'
    },
    {
        code: 'CEV912CAMFUSO',
        plate: 'CEV912',
        description: 'CEV912 CAM FUSO'
    },
    {
        code: 'BLA554CAMVOLK',
        plate: 'BLA554',
        description: 'BLA554 CAM VOLK'
    },
    {
        code: 'XBRI003TRASCAN',
        plate: 'XBRI003',
        description: 'XBRI003 TRA SCAN'
    },
    {
        code: 'CFP306TRAFAW',
        plate: 'CFP306',
        description: 'CFP306 TRA FAW'
    },
    {
        code: 'AYD885CAMVOLK',
        plate: 'AYD885',
        description: 'AYD885 CAM VOLK'
    },
    {
        code: 'AEA217CAMMERC',
        plate: 'AEA217',
        description: 'AEA217 CAM MERC'
    },
    {
        code: 'CEO407CAMFOTO',
        plate: 'CEO407',
        description: 'CEO407 CAM FOTO'
    },
    {
        code: 'CAB977AUTOKIA',
        plate: 'CAB977',
        description: 'CAB977 CAM KIA'
    },
    {
        code: 'CAS594CAMHYUN',
        plate: 'CAS594',
        description: 'CAS594 CAM HYUN'
    },
    {
        code: 'BFH923DOBLEVOLK',
        plate: 'BFH923',
        description: 'BFH923 DOBLE VOLK'
    },
    {
        code: 'CEV933TRAMERC',
        plate: 'CEV933',
        description: 'CEV933 TRA MERC'
    },
    {
        code: 'CFP304TRAFAW',
        plate: 'CFP304',
        description: 'CFP304 TRA FAW'
    },
    {
        code: 'CFC349TRAVOLK',
        plate: 'CFC349',
        description: 'CFC349 TRA VOLK'
    },
    {
        code: 'CFN459TRAFAW',
        plate: 'CFN459',
        description: 'CFN459 TRA FAW'
    },
    {
        code: 'CFP305TRAFAW',
        plate: 'CFP305',
        description: 'CFP305 TRA FAW'
    },
    {
        code: 'CFN458TRAFAW',
        plate: 'CFN458',
        description: 'CFN458 TRA FAW'
    },
    {
        code: 'XBRI006TRASCAN',
        plate: 'XBRI006',
        description: 'XBRI006 TRA SCAN'
    },
    {
        code: 'XBRI008TRASCAN',
        plate: 'XBRI008',
        description: 'XBRI008 TRA SCAN'
    },
    {
        code: 'XBRI010TRASCAN',
        plate: 'XBRI010',
        description: 'XBRI010 TRA SCAN'
    },
    {
        code: 'XBRI009TRASCAN',
        plate: 'XBRI009',
        description: 'XBRI009 TRA SCAN'
    },
    {
        code: 'XBRI011TRASCAN',
        plate: 'XBRI011',
        description: 'XBRI011 TRA SCAN'
    },
    {
        code: 'CCP584DOBLESCAN',
        plate: 'CCP584',
        description: 'CCP584 DOBLE SCAN'
    },
    {
        code: 'XBRI004TRASCAN',
        plate: 'XBRI004',
        description: 'XBRI004 TRA SCAN'
    },
    {
        code: 'XBRI001TRASCAN',
        plate: 'XBRI001',
        description: 'XBRI001 TRA SCAN'
    },
    {
        code: 'CAS025TRASCAN',
        plate: 'CAS025',
        description: 'CAS025 TRA SCAN'
    },
    {
        code: 'CEV934TRAMERC',
        plate: 'CEV934',
        description: 'CEV934 TRA MERC'
    },
    {
        code: 'CEU782CAMFUSO',
        plate: 'CEU782',
        description: 'CEU782 CAM FUSO'
    },
    {
        code: 'CFP302TRAFAW',
        plate: 'CFP302',
        description: 'CFP302 TRA FAW'
    },
    {
        code: 'CEV913CAMFUSO',
        plate: 'CEV913',
        description: 'CEV913 CAM FUSO'
    },
    {
        code: 'VW91501967',
        plate: 'VW91501967',
        description: 'VW 9150 - 1967'
    },
    {
        code: 'VW91501604',
        plate: 'VW91501604',
        description: 'VW 9150 - 1604'
    },
    {
        code: 'VW91505985',
        plate: 'VW91505985',
        description: 'VW 9150 - 5985'
    },
    {
        code: 'VW91505969',
        plate: 'VW91505969',
        description: 'VW 9150 - 5969'
    },
    {
        code: '05147027',
        plate: '05147027',
        description: 'XBRI011 TRA SCAN'
    }
]

class Availability {

    async list() {
        try {
            const customers = [
                {
                    place: 'KM 1',
                    name: 'KM1',
                },
                {
                    place: 'KM 28',
                    name: 'KM28',
                },
                {
                    place: 'YPANE',
                    name: 'YPANE',
                }
            ]

            let carsLocation = []
            let carsTravel = []
            const carsWithTravel = await Repositorie.countNotInthePlace()
            for(let car of carsWithTravel){
                let travel = await Repositorie.findTravel(car.plate)
                if (travel.id) {
                    let carsTravel = await RepositorieTravel.listPlates(travel.id)
                    travel.carsTravel = carsTravel
    
                    if (travel.carsTravel && travel.carsTravel.length == 2) {
                        travel.capacity = travel.carsTravel[1].capacity
                    } else {
                        travel.capacity = travel.carsTravel[0].capacity
                    }
                }
                car.travel = travel
                carsTravel.push(car)
            }

            for (let customer of customers) {
                const cars = await Repositorie.countInthePlace(customer.name)
                const carsMaintenance = await Repositorie.countInMaintenance(customer.place)
                const location = {
                    cars,
                    carsMaintenance,
                    name: customer.name
                }
                carsLocation.push(location)
            }

            return {carsLocation, listCars, carsTravel}
        } catch (error) {
            throw new InvalidArgumentError('No se pudo actualizar el sucursal.')
        }
    }

    transform(cars, carsMaintenance) {
        try {

            let groups = cars.reduce(function (r, car) {
                let carInMaintenance = carsMaintenance.find(maintenance => maintenance.plate === car.plate)
                let findCar = listCars.find(findCar => findCar.plate === car.plate)
                if (findCar) car.plate = findCar.description

                if (!carInMaintenance) {
                    r[`${car.cartype}`] = r[`${car.cartype}`] || []
                    r[`${car.cartype}`].push(car)
                    return r
                }
                r[`remove`] = r[`remove`] || []
                r[`remove`].push(car)
                return r
            }, Object.create({}))


            return groups
        } catch (error) {
            throw new InvalidArgumentError('No se pudo actualizar el sucursal.')
        }
    }
}

module.exports = new Availability