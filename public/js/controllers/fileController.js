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
    const data = await Connection.noBody('file/5', 'GET')
    let patrimonys = data.map(obj => {
        const a = `<a><i data-action data-id="${obj.id}" data-name="${obj.name}" data-url="${obj.path}" data-description="${obj.description}" class="btn-view fas fa-eye" ></i></a>`
        const line = [a, obj.name, obj.description, obj.type == 1 ? "Archivo" : "Link", obj.date]

        return line
    })

    listPatrimonys(patrimonys)

    loading.innerHTML = " "
}

const edit = (event) => {

    let tr = event.path[3]
    if (tr.className === "child") tr = tr.previousElementSibling

    let amount = event.target.getAttribute('data-amount')
    let brand = event.target.getAttribute('data-brand')
    if (amount == "null") amount = ""
    if (brand == "null") brand = ""

    let file = {
        id: event.target.getAttribute('data-id'),
        code: event.target.getAttribute('data-code'),
        name: event.target.getAttribute('data-name'),
        brand: brand,
        amount: amount,
        localcode: event.target.getAttribute('data-local')
    }

    document.querySelector('[data-modal]').innerHTML = ``
    document.querySelector('[data-modal]').appendChild(View.modalEdit(file))

    document.querySelector('#localedit').selectedIndex = file.localcode

    $("#edit").modal('show')

    const modal = document.querySelector('[data-edit-patrimony]')
    modal.addEventListener('submit', async (event2) => {
        event2.preventDefault()

        const date = new Date()

        const newFile = {
            id: file.id,
            code: patrimony.code,
            name: event2.currentTarget.name.value,
            brand: event2.currentTarget.brand.value,
            amount: event2.currentTarget.amount.value,
            local: event2.currentTarget.local.value,
            localdesc: document.querySelector('#localedit option:checked').innerHTML,
            date: `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
        }

        const obj = await Connection.body(`file/${newFile.id}`, { newFile }, 'PUT')

        const table = $('#dataTable').DataTable()

        table
            .row(tr)
            .remove()
            .draw();

        const rowNode = table
            .row
            .add(
                [
                    `<a><i data-action data-id="${obj.id}" data-title="${obj.title}" data-url="${obj.url}" data-description="${obj.description}" class="btn-view fas fa-eye" ></i></a>`,
                    newFile.code,
                    newFile.name,
                    newFile.brand,
                    newFile.date
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

const drop = (event) => {
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


const adjustModalDatatable = () => {
    $('#dataTable').on('shown.bs.modal', function () {
        $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
    })
}

const type = (event) => {
    const value = event.target.value;

    switch (value) {
        case "1":
            document.querySelector('#file').classList.remove('d-none');
            document.querySelector('#file').required = true;

            document.querySelector('#url').classList.add('d-none');
            document.querySelector('#url').required = false;

            break;
        case "2":
            document.querySelector('#file').classList.add('d-none');
            document.querySelector('#file').required = false;

            document.querySelector('#url').classList.remove('d-none');
            document.querySelector('#url').required = true;
            break;
    }
}

document.querySelector('#type1').addEventListener('click', type)
document.querySelector('#type2').addEventListener('click', type)

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
            { title: "Nombre" },
            { title: "Descripción" },
            { title: "Tipo" },
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
        pagingType: "numbers",
        searchPanes: false,
        fixedHeader: false,
        searching: false,
        dom: "<'row'<'col-md-6'l><'col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6'p>>" +
            "<'row'<'col-sm-12'B>>",
        buttons: [
            'copy', 'excel',
        ]
    })
}

const view = (event) => {

    const name = event.target.getAttribute('data-name')
    const description = event.target.getAttribute('data-description')
    const url = event.target.getAttribute('data-url')

    document.querySelector('[data-view-file]').innerHTML = `
    <div class="card col-md-12 mb-4">
        <div class="col-md-12 text-center">
            <div class="d-sm-flex align-items-center justify-content-md-center">
                <h2 class="h4 mb-0 text-gray-700">${name}</h2>
            </div>
            <div class="d-sm-flex align-items-center justify-content-md-center mb-4">
                <h5 class="h6 mb-0 text-secondary">${description}</h5>
            </div>
        </div>
        <iframe width="1140" height="600" src="${url}" alt="${name}" frameborder="0" allowFullScreen="true"></iframe>
    </div>`
}

const action = document.querySelector('#dataTable')
action.addEventListener('click', async (event) => {
    if (event.target && event.target.nodeName === "I" && event.target.matches("[data-action]")) {
        if (event.target.classList[0] === 'btn-view') return view(event)
    }
})

document.querySelector('[data-form-add]').addEventListener('submit', async (event) => {
    event.preventDefault();

    let loading = document.querySelector('[data-loading]');
    loading.innerHTML = `<div class="d-flex justify-content-center">
    <div class="spinner-grow text-danger" role="status">
        <span class="sr-only">Loading...</span>
    </div></div>`;

    document.querySelector('[data-add-button]').disabled = true;

    const date = new Date();

    const patrimony = {
        description: event.currentTarget.description.value,
        url: event.currentTarget.url.value,
        name: event.currentTarget.name.value,
        type: document.querySelector('input[name="type"]:checked').value,
        download: document.querySelector('input[name="download"]:checked').value,
        file: event.currentTarget.file.value,
        date: `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    };

    const formData = new FormData();

    if (event.currentTarget.file.files.length > 0) formData.append("file", event.currentTarget.file.files[0]);
    formData.append("name", patrimony.name);
    formData.append("url", patrimony.url);
    formData.append("description", patrimony.description);
    formData.append("type", patrimony.type);
    formData.append("download", patrimony.download);
    formData.append("typeFile", 1);

    const obj = await Connection.bodyMultipart('file', formData, 'POST');

    const a = `<a><i data-action data-id="${obj.id}" data-title="${obj.title}" data-url="${obj.url}" data-description="${obj.description}" class="btn-view fas fa-eye"></i></a>`
    const table = $('#dataTable').DataTable();
    const rowNode = table.row.add([a, patrimony.name, patrimony.description, patrimony.type == 1 ? "Archivo" : "Link", patrimony.date])
        .draw()
        .node();

    $(rowNode)
        .css('color', 'black')
        .animate({ color: '#CC0000' });

    document.querySelector('[data-form-add]').reset();
    document.querySelector('[data-add-button]').disabled = false;

    loading.innerHTML = ``;
});
