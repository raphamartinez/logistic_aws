const AccessControl = require('accesscontrol')
const controll = new AccessControl()

// 4 - admin 
// 3 - vehiculo 
// 2 - patrimonio 
// 1 - mantenimiento 
// 0 - user

controll
    .grant('1')
    .readAny('quotation')
    .updateAny('quotation')
    .createAny('quotation')
    .deleteAny('quotation')

controll
    .grant('2')
    .readAny('patrimony')
    .updateAny('patrimony')
    .createAny('patrimony')
    .deleteAny('patrimony')

controll
    .grant('3')
    .readOwn('driver')
    .updateOwn('driver')
    .createOwn('driver')
    .deleteOwn('driver')
    .readOwn('car')
    .updateOwn('car')
    .createOwn('car')
    .deleteOwn('car')
    .readOwn('travel')
    .updateOwn('travel')
    .createOwn('travel')
    .deleteOwn('travel')
    .readOwn('item')
    
controll
    .grant('4')
    .readAny('driver')
    .updateAny('driver')
    .createAny('driver')
    .deleteAny('driver')
    .readAny('car')
    .createAny('car')
    .deleteAny('car')
    .updateAny('car') 
    .readAny('stock')
    .createAny('stock')
    .deleteAny('stock')
    .updateAny('stock')
    .readAny('provider')
    .createAny('provider')
    .deleteAny('provider')
    .updateAny('provider')
    .readAny('file')
    .createAny('file')
    .deleteAny('file')
    .updateAny('file')
    .readAny('item')
    .createAny('item')
    .deleteAny('item')
    .updateAny('item')
    .readAny('quotation')
    .createAny('quotation')
    .deleteAny('quotation') 
    .updateAny('quotation')
    .readAny('patrimony')
    .createAny('patrimony')
    .deleteAny('patrimony')
    .updateAny('patrimony') 
    .readAny('travel')
    .createAny('travel')
    .deleteAny('travel')
    .updateAny('travel')
    .readAny('user')
    .createAny('user')
    .deleteAny('user')
    .updateAny('user')
    .readAny('quiz')
    .createAny('quiz')
    .deleteAny('quiz')
    .updateAny('quiz')
    .readAny('report')
    .createAny('report')
    .deleteAny('report')
    .updateAny('report')

module.exports = controll