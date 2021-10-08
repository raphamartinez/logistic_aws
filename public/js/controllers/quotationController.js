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
  const cars = await Connection.noBody('car/excel', 'GET')
  selectCars(cars)

  const providers = await Connection.noBody('provider', 'GET')
  selectProviders(providers)

  const quotations = await Connection.noBody('quotation', 'GET')
  let user = JSON.parse(sessionStorage.getItem('user'))

  let dtview = []
  quotations.forEach(car => {
    let line = [
      `${car.id}`,
      `${car.chapa}`,
      `${car.cod_pieza}`,
      `${car.pieza}`,
      `${car.proveedor}`,
      `${car.brand}`,
      `${car.valor}`,
      `${car.obs}`,
      `${car.foto_presupuesto}`
    ]

    dtview.push(line)
  })

  listCars(dtview)


  let name = user.name.substring(0, (user.name + " ").indexOf(" "))
  let username = document.querySelector('[data-username]')
  username.innerHTML = name
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
        title: "Id",
        className: "finance-control"
      },
      { title: "Chapa" },
      { title: "Cod Pieza" },
      { title: "Pieza" },
      { title: "Proveedor" },
      { title: "Marca" },
      { title: "Valor" },
      { title: "Observación" },
      { title: "Foto Presupuesto" },
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

const selectCars = (cars) => {

  cars.map(car => {
    const option = document.createElement('option')
    option.value = car[4]
    option.innerHTML = `${car[4]} - ${car[1]}</option>`
    document.querySelector('[data-cars]').appendChild(option)
  })

}

const selectProviders = (providers) => {

  providers.map(provider => {
    const option = document.createElement('option')
    option.value = provider.id
    option.innerHTML = `${provider.name}</option>`
    document.querySelector('[data-providers]').appendChild(option)
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

    const provider = {
      name: event.currentTarget.name.value,
      ruc: event.currentTarget.ruc.value,
      phone: event.currentTarget.phone.value,
      salesman: event.currentTarget.salesman.value,
      mail: event.currentTarget.mail.value,
      address: event.currentTarget.address.value,
    }

    const obj = await Connection.body(`provider`, { provider }, 'POST')

    const option = document.createElement('option')
    option.value = obj.id
    option.innerHTML = `${provider.name}</option>`
    document.querySelector('[data-cars]').appendChild(option)

    alert(obj.msg)
  })
})


const cars = document.querySelector('[data-cars]')

cars.addEventListener('change', async (event) => {
  document.querySelector('[data-items]').innerHTML = ""

  const plate = event.target.value

  const items = await Connection.noBody(`item/${plate}`, 'GET')

  if (items.length > 0) {
    items.forEach(item => {

      const div = document.createElement('div')
      div.classList.add('form-group')
      div.innerHTML = `                                            <div class="input-group mb-3">
    <div class="input-group-prepend">
        <button data-modal-insert class="btn btn-outline-danger disabled"
            type="button">${item.name}</button>
    </div>
      <input data-id="${item.id}" name="price" type="number" min="0" class="form-control" placeholder="Valor">
      </div>
    </div>`

      document.querySelector('[data-items]').appendChild(div)

    })
  } else {
    alert("No hay piezas a cambiar para esta chapa.")

    const div = document.createElement('div')
    div.classList.add('row', 'mb-4')
    div.innerHTML = `                                       
    <div class="col-md-12 text-center">
    <button type="submit" class="btn btn-success">Cambiar nueva Pieza o Articulo</button>
    </div>
    </div>`

    document.querySelector('[data-items]').appendChild(div)

  }

});


const submitquotation = document.querySelector('[data-submit-quotation]')

submitquotation.addEventListener('submit', async (event) => {
  event.preventDefault()

  if (event.currentTarget.file.files.length === 0) return alert("La foto del presupuesto es obligatorio!")
  if (event.currentTarget.plate.value === "") return alert("La chapa es obligatorio!")
  if (event.currentTarget.provider.value === "") return alert("Lo proveedor es obligatorio!")

  const formData = new FormData()

  for (let index = 0; index < event.currentTarget.price.length; index++) {
    if (event.currentTarget.price[index].value > 0) {
      formData.append("items", event.currentTarget.price[index].getAttribute("data-id"));
      formData.append("prices", event.currentTarget.price[index].value);
    }
  }

  const quotation = {
    plate: event.currentTarget.plate.value,
    provider: event.currentTarget.provider.value,
    file: event.currentTarget.file.files[0],
    status: 0
  }

  formData.append('file', quotation.file)
  formData.append("plate", quotation.plate);
  formData.append("provider", quotation.provider);
  formData.append("status", quotation.status);

  await Connection.bodyMultipart('quotation', formData, 'POST')


  document.querySelector('[data-providers]').value = ""
  document.querySelector('[data-providers]').placeholder = "Proveedor *"

  document.querySelector('[data-cars]').value = ""
  document.querySelector('[data-cars]').placeholder = "Seleccione la chapa del vehiculo *"

  document.querySelector('[data-items]').innerHTML = ""


})
