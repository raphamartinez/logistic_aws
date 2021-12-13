const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')
const Repositorie = require('../repositories/purchase')
const puppeteer = require('puppeteer')

class Purchase {

    async list(search) {
        try {
            const obj = {}
            let orders = await Repositorie.getOrders(search)
            let amount = orders.reduce((a, b) => ({ vlr_total: a.vlr_total + b.vlr_total }));

            let groups = orders.reduce(function (r, a) {
                r[a[`${search.group}`]] = r[a[`${search.group}`]] || [];
                r[a[`${search.group}`]].push(a);
                return r;
            }, Object.create(obj));

            return { groups, amount }
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }

    async quotation(search) {

        try {
            const obj = {}
            let quotations = await Repositorie.getQuotation(search)

            if (search.status == 2) {
                let ids = quotations.map(qtt => qtt.id_cotacao)
                search.status = '4'
                search.quotation = ids
                
                let quotationReproved = await Repositorie.getQuotation(search)
                quotations = quotations.concat(quotationReproved)

                search.status = '2'
            }

            let groups = quotations.reduce(function (r, a) {
                r[a[`id_cotacao`]] = r[a[`id_cotacao`]] || [];
                r[a[`id_cotacao`]].push(a);

                return r;
            }, Object.create(obj));


            for (let index = 0; index < Object.keys(groups).length; index++) {

                groups[`${Object.keys(groups)[index]}`] = groups[`${Object.keys(groups)[index]}`].reduce(function (r, a) {
                    r[a[`proveedor`]] = r[a[`proveedor`]] || [];
                    r[a[`proveedor`]].push(a);

                    return r;
                }, Object.create(obj));

                if (search.history == '1') {
                    let quotation = groups[`${Object.keys(groups)[index]}`]

                    let plate = quotation[`${Object.keys(quotation)[0]}`][0].truck

                    if (plate) {
                        const history = await Repositorie.getHistory(plate)
                        groups[Object.keys(groups)[index]].zhistory = history
                    }
                }
            }

            return groups
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }

    getProviders() {
        try {
            return Repositorie.getProviders()
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }

    getCars() {
        try {
            return Repositorie.getCars()
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }

    getProducts() {
        try {
            return Repositorie.getProducts()
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }

    getPurchaseOrders() {
        try {
            return Repositorie.getPurchaseOrders()
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }

    getQuotationOrders() {
        try {
            return Repositorie.getQuotationOrders()
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }
}

module.exports = new Purchase