

var remote = "wss://sgp-project.onrender.com"
var local = "ws://192.168.1.15:3000"

var conn = local + `/ws?machine="ad123"&company=industria`

var ws = new WebSocket(conn)

var list = []

if (ws.OPEN) {
    var statusConnection = true
}

let users = new Map()

users.set(2477, "Giovani Rodrgues")

navigator.serviceWorker.register("sw.js");

function showNotification() {
  Notification.requestPermission().then((result) => {
    if (result === "granted") {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification("Vibration Sample", {
          body: "Buzz! Buzz!",
          icon: "../images/touch/chrome-touch-icon-192x192.png",
          vibrate: [200, 100, 200, 100, 200, 100, 200],
          tag: "vibration-sample",
        });
      });
    }
  });
}

showNotification()

function displaySound(s) {
    const audio = new Audio(s)
    audio.autoplay = true
    audio.play()
}

function getInformationMachine() {
    const machine = localStorage.getItem("machine")
    const company = localStorage.getItem("company")


    if (!machine || !company) {
        ws.close()
        statusConnection = false
        const a = document.querySelector('dialog')
        a.showModal()
        return
    } else {
        statusConnection = true
    }
}

function createInformationMachine() {
    localStorage.setItem("machine", "girvx")
    localStorage.setItem("company", "industria")
}

function removeInformationMachine() {
    localStorage.clear()
}

function formatDateTime(time_stamp) {
    const time_stamp_parse = Date.parse(time_stamp)
    const datetime = new Date(time_stamp_parse)
    return {  
        datetime: `${datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours()}:${datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes() }:${datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds()}`,
        date: `${datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate()}/${datetime.getMonth() < 10 ? "0" + (datetime.getMonth() + 1) : (datetime.getMonth() + 1)}/${datetime.getFullYear() < 10 ? "0" + datetime.getFullYear() : datetime.getFullYear()}`
    }
}

function formatDateTimeList(input) {
    input.forEach((data) => {
        formatDateTimeOnCreate(data)
    })
    return input
}

function formatDateTimeOnCreate(data) {
    data.created_at = formatDateTime(data.created_at)
    if (!String(data.log_check_datetime_at).startsWith("000")) {
        data.log_check_datetime_at = formatDateTime(data.log_check_datetime_at)
    }
    if (!String(data.qual_check_datetime_at).startsWith("000")) {
        data.qual_check_datetime_at = formatDateTime(data.qual_check_datetime_at)
    }
    if (!String(data.eng_check_datetime_at).startsWith("000")) {
        data.eng_check_datetime_at = formatDateTime(data.eng_check_datetime_at)
    }
    if (!String(data.man_check_datetime_at).startsWith("000")) {
        data.man_check_datetime_at = formatDateTime(data.man_check_datetime_at)
    }
    return data
}

function updateCAllCard(call, sector) {
    const card = document.getElementById(String(call.id_call))
    const cardImg = card.querySelector(`.card-${sector} .card-${sector}-header .checked-${sector}-img`)
    cardImg.className = `checked-${sector}-img success animated`
    const cardDesc = card.querySelector(`.card-${sector} .card-${sector}-body`)
    cardDesc.parentElement.className = `card-${sector} success animated`
    cardDesc.className = `card-${sector}-body success animated`
    cardDesc.innerHTML = `
        <p class="created-at" >Encerrado por: ${String(call[`${sector}_check_id`])} - Giovani Rodrigues</p>
        <p class="created-at" >Em: ${call[`${sector}_check_datetime_at`]["date"]} as ${call[`${sector}_check_datetime_at`]["datetime"]} </p>
    `
}

function renderCallCard(call) {
    const card = `
                    <div class="card ${call.urgent ? "urgent" : ""} animated" id=${call.id_call}>

                    <div class="card-header" >
                        <h1 class="card-req-number" >${call.id_call}</h1>
                        <div class="card-created-header">
                            <p class="created-at" >Criado por: ${call.employee_id} - ${users.get(call.employee_id) != undefined ? users.get(call.employee_id) : "JOHN DOE"}</p>
                            <p class="created-at" >Em: ${call.created_at.date} as ${call.created_at.datetime} </p>
                        </div>
                    </div>

                    <div class="card-part">
                        <p class="card-part-description-title" >Peça: </p>
                        <p>${call.part_number}</p>
                        <p class="card-part-description-title" >Operação: </p>
                        <p>${call.operation}</p>
                        <p class="card-part-description-title">Origem: </p>
                        <p>${call.origin}</p>
                        <p class="card-part-description-title">Destino: </p>
                        <p>${call.destination}</p>
                    </div>

                    ${call.man_description && `
                        <div class="card-man ${String(call.man_check_datetime_at).startsWith("000") ? "" : "success animated"}">
                            <div class="card-man-header" >
                                <img class="man-img" src="images/wrench.png" alt="manutencao" srcset="">
                                <div class="card-man-description" >
                                    <p class="card-man-description-title">Manutenção: </p>
                                    <p class="card-man-description-text">${call.man_description}</p>
                                </div>
                                <img src="images/checked-man.png" class="checked-man-img ${String(call.man_check_datetime_at).startsWith("000") ? "" : "success animated"}" alt="manutencao">
                            </div>
                            <div class="card-man-body ${String(call.man_check_datetime_at).startsWith("000") ? "" : "success animated"}">
                                <p class="card-man-description-closed-date">Encerrado em: ${call.man_check_datetime_at.date} as ${call.man_check_datetime_at.datetime}</p>
                                <p class="card-man-description-closed-at">Por: ${call.man_check_id} - Giovani Rodrigues</p>
                            </div>
                        </div>
                    `}

                    ${call.log_description && `
                        <div class="card-log ${String(call.log_check_datetime_at).startsWith("000") ? "" : "success animated"}">
                            <div class="card-log-header" >
                                <img class="log-img" src="images/pallets.png" alt="logistica" srcset="">
                                <div class="card-log-description" >
                                    <p class="card-log-description-title">Logistica: </p>
                                    <p class="card-log-description-text">${call.log_description}</p>
                                </div>
                                <img src="images/checked-log.png" class="checked-log-img ${String(call.log_check_datetime_at).startsWith("000") ? "" : "success animated"}" alt="logistica">
                            </div>
                            <div class="card-log-body ${String(call.log_check_datetime_at).startsWith("000") ? "" : "success animated"}">
                                <p class="card-log-description-closed-date">Encerrado em: ${call.log_check_datetime_at.date} as ${call.log_check_datetime_at.datetime}</p>
                                <p class="card-log-description-closed-at">Por: ${call.log_check_id} - Giovani Rodrigues</p>
                            </div>
                        </div>
                    `}


                    ${call.eng_description && `
                        <div class="card-eng ${String(call.eng_check_datetime_at).startsWith("000") ? "" : "success animated"}">
                            <div class="card-eng-header" >
                                <img class="eng-img" src="images/distintivo.png" alt="engenharia" srcset="">
                                <div class="card-eng-description" >
                                    <p class="card-eng-description-title">Engenharia: </p>
                                    <p class="card-eng-description-text">${call.eng_description}</p>
                                </div>
                                <img src="images/checked-eng.png" class="checked-eng-img ${String(call.eng_check_datetime_at).startsWith("000") ? "" : "success animated"}" alt="engenharia">
                            </div>
                            <div class="card-eng-body ${String(call.eng_check_datetime_at).startsWith("000") ? "" : "success animated"}">
                                <p class="card-eng-description-closed-date">Encerrado em: ${call.eng_check_datetime_at.date} as ${call.eng_check_datetime_at.datetime}</p>
                                <p class="card-eng-description-closed-at">Por: ${call.eng_check_id} - Giovani Rodrigues</p>
                            </div>
                        </div>
                    `}

                    ${call.qual_description && `
                        <div class="card-qual ${String(call.qual_check_datetime_at).startsWith("000") ? "" : "success animated"}">
                            <div class="card-qual-header" >
                                <img class="qual-img" src="images/paquimetro.png" alt="qualidade" srcset="">
                                <div class="card-qual-description" >
                                    <p class="card-qual-description-title">Qualidade: </p>
                                    <p class="card-qual-description-text">${call.qual_description}</p>
                                </div>
                                <img src="images/checked-qual.png" class="checked-qual-img ${String(call.qual_check_datetime_at).startsWith("000") ? "" : "success"}" alt="qualidade">
                            </div>
                            <div class="card-qual-body ${String(call.qual_check_datetime_at).startsWith("000") ? "" : "success animated"}">
                                <p class="card-qual-description-closed-date">Encerrado em: ${call.qual_check_datetime_at.date} as ${call.qual_check_datetime_at.datetime}</p>
                                <p class="card-qual-description-closed-at">Por: ${call.qual_check_id} - Giovani Rodrigues</p>
                            </div>
                        </div>
                    `}
                    
                    </div>
                 `           
    return card

}

function renderAllCalls(data) {
    const main = document.querySelector("main")
    let content = ""
    data.forEach((card) => {
        content += renderCallCard(card)
    })
    main.innerHTML = content
}

function clearAllCAlls() {
    const main = document.querySelector("main")
    main.innerHTML = ""
}

function searchCalls(v) {
    const value = String(v).toUpperCase()
    const newList = list.filter(e => {
        return String(e.part_number).startsWith(value) || 
        String(e.id_call).startsWith(value) || 
        String(e.part_number).startsWith(value) || 
        String(e.log_description).toUpperCase().startsWith(value) || 
        String(e.man_description).toUpperCase().startsWith(value) || 
        String(e.qual_description).toUpperCase().startsWith(value) || 
        String(e.eng_description).toUpperCase().startsWith(value)

    })
    return newList
}


const listenWebSocket = () => {
    ws.onmessage = function(e) {
        let data = JSON.parse(e.data)

        if (data.event == "createCall") {
            const emptyMain = document.querySelector("main .emptyMain")
            if (emptyMain) {
                clearAllCAlls()
            }

            const callFormated = formatDateTimeOnCreate(data.call)
            list.unshift(callFormated)
            const card = renderCallCard(callFormated)
            const main = document.querySelector("main")
            main.insertAdjacentHTML("afterbegin", card)
            Notification.requestPermission().then((permission) => { 
                if (permission == "granted") {
                    new Notification("Nova requisição", { body: "Uma nova requisição numero " + data.call.id_call + " foi criada"})
                }
            });
            displaySound("./sounds/oncreate.mp3")
            return
        }

        if (data.event == "getAllCalls") {
            if (data.call == null) {
                document.querySelector("main").innerHTML = `<h1 class="emptyMain">Não há requisições no momento</h1>`
                return
            }
            list = formatDateTimeList(data.call)
            renderAllCalls(list)
            Notification.requestPermission().then((permission) => { 
                if (permission == "granted") {
                    console.log("granted")
                }
            });
            return 
        }

        if (data.event == "getCall") {
        }

        if (data.event == "updateCallQuality") {
            data.call.qual_check_datetime_at = formatDateTime(data.call.qual_check_datetime_at)
            updateCAllCard(data.call, "qual")
            const index = list.findIndex(o => o.id_call === data.call.id_call)
            list[index].qual_check_datetime_at = data.call.qual_check_datetime_at
            list[index].qual_check_id = data.call.qual_check_id
            Notification.requestPermission().then((permission) => { 
                if (permission == "granted") {
                    new Notification("Baixa", { body: "Requisição da qualidade numero " + data.call.id_call + " foi baixada"})
                }
            });
            displaySound("./sounds/onupdate.mp3")
            return
        }

        if (data.event == "updateCallEng") {
            data.call.eng_check_datetime_at = formatDateTime(data.call.eng_check_datetime_at)
            updateCAllCard(data.call, "eng")
            const index = list.findIndex(o => o.id_call === data.call.id_call)
            list[index].eng_check_datetime_at = data.call.eng_check_datetime_at
            list[index].eng_check_id = data.call.eng_check_id
            Notification.requestPermission().then((permission) => { 
                if (permission == "granted") {
                    new Notification("Baixa", { body: "Requisição da engenharia numero " + data.call.id_call + " foi baixada"})
                }
            });
            
            displaySound("./sounds/onupdate.mp3")
            return
        }

        if (data.event == "updateCallLog") {
            data.call.log_check_datetime_at = formatDateTime(data.call.log_check_datetime_at)
            updateCAllCard(data.call, "log")
            const index = list.findIndex(o => o.id_call === data.call.id_call)
            list[index].log_check_datetime_at = data.call.log_check_datetime_at
            list[index].log_check_id = data.call.log_check_id
            Notification.requestPermission().then((permission) => { 
                if (permission == "granted") {
                    new Notification("Baixa", { body: "Requisição da logística numero " + data.call.id_call + " foi baixada"})
                }
            });
            displaySound("./sounds/onupdate.mp3")
            return
        }

        if (data.event == "updateCallMan") {
            data.call.man_check_datetime_at = formatDateTime(data.call.man_check_datetime_at)
            updateCAllCard(data.call, "man")
            const index = list.findIndex(o => o.id_call === data.call.id_call)
            list[index].man_check_datetime_at = data.call.man_check_datetime_at
            list[index].man_check_id = data.call.man_check_id
            Notification.requestPermission().then((permission) => { 
                if (permission == "granted") {
                    new Notification("Baixa", { body: "Requisição da manutenção numero " + data.call.id_call + " foi baixada"})
                }
            });
            
            displaySound(".//sounds/onupdate.mp3")
            return
        }

        return
    }

    ws.onopen = () => {
        getInformationMachine()
        statusConnection = true
        if (statusConnection) {
            document.querySelector("#search").value = ""
            ws.send(JSON.stringify({event: "getAllCalls", call: { company: "" }}))
            ws.send(JSON.stringify({ event: "getConnLength"}))
            console.log('connectecd')
            listenWebSocket()
        }
    }

    ws.onerror = () => {
        statusConnection = false
        if (!statusConnection) {
            retryWebSocketConnection()
        }
    }

    ws.onclose = () => {
        console.log("disconnected")
        statusConnection = false
        ws.close()
        
    }
}

function retryWebSocketConnection() {
    const a = setInterval(() => {
        ws = new WebSocket(conn)
        ws.onopen = () => {
            statusConnection = true
            clearInterval(a)
            clearAllCAlls()
            ws.send(JSON.stringify({event: "getAllCalls", call: { company: "" }}))
            listenWebSocket()
            console.log('reconnected')
        }
    }, 3000);
}

const body = document.querySelector("body")


let time
function disconnectIdleness() {
    clearTimeout(time)
    if (!statusConnection) {
        ws = new WebSocket(conn)
        listenWebSocket()
        statusConnection = true
    }
    time = setTimeout(() => {
        ws.close(3002, "ocioso")
        window.scroll(0, 0)
        statusConnection = false
    }, 30000);
}

body.addEventListener("mousemove", () => {
    disconnectIdleness()
})

window.addEventListener("scroll", () => {
    disconnectIdleness()
})

window.addEventListener("keypress", () => {
    disconnectIdleness()
})

window.addEventListener("close", () => {
    ws.send(JSON.stringify({event: "getConnLength"}))
})



createInformationMachine()
getInformationMachine()
listenWebSocket()