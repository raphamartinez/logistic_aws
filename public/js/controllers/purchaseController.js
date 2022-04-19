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


document.querySelector('[data-generate-excel]').addEventListener('click', async (event) => {

  try {
    const arrstatus = document.querySelectorAll('#status option:checked');
    const status = Array.from(arrstatus).map(el => `${el.value}`);
    const group = document.querySelector('#group option:checked').value;
    const datestart = document.querySelector('#datestart').value;
    const dateend = document.querySelector('#dateend').value;
    const car = document.querySelector('#car').value;
    const provider = document.querySelector('#provider option:checked').value;
    const nature = document.querySelector('#nature').value;
    const centerCost = document.querySelector('#centerCost').value;
    const arrorders = document.querySelectorAll('#purchaseorders option:checked');
    const purchaseorders = Array.from(arrorders).map(el => el.value);

    if(!datestart || !dateend) return alert('Introduce el periodo que quieres consultar.')

    document.querySelector('[data-generate-excel]').innerHTML = ""
    const div = document.createElement('div')
    div.classList.add('spinner-border', 'spinner-border')

    document.querySelector('[data-generate-excel]').appendChild(div);
    document.querySelector('[data-generate-excel]').disabled = true;

    const xls = await Connection.backFile(`quotation/excel`, { status, group, datestart, dateend, provider, truck: car, nature, centerCost, purchaseorders }, 'POST');

    document.querySelector('[data-generate-excel]').innerHTML = 'Generar Excel';
    document.querySelector('[data-generate-excel]').disabled = false;

    const filexls = await xls.blob();

    let a = document.createElement('a');
    a.href = window.URL.createObjectURL(filexls);
    a.target = "_blank";
    a.download = "cotizacion.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

  } catch (error) {
    console.log('Erro ao generar lo excel, si persiste el error comunicar el T.I');
  }
})

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