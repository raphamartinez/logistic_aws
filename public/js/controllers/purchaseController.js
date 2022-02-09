import { Connection } from '../services/connection.js'

window.onload = async function () {
    let loading = document.querySelector('[data-loading]')
    loading.innerHTML = `
  <div class="d-flex justify-content-center">
    <div class="spinner-grow text-danger" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
`

    loading.innerHTML = " "
}


// const generate = async (event) => {
//     event.preventDefault();

//     let loading = document.querySelector('[data-loading]')
//     loading.innerHTML = `
//     <div class="d-flex justify-content-center">
//       <div class="spinner-grow text-danger" role="status">
//         <span class="sr-only">Loading...</span>
//       </div>
//     </div>
//   `

//     const search = {
//         status: event.currentTarget.status.value,
//         datestart: event.currentTarget.datestart.value,
//         dateend: event.currentTarget.dateend.value,
//         numberstart: event.currentTarget.numberstart.value,
//         numberend: event.currentTarget.numberend.value,
//         group: event.currentTarget.group.value,
//     }

//     const objres = await Connection.backFile('purchaseorders', { search }, 'POST')

//     var file = new File([objres], "informe_compras.pdf");

//     console.log(file);
//     let a = document.createElement('a');
//     a.href = window.URL.createObjectURL(file);
//     a.target = "_blank";
//     a.download = `informe_compras.pdf`
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);

//     loading.innerHTML = ``
// }


// document.querySelector('[data-form-generate]').addEventListener('submit', generate, false)