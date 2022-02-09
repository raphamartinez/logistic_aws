const Purchase = require('../models/purchase')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')
const ejs = require('ejs')
const path = require('path')

module.exports = app => {

    app.get('/ordenesCompra', Middleware.authenticatedMiddleware, async (req, res, next) => {
        try {
            res.render('purchaseorders')
        } catch (err) {
            next(err)
        }
    })

    app.get('/despesasVehiculos', Middleware.authenticatedMiddleware, async (req, res, next) => {
        try {
            res.render('expense')
        } catch (err) {
            next(err)
        }
    })

    app.get('/ordenGestran', Middleware.authenticatedMiddleware, async (req, res, next) => {
        try {
            res.render('ordergestran')
        } catch (err) {
            next(err)
        }
    })

    app.get('/historialVehiculos', Middleware.authenticatedMiddleware, async (req, res, next) => {
        try {
            res.render('history')
        } catch (err) {
            next(err)
        }
    })

    app.post('/purchaseorders', async (req, res, next) => {
        try {
            const search = req.body;
            let { groups, amount } = await Purchase.list(search)

            let date = new Date()
            let dateReg = ` ${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

            const filePath = path.join(__dirname, "../", "../", "views/admin/reports/purchase.ejs")
            ejs.renderFile(
                filePath, { orders: groups, filter: search, dateReg, monto: amount }, (err, data) => {
                    if (err) return console.log(err);

                    return res.send(data)
                })

        } catch (err) {
            console.log(err);
            next(err)
        }
    })

    app.post('/order/gestran', async (req, res, next) => {
        try {
            const oc = req.body.purchaseorder;
            let { orders, amount, natures } = await Purchase.gestranOrder(oc)

            let order = orders[0];
            order.items = orders;

            let date = new Date()
            let dateReg = ` ${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

            const filePath = path.join(__dirname, "../", "../", "views/admin/reports/order.ejs")
            ejs.renderFile(
                filePath, { order, dateReg, amount, natures }, (err, data) => {
                    if (err) return console.log(err);

                    return res.send(data)
                })

        } catch (err) {
            console.log(err);
            next(err)
        }
    })

    app.get('/quotation', async (req, res, next) => {
        try {

            let cars = await Purchase.getCars()
            let products = await Purchase.getProducts()
            let providers = await Purchase.getProviders()
            let purchaseOrders = await Purchase.getPurchaseOrders()
            let quotationOrders = await Purchase.getQuotationOrders()

            res.json({
                cars,
                products,
                providers,
                purchaseOrders,
                quotationOrders
            })

        } catch (error) {
            console.log(err);
            next(err)
        }
    })

    app.post('/quotation', async (req, res, next) => {
        try {
            const search = req.body;

            let { result, sellers, natures } = await Purchase.quotation(search)

            switch (search.status) {
                case '1':
                    search.status = `Pendiente`
                    break;
                case '2':
                    search.status = `Pendiente OC`
                    break;
                case '3':
                    search.status = `Aprobado`
                    break;
                case '4':
                    search.status = `Desaprobado`
                    break;
            };


            let date = new Date()
            let dateReg = ` ${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

            const filePath = path.join(__dirname, "../", "../", "views/admin/reports/quotation.ejs")
            ejs.renderFile(
                filePath, {
                orders: result,
                filter: search,
                dateReg,
                sellers,
                natures
            }, (err, data) => {
                if (err) console.log(err);

                return res.send(data)
            })

        } catch (err) {
            console.log(err);
            next(err)
        }
    })

    app.post('/history', async (req, res, next) => {
        try {
            const search = req.body;

            let historys = await Purchase.history(search)

            let date = new Date()
            let dateReg = ` ${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

            const filePath = path.join(__dirname, "../", "../", "views/admin/reports/history.ejs")
            ejs.renderFile(
                filePath, {
                historys,
                filter: search,
                dateReg
            }, (err, data) => {
                if (err) console.log(err);

                return res.send(data)
            })
        } catch (err) {
            console.log(err);
            next(err)
        }
    })

    app.get('/purchase/category/:datestart/:dateend', async (req, res, next) => {
        try {
            let search = {
                datestart: req.params.datestart,
                dateend: req.params.dateend
            };

            let orders = await Purchase.getOrderCategory(search);

            res.json(orders)
        } catch (error) {
            console.log(err);
            next(err)
        }
    })

    app.get('/purchase/model/:datestart/:dateend/:search', async (req, res, next) => {
        try {
            let search = {
                datestart: req.params.datestart,
                dateend: req.params.dateend,
                category: req.params.search.replace('*', '/')
            };

            let { details, orders } = await Purchase.getOrderModel(search);

            res.json({details, orders})
        } catch (error) {
            console.log(err);
            next(err)
        }
    })

    app.get('/purchase/plate/:datestart/:dateend/:search', async (req, res, next) => {
        try {
            let search = {
                datestart: req.params.datestart,
                dateend: req.params.dateend,
                model: req.params.search.replace('*', '/')
            };

            let { details, orders } = await Purchase.getOrderPlate(search);

            res.json({details, orders})
        } catch (error) {
            console.log(err);
            next(err)
        }
    })
}