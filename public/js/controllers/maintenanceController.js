import { Connection } from '../services/connection.js'
import { View } from '../views/providerView.js'
import { View as ViewMaintenance } from '../views/maintenanceView.js'


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

    const providers = await Connection.noBody('provider', 'GET')
    selectProviders(providers)
    $('#price').mask('#.000.000.000.000.000,00', { reverse: true });

    selectCars(cars)

    let name = user.name.substring(0, (user.name + " ").indexOf(" "))
    let username = document.querySelector('[data-username]')
    username.innerHTML = name
    loading.innerHTML = " "
}


const selectCars = (cars) => {

    cars.map(car => {
        const option = document.createElement('option')
        option.value = car[4]
        option.innerHTML = `${car[4]} - ${car[1]} - ${car[2]} - ${car[3]} - ${car[6]}</option>`
        document.querySelector('[data-cars]').appendChild(option)
    })

}

const cars = document.querySelector('[data-cars]')

cars.addEventListener('change', async (event) => {
    const plate = event.target.value

    const maintenances = await Connection.noBody(`item/${plate}`, 'GET')

    let items = []

    maintenances.forEach(maintenance => {

        let a = `
        <a data-id="${maintenance.id}" data-toggle="popover" title="Deletar pieza"><i class="btn-delete fas fa-trash"></i></a>
        <a data-id="${maintenance.id}" data-toggle="popover" title="Editar pieza"><i class="btn-edit fas fa-edit"></i></a>`

        let item = `
        <a data-id="${maintenance.id}" data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>`

        let line = [maintenance.date, maintenance.km, maintenance.code, maintenance.name, maintenance.type, maintenance.provider, maintenance.brand, maintenance.amount, maintenance.currency, maintenance.price, maintenance.description, a, item]
        items.push(line)
    })

    listMaintenances(items)
});

const modalInsert = document.querySelector('[data-modal-insert]')

modalInsert.addEventListener('click', async (event) => {
    event.preventDefault()

    document.querySelector('[data-modal]').innerHTML = ""
    document.querySelector('[data-modal]').appendChild(View.modalForm())
    $('#register').modal('show')

    const submit = document.querySelector('[data-input-provider]')
    submit.addEventListener('submit', async (event) => {
        event.preventDefault()

        let loading = document.querySelector('[data-loading]')
        loading.innerHTML = `
    <div class="spinner-grow text-danger" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `

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
        document.querySelector('[data-providers]').appendChild(option)

        loading.innerHTML = ``
        alert(obj.msg)
    })
})


const listMaintenances = (maintenances) => {

    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').dataTable().fnClearTable();
        $('#dataTable').dataTable().fnDestroy();
        $('#dataTable').empty();
    }

    $("#dataTable").DataTable({
        data: maintenances,
        columns: [
            {
                title: "Fecha",
                className: "finance-control"
            },
            { title: "KM" },
            { title: "Cod Pieza" },
            { title: "Pieza" },
            { title: "Tipo de Troca" },
            { title: "Proveedor" },
            { title: "Marca" },
            { title: "Cant" },
            { title: "Moneda" },
            { title: "Precio" },
            { title: "Observación" },
            { title: "Opciones" },
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


const submitItem = document.querySelector('[data-submit-item]')

submitItem.addEventListener('submit', async (event) => {
    event.preventDefault()

    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="d-flex justify-content-center">
    <div class="spinner-grow text-danger" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
`


    const plate = document.querySelector('[data-cars]').value

    if (plate === "") return alert('Seleccione una chapa')

    document.querySelector('[data-button-submit]').disabled = true;

    const date = new Date()
    $('#price').unmask();

    const maintenance = {
        plate: plate,
        name: event.currentTarget.item.value,
        provider: event.currentTarget.provider.value,
        providerdesc: document.querySelector('#provider option:checked').innerHTML,
        amount: event.currentTarget.amount.value,
        price: event.currentTarget.price.value,
        type: event.currentTarget.type.value,
        currency: event.currentTarget.currency.value,
        code: event.currentTarget.code.value,
        brand: event.currentTarget.brand.value,
        typedesc: document.querySelector('#type option:checked').innerHTML,
        description: event.currentTarget.obs.value,
        km: event.currentTarget.km.value,
        status: 0,
        date: `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }

    const files = event.currentTarget.file.files

    const table = $('#dataTable').DataTable();

    const formData = new FormData()

    for (const file of files) {
        formData.append("file", file);
    }

    formData.append("voucher", event.currentTarget.voucher.files[0]);
    formData.append("name", maintenance.name);
    formData.append("price", maintenance.price);
    formData.append("amount", maintenance.amount);
    formData.append("provider", maintenance.provider);
    formData.append("code", maintenance.code);
    formData.append("km", maintenance.km);
    formData.append("brand", maintenance.brand);
    formData.append("currency", maintenance.currency);
    formData.append("type", maintenance.type);
    formData.append("plate", maintenance.plate);
    formData.append("description", maintenance.description);
    formData.append("status", maintenance.status);

    const obj = await Connection.bodyMultipart('item', formData, 'POST');

    let a = `
    <a data-id="${obj.id}" data-toggle="popover" title="Deletar pieza"><i class="btn-delete fas fa-trash"></i></a>
    <a data-id="${obj.id}" data-toggle="popover" title="Editar pieza"><i class="btn-edit fas fa-edit"></i></a>`

    let item = `
    <a data-id="${obj.id}" data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>`

    const rowNode = table.row.add([maintenance.date, maintenance.km, maintenance.code, maintenance.name, maintenance.typedesc, maintenance.providerdesc, maintenance.brand, maintenance.amount, maintenance.currency, maintenance.price, maintenance.description, a, item])
        .draw()
        .node();

    $(rowNode)
        .css('color', 'black')
        .animate({ color: '#CC0000' });

    submitItem.reset();
    document.querySelector('[data-button-submit]').disabled = false;

    const file = document.querySelectorAll('.custom-file-label')
    file[0].innerHTML = `Foto de la Pieza`
    file[1].innerHTML = `Foto de lo Presupuesto`

    loading.innerHTML = ``
});

const selectProviders = (providers) => {

    providers.map(provider => {
        const option = document.createElement('option')
        option.value = provider.id
        option.innerHTML = `${provider.name}</option>`
        document.querySelector('[data-providers]').appendChild(option)
    })

}

const currency = document.querySelector('[data-currency]')

currency.addEventListener('change', async (event) => {

    if (currency.value === "2") {
        $('#price').unmask();
        document.querySelector('#price').value = "00"
        $('#price').mask('000.000.000.000.000,00', { reverse: true });
    } else {
        $('#price').unmask();
        document.querySelector('#price').value = "0000"
        $('#price').mask('000.000.000.000.000.000,00', { reverse: true });

    }

})

const table = document.querySelector('[data-table]')

table.addEventListener('click', async (event) => {

    let btnDelete = event.target.classList[0] == 'btn-delete'

    if (btnDelete) return deleteMaintenance(event)

    let btnEdit = event.target.classList[0] === 'btn-edit'

    if (btnEdit) return editMaintenance(event)
})

const editMaintenance = (event) => {

    let tr = event.path[3]
    let id = event.path[1].getAttribute('data-id')

    const maintenance = await Connection.noBody(`item/${id}`, 'GET')

    document.querySelector('[data-modal]').innerHTML = ``
    document.querySelector('[data-modal]').appendChild(ViewMaintenance.modalEdit(maintenance))

    $("#edit").modal('show')

    const modal = document.querySelector('[data-edit-maintenance]')
    modal.addEventListener('submit', async (event2) => {
        event2.preventDefault()

        const date = new Date()

        const newMaintenance = {
            id: id,
            km: event2.currentTarget.km.value,
            code: event2.currentTarget.code.value,
            name: event2.currentTarget.name.value,
            type: event2.currentTarget.type.value,
            typedesc: event2.currentTarget.code.value,
            provider: event2.currentTarget.provider.value,
            providerdesc: event2.currentTarget.km.value,
            brand: event2.currentTarget.brand.value,
            amount: event2.currentTarget.amount.value,
            currency: event2.currentTarget.currency.value,
            price: event2.currentTarget.price.value,
            description: event2.currentTarget.description.value,
            date: `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
        }

        const obj = await Connection.body(`item/${id}`, { newMaintenance }, 'PUT')

        const table = $('#dataTable').DataTable()

        if (tr.className === "child") tr = tr.previousElementSibling

        table
            .row(tr)
            .remove()
            .draw();

        const rowNode = table.row.add([
            newMaintenance.date,
            newMaintenance.km,
            newMaintenance.code,
            newMaintenance.name,
            newMaintenance.typedesc,
            newMaintenance.providerdesc,
            newMaintenance.brand,
            newMaintenance.amount,
            newMaintenance.currency,
            newMaintenance.price,
            newMaintenance.description,
            `<a data-id="${id}" data-toggle="popover" title="Deletar pieza"><i class="btn-delete fas fa-trash"></i></a>
             <a data-id="${id}" data-toggle="popover" title="Editar pieza"><i class="btn-edit fas fa-edit"></i></a>`,
            `<a data-id="${id}" data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>`
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


const deleteMaintenance = (event) => {

    let tr = event.path[6]

    let maintenance = {
        id: event.path[1].getAttribute('data-id')
    }

    document.querySelector('[data-modal]').innerHTML = ``
    document.querySelector('[data-modal]').appendChild(ViewMaintenance.modalDelete())

    $("#delete").modal('show')

    const modal = document.querySelector('[data-delete-maintenance]')
    modal.addEventListener('submit', async (event2) => {
        event2.preventDefault()

        const obj = await Connection.noBody(`item/${maintenance.id}`, 'DELETE')

        if (tr.className === "child") tr = tr.previousElementSibling
        $('#dataTable').DataTable()
            .row(tr)
            .remove()
            .draw();

        $("#delete").modal('hide')

        alert(obj.msg)
    })
}
