let gameRunning = false
let livesAmount = 6
let onlyOverOn = false

let playerNames = [];
let playerLives = [];
let playerCount = 2;
let currentPlayerIndex = 0;
let previousPlayerIndex = 0;

let shaking = false;
let atOrOverSelected = false;

let currentDiceValues = [];
let currentHand = "";
let saidHand = "";
let prevHand = "";

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

    for (const element of Array.from(playerList.children).reverse()) {
        element.remove()
    }

    for (let i = 0; i < players; i++) {
        addPlayer({name: "Spiller " + (i+1)})
    }
    
    startGame()
    updateStartGameBtn()
    // disableSettingChanges()
    showActions()

    console.log(`Set up a testing game with ${players} players`);
}

function newGame() {
    gameRunning = false
    setGameInfo("Set spil op i indstillingerne")
    closeCup()
}

function startGame() {
    // Reset things that maybe could break something else 
    playerLives = []
    currentPlayerIndex = 0

    currentDiceValues = []
    currentHand = ""
    saidHand = ""
    prevHand = ""
    atOrOverSelected = false

    gameRunning = true
    setGameInfo("")

    playerNames = getPlayers()
    playerCount = playerNames.length
    for (let i = 0; i < playerCount; i++) {
        playerLives.push(livesAmount)
    }
    
    setCurrentPlayer(playerNames[currentPlayerIndex])
    setStartingActions()
}

function nextTurn() {
    previousPlayerIndex = currentPlayerIndex
    currentPlayerIndex++

    if (currentPlayerIndex >= playerCount) {
        currentPlayerIndex = 0
    }

    setCurrentPlayer(playerNames[currentPlayerIndex])
    setReceivingActions()
    
    if (atOrOverSelected) {
        setGameInfo(playerNames[previousPlayerIndex] + " siger: Dét eller derover " + saidHand) // maybe .toLowerCase() on saidHand
    }
    else {
        setGameInfo(playerNames[previousPlayerIndex] + " siger: " + saidHand) // maybe .toLowerCase() on saidHand
    }
}

function atOrOver(event) {
    setGameInfo("")

    
    if (event == undefined) {
        stopShake()
        atOrOverSelected = true
        nextTurn()
    }
    else {
        if (shaking) {
            return
        }
        
        closeCup()
        startShake()
        setTimeout(atOrOver, 2000);
        
        currentDiceValues = randDice()

        if (!atOrOverSelected) {
            saidHand = prevHand
        }
        
        setDiceValues(currentDiceValues)
        setDiceInfo(getHandFromDice(currentDiceValues))
    }
}

function lie() {
    filterLiesSelectLies(saidHand)
    toggleLieSelect()
}

function open() {
    openCup()
    hideOpenAction()
    
    if (!atOrOverSelected) {
        if (saidHand == currentHand) {
            setGameInfo(`${playerNames[previousPlayerIndex]} har ${saidHand}`)
            decreaseCurrentPlayerHealth()
        }
        else {
            setGameInfo(`${playerNames[previousPlayerIndex]} har ikke ${saidHand}`)
            decreasePreviousPlayerHealth()
        }
    }
    else {
        if (isBigger(saidHand, prevHand)) {
            setGameInfo(`${playerNames[previousPlayerIndex]} har over ${saidHand}`)
            decreaseCurrentPlayerHealth()
        }
        else if (saidHand == prevHand) {
            setGameInfo(`${playerNames[previousPlayerIndex]} har ${saidHand}`)
            decreaseCurrentPlayerHealth()
        }
        else {
            setGameInfo(`${playerNames[previousPlayerIndex]} har ikke der eller derover ${saidHand}`)
            decreasePreviousPlayerHealth()
        }
        atOrOverSelected = false
    }

    // console.log(prevHand);
    // console.log(currentHand);
    // console.log(saidHand);
    
    

    saidHand = ""
    setStartingActions()
}

function shake(event) {
    setGameInfo("")
    
    if (event == undefined) {
        stopShake()
        peekCup()
        if (saidHand == "") {
            setStartingGivingActions()
        }
        else {
            setGivingActions()
            if (!isBigger(getHandFromDice(currentDiceValues), saidHand)) {
                if (onlyOverOn) {
                    hideTruthAction()
                }
                else if (getHandFromDice(currentDiceValues) != saidHand) {
                    hideTruthAction()
                }
            }
            if (saidHand == "Meyer" && onlyOverOn) {
                hideLieAction()
            }
        }
    }
    else {
        if (shaking) {
            return
        }
        
        prevHand = currentHand

        closeCup()
        startShake()
        setTimeout(shake, 2000);
        
        currentDiceValues = randDice()
        setDiceValues(currentDiceValues)
        setDiceInfo(getHandFromDice(currentDiceValues))
        currentHand = getHandFromDice(currentDiceValues)
    }
}

function truth() {
    atOrOverSelected = false
    saidHand = getHandFromDice(currentDiceValues)
    closeCup()
    nextTurn()
}

function selectLie(lieHand) {
    atOrOverSelected = false
    toggleLieSelect()
    saidHand = lieHand
    closeCup()
    nextTurn()
}

function decreaseCurrentPlayerHealth() {
    if (playerLives[currentPlayerIndex] > 1) {
        if (saidHand == "Meyer") {
            playerLives[previousPlayerIndex] -= 2
        }
        else {
            playerLives[previousPlayerIndex]--
        }
        setCurrentPlayerLifeDice()
    }
    else {
        setGameInfo(playerNames[currentPlayerIndex] + " er død")
        playerNames.splice(currentPlayerIndex, 1)
        playerLives.splice(currentPlayerIndex, 1)
        playerCount--

        if (currentPlayerIndex == playerCount) {
            currentPlayerIndex = 0
        }
        
        if (playerCount == 1) {
            playerWin(playerNames[0])
            return
        }
       
        console.log(currentPlayerIndex);
        console.log(playerNames);
        console.log(playerLives);
        
        setCurrentPlayer(playerNames[currentPlayerIndex])
        setStartingActions()
    }
}

function decreasePreviousPlayerHealth() {
    if (playerLives[previousPlayerIndex] > 1) {
        if (saidHand == "Meyer") {
            playerLives[previousPlayerIndex] -= 2
        }
        else {
            playerLives[previousPlayerIndex]--
        }
    }
    else {
        setGameInfo(playerNames[previousPlayerIndex] + " er død")
        playerNames.splice(previousPlayerIndex, 1)
        playerLives.splice(previousPlayerIndex, 1)
        playerCount--

        if (currentPlayerIndex == playerCount) {
            currentPlayerIndex = 0
        }

        if (playerCount == 1) {
            playerWin(playerNames[0])
        }
    }
}

function playerWin(playerName) {
    setGameInfo(`${playerName} vinder!`)
    hideActions()
}