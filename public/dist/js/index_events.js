function getFormReq() {
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())
    data.part_number = String(data.part_number).toUpperCase()
    data.log_description = String(data.log_description).toUpperCase()
    data.man_description = String(data.man_description).toUpperCase()
    data.eng_description = String(data.eng_description).toUpperCase()
    data.qual_description = String(data.qual_description).toUpperCase()
    data.employee_id = Number(data.employee_id)
    data.origin = Number(data.origin)
    data.destination = Number(data.destination)
    data.operation = Number(data.operation)
    return data
}

function sendFormReq(data) {
    ws.send(JSON.stringify({ event: "createCall", call: data }))
}

const formID = document.getElementById("employee_id")
formID.addEventListener("focusout", e => {
    if (!e.target.value) {
        return
    }
    console.log(users.get(Number(e.target.value)))
})

const form = document.querySelector("form")
form.addEventListener("submit", e => {
    const data = getFormReq()
    sendFormReq(data)
    e.preventDefault()
    form.reset()
    form.parentElement.classList = "formReq inactive animated-out"
    window.scroll({ top: -20, left: 0 })
    return
})

const buttonReq = document.getElementById("buttonReq")
buttonReq.addEventListener("click", e => {
    form.parentElement.className = "formReq active animated-in"
})

const h2 = form.previousElementSibling

h2.addEventListener("click", () => {
    form.parentElement.className = "formReq inactive animated-out"
})


window.addEventListener("beforeunload", (e) => {
    form.reset()
    document.querySelector("#search").value = ""
})