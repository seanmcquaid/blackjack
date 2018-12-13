// blackjack deal function
const freshDeck = createDeck();
let theDeck = freshDeck.slice();
let playerHand = [];
let dealerHand = [];

$(".deal-button").click(()=>{
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

    placeCard("player", 1, playerHand[0]);
    placeCard("dealer", 1, dealerHand[0]);
    placeCard("player", 2, playerHand[1]);
    placeCard("dealer", 2, dealerHand[1]);
    cardTotal(playerHand, "player");
    cardTotal(dealerHand, "dealer");

})

$(".hit-button").click(()=>{
    const topCard = theDeck.shift();
    playerHand.push(topCard);
    placeCard("player", playerHand.length, topCard);
    cardTotal(playerHand, "player");
})

$(".stand-button").click(()=>{
    let dealersTotal = cardTotal(dealerHand, "dealer");
    while (dealersTotal < 17) {
        const topCard = theDeck.shift();
        dealerHand.push(topCard);
        placeCard("dealer", dealerHand.length, topCard);
        dealersTotal = cardTotal(dealerHand, "dealer");
    }
    checkWinner();
})


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
    hand.forEach((card, i)=>{
        // console.log(card);
        // copy everything in the string except for the last character
        let thisCardsValue = card.slice(0,-1);
        if(thisCardsValue > 10){
            thisCardsValue = 10
        }
        handTotal += Number(thisCardsValue);
    })
    const classSelector = `.${who}-total`;
    $(classSelector).html(handTotal);
    return handTotal
}

function checkWinner(){

}