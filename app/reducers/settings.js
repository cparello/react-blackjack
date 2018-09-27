import { Map } from 'immutable';

const setSpeed = (currentState, newSpeed) => {
    return currentState.set('speed', newSpeed);
};

export default function(currentState=new Map(), action) {
    switch(action.type) {
        case 'SET_SPEED':
            return setSpeed(currentState, action.speed);
    }
    return currentState;
}