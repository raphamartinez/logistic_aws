import { Connection } from '../services/connection.js'
import { View } from '../views/admView.js'

const edit = (event) => {

    let tr = event.path[3]
    const id_user = event.target.getAttribute('data-id_user')
    const id_login = event.target.getAttribute('data-id_login')
    const dateReg = event.target.getAttribute('data-dateReg')

    if (tr.className === "child") tr = tr.previousElementSibling

    let user = {
        id_user: id_user,
        id_login: id_login,
        name: event.target.getAttribute('data-name'),
        access: event.target.getAttribute('data-access'),
        mail: event.target.getAttribute('data-mail'),
        profile: event.target.getAttribute('data-profile'),
        thirst: event.target.getAttribute('data-thirst')
    }

    document.querySelector('[data-modal]').innerHTML = ``
    document.querySelector('[data-modal]').appendChild(View.modalEdit(user))
    document.querySelector('#profileedit').selectedIndex = user.profile

    const places = user.thirst.split(",")

    if(places.length > 0 && user.profile != 4){
        document.querySelector('#thirstedit').classList.remove('d-none')

        const optionsPlace = document.querySelectorAll('#thirstedit option')
        optionsPlace.forEach(option => {
            let check = places.find(place => place === option.value)

            if(check)option.selected = true
        })
        document.querySelector('#thirstedit').classList.remove('d-none')
    }

    $("#edit").modal('show')

    const modal = document.querySelector('[data-edit-user]')
    modal.addEventListener('submit', async (event2) => {
        event2.preventDefault()

        let newThirsts

        let thirstselecteds = document.querySelectorAll('#thirstedit :checked')
        newThirsts = Array.from(thirstselecteds).map(e => e.value)

        const newUser = {
            id_login: id_login,
            name: event2.currentTarget.name.value,
            access: event2.currentTarget.access.value,
            mail: event2.currentTarget.mail.value,
            places: newThirsts,
            profile: event2.currentTarget.profile.value,
            profiledesc: document.querySelector('#profileedit option:checked').innerHTML
        }

        const obj = await Connection.body(`user/${id_login}`, { newUser }, 'PUT')

        const table = $('#dataTable').DataTable()

        table
            .row(tr)
            .remove()
            .draw();

        const rowNode = table
            .row
            .add(
                [
                    `
                    <a><i data-action data-id_login="${id_login}" class="btn-gold fas fa-key" ></i></a>
                    <a><i data-action data-thirst="${newThirsts}" data-dateReg="${dateReg}" data-id_user="${id_user}" data-id_login="${id_login}" data-profile="${newUser.profile}" data-name="${newUser.name}" data-access="${newUser.access}" data-mail="${newUser.mail}" class="btn-edit fas fa-edit"></i></a>
                    <a><i data-action data-id_login="${id_login}" class="btn-delete fas fa-trash"></i></a>`,
                    newUser.name,
                    newUser.access,
                    newUser.mail,
                    newUser.profiledesc,
                    dateReg
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
    const id_login = event.target.getAttribute('data-id_login')

    document.querySelector('[data-modal]').innerHTML = ``
    document.querySelector('[data-modal]').appendChild(View.modalDelete())

    $("#delete").modal('show')

    const modal = document.querySelector('[data-delete-user]')
    modal.addEventListener('submit', async (event2) => {
        event2.preventDefault()

        const obj = await Connection.noBody(`user/${id_login}`, 'DELETE')

        $('#dataTable').DataTable()
            .row(tr)
            .remove()
            .draw();

        $("#delete").modal('hide')

        alert(obj.msg)
    })
}

const pass = async (event) => {
    const id = event.target.getAttribute('data-id_login')

    document.querySelector('[data-modal]').innerHTML = ``
    document.querySelector('[data-modal]').appendChild(View.modalPass())

    const checkpassedit = () => {
        if (document.querySelector('#passedit').value.length > 5 && document.querySelector('#passedit').value === document.querySelector('#confpassedit').value) {
            document.querySelector('[data-btn-edit-pass]').disabled = false
        } else {
            document.querySelector('[data-btn-edit-pass]').disabled = true
        }
    }

    document.querySelector('#passedit').addEventListener('keyup', checkpassedit, false)
    document.querySelector('#confpassedit').addEventListener('keyup', checkpassedit, false)

    $("#passmodal").modal('show')

    const modal = document.querySelector('[data-edit-pass]')
    modal.addEventListener('submit', async (event2) => {
        event2.preventDefault()

        let user = {
            pass: event2.currentTarget.pass.value,
            confpass: event2.currentTarget.confpass.value,
            id
        }

        const obj = await Connection.body(`changepass`, { user }, 'POST')

        document.querySelector('#passedit').removeEventListener('keyup', pass, false)
        document.querySelector('#confpassedit').removeEventListener('keyup', pass, false)

        $("#passmodal").modal('hide')
        document.querySelector('[data-modal]').innerHTML = ``

        alert(obj.msg)
    })
}

const table = async () => {
    const data = await Connection.noBody('users', 'GET')

    const users = data.map(user => {
        let options = `
        <a><i data-action data-id_login="${user.id_login}" class="btn-gold fas fa-key" ></i></a>
        <a><i data-action data-id_user="${user.id}" data-id_login="${user.id_login}" data-dateReg="${user.dateReg}" data-profile="${user.profile}" data-name="${user.name}" data-access="${user.access}" data-mail="${user.mail}" data-thirst="${user.places}" class="btn-edit fas fa-edit"></i></a>
        <a><i data-action data-id_user="${user.id}" data-id_login="${user.id_login}" class="btn-delete fas fa-trash"></i></a>`
        let line = [
            options,
            user.name,
            user.access,
            user.mail,
            user.profiledesc,
            user.dateReg
        ]

        return line
    })

    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').dataTable().fnClearTable();
        $('#dataTable').dataTable().fnDestroy();
        $('#dataTable').empty();
    }

    const table = $("#dataTable").DataTable({
        data: users,
        columns: [
            {
                title: "Opciones",
                className: "finance-control"
            },
            { title: "Nombre" },
            { title: "Acceso" },
            { title: "E-mail Organizacional" },
            { title: "Perfil" },
            { title: "Fecha de Registro" }
        ],
        responsive: true,
        paging: false,
        ordering: true,
        info: true,
        scrollY: false,
        scrollCollapse: true,
        scrollX: true,
        autoHeight: true,
        lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
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

    const action = document.querySelector('#dataTable')
    action.addEventListener('click', async (event) => {
        if (event.target && event.target.nodeName === "I" && event.target.matches("[data-action]")) {
            if (event.target.classList[0] === 'btn-delete') return drop(event)
            if (event.target.classList[0] === 'btn-edit') return edit(event)
            if (event.target.classList[0] === 'btn-gold') return pass(event)
        }
    })

    const add = async (event) => {
        event.preventDefault()

        let places = []

        const placesSelect = document.querySelectorAll('#place :checked')
        places = Array.from(placesSelect).map(e => e.value)

        const user = {
            name: event.currentTarget.name.value,
            access: event.currentTarget.access.value,
            mail: event.currentTarget.mail.value,
            profile: event.currentTarget.profile.value,
            profiledesc: document.querySelector('#profile :checked').innerHTML,
            pass: event.currentTarget.pass.value,
            places
        }

        event.currentTarget.reset()
        document.querySelector('[data-btn-add]').disabled = true

        const obj = await Connection.body('user', { user }, 'POST')

        const date = new Date()

        let options = `
        <a><i data-action data-id_login="${obj.id_login}" class="btn-gold fas fa-key" ></i></a>
        <a><i data-action data-id_user="${obj.id_user}" data-id_login="${obj.id_login}" data-dateReg="${`${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}" data-profile="${user.profile}" data-name="${user.name}" data-access="${user.access}" data-mail="${user.mail}" class="btn-edit fas fa-edit"></i></a>
        <a><i data-action data-id_user="${obj.id_user}" data-id_login="${obj.id_login}" class="btn-delete fas fa-trash"></i></a>`

        const rowNode = table
            .row
            .add([options, user.name, user.access, user.mail, user.profiledesc, `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`])
            .draw()
            .node();

        $(rowNode)
            .css('color', 'black')
            .animate({ color: '#CC0000' });

        alert(obj.msg)
    }

    document.querySelector('[data-form-add]').addEventListener('submit', add, false)
}

const checkpass = () => {
    if (document.querySelector('#pass').value.length > 5 && document.querySelector('#pass').value === document.querySelector('#passconf').value) {
        document.querySelector('[data-btn-add]').disabled = false
    } else {
        document.querySelector('[data-btn-add]').disabled = true
    }
}

const checkProfile = (event) => {
    if (event.target && event.target.value != 4) {
        document.querySelector('#place').classList.remove('d-none')
        document.querySelector('#place').required = true
    }else{
        document.querySelector('#place').classList.add('d-none')
        document.querySelector('#place').required = false
    }
}

document.querySelector('#profile').addEventListener('change', checkProfile, false)
document.querySelector('#pass').addEventListener('keyup', checkpass, false)
document.querySelector('#passconf').addEventListener('keyup', checkpass, false)

window.onload = async function () {
    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
  <div class="d-flex justify-content-center">
    <div class="spinner-grow text-danger" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>`

    let user = JSON.parse(sessionStorage.getItem('user'))
    let name = user.name.substring(0, (user.name + " ").indexOf(" "))
    let username = document.querySelector('[data-username]')
    username.innerHTML = name

    table()

    loading.innerHTML = " "
}

