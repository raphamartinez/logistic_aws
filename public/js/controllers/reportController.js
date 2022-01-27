import { ViewPowerBi } from "../views/reportView.js"
import { Connection } from '../services/connection.js'


const list = (powerbis) => {

    if ($.fn.DataTable.isDataTable('#tableReports')) {
        $('#tableReports').dataTable().fnClearTable();
        $('#tableReports').dataTable().fnDestroy();
        $('#tableReports').empty();
    }

    $("#tableReports").DataTable({
        data: powerbis,
        columns: [
            { title: "Opciones" },
            { title: "Nombre" },
            { title: "Tipo" },
            { title: "Descripción" },
            { title: "Fecha de Registro" }
        ],
        paging: true,
        ordering: true,
        info: true,
        scrollY: false,
        scrollCollapse: true,
        scrollX: true,
        autoHeight: true,
        pagingType: "numbers",
        searchPanes: true,
        fixedHeader: false,
        dom: "<'row'<'col-md-6'l><'col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6'p>>" +
            "<'row'<'col-sm-12'B>>",
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    }
    )
}

const view = (event) => {

    const title = event.target.getAttribute('data-title')
    // const description = event.target.getAttribute('data-description')
    const url = event.target.getAttribute('data-url')

    document.querySelector('[data-view-report]').innerHTML = `
    <div class="card mb-4"><iframe width="1140" height="600" src="${url}" alt="${title}" frameborder="0" allowFullScreen="true"></iframe></div>`
}

const add = async (event) => {
    event.preventDefault();
    $('#add').modal('hide');

    try {

        const date = new Date();
        date.getTime();

        let powerbi = {
            id_powerbi: 0,
            count: 0,
            title: event.currentTarget.title.value,
            url: event.currentTarget.url.value,
            type: event.currentTarget.type.value,
            typedesc: document.querySelector('#typeadd option:checked').innerHTML,
            description: event.currentTarget.description.value,
            dateReg: `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        };

        document.querySelector('[data-form-add]').reset();

        const obj = await Connection.body('powerbi', { powerbi }, 'POST');

        powerbi.id_powerbi = obj.id;

        const table = $('#tableReports').DataTable();

        const rowNode = table.row.add([
            `
            <a><i data-view data-title="${powerbi.title}" data-url="${powerbi.url}" class="btn-view fas fa-eye" style="padding: 2px;"></i></a>
            <a><i data-update data-id="${powerbi.id_powerbi}" data-title="${powerbi.title}" data-url="${powerbi.url}" data-description="${powerbi.description}" data-type="${powerbi.type}" data-count="0"  class="btn-edit fas fa-edit" style="padding: 2px;"></i></a>
            <a><i data-drop data-id="${powerbi.id_powerbi}" class="fas fa-trash" style="color:#CC0000; padding: 2px;"></i></a>
            <a><i data-add data-id="${powerbi.id_powerbi}" class="fas fa-users" style="color:#000000; padding: 2px;"><span id="row${powerbi.id_powerbi}"  class="badge badge-dark">0</span></i></a>
            `,
            `${powerbi.title}`,
            `${powerbi.typedesc}`,
            `${powerbi.description}`,
            `${powerbi.dateReg}`,
        ])
            .draw()
            .node();

        await $(rowNode)
            .css('color', 'black')
            .animate({ color: '#4e73df' });

        alert('PowerBi agregado con éxito!');
    } catch (error) {
        alert(error);
    }
}

const drop = (event) => {
    const tr = event.path[3];
    if (tr.className === "child") tr = tr.previousElementSibling;

    const id = event.target.getAttribute('data-id');
    $('#dropmodal').modal('show');

    const submit = async (event) => {
        event.preventDefault();

        const obj = await Connection.noBody(`powerbi/${id}`, 'DELETE');

        $('#tableReports').DataTable()
            .row(tr)
            .remove()
            .draw();

        $('#dropmodal').modal('hide');

        document.querySelector('[data-form-drop]').removeEventListener('submit', submit, false);
        alert(obj.msg);
    }

    document.querySelector('[data-form-drop]').addEventListener('submit', submit, false);
};

const update = (event) => {

    let tr = event.path[3];
    if (tr.className === "child") tr = tr.previousElementSibling;

    const report = {
        id: event.target.getAttribute('data-id'),
        title: event.target.getAttribute('data-title'),
        type: event.target.getAttribute('data-type'),
        url: event.target.getAttribute('data-url'),
        count: event.target.getAttribute('data-count'),
        description: event.target.getAttribute('data-description')
    };

    document.querySelector('#titleedit').value = report.title;
    document.querySelector('#typeedit').selectedIndex = report.type;
    document.querySelector('#urledit').value = report.url;
    document.querySelector('#descriptionedit').value = report.description;

    $('#editmodal').modal('show');

    const update = async (event) => {
        event.preventDefault();

        const newReport = {
            id: report.id,
            title: event.currentTarget.title.value,
            type: event.currentTarget.type.value,
            typedesc: document.querySelector('#typeedit :checked').innerHTML,
            url: event.currentTarget.url.value,
            description: event.currentTarget.description.value
        };

        const obj = await Connection.body(`powerbi/${report.id}`, { report: newReport }, 'PUT');

        $('#tableReports').DataTable()
            .row(tr)
            .remove()
            .draw();

        const date = new Date();

        const rowNode = await $('#tableReports').DataTable()
            .row
            .add([
                `
                <a><i data-view data-title="${newReport.title}" data-url="${newReport.url}" class="btn-view fas fa-eye" style="padding: 2px;"></i></a>
                <a><i data-update data-id="${report.id}" data-title="${newReport.title}" data-url="${newReport.url}" data-description="${newReport.description}" data-type="${newReport.type}" data-count="${report.count}" class="btn-edit fas fa-edit" style="padding: 2px;"></i></a>
                <a><i data-drop data-id="${report.id}" class="fas fa-trash" style="color:#CC0000; padding: 2px;"></i></a>
                <a><i data-add data-id="${report.id}" class="fas fa-users" style="color:#000000; padding: 2px;"><span id="row${report.id}"  class="badge badge-dark">${report.count}</span></i></a>
                `,
                `${newReport.title}`,
                `${newReport.typedesc}`,
                `${newReport.description}`,
                `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
            ])
            .draw()
            .node();

        await $(rowNode)
            .css('color', 'black')
            .animate({ color: '#4e73df' });

        $('#editmodal').modal('hide');

        alert(obj.msg);
        document.querySelector('[data-form-edit]').removeEventListener('submit', update, false);

    }

    document.querySelector('[data-form-edit]').addEventListener('submit', update, false);
}

const init = async () => {
    const data = await Connection.noBody('powerbis', 'GET')
    const powerbis = data.powerbis.map(powerbi => {
        let option = `<a><i data-view data-description=${powerbi.description} data-title="${powerbi.title}" data-url="${powerbi.url}" class="fas fa-eye" style="color:#cbccce; padding: 2px;"></i></a>`

        if (data.profile === 4) {
            option = `<a><i data-view data-description=${powerbi.description} data-title="${powerbi.title}" data-url="${powerbi.url}" class="fas fa-eye" style="color:#cbccce; padding: 2px;"></i></a>
            <a><i data-update data-id="${powerbi.id}" data-title="${powerbi.title}" data-url="${powerbi.url}" data-description="${powerbi.description}" data-type="${powerbi.type}" data-count="${powerbi.count}" class="fas fa-edit" style="color:#32CD32; padding: 2px;"></i></a>
            <a><i data-drop data-id="${powerbi.id}" class="fas fa-trash" style="color:#CC0000; padding: 2px;"></i></a>
            <a><i data-add data-id="${powerbi.id}"  class="fas fa-users" style="color:#000000; padding: 2px;"><span id="row${powerbi.id}"  class="badge badge-dark">${powerbi.count}</span></i></a>`
        }

        return [
            option,
            `${powerbi.title}`,
            `${powerbi.typedesc}`,
            `${powerbi.description}`,
            `${powerbi.dateReg}`,
        ]
    });

    list(powerbis);

    const action = (event) => {
        if (event.target && event.target.matches('[data-view]')) return view(event);
        if (event.target && event.target.matches('[data-drop]')) return drop(event);
        if (event.target && event.target.matches('[data-update]')) return update(event);
        if (event.target && event.target.matches('[data-add]')) return user(event);
    }

    document.querySelector('#tableReports').addEventListener('click', action, false);


    const formAdd = document.querySelector('[data-form-add]');
    if (formAdd) formAdd.addEventListener('submit', add, false);
}
init();

const adjustModalDatatable = () => {
    $('#addBiUser').on('shown.bs.modal', function (e) {
        $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
    });
};

const user = async (event) => {

    const id = event.target.getAttribute('data-id');

    const usersbi = await Connection.noBody(`powerbiview/${id}`, 'GET');

    let dtusers = usersbi.map(user => {
        return [
            `<a onclick="deleteAccessPowerbi(event)" data-id_powerbi="${id}" data-id_viewpowerbi="${user.id_viewpowerbi}" ><i class="fas fa-trash" style="color:#CC0000;"></i></a>`,
            `${user.name}`
        ];
    });

    const users = await Connection.noBody('users', 'GET');

    document.querySelector('#userselect').innerHTML = "";

    users.forEach(user => {
        let us = usersbi.find(us => user.id_login === us.id_login)

        if (!us) {
            const option = document.createElement('option')
            option.value = user.id_login
            option.innerHTML = user.name
            document.querySelector('#userselect').appendChild(option);
        }
    })

    $('#userselect').selectpicker("refresh");

    if ($.fn.DataTable.isDataTable('#tableusers')) {
        $('#tableusers').dataTable().fnClearTable();
        $('#tableusers').dataTable().fnDestroy();
        $('#tableusers').empty();
    }

    $("#tableusers").DataTable({
        data: dtusers,
        columns: [
            { title: "Opciones" },
            { title: "Usuario" }
        ],
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
        responsive: true
    })

    $('#addBiUser').modal('show');

    adjustModalDatatable()
    const add = async (event) => {
        event.preventDefault();

        const userselect = document.querySelectorAll('#userselect option:checked');
        const users = Array.from(userselect).map(el => `${el.value}`);

        const obj = await Connection.body('powerbiview', { id, users }, 'POST');

        document.getElementById(`row${id}`).innerHTML = users.length;

        $('#addBiUser').modal('hide');
        alert(obj.msg);
    };

    document.querySelector('[data-form-add-biuser]').addEventListener('submit', add);
}



window.deleteAccessPowerbi = deleteAccessPowerbi
async function deleteAccessPowerbi(event) {
    try {
        event.preventDefault();

        const btn = event.currentTarget;
        const id_viewpowerbi = btn.getAttribute("data-id_viewpowerbi");
        const id_powerbi = btn.getAttribute("data-id_powerbi");

        await Connection.noBody(`powerbiview/${id_viewpowerbi}`, 'DELETE');

        const table = $('#tableusers').DataTable();

        table
            .row(event.path[3])
            .remove()
            .draw();

        if (document.getElementById(`row${id_powerbi}`).innerHTML > 0) {
            document.getElementById(`row${id_powerbi}`).innerHTML = document.getElementById(`row${id_powerbi}`).innerHTML - 1;
        }

        alert('Acceso caducado con éxito!');
    } catch (error) {
        alert('Algo salió mal, informa al sector de TI');
    }
}

window.addModalPowerBi = addModalPowerBi;

async function addModalPowerBi(event) {
    event.preventDefault();

    const btn = event.currentTarget;
    const id_login = btn.getAttribute("data-id_login");


    let modal = document.querySelector('[data-modal]');
    modal.innerHTML = ``;

    modal.appendChild(ViewPowerBi.modalAddBisUser(id_login));

    const data = await Connection.noBody(`powerbis`, 'GET');

    const powerbisselect = document.getElementById('powerbisselect');

    data.forEach(powerbi => {
        powerbisselect.appendChild(ViewPowerBi.optionBi(powerbi));
    });

    $("#powerbisselect").selectpicker("refresh");

    $('#addpowerbi').modal('show');
}

window.addPowerBisUser = addPowerBisUser
async function addPowerBisUser(event) {
    try {
        event.preventDefault();
        $('#addpowerbi').modal('hide');

        document.querySelector('[data-loading]').style.display = "block";

        const btn = event.currentTarget;
        const id_login = btn.getAttribute("data-id_login");

        const powerbiselect = document.querySelectorAll('#powerbisselect option:checked');
        const powerbi = Array.from(powerbiselect).map(el => `${el.value}`);

        if (powerbi.length === 0) return alert("Debe seleccionar cualquier informe para agregar.");

        const obj = await Connection.body('powerbisview', { powerbi, id_login }, 'POST');

        powerbi.forEach(obj => {

            const row = ViewPowerBi.listPowerBiAdmin(obj);

            const table = $('#powerbiuserlist').DataTable();

            const rowNode = table.row.add(row)
                .draw()
                .node();

            $(rowNode)
                .css('color', 'black')
                .animate({ color: '#4e73df' });
        })


        document.querySelector('[data-loading]').style.display = "none";
        alert(obj.msg);
    } catch (error) {
        document.querySelector('[data-loading]').style.display = "none";
        alert('Algo salió mal, informa al sector de TI');
    }
}