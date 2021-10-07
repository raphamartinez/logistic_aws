import { Connection } from '../services/connection.js'
import { View } from '../views/providerView.js'

window.onload = async function () {
    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
<div class="spinner-border text-danger" role="status">
  <span class="sr-only">Loading...</span>
</div>
`
    const cars = await Connection.noBody('car/excel', 'GET')
    let user = JSON.parse(sessionStorage.getItem('user'))

    const providers = await Connection.noBody('provider', 'GET')
    selectProviders(providers)

    $('#price').mask("###0.00", { reverse: true });

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
        option.innerHTML = `${car[4]} - ${car[1]}</option>`
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
        <a data-toggle="popover" title="Deletar pieza"><i class="fas fa-trash" style="color:#CC0000;"></i></a>
        <a data-toggle="popover" title="Editar pieza"><i class="fas fa-edit" style="color:#32CD32;"></i></a>`

        let item = `
        <a data-toggle="popover" title="Visualizar pieza"><i class="fas fa-image" style="color:#87CEFA;"></i></a>`

        if (maintenance.type === "Presupuesto") {
            item += `    <a data-toggle="popover" title="Visualizar Presupuestos"><i class="fas fa-shopping-cart" style="color:#32CD32;"><span style="
            display: inline-block;
            font-size: .60em;
            font-weight: 700;
            line-height: 1;
            color: #fff;
            text-align: left;
            white-space: nowrap;
            vertical-align: baseline;
            border-radius: .50rem;" 
            class="badge badge-success">0</span></i></a>`
        }

        let line = [maintenance.date, maintenance.km, maintenance.code, maintenance.name, maintenance.type, maintenance.provider, maintenance.brand, maintenance.amount, maintenance.price, maintenance.description, a, item]
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
            { title: "Precio" },
            { title: "Observación" },
            { title: "Opciones" },
            { title: "Visualizar" }

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
        rowReorder: {
            selector: 'td:nth-child(2)'
        },
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    })
}


const submitItem = document.querySelector('[data-submit-item]')

submitItem.addEventListener('submit', async (event) => {
    event.preventDefault()

    const plate = document.querySelector('[data-cars]').value

    if (plate === "") return alert('Seleccione una chapa')

    const date = new Date()

    const maintenance = {
        plate: plate,
        name: event.currentTarget.item.value,
        provider: event.currentTarget.provider.value,
        providerdesc: document.querySelector('#provider option:checked').innerHTML,
        amount: event.currentTarget.amount.value,
        price: event.currentTarget.price.value,
        type: event.currentTarget.type.value,
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

    let a = `
    <a data-toggle="popover" title="Deletar pieza"><i class="fas fa-trash" style="color:#CC0000;"></i></a>
    <a data-toggle="popover" title="Editar pieza"><i class="fas fa-edit" style="color:#32CD32;"></i></a>`

    let item = `
    <a data-toggle="popover" title="Visualizar pieza"><i class="fas fa-image" style="color:#87CEFA;"></i></a>`

    if (maintenance.type === "1") {
        item += `    <a data-toggle="popover" title="Visualizar Presupuestos"><i class="fas fa-shopping-cart" style="color:#32CD32;"><span style="
        display: inline-block;
        font-size: .60em;
        font-weight: 700;
        line-height: 1;
        color: #fff;
        text-align: left;
        white-space: nowrap;
        vertical-align: baseline;
        border-radius: .50rem;" 
        class="badge badge-success">0</span></i></a>`
    }
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
    formData.append("type", maintenance.type);
    formData.append("plate", maintenance.plate);
    formData.append("description", maintenance.description);
    formData.append("status", maintenance.status);

    await Connection.bodyMultipart('item', formData, 'POST');

    const rowNode = table.row.add([maintenance.date, maintenance.km, maintenance.code, maintenance.name, maintenance.typedesc, maintenance.providerdesc, maintenance.brand, maintenance.amount, maintenance.price, maintenance.description, a, item])
        .draw()
        .node();

    $(rowNode)
        .css('color', 'black')
        .animate({ color: '#CC0000' });

    document.querySelector('#item').value = ""
    document.querySelector('#item').placeholder = "Pieza a ser reemplazada *"

    document.querySelector('#km').value = ""
    document.querySelector('#km').placeholder = "Inserte el KM atual del vehiculo *"

    document.querySelector('#obs').value = ""
    document.querySelector('#obs').placeholder = "Observación"

    document.querySelector('#file').value = ""
    document.querySelector('#file').placeholder = "Foto de la Pieza"

    document.querySelector('#type').value = ""
    document.querySelector('#type').placeholder = "Origen de la nueva pieza *"

    document.querySelector('#brand').value = ""
    document.querySelector('#brand').placeholder = "Marca de la pieza"

    document.querySelector('#code').value = ""
    document.querySelector('#code').placeholder = "Codigo da Pieza "

});

const selectProviders = (providers) => {

    providers.map(provider => {
        const option = document.createElement('option')
        option.value = provider.id
        option.innerHTML = `${provider.name}</option>`
        document.querySelector('[data-providers]').appendChild(option)
    })

}