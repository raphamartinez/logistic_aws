import { ViewDashboard } from "../views/dashboardView.js"
import { ServiceHistory } from "../services/historyService.js"

window.onload = async function () {
    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
<div class="spinner-border text-danger" role="status">
  <span class="sr-only">Loading...</span>
</div>
`

    let divadmin = document.querySelector('[data-adm]')
    let user = JSON.parse(sessionStorage.getItem('user'))

    let perfil = user.perfil
    let history
    let lastupdate
    if (perfil !== 1) {
        divadmin.innerHTML = " "
        history = await ServiceHistory.historyDashboard()
        lastupdate = await ServiceHistory.listWebscraping()
    } else {
        history = await ServiceHistory.historyDashboard()
        lastupdate = await ServiceHistory.listWebscraping()
    }

    let table = document.querySelector('[data-table]')
    table.style.display = 'none';

    let title = document.querySelector('[data-title]')

    let cardHistory = document.querySelector('[data-card]')


    ViewDashboard.showCardHistory(cardHistory, history)
    ViewDashboard.showCardBd(cardHistory, lastupdate)

    let name = user.name.substring(0, (user.name + " ").indexOf(" "))
    let username = document.querySelector('[data-username]')
    username.innerHTML = name
    loading.innerHTML = " "
    title.innerHTML = "Informaciones"
}
