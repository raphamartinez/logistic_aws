import { Connection } from '../services/connection.js'

const insertDate = () => {
    const date = new Date();
    date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    let day = date.getDate()
    if (day < 10) day = `0${day}`
    const now = `${date.getFullYear()}-${(date.getMonth() + 1).toString().length == 1 ? "0" : ""}${date.getMonth() + 1}-${day}`

    const dateOld = new Date();
    dateOld.setTime(dateOld.getTime() + dateOld.getTimezoneOffset() * 60 * 1000);
    dateOld.setDate(-30)
    let dayOld = dateOld.getDate()
    if (dayOld < 10) dayOld = `0${dayOld}`
    const old = `${dateOld.getFullYear()}-${(dateOld.getMonth() + 1).toString().length == 1 ? "0" : ""}${dateOld.getMonth() + 1}-${dayOld}`

    document.querySelector("#datestart").value = old;
    document.querySelector("#dateend").value = now;
}

const listCategory = async (datestart, dateend) => {
    const orders = await Connection.noBody(`purchase/category/${datestart}/${dateend}`, 'GET')

    const amount = orders.reduce((a, b) => a + b.amount, 0);

    const dtview = orders.map(order => {
        return [
            `<a><i data-type="1" data-search="${order.category}" class="btn-view fas fa-eye"></i></a>`,
            order.category,
            order.cars,
            order.amount.toLocaleString('es'),
            (order.amount * 100 / amount).toFixed(0)
        ];
    })

    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').dataTable().fnClearTable();
        $('#dataTable').dataTable().fnDestroy();
        $('#dataTable').empty();
    }

    $("#dataTable").DataTable({
        data: dtview,
        columns: [
            { title: "Opciones", className: "text-center" },
            { title: "Gasto por Categoria" },
            {
                title: "Quant. Veíc."
                , className: "text-center"
            },
            {
                title: "Monto Total",
                className: "text-right"
            },
            {
                title: "%",
                className: "h5 text-center"
            }
        ],
        responsive: true,
        paging: false,
        ordering: false,
        info: true,
        scrollY: false,
        scrollCollapse: true,
        scrollX: true,
        autoHeight: true,
        lengthMenu: [[25, 50, 100, 150], [25, 50, 100, 150]],
        pagingType: "numbers",
        searchPanes: true,
        searching: false,
        fixedHeader: false,
        dom: "<'row'<'col-md-6'l><'col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6'p>>" +
            "<'row'<'col-sm-12'B>>",
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    })

}

const listDetails = (details) => {

    const dtview = details.map(detail => {
        let date = new Date(detail.dt_emission);

        return [
            detail.nr_oc,
            detail.nr_quotation,
            date.toLocaleDateString(),
            detail.cond_faturamento,
            detail.placa,
            detail.proveedor,
            detail.naturaleza,
            `${detail.cod_art} - ${detail.product}`,
            detail.vlr_total.toLocaleString('es'),
            detail.status_oc
        ];
    })

    if ($.fn.DataTable.isDataTable('#dataProduct')) {
        $('#dataProduct').dataTable().fnClearTable();
        $('#dataProduct').dataTable().fnDestroy();
        $('#dataProduct').empty();
    }

    $("#dataProduct").DataTable({
        data: dtview,
        columns: [
            { title: "Nr OC" },
            { title: "Nr Cot" },
            { title: "Fecha Emission" },
            { title: "Cond. Fat." },
            { title: "Placa" },
            { title: "Proveedor" },
            { title: "Naturaleza" },
            { title: "Producto" },
            { title: "Valor TT" },
            { title: "Status OC" },
        ],
        responsive: true,
        paging: false,
        ordering: true,
        info: true,
        scrollY: false,
        scrollCollapse: true,
        scrollX: true,
        autoHeight: true,
        lengthMenu: [[25, 50, 100, 150], [25, 50, 100, 150]],
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
    })

}

const view = async (event) => {
    if (event.target && event.target.getAttribute('data-search')) {

        let loading = document.querySelector('[data-loading]');
        let tr = event.path[3];
        let i = event.target;
        const type = event.target.getAttribute('data-type');
        const search = event.target.getAttribute('data-search');
        const datestart = document.querySelector('#datestart').value;
        const dateend = document.querySelector('#dateend').value;

        let purchase;

        if (tr.className === "child") tr = tr.previousElementSibling;

        switch (type) {
            case "1":
                purchase = await Connection.noBody(`purchase/model/${datestart}/${dateend}/${search}`, "GET");
                break;
            case "2":
                purchase = await Connection.noBody(`purchase/plate/${datestart}/${dateend}/${search}`, "GET");
                break;
        }

        if (purchase.orders.length === 0) return alert('No hay resultados para visualizar.');

        listDetails(purchase.details);

        loading.innerHTML = `
    <div class="d-flex justify-content-center">
    <div class="spinner-grow text-danger" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
    `;

        let row = $('#dataTable').DataTable()
            .row(tr);

        if (row.child.isShown()) {
            tr.classList.remove('bg-dark', 'text-white');
            i.classList.remove('fas', 'fa-eye-slash', 'text-white');
            i.classList.add('fas', 'fa-eye');

            row.child.hide();
            tr.classList.remove('shown');

            if ($.fn.DataTable.isDataTable('#dataProduct')) {
                $('#dataProduct').dataTable().fnClearTable();
                $('#dataProduct').dataTable().fnDestroy();
                $('#dataProduct').empty();
            }
            
            loading.innerHTML = ``;
        } else {
            tr.classList.add('bg-dark', 'text-white');
            i.classList.add('fas', 'fa-eye-slash', 'text-white');

            const amount = purchase.orders.reduce((a, b) => a + b.amount, 0);
            const table = document.createElement('table');
            table.classList.add('border-bottom')
            table.innerHTML = `
                <col style="width:25%">
                <col style="width:25%">
                <col style="width:25%">
                <col style="width:25%">`

            purchase.orders.forEach(order => {
                const newTr = document.createElement('tr');
                newTr.innerHTML = `
                <td class="text-center"><a><i data-type="2" data-search="${order.model ? order.model.replace('/', '*') : order.plate.replace('/', '*')}" class="btn-view fas fa-eye"></i></a></td>
                <td>${order.model ? order.model : order.plate}</td>
                <td>${order.cars}</td>
                <td>${order.amount.toLocaleString('es')}</td>
                <td>${(order.amount * 100 / amount).toFixed(0)}</td>`;

                table.appendChild(newTr);
            })

            row.child(table).show();

            tr.classList.add('shown');
            i.classList.remove('spinner-border', 'spinner-border-sm', 'text-light');
            i.classList.add('fas', 'fa-eye-slash', 'text-white');
            loading.innerHTML = ``;
        }
    }
}

const init = () => {
    insertDate();

    const datestart = document.querySelector('#datestart').value;
    const dateend = document.querySelector('#dateend').value;

    listCategory(datestart, dateend);

}

document.querySelector('#dataTable').addEventListener('click', view)

init()