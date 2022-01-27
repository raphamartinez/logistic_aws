
const showSimplePowerBI = (simpleBI) => {
    simpleBI.innerHTML = `   
    <iframe width="1140" height="600" src="https://app.powerbi.com/reportEmbed?reportId=8deb357b-76b9-4c78-a5ae-fd4b45e8c4a8&autoAuth=true&ctid=7c233ef6-b75d-4d21-8319-f199fda36ea0&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLWJyYXppbC1zb3V0aC1iLXByaW1hcnktcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQvIn0%3D" frameborder="0" allowFullScreen="true"></iframe>`
}


const showPowerBI = (url) => {
    simpleBI.innerHTML = `   
    <iframe  src="${url}" frameborder="0" allowFullScreen="true"></iframe>`
}

const showModalEdit = () => {
    const div = document.createElement('div')

    const content = `


`
    div.innerHTML = content

    return div
}

const showModalDelete = (id_powerbi, id_login) => {
    const div = document.createElement('div')

    const content = `
`

    div.innerHTML = content

    return div
}


const listPowerBi = (powerbi) => {

    const content =[
       `<a onclick="viewBi(event)" href="" data-title="${powerbi.title}" data-url="${powerbi.url}"><i class="fas fa-eye" style="color:#cbccce;"></i></a>`,
       `${powerbi.title}`,
       `${powerbi.typedesc}`,
       `${powerbi.description}`,
       `${powerbi.dateReg}`,
      ]

    return content
}

const listPowerBiAdmin = (powerbi, id_login) => {

    const content =  [
        `
        
        `,
        `${powerbi.title}`,
        `${powerbi.typedesc}`,
        `${powerbi.description}`,
        `${powerbi.dateReg}`,
       ]

    return content
}

const header = () => {
    const line = document.createElement('tr')

    const content =
        `
        <th scope="col">Opciones</th>
        <th scope="col">Nombre</th>
        <th scope="col">Tipo</th>
        <th scope="col">Fecha de Registro</th>
    </tr`
    line.innerHTML = content

    return line
}


const showModalPbiInsert = () => {
    const div = document.createElement('div')

    const content = `
<div class="modal fade" id="addpbx" tabindex="-1">
<div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Agregar informe</h5>
            <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
            </button>
        </div>
        <form data-add-pbx>
            <div class="modal-body">
                <div class="form-row">      
                <div class="form-group col-md-6">
                        <input type="text" placeholder="Título" class="form-control" name="title" id="title" required>
                        </div>  
                        <div class="form-group col-md-6">
                    <select class="form-control" name="type" id="typeadd" required>
                    <option value="" disabled selected>Tipo</option>
                    <option value="1" >Informe</option>
                    <option value="2">Personal</option>
                    <option value="3">Seguridad - Vehículos</option>
                    <option value="4">Seguridad - Sucursales</option>
                </select>
                </div>  
                <div class="form-group col-md-12">
                <input type="url" placeholder="Url" class="form-control" name="url" id="url" required>
                </div> 
                <div class="form-group col-md-12">
                <textarea placeholder="Descripción del informe..." id="description" name="description" class="form-control"></textarea>
                </div> 
                </div> 
            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                <button type="submit" name="btn" class="btn btn-success"><i class="fas fa-check"> Confirmar</i></button>   
            </div>
        </form>
    </div>
</div>
</div>

`
    div.innerHTML = content

    return div
}

const optionUser = (user) => {
    const line = document.createElement('option')

    line.value = user.id_login

    const content = ` ${user.name}</option>`

    line.innerHTML = content

    return line
}

const buttons = () => {

    const divbtn = document.createElement('div')

    const content = `    
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <div class="col-md-12 text-left">
            <button type="button" data-toggle="modal" data-target="#addpbx" class="btn btn-success">
            Registrar Informe
            </button>
        </div>
    </div>`

    divbtn.innerHTML = content
    
    return divbtn
}

const lineUsersBi = (user, id_powerbi) => {
    const content = [
        `<a onclick="deleteAccessPowerbi(event)" data-id_powerbi="${id_powerbi}" data-id_viewpowerbi="${user.id_viewpowerbi}" ><i class="fas fa-trash" style="color:#CC0000;"></i></a>`,
        `${user.name}`
    ]

    return content
}

const modalAddBisUser = (id_login) => {
    const div = document.createElement('div')

    const content = `     <div class="modal fade" id="addpowerbi" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Agregar Informes</h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
                </button>
            </div>
            <form>
                <div class="modal-body">
                    <div class="form-row">
                        <div class="form-group col-md-12"> 
                        <select title="Seleccione un informe para agregar al usuario" class="selectpicker form-control" name="powerbisselect" id="powerbisselect" multiple required>
                </select>
                    </div> 
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Cancelar</button>
                    <button data-id_login="${id_login}" type="submit" onclick="addPowerBisUser(event)" name="btn" class=" btn btn-success"><i class="fas fa-plus"> Agregar</i></button>   
                </div>
            </form>
        </div>
    </div>
</div>`

    div.innerHTML = content

    return div

}

const optionBi = (powerbi) => {
    const line = document.createElement('option')

    line.value = powerbi.id_powerbi

    const content = ` ${powerbi.title}</option>`

    line.innerHTML = content

    return line
}

export const ViewPowerBi = {
    showSimplePowerBI,
    showPowerBI,
    listPowerBi,
    lineUsersBi,
    listPowerBiAdmin,
    showModalEdit,
    showModalDelete,
    header,
    showModalPbiInsert,
    buttons,
    optionUser,
    optionBi,
    modalAddBisUser
}