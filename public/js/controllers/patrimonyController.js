import { Connection } from '../services/connection.js'
import { View } from '../views/patrimonyView.js'

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
    let user = JSON.parse(sessionStorage.getItem('user'))

    let patrimonys = []
    data.forEach(obj => {
        let a = `<a data-action data-id="${obj.id}"><i class="btn-view fas fa-eye" ></i></a>
                 <a data-action data-id="${obj.id}"><i class="btn-edit fas fa-edit" ></i></a>
                 <a data-action data-id="${obj.id}"><i class="btn-delete fas fa-trash" ></i></a>`

        let line = [a, obj.code, obj.name, obj.local, obj.date]
        patrimonys.push(line)
    })

    listPatrimonys(patrimonys)

    let name = user.name.substring(0, (user.name + " ").indexOf(" "))
    let username = document.querySelector('[data-username]')
    username.innerHTML = name
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

    const actions = document.querySelectorAll('[data-action]')
    Array.from(actions).forEach(function (action) {
        action.addEventListener('click', async (event) => {

            let btnDelete = event.target.classList[0] === 'btn-delete'
            if (btnDelete) return deletePatrimony(event)

            let btnEdit = event.target.classList[0] === 'btn-edit'
            if (btnEdit) return editPatrimony(event)

            let btnView = event.target.classList[0] === 'btn-view'
            if (btnView) return viewPatrimony(event)
        })
    })
}

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

    const obj = await Connection.bodyMultipart('patrimony', formData, 'POST');

    let a = `<a data-action data-id="${obj.id}"><i class="fas fa-eye" style="color:#000000;"></i></a>
    <a data-action data-id="${obj.id}"><i class="btn-edit fas fa-edit" style="color:#32CD32;"></i></a>
    <a data-action data-id="${obj.id}"><i class="btn-delete fas fa-trash" style="color:#CC0000;"></i></a>`


    const rowNode = table.row.add([a, patrimony.code, patrimony.name, patrimony.localdesc, patrimony.date])
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

const editPatrimony = (event) => {

    let tr = event.path[3]
    if (tr.className === "child") tr = tr.previousElementSibling

    let patrimony = {
        id: event.path[1].getAttribute('data-id'),
        code: tr.children[1].innerHTML,
        name: tr.children[2].innerHTML,
        local: tr.children[3].innerHTML,
    }

    document.querySelector('[data-modal]').innerHTML = ``
    document.querySelector('[data-modal]').appendChild(View.modalEdit(patrimony))

    $("#edit").modal('show')

    const modal = document.querySelector('[data-edit-patrimony]')
    modal.addEventListener('submit', async (event2) => {
        event2.preventDefault()

        const date = new Date()

        const newPatrimony = {
            id: patrimony.id,
            code: patrimony.code,
            name: event2.currentTarget.name.value,
            local: event2.currentTarget.local.innerHTML,
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
                    `<a data-action data-id="${newPatrimony.id}"><i class="btn-view fas fa-eye" ></i></a>
                    <a data-action data-id="${newPatrimony.id}"><i class="btn-edit fas fa-edit" ></i></a>
                    <a data-action data-id="${newPatrimony.id}"><i class="btn-delete fas fa-trash" ></i></a>`,
                    newPatrimony.code,
                    newPatrimony.name,
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

    let patrimony

    if (tr.className === "child") {

        patrimony = {
            id: event.path[1].getAttribute('data-id'),
            name: tr.children[2].innerHTML,
            local: tr.children[3].innerHTML,
        }

        tr = tr.previousElementSibling

    } else {
        patrimony = {
            id: event.path[1].getAttribute('data-id'),
            name: tr.children[2].innerHTML,
            local: tr.children[3].innerHTML,
        }
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

const viewPatrimony = async (event) => {

    let tr = event.path[3]
    let i = event.target

    if (tr.className === "child") tr = tr.previousElementSibling

    let row = $('#dataTable').DataTable()
        .row(tr)

    if (row.child.isShown()) {
        tr.classList.remove('bg-dark', 'text-white')
        i.classList.remove('fas', 'fa-eye-slash', 'text-white')
        i.classList.add('fas', 'fa-eye')

        row.child.hide();
        tr.classList.remove('shown')

        adjustModalDatatable()
    } else {

        let id_patrimony = event.path[1].getAttribute('data-id')

        tr.classList.add('bg-dark', 'text-white')
        i.classList.remove('fas', 'fa-eye')
        i.classList.add('spinner-border', 'spinner-border-sm', 'text-light')

        const files = await Connection.noBody(`file/id_patrimony/${id_patrimony}`, "GET")

        if (files.length === 0) {
            i.classList.remove('spinner-border', 'spinner-border-sm', 'text-light')
            i.classList.add('fas', 'fa-eye-slash', 'text-white')
            return alert('No hay imágenes vinculadas a este patrimonio.')
        }

        const div = document.createElement('div')

        div.classList.add('container-fluid')
        div.innerHTML = `<div class="row col-md-12" data-body></div>`

        row.child(div).show()

        let body = document.querySelector('[data-body]')

        files.forEach(file => {
            body.appendChild(View.tableImage(file))
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
    $('#dataTable').on('shown.bs.modal', function () {
        $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
    })
}