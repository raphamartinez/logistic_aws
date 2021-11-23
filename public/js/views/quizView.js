const time = (time) => {
    const div = document.createElement('div')

    div.innerHTML = `
    <div class="modal fade" id="init" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Quieres deshabilitar este usuario?</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
                </button>
            </div>
            <form data-form-delete>
                <div class="modal-body">
                    <div class="form-row">
                        <div class="col-md-12">
                            <h8>Tienes ${time} minutos para terminar la prueba, ¿quieres empezar ahora?
                            Una vez que expire el tiempo, no se agregarán respuestas.</h8>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-danger"><i class="fas fa-times"> Sí lo deseo.</i></button>   
                </div>
            </form>
        </div>
    </div>
</div>`

    return div
}

const range = (question, id_interview) => {
    const div = document.createElement('div')
    div.classList.add('col-lg-8', 'text-center', 'mb-2')
    div.dataset.quiz

    div.innerHTML = ` 
    <div class="card shadow">
        <div class="card-header text-primary" data-title>
            ${question.title}
        </div>
        <div class="card-body">
            <div class="form-row">
                <div class="form-group col-md-11">
                    <input type="range" class="form-range" min="0" max="10" step="1" value="0" data-id_interview="${id_interview}" data-id="${question.id}"
                        id="customRange3">
                </div>
                <div class="form-group col-md-1 align-items-center justify-content-center">
                    <input type="number" class="form-control border-3" min="0" max="10" step="1" value="0" data-id_interview="${id_interview}" data-id="${question.id}"
                        id="customRange3">
                </div>
            </div>
        </div>
    </div>`

    return div
}

const int = (question, id_interview) => {
    const div = document.createElement('div')
    div.classList.add('col-lg-8', 'text-center', 'mb-2')
    div.dataset.quiz

    div.innerHTML = ` 
    <div class="card shadow">
    <div class="card-header text-primary" data-title>
         ${question.title}
    </div>
    <div class="card-body">
        <div class="form-row">
            <div class="form-group text-left col-md-12">
                <ul class="list-group">
                    <li class="list-group-item">
                        <select class="form-control-color me-1" type="number" data-id_interview="${id_interview}" data-id="${question.id}" data-answer="${question.answers[0].id}" data-index="1">
                            <option value="0" disabled selected></option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                        ${question.answers[0].title}
                    </li>
                    <li class="list-group-item">
                        <select class="form-control-color me-1" type="number" data-id_interview="${id_interview}" data-id="${question.id}" data-answer="${question.answers[1].id}" data-index="2">
                            <option value="0" disabled selected></option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                        ${question.answers[1].title}
                        </li>
                    <li class="list-group-item">
                        <select class="form-control-color me-1" type="number" data-id_interview="${id_interview}" data-id="${question.id}" data-answer="${question.answers[2].id}" data-index="3">
                            <option value="0" disabled selected></option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                        ${question.answers[2].title}
                        </li>
                    <li class="list-group-item">
                        <select class="form-control-color me-1" type="number" data-id_interview="${id_interview}" data-id="${question.id}" data-answer="${question.answers[3].id}" data-index="4">
                            <option value="0" disabled selected></option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                        ${question.answers[3].title}
                        </li>
                  </ul>
            </div>
        </div>
    </div>
</div>`

    return div
}

const send = () => {
    const div = document.createElement('div')

    div.innerHTML = `
    <div class="modal fade" id="send" tabindex="-1" >
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Enviar Cuestionario</h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">x</span>
                </button>
            </div>
            <form data-form-send>
                <div class="modal-body">
                    <div class="form-row">
                        <div class="form-group col-md-12">          
                            <input type="text" placeholder="Nombre" class="form-control" name="name" id="name" required>
                        </div>
                        <div class="form-group col-md-12">
                        <input placeholder="Email del destinatario" class="form-control" id="mail" name="mail" type="email" required>
                    </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-success" ><i class="fas fa-paper-plane"> Enviar</i></button>   
                </div>
            </form>
        </div>
    </div>
    </div>`

    return div
}

const table = () => {
    const div = document.createElement('div')
    div.innerHTML = `
<div div-table-quiz class="row justify-content-md-center">
    <div class="col-8">
        <div class="card shadow mb-4">
            <div class="card-header">
                <div class="form-row">
                    <div class="form-group col-12">
                        <h6 class="m-0 font-weight-bold text-primary">Cuestionarios</h6>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <table class="table table-bordered text-center" id="dataQuiz" width="100%" cellspacing="0"></table>
            </div>
        </div>
    </div>
</div>`

    return div
}


const view = () => {
    const div = document.createElement('div')

    div.innerHTML = `
    <div class="col-lg-8 offset-lg-2 pt-4">
    <div class="card shadow">
        <div class="card-header">
            <div class="form-row">
                <div class="col-md-6">
                    <h6 class="m-0 font-weight-bold text-primary">Rueda de Vida</h6>
                </div>
                <div class="col-md-6 text-right">
                    <button type="button" class="btn btn-secondary" data-print-first>Imprimir</button>
                    <button class="btn btn-primary" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapsetext" aria-expanded="false"
                        aria-controls="collapsetext">
                        Análise
                    </button>
                </div>
            </div>
        </div>
        <div class="collapse" id="collapsetext">
            <div class="card card-body" data-text-desc-quiz-one>
                <h6><strong>Descripción</strong></h6>
                El resultado ideal sería tener una calificación alta en cada una de las categorías
                entre 8 y 10. Yo creo que la mayoría de las personas tenemos algo en lo cual
                trabajar, por lo que nuestra rueda de la vida nos mostrará esas áreas con una
                calificación menor.

                Las áreas que más debes de trabajar son aquellas mas pegadas al centro de la
                gráfica, es decir al cero. Ahora, no te desanimes si existen varias áreas en las que
                muestras una calificación baja. Pasa muy seguido que muchas áreas están vinculadas,
                por ejemplo, un valor bajo en el Crecimiento Personal puede estar ligado a una baja
                calificación en Carrera o trabajo pues no te has estado concentrado en tu desarrollo
                personal.

                Asimismo, si tienes baja calificación en Recreación/Diversion puede ser debido a un
                bajo numero en el dinero.

                Es por eso que es importante analizar porque cada uno de los resultados, con esto
                verás que si trabajas en un área en específico es muy probable que logres mejorar o
                incrementar tu satisfacción en otras áreas.

                <h6><strong>Calificación de 8 a 10</strong></h6>
                Si tienes calificaciones entre 8 y 10, quiere decir que te encuentras muy satisfecho
                con esta área en particular. Es importante continuar trabajando en éstas áreas y
                seguir haciendo lo que haces actualmente para que tu nivel de satisfacción se
                mantenga. Y porque no, puedes hasta ver que algunas mejorías que te llevarán a tener
                una calificación aun mayor y tener mas crecimiento.

                <h6><strong>Calificación de 5 a 7</strong></h6>
                Este rango demuestra que estas razonablemente satisfecho con éstas áreas pero sin
                lugar a dudas hay algo que puedes hacer para mejorarlas.

                <h6><strong>Calificación de 0 a 4</strong></h6>
                Este rango demuestra que hay áreas que no te sientes muy satisfecho y que necesitas
                explorar más para poder incrementar tu satisfacción. Como lo dije antes, no te
                desanimes si encuentras varias áreas con bajos niveles de calificación, esto
                representa una oportunidad para que puedas mejorar y puedas cambiar tu vida.

            </div>
        </div>
        <div class="card-body" data-body-quiz-first>
            <div class="form-row">
                <div class="col-lg-9 text-center d-inline border-5 border-right">
                    <h4>Gráfico de personalidad</h4>
                    <div class="row text-center" data-div-chart-radar>
                    <div class="col-12 text-center">
                    <canvas style="max-width: 750px; max-height: 750px;" class="flex d-inline"
                        width="450" height="450" data-chart-radar></canvas>
                        </div>
                        </div>
                </div>
                <div class="col-lg-3 d-inline text-center">
                    <div class="row-fluid mb-2" row-name-one>
                        <h5>Nombre del Repondente</h5>
                        <div class="col-md-12">
                            <select title="Nombres" data-names-one id="nameone" class="form-select">
                            <option value="" disabled selected>Seleccione uno repondente </option>
                            </select>
                        </div>
                    </div>
                    <hr>
                    <div class="display" id="break_page" style='page-break-after:always'></div>
                    <div class="row-fluid mb-2" data-quiz-two-row-two>
                        <div class="col-md-12">
                            <div class="row-fluid text-center">
                            <h5>Puntuación de las características</h5>
                            </div>
                            <ul class="list-group text-left">
                                <li
                                    class="list-group-item d-flex justify-content-between align-items-start">
                                    Motivacion
                                    <span div-attr="1" class="badge bg-primary rounded-pill text-white"></span>
                                </li>
                                <li
                                    class="list-group-item d-flex justify-content-between align-items-start">
                                    Social
                                    <span div-attr="2" class="badge bg-primary rounded-pill text-white"></span>
                                </li>
                                <li
                                class="list-group-item  d-flex justify-content-between align-items-start">
                                Salud y Ocio
                                <span div-attr="3" class="badge bg-primary rounded-pill text-white"></span>
                                </li>
                                <li
                                    class="list-group-item  d-flex justify-content-between align-items-start">
                                    Intelectual
                                    <span div-attr="4" class="badge bg-primary rounded-pill text-white"></span>
                                </li>
                                <li
                                    class="list-group-item d-flex justify-content-between align-items-start">
                                    Financiero
                                    <span div-attr="5" class="badge bg-primary rounded-pill text-white"></span>
                                </li>
                                <li
                                    class="list-group-item  d-flex justify-content-between align-items-start">
                                    Cuidado Personal
                                    <span div-attr="6" class="badge bg-primary rounded-pill text-white"></span>
                                </li>
                                <li
                                    class="list-group-item d-flex justify-content-between align-items-start">
                                    Crecimiento Personal
                                    <span div-attr="7" class="badge bg-primary rounded-pill text-white"></span>
                                </li>
                                <li
                                    class="list-group-item  d-flex justify-content-between align-items-start">
                                    Carrera
                                    <span div-attr="8" class="badge bg-primary rounded-pill text-white"></span>
                                </li>
                                <li
                                    class="list-group-item d-flex justify-content-between align-items-start">
                                    Amor
                                    <span div-attr="9" class="badge bg-primary rounded-pill text-white"></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <hr>
                    <div class="row-fluid mb-2" data-quiz-two-row-three>
                        <div class="col-md-12">
                            <div class="row-fluid text-center">
                            <h5>Características Predominante</h5>
                            </div>
                            <ul class="list-group ">
                                <li
                                    class="list-group-item  d-flex justify-content-between align-items-start list-group-item-danger">
                                    Mínimo
                                    <span div-attr-min class="badge bg-danger rounded-pill text-white"></span>
                                </li>
                                <li
                                    class="list-group-item d-flex justify-content-between align-items-start list-group-item-warning">
                                    Média
                                    <span div-attr-average class="badge bg-warning rounded-pill text-white"></span>
                                </li>
                                <li
                                    class="list-group-item  d-flex justify-content-between align-items-start list-group-item-success">
                                    Máximo
                                    <span div-attr-max class="badge bg-success rounded-pill text-white"></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="col-lg-8 offset-lg-2 pt-4 mb-3">
    <div class="card shadow">
        <div class="card-header">
            <div class="form-row">
                <div class="col-md-6">
                    <h6 class="m-0 font-weight-bold text-primary">Descripcion de la Personalidad </h6>
                </div>
                <div class="col-md-6 text-right">
                <button type="button" class="btn btn-secondary" data-print-second>Imprimir</button>
                </div>
            </div>
        </div>
        <div class="card-body" data-body-quiz-second>
            <div class="form-row" data-div-quiz-two-graph>
                <div class="col-lg-9 text-center">
                    <h4>Características de la persona</h4>
                </div>
                <div class="col-lg-9 text-center d-inline border-5 border-right">
                    <canvas style="max-height: 600px;" class="flex d-inline" width="1000"
                        height="300" data-chart-comparation></canvas>
                </div>
                <div class="col-lg-3 d-inline text-center">
                    <div class="row-fluid mb-2">
                        <div class="col-md-12">
                            <h5>Nombre del Repondente</h5>
                            <select title="Nombres" id="nametwo" data-names-two class="form-select">
                            <option value="" disabled selected>Seleccione uno repondente </option>
                            </select>
                        </div>
                    </div>
                    <hr>
                    <div class="row-fluid mb-2">
                        <div class="col-md-12">
                            <h5>Características Predominante</h5>
                            <ul class="list-group ">
                                <li data-title-max-positive
                                    class="list-group-item  d-flex justify-content-between align-items-start list-group-item-success">
                                </li>
                                <li data-title-max-negative
                                    class="list-group-item  d-flex justify-content-between align-items-start list-group-item-danger">
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-md-12 text-center">
                    <h4>Condiciones</h4>
                </div>
                <div class="col-lg-12 text-center d-inline border-5 border-right">
                    <canvas style="max-width: 1000px; max-height: 600px;" class="flex d-inline"
                        width="300" height="300" data-chart-positive></canvas>
                </div>
            </div>
            <div class="display" id="break_page_two" style='page-break-after:always'></div>
            <div class="form-row" data-div-quiz-two-person>
                <div class="col-md-12 text-center">
                    <h4>Descripción de la personalidad</h4>
                </div>
                <div class="row">
                    <dt class="col-sm-12 border-bottom">Estilos | Características</dt>
                    <dt class="col-sm-2" >Énfasis</dt>
                    <dd class="col-sm-5 border-bottom text-success-green" data-letter-emphasis-p ></dd>
                    <dd class="col-sm-5 border-bottom text-danger" data-letter-emphasis-n ></dd>

                    <dt class="col-sm-2" >Orientación temporal</dt>
                    <dd class="col-sm-5 border-bottom text-success-green" data-letter-time-p ></dd>
                    <dd class="col-sm-5 border-bottom text-danger" data-letter-time-n ></dd>

                    <dt class="col-sm-2" >Fuentes de satisfacción</dt>
                    <dd class="col-sm-5 border-bottom text-success-green" data-letter-satisfaction-p ></dd>
                    <dd class="col-sm-5 border-bottom text-danger" data-letter-satisfaction-n ></dd>

                    <dt class="col-sm-2" >Puntos fuertes</dt>
                    <dd class="col-sm-5 border-bottom text-success-green" data-letter-strong-p></dd>
                    <dd class="col-sm-5 border-bottom text-danger" data-letter-strong-n ></dd>

                    <dt class="col-sm-2" >Puntos débiles</dt>
                    <dd class="col-sm-5 border-bottom text-success-green" data-letter-weak-p ></dd>
                    <dd class="col-sm-5 border-bottom text-danger" data-letter-weak-n ></dd>

                    <dt class="col-sm-2" >En el teléfono</dt>
                    <dd class="col-sm-5 border-bottom text-success-green" data-letter-phone-p ></dd>
                    <dd class="col-sm-5 border-bottom text-danger" data-letter-phone-n ></dd>

                    <dt class="col-sm-2" >Escribiendo</dt>
                    <dd class="col-sm-5 border-bottom text-success-green" data-letter-writing-p ></dd>
                    <dd class="col-sm-5 border-bottom text-danger" data-letter-writing-n > </dd>

                    <dt class="col-sm-2" data-ves >Forma de vestir</dt>
                    <dd class="col-sm-5 border-bottom text-success-green" data-letter-clothing-p ></dd>
                    <dd class="col-sm-5 border-bottom text-danger" data-letter-clothing-n ></dd>

                    <dt class="col-sm-2">Decoración de oficina, hogar</dt>
                    <dd class="col-sm-5 border-bottom text-success-green" data-letter-house-p ></dd>
                    <dd class="col-sm-5 border-bottom text-danger" data-letter-house-n ></dd>

                    <dt class="col-sm-2">Estilo opuesto</dt>
                    <dd class="col-sm-5 border-bottom text-success-green" data-letter-style-p ></dd>
                    <dd class="col-sm-5 border-bottom text-danger" data-letter-style-n ></dd>

                    <dt class="col-sm-2">Ocupaciones típicas</dt>
                    <dd class="col-sm-5 border-bottom text-success-green" data-letter-occupation-p ></dd>
                    <dd class="col-sm-5 border-bottom text-danger" data-letter-occupation-n ></dd>
                </div>
                </div>
                <div class="display" id="break_page_three" style='page-break-after:always'></div>
                <div class="form-row" data-div-quiz-two-style>
                <div class="col-md-12 text-center">
                    <h4>Características associadas a cada estilo</h4>
                </div>
                <div class="col=md-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Aplicación Efectiva</h5>
                            <p data-letter-application-p class="card-text text-success-green"></p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Aplicación Ineficaz</h5>
                            <p data-letter-application-n class="card-text text-danger"></p>
                    </div>
                </div>
                </div>
                <div class="col-md-12 text-center">
                    <h4>Consejos de adaptación</h4>
                </div>
                <div class="col=md-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Aplicación Efectiva</h5>
                            <p data-letter-advice-p class="card-text text-success-green"></p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Aplicación Ineficaz</h5>
                            <p data-letter-advice-n class="card-text text-danger"></p>
                    </div>
                </div>
                <div class="col-md-12 text-center" data-confusion></div>
                </div>
            </div>
        </div>
    </div>
</div>

<div data-view-quiz></div></div>`

    return div
}


const title1 = () => {
    const div = document.createElement('div')

    div.innerHTML = `
    <div class="col-md-12 mb-2 text-center"><p class="h6">Esta es una herramienta muy eficaz para mejorar el equilibrio de tu vida. Te ayuda a identificar gráficamente las áreas en tu vida en las cuáles hay que dedicarles más energía y más trabajo, y en muy poco tiempo. También te ayuda a entender en donde necesitas establecer un límite.</p></div>`

    return div
}

const title2 = () => {
    const div = document.createElement('div')
    div.classList.add('row', 'mb-2')

    div.innerHTML = `
    <div class="col-md-12 mb-2 text-center text-primary"><p class="h5">No es posible acertar o equivocarse en este cuestionario.</p></div>


    <div class="col-md-12 mb-2 text-center"><p class="h6">Básicamente, este es un instrumento que le permite describir los estilos relativos que utiliza en su relación con los demás. Leerá una serie de declaraciones autodescriptivas, donde cada declaración es seguida por cuatro alternativas diferentes. deberá indicar el orden en el que cree que cada alternativa es relevante para usted.</p></div>

    <div class="col-md-12 mb-2 text-center"><p class="h6">En la hoja de respuestas a la derecha de cada alternativa, indique el número (4,3,2 o 1) según la alternativa que más le parezca.</p></div>

    <div class="row">
        <div class="col-md-6 offset-md-3 mb-2 list-group text-center">
        <label>Use el número:</label>
           <a href="#" class="list-group-item list-group-item-action list-group-item-success">4 para la alternativa que más le parezca</a>
           <a href="#" class="list-group-item list-group-item-action list-group-item-info">3 para el próximo más cercano</a>
           <a href="#" class="list-group-item list-group-item-action list-group-item-warning">2 para el siguiente y el número</a>
           <a href="#" class="list-group-item list-group-item-action list-group-item-danger">1 para la alternativa que le parezca menos</a>
      </div>
    </div>


    <div class="col-md-12 mb-2 text-center text-secondary"><p class="h6">Use cada número solo una vez. Incluso si dos de las alternativas están muy cerca, marque ambas.</p></div>
    <div class="col-md-12 mb-2 text-center text-secondary">Use todos los números en la hoja de respuestas.</p></div>
`

    return div
}

export const View = {
    table,
    time,
    range,
    int,
    send,
    view,
    title1,
    title2
}