import { Connection } from '../services/connection.js'

window.onload = async function () {
    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
<div class="spinner-border text-danger" role="status">
  <span class="sr-only">Loading...</span>
</div>
`
    const data = await Connection.noBody('patrimony', 'GET')
    let user = JSON.parse(sessionStorage.getItem('user'))

    let patrimonys = []
    data.forEach(obj => {
        let a = `<a><i class="fas fa-eye" style="color:#000000;"></i></a>
        <a><i class="fas fa-edit" style="color:#32CD32;"></i></a>
    <a><i class="fas fa-trash" style="color:#CC0000;"></i></a>`

        let line = [obj.code, obj.name, obj.local, obj.date, a]
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
            { title: "Cod" },
            { title: "Nombre" },
            { title: "Local" },
            {
                title: "Fecha",
                className: "finance-control"
            },
            {
                title: "Visualizar",
                className: "finance-control"
            }
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
<div class="spinner-border text-danger" role="status">
  <span class="sr-only">Loading...</span>
</div>
`

    document.querySelector('[data-button]').disabled = true;

    const date = new Date()

    const patrimony = {
        local: event.currentTarget.local.value,
        code: event.currentTarget.code.value,
        name: event.currentTarget.name.value,
        date: `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }

    const files = event.currentTarget.file.files

    const table = $('#dataTable').DataTable();

    let a = `<a><i class="fas fa-eye" style="color:#000000;"></i></a>`

    const formData = new FormData()

    for (const file of files) {
        formData.append("file", file);
    }

    formData.append("code", patrimony.code);
    formData.append("name", patrimony.name);
    formData.append("local", patrimony.local);

    await Connection.bodyMultipart('patrimony', formData, 'POST');

    const rowNode = table.row.add([patrimony.code, patrimony.name, patrimony.local, patrimony.date,  a])
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

