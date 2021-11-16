
const maintenance = (travel, plate, chest, platedesc, chestdesc) => {
    const div = document.createElement('div')
    div.classList.add('form-row')

    div.innerHTML = `
    <div class="form-group col-1" data-date>
    <input value="${travel.type}" type="text" class="form-control" disabled>
                                            <a><span data-id="${travel.id}" data-btn-delete data-car="${platedesc}" data-chest="${chestdesc}"
                                                    class="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger">
                                                    X
                                                    <span class="visually-hidden"></span>
                                                </span></a>
                                        </div>
                                        <div class="form-group text-center col-1">
                                        <input value="${travel.origindesc}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group text-center col-2">
                                        <textarea value="${travel.obs}" class="form-control" disabled>${travel.obs}</textarea>
                                        </div>
                                        <div class="form-group col-2">
                                            <input value="" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group text-center col-2">
                                            <input value="${plate}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group text-center col-1">
                                            <input value="${chestdesc}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group text-center col-1">
                                            <input value="${travel.capacity}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group text-center col-2">
                                        <input type="text" value="${travel.datedesc} - Tiempo ${travel.period}"  class="form-control" disabled>
                                        </div>`
    return div
}

const travel = (travel, plate, chest, platedesc, chestdesc) => {
    const div = document.createElement('div')
    div.classList.add('form-row')

    div.innerHTML = `
    <div class="form-group col-1" data-date>
    <input value="${travel.type}" type="text" class="form-control" disabled>
                                            <a><span data-id="${travel.id}" data-iddriver="${travel.id_driver}" data-btn-delete data-car="${platedesc}" data-chest="${chestdesc}"
                                                    class="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger">
                                                    X
                                                    <span class="visually-hidden"></span>
                                                </span></a>
                                        </div>
                                        <div class="form-group text-center col-1">
                                        <input value="${travel.origindesc}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group text-center col-2">
                                        <input value="${travel.routedesc}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group col-2">
                                            <input value="${travel.driverdesc}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group text-center col-2">
                                            <input value="${plate}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group text-center col-1">
                                            <input value="${chestdesc}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group text-center col-1">
                                        <input value="${travel.capacity}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group text-center col-2">
                                        <input type="text" value="${travel.datedesc} - Tiempo ${travel.period}"  class="form-control" disabled>
                                        </div>`
    return div
}

const addtravel = (travel, plate, chest, platedesc, chestdesc) => {
    const div = document.createElement('div')
    div.classList.add('form-row')

    div.innerHTML = `
    <div class="form-group col-1" data-date>
    <input value="${travel.typedesc}" type="text" class="form-control" disabled>
                                            <a><span data-id="${travel.id}" data-iddriver="${travel.driver}" data-btn-delete data-car="${platedesc}" data-chest="${chestdesc}"
                                                    class="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger">
                                                    X
                                                    <span class="visually-hidden"></span>
                                                </span></a>
                                        </div>
                                        <div class="form-group text-center col-1 text-center">
                                        <input value="${travel.origindesc}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group text-center col-2 text-center">
                                        <input value="${travel.routedesc}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group col-2">
                                            <input value="${travel.driverdesc}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group text-center col-2">
                                            <input value="${plate}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group text-center col-1">
                                            <input value="${chestdesc}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group text-center col-1">
                                        <input value="${travel.capacity}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group text-center col-2 text-center">
                                        <input type="text" value="${travel.datedesc} - Tiempo ${travel.period}"  class="form-control" disabled>
                                        </div>`
    return div
}

const modalDeleteDriver = (driver) => {
    const div = document.createElement('div')

    div.innerHTML = `
<div class="modal fade" id="deletedriver" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered" >
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Eliminar Chofér</h5>
                <button class="close" type="button" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <form data-delete-driver>
                <div class="modal-body">
                <div class="row col-md-12 text-center mb-2">
                    <h6>Quieres eliminar el chofér '${driver.name}' ?</h6>
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

const modalDeleteCar = (car) => {
    const div = document.createElement('div')

    div.innerHTML = `
<div class="modal fade" id="deletecar" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered" >
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Eliminar Vehículo</h5>
                <button class="close" type="button" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">x</span>
                </button>
            </div>
            <form data-delete-car>
                <div class="modal-body">
                <div class="row col-md-12 text-center mb-2">
                    <h6>Quieres eliminar el vehículo '${car.plate} - ${car.cartype} - ${car.model} - ${car.brand} - ${car.year}' ?</h6>
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



const modalEditCar = (car) => {
    const div = document.createElement('div')

    div.innerHTML = `
    <div class="modal fade" id="edit" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Editar Camión</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form data-form-edit-car>
                    <div class="modal-body">
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <input value="${car.plate}" id="plate" name="plate" placeholder="Plaqueta" type="text" class="form-control"
                                    required>
                            </div>
                            <div class="form-group col-6">
                                <input value="${car.brand}" id="brand" name="brand" placeholder="Marca" type="text" class="form-control"
                                    required>
                            </div>
                            <div class="form-group col-6">
                                <input value="${car.model}" id="model" name="model" placeholder="Modelo" type="text" class="form-control">
                            </div>
                            <div class="form-group col-md-6">
                                <select name="cartype" id="cartypeedit" class="form-select">
                                    <option value="" selected disabled>Tipo</option>
                                    <option value="AUTOMOVIL">AUTOMOVIL</option>
                                    <option value="CAMIÓN">CAMIÓN</option>
                                    <option value="TRACTO CAMION">TRACTO CAMION</option>
                                    <option value="CAMION DOBLE EJE">CAMION DOBLE EJE</option>
                                    <option value="CAMIONETA">CAMIONETA</option>
                                    <option value="PORTER">PORTER</option>
                                    <option value="FURGON">FURGON</option>
                                    <option value="SEMI REMOLQUE">SEMI REMOLQUE</option>
                                </select>
                            </div>
                            <div class="form-group col-6">
                                <input value="${car.color}" id="color" name="color" placeholder="Color" type="text" class="form-control"
                                    required>
                            </div>
                            <div class="form-group col-6">
                                <input id="yearedit" name="year" placeholder="Año" type="date" class="form-control">
                            </div>
                            <div class="form-group col-6">
                                <input value="${car.chassis}" id="chassis" name="chassis" placeholder="Chassis" type="text"
                                    class="form-control">
                            </div>
                            <div class="form-group col-6">
                                <input value="${car.capacity}" id="capacity" name="capacity" placeholder="Capacidad" type="number"
                                    class="form-control">
                            </div>
                            <div class="form-group col-md-6">
                                <select name="fuel" id="fueledit" class="form-select">
                                    <option value="" selected disabled>Combustible</option>
                                    <option value="N/A">N/A</option>
                                    <option value="Diesel Normal">Diesel Normal</option>
                                    <option value="Nafta Aditivada">Nafta Aditivada</option>
                                    <option value="Diesel Podium">Diesel Podium</option>
                                </select>
                            </div>
                            <div class="form-group col-md-6">
                                <select name="departament" id="departamentedit" class="form-select">
                                    <option value="" selected disabled>Departament</option>
                                    <option value="N/A">N/A</option>
                                    <option value="Logistica">Logistica</option>
                                    <option value="ADM">ADM</option>
                                </select>
                            </div>
                            <div class="form-group col-md-6">
                                <select name="thirst" id="thirstedit" class="form-select">
                                    <option value="" selected disabled>Sede</option>
                                    <option value="Km28">Km28</option>
                                    <option value="Ypane">Ypane</option>
                                    <option value="CDE">CDE</option>
                                </select>
                            </div>
                            <div class="form-group col-6">
                                <input value="${car.obs}" id="obs" name="obs" placeholder="Observación" type="text" class="form-control"
                                    required>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-success">Agregar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>`

    return div
}

const modalEditDriver = (driver) => {
    const div = document.createElement('div')

    div.innerHTML = `
    <div class="modal fade" id="edit" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Editar Chofér</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form data-form-edit-driver>
                    <div class="modal-body">
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <input value="${driver.name}" name="name" placeholder="Nombre" type="text" class="form-control" required>
                            </div>
                            <div class="form-group col-6">
                                <input value="${driver.idcard}" id="idcard" name="idcard" placeholder="ID Card" type="text" class="form-control"
                                    required>
                            </div>
                            <div class="form-group col-6">
                                <input value="${driver.phone}" id="phone" name="phone" placeholder="Teléfono" type="text" class="form-control">
                            </div>
                            <div class="form-group col-md-6">
                                <input value="${driver.thirst}" id="thirst" name="thirst" placeholder="Sede" type="text" class="form-control">
                            </div>
                            <div class="form-group col-md-6">
                                <select name="type" id="typeedit" class="form-select">
                                    <option value="" selected disabled>Tipo</option>
                                    <option value="SIN INFORMACION">SIN INFORMACION</option>
                                    <option value="CHOFER CARRETERO">CHOFER CARRETERO</option>
                                </select>
                            </div>
                            <div class="form-group col-md-6">
                                <select id="classificationedit" name="classification" class="form-select">
                                    <option value="" selected disabled>Clasificación</option>
                                    <option value="SIN INFORMACION">SIN INFORMACION</option>
                                    <option value="CHOFER CONTRADADO">CHOFER CONTRADADO</option>
                                    <option value="CHOFER DE REPARTO">CHOFER DE REPARTO</option>
                                </select>
                            </div>
                            <div class="form-group col-md-6">
                                <select id="vacationedit" name="vacation" class="form-select">
                                    <option value="" selected disabled>Vacaciones</option>
                                    <option value="SIN INFORMACION">SIN INFORMACION</option>
                                    <option value="NO">NO</option>
                                    <option value="SI">SI</option>
                                </select>
                            </div>
                            <div class="form-group col-6">
                                <input value="${driver.obs}" id="obs" name="obs" placeholder="Observación" type="text" class="form-control"
                                    required>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-success">Agregar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>`

    return div
}


export const View = {
    travel,
    maintenance,
    addtravel,
    modalDeleteDriver,
    modalDeleteCar,
    modalEditCar,
    modalEditDriver
}