
const modalForm = () => {
    const div = document.createElement('div')

    div.innerHTML = `
<div class="modal fade" id="register" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Registrar nuevo Proveedor</h5>
                <button class="close" type="button" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <form data-input-provider>
                <div class="modal-body">
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <input name="name" placeholder="Proveedor nombre" style="text-transform:uppercase" type="text" class="form-control" required>
                    </div>
                    <div class="form-group col-md-6">
                        <input name="salesman" placeholder="Vendedor" style="text-transform:uppercase" type="text" class="form-control" required>
                    </div>
                    <div class="form-group col-md-6">
                    <input name="phone" placeholder="Teléfono" type="tel" class="form-control">
                </div>
                <div class="form-group col-md-6">
                <input name="mail" placeholder="Mail" type="email" class="form-control">
                </div>
                    <div class="form-group col-md-6">
                    <input name="address" placeholder="Dirección" type="text" class="form-control">
                </div>
                <div class="form-group col-md-6">
                    <input name="ruc" placeholder="RUC" style="text-transform:uppercase" type="text" class="form-control" >
                </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-success"><i class="fas fa-plus"> Registrar</i></button>   
                </div>
            </form>
        </div>
    </div>
</div>`

    return div
}

const modalEdit = (provider) => {
    const div = document.createElement('div')

    div.innerHTML = `
<div class="modal fade" id="edit" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Editar Proveedor</h5>
                <button class="close" type="button" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <form data-edit-provider>
                <div class="modal-body">
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <input value="${provider.name}" name="name" placeholder="Proveedor nombre" style="text-transform:uppercase" type="text" class="form-control" required>
                    </div>
                    <div class="form-group col-md-6">
                        <input value="${provider.salesman}" name="salesman" placeholder="Vendedor" style="text-transform:uppercase" type="text" class="form-control" required>
                    </div>
                    <div class="form-group col-md-6">
                    <input value="${provider.phone}" name="phone" placeholder="Teléfono" type="tel" class="form-control">
                </div>
                <div class="form-group col-md-6">
                <input value="${provider.mail}" name="mail" placeholder="Mail" type="email" class="form-control">
                </div>
                    <div class="form-group col-md-6">
                    <input value="${provider.address}" name="address" placeholder="Dirección" type="text" class="form-control">
                </div>
                <div class="form-group col-md-6">
                    <input value="${provider.ruc}" name="ruc" placeholder="RUC" style="text-transform:uppercase" type="text" class="form-control" >
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

const modalDelete = (provider) => {
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
            <form data-delete-provider>
                <div class="modal-body">
                <div class="row col-md-12 text-center mb-2">
                    <h6>Quieres eliminar el proveedor '${provider.name}' ?</h6>
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



export const View = {
    modalForm,
    modalEdit,
    modalDelete
}