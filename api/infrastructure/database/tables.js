
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
    this.createTablePatrimony()
    this.createTableCar()
    this.createTableDriver()
    this.createTableTravel()
    this.createTableTravelCar()
    this.createTableTravelReport()
    this.createTableTravelReportDetail()
    this.createTableQuiz()
    this.createTableQuestion()
    this.createTableAnswer()
    this.createTableInterview()
    this.createTableAnsweredInterview()
    this.createTableAccessLogin()
    this.createTableReport()
    this.createTableReportView()

    return true
  }

  createTableReport() {
    const sql = `CREATE TABLE IF NOT EXISTS api.report (id int NOT NULL AUTO_INCREMENT, url VARCHAR (1000) NOT NULL, title VARCHAR (50) NOT NULL,
    type int, token VARCHAR (250), description VARCHAR (250), idreport VARCHAR (100), dateReg DATETIME NOT NULL, PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableReportView() {
    const sql = `CREATE TABLE IF NOT EXISTS api.reportview (id int NOT NULL AUTO_INCREMENT, id_report int NOT NULL, id_login int NOT NULL,
      dateReg DATETIME NOT NULL, PRIMARY KEY (id),  FOREIGN KEY (id_report) REFERENCES report (id), 
      FOREIGN KEY (id_login) REFERENCES login (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }


  createTableAccessLogin() {
    const sql = `CREATE TABLE IF NOT EXISTS api.accessplace (id int NOT NULL AUTO_INCREMENT, 
      id_login int, value int, FOREIGN KEY (id_login) REFERENCES login (id),
      PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableAnsweredInterview() {
    const sql = `CREATE TABLE IF NOT EXISTS api.answeredinterview (id int NOT NULL AUTO_INCREMENT, 
      id_answer int, id_question int, id_interview int, value int, 
      FOREIGN KEY (id_answer) REFERENCES answer (id), 
      FOREIGN KEY (id_question) REFERENCES question (id), 
      FOREIGN KEY (id_interview) REFERENCES interview (id), 
      PRIMARY KEY (id))`


    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableInterview() {
    const sql = `CREATE TABLE IF NOT EXISTS api.interview (id int NOT NULL AUTO_INCREMENT, 
      id_quiz int, mail VARCHAR(100), name VARCHAR(50), comment VARCHAR(250), datereg DATETIME, status int, id_login int,
      FOREIGN KEY (id_login) REFERENCES login (id), 
      FOREIGN KEY (id_quiz) REFERENCES quiz (id), 
      PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }


  createTableAnswer() {
    const sql = `CREATE TABLE IF NOT EXISTS api.answer (id int NOT NULL AUTO_INCREMENT, 
      title VARCHAR (250), id_question int, classification int, FOREIGN KEY (id_question) REFERENCES question (id),  
      PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableQuestion() {
    const sql = `CREATE TABLE IF NOT EXISTS api.question (id int NOT NULL AUTO_INCREMENT, 
      title VARCHAR (150), classification int, type VARCHAR (20), id_quiz int, FOREIGN KEY (id_quiz) REFERENCES quiz (id),  
      PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableQuiz() {
    const sql = `CREATE TABLE IF NOT EXISTS api.quiz (id int NOT NULL AUTO_INCREMENT, 
      title VARCHAR(500), datereg DATETIME, status int, PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableTravelReportDetail() {
    const sql = `CREATE TABLE IF NOT EXISTS api.travelreportdetail (id int NOT NULL AUTO_INCREMENT, type int, description VARCHAR(250), value DOUBLE, id_travelreport int,
    FOREIGN KEY (id_travelreport) REFERENCES travelreport (id), PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableTravelReport() {
    const sql = `CREATE TABLE IF NOT EXISTS api.travelreport (id int NOT NULL AUTO_INCREMENT, id_car int, origin int, route int, 
      FOREIGN KEY (id_car) REFERENCES car (id), PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableTravelReport() {
    const sql = `CREATE TABLE IF NOT EXISTS api.travelreport (id int NOT NULL AUTO_INCREMENT, id_car int, origin int, route int, 
      FOREIGN KEY (id_car) REFERENCES car (id), PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableTravelCar() {
    const sql = `CREATE TABLE IF NOT EXISTS api.travelcar (id int NOT NULL AUTO_INCREMENT, id_car int, id_travel int,
      FOREIGN KEY (id_car) REFERENCES car (id), type int,
      FOREIGN KEY (id_travel) REFERENCES travel (id),
      PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableTravel() {
    const sql = `CREATE TABLE IF NOT EXISTS api.travel (id int NOT NULL AUTO_INCREMENT, date DATE NOT NULL, period int NOT NULL,
      id_driver int, route int, id_login int, datereg DATETIME, type int,
      FOREIGN KEY (id_login) REFERENCES login (id), 
      FOREIGN KEY (id_driver) REFERENCES driver (id), 
      PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }


  createTableDriver() {
    const sql = `CREATE TABLE IF NOT EXISTS api.driver (id int NOT NULL AUTO_INCREMENT, name VARCHAR (250) NOT NULL, idcard VARCHAR (100),
    phone VARCHAR (100), thirst VARCHAR (25), id_car VARCHAR(50), type VARCHAR(100), classification VARCHAR(100), vacation varchar (100),
    PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableStock() {
    const sql = `CREATE TABLE IF NOT EXISTS stock (id int NOT NULL AUTO_INCREMENT, id_item int, FOREIGN KEY (id_item) REFERENCES item (id), PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableFile() {
    const sql = `CREATE TABLE IF NOT EXISTS api.file (id int NOT NULL AUTO_INCREMENT, filename VARCHAR (250) NOT NULL, mimetype VARCHAR (10) NOT NULL,
    path VARCHAR (250) NOT NULL, size int, id_login int, datereg DATETIME, description VARCHAR (250),
    id_item int, 
    id_patrimony int,
    id_quotation int, 
    FOREIGN KEY (id_login) REFERENCES login (id), 
    FOREIGN KEY (id_item) REFERENCES item (id), 
    FOREIGN KEY (id_patrimony) REFERENCES patrimony (id), 
    FOREIGN KEY (id_quotation) REFERENCES quotation (id), 
    PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTableVoucher() {
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
      id_item int NOT NULL, dateReg DATETIME, amount int, currency int,
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
        phone VARCHAR (20), salesman VARCHAR (100), mail VARCHAR (100), address VARCHAR (100), status int,
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
    const sql = `CREATE TABLE IF NOT EXISTS user (id int NOT NULL AUTO_INCREMENT,name VARCHAR (100) NOT NULL, profile int NOT NULL,
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
    const sql = `CREATE TABLE IF NOT EXISTS api.car (id int NOT NULL AUTO_INCREMENT, plate VARCHAR (20) NOT NULL, brand VARCHAR (20), model VARCHAR (50), cartype  VARCHAR (50),
    color VARCHAR (20), year DATE, chassis VARCHAR(100), fuel VARCHAR (50), departament VARCHAR (50), obs VARCHAR (250),
    dateReg DATETIME NOT NULL, status int, PRIMARY KEY (id))`

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

  createTablePatrimony() {
    const sql = `CREATE TABLE IF NOT EXISTS api.patrimony (id int NOT NULL AUTO_INCREMENT, id_login int, datereg DATETIME, local VARCHAR(100), code VARCHAR(25), name VARCHAR(150), 
    FOREIGN KEY (id_login) REFERENCES login (id), 
    PRIMARY KEY (id))`

    this.connection.query(sql, (error) => {
      if (error) {
        console.log(error)
      } else {
      }
    })
  }

  createTablePatrimonyImage() {
    const sql = `CREATE TABLE IF NOT EXISTS api.patrimonyImage (id int NOT NULL AUTO_INCREMENT, filename VARCHAR (250), mimetype VARCHAR (10) NOT NULL,
    location VARCHAR (250) NOT NULL, size int, id_login int, id_patrimony int, datereg DATETIME, 
    FOREIGN KEY (id_login) REFERENCES login (id), 
    FOREIGN KEY (id_patrimony) REFERENCES patrimony (id), 
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