
class Tables {

  init(connection) {
    this.connection = connection
    this.createTableProvider()
    this.createTableStock()
    this.createTableLogin()
    this.createTableUser()
    this.createTableItem()
    this.createTableFile()
    this.createTableQuotation()
    this.createTableVoucher()

    return true
  } 

  createTableStock(){
    const sql = `CREATE TABLE IF NOT EXISTS stock (id int NOT NULL AUTO_INCREMENT, id_item int, FOREIGN KEY (id_item) REFERENCES item (id), PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableFile(){
    const sql = `CREATE TABLE IF NOT EXISTS file (id int NOT NULL AUTO_INCREMENT, filename VARCHAR (250), mimetype VARCHAR (10) NOT NULL,
    path VARCHAR (250) NOT NULL, size int, id_login int, id_item int, datereg DATETIME, 
    FOREIGN KEY (id_login) REFERENCES login (id), 
    FOREIGN KEY (id_item) REFERENCES item (id), 
    PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableVoucher(){
    const sql = `CREATE TABLE IF NOT EXISTS voucher (id int NOT NULL AUTO_INCREMENT, filename VARCHAR (250), mimetype VARCHAR (10) NOT NULL,
    path VARCHAR (250) NOT NULL, size int, id_login int, id_quotation int, datereg DATETIME, 
    FOREIGN KEY (id_login) REFERENCES login (id), 
    FOREIGN KEY (id_quotation) REFERENCES quotation (id), 
    PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableQuotation() {
    const sql = `CREATE TABLE IF NOT EXISTS quotation (id int NOT NULL AUTO_INCREMENT, 
      id_item int NOT NULL, dateReg DATETIME, amount int,
      id_provider int, status int, price double,
      FOREIGN KEY (id_item) REFERENCES item (id),
      FOREIGN KEY (id_provider) REFERENCES provider (id),
      PRIMARY KEY(id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableProvider() {
    const sql = `CREATE TABLE IF NOT EXISTS provider (id int NOT NULL AUTO_INCREMENT, RUC VARCHAR (100), name VARCHAR (100), 
        phone VARCHAR (20), salesman VARCHAR (100), mail VARCHAR (100), address VARCHAR (100), 
        dateReg DATETIME NOT NULL, PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }


  createTableLogin() {
    const sql = `CREATE TABLE IF NOT EXISTS login (id int NOT NULL AUTO_INCREMENT,access VARCHAR (100) NOT NULL,
        password VARCHAR (250) NOT NULL, mailVerify int,  status int NOT NULL, dateReg DATETIME NOT NULL, PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableUser() {
    const sql = `CREATE TABLE IF NOT EXISTS user (id int NOT NULL AUTO_INCREMENT,name VARCHAR (100) NOT NULL, perfil int NOT NULL,
        dateReg DATETIME NOT NULL, id_login int NOT NULL,
        PRIMARY KEY (id), FOREIGN KEY (id_login) REFERENCES login(id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableCar() {
    const sql = `CREATE TABLE IF NOT EXISTS car (id int NOT NULL AUTO_INCREMENT, plate VARCHAR (20) NOT NULL,
       dateReg DATETIME NOT NULL, PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableItem() {
    const sql = `CREATE TABLE IF NOT EXISTS item (id int NOT NULL AUTO_INCREMENT, code VARCHAR (100),
      name VARCHAR (100) NOT NULL, brand VARCHAR (50), description VARCHAR(150), type INT, km INT, status INT, plate VARCHAR (10), dateReg DATETIME NOT NULL,
      PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }
}

module.exports = new Tables