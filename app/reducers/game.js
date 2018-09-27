import { Map } from 'immutable';
import { newDeck, deal, score } from '../lib/cards';

const setupGame = (currentState, seed) => {
    let deck = newDeck(seed);
    let playerHand, dealerHand;

    [deck, playerHand] = deal(deck, 2, seed);
    [deck, dealerHand] = deal(deck, 1, seed + 1);

    dealerHand = dealerHand.push(new Map());

    const hasStood = false;
    let gameOver = false;
    let playerWon = undefined;
    let winCount = currentState.get('winCount') || 0;


    if(score(playerHand) == 21) {
        gameOver = true;
        playerWon = true;
        winCount += 1;

    }
    const newState = new Map({
        deck, playerHand,
        dealerHand, hasStood,
        gameOver, playerWon,
        winCount
    });
    return currentState.merge(newState);
};

const setRecord = (currentState, wins, losses) => {
    return currentState.merge(new Map({ "winCount": wins, "lossCount": losses }));
}

const dealToPlayer = (currentState, seed) => {
    const [deck, newCard] = deal(currentState.get('deck'), 1, seed);

    const playerHand = currentState.get('playerHand').push(newCard.get(0));

    let newState = new Map({ deck, playerHand });

    const newScore = score(playerHand);

    if(newScore > 21) {
        const lossCount = currentState.get('lossCount') + 1;
        const gameOver = true;
        const playerWon = false;
        newState = newState.merge({lossCount, gameOver, playerWon});
    }

    return currentState.merge(newState);
};
const stand = (currentState, seed) => {
    let dealerHand = currentState.get('dealerHand');

    dealerHand = dealerHand.filter(
        (element) => element != new Map()
    );

    let newState = new Map({
        "hasStood": true,
        "dealerHand": dealerHand
    });

    return currentState.merge(newState);
};

const determineWinner = (currentState) => {
    const dealerHand = currentState.get('dealerHand');
    const playerHand = currentState.get('playerHand');
    let winCount = currentState.get('winCount');
    let lossCount = currentState.get('lossCount');

    const playerScore = score(playerHand);
    const dealerScore = score(dealerHand);
    let playerWon = undefined;

    if(playerScore > dealerScore || dealerScore > 21) {
        winCount += 1;
        playerWon = true;
    } else if(dealerScore > playerScore) {
        lossCount += 1;
        playerWon = false;
    }

    const gameOver = true;

    const newState = new Map({
        dealerHand, winCount, lossCount,
        gameOver, playerWon
    });

    return currentState.merge(newState);
};


const dealToDealer = (currentState, seed) => {
    const [deck, newCard] = deal(
        currentState.get('deck'), 1, seed
    );

    const dealerHand = currentState
        .get('dealerHand').push(newCard.get(0));

    return currentState.merge(new Map({ deck, dealerHand }));
};

export default function(currentState=new Map(), action) {
    switch(action.type) {
        case 'SETUP_GAME':
            return setupGame(currentState, action.seed);
        case 'SET_RECORD':
            return setRecord(currentState, action.wins, action.losses);
        case 'DEAL_TO_PLAYER':
            return dealToPlayer(currentState, action.seed);
        case 'STAND':
            return stand(currentState);
        case 'DEAL_TO_DEALER':
            return dealToDealer(currentState, action.seed);
        case 'DETERMINE_WINNER':
            return determineWinner(currentState);
    }
    return currentState;
}