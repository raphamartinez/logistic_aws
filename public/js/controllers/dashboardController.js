import { Connection } from '../services/connection.js'
import { View as ViewMaintenance } from '../views/maintenanceView.js'

window.onload = async function () {
  let loading = document.querySelector('[data-loading]')
  loading.innerHTML = `
  <div class="d-flex justify-content-center">
    <div class="spinner-grow text-danger" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>`


  const items = await Connection.noBody(`item`, 'GET')

  let itemsdt = []

  items.forEach(item => {

    let option
    switch (item.statusquotation) {
      case "0": option = `
      <a data-action data-id="${item.id}" data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>
      <a data-action data-id="${item.id}" data-toggle="popover" title="Recusar"><i class="btn-delete fas fa-trash"></i></a>
      <a data-action data-id="${item.id}" data-toggle="popover" title="Aprovar"><i class="btn-edit fas fa-check"></i></a>
      <a data-action data-id="${item.id}" data-toggle="popover" title="Editar pieza"><i class="btn-edit fas fa-edit"></i></a>`
        break
      case "1": option = `
      <a data-action data-id="${item.id}" data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>
      <a data-action data-id="${item.id}" data-toggle="popover" title="Recusar Cotizacion"><i class="btn-delete fas fa-trash"></i></a>
      <a data-action data-id="${item.id}" data-toggle="popover" title="Aprovar Cotizacion"><i class="btn-edit fas fa-check"></i></a>
      <a data-action data-id="${item.id}" data-toggle="popover" title="Editar pieza"><i class="btn-edit fas fa-edit"></i></a>`
        break
      case 2: option = `
      <a data-action data-id="${item.id}" data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>
      <a data-action data-id="${item.id}" data-toggle="popover" title="Recusar Compra"><i class="btn-delete fas fa-trash"></i></a>
      <a data-action data-id="${item.id}" data-toggle="popover" title="Comprado"><i class="btn-edit fas fa-check"></i></a>
      <a data-action data-id="${item.id}" data-toggle="popover" title="Editar pieza"><i class="btn-edit fas fa-edit"></i></a>`
        break
      case 3: option = `
      <a data-action data-id="${item.id}" data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>
      <a data-action data-id="${item.id}" data-toggle="popover" title="Instalado"><i class="btn-edit fas fa-check"></i></a>
      <a data-action data-id="${item.id}" data-toggle="popover" title="Editar pieza"><i class="btn-edit fas fa-edit"></i></a>`
        break
      case 4: option = `
      <a data-action data-id="${item.id}" data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>`
        break
      default: option = `
      <a data-action data-id="${item.id}" data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>
      <a data-action data-id="${item.id}" data-toggle="popover" title="Recusar pieza"><i class="btn-delete fas fa-trash"></i></a>
      <a data-action data-id="${item.id}" data-toggle="popover" title="Editar pieza"><i class="btn-edit fas fa-edit"></i></a>`
        break
    }


    let line = [item.idcode, option, item.car, item.date, item.km, item.code, item.name, item.type, item.provider, item.brand, `${item.amount}`, `${item.currency}`, `${item.price}`, item.description]
    itemsdt.push(line)
  })

  listMaintenances(itemsdt)


  const cars = await Connection.noBody('dashboardcar', 'GET')

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

    if (event.currentTarget.innerText === "0") return alert("No hay piezas para mostrar.")


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
      <a data-action data-id="${item.id}" data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>
      <a data-action data-id="${item.id}" data-toggle="popover" title="Recusar"><i class="btn-delete fas fa-trash"></i></a>
      <a data-action data-id="${item.id}" data-toggle="popover" title="Aprovar"><i class="btn-edit fas fa-check"></i></a>
      <a data-action data-id="${item.id}" data-toggle="popover" title="Editar pieza"><i class="btn-edit fas fa-edit"></i></a>`
          break
        case "1": option = `
      <a data-action data-id="${item.id}" data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>
      <a data-action data-id="${item.id}" data-toggle="popover" title="Recusar Cotizacion"><i class="btn-delete fas fa-trash"></i></a>
      <a data-action data-id="${item.id}" data-toggle="popover" title="Aprovar Cotizacion"><i class="btn-edit fas fa-check"></i></a>
      <a data-action data-id="${item.id}" data-toggle="popover" title="Editar pieza"><i class="btn-edit fas fa-edit"></i></a>`
          break
        case 2: option = `
      <a data-action data-id="${item.id}" data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>
      <a data-action data-id="${item.id}" data-toggle="popover" title="Recusar Compra"><i class="btn-delete fas fa-trash"></i></a>
      <a data-action data-id="${item.id}" data-toggle="popover" title="Comprado"><i class="btn-edit fas fa-check"></i></a>
      <a data-action data-id="${item.id}" data-toggle="popover" title="Editar pieza"><i class="btn-edit fas fa-edit"></i></a>`
          break
        case 3: option = `
      <a data-action data-id="${item.id}" data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>
      <a data-action data-id="${item.id}" data-toggle="popover" title="Instalado"><i class="btn-edit fas fa-check"></i></a>
      <a data-action data-id="${item.id}" data-toggle="popover" title="Editar pieza"><i class="btn-edit fas fa-edit"></i></a>`
          break
        case 4: option = `
      <a data-action data-id="${item.id}" data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>`
          break
        default: option = `
      <a data-action data-id="${item.id}" data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>
      <a data-action data-id="${item.id}" data-toggle="popover" title="Recusar pieza"><i class="btn-delete fas fa-trash"></i></a>
      <a data-action data-id="${item.id}" data-toggle="popover" title="Editar pieza"><i class="btn-edit fas fa-edit"></i></a>`
          break
      }

      let line = [item.idcode, option, item.car, item.date, item.km, item.code, item.name, item.type, item.provider, item.brand, `${item.amount}`, `${item.currency}`, `${item.price}`, item.description]
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
      {
        title: "Opciones",
        className: "finance-control"
      },
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
      { title: "Observación" }

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

  const actions = document.querySelectorAll('[data-action]')
  Array.from(actions).forEach(function (action) {
    action.addEventListener('click', async (event) => {

      let btnDelete = event.target.classList[0] == 'btn-delete'
      if (btnDelete) return deleteMaintenance(event)

      let btnEdit = event.target.classList[0] === 'btn-edit'
      if (btnEdit) return editMaintenance(event)

      let btnView = event.target.classList[0] === 'btn-view'
      if (btnView) return viewMaintenance(event)
    })
  })
}


const editMaintenance = async (event) => {

  let tr = event.path[3]
  if (tr.className === "child") tr = tr.previousElementSibling

  let id = event.path[1].getAttribute('data-id')

  const maintenance = await Connection.noBody(`itemview/${id}`, 'GET')
  const providers = await Connection.noBody('provider', 'GET')

  document.querySelector('[data-modal]').innerHTML = ``
  document.querySelector('[data-modal]').appendChild(ViewMaintenance.modalEdit(maintenance))

  document.getElementById("provideredit").selectedIndex = maintenance.provider;
  document.getElementById("typeedit").selectedIndex = maintenance.type;
  document.getElementById("currencyedit").selectedIndex = maintenance.currency;

  providers.map(provider => {
    const option = document.createElement('option')
    option.value = provider.id
    option.innerHTML = `${provider.name}</option>`
    document.querySelector('[data-providers-edit]').appendChild(option)
  })

  $("#edit").modal('show')

  const provider = document.querySelector('[data-providers-edit]')

  provider.addEventListener('change', async (event) => {
    if (event.target.value !== "") {
      document.querySelector('#brandedit').disabled = false;
      document.querySelector('#currencyedit').disabled = false;
      document.querySelector('#priceedit').disabled = false;
      document.querySelector('#voucheredit').disabled = false;
      document.querySelector('#typeedit').disabled = false;
      document.querySelector('#amountedit').disabled = false;

    } else {
      document.querySelector('#brandedit').disabled = true;
      document.querySelector('#currencyedit').disabled = true;
      document.querySelector('#priceedit').disabled = true;
      document.querySelector('#voucheredit').disabled = true;
      document.querySelector('#typeedit').disabled = true;
      document.querySelector('#amountedit').disabled = false;

    }
  })

  const modal = document.querySelector('[data-edit-maintenance]')
  modal.addEventListener('submit', async (event2) => {
    event2.preventDefault()

    const date = new Date()

    const newMaintenance = {
      concatcar: maintenance.concatcar,
      id: id,
      plate: maintenance.plate,
      name: event2.currentTarget.item.value,
      provider: event2.currentTarget.provider.value,
      providerdesc: document.querySelector('#provideredit option:checked').innerHTML,
      amount: event2.currentTarget.amount.value,
      price: event2.currentTarget.price.value,
      type: event2.currentTarget.type.value,
      currency: event2.currentTarget.currency.value,
      code: event2.currentTarget.code.value,
      brand: event2.currentTarget.brand.value,
      typedesc: document.querySelector('#typeedit option:checked').innerHTML,
      description: event2.currentTarget.obs.value,
      km: event2.currentTarget.km.value,
      date: `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    }

    const files = event2.currentTarget.file.files

    const formData = new FormData()

    for (const file of files) {
      formData.append("file", file);
    }

    formData.append("id", newMaintenance.id);
    formData.append("voucher", event2.currentTarget.voucher.files[0]);
    formData.append("name", newMaintenance.name);
    formData.append("price", newMaintenance.price);
    formData.append("amount", newMaintenance.amount);
    formData.append("provider", newMaintenance.provider);
    formData.append("code", newMaintenance.code);
    formData.append("km", newMaintenance.km);
    formData.append("brand", newMaintenance.brand);
    formData.append("currency", newMaintenance.currency);
    formData.append("type", newMaintenance.type);
    formData.append("plate", newMaintenance.plate);
    formData.append("description", newMaintenance.description);

    const obj = await Connection.bodyMultipart(`item/${id}`, formData, 'PUT');

    const table = $('#dataItems').DataTable()

    table
      .row(tr)
      .remove()
      .draw();

    const rowNode = table.row.add([
      newMaintenance.id,
      `<a data-action data-id="${id}" data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>
           <a data-action data-id="${id}" data-toggle="popover" title="Deletar pieza"><i class="btn-delete fas fa-trash"></i></a>
           <a data-action data-id="${id}" data-toggle="popover" title="Editar pieza"><i class="btn-edit fas fa-edit"></i></a>`,
      newMaintenance.concatcar,
      newMaintenance.date,
      newMaintenance.km,
      newMaintenance.code,
      newMaintenance.name,
      newMaintenance.typedesc,
      newMaintenance.providerdesc,
      newMaintenance.brand,
      newMaintenance.amount,
      newMaintenance.currency,
      newMaintenance.price,
      newMaintenance.description
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


const deleteMaintenance = (event) => {

  let tr = event.path[6]
  if (tr.className === "child") tr = tr.previousElementSibling

  let maintenance = {
    id: event.path[1].getAttribute('data-id')
  }

  document.querySelector('[data-modal]').innerHTML = ``
  document.querySelector('[data-modal]').appendChild(ViewMaintenance.modalDelete())

  $("#delete").modal('show')

  const modal = document.querySelector('[data-delete-maintenance]')
  modal.addEventListener('submit', async (event2) => {
    event2.preventDefault()

    const obj = await Connection.noBody(`item/${maintenance.id}`, 'DELETE')

    if (tr.className === "child") tr = tr.previousElementSibling
    $('#dataItems').DataTable()
      .row(tr)
      .remove()
      .draw();

    $("#delete").modal('hide')

    alert(obj.msg)
  })
}


const viewMaintenance = async (event) => {

  let tr = event.path[3]
  let i = event.target

  if (tr.className === "child") tr = tr.previousElementSibling

  let row = $('#dataItems').DataTable()
    .row(tr)

  if (row.child.isShown()) {
    tr.classList.remove('bg-dark', 'text-white')
    i.classList.remove('fas', 'fa-eye-slash', 'text-white')
    i.classList.add('fas', 'fa-eye')

    row.child.hide();
    tr.classList.remove('shown')

    adjustModalDatatable()
  } else {

    let id_item = event.path[1].getAttribute('data-id')

    tr.classList.add('bg-dark', 'text-white')
    i.classList.remove('fas', 'fa-eye')
    i.classList.add('spinner-border', 'spinner-border-sm', 'text-light')

    const files = await Connection.noBody(`file/id_item/${id_item}`, "GET")

    if (files.length === 0) {
      i.classList.remove('spinner-border', 'spinner-border-sm', 'text-light')
      i.classList.add('fas', 'fa-eye-slash', 'text-white')
      return alert('No hay imágenes vinculadas a esta pieza.')
    }

    const div = document.createElement('div')

    div.classList.add('container-fluid')
    div.innerHTML = `<div class="row col-md-12" data-body></div>`

    row.child(div).show()

    let body = document.querySelector('[data-body]')

    files.forEach(file => {
      body.appendChild(ViewMaintenance.tableImage(file))
    })

    tr.classList.add('shown')
    i.classList.remove('spinner-border', 'spinner-border-sm', 'text-light')
    i.classList.add('fas', 'fa-eye-slash', 'text-white')

    adjustModalDatatable()

    const modal = document.createElement('div')

    modal.innerHTML = `<div class="modal-image" modal-image>
      <span class="close" data-span>&times;</span>
      <img class="modal-image-content mb-2" data-image-content>
      <div class="text-center text-white" data-image-description></div>
      <div class="text-center text-white" data-image-size></div>
      <div class="text-center text-white" data-image-date></div>
      <div class="text-center text-white" data-image-actions>
      <a data-key-edit><i class="btn-edit fas fa-edit" ></i></a>
      <a data-key-delete><i class="btn-delete fas fa-trash" ></i></a>
      </div>
      <div class="text-center text-white" data-image-option></div>
      </div>`

    document.querySelector('[data-modal]').appendChild(modal)

    const images = document.getElementsByClassName('full-view')

    Array.from(images).forEach(function (image) {
      image.addEventListener('click', async (event) => {

        document.querySelector('[modal-image]').style.display = "block"
        document.querySelector('[data-image-content]').src = event.target.currentSrc
        document.querySelector('[data-image-description]').innerHTML = event.target.alt
        document.querySelector('[data-image-size]').innerHTML = `${event.target.getAttribute("data-size")} Mb`
        document.querySelector('[data-image-date]').innerHTML = event.target.getAttribute("data-date")
        document.querySelector('[data-key-delete]').setAttribute("data-key-delete", event.target.getAttribute("data-id"))
        document.querySelector('[data-key-edit]').setAttribute("data-key-edit", event.target.getAttribute("data-id"))
        document.querySelector('[data-key-edit]').setAttribute("data-description", event.target.alt)


        const span = document.querySelector('[data-span]')

        span.addEventListener('click', async () => {
          document.querySelector('[modal-image]').style.display = "none"
          document.querySelector('[data-image-content]').src = ""
          document.querySelector('[data-image-description]').innerHTML = ""
        })

        const edit = document.querySelector('[data-key-edit]')

        edit.addEventListener('click', async () => {
          document.querySelector('[data-image-size]').innerHTML = ""
          document.querySelector('[data-image-date]').innerHTML = ""
          document.querySelector('[data-image-description]').innerHTML = ""
          document.querySelector('[data-image-actions]').style.display = "none"
          document.querySelector('[data-image-option]').innerHTML = `
                  <div class="row text-center">
                  <label for="description" class="form-label">Editar descripción de imagen</label>
                  </div>
                  <div class="row offset-md-4 text-left">
                  <div class="col-auto">
                  <input data-new-description value="${event.target.alt}" type="text" class="form-control" aria-describedby="helpBlock">
                  </div>
                  <div class="col-auto">
                  <button data-back class="btn btn-secondary" type="button">Cancelar</button>
                  <button data-edit-submit class="btn btn-success" type="button" id="button-addon2">Guardar</button>
                  </div>
                  </div>
                  `

          const back = document.querySelector('[data-back]')
          back.addEventListener('click', async () => {
            document.querySelector('[data-image-option]').innerHTML = ``
            document.querySelector('[data-image-actions]').style.display = "block"
            document.querySelector('[data-image-description]').innerHTML = event.target.alt
            document.querySelector('[data-image-size]').innerHTML = `${event.target.getAttribute("data-size")} Mb`
            document.querySelector('[data-image-date]').innerHTML = event.target.getAttribute("data-date")
            document.querySelector('[data-key-delete]').setAttribute("data-key-delete", event.target.getAttribute("data-id"))
            document.querySelector('[data-key-edit]').setAttribute("data-key-edit", event.target.getAttribute("data-id"))
            document.querySelector('[data-key-edit]').setAttribute("data-description", event.target.alt)
          })

          const editsubmit = document.querySelector('[data-edit-submit]')
          editsubmit.addEventListener('click', async () => {
            const file = {
              description: document.querySelector('[data-new-description]').value,
              id: event.target.getAttribute("data-id")
            }

            const obj = await Connection.body(`file/${event.target.getAttribute("data-id")}`, { file }, 'PUT')

            document.querySelector('[data-image-option]').innerHTML = ``
            document.querySelector('[data-image-actions]').style.display = "block"
            document.querySelector('[data-image-description]').innerHTML = file.description
            document.querySelector('[data-image-size]').innerHTML = `${event.target.getAttribute("data-size")} Mb`
            document.querySelector('[data-image-date]').innerHTML = event.target.getAttribute("data-date")
            document.querySelector('[data-key-delete]').setAttribute("data-key-delete", event.target.getAttribute("data-id"))
            document.querySelector('[data-key-edit]').setAttribute("data-key-edit", event.target.getAttribute("data-id"))
            document.querySelector('[data-key-edit]').setAttribute("data-description", event.target.alt)

            event.target.alt = file.description

            alert(obj.msg)
          })
        })

        const btnDelete = document.querySelector('[data-key-delete]')

        btnDelete.addEventListener('click', async () => {
          document.querySelector('[data-image-size]').innerHTML = ""
          document.querySelector('[data-image-date]').innerHTML = ""
          document.querySelector('[data-image-description]').innerHTML = ""
          document.querySelector('[data-image-actions]').style.display = "none"
          document.querySelector('[data-image-option]').innerHTML = `<h6>¿Realmente quieres borrar esta imagen?</h6>
                  <button data-back class="btn btn-secondary">Cancelar</button>
                  <button data-erase class="btn btn-danger">Borrar</button>`

          const erase = document.querySelector('[data-erase]')
          erase.addEventListener('click', async () => {
            image.offsetParent.remove()

            document.querySelector('[modal-image]').style.display = "none"
            document.querySelector('[data-image-content]').src = ""
            document.querySelector('[data-image-description]').innerHTML = ""

            const obj = await Connection.noBody(`file/${event.target.getAttribute("data-key")}`, 'DELETE')

            document.querySelector('[data-image-option]').innerHTML = ``
            document.querySelector('[data-image-actions]').style.display = "block"

            alert(obj.msg)
          })

          const back = document.querySelector('[data-back]')
          back.addEventListener('click', async () => {
            document.querySelector('[data-image-option]').innerHTML = ``
            document.querySelector('[data-image-actions]').style.display = "block"
            document.querySelector('[data-image-description]').innerHTML = event.target.alt
            document.querySelector('[data-image-size]').innerHTML = `${event.target.getAttribute("data-size")} Mb`
            document.querySelector('[data-image-date]').innerHTML = event.target.getAttribute("data-date")
            document.querySelector('[data-key-delete]').setAttribute("data-key-delete", event.target.getAttribute("data-id"))
            document.querySelector('[data-key-edit]').setAttribute("data-key-edit", event.target.getAttribute("data-id"))
            document.querySelector('[data-key-edit]').setAttribute("data-description", event.target.alt)
          })
        })
      })
    })
  }
}

const adjustModalDatatable = () => {
  $('#dataItems').on('shown.bs.modal', function () {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
  })
}


