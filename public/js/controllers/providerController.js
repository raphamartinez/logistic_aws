import { Connection } from '../services/connection.js'
import { View } from '../views/providerView.js'

window.onload = async function () {
  let loading = document.querySelector('[data-loading]')
  loading.innerHTML = `
  <div class="d-flex justify-content-center">
    <div class="spinner-grow text-danger" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
`
  const providers = await Connection.noBody('provider', 'GET')
  let data = []

  providers.forEach(obj => {
    const line = [
      `<a data-id="${obj.id}"><i class="btn-edit fas fa-edit"></i></a>
      <a data-id="${obj.id}"><i class="btn-delete fas fa-trash"></i></a>`,
      `${obj.name}`,
      `${obj.salesman}`,
      `${obj.mail}`,
      `${obj.phone}`,
      `${obj.address}`,
      `${obj.ruc}`
    ]

    data.push(line)
  })

  listProviders(data)

  loading.innerHTML = " "
}



const listProviders = (data) => {

  if ($.fn.DataTable.isDataTable('#dataTable')) {
    $('#dataTable').dataTable().fnClearTable();
    $('#dataTable').dataTable().fnDestroy();
    $('#dataTable').empty();
  }
  console.log(data);
  const table = $("#dataTable").DataTable({
    data: data,
    columns: [
      {
        title: "Opciones",
        className: "finance-control"
      },
      { title: "Nombre" },
      { title: "Vendedor" },
      { title: "Mail" },
      { title: "Teléfono" },
      { title: "Dirección" },
      { title: "RUC" },
    ],
    responsive: true,
    paging: true,
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

const modalInsert = document.querySelector('[data-modal-insert]')

modalInsert.addEventListener('click', async (event) => {
  event.preventDefault()

  document.querySelector('[data-modal]').innerHTML = ""
  document.querySelector('[data-modal]').appendChild(View.modalForm())
  $('#register').modal('show')

  const submit = document.querySelector('[data-input-provider]')
  submit.addEventListener('submit', async (event) => {
    event.preventDefault()

    $('#register').modal('hide')

    const date = new Date()

    const provider = {
      name: event.currentTarget.name.value,
      ruc: event.currentTarget.ruc.value,
      phone: event.currentTarget.phone.value,
      salesman: event.currentTarget.salesman.value,
      mail: event.currentTarget.mail.value,
      address: event.currentTarget.address.value,
      date: `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }

    const obj = await Connection.body(`provider`, { provider }, 'POST')

    const table = $('#dataTable').DataTable();

    let a = `<a><i class="btn-edit fas fa-edit"></i></a>
             <a><i class="btn-delete fas fa-trash"></i></a>`

    const rowNode = table.row.add([a, provider.name, provider.salesman, provider.mail, provider.phone, provider.address, provider.ruc])
      .draw()
      .node();

    $(rowNode)
      .css('color', 'black')
      .animate({ color: '#4e73df' });

    alert(obj.msg)
  })
})

const selectProviders = (providers) => {

  providers.map(provider => {
    const option = document.createElement('option')
    option.value = provider.id
    option.innerHTML = `${provider.name}</option>`
    document.querySelector('[data-providers]').appendChild(option)
  })

}


const table = document.querySelector('[data-table]')

table.addEventListener('click', async (event) => {

  let btnDelete = event.target.classList[0] == 'btn-delete'

  if (btnDelete) return deleteProvider(event)

  let btnEdit = event.target.classList[0] === 'btn-edit'

  if (btnEdit) return editProvider(event)
})

const editProvider = (event) => {

  let tr = event.path[3]

  let provider = {
    id: event.path[1].getAttribute('data-id'),
    name: tr.children[1].innerHTML,
    salesman: tr.children[2].innerHTML,
    mail: tr.children[3].innerHTML,
    phone: tr.children[4].innerHTML,
    address: tr.children[5].innerHTML,
    ruc: tr.children[6].innerHTML,
  }

  document.querySelector('[data-modal]').innerHTML = ``
  document.querySelector('[data-modal]').appendChild(View.modalEdit(provider))

  $("#edit").modal('show')

  const modal = document.querySelector('[data-edit-provider]')
  modal.addEventListener('submit', async (event2) => {
    event2.preventDefault()

    const newProvider = {
      id: provider.id,
      name: event2.currentTarget.name.value,
      salesman: event2.currentTarget.salesman.value,
      mail: event2.currentTarget.mail.value,
      phone: event2.currentTarget.phone.value,
      address: event2.currentTarget.address.value,
      ruc: event2.currentTarget.ruc.value
    }

    const obj = await Connection.body(`provider/${newProvider.id}`, { newProvider }, 'PUT')

    const table = $('#dataTable').DataTable()

    if (tr.className === "child") tr = tr.previousElementSibling

    table
      .row(tr)
      .remove()
      .draw();

    const rowNode = table
      .row
      .add(
        [
          `<a data-id="${newProvider.id}"><i class="btn-edit fas fa-edit"></i></a>
           <a data-id="${newProvider.id}"><i class="btn-delete fas fa-trash"></i></a>`,
           newProvider.name,
           newProvider.salesman,
           newProvider.mail,
           newProvider.phone,
           newProvider.address,
           newProvider.ruc
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

const deleteProvider = (event) => {

  const tr = event.path[3]

  let provider = {
    id: event.path[1].getAttribute('data-id'),
    name: tr.children[1].innerHTML,
  }

  document.querySelector('[data-modal]').innerHTML = ``
  document.querySelector('[data-modal]').appendChild(View.modalDelete(provider))

  $("#delete").modal('show')

  const modal = document.querySelector('[data-delete-provider]')
  modal.addEventListener('submit', async (event2) => {
    event2.preventDefault()

    const obj = await Connection.noBody(`provider/${provider.id}`, 'DELETE')

    $('#dataTable').DataTable()
      .row(tr)
      .remove()
      .draw();

    $("#delete").modal('hide')

    alert(obj.msg)
  })
}

export const ControllerProvider = {
  selectProviders
}