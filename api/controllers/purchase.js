const Purchase = require('../models/purchase')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')
const ejs = require('ejs')
const path = require('path')

module.exports = app => {

    app.post('/purchaseorders', async (req, res, next) => {
        try {
            const search = req.body;
            let { groups, amount } = await Purchase.list(search)

            let date = new Date()
            let dateReg = ` ${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

            const filePath = path.join(__dirname, "../", "../", "views/admin/reports/pdf.ejs")
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
}