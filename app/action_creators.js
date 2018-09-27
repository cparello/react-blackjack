export function setupGame(seed=new Date().getTime()) {
    return { "type": "SETUP_GAME", seed };
}

export function setRecord(wins, losses) {
    return {
        "type": "SET_RECORD",
        wins,
        losses
    };
}

export function dealToPlayer(seed=new Date().getTime()) {
    return { "type": "DEAL_TO_PLAYER", seed };
}

export function dealToDealer(seed=new Date().getTime()) {
    return { "type": "DEAL_TO_DEALER", seed };
}

export function stand() {
    return { "type": "STAND"};
}

export function determineWinner() {
    return { "type": "DETERMINE_WINNER" };
}

export function setSpeed(speed) {
    return { "type": "SET_SPEED", speed };
}