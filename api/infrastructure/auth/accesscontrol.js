const AccessControl = require('accesscontrol')
const controll = new AccessControl()

// 0 - user
// 1 - admin 

controll
    .grant('1')
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


module.exports = controll