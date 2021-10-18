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
  const now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

  const cars = await Connection.noBody(`cars/${now}`, 'GET')
  const travels = await Connection.noBody(`travel/${now}`, 'GET')

  const drivers = await Connection.noBody('drivers', 'GET')

  travel(travels, cars, drivers)

  let user = JSON.parse(sessionStorage.getItem('user'))

  let data = []

  cars.forEach(car => {
    let status
    if (car.statuscar === 1) {
      status = `<button data-status-${car.plate.toLowerCase()} data-toggle="popover" title="Camion disponible" type="button" class="btn btn-success btn-circle btn-sm"></button>`
    } else {
      status = `<button data-status-${car.plate.toLowerCase()} data-toggle="popover" title="Camion no disponible" type="button" class="btn btn-danger btn-circle btn-sm"></button>`
    }
    const line = [
      car.plate,
      status,
      car.cartype,
      car.brand,
      car.model,
      car.color,
      car.year,
      car.driver,
      car.chassis,
      car.fuel,
      car.departament
    ]

    data.push(line)
  })

  listCars(data)

  let name = user.name.substring(0, (user.name + " ").indexOf(" "))
  let username = document.querySelector('[data-username]')
  username.innerHTML = name
  loading.innerHTML = " "

  document.querySelector('[data-search-date]').value = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
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
      { title: "Color" },
      { title: "Año" },
      { title: "Chofer" },
      { title: "Chassi" },
      { title: "Combustible" },
      { title: "Departamento" }
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

const selectCars = (cars) => {

  cars.map(car => {
    const option = document.createElement('option')
    option.value = car.plate
    option.innerHTML = `${car.plate} - ${car.cartype}</option>`
    document.querySelector('[data-cars]').appendChild(option)
  })

}


const travel = (travels, cars, drivers) => {

  cars.forEach(car => {
    const option = document.createElement('option')
    option.value = car.id_car
    option.innerHTML = `${car.plate}</option>`

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
    let plate = travel.cars[0].plate
    let chest = ""
    if (travel.cars[1]) chest = travel.cars[1].plate

    document.querySelector('[data-row-travel]').appendChild(View.travel(travel, plate, chest))
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
    platedesc: document.querySelector('[data-truck] option:checked').innerHTML,
    chest: event.currentTarget.chest.value,
    chestdesc: document.querySelector('[data-chest] option:checked').innerHTML,
    date: event.currentTarget.date.value,
    datedesc: `${date.getDate() + 1}/${date.getMonth() + 1}/${date.getFullYear()}`,
    period: event.currentTarget.period.value,
    perioddesc: document.querySelector('[data-period] option:checked').innerHTML,
    route: Number(event.currentTarget.route.value),
    routedesc: document.querySelector('[data-route] option:checked').innerHTML,
    driver: event.currentTarget.driver.value,
    driverdesc: document.querySelector('[data-driver] option:checked').innerHTML,
  }

  document.querySelector('[data-form-travel]').reset();

  const obj = await Connection.body('travel', { travel }, 'POST')

  travel.id = obj.id
  const viewDate = document.querySelector('[data-search-date]').value
  const date2 = new Date(viewDate)

  if (date.getTime() === date2.getTime()) {
    let plate = travel.platedesc
    let chest = ""
    if (travel.chest) chest = travel.chestdesc

    document.querySelector('[data-row-travel]').appendChild(View.travel(travel, plate, chest))
    document.querySelector(`[data-status-${travel.platedesc.toLowerCase()}]`).parentNode.innerHTML = `
    <button data-status-${travel.platedesc} data-toggle="popover" title="Camion no disponible" type="button" class="btn btn-danger btn-circle btn-sm"></button>`

    if (travel.chestdesc !== "Furgon") {
      document.querySelector(`[data-status-${travel.chestdesc.toLowerCase()}]`).parentNode.innerHTML = `
      <button data-status-${travel.chestdesc} data-toggle="popover" title="Camion no disponible" type="button" class="btn btn-danger btn-circle btn-sm"></button>`
    }
  }

  loading.innerHTML = " "
  alert(obj.msg)
})


document.querySelector('[data-row-travel]').addEventListener('click', async (event) => {
  if (event.target && event.target.matches("[data-btn-delete]")) {

    const id = event.target.getAttribute('data-id')
    const obj = await Connection.noBody(`travel/${id}`, 'DELETE')

    event.path[3].remove()

    const plate = event.target.getAttribute('data-car')
    const btn = document.querySelector(`[data-status-${plate.toLowerCase()}]`)
    btn.parentNode.innerHTML = `
    <button data-status-${plate} data-toggle="popover" title="Camion disponible" type="button" class="btn btn-success btn-circle btn-sm"></button>`
  
    const chest = event.target.getAttribute('data-chest')
    if(chest){
      const btnchest = document.querySelector(`[data-status-${chest.toLowerCase()}]`)
      btnchest.parentNode.innerHTML = `
      <button data-status-${chest} data-toggle="popover" title="Camion disponible" type="button" class="btn btn-success btn-circle btn-sm"></button>`
    }

    alert(obj.msg)
  }
})


document.querySelector('[data-search-date]').addEventListener('change', async (event) => {
  const date = event.currentTarget.value
  const travels = await Connection.noBody(`travel/${date}`, 'GET')

  listTravels(travels)
})

document.querySelector('[data-search-date]').addEventListener('keypress', async (event) => {
  if (e.keyCode === 13) {
    const date = event.currentTarget.value
    const travels = await Connection.noBody(`travel/${date}`, 'GET')

    listTravels(travels)
  }
})

const listTravels = (travels) => {
  document.querySelector('[data-row-travel]').innerHTML = ""

  travels.forEach(travel => {
    let plate = travel.cars[0].plate
    let chest = ""
    if (travel.cars[1]) chest = travel.cars[1].plate

    document.querySelector('[data-row-travel]').appendChild(View.travel(travel, plate, chest))
  })
}

export const ControllerCar = {
  selectCars
}

