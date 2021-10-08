import { Connection } from '../services/connection.js'

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
  let user = JSON.parse(sessionStorage.getItem('user'))

  let data = []

  cars.forEach(obj => {
    const line = [
      obj[4],
      obj[1],
      obj[2],
      obj[3],
      obj[5],
      obj[6],
      obj[7],
      obj[8],
      obj[9]
    ]

    data.push(line)
  })

  listCars(data)

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
        title: "Chapa",
        className: "finance-control"
      },
      { title: "Vehiculo" },
      { title: "Marca" },
      { title: "Modelo" },
      { title: "Color" },
      { title: "Año" },
      { title: "Chasis" },
      { title: "Combustible" },
      { title: "Departamento" }
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

export const ControllerCar = {
  selectCars
}