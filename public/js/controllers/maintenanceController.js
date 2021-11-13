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
    let user = JSON.parse(sessionStorage.getItem('user'))
    if (user.profile != 4) {
        document.querySelector('[data-menu]').remove()
        document.querySelector('[data-menu-adm]').remove()
    }

    const cars = await Connection.noBody('cars', 'GET')
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
        option.value = car.plate
        option.innerHTML = `${car.plate} - ${car.cartype} - ${car.brand} - ${car.model} - ${car.year}</option>`
        document.querySelector('[data-cars]').appendChild(option)
    })

}

const provider = document.querySelector('[data-providers]')

provider.addEventListener('change', async (event) => {
    if (event.target.value !== "") {
        document.querySelector('#brand').disabled = false;
        document.querySelector('#currency').disabled = false;
        document.querySelector('#price').disabled = false;
        document.querySelector('#voucher').disabled = false;
        document.querySelector('#type').disabled = false;
        document.querySelector('#amount').disabled = false;
    } else {
        document.querySelector('#brand').disabled = true;
        document.querySelector('#currency').disabled = true;
        document.querySelector('#price').disabled = true;
        document.querySelector('#voucher').disabled = true;
        document.querySelector('#type').disabled = true;
        document.querySelector('#amount').disabled = true;
    }
})

const cars = document.querySelector('[data-cars]')

cars.addEventListener('change', async (event) => {
    const plate = event.target.value

    const maintenances = await Connection.noBody(`item/${plate}`, 'GET')

    let items = []

    maintenances.forEach(maintenance => {

        let a = `
        <a data-action data-id="${maintenance.id}" data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>
        <a data-action data-id="${maintenance.id}" data-toggle="popover" title="Deletar pieza"><i class="btn-delete fas fa-trash"></i></a>
        <a data-action data-id="${maintenance.id}" data-toggle="popover" title="Editar pieza"><i class="btn-edit fas fa-edit"></i></a>`

        let line = [a, maintenance.date, maintenance.km, maintenance.code, maintenance.name, maintenance.type, maintenance.provider, maintenance.brand, maintenance.amount, maintenance.currency, maintenance.price, maintenance.description]
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
                title: "Opciones",
                className: "finance-control"
            },
            { title: "Fecha" },
            { title: "KM" },
            { title: "Cod Pieza" },
            { title: "Pieza" },
            { title: "Tipo de Troca" },
            { title: "Proveedor" },
            { title: "Marca" },
            { title: "Cant" },
            { title: "Moneda" },
            { title: "Precio" },
            { title: "Observación" }
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

            let btnDelete = event.target.classList[0] == 'btn-delete'
            if (btnDelete) return deleteMaintenance(event)

            let btnEdit = event.target.classList[0] === 'btn-edit'
            if (btnEdit) return editMaintenance(event)

            let btnView = event.target.classList[0] === 'btn-view'
            if (btnView) return viewMaintenance(event)
        })
    })
}


const submitItem = document.querySelector('[data-submit-item]')

submitItem.addEventListener('submit', async (event) => {
    event.preventDefault()

    const plate = document.querySelector('[data-cars]').value

    if (plate === "") return alert('Seleccione una chapa')

    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
    <div class="d-flex justify-content-center">
    <div class="spinner-grow text-danger" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
`

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
    <a data-action data-id="${obj.id}" data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>
    <a data-action data-id="${obj.id}" data-toggle="popover" title="Deletar pieza"><i class="btn-delete fas fa-trash"></i></a>
    <a data-action data-id="${obj.id}" data-toggle="popover" title="Editar pieza"><i class="btn-edit fas fa-edit"></i></a>`

    const rowNode = table.row.add([a, maintenance.date, maintenance.km, maintenance.code, maintenance.name, maintenance.typedesc, maintenance.providerdesc, maintenance.brand, maintenance.amount, maintenance.currency, maintenance.price, maintenance.description])
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



const editMaintenance = async (event) => {

    let tr = event.path[3]
    if (tr.className === "child") tr = tr.previousElementSibling

    let id = event.path[1].getAttribute('data-id')

    const maintenance = await Connection.noBody(`itemview/${id}`, 'GET')
    const providers = await Connection.noBody('provider', 'GET')

    document.querySelector('[data-modal]').innerHTML = ``
    document.querySelector('[data-modal]').appendChild(ViewMaintenance.modalEdit(maintenance))

    document.getElementById("provideredit").selectedIndex = maintenance.provider;
    document.getElementById("typeedit").selectedIndex = maintenance.type;
    document.getElementById("currencyedit").selectedIndex = maintenance.currency;

    providers.map(provider => {
        const option = document.createElement('option')
        option.value = provider.id
        option.innerHTML = `${provider.name}</option>`
        document.querySelector('[data-providers-edit]').appendChild(option)
    })

    $("#edit").modal('show')

    const provider = document.querySelector('[data-providers-edit]')

    provider.addEventListener('change', async (event) => {
        if (event.target.value !== "") {
            document.querySelector('#brandedit').disabled = false;
            document.querySelector('#currencyedit').disabled = false;
            document.querySelector('#priceedit').disabled = false;
            document.querySelector('#voucheredit').disabled = false;
            document.querySelector('#typeedit').disabled = false;
            document.querySelector('#amountedit').disabled = false;

        } else {
            document.querySelector('#brandedit').disabled = true;
            document.querySelector('#currencyedit').disabled = true;
            document.querySelector('#priceedit').disabled = true;
            document.querySelector('#voucheredit').disabled = true;
            document.querySelector('#typeedit').disabled = true;
            document.querySelector('#amountedit').disabled = false;
            document.querySelector('#brandedit').required = true;
            document.querySelector('#currencyedit').required = true;
            document.querySelector('#priceedit').required = true;
            document.querySelector('#voucheredit').required = true;
            document.querySelector('#typeedit').required = true;
            document.querySelector('#amountedit').required = false;

        }
    })

    const modal = document.querySelector('[data-edit-maintenance]')
    modal.addEventListener('submit', async (event2) => {
        event2.preventDefault()

        const plate = document.querySelector('[data-cars]').value


        const date = new Date()

        const newMaintenance = {
            id: id,
            plate: plate,
            name: event2.currentTarget.item.value,
            provider: event2.currentTarget.provider.value,
            providerdesc: document.querySelector('#provideredit option:checked').innerHTML,
            amount: event2.currentTarget.amount.value,
            price: event2.currentTarget.price.value,
            type: event2.currentTarget.type.value,
            currency: event2.currentTarget.currency.value,
            code: event2.currentTarget.code.value,
            brand: event2.currentTarget.brand.value,
            typedesc: document.querySelector('#typeedit option:checked').innerHTML,
            description: event2.currentTarget.obs.value,
            km: event2.currentTarget.km.value,
            date: `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
        }

        const files = event2.currentTarget.file.files

        const formData = new FormData()

        for (const file of files) {
            formData.append("file", file);
        }

        formData.append("id", newMaintenance.id);
        formData.append("voucher", event2.currentTarget.voucher.files[0]);
        formData.append("name", newMaintenance.name);
        formData.append("price", newMaintenance.price);
        formData.append("amount", newMaintenance.amount);
        formData.append("provider", newMaintenance.provider);
        formData.append("code", newMaintenance.code);
        formData.append("km", newMaintenance.km);
        formData.append("brand", newMaintenance.brand);
        formData.append("currency", newMaintenance.currency);
        formData.append("type", newMaintenance.type);
        formData.append("plate", newMaintenance.plate);
        formData.append("description", newMaintenance.description);

        const obj = await Connection.bodyMultipart(`item/${id}`, formData, 'PUT');

        const table = $('#dataTable').DataTable()

        table
            .row(tr)
            .remove()
            .draw();

        const rowNode = table.row.add([
            `<a data-action data-id="${id}" data-toggle="popover" title="Visualizar pieza"><i class="btn-view fas fa-eye"></i></a>
             <a data-action data-id="${id}" data-toggle="popover" title="Deletar pieza"><i class="btn-delete fas fa-trash"></i></a>
             <a data-action data-id="${id}" data-toggle="popover" title="Editar pieza"><i class="btn-edit fas fa-edit"></i></a>`,
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
            newMaintenance.description
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
    if (tr.className === "child") tr = tr.previousElementSibling

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


const viewMaintenance = async (event) => {

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

        let id_item = event.path[1].getAttribute('data-id')

        tr.classList.add('bg-dark', 'text-white')
        i.classList.remove('fas', 'fa-eye')
        i.classList.add('spinner-border', 'spinner-border-sm', 'text-light')

        const files = await Connection.noBody(`file/id_item/${id_item}`, "GET")

        if (files.length === 0) {
            i.classList.remove('spinner-border', 'spinner-border-sm', 'text-light')
            i.classList.add('fas', 'fa-eye-slash', 'text-white')
            return alert('No hay imágenes vinculadas a esta pieza.')
        }

        const div = document.createElement('div')

        div.classList.add('container-fluid')
        div.innerHTML = `<div class="row col-md-12" data-body></div>`

        row.child(div).show()

        let body = document.querySelector('[data-body]')

        files.forEach(file => {
            body.appendChild(ViewMaintenance.tableImage(file))
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