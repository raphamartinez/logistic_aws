const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Travel {

    async list(date, lastdate, period, id_login) {
        try {
            let sql = `SELECT tr.id, tr.type as typecode, tr.period, tr.obs, IF(tr.period = 1, "Mañana", "Noche") as perioddesc, DATE_FORMAT(tr.date, '%H:%i %d/%m/%Y') as datedesc, dr.id as id_driver,
            IF(dr.name is null, "", dr.name) as driverdesc, dr.idcard, tr.origin, tr.route, tr.delivery, us.name, tr.company_name, tr.company_idcard,
                    CASE
                        WHEN tr.type = 1 THEN "Viatico Nacional"
                        WHEN tr.type = 2 THEN "Retiro Contenedor"
                        WHEN tr.type = 3 THEN "Mantenimiento"
                        WHEN tr.type = 4 THEN "Region Metropolitana"
                        WHEN tr.type = 5 THEN "Retorno"
                        WHEN tr.type = 6 THEN "Transferencia"
                        WHEN tr.type = 7 THEN "Devolucion de Contenedor" 
                        WHEN tr.type = 8 THEN "Cubiertas para Reciclajes" 
                        WHEN tr.type = 9 THEN "Retiro de Contenedor del Patio" 
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
                        WHEN tr.route = 38 THEN "Villa Hayes"
                        WHEN tr.route = 39 THEN "Saltos/Pindoty"
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
                        WHEN tr.origin = 38 THEN "Villa Hayes"
                        WHEN tr.origin = 39 THEN "Saltos/Pindoty"
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
                        WHEN tr.delivery = 38 THEN "Villa Hayes"
                        WHEN tr.delivery = 39 THEN "Saltos/Pindoty"
                        ELSE ""
                    END as deliverydesc
                        FROM api.travel tr
                        INNER JOIN api.user us ON tr.id_login = us.id_login 
                        LEFT JOIN api.driver dr ON tr.id_driver = dr.id 
                        WHERE tr.date between ? and ? `

            if (period) sql += ` AND tr.period = '${period}'`

            if (id_login) sql += ` AND tr.id_login = ${id_login} `

            const data = await query(sql, [date, lastdate])
            return data
        } catch (error) {
            console.log(error);
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    listPeriodCar(firstdate, lastdate, period, places) {
        let sql = `SELECT ca.id as id_car, ca.plate, ca.brand, ca.model, ca.cartype, DATE_FORMAT(ca.year, '%Y') as year, ca.color, ca.obs, ca.capacity, ca.status as status_car FROM api.car ca
        LEFT JOIN api.travelcar tc ON ca.id = tc.id_car
        LEFT JOIN api.travel tr ON tc.id_travel = tr.id
        WHERE ca.id NOT IN (
        SELECT ca.id
        FROM api.car ca
        INNER JOIN api.travelcar tc ON ca.id = tc.id_car
        INNER JOIN api.travel tr ON tc.id_travel = tr.id
        WHERE tr.date between ? and ? AND tr.period = ?
        GROUP BY id
        ORDER BY id ) AND ca.status = 1 `

        if (places) sql += ` AND ca.thirst IN (${places}) `

        sql += ` GROUP BY ca.plate ORDER BY ca.plate `

        return query(sql, [firstdate, lastdate, period])
    }

    async listPlates(id) {
        try {
            const sql = `SELECT tc.id, tc.id_car, tc.type, ca.plate, ca.cartype, ca.brand, ca.model, ca.capacity, DATE_FORMAT(ca.year, '%Y') as year
            FROM api.travelcar tc
            INNER JOIN api.car ca ON tc.id_car = ca.id
            WHERE tc.id_travel = ?`

            return query(sql, id)

        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    async history(id) {
        try {
            const sql = `SELECT tc.id, tc.id_car, tc.type, ca.plate, ca.cartype, ca.brand, ca.model, ca.capacity, DATE_FORMAT(ca.year, '%Y') as year
            FROM api.travelcar tc
            INNER JOIN api.car ca ON tc.id_car = ca.id
            WHERE tc.id_travel = ?`

            return query(sql, id)

        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    async insert(car, id_login) {
        try {
            const sql = `INSERT INTO travel (date, period, origin, route, delivery, id_driver, company_name, company_idcard, id_login, type, obs, datereg)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now() - interval 4 hour  )`
            const result = await query(sql, [car.date, car.period, car.origin, car.route, car.delivery, car.driver, car.companydesc, car.companyidcard, id_login, car.type, car.obs])
            return result.insertId
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error')
        }
    }

    async update(travel, id) {
        try {
            const sql = `UPDATE travel set date = ?, period = ?, origin = ?, route = ?, delivery = ?, id_driver = ?, company_name = ?, company_idcard = ?, type = ?, obs = ? WHERE id = ?`
            const result = await query(sql, [travel.date, travel.period, travel.origin, travel.route, travel.delivery, travel.driver, travel.companydesc, travel.companyidcard, travel.type, travel.obs, id])
            return result.insertId
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error')
        }
    }

    async delete(id) {
        try {
            const sqlcar = `DELETE FROM api.travelcar WHERE id_travel = ?`

            await query(sqlcar, id)

            const sql = `DELETE FROM api.travel WHERE id = ?`

            return query(sql, id)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    deleteCars(id) {

        try {
            const sql = `DELETE FROM travelcar WHERE id_travel = ?`

            return query(sql, id)
        } catch (error) {
            throw new InternalServerError('No se pudieron agregar los datos')
        }
    }

    insertCar(car, id, type) {

        try {
            const sql = `INSERT INTO travelcar (id_car, id_travel, type)  VALUES (?, ?, ?)`

            return query(sql, [car, id, type])
        } catch (error) {
            throw new InternalServerError('No se pudieron agregar los datos')
        }
    }

    async view(id) {
        try {

            const sql = `SELECT tr.id, tr.type as typecode, tr.period, tr.obs, IF(tr.period = 1, "Mañana", "Noche") as perioddesc, DATE_FORMAT(tr.date, '%Y-%m-%dT%H:%i') as date, DATE_FORMAT(tr.date, '%H:%i %d/%m/%Y') as datedesc, dr.id as id_driver,
            IF(dr.name is null, "", dr.name) as driverdesc, dr.idcard, tr.origin, tr.route, tr.delivery, us.name, tr.company_name, tr.company_idcard,
                    CASE
                        WHEN tr.type = 1 THEN "Viatico Nacional"
                        WHEN tr.type = 2 THEN "Retiro Contenedor"
                        WHEN tr.type = 3 THEN "Mantenimiento"
                        WHEN tr.type = 4 THEN "Region Metropolitana"
                        WHEN tr.type = 5 THEN "Retorno"
                        WHEN tr.type = 6 THEN "Transferencia"
                        WHEN tr.type = 7 THEN "Devolucion de Contenedor"
                        WHEN tr.type = 8 THEN "Cubiertas para Reciclajes" 
                        WHEN tr.type = 9 THEN "Retiro de Contenedor del Patio" 
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
                        WHEN tr.route = 38 THEN "Villa Hayes"
                        WHEN tr.route = 39 THEN "Saltos/Pindoty"
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
                        WHEN tr.origin = 38 THEN "Villa Hayes"
                        WHEN tr.origin = 39 THEN "Saltos/Pindoty"
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
                        WHEN tr.delivery = 38 THEN "Villa Hayes"
                        WHEN tr.delivery = 39 THEN "Saltos/Pindoty"
                        ELSE ""
                        END as deliverydesc
                        FROM api.travel tr
                        INNER JOIN api.user us ON tr.id_login = us.id_login 
                        LEFT JOIN api.driver dr ON tr.id_driver = dr.id 
                        WHERE tr.id = ? `

            const data = await query(sql, id)

            return data[0]
        } catch (error) {
            throw new InternalServerError('No se pudieron listar los datos')
        }
    }

    async reportStrategic(day, dayEnd, driver, type) {
        try {

            let sql = `SELECT  CASE
            WHEN tr.type = 1 THEN "Viatico Nacional"
            WHEN tr.type = 2 THEN "Retiro Contenedor"
            WHEN tr.type = 3 THEN "Mantenimiento"
            WHEN tr.type = 4 THEN "Region Metropolitana"
            WHEN tr.type = 5 THEN "Retorno"
            WHEN tr.type = 6 THEN "Transferencia"
            WHEN tr.type = 7 THEN "Devolucion de Contenedor"
            WHEN tr.type = 8 THEN "Cubiertas para Reciclajes" 
            WHEN tr.type = 9 THEN "Retiro de Contenedor del Patio" 
            ELSE ""
        END as type, 
        CASE
            WHEN tr.type = 1 THEN "table-primary"
            WHEN tr.type = 2 THEN "table-secondary"
            WHEN tr.type = 3 THEN "table-success"
            WHEN tr.type = 4 THEN "table-warning"
            WHEN tr.type = 5 THEN "table-info"
            WHEN tr.type = 6 THEN "table-danger"
            WHEN tr.type = 7 THEN "table-light"
            ELSE ""
        END as typeClass, 
        count(id) as qty,
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
        WHEN tr.origin = 38 THEN "Villa Hayes"
        WHEN tr.origin = 39 THEN "Saltos/Pindoty"
        ELSE "-"
        END as origindesc,
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
            WHEN tr.route = 38 THEN "Villa Hayes"
            WHEN tr.route = 39 THEN "Saltos/Pindoty"
            ELSE "-"
        END as routedesc,
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
            WHEN tr.delivery = 38 THEN "Villa Hayes"
            WHEN tr.delivery = 39 THEN "Saltos/Pindoty"
            ELSE "-"
        END as deliverydesc
        FROM api.travel as tr `

            if (dayEnd) {
                sql += ` WHERE tr.date between '${day}' and '${dayEnd}' `
            } else {
                sql += ` WHERE DATE(tr.date) = DATE('${day}') `
            }

            if(driver) sql+= ` AND tr.id_driver = '${driver}'`
            if(type) sql+= ` AND tr.type = '${type}'`

            sql += ` GROUP BY type, routedesc, origindesc, deliverydesc
        ORDER BY type, routedesc, origindesc, deliverydesc ASC`

            return query(sql)

        } catch (error) {
            throw new InternalServerError('No se pudieron listar lo informe')
        }
    }
}

module.exports = new Travel()