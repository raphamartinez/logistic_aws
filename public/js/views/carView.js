const newTravel = (travel) => {
    const div = document.createElement('div')
    div.classList.add('form-row', 'mb-2')

    div.innerHTML = `
    <div class="form-group col-md-3" data-date>
                                            <input type="text" value="${travel.datedesc} - ${travel.perioddesc}"  class="form-control" disabled>
                                            <a><span data-id="${travel.id}" data-btn-delete="${travel.platedesc}"
                                                    class="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger">
                                                    X
                                                    <span class="visually-hidden"></span>
                                                </span></a>
                                        </div>
                                        <div class="form-group col-md-3">
                                            <input value="${travel.driverdesc}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group col-md-2">
                                            <input value="${travel.platedesc}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group col-md-2">
                                            <input value="${travel.chestdesc}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group col-md-2">
                                            <input value="${travel.routedesc}" type="text" class="form-control" disabled>
                                        </div>`
    return div
}

const travel = (travel, plate, chest) => {
    const div = document.createElement('div')
    div.classList.add('form-row', 'mb-2')

    div.innerHTML = `
    <div class="form-group col-md-3" data-date>
                                            <input type="text" value="${travel.datedesc} - ${travel.perioddesc}"  class="form-control" disabled>
                                            <a><span data-id="${travel.id}" data-btn-delete data-car="${plate}" data-chest="${chest}"
                                                    class="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger">
                                                    X
                                                    <span class="visually-hidden"></span>
                                                </span></a>
                                        </div>
                                        <div class="form-group col-md-3">
                                            <input value="${travel.driverdesc}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group col-md-2">
                                            <input value="${plate}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group col-md-2">
                                            <input value="${chest}" type="text" class="form-control" disabled>
                                        </div>
                                        <div class="form-group col-md-2">
                                            <input value="${travel.routedesc}" type="text" class="form-control" disabled>
                                        </div>`
    return div
}

export const View = {
    newTravel,
    travel
}