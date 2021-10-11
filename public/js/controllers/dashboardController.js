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

    let option
    switch (item.statusquotation) {
      case "0": option = `
      <a data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>
      <a data-toggle="popover" title="Recusar"><i class="btn-delete fas fa-trash"></i></a>
      <a data-toggle="popover" title="Aprovar"><i class="btn-edit fas fa-check"></i></a>`
        break
      case "1": option = `
      <a data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>
      <a data-toggle="popover" title="Recusar Cotizacion"><i class="btn-delete fas fa-trash"></i></a>
      <a data-toggle="popover" title="Aprovar Cotizacion"><i class="btn-edit fas fa-check"></i></a>`
        break
      case 2: option = `
      <a data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>
      <a data-toggle="popover" title="Recusar Compra"><i class="btn-delete fas fa-trash"></i></a>
      <a data-toggle="popover" title="Comprado"><i class="btn-edit fas fa-check"></i></a>`
        break
      case 3: option = `
      <a data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>
      <a data-toggle="popover" title="Instalado"><i class="btn-edit fas fa-check"></i></a>`
        break
      case 4: option = `
      <a data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>`
        break
      default: option = `
      <a data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>
      <a data-toggle="popover" title="Recusar pieza"><i class="btn-delete fas fa-trash"></i></a>`
        break
    }

    let line = [item.idcode, item.car, item.date, item.km, item.code, item.name, item.type, item.provider, item.brand, `${item.amount}`, `${item.currency}`, `${item.price}`, item.description, option]
    itemsdt.push(line)
  })

  listMaintenances(itemsdt)


  const cars = await Connection.noBody('dashboard', 'GET')

  let dtview = []
  cars.forEach(car => {
    let line = [
      `<a data-toggle="popover" title="Piezas sin presupesto" data-status="0" >${car.amountPending}<i class="cell-content fas fa-angle-down"></i></a>`,
      `<a data-toggle="popover" title="Piezas cotadas" data-status="1" >${car.amountQuoted}<i class="cell-content fas fa-angle-down"></i></a>`,
      `<a data-toggle="popover" title="Presupuesto aprovado para esta pieza" data-status="2" >${car.amountApproved}<i class="cell-content fas fa-angle-down"></i></a>`,
      `<a data-toggle="popover" title="Pieza comprada" data-status="3" >${car.amountPurchased}<i class="cell-content fas fa-angle-down"></i></a>`,
      `<a data-toggle="popover" title="Pieza instalada" data-status="4" >${car.amountFinished}<i class="cell-content fas fa-angle-down"></i></a>`,
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
      {
        title: "Pendiente",
        className: "item-control"
      },
      {
        title: "Cotizado",
        className: "item-control"
      },
      {
        title: "Autorizado compra",
        className: "item-control"
      },
      {
        title: "Comprado",
        className: "item-control"
      },
      {
        title: "Instalado",
        className: "item-control"
      }
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

  
$('#dataTable tbody').on('click', 'td.item-control', async function (event) {

  const btn = event.currentTarget.children[0]
  const status = btn.getAttribute("data-status")

  if(event.currentTarget.innerText === "0" ) return alert("No hay piezas para mostrar.")


  const items = await Connection.noBody(`itemstatus/${status}`, "GET")

  if ($.fn.DataTable.isDataTable('#dataItems')) {
    $('#dataItems').dataTable().fnClearTable();
    $('#dataItems').dataTable().fnDestroy();
    $('#dataItems').empty();
  }

  let itemsdt = []

  items.forEach(item => {

    let option
    switch (item.statusquotation) {
      case "0": option = `
      <a data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>
      <a data-toggle="popover" title="Recusar"><i class="btn-delete fas fa-trash"></i></a>
      <a data-toggle="popover" title="Aprovar"><i class="btn-edit fas fa-check"></i></a>`
        break
      case "1": option = `
      <a data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>
      <a data-toggle="popover" title="Recusar Cotizacion"><i class="btn-delete fas fa-trash"></i></a>
      <a data-toggle="popover" title="Aprovar Cotizacion"><i class="btn-edit fas fa-check"></i></a>`
        break
      case 2: option = `
      <a data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>
      <a data-toggle="popover" title="Recusar Compra"><i class="btn-delete fas fa-trash"></i></a>
      <a data-toggle="popover" title="Comprado"><i class="btn-edit fas fa-check"></i></a>`
        break
      case 3: option = `
      <a data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>
      <a data-toggle="popover" title="Instalado"><i class="btn-edit fas fa-check"></i></a>`
        break
      case 4: option = `
      <a data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>`
        break
      default: option = `
      <a data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>
      <a data-toggle="popover" title="Recusar pieza"><i class="btn-delete fas fa-trash"></i></a>`
        break
    }

    let line = [item.idcode, item.car, item.date, item.km, item.code, item.name, item.type, item.provider, item.brand, `${item.amount}`, `${item.currency}`, `${item.price}`, item.description, option]
    itemsdt.push(line)
  })

  listMaintenances(itemsdt)
})
}


const listMaintenances = (items) => {


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
        title: "Opciones",
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



