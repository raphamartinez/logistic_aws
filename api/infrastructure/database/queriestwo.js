const connectiontwo = require('./connectiontwo')

const querytwo = (query, parameters = '') => {
    return new Promise(
        (resolve, reject) => {
        connectiontwo.query(query, parameters, (errors, results, fields) => {
            if (errors) {
                reject(errors)
            } else {
                resolve(results)
            }
        })
    })
}

module.exports = querytwo
