import { View } from "../views/quizView.js"
import { Connection } from '../services/connection.js'

const init = (event) => {
    const quiz = event.currentTarget.quiz

    document.querySelector('[data-div-salutation]').innerHTML = ""
    document.querySelector('[data-loading]').style.display = "block"

    quiz.questions.forEach(question => {

        if (question.type === "range") {
            document.querySelector('[data-row]').appendChild(View.range(question, quiz.id_interview))
        }

        if (question.type === "int") {
            document.querySelector('[data-row]').appendChild(View.int(question, quiz.id_interview))
        }
    })
    document.querySelector('[data-loading]').style.display = "none"
    // document.querySelector('[data-button-init]').removeEventListener('click', init, false)
}

const change = async (event) => {
    let int = parseInt(event.target.value)

    let response = {
        id_interview: event.target.getAttribute('data-id_interview'),
        id_question: event.target.getAttribute('data-id'),
        value: int
    }

    if (event.target && event.target.className == "form-range") {
        try {
            if (int > 0 && int < 0) return event.target.value = 0

            event.target.parentElement.nextElementSibling.children[0].value = int
        } catch (error) {
            alert("Carácter no válido, ingrese solo números.")
        }
    }

    if (event.target && event.target.className == "form-control border-3") {
        try {
            if (int > 10 || int < 0) return event.target.value = 0

            event.target.parentElement.previousElementSibling.children[0].value = int
        } catch (error) {
            alert("Carácter no válido, ingrese solo números.")
        }
    }

    if (event.target && event.target.className == "form-control-color me-1") {
        try {

            let id_answer = event.target.getAttribute('data-answer')
            response.id_answer = id_answer

            let index = event.target.getAttribute('data-index')

            if (int > 4 || int < 0) return event.target.value = 0

            const lis = event.path[2].children

            let li1 = lis[0].children[0].getAttribute('data-index')
            if (index !== li1) if (event.target.value === lis[0].children[0].value) lis[0].children[0].value = 0
            let li2 = lis[1].children[0].getAttribute('data-index')
            if (index !== li2) if (event.target.value === lis[1].children[0].value) lis[1].children[0].value = 0
            let li3 = lis[2].children[0].getAttribute('data-index')
            if (index !== li3) if (event.target.value === lis[2].children[0].value) lis[2].children[0].value = 0
            let li4 = lis[3].children[0].getAttribute('data-index')
            if (index !== li4) if (event.target.value === lis[3].children[0].value) lis[3].children[0].value = 0

        } catch (error) {
            alert("Carácter no válido, ingrese solo números.")
        }
    }

    const obj = await Connection.body('answered', { response }, 'POST')

    console.log(obj.msg);
}

const salutation = async () => {
    var url = window.location.pathname
    var token = url.substring(13)

    const quiz = await Connection.noBody(`quiz/${token}`, 'GET')

    if (quiz.status === false) window.location.href = "https://www.sunset.com.py/"

    switch (quiz.id_quiz) {
        case 7:
            document.querySelector('[data-title-letter]').appendChild(View.title1())
            document.querySelector('[data-modal-tips]').appendChild(View.title1())
            break
        case 8:
            document.querySelector('[data-title-letter]').appendChild(View.title2())
            document.querySelector('[data-modal-tips]').appendChild(View.title2())
            break

        default:
            document.querySelector('[data-title-letter]').appendChild(View.title1())
            document.querySelector('[data-modal-tips]').appendChild(View.title1())
            break
    }

    document.querySelector('[data-title-respondent]').innerHTML += quiz.name

    if (quiz.time) {
        document.querySelector('[data-modal]').appendChild(View.time(quiz.time))

        $("#init").modal('show')

        document.querySelector('[data-submit-init]').addEventListener('submit', async (event) => {
            event.preventDefault()
        })
    }

    document.querySelector('[data-button-init]').addEventListener('click', init, false)
    document.querySelector('[data-button-init]').quiz = quiz
}

const finish = async (event) => {
    event.preventDefault()

    var url = window.location.pathname
    var token = url.substring(13)
    const comment = event.target.comment.value

    await Connection.body(`quiz/finish/${token}`, { comment }, 'POST')

    alert("Gracias por su participación.")
    window.location.href = "https://www.sunset.com.py/"
}

document.querySelector('[data-row]').addEventListener('change', change, false)
document.querySelector('[data-form-finish]').addEventListener('submit', finish, false)

window.onload = salutation()
