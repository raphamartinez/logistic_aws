import { Connection } from '../services/connection.js'

const erase = async (event) => {
    if (event.target.getAttribute('data-delete')) {
        const id = event.target.getAttribute('data-delete')
        const result = await Connection.noBody(`encurtador/${id}`, 'DELETE')
        if (result.ok) {
            event.path[4].remove()
            toastr.success(result.msg, {
                progressBar: true
            })
        }
    }
}

document.querySelector('[data-pages]').addEventListener('click', erase)

// const update = async (event) => {
//     event.preventDefault()

//     const id = document.querySelector('[data-edit]').getAttribute('data-id')
//     await Connection.noBody(`encurtador/${id}`, 'PUT')
// }