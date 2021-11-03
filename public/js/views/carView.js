
const maintenance = (travel, plate, chest, platedesc, chestdesc) => {
    const div = document.createElement('div')
    div.classList.add('form-row')

    div.innerHTML = `
    <div class="form-group col-2" data-date>
    <input value="${travel.type}" type="text" class="form-control" disabled>
                                            <a><span data-id="${travel.id}" data-btn-delete data-car="${platedesc}" data-chest="${chestdesc}"
                                                    class="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger">
                                                    X
                                                    <span class="visually-hidden"></span>
                                                </span></a>
                                        </div>
                                        <div class="form-group text-center col-1">
                                        <textarea value="${travel.obs}" class="form-control" disabled>${travel.obs}</textarea>
                                        </div>
                                        <div class="form-group col-3">
                                            <input value="" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group text-center col-3">
                                            <input value="${plate}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group text-center col-1">
                                            <input value="${chestdesc}" type="text" class="form-control" disabled>
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
    <div class="form-group col-2" data-date>
    <input value="${travel.type}" type="text" class="form-control" disabled>
                                            <a><span data-id="${travel.id}" data-iddriver="${travel.id_driver}" data-btn-delete data-car="${platedesc}" data-chest="${chestdesc}"
                                                    class="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger">
                                                    X
                                                    <span class="visually-hidden"></span>
                                                </span></a>
                                        </div>
                                        <div class="form-group text-center col-1">
                                        <input value="${travel.routedesc}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group col-3">
                                            <input value="${travel.driverdesc}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group text-center col-3">
                                            <input value="${plate}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group text-center col-1">
                                            <input value="${chestdesc}" type="text" class="form-control" disabled>
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
    <div class="form-group col-2" data-date>
    <input value="${travel.typedesc}" type="text" class="form-control" disabled>
                                            <a><span data-id="${travel.id}" data-iddriver="${travel.driver}" data-btn-delete data-car="${platedesc}" data-chest="${chestdesc}"
                                                    class="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger">
                                                    X
                                                    <span class="visually-hidden"></span>
                                                </span></a>
                                        </div>
                                        <div class="form-group text-center col-1">
                                        <input value="${travel.routedesc}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group col-3">
                                            <input value="${travel.driverdesc}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group text-center col-3">
                                            <input value="${plate}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group text-center col-1">
                                            <input value="${chestdesc}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group text-center col-2">
                                        <input type="text" value="${travel.datedesc} - Tiempo ${travel.period}"  class="form-control" disabled>
                                        </div>`
    return div
}

export const View = {
    travel,
    maintenance,
    addtravel
}