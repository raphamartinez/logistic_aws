import { Connection } from '../services/connection.js'

window.onload = async function () {
  let loading = document.querySelector('[data-loading]')
  loading.innerHTML = `
  <div class="d-flex justify-content-center">
    <div class="spinner-grow text-danger" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>`
  
  let user = JSON.parse(sessionStorage.getItem('user'))
  let name = user.name.substring(0, (user.name + " ").indexOf(" "))
  let username = document.querySelector('[data-username]')
  username.innerHTML = name

  const items = await Connection.noBody(`item`, 'GET')

  let itemsdt = []

  items.forEach(item => {

    let a = `
      <a data-toggle="popover" title="Visualizar pieza"><i class="fas fa-image" style="color:#87CEFA;"></i></a>`

    let line = [item.idcode, item.car, item.date, item.km, item.code, item.name, item.type, item.provider, item.brand, `${item.amount}`, `${item.currency}`, `${item.price}`, item.description, a]
    itemsdt.push(line)
  })

  listMaintenances(itemsdt)


  const cars = await Connection.noBody('dashboard', 'GET')

  let dtview = []
  cars.forEach(car => {
    let line = [
      `${car.amountPending}`,
      `${car.amountQuoted}`,
      `${car.amountApproved}`,
      `${car.amountPurchased}`,
      `${car.amountFinished}`
    ]

    dtview.push(line)
  })

  listCars(dtview)

  loading.innerHTML = " "
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
      { title: "Pendiente" },
      { title: "Cotizado" },
      { title: "Autorizado compra" },
      { title: "Comprado" },
      { title: "Instalado" }
    ],
    responsive: true,
    info: false,
    paging: false,
    scrollY: false,
    scrollCollapse: true,
    scrollX: true,
    autoHeight: true,
    pagingType: "numbers",
    searchPanes: false,
    fixedHeader: false,
    searching: false
  })
}


const listMaintenances = (items) => {

  if ($.fn.DataTable.isDataTable('#dataTable')) {
    $('#dataTable').dataTable().fnClearTable();
    $('#dataTable').dataTable().fnDestroy();
    $('#dataTable').empty();
  }

  $("#dataItems").DataTable({
    data: items,
    columns: [
      { title: "Id" },
      { title: "Chapa" },
      { title: "Fecha" },
      { title: "KM" },
      { title: "Cod Pieza" },
      { title: "Pieza" },
      { title: "Tipo de Troca" },
      { title: "Proveedor" },
      { title: "Marca" },
      { title: "Cant" },
      { title: "Moneda" },
      { title: "Precio" },
      { title: "Observación" },
      {
        title: "Visualizar",
        className: "finance-control"
      }

    ],
    responsive: true,
    paging: false,
    ordering: true,
    info: false,
    scrollY: false,
    scrollCollapse: true,
    scrollX: true,
    autoHeight: true,
    lengthMenu: [[25, 50, 100, 150], [25, 50, 100, 150]],
    pagingType: "numbers",
    searchPanes: false,
    fixedHeader: false,
    searching: false,
    dom: "<'row'<'col-md-6'l><'col-md-6'f>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6'p>>" +
      "<'row'<'col-sm-12'B>>",

    buttons: [
      'copy', 'csv', 'excel', 'pdf', 'print'
    ]
  })
}

