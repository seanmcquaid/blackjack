// blackjack deal function
const freshDeck = createDeck();
let theDeck = freshDeck.slice();
let playerHand = [];
let dealerHand = [];
let playerPoints = 0;
let dealerPoints = 0;

$(".start-game-button").click(startGame);

function startGame(){
    $(".start-screen").css("display", "none");
    $(".container").css("display", "flex");
}

$(".next-round-button").click(nextRoundHand);
    
function nextRoundHand(){
    // reset screen back to original on each round
    playerHand = [];
    dealerHand = [];
    $(".card").html("");
    $(".result").html("");
    $(".hit-button").on("click", hitHand);
    $(".stand-button").on("click", standHand);
    $(".hit-button").css("display", "block");
    $(".stand-button").css("display", "block");
    $(".next-round-button").css("display", "none");
    shuffleDeck(theDeck);
    // we have a shuffled deck, now give the players their cards
    // get the first element off of the deck and put it in top card
    theDeck = freshDeck.slice();
    let topCard = theDeck.shift();
    // put top card in the player hand array
    playerHand.push(topCard);
    // take next card in deck
    topCard = theDeck.shift();
    dealerHand.push(topCard);

    topCard = theDeck.shift();
    playerHand.push(topCard);
    
    topCard = theDeck.shift();
    dealerHand.push(topCard);

    placeCard("Player", 1, playerHand[0]);
    placeCard("Dealer", 1, dealerHand[0]);
    placeCard("Player", 2, playerHand[1]);
    placeCard("Dealer", 2, dealerHand[1]);
    cardTotal(playerHand, "Player");
    cardTotal(dealerHand, "Dealer");
    checkBlackJack();
}

$(".deal-button").click(dealStartingHand);
    
function dealStartingHand(){
    // we need a deck!
    // we need to shuffle it!
    theDeck = freshDeck.slice()
    shuffleDeck(theDeck);
    // we have a shuffled deck, now give the players their cards
    // get the first element off of the deck and put it in top card
    let topCard = theDeck.shift();
    // put top card in the player hand array
    playerHand.push(topCard);
    // take next card in deck
    topCard = theDeck.shift();
    dealerHand.push(topCard);

    topCard = theDeck.shift();
    playerHand.push(topCard);

    topCard = theDeck.shift();
    dealerHand.push(topCard);

    placeCard("Player", 1, playerHand[0]);
    placeCard("Dealer", 1, dealerHand[0]);
    placeCard("Player", 2, playerHand[1]);
    placeCard("Dealer", 2, dealerHand[1]);
    cardTotal(playerHand, "Player");
    cardTotal(dealerHand, "Dealer");
    $(".deal-button").css("display", "none");
    checkBlackJack();
}

$(".hit-button").click(hitHand);

function hitHand(){
    const topCard = theDeck.shift();
    playerHand.push(topCard);
    placeCard("Player", playerHand.length, topCard);
    cardTotal(playerHand, "Player");
    checkBust();
}

$(".stand-button").click(standHand);
    
function standHand(){
    let dealersTotal = cardTotal(dealerHand, "Dealer");
    while (dealersTotal < 17) {
        const topCard = theDeck.shift();
        dealerHand.push(topCard);
        placeCard("Dealer", dealerHand.length, topCard);
        dealersTotal = cardTotal(dealerHand, "Dealer");
    }
    checkBust();
    checkWinner();
}

function createDeck(){
    // this is a local variable, no one will know about this but this function
    let newDeck = [];
    // card = suit letter + value
    const suits = ["c", "d", "h", "s"];
    // outer loop is for each suit
    // a for each loop takes one arg: function and that function gets two args:
    // 1. what to call this element in the loop and 2. the index loop is on
    suits.forEach((s,index) => {
        for(let c = 1; c <= 13; c++){
            newDeck.push(`${c}${s}`);
        }
    })
    return newDeck;
}

function shuffleDeck(aDeckToBeShuffled){
    // loop a lot
    // when the loop is done, the array will be shuffled
    for(let i =0; i < 100000; i++){
        let rand1 = Math.floor(Math.random() * aDeckToBeShuffled.length);
        let rand2 = Math.floor(Math.random() * aDeckToBeShuffled.length);
        // we need to switch adeckToBeShuffled[rand1] with adeckToBeShuffled[rand2]
        // but we have to save the value of one of them so we can keep it for later
        let card1Defender = aDeckToBeShuffled[rand1];
        aDeckToBeShuffled[rand1] = aDeckToBeShuffled[rand2];
        aDeckToBeShuffled[rand2] = card1Defender;
    }
}

function placeCard(who, where, what){
    // who = player/ dealer cards
    // where = option 1-6
    // what = 1h - 13h, 1s - 13s, 1d - 13d, 1c - 13c
    const classSelector = `.${who}-cards .card-${where}`;
    $(classSelector).html(`<img src="/cards/${what}.png"/>`);
}


function cardTotal(hand, who){
    // purpose:
    // 1. find out the number and return it to update the DOM with the right number for whoevers hand it is
    // 2. update the dom
    let handTotal = 0;
    let hasAce = false;
    hand.forEach((card, i)=>{
        // console.log(card);
        // copy everything in the string except for the last character
        let thisCardsValue = card.slice(0,-1);
        if(thisCardsValue > 10){
            thisCardsValue = 10;
        } else if (thisCardsValue == 1){
            thisCardsValue = 11;
            hasAce = true;
        } 
        handTotal += Number(thisCardsValue);
    })
    if (handTotal > 21 && hasAce === true){
        handTotal -= 10;
    }
    const classSelector = `.${who}-total`;
    $(classSelector).html(`${who} : ${handTotal}`);
    return handTotal
}

function checkBust(){
    const playerTotal = cardTotal(playerHand,"Player");
    const dealerTotal = cardTotal(dealerHand,"Dealer");
    let resultsMessage = $(".result")
    if(playerTotal > 21){
        stopGame();
        resultsMessage.html("Player Loses")
    } else if (dealerTotal > 21){
        stopGame();
        resultsMessage.html("Dealer Loses")
    }
}


function checkBlackJack(){
    const playerTotal = cardTotal(playerHand,"Player");
    const dealerTotal = cardTotal(dealerHand,"Dealer");
    let resultsMessage = $(".result")
    if (playerTotal === 21 && playerHand.length === 2){
        stopGame();
        resultsMessage.html("Blackjack for the Player!")
    }else if (dealerTotal === 21 & dealerHand.length === 2){
        stopGame();
        resultsMessage.html("Blackjack for the Dealer")
    }
}

function checkWinner(){
    const playerTotal = cardTotal(playerHand,"Player");
    const dealerTotal = cardTotal(dealerHand,"Dealer");
    let resultsMessage = $(".result")
    if (playerTotal > dealerTotal){
        stopGame();
        resultsMessage.html("Player wins!")
    }else if (dealerTotal > playerTotal){
        stopGame();
        resultsMessage.html("Dealer wins!")
    }else if(playerTotal === dealerTotal){
        stopGame();
        resultsMessage.html("you tied.....but the dealer wins.....NEEEERDDD")
    }
}

function stopGame(){
    // turn off all event listeners except deal next hand
    $(".hit-button").off("click");
    $(".stand-button").off("click");
    $(".hit-button").css("display", "none");
    $(".stand-button").css("display", "none");
    $(".next-round-button").css("display", "block");
}

// things to do still :
// 1) create point counter for player and dealer
// 2) create doubleDown option
// 3) create split option 
// 4) introduce "count" for the deck
// 5) have number of cards displayed
// 6) DRY UP CODE!!! 
// 7) fix dealer NOT BUSTING