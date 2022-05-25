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

  const now = `${date.getFullYear()}-${(date.getMonth() + 1).toString().length == 1 ? "0" : ""}${date.getMonth() + 1}-${day}`

  const cars = await Connection.noBody(`cars/${now}`, 'GET')
  const travels = await Connection.noBody(`travel/${now}`, 'GET')

  const drivers = await Connection.noBody('drivers', 'GET')

  let data = cars.map(car => {
    let status

    if (car.chassis == null) car.chassis = ""
    if (car.color == null) car.color = ""
    if (car.obs == null) car.obs = ""

    switch (car.statuscar) {
      case 2:
        status = `<button data-div-car="${car.plate.toLowerCase()}" data-status-${car.plate.toLowerCase()} data-toggle="popover" title="Camion en mantenimiento" type="button" style="color:#ffc107" class="btn btn-warning btn-circle btn-sm">3</button>`
        break
      case 1:
        status = `<button data-div-car="${car.plate.toLowerCase()}" data-status-${car.plate.toLowerCase()} data-toggle="popover" title="Camion disponible" type="button" style="color:#157347" class="btn btn-success btn-circle btn-sm">1</button>`
        break
      case 0:
        status = `<button data-div-car="${car.plate.toLowerCase()}" data-status-${car.plate.toLowerCase()} data-toggle="popover" title="Camion no disponible" type="button" style="color:#e02d1b" class="btn btn-danger btn-circle btn-sm">2</button>`
        break
      default:
        status = `<button data-div-car="${car.plate.toLowerCase()}" data-status-${car.plate.toLowerCase()} data-toggle="popover" title="Camion no disponible" type="button" style="color:#e02d1b" class="btn btn-danger btn-circle btn-sm">2</button>`
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
      car.capacity,
      `
      <a><i data-action data-id="${car.id_car}" data-type="${car.cartype}" data-plate="${car.plate}" data-brand="${car.brand}" data-model="${car.model}" data-thirst="${car.thirst}" data-color="${car.color}" data-year="${car.year}" data-obs="${car.obs}" data-fuel="${car.fuel}" data-departament="${car.departament}" data-capacity="${car.capacity}" data-chassis="${car.chassis}" class="btn-edit fas fa-edit"></i></a>
      <a><i data-action data-id="${car.id_car}" data-type="${car.cartype}" data-plate="${car.plate}" data-brand="${car.brand}" data-model="${car.model}" data-thirst="${car.thirst}" data-color="${car.color}" data-year="${car.year}" class="btn-delete fas fa-trash" ></i></a>`,
    ]

    return line
  })

  listCars(data)

  let driverdt = drivers.map(driver => {
    let status
    switch (driver.status) {
      case 1:
        status = `<button data-div-driver="${driver.id}" data-status-driver-${driver.id} data-toggle="popover" title="Chofér disponible" type="button" style="color:#157347" class="btn btn-success btn-circle btn-sm">1</button>`
        break
      case 2:
        status = `<button data-div-driver="${driver.id}" data-status-driver-${driver.id} data-toggle="popover" title="Chófer temporalmente no disponible" type="button" style="color:#ffc107" class="btn btn-warning btn-circle btn-sm">3</button>`
        break
      default:
        status = `<button data-div-driver="${driver.id}" data-status-driver-${driver.id} data-toggle="popover" title="Chofér disponible" type="button" style="color:#157347" class="btn btn-success btn-circle btn-sm">1</button>`
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
      `<form data-obs-driver="${driver.id}"><div class="input-group mb-3"><textarea data-id="${driver.id}" class="form-control" id="obs" name="obs" value="${driver.obs}">${driver.obs}</textarea><button class="btn btn-outline-success" type="submit" >Agregar</button></div></form>`,
      `
      <a><i data-action data-id="${driver.id}" data-name="${driver.name}" data-idcard="${driver.idcard}" data-phone="${driver.phone}" data-classification="${driver.classification}" data-thirst="${driver.thirst}" data-obs="${driver.obs}" class="btn-edit fas fa-edit"></i></a>
      <a><i data-action data-id="${driver.id}" data-name="${driver.name}" class="btn-delete fas fa-trash"></i></a>`,
    ]

    return line
  })

  listDrivers(driverdt)

  travel(travels, drivers)

  loading.innerHTML = " "

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

const editCar = (event) => {

  let tr = event.path[3]
  if (tr.className === "child") tr = tr.previousElementSibling

  let chassis = ""
  let color = ""
  if (event.target.getAttribute('data-chassis') != null) chassis = event.target.getAttribute('data-chassis')
  if (event.target.getAttribute('data-color') != null) color = event.target.getAttribute('data-color')

  let car = {
    id: event.target.getAttribute('data-id'),
    plate: event.target.getAttribute('data-plate'),
    brand: event.target.getAttribute('data-brand'),
    model: event.target.getAttribute('data-model'),
    year: event.target.getAttribute('data-year'),
    thirst: event.target.getAttribute('data-thirst'),
    type: event.target.getAttribute('data-type'),
    color: color,
    chassis: chassis,
    capacity: event.target.getAttribute('data-capacity'),
    fuel: event.target.getAttribute('data-fuel'),
    departament: event.target.getAttribute('data-departament'),
    obs: event.target.getAttribute('data-obs')
  }

  document.querySelector('[data-modal]').innerHTML = ``
  document.querySelector('[data-modal]').appendChild(View.modalEditCar(car))

  $("#cartypeedit").val(car.type)
  $("#fueledit").val(car.fuel)
  $("#departamentedit").val(car.departament)
  $("#thirstedit").val(car.thirst)
  $("#yearedit").val(`${car.year}-01-01`)

  $("#edit").modal('show')

  const modal = document.querySelector('[data-form-edit-car]')
  modal.addEventListener('submit', async (event2) => {
    event2.preventDefault()

    const newCar = {
      plate: event2.currentTarget.plate.value.toUpperCase(),
      brand: event2.currentTarget.brand.value,
      model: event2.currentTarget.model.value,
      cartype: event2.currentTarget.cartype.value,
      color: event2.currentTarget.color.value,
      year: event2.currentTarget.year.value,
      chassis: event2.currentTarget.chassis.value,
      capacity: event2.currentTarget.capacity.value,
      fuel: event2.currentTarget.fuel.value,
      departament: event2.currentTarget.departament.value,
      thirst: event2.currentTarget.thirst.value,
      obs: event2.currentTarget.obs.value
    }

    const obj = await Connection.body(`car/edit/${car.id}`, { car: newCar }, 'PUT')

    const table = $('#dataTable').DataTable()

    table
      .row(tr)
      .remove()
      .draw();

    const rowNode = table
      .row
      .add([
        newCar.plate,
        `<button data-div-car="${newCar.plate.toLowerCase()}" data-status-${newCar.plate.toLowerCase()} data-toggle="popover" title="Camion disponible" type="button" style="color:#157347" class="btn btn-success btn-circle btn-sm">1</button>`,
        newCar.cartype,
        newCar.brand,
        newCar.model,
        newCar.thirst,
        newCar.color,
        newCar.year,
        `<form data-obs="${car.id}"><div class="input-group mb-3"><textarea data-id="${car.id}" class="form-control" id="obs" name="obs" value="${newCar.obs}">${newCar.obs}</textarea><button class="btn btn-outline-success" type="submit" >Agregar</button></div></form>`,
        newCar.chassis,
        newCar.capacity,
        `
        <a><i data-action data-type="${newCar.cartype}" data-plate="${newCar.plate}" data-brand="${newCar.brand}" data-model="${newCar.model}" data-id="${car.id}" data-thirst="${newCar.thirst}" data-color="${newCar.color}" data-year="${newCar.year}" data-obs="${newCar.obs}" data-fuel="${newCar.fuel}" data-capacity="${newCar.capacity}" data-departament="${newCar.departament}" data-chassis="${newCar.chassis}" class="btn-edit fas fa-edit"></i></a>
        <a><i data-action data-id="${car.id}" data-action data-type="${newCar.cartype}" data-plate="${newCar.plate}" data-brand="${newCar.brand}" data-model="${newCar.model}" data-thirst="${newCar.thirst}" data-color="${newCar.color}" data-year="${newCar.year}" class="btn-delete fas fa-trash" ></i></a>`,
      ])
      .draw()
      .node();

    $(rowNode)
      .css('color', 'black')
      .animate({ color: '#4e73df' });

    $("#edit").modal('hide')

    alert(obj.msg)
  })
}


const editDriver = (event) => {

  let tr = event.path[3]
  if (tr.className === "child") tr = tr.previousElementSibling

  let phone = ""
  let idcard = ""
  if (event.target.getAttribute('data-phone') != null) phone = event.target.getAttribute('data-phone')
  if (event.target.getAttribute('data-idcard') != null) idcard = event.target.getAttribute('data-idcard')

  let driver = {
    id: event.target.getAttribute('data-id'),
    name: event.target.getAttribute('data-name'),
    idcard: idcard,
    phone: phone,
    thirst: event.target.getAttribute('data-thirst'),
    type: event.target.getAttribute('data-type'),
    classification: event.target.getAttribute('data-classification'),
    vacation: event.target.getAttribute('data-vacation'),
    obs: event.target.getAttribute('data-obs')
  }

  document.querySelector('[data-modal]').innerHTML = ``
  document.querySelector('[data-modal]').appendChild(View.modalEditDriver(driver))

  $("#classificationedit").val(driver.classification)
  $("#vacationedit").val(driver.vacation)
  $("#typeedit").val(driver.type)
  $("#thirstedit").val(driver.thirst)

  $("#edit").modal('show')

  const modal = document.querySelector('[data-form-edit-driver]')
  modal.addEventListener('submit', async (event2) => {
    event2.preventDefault()

    const newDriver = {
      name: event2.currentTarget.name.value,
      idcard: event2.currentTarget.idcard.value,
      phone: event2.currentTarget.phone.value,
      type: event2.currentTarget.type.value,
      thirst: event2.currentTarget.thirst.value,
      obs: event2.currentTarget.obs.value,
      classification: event2.currentTarget.classification.value,
      vacation: event2.currentTarget.vacation.value
    }

    const obj = await Connection.body(`driver/update/${driver.id}`, { driver: newDriver }, 'PUT')

    const table = $('#dataDriver').DataTable()

    table
      .row(tr)
      .remove()
      .draw();

    const rowNode = table
      .row
      .add([
        newDriver.name,
        `<button data-div-driver="${driver.id}" data-status-driver-${driver.id} data-toggle="popover" title="Chofér disponible" type="button" style="color:#157347" class="btn btn-success btn-circle btn-sm">1</button>`,
        newDriver.idcard,
        newDriver.phone,
        newDriver.type,
        newDriver.thirst,
        `<form data-obs-driver="${driver.id}"><div class="input-group mb-3"><textarea data-id="${driver.id}" class="form-control" id="obs" name="obs" value="${newDriver.obs}">${newDriver.obs}</textarea><button class="btn btn-outline-success" type="submit" >Agregar</button></div></form>`,
        ` <a><i data-action data-classification="${newDriver.classification}" data-obs="${newDriver.obs}" data-vacation="${newDriver.vacation}" data-type="${newDriver.type}" data-driver="" data-name="${newDriver.name.toUpperCase()}" data-idcard="${newDriver.idcard}" data-phone="${newDriver.phone}" data-id="${driver.id}" data-thirst="${newDriver.thirst}" data-obs="${newDriver.obs}" class="btn-edit fas fa-edit"></i></a>
        <a><i data-action data-id="${driver.id}" data-action data-name="${newDriver.name.toUpperCase()}" class="btn-delete fas fa-trash" ></i></a>`
      ])
      .draw()
      .node();

    $(rowNode)
      .css('color', 'black')
      .animate({ color: '#4e73df' });

    $("#edit").modal('hide')

    alert(obj.msg)
  })
}

const deleteCar = (event) => {
  const tr = event.path[3]
  if (tr.className === "child") tr = tr.previousElementSibling

  let car = {
    id: event.target.getAttribute('data-id'),
    plate: event.target.getAttribute('data-plate'),
    cartype: event.target.getAttribute('data-type'),
    model: event.target.getAttribute('data-model'),
    brand: event.target.getAttribute('data-brand'),
    year: event.target.getAttribute('data-year'),
  }

  document.querySelector('[data-modal]').innerHTML = ``
  document.querySelector('[data-modal]').appendChild(View.modalDeleteCar(car))

  $("#deletecar").modal('show')

  const modal = document.querySelector('[data-delete-car]')
  modal.addEventListener('submit', async (event2) => {
    event2.preventDefault()

    const obj = await Connection.noBody(`car/${car.id}`, 'DELETE')

    $('#dataTable').DataTable()
      .row(tr)
      .remove()
      .draw();

    $("#deletecar").modal('hide')

    alert(obj.msg)
  })
}

const deleteDriver = (event) => {
  const tr = event.path[3]
  if (tr.className === "child") tr = tr.previousElementSibling

  let driver = {
    id: event.target.getAttribute('data-id'),
    name: event.target.getAttribute('data-name')
  }

  document.querySelector('[data-modal]').innerHTML = ``
  document.querySelector('[data-modal]').appendChild(View.modalDeleteDriver(driver))

  $("#deletedriver").modal('show')

  const modal = document.querySelector('[data-delete-driver]')
  modal.addEventListener('submit', async (event2) => {
    event2.preventDefault()
    let status = 0

    const obj = await Connection.body(`driver/${driver.id}`, { status }, 'PUT')

    $('#dataDriver').DataTable()
      .row(tr)
      .remove()
      .draw();

    $("#deletedriver").modal('hide')

    alert(obj.msg)
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
      { title: "Observación" },
      { title: "Opciones" },

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

  const action = document.querySelector('#dataDriver')
  action.addEventListener('click', async (event) => {
    if (event.target && event.target.nodeName === "I" && event.target.matches("[data-action]")) {
      if (event.target.classList[0] === 'btn-delete') return deleteDriver(event)
      if (event.target.classList[0] === 'btn-edit') return editDriver(event)
    }
  })

  document.querySelector('[data-filter-driver-local]').addEventListener('change', (event) => {

    $.fn.dataTable.ext.search.push(
      function (settings, data, dataIndex) {
        var filter = $('[data-filter-driver-local]').val()
        var truck = data[5]

        if (filter == 'TODOS') return true
        if (filter == truck) return true
        return false;
      }
    );

    table.draw();
  })

  document.querySelector('[data-filter-driver-status]').addEventListener('change', (event) => {

    table.rows().every(function (index, element) {
      let row = $(this.node());

      if (row[0].children[1].children[0].innerText != event.target.value) {
        row[0].style.display = 'none'
      } else {
        row[0].style.display = ''
      }

      if (event.target.value == "TODOS") row[0].style.display = ''

    });

    table.draw();
  })

  const addDriver = async (event) => {
    event.preventDefault()

    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="d-flex justify-content-center">
      <div class="spinner-grow text-danger" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  `

    const driver = {
      name: event.currentTarget.name.value,
      idcard: event.currentTarget.idcard.value,
      phone: event.currentTarget.phone.value,
      thirst: event.currentTarget.thirst.value,
      type: event.currentTarget.type.value,
      classification: event.currentTarget.classification.value,
      vacation: event.currentTarget.vacation.value,
      obs: event.currentTarget.obs.value
    }

    const obj = await Connection.body('driver', { driver }, 'POST')

    $("#adddriver").modal('hide')

    const rowNode = table
      .row
      .add([
        driver.name.toUpperCase(),
        `<button data-div-driver="${obj.id}" data-status-driver-${obj.id} data-toggle="popover" title="Chofér disponible" type="button" style="color:#157347" class="btn btn-success btn-circle btn-sm">1</button>`,
        driver.idcard,
        driver.phone,
        driver.type,
        driver.thirst,
        `<form data-obs-driver="${obj.id}"><div class="input-group mb-3"><textarea data-id="${obj.id}" class="form-control" id="obs" name="obs" value="${driver.obs}">${driver.obs}</textarea><button class="btn btn-outline-success" type="submit" >Agregar</button></div></form>`,
        ` <a><i data-action data-classification="${driver.classification}" data-obs="${driver.obs}" data-vacation="${driver.vacation}" data-type="${driver.type}" data-driver="" data-name="${driver.name.toUpperCase()}" data-idcard="${driver.idcard}" data-phone="${driver.phone}" data-id="${obj.id}" data-thirst="${driver.thirst}" data-obs="${driver.obs}" class="btn-edit fas fa-edit"></i></a>
        <a><i data-action data-id="${obj.id}" data-action data-name="${driver.name.toUpperCase()}" class="btn-delete fas fa-trash" ></i></a>`
      ])
      .draw()
      .node();

    $(rowNode)
      .css('color', 'black')
      .animate({ color: '#4e73df' });

    loading.innerHTML = ``

    console.log(obj.msg);

  }

  document.querySelector('[data-form-add-driver]').addEventListener('submit', addDriver, false)
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
      { title: "Status" },
      { title: "Vehiculo" },
      { title: "Marca" },
      { title: "Modelo" },
      { title: "SEDE" },
      { title: "Color" },
      { title: "Año" },
      { title: "Observación" },
      { title: "Chassi" },
      { title: "Capacidad" },
      { title: "Opciones" },
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
      'excel'
    ]
  })

  const action = document.querySelector('#dataTable')
  action.addEventListener('click', async (event) => {
    if (event.target && event.target.nodeName === "I" && event.target.matches("[data-action]")) {
      if (event.target.classList[0] === 'btn-delete') return deleteCar(event)
      if (event.target.classList[0] === 'btn-edit') return editCar(event)
    }
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

    table.rows().every(function (index, element) {
      let row = $(this.node());


      if (row[0].children[1].children[0].innerText != event.target.value) {
        row[0].style.display = 'none'
      } else {
        row[0].style.display = ''
      }

      if (event.target.value == "TODOS") row[0].style.display = ''

    });


    table.draw();
  })

  document.querySelector('[data-filter-truck-brand]').addEventListener('change', (event) => {

    table.rows().every(function (index, element) {
      let row = $(this.node());


      if (row[0].children[3].innerText != event.target.value) {
        row[0].style.display = 'none'
      } else {
        row[0].style.display = ''
      }

      if (event.target.value == "TODOS") row[0].style.display = ''

    });


    table.draw();
  })

  document.querySelector('[data-filter-truck-sede]').addEventListener('change', (event) => {

    table.rows().every(function (index, element) {
      let row = $(this.node());


      if (row[0].children[5].innerText != event.target.value) {
        row[0].style.display = 'none'
      } else {
        row[0].style.display = ''
      }

      if (event.target.value == "TODOS") row[0].style.display = ''

    });


    table.draw();
  })

  const addCar = async (event) => {
    event.preventDefault()

    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="d-flex justify-content-center">
      <div class="spinner-grow text-danger" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  `


    const car = {
      plate: event.currentTarget.plate.value.toUpperCase(),
      brand: event.currentTarget.brand.value,
      model: event.currentTarget.model.value,
      type: event.currentTarget.cartype.value,
      color: event.currentTarget.color.value,
      year: event.currentTarget.year.value,
      chassis: event.currentTarget.chassis.value,
      capacity: event.currentTarget.capacity.value,
      fuel: event.currentTarget.fuel.value,
      departament: event.currentTarget.departament.value,
      thirst: event.currentTarget.thirst.value,
      obs: event.currentTarget.obs.value
    }

    const obj = await Connection.body('car', { car }, 'POST')

    $("#addcar").modal('hide')

    const rowNode = table
      .row
      .add([
        car.plate,
        `<button data-div-car="${car.plate.toLowerCase()}" data-status-${car.plate.toLowerCase()} data-toggle="popover" title="Camion disponible" type="button" style="color:#157347" class="btn btn-success btn-circle btn-sm">1</button>`,
        car.type,
        car.brand,
        car.model,
        car.thirst,
        car.color,
        car.year,
        `<form data-obs="${obj.id}"><div class="input-group mb-3"><textarea data-id="${obj.id}" class="form-control" id="obs" name="obs" value="${car.obs}">${car.obs}</textarea><button class="btn btn-outline-success" type="submit" >Agregar</button></div></form>`,
        car.chassis,
        car.capacity,
        `
        <a><i data-action data-type="${car.type}" data-driver="" data-plate="${car.plate}" data-brand="${car.brand}" data-model="${car.model}" data-id="${obj.id}" data-thirst="${car.thirst}" data-color="${car.color}" data-year="${car.year}" data-obs="${car.obs}" data-fuel="${car.fuel}" data-departament="${car.departament}" data-chassis="${car.chassis}" class="btn-edit fas fa-edit"></i></a>
        <a><i data-action data-id="${obj.id}" data-action data-type="${car.type}" data-plate="${car.plate}" data-brand="${car.brand}" data-model="${car.model}" data-id="${obj.id}" data-thirst="${car.thirst}" data-color="${car.color}" data-year="${car.year}" class="btn-delete fas fa-trash" ></i></a>`,
      ])
      .draw()
      .node();

    $(rowNode)
      .css('color', 'black')
      .animate({ color: '#4e73df' });

    loading.innerHTML = ``

    console.log(obj.msg);
  }

  document.querySelector('[data-form-add-car]').addEventListener('submit', addCar, false)

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


const travel = (travels, drivers) => {

  drivers.forEach(driver => {
    const option = document.createElement('option')
    option.value = driver.id
    option.innerHTML = driver.name
    option.setAttribute('data-idcard', driver.idcard)
    if (driver.name !== "SIN ASIGNACION") document.querySelector('[data-driver]').appendChild(option)

    const option2 = document.createElement('option')
    option2.value = driver.id
    option2.innerHTML = driver.name
    option2.setAttribute('data-idcard', driver.idcard)
    if (driver.name !== "SIN ASIGNACION") document.querySelector('[data-company]').appendChild(option2)
  })

  travels.forEach(travel => {
    let plate = `${travel.cars[0].plate} - ${travel.cars[0].cartype} - ${travel.cars[0].brand} - ${travel.cars[0].model} - ${travel.cars[0].year}`
    let platedesc = travel.cars[0].plate
    let chest = ""
    let carchestdesc = ""
    if (travel.cars[1]) carchestdesc = travel.cars[1].plate
    if (travel.cars[1]) chest = `${travel.cars[1].plate} - ${travel.cars[1].cartype} - ${travel.cars[1].brand} - ${travel.cars[1].model} - ${travel.cars[1].year}`

    if (travel.type === "Mantenimiento" || travel.type === "Region Metropolitana") {
      document.querySelector(`[data-status-${travel.cars[0].plate.toLowerCase()}]`).parentNode.innerHTML = `
  <button data-div-car="${travel.cars[0].plate}" data-status-${travel.cars[0].plate} data-toggle="popover" title="Camion en Mantenimiento Programado" type="button" style="border-color: #ff9855; background-color: #ff8c00; color: #ff8c00" class="btn btn-warning btn-circle btn-sm">3</button>`

      if (chest !== "") {
        document.querySelector(`[data-status-${travel.cars[1].plate.toLowerCase()}]`).parentNode.innerHTML = `
    <button data-div-car="${travel.cars[1].plate}" data-status-${travel.cars[1].plate} data-toggle="popover" title="Camion en Mantenimiento Programado" type="button" style="border-color: #ff9855; background-color: #ff8c00; color: #ff8c00" class="btn btn-warning btn-circle btn-sm">3</button>`
      }

      document.querySelector('[data-row-travel]').appendChild(View.maintenance(travel, plate, chest, platedesc, carchestdesc))

    } else {
      document.querySelector(`[data-status-${travel.cars[0].plate.toLowerCase()}]`).parentNode.innerHTML = `
  <button data-div-car="${travel.cars[0].plate}" data-status-${travel.cars[0].plate} data-toggle="popover" title="Camion no disponible" type="button" style="color:#e02d1b" class="btn btn-danger btn-circle btn-sm">2</button>`

      if (chest !== "") {
        document.querySelector(`[data-status-${travel.cars[1].plate.toLowerCase()}]`).parentNode.innerHTML = `
    <button data-div-car="${travel.cars[1].plate}" data-status-${travel.cars[1].plate} data-toggle="popover" title="Camion no disponible" type="button" style="color:#e02d1b" class="btn btn-danger btn-circle btn-sm">2</button>`
      }

      document.querySelector('[data-row-travel]').appendChild(View.travel(travel, plate, chest, platedesc, carchestdesc))

    }

    let driverdiv = document.querySelector(`[data-status-driver-${travel.id_driver}]`)
    if (driverdiv != undefined && travel.driverdesc !== "") {
      document.querySelector(`[data-status-driver-${travel.id_driver}]`).parentNode.innerHTML = `
      <button data-div-driver="${travel.id_driver}" data-status-driver-${travel.id_driver} data-toggle="popover" title="Chofér no disponible" type="button" style="color:#e02d1b" class="btn btn-danger btn-circle btn-sm">2</button>`
    }

  })
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
  const date = new Date(event.currentTarget.date.value)

  let capacity
  if (document.querySelector('[data-truck] option:checked').getAttribute('data-capacity') > 0) {
    capacity = document.querySelector('[data-truck] option:checked').getAttribute('data-capacity')
  } else {
    capacity = document.querySelector('[data-chest] option:checked').getAttribute('data-capacity')
  }

  let travel = {
    name: document.querySelector('[data-username]').innerText,
    plate: event.currentTarget.car.value,
    cardesc: document.querySelector('[data-truck] option:checked').innerHTML,
    platedesc: document.querySelector('[data-truck] option:checked').getAttribute('data-plate'),
    chest: event.currentTarget.chest.value,
    carchestdesc: document.querySelector('[data-chest] option:checked').innerHTML,
    chestdesc: document.querySelector('[data-chest] option:checked').getAttribute('data-plate'),
    capacity: capacity,
    date: event.currentTarget.date.value,
    datedesc: `${date.getDate() + 1}/${date.getMonth() + 1}/${date.getFullYear()}`,
    period: event.currentTarget.period.value,
    perioddesc: document.querySelector('[data-period] option:checked').innerHTML,
    origin: Number(event.currentTarget.origin.value),
    origindesc: document.querySelector('[data-origin] option:checked').innerHTML,
    route: Number(event.currentTarget.route.value),
    routedesc: document.querySelector('[data-route] option:checked').innerHTML,
    delivery: Number(event.currentTarget.delivery.value),
    deliverydesc: document.querySelector('[data-delivery] option:checked').innerHTML,
    driver: event.currentTarget.driver.value,
    idcard: document.querySelector('[data-driver] option:checked').getAttribute('data-idcard'),
    type: event.currentTarget.type.value,
    typedesc: document.querySelector('#type option:checked').innerHTML,
    driverdesc: document.querySelector('[data-driver] option:checked').innerHTML,
    company: event.currentTarget.company.value,
    companydesc: document.querySelector('[data-company] option:checked').innerHTML,
    companyidcard: document.querySelector('[data-company] option:checked').getAttribute('data-idcard'),
    obs: event.currentTarget.obs.value
  }

  if (travel.driverdesc === "Chofér") {
    travel.driverdesc = ""
    travel.driver = null
  }

  if (travel.companydesc === "Acompañante") {
    travel.companydesc = ""
    travel.company = null
  }

  if (travel.routedesc === "Punto de Retiro") {
    travel.routedesc = ""
    travel.route = null
  }

  if (travel.deliverydesc === "Punto de Entrega") {
    travel.deliverydesc = ""
    travel.route = null
  }

  if (travel.chestdesc == "Furgon" || travel.chestdesc == null) {
    travel.chestdesc = ""
  }

  document.querySelector('[data-form-travel]').reset();

  const obj = await Connection.body('travel', { travel }, 'POST')

  travel.id = obj.id
  const date2 = new Date(`${document.querySelector('[data-search-date]').value}T12:00`)

  if (`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}` === `${date2.getDate()}/${date2.getMonth() + 1}/${date2.getFullYear()}`) {
    let plate = travel.cardesc
    let chest = ""
    if (travel.chest) chest = travel.carchestdesc

    if (travel.type == 3 || travel.type == 4) {
      travel.type = travel.typedesc
      document.querySelector('[data-row-travel]').appendChild(View.maintenance(travel, plate, chest, travel.platedesc, travel.chestdesc))
    } else {
      document.querySelector('[data-row-travel]').appendChild(View.addtravel(travel, plate, chest, travel.platedesc, travel.chestdesc))
    }
    document.querySelector(`[data-status-${travel.platedesc.toLowerCase()}]`).parentNode.innerHTML = `
    <button data-div-car="${travel.platedesc}" data-status-${travel.platedesc} data-toggle="popover" title="Camion no disponible" type="button" style="color:#e02d1b" class="btn btn-danger btn-circle btn-sm">2</button>`


    if (travel.driverdesc !== "" && travel.driverdesc !== "Chofér") {
      document.querySelector(`[data-status-driver-${travel.driver}]`).parentNode.innerHTML = `
      <button data-div-driver="${travel.driver}" data-status-driver-${travel.driver} data-toggle="popover" title="Chofér no disponible" type="button" style="color:#e02d1b" class="btn btn-danger btn-circle btn-sm">2</button>`
    }

    if (travel.chestdesc !== "" && travel.chestdesc !== null) {
      document.querySelector(`[data-status-${travel.chestdesc.toLowerCase()}]`).parentNode.innerHTML = `
      <button data-div-car="${travel.chestdesc}" data-status-${travel.chestdesc} data-toggle="popover" title="Camion no disponible" type="button" style="color:#e02d1b" class="btn btn-danger btn-circle btn-sm">2</button>`
    }
  }

  loading.innerHTML = " "
})

const deleteTravel = async (event) => {
  const id = event.target.getAttribute('data-id')
  const obj = await Connection.noBody(`travel/${id}`, 'DELETE')

  event.path[3].remove()

  const plate = event.target.getAttribute('data-car')
  const id_driver = event.target.getAttribute('data-iddriver')
  document.querySelector(`[data-status-${plate.toLowerCase()}]`).parentNode.innerHTML = `
  <button data-div-car="${plate}" data-status-${plate} data-toggle="popover" title="Camion disponible" type="button" style="color:#157347" class="btn btn-success btn-circle btn-sm">1</button>`

  if (id_driver != "null" && id_driver != null) {
    document.querySelector(`[data-status-driver-${id_driver}]`).parentNode.innerHTML = `
    <button data-div-car data-status-driver-${id_driver} data-toggle="popover" title="Chofér disponible" type="button" style="color:#157347" class="btn btn-success btn-circle btn-sm">1</button>`
  }

  const chest = event.target.getAttribute('data-chest')
  if (chest !== "null" && chest !== "") {
    document.querySelector(`[data-status-${chest.toLowerCase()}]`).parentNode.innerHTML = `
    <button data-div-car="${chest}" data-status-${chest} data-toggle="popover" title="Camion disponible" type="button" style="color:#157347" class="btn btn-success btn-circle btn-sm">1</button>`
  }

  document.querySelector('[data-form-travel]').reset();

  alert(obj.msg)
}

const generate = async (event) => {
  const id_car = event.target.getAttribute('data-id_car')
  const origin = event.target.getAttribute('data-origin')
  const route = event.target.getAttribute('data-route')
  const delivery = event.target.getAttribute('data-delivery')
  const truck = event.target.getAttribute('data-truck')
  const chest = event.target.getAttribute('data-chest')

  const type = event.target.getAttribute('data-type')
  const id_travel = event.target.getAttribute('data-id_travel')

  const obj = await Connection.noBody(`travelreport/${id_car}/${type}/${origin}/${route}/${delivery}/${id_travel}`, 'GET')
  obj.travel.truck = truck

  let content = ""

  if (obj.travel.typecode == 2) {
    content = `
  <div class="form-group text-right col-12">
    <button type="button" data-add-description class="btn btn-circle btn-success btn-sm"><i class="fa fa-plus"></i></button>
</div>
<div class="form-row mb-2 shadow p-3 bg-body rounded" data-descriptions>
    <div class="form-group col-6">
        <label>Obs</label>
    </div>
    <div class="form-group col-3">
        <label>Referencia Nro</label>
    </div>
    <div class="form-group col-3">
        <label>Contenedor Nro</label>
    </div>
</div>`
  }

  document.querySelector('[data-modal]').innerHTML = ""
  document.querySelector('[data-modal]').appendChild(View.modalGenerate(obj, content))

  const viatico = (concept) => {
    const divconcept = document.querySelector('[data-concepts]')

    const div1 = document.createElement('div')
    div1.classList.add('form-group', 'col-1')
    if (concept && concept.id) {
      div1.innerHTML = `<button data-id="${concept.id}" data-delete-concept type="button" class="btn btn-circle btn-danger btn-sm">X</button>`
    } else {
      div1.innerHTML = `<button data-delete-concept type="button" class="btn btn-circle btn-danger btn-sm">X</button>`
    }

    const div2 = document.createElement('div')
    div2.classList.add('form-group', 'col-7')
    if (concept && concept.description) {
      div2.innerHTML = `<input data-id="${concept.id}" value="${concept.description}" placeholder="Insira lo concepto" id="addconcept" name="description" type="text" class="form-control" required>`
    } else {
      div2.innerHTML = `<input placeholder="Insira lo concepto" id="addconcept" name="description" type="text" class="form-control" required>`
    }

    const div3 = document.createElement('div')
    div3.classList.add('form-group', 'col-4')
    if (concept && concept.value) {
      div3.innerHTML = `<input value="${parseFloat(concept.value).toFixed(3)}" placeholder="Insira lo valor" id="addvalue" name="value" type="number" step="1.000" class="form-control" required>`
    } else {
      div3.innerHTML = `<input placeholder="Insira lo valor" id="addvalue" name="value" type="number" step="1.000" class="form-control" required>`
    }

    divconcept.appendChild(div1)
    divconcept.appendChild(div2)
    divconcept.appendChild(div3)
  }

  const contenedor = (concept) => {
    const divconcept = document.querySelector('[data-descriptions]')

    const div = document.createElement('div')
    div.classList.add('form-group', 'col-1')
    if (concept && concept.id) {
      div.innerHTML = `<button data-id="${concept.id}" data-delete-concept type="button" class="btn btn-circle btn-danger btn-sm">X</button>`
    } else {
      div.innerHTML = `<button data-delete-concept type="button" class="btn btn-circle btn-danger btn-sm">X</button>`
    }

    const div1 = document.createElement('div')
    div1.classList.add('form-group', 'col-5')
    if (concept && concept.description) {
      div1.innerHTML = `<textarea data-id="${concept.id}" id="adddescription" name="description" placeholder="Agregue la observación" type="text" rows="1" class="form-control" required>${concept.description}</textarea>`
    } else {
      div1.innerHTML = `<textarea id="adddescription" name="description" placeholder="Agregue la observación" type="text" rows="1" class="form-control" required></textarea>`
    }

    const div2 = document.createElement('div')
    div2.classList.add('form-group', 'col-3')
    div2.innerHTML = `<input id="addrefnro" name="refnro" placeholder="Referencia Nro" type="text" class="form-control">`

    const div3 = document.createElement('div')
    div3.classList.add('form-group', 'col-3')
    div3.innerHTML = `<input id="addcontnro" name="contnro" placeholder="Contenedor Nro" type="text" class="form-control">`


    divconcept.appendChild(div)
    divconcept.appendChild(div1)
    divconcept.appendChild(div2)
    divconcept.appendChild(div3)
  }

  document.querySelector('[data-add-concept]').addEventListener('click', viatico, false)
  if (obj.travel.typecode == 2) {
    document.querySelector('[data-add-description]').addEventListener('click', contenedor, false)
    document.querySelector('[data-descriptions]').addEventListener('click', (event) => {
      if (event.target && event.target.matches('[data-delete-concept]')) {
        const id = event.target.getAttribute('data-id')

        if (document.querySelector('[data-descriptions]').children.length == 7) return alert('Minímo de 1 concepto por informe.')

        if (event.target.matches('[data-id]')) Connection.noBody(`travelreport/${id}`, 'DELETE')

        event.path[1].nextElementSibling.nextElementSibling.nextElementSibling.remove()
        event.path[1].nextElementSibling.nextElementSibling.remove()
        event.path[1].nextElementSibling.remove()
        event.path[1].remove()

      }
    })
  }

  document.querySelector('[data-concepts]').addEventListener('click', (event) => {
    if (event.target && event.target.matches('[data-delete-concept]')) {
      const id = event.target.getAttribute('data-id')

      if (document.querySelector('[data-concepts]').children.length == 5) return alert('Minímo de 1 concepto por informe.')

      if (event.target.matches('[data-id]')) Connection.noBody(`travelreport/${id}`, 'DELETE')

      event.path[1].nextElementSibling.nextElementSibling.remove()
      event.path[1].nextElementSibling.remove()
      event.path[1].remove()
    }
  })

  document.querySelector('[data-concepts]').addEventListener('keyup', (event) => {
    if (event.target && event.target.matches('#addvalue')) {
      let amount
      if (document.querySelectorAll('#addvalue').length == 1) {
        amount = document.querySelector('#addvalue').value
      } else {
        amount = Array.from(document.querySelectorAll('#addvalue')).reduce((x, y) => {
          if (x.value === "") x.value = 0;
          if (y.value === "") y.value = 0;
          let a = 0.000
          let b = 0.000
          if (x.value) {
            a = parseFloat(x.value.toLocaleString('es'))
          } else {
            a = x
          }

          if (y.value) b = parseFloat(y.value.toLocaleString('es'))

          return a + b
        })
      }

      document.querySelector('#amount').value = parseFloat(amount).toFixed(3)
    }
  })

  if (obj.travelreport && obj.travelreport.details) {
    obj.travelreport.details.forEach(detail => {
      if (detail.type == 1) {
        viatico(detail)
      } else {
        contenedor(detail)
      }

      let amount = 0;
      if (document.querySelectorAll('#addvalue').length == 1) {
        amount = document.querySelector('#addvalue').value
      } else {
        let arr = document.querySelectorAll('#addvalue')
        if (arr.length > 0) {
          amount = Array.from(arr).reduce((x, y) => {
            let a = 0.000
            let b = 0.000

            if (x.value) {
              a = parseFloat(x.value)
            } else {
              a = x
            }

            if (y.value) b = parseFloat(y.value)

            return a + b
          })
        } else {
          amount = 0
        }
      }

      document.querySelector('#amount').value = parseFloat(amount).toFixed(3)
    })
  } else {
    viatico()
    if (obj.travel.typecode == 2) contenedor()
  }


  $("#generate").modal('show')

  document.querySelector('[data-form-generate]').addEventListener('submit', async (event2) => {
    event2.preventDefault()

    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="d-flex justify-content-center">
      <div class="spinner-grow text-danger" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  `

    let dateTravel = event2.currentTarget.date.value;
    let origindesc = event2.currentTarget.origin.value;
    let routedesc = event2.currentTarget.route.value;
    let deliverydesc = event2.currentTarget.delivery.value;
    let truck = event2.currentTarget.truck.value;
    let driver = event2.currentTarget.driver.value;
    let amount = event2.currentTarget.amount.value;
    let companion_name = event2.currentTarget.companion.value;
    let companion_idcard = event2.currentTarget.companion.getAttribute('data-idcard');
    let idcard = event2.currentTarget.driver.getAttribute('data-idcard');
    let descriptions = "";
    let concepts = "";
    let name = "default";
    let date = new Date();

    obj.travel.typecode == 1 ? name = "Viatico" : name = "Contenedor";

    let selectconcept = document.querySelectorAll('#addconcept');
    concepts = Array.from(selectconcept).map(el => {
      let id = 0;
      let type = 1;
      if (el.getAttribute('data-id')) id = el.getAttribute('data-id');

      return {
        id,
        type,
        comment: el.value,
        value: el.offsetParent.nextElementSibling.children[0].value
      }
    });

    let selectdescription = document.querySelectorAll('#adddescription')
    descriptions = Array.from(selectdescription).map(el => {
      let id = 0
      let type = 2
      if (el.getAttribute('data-id')) id = el.getAttribute('data-id')

      return {
        id,
        type,
        comment: el.value,
        value: "",
        refnro: el.offsetParent.nextElementSibling.children[0].value,
        contnro: el.offsetParent.nextElementSibling.nextElementSibling.children[0].value,
      }
    });


    const travel = {
      typedesc: obj.travel.type,
      type: obj.travel.typecode,
      origin: obj.travel.origin,
      route: obj.travel.route,
      delivery: obj.travel.delivery,
      companion_name,
      companion_idcard,
      id_car,
      descriptions,
      concepts,
      name,
      driver,
      idcard,
      amount,
      dateTravel,
      origindesc,
      routedesc,
      deliverydesc,
      truck,
      chest,
      datereg: `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }

    let plateTruck = truck.split("-");

    $("#generate").modal('hide');
    try {
      const objres = await Connection.backFile('travelreport', { travel }, 'POST');
      let xlsFile = await objres.blob()
      let a = document.createElement('a');
      a.href = window.URL.createObjectURL(xlsFile);
      a.target = "_blank";
      a.download = `${name}_${plateTruck[0]}_${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}.docx`
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      loading.innerHTML = ``;
    } catch (error) {
      loading.innerHTML = ``;
    }
  })
}



document.querySelector('[data-row-travel]').addEventListener('click', async (event) => {
  if (event.target && event.target.matches("[data-btn-delete]")) return deleteTravel(event);

  if (event.target && event.target.matches("[data-btn-generate]")) return generate(event);

})

const enable = async () => {

  document.querySelector('[data-driver]').disabled = true;
  document.querySelector('[data-truck]').disabled = true;
  document.querySelector('[data-chest]').disabled = true;
  document.querySelector('[data-route]').disabled = true;
  document.querySelector('[data-company]').disabled = true;
  document.querySelector('[data-delivery]').disabled = true;

  const date = document.querySelector('[data-date]').value;
  const period = document.querySelector('[data-period]').value;
  const type = document.querySelector('[data-type]').value;


  if (!date && type) return alert("¡Seleccione una fecha valida!");
  if (!period && type) return alert("¡Seleccione un período válido!");
  if (!type) return false;

  let loading = document.querySelector('[data-loading]');
  loading.innerHTML = `
  <div class="d-flex justify-content-center">
    <div class="spinner-grow text-danger" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>`;

  const cars = await Connection.noBody(`cars/enable/${date}/${period}`, 'GET');
  const drivers = await Connection.noBody(`drivers/enable/${date}/${period}`, 'GET');

  document.querySelector('[data-driver]').innerHTML = `<option value="" selected disabled>Chofér</option>`;
  drivers.forEach(driver => {
    const option = document.createElement('option');
    option.value = driver.id;
    option.innerHTML = driver.name;
    if (driver.name !== "SIN ASIGNACION") document.querySelector('[data-driver]').appendChild(option);

    const option2 = document.createElement('option');
    option2.value = driver.id;
    option2.innerHTML = driver.name;
    if (driver.name !== "SIN ASIGNACION") document.querySelector('[data-company]').appendChild(option2);
  })

  document.querySelector('[data-truck]').innerHTML = `<option value="" selected disabled>Camion</option>`;
  document.querySelector('[data-chest]').innerHTML = `<option value="" selected disabled>Furgon</option>`;

  cars.forEach(car => {
    const option = document.createElement('option');
    option.value = car.id_car;
    option.dataset.plate = car.plate;
    option.innerHTML = `${car.plate} - ${car.cartype} - ${car.brand} - ${car.model} - ${car.year}</option>`;

    if (car.capacity > 0) option.dataset.capacity = car.capacity;

    if (car.cartype === "FURGON" || car.cartype === "SEMI REMOLQUE") {
      document.querySelector('[data-chest]').appendChild(option);
    } else {
      document.querySelector('[data-truck]').appendChild(option);
    }
  })

  if (document.querySelector('[data-type]').value == 3 || document.querySelector('[data-type]').value == 4) {
    document.querySelector('[data-obs]').required = true;
    document.querySelector('[data-obs]').style.display = 'block';
    document.querySelector('[data-route]').required = false;
    document.querySelector('[data-route]').style.display = 'none';

    if (document.querySelector('[data-type]').value == 4) {
      document.querySelector('[data-obs]').placeholder = 'Detalles de la entrega';
      document.querySelector('[data-driver]').disabled = false;

    } else {
      document.querySelector('[data-obs]').placeholder = 'Observación del Mantenimiento';
    }

  } else {
    document.querySelector('[data-route]').required = true;
    document.querySelector('[data-obs]').required = false;
    document.querySelector('[data-driver]').disabled = false;
    document.querySelector('[data-route]').disabled = false;
    document.querySelector('[data-obs]').style.display = 'none';
    document.querySelector('[data-route]').style.display = 'block';
  }

  document.querySelector('[data-company]').disabled = false;
  document.querySelector('[data-truck]').disabled = false;
  document.querySelector('[data-chest]').disabled = false;
  document.querySelector('[data-route]').disabled = false;
  document.querySelector('[data-delivery]').disabled = false;
  loading.innerHTML = " ";
}

document.querySelector('[data-type]').addEventListener('change', enable, false);
document.querySelector('[data-period]').addEventListener('change', enable, false);
document.querySelector('[data-date]').addEventListener('change', enable, false);


document.querySelector('[data-search-date]').addEventListener('change', async (event) => {

  const cars = document.querySelectorAll('[data-div-car]');
  Array.from(cars).forEach(car => {
    if (car.title === 'Camion no disponible') {
      car.title = `Camion disponible`;
      car.classList.remove('btn-danger');
      car.classList.add('btn-success');
    }
  })

  const drivers = document.querySelectorAll('[data-div-driver]');
  Array.from(drivers).forEach(driver => {
    if (driver.title === 'Chofér no disponible') {
      driver.title = `Chofér disponible`;
      driver.classList.remove('btn-danger');
      driver.classList.add('btn-success');
    }
  })

  document.querySelector('[data-form-travel]').reset();
  document.querySelector('[data-driver]').disabled = true;
  document.querySelector('[data-truck]').disabled = true;
  document.querySelector('[data-chest]').disabled = true;
  document.querySelector('[data-route]').disabled = true;
  document.querySelector('[data-company]').disabled = true;
  document.querySelector('[data-delivery]').disabled = true;

  const date = event.currentTarget.value;
  const travels = await Connection.noBody(`travel/${date}`, 'GET');

  listTravels(travels)
})

document.querySelector('[data-search-date]').addEventListener('keypress', async (event) => {
  if (e.keyCode === 13) {

    const cars = document.querySelectorAll('[data-div-car]');
    Array.from(cars).forEach(car => {
      if (car.title === 'Camion no disponible') {
        car.title = `Camion disponible`;
        car.classList.remove('btn-danger');
        car.classList.add('btn-success');
      }
    })


    const drivers = document.querySelectorAll('[data-div-driver]');
    Array.from(drivers).forEach(driver => {
      if (driver.title === 'Chofér no disponible') {
        driver.title = `Chofér disponible`;
        driver.classList.remove('btn-danger');
        driver.classList.add('btn-success');
      }
    })

    document.querySelector('[data-form-travel]').reset();
    document.querySelector('[data-driver]').disabled = true;
    document.querySelector('[data-truck]').disabled = true;
    document.querySelector('[data-chest]').disabled = true;
    document.querySelector('[data-route]').disabled = true;
    document.querySelector('[data-company]').disabled = true;
    document.querySelector('[data-delivery]').disabled = true;

    const date = event.currentTarget.value;
    const travels = await Connection.noBody(`travel/${date}`, 'GET');

    listTravels(travels);
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
    <button data-div-car="${travel.cars[0].plate}" data-status-${travel.cars[0].plate} data-toggle="popover" title="Camion no disponible" style="color:#e02d1b" type="button" class="btn btn-danger btn-circle btn-sm">2</button>`

    if (chest !== "") {
      document.querySelector(`[data-status-${travel.cars[1].plate.toLowerCase()}]`).parentNode.innerHTML = `
      <button data-div-car="${travel.cars[1].plate}" data-status-${travel.cars[1].plate} data-toggle="popover" title="Camion no disponible" style="color:#e02d1b" type="button" class="btn btn-danger btn-circle btn-sm">2</button>`
    }

    let driverdiv = document.querySelector(`[data-status-driver-${travel.id_driver}]`)

    if (driverdiv && driverdiv != undefined) document.querySelector(`[data-status-driver-${travel.id_driver}]`).parentNode.innerHTML = `
    <button data-div-driver="${travel.id_driver}" data-status-driver-${travel.id_driver} data-toggle="popover" title="Chofér no disponible" style="color:#e02d1b" type="button" class="btn btn-danger btn-circle btn-sm">2</button>`

    if (travel.typecode == 3 || travel.typecode == 4) document.querySelector('[data-row-travel]').appendChild(View.maintenance(travel, plate, chest, platedesc, chestdesc))

    document.querySelector('[data-row-travel]').appendChild(View.travel(travel, plate, chest, platedesc, chestdesc))
  })
}

const changeCar = async (event) => {
  const cars = [
    // { id_driver: "19", id_car: "59", plate: 'CFP306', except: ['32', '34', '47', '46'] },
    // { id_driver: "10", id_car: "61", plate: 'CFP302', except: ['34', '47', '46'] },
    // { id_driver: "11", id_car: "62", plate: 'CFP305', except: ['34', '47', '46'] },
    // { id_driver: "16", id_car: "64", plate: 'XBRI004', except: [] },
    // { id_driver: "14", id_car: "69", plate: 'XBRI002', except: [] },
    // { id_driver: "18", id_car: "70", plate: 'XBRI001', except: ['48'] },
    // { id_driver: "15", id_car: "71", plate: 'XBRI003', except: [] },
    // { id_driver: "5", id_car: "68", plate: 'CFE129', except: [] },
    // { id_driver: "6", id_car: "67", plate: 'CFE131', except: [] },
    // { id_driver: "2", id_car: "20", plate: 'CEV933', except: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '50', '52', '53', '51', '78'] }
  ]

  let favorite = cars.find(car => car.id_car == event.target.value)

  const chests = document.querySelectorAll('[data-chest] option')

  const chestselect = document.querySelectorAll('[data-chest]')
  chestselect[0].disabled = false

  const driver = document.querySelectorAll('[data-driver] option:checked')

  chests.forEach(async chest => {
    let obj = true
    if (favorite) obj = favorite.except.find(plate => plate == chest.value)

    if (!obj) {
      if (document.querySelector('[data-chest] option:checked').value == chest.value) chests[0].selected = true
      chest.style.display = 'none'
    } else {
      chest.style.display = 'block'
    }
  })

  if (driver[0].text === "Chofér" && favorite) {
    $("#driver").val(favorite.id_driver);
  }
}

document.querySelector('#dataTable').addEventListener('click', async (event) => {
  if (event.target && event.target.matches("[data-div-car]")) {
    console.log(event.target.title);

    const plate = event.target.attributes[0].value.toUpperCase();

    let status;
    if (event.target.title === 'Camion disponible') {
      status = 2
      event.target.title = `Camion en mantenimiento`;
      event.target.classList.remove('btn-success');
      event.target.classList.add('btn-warning');

    } else {
      status = 1
      event.target.title = `Camion disponible`;
      event.target.classList.remove('btn-warning');
      event.target.classList.add('btn-success');
    }

    const obj = await Connection.body(`car/${plate}`, { status }, 'PUT');

    console.log(obj.msg);
  }
})

document.querySelector('[data-truck]').addEventListener('change', changeCar, false)

document.querySelector('[data-print]').addEventListener('click', () => {
  $("#dataTable").printThis()
})

document.querySelector('[data-print-travel]').addEventListener('click', () => {
  let input = document.createElement("textarea");
  let now = new Date()

  input.value = `𝐈𝐧𝐟𝐨𝐫𝐦𝐞 𝐎𝐩𝐞𝐫𝐚𝐜𝐢𝐨𝐧𝐚𝐥 𝐝𝐞 𝐋𝐨𝐠í𝐬𝐭𝐢𝐜𝐚\n 𝐂𝐥𝐢𝐞𝐧𝐭𝐞: Sunset\n 𝐋𝐢𝐬𝐭𝐚𝐝𝐨 𝐝𝐞 𝐕𝐢𝐚𝐣𝐞𝐬 - ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()} \n\n`


  if (document.querySelector('[data-filter-travel-type] :checked').value != 'Todos' || document.querySelector('[data-filter-travel-route] :checked').value != 'Todos' || document.querySelector('[data-filter-travel-trucktype] :checked').value != 'Todos') {
    input.value += '𝐅𝐢𝐥𝐭𝐫𝐨𝐬\n'
    if (document.querySelector('[data-filter-travel-type] :checked').value != 'Todos') input.value += `𝐓𝐢𝐩𝐨 𝐝𝐞𝐥 𝐕𝐢𝐚𝐣𝐞: ${document.querySelector('[data-filter-travel-type] :checked').innerText}\n`
    if (document.querySelector('[data-filter-travel-route] :checked').value != 'Todos') input.value += `𝐃𝐞𝐬𝐭𝐢𝐧𝐨: ${document.querySelector('[data-filter-travel-route] :checked').innerText}\n`
    if (document.querySelector('[data-filter-travel-trucktype] :checked').value != 'Todos') input.value += `𝐓𝐢𝐩𝐨 𝐝𝐞𝐥 𝐂𝐚𝐦𝐢𝐨𝐧: ${document.querySelector('[data-filter-travel-trucktype] :checked').innerText}\n`

    input.value += '\n\n'
  } else {
    input.value += '\n'
  }

  const travels = document.querySelector('[data-row-travel]')

  let groups = Array.from(travels.children).reduce(function (r, travel) {
    let type = travel.children[0].children[0].value == 'Viatico Nacional' ? 'Viatico Nacional - Entregas Clientes' : travel.children[0].children[0].value
    let car = travel.children[6].children[0].value.split('-')
    let line = ''
    if (travel.style.display == 'flex' || travel.style.display == '') {
      line += `- 𝐓𝐢𝐩𝐨: ${type}\n`
      if (travel.children[1].children[0].value) line += `- 𝐒𝐚𝐥𝐢𝐝𝐚: ${travel.children[1].children[0].value}\n`
      if (travel.children[2].children[0].value) line += `- 𝐑𝐞𝐭𝐢𝐫𝐨/𝐎𝐛𝐬: ${travel.children[2].children[0].value}\n`
      if (travel.children[3].children[0].value) line += `- 𝐄𝐧𝐭𝐫𝐞𝐠𝐚: ${travel.children[3].children[0].value}\n`
      if (travel.children[4].children[0].value) {
        line += `- 𝐂𝐡𝐨𝐟𝐞𝐫: ${travel.children[4].children[0].value}\n`
        line += `- 𝐂𝐈: ${travel.children[4].children[0].getAttribute('data-ci')}\n`
      }
      line += `- 𝐂𝐚𝐛𝐚𝐥𝐥𝐢𝐭𝐨: ${car[0]} - ${car[1]}\n`
      if (travel.children[7].children[0].value) line += `- 𝐅𝐮𝐫𝐠𝐨𝐧: ${travel.children[7].children[0].value}\n`
      line += `- 𝐂𝐚𝐩𝐚𝐜𝐢𝐝𝐚𝐝: ${travel.children[8].children[0].value} cubiertas \n\n\n`
      r[`${type}`] = r[`${type}`] || []
      r[`${type}`].push(line);
      return r;
    }
  }, Object.create({}));

  const keys = Object.keys(groups)

  keys.forEach(key => {
    let message = `*${key}*\n\n`
    groups[key].forEach(line => message += line)
    input.value += message
  })

  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  input.remove();

  alert("¡Contenido copiado con éxito!")
})

document.querySelector('[data-print-strategic]').addEventListener('click', () => {
  let input = document.createElement("textarea");
  let now = new Date()

  input.value = `𝐈𝐧𝐟𝐨𝐫𝐦𝐞 𝐄𝐬𝐭𝐫𝐚𝐭é𝐠𝐢𝐜𝐨/𝐑𝐞𝐬𝐮𝐦𝐞𝐧 𝐝𝐞 𝐋𝐨𝐠í𝐬𝐭𝐢𝐜𝐚 𝐝𝐞𝐥 𝐝í𝐚\nViajens do dia ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} até hora registrada: ${now.getHours()}:${now.getMinutes()}\nCliente: Sunset\n\n`

  if (document.querySelector('[data-filter-travel-type] :checked').value != 'Todos' || document.querySelector('[data-filter-travel-route] :checked').value != 'Todos' || document.querySelector('[data-filter-travel-trucktype] :checked').value != 'Todos') {
    input.value += '𝐅𝐢𝐥𝐭𝐫𝐨𝐬\n'
    if (document.querySelector('[data-filter-travel-type] :checked').value != 'Todos') input.value += `𝐓𝐢𝐩𝐨 𝐝𝐞𝐥 𝐕𝐢𝐚𝐣𝐞: ${document.querySelector('[data-filter-travel-type] :checked').innerText}\n`
    if (document.querySelector('[data-filter-travel-route] :checked').value != 'Todos') input.value += `𝐃𝐞𝐬𝐭𝐢𝐧𝐨: ${document.querySelector('[data-filter-travel-route] :checked').innerText}\n`
    if (document.querySelector('[data-filter-travel-trucktype] :checked').value != 'Todos') input.value += `𝐓𝐢𝐩𝐨 𝐝𝐞𝐥 𝐂𝐚𝐦𝐢𝐨𝐧: ${document.querySelector('[data-filter-travel-trucktype] :checked').innerText}\n`

    input.value += '\n\n'
  } else {
    input.value += '\n'
  }

  const dateHtml = document.querySelector('[data-search-date]')
  const date = new Date(dateHtml)

  // input.value += '---------------------|--------|-----------|----------|------------|\n'
  // input.value += 'Tipo               Cant  Salida  Retiro  Entrega '
  // input.value += 'Retiro-----------|--------|-----------|----------|------------|\n'
  // input.value += 'Entrega--------|--------|-----------|----------|------------|\n'
  // input.value += 'Devolucion--|--------|-----------|----------|------------|\n'
  // input.value += 'Manten.-------|--------|-----------|----------|------------|\n'
  // input.value += 'Retorno-------|--------|-----------|----------|------------|\n'
  // input.value += 'Transf.---------|--------|-----------|----------|------------|\n'
  // input.value += '--------------------|        |-----------------------------------|\n'

  // const data = await Connection.noBody(`travel/report/strategic/${date}`,'GET')


  // document.body.appendChild(input);
  // input.select();
  // document.execCommand("copy");
  // input.remove();

  // alert("¡Contenido copiado con éxito!")
})

document.querySelector('[data-copy-travel]').addEventListener('click', () => {
  let input = document.createElement("textarea");
  let now = new Date()
  let status

  input.value = `𝐈𝐧𝐟𝐨𝐫𝐦𝐞 𝐋𝐨𝐠í𝐬𝐭𝐢𝐜𝐚 \n 𝐋𝐢𝐬𝐭𝐚𝐝𝐨 𝐝𝐞 𝐕𝐞𝐡𝐢𝐜𝐮𝐥𝐨𝐬 - ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} \n\n`


  if (document.querySelector('[data-filter-truck-type] :checked').value != 'TODOS' || document.querySelector('[data-filter-truck-status] :checked').value != 'TODOS') {
    input.value += '𝐅𝐢𝐥𝐭𝐫𝐨𝐬\n'
    if (document.querySelector('[data-filter-truck-type] :checked').value != 'TODOS') input.value += `𝐓𝐢𝐩𝐨 𝐝𝐞𝐥 𝐕𝐞𝐡𝐢𝐜𝐮𝐥𝐨: ${document.querySelector('[data-filter-truck-type] :checked').innerText}\n`
    if (document.querySelector('[data-filter-truck-status] :checked').value != 'TODOS') input.value += `𝐒𝐭𝐚𝐭𝐮𝐬: ${document.querySelector('[data-filter-truck-status] :checked').innerText}\n`
    input.value += '\n\n'
  } else {
    input.value += '\n'
  }

  const cars = document.querySelector('#dataTable')
  Array.from(cars.children[1].children).forEach(car => {
    if (car.style.display == '') {
      input.value += `𝐂𝐡𝐚𝐩𝐚: ${car.children[0].innerText} - `
      input.value += `𝐕𝐞𝐡𝐢𝐜𝐮𝐥𝐨: ${car.children[2].innerText} - `
      input.value += `𝐌𝐚𝐫𝐜𝐚: ${car.children[3].innerText} - `
      input.value += `𝐌𝐨𝐝𝐞𝐥𝐨: ${car.children[4].innerText} - `
      input.value += `𝐒𝐞𝐝𝐞: ${car.children[5].innerText} - `
      input.value += `𝐂𝐨𝐥𝐨𝐫: ${car.children[6].innerText} - `
      input.value += `𝐀ñ𝐨: ${car.children[7].innerText} - `

      switch (car.children[1].children[0].innerText) {
        case "1":
          status = 'Disponible'
          break
        case "2":
          status = 'No disponible'
          break
        case "3":
          status = 'Mantenimiento'
          break
        default:
          status = 'No definido'
          break
      }

      input.value += `𝐒𝐭𝐚𝐭𝐮𝐬: ${status} - `
      input.value += `𝐂𝐚𝐩𝐚𝐜𝐢𝐝𝐚𝐝: ${car.children[10].innerText} \n\n`

    }
  })

  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  input.remove();

  alert("¡Contenido copiado con éxito!")
})


const viewTravel = (event) => {
  const divs = document.querySelector('[data-row-travel]');
  let index;

  if (event.target && event.target.matches('[data-filter-travel-type]')) index = 1;
  if (event.target && event.target.matches('[data-filter-travel-origin]')) index = 2;
  if (event.target && event.target.matches('[data-filter-travel-route]')) index = 3;
  if (event.target && event.target.matches('[data-filter-travel-trucktype]')) index = 5;

  Array.from(divs.children).forEach(row => {
    let content = row.children[index].children[0].value;
    if (content.indexOf(event.target.value) == -1 && event.target.value != "Todos") {
      row.style.display = 'none';
    } else {
      if (document.querySelector('[data-filter-travel-type] :checked').value == row.children[1].children[0].value || document.querySelector('[data-filter-travel-type] :checked').value == 'Todos') row.style.display = 'flex';
      if (document.querySelector('[data-filter-travel-origin] :checked').value == row.children[2].children[0].value || document.querySelector('[data-filter-travel-origin] :checked').value == 'Todos') row.style.display = 'flex';
      if (document.querySelector('[data-filter-travel-route] :checked').value == row.children[3].children[0].value || document.querySelector('[data-filter-travel-route] :checked').value == 'Todos') row.style.display = 'flex';
      if (document.querySelector('[data-filter-travel-trucktype] :checked').value == row.children[5].children[0].value || document.querySelector('[data-filter-travel-trucktype] :checked').value == 'Todos') row.style.display = 'flex';
    }
  })
}

document.querySelector('[data-filter-travel-type]').addEventListener('change', viewTravel, false);
document.querySelector('[data-filter-travel-origin]').addEventListener('change', viewTravel, false);
document.querySelector('[data-filter-travel-route]').addEventListener('change', viewTravel, false);
document.querySelector('[data-filter-travel-trucktype]').addEventListener('change', viewTravel, false);


const collapese = (event) => {
  $(event.currentTarget.getAttribute('data-bs-target')).on('shown.bs.collapse', function () {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
  })

  if (event.currentTarget.getAttribute('aria-expanded') == "true" && event.currentTarget.nodeName == "BUTTON") {
    event.currentTarget.children[0].classList.remove('fa-arrow-down');
    event.currentTarget.children[0].classList.add('fa-arrow-up');
  } else {
    event.currentTarget.children[0].classList.remove('fa-arrow-up');
    event.currentTarget.children[0].classList.add('fa-arrow-down');
  }
}

Array.from(document.querySelectorAll('[data-btn-collapse]')).forEach(btn => {
  btn.addEventListener('click', collapese, false);
})

export const ControllerCar = {
  selectCars
}

