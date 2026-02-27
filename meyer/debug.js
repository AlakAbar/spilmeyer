const debug = document.querySelector("#debug")

const debugHand = debug.querySelector("#debugHand")
const debugLife = debug.querySelector("#debugLife")
const debugCaptureConsole = debug.querySelector("#captureConsole")
const debugChangeSettings = debug.querySelector("#changeSettings")

const debugPlayerLifeLists = document.querySelectorAll(".playerLifeList")

const debugPrevHand = document.querySelectorAll(".dbgPrevHand")
const debugCurrentHand = document.querySelectorAll(".dbgCurrentHand")
const debugSaidHand = document.querySelectorAll(".dbgSaidHand")
const debugAtOrOver = document.querySelectorAll(".dbgAtOrOver")

const debugPlayerCount = debug.querySelector("#debugPlayerCount")
const debugGameCreate = debug.querySelector("#debugGameCreate")
const debugGameEnd = debug.querySelector("#debugGameEnd")

const debugOverlays = document.querySelector("#debugOverlays")
const debugHandOverlay = debugOverlays.querySelector("#debugHandOverlay")
const debugLifeOverlay = debugOverlays.querySelector("#debugLifeOverlay")

let handOverlayActive = false
let lifeOverlayActive = false

const debugCombo = ["d", "e", "b", "u", "g"]
let comboIndex = 0

debugging = true
showPopup('<button class="fancyBtn inputBtn" onclick="openLog()">Open log</button>')

// Container for debugging functions
const dbg = {};

dbg.hands = function () {
    console.group("Hands")
    console.log("Previous Hand:", prevHand);
    console.log("Current Hand:", currentHand);
    console.log("Said Hand:", saidHand);
    console.log("AtOrOver:", atOrOverSelected);
    console.groupEnd();
}

dbg.players = function () {
    console.group("Players")
    
    for (let i = 0; i < playerCount; i++) {
        if (playerNames[i] == undefined) continue;
        
        console.group(playerNames[i]);
        console.log("Index:", i);
        console.log("Lives:", playerLives[i]);
        console.groupEnd();
    }
    
    console.groupEnd()

    console.log("Current player index:", currentPlayerIndex);
    console.log("Previous player index:", previousPlayerIndex);
}

dbg.setup = function (players = 2) {
    if (players < 2) {
        console.error("Cannot make a game with under 2 players")
        return
    }

    if (gameRunning) {
        newGame()
    }

    for (const element of Array.from(playerList.children).reverse()) {
        element.remove()
    }

    for (let i = 0; i < players; i++) {
        addPlayer({name: "Spiller " + (i+1)})
    }
    
    startGame()
    updateStartGameBtn()
    disableSettingChanges()
    showActions()

    console.log(`Set up a testing game with ${players} players`);
}

function debugKeyComboHandler(event) {
    if (event.key == debugCombo[comboIndex]) {
        comboIndex++
        
        if (comboIndex == debugCombo.length) {
            comboIndex = 0
        
            toggleDebugScreen()
        }
    }

    else if (event.key == debugCombo[0]) {
        comboIndex = 1
    }

    else {
        comboIndex = 0
    }
}

addEventListener("keypress", debugKeyComboHandler)

function debugInitOverlays() {


    for (const playerLifeList of debugPlayerLifeLists) {
        playerLifeList.innerHTML = ""

        playerNames.forEach((name, index) => {
            const player = document.createElement("li")
            player.innerHTML = `<span class="playerName">${name}</span><span class="lives">${playerLives[index]}</span>`

            playerLifeList.appendChild(player)
        })
    }
}

function debugUpdateOverlays() {
    for (const prevHandDebug of debugPrevHand) {
        prevHandDebug.innerText = prevHand
    }

    for (const currentHandDebug of debugCurrentHand) {
        currentHandDebug.innerText = currentHand
    }

    for (const saidHandDebug of debugSaidHand) {
        saidHandDebug.innerText = saidHand
    }

    for (const atOrOverDebug of debugAtOrOver) {
        atOrOverDebug.innerText = atOrOverSelected
    }


    for (const playerLifeList of debugPlayerLifeLists) {
        playerLifeList.querySelectorAll(".lives").forEach((lives, index) => {
            lives.innerText = playerLives[index]
        }); 
    }
}

function debugUpdate() {
    debugUpdateOverlays()
}

// 
const methods = ['log', 'warn', 'error']
const originalConsoleMethods = {}
const consoleMessageLog = []

for (var i = 0; i < methods.length; i++)
    originalConsoleMethods[methods[i]] = console[methods[i]]

function takeOverConsole() {
    var console = window.console
    if (!console) return
    function intercept(method){
        var original = console[method]
        console[method] = function(){
            // do sneaky stuff
            if (original.apply){
                // Do this for normal browsers
                original.apply(console, arguments)

                args = Array.from(arguments)

                consoleMessageLog.push({
                    type: method,
                    message: args.join(" ")
                })
            }else{
                // Do this for IE
                var message = Array.prototype.slice.apply(arguments).join(' ')
                original(message)

                consoleMessageLog.push({
                    type: method,
                    message: message
                })
            }
        }
    }

    for (var i = 0; i < methods.length; i++)
        intercept(methods[i])
}

function releaseConsole() {
    for (var i = 0; i < methods.length; i++)
        window.console[methods[i]] = originalConsoleMethods[methods[i]]
}


function openLog() {
    var logWindow = open("./debugLog.html", "_blank")

    logWindow.addEventListener("load", () => {
        sendLogs(logWindow)
    })
}

function sendLogs(logWin) {
    for (const log of consoleMessageLog) {
        logWin.postMessage({
            level: log.type,
            message: log.message
        })  
    }
}

window.sendLogs = sendLogs

debugGameCreate.addEventListener("click", function() {dbg.setup(debugPlayerCount.value)})
debugGameEnd.addEventListener("click", newGameBtnHandler)

debugHand.addEventListener("click", toggleHandDebug)
debugLife.addEventListener("click", toggleLifeDebug)
debugCaptureConsole.addEventListener("click", function() {this.checked ? takeOverConsole() : releaseConsole()})
debugChangeSettings.addEventListener("click", function() {
    if (this.checked) {
        debugSettingsEnabled = true
        enableSettingChanges()
    }
    else if (gameRunning) {
        debugSettingsEnabled = false
        disableSettingChanges()
    }
    else {
        debugSettingsEnabled = false
    }
})