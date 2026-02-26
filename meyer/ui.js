// Settings
const maxPlayers = 25
const minPlayers = 2

const minLives = 1
const maxLives = 6

// SElements
const lifeCount = document.querySelector("#livesAmount")
const lieOnStart = document.querySelector("#lieOnStart")
const onlyOver = document.querySelector("#onlyOver")

// Elements
const settings = document.querySelector("#settings")
const openSettingsBtn = document.querySelector("#settingsIcon")
const closeSettingsBtn = settings.querySelector("#settingsClose")
const settingIssueText = settings.querySelector("#settingIssue")

const lieSelect = document.querySelector("#lieSelect")
const closeLieSelectBtn = lieSelect.querySelector("#lieSelectClose")
const lieSelectHands = lieSelect.querySelector("#hands")
const currentDiceInfo = lieSelect.querySelector("#currentDiceInfo")

const playerList = settings.querySelector(".playerList")
const playerAddBtn = settings.querySelector("#playerAdd")
const playerRemoveBtns = settings.querySelectorAll(".playerRemove")

const newGameBtn = settings.querySelector("#newGameBtn")
const startGameBtn = settings.querySelector("#startGameBtn")

const playerHealthDice = document.querySelector("#health")
const currentPlayer = document.querySelector("#currentPlayer")

const gameActions = document.querySelector("#gameActions")
const atOrOverAction = gameActions.querySelector("#atOrOverAction")
const lieAction = gameActions.querySelector("#lieAction")
const openAction = gameActions.querySelector("#openAction")
const shakeAction = gameActions.querySelector("#shakeAction")
const truthAction = gameActions.querySelector("#truthAction")

const debugMenu = debug.querySelector("#debugMenu")

const closeOnClickElements = document.querySelectorAll(".closeOnClick")

const cup = document.querySelector("#cup")

const diceBox = document.querySelector("#diceBox")
const die1 = diceBox.querySelector("#die1")
const die2 = diceBox.querySelector("#die2")
const handInfo = diceBox.querySelector("#handInfo")

const gameInfo = document.querySelector("#gameInfo")

let debugSettingsEnabled = false

// SFX
const diceRollSFX = new Audio("https://github.com/AlakAbar/spilmeyer/raw/refs/heads/main/assets/diceRollSFX.wav")

/*
Settings and setting option handlers
*/
// Game Button handlers and method (Settings buttons)
function updateStartGameBtn() {
    if (gameRunning) {
        newGameBtn.style.display = "inline-block"
        startGameBtn.innerHTML = "Tilbage til Spil"
    }
    else {
        newGameBtn.style.display = "none"
        startGameBtn.innerHTML = "Start Spil"
    }
}

function newGameBtnHandler() {
    newGame()
    enableSettingChanges()
    updateStartGameBtn()
    resetCurrentPlayer()
    hideActions()
}

function startGameBtnHandler() {
    if (gameRunning) {
        toggleSettings()
    }
    else {
        if (checkSettings()) {
            startGame()
            toggleSettings()
            disableSettingChanges()
            showActions()
        }
    }
}

newGameBtn.addEventListener("click", newGameBtnHandler)
startGameBtn.addEventListener("click", startGameBtnHandler)

// Settings Menu methods (Settings)
function checkSettings() {
    if (playerList.children.length > maxPlayers) {
        settingIssueText.innerHTML = "Så mange venner har du ikke"
        return false
    }

    else if (playerList.children.length < minPlayers) {
        settingIssueText.innerHTML = "Kræver mindst 2 spillere"
        return false
    }

    for (const playerName of getPlayers()) {
        if (playerName == "") {
            settingIssueText.innerHTML = "Hver spiller skal have et navn"
            return false
        }
    }

    settingIssueText.innerHTML = ""
    return true
}

function disableSettingChanges() {
    if (debugSettingsEnabled) return;

    lifeCount.disabled = true
    lieOnStart.disabled = true
    onlyOver.disabled = true

    settingIssueText.innerHTML = "Indstillinger kan ikke ændres mens spillet er igang"
}

function enableSettingChanges() {
    lifeCount.disabled = false
    lieOnStart.disabled = false
    onlyOver.disabled = false

    settingIssueText.innerHTML = ""
}

function toggleSettings() {
    if (settings.getAttribute("open") == "false") {
        settings.setAttribute("open", "true")
        openSettingsBtn.setAttribute("open", "true")
        updateStartGameBtn()
    }

    else {
        settings.setAttribute("open", "false")
        openSettingsBtn.setAttribute("open", "false")
    }
}

openSettingsBtn.addEventListener("click", toggleSettings)
closeSettingsBtn.addEventListener("click", toggleSettings)

// PlayerList methods (Settings setting)
function addPlayer({name = ""}) {
    if (gameRunning) {
        return
    }

    let newPlayer = document.createElement("li")
    newPlayer.classList.add("player")

    playerCount++
    newPlayer.innerHTML = `<input type="text" class="playerName fancyInput" name="playername" placeholder="Spiller navn" value="${name}"><svg class="playerRemove iconBtn" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#CCCCCC"><path d="M480-438 270-228q-9 9-21 9t-21-9q-9-9-9-21t9-21l210-210-210-210q-9-9-9-21t9-21q9-9 21-9t21 9l210 210 210-210q9-9 21-9t21 9q9 9 9 21t-9 21L522-480l210 210q9 9 9 21t-9 21q-9 9-21 9t-21-9L480-438Z"/></svg>`
    
    newPlayer.querySelector(".playerRemove").addEventListener("click", removePlayer)

    playerList.appendChild(newPlayer)
}

function removePlayer() {
    if (gameRunning) {
        return
    }

    playerList.removeChild(this.parentElement)
    playerCount--
}

playerAddBtn.addEventListener("click", addPlayer)

function getPlayers() {
    let players = []
    
    for (const player of playerList.children) {
        players.push(player.querySelector(".playerName").value)
    }
    
    return players
}

for (const removeButton of playerRemoveBtns) {
    removeButton.addEventListener("click", removePlayer)
}

// Starting Lives method (Settings setting) 
function setLifeCount() {
    if (lifeCount.value < minLives) {
        lifeCount.value = minLives
    }

    else if (lifeCount.value > maxLives) {
        lifeCount.value = maxLives
    }

    livesAmount = parseInt(lifeCount.value)
}

lifeCount.addEventListener("change", setLifeCount)

function setOnlyOver() {
    onlyOverOn = onlyOver.checked
}

onlyOver.addEventListener("change", setOnlyOver)

/*
Game UI methods
*/
// Lie Select Menu methods (Game menu) 
function toggleLieSelect() {
    if (lieSelect.getAttribute("open") == "false") {
        lieSelect.setAttribute("open", "true")
    }

    else {
        lieSelect.setAttribute("open", "false")
    }
}

closeLieSelectBtn.addEventListener("click", toggleLieSelect)

// Filter Lie Select method (Game menu)
function filterLiesSelectLies(filter) {
    let foundLieHand = false

    for (const lieHand of lieSelectHands.children) {
        if (lieHand.innerHTML == filter) {
            if (onlyOverOn) {
                lieHand.style.display = "none"
            }
            else {
                lieHand.style.display = "block"
            }
            foundLieHand = true
        }
        else if (foundLieHand) {
            lieHand.style.display = "none"
        }
        else {
            lieHand.style.display = "block"
        }
    }
}

function selectLieHandler() {
    selectLie(this.innerHTML)
}

for (const lieSelectHand of lieSelectHands.children) {
    lieSelectHand.addEventListener("click", selectLieHandler)
}

// Player Info methods (Game UI)
function setCurrentPlayerLifeDice() {
    playerHealthDice.src = `../assets/dice/${playerLives[currentPlayerIndex]}.png`
}

function setCurrentPlayer(playerName) {
    currentPlayer.innerHTML = playerName + "'s tur"
    setCurrentPlayerLifeDice()
}

function resetCurrentPlayer() {
    currentPlayer.innerHTML = ""
    playerHealthDice.src = "../assets/dice/6.png"
}

// Action methods (Game actions)
function showActions() {
    gameActions.style.display = "flex"
}

function hideActions() {
    gameActions.style.display = "none"
}

function setGivingActions() {
    atOrOverAction.style.display = "inline-block"
    lieAction.style.display = "inline-block"
    truthAction.style.display = "inline-block"
    openAction.style.display = "none"
    shakeAction.style.display = "none"
}

function setReceivingActions() {
    atOrOverAction.style.display = "none"
    lieAction.style.display = "none"
    truthAction.style.display = "none"
    openAction.style.display = "inline-block"
    shakeAction.style.display = "inline-block"
}

function setStartingGivingActions () {
    truthAction.style.display = "inline-block"
    if (lieOnStart.checked) {
        lieAction.style.display = "inline-block"
    }
    else {
        lieAction.style.display = "none"
    }

    atOrOverAction.style.display = "none"
    openAction.style.display = "none"
    shakeAction.style.display = "none"
}

function setStartingActions() {
    shakeAction.style.display = "inline-block"
    atOrOverAction.style.display = "none"
    lieAction.style.display = "none"
    openAction.style.display = "none"
    truthAction.style.display = "none"
}

function hideTruthAction() {
    truthAction.style.display = "none"
}

function hideLieAction() {
    lieAction.style.display = "none"
}

function hideOpenAction() {
    openAction.style.display = "none"
}

atOrOverAction.addEventListener("click", gameAtOrOverAction)
lieAction.addEventListener("click", gameLieAction)
openAction.addEventListener("click", gameOpenAction)
shakeAction.addEventListener("click", gameShakeAction)
truthAction.addEventListener("click", gameTruthAction)

// Cup State methods (Game UI)
function openCup() {
    cup.src = "../assets/cups/single.png"
    diceBox.style.display = "block"
}

function closeCup() {
    cup.src = "../assets/cups/closed.png"
    diceBox.style.display = "none"
}

function peekCup() {
    cup.src = "../assets/cups/semiOpen.png"
    diceBox.style.display = "block"
}

function startShake() {
    cup.setAttribute("shaking", "true");
    shaking = true
    diceRollSFX.currentTime = 0
    diceRollSFX.play()
}

function stopShake() {
    cup.setAttribute("shaking", "false");
    shaking = false
}

// Dice Value method (Game UI)
function setDiceValues(diceValues) {
    die1.src = `../assets/dice/${diceValues[0]}.png`;
    die2.src = `../assets/dice/${diceValues[1]}.png`;
}

// Dice Info method (Game UI)
function setDiceInfo(info) {
    handInfo.innerHTML = info
    currentDiceInfo.innerHTML = "Du har " + info
} 

// Game Info method (Game UI)
function setGameInfo(info) {
    gameInfo.innerHTML = info

}

function toggleDebugScreen() {
    if (debug.getAttribute("open") == "false") {
        debug.setAttribute("open", "true")
    }

    else {
        debug.setAttribute("open", "false")
    }
}

debugMenu.addEventListener("click", event => {
  event.stopPropagation()
})

function closeScreen() {
  this.setAttribute("open", "false")
}

closeOnClickElements.forEach(element => {
  element.addEventListener("click", closeScreen)
})

function toggleHandDebug() {
    if (this.checked) {

    }
    else {
        
    }
}

function toggleLifeDebug() {
    if (this.checked) {

    }
    else {
        
    }
}