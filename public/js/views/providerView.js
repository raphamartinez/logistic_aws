
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
                        <input name="name" placeholder="Proveedor nombre" type="text" class="form-control" required>
                    </div>
                    <div class="form-group col-md-6">
                        <input name="salesman" placeholder="Vendedor" type="text" class="form-control" required>
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
                    <input name="ruc" placeholder="RUC" type="text" class="form-control" >
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

export const View = {
    modalForm
}