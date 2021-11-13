const modalEdit = (user) => {
    const div = document.createElement('div')

    div.innerHTML = `
<div class="modal fade" id="edit" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Editar Usuario</h5>
                <button class="close" type="button" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <form data-edit-user>
                <div class="modal-body">
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <input value="${user.name}" name="name" placeholder="Nombre" type="text" class="form-control" required>
                    </div>
                    <div class="form-group col-6">
                        <input value="${user.access}" id="access" name="access" placeholder="Acceso a lo sistema"
                        type="text" class="form-control" required>
                    </div>
                    <div class="form-group col-6">
                        <input value="${user.mail}" id="mail" name="mail" placeholder="E-mail Organizacional" type="mail"
                        class="form-control">
                    </div>
                    <div class="form-group col-6">
                        <select name="profile" id="profileedit" class="form-control" required>
                            <option value="" selected disabled>Perfil</option>
                            <option value="1">Mantenimiento</option>
                            <option value="2">Patrimonio</option>
                            <option value="3">Vehículo</option>
                            <option value="4">Admin</option>
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
<div class="modal fade" id="delete" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Eliminar Usuario</h5>
                <button class="close" type="button" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <form data-delete-user>
                <div class="modal-body">
                <div class="row col-md-12 text-center mb-2">
                    <h6>Quieres eliminar el usuario?</h6>
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

const modalPass = () => {
    const div = document.createElement('div')

    div.innerHTML = `
<div class="modal fade" id="passmodal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Cambiar contraseña</h5>
                <button class="close" type="button" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <form data-edit-pass>
                <div class="modal-body">
                <div class="form-row">
                <div class="form-group col-md-6">          
                    <input type="password" placeholder="Contraseña" class="form-control" name="pass" id="passedit" required>
                </div>
                <div class="form-group col-md-6">          
                    <input type="password" placeholder="Verificación de Contraseña" class="form-control" name="confpass" id="confpassedit" required>
                </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Cancelar</button>
                    <button data-btn-edit-pass disabled type="submit" class="btn btn-warning"><i class="fas fa-key"> Confirmar</i></button>   
                </div>
            </form>
        </div>
    </div>
</div>`

    return div
}

export const View = {
    modalDelete,
    modalEdit,
    modalPass
}