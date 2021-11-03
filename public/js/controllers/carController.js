import { Connection } from '../services/connection.js'
import { View } from '../views/carView.js'

window.onload = async function () {
  let loading = document.querySelector('[data-loading]')
  loading.innerHTML = `
  <div class="d-flex justify-content-center">
    <div class="spinner-grow text-danger" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
`
  const date = new Date()

  let day = date.getDate()

  if (day < 10) day = `0${day}`

  const now = `${date.getFullYear()}-${date.getMonth() + 1}-${day}`

  const cars = await Connection.noBody(`cars/${now}`, 'GET')
  const travels = await Connection.noBody(`travel/${now}`, 'GET')

  const drivers = await Connection.noBody('drivers', 'GET')

  let user = JSON.parse(sessionStorage.getItem('user'))

  let data = []

  cars.forEach(car => {
    let status

    if (car.obs == null) car.obs = ""

    switch (car.statuscar) {
      case 2:
        status = `3<button data-div-car="${car.plate.toLowerCase()}" data-status-${car.plate.toLowerCase()} data-toggle="popover" title="Camion en mantenimiento" type="button" class="btn btn-warning btn-circle btn-sm"></button>`
        break
      case 1:
        status = `1<button data-div-car="${car.plate.toLowerCase()}" data-status-${car.plate.toLowerCase()} data-toggle="popover" title="Camion disponible" type="button" class="btn btn-success btn-circle btn-sm"></button>`
        break
      case 0:
        status = `2<button data-div-car="${car.plate.toLowerCase()}" data-status-${car.plate.toLowerCase()} data-toggle="popover" title="Camion no disponible" type="button" class="btn btn-danger btn-circle btn-sm"></button>`
        break
      default:
        status = `2<button data-div-car="${car.plate.toLowerCase()}" data-status-${car.plate.toLowerCase()} data-toggle="popover" title="Camion no disponible" type="button" class="btn btn-danger btn-circle btn-sm"></button>`
        break
    }

    const line = [
      car.plate,
      status,
      car.cartype,
      car.brand,
      car.model,
      car.thirst,
      car.color,
      car.year,
      `<form data-obs="${car.id_car}"><div class="input-group mb-3"><textarea data-id="${car.id_car}" class="form-control" id="obs" name="obs" value="${car.obs}">${car.obs}</textarea><button class="btn btn-outline-success" type="submit" >Agregar</button></div></form>`,
      car.chassis,
      car.fuel,
      car.departament,
      car.driver
    ]

    data.push(line)
  })

  listCars(data)

  let driverdt = []
  drivers.forEach(driver => {
    let status
    switch (driver.status) {
      case 1:
        status = `<button data-div-driver="${driver.id}" data-status-driver-${driver.id} data-toggle="popover" title="Chofér disponible" type="button" class="btn btn-success btn-circle btn-sm"></button>`

        break
      case 2:
        status = `<button data-div-driver="${driver.id}" data-status-driver-${driver.id} data-toggle="popover" title="Chófer temporalmente no disponible" type="button" class="btn btn-warning btn-circle btn-sm"></button>`

        break
      default:
        status = `<button data-div-driver="${driver.id}" data-status-driver-${driver.id} data-toggle="popover" title="Chofér disponible" type="button" class="btn btn-success btn-circle btn-sm"></button>`

        break
    }

    if (driver.obs == null) driver.obs = ""

    const line = [
      driver.name,
      status,
      driver.idcard,
      driver.phone,
      driver.classification,
      driver.thirst,
      `<form data-obs-driver="${driver.id}"><div class="input-group mb-3"><textarea data-id="${driver.id}" class="form-control" id="obs" name="obs" value="${driver.obs}">${driver.obs}</textarea><button class="btn btn-outline-success" type="submit" >Agregar</button></div></form>`
    ]
    driverdt.push(line)
  })

  listDrivers(driverdt)

  travel(travels, cars, drivers)

  let name = user.name.substring(0, (user.name + " ").indexOf(" "))
  let username = document.querySelector('[data-username]')
  username.innerHTML = name
  loading.innerHTML = " "

  // $.fn.dataTable.ext.search.push(
  //   function (settings, data, dataIndex) {
  //     var filter = $('[data-filter-truck-status]').val()
  //     var truck = data[1]

  //     return false;
  //   }
  // );

  document.querySelector('[data-search-date]').value = now

  const buttonObs = document.querySelector('#dataTable')

  buttonObs.addEventListener('submit', async (event) => {
    if (event.target && event.target[0].matches("[data-id]")) {
      event.preventDefault()

      const car = {
        obs: event.target[0].value,
        id: event.target[0].getAttribute('data-id')
      }

      const obj = await Connection.body(`car/obs/${car.id}`, { car }, 'PUT')

      alert(obj.msg)
    }
  })

  const buttonDriver = document.querySelector('#dataDriver')

  buttonDriver.addEventListener('submit', async (event) => {
    if (event.target && event.target[0].matches("[data-id]")) {
      event.preventDefault()

      const driver = {
        obs: event.target[0].value,
        id: event.target[0].getAttribute('data-id')
      }

      const obj = await Connection.body(`driver/obs/${driver.id}`, { driver }, 'PUT')

      alert(obj.msg)
    }
  })
}


const listDrivers = (driverdt) => {

  if ($.fn.DataTable.isDataTable('#dataDriver')) {
    $('#dataDriver').dataTable().fnClearTable();
    $('#dataDriver').dataTable().fnDestroy();
    $('#dataDriver').empty();
  }

  const table = $("#dataDriver").DataTable({
    data: driverdt,
    columns: [
      {
        title: "Nombre",
        className: "finance-control"
      },
      {
        title: "Status",
        className: "finance-control"
      },
      { title: "CI" },
      { title: "Telefono" },
      { title: "Tipo" },
      { title: "SEDE" },
      { title: "Observación" }
    ],
    responsive: true,
    paging: false,
    ordering: true,
    info: true,
    scrollY: false,
    scrollCollapse: true,
    scrollX: true,
    autoHeight: true,
    lengthMenu: [[25, 50, 100, 150], [25, 50, 100, 150]],
    pagingType: "numbers",
    searchPanes: true,
    fixedHeader: false,
    dom: "<'row'<'col-md-6'l><'col-md-6'f>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6'p>>" +
      "<'row'<'col-sm-12'B>>",
    buttons: [
      'copy', 'csv', 'excel', 'pdf', 'print'
    ]
  })
}



const listCars = (data) => {

  if ($.fn.DataTable.isDataTable('#dataTable')) {
    $('#dataTable').dataTable().fnClearTable();
    $('#dataTable').dataTable().fnDestroy();
    $('#dataTable').empty();
  }

  const table = $("#dataTable").DataTable({
    data: data,
    columns: [
      {
        title: "Chapa",
        className: "finance-control"
      },
      {
        title: "Status",
        className: "finance-control"
      },
      { title: "Vehiculo" },
      { title: "Marca" },
      { title: "Modelo" },
      { title: "SEDE" },
      { title: "Color" },
      { title: "Año" },
      { title: "Observación" },
      { title: "Chassi" },
      { title: "Combustible" },
      { title: "Departamento" },
      { title: "Ultimo Chofer" }
    ],
    responsive: true,
    paging: false,
    ordering: false,
    info: true,
    scrollY: false,
    scrollCollapse: true,
    scrollX: true,
    autoHeight: true,
    lengthMenu: [[25, 50, 100, 150], [25, 50, 100, 150]],
    pagingType: "numbers",
    searchPanes: true,
    fixedHeader: false,
    dom: "<'row'<'col-md-6'l><'col-md-6'f>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6'p>>" +
      "<'row'<'col-sm-12'B>>",
    buttons: [
      'copy', 'csv', 'excel', 'pdf'
    ]
  })

  document.querySelector('[data-filter-truck-type]').addEventListener('change', (event) => {

    $.fn.dataTable.ext.search.push(
      function (settings, data, dataIndex) {
        var filter = $('[data-filter-truck-type]').val()
        var truck = data[2]

        if (filter == 'TODOS') return true
        if (filter == truck) return true
        return false;
      }
    );

    table.draw();
  })

  document.querySelector('[data-filter-truck-status]').addEventListener('change', (event) => {

    $.fn.dataTable.ext.search.push(
      function (settings, data, dataIndex) {
        let filter = $('[data-filter-truck-status]').val()
        let status = data[1]

        if (filter == 'TODOS') return true
        if (filter == status) return true
        return false;
      }
    );

    table.draw();
  })
}

const selectCars = (cars) => {

  cars.map(car => {
    const option = document.createElement('option')

    if (car.statuscar == 2) option.disabled = true

    option.value = car.plate
    option.innerHTML = `${car.plate} - ${car.cartype} - ${car.brand} - ${car.model} - ${car.year}</option>`
    document.querySelector('[data-cars]').appendChild(option)
  })

}


const travel = (travels, cars, drivers) => {

  cars.forEach(car => {
    const option = document.createElement('option')
    option.value = car.id_car
    option.dataset.plate = car.plate
    option.innerHTML = `${car.plate} - ${car.cartype} - ${car.brand} - ${car.model} - ${car.year}</option>`

    if (car.cartype === "FURGON" || car.cartype === "SEMI REMOLQUE") {
      document.querySelector('[data-chest]').appendChild(option)
    } else {
      document.querySelector('[data-truck]').appendChild(option)
    }
  })

  drivers.forEach(driver => {
    const option = document.createElement('option')
    option.value = driver.id
    option.innerHTML = `${driver.name}</option>`
    if (driver.name !== "SIN ASIGNACION") document.querySelector('[data-driver]').appendChild(option)
  })

  travels.forEach(travel => {
    let plate = `${travel.cars[0].plate} - ${travel.cars[0].cartype} - ${travel.cars[0].brand} - ${travel.cars[0].model} - ${travel.cars[0].year}`
    let platedesc = travel.cars[0].plate
    let chest = ""
    let carchestdesc = ""
    if (travel.cars[1]) carchestdesc = travel.cars[1].plate
    if (travel.cars[1]) chest = `${travel.cars[1].plate} - ${travel.cars[1].cartype} - ${travel.cars[1].brand} - ${travel.cars[1].model} - ${travel.cars[1].year}`

    if (travel.type === "Mantenimiento") {
      document.querySelector(`[data-status-${travel.cars[0].plate.toLowerCase()}]`).parentNode.innerHTML = `
  3<button data-div-car="${travel.cars[0].plate}" data-status-${travel.cars[0].plate} data-toggle="popover" title="Camion en Mantenimiento Programado" type="button" style="border-color: #ff9855; background-color: #ff8c00" class="btn btn-warning btn-circle btn-sm"></button>`

      if (chest !== "") {
        document.querySelector(`[data-status-${travel.cars[1].plate.toLowerCase()}]`).parentNode.innerHTML = `
    3<button data-div-car="${travel.cars[1].plate}" data-status-${travel.cars[1].plate} data-toggle="popover" title="Camion en Mantenimiento Programado" type="button" style="border-color: #ff9855; background-color: #ff8c00" class="btn btn-warning btn-circle btn-sm"></button>`
      }

      document.querySelector('[data-row-travel]').appendChild(View.maintenance(travel, plate, chest, platedesc, carchestdesc))

    } else {
      document.querySelector(`[data-status-${travel.cars[0].plate.toLowerCase()}]`).parentNode.innerHTML = `
  2<button data-div-car="${travel.cars[0].plate}" data-status-${travel.cars[0].plate} data-toggle="popover" title="Camion no disponible" type="button" class="btn btn-danger btn-circle btn-sm"></button>`

      if (chest !== "") {
        document.querySelector(`[data-status-${travel.cars[1].plate.toLowerCase()}]`).parentNode.innerHTML = `
    2<button data-div-car="${travel.cars[1].plate}" data-status-${travel.cars[1].plate} data-toggle="popover" title="Camion no disponible" type="button" class="btn btn-danger btn-circle btn-sm"></button>`
      }

      document.querySelector('[data-row-travel]').appendChild(View.travel(travel, plate, chest, platedesc, carchestdesc))

    }

    if (travel.driverdesc !== "") {
      document.querySelector(`[data-status-driver-${travel.id_driver}]`).parentNode.innerHTML = `
      <button data-div-driver="${travel.id_driver}" data-status-driver-${travel.id_driver} data-toggle="popover" title="Chofér no disponible" type="button" class="btn btn-danger btn-circle btn-sm"></button>`
    }

  })

  document.querySelector('[data-period]')
  document.querySelector('[data-driver]')
  document.querySelector('[data-truck]')
  document.querySelector('[data-chest]')
  document.querySelector('[data-route]')
}


document.querySelector('[data-form-travel]').addEventListener('submit', async (event) => {
  event.preventDefault();
  let loading = document.querySelector('[data-loading]')
  loading.innerHTML = `
  <div class="d-flex justify-content-center">
    <div class="spinner-grow text-danger" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
`
  const date = new Date(event.currentTarget.date.valueAsDate)

  let travel = {
    plate: event.currentTarget.car.value,
    cardesc: document.querySelector('[data-truck] option:checked').innerHTML,
    platedesc: document.querySelector('[data-truck] option:checked').getAttribute('data-plate'),
    chest: event.currentTarget.chest.value,
    carchestdesc: document.querySelector('[data-chest] option:checked').innerHTML,
    chestdesc: document.querySelector('[data-chest] option:checked').getAttribute('data-plate'),
    date: event.currentTarget.date.value,
    datedesc: `${date.getDate() + 1}/${date.getMonth() + 1}/${date.getFullYear()}`,
    period: event.currentTarget.period.value,
    perioddesc: document.querySelector('[data-period] option:checked').innerHTML,
    route: Number(event.currentTarget.route.value),
    routedesc: document.querySelector('[data-route] option:checked').innerHTML,
    driver: event.currentTarget.driver.value,
    type: event.currentTarget.type.value,
    typedesc: document.querySelector('#type option:checked').innerHTML,
    driverdesc: document.querySelector('[data-driver] option:checked').innerHTML,
    obs: event.currentTarget.obs.value
  }

  if (travel.driverdesc === "Chofér") {
    travel.driverdesc = ""
    travel.driver = null
  }

  if (travel.routedesc === "Destino") {
    travel.routedesc = ""
    travel.route = null
  }

  if (travel.chestdesc == "Furgon" || travel.chestdesc == null) {
    travel.chestdesc = ""
  }

  document.querySelector('[data-form-travel]').reset();

  const obj = await Connection.body('travel', { travel }, 'POST')

  travel.id = obj.id
  const viewDate = document.querySelector('[data-search-date]').value
  const date2 = new Date(viewDate)

  if (date.getTime() === date2.getTime()) {
    let plate = travel.cardesc
    let chest = ""
    if (travel.chest) chest = travel.carchestdesc

    if (travel.type == 3) {
      travel.type = travel.typedesc
      document.querySelector('[data-row-travel]').appendChild(View.maintenance(travel, plate, chest, travel.platedesc, travel.chestdesc))
    } else {
      document.querySelector('[data-row-travel]').appendChild(View.addtravel(travel, plate, chest, travel.platedesc, travel.chestdesc))
    }
    document.querySelector(`[data-status-${travel.platedesc.toLowerCase()}]`).parentNode.innerHTML = `
    2<button data-div-car="${travel.platedesc}" data-status-${travel.platedesc} data-toggle="popover" title="Camion no disponible" type="button" class="btn btn-danger btn-circle btn-sm"></button>`


    if (travel.driverdesc !== "" && travel.driverdesc !== "Chofér") {
      document.querySelector(`[data-status-driver-${travel.driver}]`).parentNode.innerHTML = `
      2<button data-div-driver="${travel.driver}" data-status-driver-${travel.driver} data-toggle="popover" title="Chofér no disponible" type="button" class="btn btn-danger btn-circle btn-sm"></button>`
    }

    if (travel.chestdesc !== "" && travel.chestdesc !== null) {
      document.querySelector(`[data-status-${travel.chestdesc.toLowerCase()}]`).parentNode.innerHTML = `
      2<button data-div-car="${travel.chestdesc}" data-status-${travel.chestdesc} data-toggle="popover" title="Camion no disponible" type="button" class="btn btn-danger btn-circle btn-sm"></button>`
    }
  }

  loading.innerHTML = " "
})

document.querySelector('[data-row-travel]').addEventListener('click', async (event) => {
  if (event.target && event.target.matches("[data-btn-delete]")) {

    const id = event.target.getAttribute('data-id')
    const obj = await Connection.noBody(`travel/${id}`, 'DELETE')

    event.path[3].remove()

    const plate = event.target.getAttribute('data-car')
    const id_driver = event.target.getAttribute('data-iddriver')
    document.querySelector(`[data-status-${plate.toLowerCase()}]`).parentNode.innerHTML = `
    1<button data-div-car="${plate}" data-status-${plate} data-toggle="popover" title="Camion disponible" type="button" class="btn btn-success btn-circle btn-sm"></button>`

    if (id_driver != "null" && id_driver != null) {
      document.querySelector(`[data-status-driver-${id_driver}]`).parentNode.innerHTML = `
      1<button data-div-car data-status-driver-${id_driver} data-toggle="popover" title="Chofér disponible" type="button" class="btn btn-success btn-circle btn-sm"></button>`
    }

    const chest = event.target.getAttribute('data-chest')
    if (chest !== "null" && chest !== "") {
      document.querySelector(`[data-status-${chest.toLowerCase()}]`).parentNode.innerHTML = `
      1<button data-div-car="${chest}" data-status-${chest} data-toggle="popover" title="Camion disponible" type="button" class="btn btn-success btn-circle btn-sm"></button>`
    }

    alert(obj.msg)
  }
})

const enable = async () => {

  document.querySelector('[data-driver]').disabled = true
  document.querySelector('[data-truck]').disabled = true
  document.querySelector('[data-chest]').disabled = true
  document.querySelector('[data-route]').disabled = true

  const date = document.querySelector('[data-date]').value
  const period = document.querySelector('[data-period]').value
  const type = document.querySelector('[data-type]').value


  if (!date && type) return alert("¡Seleccione una fecha valida!")
  if (!period && type) return alert("¡Seleccione un período válido!")
  if (!type) return false

  let loading = document.querySelector('[data-loading]')
  loading.innerHTML = `
  <div class="d-flex justify-content-center">
    <div class="spinner-grow text-danger" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
`

  const travels = await Connection.noBody(`travelperiod/${date}/${period}`, 'GET')
  const maintenacecars = await Connection.noBody(`carstatus`, 'GET')

  const drivers = document.querySelectorAll('[data-driver] option')
  const trucks = document.querySelectorAll('[data-truck] option')
  const chests = document.querySelectorAll('[data-chest] option')

  if (travels.length > 0) {
    travels.forEach(travel => {

      Array.from(drivers).forEach(driver => {
        if (driver.value == travel.id_driver) {
          driver.disabled = true
        } else {
          driver.disabled = false
        }
      })

      let cars = []
      travel.cars.forEach(car => {
        cars.push(car)
      })
      cars.concat(maintenacecars)

      Array.from(trucks).forEach(truck => {
        let car = cars.find(car => truck.value == car.id_car)

        if (car) {
          truck.disabled = true
        } else {
          truck.disabled = false
        }
      })

      Array.from(chests).forEach(chest => {
        let car = cars.find(car => chest.value == car.id_car)

        if (car) {
          chest.disabled = true
        } else {
          chest.disabled = false
        }
      })

    })
  } else {
    const drivers = document.querySelectorAll('[data-driver] option')
    Array.from(drivers).forEach(driver => {
      driver.disabled = false
    })

    const trucks = document.querySelectorAll('[data-truck] option')
    Array.from(trucks).forEach(truck => {
      let car = maintenacecars.find(car => truck.value == car.id)

      if (car) {
        truck.disabled = true
      } else {
        truck.disabled = false
      }
    })

    const chests = document.querySelectorAll('[data-chest] option')
    Array.from(chests).forEach(chest => {
      let car = maintenacecars.find(car => chest.value == car.id)

      if (car) {
        chest.disabled = true
      } else {
        chest.disabled = false
      }
    })
  }

  if (document.querySelector('[data-type]').value == 3) {
    document.querySelector('[data-route]').required = false
    document.querySelector('[data-obs]').required = true

    document.querySelector('[data-route]').style.display = 'none'
    document.querySelector('[data-obs]').style.display = 'block'
  } else {
    document.querySelector('[data-driver]').disabled = false
    document.querySelector('[data-route]').required = true
    document.querySelector('[data-obs]').required = false

    document.querySelector('[data-route]').style.display = 'block'
    document.querySelector('[data-route]').disabled = false
    document.querySelector('[data-obs]').style.display = 'none'
  }

  document.querySelector('[data-truck]').disabled = false
  document.querySelector('[data-chest]').disabled = false
  document.querySelector('[data-route]').disabled = false
  loading.innerHTML = " "
}

document.querySelector('[data-type]').addEventListener('change', enable, false)
document.querySelector('[data-period]').addEventListener('change', enable, false)
document.querySelector('[data-date]').addEventListener('change', enable, false)


document.querySelector('[data-search-date]').addEventListener('change', async (event) => {

  const cars = document.querySelectorAll('[data-div-car]')
  Array.from(cars).forEach(car => {
    if (car.title === 'Camion no disponible') {
      car.title = `Camion disponible`
      car.classList.remove('btn-danger')
      car.classList.add('btn-success')
    }
  })

  const drivers = document.querySelectorAll('[data-div-driver]')
  Array.from(drivers).forEach(driver => {
    if (driver.title === 'Chofér no disponible') {
      driver.title = `Chofér disponible`
      driver.classList.remove('btn-danger')
      driver.classList.add('btn-success')
    }
  })

  document.querySelector('[data-form-travel]').reset();
  document.querySelector('[data-driver]').disabled = true
  document.querySelector('[data-truck]').disabled = true
  document.querySelector('[data-chest]').disabled = true
  document.querySelector('[data-route]').disabled = true

  const date = event.currentTarget.value
  const travels = await Connection.noBody(`travel/${date}`, 'GET')

  listTravels(travels)
})

document.querySelector('[data-search-date]').addEventListener('keypress', async (event) => {
  if (e.keyCode === 13) {

    const cars = document.querySelectorAll('[data-div-car]')
    Array.from(cars).forEach(car => {
      if (car.title === 'Camion no disponible') {
        car.title = `Camion disponible`
        car.classList.remove('btn-danger')
        car.classList.add('btn-success')
      }
    })


    const drivers = document.querySelectorAll('[data-div-driver]')
    Array.from(drivers).forEach(driver => {
      if (driver.title === 'Chofér no disponible') {
        driver.title = `Chofér disponible`
        driver.classList.remove('btn-danger')
        driver.classList.add('btn-success')
      }
    })

    document.querySelector('[data-form-travel]').reset();
    document.querySelector('[data-driver]').disabled = true
    document.querySelector('[data-truck]').disabled = true
    document.querySelector('[data-chest]').disabled = true
    document.querySelector('[data-route]').disabled = true

    const date = event.currentTarget.value
    const travels = await Connection.noBody(`travel/${date}`, 'GET')

    listTravels(travels)
  }
})

const listTravels = (travels) => {
  document.querySelector('[data-row-travel]').innerHTML = ""

  travels.forEach(travel => {
    let plate = `${travel.cars[0].plate} - ${travel.cars[0].cartype} - ${travel.cars[0].brand} - ${travel.cars[0].model} - ${travel.cars[0].year}`
    let chest = ""
    if (travel.cars[1]) chest = `${travel.cars[1].plate} - ${travel.cars[1].cartype} - ${travel.cars[1].brand} - ${travel.cars[1].model} - ${travel.cars[1].year}`

    let platedesc = travel.cars[0].plate
    let chestdesc = ""
    if (travel.cars[1]) chestdesc = travel.cars[1].plate

    document.querySelector(`[data-status-${travel.cars[0].plate.toLowerCase()}]`).parentNode.innerHTML = `
    2<button data-div-car="${travel.cars[0].plate}" data-status-${travel.cars[0].plate} data-toggle="popover" title="Camion no disponible" type="button" class="btn btn-danger btn-circle btn-sm"></button>`

    if (chest !== "") {
      document.querySelector(`[data-status-${travel.cars[1].plate.toLowerCase()}]`).parentNode.innerHTML = `
      2<button data-div-car="${travel.cars[1].plate}" data-status-${travel.cars[1].plate} data-toggle="popover" title="Camion no disponible" type="button" class="btn btn-danger btn-circle btn-sm"></button>`
    }

    document.querySelector(`[data-status-driver-${travel.id_driver}]`).parentNode.innerHTML = `
    2<button data-div-driver="${travel.id_driver}" data-status-driver-${travel.id_driver} data-toggle="popover" title="Chofér no disponible" type="button" class="btn btn-danger btn-circle btn-sm"></button>`

    document.querySelector('[data-row-travel]').appendChild(View.travel(travel, plate, chest, platedesc, chestdesc))
  })
}

const changeDriver = async (event) => {
  const drivers = [
    { id_driver: "19", plate: 'CFP306', except: ['32', '34', '47', '46'] },
    { id_driver: "10", plate: 'CFP302', except: ['34', '47', '46'] },
    { id_driver: "11", plate: 'CFP305', except: ['34', '47', '46'] },
    { id_driver: "99", plate: 'CFP304', except: ['33', '31'] },
    { id_driver: "16", plate: 'XBRI004', except: [] },
    { id_driver: "14", plate: 'XBRI002', except: [] },
    { id_driver: "13", plate: 'XBRI001', except: [] },
    { id_driver: "18", plate: 'XBRI001', except: ['48'] },
    { id_driver: "15", plate: 'XBRI003', except: [] },
    { id_driver: "17", plate: 'CFC349', except: ['33', '31'] },
    { id_driver: "5", plate: 'CFE129', except: [] },
    { id_driver: "6", plate: 'CFE131', except: [] },
    { id_driver: "2", plate: 'CEV933', except: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '50', '52', '53', '51', '78'] }
  ]

  let favorite = drivers.find(driver => driver.id_driver == event.target.value)

  const cars = document.querySelectorAll('[data-truck] option')
  const chests = document.querySelectorAll('[data-chest] option')

  const chestselect = document.querySelectorAll('[data-chest]')
  chestselect[0].disabled = false

  if (favorite) {
    cars.forEach(async car => {
      if (favorite.plate == car.label) car.selected = true

      chests.forEach(async chest => {
        let obj = favorite.except.find(plate => plate == chest.value)

        if (favorite.except.length > 0) {
          if (obj) {
            chest.disabled = false
          } else {
            chest.disabled = true
          }

        } else {
          const maintenacecars = await Connection.noBody(`carstatus`, 'GET')

          const chests = document.querySelectorAll('[data-chest] option')

          Array.from(chests).forEach(chest => {
            let maintenance = maintenacecars.find(car => chest.value == car.id_car)

            if (maintenance) {
              chest.disabled = true
            } else {
              chest.disabled = false
            }
          })
        }
      })
    })
  } else {
    const maintenacecars = await Connection.noBody(`carstatus`, 'GET')

    const chests = document.querySelectorAll('[data-chest] option')

    Array.from(chests).forEach(chest => {
      let maintenance = maintenacecars.find(car => chest.value == car.id_car)

      if (maintenance) {
        chest.disabled = true
      } else {
        chest.disabled = false
      }
    })
  }
}

const changeCar = async (event) => {
  const cars = [
    { id_driver: "19", id_car: "59", plate: 'CFP306', except: ['32', '34', '47', '46'] },
    { id_driver: "10", id_car: "61", plate: 'CFP302', except: ['34', '47', '46'] },
    { id_driver: "11", id_car: "62", plate: 'CFP305', except: ['34', '47', '46'] },
    { id_driver: "16", id_car: "64", plate: 'XBRI004', except: [] },
    { id_driver: "14", id_car: "69", plate: 'XBRI002', except: [] },
    { id_driver: "18", id_car: "70", plate: 'XBRI001', except: ['48'] },
    { id_driver: "15", id_car: "71", plate: 'XBRI003', except: [] },
    { id_driver: "17", id_car: "57", plate: 'CFC349', except: ['33', '31'] },
    { id_driver: "5", id_car: "68", plate: 'CFE129', except: [] },
    { id_driver: "6", id_car: "67", plate: 'CFE131', except: [] },
    { id_driver: "2", id_car: "20", plate: 'CEV933', except: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '50', '52', '53', '51', '78'] }
  ]

  let favorite = cars.find(car => car.id_car == event.target.value)

  const chests = document.querySelectorAll('[data-chest] option')

  const chestselect = document.querySelectorAll('[data-chest]')
  chestselect[0].disabled = false

  const driver = document.querySelectorAll('[data-driver] option:checked')

  if (favorite) {
    chests.forEach(async chest => {
      let obj = favorite.except.find(plate => plate == chest.value)

      if (favorite.except.length > 0) {
        if (obj) {
          chest.disabled = false
        } else {
          chest.disabled = true
        }
      } else {
        const maintenacecars = await Connection.noBody(`carstatus`, 'GET')

        const chests = document.querySelectorAll('[data-chest] option')

        Array.from(chests).forEach(chest => {
          let maintenance = maintenacecars.find(car => chest.value == car.id_car)

          if (maintenance) {
            chest.disabled = true
          } else {
            chest.disabled = false
          }
        })
      }

    })

    if (driver[0].text === "Chofér") {
      $("#driver").val(favorite.id_driver);
    }
  } else {
    const maintenacecars = await Connection.noBody(`carstatus`, 'GET')

    const chests = document.querySelectorAll('[data-chest] option')

    Array.from(chests).forEach(chest => {
      let maintenance = maintenacecars.find(car => chest.value == car.id_car)

      if (maintenance) {
        chest.disabled = true
      } else {
        chest.disabled = false
      }
    })
  }
}

document.querySelector('#dataTable').addEventListener('click', async (event) => {
  if (event.target && event.target.matches("[data-div-car]")) {
    console.log(event.target.title);

    const plate = event.target.attributes[0].value.toUpperCase()

    let status
    if (event.target.title === 'Camion disponible') {
      status = 2
      event.target.title = `Camion en mantenimiento`
      event.target.classList.remove('btn-success')
      event.target.classList.add('btn-warning')

    } else {
      status = 1
      event.target.title = `Camion disponible`
      event.target.classList.remove('btn-warning')
      event.target.classList.add('btn-success')
    }

    const obj = await Connection.body(`car/${plate}`, { status }, 'PUT')

    console.log(obj.msg);
  }
})

document.querySelector('#dataDriver').addEventListener('click', async (event) => {
  if (event.target && event.target.matches("[data-div-driver]")) {
    console.log(event.target.title);

    const id = event.target.attributes[0].value.toUpperCase()

    let status
    if (event.target.title === 'Chofér disponible') {
      status = 2
      event.target.title = `Chófer temporalmente no disponible`
      event.target.classList.remove('btn-success')
      event.target.classList.add('btn-warning')

    } else {
      status = 1
      event.target.title = `Chofér disponible`
      event.target.classList.remove('btn-warning')
      event.target.classList.add('btn-success')
    }

    const obj = await Connection.body(`driver/${id}`, { status }, 'PUT')

    console.log(obj.msg);
  }
})

document.querySelector('[data-driver]').addEventListener('change', changeDriver, false)
document.querySelector('[data-truck]').addEventListener('change', changeCar, false)

document.querySelector('[data-print]').addEventListener('click', () => {
  $("#dataTable").printThis()
})

document.querySelector('[data-print-travel]').addEventListener('click', () => {
  let input = document.createElement("textarea");
  let now = new Date()

  input.value = `𝐋𝐢𝐬𝐭𝐚𝐝𝐨 𝐝𝐞 𝐕𝐢𝐚𝐣𝐞𝐬 - ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} \n\n`

  const travels = document.querySelector('[data-row-travel]')
  Array.from(travels.children).forEach(travel => {
    input.value += `𝐓𝐢𝐩𝐨: ${travel.children[0].children[0].value} - `
    if (travel.children[1].children[0].value) input.value += `𝐃𝐞𝐬𝐭𝐢𝐧𝐨/𝐎𝐛𝐬: ${travel.children[1].children[0].value} - `
    if (travel.children[2].children[0].value) input.value += `𝐂𝐡𝐨𝐟𝐞𝐫: ${travel.children[2].children[0].value} - `
    input.value += `𝐂𝐚𝐛𝐚𝐥𝐥𝐢𝐭𝐨: ${travel.children[3].children[0].value} - `
    if (travel.children[4].children[0].value) input.value += `𝐅𝐮𝐫𝐠𝐨𝐧: ${travel.children[4].children[0].value} - `
    input.value += `𝐅𝐞𝐜𝐡𝐚: ${travel.children[5].children[0].value} \n\n`
  })

  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  input.remove();

  alert("¡Contenido copiado con éxito!")
})

export const ControllerCar = {
  selectCars
}

