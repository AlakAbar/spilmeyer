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

let debugging = false

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

    if (debugging) debugInitOverlays();
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

    if (debugging) debugUpdateOverlays();
}

function gameAtOrOverAction(event) {
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
        setTimeout(gameAtOrOverAction, 2000);
        
        currentDiceValues = randDice()
        setDiceValues(currentDiceValues)
        setDiceInfo(getHandFromDice(currentDiceValues))
        currentHand = getHandFromDice(currentDiceValues)
    }

    if (debugging) debugUpdateOverlays();
}

function gameLieAction() {
    filterLiesSelectLies(saidHand)
    toggleLieSelect()

    if (debugging) debugUpdateOverlays();
}

function gameOpenAction() {
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
        if (isBigger(currentHand, saidHand)) {
            setGameInfo(`${playerNames[previousPlayerIndex]} har over ${saidHand}`)
            decreaseCurrentPlayerHealth()
        }
        else if (currentHand == saidHand) {
            setGameInfo(`${playerNames[previousPlayerIndex]} har ${saidHand}`)
            decreaseCurrentPlayerHealth()
        }
        else {
            setGameInfo(`${playerNames[previousPlayerIndex]} har ikke dét eller derover ${saidHand}`)
            decreasePreviousPlayerHealth()
        }
        atOrOverSelected = false
    }

    // console.log(prevHand);
    // console.log(currentHand);
    // console.log(saidHand);

    saidHand = ""
    setStartingActions()

    if (debugging) debugUpdateOverlays();
}

function gameShakeAction(event) {
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
        setTimeout(gameShakeAction, 2000);
        
        currentDiceValues = randDice()
        setDiceValues(currentDiceValues)
        setDiceInfo(getHandFromDice(currentDiceValues))
        currentHand = getHandFromDice(currentDiceValues)
    }

    if (debugging) debugUpdateOverlays();
}

function gameTruthAction() {
    atOrOverSelected = false
    saidHand = currentHand
    closeCup()
    nextTurn()

    if (debugging) debugUpdateOverlays();
}

function selectLie(lieHand) {
    atOrOverSelected = false
    toggleLieSelect()
    saidHand = lieHand
    closeCup()
    nextTurn()

    if (debugging) debugUpdateOverlays();
}

function decreaseCurrentPlayerHealth() {
    if (playerLives[currentPlayerIndex] > 1) {
        if (saidHand == "Meyer") {
            playerLives[currentPlayerIndex] -= 2
        }
        else {
            playerLives[currentPlayerIndex]--
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

    if (debugging) debugUpdateOverlays();
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

    if (debugging) debugUpdateOverlays();
}

function playerWin(playerName) {
    setGameInfo(`${playerName} vinder!`)
    hideActions()

    if (debugging) debugUpdateOverlays();
}