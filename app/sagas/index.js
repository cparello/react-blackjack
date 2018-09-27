import 'babel-polyfill';
import { takeLatest, delay } from 'redux-saga';
import { select, put, call } from 'redux-saga/effects';
import { score } from '../lib/cards';
import { dealToDealer, determineWinner  } from '../action_creators';


const getDealerHand = (state) => state.game.get('dealerHand');
const getSpeed = (state) => state.settings.get('speed');

export function* onStand() {
    const dealSpeed = yield select(getSpeed);
    let dealerHand;
    while(true) {
        yield put(dealToDealer());
        dealerHand = yield select(getDealerHand);
        if(score(dealerHand) >= 17) {
            break;
        }
        else {
            yield call(delay, dealSpeed);
        }
    }
    yield put(determineWinner());
}

export default function*() {
    yield takeLatest('STAND', onStand);
}