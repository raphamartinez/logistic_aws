

const modalEdit = (patrimony) => {
    const div = document.createElement('div')

    div.innerHTML = `
<div class="modal fade" id="edit" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Editar Patrimonio</h5>
                <button class="close" type="button" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <form data-edit-patrimony>
                <div class="modal-body">
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <input value="${patrimony.name}" name="name" placeholder="Nombre" style="text-transform:uppercase" type="text" class="form-control" required>
                    </div>
                    <div class="form-group col-md-6">
                    <select data-select-local id="local" name="local" type="text" 
                    class="form-control" required>
                    <option value="" selected disabled>Seleccione o local</option>
                    <option value="1">KM 1</option>
                    <option value="2">KM 28</option>
                    <option value="3">YPANÉ</option>
                    <option value="4">AC. KM 1</option>
                    <option value="5">LOG. HERRAMIENTAS</option>
                    <option value="6">LOG. VEHÍCULOS</option>
                    <option value="7">LOG. EQUIPOS</option>
                </select>
                    </div>
                    <div class="form-group col-md-6">
                        <input value="${patrimony.brand}" name="brand" placeholder="Marca" style="text-transform:uppercase" type="text" class="form-control" required>
                    </div>
                    <div class="form-group col-md-6">
                        <input value="${patrimony.amount}" name="amount" placeholder="Cantidad" style="text-transform:uppercase" type="text" class="form-control" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-success"><i class="fas fa-edit"> Editar</i></button>   
                </div>
            </form>
        </div>
    </div>
</div>`

    return div
}

const modalDelete = (patrimony) => {
    const div = document.createElement('div')

    div.innerHTML = `
<div class="modal fade" id="delete" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Eliminar Patrimonio</h5>
                <button class="close" type="button" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <form data-delete-patrimony>
                <div class="modal-body">
                <div class="row col-md-12 text-center mb-2">
                    <h6>Quieres eliminar el proveedor '${patrimony.name}' ?</h6>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-danger"><i class="fas fa-trash"> Eliminar</i></button>   
                </div>
            </form>
        </div>
    </div>
</div>`

    return div
}

const tableImage = (file) => {
    const div = document.createElement('div')
    div.classList.add('col-md-2', 'mb-2')
    div.innerHTML = `
        <img data-key="${file.filename}" data-id="${file.id}" data-size="${file.size}" data-date="${file.date}" width="250" height="250" src="${file.path}" class="img-fluid full-view" alt="${file.description}">
        `

    return div
}

export const View = {
    modalEdit,
    modalDelete,
    tableImage
}