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
            let groups
            let quotations = await Repositorie.getQuotation(search)

            if (quotations) {
                if (search.status == 2) {
                    let ids = quotations.map(qtt => qtt.id_cotacao)
                    search.status = '4'
                    search.quotation = ids

                    let quotationReproved = await Repositorie.getQuotation(search)
                    quotations = quotations.concat(quotationReproved)

                    search.status = '2'
                }

                groups = quotations.reduce(function (r, a) {
                    r[a[`id_cotacao`]] = r[a[`id_cotacao`]] || [];
                    r[a[`id_cotacao`]].push(a);

                    return r;
                }, Object.create(obj));


                for (let index = 0; index < Object.keys(groups).length; index++) {

                    groups[`${Object.keys(groups)[index]}`] = groups[`${Object.keys(groups)[index]}`].reduce(function (r, a) {
                        r[a[`product`]] = r[a[`product`]] || [];
                        r[a[`product`]].push(a);

                        return r;
                    }, Object.create(obj));

                    if (search.history == '1') {
                        let quotation = groups[`${Object.keys(groups)[index]}`]

                        let plate = quotation[`${Object.keys(quotation)[0]}`][0].truck

                        if (plate) {
                            const hgroups = await Repositorie.getHistoryGroup(plate)
                            groups[Object.keys(groups)[index]].hgroups = hgroups

                            const history = await Repositorie.getHistoryAuto(plate)
                            groups[Object.keys(groups)[index]].zhistory = history
                        }
                    }

                }
            }

            let arr = Object.keys(groups).map((key) => [Number(key), groups[key]]);

            arr.map(ar => {

                let ar2 = Object.keys(ar[1]).map((key) => [key, ar[1][key]]);

                // ar[`${Object.keys(ar[1])}`] = groups[`${Object.keys(ar[1])}`].reduce(function (r, a) {
                //     r[a[`model_product`]] = r[a[`model_product`]] || [];
                //     r[a[`model_product`]].push(a);

                //     return r;
                // }, Object.create(obj));

                console.log(ar2);
            })

            console.log(result);

            return groups
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }

    async history(search) {
        try {
            let historys = []

            if (Array.isArray(search.truck)) {
                for (let truck of search.truck) {

                    const history = await Repositorie.getHistory(truck)

                    const amount = history.reduce((a, b) => a + b.vlr_total, 0)

                    let obj = {
                        amount,
                        history,
                        plate: `${history[0].plate} - ${history[0].category} - ${history[0].model}`,
                        category: history[0].category
                    }

                    historys.push(obj)
                }
            } else {
                const history = await Repositorie.getHistory(search.truck)

                const amount = history.reduce((a, b) => a + b.vlr_total, 0)

                let obj = {
                    amount,
                    history,
                    plate: `${history[0].plate} - ${history[0].category} - ${history[0].model}`,
                    category: history[0].category
                }

                historys.push(obj)
            }

            return historys
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