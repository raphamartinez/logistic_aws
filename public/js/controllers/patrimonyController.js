import { Connection } from '../services/connection.js'
import { View } from '../views/patrimonyView.js'

const editPatrimony = (event) => {

    let tr = event.path[3]
    if (tr.className === "child") tr = tr.previousElementSibling

    let amount = event.target.getAttribute('data-amount')
    let brand = event.target.getAttribute('data-brand')
    if (amount == "null") amount = ""
    if (brand == "null") brand = ""

    let patrimony = {
        id: event.target.getAttribute('data-id'),
        code: event.target.getAttribute('data-code'),
        name: event.target.getAttribute('data-name'),
        brand: brand,
        amount: amount,
        localcode: event.target.getAttribute('data-local')
    }

    document.querySelector('[data-modal]').innerHTML = ``
    document.querySelector('[data-modal]').appendChild(View.modalEdit(patrimony))

    document.querySelector('#localedit').selectedIndex = patrimony.localcode

    $("#edit").modal('show')

    const modal = document.querySelector('[data-edit-patrimony]')
    modal.addEventListener('submit', async (event2) => {
        event2.preventDefault()

        const date = new Date()

        const newPatrimony = {
            id: patrimony.id,
            code: patrimony.code,
            name: event2.currentTarget.name.value,
            brand: event2.currentTarget.brand.value,
            amount: event2.currentTarget.amount.value,
            local: event2.currentTarget.local.value,
            localdesc: document.querySelector('#localedit option:checked').innerHTML,
            date: `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
        }

        const obj = await Connection.body(`patrimony/${newPatrimony.id}`, { newPatrimony }, 'PUT')

        const table = $('#dataTable').DataTable()

        table
            .row(tr)
            .remove()
            .draw();

        const rowNode = table
            .row
            .add(
                [
                    `<a><i data-action data-id="${newPatrimony.id}" class="btn-view fas fa-eye" ></i></a>
                    <a><i data-action data-id="${newPatrimony.id}" class="btn-blue fas fa-upload" ></i></a>
                    <a><i data-action data-code="${newPatrimony.code}" data-amount="${newPatrimony.amount}" data-brand="${newPatrimony.brand}" data-name="${newPatrimony.name}"  data-id="${newPatrimony.id}" data-local="${newPatrimony.local}" class="btn-edit fas fa-edit" ></i></a>
                    <a><i data-action data-id="${newPatrimony.id}" class="btn-delete fas fa-trash" ></i></a>`,
                    newPatrimony.code,
                    newPatrimony.name,
                    newPatrimony.brand,
                    newPatrimony.amount,
                    newPatrimony.localdesc,
                    newPatrimony.date
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

const deletePatrimony = (event) => {
    const tr = event.path[3]
    if (tr.className === "child") tr = tr.previousElementSibling

    let patrimony = {
        id: event.target.getAttribute('data-id'),
        name: tr.children[2].innerHTML,
        local: tr.children[3].innerHTML,
    }

    document.querySelector('[data-modal]').innerHTML = ``
    document.querySelector('[data-modal]').appendChild(View.modalDelete(patrimony))

    $("#delete").modal('show')

    const modal = document.querySelector('[data-delete-patrimony]')
    modal.addEventListener('submit', async (event2) => {
        event2.preventDefault()

        const obj = await Connection.noBody(`patrimony/${patrimony.id}`, 'DELETE')

        $('#dataTable').DataTable()
            .row(tr)
            .remove()
            .draw();

        $("#delete").modal('hide')

        alert(obj.msg)
    })
}

const upload = async (event) => {
    const id = event.target.getAttribute('data-id')
    const tr = event.path[3]
    if (tr.className === "child") tr = tr.previousElementSibling

    document.querySelector('[data-modal]').innerHTML = ``
    document.querySelector('[data-modal]').appendChild(View.modalUpload())

    $("#upload").modal('show')
    const modal = document.querySelector('[data-upload-patrimony]')
    modal.addEventListener('submit', async (event2) => {
        event2.preventDefault()

        const files = event2.currentTarget.file.files

        const formData = new FormData()
        formData.append("code", id);
        formData.append("name", "id_patrimony");

        for (let newfile of files) {
            formData.append("file", newfile);
        }

        const obj = await Connection.bodyMultipart(`file`, formData, 'POST')
       
        $("#upload").modal('hide')
        document.querySelector('[data-modal]').innerHTML = ``

        alert(obj.msg)
    })
}

const viewPatrimony = async (event) => {

    let loading = document.querySelector('[data-loading]')
    let tr = event.path[3]
    let i = event.target
    let id_patrimony = event.target.getAttribute('data-id')

    if (tr.className === "child") tr = tr.previousElementSibling

    const files = await Connection.noBody(`file/id_patrimony/${id_patrimony}`, "GET")
    if (files.length === 0) return alert('No hay imágenes vinculadas a este patrimonio.')

    loading.innerHTML = `
    <div class="d-flex justify-content-center">
    <div class="spinner-grow text-danger" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
    `

    let row = $('#dataTable').DataTable()
        .row(tr)

    if (row.child.isShown()) {
        tr.classList.remove('bg-dark', 'text-white')
        i.classList.remove('fas', 'fa-eye-slash', 'text-white')
        i.classList.add('fas', 'fa-eye')

        row.child.hide();
        tr.classList.remove('shown')
        loading.innerHTML = ``

        adjustModalDatatable()
    } else {

        tr.classList.add('bg-dark', 'text-white')
        i.classList.add('fas', 'fa-eye-slash', 'text-white')

        const div = document.createElement('div')

        div.classList.add('container-fluid')
        div.innerHTML = `<div class="row col-md-12" data-body-${id_patrimony}></div>`

        row.child(div).show()

        let body = document.querySelector(`[data-body-${id_patrimony}]`)

        files.forEach(file => {
            body.appendChild(View.tableImage(file))
        })

        tr.classList.add('shown')
        i.classList.remove('spinner-border', 'spinner-border-sm', 'text-light')
        i.classList.add('fas', 'fa-eye-slash', 'text-white')
        loading.innerHTML = ``
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
    $('#dataTable').on('shown.bs.modal', function () {
        $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
    })
}

window.onload = async function () {
    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="d-flex justify-content-center">
    <div class="spinner-grow text-danger" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
`
    const data = await Connection.noBody('patrimony', 'GET')
    let patrimonys = data.map(obj => {
        let a = `<a><i data-action data-id="${obj.id}" class="btn-view fas fa-eye" ></i></a>
                 <a><i data-action data-id="${obj.id}" class="btn-blue fas fa-upload" ></i></a>
                 <a><i data-action data-code="${obj.code}" data-amount="${obj.amount}" data-brand="${obj.brand}" data-name="${obj.name}" data-id="${obj.id}" data-local="${obj.localcode}" class="btn-edit fas fa-edit" ></i></a>
                 <a><i data-action data-id="${obj.id}" class="btn-delete fas fa-trash" ></i></a>`

        let line = [a, obj.code, obj.name, obj.brand, obj.amount, obj.local, obj.date]

        return line
    })

    listPatrimonys(patrimonys)

    loading.innerHTML = " "
}

const listPatrimonys = (patrimonys) => {

    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').dataTable().fnClearTable();
        $('#dataTable').dataTable().fnDestroy();
        $('#dataTable').empty();
    }

    $("#dataTable").DataTable({
        data: patrimonys,
        columns: [
            {
                title: "Opciones",
                className: "finance-control"
            },
            { title: "Cod" },
            { title: "Nombre" },
            { title: "Marca" },
            { title: "Cantidad" },
            { title: "Local" },
            { title: "Fecha" },
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

    const action = document.querySelector('#dataTable')
    action.addEventListener('click', async (event) => {
        if (event.target && event.target.nodeName === "I" && event.target.matches("[data-action]")) {
            if (event.target.classList[0] === 'btn-delete') return deletePatrimony(event)
            if (event.target.classList[0] === 'btn-edit') return editPatrimony(event)
            if (event.target.classList[0] === 'btn-view') return viewPatrimony(event)
            if (event.target.classList[0] === 'btn-blue') return upload(event)

        }
    })

    const submit = document.querySelector('[data-submit-item]')

    submit.addEventListener('submit', async (event) => {
        event.preventDefault()

        let loading = document.querySelector('[data-loading]')
        loading.innerHTML = `
    <div class="d-flex justify-content-center">
    <div class="spinner-grow text-danger" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
`

        document.querySelector('[data-button]').disabled = true;

        const date = new Date()

        const patrimony = {
            local: event.currentTarget.local.value,
            localdesc: document.querySelector('#local option:checked').innerHTML,
            code: event.currentTarget.code.value,
            name: event.currentTarget.name.value,
            brand: event.currentTarget.brand.value,
            amount: event.currentTarget.amount.value,
            date: `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        }

        const files = event.currentTarget.file.files

        const table = $('#dataTable').DataTable();

        const formData = new FormData()

        for (const file of files) {
            formData.append("file", file);
        }

        formData.append("code", patrimony.code);
        formData.append("name", patrimony.name);
        formData.append("local", patrimony.local);
        formData.append("brand", patrimony.brand);
        formData.append("amount", patrimony.amount);

        const obj = await Connection.bodyMultipart('patrimony', formData, 'POST');

        let a = `<a><i data-action data-id="${obj.id}" class="btn-view fas fa-eye"></i></a>
                 <a><i data-action data-id="${obj.id}" class="btn-blue fas fa-upload" ></i></a>
                 <a><i data-action data-code="${patrimony.code}" data-amount="${patrimony.amount}" data-brand="${patrimony.brand}" data-name="${patrimony.name}" data-id="${obj.id}" data-local="${patrimony.local}" class="btn-edit fas fa-edit"></i></a>
                 <a><i data-action data-id="${obj.id}" class="btn-delete fas fa-trash"></i></a>`


        const rowNode = table.row.add([a, patrimony.code, patrimony.name, patrimony.brand, patrimony.amount, patrimony.localdesc, patrimony.date])
            .draw()
            .node();

        $(rowNode)
            .css('color', 'black')
            .animate({ color: '#CC0000' });

        submit.reset();
        document.querySelector('[data-button]').disabled = false;

        const file = document.querySelectorAll('.custom-file-label')
        file[0].innerHTML = `Foto`
        loading.innerHTML = ``

    });

    const select = document.querySelector('[data-select-local]')

    select.addEventListener('change', async (event) => {

        const code = await Connection.noBody(`patrimony/route/${select.value}`, 'GET');

        document.querySelector('#code').value = code
    })
}

