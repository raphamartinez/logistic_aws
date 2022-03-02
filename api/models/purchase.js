const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')
const Repositorie = require('../repositories/purchase')
const puppeteer = require('puppeteer')

class Purchase {

    async list(search) {
        try {
            const obj = {}
            let orders = await Repositorie.getOrders(search)
            let amount = orders.reduce((a, b) => {
                switch (b.coin) {
                    case "R$":
                        a.vlr_totalRs += b.vlr_total
                        break;
                    case "US$":
                        a.vlr_totalUsd += b.vlr_total
                        break;
                    case "G$":
                        a.vlr_totalGs += b.vlr_total
                        break;
                }

                return a;
            },{
                vlr_totalRs: 0,
                vlr_totalUsd: 0,
                vlr_totalGs: 0
            });

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

    async gestranOrder(oc) {
        try {
            let orders = await Repositorie.getOrderGestran(oc)
            let amount = orders.reduce((a, b) => a + b.vlr_total, 0);

            let search = {
                purchaseorder: orders[0].nr_oc
            }
            let natures = await Repositorie.getQuotationNatures(search)

            return { orders, amount, natures }
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }

    // async list(search) {
    //     try {
    //         const obj = {}
    //         let orders = await Repositorie.getOrders(search)
    //         let amount = orders.reduce((a, b) => ({ vlr_total: a.vlr_total + b.vlr_total }));

    //         let groups = orders.reduce(function (r, a) {
    //             r[a[`${search.group}`]] = r[a[`${search.group}`]] || [];
    //             r[a[`${search.group}`]].push(a);
    //             return r;
    //         }, Object.create(obj));

    //         return { groups, amount }
    //     } catch (error) {
    //         console.log(error);
    //         throw new InternalServerError('Error.')
    //     }
    // }

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

            let result = arr.map(ar => {

                if (ar[1].zhistory) ar.zhistory = ar[1].zhistory
                if (ar[1].hgroups) ar.hgroups = ar[1].hgroups
                ar[1] = Object.keys(ar[1]).map((key) => [key, ar[1][key]]);

                ar[1] = ar[1].map(ar3 => {
                    let arrvalues;
                    ar3.min = 0;

                    if (ar3[0] != "hgroups" && ar3[0] != "zhistory") arrvalues = ar3[1].map(a => a.qtd_product * a.valor_unit)

                    if (arrvalues) arrvalues.forEach(value => {
                        if (value > 0 && ar3.min > value || ar3.min == 0) ar3.min = value
                    });

                    let objarr = ar3[1].reduce(function (r, a) {
                        let model = a[`model_product`] ? a[`model_product`] : 'ND'
                        r[model] = r[model] || [];
                        r[model].push(a);

                        return r;
                    }, Object.create(obj))

                    let minprovider1 = 99999999999;
                    let minprovider2 = 99999999999;
                    let minprovider3 = 99999999999;

                    ar3[1] = objarr;

                    ar3[1] = Object.keys(ar3[1]).map((key) => ar3[1][key]);

                    ar3[1].forEach(min => {
                        if (parseFloat(min[0].qtd_product * min[0].valor_unit) > 0 && minprovider1 > parseFloat(min[0].qtd_product * min[0].valor_unit)) minprovider1 = parseFloat(min[0].qtd_product * min[0].valor_unit);
                        if (min[1] && parseFloat(min[1].qtd_product * min[1].valor_unit) > 0 && minprovider2 > parseFloat(min[1].qtd_product * min[1].valor_unit)) minprovider2 = parseFloat(min[1].qtd_product * min[1].valor_unit);
                        if (min[2] && parseFloat(min[2].qtd_product * min[2].valor_unit) > 0 && minprovider3 > parseFloat(min[2].qtd_product * min[2].valor_unit)) minprovider3 = parseFloat(min[2].qtd_product * min[2].valor_unit);
                    })


                    ar3[1].minprovider1 = minprovider1 == 99999999999 ? 0 : minprovider1;
                    ar3[1].minprovider2 = minprovider2 == 99999999999 ? 0 : minprovider2;
                    ar3[1].minprovider3 = minprovider3 == 99999999999 ? 0 : minprovider3;

                    return ar3
                })

                return ar
            })

            const sellers = await Repositorie.getQuotationSellers(search)

            const natures = await Repositorie.getQuotationNatures(search)

            return { result, sellers, natures }
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

    getOrderCategory(search) {
        try {
            return Repositorie.getOrderCategory(search)
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }

    async getOrderModel(search) {
        try {
            let details = await Repositorie.getOrders(search)
            let orders = await Repositorie.getOrderModel(search)

            return { details, orders }
        } catch (error) {
            throw new InternalServerError('Error.')
        }
    }

    async getOrderPlate(search) {
        try {
            let details = await Repositorie.getOrders(search)
            let orders = await Repositorie.getOrderPlate(search)

            return { details, orders }
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }
}

module.exports = new Purchase