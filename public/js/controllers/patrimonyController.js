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
        let a = `<a data-id="${obj.id}"><i class="btn-view fas fa-eye" ></i></a>
                 <a data-id="${obj.id}"><i class="btn-edit fas fa-edit" ></i></a>
                 <a data-id="${obj.id}"><i class="btn-delete fas fa-trash" ></i></a>`

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
            { title: "Fecha" }
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

    let a = `<a data-id="${obj.id}"><i class="fas fa-eye" style="color:#000000;"></i></a>
    <a data-id="${obj.id}"><i class="btn-edit fas fa-edit" style="color:#32CD32;"></i></a>
    <a data-id="${obj.id}"><i class="btn-delete fas fa-trash" style="color:#CC0000;"></i></a>`


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



const table = document.querySelector('[data-table]')

table.addEventListener('click', async (event) => {

    let btnDelete = event.target.classList[0] == 'btn-delete'

    if (btnDelete) return deletePatrimony(event)

    let btnEdit = event.target.classList[0] === 'btn-edit'

    if (btnEdit) return editPatrimony(event)
})

const editPatrimony = (event) => {

    const tr = event.path[3]

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
                    `<a data-id="${newPatrimony.id}"><i class="btn-view fas fa-eye" ></i></a>
                     <a data-id="${newPatrimony.id}"><i class="btn-edit fas fa-edit" ></i></a>
                     <a data-id="${newPatrimony.id}"><i class="btn-delete fas fa-trash" ></i></a>`,
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

    let patrimony = {
        id: event.path[1].getAttribute('data-id'),
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
