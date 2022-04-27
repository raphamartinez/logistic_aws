import { Connection } from '../services/connection.js'

const init = async () => {
  const orders = await Connection.noBody('purchaseOrder/json', 'GET')

  const ordersMap = orders.map(order => {
    const date = new Date(order.dt_emission)
    let money = ''

    switch (order.coin) {
      case 'G$':
        money = order.vlr_total.toLocaleString('es')
        break
      case 'US$':
        money = order.vlr_total.toLocaleString('en-US')
        break
      case 'R$':
        money = order.vlr_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
        break
    }

    return [
      order.nr_oc,
      order.nr_quotation,
      date.toLocaleDateString(),
      order.placa ? `${order.placa} - ${order.categoria} - ${order.modelo}` : 'ADM o Taller',
      order.proveedor,
      order.naturaleza,
      order.centro_custo,
      order.coin,
      money,
      order.status_oc
    ]
  })

  $("#table").DataTable({
    data: ordersMap,
    columns: [
      { title: "Nr OC" },
      { title: "Nr COT" },
      { title: "Fecha" },
      { title: "Vehículo" },
      { title: "Proveedor" },
      { title: "Naturaleza" },
      { title: "Centro Costo" },
      { title: "Moneda" },
      { title: "Valor Totale" },
      { title: "Status" },
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
    searchPanes: false,
    fixedHeader: false,
    searching: true,
    dom: "<'row'<'col-md-6'l><'col-md-6'f>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6'p>>" +
      "<'row'<'col-sm-12'B>>",
    buttons: [
      'copy', 'csv', 'excel', 'pdf', 'print'
    ]
  })

}

init()

const trClick = (event) => {
  let tr = event.target

  if (tr.className === 'sorting_1 dtr-control') return null

  if (tr.className === 'child') {
    tr = event.path[1].previousElementSibling
  } else {
    tr = tr.parentElement
    if (tr.nodeName !== 'TR') tr = event.path[4].previousElementSibling
  }

  let haveClass = false
  for (let classObj of tr.classList) {
    if (classObj === 'bg-success') {
      haveClass = true
    }
  }

  var modal = new bootstrap.Modal(document.getElementById("modalImage"), {});

  if (!haveClass) {
    tr.classList.add('bg-success')
    tr.dataset.active = '1'
    modal.show()
  }
}

document.querySelector('#table').addEventListener('click', trClick)

$("#modalImage").on('hidden.bs.modal', function () {
  const rowActive = document.querySelector('[data-active]')
  if (rowActive) {
    rowActive.classList.remove('bg-success')
    rowActive.removeAttribute('data-active')
  }
});

const dragArea = document.querySelector('.drag-area')
const dragText = document.querySelector('.header')
let button = document.querySelector('.btn-upload')
let input = document.querySelector('.input-upload')
let file

const upload = (file) => {
  const validExtensions = ['image/jpeg', 'image/jpg', 'image/png']
  if (!validExtensions.includes(file.type)) return alert('Este archivo no es una imagen válida')

  let fileReader = new FileReader()
  fileReader.onload = () => {
    let fileUrl = fileReader.result

    const imgTag = document.createElement('a')
    imgTag.innerHTML = `<div class="col-md-4 d-inline">
                    <img class="img-fluid full-view" width="250" height="250" src="${fileUrl}" alt="">
                    </div>`

    document.querySelector('[data-images]').prepend(imgTag)
  }
  fileReader.readAsDataURL(file)

  dragArea.classList.remove('active')
}

button.addEventListener('click', (event) => {
  input.click()
})

input.addEventListener('change', function () {
  file = this.files[0]
  dragArea.classList.add('active')
  upload(file)
})

dragArea.addEventListener('dragover', (event) => {
  event.preventDefault()
  dragText.textContent = 'Solte para Enviar'
  dragArea.classList.add('active')
})

dragArea.addEventListener('dragleave', (event) => {
  dragText.textContent = 'Arrastrar y soltar'
  dragArea.classList.remove('active')
})

dragArea.addEventListener('drop', (event) => {
  event.preventDefault()
  file = event.dataTransfer.files[0]
  upload(file)
  return null
})

const images = document.querySelector('[data-images]')
images.addEventListener('click', async (event) => {
  const date = new Date()
  if (event.target.className === 'img-fluid full-view') {
    const modal = bootstrap.Modal.getInstance(document.getElementById("modalImage"));
    modal.hide()

    document.querySelector('[modal-image]').style.display = "block"
    document.querySelector('[data-image-content]').src = event.target.currentSrc
    document.querySelector('[data-image-description]').innerHTML = event.target.alt
    document.querySelector('[data-image-date]').innerHTML = date.toLocaleDateString()
  }
})

const span = document.querySelector('[data-image-span]')

span.addEventListener('click', async () => {
  document.querySelector('[modal-image]').style.display = "none"
  document.querySelector('[data-image-content]').src = ""
  document.querySelector('[data-image-description]').innerHTML = ""
})


const btnDelete = document.querySelector('[data-key-delete]')

btnDelete.addEventListener('click', async () => {
    document.querySelector('[data-image-date]').innerHTML = ""
    document.querySelector('[data-image-option]').innerHTML = `<h6>¿Realmente quieres borrar esta imagen?</h6>
    <button data-back class="btn btn-secondary">Cancelar</button>
    <button data-erase class="btn btn-danger">Borrar</button>`
})

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