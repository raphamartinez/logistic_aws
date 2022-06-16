
const config = {
    server: process.env.DB_SERVER_HOST,
    user: process.env.DB_SERVER_USER,
    password: process.env.DB_SERVER_PASSWORD,
    database: process.env.DB_SERVER_DATABASE,
    options: {
        encrypt: false, 
        instanceName: process.env.DB_SERVER_NAME
    }
}

module.exports = config
