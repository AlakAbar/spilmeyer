const cup = document.querySelector("#cup");
const dice = document.querySelector("#dice");
const die1 = document.querySelector("#die1");
const die2 = document.querySelector("#die2");
const info = document.querySelector("#info")
const health = document.querySelector("#health");
const advRandSortsInput = document.querySelector("#advRandSorts");
let randMethod = randDice;
let reset = false;
let debug = false;
let shaking = false;

let AdvRandMaxSorts = 1

const AdvRandAllRolls = [
    21,
    31,
    66,
    55,
    44,
    33,
    22,
    11,
    65,
    64,
    63,
    62,
    61,
    54,
    53,
    52,
    51,
    43,
    42,
    41,
    32
]

function getHandFromDice(die1, die2) {
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

function advRand() {
    index = Math.floor(Math.random() * 21);
    sorts = Math.round(Math.random() * AdvRandMaxSorts);

    if (debug) {
        before = [];

        AdvRandAllRolls.forEach(element => {
            before.push(element);
        });
    }

    for (let i = 0; i < sorts; i++) {
        AdvRandAllRolls.sort(function(){return 0.5 - Math.random()});
    }

    num = AdvRandAllRolls[index];

    if (debug) {
        console.log(`Advanced Random Debug:\nIndex: ${index}\nRandom Sorts: ${sorts}\nBefore Array: ${before}\nAfter Array:  ${AdvRandAllRolls}\nFinal Value: ${num}`);
    }

    return num;
}

function advRandDice() {
    randValue = advRand().toString();

    die1Value = parseInt(randValue[0]);
    die2Value = parseInt(randValue[1]);
    
    return [die1Value, die2Value];
}

function randDice() {
    die1Value = Math.floor(Math.random()*6) + 1;
    die2Value = Math.floor(Math.random()*6) + 1;

    if (debug) {
        console.log(`Normal Random Debug:\nGot: ${die1Value} and ${die2Value}`)
    }

    return [die1Value, die2Value];
}

function løgn() {
    if (shaking) {
      return;
    }
  
    index = health.src.search(/dice(\d)/g);
    healthPoints = health.src[index + 4];

    if (healthPoints - 1 == 0) {
        info.innerHTML = "Du tabte";
        health.src = "";
        reset = true;
    }

    else {
        health.src = `./assets/dice/${healthPoints - 1}.png`;
    }
}

function kast(step = 0) {
    if (reset) {
        health.src = "./assets/dice/6.png";
        info.innerHTML = "";
        reset = false;
    }

    switch (step) {
        case 0:
            if (shaking) {
                return;
            }
            dice.style.display = "none";
            cup.src = "./assets/cups/closed.png";
            setTimeout(()=>{kast(1)}, 2000);
            cup.setAttribute("shaking", "true");
            shaking = true;
            break;

        case 1:
            randomDiceValues = randMethod();

            if (debug) {
                console.log(randomDiceValues);
            }

            die1Value = randomDiceValues[0];
            die2Value = randomDiceValues[1];
            cup.setAttribute("shaking", "false");
            shaking = false;
            cup.src = "./assets/cups/semiOpen.png";
            die1.src = `./assets/dice/${die1Value}.png`;
            die2.src = `./assets/dice/${die2Value}.png`;
            dice.style.display = "inline";
            info.innerHTML = getHandFromDice(die1Value, die2Value);
            break;

        default:
            console.error("Fckn ell man");
            break;
    }
}

function changeRand(element) {
    if (element.checked) {
        randMethod = advRandDice;
        advRandSortsInput.disabled = false;
        if (debug) {
            console.log("Now using advanced random");
        }
    }
    else {
        randMethod = randDice;
        advRandSortsInput.disabled = true;
        if (debug) {
            console.log("Now using normal random");
        }
    }
}

function changeMaxSortCount(element) {
    AdvRandMaxSorts = element.value
    if (debug) {
        console.log("Max advanced random sorts is now: " + AdvRandMaxSorts);
    }
}

function changeDebugging(element) {
    if (element.checked) {
        debug = true;
        console.log("Debug logs are now enabled");
    }
    else {
        debug = false;
        console.log("Debug logs are now disabled");
    }
}