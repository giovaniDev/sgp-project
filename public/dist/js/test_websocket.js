

var remote = "wss://sgp-project.onrender.com"
var local = "ws://192.168.1.15:3000"

var conn = remote + `/ws?machine="ad123"&company="industria`

var ws = new WebSocket(conn)

let list = []

let users = new Map()

users.set(2477, "Giovani Rodrgues")
users.set(2709, "Rafael")

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

const listenWebSocket = () => {
    ws.onmessage = function(e) {
        let data = JSON.parse(e.data)

        if (data.event == "updateCallQuality") {
            console.log(data.call.id_call + " " + data.event + " baixado")
            displaySound("./sounds/onupdate.mp3")
        }

        if (data.event == "updateCallEng") {
            console.log(data.call.id_call + " " + data.event + " baixado")
            displaySound("./sounds/onupdate.mp3")
        }

        if (data.event == "updateCallLog") {
            console.log(data.call.id_call + " " + data.event + " baixado")
            displaySound("./sounds/onupdate.mp3")
        }

        if (data.event == "updateCallMan") {
            console.log(data.call.id_call + " " + data.event + " baixado")
            displaySound(".//sounds/onupdate.mp3")
        }

        return
    }

    ws.onopen = () => {
        getInformationMachine()
        if (statusConnection) {
            console.log('connectecd')
            listenWebSocket()
        }
    }

    ws.onerror = () => {
        if (statusConnection) {
            retryWebSocketConnection()
        }
    }

    ws.onclose = () => {
        ws.close(3001, "Fechando navegador!")
        retryWebSocketConnection()
        console.log('disconnected')
    }

}

function retryWebSocketConnection() {
    const a = setInterval(() => {
        ws = new WebSocket(conn)
        ws.onopen = () => {
            clearInterval(a)
            clearAllCAlls()
            ws.send(JSON.stringify({event: "getAllCalls", call: { company: "" }}))
            listenWebSocket()
            console.log('reconnected')
        }
    }, 3000);
}

createInformationMachine()
getInformationMachine()

listenWebSocket()