const form = document.getElementsByTagName("form")
console.log(form)

function getFormReq(button) {
    const formData = new FormData(form[button])
    const data = Object.fromEntries(formData.entries())
    return data
}

form[0].addEventListener("submit", e => {
    e.preventDefault()
    const data = getFormReq(0)
    ws.send(JSON.stringify({ event: "updateCallLog", call: { id_call: Number(data.id_call), log_check_id: Number(data.log_check_id) } }))
    form[0].reset()
})

form[1].addEventListener("submit", e => {
    e.preventDefault()
    const data = getFormReq(1)
    ws.send(JSON.stringify({ event: "updateCallQuality", call: { id_call: Number(data.id_call), qual_check_id: Number(data.qual_check_id) } }))
    form[1].reset()
})

form[2].addEventListener("submit", e => {
    e.preventDefault()
    const data = getFormReq(2)
    ws.send(JSON.stringify({ event: "updateCallEng", call: { id_call: Number(data.id_call), eng_check_id: Number(data.eng_check_id) } }))
    form[2].reset()
})

form[3].addEventListener("submit", e => {
    e.preventDefault()
    const data = getFormReq(3)
    ws.send(JSON.stringify({ event: "updateCallMan", call: { id_call: Number(data.id_call), man_check_id: Number(data.man_check_id) } }))
    form[3].reset()
})

window.addEventListener("beforeunload", e => {
    form[0].reset()
    form[1].reset()
    form[2].reset()
    form[3].reset()
})