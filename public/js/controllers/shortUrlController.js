

const erase = async (event) => {
    event.preventDefault()

    const id = document.querySelector('[data-delete]').getAttribute('data-id')
    await Connection.noBody(`encurtador/${id}`, 'DELETE')
}

const update = async (event) => {
    event.preventDefault()

    const id = document.querySelector('[data-delete]').getAttribute('data-id')
    await Connection.noBody(`encurtador/${id}`, 'DELETE')
}