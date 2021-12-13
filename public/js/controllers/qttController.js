import { Connection } from '../services/connection.js'


const option = (obj) => {
  const opt = document.createElement('option')
  opt.value = obj.code
  opt.innerHTML = obj.name

  return opt
}

window.onload = async function () {
    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
  <div class="d-flex justify-content-center">
    <div class="spinner-grow text-danger" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
`

    let user = JSON.parse(sessionStorage.getItem('user'))

    let name = user.name.substring(0, (user.name + " ").indexOf(" "))
    let username = document.querySelector('[data-username]')
    username.innerHTML = name

    const data = await Connection.noBody('quotation', 'GET')
    
    data.cars.forEach(car => {
      document.querySelector('[data-select-truck]').appendChild(option(car))
    })

    data.products.forEach(product => {
      document.querySelector('[data-select-product]').appendChild(option(product))
    })

    data.providers.forEach(provider => {
      document.querySelector('[data-select-provider]').appendChild(option(provider))
    })

    data.purchaseOrders.forEach(order => {
      document.querySelector('[data-select-purchaseorder]').appendChild(option(order))
    })

    data.quotationOrders.forEach(order => {
      document.querySelector('[data-select-quotation]').appendChild(option(order))
    })
    loading.innerHTML = " "

}
