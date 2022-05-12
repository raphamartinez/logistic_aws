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
      { title: "Moneda" },
      { title: "Valor Totale" },
      { title: "Status" },
    ],
    responsive: false,
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

const getArchives = async (purchaseorder) => {
  const archives = await Connection.noBody(`file/order/${purchaseorder}`, 'GET')
  document.querySelector('[data-images]').innerHTML = ''
  archives.forEach(archive => {
    addUrlToHtml(archive)
  })
}

const trClick = async (event) => {
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

    if (tr.children[0].className === 'sorting_1') {
      const modalAttr = document.querySelector('#modalImage')
      const plate = tr.children[3].textContent.split(' ')
      modalAttr.setAttribute('purchaseorder', tr.children[0].textContent)
      modalAttr.setAttribute('quotation', tr.children[1].textContent)
      modalAttr.setAttribute('plate', plate[0])
      await getArchives(tr.children[0].textContent)
    }
    modal.show()
  }
}

document.querySelector('#table').addEventListener('click', trClick)

$("#modalImage").on('hidden.bs.modal', function () {
  const rowActive = document.querySelector('[data-active]')
  if (rowActive) {
    const modalAttr = document.querySelector('#modalImage')
    modalAttr.removeAttribute('purchaseorder')
    modalAttr.removeAttribute('quotation')
    modalAttr.removeAttribute('plate')
    rowActive.classList.remove('bg-success')
    rowActive.removeAttribute('data-active')
  }
})

const dragArea = document.querySelector('.drag-area')
const dragText = document.querySelector('.header')
let button = document.querySelector('.btn-upload')
let input = document.querySelector('.input-upload')
let file

const addUrlToHtml = (file) => {

  const imgTag = document.createElement('a')
  imgTag.innerHTML = `<div class="col-md-4 d-inline">
                        <img data-image-id="${file.id}" class="img-fluid full-view" style="width:250px; height:250px; max-width:250px; max-height:250px;" src="${file.type.includes('video/mp4') || file.type.includes('video/webm') ? './img/video.png' : file.url}" alt="">
                      </div>`

  document.querySelector('[data-images]').prepend(imgTag)
}

const toast = (status, file) => {
  switch (status) {
    case 1: {
      const date = new Date(file.lastModifiedDate)
      toastr.success(`Nombre: ${file.name}<br>Última fecha de modificación: ${date.toLocaleDateString()}`, "¡Imagen añadida con éxito!", {
        progressBar: true
      })
      addUrlToHtml(file)
    }
      break;
    case 2: {
      toastr.error(`Verifique los datos insertados, uno erro fue generado.`, "Erro ao guardar!", {
        progressBar: true
      })
    }
      break;
  }
}

const resetFormImage = () => {
  document.querySelector('[data-loading-image]').className = 'fas fa-images'
  document.querySelector('[data-span-image]').innerHTML = 'o <span class="button btn-upload">navegar</span>'
  dragArea.classList.remove('active')
}

const upload = async (file) => {
  const validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4', 'video/webm']
  const modalAttr = document.querySelector('#modalImage')
  const order = {
    purchaseorder: modalAttr.getAttribute('purchaseorder'),
    quotation: modalAttr.getAttribute('quotation'),
    plate: modalAttr.getAttribute('plate')
  }
  if (!validExtensions.includes(file.type)) return alert('Este archivo no es una imagen válida')
  let fileReader = new FileReader()
  fileReader.onload = () => {
    let url = fileReader.result
    file.url = url
  }
  fileReader.readAsDataURL(file)
  const form = new FormData()
  form.append('file', file)
  form.append('purchaseorder', order.purchaseorder)
  form.append('quotation', order.quotation)
  form.append('plate', order.plate)
  form.append('lastModifiedDate', file.lastModifiedDate)
  dragText.textContent = 'Cargando el archivo'
  document.querySelector('[data-loading-image]').className = 'fas fa-spinner fa-pulse'
  document.querySelector('[data-span-image]').innerHTML = ''
  if (!order.purchaseorder && !order.quotation) {
    resetFormImage()
    return toastr.warning(`Intente agregar nuevamente, no se encontró ninguna referencia (OC o Cotización).`, "¡Sin referencia!")
  }
  const { status, id } = await Connection.bodyMultipart('file/order', form, 'POST')
  file.id = id
  resetFormImage()
  toast(status, file)
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
  if (event.target.className === 'img-fluid full-view') {
    const id = event.target.getAttribute('data-image-id')
    // const modal = bootstrap.Modal.getInstance(document.getElementById("modalImage"));
    // modal.hide()

    document.querySelector('[modal-image]').style.display = "block"
    document.querySelector('[data-image-content]').src = event.target.currentSrc
    document.querySelector('[data-key-delete]').setAttribute('data-id', id)
  }
})

const span = document.querySelector('[data-image-span]')

span.addEventListener('click', async () => {
  document.querySelector('[modal-image]').style.display = "none"
  document.querySelector('[data-image-content]').src = ''
  document.querySelector('[data-key-delete]').removeAttribute('data-id')
})


const btnDelete = document.querySelector('[data-key-delete]')

btnDelete.addEventListener('click', async () => {
  document.querySelector('[data-key-delete]').innerHTML = ''
  document.querySelector('[data-image-option]').innerHTML = `<h6>¿Realmente quieres borrar esta imagen?</h6>
    <button onclick="back(event)" class="btn btn-secondary">Cancelar</button>
    <button type="button" onclick="eraseImage(event)" data-erase class="btn btn-danger">Borrar</button>`
})


const back = (event) => {
  document.querySelector('[data-image-option]').innerHTML = ``
  document.querySelector('[data-image-actions]').style.display = "block"
  document.querySelector('[data-key-delete]').innerHTML = '<i class="btn-delete fas fa-trash" ></i>'
}
window.back = back

const eraseImage = async (event) => {
  event.preventDefault()
  document.querySelector('[data-image-option]').innerHTML = ''
  document.querySelector('[data-key-delete]').innerHTML = '<i class="btn-delete fas fa-trash" ></i>'
  const id = document.querySelector('[data-key-delete]').getAttribute('data-id')
  const result = await Connection.noBody(`file/order/${id}`, 'DELETE')

  if(result.ok){
    toastr.success(result.msg, {
      progressBar: true
    })  
    const images = document.querySelectorAll('[data-image-id]')
    Array.from(images).forEach(image => {
      if (image.getAttribute('data-image-id') == id) {
        image.parentElement.parentElement.remove()
      }
    })
    span.click()
  }else{
    toastr.error(`Erro ao borrar la imagen.`, {
      progressBar: true
    })  
  }

}
window.eraseImage = eraseImage