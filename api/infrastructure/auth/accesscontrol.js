const AccessControl = require('accesscontrol')
const controll = new AccessControl()

// 0 - user
// 4 - admin 
// 3 - admin 
// 2 - admin 
// 1 - admin 

controll
    .grant('1')
    .readAny('quotation')

controll
    .grant('2')
    .readAny('patrimony')

controll
    .grant('3')
    .readAny('driver')
    .readAny('car')

controll
    .grant('4')
    .readAny('driver')
    .updateAny('driver')
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


module.exports = controll