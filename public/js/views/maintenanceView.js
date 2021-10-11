

const modalEdit = (maintenance) => {
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
            <form data-edit-maintenance>
                <div class="modal-body">
                <div class="form-group">
                                            <input value="${maintenance.km}" id="km" name="km" placeholder="Inserte el KM atual del vehiculo *"
                                                type="number" class="form-control" required>
                                        </div>
                                        <div class="form-group">
                                            <input value="${maintenance.code}" id="code" name="code" placeholder="Codigo da Pieza " type="text"
                                                class="form-control" style="text-transform:uppercase">
                                        </div>
                                        <div class="form-group">
                                            <input value="${maintenance.name}" id="item" name="item" placeholder="Pieza a ser reemplazada *"
                                                type="text" class="form-control" style="text-transform:uppercase"
                                                required>
                                        </div>
                                        <div class="form-group">
                                            <div class="input-group mb-3">
                                                <div class="input-group-prepend">
                                                    <button data-modal-insert class="btn btn-outline-success"
                                                        type="button">Agregar nuevo</button>
                                                </div>
                                                <select id="provider" name="provider" type="text" class="form-control"
                                                    data-providers required>
                                                    <option value="" selected hidden>Proveedor *
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <input value="${maintenance.brand}" id="brand" name="brand" placeholder="Marca de la pieza " type="text"
                                                class="form-control" style="text-transform:uppercase" required>
                                        </div>
                                        <div class="form-group">
                                            <input value="${maintenance.amount}" id="amount" name="amount" placeholder="Cant" min="0" type="number"
                                                class="form-control" required>
                                        </div>
                                        <div class="form-group">
                                            <div class="input-group mb-3">
                                                <div class="input-group-prepend">
                                                    <select data-currency id="currency" name="currency" type="text"
                                                        class="btn btn-outline-success" data-providers required>
                                                        <option value="1" selected>GS</option>
                                                        <option value="2">USD</option>
                                                    </select>
                                                </div>
                                                <input value="${maintenance.price}" id="price" name="price" placeholder="Precio" type="text"
                                                    value="0000" class="form-control" required>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <input value="${maintenance.description}" id="obs" name="obs" placeholder="Observación" type="text"
                                                class="form-control" style="text-transform:uppercase">
                                        </div>
                                        <div class="form-group">
                                            <select id="type" name="type" type="text" class="form-control" required>
                                                <option value="" selected hidden="hidden">Origen de la nueva pieza *
                                                </option>
                                                <option value="1">Presupuesto</option>
                                                <option value="2">Stock</option>
                                            </select>
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

const modalDelete = () => {
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
            <form data-delete-maintenance>
                <div class="modal-body">
                <div class="row col-md-12 text-center mb-2">
                    <h6>Quieres eliminar el reemplazo de la pieza ?</h6>
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