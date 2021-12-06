const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')
const Repositorie = require('../repositories/purchase')
const puppeteer = require('puppeteer')

class Purchase {

    async list(search) {
        try {
            const teste = {}
            let orders = await Repositorie.getOrders(search)
            let amount = orders.reduce((a, b) => ({ vlr_total: a.vlr_total + b.vlr_total }));

            let groups = orders.reduce(function (r, a) {
                r[a[`${search.group}`]] = r[a[`${search.group}`]] || [];
                r[a[`${search.group}`]].push(a);
                return r;
            }, Object.create(teste));

            return { groups, amount }
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }
}

module.exports = new Purchase