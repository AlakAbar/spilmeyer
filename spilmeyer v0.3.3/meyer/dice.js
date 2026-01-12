function getHandFromDice(diceValues) {
    let die1 = diceValues[0]
    let die2 = diceValues[1]

    if (die1 == die2) {
        // Par
        return "Par " + die1;
    }
    else if (die1 + die2 < 5) {
        // Meyer eller Lille Meyer
        if (die1 + die2 == 3) {
            // Meyer
            return "Meyer";
        }
        else {
            // Lille Meyer
            return "Lille Meyer";
        }
    }
    else {
        // Tal
        if (die1 > die2) {
            // Terning 1 er størst og først
            return `${die1}${die2}`;
        }
        else {
            // Terning 2 er størst og først
            return `${die2}${die1}`;
        }
    }
}

function randDice() {
    die1Value = Math.floor(Math.random()*6) + 1;
    die2Value = Math.floor(Math.random()*6) + 1;

    return [die1Value, die2Value];
}

const allPossibleRolls = [
    "Meyer",
    "Lille Meyer",
    "Par 6",
    "Par 5",
    "Par 4",
    "Par 3",
    "Par 2",
    "Par 1",
    "65",
    "64",
    "63",
    "62",
    "61",
    "54",
    "53",
    "52",
    "51",
    "43",
    "42",
    "41",
    "32"
]

function isBigger(hand, than) {
    if (than == "") {
        return true
    }

    handIndex = allPossibleRolls.indexOf(hand)
    thanIndex = allPossibleRolls.indexOf(than)

    if (handIndex < thanIndex) {
        return true
    }
    else {
        return false
    }
}